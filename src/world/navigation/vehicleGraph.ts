export interface LaneWaypoint {
  x: number;
  y: number;
  z: number;
}

export type TurnType = 'straight' | 'left' | 'right' | 'road-lane';

export interface VehicleLane {
  id: string;
  roadId?: string;
  intersectionId?: string;
  turnType: TurnType;
  direction: 'north' | 'south' | 'east' | 'west' | 'turn';
  start: LaneWaypoint;
  end: LaneWaypoint;
  waypoints: LaneWaypoint[];
  length: number;
  speedLimit: number; // km/h
  incomingLanes: string[];
  outgoingLanes: string[];
}

export interface VehicleNavigationGraph {
  lanes: Map<string, VehicleLane>;
  laneArray: VehicleLane[];
  intersections: Map<string, { id: string; center: [number, number]; connectedLanes: string[] }>;
}

/**
 * Evaluates a cubic Bézier curve at parameter t in [0, 1]
 */
export function evaluateCubicBezier(
  p0: LaneWaypoint,
  p1: LaneWaypoint,
  p2: LaneWaypoint,
  p3: LaneWaypoint,
  t: number
): LaneWaypoint {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
    z: uuu * p0.z + 3 * uu * t * p1.z + 3 * u * tt * p2.z + ttt * p3.z,
  };
}

/**
 * Generates discrete waypoints along a cubic Bézier curve
 */
export function sampleCubicBezier(
  p0: LaneWaypoint,
  p1: LaneWaypoint,
  p2: LaneWaypoint,
  p3: LaneWaypoint,
  segments: number = 8
): LaneWaypoint[] {
  const points: LaneWaypoint[] = [];
  for (let i = 0; i <= segments; i++) {
    points.push(evaluateCubicBezier(p0, p1, p2, p3, i / segments));
  }
  return points;
}

/**
 * Computes cumulative distance along an array of waypoints
 */
export function computeWaypointsLength(waypoints: LaneWaypoint[]): number {
  let len = 0;
  for (let i = 1; i < waypoints.length; i++) {
    const dx = waypoints[i].x - waypoints[i - 1].x;
    const dy = waypoints[i].y - waypoints[i - 1].y;
    const dz = waypoints[i].z - waypoints[i - 1].z;
    len += Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  return len;
}

/**
 * A* Pathfinding across the vehicle lane graph
 */
export function findVehicleRoute(
  graph: VehicleNavigationGraph,
  startLaneId: string,
  targetLaneId: string
): { laneIds: string[]; waypoints: LaneWaypoint[]; totalDistance: number } | null {
  const startLane = graph.lanes.get(startLaneId);
  const targetLane = graph.lanes.get(targetLaneId);

  if (!startLane || !targetLane) return null;
  if (startLaneId === targetLaneId) {
    return {
      laneIds: [startLaneId],
      waypoints: [...startLane.waypoints],
      totalDistance: startLane.length,
    };
  }

  // Priority queue / frontier for A*
  const openSet = new Set<string>([startLaneId]);
  const cameFrom = new Map<string, string>();

  const gScore = new Map<string, number>();
  gScore.set(startLaneId, 0);

  const fScore = new Map<string, number>();
  const heuristic = (lane: VehicleLane): number => {
    const dx = targetLane.end.x - lane.end.x;
    const dz = targetLane.end.z - lane.end.z;
    return Math.sqrt(dx * dx + dz * dz);
  };
  fScore.set(startLaneId, heuristic(startLane));

  while (openSet.size > 0) {
    // Find node in openSet with lowest fScore
    let currentId = '';
    let lowestF = Infinity;
    for (const id of openSet) {
      const f = fScore.get(id) ?? Infinity;
      if (f < lowestF) {
        lowestF = f;
        currentId = id;
      }
    }

    if (currentId === targetLaneId) {
      // Reconstruct path
      const pathLaneIds: string[] = [currentId];
      let curr = currentId;
      while (cameFrom.has(curr)) {
        curr = cameFrom.get(curr)!;
        pathLaneIds.unshift(curr);
      }

      // Concatenate waypoints
      const allWaypoints: LaneWaypoint[] = [];
      let totalDist = 0;
      for (const id of pathLaneIds) {
        const lane = graph.lanes.get(id)!;
        totalDist += lane.length;
        if (allWaypoints.length > 0) {
          // Avoid duplicating identical adjacent endpoint
          allWaypoints.push(...lane.waypoints.slice(1));
        } else {
          allWaypoints.push(...lane.waypoints);
        }
      }

      return { laneIds: pathLaneIds, waypoints: allWaypoints, totalDistance: totalDist };
    }

    openSet.delete(currentId);
    const currentLane = graph.lanes.get(currentId)!;
    const currentG = gScore.get(currentId) ?? Infinity;

    for (const neighborId of currentLane.outgoingLanes) {
      const neighbor = graph.lanes.get(neighborId);
      if (!neighbor) continue;

      const tentativeG = currentG + neighbor.length;
      if (tentativeG < (gScore.get(neighborId) ?? Infinity)) {
        cameFrom.set(neighborId, currentId);
        gScore.set(neighborId, tentativeG);
        fScore.set(neighborId, tentativeG + heuristic(neighbor));
        openSet.add(neighborId);
      }
    }
  }

  // No path found
  return null;
}

/**
 * Generates an endless circulation route through multiple city blocks
 */
export function generateCirculationRoute(
  graph: VehicleNavigationGraph,
  startLaneId: string,
  targetSteps: number = 24
): { laneIds: string[]; waypoints: LaneWaypoint[] } {
  const path: string[] = [startLaneId];
  let current = graph.lanes.get(startLaneId);

  for (let i = 0; i < targetSteps && current; i++) {
    if (!current.outgoingLanes || current.outgoingLanes.length === 0) break;
    // Choose next lane, prioritizing avoiding U-turns / immediate reversals
    const candidates = current.outgoingLanes;
    const nextId = candidates[Math.floor(Math.random() * candidates.length)];
    path.push(nextId);
    current = graph.lanes.get(nextId);
  }

  const allWaypoints: LaneWaypoint[] = [];
  for (const id of path) {
    const lane = graph.lanes.get(id);
    if (!lane) continue;
    if (allWaypoints.length > 0) {
      allWaypoints.push(...lane.waypoints.slice(1));
    } else {
      allWaypoints.push(...lane.waypoints);
    }
  }

  return { laneIds: path, waypoints: allWaypoints };
}


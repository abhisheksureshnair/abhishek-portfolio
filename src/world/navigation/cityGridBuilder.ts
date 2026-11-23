import {
  VehicleLane,
  VehicleNavigationGraph,
  TurnType,
  sampleCubicBezier,
  computeWaypointsLength,
  LaneWaypoint,
} from './vehicleGraph';
import { CITY_CONFIG } from '../config/cityConfig';

export interface GridDimensions {
  avenueXs: number[];   // North-South Avenues X-coordinates
  streetZs: number[];   // East-West Streets Z-coordinates
  roadWidth: number;    // Width of standard 2-way road (meters)
  laneOffset: number;   // Distance from road centerline to lane center (meters)
  elevation: number;    // Y elevation for lane centerlines
}

export interface CityBlockData {
  id: string;
  name: string;
  gridRow: number;
  gridCol: number;
  center: [number, number]; // [x, z]
  dimensions: [number, number]; // [width, depth]
  isProtectedDistrict: boolean;
  buildableArea: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  sidewalkBoundary: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  reservedPlot?: {
    id: string;
    title: string;
    subtitle: string;
    category: string;
    color: string;
  };
}

export interface GridIntersectionData {
  id: string;
  name: string;
  gridRow: number;
  gridCol: number;
  center: [number, number]; // [x, z]
  width: number;
  length: number;
  type: '4-way' | 'T-junction' | 'corner';
  connectedRoads: string[];
  trafficSignalPositions: [number, number][];
}

export interface GridRoadData {
  id: string;
  name: string;
  start: [number, number];
  end: [number, number];
  width: number;
  length: number;
  orientation: 'horizontal' | 'vertical';
  lanes: number;
  fromIntersectionId: string;
  toIntersectionId: string;
}

export interface FullCityRoadNetwork {
  config: GridDimensions;
  intersections: GridIntersectionData[];
  roads: GridRoadData[];
  blocks: CityBlockData[];
  vehicleGraph: VehicleNavigationGraph;
}

// Zone A: The 4x4 Central Playable Grid (16 Intersections, 24 Roads, 9 Blocks, 152 Vehicle Lanes)
export const DEFAULT_US_GRID_CONFIG: GridDimensions = {
  avenueXs: CITY_CONFIG.playableArea.avenueXs, // [-60, -20, 20, 60]
  streetZs: CITY_CONFIG.playableArea.streetZs, // [-60, -20, 20, 60]
  roadWidth: CITY_CONFIG.playableArea.roadWidth, // 10.0m
  laneOffset: CITY_CONFIG.playableArea.laneOffset, // 2.3m
  elevation: 0.04,
};

// District assignments for the 9 central portfolio blocks
const DISTRICT_ASSIGNMENTS: Record<string, { id: string; title: string; subtitle: string; category: string; color: string }> = {
  'block-0-0': {
    id: 'central-plaza',
    title: 'NORTHWEST CIVIC PLAZA',
    subtitle: 'Urban Commons, Fountains & Gardens',
    category: 'Civic Commons // West',
    color: '#eab308',
  },
  'block-0-1': {
    id: 'about',
    title: 'ABOUT STUDIO',
    subtitle: 'Developer Philosophy & Craftsmanship',
    category: 'District 02 // Creative Studio',
    color: '#f97316',
  },
  'block-0-2': {
    id: 'projects',
    title: 'INNOVATION CENTER',
    subtitle: 'Interactive Software Engineering Hub',
    category: 'District 03 // Projects Showcase',
    color: '#a855f7',
  },
  'block-1-0': {
    id: 'skills',
    title: 'SKILLS TECH TOWER',
    subtitle: 'Full-Stack Technical Monolith',
    category: 'District 04 // Engineering Tower',
    color: '#10b981',
  },
  'block-1-1': {
    id: 'hq',
    title: 'HERO HEADQUARTERS',
    subtitle: 'Signature Technology Campus & Full-Stack Citadel',
    category: 'District 01 // Executive Citadel',
    color: '#06b6d4',
  },
  'block-1-2': {
    id: 'career',
    title: 'CAREER & EXPERIENCE',
    subtitle: 'Production Enterprise Milestones',
    category: 'District 05 // Corporate Office',
    color: '#ec4899',
  },
  'block-2-0': {
    id: 'contact',
    title: 'CONTACT TRANSMISSION',
    subtitle: 'Direct Communication & Resume Terminal',
    category: 'District 06 // Telemetry Station',
    color: '#38bdf8',
  },
  'block-2-1': {
    id: 'ai-lab',
    title: 'AI RESEARCH ANNEX',
    subtitle: 'Neural Intelligence Research',
    category: 'Future Expansion // Plot A',
    color: '#6366f1',
  },
  'block-2-2': {
    id: 'cloud-nexus',
    title: 'CLOUD & SYSTEMS ENGINEERING HUB',
    subtitle: 'High-Availability Infrastructure & Microservices',
    category: 'District 08 // Cloud Hub',
    color: '#00f0ff',
  },
};

/**
 * Builds the complete connected Playable District Road Network
 */
export function buildCityRoadNetwork(config: GridDimensions = DEFAULT_US_GRID_CONFIG): FullCityRoadNetwork {
  const { avenueXs, streetZs, roadWidth, laneOffset, elevation } = config;
  const halfRoad = roadWidth / 2;

  const intersections: GridIntersectionData[] = [];
  const roads: GridRoadData[] = [];
  const blocks: CityBlockData[] = [];
  const lanes = new Map<string, VehicleLane>();
  const intersectionMap = new Map<string, { id: string; center: [number, number]; connectedLanes: string[] }>();

  const registerLane = (lane: VehicleLane) => {
    lanes.set(lane.id, lane);
  };

  // 1. Generate Intersections (4x4 = 16)
  for (let r = 0; r < streetZs.length; r++) {
    for (let c = 0; c < avenueXs.length; c++) {
      const id = `int-${r}-${c}`;
      const cx = avenueXs[c];
      const cz = streetZs[r];

      const isTop = r === 0;
      const isBottom = r === streetZs.length - 1;
      const isLeft = c === 0;
      const isRight = c === avenueXs.length - 1;

      let type: '4-way' | 'T-junction' | 'corner' = '4-way';
      if ((isTop || isBottom) && (isLeft || isRight)) {
        type = 'corner';
      } else if (isTop || isBottom || isLeft || isRight) {
        type = 'T-junction';
      }

      const sigOffset = halfRoad + 1.2;
      const trafficSignalPositions: [number, number][] = [
        [cx - sigOffset, cz - sigOffset],
        [cx + sigOffset, cz - sigOffset],
        [cx + sigOffset, cz + sigOffset],
        [cx - sigOffset, cz + sigOffset],
      ];

      const interData: GridIntersectionData = {
        id,
        name: `Junction ${r + 1}×${c + 1} (${cx}m, ${cz}m)`,
        gridRow: r,
        gridCol: c,
        center: [cx, cz],
        width: roadWidth,
        length: roadWidth,
        type,
        connectedRoads: [],
        trafficSignalPositions,
      };

      intersections.push(interData);
      intersectionMap.set(id, { id, center: [cx, cz], connectedLanes: [] });
    }
  }

  // 2. Generate Horizontal Roads (East-West) & Lanes
  for (let r = 0; r < streetZs.length; r++) {
    for (let c = 0; c < avenueXs.length - 1; c++) {
      const roadId = `road-h-${r}-${c}`;
      const intFrom = `int-${r}-${c}`;
      const intTo = `int-${r}-${c + 1}`;

      const startX = avenueXs[c] + halfRoad;
      const endX = avenueXs[c + 1] - halfRoad;
      const z = streetZs[r];
      const len = endX - startX;

      roads.push({
        id: roadId,
        name: `Street ${r + 1} Segment ${c + 1}`,
        start: [startX, z],
        end: [endX, z],
        width: roadWidth,
        length: len,
        orientation: 'horizontal',
        lanes: 2,
        fromIntersectionId: intFrom,
        toIntersectionId: intTo,
      });

      // Eastbound Lane (RHT: right side, towards +X, offset south (+Z))
      const ebLaneId = `lane-${roadId}-eb`;
      const ebStart: LaneWaypoint = { x: startX, y: elevation, z: z + laneOffset };
      const ebEnd: LaneWaypoint = { x: endX, y: elevation, z: z + laneOffset };
      registerLane({
        id: ebLaneId,
        roadId,
        turnType: 'road-lane',
        direction: 'east',
        start: ebStart,
        end: ebEnd,
        waypoints: [ebStart, ebEnd],
        length: len,
        speedLimit: 50,
        incomingLanes: [],
        outgoingLanes: [],
      });

      // Westbound Lane (RHT: right side, towards -X, offset north (-Z))
      const wbLaneId = `lane-${roadId}-wb`;
      const wbStart: LaneWaypoint = { x: endX, y: elevation, z: z - laneOffset };
      const wbEnd: LaneWaypoint = { x: startX, y: elevation, z: z - laneOffset };
      registerLane({
        id: wbLaneId,
        roadId,
        turnType: 'road-lane',
        direction: 'west',
        start: wbStart,
        end: wbEnd,
        waypoints: [wbStart, wbEnd],
        length: len,
        speedLimit: 50,
        incomingLanes: [],
        outgoingLanes: [],
      });
    }
  }

  // 3. Generate Vertical Roads (North-South) & Lanes
  for (let c = 0; c < avenueXs.length; c++) {
    for (let r = 0; r < streetZs.length - 1; r++) {
      const roadId = `road-v-${r}-${c}`;
      const intFrom = `int-${r}-${c}`;
      const intTo = `int-${r + 1}-${c}`;

      const x = avenueXs[c];
      const startZ = streetZs[r] + halfRoad;
      const endZ = streetZs[r + 1] - halfRoad;
      const len = endZ - startZ;

      roads.push({
        id: roadId,
        name: `Avenue ${c + 1} Segment ${r + 1}`,
        start: [x, startZ],
        end: [x, endZ],
        width: roadWidth,
        length: len,
        orientation: 'vertical',
        lanes: 2,
        fromIntersectionId: intFrom,
        toIntersectionId: intTo,
      });

      // Southbound Lane (RHT: right side, towards +Z, offset west (-X))
      const sbLaneId = `lane-${roadId}-sb`;
      const sbStart: LaneWaypoint = { x: x - laneOffset, y: elevation, z: startZ };
      const sbEnd: LaneWaypoint = { x: x - laneOffset, y: elevation, z: endZ };
      registerLane({
        id: sbLaneId,
        roadId,
        turnType: 'road-lane',
        direction: 'south',
        start: sbStart,
        end: sbEnd,
        waypoints: [sbStart, sbEnd],
        length: len,
        speedLimit: 50,
        incomingLanes: [],
        outgoingLanes: [],
      });

      // Northbound Lane (RHT: right side, towards -Z, offset east (+X))
      const nbLaneId = `lane-${roadId}-nb`;
      const nbStart: LaneWaypoint = { x: x + laneOffset, y: elevation, z: endZ };
      const nbEnd: LaneWaypoint = { x: x + laneOffset, y: elevation, z: startZ };
      registerLane({
        id: nbLaneId,
        roadId,
        turnType: 'road-lane',
        direction: 'north',
        start: nbStart,
        end: nbEnd,
        waypoints: [nbStart, nbEnd],
        length: len,
        speedLimit: 50,
        incomingLanes: [],
        outgoingLanes: [],
      });
    }
  }

  // 4. Generate Intersection Turning Connectors (Straight, Left, Right via Cubic Bézier)
  for (let r = 0; r < streetZs.length; r++) {
    for (let c = 0; c < avenueXs.length; c++) {
      const intId = `int-${r}-${c}`;
      const cx = avenueXs[c];
      const cz = streetZs[r];

      const hasNorthRoad = r > 0;
      const northInLane = hasNorthRoad ? lanes.get(`lane-road-v-${r - 1}-${c}-sb`) : null;
      const northOutLane = hasNorthRoad ? lanes.get(`lane-road-v-${r - 1}-${c}-nb`) : null;

      const hasSouthRoad = r < streetZs.length - 1;
      const southInLane = hasSouthRoad ? lanes.get(`lane-road-v-${r}-${c}-nb`) : null;
      const southOutLane = hasSouthRoad ? lanes.get(`lane-road-v-${r}-${c}-sb`) : null;

      const hasWestRoad = c > 0;
      const westInLane = hasWestRoad ? lanes.get(`lane-road-h-${r}-${c - 1}-eb`) : null;
      const westOutLane = hasWestRoad ? lanes.get(`lane-road-h-${r}-${c - 1}-wb`) : null;

      const hasEastRoad = c < avenueXs.length - 1;
      const eastInLane = hasEastRoad ? lanes.get(`lane-road-h-${r}-${c}-wb`) : null;
      const eastOutLane = hasEastRoad ? lanes.get(`lane-road-h-${r}-${c}-eb`) : null;

      const createTurn = (
        inLane: VehicleLane,
        outLane: VehicleLane,
        type: TurnType,
        controlP1: LaneWaypoint,
        controlP2: LaneWaypoint
      ) => {
        const turnId = `turn-${intId}-${inLane.direction}-to-${outLane.direction}`;
        const waypoints = sampleCubicBezier(inLane.end, controlP1, controlP2, outLane.start, 10);
        const length = computeWaypointsLength(waypoints);

        const turnLane: VehicleLane = {
          id: turnId,
          intersectionId: intId,
          turnType: type,
          direction: 'turn',
          start: inLane.end,
          end: outLane.start,
          waypoints,
          length,
          speedLimit: type === 'straight' ? 45 : 25,
          incomingLanes: [inLane.id],
          outgoingLanes: [outLane.id],
        };

        registerLane(turnLane);
        inLane.outgoingLanes.push(turnId);
        outLane.incomingLanes.push(turnId);
      };

      const dStraight = halfRoad * 0.5;
      const dRight = 2.0;
      const dLeft = halfRoad * 0.7;

      // From North
      if (northInLane) {
        if (southOutLane) {
          createTurn(
            northInLane,
            southOutLane,
            'straight',
            { x: northInLane.end.x, y: elevation, z: cz - dStraight },
            { x: southOutLane.start.x, y: elevation, z: cz + dStraight }
          );
        }
        if (westOutLane) {
          createTurn(
            northInLane,
            westOutLane,
            'right',
            { x: northInLane.end.x, y: elevation, z: cz - dRight },
            { x: cx - dRight, y: elevation, z: westOutLane.start.z }
          );
        }
        if (eastOutLane) {
          createTurn(
            northInLane,
            eastOutLane,
            'left',
            { x: northInLane.end.x, y: elevation, z: cz + dLeft },
            { x: cx + dLeft, y: elevation, z: eastOutLane.start.z }
          );
        }
        if (!southOutLane && !westOutLane && !eastOutLane && northOutLane) {
          createTurn(
            northInLane,
            northOutLane,
            'left',
            { x: cx - laneOffset, y: elevation, z: cz },
            { x: cx + laneOffset, y: elevation, z: cz }
          );
        }
      }

      // From South
      if (southInLane) {
        if (northOutLane) {
          createTurn(
            southInLane,
            northOutLane,
            'straight',
            { x: southInLane.end.x, y: elevation, z: cz + dStraight },
            { x: northOutLane.start.x, y: elevation, z: cz - dStraight }
          );
        }
        if (eastOutLane) {
          createTurn(
            southInLane,
            eastOutLane,
            'right',
            { x: southInLane.end.x, y: elevation, z: cz + dRight },
            { x: cx + dRight, y: elevation, z: eastOutLane.start.z }
          );
        }
        if (westOutLane) {
          createTurn(
            southInLane,
            westOutLane,
            'left',
            { x: southInLane.end.x, y: elevation, z: cz - dLeft },
            { x: cx - dLeft, y: elevation, z: westOutLane.start.z }
          );
        }
        if (!northOutLane && !eastOutLane && !westOutLane && southOutLane) {
          createTurn(
            southInLane,
            southOutLane,
            'left',
            { x: cx + laneOffset, y: elevation, z: cz },
            { x: cx - laneOffset, y: elevation, z: cz }
          );
        }
      }

      // From West
      if (westInLane) {
        if (eastOutLane) {
          createTurn(
            westInLane,
            eastOutLane,
            'straight',
            { x: cx - dStraight, y: elevation, z: westInLane.end.z },
            { x: cx + dStraight, y: elevation, z: eastOutLane.start.z }
          );
        }
        if (southOutLane) {
          createTurn(
            westInLane,
            southOutLane,
            'right',
            { x: cx - dRight, y: elevation, z: westInLane.end.z },
            { x: southOutLane.start.x, y: elevation, z: cz + dRight }
          );
        }
        if (northOutLane) {
          createTurn(
            westInLane,
            northOutLane,
            'left',
            { x: cx + dLeft, y: elevation, z: westInLane.end.z },
            { x: northOutLane.start.x, y: elevation, z: cz - dLeft }
          );
        }
        if (!eastOutLane && !southOutLane && !northOutLane && westOutLane) {
          createTurn(
            westInLane,
            westOutLane,
            'left',
            { x: cx, y: elevation, z: cz + laneOffset },
            { x: cx, y: elevation, z: cz - laneOffset }
          );
        }
      }

      // From East
      if (eastInLane) {
        if (westOutLane) {
          createTurn(
            eastInLane,
            westOutLane,
            'straight',
            { x: cx + dStraight, y: elevation, z: eastInLane.end.z },
            { x: cx - dStraight, y: elevation, z: westOutLane.start.z }
          );
        }
        if (northOutLane) {
          createTurn(
            eastInLane,
            northOutLane,
            'right',
            { x: cx + dRight, y: elevation, z: eastInLane.end.z },
            { x: northOutLane.start.x, y: elevation, z: cz - dRight }
          );
        }
        if (southOutLane) {
          createTurn(
            eastInLane,
            southOutLane,
            'left',
            { x: cx - dLeft, y: elevation, z: eastInLane.end.z },
            { x: southOutLane.start.x, y: elevation, z: cz + dLeft }
          );
        }
        if (!westOutLane && !northOutLane && !southOutLane && eastOutLane) {
          createTurn(
            eastInLane,
            eastOutLane,
            'left',
            { x: cx, y: elevation, z: cz - laneOffset },
            { x: cx, y: elevation, z: cz + laneOffset }
          );
        }
      }
    }
  }

  // 5. Generate City Blocks (3x3 = 9 Central Blocks)
  const sidewalkWidth = 2.4;
  for (let r = 0; r < streetZs.length - 1; r++) {
    for (let c = 0; c < avenueXs.length - 1; c++) {
      const blockId = `block-${r}-${c}`;
      const minX = avenueXs[c] + halfRoad;
      const maxX = avenueXs[c + 1] - halfRoad;
      const minZ = streetZs[r] + halfRoad;
      const maxZ = streetZs[r + 1] - halfRoad;

      const width = maxX - minX;
      const depth = maxZ - minZ;
      const centerX = (minX + maxX) / 2;
      const centerZ = (minZ + maxZ) / 2;

      const district = DISTRICT_ASSIGNMENTS[blockId];

      blocks.push({
        id: blockId,
        name: district ? district.title : `Central Block (${r + 1}, ${c + 1})`,
        gridRow: r,
        gridCol: c,
        center: [centerX, centerZ],
        dimensions: [width, depth],
        isProtectedDistrict: true,
        sidewalkBoundary: { minX, maxX, minZ, maxZ },
        buildableArea: {
          minX: minX + sidewalkWidth,
          maxX: maxX - sidewalkWidth,
          minZ: minZ + sidewalkWidth,
          maxZ: maxZ - sidewalkWidth,
        },
        reservedPlot: district,
      });
    }
  }

  const laneArray = Array.from(lanes.values());
  const vehicleGraph: VehicleNavigationGraph = {
    lanes,
    laneArray,
    intersections: intersectionMap,
  };

  return {
    config,
    intersections,
    roads,
    blocks,
    vehicleGraph,
  };
}

let cachedNetwork: FullCityRoadNetwork | null = null;

export function getCityRoadNetwork(): FullCityRoadNetwork {
  if (!cachedNetwork) {
    cachedNetwork = buildCityRoadNetwork();
  }
  return cachedNetwork;
}

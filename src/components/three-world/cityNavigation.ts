'use client';

import * as THREE from 'three';
import { SelectedBuildingType } from './CityCameraController';

export interface BuildingZone {
  id: SelectedBuildingType;
  name: string;
  label: string;
  color: string;
  accent: string;
  center: [number, number];
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  entrance: [number, number];
}

export const CITY_BUILDING_ZONES: BuildingZone[] = [
  {
    id: 'hero',
    name: 'Hero Headquarters',
    label: 'EXPLORE HERO HQ',
    color: '#00f0ff',
    accent: '#2563eb',
    center: [-7.85, -7.35],
    bounds: { minX: -12.2, maxX: -3.5, minZ: -11.2, maxZ: -3.5 },
    entrance: [-4.2, -7.35],
  },
  {
    id: 'about',
    name: 'About Me Studio',
    label: 'VIEW ABOUT ME',
    color: '#f97316',
    accent: '#ea580c',
    center: [7.85, -7.35],
    bounds: { minX: 3.5, maxX: 12.2, minZ: -11.2, maxZ: -3.5 },
    entrance: [4.2, -7.35],
  },
  {
    id: 'projects',
    name: 'Projects Innovation Center',
    label: 'VIEW PROJECTS',
    color: '#a855f7',
    accent: '#7c3aed',
    center: [-7.85, 7.35],
    bounds: { minX: -12.2, maxX: -3.5, minZ: 3.5, maxZ: 11.2 },
    entrance: [-4.2, 7.35],
  },
  {
    id: 'skills',
    name: 'Skills Tech Tower',
    label: 'INSPECT SKILLS',
    color: '#06b6d4',
    accent: '#0284c7',
    center: [7.85, 7.35],
    bounds: { minX: 3.5, maxX: 12.2, minZ: 3.5, maxZ: 11.2 },
    entrance: [4.2, 7.35],
  },
  {
    id: 'experience',
    name: 'Experience Corporate Office',
    label: 'VIEW EXPERIENCE',
    color: '#3b82f6',
    accent: '#1d4ed8',
    center: [0, 21.5],
    bounds: { minX: -4.5, maxX: 4.5, minZ: 17.5, maxZ: 25.5 },
    entrance: [0, 17.8],
  },
  {
    id: 'contact',
    name: 'Contact Hub',
    label: 'CONTACT ME',
    color: '#ec4899',
    accent: '#be185d',
    center: [0, -21.5],
    bounds: { minX: -4.5, maxX: 4.5, minZ: -25.5, maxZ: -17.5 },
    entrance: [0, -17.8],
  },
];

export interface RectBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface NavPoint {
  x: number;
  z: number;
}

// Avatar radius with safety clearance
export const AVATAR_RADIUS = 0.32;
export const PATH_CLEARANCE = 0.45;

export const CITY_BOUNDS: RectBounds = {
  minX: -27.2,
  maxX: 27.2,
  minZ: -27.2,
  maxZ: 27.2,
};

// Raw static obstacles
const RAW_OBSTACLES: RectBounds[] = [
  ...CITY_BUILDING_ZONES.map((b) => b.bounds),
  // Central Plaza Fountain obstacle
  { minX: 2.2, maxX: 5.5, minZ: -5.5, maxZ: -2.2 },
];

// Pre-expanded static collision boundaries (cached once at module load)
export const CACHED_STATIC_OBSTACLES: RectBounds[] = RAW_OBSTACLES.map((obs) => ({
  minX: obs.minX - AVATAR_RADIUS,
  maxX: obs.maxX + AVATAR_RADIUS,
  minZ: obs.minZ - AVATAR_RADIUS,
  maxZ: obs.maxZ + AVATAR_RADIUS,
}));

// Pre-expanded path clearance boundaries for line-of-sight and waypoint clearance
export const CACHED_PATH_OBSTACLES: RectBounds[] = RAW_OBSTACLES.map((obs) => ({
  minX: obs.minX - PATH_CLEARANCE,
  maxX: obs.maxX + PATH_CLEARANCE,
  minZ: obs.minZ - PATH_CLEARANCE,
  maxZ: obs.maxZ + PATH_CLEARANCE,
}));

/**
 * Fast point-obstacle collision test using pre-cached expanded AABBs.
 */
export function isPointColliding(x: number, z: number): boolean {
  if (
    x < CITY_BOUNDS.minX + AVATAR_RADIUS ||
    x > CITY_BOUNDS.maxX - AVATAR_RADIUS ||
    z < CITY_BOUNDS.minZ + AVATAR_RADIUS ||
    z > CITY_BOUNDS.maxZ - AVATAR_RADIUS
  ) {
    return true;
  }

  for (let i = 0; i < CACHED_STATIC_OBSTACLES.length; i++) {
    const obs = CACHED_STATIC_OBSTACLES[i];
    if (x >= obs.minX && x <= obs.maxX && z >= obs.minZ && z <= obs.maxZ) {
      return true;
    }
  }
  return false;
}

/**
 * 2D Ray-AABB intersection test for line-of-sight checks.
 */
function lineIntersectsBox(
  x1: number,
  z1: number,
  x2: number,
  z2: number,
  box: RectBounds
): boolean {
  // If either point is inside the box, it intersects
  if (
    (x1 >= box.minX && x1 <= box.maxX && z1 >= box.minZ && z1 <= box.maxZ) ||
    (x2 >= box.minX && x2 <= box.maxX && z2 >= box.minZ && z2 <= box.maxZ)
  ) {
    return true;
  }

  const dx = x2 - x1;
  const dz = z2 - z1;

  let tmin = 0;
  let tmax = 1;

  // X slab
  if (Math.abs(dx) < 1e-7) {
    if (x1 < box.minX || x1 > box.maxX) return false;
  } else {
    const ood = 1 / dx;
    let t1 = (box.minX - x1) * ood;
    let t2 = (box.maxX - x1) * ood;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
    }
    tmin = Math.max(tmin, t1);
    tmax = Math.min(tmax, t2);
    if (tmin > tmax) return false;
  }

  // Z slab
  if (Math.abs(dz) < 1e-7) {
    if (z1 < box.minZ || z1 > box.maxZ) return false;
  } else {
    const ood = 1 / dz;
    let t1 = (box.minZ - z1) * ood;
    let t2 = (box.maxZ - z1) * ood;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
    }
    tmin = Math.max(tmin, t1);
    tmax = Math.min(tmax, t2);
    if (tmin > tmax) return false;
  }

  return tmin <= tmax && tmax >= 0 && tmin <= 1;
}

/**
 * Fast line-of-sight test between two points against all cached obstacles.
 */
export function isLineOfSightClear(
  x1: number,
  z1: number,
  x2: number,
  z2: number,
  useSafetyClearance: boolean = true
): boolean {
  const obstacles = useSafetyClearance ? CACHED_PATH_OBSTACLES : CACHED_STATIC_OBSTACLES;
  for (let i = 0; i < obstacles.length; i++) {
    if (lineIntersectsBox(x1, z1, x2, z2, obstacles[i])) {
      return false;
    }
  }
  return true;
}

// ============================================================================
// CACHED STATIC NAVIGATION GRAPH
// Precomputed network of waypoints along roads, sidewalks, and building approaches.
// ============================================================================

export const STATIC_NAV_WAYPOINTS: NavPoint[] = [
  // Center Grand Crossroads
  { x: 0, z: 0 },

  // Central North-South Boulevard
  { x: 0, z: -7.35 },
  { x: 0, z: -14 },
  { x: 0, z: -17.5 },
  { x: 0, z: 7.35 },
  { x: 0, z: 14 },
  { x: 0, z: 17.5 },

  // Central East-West Boulevard
  { x: -7.85, z: 0 },
  { x: -14, z: 0 },
  { x: 7.85, z: 0 },
  { x: 14, z: 0 },

  // North Cross Street
  { x: -7.85, z: -14 },
  { x: -14, z: -14 },
  { x: 7.85, z: -14 },
  { x: 14, z: -14 },

  // South Cross Street
  { x: -7.85, z: 14 },
  { x: -14, z: 14 },
  { x: 7.85, z: 14 },
  { x: 14, z: 14 },

  // Building Entrances & Plazas
  { x: -4.2, z: -7.35 }, // Hero Entrance
  { x: 4.2, z: -7.35 },  // About Entrance
  { x: -4.2, z: 7.35 },  // Projects Entrance
  { x: 4.2, z: 7.35 },   // Skills Entrance
  { x: 0, z: 17.8 },     // Experience Entrance
  { x: 0, z: -17.8 },    // Contact Entrance

  // Sidewalk Corridors around Plot 1 (Hero HQ - NW)
  { x: -2.8, z: -2.8 },
  { x: -13.0, z: -2.8 },
  { x: -13.0, z: -12.0 },
  { x: -2.8, z: -12.0 },

  // Sidewalk Corridors around Plot 2 (About Studio - NE)
  { x: 2.8, z: -2.8 },
  { x: 13.0, z: -2.8 },
  { x: 13.0, z: -12.0 },
  { x: 2.8, z: -12.0 },

  // Sidewalk Corridors around Plot 3 (Projects - SW)
  { x: -2.8, z: 2.8 },
  { x: -13.0, z: 2.8 },
  { x: -13.0, z: 12.0 },
  { x: -2.8, z: 12.0 },

  // Sidewalk Corridors around Plot 4 (Skills - SE)
  { x: 2.8, z: 2.8 },
  { x: 13.0, z: 2.8 },
  { x: 13.0, z: 12.0 },
  { x: 2.8, z: 12.0 },

  // Central Plaza Fountain Bypass Nodes
  { x: 1.5, z: -3.85 },
  { x: 6.2, z: -3.85 },
  { x: 3.85, z: -1.5 },
  { x: 3.85, z: -6.2 },
];

// Precompute static adjacency list of line-of-sight connections
const STATIC_NAV_EDGES: number[][] = (() => {
  const edges: number[][] = [];
  const numNodes = STATIC_NAV_WAYPOINTS.length;

  for (let i = 0; i < numNodes; i++) {
    edges.push([]);
  }

  for (let i = 0; i < numNodes; i++) {
    const a = STATIC_NAV_WAYPOINTS[i];
    for (let j = i + 1; j < numNodes; j++) {
      const b = STATIC_NAV_WAYPOINTS[j];
      const dist = Math.hypot(a.x - b.x, a.z - b.z);
      // Connect nodes that are within reasonable corridor distance and have clear line of sight
      if (dist < 18.0 && isLineOfSightClear(a.x, a.z, b.x, b.z, true)) {
        edges[i].push(j);
        edges[j].push(i);
      }
    }
  }

  return edges;
})();

/**
 * Clamps destination point to valid walkable perimeter and pushes it out of any obstacles.
 */
export function clampDestinationToWalkable(dest: NavPoint): NavPoint {
  let x = Math.max(CITY_BOUNDS.minX + AVATAR_RADIUS + 0.1, Math.min(CITY_BOUNDS.maxX - AVATAR_RADIUS - 0.1, dest.x));
  let z = Math.max(CITY_BOUNDS.minZ + AVATAR_RADIUS + 0.1, Math.min(CITY_BOUNDS.maxZ - AVATAR_RADIUS - 0.1, dest.z));

  // If clicked inside an obstacle, project to the nearest exterior edge
  for (let i = 0; i < CACHED_PATH_OBSTACLES.length; i++) {
    const obs = CACHED_PATH_OBSTACLES[i];
    if (x >= obs.minX && x <= obs.maxX && z >= obs.minZ && z <= obs.maxZ) {
      const dLeft = Math.abs(x - obs.minX);
      const dRight = Math.abs(x - obs.maxX);
      const dTop = Math.abs(z - obs.minZ);
      const dBottom = Math.abs(z - obs.maxZ);
      const minD = Math.min(dLeft, dRight, dTop, dBottom);

      if (minD === dLeft) x = obs.minX - 0.05;
      else if (minD === dRight) x = obs.maxX + 0.05;
      else if (minD === dTop) z = obs.minZ - 0.05;
      else z = obs.maxZ + 0.05;
    }
  }

  return { x, z };
}

/**
 * A* Pathfinding over the cached static navigation graph.
 */
function findGraphPath(start: NavPoint, dest: NavPoint): NavPoint[] {
  const nodes = [...STATIC_NAV_WAYPOINTS];
  const startIdx = nodes.length;
  nodes.push(start);
  const destIdx = nodes.length;
  nodes.push(dest);

  // Connect start and dest to visible static nodes
  const neighbors: number[][] = STATIC_NAV_EDGES.map((list) => [...list]);
  neighbors.push([]); // for start
  neighbors.push([]); // for dest

  for (let i = 0; i < STATIC_NAV_WAYPOINTS.length; i++) {
    const w = STATIC_NAV_WAYPOINTS[i];
    const dStart = Math.hypot(start.x - w.x, start.z - w.z);
    if (dStart < 16.0 && isLineOfSightClear(start.x, start.z, w.x, w.z, true)) {
      neighbors[startIdx].push(i);
      neighbors[i].push(startIdx);
    }

    const dDest = Math.hypot(dest.x - w.x, dest.z - w.z);
    if (dDest < 16.0 && isLineOfSightClear(dest.x, dest.z, w.x, w.z, true)) {
      neighbors[destIdx].push(i);
      neighbors[i].push(destIdx);
    }
  }

  // A* Search
  const totalNodes = nodes.length;
  const gScore = new Float32Array(totalNodes).fill(Infinity);
  const fScore = new Float32Array(totalNodes).fill(Infinity);
  const cameFrom = new Int16Array(totalNodes).fill(-1);
  const openSet = new Set<number>([startIdx]);

  gScore[startIdx] = 0;
  fScore[startIdx] = Math.hypot(start.x - dest.x, start.z - dest.z);

  while (openSet.size > 0) {
    let current = -1;
    let lowestF = Infinity;

    for (const nodeIdx of openSet) {
      if (fScore[nodeIdx] < lowestF) {
        lowestF = fScore[nodeIdx];
        current = nodeIdx;
      }
    }

    if (current === -1 || current === destIdx) {
      break;
    }

    openSet.delete(current);
    const currX = nodes[current].x;
    const currZ = nodes[current].z;

    const currNeighbors = neighbors[current];
    for (let i = 0; i < currNeighbors.length; i++) {
      const neighbor = currNeighbors[i];
      const nx = nodes[neighbor].x;
      const nz = nodes[neighbor].z;
      const tentativeG = gScore[current] + Math.hypot(currX - nx, currZ - nz);

      if (tentativeG < gScore[neighbor]) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeG;
        fScore[neighbor] = tentativeG + Math.hypot(nx - dest.x, nz - dest.z);
        openSet.add(neighbor);
      }
    }
  }

  // Reconstruct path
  if (cameFrom[destIdx] === -1) {
    // No graph path found, return direct dest as fallback
    return [dest];
  }

  const rawPath: NavPoint[] = [];
  let curr = destIdx;
  while (curr !== -1 && curr !== startIdx) {
    rawPath.push(nodes[curr]);
    curr = cameFrom[curr];
  }
  rawPath.reverse();

  // String pulling (shortcut line-of-sight smoothing)
  if (rawPath.length <= 1) return rawPath;

  const smoothedPath: NavPoint[] = [];
  let anchor = start;

  let i = 0;
  while (i < rawPath.length) {
    // Find the farthest node visible from anchor
    let farthest = i;
    for (let j = rawPath.length - 1; j > i; j--) {
      if (isLineOfSightClear(anchor.x, anchor.z, rawPath[j].x, rawPath[j].z, true)) {
        farthest = j;
        break;
      }
    }

    smoothedPath.push(rawPath[farthest]);
    anchor = rawPath[farthest];
    i = farthest + 1;
  }

  return smoothedPath;
}

/**
 * Calculates click-to-walk navigation path.
 * Cached and called ONLY when destination changes or replanning is necessary!
 */
export function calculateClickToWalkPath(
  startX: number,
  startZ: number,
  destX: number,
  destZ: number
): NavPoint[] {
  const destClamped = clampDestinationToWalkable({ x: destX, z: destZ });
  const start: NavPoint = { x: startX, z: startZ };

  // 1. Direct line of sight check
  if (isLineOfSightClear(startX, startZ, destClamped.x, destClamped.z, true)) {
    return [destClamped];
  }

  // 2. A* navigation graph search
  const graphPath = findGraphPath(start, destClamped);
  return graphPath.length > 0 ? graphPath : [destClamped];
}

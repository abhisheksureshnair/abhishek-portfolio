import * as THREE from 'three';

/**
 * Phase 2.0.6 Island Coastline & Geography Engine
 * 
 * Generates an organic, natural Manhattan-style American island coastline:
 * - Perfectly surrounds the 19x19 metropolitan grid with guaranteed >50m coastal buffers
 * - Categorizes the shoreline into distinct geographic zones:
 *   1. East Harbor Commercial District (seawalls, commercial piers, dockhouses)
 *   2. South Battery & Marina (park promenade, lighthouse beacon, observation pier)
 *   3. Southwest Sandy Beach Cove (gentle sloping sandy beach down into shallow water)
 *   4. West Coastal Drive & Scenic Green (curved waterfront boulevard, riprap rocks)
 *   5. Northwest Rocky Headland (granite boulders, natural rocky bluffs)
 *   6. North Bay & Lookout (curved coastal parkland)
 */

export const WATER_ELEVATION = -1.20;
export const SEAWALL_TOP_ELEVATION = 0.20;
export const SEAWALL_BOTTOM_ELEVATION = -2.40;
export const PROMENADE_WIDTH = 12.0;

export type CoastlineZone =
  | 'urban_seawall'      // East Harbor (concrete seawall, historic piers)
  | 'battery_promenade'  // South Battery (stone seawall, park, lighthouse)
  | 'sandy_beach'        // Southwest Cove (sloping sand, zero vertical wall)
  | 'scenic_drive'       // West & North Shore (coastal road, low stone riprap)
  | 'rocky_headland';    // Northwest Headland (granite boulders, natural bluffs)

export interface CoastlineVertex {
  angle: number;
  radius: number;
  x: number;
  z: number;
  normalX: number;
  normalZ: number;
  zone: CoastlineZone;
}

/**
 * Analytical function giving the island radius at any given polar angle (radians).
 * Guaranteed to clear the outermost city blocks by at least 50 meters everywhere.
 */
export function getCoastlineRadius(rad: number): number {
  const theta = ((rad % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const cos = Math.abs(Math.cos(theta));
  const sin = Math.abs(Math.sin(theta));
  const W_CITY = 395.0; // Outermost road & block edge
  const rCity = W_CITY / Math.max(cos, sin, 0.001);

  // Elongated island base (North-South elongation: rx=560m, rz=670m)
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  const rBase = (560 * 670) / Math.sqrt((670 * cosT) ** 2 + (560 * sinT) ** 2);

  // Organic coastal harmonics
  const h1 = 46.0 * Math.sin(2.0 * theta - 0.25); // Asymmetric diagonal elongation
  const h2 = 34.0 * Math.cos(3.0 * theta + 0.45); // Broad coastal bays
  const h3 = 18.0 * Math.sin(5.0 * theta - 0.70); // Rocky headlands
  const h4 = 10.0 * Math.cos(7.0 * theta);        // Gentle coastal sweeps
  const h5 = 5.0 * Math.sin(11.0 * theta);        // Subtle shoreline variations

  const rOrganic = rBase + h1 + h2 + h3 + h4 + h5;
  return Math.max(rOrganic, rCity + 52.0);
}

/**
 * Classifies any polar angle into its coastal geographic zone
 */
export function getCoastlineZone(angleRad: number): CoastlineZone {
  const theta = ((angleRad % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const deg = (theta * 180) / Math.PI;

  // 1. East Harbor Commercial District (330° to 360°, and 0° to 45°)
  if (deg >= 330 || deg <= 45) {
    return 'urban_seawall';
  }
  // 2. South Battery & Marina (45° to 115°)
  if (deg > 45 && deg <= 115) {
    return 'battery_promenade';
  }
  // 3. Southwest Sandy Beach Cove (115° to 175°)
  if (deg > 115 && deg <= 175) {
    return 'sandy_beach';
  }
  // 4. West Coastal Drive (175° to 240°)
  if (deg > 175 && deg <= 240) {
    return 'scenic_drive';
  }
  // 5. Northwest Rocky Headland (240° to 300°)
  if (deg > 240 && deg <= 300) {
    return 'rocky_headland';
  }
  // 6. North Bay & Scenic Drive (300° to 330°)
  return 'scenic_drive';
}

/**
 * Precomputed 240-vertex coastline polygon
 */
export const COASTLINE_SECTORS = 240;

export function generateCoastlineVertices(): CoastlineVertex[] {
  const vertices: CoastlineVertex[] = [];
  const step = (Math.PI * 2) / COASTLINE_SECTORS;

  for (let i = 0; i < COASTLINE_SECTORS; i++) {
    const angle = i * step;
    const r = getCoastlineRadius(angle);
    const x = r * Math.cos(angle);
    const z = r * Math.sin(angle);
    const zone = getCoastlineZone(angle);

    // Compute tangent & normal vectors for seawalls and promenades
    const nextAngle = (i + 1) * step;
    const nextR = getCoastlineRadius(nextAngle);
    const nextX = nextR * Math.cos(nextAngle);
    const nextZ = nextR * Math.sin(nextAngle);

    const prevAngle = (i - 1 + COASTLINE_SECTORS) * step;
    const prevR = getCoastlineRadius(prevAngle);
    const prevX = prevR * Math.cos(prevAngle);
    const prevZ = prevR * Math.sin(prevAngle);

    // Tangent from prev to next
    const tx = nextX - prevX;
    const tz = nextZ - prevZ;
    const tLen = Math.hypot(tx, tz);
    // Outward facing normal (perpendicular to tangent)
    const normalX = tz / tLen;
    const normalZ = -tx / tLen;

    vertices.push({
      angle,
      radius: r,
      x,
      z,
      normalX,
      normalZ,
      zone,
    });
  }

  return vertices;
}

export const COASTLINE_VERTICES = generateCoastlineVertices();

/**
 * Returns true if a world coordinate (x, z) is safely on the island landmass
 */
export function isInsideIsland(x: number, z: number, margin = 0): boolean {
  const dist = Math.hypot(x, z);
  const angle = Math.atan2(z, x);
  const coastR = getCoastlineRadius(angle);
  return dist <= (coastR - margin);
}

/**
 * Creates a THREE.Shape representing the island landmass perimeter
 */
export function createIslandShape(): THREE.Shape {
  const shape = new THREE.Shape();
  if (COASTLINE_VERTICES.length === 0) return shape;

  // In Three.js, a 2D Shape lies in the X-Y plane.
  // When rotated by [-Math.PI / 2, 0, 0], 2D Y transforms to world -Z.
  // To ensure the resulting 3D world position is (v.x, 0, v.z),
  // we must assign Shape Y = -v.z so that world Z = -(-v.z) = +v.z!
  shape.moveTo(COASTLINE_VERTICES[0].x, -COASTLINE_VERTICES[0].z);
  for (let i = 1; i < COASTLINE_VERTICES.length; i++) {
    shape.lineTo(COASTLINE_VERTICES[i].x, -COASTLINE_VERTICES[i].z);
  }
  shape.closePath();
  return shape;
}

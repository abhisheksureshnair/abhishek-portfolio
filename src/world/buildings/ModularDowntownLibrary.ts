import { ParcelData, BlockBoundary } from '../layout/cityLayoutConfig';

export type FootprintArchetype =
  | 'rectangular'
  | 'corner-chamfer'
  | 'podium-tower'
  | 'l-shaped'
  | 'parking-structure';

export type ArchitecturalStyle =
  | 'modern-office'
  | 'glass-skyscraper'
  | 'commercial-brick'
  | 'apartment-building'
  | 'hotel'
  | 'mixed-use'
  | 'parking-structure';

export interface BuildingSpecs {
  parcelId: string;
  blockId: string;
  center: [number, number];       // [x, z]
  dimensions: [number, number];   // [w, d]
  facingDirection: 'north' | 'south' | 'east' | 'west';
  entrancePosition: [number, number];
  style: ArchitecturalStyle;
  footprint: FootprintArchetype;
  floors: number;
  floorHeight: number;
  groundHeight: number;
  totalHeight: number;
  hasWaterTower: boolean;
  hasHVACChiller: boolean;
  hasPenthouse: boolean;
  hasBalconies: boolean;
  hasAwning: 'navy' | 'burgundy' | 'green' | null;
  hasCanopy: boolean;
  hasStoop: boolean;
  hasCornerChamfer: boolean;
  podiumSetback: number; // Setback in meters for upper tower if podium-tower
}

/**
 * Deterministic pseudo-random generator
 */
function seededRng(seed: number): () => number {
  let s = Math.sin(seed) * 10000;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Computes architectural specifications for any parcel in the city.
 * Applies realistic American urban density zoning:
 * - Downtown Core (near center): taller office towers, hotels, mixed-use towers.
 * - Mid-Ring: mid-rise offices, apartment buildings, retail lofts.
 * - Outer Neighborhoods: low-rise residential, commercial, parking structures.
 */
export function getBuildingSpecs(parcel: ParcelData, isReferenceBlockOnly = false): BuildingSpecs {
  const [cx, cz] = parcel.center;
  const [w, d] = parcel.dimensions;
  const distFromCenter = Math.sqrt(cx * cx + cz * cz);
  const hash = Math.abs(Math.round(cx * 100 + cz * 10));
  const rng = seededRng(hash + 42);

  // ---------------------------------------------------------------------------
  // 1. REFERENCE BLOCK (`block_1_3`, centered at [0, -80])
  // Carefully tuned Stage A & Stage B reference buildings
  // ---------------------------------------------------------------------------
  if (parcel.blockId === 'block_1_3') {
    if (parcel.id.includes('sw')) {
      // SW: 5-story Mixed-Use Corner Building with chamfered ground cafe & roof HVAC
      return {
        parcelId: parcel.id,
        blockId: parcel.blockId,
        center: [cx, cz],
        dimensions: [w, d],
        facingDirection: parcel.facingDirection,
        entrancePosition: parcel.entrancePosition,
        style: 'mixed-use',
        footprint: 'corner-chamfer',
        floors: 5,
        floorHeight: 3.5,
        groundHeight: 4.2,
        totalHeight: 4.2 + 4 * 3.5, // 18.2m
        hasWaterTower: false,
        hasHVACChiller: true,
        hasPenthouse: true,
        hasBalconies: false,
        hasAwning: 'green',
        hasCanopy: false,
        hasStoop: false,
        hasCornerChamfer: true,
        podiumSetback: 0.3,
      };
    } else if (parcel.id.includes('se')) {
      // SE: 7-story Modern Glass Commercial Office Tower with structural canopy & penthouse
      return {
        parcelId: parcel.id,
        blockId: parcel.blockId,
        center: [cx, cz],
        dimensions: [w, d],
        facingDirection: parcel.facingDirection,
        entrancePosition: parcel.entrancePosition,
        style: 'modern-office',
        footprint: 'podium-tower',
        floors: 7,
        floorHeight: 3.5,
        groundHeight: 4.5,
        totalHeight: 4.5 + 6 * 3.5, // 25.5m
        hasWaterTower: false,
        hasHVACChiller: true,
        hasPenthouse: true,
        hasBalconies: false,
        hasAwning: null,
        hasCanopy: true,
        hasStoop: false,
        hasCornerChamfer: false,
        podiumSetback: 0.4,
      };
    } else if (parcel.id.includes('nw')) {
      // NW: 4-story Chicago-Style Brick Commercial with State Street Books & rooftop water tower
      return {
        parcelId: parcel.id,
        blockId: parcel.blockId,
        center: [cx, cz],
        dimensions: [w, d],
        facingDirection: parcel.facingDirection,
        entrancePosition: parcel.entrancePosition,
        style: 'commercial-brick',
        footprint: 'rectangular',
        floors: 4,
        floorHeight: 3.5,
        groundHeight: 4.0,
        totalHeight: 4.0 + 3 * 3.5, // 14.5m
        hasWaterTower: true,
        hasHVACChiller: false,
        hasPenthouse: false,
        hasBalconies: false,
        hasAwning: 'navy',
        hasCanopy: false,
        hasStoop: false,
        hasCornerChamfer: false,
        podiumSetback: 0.2,
      };
    } else {
      // NE: 6-story Residential Apartment Building with balconies & entrance stoop
      return {
        parcelId: parcel.id,
        blockId: parcel.blockId,
        center: [cx, cz],
        dimensions: [w, d],
        facingDirection: parcel.facingDirection,
        entrancePosition: parcel.entrancePosition,
        style: 'apartment-building',
        footprint: 'rectangular',
        floors: 6,
        floorHeight: 3.4,
        groundHeight: 4.0,
        totalHeight: 4.0 + 5 * 3.4, // 21.0m
        hasWaterTower: false,
        hasHVACChiller: false,
        hasPenthouse: true,
        hasBalconies: true,
        hasAwning: null,
        hasCanopy: false,
        hasStoop: true,
        hasCornerChamfer: false,
        podiumSetback: 0.2,
      };
    }
  }

  // ---------------------------------------------------------------------------
  // 2. EXPANDED CITY BACKGROUND PARCELS (Controlled Variety & Density Zoning)
  // ---------------------------------------------------------------------------
  let style: ArchitecturalStyle = 'commercial-brick';
  let footprint: FootprintArchetype = 'rectangular';
  let floors = 5;
  let floorHeight = 3.5;
  let groundHeight = 4.0;
  let hasWaterTower = false;
  let hasHVACChiller = false;
  let hasPenthouse = true;
  let hasBalconies = false;
  let hasAwning: 'navy' | 'burgundy' | 'green' | null = null;
  let hasCanopy = false;
  let hasStoop = false;
  let hasCornerChamfer = false;
  let podiumSetback = 0.3;

  // Derive a spatial slot from coordinates to ensure adjacent parcels alternate styles
  const colIndex = Math.round((cx + 140) / 20);
  const rowIndex = Math.round((cz + 140) / 20);
  const styleSlot = (colIndex * 3 + rowIndex * 5 + Math.floor(rng() * 2)) % 6;

  if (parcel.landUse === 'parking-structure') {
    style = 'parking-structure';
    footprint = 'parking-structure';
    floors = 4 + Math.floor(rng() * 2); // 4-5 floors (14-18m)
    floorHeight = 3.4;
    groundHeight = 4.0;
    hasWaterTower = false;
    hasHVACChiller = false;
    hasPenthouse = true;
  } else if (distFromCenter < 110) {
    // -------------------------------------------------------------------------
    // DOWNTOWN CORE RING: Varied high-rises and mid-rises (10-22 floors)
    // -------------------------------------------------------------------------
    if (styleSlot === 0) {
      style = 'modern-office';
      footprint = 'podium-tower';
      floors = 11 + Math.floor(rng() * 7); // 11-17 floors (42-65m)
      hasCanopy = true;
      hasHVACChiller = true;
      hasPenthouse = true;
      podiumSetback = 0.5 + Math.floor(rng() * 3) * 0.2;
    } else if (styleSlot === 1) {
      style = 'commercial-brick';
      footprint = rng() > 0.5 ? 'rectangular' : 'l-shaped';
      floors = 7 + Math.floor(rng() * 5); // 7-11 floors (26-42m)
      hasWaterTower = true;
      hasAwning = rng() > 0.5 ? 'navy' : 'burgundy';
      podiumSetback = 0.3;
    } else if (styleSlot === 2) {
      style = 'glass-skyscraper';
      footprint = 'podium-tower';
      floors = 14 + Math.floor(rng() * 9); // 14-22 floors (52-82m)
      hasCanopy = true;
      hasHVACChiller = true;
      hasPenthouse = true;
      podiumSetback = 0.7;
    } else if (styleSlot === 3) {
      style = 'hotel';
      footprint = 'podium-tower';
      floors = 10 + Math.floor(rng() * 6); // 10-15 floors (38-57m)
      hasCanopy = true;
      hasHVACChiller = true;
      hasPenthouse = true;
      podiumSetback = 0.4;
    } else if (styleSlot === 4) {
      style = 'mixed-use';
      footprint = 'corner-chamfer';
      floors = 8 + Math.floor(rng() * 5); // 8-12 floors (31-46m)
      hasCornerChamfer = true;
      hasHVACChiller = true;
      hasAwning = 'green';
      podiumSetback = 0.3;
    } else {
      style = 'apartment-building';
      footprint = 'rectangular';
      floors = 9 + Math.floor(rng() * 5); // 9-13 floors (32-48m)
      hasBalconies = true;
      hasStoop = true;
      hasWaterTower = rng() > 0.5;
      podiumSetback = 0.2;
    }
  } else if (distFromCenter < 145) {
    // -------------------------------------------------------------------------
    // INTERMEDIATE RING: Mid-rises and lofts (5-10 floors)
    // -------------------------------------------------------------------------
    if (styleSlot === 0 || styleSlot === 3) {
      style = 'commercial-brick';
      footprint = rng() > 0.5 ? 'l-shaped' : 'rectangular';
      floors = 5 + Math.floor(rng() * 4); // 5-8 floors (18-29m)
      hasWaterTower = rng() > 0.4;
      hasAwning = rng() > 0.5 ? 'navy' : 'burgundy';
    } else if (styleSlot === 1 || styleSlot === 5) {
      style = 'apartment-building';
      footprint = 'rectangular';
      floors = 6 + Math.floor(rng() * 4); // 6-9 floors (21-32m)
      hasBalconies = true;
      hasStoop = true;
      hasWaterTower = rng() > 0.6;
    } else if (styleSlot === 2) {
      style = 'modern-office';
      footprint = 'podium-tower';
      floors = 7 + Math.floor(rng() * 4); // 7-10 floors (26-38m)
      hasCanopy = true;
      hasHVACChiller = true;
      podiumSetback = 0.4;
    } else {
      style = 'mixed-use';
      footprint = 'corner-chamfer';
      floors = 5 + Math.floor(rng() * 3); // 5-7 floors (18-25m)
      hasCornerChamfer = true;
      hasAwning = 'green';
      hasHVACChiller = true;
    }
  } else {
    // -------------------------------------------------------------------------
    // OUTER NEIGHBORHOODS: Restrained low-rises (3-6 floors)
    // -------------------------------------------------------------------------
    if (styleSlot % 2 === 0) {
      style = 'commercial-brick';
      footprint = 'rectangular';
      floors = 3 + Math.floor(rng() * 3); // 3-5 floors (11-18m)
      hasWaterTower = rng() > 0.5;
      hasAwning = rng() > 0.5 ? 'navy' : 'burgundy';
    } else {
      style = 'apartment-building';
      footprint = 'rectangular';
      floors = 4 + Math.floor(rng() * 3); // 4-6 floors (14-22m)
      hasBalconies = true;
      hasStoop = true;
    }
  }

  const totalHeight = groundHeight + (floors - 1) * floorHeight;

  return {
    parcelId: parcel.id,
    blockId: parcel.blockId,
    center: [cx, cz],
    dimensions: [w, d],
    facingDirection: parcel.facingDirection,
    entrancePosition: parcel.entrancePosition,
    style,
    footprint,
    floors,
    floorHeight,
    groundHeight,
    totalHeight,
    hasWaterTower,
    hasHVACChiller,
    hasPenthouse,
    hasBalconies,
    hasAwning,
    hasCanopy,
    hasStoop,
    hasCornerChamfer,
    podiumSetback,
  };
}

import { BlockBoundary, ParcelData, getCityBlocks } from './cityLayoutConfig';

/**
 * Deterministic pseudo-random number generator for reproducible parcel layouts.
 */
function seededRng(seed: number): () => number {
  let s = Math.sin(seed) * 10000;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Subdivides a block's 24m x 24m buildable area into geometrically valid building parcels.
 * Guaranteed:
 * - 100% contained within block's buildableBounds.
 * - Minimum 0.8m separation between adjacent building parcels.
 * - No overlap with sidewalks, roads, or intersections.
 * - Dedicated entrance positions on sidewalk-facing edges.
 */
export function generateBlockParcels(block: BlockBoundary, isReferenceBlockOnly = false): ParcelData[] {
  // Never generate parcels inside protected portfolio plots
  if (block.isProtectedDistrict) {
    return [];
  }

  const { minX, maxX, minZ, maxZ } = block.buildableBounds;
  const width = maxX - minX;  // 24.0m
  const depth = maxZ - minZ;  // 24.0m
  const midX = (minX + maxX) / 2;
  const midZ = (minZ + maxZ) / 2;
  const sep = 0.5; // Half of 1.0m inter-building separation gap

  // =========================================================================
  // 1. REFERENCE BLOCK (`block_1_3`, North Adjacent Block centered at [0, -80])
  // Subdivided into 4 distinct realistic urban parcels:
  // - SW: Mixed-Use Corner Brick Building with cafe storefront
  // - SE: Modern Glass Commercial Office Mid-Rise with entrance canopy
  // - NW: Commercial Brick Building with bookstore storefront & rooftop water tower
  // - NE: Residential Apartment Building with balconies & entrance stoop
  // =========================================================================
  if (block.id === 'block_1_3') {
    return [
      {
        id: `${block.id}_parcel_sw`,
        blockId: block.id,
        bounds: { minX, maxX: midX - sep, minZ: midZ + sep, maxZ },
        center: [(minX + midX - sep) / 2, (midZ + sep + maxZ) / 2],
        dimensions: [midX - sep - minX, maxZ - (midZ + sep)], // ~11.5m x 11.5m
        facingDirection: 'south',
        landUse: 'mixed-use-corner',
        entrancePosition: [(minX + midX - sep) / 2, maxZ],
      },
      {
        id: `${block.id}_parcel_se`,
        blockId: block.id,
        bounds: { minX: midX + sep, maxX, minZ: midZ + sep, maxZ },
        center: [(midX + sep + maxX) / 2, (midZ + sep + maxZ) / 2],
        dimensions: [maxX - (midX + sep), maxZ - (midZ + sep)], // ~11.5m x 11.5m
        facingDirection: 'south',
        landUse: 'modern-office',
        entrancePosition: [(midX + sep + maxX) / 2, maxZ],
      },
      {
        id: `${block.id}_parcel_nw`,
        blockId: block.id,
        bounds: { minX, maxX: midX - sep, minZ, maxZ: midZ - sep },
        center: [(minX + midX - sep) / 2, (minZ + midZ - sep) / 2],
        dimensions: [midX - sep - minX, midZ - sep - minZ], // ~11.5m x 11.5m
        facingDirection: 'north',
        landUse: 'commercial-brick',
        entrancePosition: [(minX + midX - sep) / 2, minZ],
      },
      {
        id: `${block.id}_parcel_ne`,
        blockId: block.id,
        bounds: { minX: midX + sep, maxX, minZ, maxZ: midZ - sep },
        center: [(midX + sep + maxX) / 2, (minZ + midZ - sep) / 2],
        dimensions: [maxX - (midX + sep), midZ - sep - minZ], // ~11.5m x 11.5m
        facingDirection: 'north',
        landUse: 'residential-apt',
        entrancePosition: [(midX + sep + maxX) / 2, minZ],
      },
    ];
  }

  // If in reference-block-only mode, only generate parcels for the reference block!
  if (isReferenceBlockOnly) {
    return [];
  }

  // =========================================================================
  // 2. EXPANDED CITY BACKGROUND BLOCKS
  // Deterministic subdivision based on block coordinates & land-use zoning
  // =========================================================================
  const rng = seededRng(block.gridRow * 9973 + block.gridCol * 4099 + 17);
  const layoutType = Math.floor(rng() * 4); // 0: 4 parcels, 1: 2 parcels (east-west), 2: 2 parcels (north-south), 3: 1 single large building

  if (layoutType === 0) {
    // 4 Urban Parcels
    return [
      {
        id: `${block.id}_p0`,
        blockId: block.id,
        bounds: { minX, maxX: midX - sep, minZ: midZ + sep, maxZ },
        center: [(minX + midX - sep) / 2, (midZ + sep + maxZ) / 2],
        dimensions: [midX - sep - minX, maxZ - (midZ + sep)],
        facingDirection: 'south',
        landUse: 'commercial-brick',
        entrancePosition: [(minX + midX - sep) / 2, maxZ],
      },
      {
        id: `${block.id}_p1`,
        blockId: block.id,
        bounds: { minX: midX + sep, maxX, minZ: midZ + sep, maxZ },
        center: [(midX + sep + maxX) / 2, (midZ + sep + maxZ) / 2],
        dimensions: [maxX - (midX + sep), maxZ - (midZ + sep)],
        facingDirection: 'south',
        landUse: 'modern-office',
        entrancePosition: [(midX + sep + maxX) / 2, maxZ],
      },
      {
        id: `${block.id}_p2`,
        blockId: block.id,
        bounds: { minX, maxX: midX - sep, minZ, maxZ: midZ - sep },
        center: [(minX + midX - sep) / 2, (minZ + midZ - sep) / 2],
        dimensions: [midX - sep - minX, midZ - sep - minZ],
        facingDirection: 'north',
        landUse: 'residential-apt',
        entrancePosition: [(minX + midX - sep) / 2, minZ],
      },
      {
        id: `${block.id}_p3`,
        blockId: block.id,
        bounds: { minX: midX + sep, maxX, minZ, maxZ: midZ - sep },
        center: [(midX + sep + maxX) / 2, (minZ + midZ - sep) / 2],
        dimensions: [maxX - (midX + sep), midZ - sep - minZ],
        facingDirection: 'north',
        landUse: 'mixed-use-corner',
        entrancePosition: [(midX + sep + maxX) / 2, minZ],
      },
    ];
  } else if (layoutType === 1) {
    // 2 Parcels (split North-South)
    return [
      {
        id: `${block.id}_p_north`,
        blockId: block.id,
        bounds: { minX, maxX, minZ, maxZ: midZ - sep },
        center: [midX, (minZ + midZ - sep) / 2],
        dimensions: [width, midZ - sep - minZ],
        facingDirection: 'north',
        landUse: 'commercial-brick',
        entrancePosition: [midX, minZ],
      },
      {
        id: `${block.id}_p_south`,
        blockId: block.id,
        bounds: { minX, maxX, minZ: midZ + sep, maxZ },
        center: [midX, (midZ + sep + maxZ) / 2],
        dimensions: [width, maxZ - (midZ + sep)],
        facingDirection: 'south',
        landUse: 'residential-apt',
        entrancePosition: [midX, maxZ],
      },
    ];
  } else if (layoutType === 2) {
    // 2 Parcels (split West-East)
    return [
      {
        id: `${block.id}_p_west`,
        blockId: block.id,
        bounds: { minX, maxX: midX - sep, minZ, maxZ },
        center: [(minX + midX - sep) / 2, midZ],
        dimensions: [midX - sep - minX, depth],
        facingDirection: 'west',
        landUse: 'modern-office',
        entrancePosition: [minX, midZ],
      },
      {
        id: `${block.id}_p_east`,
        blockId: block.id,
        bounds: { minX: midX + sep, maxX, minZ, maxZ },
        center: [(midX + sep + maxX) / 2, midZ],
        dimensions: [maxX - (midX + sep), depth],
        facingDirection: 'east',
        landUse: 'hotel',
        entrancePosition: [maxX, midZ],
      },
    ];
  } else {
    // 1 Full-Block Urban Facility (Hotel or Parking Structure)
    const isParking = rng() > 0.5;
    return [
      {
        id: `${block.id}_p_full`,
        blockId: block.id,
        bounds: { minX, maxX, minZ, maxZ },
        center: [midX, midZ],
        dimensions: [width, depth],
        facingDirection: 'south',
        landUse: isParking ? 'parking-structure' : 'hotel',
        entrancePosition: [midX, maxZ],
      },
    ];
  }
}

/**
 * Returns all parcels for the city.
 * When `referenceBlockOnly === true`, only the reference block parcels are returned!
 */
export function getAllCityParcels(referenceBlockOnly = false): ParcelData[] {
  const blocks = getCityBlocks();
  const parcels: ParcelData[] = [];

  blocks.forEach((block) => {
    const blockParcels = generateBlockParcels(block, referenceBlockOnly);
    parcels.push(...blockParcels);
  });

  return parcels;
}


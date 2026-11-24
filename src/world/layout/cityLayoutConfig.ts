export interface CityLayoutDimensions {
  worldOrigin: [number, number, number];
  roadWidth: number;          // 10.0m standard 2-way American street
  laneOffset: number;         // 2.3m from road centerline
  sidewalkWidth: number;      // 3.0m wide pedestrian sidewalk
  curbHeight: number;         // 0.18m (approx 7 inches)
  blockPitch: number;         // 40.0m center-to-center pitch (30m block + 10m road)
  blockOuterSize: number;     // 30.0m (outer block including sidewalks)
  blockBuildableSize: number; // 24.0m (interior buildable parcel footprint)
  elevations: {
    terrain: number;          // 0.00m
    road: number;             // 0.02m
    markings: number;         // 0.025m
    sidewalk: number;         // 0.20m
    curbTop: number;          // 0.20m
    buildingPlinth: number;   // 0.20m
  };
  grid: {
    avenueXs: number[];       // North-South Avenue centerlines
    streetZs: number[];       // East-West Street centerlines
  };
}

export interface BlockBoundary {
  id: string;
  gridRow: number;
  gridCol: number;
  center: [number, number];   // [x, z]
  outerBounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  sidewalkBounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  buildableBounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  isProtectedDistrict: boolean;
  districtId?: string;
}

export interface ParcelData {
  id: string;
  blockId: string;
  bounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  center: [number, number];   // [x, z]
  dimensions: [number, number]; // [width (X), depth (Z)]
  facingDirection: 'north' | 'south' | 'east' | 'west';
  landUse: 'modern-office' | 'commercial-brick' | 'residential-apt' | 'mixed-use-corner' | 'hotel' | 'parking-structure';
  entrancePosition: [number, number]; // [x, z] on parcel edge facing sidewalk
}

export interface RoadSegmentGeometry {
  id: string;
  center: [number, number];   // [x, z]
  width: number;
  length: number;
  orientation: 'north-south' | 'east-west';
  bounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
}

export interface IntersectionGeometry {
  id: string;
  center: [number, number];   // [x, z]
  size: number;               // 10.0m
  bounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
}

export interface CrosswalkGeometry {
  id: string;
  intersectionId: string;
  approach: 'north' | 'south' | 'east' | 'west';
  center: [number, number];
  length: number;             // Width of roadway crossed (approx 9.0m)
  width: number;              // Crosswalk stripe corridor (approx 2.4m)
  stripeDirection: 'x' | 'z'; // Direction of individual zebra bars
  stripes: {
    center: [number, number];
    size: [number, number];   // [width, length]
  }[];
  stopBar: {
    center: [number, number];
    size: [number, number];
  };
}

// Single Source of Truth for the Entire City Layout
// Central District is enclosed by Avenues X = [-60, -20, 20, 60] and Streets Z = [-60, -20, 20, 60]
// Regular 40m grid pitch extends symmetrically outward!
export const CITY_LAYOUT_CONFIG: CityLayoutDimensions = {
  worldOrigin: [0, 0, 0],
  roadWidth: 10.0,
  laneOffset: 2.3,
  sidewalkWidth: 3.0,
  curbHeight: 0.18,
  blockPitch: 40.0,
  blockOuterSize: 30.0,
  blockBuildableSize: 24.0,
  elevations: {
    terrain: 0.00,
    road: 0.02,
    markings: 0.025,
    sidewalk: 0.20,
    curbTop: 0.20,
    buildingPlinth: 0.20,
  },
  grid: {
    // 7 Avenues (North-South): central 4 [-60, -20, 20, 60] + outer [-100, 100, 140]
    avenueXs: [-140, -100, -60, -20, 20, 60, 100, 140],
    // 7 Streets (East-West): central 4 [-60, -20, 20, 60] + outer [-100, 100, 140]
    streetZs: [-140, -100, -60, -20, 20, 60, 100, 140],
  },
};

/**
 * Calculates all city blocks mathematically from the grid configuration.
 * Zero manual guesswork; 100% congruent geometry.
 */
export function getCityBlocks(): BlockBoundary[] {
  const { avenueXs, streetZs } = CITY_LAYOUT_CONFIG.grid;
  const blocks: BlockBoundary[] = [];

  for (let r = 0; r < streetZs.length - 1; r++) {
    const zNorth = streetZs[r];
    const zSouth = streetZs[r + 1];
    const cz = (zNorth + zSouth) / 2;

    for (let c = 0; c < avenueXs.length - 1; c++) {
      const xWest = avenueXs[c];
      const xEast = avenueXs[c + 1];
      const cx = (xWest + xEast) / 2;

      // Road edge is at distance roadWidth/2 = 5.0m from road centerline
      const minX = xWest + 5.0;
      const maxX = xEast - 5.0;
      const minZ = zNorth + 5.0;
      const maxZ = zSouth - 5.0;

      // Sidewalk is 3.0m wide along the block perimeter
      const swMinX = minX;
      const swMaxX = maxX;
      const swMinZ = minZ;
      const swMaxZ = maxZ;

      // Buildable interior area
      const bMinX = minX + 3.0;
      const bMaxX = maxX - 3.0;
      const bMinZ = minZ + 3.0;
      const bMaxZ = maxZ - 3.0;

      // Check if this block falls inside the central 3x3 portfolio district:
      // Central district covers Avenues [-60, 60] and Streets [-60, 60]
      const isProtected = Math.abs(cx) <= 45 && Math.abs(cz) <= 45;

      blocks.push({
        id: `block_${r}_${c}`,
        gridRow: r,
        gridCol: c,
        center: [cx, cz],
        outerBounds: { minX, maxX, minZ, maxZ },
        sidewalkBounds: { minX: swMinX, maxX: swMaxX, minZ: swMinZ, maxZ: swMaxZ },
        buildableBounds: { minX: bMinX, maxX: bMaxX, minZ: bMinZ, maxZ: bMaxZ },
        isProtectedDistrict: isProtected,
      });
    }
  }

  return blocks;
}

/**
 * Generates all road intersections from grid centerlines.
 */
export function getCityIntersections(): IntersectionGeometry[] {
  const { avenueXs, streetZs } = CITY_LAYOUT_CONFIG.grid;
  const intersections: IntersectionGeometry[] = [];
  const halfRoad = CITY_LAYOUT_CONFIG.roadWidth / 2;

  avenueXs.forEach((ax, c) => {
    streetZs.forEach((sz, r) => {
      intersections.push({
        id: `inter_${r}_${c}`,
        center: [ax, sz],
        size: CITY_LAYOUT_CONFIG.roadWidth,
        bounds: {
          minX: ax - halfRoad,
          maxX: ax + halfRoad,
          minZ: sz - halfRoad,
          maxZ: sz + halfRoad,
        },
      });
    });
  });

  return intersections;
}

/**
 * Generates all road segments connecting consecutive intersections.
 */
export function getCityRoadSegments(): RoadSegmentGeometry[] {
  const { avenueXs, streetZs } = CITY_LAYOUT_CONFIG.grid;
  const halfRoad = CITY_LAYOUT_CONFIG.roadWidth / 2;
  const segments: RoadSegmentGeometry[] = [];

  // 1. North-South Avenue Segments (between consecutive streets)
  avenueXs.forEach((ax, c) => {
    for (let r = 0; r < streetZs.length - 1; r++) {
      const zStart = streetZs[r] + halfRoad;
      const zEnd = streetZs[r + 1] - halfRoad;
      const length = zEnd - zStart;
      const cz = (zStart + zEnd) / 2;

      segments.push({
        id: `road_ns_${r}_${c}`,
        center: [ax, cz],
        width: CITY_LAYOUT_CONFIG.roadWidth,
        length,
        orientation: 'north-south',
        bounds: {
          minX: ax - halfRoad,
          maxX: ax + halfRoad,
          minZ: zStart,
          maxZ: zEnd,
        },
      });
    }
  });

  // 2. East-West Street Segments (between consecutive avenues)
  streetZs.forEach((sz, r) => {
    for (let c = 0; c < avenueXs.length - 1; c++) {
      const xStart = avenueXs[c] + halfRoad;
      const xEnd = avenueXs[c + 1] - halfRoad;
      const length = xEnd - xStart;
      const cx = (xStart + xEnd) / 2;

      segments.push({
        id: `road_ew_${r}_${c}`,
        center: [cx, sz],
        width: CITY_LAYOUT_CONFIG.roadWidth,
        length,
        orientation: 'east-west',
        bounds: {
          minX: xStart,
          maxX: xEnd,
          minZ: sz - halfRoad,
          maxZ: sz + halfRoad,
        },
      });
    }
  });

  return segments;
}

/**
 * Computes strictly aligned American continental crosswalks and stop lines
 * at each intersection approach threshold.
 */
export function getCityCrosswalks(): CrosswalkGeometry[] {
  const intersections = getCityIntersections();
  const halfRoad = CITY_LAYOUT_CONFIG.roadWidth / 2; // 5.0m
  const crosswalkDist = 1.5; // Distance from intersection edge to crosswalk center (placed within 3m corner sidewalk)
  const crosswalkWidth = 2.4; // 2.4m wide crosswalk corridor
  const stripeWidth = 0.5;   // 0.5m wide white stripe
  const stripeGap = 0.5;     // 0.5m spacing
  const stopBarDist = 2.6;   // Stop bar centered 2.6m behind crosswalk center (~4.1m from intersection)
  const roadSpan = CITY_LAYOUT_CONFIG.roadWidth - 1.2; // 8.8m striped span

  const minAvenueX = Math.min(...CITY_LAYOUT_CONFIG.grid.avenueXs);
  const maxAvenueX = Math.max(...CITY_LAYOUT_CONFIG.grid.avenueXs);
  const minStreetZ = Math.min(...CITY_LAYOUT_CONFIG.grid.streetZs);
  const maxStreetZ = Math.max(...CITY_LAYOUT_CONFIG.grid.streetZs);

  const crosswalks: CrosswalkGeometry[] = [];

  intersections.forEach((inter) => {
    const [cx, cz] = inter.center;

    // Only place crosswalk approaches where a road segment actually connects!
    const approaches: {
      approach: 'north' | 'south' | 'east' | 'west';
      center: [number, number];
      stripeDir: 'x' | 'z';
      stopCenter: [number, number];
      stopSize: [number, number];
    }[] = [];

    // North approach (only if a road extends North of this intersection)
    if (cz > minStreetZ) {
      approaches.push({
        approach: 'north',
        center: [cx, cz - halfRoad - crosswalkDist],
        stripeDir: 'z',
        stopCenter: [cx - 2.3, cz - halfRoad - crosswalkDist - stopBarDist],
        stopSize: [4.2, 0.45],
      });
    }

    // South approach (only if a road extends South of this intersection)
    if (cz < maxStreetZ) {
      approaches.push({
        approach: 'south',
        center: [cx, cz + halfRoad + crosswalkDist],
        stripeDir: 'z',
        stopCenter: [cx + 2.3, cz + halfRoad + crosswalkDist + stopBarDist],
        stopSize: [4.2, 0.45],
      });
    }

    // West approach (only if a road extends West of this intersection)
    if (cx > minAvenueX) {
      approaches.push({
        approach: 'west',
        center: [cx - halfRoad - crosswalkDist, cz],
        stripeDir: 'x',
        stopCenter: [cx - halfRoad - crosswalkDist - stopBarDist, cz + 2.3],
        stopSize: [0.45, 4.2],
      });
    }

    // East approach (only if a road extends East of this intersection)
    if (cx < maxAvenueX) {
      approaches.push({
        approach: 'east',
        center: [cx + halfRoad + crosswalkDist, cz],
        stripeDir: 'x',
        stopCenter: [cx + halfRoad + crosswalkDist + stopBarDist, cz - 2.3],
        stopSize: [0.45, 4.2],
      });
    }

    approaches.forEach((app) => {
      const stripes: { center: [number, number]; size: [number, number] }[] = [];
      const numStripes = 8;
      const step = stripeWidth + stripeGap; // 1.0m
      const startOffset = -((numStripes - 1) * step) / 2;

      for (let s = 0; s < numStripes; s++) {
        const offset = startOffset + s * step;
        if (app.stripeDir === 'z') {
          stripes.push({
            center: [app.center[0] + offset, app.center[1]],
            size: [stripeWidth, crosswalkWidth],
          });
        } else {
          stripes.push({
            center: [app.center[0], app.center[1] + offset],
            size: [crosswalkWidth, stripeWidth],
          });
        }
      }

      crosswalks.push({
        id: `cw_${inter.id}_${app.approach}`,
        intersectionId: inter.id,
        approach: app.approach,
        center: app.center,
        length: roadSpan,
        width: crosswalkWidth,
        stripeDirection: app.stripeDir,
        stripes,
        stopBar: {
          center: app.stopCenter,
          size: app.stopSize,
        },
      });
    });
  });

  return crosswalks;
}

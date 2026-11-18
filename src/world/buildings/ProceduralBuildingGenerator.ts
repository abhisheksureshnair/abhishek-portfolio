import * as THREE from 'three';
import { CityBlockData } from '../WorldConfig';
import { isCoordinateInProtectedDistrict } from './portfolioRegistry';

export type BuildingClass =
  | 'skyscraper-glass'
  | 'skyscraper-stepped'
  | 'commercial-midrise'
  | 'hotel-tower'
  | 'brick-storefront'
  | 'parking-structure'
  | 'civic-park';

export interface OuterBuildingInstance {
  id: string;
  blockId: string;
  buildingClass: BuildingClass;
  center: [number, number];       // [x, z]
  rotationY: number;

  // Base tier
  base: {
    dimensions: [number, number, number]; // [w, h, d]
    elevation: number;
    materialType: 'curtainGlass' | 'corporateGlass' | 'precastConcrete' | 'urbanBrick' | 'flutedStone';
  };

  // Setback upper tier (for skyscrapers & stepped towers)
  setback?: {
    dimensions: [number, number, number];
    elevation: number;
    materialType: 'curtainGlass' | 'corporateGlass' | 'precastConcrete' | 'structuralMetal';
  };

  // Rooftop mechanical penthouse (HVAC, chiller rooms, elevator bulkheads)
  roofEquipment?: {
    dimensions: [number, number, number];
    elevation: number;
    materialType: 'rooftopEquipment' | 'structuralMetal';
  };

  // Architectural antenna / crown spire
  spire?: {
    height: number;
    elevation: number;
    radius: number;
  };
}

/**
 * Deterministic pseudo-random number generator for reproducible procedural city generation
 */
function seededRandom(seed: number): () => number {
  let s = Math.sin(seed) * 10000;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Procedurally generates realistic outer city buildings for non-portfolio blocks
 */
export function generateOuterCityBuildings(blocks: CityBlockData[]): OuterBuildingInstance[] {
  const buildings: OuterBuildingInstance[] = [];

  blocks.forEach((block, index) => {
    // 1. STRICT PROTECTION CHECK: Never generate outer buildings in the 9 central portfolio blocks!
    if (isCoordinateInProtectedDistrict(block.center[0], block.center[1])) {
      return;
    }

    const rng = seededRandom(index * 7919 + 42);
    const bArea = block.buildableArea;
    const blockW = bArea.maxX - bArea.minX;
    const blockD = bArea.maxZ - bArea.minZ;
    const cx = block.center[0];
    const cz = block.center[1];

    // Distance from city center (0, 0) to determine urban density zoning
    const distFromCenter = Math.hypot(cx, cz);

    // Designate 2 outer blocks as open landscaped urban parks
    if (block.id === 'block-0-0' || block.id === 'block-4-4') {
      buildings.push({
        id: `bld-${block.id}-park`,
        blockId: block.id,
        buildingClass: 'civic-park',
        center: [cx, cz],
        rotationY: 0,
        base: {
          dimensions: [blockW - 1, 0.22, blockD - 1],
          elevation: 0.11,
          materialType: 'flutedStone',
        },
      });
      return;
    }

    // Zone 1: Immediate Downtown Perimeter Ring (High density skyscrapers)
    if (distFromCenter < 125) {
      const isStepped = rng() > 0.45;
      const height = 55 + rng() * 38; // 55m - 93m tall
      const w = Math.min(blockW - 4, 22 + rng() * 6);
      const d = Math.min(blockD - 4, 22 + rng() * 6);
      const rot = rng() > 0.5 ? 0 : Math.PI / 2;

      const baseH = isStepped ? height * 0.72 : height;
      const baseElev = baseH / 2 + 0.20;

      const building: OuterBuildingInstance = {
        id: `bld-${block.id}-tower`,
        blockId: block.id,
        buildingClass: isStepped ? 'skyscraper-stepped' : 'skyscraper-glass',
        center: [cx, cz],
        rotationY: rot,
        base: {
          dimensions: [w, baseH, d],
          elevation: baseElev,
          materialType: rng() > 0.35 ? 'curtainGlass' : 'corporateGlass',
        },
      };

      if (isStepped) {
        const setbackH = height * 0.28;
        const setbackW = w * 0.75;
        const setbackD = d * 0.75;
        const setbackElev = baseH + setbackH / 2 + 0.20;

        building.setback = {
          dimensions: [setbackW, setbackH, setbackD],
          elevation: setbackElev,
          materialType: 'corporateGlass',
        };

        // Rooftop mechanical penthouse
        const roofH = 5.5;
        const roofW = setbackW * 0.5;
        const roofD = setbackD * 0.5;
        building.roofEquipment = {
          dimensions: [roofW, roofH, roofD],
          elevation: baseH + setbackH + roofH / 2 + 0.20,
          materialType: 'rooftopEquipment',
        };

        // Antenna spire
        if (rng() > 0.35) {
          building.spire = {
            height: 14 + rng() * 12,
            elevation: baseH + setbackH + roofH + 0.20,
            radius: 0.35,
          };
        }
      } else {
        // Flat roof with mechanical penthouse
        const roofH = 6;
        const roofW = w * 0.55;
        const roofD = d * 0.55;
        building.roofEquipment = {
          dimensions: [roofW, roofH, roofD],
          elevation: baseH + roofH / 2 + 0.20,
          materialType: 'rooftopEquipment',
        };

        if (rng() > 0.5) {
          building.spire = {
            height: 12 + rng() * 10,
            elevation: baseH + roofH + 0.20,
            radius: 0.3,
          };
        }
      }

      buildings.push(building);
    }
    // Zone 2: Mid-Rise Commercial, Hotels & Parking Facilities
    else if (distFromCenter < 165) {
      const isDual = rng() > 0.4;

      if (!isDual) {
        // Single substantial commercial block
        const height = 24 + rng() * 22; // 24m - 46m
        const w = blockW - 4;
        const d = blockD - 4;

        buildings.push({
          id: `bld-${block.id}-comm`,
          blockId: block.id,
          buildingClass: 'commercial-midrise',
          center: [cx, cz],
          rotationY: 0,
          base: {
            dimensions: [w, height, d],
            elevation: height / 2 + 0.20,
            materialType: rng() > 0.5 ? 'precastConcrete' : 'flutedStone',
          },
          roofEquipment: {
            dimensions: [w * 0.4, 4.5, d * 0.4],
            elevation: height + 2.25 + 0.20,
            materialType: 'rooftopEquipment',
          },
        });
      } else {
        // Dual buildings per block (e.g. hotel tower + parking structure)
        const halfW = (blockW - 6) / 2;
        const d = blockD - 4;

        // Building A: Commercial / Hotel
        const hA = 28 + rng() * 16;
        buildings.push({
          id: `bld-${block.id}-a`,
          blockId: block.id,
          buildingClass: 'hotel-tower',
          center: [cx - halfW / 2 - 1, cz],
          rotationY: 0,
          base: {
            dimensions: [halfW, hA, d],
            elevation: hA / 2 + 0.20,
            materialType: 'precastConcrete',
          },
          roofEquipment: {
            dimensions: [halfW * 0.5, 4, d * 0.4],
            elevation: hA + 2 + 0.20,
            materialType: 'rooftopEquipment',
          },
        });

        // Building B: Modern Parking Structure / Retail Base
        const hB = 14 + rng() * 8;
        buildings.push({
          id: `bld-${block.id}-b`,
          blockId: block.id,
          buildingClass: 'parking-structure',
          center: [cx + halfW / 2 + 1, cz],
          rotationY: 0,
          base: {
            dimensions: [halfW, hB, d],
            elevation: hB / 2 + 0.20,
            materialType: 'precastConcrete',
          },
        });
      }
    }
    // Zone 3: Outer Neighborhood & Street-Level Mixed-Use Storefronts
    else {
      // 2-3 urban storefronts / apartment blocks per block
      const count = 2;
      const bW = (blockW - 6) / count;
      const bD = blockD - 4;

      for (let i = 0; i < count; i++) {
        const posX = bArea.minX + bW / 2 + i * (bW + 2) + 1;
        const h = 12 + rng() * 12; // 12m - 24m tall

        buildings.push({
          id: `bld-${block.id}-res-${i}`,
          blockId: block.id,
          buildingClass: 'brick-storefront',
          center: [posX, cz],
          rotationY: 0,
          base: {
            dimensions: [bW, h, bD],
            elevation: h / 2 + 0.20,
            materialType: i === 0 ? 'urbanBrick' : 'flutedStone',
          },
          roofEquipment: {
            dimensions: [bW * 0.45, 3.5, bD * 0.35],
            elevation: h + 1.75 + 0.20,
            materialType: 'rooftopEquipment',
          },
        });
      }
    }
  });

  return buildings;
}


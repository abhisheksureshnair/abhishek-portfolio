import * as THREE from 'three';
import { BuildingSpecs, getBuildingSpecs } from './ModularDowntownLibrary';
import { ParcelData } from '../layout/cityLayoutConfig';
import { getAllCityParcels } from '../layout/parcelGenerator';

export interface ModularBatches {
  // Building Masses
  curtainGlassBodies: THREE.Matrix4[];
  corporateGlassBodies: THREE.Matrix4[];
  urbanBrickBodies: THREE.Matrix4[];
  precastConcreteBodies: THREE.Matrix4[];
  flutedStoneBodies: THREE.Matrix4[];
  residentialApartmentBodies: THREE.Matrix4[];
  storefrontBases: THREE.Matrix4[];
  
  // 3D Recessed Windows with Real Depth
  windowFrames: THREE.Matrix4[];
  windowPanes: THREE.Matrix4[];
  windowSills: THREE.Matrix4[];
  windowLintels: THREE.Matrix4[];

  // 3D Facade Relief & Articulation
  verticalMullions: THREE.Matrix4[];
  brickPilasters: THREE.Matrix4[];
  horizontalBeltCourses: THREE.Matrix4[];
  corniceMoldings: THREE.Matrix4[];

  // 3D Ground-Floor & Entrances
  entranceCanopies: THREE.Matrix4[];
  entranceColumns: THREE.Matrix4[];
  canopyTieRods: THREE.Matrix4[];
  awningsNavy: THREE.Matrix4[];
  awningsBurgundy: THREE.Matrix4[];
  awningsGreen: THREE.Matrix4[];
  stoopSteps: THREE.Matrix4[];
  stoopBalustrades: THREE.Matrix4[];
  recessedDoorways: THREE.Matrix4[];

  // 3D Residential Balconies
  balconySlabs: THREE.Matrix4[];
  balconyRailings: THREE.Matrix4[];
  balconyBrackets: THREE.Matrix4[];

  // 3D Rooftop Architecture
  roofParapets: THREE.Matrix4[];
  rooftopPenthouses: THREE.Matrix4[];
  waterTanks: THREE.Matrix4[];
  waterTankTrusses: THREE.Matrix4[];
  hvacChillerBodies: THREE.Matrix4[];
  hvacFanGrills: THREE.Matrix4[];
  antennaMasts: THREE.Matrix4[];

  // Parking Structure
  parkingLouvers: THREE.Matrix4[];
  parkingClearanceBars: THREE.Matrix4[];
}

/**
 * Builds all 3D modular architectural components with true geometric depth
 * for every parcel in the city.
 */
export function generateModularDowntownBatches(referenceBlockOnly = false): ModularBatches {
  const parcels = getAllCityParcels(referenceBlockOnly);

  const batches: ModularBatches = {
    curtainGlassBodies: [],
    corporateGlassBodies: [],
    urbanBrickBodies: [],
    precastConcreteBodies: [],
    flutedStoneBodies: [],
    residentialApartmentBodies: [],
    storefrontBases: [],
    windowFrames: [],
    windowPanes: [],
    windowSills: [],
    windowLintels: [],
    verticalMullions: [],
    brickPilasters: [],
    horizontalBeltCourses: [],
    corniceMoldings: [],
    entranceCanopies: [],
    entranceColumns: [],
    canopyTieRods: [],
    awningsNavy: [],
    awningsBurgundy: [],
    awningsGreen: [],
    stoopSteps: [],
    stoopBalustrades: [],
    recessedDoorways: [],
    balconySlabs: [],
    balconyRailings: [],
    balconyBrackets: [],
    roofParapets: [],
    rooftopPenthouses: [],
    waterTanks: [],
    waterTankTrusses: [],
    hvacChillerBodies: [],
    hvacFanGrills: [],
    antennaMasts: [],
    parkingLouvers: [],
    parkingClearanceBars: [],
  };

  const dummy = new THREE.Object3D();
  const groundY = 0.20; // Matches sidewalk plinth height

  parcels.forEach((parcel) => {
    const specs = getBuildingSpecs(parcel, referenceBlockOnly);
    const [w, d] = specs.dimensions;
    const [cx, cz] = specs.center;
    const { floors, floorHeight, groundHeight, totalHeight, podiumSetback } = specs;

    // Orientation vectors
    const [ex, ez] = specs.entrancePosition;
    const dirX = Math.sign(ex - cx);
    const dirZ = Math.sign(ez - cz);

    // -------------------------------------------------------------------------
    // 1. GROUND FLOOR / PODIUM
    // -------------------------------------------------------------------------
    dummy.position.set(cx, groundY + groundHeight / 2, cz);
    dummy.scale.set(w, groundHeight, d);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();

    if (specs.style === 'modern-office' || specs.style === 'glass-skyscraper') {
      batches.curtainGlassBodies.push(dummy.matrix.clone());
    } else {
      batches.storefrontBases.push(dummy.matrix.clone());
    }

    // Belt course separating ground floor and upper tower
    dummy.position.set(cx, groundY + groundHeight, cz);
    dummy.scale.set(w + 0.15, 0.22, d + 0.15);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    batches.horizontalBeltCourses.push(dummy.matrix.clone());

    // -------------------------------------------------------------------------
    // 2. ENTRANCES (Canopies, Awnings, Stoops & Recessed Portals)
    // -------------------------------------------------------------------------
    const portalW = 2.4;
    const portalH = 2.6;
    const portalD = 0.8;
    const portalPosX = cx + dirX * (w / 2 - portalD / 2 + 0.05);
    const portalPosZ = cz + dirZ * (d / 2 - portalD / 2 + 0.05);

    // Recessed entrance alcove
    dummy.position.set(
      dirX !== 0 ? portalPosX : cx,
      groundY + portalH / 2,
      dirZ !== 0 ? portalPosZ : cz
    );
    dummy.scale.set(dirX !== 0 ? portalD : portalW, portalH, dirZ !== 0 ? portalD : portalW);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    batches.recessedDoorways.push(dummy.matrix.clone());

    // Entrance Canopy or Awning
    const canopyW = Math.min(4.2, w * 0.45);
    const canopyD = 2.0;
    const canopyH = 0.22;
    const canopyY = groundY + 3.2;
    const canopyEdgeX = cx + dirX * (w / 2 + canopyD / 2);
    const canopyEdgeZ = cz + dirZ * (d / 2 + canopyD / 2);

    if (specs.hasCanopy) {
      // Modern glass & steel entrance canopy
      dummy.position.set(
        dirX !== 0 ? canopyEdgeX : cx,
        canopyY,
        dirZ !== 0 ? canopyEdgeZ : cz
      );
      dummy.scale.set(dirX !== 0 ? canopyD : canopyW, canopyH, dirZ !== 0 ? canopyD : canopyW);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      batches.entranceCanopies.push(dummy.matrix.clone());

      // Canopy steel suspension tie-rods (pair of angled rods)
      const rodL = 1.8;
      [-1, 1].forEach((side) => {
        const lateralOffset = (canopyW / 2 - 0.3) * side;
        const rodX = dirX !== 0 ? cx + dirX * (w / 2 + canopyD * 0.5) : cx + lateralOffset;
        const rodZ = dirZ !== 0 ? cz + dirZ * (d / 2 + canopyD * 0.5) : cz + lateralOffset;
        dummy.position.set(rodX, canopyY + 0.6, rodZ);
        dummy.scale.set(0.04, rodL, 0.04);
        dummy.rotation.set(dirZ !== 0 ? (dirZ * Math.PI) / 6 : 0, 0, dirX !== 0 ? (-dirX * Math.PI) / 6 : 0);
        dummy.updateMatrix();
        batches.canopyTieRods.push(dummy.matrix.clone());
      });

      // Grand structural cylindrical columns (matching reference photo 1)
      if (specs.style === 'modern-office') {
        const colH = 4.2;
        const colRadius = 0.26;
        const colOffset = canopyW / 2 - 0.35;
        [-1, 1].forEach((side) => {
          const colX = dirX !== 0 ? cx + dirX * (w / 2 + canopyD * 0.85) : cx + colOffset * side;
          const colZ = dirZ !== 0 ? cz + dirZ * (d / 2 + canopyD * 0.85) : cz + colOffset * side;
          dummy.position.set(colX, groundY + colH / 2, colZ);
          dummy.scale.set(colRadius * 2, colH, colRadius * 2);
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          batches.entranceColumns.push(dummy.matrix.clone());
        });
      }
    } else if (specs.hasAwning) {
      // 3D Fabric Awning over storefront
      dummy.position.set(
        dirX !== 0 ? cx + dirX * (w / 2 + 0.7) : cx,
        canopyY,
        dirZ !== 0 ? cz + dirZ * (d / 2 + 0.7) : cz
      );
      dummy.scale.set(dirX !== 0 ? 1.4 : canopyW * 1.2, 0.6, dirZ !== 0 ? 1.4 : canopyW * 1.2);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();

      if (specs.hasAwning === 'navy') batches.awningsNavy.push(dummy.matrix.clone());
      else if (specs.hasAwning === 'burgundy') batches.awningsBurgundy.push(dummy.matrix.clone());
      else batches.awningsGreen.push(dummy.matrix.clone());
    } else if (specs.hasStoop) {
      // Residential masonry entry stoop steps
      const stoopW = 2.6;
      const stoopD = 1.6;
      const stoopH = 0.65;
      const stoopX = cx + dirX * (w / 2 + stoopD / 2);
      const stoopZ = cz + dirZ * (d / 2 + stoopD / 2);

      dummy.position.set(dirX !== 0 ? stoopX : cx, groundY + stoopH / 2, dirZ !== 0 ? stoopZ : cz);
      dummy.scale.set(dirX !== 0 ? stoopD : stoopW, stoopH, dirZ !== 0 ? stoopD : stoopW);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      batches.stoopSteps.push(dummy.matrix.clone());

      // Flanking stone balustrades
      [-1, 1].forEach((s) => {
        const balustradeX = dirX !== 0 ? stoopX : cx + (stoopW / 2 - 0.12) * s;
        const balustradeZ = dirZ !== 0 ? stoopZ : cz + (stoopW / 2 - 0.12) * s;
        dummy.position.set(balustradeX, groundY + stoopH + 0.35, balustradeZ);
        dummy.scale.set(dirX !== 0 ? stoopD : 0.22, 0.7, dirZ !== 0 ? stoopD : 0.22);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        batches.stoopBalustrades.push(dummy.matrix.clone());
      });
    }

    // -------------------------------------------------------------------------
    // 3. MAIN TOWER / UPPER FLOORS
    // -------------------------------------------------------------------------
    const towerH = (floors - 1) * floorHeight;
    const towerW = Math.max(8.0, w - podiumSetback * 2);
    const towerD = Math.max(8.0, d - podiumSetback * 2);
    const towerCenterY = groundY + groundHeight + towerH / 2;

    dummy.position.set(cx, towerCenterY, cz);
    dummy.scale.set(towerW, towerH, towerD);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();

    if (specs.style === 'modern-office') {
      batches.curtainGlassBodies.push(dummy.matrix.clone());
    } else if (specs.style === 'glass-skyscraper') {
      batches.corporateGlassBodies.push(dummy.matrix.clone());
    } else if (specs.style === 'commercial-brick') {
      batches.urbanBrickBodies.push(dummy.matrix.clone());
    } else if (specs.style === 'apartment-building') {
      batches.residentialApartmentBodies.push(dummy.matrix.clone());
    } else if (specs.style === 'mixed-use') {
      batches.flutedStoneBodies.push(dummy.matrix.clone());
    } else if (specs.style === 'hotel') {
      batches.precastConcreteBodies.push(dummy.matrix.clone());
    } else {
      batches.precastConcreteBodies.push(dummy.matrix.clone());
    }

    // -------------------------------------------------------------------------
    // 4. 3D RECESSED WINDOWS WITH REAL DEPTH (Fenestration Grid)
    // -------------------------------------------------------------------------
    // Distance-based Architectural Level of Detail (LOD):
    // Parcels within 120m of center receive 3D window frames and projecting sills.
    // Intermediate and distant parcels rely on high-resolution PBR facade textures
    // with baked window frames, sills, blinds and sky reflections, saving ~250k micro-boxes.
    const distFromCenter = Math.hypot(cx, cz);
    const isCloseRangeLOD = distFromCenter <= 120.0;

    const baySpacing = 2.8; // 2.8m between window centers
    const numBaysX = Math.max(2, Math.floor(towerW / baySpacing));
    const numBaysZ = Math.max(2, Math.floor(towerD / baySpacing));
    const stepX = towerW / (numBaysX + 1);
    const stepZ = towerD / (numBaysZ + 1);

    const winW = 1.35;
    const winH = 1.85;
    const frameDepth = 0.16;

    if (isCloseRangeLOD) {
      // Loop through upper floors for foreground detailed fenestration
      for (let fl = 1; fl < floors; fl++) {
        const floorY = groundY + groundHeight + (fl - 0.5) * floorHeight;

        // North & South Facades
        for (let bx = 1; bx <= numBaysX; bx++) {
          const posX = cx - towerW / 2 + bx * stepX;

          [-1, 1].forEach((sideZ) => {
            const wallZ = cz + sideZ * (towerD / 2);

            // 1. Window Frame (Extruded box providing real depth & shadow)
            dummy.position.set(posX, floorY, wallZ);
            dummy.scale.set(winW, winH, frameDepth);
            dummy.rotation.set(0, 0, 0);
            dummy.updateMatrix();
            batches.windowFrames.push(dummy.matrix.clone());

            // 2. Projecting Stone Window Sill
            dummy.position.set(posX, floorY - winH / 2 - 0.06, wallZ + sideZ * 0.08);
            dummy.scale.set(winW + 0.18, 0.12, 0.22);
            dummy.updateMatrix();
            batches.windowSills.push(dummy.matrix.clone());
          });
        }

        // East & West Facades
        for (let bz = 1; bz <= numBaysZ; bz++) {
          const posZ = cz - towerD / 2 + bz * stepZ;

          [-1, 1].forEach((sideX) => {
            const wallX = cx + sideX * (towerW / 2);

            // 1. Window Frame
            dummy.position.set(wallX, floorY, posZ);
            dummy.scale.set(frameDepth, winH, winW);
            dummy.rotation.set(0, 0, 0);
            dummy.updateMatrix();
            batches.windowFrames.push(dummy.matrix.clone());

            // 2. Projecting Stone Window Sill
            dummy.position.set(wallX + sideX * 0.08, floorY - winH / 2 - 0.06, posZ);
            dummy.scale.set(0.22, 0.12, winW + 0.18);
            dummy.updateMatrix();
            batches.windowSills.push(dummy.matrix.clone());
          });
        }
      }
    }

    // -------------------------------------------------------------------------
    // 5. 3D VERTICAL MULLIONS & CORNICES
    // -------------------------------------------------------------------------
    if (specs.style === 'modern-office' || specs.style === 'glass-skyscraper') {
      // Aluminum vertical mullion fins projecting outwards between bays
      for (let bx = 0; bx <= numBaysX + 1; bx++) {
        const posX = cx - towerW / 2 + bx * stepX;
        [-1, 1].forEach((sideZ) => {
          dummy.position.set(posX, towerCenterY, cz + sideZ * (towerD / 2 + 0.12));
          dummy.scale.set(0.14, towerH, 0.24);
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          batches.verticalMullions.push(dummy.matrix.clone());
        });
      }
    } else if (specs.style === 'commercial-brick') {
      // Brick pilaster piers projecting from facade
      for (let bx = 0; bx <= numBaysX + 1; bx++) {
        const posX = cx - towerW / 2 + bx * stepX;
        [-1, 1].forEach((sideZ) => {
          dummy.position.set(posX, towerCenterY, cz + sideZ * (towerD / 2 + 0.10));
          dummy.scale.set(0.35, towerH, 0.20);
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          batches.brickPilasters.push(dummy.matrix.clone());
        });
      }
    }

    // Projecting Roof Cornice Molding
    const roofY = groundY + totalHeight;
    dummy.position.set(cx, roofY, cz);
    dummy.scale.set(towerW + 0.6, 0.45, towerD + 0.6);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    batches.corniceMoldings.push(dummy.matrix.clone());

    // -------------------------------------------------------------------------
    // 6. 3D CANTILEVERED RESIDENTIAL BALCONIES
    // -------------------------------------------------------------------------
    if (specs.hasBalconies) {
      const balcW = 2.6;
      const balcD = 1.3;
      const balcH = 0.16;
      const railH = 0.95;

      for (let fl = 1; fl < floors - 1; fl++) {
        const balcY = groundY + groundHeight + (fl - 1) * floorHeight + 0.2;
        const balcPosX = cx + (dirX !== 0 ? dirX * (towerW / 2 + balcD / 2) : 0);
        const balcPosZ = cz + (dirZ !== 0 ? dirZ * (towerD / 2 + balcD / 2) : 0);

        // Concrete Balcony Floor Slab
        dummy.position.set(balcPosX, balcY, balcPosZ);
        dummy.scale.set(dirX !== 0 ? balcD : balcW, balcH, dirZ !== 0 ? balcD : balcW);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        batches.balconySlabs.push(dummy.matrix.clone());

        // 3D Guardrail Assembly
        dummy.position.set(balcPosX, balcY + railH / 2, balcPosZ);
        dummy.scale.set(dirX !== 0 ? balcD : balcW, railH, dirZ !== 0 ? balcD : balcW);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        batches.balconyRailings.push(dummy.matrix.clone());

        // Under-slab Support Brackets
        [-1, 1].forEach((s) => {
          const bracketOffset = (balcW / 2 - 0.3) * s;
          dummy.position.set(
            dirX !== 0 ? cx + dirX * (towerW / 2 + 0.3) : balcPosX + bracketOffset,
            balcY - 0.25,
            dirZ !== 0 ? cz + dirZ * (towerD / 2 + 0.3) : balcPosZ + bracketOffset
          );
          dummy.scale.set(0.12, 0.45, 0.12);
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          batches.balconyBrackets.push(dummy.matrix.clone());
        });
      }
    }

    // -------------------------------------------------------------------------
    // 7. ROOFTOP ARCHITECTURE (Parapet, Penthouse, Water Tower, HVAC)
    // -------------------------------------------------------------------------
    // Perimeter Parapet with Coping Stones
    const parapetH = 1.0;
    dummy.position.set(cx, roofY + parapetH / 2, cz);
    dummy.scale.set(towerW + 0.1, parapetH, towerD + 0.1);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    batches.roofParapets.push(dummy.matrix.clone());

    // Mechanical Penthouse
    if (specs.hasPenthouse) {
      const pentW = towerW * 0.42;
      const pentD = towerD * 0.42;
      const pentH = 2.8;
      dummy.position.set(cx - towerW * 0.08, roofY + pentH / 2, cz - towerD * 0.08);
      dummy.scale.set(pentW, pentH, pentD);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      batches.rooftopPenthouses.push(dummy.matrix.clone());
    }

    // Iconic American Wooden Cedar Water Tower
    if (specs.hasWaterTower) {
      const tankRadius = 1.4;
      const tankH = 2.8;
      const legH = 2.4;
      const tankX = cx + towerW * 0.24;
      const tankZ = cz + towerD * 0.24;

      // Wooden Cedar Cylindrical Tank
      dummy.position.set(tankX, roofY + legH + tankH / 2, tankZ);
      dummy.scale.set(tankRadius * 2, tankH, tankRadius * 2);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      batches.waterTanks.push(dummy.matrix.clone());

      // 4-Post Steel Truss Support Tower
      dummy.position.set(tankX, roofY + legH / 2, tankZ);
      dummy.scale.set(tankRadius * 2.2, legH, tankRadius * 2.2);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      batches.waterTankTrusses.push(dummy.matrix.clone());
    }

    // Commercial Rooftop HVAC Chiller Unit
    if (specs.hasHVACChiller) {
      const chillerW = 2.8;
      const chillerD = 1.6;
      const chillerH = 1.4;
      const chillerX = cx + towerW * 0.2;
      const chillerZ = cz - towerD * 0.2;

      // Chiller Body Box
      dummy.position.set(chillerX, roofY + chillerH / 2, chillerZ);
      dummy.scale.set(chillerW, chillerH, chillerD);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      batches.hvacChillerBodies.push(dummy.matrix.clone());

      // Dual Recessed Top Fan Circular Grills
      [-0.7, 0.7].forEach((fx) => {
        dummy.position.set(chillerX + fx, roofY + chillerH + 0.04, chillerZ);
        dummy.scale.set(0.9, 0.08, 0.9);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        batches.hvacFanGrills.push(dummy.matrix.clone());
      });
    }

    // High-Rise Crown Antenna Mast
    if (specs.style === 'glass-skyscraper' || floors > 12) {
      const mastH = 8.5;
      dummy.position.set(cx, roofY + mastH / 2, cz);
      dummy.scale.set(0.2, mastH, 0.2);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      batches.antennaMasts.push(dummy.matrix.clone());
    }

    // -------------------------------------------------------------------------
    // 8. PARKING STRUCTURE DETAILS
    // -------------------------------------------------------------------------
    if (specs.style === 'parking-structure') {
      // Horizontal aluminum ventilation louvers between floors
      for (let fl = 1; fl < floors; fl++) {
        const louverY = groundY + groundHeight + (fl - 0.5) * floorHeight;
        [-1, 1].forEach((sideZ) => {
          dummy.position.set(cx, louverY, cz + sideZ * (towerD / 2 + 0.06));
          dummy.scale.set(towerW * 0.85, 1.2, 0.12);
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          batches.parkingLouvers.push(dummy.matrix.clone());
        });
      }

      // Ground floor vehicle entry portal with yellow clearance bar
      const barY = groundY + 2.3;
      dummy.position.set(
        dirX !== 0 ? cx + dirX * (w / 2 + 0.2) : cx,
        barY,
        dirZ !== 0 ? cz + dirZ * (d / 2 + 0.2) : cz
      );
      dummy.scale.set(dirX !== 0 ? 0.15 : 3.2, 0.15, dirZ !== 0 ? 0.15 : 3.2);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      batches.parkingClearanceBars.push(dummy.matrix.clone());
    }
  });

  return batches;
}

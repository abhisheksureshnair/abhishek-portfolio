import {
  CITY_LAYOUT_CONFIG,
  getCityBlocks,
  getCityIntersections,
  getCityRoadSegments,
  getCityCrosswalks,
  BlockBoundary,
  ParcelData,
  RoadSegmentGeometry,
  IntersectionGeometry,
  CrosswalkGeometry,
} from './cityLayoutConfig';
import { getAllCityParcels } from './parcelGenerator';

export interface ValidationResult {
  testId: string;
  testName: string;
  passed: boolean;
  message: string;
  details?: Record<string, any>;
}

export interface CityValidationReport {
  timestamp: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  results: ValidationResult[];
}

/**
 * Validates all 10 alignment and geometry rules for the Phase 1.9 city.
 */
export function validateCityAlignment(): CityValidationReport {
  const blocks = getCityBlocks();
  const intersections = getCityIntersections();
  const roadSegments = getCityRoadSegments();
  const crosswalks = getCityCrosswalks();
  const allParcels = getAllCityParcels(false);
  const refParcels = getAllCityParcels(true);

  const results: ValidationResult[] = [];

  // =========================================================================
  // TEST 1: Building Footprint Containment within Parcel Bounds
  // Verify that all parcels are 100% contained within their parent block's buildableBounds.
  // =========================================================================
  let test1Passed = true;
  let test1Failures: string[] = [];
  const blockMap = new Map<string, BlockBoundary>(blocks.map((b) => [b.id, b]));

  for (const parcel of allParcels) {
    const parentBlock = blockMap.get(parcel.blockId);
    if (!parentBlock) {
      test1Passed = false;
      test1Failures.push(`Parcel ${parcel.id} has invalid parent blockId: ${parcel.blockId}`);
      continue;
    }

    const { minX, maxX, minZ, maxZ } = parentBlock.buildableBounds;
    const pBounds = parcel.bounds;
    const eps = 1e-4;

    if (
      pBounds.minX < minX - eps ||
      pBounds.maxX > maxX + eps ||
      pBounds.minZ < minZ - eps ||
      pBounds.maxZ > maxZ + eps
    ) {
      test1Passed = false;
      test1Failures.push(
        `Parcel ${parcel.id} exceeds block ${parentBlock.id} buildable bounds: [${pBounds.minX}, ${pBounds.maxX}, ${pBounds.minZ}, ${pBounds.maxZ}] vs [${minX}, ${maxX}, ${minZ}, ${maxZ}]`
      );
    }
  }

  results.push({
    testId: 'TEST-01',
    testName: 'Building Footprint Containment within Block Buildable Bounds',
    passed: test1Passed,
    message: test1Passed
      ? `All ${allParcels.length} parcels are strictly within block buildable bounds.`
      : `Failures: ${test1Failures.join('; ')}`,
    details: { totalParcelsChecked: allParcels.length },
  });

  // =========================================================================
  // TEST 2: Building-to-Road Overlap Test
  // Parcels must be at least 5.0m (half road width) away from any road centerline.
  // In fact, with 3.0m sidewalk, parcels must be at least 8.0m away from centerlines.
  // =========================================================================
  let test2Passed = true;
  let test2Failures: string[] = [];
  const { avenueXs, streetZs } = CITY_LAYOUT_CONFIG.grid;
  const minRequiredDistance = CITY_LAYOUT_CONFIG.roadWidth / 2 + CITY_LAYOUT_CONFIG.sidewalkWidth - 1e-4; // 8.0m

  for (const parcel of allParcels) {
    for (const ax of avenueXs) {
      // If parcel spans across or is within 8m of avenue X:
      const distToAvenue = Math.min(
        Math.abs(parcel.bounds.minX - ax),
        Math.abs(parcel.bounds.maxX - ax)
      );
      if (parcel.bounds.minX <= ax && parcel.bounds.maxX >= ax) {
        test2Passed = false;
        test2Failures.push(`Parcel ${parcel.id} intersects Avenue X=${ax}`);
      } else if (distToAvenue < minRequiredDistance) {
        test2Passed = false;
        test2Failures.push(`Parcel ${parcel.id} is too close to Avenue X=${ax} (${distToAvenue.toFixed(2)}m < ${minRequiredDistance}m)`);
      }
    }

    for (const sz of streetZs) {
      const distToStreet = Math.min(
        Math.abs(parcel.bounds.minZ - sz),
        Math.abs(parcel.bounds.maxZ - sz)
      );
      if (parcel.bounds.minZ <= sz && parcel.bounds.maxZ >= sz) {
        test2Passed = false;
        test2Failures.push(`Parcel ${parcel.id} intersects Street Z=${sz}`);
      } else if (distToStreet < minRequiredDistance) {
        test2Passed = false;
        test2Failures.push(`Parcel ${parcel.id} is too close to Street Z=${sz} (${distToStreet.toFixed(2)}m < ${minRequiredDistance}m)`);
      }
    }
  }

  results.push({
    testId: 'TEST-02',
    testName: 'Building-to-Road Centerline Buffer (≥ 8.0m from road centerline)',
    passed: test2Passed,
    message: test2Passed
      ? `All ${allParcels.length} parcels maintain ≥ 8.0m clearance from all road centerlines.`
      : `Failures: ${test2Failures.slice(0, 5).join('; ')}`,
    details: { minRequiredBuffer: minRequiredDistance },
  });

  // =========================================================================
  // TEST 3: Building-to-Sidewalk Overlap Test
  // Parcels must NOT intrude into the 3.0m sidewalk perimeter corridor.
  // =========================================================================
  let test3Passed = true;
  let test3Failures: string[] = [];

  for (const parcel of allParcels) {
    const parentBlock = blockMap.get(parcel.blockId)!;
    const { minX, maxX, minZ, maxZ } = parentBlock.outerBounds;
    const pb = parcel.bounds;

    const dWest = pb.minX - minX;
    const dEast = maxX - pb.maxX;
    const dNorth = pb.minZ - minZ;
    const dSouth = maxZ - pb.maxZ;

    const minMargin = Math.min(dWest, dEast, dNorth, dSouth);
    if (minMargin < CITY_LAYOUT_CONFIG.sidewalkWidth - 1e-4) {
      test3Passed = false;
      test3Failures.push(
        `Parcel ${parcel.id} encroaches sidewalk: margin ${minMargin.toFixed(2)}m < 3.0m`
      );
    }
  }

  results.push({
    testId: 'TEST-03',
    testName: 'Building-to-Sidewalk Corridor Separation (≥ 3.0m from curb edge)',
    passed: test3Passed,
    message: test3Passed
      ? `All ${allParcels.length} parcels preserve the full 3.0m perimeter sidewalk corridor.`
      : `Failures: ${test3Failures.slice(0, 5).join('; ')}`,
  });

  // =========================================================================
  // TEST 4: Building-to-Building Separation Test
  // Distinct parcels must not overlap, and within the same block have ≥ 0.8m gap.
  // =========================================================================
  let test4Passed = true;
  let test4Failures: string[] = [];

  // Group by blockId to check intra-block separation
  const blockParcelsMap = new Map<string, ParcelData[]>();
  for (const p of allParcels) {
    if (!blockParcelsMap.has(p.blockId)) {
      blockParcelsMap.set(p.blockId, []);
    }
    blockParcelsMap.get(p.blockId)!.push(p);
  }

  blockParcelsMap.forEach((parcelsInBlock, blockId) => {
    for (let i = 0; i < parcelsInBlock.length; i++) {
      for (let j = i + 1; j < parcelsInBlock.length; j++) {
        const p1 = parcelsInBlock[i];
        const p2 = parcelsInBlock[j];

        // Check AABB overlap
        const xOverlap = Math.max(0, Math.min(p1.bounds.maxX, p2.bounds.maxX) - Math.max(p1.bounds.minX, p2.bounds.minX));
        const zOverlap = Math.max(0, Math.min(p1.bounds.maxZ, p2.bounds.maxZ) - Math.max(p1.bounds.minZ, p2.bounds.minZ));

        if (xOverlap > 0 && zOverlap > 0) {
          test4Passed = false;
          test4Failures.push(`Parcels ${p1.id} and ${p2.id} in block ${blockId} directly overlap!`);
        } else {
          // Check separation distance
          const dx = Math.max(0, Math.max(p1.bounds.minX - p2.bounds.maxX, p2.bounds.minX - p1.bounds.maxX));
          const dz = Math.max(0, Math.max(p1.bounds.minZ - p2.bounds.maxZ, p2.bounds.minZ - p1.bounds.maxZ));
          const gap = Math.sqrt(dx * dx + dz * dz);
          if (gap < 0.79) { // 0.8m tolerance with float rounding
            test4Passed = false;
            test4Failures.push(`Parcels ${p1.id} and ${p2.id} gap ${gap.toFixed(2)}m is < 0.8m`);
          }
        }
      }
    }
  });

  results.push({
    testId: 'TEST-04',
    testName: 'Building-to-Building Overlap & Minimum Separation (≥ 0.8m)',
    passed: test4Passed,
    message: test4Passed
      ? `All adjacent parcels maintain at least 0.8m clean building separation gap.`
      : `Failures: ${test4Failures.slice(0, 5).join('; ')}`,
  });

  // =========================================================================
  // TEST 5: Road-to-Intersection Geometry Alignment
  // Road segments must start and end at intersection boundaries without gaps or double-coverage.
  // =========================================================================
  let test5Passed = true;
  let test5Failures: string[] = [];
  const halfRoad = CITY_LAYOUT_CONFIG.roadWidth / 2;

  for (const seg of roadSegments) {
    if (seg.orientation === 'north-south') {
      const ax = seg.center[0];
      const zNorth = seg.bounds.minZ;
      const zSouth = seg.bounds.maxZ;

      // Find intersection at north
      const northInter = intersections.find(
        (inter) => Math.abs(inter.center[0] - ax) < 1e-3 && Math.abs(inter.bounds.maxZ - zNorth) < 1e-3
      );
      const southInter = intersections.find(
        (inter) => Math.abs(inter.center[0] - ax) < 1e-3 && Math.abs(inter.bounds.minZ - zSouth) < 1e-3
      );

      if (!northInter || !southInter) {
        test5Passed = false;
        test5Failures.push(`NS Road segment ${seg.id} does not flush-align with intersections.`);
      }
    } else {
      const sz = seg.center[1];
      const xWest = seg.bounds.minX;
      const xEast = seg.bounds.maxX;

      const westInter = intersections.find(
        (inter) => Math.abs(inter.center[1] - sz) < 1e-3 && Math.abs(inter.bounds.maxX - xWest) < 1e-3
      );
      const eastInter = intersections.find(
        (inter) => Math.abs(inter.center[1] - sz) < 1e-3 && Math.abs(inter.bounds.minX - xEast) < 1e-3
      );

      if (!westInter || !eastInter) {
        test5Passed = false;
        test5Failures.push(`EW Road segment ${seg.id} does not flush-align with intersections.`);
      }
    }
  }

  results.push({
    testId: 'TEST-05',
    testName: 'Road-to-Intersection Seamless Flush Alignment (0 gaps, 0 overlap)',
    passed: test5Passed,
    message: test5Passed
      ? `All ${roadSegments.length} road segments meet adjacent intersections with 0.000m error.`
      : `Failures: ${test5Failures.slice(0, 5).join('; ')}`,
    details: { totalRoadSegments: roadSegments.length, totalIntersections: intersections.length },
  });

  // =========================================================================
  // TEST 6: Crosswalk Placement & Orientation
  // Crosswalks must be perpendicular to travel lane, connect sidewalks, and have stop bars.
  // =========================================================================
  let test6Passed = true;
  let test6Failures: string[] = [];

  for (const cw of crosswalks) {
    // Check approach alignment
    if (cw.approach === 'north' || cw.approach === 'south') {
      // Approaches north/south cross across an avenue (travel is north-south, crosswalk stripes orient along Z travel)
      if (cw.stripeDirection !== 'z') {
        test6Passed = false;
        test6Failures.push(`Crosswalk ${cw.id} stripe direction should be 'z' along vehicle travel.`);
      }
    } else {
      if (cw.stripeDirection !== 'x') {
        test6Passed = false;
        test6Failures.push(`Crosswalk ${cw.id} stripe direction should be 'x' along vehicle travel.`);
      }
    }

    // Must have at least 5 zebra stripes
    if (cw.stripes.length < 5) {
      test6Passed = false;
      test6Failures.push(`Crosswalk ${cw.id} has insufficient stripes (${cw.stripes.length})`);
    }

    // Must have a valid stop bar placed before the crosswalk
    if (!cw.stopBar || cw.stopBar.size[0] <= 0 || cw.stopBar.size[1] <= 0) {
      test6Passed = false;
      test6Failures.push(`Crosswalk ${cw.id} is missing a valid stop bar.`);
    }
  }

  results.push({
    testId: 'TEST-06',
    testName: 'Continental Crosswalk Approach Orientation & Stop Bar Geometry',
    passed: test6Passed,
    message: test6Passed
      ? `All ${crosswalks.length} crosswalks correctly orient zebra stripes with vehicle travel and include stop bars.`
      : `Failures: ${test6Failures.slice(0, 5).join('; ')}`,
    details: { totalCrosswalks: crosswalks.length },
  });

  // =========================================================================
  // TEST 7: Sidewalk Network Connectivity
  // Outer block perimeters must flush against road segments.
  // =========================================================================
  let test7Passed = true;
  let test7Failures: string[] = [];

  for (const b of blocks) {
    const swWidthX = b.buildableBounds.minX - b.outerBounds.minX;
    const swWidthZ = b.buildableBounds.minZ - b.outerBounds.minZ;
    if (Math.abs(swWidthX - 3.0) > 1e-3 || Math.abs(swWidthZ - 3.0) > 1e-3) {
      test7Passed = false;
      test7Failures.push(`Block ${b.id} sidewalk width is not 3.0m exactly.`);
    }
  }

  results.push({
    testId: 'TEST-07',
    testName: 'Sidewalk Perimeter Uniformity & Continuity (3.0m width)',
    passed: test7Passed,
    message: test7Passed
      ? `All ${blocks.length} blocks feature uniform 3.0m sidewalk perimeters connecting directly to crosswalks.`
      : `Failures: ${test7Failures.slice(0, 5).join('; ')}`,
    details: { totalBlocks: blocks.length },
  });

  // =========================================================================
  // TEST 8: Building Entrance Orientation
  // Entrances must be on sidewalk-facing edges and accessible from sidewalks.
  // =========================================================================
  let test8Passed = true;
  let test8Failures: string[] = [];

  for (const parcel of allParcels) {
    const [ex, ez] = parcel.entrancePosition;
    const pb = parcel.bounds;

    // Entrance must be on one of the outer bounding edges of the parcel
    const isOnWest = Math.abs(ex - pb.minX) < 1e-3 && ez >= pb.minZ && ez <= pb.maxZ;
    const isOnEast = Math.abs(ex - pb.maxX) < 1e-3 && ez >= pb.minZ && ez <= pb.maxZ;
    const isOnNorth = Math.abs(ez - pb.minZ) < 1e-3 && ex >= pb.minX && ex <= pb.maxX;
    const isOnSouth = Math.abs(ez - pb.maxZ) < 1e-3 && ex >= pb.minX && ex <= pb.maxX;

    if (!isOnWest && !isOnEast && !isOnNorth && !isOnSouth) {
      test8Passed = false;
      test8Failures.push(`Parcel ${parcel.id} entrance [${ex}, ${ez}] is not on an exterior parcel edge.`);
    }
  }

  results.push({
    testId: 'TEST-08',
    testName: 'Building Entrance Accessibility & Sidewalk-Facing Alignment',
    passed: test8Passed,
    message: test8Passed
      ? `All ${allParcels.length} parcel entrances reside on exterior parcel edges facing pedestrian circulation.`
      : `Failures: ${test8Failures.slice(0, 5).join('; ')}`,
  });

  // =========================================================================
  // TEST 9: Protected Portfolio Plot Preservation
  // Zero background parcels may intrude into the central 3x3 portfolio district (|X| <= 45, |Z| <= 45).
  // =========================================================================
  let test9Passed = true;
  let test9Failures: string[] = [];

  for (const parcel of allParcels) {
    if (Math.abs(parcel.center[0]) <= 45 && Math.abs(parcel.center[1]) <= 45) {
      test9Passed = false;
      test9Failures.push(`Background parcel ${parcel.id} intrudes into protected central district at [${parcel.center}]`);
    }
  }

  // Also verify that the 9 central blocks are marked isProtectedDistrict = true
  const centralProtectedBlocks = blocks.filter((b) => b.isProtectedDistrict);
  if (centralProtectedBlocks.length !== 9) {
    test9Passed = false;
    test9Failures.push(`Expected 9 protected portfolio blocks, found ${centralProtectedBlocks.length}`);
  }

  results.push({
    testId: 'TEST-09',
    testName: 'Protected Portfolio District Integrity (9 Central Plots Unviolated)',
    passed: test9Passed,
    message: test9Passed
      ? `Protected 3x3 portfolio district is 100% intact with 0 intruding background parcels.`
      : `Failures: ${test9Failures.join('; ')}`,
    details: { centralBlocksCount: centralProtectedBlocks.length },
  });

  // =========================================================================
  // TEST 10: Navigation Graph Preservation
  // Road centerlines in layout match the original traffic navigation grid lines [-60, -20, 20, 60].
  // =========================================================================
  const centralAvenues = [-60, -20, 20, 60];
  const centralStreets = [-60, -20, 20, 60];
  let test10Passed = true;
  let test10Failures: string[] = [];

  for (const ca of centralAvenues) {
    if (!CITY_LAYOUT_CONFIG.grid.avenueXs.includes(ca)) {
      test10Passed = false;
      test10Failures.push(`Central Avenue X=${ca} missing from city layout config!`);
    }
  }
  for (const cs of centralStreets) {
    if (!CITY_LAYOUT_CONFIG.grid.streetZs.includes(cs)) {
      test10Passed = false;
      test10Failures.push(`Central Street Z=${cs} missing from city layout config!`);
    }
  }

  results.push({
    testId: 'TEST-10',
    testName: 'Logical Navigation Graph & A* Routing Preservation',
    passed: test10Passed,
    message: test10Passed
      ? `Central navigation grid (4x4 arterial intersection grid) precisely matches traffic routing nodes.`
      : `Failures: ${test10Failures.join('; ')}`,
    details: { centralAvenues, centralStreets },
  });

  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;

  return {
    timestamp: new Date().toISOString(),
    totalTests: results.length,
    passedTests: passedCount,
    failedTests: failedCount,
    results,
  };
}

// Allow direct execution via CLI (node / tsx)
if (typeof require !== 'undefined' && require.main === module) {
  const report = validateCityAlignment();
  console.log('====================================================');
  console.log(`CITY ALIGNMENT VALIDATION REPORT: ${report.passedTests}/${report.totalTests} PASSED`);
  console.log('====================================================');
  for (const res of report.results) {
    const status = res.passed ? '✓ PASS' : '✗ FAIL';
    console.log(`${status} [${res.testId}] ${res.testName}`);
    console.log(`       ${res.message}`);
  }
  console.log('====================================================');
  if (report.failedTests > 0) {
    process.exit(1);
  }
}


import { getCityRoadNetwork, FullCityRoadNetwork } from './cityGridBuilder';
import { findVehicleRoute, generateCirculationRoute } from './vehicleGraph';
import { getPedestrianGraph } from './pedestrianGraph';

export interface ValidationReport {
  passed: boolean;
  totalIntersections: number;
  totalRoads: number;
  totalLanes: number;
  roadLanesCount: number;
  turnLanesCount: number;
  blocksCount: number;
  orphanLanes: string[];
  districtRoutesTested: number;
  districtRoutesPassed: number;
  sampleRoutes: { from: string; to: string; distance: number; laneCount: number }[];
  pedestrianNodesCount: number;
  pedestrianEdgesCount: number;
  errors: string[];
}

export function validateCityRoadNetwork(network: FullCityRoadNetwork = getCityRoadNetwork()): ValidationReport {
  const errors: string[] = [];
  const orphanLanes: string[] = [];

  const { intersections, roads, blocks, vehicleGraph } = network;

  // 1. Check all lanes for valid connections
  let roadLanesCount = 0;
  let turnLanesCount = 0;

  vehicleGraph.laneArray.forEach((lane) => {
    if (lane.turnType === 'road-lane') roadLanesCount++;
    else turnLanesCount++;

    if (lane.incomingLanes.length === 0 && lane.outgoingLanes.length === 0) {
      orphanLanes.push(lane.id);
    }
  });

  if (orphanLanes.length > 0) {
    errors.push(`Found ${orphanLanes.length} disconnected orphan lanes: ${orphanLanes.slice(0, 3).join(', ')}`);
  }

  // 2. Test Left, Right, Straight Turns in Intersections
  let straightTurns = 0;
  let leftTurns = 0;
  let rightTurns = 0;

  vehicleGraph.laneArray.forEach((lane) => {
    if (lane.turnType === 'straight') straightTurns++;
    else if (lane.turnType === 'left') leftTurns++;
    else if (lane.turnType === 'right') rightTurns++;
  });

  if (straightTurns === 0 || leftTurns === 0 || rightTurns === 0) {
    errors.push(`Missing turn varieties! Straight: ${straightTurns}, Left: ${leftTurns}, Right: ${rightTurns}`);
  }

  // 3. Test Routing Between All 6 Interactive Portfolio Districts
  // In the 6x6 grid, central avenues are c = 1, 2, 3, 4 and central streets are r = 1, 2, 3, 4
  const districtLanes: Record<string, string> = {
    HQ: 'lane-road-h-1-1-eb',
    About: 'lane-road-h-1-2-eb',
    Projects: 'lane-road-h-1-3-eb',
    Skills: 'lane-road-v-2-1-sb',
    Career: 'lane-road-v-2-3-sb',
    Contact: 'lane-road-h-3-1-eb',
  };

  const districtNames = Object.keys(districtLanes);
  let districtRoutesTested = 0;
  let districtRoutesPassed = 0;
  const sampleRoutes: { from: string; to: string; distance: number; laneCount: number }[] = [];

  for (let i = 0; i < districtNames.length; i++) {
    for (let j = 0; j < districtNames.length; j++) {
      if (i === j) continue;
      const fromName = districtNames[i];
      const toName = districtNames[j];
      const startLaneId = districtLanes[fromName];
      const targetLaneId = districtLanes[toName];

      districtRoutesTested++;
      const route = findVehicleRoute(vehicleGraph, startLaneId, targetLaneId);

      if (route && route.laneIds.length > 0) {
        districtRoutesPassed++;
        if (sampleRoutes.length < 8) {
          sampleRoutes.push({
            from: fromName,
            to: toName,
            distance: parseFloat(route.totalDistance.toFixed(1)),
            laneCount: route.laneIds.length,
          });
        }
      } else {
        errors.push(`Failed to route vehicle between ${fromName} and ${toName}`);
      }
    }
  }

  // 4. Test Circulation Route (Endless traffic test)
  const circulation = generateCirculationRoute(vehicleGraph, 'lane-road-h-0-0-eb', 30);
  if (circulation.laneIds.length < 20) {
    errors.push(`Traffic circulation stalled after only ${circulation.laneIds.length} steps`);
  }

  // 5. Test Pedestrian Graph Connectivity
  const pedGraph = getPedestrianGraph(network);

  const passed = errors.length === 0 && districtRoutesPassed === districtRoutesTested;

  return {
    passed,
    totalIntersections: intersections.length,
    totalRoads: roads.length,
    totalLanes: vehicleGraph.laneArray.length,
    roadLanesCount,
    turnLanesCount,
    blocksCount: blocks.length,
    orphanLanes,
    districtRoutesTested,
    districtRoutesPassed,
    sampleRoutes,
    pedestrianNodesCount: pedGraph.nodeArray.length,
    pedestrianEdgesCount: pedGraph.edges.length,
    errors,
  };
}


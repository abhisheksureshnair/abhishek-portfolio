import { FullCityRoadNetwork } from './cityGridBuilder';

export interface PedestrianNode {
  id: string;
  x: number;
  y: number;
  z: number;
  type: 'corner' | 'midblock' | 'crosswalk-end' | 'entrance' | 'walkway';
  blockId?: string;
  intersectionId?: string;
  landmarkId?: string;
  neighbors: string[];
}

export interface PedestrianEdge {
  id: string;
  from: string;
  to: string;
  distance: number;
  isCrosswalk: boolean;
  isEntrance?: boolean;
  landmarkId?: string;
  corridorHalfWidth: number;
}

export interface PedestrianGraph {
  nodes: Map<string, PedestrianNode>;
  nodeArray: PedestrianNode[];
  edges: PedestrianEdge[];
}

export function buildPedestrianGraph(network: FullCityRoadNetwork): PedestrianGraph {
  const nodes = new Map<string, PedestrianNode>();
  const edges: PedestrianEdge[] = [];

  const registerNode = (node: PedestrianNode) => {
    nodes.set(node.id, node);
  };

  const addEdge = (
    fromId: string,
    toId: string,
    isCrosswalk: boolean = false,
    isEntrance: boolean = false,
    landmarkId?: string,
    corridorHalfWidth: number = 1.0
  ) => {
    const fromNode = nodes.get(fromId);
    const toNode = nodes.get(toId);
    if (!fromNode || !toNode) return;

    if (!fromNode.neighbors.includes(toId)) fromNode.neighbors.push(toId);
    if (!toNode.neighbors.includes(fromId)) toNode.neighbors.push(fromId);

    const dx = toNode.x - fromNode.x;
    const dz = toNode.z - fromNode.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    const id = `pedge-${fromId}__${toId}`;

    edges.push({
      id,
      from: fromId,
      to: toId,
      distance,
      isCrosswalk,
      isEntrance,
      landmarkId,
      corridorHalfWidth,
    });
  };

  const y = 0.22; // Sidewalk elevation (above 0.20m concrete curb)
  const inset = 1.2; // Sidewalk center line inset from outer curb boundary

  // 1. Generate 4 Corner Nodes for each City Block (along the sidewalk centerline)
  network.blocks.forEach((block) => {
    const b = block.sidewalkBoundary;
    const nwId = `ped-${block.id}-nw`;
    const neId = `ped-${block.id}-ne`;
    const seId = `ped-${block.id}-se`;
    const swId = `ped-${block.id}-sw`;

    registerNode({
      id: nwId,
      x: b.minX + inset,
      y,
      z: b.minZ + inset,
      type: 'corner',
      blockId: block.id,
      neighbors: [],
    });

    registerNode({
      id: neId,
      x: b.maxX - inset,
      y,
      z: b.minZ + inset,
      type: 'corner',
      blockId: block.id,
      neighbors: [],
    });

    registerNode({
      id: seId,
      x: b.maxX - inset,
      y,
      z: b.maxZ - inset,
      type: 'corner',
      blockId: block.id,
      neighbors: [],
    });

    registerNode({
      id: swId,
      x: b.minX + inset,
      y,
      z: b.maxZ - inset,
      type: 'corner',
      blockId: block.id,
      neighbors: [],
    });

    // Connect corners around block perimeter (sidewalk edges)
    // For blocks with entrance branch nodes, omit the unbroken side that gets sub-segmented below
    const hasSouthEntrance = block.id === 'block-1-1' || block.id === 'block-0-1';
    const hasNorthEntrance = block.id === 'block-2-0' || block.id === 'block-2-1';
    const hasEastEntrance = block.id === 'block-1-0';
    const hasWestEntrance = block.id === 'block-0-2' || block.id === 'block-1-2';

    if (!hasNorthEntrance) addEdge(nwId, neId, false, false, undefined, 1.0);
    if (!hasEastEntrance) addEdge(neId, seId, false, false, undefined, 1.0);
    if (!hasSouthEntrance) addEdge(seId, swId, false, false, undefined, 1.0);
    if (!hasWestEntrance) addEdge(swId, nwId, false, false, undefined, 1.0);
  });

  // 2. Generate Landmark Entrance Walkways for all 7 portfolio landmarks
  // 2a. Developer HQ (block-1-1): South Entrance at [0, 9.5], South sidewalk at Z=13.8
  registerNode({
    id: 'ped-hq-walkway',
    x: 0,
    y,
    z: 13.8,
    type: 'walkway',
    blockId: 'block-1-1',
    landmarkId: 'hq',
    neighbors: [],
  });
  registerNode({
    id: 'ped-hq-entrance',
    x: 0,
    y,
    z: 9.5,
    type: 'entrance',
    blockId: 'block-1-1',
    landmarkId: 'hq',
    neighbors: [],
  });
  addEdge('ped-block-1-1-sw', 'ped-hq-walkway', false, false, undefined, 1.0);
  addEdge('ped-hq-walkway', 'ped-block-1-1-se', false, false, undefined, 1.0);
  addEdge('ped-hq-walkway', 'ped-hq-entrance', false, true, 'hq', 1.4);

  // 2b. Innovation Center (block-0-2): West Entrance at [29.5, -40], West sidewalk at X=26.2
  registerNode({
    id: 'ped-inno-walkway',
    x: 26.2,
    y,
    z: -40,
    type: 'walkway',
    blockId: 'block-0-2',
    landmarkId: 'innovation',
    neighbors: [],
  });
  registerNode({
    id: 'ped-inno-entrance',
    x: 29.5,
    y,
    z: -40,
    type: 'entrance',
    blockId: 'block-0-2',
    landmarkId: 'innovation',
    neighbors: [],
  });
  addEdge('ped-block-0-2-nw', 'ped-inno-walkway', false, false, undefined, 1.0);
  addEdge('ped-inno-walkway', 'ped-block-0-2-sw', false, false, undefined, 1.0);
  addEdge('ped-inno-walkway', 'ped-inno-entrance', false, true, 'innovation', 1.4);

  // 2c. Skills Tower (block-1-0): East Entrance at [-29.5, 0], East sidewalk at X=-26.2
  registerNode({
    id: 'ped-skills-walkway',
    x: -26.2,
    y,
    z: 0,
    type: 'walkway',
    blockId: 'block-1-0',
    landmarkId: 'skills',
    neighbors: [],
  });
  registerNode({
    id: 'ped-skills-entrance',
    x: -29.5,
    y,
    z: 0,
    type: 'entrance',
    blockId: 'block-1-0',
    landmarkId: 'skills',
    neighbors: [],
  });
  addEdge('ped-block-1-0-ne', 'ped-skills-walkway', false, false, undefined, 1.0);
  addEdge('ped-skills-walkway', 'ped-block-1-0-se', false, false, undefined, 1.0);
  addEdge('ped-skills-walkway', 'ped-skills-entrance', false, true, 'skills', 1.4);

  // 2d. Career Center (block-1-2): West Entrance at [29.5, 0], West sidewalk at X=26.2
  registerNode({
    id: 'ped-career-walkway',
    x: 26.2,
    y,
    z: 0,
    type: 'walkway',
    blockId: 'block-1-2',
    landmarkId: 'career',
    neighbors: [],
  });
  registerNode({
    id: 'ped-career-entrance',
    x: 29.5,
    y,
    z: 0,
    type: 'entrance',
    blockId: 'block-1-2',
    landmarkId: 'career',
    neighbors: [],
  });
  addEdge('ped-block-1-2-nw', 'ped-career-walkway', false, false, undefined, 1.0);
  addEdge('ped-career-walkway', 'ped-block-1-2-sw', false, false, undefined, 1.0);
  addEdge('ped-career-walkway', 'ped-career-entrance', false, true, 'career', 1.4);

  // 2e. About Studio (block-0-1): South Entrance at [0, -30.5], South sidewalk at Z=-26.2
  registerNode({
    id: 'ped-about-walkway',
    x: 0,
    y,
    z: -26.2,
    type: 'walkway',
    blockId: 'block-0-1',
    landmarkId: 'about',
    neighbors: [],
  });
  registerNode({
    id: 'ped-about-entrance',
    x: 0,
    y,
    z: -30.5,
    type: 'entrance',
    blockId: 'block-0-1',
    landmarkId: 'about',
    neighbors: [],
  });
  addEdge('ped-block-0-1-sw', 'ped-about-walkway', false, false, undefined, 1.0);
  addEdge('ped-about-walkway', 'ped-block-0-1-se', false, false, undefined, 1.0);
  addEdge('ped-about-walkway', 'ped-about-entrance', false, true, 'about', 1.4);

  // 2f. Contact Hub (block-2-0): North Entrance at [-40, 30.5], North sidewalk at Z=26.2
  registerNode({
    id: 'ped-contact-walkway',
    x: -40,
    y,
    z: 26.2,
    type: 'walkway',
    blockId: 'block-2-0',
    landmarkId: 'contact',
    neighbors: [],
  });
  registerNode({
    id: 'ped-contact-entrance',
    x: -40,
    y,
    z: 30.5,
    type: 'entrance',
    blockId: 'block-2-0',
    landmarkId: 'contact',
    neighbors: [],
  });
  addEdge('ped-block-2-0-nw', 'ped-contact-walkway', false, false, undefined, 1.0);
  addEdge('ped-contact-walkway', 'ped-block-2-0-ne', false, false, undefined, 1.0);
  addEdge('ped-contact-walkway', 'ped-contact-entrance', false, true, 'contact', 1.4);

  // 2g. AI Research Center (block-2-1): North Entrance at [0, 30.5], North sidewalk at Z=26.2
  registerNode({
    id: 'ped-ai-walkway',
    x: 0,
    y,
    z: 26.2,
    type: 'walkway',
    blockId: 'block-2-1',
    landmarkId: 'ai',
    neighbors: [],
  });
  registerNode({
    id: 'ped-ai-entrance',
    x: 0,
    y,
    z: 30.5,
    type: 'entrance',
    blockId: 'block-2-1',
    landmarkId: 'ai',
    neighbors: [],
  });
  addEdge('ped-block-2-1-nw', 'ped-ai-walkway', false, false, undefined, 1.0);
  addEdge('ped-ai-walkway', 'ped-block-2-1-ne', false, false, undefined, 1.0);
  addEdge('ped-ai-walkway', 'ped-ai-entrance', false, true, 'ai', 1.4);

  // 3. Generate Crosswalk Edges connecting adjacent blocks across streets
  // Horizontal crossings across North-South Avenues
  for (let r = 0; r < network.config.streetZs.length - 1; r++) {
    for (let c = 0; c < network.config.avenueXs.length - 2; c++) {
      const leftBlockId = `block-${r}-${c}`;
      const rightBlockId = `block-${r}-${c + 1}`;

      // North side crossing
      addEdge(`ped-${leftBlockId}-ne`, `ped-${rightBlockId}-nw`, true, false, undefined, 1.0);
      // South side crossing
      addEdge(`ped-${leftBlockId}-se`, `ped-${rightBlockId}-sw`, true, false, undefined, 1.0);
    }
  }

  // Vertical crossings across East-West Streets
  for (let r = 0; r < network.config.streetZs.length - 2; r++) {
    for (let c = 0; c < network.config.avenueXs.length - 1; c++) {
      const topBlockId = `block-${r}-${c}`;
      const bottomBlockId = `block-${r + 1}-${c}`;

      // West side crossing
      addEdge(`ped-${topBlockId}-sw`, `ped-${bottomBlockId}-nw`, true, false, undefined, 1.0);
      // East side crossing
      addEdge(`ped-${topBlockId}-se`, `ped-${bottomBlockId}-ne`, true, false, undefined, 1.0);
    }
  }

  return {
    nodes,
    nodeArray: Array.from(nodes.values()),
    edges,
  };
}

let cachedPedestrianGraph: PedestrianGraph | null = null;

export function getPedestrianGraph(network: FullCityRoadNetwork): PedestrianGraph {
  if (!cachedPedestrianGraph) {
    cachedPedestrianGraph = buildPedestrianGraph(network);
  }
  return cachedPedestrianGraph;
}

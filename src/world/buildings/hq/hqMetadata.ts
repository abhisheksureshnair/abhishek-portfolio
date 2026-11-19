export interface HQInteractionMetadata {
  buildingId: string;
  name: string;
  owner: string;
  role: string;
  secondaryTitle: string;
  parcel: {
    blockId: string;
    center: [number, number];
    outerBounds: { minX: number; maxX: number; minZ: number; maxZ: number };
    buildableBounds: { minX: number; maxX: number; minZ: number; maxZ: number };
    entrancePosition: [number, number];
    facingDirection: 'south';
  };
  architecture: {
    style: string;
    floors: number;
    floorHeight: number;
    totalHeight: number;
    massing: string;
    materials: string[];
    features: string[];
  };
  actions: {
    id: string;
    label: string;
    description: string;
    icon: string;
  }[];
}

export const PORTFOLIO_HQ_METADATA: HQInteractionMetadata = {
  buildingId: 'portfolio_hq',
  name: 'Developer Headquarters',
  owner: 'ABHISHEK S NAIR',
  role: 'SOFTWARE ENGINEER | FULL STACK DEVELOPER',
  secondaryTitle: 'SYSTEMS ARCHITECTURE & ENTERPRISE WEB APPLICATIONS',
  parcel: {
    blockId: 'block-1-1',
    center: [0, 0],
    outerBounds: { minX: -15, maxX: 15, minZ: -15, maxZ: 15 },
    buildableBounds: { minX: -12, maxX: 12, minZ: -12, maxZ: 12 },
    entrancePosition: [0, 11.8],
    facingDirection: 'south',
  },
  architecture: {
    style: 'Modern American Technology Campus / Corporate Glass Pavilion',
    floors: 7,
    floorHeight: 4.0,
    totalHeight: 38.0,
    massing: 'Stepped L-shaped volume with double-height glass lobby and forecourt reflection pool',
    materials: [
      'Solar blue-gray curtain wall glazing',
      'Dark charcoal anodized aluminum structural mullions',
      'Honed white limestone portal cladding',
      'Warm-gray precast architectural concrete',
      'Polished 316 stainless steel pilotis columns',
      'Warm vertical acoustic oak wood slats',
      'Honed charcoal granite forecourt pavers',
    ],
    features: [
      'Dominant 38m landmark tower in exact center of city (0, 0)',
      'Double-height 8.2m main entrance lobby',
      'Cylindrical glass revolving door with stainless steel canopy',
      'Cantilevered entrance canopy with warm recessed LED illumination',
      'Forecourt water mirror reflection pool with granite coping',
      'Aerodynamic vertical solar shading fins along west facade',
      'Recessed 6th/7th floor executive sky-terrace with glass balustrade',
      'Rooftop architectural crown with spire blade and mechanical HVAC equipment',
      'Freestanding polished granite monument brand signage',
    ],
  },
  actions: [
    {
      id: 'enter_headquarters',
      label: 'Enter Headquarters',
      description: 'Step into the double-height lobby and explore developer showcase',
      icon: 'DoorOpen',
    },
    {
      id: 'view_introduction',
      label: 'Developer Introduction',
      description: 'Professional engineering background, core philosophies, and career journey',
      icon: 'User',
    },
    {
      id: 'explore_projects',
      label: 'Explore Production Systems',
      description: 'FlowSync, AlphaPulse, Echo AI, LiveSync and enterprise platforms',
      icon: 'FolderGit2',
    },
    {
      id: 'navigate_districts',
      label: 'City Navigation',
      description: 'Fast-travel to the 8 surrounding portfolio specialty districts',
      icon: 'Compass',
    },
  ],
};

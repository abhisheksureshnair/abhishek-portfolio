export interface PortfolioDistrictConfig {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  category: string;
  center: [number, number];       // [X, Z] world coordinates
  dimensions: [number, number];   // [width, depth] in meters
  maxHeight: number;              // allowed height envelope in meters
  entrance: [number, number];     // [X, Z] entrance coordinates for street interaction
  facingDirection: 'north' | 'south' | 'east' | 'west';
  color: string;
  accentColor: string;
  style: string;
  materials: {
    primary: string;
    secondary: string;
    accent: string;
    glassTint: string;
  };
  signage: {
    primaryText: string;
    subText: string;
    emissiveColor: string;
  };
  lighting: {
    facadeSpotlights: boolean;
    beaconColor: string;
    ambientGlow: string;
  };
  interiorReady: boolean;
  modelPath?: string;             // Custom GLB/GLTF model integration for Phase 2
  interactiveOverlayId: 'hero' | 'about' | 'projects' | 'skills' | 'experience' | 'contact' | 'plaza' | 'ai-lab' | 'cloud-hub';
  description: string;
}

export const PORTFOLIO_BUILDING_REGISTRY: Record<string, PortfolioDistrictConfig> = {
  hq: {
    id: 'hq',
    name: 'Developer Headquarters',
    title: 'HERO HEADQUARTERS',
    subtitle: 'Signature Technology Campus & Full-Stack Citadel',
    category: 'District 01 // Executive Citadel',
    center: [0, 0],
    dimensions: [24.0, 24.0],
    maxHeight: 38,
    entrance: [0, 11.8],
    facingDirection: 'south',
    color: '#06b6d4',
    accentColor: '#38bdf8',
    style: 'stepped-corporate-glass-pavilion',
    materials: {
      primary: 'honed-white-limestone',
      secondary: 'dark-charcoal-aluminum',
      accent: 'stainless-steel-pilotis',
      glassTint: '#38bdf8',
    },
    signage: {
      primaryText: 'ABHISHEK S NAIR // DEVELOPER HQ',
      subText: 'SOFTWARE ENGINEER | FULL STACK DEVELOPER',
      emissiveColor: '#38bdf8',
    },
    lighting: {
      facadeSpotlights: true,
      beaconColor: '#00f0ff',
      ambientGlow: 'rgba(6, 182, 212, 0.25)',
    },
    interiorReady: true,
    interactiveOverlayId: 'hero',
    description: 'Central executive software development headquarters featuring 6 storeys, stepped L-shape massing, reflection pool, and double-height glass lobby.',
  },

  about: {
    id: 'about',
    name: 'About Studio',
    title: 'ABOUT STUDIO',
    subtitle: 'Developer Philosophy & Craftsmanship Pavilion',
    category: 'District 02 // Creative Studio',
    center: [0, -40],
    dimensions: [25.2, 25.2],
    maxHeight: 38,
    entrance: [0, -27.5],
    facingDirection: 'south',
    color: '#f97316',
    accentColor: '#ea580c',
    style: 'terraced-timber-glass-pavilion',
    materials: {
      primary: 'architectural-terracotta',
      secondary: 'warm-teak-battens',
      accent: 'bronze-fluting',
      glassTint: '#fed7aa',
    },
    signage: {
      primaryText: 'ABOUT STUDIO',
      subText: 'BIOGRAPHY & CRAFTSMANSHIP',
      emissiveColor: '#fb923c',
    },
    lighting: {
      facadeSpotlights: true,
      beaconColor: '#f97316',
      ambientGlow: 'rgba(249, 115, 22, 0.25)',
    },
    interiorReady: true,
    modelPath: '/models/nexus-city/building_media_midrise.glb',
    interactiveOverlayId: 'about',
    description: 'Interactive biography dome detailing professional journey, software craftsmanship, and academic foundation.',
  },

  projects: {
    id: 'projects',
    name: 'Innovation Center',
    title: 'INNOVATION CENTER',
    subtitle: 'Interactive Showcase of Full-Stack Web & AI Platforms',
    category: 'District 03 // Engineering Lab',
    center: [40, -40],
    dimensions: [25.2, 25.2],
    maxHeight: 52,
    entrance: [40, -27.5],
    facingDirection: 'south',
    color: '#a855f7',
    accentColor: '#7c3aed',
    style: 'geometric-stacked-cantilever',
    materials: {
      primary: 'fluted-basalt-stone',
      secondary: 'perforated-zinc-panels',
      accent: 'titanium-mullions',
      glassTint: '#c084fc',
    },
    signage: {
      primaryText: 'INNOVATION LAB',
      subText: 'PRODUCTION PLATFORMS & APPS',
      emissiveColor: '#c084fc',
    },
    lighting: {
      facadeSpotlights: true,
      beaconColor: '#a855f7',
      ambientGlow: 'rgba(168, 85, 247, 0.25)',
    },
    interiorReady: true,
    modelPath: '/models/nexus-city/building_cyber_complex.glb',
    interactiveOverlayId: 'projects',
    description: 'Engineering innovation complex showcasing production full-stack SaaS, AI desktop applications, and real-time platforms.',
  },

  skills: {
    id: 'skills',
    name: 'Skills Tech Tower',
    title: 'SKILLS TECH TOWER',
    subtitle: 'Interactive Engineering & Full-Stack Competency Monolith',
    category: 'District 04 // Tech Tower',
    center: [-40, 0],
    dimensions: [25.2, 25.2],
    maxHeight: 64,
    entrance: [-27.5, 0],
    facingDirection: 'east',
    color: '#10b981',
    accentColor: '#059669',
    style: 'monolithic-brutalist-glass-tower',
    materials: {
      primary: 'polished-granite-ashlar',
      secondary: 'architectural-mesh',
      accent: 'emerald-low-e-glass',
      glassTint: '#34d399',
    },
    signage: {
      primaryText: 'SKILLS TECH TOWER',
      subText: 'REACT • NEXT.JS • THREE.JS • PYTHON • DOCKER',
      emissiveColor: '#34d399',
    },
    lighting: {
      facadeSpotlights: true,
      beaconColor: '#10b981',
      ambientGlow: 'rgba(16, 185, 129, 0.25)',
    },
    interiorReady: true,
    modelPath: '/models/nexus-city/building_landmark_tower.glb',
    interactiveOverlayId: 'skills',
    description: 'High-rise technical monolith detailing competencies in frontend engineering, 3D graphics, backend APIs, and systems design.',
  },

  'central-plaza': {
    id: 'central-plaza',
    name: 'Northwest Civic Commons',
    title: 'NORTHWEST CIVIC PLAZA',
    subtitle: 'Urban Commons, Fountains & Botanical Gardens',
    category: 'Civic Commons // West',
    center: [-40, -40],
    dimensions: [24.0, 24.0],
    maxHeight: 12,
    entrance: [-40, -27.5],
    facingDirection: 'south',
    color: '#eab308',
    accentColor: '#ca8a04',
    style: 'urban-sunken-garden-plaza',
    materials: {
      primary: 'granite-paving-flags',
      secondary: 'corten-weathering-steel',
      accent: 'reflective-water-basin',
      glassTint: '#fef08a',
    },
    signage: {
      primaryText: 'CIVIC PLAZA',
      subText: 'METROPOLITAN COMMONS & GARDENS',
      emissiveColor: '#facc15',
    },
    lighting: {
      facadeSpotlights: true,
      beaconColor: '#eab308',
      ambientGlow: 'rgba(234, 179, 8, 0.25)',
    },
    interiorReady: false,
    interactiveOverlayId: 'plaza',
    description: 'Public urban park plaza with manicured lawn parterres, ornamental fountain, and shaded granite walking promenades.',
  },

  career: {
    id: 'career',
    name: 'Career Corporate Office',
    title: 'CAREER & EXPERIENCE',
    subtitle: 'Corporate Milestones, Enterprise Deliveries & Roles',
    category: 'District 05 // Corporate Office',
    center: [40, 0],
    dimensions: [25.2, 25.2],
    maxHeight: 48,
    entrance: [27.5, 0],
    facingDirection: 'west',
    color: '#ec4899',
    accentColor: '#db2777',
    style: 'international-style-atrium-headquarters',
    materials: {
      primary: 'travertine-limestone',
      secondary: 'anodized-champagne-trim',
      accent: 'tinted-solar-glazing',
      glassTint: '#f472b6',
    },
    signage: {
      primaryText: 'CAREER & CLIENTS',
      subText: 'INNSPARK • COMMERCIAL SOFTWARE DELIVERIES',
      emissiveColor: '#f472b6',
    },
    lighting: {
      facadeSpotlights: true,
      beaconColor: '#ec4899',
      ambientGlow: 'rgba(236, 72, 153, 0.25)',
    },
    interiorReady: true,
    modelPath: '/models/nexus-city/building_media_midrise.glb',
    interactiveOverlayId: 'experience',
    description: 'Commercial corporate office detailing 3+ years of production commercial software deliveries, mobile apps, and enterprise systems.',
  },

  contact: {
    id: 'contact',
    name: 'Contact Telemetry Hub',
    title: 'CONTACT TRANSMISSION',
    subtitle: 'Direct Communication, Verified Resume & Social Arrays',
    category: 'District 06 // Telemetry Station',
    center: [-40, 40],
    dimensions: [25.2, 25.2],
    maxHeight: 44,
    entrance: [-40, 27.5],
    facingDirection: 'north',
    color: '#38bdf8',
    accentColor: '#0284c7',
    style: 'high-tech-transmission-spire',
    materials: {
      primary: 'carbon-fiber-cladding',
      secondary: 'brushed-aluminum-fin',
      accent: 'signal-antenna-array',
      glassTint: '#7dd3fc',
    },
    signage: {
      primaryText: 'TRANSMISSION ARRAY',
      subText: 'CONNECT DIRECTLY • DOWNLOAD RESUME',
      emissiveColor: '#38bdf8',
    },
    lighting: {
      facadeSpotlights: true,
      beaconColor: '#38bdf8',
      ambientGlow: 'rgba(56, 189, 248, 0.25)',
    },
    interiorReady: true,
    modelPath: '/models/nexus-city/building_cyber_complex.glb',
    interactiveOverlayId: 'contact',
    description: 'High-speed communication terminal to connect directly via Email, LinkedIn, GitHub, or download the verified resume PDF.',
  },

  'ai-lab': {
    id: 'ai-lab',
    name: 'AI Research Annex',
    title: 'AI RESEARCH ANNEX',
    subtitle: 'Neural Intelligence & Predictive Analytics Laboratory',
    category: 'Future Expansion // Plot A',
    center: [0, 40],
    dimensions: [25.2, 25.2],
    maxHeight: 42,
    entrance: [0, 27.5],
    facingDirection: 'north',
    color: '#6366f1',
    accentColor: '#4f46e5',
    style: 'kinetic-facade-laboratory',
    materials: {
      primary: 'frosted-smart-glass',
      secondary: 'matte-black-steel',
      accent: 'dynamic-louvers',
      glassTint: '#818cf8',
    },
    signage: {
      primaryText: 'AI RESEARCH ANNEX',
      subText: 'LLM STREAMING & PREDICTIVE MODELS',
      emissiveColor: '#818cf8',
    },
    lighting: {
      facadeSpotlights: true,
      beaconColor: '#6366f1',
      ambientGlow: 'rgba(99, 102, 241, 0.25)',
    },
    interiorReady: false,
    modelPath: '/models/nexus-city/building_industrial_block.glb',
    interactiveOverlayId: 'ai-lab',
    description: 'Designated expansion plot for neural intelligence research, real-time telemetry streaming, and automated AI agents.',
  },

  'cloud-nexus': {
    id: 'cloud-nexus',
    name: 'Cloud & Systems Engineering Hub',
    title: 'CLOUD & SYSTEMS ENGINEERING HUB',
    subtitle: 'High-Availability Infrastructure, Microservices & Distributed Computing',
    category: 'District 08 // Cloud Hub',
    center: [40, 40],
    dimensions: [25.2, 25.2],
    maxHeight: 24,
    entrance: [40, 30.5],
    facingDirection: 'north',
    color: '#00f0ff',
    accentColor: '#0284c7',
    style: 'asymmetric-curved-glass-titanium-citadel',
    materials: {
      primary: 'aerodynamic-titanium-curved-panels',
      secondary: 'double-height-curtain-glass',
      accent: 'cyan-cyber-telemetry-leds',
      glassTint: '#1e293b',
    },
    signage: {
      primaryText: 'CLOUD & SYSTEMS ENGINEERING HUB',
      subText: 'BACKEND • CLOUD • APIs • INFRASTRUCTURE',
      emissiveColor: '#00f0ff',
    },
    lighting: {
      facadeSpotlights: true,
      beaconColor: '#00f0ff',
      ambientGlow: 'rgba(0, 240, 255, 0.3)',
    },
    interiorReady: true,
    interactiveOverlayId: 'cloud-hub',
    description: 'Production-grade technology headquarters for high-concurrency cloud computing, container orchestration, low-latency microservices, relational and vector databases, and automated DevOps.',
  },
};

/**
 * Helper to check if a world coordinate (X, Z) falls inside any protected central plot
 */
export function isCoordinateInProtectedDistrict(x: number, z: number, padding: number = 2.0): boolean {
  for (const key of Object.keys(PORTFOLIO_BUILDING_REGISTRY)) {
    const plot = PORTFOLIO_BUILDING_REGISTRY[key];
    const halfW = plot.dimensions[0] / 2 + padding;
    const halfD = plot.dimensions[1] / 2 + padding;
    if (
      x >= plot.center[0] - halfW &&
      x <= plot.center[0] + halfW &&
      z >= plot.center[1] - halfD &&
      z <= plot.center[1] + halfD
    ) {
      return true;
    }
  }
  return false;
}


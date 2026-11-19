export interface WorldDistrict {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  x: number;
  z: number;
  color: string;
  secondaryColor: string;
  accentColor: string;
  height: number;
  width: number;
  depth: number;
  iconName: string;
  description: string;
  techTags: string[];
  isPortal?: boolean;
  portalRoute?: string;
}

export const WORLD_DISTRICTS: WorldDistrict[] = [
  // 01 — FLOWSYNC HQ (Media Tower)
  {
    id: 'flowsync',
    name: 'FLOWSYNC HQ',
    subtitle: 'Full-Stack Collaboration & Real-Time Intelligence',
    category: 'Full-Stack + AI',
    x: -22,
    z: -14,
    color: '#6366f1',
    secondaryColor: '#4338ca',
    accentColor: '#38bdf8',
    height: 24,
    width: 14,
    depth: 12,
    iconName: 'Cpu',
    description: 'Real-time collaborative workspace with task boards, Socket.IO channels, and NVIDIA NIM predictive task risk scoring.',
    techTags: ['React', 'Socket.IO', 'Express', 'MongoDB', 'NVIDIA NIM'],
  },

  // 02 — ECHO AI LAB (Cyber Complex)
  {
    id: 'echo-desktop-ai',
    name: 'ECHO AI LAB',
    subtitle: 'Cross-Platform AI Desktop & Extension Bridge',
    category: 'Electron + LLM',
    x: 22,
    z: -14,
    color: '#38bdf8',
    secondaryColor: '#0284c7',
    accentColor: '#818cf8',
    height: 24,
    width: 14,
    depth: 14,
    iconName: 'Bot',
    description: 'Neural intelligence research laboratory with streaming LLM agents and multi-browser extension IPC bridges.',
    techTags: ['Electron.js', 'React', 'Browser Extensions', 'LLM APIs'],
  },

  // 03 — MOBILE NETWORK (Commercial Arcade)
  {
    id: 'livesync',
    name: 'MOBILE NETWORK',
    subtitle: 'Cross-Platform Mobile Engineering & BLE IoT',
    category: 'React Native & Flutter',
    x: 20,
    z: 16,
    color: '#10b981',
    secondaryColor: '#047857',
    accentColor: '#34d399',
    height: 18,
    width: 12,
    depth: 12,
    iconName: 'Smartphone',
    description: 'Mobile diagnostics node featuring Bluetooth Low Energy GATT communication and high-fps mobile rendering.',
    techTags: ['React Native', 'Flutter', 'Bluetooth BLE', 'Mobile UI'],
  },

  // 04 — AI ANALYTICS (Telemetry Annex)
  {
    id: 'alphapulse-stock-ai',
    name: 'AI ANALYTICS',
    subtitle: 'Real-Time Financial & Telemetry Intelligence',
    category: 'FastAPI Python',
    x: 26,
    z: 26,
    color: '#a855f7',
    secondaryColor: '#7e22ce',
    accentColor: '#f43f5e',
    height: 16,
    width: 10,
    depth: 10,
    iconName: 'Activity',
    description: 'High-frequency telemetry analysis hub streaming algorithmic predictions and asynchronous backend workers.',
    techTags: ['Python', 'FastAPI', 'Pandas', 'Predictive Modeling'],
  },

  // 05 — LOGISTICS & KINETIC (Industrial Block)
  {
    id: 'neon-kinetic',
    name: 'LOGISTICS GARAGE',
    subtitle: 'Fleet Telematics & Live GPS Geofencing',
    category: 'Flutter GPS',
    x: -20,
    z: 16,
    color: '#f59e0b',
    secondaryColor: '#b45309',
    accentColor: '#fbbf24',
    height: 18,
    width: 12,
    depth: 12,
    iconName: 'Navigation',
    description: 'Commercial fleet command dock tracking real-time vehicle coordinates, polygon geofence breaches, and route replays.',
    techTags: ['Flutter', 'Google Maps API', 'WebSockets', 'GPS Geofencing'],
  },

  // 06 — INNSPARK HQ (South Gateway Arch)
  {
    id: 'innspark-hq',
    name: 'INNSPARK HQ',
    subtitle: 'Commercial Software Development Enterprise',
    category: 'InnSpark Role',
    x: 0,
    z: 32,
    color: '#ec4899',
    secondaryColor: '#be185d',
    accentColor: '#f472b6',
    height: 24,
    width: 26,
    depth: 7,
    iconName: 'ShieldCheck',
    description: 'Official corporate engineering facility detailing 3+ years of production commercial software deliveries, mobile apps, and enterprise architectures.',
    techTags: ['Analyst - Software Dev', 'Production Delivery', 'Enterprise Systems'],
  },

  // 07 — ABOUT HUB (Transit Terminal)
  {
    id: 'about-hub',
    name: 'ABOUT HUB',
    subtitle: 'Developer Biography & Core Philosophy',
    category: 'Bio Persona',
    x: -30,
    z: 0,
    color: '#3b82f6',
    secondaryColor: '#1d4ed8',
    accentColor: '#60a5fa',
    height: 16,
    width: 11,
    depth: 14,
    iconName: 'User',
    description: 'Interactive biography dome featuring Abhishek S Nair’s professional journey, software craftsmanship, and academic foundation.',
    techTags: ['3+ Years Experience', 'BCA Graduate', 'Kerala, India'],
  },

  // 08 — CONTACT CENTER (Telemetry Tower)
  {
    id: 'contact-hub',
    name: 'CONTACT CENTER',
    subtitle: 'Direct Communication Transmission Array',
    category: 'Direct Links',
    x: 30,
    z: 0,
    color: '#14b8a6',
    secondaryColor: '#0f766e',
    accentColor: '#2dd4bf',
    height: 20,
    width: 11,
    depth: 14,
    iconName: 'Mail',
    description: 'High-speed communication terminal to connect directly via Email, LinkedIn, GitHub, or download the verified resume.',
    techTags: ['nairsabhishek@gmail.com', 'LinkedIn', 'Resume PDF'],
  },

  // 09 — GITHUB // CODE NEXUS (Grand Citadel Landmark Spire)
  {
    id: 'code-nexus',
    name: 'GITHUB // CODE NEXUS',
    subtitle: 'Gateway to Interactive GitHub Universe',
    category: 'Central Citadel Portal',
    x: 0,
    z: -28,
    color: '#8b5cf6',
    secondaryColor: '#6d28d9',
    accentColor: '#c084fc',
    height: 48,
    width: 16,
    depth: 16,
    iconName: 'GitBranch',
    description: 'Monumental digital citadel connecting to the standalone animated GitHub Universe. Step onto the energy platform to initiate hyper-jump.',
    techTags: ['Code Nexus Portal', 'Verified Repos', 'Live Staged Builder'],
    isPortal: true,
    portalRoute: '/github-universe',
  },
];

export const WORLD_MISSIONS = [
  {
    id: 'm-nexus',
    title: 'GATEWAY: Enter the GitHub Code Nexus',
    targetLocationId: 'code-nexus',
    locationName: 'GITHUB // CODE NEXUS',
    completed: false,
  },
  {
    id: 'm1',
    title: 'MISSION 01: Full-Stack Intelligence',
    targetLocationId: 'flowsync',
    locationName: 'FLOWSYNC HQ',
    completed: false,
  },
  {
    id: 'm2',
    title: 'MISSION 02: Desktop & Browser AI',
    targetLocationId: 'echo-desktop-ai',
    locationName: 'ECHO AI LAB',
    completed: false,
  },
  {
    id: 'm3',
    title: 'MISSION 03: Mobile Engineering',
    targetLocationId: 'livesync',
    locationName: 'MOBILE NETWORK',
    completed: false,
  },
  {
    id: 'm4',
    title: 'MISSION 04: Algorithmic Financial AI',
    targetLocationId: 'alphapulse-stock-ai',
    locationName: 'AI ANALYTICS',
    completed: false,
  },
  {
    id: 'm5',
    title: 'MISSION 05: Fleet Telematics',
    targetLocationId: 'neon-kinetic',
    locationName: 'LOGISTICS GARAGE',
    completed: false,
  },
  {
    id: 'm6',
    title: 'MISSION 06: Commercial Experience',
    targetLocationId: 'innspark-hq',
    locationName: 'INNSPARK HQ',
    completed: false,
  },
  {
    id: 'm7',
    title: 'MISSION 07: Developer Identity & Biography',
    targetLocationId: 'about-hub',
    locationName: 'ABOUT HUB',
    completed: false,
  },
  {
    id: 'm8',
    title: 'MISSION 08: Establish Professional Comms',
    targetLocationId: 'contact-hub',
    locationName: 'CONTACT CENTER',
    completed: false,
  },
];


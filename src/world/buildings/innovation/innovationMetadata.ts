/**
 * Phase 2.2 — Signature Innovation & Projects Center Metadata
 * 
 * Authoritative location, spatial bounds and project exhibition registry
 * for District 03 (Innovation & Projects Center).
 */

export interface InnovationProjectKioskMeta {
  id: string;
  projectId: string;
  title: string;
  subtitle: string;
  category: string;
  accentColor: string;
  badge: string;
  relativePosition: [number, number, number]; // [X, Y, Z] relative to building center [40, -40]
  description: string;
}

export const INNOVATION_CENTER_METADATA = {
  id: 'projects',
  blockId: 'block-0-2',
  title: 'INNOVATION CENTER',
  subtitle: 'Interactive Showcase of Full-Stack Web & AI Platforms',
  category: 'District 03 // Engineering Lab',
  center: [40.0, -40.0] as [number, number],
  outerBounds: {
    minX: 25.0,
    maxX: 55.0,
    minZ: -55.0,
    maxZ: -25.0,
  },
  buildableBounds: {
    minX: 28.0,
    maxX: 52.0,
    minZ: -52.0,
    maxZ: -28.0,
  },
  dimensions: [23.6, 23.6] as [number, number],
  height: 28.5, // 5 storeys with cantilevered upper volume and rooftop crown
  entrancePosition: [40.0, -27.6] as [number, number],
  facingDirection: 'south' as const,
  kiosks: [
    {
      id: 'kiosk-vts',
      projectId: 'vts-gps-tracking',
      title: 'TraqInn School Bus & VTS',
      subtitle: 'Real-Time GPS Fleet Engine',
      category: 'GPS & LOGISTICS',
      accentColor: '#06b6d4',
      badge: 'PRODUCTION',
      relativePosition: [-4.5, 0.255, 1.2], // West Atrium Gallery [35.5, -38.8]
      description: 'Real-time school bus and vehicle fleet tracking with student attendance, live route trails, and geofencing alerts.',
    },
    {
      id: 'kiosk-telemedicine',
      projectId: 'telemedicine-platform',
      title: 'Telemedicine Application',
      subtitle: 'Virtual Care & Bluetooth IoT',
      category: 'HEALTHCARE & IOT',
      accentColor: '#10b981',
      badge: 'ENTERPRISE',
      relativePosition: [-4.5, 0.255, -3.8], // Northwest Atrium Gallery [35.5, -43.8]
      description: 'Cross-platform virtual care platform featuring Bluetooth BLE medical vitals capture and Socket.IO consultations.',
    },
    {
      id: 'kiosk-echo-ai',
      projectId: 'echo-desktop-ai',
      title: 'EchoAI Desktop Assistant',
      subtitle: 'Cross-Platform Co-Pilot',
      category: 'AI & DESKTOP',
      accentColor: '#a855f7',
      badge: 'FLAGSHIP AI',
      relativePosition: [4.5, 0.255, 1.2], // East Atrium Gallery [44.5, -38.8]
      description: 'Cross-platform Electron desktop AI assistant with multi-browser extension integration and active application context.',
    },
    {
      id: 'kiosk-flowsync',
      projectId: 'flowsync',
      title: 'FlowSync Platform',
      subtitle: 'Real-Time MERN & AI Telemetry',
      category: 'FULL STACK',
      accentColor: '#38bdf8',
      badge: 'FULL STACK',
      relativePosition: [4.5, 0.255, -3.8], // Northeast Atrium Gallery [44.5, -43.8]
      description: 'Real-time team project workspace with WebSocket chat, NVIDIA NIM AI risk analysis, and spatial ETA calculations.',
    },
  ] as InnovationProjectKioskMeta[],
};

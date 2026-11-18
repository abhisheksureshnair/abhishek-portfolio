import { CameraPreset } from '../stores/worldStore';

export interface LandmarkSignageConfig {
  primaryText: string;
  secondaryText: string;
  panelColor: string;
  titleColor: string;
  subtitleColor: string;
  emissiveColor: string;
  emissiveIntensity: number;
}

export interface LandmarkCameraConfig {
  entrance: CameraPreset;
  exterior: CameraPreset;
  elevated: CameraPreset;
  interior?: CameraPreset;
}

export interface LandmarkMetadata {
  id: string;
  displayName: string;
  subtitle: string;
  category: string;
  parcelId: string;
  center: [number, number];
  dimensions: [number, number];
  height: number;
  entranceCoordinates: [number, number];
  facingDirection: 'north' | 'south' | 'east' | 'west';
  isBuilt: boolean;
  signage: LandmarkSignageConfig;
  cameraPresets: LandmarkCameraConfig;
  interactiveTarget: 'hero' | 'projects' | 'skills' | 'about' | 'career' | 'contact' | 'ai-lab';
  description: string;
}

/**
 * Phase 2.3 Authoritative Citywide Landmark Identification & District Registry
 * 
 * Tracks built portfolio landmarks and architectural signage configs.
 * Strictly maintains only built landmarks (HQ, Innovation Center, Skills Tower)
 * while providing an extensible contract for upcoming phase landmarks.
 */
export const CITY_LANDMARK_REGISTRY: Record<string, LandmarkMetadata> = {
  // Landmark 1: Developer Headquarters
  hq: {
    id: 'hq',
    displayName: 'Developer Headquarters',
    subtitle: 'Full Stack • Web • Mobile Citadel',
    category: 'District 01 // Executive Citadel',
    parcelId: 'block-1-1',
    center: [0.0, 0.0],
    dimensions: [23.6, 23.6],
    height: 38.0,
    entranceCoordinates: [0.0, 8.5],
    facingDirection: 'south',
    isBuilt: true,
    signage: {
      primaryText: 'DEVELOPER HQ',
      secondaryText: 'FULL STACK • WEB • MOBILE',
      panelColor: '#1e293b',
      titleColor: '#ffffff',
      subtitleColor: '#38bdf8',
      emissiveColor: '#38bdf8',
      emissiveIntensity: 1.6,
    },
    cameraPresets: {
      entrance: 'hq_front_entrance',
      exterior: 'hq_three_quarter',
      elevated: 'hq_elevated_overview',
      interior: 'hq_street_level',
    },
    interactiveTarget: 'hero',
    description: 'Central executive headquarters featuring stepped corporate campus architecture, reflecting pool basin, and double-height lobby pavilion.',
  },

  // Landmark 2: Innovation & Projects Center
  projects: {
    id: 'projects',
    displayName: 'Innovation & Projects Center',
    subtitle: 'Projects • Research • Development',
    category: 'District 03 // Projects Hub',
    parcelId: 'block-0-2',
    center: [40.0, -40.0],
    dimensions: [23.6, 23.6],
    height: 28.5,
    entranceCoordinates: [40.0, -27.6],
    facingDirection: 'south',
    isBuilt: true,
    signage: {
      primaryText: 'INNOVATION CENTER',
      secondaryText: 'PROJECTS • RESEARCH • DEVELOPMENT',
      panelColor: '#0f172a',
      titleColor: '#ffffff',
      subtitleColor: '#00f0ff',
      emissiveColor: '#00f0ff',
      emissiveIntensity: 1.8,
    },
    cameraPresets: {
      entrance: 'innovation_front_entrance',
      exterior: 'innovation_three_quarter',
      elevated: 'innovation_downtown_overview',
      interior: 'innovation_interior_atrium',
    },
    interactiveTarget: 'projects',
    description: 'Signature technology pavilion featuring crystalline diagrid glass, cantilevered upper volume, reflection pool, and 4 interactive project kiosks.',
  },

  // Landmark 3: Skills & Technology Tower
  skills: {
    id: 'skills',
    displayName: 'Skills & Technology Tower',
    subtitle: 'Engineering • Development • Innovation',
    category: 'District 04 // Tech Tower',
    parcelId: 'block-1-0',
    center: [-40.0, 0.0],
    dimensions: [23.6, 23.6],
    height: 46.0,
    entranceCoordinates: [-27.6, 0.0],
    facingDirection: 'east',
    isBuilt: true,
    signage: {
      primaryText: 'SKILLS & TECHNOLOGY',
      secondaryText: 'ENGINEERING • DEVELOPMENT • INNOVATION',
      panelColor: '#0f172a',
      titleColor: '#ffffff',
      subtitleColor: '#10b981',
      emissiveColor: '#10b981',
      emissiveIntensity: 1.8,
    },
    cameraPresets: {
      entrance: 'skills_front_entrance',
      exterior: 'skills_three_quarter',
      elevated: 'skills_elevated_overview',
      interior: 'skills_lobby',
    },
    interactiveTarget: 'skills',
    description: 'High-rise engineering monolith featuring dynamic parabolic metallic fins, 10 storeys, double-height lobby, and 5 interactive technology floors.',
  },

  // Landmark 4: Career & Experience Center
  career: {
    id: 'career',
    displayName: 'Career & Experience Center',
    subtitle: 'Software Engineering • Professional Journey',
    category: 'District 05 // Corporate Career Institution',
    parcelId: 'block-1-2',
    center: [40.0, 0.0],
    dimensions: [23.6, 23.6],
    height: 34.8,
    entranceCoordinates: [28.0, 0.0],
    facingDirection: 'west',
    isBuilt: true,
    signage: {
      primaryText: 'CAREER & EXPERIENCE CENTER',
      secondaryText: 'SOFTWARE ENGINEERING • PROFESSIONAL JOURNEY',
      panelColor: '#0f172a',
      titleColor: '#ffffff',
      subtitleColor: '#f59e0b',
      emissiveColor: '#f59e0b',
      emissiveIntensity: 1.8,
    },
    cameraPresets: {
      entrance: 'career_front_entrance',
      exterior: 'career_three_quarter',
      elevated: 'career_elevated_overview',
      interior: 'career_lobby',
    },
    interactiveTarget: 'career',
    description: '8-storey symmetrical stepped corporate institution with dark bronze mullions, central 4-storey transparent atrium, timber acoustic louvers, and illuminated vertical career timeline display.',
  },

  // Landmark 5: About Me Studio
  about: {
    id: 'about',
    displayName: 'About Me Studio',
    subtitle: 'My Story • Education • Developer Journey',
    category: 'District 02 // Creative Exhibition Studio',
    parcelId: 'block-0-1',
    center: [0.0, -40.0],
    dimensions: [23.6, 23.6],
    height: 14.4,
    entranceCoordinates: [0.0, -28.0],
    facingDirection: 'south',
    isBuilt: true,
    signage: {
      primaryText: 'ABOUT ME STUDIO',
      secondaryText: 'MY STORY • EDUCATION • DEVELOPER JOURNEY',
      panelColor: '#0f172a',
      titleColor: '#ffffff',
      subtitleColor: '#f97316',
      emissiveColor: '#f97316',
      emissiveIntensity: 1.8,
    },
    cameraPresets: {
      entrance: 'about_front_entrance',
      exterior: 'about_three_quarter',
      elevated: 'about_rooftop_terrace',
      interior: 'about_developer_journey',
    },
    interactiveTarget: 'about',
    description: 'Contemporary low-rise cultural studio with deep cantilevered timber roof, panoramic floor-to-ceiling glass, limestone podium, rooftop viewing terrace, and interactive developer journey exhibition.',
  },

  // Landmark 6: Contact & Collaboration Hub
  contact: {
    id: 'contact',
    displayName: 'Contact & Collaboration Hub',
    subtitle: "Let's Connect • Build • Innovate",
    category: 'District 06 // Communications Hub',
    parcelId: 'block-2-0',
    center: [-40.0, 40.0],
    dimensions: [23.6, 23.6],
    height: 24.0,
    entranceCoordinates: [-40.0, 28.0],
    facingDirection: 'north',
    isBuilt: true,
    signage: {
      primaryText: 'CONTACT & COLLABORATION HUB',
      secondaryText: "LET'S CONNECT • BUILD • INNOVATE",
      panelColor: '#090d16',
      titleColor: '#ffffff',
      subtitleColor: '#00f0ff',
      emissiveColor: '#00f0ff',
      emissiveIntensity: 2.0,
    },
    cameraPresets: {
      entrance: 'contact_front_entrance',
      exterior: 'contact_three_quarter',
      elevated: 'contact_rooftop_terrace',
      interior: 'contact_interior_globe',
    },
    interactiveTarget: 'contact',
    description: 'Futuristic 6-storey communication headquarters with sweeping aerodynamic silver shell canopy, curved panoramic glass facade, double-height lobby with suspended holographic globe, and interactive collaboration dashboard.',
  },

  // Landmark 7: AI Research & Innovation Center
  ai: {
    id: 'ai',
    displayName: 'AI Research Center',
    subtitle: 'Artificial Intelligence • Python • Research',
    category: 'District 07 // AI & Computational Intelligence',
    parcelId: 'block-2-1',
    center: [0.0, 40.0],
    dimensions: [23.6, 23.6],
    height: 25.5,
    entranceCoordinates: [0.0, 28.0],
    facingDirection: 'north',
    isBuilt: true,
    signage: {
      primaryText: 'AI RESEARCH CENTER',
      secondaryText: 'ARTIFICIAL INTELLIGENCE • PYTHON • RESEARCH',
      panelColor: '#090d16',
      titleColor: '#ffffff',
      subtitleColor: '#a855f7',
      emissiveColor: '#a855f7',
      emissiveIntensity: 2.0,
    },
    cameraPresets: {
      entrance: 'ai_front_entrance',
      exterior: 'ai_three_quarter',
      elevated: 'ai_elevated_exterior',
      interior: 'ai_atrium_hologram',
    },
    interactiveTarget: 'ai-lab',
    description: 'Distinctive 6-storey research institute inspired by SAHMRI diagrid architecture, featuring triangular sunscreen faceted skin, glowing warm interior core, double-height atrium, and signature suspended 3D neural-network sculpture.',
  },
};

/**
 * Helper to retrieve only built, active landmarks
 */
export function getActiveLandmarks(): LandmarkMetadata[] {
  return Object.values(CITY_LANDMARK_REGISTRY).filter((l) => l.isBuilt);
}

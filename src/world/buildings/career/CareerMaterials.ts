import * as THREE from 'three';

export interface CareerMaterialsContainer {
  darkBronzeFrame: THREE.MeshStandardMaterial;
  corporateBronzeGlass: THREE.MeshPhysicalMaterial;
  atriumClearGlass: THREE.MeshPhysicalMaterial;
  whiteLimestone: THREE.MeshStandardMaterial;
  travertineBase: THREE.MeshStandardMaterial;
  acousticWoodSoffit: THREE.MeshStandardMaterial;
  terrazzoFloor: THREE.MeshStandardMaterial;
  granitePavers: THREE.MeshStandardMaterial;
  warmMullions: THREE.MeshStandardMaterial;
  timelineGlow: THREE.MeshStandardMaterial;
  timelineNodeActive: THREE.MeshStandardMaterial;
  timelineGlass: THREE.MeshPhysicalMaterial;
  signageBackdrop: THREE.MeshStandardMaterial;
  canopyTrim: THREE.MeshStandardMaterial;
}

let sharedCareerMaterials: CareerMaterialsContainer | null = null;

export function getSharedCareerMaterials(): CareerMaterialsContainer {
  if (sharedCareerMaterials) return sharedCareerMaterials;

  // 1. Dark Bronze Architectural Framing (Reference Photo)
  const darkBronzeFrame = new THREE.MeshStandardMaterial({
    color: '#1f1d1a', // Deep blackened bronze architectural framing
    roughness: 0.38,
    metalness: 0.72,
  });

  // 2. High-Performance Corporate Bronze Reflective Glazing (Wings)
  const corporateBronzeGlass = new THREE.MeshPhysicalMaterial({
    color: '#1c1917',
    metalness: 0.25,
    roughness: 0.12,
    ior: 1.52,
    transparent: true,
    opacity: 0.75,
    clearcoat: 1.0,
  });

  // 3. Low-Iron Structural Atrium Glass (Central 4-storey connector)
  const atriumClearGlass = new THREE.MeshPhysicalMaterial({
    color: '#f8fafc',
    metalness: 0.05,
    roughness: 0.05,
    ior: 1.50,
    transparent: true,
    opacity: 0.55,
    clearcoat: 1.0,
  });

  // 4. White Architectural Limestone Pier Accents
  const whiteLimestone = new THREE.MeshStandardMaterial({
    color: '#e2e8f0',
    roughness: 0.88,
    metalness: 0.02,
  });

  // 5. Travertine & Granite Podium Base
  const travertineBase = new THREE.MeshStandardMaterial({
    color: '#cbd5e1',
    roughness: 0.82,
    metalness: 0.04,
  });

  // 6. Warm Natural Acoustic Timber / Wood Grid Ceiling (Atrium feature from Ref Photo)
  const acousticWoodSoffit = new THREE.MeshStandardMaterial({
    color: '#b45309', // Warm amber oak / architectural cedar
    roughness: 0.72,
    metalness: 0.05,
  });

  // 7. Polished Terrazzo Interior Atrium Floor
  const terrazzoFloor = new THREE.MeshStandardMaterial({
    color: '#334155',
    roughness: 0.25,
    metalness: 0.35,
  });

  // 8. Exterior Plaza Granite Pavers
  const granitePavers = new THREE.MeshStandardMaterial({
    color: '#475569',
    roughness: 0.85,
    metalness: 0.08,
  });

  // 9. Vertical Bronze Spandrels and Mullions
  const warmMullions = new THREE.MeshStandardMaterial({
    color: '#292524',
    roughness: 0.40,
    metalness: 0.65,
  });

  // 10. Signature Illuminated Career Timeline Vertical Column Glow
  const timelineGlow = new THREE.MeshStandardMaterial({
    color: '#ec4899',
    emissive: '#ec4899',
    emissiveIntensity: 2.2,
    roughness: 0.2,
  });

  // 11. Timeline Milestone Active Marker
  const timelineNodeActive = new THREE.MeshStandardMaterial({
    color: '#38bdf8',
    emissive: '#38bdf8',
    emissiveIntensity: 2.5,
    roughness: 0.15,
  });

  // 12. Monolithic Timeline Glass Pylon Display Case
  const timelineGlass = new THREE.MeshPhysicalMaterial({
    color: '#fdf2f8',
    metalness: 0.1,
    roughness: 0.08,
    ior: 1.52,
    transparent: true,
    opacity: 0.65,
    clearcoat: 1.0,
  });

  // 13. Backlit Signage Backdrop
  const signageBackdrop = new THREE.MeshStandardMaterial({
    color: '#090d16',
    roughness: 0.80,
    metalness: 0.30,
  });

  // 14. Cantilever Canopy Trim
  const canopyTrim = new THREE.MeshStandardMaterial({
    color: '#18181b',
    roughness: 0.32,
    metalness: 0.75,
  });

  sharedCareerMaterials = {
    darkBronzeFrame,
    corporateBronzeGlass,
    atriumClearGlass,
    whiteLimestone,
    travertineBase,
    acousticWoodSoffit,
    terrazzoFloor,
    granitePavers,
    warmMullions,
    timelineGlow,
    timelineNodeActive,
    timelineGlass,
    signageBackdrop,
    canopyTrim,
  };

  return sharedCareerMaterials;
}

import * as THREE from 'three';

const skillsTextureCache = new Map<string, THREE.Texture>();

function createOffscreenCanvas(width: number, height: number): HTMLCanvasElement | null {
  if (typeof window === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/**
 * High-rise vertical tower glass texture with rhythmic floor spandrels
 * and subtle vertical mullions matching modern architectural glass.
 */
export function getSkillsTowerGlassTexture(): THREE.CanvasTexture {
  const key = 'skills_tower_glass_v2';
  if (skillsTextureCache.has(key)) return skillsTextureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Deep corporate blue-gray foundation
  ctx.fillStyle = '#0a1424';
  ctx.fillRect(0, 0, 512, 512);

  // Horizontal bronze floor spandrel bands (every 51px = 10 floors)
  for (let y = 0; y < 512; y += 51) {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, y, 512, 14);
    // Warm bronze metallic reveal line
    ctx.fillStyle = '#d97706';
    ctx.fillRect(0, y + 14, 512, 2.5);
  }

  // Vertical window mullion grids (every 32px)
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  for (let x = 0; x < 512; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  // Subtle interior warm office lighting accents on alternating windows
  ctx.fillStyle = 'rgba(254, 243, 199, 0.08)';
  for (let y = 16; y < 512; y += 51) {
    for (let x = 6; x < 512; x += 48) {
      if ((x + y) % 3 === 0) {
        ctx.fillRect(x, y, 22, 30);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  skillsTextureCache.set(key, texture);
  return texture;
}

/**
 * Interactive Lobby Technology Directory Screen Texture
 */
export function getSkillsDirectoryScreenTexture(): THREE.CanvasTexture {
  const key = 'skills_directory_screen_v2';
  if (skillsTextureCache.has(key)) return skillsTextureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(1024, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Deep tech background
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, 1024, 512);

  // Header banner
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 1024, 80);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, 1024, 80);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 30px "Segoe UI", Arial, sans-serif';
  ctx.fillText('SKILLS & TECHNOLOGY TOWER — DIRECTORY', 40, 52);

  ctx.fillStyle = '#f59e0b';
  ctx.font = '16px monospace';
  ctx.fillText('10 FLOORS // SELECT A TECHNICAL CATEGORY', 640, 50);

  // Floor Rows
  const floors = [
    { num: 'ROOF', title: 'TECHNOLOGY OBSERVATORY', tech: 'Skyline Terrace • Interactive Matrix', color: '#f97316' },
    { num: 'FL 08', title: 'RESEARCH & AI', tech: 'Artificial Intelligence • RAG • Three.js WebGL', color: '#8b5cf6' },
    { num: 'FL 07', title: 'DEVELOPMENT TOOLS', tech: 'Git • GitHub • Firebase • CI/CD', color: '#ec4899' },
    { num: 'FL 06', title: 'DATABASES & INTEGRATION', tech: 'MongoDB • REST API Integration', color: '#14b8a6' },
    { num: 'FL 05', title: 'PROGRAMMING LANGUAGES', tech: 'Python • JavaScript ES6+ • System Design', color: '#f59e0b' },
    { num: 'FL 04', title: 'FULL STACK (MERN)', tech: 'MERN Stack • Full Lifecycle Architecture', color: '#a855f7' },
    { num: 'FL 03', title: 'BACKEND DEVELOPMENT', tech: 'Node.js • Express • REST APIs • Microservices', color: '#6366f1' },
    { num: 'FL 02', title: 'MOBILE DEVELOPMENT', tech: 'React Native • Flutter • iOS & Android', color: '#10b981' },
    { num: 'FL 01', title: 'FRONTEND DEVELOPMENT', tech: 'React.js • Modern JavaScript • HTML5 • CSS3', color: '#00f0ff' },
    { num: 'GRND', title: 'WELCOME & PROFILE', tech: 'Developer Overview • System Architecture', color: '#38bdf8' },
  ];

  floors.slice(0, 5).forEach((fl, idx) => {
    const y = 95 + idx * 80;
    ctx.fillStyle = '#111827';
    ctx.fillRect(30, y, 964, 70);
    ctx.strokeStyle = fl.color;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(30, y, 964, 70);

    ctx.fillStyle = fl.color;
    ctx.font = 'bold 22px monospace';
    ctx.fillText(fl.num, 50, y + 42);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
    ctx.fillText(fl.title, 140, y + 42);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '15px "Segoe UI", Arial, sans-serif';
    ctx.fillText(fl.tech, 460, y + 42);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  skillsTextureCache.set(key, texture);
  return texture;
}

export interface SkillsMaterialsContainer {
  towerCurtainGlass: THREE.MeshPhysicalMaterial;
  lobbyGlass: THREE.MeshPhysicalMaterial;
  darkCharcoalFrame: THREE.MeshStandardMaterial;
  warmBronze: THREE.MeshStandardMaterial;
  verticalFins: THREE.MeshStandardMaterial;
  darkMullions: THREE.MeshStandardMaterial;
  whiteLimestone: THREE.MeshStandardMaterial;
  warmWoodSoffit: THREE.MeshStandardMaterial;
  cyanAccent: THREE.MeshStandardMaterial;
  bronzeAccent: THREE.MeshStandardMaterial;
  terrazzoFloor: THREE.MeshStandardMaterial;
  granitePavers: THREE.MeshStandardMaterial;
  stainlessSteel: THREE.MeshStandardMaterial;
  directoryScreen: THREE.MeshBasicMaterial;
}

let sharedSkillsMaterials: SkillsMaterialsContainer | null = null;

export function getSharedSkillsMaterials(): SkillsMaterialsContainer {
  if (sharedSkillsMaterials) return sharedSkillsMaterials;

  const glassTex = getSkillsTowerGlassTexture();
  const screenTex = getSkillsDirectoryScreenTexture();

  sharedSkillsMaterials = {
    // 1. High-rise reflective solar curtain wall glazing (Single pass PBR)
    towerCurtainGlass: new THREE.MeshPhysicalMaterial({
      color: '#111e33',
      map: glassTex,
      roughness: 0.10,
      metalness: 0.65,
      reflectivity: 0.95,
      clearcoat: 0.95,
      clearcoatRoughness: 0.04,
    }),

    // 2. Ground Lobby Ultra-Clear Low-Iron Glass
    lobbyGlass: new THREE.MeshPhysicalMaterial({
      color: '#08121e',
      roughness: 0.04,
      metalness: 0.15,
      reflectivity: 0.95,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.25,
    }),

    // 3. Dark Charcoal Monolithic Structural Frame & Shear Walls (Reference Image)
    darkCharcoalFrame: new THREE.MeshStandardMaterial({
      color: '#181e28',
      roughness: 0.42,
      metalness: 0.45,
    }),

    // 4. Warm Architectural Bronze / Copper Accents (Reference Image)
    warmBronze: new THREE.MeshStandardMaterial({
      color: '#d97706',
      roughness: 0.28,
      metalness: 0.85,
    }),

    // 5. Vertical Architectural Fins
    verticalFins: new THREE.MeshStandardMaterial({
      color: '#b45309',
      roughness: 0.30,
      metalness: 0.80,
    }),

    // 6. Dark Charcoal Anodized Aluminum Mullions
    darkMullions: new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.38,
      metalness: 0.75,
    }),

    // 7. White Architectural Limestone Accents
    whiteLimestone: new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.65,
      metalness: 0.05,
    }),

    // 8. Warm Natural Acoustic Slat Timber Soffit
    warmWoodSoffit: new THREE.MeshStandardMaterial({
      color: '#b45309',
      roughness: 0.55,
      metalness: 0.05,
    }),

    // 9. Cyan Architectural Accent Lighting
    cyanAccent: new THREE.MeshStandardMaterial({
      color: '#00f0ff',
      emissive: '#00f0ff',
      emissiveIntensity: 1.8,
      roughness: 0.2,
    }),

    // 10. Bronze Architectural Accent Lighting
    bronzeAccent: new THREE.MeshStandardMaterial({
      color: '#f59e0b',
      emissive: '#d97706',
      emissiveIntensity: 1.5,
      roughness: 0.25,
    }),

    // 11. Polished Terrazzo Lobby Floor
    terrazzoFloor: new THREE.MeshStandardMaterial({
      color: '#334155',
      roughness: 0.20,
      metalness: 0.18,
    }),

    // 12. Granite Plaza Pavers
    granitePavers: new THREE.MeshStandardMaterial({
      color: '#3f3f46',
      roughness: 0.68,
      metalness: 0.05,
    }),

    // 13. Polished Stainless Steel Handrails
    stainlessSteel: new THREE.MeshStandardMaterial({
      color: '#e2e8f0',
      roughness: 0.18,
      metalness: 0.88,
    }),

    // 14. Interactive Lobby Directory Screen
    directoryScreen: new THREE.MeshBasicMaterial({
      map: screenTex,
    }),
  };

  return sharedSkillsMaterials;
}

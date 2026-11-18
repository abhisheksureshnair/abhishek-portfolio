import * as THREE from 'three';

let sharedMaterials: {
  shellExterior: THREE.MeshStandardMaterial;
  shellInterior: THREE.MeshStandardMaterial;
  curtainGlass: THREE.MeshPhysicalMaterial;
  structuralColumns: THREE.MeshStandardMaterial;
  structuralGraphite: THREE.MeshStandardMaterial;
  granitePodium: THREE.MeshStandardMaterial;
  timberDeckPlaza: THREE.MeshStandardMaterial;
  reflectingWater: THREE.MeshPhysicalMaterial;
  archRibsWarmGlow: THREE.MeshStandardMaterial;
  illuminatedSpire: THREE.MeshStandardMaterial;
  mullionSilver: THREE.MeshStandardMaterial;
  cyanAccentGlow: THREE.MeshStandardMaterial;
  mediaRibbon: THREE.MeshStandardMaterial;
  hologramGlobe: THREE.MeshStandardMaterial;
  hologramRing: THREE.MeshStandardMaterial;
  networkNode: THREE.MeshStandardMaterial;
  terraceBalustrade: THREE.MeshPhysicalMaterial;
  signBacking: THREE.MeshStandardMaterial;
  signageGlow: THREE.MeshStandardMaterial;
} | null = null;

/**
 * Creates procedural pearlescent silver/titanium aerodynamic shell texture
 */
function createPearlescentShellTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#f8fafc');
  grad.addColorStop(0.5, '#e2e8f0');
  grad.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)';
  ctx.lineWidth = 1.5;
  for (let x = 0; x < 512; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y < 512; y += 128) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates procedural teak/timber deck boardwalk texture
 * Faithfully reproducing the rich warm forecourt terrace in media_1795005456202_bf2f1ab0.jpg
 */
function createTimberDeckTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm cedar / teak wood base
  ctx.fillStyle = '#6b4f3a';
  ctx.fillRect(0, 0, 512, 512);

  // Planks
  const plankH = 16;
  for (let y = 0; y < 512; y += plankH) {
    const plankColorVariation = Math.floor(Math.sin(y * 1.8) * 15);
    const r = Math.max(0, Math.min(255, 115 + plankColorVariation));
    const g = Math.max(0, Math.min(255, 85 + plankColorVariation));
    const b = Math.max(0, Math.min(255, 65 + plankColorVariation));
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, y, 512, plankH - 2);

    // Plank seam
    ctx.fillStyle = '#3a271b';
    ctx.fillRect(0, y + plankH - 2, 512, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates procedural panoramic digital transmission ribbon texture
 */
function createDigitalRibbonTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const bg = ctx.createLinearGradient(0, 0, 1024, 0);
  bg.addColorStop(0, '#060919');
  bg.addColorStop(0.3, '#0b132b');
  bg.addColorStop(0.6, '#1c1438');
  bg.addColorStop(1, '#081c2e');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 256);

  const waveGrad = ctx.createLinearGradient(0, 50, 1024, 200);
  waveGrad.addColorStop(0, 'rgba(6, 182, 212, 0.7)');
  waveGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.9)');
  waveGrad.addColorStop(0.65, 'rgba(168, 85, 247, 0.85)');
  waveGrad.addColorStop(1, 'rgba(236, 72, 153, 0.75)');

  ctx.beginPath();
  ctx.moveTo(0, 140);
  ctx.bezierCurveTo(256, 60, 512, 220, 768, 100);
  ctx.bezierCurveTo(900, 40, 980, 160, 1024, 120);
  ctx.lineTo(1024, 256);
  ctx.lineTo(0, 256);
  ctx.closePath();
  ctx.fillStyle = waveGrad;
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px "SF Mono", monospace';
  ctx.fillText('GLOBAL TRANSMISSION BACKBONE // ACTIVE NODES: 2,481', 40, 45);
  ctx.font = '12px "SF Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('ENCRYPTION: TLS 1.3 • PROTOCOL: WEBSOCKET / REST • LATENCY: 12ms', 40, 75);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates procedural granite pavers
 */
function createGranitePlazaTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#334155';
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3;
  for (let x = 0; x < 512; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y < 512; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Returns singleton PBR materials for Contact & Collaboration Hub
 */
export function getSharedContactMaterials() {
  if (sharedMaterials) return sharedMaterials;

  const shellTex = createPearlescentShellTexture();
  const timberTex = createTimberDeckTexture();
  const ribbonTex = createDigitalRibbonTexture();
  const plazaTex = createGranitePlazaTexture();

  sharedMaterials = {
    // 1. Aerodynamic sweeping outer canopy shell
    shellExterior: new THREE.MeshStandardMaterial({
      map: shellTex,
      color: '#f8fafc',
      roughness: 0.28,
      metalness: 0.65,
    }),

    // 2. Graphite structural underside / fascia
    shellInterior: new THREE.MeshStandardMaterial({
      color: '#1e293b',
      roughness: 0.45,
      metalness: 0.6,
    }),

    // 3. Panoramic floor-to-ceiling curved glass curtain wall
    curtainGlass: new THREE.MeshPhysicalMaterial({
      color: '#cffafe',
      transmission: 0.88,
      opacity: 0.92,
      transparent: true,
      roughness: 0.06,
      metalness: 0.12,
      ior: 1.52,
      thickness: 0.8,
      reflectivity: 0.75,
    }),

    // 4. Round brushed metallic architectural columns
    structuralColumns: new THREE.MeshStandardMaterial({
      color: '#e2e8f0',
      roughness: 0.2,
      metalness: 0.85,
    }),

    // 5. Dark graphite structural frames and mullions
    structuralGraphite: new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.35,
      metalness: 0.7,
    }),

    // 6. Granite forecourt podium
    granitePodium: new THREE.MeshStandardMaterial({
      map: plazaTex,
      color: '#cbd5e1',
      roughness: 0.7,
      metalness: 0.1,
    }),

    // 7. Rich Teak/Timber Boardwalk Deck
    timberDeckPlaza: new THREE.MeshStandardMaterial({
      map: timberTex,
      color: '#85583f',
      roughness: 0.65,
      metalness: 0.05,
    }),

    // 8. Reflecting Pool Water
    reflectingWater: new THREE.MeshPhysicalMaterial({
      color: '#030712',
      transmission: 0.7,
      opacity: 0.88,
      transparent: true,
      roughness: 0.04,
      metalness: 0.25,
      ior: 1.333,
      reflectivity: 0.9,
    }),

    // 9. Vaulted Archway Under-ribs (Glowing Warm-White / Violet illumination)
    archRibsWarmGlow: new THREE.MeshStandardMaterial({
      color: '#faf5ff',
      emissive: new THREE.Color('#c084fc'),
      emissiveIntensity: 2.2,
      roughness: 0.15,
    }),

    // 10. Fiber-Optic Illuminated Light Spires (In water basin)
    illuminatedSpire: new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: new THREE.Color('#38bdf8'),
      emissiveIntensity: 3.0,
      roughness: 0.1,
    }),

    // 11. Polished Silver Mullions
    mullionSilver: new THREE.MeshStandardMaterial({
      color: '#f1f5f9',
      roughness: 0.18,
      metalness: 0.88,
    }),

    // 12. Glowing cyan architectural accents and crown illumination
    cyanAccentGlow: new THREE.MeshStandardMaterial({
      color: '#00f0ff',
      emissive: new THREE.Color('#00f0ff'),
      emissiveIntensity: 2.4,
      roughness: 0.2,
      metalness: 0.2,
    }),

    // 13. Glowing digital media ribbon inside the lobby
    mediaRibbon: new THREE.MeshStandardMaterial({
      map: ribbonTex,
      emissive: new THREE.Color('#38bdf8'),
      emissiveIntensity: 1.5,
      emissiveMap: ribbonTex,
      roughness: 0.3,
      metalness: 0.1,
    }),

    // 14. Holographic communication globe
    hologramGlobe: new THREE.MeshStandardMaterial({
      color: '#38bdf8',
      emissive: new THREE.Color('#0284c7'),
      emissiveIntensity: 1.8,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
      roughness: 0.1,
    }),

    // 15. Hologram orbital rings
    hologramRing: new THREE.MeshStandardMaterial({
      color: '#00f0ff',
      emissive: new THREE.Color('#00f0ff'),
      emissiveIntensity: 2.5,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
      metalness: 0.1,
    }),

    // 16. Network communication node markers
    networkNode: new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: new THREE.Color('#38bdf8'),
      emissiveIntensity: 3.0,
      roughness: 0.1,
      metalness: 0.5,
    }),

    // 17. Glass terrace balustrades
    terraceBalustrade: new THREE.MeshPhysicalMaterial({
      color: '#e0f2fe',
      transmission: 0.85,
      opacity: 0.6,
      transparent: true,
      roughness: 0.1,
      metalness: 0.1,
      ior: 1.5,
    }),

    // 18. Signage obsidian backing panel
    signBacking: new THREE.MeshStandardMaterial({
      color: '#090d16',
      roughness: 0.45,
      metalness: 0.8,
    }),

    // 19. Signage glowing typography
    signageGlow: new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: new THREE.Color('#38bdf8'),
      emissiveIntensity: 2.0,
      roughness: 0.2,
    }),
  };

  return sharedMaterials;
}

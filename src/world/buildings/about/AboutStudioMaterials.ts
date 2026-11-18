import * as THREE from 'three';

let sharedMaterials: {
  timberSoffit: THREE.MeshStandardMaterial;
  limestonePodium: THREE.MeshStandardMaterial;
  limestoneWall: THREE.MeshStandardMaterial;
  structuralBronze: THREE.MeshStandardMaterial;
  curtainGlass: THREE.MeshPhysicalMaterial;
  atriumGlass: THREE.MeshPhysicalMaterial;
  recessedLightSlat: THREE.MeshStandardMaterial;
  guardrailMesh: THREE.MeshStandardMaterial;
  guardrailTopRail: THREE.MeshStandardMaterial;
  galleryTerrazzo: THREE.MeshStandardMaterial;
  timberScreenSlat: THREE.MeshStandardMaterial;
  signageGlow: THREE.MeshStandardMaterial;
  mediaScreen: THREE.MeshStandardMaterial;
} | null = null;

/**
 * Creates procedural high-quality timber slat texture for deep roof soffit
 * faithfully reproducing the natural wood ceiling in reference photo media_1794827385268_8a05b94a.jpg
 */
function createTimberSoffitTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm cedar / oak base
  ctx.fillStyle = '#b47846';
  ctx.fillRect(0, 0, 512, 512);

  // Natural wood grain gradient variation
  for (let y = 0; y < 512; y += 4) {
    const alpha = 0.04 + Math.sin(y * 0.1) * 0.03;
    ctx.fillStyle = y % 8 === 0 ? `rgba(139, 78, 36, ${alpha})` : `rgba(217, 154, 98, ${alpha})`;
    ctx.fillRect(0, y, 512, 4);
  }

  // Linear dark reveal gaps between timber planks
  ctx.fillStyle = '#3c2211';
  for (let x = 0; x < 512; x += 32) {
    ctx.fillRect(x, 0, 3, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates procedural light limestone / architectural concrete texture
 */
function createLimestoneTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#e2dfd8';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle concrete aggregate specks
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const radius = Math.random() * 1.5;
    const shade = Math.random() > 0.5 ? 'rgba(0,0,0,0.035)' : 'rgba(255,255,255,0.06)';
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Subtle formwork panel seams
  ctx.strokeStyle = 'rgba(120, 115, 105, 0.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, 256, 256);
  ctx.strokeRect(256, 0, 256, 256);
  ctx.strokeRect(0, 256, 256, 256);
  ctx.strokeRect(256, 256, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates procedural wire-mesh texture for architectural terrace guardrail
 */
function createGuardrailMeshTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 128, 128);

  // Wire mesh diamond pattern
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.8;

  for (let i = -128; i < 256; i += 16) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 128, 128);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i + 128, 0);
    ctx.lineTo(i, 128);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 3);
  return texture;
}

/**
 * Initializes and returns singleton shared PBR materials for About Studio
 */
export function getSharedAboutStudioMaterials() {
  if (!sharedMaterials) {
    const timberTex = createTimberSoffitTexture();
    const limestoneTex = createLimestoneTexture();
    const meshTex = createGuardrailMeshTexture();

    sharedMaterials = {
      // 1. Warm Cedar / Timber Slat Roof Soffit
      timberSoffit: new THREE.MeshStandardMaterial({
        map: timberTex,
        roughness: 0.65,
        metalness: 0.05,
        color: '#c98a54',
      }),

      // 2. Raised Architectural Limestone Podium / Terrace
      limestonePodium: new THREE.MeshStandardMaterial({
        map: limestoneTex,
        roughness: 0.85,
        metalness: 0.08,
        color: '#e5e2da',
      }),

      // 3. Smooth Limestone Wall Panels
      limestoneWall: new THREE.MeshStandardMaterial({
        map: limestoneTex,
        roughness: 0.78,
        metalness: 0.05,
        color: '#ece9e1',
      }),

      // 4. Dark Architectural Bronze Structural Frames & Mullions
      structuralBronze: new THREE.MeshStandardMaterial({
        roughness: 0.42,
        metalness: 0.75,
        color: '#1a1816',
      }),

      // 5. Panoramic Floor-to-Ceiling Curtain Wall Glass
      curtainGlass: new THREE.MeshPhysicalMaterial({
        roughness: 0.08,
        transmission: 0.88,
        thickness: 0.45,
        ior: 1.52,
        transparent: true,
        opacity: 0.82,
        color: '#dbeafe',
        reflectivity: 0.9,
      }),

      // 6. Ultra-Clear Atrium Double-Height Glass
      atriumGlass: new THREE.MeshPhysicalMaterial({
        roughness: 0.05,
        transmission: 0.92,
        thickness: 0.35,
        ior: 1.5,
        transparent: true,
        opacity: 0.75,
        color: '#ffffff',
      }),

      // 7. Linear Recessed Downlight Slats in Timber Soffit
      recessedLightSlat: new THREE.MeshStandardMaterial({
        color: '#fffbeb',
        emissive: '#fde68a',
        emissiveIntensity: 2.2,
        roughness: 0.3,
      }),

      // 8. Architectural Wire-Mesh Guardrail Infill
      guardrailMesh: new THREE.MeshStandardMaterial({
        alphaMap: meshTex,
        transparent: true,
        opacity: 0.85,
        roughness: 0.4,
        metalness: 0.8,
        color: '#cbd5e1',
        side: THREE.DoubleSide,
      }),

      // 9. Steel Guardrail Top Rail & Stanchions
      guardrailTopRail: new THREE.MeshStandardMaterial({
        roughness: 0.35,
        metalness: 0.85,
        color: '#334155',
      }),

      // 10. Polished Interior Terrazzo Gallery Floor
      galleryTerrazzo: new THREE.MeshStandardMaterial({
        roughness: 0.3,
        metalness: 0.15,
        color: '#f1f5f9',
      }),

      // 11. Natural Vertical Timber Screen Slats
      timberScreenSlat: new THREE.MeshStandardMaterial({
        roughness: 0.6,
        metalness: 0.05,
        color: '#b46d3b',
      }),

      // 12. Warm Terracotta / Amber Signage Glow
      signageGlow: new THREE.MeshStandardMaterial({
        color: '#f97316',
        emissive: '#f97316',
        emissiveIntensity: 2.0,
        roughness: 0.2,
      }),

      // 13. Digital Media Wall Screen
      mediaScreen: new THREE.MeshStandardMaterial({
        color: '#0f172a',
        emissive: '#0284c7',
        emissiveIntensity: 0.6,
        roughness: 0.25,
      }),
    };
  }

  return sharedMaterials;
}

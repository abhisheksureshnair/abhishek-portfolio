import * as THREE from 'three';

const hqTextureCache = new Map<string, THREE.Texture>();

function createOffscreenCanvas(width: number, height: number): HTMLCanvasElement | null {
  if (typeof window === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/**
 * 1. Premium Blue-Gray Reflective Glass Curtain Wall Texture
 * Vibrant modern American corporate glazing with crisp white/charcoal mullions,
 * horizontal spandrels, and warm interior ambient office glow.
 */
export function getHQGlassFacadeTexture(): THREE.CanvasTexture {
  const key = 'hq_glass_facade_v2';
  if (hqTextureCache.has(key)) return hqTextureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Deep architectural blue-gray sky-reflecting foundation
  ctx.fillStyle = '#0f2744';
  ctx.fillRect(0, 0, 512, 512);

  const floors = 4;
  const bays = 4;
  const floorH = 512 / floors;
  const bayW = 512 / bays;
  const spandrelH = floorH * 0.20;

  for (let r = 0; r < floors; r++) {
    const yTop = r * floorH;
    const yWindow = yTop + spandrelH;
    const windowH = floorH - spandrelH;

    // Dark charcoal-blue floor spandrel band
    ctx.fillStyle = '#1e3a5f';
    ctx.fillRect(0, yTop, 512, spandrelH);

    // Fine brushed aluminum reveal line
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(0, yWindow);
    ctx.lineTo(512, yWindow);
    ctx.stroke();

    for (let c = 0; c < bays; c++) {
      const xLeft = c * bayW;

      // Realistic executive office interior glow: warm 2800K light on select offices
      const isLit = (r * 3 + c * 5) % 2 === 0;
      if (isLit) {
        // Office illuminated background
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(xLeft + 3, yWindow + 3, bayW - 6, windowH - 6);

        // Gradient down to architectural blue glass reflection
        const grad = ctx.createLinearGradient(0, yWindow, 0, yWindow + windowH);
        grad.addColorStop(0, 'rgba(254, 240, 138, 0.65)');
        grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.40)');
        grad.addColorStop(1, 'rgba(15, 39, 68, 0.75)');
        ctx.fillStyle = grad;
        ctx.fillRect(xLeft + 3, yWindow + 3, bayW - 6, windowH - 6);
      } else {
        // Deep blue-gray sky-reflecting glazing
        const grad = ctx.createLinearGradient(0, yWindow, 0, yWindow + windowH);
        grad.addColorStop(0, '#38bdf8');
        grad.addColorStop(0.3, '#0284c7');
        grad.addColorStop(1, '#0f2744');
        ctx.fillStyle = grad;
        ctx.fillRect(xLeft + 3, yWindow + 3, bayW - 6, windowH - 6);
      }

      // Interior blinds/mullion shadow
      if ((r + c) % 3 === 0) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
        ctx.fillRect(xLeft + 3, yWindow + 3, bayW - 6, windowH * 0.35);
      }
    }
  }

  // Crisp structural aluminum vertical mullions
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 3.5;
  for (let x = 0; x <= 512; x += bayW) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  hqTextureCache.set(key, texture);
  return texture;
}

/**
 * 2. Warm Vertical Oak Acoustic Slats Texture (Lobby Feature Wall)
 */
export function getHQTimberSlatsTexture(): THREE.CanvasTexture {
  const key = 'hq_timber_slats_v2';
  if (hqTextureCache.has(key)) return hqTextureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(256, 256);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Dark recessed shadow backing
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(0, 0, 256, 256);

  // Vertical warm oak wood slats
  const slatW = 8;
  const gapW = 4;
  const pitch = slatW + gapW;

  for (let x = 0; x < 256; x += pitch) {
    const shade = (x / pitch) % 2 === 0 ? '#b45309' : '#92400e';
    ctx.fillStyle = shade;
    ctx.fillRect(x, 0, slatW, 256);

    // Warm wood grain highlight
    ctx.fillStyle = 'rgba(251, 191, 36, 0.20)';
    ctx.fillRect(x + 1, 0, 2, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  hqTextureCache.set(key, texture);
  return texture;
}

/**
 * 2B. Luxury Architectural Timber Soffit Texture (Entrance Canopy Underside)
 * Warm teak/oak planks with subtle recessed warm circular LED downlights.
 * Matches Reference Photos 2 & 4.
 */
export function getHQTimberSoffitTexture(): THREE.CanvasTexture {
  const key = 'hq_timber_soffit_v1';
  if (hqTextureCache.has(key)) return hqTextureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Rich warm honey-teak timber foundation
  ctx.fillStyle = '#92400e';
  ctx.fillRect(0, 0, 512, 512);

  const plankH = 32;
  for (let y = 0; y < 512; y += plankH) {
    const isAlt = (y / plankH) % 2 === 0;
    ctx.fillStyle = isAlt ? '#a16207' : '#854d0e';
    ctx.fillRect(0, y, 512, plankH - 2);

    // Wood grain streak
    ctx.fillStyle = 'rgba(253, 230, 138, 0.15)';
    ctx.fillRect(0, y + 2, 512, 4);

    // Fine dark reveal joint
    ctx.fillStyle = '#451a03';
    ctx.fillRect(0, y + plankH - 2, 512, 2);
  }

  // Recessed warm LED downlight apertures array
  const cols = [96, 256, 416];
  const rows = [128, 256, 384];
  for (const cx of cols) {
    for (const cy of rows) {
      // Dark bezel ring
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();

      // Brushed stainless rim
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 16, 0, Math.PI * 2);
      ctx.stroke();

      // Warm luminous 2800K LED core
      const radGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 14);
      radGrad.addColorStop(0, '#ffffff');
      radGrad.addColorStop(0.4, '#fef08a');
      radGrad.addColorStop(1, '#f59e0b');
      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  hqTextureCache.set(key, texture);
  return texture;
}

/**
 * 2C. Backlit Architectural Marble/Onyx Feature Wall Texture
 * Translucent warm stone with soft glowing backlit brand illumination.
 * Matches Reference Photo 2.
 */
export function getHQBacklitOnyxTexture(): THREE.CanvasTexture {
  const key = 'hq_backlit_onyx_v1';
  if (hqTextureCache.has(key)) return hqTextureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 256);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Soft luminous warm stone gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#fef3c7');
  grad.addColorStop(0.5, '#fde68a');
  grad.addColorStop(1, '#fef3c7');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  // Subtle natural marble/onyx veins
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.22)';
  ctx.lineWidth = 3.0;
  ctx.beginPath();
  ctx.moveTo(30, 0);
  ctx.bezierCurveTo(120, 80, 80, 160, 190, 256);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(180, 83, 9, 0.16)';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(320, 0);
  ctx.bezierCurveTo(400, 90, 360, 180, 480, 256);
  ctx.stroke();

  // Central illuminated architectural monogram/brand text
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ABHISHEK S NAIR', 256, 118);

  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
  ctx.fillText('SOFTWARE ARCHITECT & DEVELOPER', 256, 160);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  hqTextureCache.set(key, texture);
  return texture;
}

/**
 * 3. Polished Granite Forecourt Pavers Texture
 */
export function getHQGranitePaversTexture(): THREE.CanvasTexture {
  const key = 'hq_granite_pavers_v2';
  if (hqTextureCache.has(key)) return hqTextureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(256, 256);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#27272a';
  ctx.fillRect(0, 0, 256, 256);

  const imgData = ctx.getImageData(0, 0, 256, 256);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 12;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  ctx.strokeStyle = '#18181b';
  ctx.lineWidth = 2;
  const paverSize = 64;
  for (let x = 0; x <= 256; x += paverSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }
  for (let y = 0; y <= 256; y += paverSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  hqTextureCache.set(key, texture);
  return texture;
}

/**
 * 4. Monument Sign Atlas Texture
 */
export function getHQMonumentSignTexture(
  primaryText: string = 'ABHISHEK S NAIR',
  secondaryText: string = 'SOFTWARE ENGINEER | FULL STACK DEVELOPER'
): THREE.CanvasTexture {
  const key = `hq_monument_sign_${primaryText}_${secondaryText}`;
  if (hqTextureCache.has(key)) return hqTextureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 128);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Dark charcoal foundation
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, 512, 128);

  // Metallic border rim
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.strokeRect(6, 6, 500, 116);

  // Active status beacon
  ctx.fillStyle = '#06b6d4';
  ctx.beginPath();
  ctx.arc(36, 46, 7, 0, Math.PI * 2);
  ctx.fill();

  // Primary Brand Typography
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(primaryText, 56, 46);

  // Secondary Role Typography
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px "Segoe UI", Arial, sans-serif';
  ctx.fillText(secondaryText, 56, 82);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  hqTextureCache.set(key, texture);
  return texture;
}

export interface HQMaterialsContainer {
  curtainGlass: THREE.MeshPhysicalMaterial;
  lobbyGlass: THREE.MeshPhysicalMaterial;
  structuralFraming: THREE.MeshStandardMaterial;
  whiteLimestone: THREE.MeshStandardMaterial;
  warmConcrete: THREE.MeshStandardMaterial;
  stainlessSteel: THREE.MeshStandardMaterial;
  verticalFins: THREE.MeshStandardMaterial;
  granitePavers: THREE.MeshStandardMaterial;
  reflectingWater: THREE.MeshStandardMaterial;
  timberSlats: THREE.MeshStandardMaterial;
  timberSoffit: THREE.MeshStandardMaterial;
  backlitOnyx: THREE.MeshStandardMaterial;
  leatherLounge: THREE.MeshStandardMaterial;
  planterFoliage: THREE.MeshStandardMaterial;
  flutedGlass: THREE.MeshPhysicalMaterial;
  terrazzoFloor: THREE.MeshStandardMaterial;
  monumentSign: THREE.MeshStandardMaterial;
  canopyLettering: THREE.MeshStandardMaterial;
  roofMechanical: THREE.MeshStandardMaterial;
}

let sharedHQMaterials: HQMaterialsContainer | null = null;

export function getSharedHQMaterials(): HQMaterialsContainer {
  if (sharedHQMaterials) return sharedHQMaterials;

  const glassTex = getHQGlassFacadeTexture();
  const timberTex = getHQTimberSlatsTexture();
  const soffitTex = getHQTimberSoffitTexture();
  const onyxTex = getHQBacklitOnyxTexture();
  const paversTex = getHQGranitePaversTexture();
  const signTex = getHQMonumentSignTexture();

  sharedHQMaterials = {
    // 1. Tower Upper Floor Blue-Gray Solar Glass Curtain Wall (Vibrant reflective corporate glazing)
    curtainGlass: new THREE.MeshPhysicalMaterial({
      color: '#38bdf8',
      map: glassTex,
      roughness: 0.10,
      metalness: 0.35,
      reflectivity: 0.95,
      clearcoat: 0.90,
      clearcoatRoughness: 0.05,
    }),

    // 2. Double-Height Ground Lobby Low-Iron Clear Architectural Glass (SINGLE-PASS, zero extra render pass!)
    lobbyGlass: new THREE.MeshPhysicalMaterial({
      color: '#0f172a',
      roughness: 0.06,
      metalness: 0.12,
      reflectivity: 0.95,
      clearcoat: 0.95,
      clearcoatRoughness: 0.04,
      transparent: true,
      opacity: 0.38,
    }),

    // 3. Dark Charcoal Anodized Aluminum Framing & Mullions
    structuralFraming: new THREE.MeshStandardMaterial({
      color: '#18181b',
      roughness: 0.35,
      metalness: 0.70,
    }),

    // 4. Honed White/Light-Gray Architectural Limestone Facade Panels & Entrance Portal
    whiteLimestone: new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.72,
      metalness: 0.04,
    }),

    // 5. Warm-Gray Precast Structural Concrete
    warmConcrete: new THREE.MeshStandardMaterial({
      color: '#94a3b8',
      roughness: 0.80,
      metalness: 0.05,
    }),

    // 6. Polished 316 Stainless Steel Pilotis Columns & Revolving Door Canopy
    stainlessSteel: new THREE.MeshStandardMaterial({
      color: '#e2e8f0',
      roughness: 0.18,
      metalness: 0.85,
    }),

    // 7. Dark Aerodynamic Vertical Solar Shading Fins
    verticalFins: new THREE.MeshStandardMaterial({
      color: '#334155',
      roughness: 0.30,
      metalness: 0.60,
    }),

    // 8. Honed Granite Forecourt Pavers
    granitePavers: new THREE.MeshStandardMaterial({
      color: '#3f3f46',
      map: paversTex,
      roughness: 0.70,
      metalness: 0.05,
    }),

    // 9. Calm Architectural Reflection Pool / Water Mirror (SINGLE-PASS, zero extra render pass!)
    reflectingWater: new THREE.MeshStandardMaterial({
      color: '#0284c7',
      roughness: 0.08,
      metalness: 0.30,
      transparent: true,
      opacity: 0.85,
    }),

    // 10. Warm Vertical Oak Acoustic Slats for Lobby Feature Wall
    timberSlats: new THREE.MeshStandardMaterial({
      color: '#d97706',
      map: timberTex,
      roughness: 0.55,
      metalness: 0.02,
    }),

    // 10B. Luxury Warm Timber Soffit with Integrated LED Apertures (Canopy underside, Photos 2 & 4)
    timberSoffit: new THREE.MeshStandardMaterial({
      color: '#b45309',
      map: soffitTex,
      roughness: 0.48,
      metalness: 0.04,
    }),

    // 10C. Translucent Backlit Marble/Onyx Feature Wall with Monogram (Photo 2)
    backlitOnyx: new THREE.MeshStandardMaterial({
      color: '#ffffff',
      map: onyxTex,
      emissive: '#fef3c7',
      emissiveIntensity: 0.55,
      roughness: 0.35,
      metalness: 0.05,
    }),

    // 10D. Executive Charcoal Leather Lounge Seating
    leatherLounge: new THREE.MeshStandardMaterial({
      color: '#1e293b',
      roughness: 0.65,
      metalness: 0.10,
    }),

    // 10E. Deep Architectural Foliage for Planters & Hedges
    planterFoliage: new THREE.MeshStandardMaterial({
      color: '#15803d',
      roughness: 0.80,
      metalness: 0.05,
    }),

    // 10F. Fluted / Reeded Glass Partition Screen
    flutedGlass: new THREE.MeshPhysicalMaterial({
      color: '#38bdf8',
      roughness: 0.30,
      metalness: 0.10,
      reflectivity: 0.90,
      clearcoat: 0.95,
      transparent: true,
      opacity: 0.52,
    }),

    // 11. Polished Terrazzo/Granite Lobby Interior Floor
    terrazzoFloor: new THREE.MeshStandardMaterial({
      color: '#1e293b',
      roughness: 0.25,
      metalness: 0.20,
    }),

    // 12. Pylon Monument Sign Surface
    monumentSign: new THREE.MeshStandardMaterial({
      color: '#ffffff',
      map: signTex,
      roughness: 0.40,
      metalness: 0.10,
    }),

    // 13. Canopy Illuminated Brand Lettering
    canopyLettering: new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      emissive: '#38bdf8',
      emissiveIntensity: 1.8,
      roughness: 0.20,
    }),

    // 14. Galvanized Steel Rooftop Mechanical Equipment
    roofMechanical: new THREE.MeshStandardMaterial({
      color: '#475569',
      roughness: 0.55,
      metalness: 0.65,
    }),
  };

  return sharedHQMaterials;
}

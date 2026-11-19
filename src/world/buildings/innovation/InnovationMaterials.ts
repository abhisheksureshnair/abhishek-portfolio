import * as THREE from 'three';

const innovationTextureCache = new Map<string, THREE.Texture>();

function createOffscreenCanvas(width: number, height: number): HTMLCanvasElement | null {
  if (typeof window === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/**
 * 1. Crystalline Diagrid & Holographic Facade Glass Texture (Reference Image 1)
 * High-performance blue-gray solar glazing overlaid with structural diagonal
 * steel diagrid struts and glowing cyan digital holographic circuit motifs.
 */
export function getInnovationGlassTexture(): THREE.CanvasTexture {
  const key = 'innovation_diagrid_glass_v1';
  if (innovationTextureCache.has(key)) return innovationTextureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Deep architectural cyan-indigo sky reflection foundation
  ctx.fillStyle = '#08101e';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle interior floor horizontal spandrels
  for (let y = 0; y < 512; y += 128) {
    ctx.fillStyle = '#0f1a2e';
    ctx.fillRect(0, y, 512, 24);
  }

  // Cyan digital holographic data patterns (Reference Image 3)
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 6; i++) {
    const y = 40 + i * 80;
    ctx.beginPath();
    ctx.moveTo(30, y);
    ctx.lineTo(160, y);
    ctx.lineTo(200, y + 40);
    ctx.lineTo(460, y + 40);
    ctx.stroke();

    // Small data node boxes
    ctx.fillStyle = 'rgba(6, 182, 212, 0.35)';
    ctx.fillRect(210, y + 36, 40, 8);
    ctx.fillRect(360, y + 36, 25, 8);
  }

  // Structural Diagonal Diagrid Exoskeleton Overlay (Reference Image 3)
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 4.5;
  // Diagonals from top-left to bottom-right
  for (let d = -512; d <= 1024; d += 170) {
    ctx.beginPath();
    ctx.moveTo(d, 0);
    ctx.lineTo(d + 512, 512);
    ctx.stroke();
  }
  // Diagonals from top-right to bottom-left
  for (let d = -512; d <= 1024; d += 170) {
    ctx.beginPath();
    ctx.moveTo(d + 512, 0);
    ctx.lineTo(d, 512);
    ctx.stroke();
  }

  // Node connection plates at intersections
  ctx.fillStyle = '#94a3b8';
  for (let x = 0; x <= 512; x += 85) {
    for (let y = 0; y <= 512; y += 85) {
      if ((x + y) % 170 === 0) {
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  innovationTextureCache.set(key, texture);
  return texture;
}

/**
 * 2. Grand Central Holographic Media Wall Texture (Reference Image 2)
 * Massive galaxy vortex, cyber data visualizer, and "FUTURE INNOVATION GALLERY"
 */
export function getInnovationMediaWallTexture(): THREE.CanvasTexture {
  const key = 'innovation_media_wall_v1';
  if (innovationTextureCache.has(key)) return innovationTextureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(1024, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Deep space midnight cyan backdrop
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 512);
  bgGrad.addColorStop(0, '#020b18');
  bgGrad.addColorStop(0.5, '#051833');
  bgGrad.addColorStop(1, '#020b18');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Galaxy Spiral Vortex in the Center-Left (Directly from Reference Image 2)
  const cx = 360;
  const cy = 256;
  const vortexGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 260);
  vortexGrad.addColorStop(0, '#ffffff');
  vortexGrad.addColorStop(0.2, '#38bdf8');
  vortexGrad.addColorStop(0.5, '#0284c7');
  vortexGrad.addColorStop(0.8, '#1e1b4b');
  vortexGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = vortexGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 260, 0, Math.PI * 2);
  ctx.fill();

  // Spiral swirl arms
  ctx.strokeStyle = 'rgba(224, 242, 254, 0.35)';
  ctx.lineWidth = 3.0;
  for (let a = 0; a < Math.PI * 6; a += 0.2) {
    const r = a * 12;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r * 0.7;
    if (a === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Right Side: Cyber Telemetry & Project Statistics (Reference Image 2)
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.fillRect(660, 40, 330, 432);
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2.0;
  ctx.strokeRect(660, 40, 330, 432);

  // Header
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 22px "Segoe UI", Arial, monospace';
  ctx.fillText('INNOVATION LAB // R&D', 680, 80);

  ctx.fillStyle = '#ffffff';
  ctx.font = '14px monospace';
  ctx.fillText('• 70% TRANSMITTANCE CORE', 680, 120);
  ctx.fillText('• 3026 FUTURE GALLERY', 680, 145);
  ctx.fillText('• 4 PRODUCTION PLATFORMS', 680, 170);

  // Status metrics bar
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(680, 205, 290, 8);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(680, 205, 210, 8);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px "Segoe UI", sans-serif';
  ctx.fillText('REAL-TIME WEBSOCKET MESH: ONLINE', 680, 245);
  ctx.fillText('BLE GATT VITALS PIPELINE: ACTIVE', 680, 275);
  ctx.fillText('GPS SPATIAL TELEMETRY: 24 SATELLITES', 680, 305);
  ctx.fillText('LLM MULTI-MODEL EXTENSION: READY', 680, 335);

  // Interactive Prompt
  ctx.fillStyle = '#a855f7';
  ctx.font = 'bold 15px monospace';
  ctx.fillText('> CLICK ANY PROJECT KIOSK TO EXPLORE', 680, 395);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  innovationTextureCache.set(key, texture);
  return texture;
}

/**
 * 3. Project Exhibition Kiosk Screen Textures
 */
export function getKioskScreenTexture(projectId: string): THREE.CanvasTexture {
  const key = `kiosk_screen_${projectId}`;
  if (innovationTextureCache.has(key)) return innovationTextureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 384);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#050c18';
  ctx.fillRect(0, 0, 512, 384);

  // Holographic bezel frame
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 3.0;
  ctx.strokeRect(8, 8, 496, 368);

  if (projectId === 'vts-gps-tracking') {
    // TraqInn GPS Map & Bus Telemetry
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
    ctx.fillText('TraqInn School Bus Platform', 24, 46);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px monospace';
    ctx.fillText('LIVE GPS FLEET TRACKING & ATTENDANCE', 24, 76);

    // Map grid background
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.lineWidth = 1;
    for (let x = 24; x < 488; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 100);
      ctx.lineTo(x, 320);
      ctx.stroke();
    }
    for (let y = 100; y < 320; y += 32) {
      ctx.beginPath();
      ctx.moveTo(24, y);
      ctx.lineTo(488, y);
      ctx.stroke();
    }

    // Bus Route Trail
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(60, 280);
    ctx.lineTo(160, 220);
    ctx.lineTo(260, 240);
    ctx.lineTo(380, 140);
    ctx.stroke();

    // Bus Marker
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(380, 140, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('BUS #04: 42 km/h • ON ROUTE • 28 BOARDED', 24, 350);
  } else if (projectId === 'telemedicine-platform') {
    // Healthcare Telemedicine & ECG Waveform
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Telemedicine Virtual Care', 24, 46);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px monospace';
    ctx.fillText('BLE MEDICAL DEVICE VITALS & WEBSOCKETS', 24, 76);

    // ECG Heart Pulse Waveform
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    let x = 24;
    ctx.moveTo(x, 210);
    while (x < 488) {
      ctx.lineTo(x + 20, 210);
      ctx.lineTo(x + 28, 150);
      ctx.lineTo(x + 36, 270);
      ctx.lineTo(x + 44, 180);
      ctx.lineTo(x + 52, 210);
      ctx.lineTo(x + 80, 210);
      x += 80;
    }
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('PULSE: 74 BPM • SPO2: 98% • BLE GATT: CONNECTED', 24, 350);
  } else if (projectId === 'echo-desktop-ai') {
    // EchoAI Desktop Assistant & Browser Co-Pilot
    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
    ctx.fillText('EchoAI Desktop Co-Pilot', 24, 46);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px monospace';
    ctx.fillText('ELECTRON • BROWSER EXTENSIONS • LLM', 24, 76);

    // Terminal / Code snippet box
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(24, 105, 464, 210);
    ctx.strokeStyle = '#7c3aed';
    ctx.strokeRect(24, 105, 464, 210);

    ctx.fillStyle = '#c084fc';
    ctx.font = '13px monospace';
    ctx.fillText('> activeApp: "VS Code" [Typescript]', 40, 140);
    ctx.fillText('> contextExtraction: "RAG Pipeline Engine"', 40, 170);
    ctx.fillText('> browserBridge: Chrome + Brave + Firefox', 40, 200);
    ctx.fillText('> streamingResponse: "Optimizing token latency..."', 40, 230);
    ctx.fillText('> modelProvider: NVIDIA NIM / OpenAI API', 40, 260);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('STATUS: RUNNING AS TRAY CO-PILOT', 24, 350);
  } else {
    // FlowSync MERN Platform
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
    ctx.fillText('FlowSync Real-Time Platform', 24, 46);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px monospace';
    ctx.fillText('MERN • SOCKET.IO • AI SPRINT RISK ANALYSIS', 24, 76);

    // Kanban / Sprint board graphics
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(24, 105, 140, 210);
    ctx.fillRect(180, 105, 140, 210);
    ctx.fillRect(336, 105, 150, 210);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.fillText('BACKLOG (12)', 34, 130);
    ctx.fillText('IN PROGRESS (4)', 190, 130);
    ctx.fillText('VERIFIED (28)', 346, 130);

    ctx.fillStyle = '#22c55e';
    ctx.fillRect(34, 150, 120, 36);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(190, 150, 120, 36);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(346, 150, 130, 36);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('AI RISK DETECTOR: ZERO ACTIVE SPRINT BOTTLENECKS', 24, 350);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  innovationTextureCache.set(key, texture);
  return texture;
}

/**
 * 4. Innovation Center Entrance Signboard Texture
 */
export function getInnovationSignboardTexture(): THREE.CanvasTexture {
  const key = 'innovation_signboard_v1';
  if (innovationTextureCache.has(key)) return innovationTextureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 128);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#050a14';
  ctx.fillRect(0, 0, 512, 128);

  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 3.0;
  ctx.strokeRect(6, 6, 500, 116);

  // Status beacon
  ctx.fillStyle = '#00f0ff';
  ctx.beginPath();
  ctx.arc(36, 46, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('INNOVATION CENTER', 56, 46);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px "Segoe UI", Arial, sans-serif';
  ctx.fillText('SOFTWARE R&D LABS • PROJECT EXHIBITION', 56, 82);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  innovationTextureCache.set(key, texture);
  return texture;
}

export interface InnovationMaterialsContainer {
  curtainGlass: THREE.MeshPhysicalMaterial;
  atriumGlass: THREE.MeshPhysicalMaterial;
  mediaWall: THREE.MeshBasicMaterial;
  darkZinc: THREE.MeshStandardMaterial;
  whiteLimestone: THREE.MeshStandardMaterial;
  warmWoodSoffit: THREE.MeshStandardMaterial;
  reflectingWater: THREE.MeshStandardMaterial;
  stainlessSteel: THREE.MeshStandardMaterial;
  structuralFraming: THREE.MeshStandardMaterial;
  terrazzoFloor: THREE.MeshStandardMaterial;
  granitePavers: THREE.MeshStandardMaterial;
  neonRibbon: THREE.MeshStandardMaterial;
  canopyLettering: THREE.MeshStandardMaterial;
  signboard: THREE.MeshStandardMaterial;
  kioskVTS: THREE.MeshBasicMaterial;
  kioskTelemed: THREE.MeshBasicMaterial;
  kioskEcho: THREE.MeshBasicMaterial;
  kioskFlowSync: THREE.MeshBasicMaterial;
}

let sharedInnovationMaterials: InnovationMaterialsContainer | null = null;

export function getSharedInnovationMaterials(): InnovationMaterialsContainer {
  if (sharedInnovationMaterials) return sharedInnovationMaterials;

  const glassTex = getInnovationGlassTexture();
  const mediaTex = getInnovationMediaWallTexture();
  const signTex = getInnovationSignboardTexture();
  const vtsTex = getKioskScreenTexture('vts-gps-tracking');
  const telemedTex = getKioskScreenTexture('telemedicine-platform');
  const echoTex = getKioskScreenTexture('echo-desktop-ai');
  const flowsyncTex = getKioskScreenTexture('flowsync');

  sharedInnovationMaterials = {
    // 1. Faceted Crystalline Diagrid Glass (Single pass PBR, deep architectural tone)
    curtainGlass: new THREE.MeshPhysicalMaterial({
      color: '#1e293b',
      map: glassTex,
      roughness: 0.12,
      metalness: 0.55,
      reflectivity: 0.95,
      clearcoat: 0.90,
      clearcoatRoughness: 0.05,
    }),

    // 2. Ground Atrium Ultra-Clear Low-Iron Glass (Single pass, high transparency)
    atriumGlass: new THREE.MeshPhysicalMaterial({
      color: '#08121e',
      roughness: 0.04,
      metalness: 0.15,
      reflectivity: 0.95,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.28,
    }),

    // 3. Central Media Hologram Screen
    mediaWall: new THREE.MeshBasicMaterial({
      map: mediaTex,
      transparent: true,
      opacity: 0.95,
    }),

    // 4. Dark Architectural Charcoal Zinc Panels (Cantilevered Upper Volume)
    darkZinc: new THREE.MeshStandardMaterial({
      color: '#181e29',
      roughness: 0.35,
      metalness: 0.75,
    }),

    // 5. Honed White Architectural Limestone / Composite Reveals
    whiteLimestone: new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.65,
      metalness: 0.05,
    }),

    // 6. Warm Natural Acoustic Slat Timber Soffit (Reference Image 2)
    warmWoodSoffit: new THREE.MeshStandardMaterial({
      color: '#b45309',
      roughness: 0.55,
      metalness: 0.05,
    }),

    // 7. Calm Water Mirror Surface for Forecourt Reflecting Basin (Reference Image 1 & 2)
    reflectingWater: new THREE.MeshStandardMaterial({
      color: '#030712',
      roughness: 0.04,
      metalness: 0.90,
    }),

    // 8. Polished 316 Stainless Steel Columns & Diagrid Members
    stainlessSteel: new THREE.MeshStandardMaterial({
      color: '#e2e8f0',
      roughness: 0.18,
      metalness: 0.88,
    }),

    // 9. Dark Charcoal Anodized Aluminum Mullions
    structuralFraming: new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.38,
      metalness: 0.75,
    }),

    // 10. Polished Light-Gray Terrazzo Exhibition Floor
    terrazzoFloor: new THREE.MeshStandardMaterial({
      color: '#334155',
      roughness: 0.20,
      metalness: 0.20,
    }),

    // 11. Granite Plaza Pavers
    granitePavers: new THREE.MeshStandardMaterial({
      color: '#3f3f46',
      roughness: 0.68,
      metalness: 0.05,
    }),

    // 12. Glowing Cyan/Violet LED Ribbon Trim (Mezzanine Balcony Edge, Image 4)
    neonRibbon: new THREE.MeshStandardMaterial({
      color: '#00f0ff',
      emissive: '#00f0ff',
      emissiveIntensity: 2.2,
      roughness: 0.2,
    }),

    // 13. Illuminated Canopy Signage
    canopyLettering: new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      emissive: '#38bdf8',
      emissiveIntensity: 1.8,
      roughness: 0.20,
    }),

    // 14. Pylon Signboard
    signboard: new THREE.MeshStandardMaterial({
      color: '#ffffff',
      map: signTex,
      roughness: 0.40,
      metalness: 0.10,
    }),

    // Kiosk display materials
    kioskVTS: new THREE.MeshBasicMaterial({ map: vtsTex }),
    kioskTelemed: new THREE.MeshBasicMaterial({ map: telemedTex }),
    kioskEcho: new THREE.MeshBasicMaterial({ map: echoTex }),
    kioskFlowSync: new THREE.MeshBasicMaterial({ map: flowsyncTex }),
  };

  return sharedInnovationMaterials;
}

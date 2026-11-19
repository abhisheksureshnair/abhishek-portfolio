import * as THREE from 'three';

let sharedMaterials: {
  curtainGlassDarkBlue: THREE.MeshPhysicalMaterial;
  atriumGlass: THREE.MeshPhysicalMaterial;
  titaniumGraphite: THREE.MeshStandardMaterial;
  structuralSilver: THREE.MeshStandardMaterial;
  polishedSilver: THREE.MeshStandardMaterial;
  granitePodium: THREE.MeshStandardMaterial;
  concretePaver: THREE.MeshStandardMaterial;
  cyanNeonGlow: THREE.MeshStandardMaterial;
  cyanAccentMuted: THREE.MeshStandardMaterial;
  whiteNeonGlow: THREE.MeshStandardMaterial;
  curvedFacadeTextureMat: THREE.Material;
  cyberPulseScreenMat: THREE.Material;
  signageMat: THREE.Material;
  serverRackMat: THREE.MeshStandardMaterial;
  interiorMezzanineMat: THREE.MeshStandardMaterial;
  roofMechanicalMat: THREE.MeshStandardMaterial;
} | null = null;

/**
 * Creates high-resolution procedural cyan digital cloud HUD & circuit telemetry facade texture
 * Faithfully replicating media_1795088664563_b9d9109e.jpg
 */
function createCloudCurvedFacadeTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // 1. Dark titanium metallic base paneling
  ctx.fillStyle = '#0a0f1d';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle architectural seam grid
  ctx.strokeStyle = 'rgba(30, 41, 59, 0.7)';
  ctx.lineWidth = 2;
  for (let x = 0; x < 1024; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for (let y = 0; y < 1024; y += 128) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // 2. High-Tech PCB Circuit traces radiating across panels
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.55)';
  ctx.lineWidth = 2.5;

  // Horizontal data bus lines
  const busY = [180, 260, 340, 420, 580, 680, 780, 860];
  busY.forEach((by, idx) => {
    ctx.beginPath();
    ctx.moveTo(40, by);
    ctx.lineTo(260 + (idx % 3) * 60, by);
    ctx.lineTo(310 + (idx % 3) * 60, by - 30);
    ctx.lineTo(440, by - 30);
    ctx.stroke();

    // Circuit nodes / solder pads
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(440, by - 30, 4, 0, Math.PI * 2);
    ctx.fill();

    // Solder pads on left
    ctx.beginPath();
    ctx.arc(40, by, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Circuit lines on right side
  busY.forEach((by, idx) => {
    ctx.beginPath();
    ctx.moveTo(980, by + 20);
    ctx.lineTo(760 - (idx % 4) * 50, by + 20);
    ctx.lineTo(720 - (idx % 4) * 50, by + 50);
    ctx.lineTo(600, by + 50);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(600, by + 50, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // 3. Iconic Glowing Cyan Cloud Symbol (Left Center & Right Center)
  const drawGlowingCloud = (cx: number, cy: number, scale: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // Deep cyan outer atmospheric glow
    const glowGrad = ctx.createRadialGradient(0, 0, 30, 0, 0, 180);
    glowGrad.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
    glowGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.18)');
    glowGrad.addColorStop(1, 'rgba(10, 15, 29, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 180, 0, Math.PI * 2);
    ctx.fill();

    // Cloud Shape Outline Path
    ctx.beginPath();
    // Base bottom line
    ctx.moveTo(-75, 45);
    ctx.lineTo(75, 45);
    // Right lobe
    ctx.arc(75, 15, 30, Math.PI * 0.5, -Math.PI * 0.35, true);
    // Top right curve
    ctx.arc(38, -32, 42, -Math.PI * 0.15, -Math.PI * 0.75, true);
    // Top left curve
    ctx.arc(-35, -30, 36, -Math.PI * 0.25, -Math.PI * 0.85, true);
    // Left lobe
    ctx.arc(-75, 15, 30, -Math.PI * 0.65, Math.PI * 0.5, true);
    ctx.closePath();

    // Cloud inner translucent fill
    ctx.fillStyle = 'rgba(6, 182, 212, 0.18)';
    ctx.fill();

    // Cloud thick glowing neon stroke
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 25;
    ctx.stroke();

    // Core bright white inner stroke
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Tech text inside cloud
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('100% CLOUD', 0, 8);

    ctx.restore();
  };

  // Draw two prominent cloud emblems matching reference photo
  drawGlowingCloud(320, 480, 1.25);
  drawGlowingCloud(780, 420, 1.4);

  // 4. Digital Telemetry Readouts, Code, Metrics & Bar Charts
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 36px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('1.174.05', 540, 220);

  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = '#67e8f9';
  ctx.fillText('SYS.STATUS: HEALTHY // 99.99%', 540, 250);
  ctx.fillText('NODE CLUSTER • US-EAST-01', 540, 275);
  ctx.fillText('THROUGHPUT: 14.2K REQ/SEC', 540, 300);
  ctx.fillText('LATENCY: 18.4ms (P99)', 540, 325);

  // Real-time server telemetry bar graphs
  const bars = [42, 68, 85, 92, 74, 88, 95, 60, 78, 90, 84, 98, 72, 86, 94];
  bars.forEach((val, i) => {
    const bx = 540 + i * 24;
    const bh = (val / 100) * 80;
    ctx.fillStyle = i > 10 ? '#38bdf8' : '#06b6d4';
    ctx.fillRect(bx, 420 - bh, 16, bh);

    // Subtle peak marker
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(bx, 418 - bh, 16, 3);
  });

  // Circular gauge / radar readout
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(880, 740, 60, 0, Math.PI * 1.6);
  ctx.stroke();

  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(880, 740, 60, -Math.PI * 0.5, Math.PI * 0.7);
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('88.4%', 880, 740);
  ctx.font = '11px monospace';
  ctx.fillText('LOAD AVG', 880, 760);

  // Bottom telemetry banner
  ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
  ctx.fillRect(0, 960, 1024, 64);
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
  ctx.strokeRect(0, 960, 1024, 64);

  ctx.fillStyle = '#e0f2fe';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(
    'NODE.JS • REST APIS • FIREBASE • POSTGRESQL • DOCKER • CI/CD • REACT CONNECTIVITY',
    30,
    998
  );

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/**
 * Creates high-tech circular cyber-energy pulse screen texture
 * Replicating the glowing round vortex screen on lower corner in media_1795088664563_b9d9109e.jpg
 */
function createCyberPulseScreenTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep cyber blue background
  ctx.fillStyle = '#060d1f';
  ctx.fillRect(0, 0, 512, 512);

  // Radial glow burst from center
  const centerGrad = ctx.createRadialGradient(256, 256, 20, 256, 256, 240);
  centerGrad.addColorStop(0, '#e0f2fe');
  centerGrad.addColorStop(0.15, '#00f0ff');
  centerGrad.addColorStop(0.4, 'rgba(6, 182, 212, 0.6)');
  centerGrad.addColorStop(0.75, 'rgba(2, 132, 199, 0.25)');
  centerGrad.addColorStop(1, 'rgba(6, 13, 31, 0.05)');
  ctx.fillStyle = centerGrad;
  ctx.beginPath();
  ctx.arc(256, 256, 240, 0, Math.PI * 2);
  ctx.fill();

  // Concentric radar & telemetry rings
  const ringRadii = [60, 100, 140, 180, 220];
  ringRadii.forEach((r, idx) => {
    ctx.strokeStyle = idx % 2 === 0 ? 'rgba(0, 240, 255, 0.8)' : 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = idx === 2 ? 4 : 2;
    if (idx % 2 === 1) ctx.setLineDash([8, 6]);
    else ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(256, 256, r, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  // Crosshair lines
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(256, 16);
  ctx.lineTo(256, 496);
  ctx.moveTo(16, 256);
  ctx.lineTo(496, 256);
  ctx.stroke();

  // Diagonal tick marks
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
    const x1 = 256 + Math.cos(a) * 200;
    const y1 = 256 + Math.sin(a) * 200;
    const x2 = 256 + Math.cos(a) * 215;
    const y2 = 256 + Math.sin(a) * 215;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Center core high-intensity flare
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(256, 256, 16, 0, Math.PI * 2);
  ctx.fill();

  // Corner HUD text
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('TELEMETRY MATRIX', 24, 40);
  ctx.font = '12px monospace';
  ctx.fillText('NODE_ID: US-EAST-01 // ACTIVE', 24, 60);

  ctx.textAlign = 'right';
  ctx.fillText('FREQ: 5.8 GHz', 488, 40);
  ctx.fillText('SYNC: LOCK', 488, 60);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/**
 * Creates high-contrast architectural signage texture for Cloud Hub
 */
function createCloudSignageTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Dark gunmetal titanium backing
  ctx.fillStyle = '#090e1a';
  ctx.fillRect(0, 0, 1024, 256);

  // Border frame
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 4;
  ctx.strokeRect(8, 8, 1008, 240);

  // Accent corner brackets
  ctx.lineWidth = 8;
  const corners = [
    [8, 8, 48, 8, 8, 48],
    [1016, 8, 976, 8, 1016, 48],
    [8, 248, 48, 248, 8, 208],
    [1016, 248, 976, 248, 1016, 208],
  ];
  corners.forEach(([x, y, x2, y2, x3, y3]) => {
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x, y);
    ctx.lineTo(x3, y3);
    ctx.stroke();
  });

  // Department banner
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('DISTRICT 08 // CLOUD ARCHITECTURE & SYSTEMS', 512, 54);

  // Primary Signage: CLOUD ECOSYSTEM HUB
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 54px sans-serif';
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 18;
  ctx.fillText('CLOUD ECOSYSTEM HUB', 512, 130);
  ctx.shadowBlur = 0;

  // Secondary Signage: CONNECT • BUILD • DEPLOY
  ctx.fillStyle = '#67e8f9';
  ctx.font = 'bold 28px monospace';
  ctx.fillText('CONNECT • BUILD • DEPLOY', 512, 190);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/**
 * Creates high-detail server rack face texture with glowing LED status indicators
 */
function createServerRackTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#070b14';
  ctx.fillRect(0, 0, 256, 512);

  // 10 Server units (U)
  const uHeight = 512 / 10;
  for (let i = 0; i < 10; i++) {
    const uy = i * uHeight;

    // Unit background plate
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(8, uy + 3, 240, uHeight - 6);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.strokeRect(8, uy + 3, 240, uHeight - 6);

    // Hard drive bays (4 per unit)
    for (let d = 0; d < 4; d++) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(16 + d * 36, uy + 10, 30, uHeight - 20);

      // Drive status LED
      ctx.fillStyle = Math.random() > 0.15 ? '#00f0ff' : '#10b981';
      ctx.beginPath();
      ctx.arc(22 + d * 36, uy + 16, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Server power & network activity LEDs (Right side)
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(180, uy + 18, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(195, uy + 18, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(210, uy + 18, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Ventilation slots
    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 1.5;
    for (let s = 0; s < 8; s++) {
      ctx.beginPath();
      ctx.moveTo(170 + s * 6, uy + 28);
      ctx.lineTo(170 + s * 6, uy + 38);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/**
 * Access cached shared PBR materials singleton for Cloud Hub
 */
export function getSharedCloudMaterials() {
  if (typeof window === 'undefined') {
    return {
      curtainGlassDarkBlue: new THREE.MeshPhysicalMaterial(),
      atriumGlass: new THREE.MeshPhysicalMaterial(),
      titaniumGraphite: new THREE.MeshStandardMaterial(),
      structuralSilver: new THREE.MeshStandardMaterial(),
      polishedSilver: new THREE.MeshStandardMaterial(),
      granitePodium: new THREE.MeshStandardMaterial(),
      concretePaver: new THREE.MeshStandardMaterial(),
      cyanNeonGlow: new THREE.MeshStandardMaterial(),
      cyanAccentMuted: new THREE.MeshStandardMaterial(),
      whiteNeonGlow: new THREE.MeshStandardMaterial(),
      curvedFacadeTextureMat: new THREE.MeshBasicMaterial(),
      cyberPulseScreenMat: new THREE.MeshBasicMaterial(),
      signageMat: new THREE.MeshBasicMaterial(),
      serverRackMat: new THREE.MeshStandardMaterial(),
      interiorMezzanineMat: new THREE.MeshStandardMaterial(),
      roofMechanicalMat: new THREE.MeshStandardMaterial(),
    };
  }

  if (!sharedMaterials) {
    const facadeTex = createCloudCurvedFacadeTexture();
    facadeTex.needsUpdate = true;
    const cyberPulseTex = createCyberPulseScreenTexture();
    cyberPulseTex.needsUpdate = true;
    const signageTex = createCloudSignageTexture();
    signageTex.needsUpdate = true;
    const serverTex = createServerRackTexture();
    serverTex.needsUpdate = true;

    sharedMaterials = {
      curtainGlassDarkBlue: new THREE.MeshPhysicalMaterial({
        color: '#1e293b',
        roughness: 0.08,
        metalness: 0.15,
        transparent: true,
        opacity: 0.72,
        reflectivity: 0.9,
        ior: 1.52,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      }),

      atriumGlass: new THREE.MeshPhysicalMaterial({
        color: '#0f172a',
        roughness: 0.05,
        metalness: 0.05,
        transparent: true,
        opacity: 0.65,
        reflectivity: 0.95,
        ior: 1.5,
        clearcoat: 1.0,
      }),

      titaniumGraphite: new THREE.MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.22,
        metalness: 0.85,
      }),

      structuralSilver: new THREE.MeshStandardMaterial({
        color: '#cbd5e1',
        roughness: 0.25,
        metalness: 0.8,
      }),

      polishedSilver: new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        roughness: 0.12,
        metalness: 0.95,
      }),

      granitePodium: new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.65,
        metalness: 0.2,
      }),

      concretePaver: new THREE.MeshStandardMaterial({
        color: '#334155',
        roughness: 0.8,
        metalness: 0.1,
      }),

      cyanNeonGlow: new THREE.MeshStandardMaterial({
        color: '#00f0ff',
        emissive: '#00f0ff',
        emissiveIntensity: 1.9,
        roughness: 0.2,
      }),

      cyanAccentMuted: new THREE.MeshStandardMaterial({
        color: '#0284c7',
        emissive: '#0284c7',
        emissiveIntensity: 0.8,
        roughness: 0.3,
      }),

      whiteNeonGlow: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#ffffff',
        emissiveIntensity: 1.4,
        roughness: 0.2,
      }),

      curvedFacadeTextureMat: new THREE.MeshBasicMaterial({
        map: facadeTex,
        side: THREE.DoubleSide,
      }),

      cyberPulseScreenMat: new THREE.MeshBasicMaterial({
        map: cyberPulseTex,
        side: THREE.DoubleSide,
      }),

      signageMat: new THREE.MeshBasicMaterial({
        map: signageTex,
        side: THREE.DoubleSide,
      }),

      serverRackMat: new THREE.MeshStandardMaterial({
        map: serverTex,
        emissive: '#00f0ff',
        emissiveMap: serverTex,
        emissiveIntensity: 0.6,
        roughness: 0.35,
        metalness: 0.8,
        side: THREE.DoubleSide,
      }),

      interiorMezzanineMat: new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.3,
        metalness: 0.7,
      }),

      roofMechanicalMat: new THREE.MeshStandardMaterial({
        color: '#334155',
        roughness: 0.5,
        metalness: 0.6,
      }),
    };
  }

  return sharedMaterials;
}

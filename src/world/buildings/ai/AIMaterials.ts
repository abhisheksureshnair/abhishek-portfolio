import * as THREE from 'three';

let sharedMaterials: {
  curtainGlassBlueGray: THREE.MeshPhysicalMaterial;
  atriumGlass: THREE.MeshPhysicalMaterial;
  titaniumDark: THREE.MeshStandardMaterial;
  structuralTitanium: THREE.MeshStandardMaterial;
  titaniumMid: THREE.MeshStandardMaterial;
  polishedSilver: THREE.MeshStandardMaterial;
  structuralSilver: THREE.MeshStandardMaterial;
  granitePodium: THREE.MeshStandardMaterial;
  reflectingPoolWater: THREE.MeshPhysicalMaterial;
  neonRibbonCyan: THREE.MeshStandardMaterial;
  neonRibbonBlue: THREE.MeshStandardMaterial;
  neonRibbonViolet: THREE.MeshStandardMaterial;
  violetAccentGlow: THREE.MeshStandardMaterial;
  cyanAccentGlow: THREE.MeshStandardMaterial;
  neuralNodeViolet: THREE.MeshStandardMaterial;
  neuralNodeCyan: THREE.MeshStandardMaterial;
  neuralSynapse: THREE.MeshStandardMaterial;
  holographicHudScreen: THREE.MeshStandardMaterial;
  holographicAiSphere: THREE.MeshStandardMaterial;
  hologramOrbitalRing: THREE.MeshStandardMaterial;
  signBacking: THREE.MeshStandardMaterial;
  signageGlowCyan: THREE.MeshStandardMaterial;
  signageGlowWhite: THREE.MeshStandardMaterial;
  signageGlow: THREE.MeshStandardMaterial;
  monolithSignTexture: THREE.MeshStandardMaterial;
} | null = null;

/**
 * Creates procedural high-tech holographic AI HUD texture
 * Replicating the glowing central AI telemetry and neural network HUD in media_1795005442354_a8d54234.jpg
 */
function createHolographicHudTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep cybernetic translucent blue background
  ctx.fillStyle = '#060d1f';
  ctx.fillRect(0, 0, 1024, 512);

  // Subtle grid lines
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 1024; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y < 512; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Circular targeting reticle / AI core hub (Center-Right)
  const cx = 720;
  const cy = 256;
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 140, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.arc(cx, cy, 165, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 80, 0, Math.PI * 2);
  ctx.stroke();

  // Crosshairs
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 180, cy);
  ctx.lineTo(cx + 180, cy);
  ctx.moveTo(cx, cy - 180);
  ctx.lineTo(cx, cy + 180);
  ctx.stroke();

  // Neural network graph nodes & synapses (Left half)
  const nodes = [
    { x: 120, y: 120 }, { x: 120, y: 256 }, { x: 120, y: 390 },
    { x: 280, y: 100 }, { x: 280, y: 200 }, { x: 280, y: 310 }, { x: 280, y: 410 },
    { x: 440, y: 160 }, { x: 440, y: 256 }, { x: 440, y: 350 },
  ];

  ctx.strokeStyle = 'rgba(147, 197, 253, 0.6)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 3; i++) {
    for (let j = 3; j < 7; j++) {
      ctx.beginPath();
      ctx.moveTo(nodes[i].x, nodes[i].y);
      ctx.lineTo(nodes[j].x, nodes[j].y);
      ctx.stroke();
    }
  }
  for (let i = 3; i < 7; i++) {
    for (let j = 7; j < 10; j++) {
      ctx.beginPath();
      ctx.moveTo(nodes[i].x, nodes[i].y);
      ctx.lineTo(nodes[j].x, nodes[j].y);
      ctx.stroke();
    }
  }

  // Draw nodes
  nodes.forEach((n, idx) => {
    ctx.fillStyle = idx % 2 === 0 ? '#00f0ff' : '#a855f7';
    ctx.beginPath();
    ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // Telemetry HUD text
  ctx.fillStyle = '#00f0ff';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('NEURAL SYSTEM v4.8 — ONLINE', 80, 60);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px monospace';
  ctx.fillText('INFERENCE LATENCY: 2.4ms', 80, 470);
  ctx.fillText('WEIGHT PARAMETERS: 70B', 440, 470);
  ctx.fillText('ACTIVE AGENTS: 128', 760, 470);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates procedural vertical sign texture for the East monolith
 * Faithfully reproducing the glowing AI monument facade in media_1795005442354_a8d54234.jpg
 */
function createMonolithSignTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Dark obsidian panel backing
  ctx.fillStyle = '#070b14';
  ctx.fillRect(0, 0, 512, 1024);

  // Cyan border frame
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 8;
  ctx.strokeRect(16, 16, 480, 992);

  // Glowing circular AI neural insignia at top
  const cx = 256;
  const cy = 180;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 90, 0, Math.PI * 2);
  ctx.stroke();

  // Geometric neural network inside insignia
  const polyNodes = [
    { x: cx, y: cy - 60 },
    { x: cx + 55, y: cy - 25 },
    { x: cx + 55, y: cy + 35 },
    { x: cx, y: cy + 65 },
    { x: cx - 55, y: cy + 35 },
    { x: cx - 55, y: cy - 25 },
    { x: cx, y: cy },
  ];

  ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
  ctx.lineWidth = 2;
  polyNodes.forEach((p, idx) => {
    polyNodes.forEach((p2, idx2) => {
      if (idx !== idx2 && Math.hypot(p.x - p2.x, p.y - p2.y) < 85) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    });
  });

  polyNodes.forEach((p) => {
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Large bold letters "AI"
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 68px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('AI', cx, cy + 5);

  // Monolith Typography
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 36px sans-serif';
  ctx.fillText('AI RESEARCH', cx, 360);
  ctx.fillText('CENTER', cx, 410);

  // Subtitle
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('INTELLIGENCE', cx, 480);
  ctx.fillText('•', cx, 515);
  ctx.fillText('AUTOMATION', cx, 550);
  ctx.fillText('•', cx, 585);
  ctx.fillText('INNOVATION', cx, 620);

  // Secondary text
  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px monospace';
  ctx.fillText('COMPUTATIONAL LABS', cx, 740);
  ctx.fillText('EST. 2026', cx, 780);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates procedural granite plaza paver texture
 */
function createPlazaTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 512, 512);

  // Paver joints
  ctx.strokeStyle = '#0f172a';
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
 * Returns singleton shared materials for the refined AI Research Center
 */
export function getSharedAIMaterials() {
  if (sharedMaterials) return sharedMaterials;

  const hudTex = createHolographicHudTexture();
  const monolithTex = createMonolithSignTexture();
  const plazaTex = createPlazaTexture();

  const curtainGlass = new THREE.MeshPhysicalMaterial({
    color: '#93c5fd',
    transmission: 0.86,
    opacity: 0.9,
    transparent: true,
    roughness: 0.06,
    metalness: 0.12,
    ior: 1.52,
    thickness: 0.8,
    reflectivity: 0.75,
  });

  const titaniumDarkMat = new THREE.MeshStandardMaterial({
    color: '#0b1120',
    roughness: 0.35,
    metalness: 0.88,
  });

  const silverMat = new THREE.MeshStandardMaterial({
    color: '#e2e8f0',
    roughness: 0.18,
    metalness: 0.88,
  });

  const cyanGlowMat = new THREE.MeshStandardMaterial({
    color: '#00f0ff',
    emissive: new THREE.Color('#00f0ff'),
    emissiveIntensity: 2.8,
    roughness: 0.1,
  });

  const violetGlowMat = new THREE.MeshStandardMaterial({
    color: '#8b5cf6',
    emissive: new THREE.Color('#7c3aed'),
    emissiveIntensity: 2.4,
    roughness: 0.1,
  });

  sharedMaterials = {
    curtainGlassBlueGray: curtainGlass,
    atriumGlass: curtainGlass,
    titaniumDark: titaniumDarkMat,
    structuralTitanium: titaniumDarkMat,
    titaniumMid: new THREE.MeshStandardMaterial({
      color: '#1e293b',
      roughness: 0.38,
      metalness: 0.82,
    }),
    polishedSilver: silverMat,
    structuralSilver: silverMat,
    granitePodium: new THREE.MeshStandardMaterial({
      map: plazaTex,
      color: '#475569',
      roughness: 0.72,
      metalness: 0.18,
    }),
    reflectingPoolWater: new THREE.MeshPhysicalMaterial({
      color: '#020617',
      transmission: 0.65,
      opacity: 0.88,
      transparent: true,
      roughness: 0.03,
      metalness: 0.3,
      ior: 1.333,
      reflectivity: 0.92,
    }),
    neonRibbonCyan: cyanGlowMat,
    neonRibbonBlue: new THREE.MeshStandardMaterial({
      color: '#3b82f6',
      emissive: new THREE.Color('#2563eb'),
      emissiveIntensity: 2.6,
      roughness: 0.1,
    }),
    neonRibbonViolet: violetGlowMat,
    violetAccentGlow: violetGlowMat,
    cyanAccentGlow: cyanGlowMat,
    neuralNodeViolet: new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: new THREE.Color('#a855f7'),
      emissiveIntensity: 3.0,
      roughness: 0.1,
      metalness: 0.6,
    }),
    neuralNodeCyan: new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: new THREE.Color('#00f0ff'),
      emissiveIntensity: 3.0,
      roughness: 0.1,
      metalness: 0.6,
    }),
    neuralSynapse: new THREE.MeshStandardMaterial({
      color: '#c084fc',
      emissive: new THREE.Color('#8b5cf6'),
      emissiveIntensity: 1.6,
      transparent: true,
      opacity: 0.75,
      roughness: 0.2,
    }),
    holographicHudScreen: new THREE.MeshStandardMaterial({
      map: hudTex,
      emissiveMap: hudTex,
      emissive: new THREE.Color('#ffffff'),
      emissiveIntensity: 1.4,
      transparent: true,
      opacity: 0.92,
      roughness: 0.15,
      metalness: 0.1,
    }),
    holographicAiSphere: new THREE.MeshStandardMaterial({
      color: '#00f0ff',
      emissive: new THREE.Color('#00f0ff'),
      emissiveIntensity: 3.2,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
    }),
    hologramOrbitalRing: new THREE.MeshStandardMaterial({
      color: '#8b5cf6',
      emissive: new THREE.Color('#a855f7'),
      emissiveIntensity: 2.8,
      roughness: 0.1,
    }),
    signBacking: new THREE.MeshStandardMaterial({
      color: '#050811',
      roughness: 0.45,
      metalness: 0.85,
    }),
    signageGlowCyan: cyanGlowMat,
    signageGlowWhite: new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: new THREE.Color('#f8fafc'),
      emissiveIntensity: 1.8,
      roughness: 0.2,
    }),
    signageGlow: violetGlowMat,
    monolithSignTexture: new THREE.MeshStandardMaterial({
      map: monolithTex,
      emissiveMap: monolithTex,
      emissive: new THREE.Color('#ffffff'),
      emissiveIntensity: 1.3,
      roughness: 0.35,
      metalness: 0.8,
    }),
  };

  return sharedMaterials;
}

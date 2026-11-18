'use client';

import * as THREE from 'three';

const textureCache = new Map<string, THREE.Texture>();

/**
 * Architectural PBR Procedural Texture Suite
 * Generates photorealistic concrete, fluted stone, curtain wall glass with interior depth,
 * double-height ground-floor showroom glass, terracotta cladding, metal louvers,
 * paving slabs, and wood decking.
 */

// Helper to safely obtain an offscreen canvas
function createOffscreenCanvas(width: number, height: number): HTMLCanvasElement | null {
  if (typeof window === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/**
 * 1. Precast Architectural Concrete Panels (512x512)
 * Features subtle surface aggregate, formwork tie-rod indents, and crisp panel joints.
 */
export function getArchitecturalConcreteTexture(): THREE.CanvasTexture {
  if (textureCache.has('arch_concrete')) return textureCache.get('arch_concrete')! as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Smooth warm architectural concrete base (limestone / off-white concrete)
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(0, 0, 512, 512);

  // Micro-aggregate speckling
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 18;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  // 4 modular panels per 512px tile (256x256 each) with beveled joints
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(256, 0);
  ctx.lineTo(256, 512);
  ctx.moveTo(0, 256);
  ctx.lineTo(512, 256);
  ctx.stroke();

  // Subtle highlight on joint top/left
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(257, 0);
  ctx.lineTo(257, 512);
  ctx.moveTo(0, 257);
  ctx.lineTo(512, 257);
  ctx.stroke();

  // Architectural formwork tie-rod holes in panel corners
  const holePositions = [
    [32, 32], [224, 32], [32, 224], [224, 224],
    [288, 32], [480, 32], [288, 224], [480, 224],
    [32, 288], [224, 288], [32, 480], [224, 480],
    [288, 288], [480, 288], [288, 480], [480, 480],
  ];

  holePositions.forEach(([x, y]) => {
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(x - 1, y - 1, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('arch_concrete', texture);
  return texture;
}

/**
 * 2. Fluted / Ribbed Stone Piers & Terracotta (Reference Image 2 Style)
 * Elegant vertical rhythmic architectural fins with deep shadow lines.
 */
export function getFlutedStoneTexture(): THREE.CanvasTexture {
  if (textureCache.has('arch_fluted_stone')) return textureCache.get('arch_fluted_stone')! as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Warm champagne/bronze-tinted limestone base
  ctx.fillStyle = '#d6cbbe';
  ctx.fillRect(0, 0, 512, 512);

  // Vertical fluted rib grooves (32px intervals)
  const ribWidth = 32;
  for (let x = 0; x < 512; x += ribWidth) {
    // Shaded side of rib
    const grad = ctx.createLinearGradient(x, 0, x + ribWidth, 0);
    grad.addColorStop(0, '#8c7d6d');
    grad.addColorStop(0.2, '#c2b4a3');
    grad.addColorStop(0.7, '#e4dbd1');
    grad.addColorStop(0.95, '#f5efe9');
    grad.addColorStop(1, '#695c4d');
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, ribWidth - 2, 512);

    // Deep recess channel
    ctx.fillStyle = '#4a3f35';
    ctx.fillRect(x + ribWidth - 2, 0, 2, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('arch_fluted_stone', texture);
  return texture;
}

/**
 * 3. Contemporary Office Curtain Wall Glass with Interior Lighting Depth
 * Multi-story architectural window grid with dark mullions, reflective glass,
 * and illuminated interior ceilings with LED troffer fixtures (matching Reference Images 1 & 2).
 */
export function getCurtainWallGlassTexture(): THREE.CanvasTexture {
  if (textureCache.has('arch_curtain_wall')) return textureCache.get('arch_curtain_wall')! as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Dark architectural charcoal mullion frame
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 512, 512);

  const cols = 4;
  const rows = 4;
  const cw = 512 / cols;
  const ch = 512 / rows;
  const mullionSize = 6;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cw + mullionSize;
      const y = r * ch + mullionSize;
      const w = cw - mullionSize * 2;
      const h = ch - mullionSize * 2;

      // Realistic warm illuminated interior behind glass
      const interiorGrad = ctx.createLinearGradient(x, y, x, y + h);
      interiorGrad.addColorStop(0, '#fef3c7'); // warm ceiling downlight reflection
      interiorGrad.addColorStop(0.4, '#e2e8f0'); // neutral glass pane reflection
      interiorGrad.addColorStop(0.85, '#64748b'); // mid-level shadow
      interiorGrad.addColorStop(1, '#334155'); // office floor depth
      ctx.fillStyle = interiorGrad;
      ctx.fillRect(x, y, w, h);

      // Linear acoustic ceiling light bars (2 bars per window unit)
      ctx.fillStyle = 'rgba(255, 255, 240, 0.9)';
      ctx.fillRect(x + w * 0.15, y + 8, w * 0.7, 4);
      ctx.fillRect(x + w * 0.15, y + 24, w * 0.7, 4);

      // Subtle horizontal window transom bar
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x, y + h * 0.75, w, 3);

      // Glass specular sheen diagonal highlight
      const sheenGrad = ctx.createLinearGradient(x, y, x + w, y + h);
      sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
      sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
      sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sheenGrad;
      ctx.fillRect(x, y, w, h);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('arch_curtain_wall', texture);
  return texture;
}

/**
 * 4. Ground-Floor Retail / Lobby Showroom Glass (Double-Height)
 * Clear architectural glazing revealing warm timber acoustic panels, reception lighting,
 * and double entrance doors (Reference Images 1 & 2).
 */
export function getLobbyShowroomGlassTexture(): THREE.CanvasTexture {
  if (textureCache.has('arch_lobby_showroom')) return textureCache.get('arch_lobby_showroom')! as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 256);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Dark aluminum storefront mullion frame
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 256);

  // 4 large floor-to-ceiling glass bays
  const bays = 4;
  const bayW = 512 / bays;
  for (let b = 0; b < bays; b++) {
    const x = b * bayW + 4;
    const y = 4;
    const w = bayW - 8;
    const h = 248;

    // Interior warm golden illumination
    const interiorGrad = ctx.createLinearGradient(x, y, x, y + h);
    interiorGrad.addColorStop(0, '#fef08a'); // Warm ceiling cove light
    interiorGrad.addColorStop(0.3, '#fed7aa'); // Ambient timber warmth
    interiorGrad.addColorStop(0.7, '#d97706'); // Warm timber wall slats
    interiorGrad.addColorStop(1, '#451a03'); // Dark polished terrazzo floor
    ctx.fillStyle = interiorGrad;
    ctx.fillRect(x, y, w, h);

    // Warm vertical timber acoustic slats on back wall
    ctx.strokeStyle = 'rgba(120, 53, 15, 0.35)';
    ctx.lineWidth = 1.5;
    for (let sx = x + 6; sx < x + w - 6; sx += 8) {
      ctx.beginPath();
      ctx.moveTo(sx, y + 20);
      ctx.lineTo(sx, y + h - 10);
      ctx.stroke();
    }

    // Modern architectural pendant / downlight spots
    for (let lx = x + 16; lx < x + w; lx += 24) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(lx, y + 14, 3, 0, Math.PI * 2);
      ctx.fill();
      // Light cone
      const cone = ctx.createRadialGradient(lx, y + 14, 2, lx, y + 40, 24);
      cone.addColorStop(0, 'rgba(255, 255, 200, 0.5)');
      cone.addColorStop(1, 'rgba(255, 255, 200, 0)');
      ctx.fillStyle = cone;
      ctx.beginPath();
      ctx.arc(lx, y + 30, 24, 0, Math.PI);
      ctx.fill();
    }

    // Specular sheen on glass surface
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(x, y, w, 3);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('arch_lobby_showroom', texture);
  return texture;
}

/**
 * 5. Architectural Metal Louvers / Ventilation Grilles
 * Dark metallic horizontal louvers for mechanical penthouses, spandrels, and AC intakes.
 */
export function getArchitecturalLouversTexture(): THREE.CanvasTexture {
  if (textureCache.has('arch_louvers')) return textureCache.get('arch_louvers')! as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(256, 256);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Deep shadow background
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, 256, 256);

  // Horizontal angled louver blades (16px pitch)
  const pitch = 16;
  for (let y = 0; y < 256; y += pitch) {
    // Upper highlight of angled blade
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, y, 256, 2);
    // Face of blade
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, y + 2, 256, 8);
    // Bottom shadow
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, y + 10, 256, pitch - 10);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('arch_louvers', texture);
  return texture;
}

/**
 * 6. Architectural Granite Entrance Paving Stones (512x512)
 * High-end textured stone pavers with crisp expansion joints for entrances and plazas.
 */
export function getGranitePaverTexture(): THREE.CanvasTexture {
  if (textureCache.has('arch_granite_paver')) return textureCache.get('arch_granite_paver')! as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Medium charcoal granite base
  ctx.fillStyle = '#64748b';
  ctx.fillRect(0, 0, 512, 512);

  // Mineral granite grain
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 35;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain + 2));
  }
  ctx.putImageData(imgData, 0, 0);

  // Large format modular pavers (128x64 brick pattern)
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 3;

  for (let y = 0; y <= 512; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    const row = Math.floor(y / 64);
    const offset = (row % 2) * 64;
    for (let x = offset; x <= 512 + 64; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 64);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('arch_granite_paver', texture);
  return texture;
}

/**
 * 7. Architectural Cedar / Teak Wood Slats (Terraces, Louvers & Pergolas)
 */
export function getArchitecturalWoodTexture(): THREE.CanvasTexture {
  if (textureCache.has('arch_wood')) return textureCache.get('arch_wood')! as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(256, 256);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Warm cedar base
  ctx.fillStyle = '#b45309';
  ctx.fillRect(0, 0, 256, 256);

  // Longitudinal wood planks (32px width)
  const pw = 32;
  for (let x = 0; x < 256; x += pw) {
    // Subtle wood grain variation
    const plankTone = Math.random() * 20 - 10;
    ctx.fillStyle = `rgb(${180 + plankTone}, ${83 + plankTone * 0.5}, ${9 + plankTone * 0.2})`;
    ctx.fillRect(x, 0, pw - 2, 256);

    // Plank seam
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + pw - 2, 0, 2, 256);

    // Fine wood grain lines
    ctx.strokeStyle = 'rgba(120, 53, 15, 0.25)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const gx = x + Math.random() * (pw - 4);
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx + (Math.random() - 0.5) * 4, 256);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('arch_wood', texture);
  return texture;
}

/**
 * 8. Modern Stack-Bond Facade Tiles (Contemporary White / Slate Ceramic Cladding)
 */
export function getStackBondTileTexture(color = '#f8fafc', mortar = '#cbd5e1'): THREE.CanvasTexture {
  const cacheKey = `arch_tile_${color}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey)! as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(256, 256);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 256, 256);

  // Fine stack-bond grid (32px x 64px rectangles)
  ctx.strokeStyle = mortar;
  ctx.lineWidth = 2;
  for (let x = 0; x <= 256; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }
  for (let y = 0; y <= 256; y += 64) {
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
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * 9. High-Contrast Tactile Warning & Directional Paving (Reference Images 1 & 2)
 * Blister studs and directional grooves for accessible pedestrian sidewalks.
 */
export function getTactilePavingTexture(): THREE.CanvasTexture {
  if (textureCache.has('arch_tactile')) return textureCache.get('arch_tactile')! as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(256, 256);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // High-visibility architectural safety yellow / warm amber
  ctx.fillStyle = '#eab308';
  ctx.fillRect(0, 0, 256, 256);

  // Directional guide ribs (8 parallel continuous grooves)
  const ribW = 32;
  for (let x = 0; x < 256; x += ribW) {
    // Rib shadow
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(x, 0, 6, 256);
    // Rib highlight
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x + 6, 0, 18, 256);
    // Groove recess
    ctx.fillStyle = '#a16207';
    ctx.fillRect(x + 24, 0, 8, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('arch_tactile', texture);
  return texture;
}

/**
 * 10. Cast-Iron Utility Manhole Cover (Round 256x256)
 */
export function getManholeCoverTexture(): THREE.CanvasTexture {
  if (textureCache.has('arch_manhole')) return textureCache.get('arch_manhole')! as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(256, 256);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Dark asphalt base background
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 256, 256);

  // Outer iron rim
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.arc(128, 128, 118, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(128, 128, 110, 0, Math.PI * 2);
  ctx.fill();

  // Waffle checker grip pattern
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 3;
  for (let p = 32; p <= 224; p += 16) {
    ctx.beginPath();
    ctx.moveTo(p, 32);
    ctx.lineTo(p, 224);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(32, p);
    ctx.lineTo(224, p);
    ctx.stroke();
  }

  // Inner circular emblem
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(128, 128, 48, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 12px monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('CITY SEWER', 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('arch_manhole', texture);
  return texture;
}

/**
 * 11. Cast-Iron Slotted Stormwater Drainage Grate
 */
export function getStormDrainGrateTexture(): THREE.CanvasTexture {
  if (textureCache.has('arch_drain_grate')) return textureCache.get('arch_drain_grate')! as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(256, 256);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Dark gutter concrete rim
  ctx.fillStyle = '#334155';
  ctx.fillRect(0, 0, 256, 256);

  // Cast iron frame
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(8, 8, 240, 240);

  // Drainage slots (longitudinal slots with deep dark shadow)
  const slotW = 12;
  const gap = 8;
  for (let x = 24; x < 232; x += slotW + gap) {
    // Deep black hole inside
    ctx.fillStyle = '#020617';
    ctx.fillRect(x, 24, slotW, 208);
    // Iron rib highlight
    ctx.fillStyle = '#475569';
    ctx.fillRect(x + slotW, 20, gap, 216);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('arch_drain_grate', texture);
  return texture;
}

/**
 * 12. Green-Painted Asphalt Protected Bike Lane with Bike Stencil (Reference Image 2)
 */
export function getBikeLaneGreenTexture(): THREE.CanvasTexture {
  if (textureCache.has('arch_bike_lane')) return textureCache.get('arch_bike_lane')! as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(256, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // High-durability emerald green acrylic pavement
  ctx.fillStyle = '#059669';
  ctx.fillRect(0, 0, 256, 512);

  // Subtle aggregate texture
  const imgData = ctx.getImageData(0, 0, 256, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 20;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  // White thermoplastic bicycle silhouette stencil
  ctx.strokeStyle = '#ffffff';
  ctx.fillStyle = '#ffffff';
  ctx.lineWidth = 6;

  // Rear wheel
  ctx.beginPath();
  ctx.arc(88, 280, 26, 0, Math.PI * 2);
  ctx.stroke();

  // Front wheel
  ctx.beginPath();
  ctx.arc(168, 280, 26, 0, Math.PI * 2);
  ctx.stroke();

  // Bike Frame & Handlebars
  ctx.beginPath();
  ctx.moveTo(88, 280);
  ctx.lineTo(122, 280);
  ctx.lineTo(148, 240);
  ctx.lineTo(108, 240);
  ctx.lineTo(88, 280);
  ctx.moveTo(122, 280);
  ctx.lineTo(108, 240);
  ctx.moveTo(148, 240);
  ctx.lineTo(168, 280);
  // Fork & Handlebars
  ctx.moveTo(168, 280);
  ctx.lineTo(152, 222);
  ctx.lineTo(160, 218);
  // Seat
  ctx.moveTo(108, 240);
  ctx.lineTo(104, 224);
  ctx.lineTo(116, 224);
  ctx.stroke();

  // Directional chevron arrow ahead of bicycle
  ctx.beginPath();
  ctx.moveTo(96, 160);
  ctx.lineTo(128, 120);
  ctx.lineTo(160, 160);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('arch_bike_lane', texture);
  return texture;
}

/**
 * 13. Café Barrio Storefront Marquee Sign (Reference Image 2 Style)
 */
export function getCafeSignTexture(): THREE.CanvasTexture {
  if (textureCache.has('arch_cafe_sign')) return textureCache.get('arch_cafe_sign')! as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 128);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Deep matte black architectural fascia
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 128);

  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, 504, 120);

  // Title: "CAFÉ BARRIO"
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 44px "Segoe UI", Roboto, system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('CAFÉ BARRIO', 256, 48);

  // Subtitle: "SPECIALTY COFFEE & ARTISAN BAKERY"
  ctx.font = '600 13px monospace';
  ctx.fillStyle = '#fbbf24';
  ctx.letterSpacing = '5px';
  ctx.fillText('SPECIALTY COFFEE • ARTISAN BAKERY', 256, 92);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('arch_cafe_sign', texture);
  return texture;
}

/**
 * 14. Detailed Urban Asphalt Pavement Texture with Imperfections
 */
export function getUrbanAsphaltDetailedTexture(): THREE.CanvasTexture {
  if (textureCache.has('arch_asphalt_detailed')) return textureCache.get('arch_asphalt_detailed')! as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Rich charcoal base
  ctx.fillStyle = '#1f242d';
  ctx.fillRect(0, 0, 512, 512);

  // Fine multi-colored mineral aggregate noise
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 36;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain + 2));
  }
  ctx.putImageData(imgData, 0, 0);

  // Subtle tar repair seams
  ctx.strokeStyle = '#11151c';
  ctx.lineWidth = 2.5;
  for (let s = 0; s < 4; s++) {
    ctx.beginPath();
    let sx = Math.random() * 512;
    let sy = Math.random() * 512;
    ctx.moveTo(sx, sy);
    for (let seg = 0; seg < 4; seg++) {
      sx += (Math.random() - 0.5) * 80;
      sy += (Math.random() - 0.5) * 80;
      ctx.lineTo(sx, sy);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('arch_asphalt_detailed', texture);
  return texture;
}

/**
 * 15. Organic Tree Bark Textures (Oak, Birch, Maple)
 * Distinct botanically accurate bark: furrowed oak, papery white birch, and striated maple.
 */
export function getOrganicBarkTexture(species: 'oak' | 'birch' | 'maple' = 'oak'): THREE.CanvasTexture {
  const cacheKey = `bark_${species}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey)! as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  if (species === 'birch') {
    // Paper Birch: Chalky white/silvery base with dark horizontal lenticels & papery curls
    ctx.fillStyle = '#e8ecf1';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle vertical grey tone variation
    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, 'rgba(215, 222, 230, 0.4)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
    grad.addColorStop(1, 'rgba(205, 215, 225, 0.4)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Prominent horizontal dark lenticels & peeling paper fissures
    ctx.fillStyle = '#1e2530';
    for (let i = 0; i < 90; i++) {
      const y = Math.random() * 512;
      const x = Math.random() * 460;
      const len = 12 + Math.random() * 45;
      const h = 2 + Math.random() * 3.5;
      ctx.beginPath();
      ctx.ellipse(x, y, len, h, (Math.random() - 0.5) * 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Peeling paper shadow
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - len, y + h);
      ctx.lineTo(x + len, y + h);
      ctx.stroke();
    }

    // Basal dark rough knots
    for (let k = 0; k < 6; k++) {
      const kx = Math.random() * 512;
      const ky = 360 + Math.random() * 150;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(kx, ky, 8 + Math.random() * 12, 14 + Math.random() * 20, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (species === 'maple') {
    // Sugar Maple: Warm charcoal-umber with fine vertical fissures & moss patches
    ctx.fillStyle = '#3a2b20';
    ctx.fillRect(0, 0, 512, 512);

    // Interlocking vertical furrow ridges
    ctx.strokeStyle = '#5a4332';
    ctx.lineWidth = 4;
    for (let x = 8; x < 512; x += 14) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      let curX = x;
      for (let y = 0; y < 512; y += 18) {
        curX += (Math.random() - 0.5) * 6;
        ctx.lineTo(curX, y);
      }
      ctx.stroke();
    }

    // Deep shadow crevices
    ctx.strokeStyle = '#1a110a';
    ctx.lineWidth = 2.5;
    for (let x = 12; x < 512; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      let curX = x;
      for (let y = 0; y < 512; y += 22) {
        curX += (Math.random() - 0.5) * 4;
        ctx.lineTo(curX, y);
      }
      ctx.stroke();
    }

    // Lichen and moss patches
    ctx.fillStyle = 'rgba(74, 98, 64, 0.4)';
    for (let m = 0; m < 14; m++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, 8 + Math.random() * 18, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // English Oak / London Plane: Deep rugged vertical bark plates with ridges
    ctx.fillStyle = '#35251b';
    ctx.fillRect(0, 0, 512, 512);

    // Ridge highlights
    ctx.strokeStyle = '#5c4333';
    ctx.lineWidth = 6;
    for (let x = 6; x < 512; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      let curX = x;
      for (let y = 0; y < 512; y += 20) {
        curX += (Math.random() - 0.5) * 8;
        ctx.lineTo(curX, y);
      }
      ctx.stroke();
    }

    // Secondary lighter ridges
    ctx.strokeStyle = '#7c5a43';
    ctx.lineWidth = 2.5;
    for (let x = 10; x < 512; x += 22) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      let curX = x;
      for (let y = 0; y < 512; y += 24) {
        curX += (Math.random() - 0.5) * 5;
        ctx.lineTo(curX, y);
      }
      ctx.stroke();
    }

    // Deep shadowed fissures
    ctx.strokeStyle = '#120b06';
    ctx.lineWidth = 4;
    for (let x = 14; x < 512; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      let curX = x;
      for (let y = 0; y < 512; y += 20) {
        curX += (Math.random() - 0.5) * 7;
        ctx.lineTo(curX, y);
      }
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * 16. Alpha-Tested Foliage Card Atlas (Oak, Birch, Autumn Maple)
 * Detailed botanical leaf branch clusters with translucent sunlight highlights and crisp alpha cutout silhouettes.
 */
export function getFoliageAtlasTexture(species: 'oak' | 'birch' | 'maple' = 'oak'): THREE.CanvasTexture {
  const cacheKey = `foliage_${species}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey)! as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Clear transparent background
  ctx.clearRect(0, 0, 512, 512);

  // Helper to draw an organic leaf with stem and veins
  function drawLeaf(
    x: number,
    y: number,
    length: number,
    width: number,
    angle: number,
    baseColor: string,
    highlightColor: string,
    isMapleLobe: boolean = false
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    if (isMapleLobe) {
      // 5-Pointed Maple Leaf
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      // Main central tip
      ctx.lineTo(-width * 0.45, -length * 0.4);
      ctx.lineTo(-width * 0.35, -length * 0.55);
      ctx.lineTo(-width * 0.5, -length * 0.7);
      ctx.lineTo(0, -length);
      ctx.lineTo(width * 0.5, -length * 0.7);
      ctx.lineTo(width * 0.35, -length * 0.55);
      ctx.lineTo(width * 0.45, -length * 0.4);
      ctx.closePath();
      ctx.fill();

      // Top highlight
      ctx.fillStyle = highlightColor;
      ctx.beginPath();
      ctx.ellipse(0, -length * 0.45, width * 0.25, length * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Natural Deciduous / Oak Leaf with serrations
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-width, -length * 0.45, 0, -length);
      ctx.quadraticCurveTo(width, -length * 0.45, 0, 0);
      ctx.fill();

      // Sunlit leaf highlight / translucent glow
      ctx.fillStyle = highlightColor;
      ctx.beginPath();
      ctx.ellipse(width * 0.15, -length * 0.45, width * 0.4, length * 0.35, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Midrib vein
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -length * 0.85);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Draw 2 main branch scaffolds with radiating twigs & dense foliage clusters
  const branches = [
    { startX: 256, startY: 490, endX: 256, endY: 200 },
    { startX: 256, startY: 340, endX: 110, endY: 140 },
    { startX: 256, startY: 300, endX: 400, endY: 150 },
    { startX: 256, startY: 210, endX: 180, endY: 60 },
    { startX: 256, startY: 190, endX: 330, endY: 70 },
  ];

  // Draw woody twigs
  ctx.strokeStyle = '#291d15';
  ctx.lineCap = 'round';
  branches.forEach((b) => {
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(b.startX, b.startY);
    ctx.lineTo(b.endX, b.endY);
    ctx.stroke();
  });

  // Color palettes based on species
  let leafBaseColors: string[];
  let leafHighlightColors: string[];
  const isMaple = species === 'maple';

  if (species === 'birch') {
    // Lime & spring chartreuse birch foliage
    leafBaseColors = ['#15803d', '#16a34a', '#22c55e', '#166534'];
    leafHighlightColors = ['#86efac', '#a3e635', '#bbf7d0', '#6ee7b7'];
  } else if (species === 'maple') {
    // Rich autumn crimson, amber and golden sugar maple
    leafBaseColors = ['#991b1b', '#b91c1c', '#c2410c', '#d97706'];
    leafHighlightColors = ['#f97316', '#fbbf24', '#f87171', '#f59e0b'];
  } else {
    // English Oak / London Plane: Deep emerald with sunlit olive tips
    leafBaseColors = ['#14532d', '#166534', '#15803d', '#1e3a1e'];
    leafHighlightColors = ['#4ade80', '#84cc16', '#22c55e', '#65a30d'];
  }

  // Generate 120 dense overlapping leaf cards across branch extremities
  for (let i = 0; i < 140; i++) {
    // Cluster centers around branch endpoints
    const branch = branches[Math.floor(Math.random() * branches.length)];
    const t = 0.3 + Math.random() * 0.75;
    const cx = branch.startX + (branch.endX - branch.startX) * t + (Math.random() - 0.5) * 80;
    const cy = branch.startY + (branch.endY - branch.startY) * t + (Math.random() - 0.5) * 75;

    const len = 22 + Math.random() * 26;
    const w = 11 + Math.random() * 15;
    const angle = (Math.random() - 0.5) * Math.PI * 1.6;

    const baseCol = leafBaseColors[Math.floor(Math.random() * leafBaseColors.length)];
    const highCol = leafHighlightColors[Math.floor(Math.random() * leafHighlightColors.length)];

    drawLeaf(cx, cy, len, w, angle, baseCol, highCol, isMaple);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * 17. Alpha-Tested Feather Fountain Grass (Pennisetum) Clump Texture
 * Mounded fine curving blades with golden plume seedheads.
 */
export function getOrnamentalGrassTexture(): THREE.CanvasTexture {
  if (textureCache.has('ornamental_grass')) return textureCache.get('ornamental_grass')! as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 512, 512);

  // Mounded fountain grass radiating from base center (256, 500)
  const baseColors = ['#166534', '#15803d', '#4d7c0f', '#3f6212'];
  const bladeTones = ['#65a30d', '#84cc16', '#a3e635', '#eab308'];

  for (let i = 0; i < 110; i++) {
    const spread = (i / 110 - 0.5) * 440;
    const endX = 256 + spread;
    const endY = 120 + Math.abs(spread) * 0.55 + (Math.random() - 0.5) * 40;
    const controlX = 256 + spread * 0.45;
    const controlY = 220 + (Math.random() - 0.5) * 50;

    ctx.strokeStyle = bladeTones[Math.floor(Math.random() * bladeTones.length)];
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(256 + (Math.random() - 0.5) * 40, 500);
    ctx.quadraticCurveTo(controlX, controlY, endX, endY);
    ctx.stroke();

    // Soft feathery seedhead plume at tip of select blades
    if (i % 3 === 0) {
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.ellipse(endX, endY - 6, 4, 14, (spread > 0 ? 0.35 : -0.35), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('ornamental_grass', texture);
  return texture;
}

/**
 * 18. Alpha-Tested Perennial Flower Spike Texture (Salvia / Lavender)
 * Dense vertical floral spikes with vibrant violet/purple blooms and sage foliage.
 */
export function getPerennialFlowerTexture(): THREE.CanvasTexture {
  if (textureCache.has('perennial_flower')) return textureCache.get('perennial_flower')! as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 512, 512);

  const flowerColors = ['#7c3aed', '#8b5cf6', '#a855f7', '#6d28d9', '#c084fc'];
  const stemPositions = [90, 170, 256, 340, 420];

  stemPositions.forEach((sx) => {
    // Green stalk
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sx, 500);
    ctx.lineTo(sx + (Math.random() - 0.5) * 20, 100);
    ctx.stroke();

    // Lower leaves
    for (let l = 0; l < 8; l++) {
      const ly = 360 + l * 16;
      ctx.fillStyle = '#166534';
      ctx.beginPath();
      ctx.ellipse(sx - 16, ly, 14, 5, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(sx + 16, ly, 14, 5, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Dense violet/purple florets on upper spike (from y = 100 to y = 340)
    for (let f = 0; f < 35; f++) {
      const fy = 100 + f * 7;
      const spreadX = (Math.random() - 0.5) * 22;
      ctx.fillStyle = flowerColors[Math.floor(Math.random() * flowerColors.length)];
      ctx.beginPath();
      ctx.arc(sx + spreadX, fy, 4.5 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('perennial_flower', texture);
  return texture;
}

/**
 * 19. Modern Architectural Slotted Cast-Iron Tree Grate (1.4m x 1.4m)
 * Radial drainage slots, heavy graphite cast metal, center tree opening, and corner bolts.
 */
export function getCastIronTreeGrateTexture(): THREE.CanvasTexture {
  if (textureCache.has('cast_iron_tree_grate')) return textureCache.get('cast_iron_tree_grate')! as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Dark graphite cast iron body
  ctx.fillStyle = '#18181b';
  ctx.fillRect(0, 0, 512, 512);

  // Outer square bevel rim
  ctx.strokeStyle = '#3f3f46';
  ctx.lineWidth = 14;
  ctx.strokeRect(10, 10, 492, 492);

  // Concentric radial ventilation / drainage slots
  ctx.strokeStyle = '#09090b';
  ctx.lineWidth = 6;
  const radii = [70, 105, 140, 175, 210];
  radii.forEach((r) => {
    ctx.beginPath();
    ctx.arc(256, 256, r, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Radial spoke bars
  for (let a = 0; a < 24; a++) {
    const angle = (a / 24) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(256 + Math.cos(angle) * 55, 256 + Math.sin(angle) * 55);
    ctx.lineTo(256 + Math.cos(angle) * 230, 256 + Math.sin(angle) * 230);
    ctx.stroke();
  }

  // Center trunk opening hole (diameter ~110px) with inner rim
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.arc(256, 256, 52, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#52525b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(256, 256, 54, 0, Math.PI * 2);
  ctx.stroke();

  // Corner security mounting bolts
  const corners = [
    [32, 32],
    [480, 32],
    [32, 480],
    [480, 480],
  ];
  corners.forEach(([cx, cy]) => {
    ctx.fillStyle = '#52525b';
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#71717a';
    ctx.beginPath();
    ctx.arc(cx - 1, cy - 1, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('cast_iron_tree_grate', texture);
  return texture;
}

/**
 * 20. Soft Ambient Dappled Tree Contact Shadow Disc
 * Radial occlusion gradient with foliage light breakup to ground trees onto pavers.
 */
export function getTreeContactShadowTexture(): THREE.CanvasTexture {
  if (textureCache.has('tree_contact_shadow')) return textureCache.get('tree_contact_shadow')! as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(256, 256);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 256, 256);

  // Radial soft gradient
  const grad = ctx.createRadialGradient(128, 128, 15, 128, 128, 120);
  grad.addColorStop(0, 'rgba(15, 23, 42, 0.78)');
  grad.addColorStop(0.35, 'rgba(15, 23, 42, 0.55)');
  grad.addColorStop(0.7, 'rgba(15, 23, 42, 0.22)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(128, 128, 120, 0, Math.PI * 2);
  ctx.fill();

  // Dappled light holes breaking up solid shadow
  ctx.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 40; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 30 + Math.random() * 75;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.arc(128 + Math.cos(angle) * dist, 128 + Math.sin(angle) * dist, 4 + Math.random() * 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('tree_contact_shadow', texture);
  return texture;
}

/**
 * 21. Rich Organic Shredded Bark Mulch & Humus Soil Texture
 */
export function getMulchSoilTexture(): THREE.CanvasTexture {
  if (textureCache.has('mulch_soil')) return textureCache.get('mulch_soil')! as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Deep dark umber/black organic loam
  ctx.fillStyle = '#211711';
  ctx.fillRect(0, 0, 512, 512);

  // Shredded wood bark nuggets
  for (let i = 0; i < 350; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const len = 6 + Math.random() * 16;
    const w = 2.5 + Math.random() * 5;
    const rot = Math.random() * Math.PI;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillStyle = Math.random() > 0.4 ? '#3b281d' : '#4d3424';
    ctx.fillRect(-len / 2, -w / 2, len, w);
    ctx.restore();
  }

  // Scattered dry autumn leaf flakes
  for (let l = 0; l < 45; l++) {
    const lx = Math.random() * 512;
    const ly = Math.random() * 512;
    ctx.fillStyle = Math.random() > 0.5 ? '#b45309' : '#854d0e';
    ctx.beginPath();
    ctx.ellipse(lx, ly, 4 + Math.random() * 5, 2.5 + Math.random() * 3, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('mulch_soil', texture);
  return texture;
}


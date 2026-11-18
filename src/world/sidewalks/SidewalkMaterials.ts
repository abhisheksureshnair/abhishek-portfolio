import * as THREE from 'three';

const textureCache = new Map<string, THREE.Texture>();

function createOffscreenCanvas(width: number, height: number): HTMLCanvasElement | null {
  if (typeof window === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/**
 * Concrete Sidewalk Paver Texture
 * Architectural precast paving slabs with 500x500mm grid joints and natural aggregate.
 */
export function getSidewalkPaverTexture(): THREE.CanvasTexture {
  const key = 'sidewalk_paver';
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Neutral architectural warm grey concrete
  ctx.fillStyle = '#9ca3af';
  ctx.fillRect(0, 0, 512, 512);

  // Micro-texture aggregate noise
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 16;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  // Paver slab grid expansion joints (4x4 tiles in 512px)
  const tileSize = 128;
  ctx.strokeStyle = '#4b5563';
  ctx.lineWidth = 2.5;

  for (let x = 0; x <= 512; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += tileSize) {
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
  textureCache.set(key, texture);
  return texture;
}

/**
 * Granite Curb Stone Texture
 * Dense, beveled granite curb stone profile.
 */
export function getCurbStoneTexture(): THREE.CanvasTexture {
  const key = 'curb_stone';
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(256, 256);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#6b7280';
  ctx.fillRect(0, 0, 256, 256);

  // Fine granite flecks
  for (let i = 0; i < 350; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    ctx.fillStyle = Math.random() > 0.5 ? '#9ca3af' : '#4b5563';
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Linear joint grooves along curb blocks
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 2;
  for (let y = 0; y < 256; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(key, texture);
  return texture;
}

let sharedSidewalkMaterial: THREE.MeshStandardMaterial | null = null;
let sharedCurbMaterial: THREE.MeshStandardMaterial | null = null;

export function getSharedSidewalkMaterial(): THREE.MeshStandardMaterial {
  if (sharedSidewalkMaterial) return sharedSidewalkMaterial;

  const paverTex = getSidewalkPaverTexture();
  sharedSidewalkMaterial = new THREE.MeshStandardMaterial({
    map: paverTex,
    roughness: 0.8,
    metalness: 0.05,
    color: '#d1d5db',
  });
  return sharedSidewalkMaterial;
}

export function getSharedCurbMaterial(): THREE.MeshStandardMaterial {
  if (sharedCurbMaterial) return sharedCurbMaterial;

  const curbTex = getCurbStoneTexture();
  sharedCurbMaterial = new THREE.MeshStandardMaterial({
    map: curbTex,
    roughness: 0.75,
    metalness: 0.1,
    color: '#9ca3af',
  });
  return sharedCurbMaterial;
}


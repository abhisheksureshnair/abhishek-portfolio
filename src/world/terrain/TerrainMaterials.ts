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
 * Procedural Realistic Ground PBR Textures
 * High-performance earthy dark loam, fine aggregate, and subtle urban terrain.
 */
export function getTerrainDiffuseTexture(): THREE.CanvasTexture {
  const key = 'terrain_diffuse';
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Natural cohesive urban/suburban ground foundation (#52525b)
  ctx.fillStyle = '#52525b';
  ctx.fillRect(0, 0, 512, 512);

  // Micro-gravel & loam noise passes
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 28;
    const tint = Math.random() > 0.6 ? 4 : -3;
    data[i] = Math.min(255, Math.max(0, data[i] + noise + tint));       // R
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise + 2)); // G
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise - 2)); // B
  }
  ctx.putImageData(imgData, 0, 0);

  // Subtle organic pebble & soil clusters
  for (let c = 0; c < 280; c++) {
    const cx = Math.random() * 512;
    const cy = Math.random() * 512;
    const radius = 1 + Math.random() * 3.5;
    ctx.fillStyle = Math.random() > 0.5 ? '#33372c' : '#1f211b';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(24, 24);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(key, texture);
  return texture;
}

export function getTerrainNormalTexture(): THREE.CanvasTexture {
  const key = 'terrain_normal';
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Generate height map in memory
  const heights = new Float32Array(512 * 512);
  for (let i = 0; i < heights.length; i++) {
    heights[i] = Math.random() * 0.4 + (Math.sin(i * 0.05) * 0.1);
  }

  // Sobel filter to create authentic normal map
  const imgData = ctx.createImageData(512, 512);
  const data = imgData.data;

  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const idx = y * 512 + x;
      const xLeft = y * 512 + (x > 0 ? x - 1 : 511);
      const xRight = y * 512 + (x < 511 ? x + 1 : 0);
      const yUp = (y > 0 ? y - 1 : 511) * 512 + x;
      const yDown = (y < 511 ? y + 1 : 0) * 512 + x;

      const dx = (heights[xRight] - heights[xLeft]) * 2.5;
      const dy = (heights[yDown] - heights[yUp]) * 2.5;
      const dz = 1.0;

      const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const nx = (dx / len) * 0.5 + 0.5;
      const ny = (dy / len) * 0.5 + 0.5;
      const nz = (dz / len) * 0.5 + 0.5;

      const pIdx = idx * 4;
      data[pIdx] = Math.floor(nx * 255);
      data[pIdx + 1] = Math.floor(ny * 255);
      data[pIdx + 2] = Math.floor(nz * 255);
      data[pIdx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(24, 24);
  textureCache.set(key, texture);
  return texture;
}

export function getTerrainRoughnessTexture(): THREE.CanvasTexture {
  const key = 'terrain_roughness';
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(256, 256);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // High natural roughness (values between 0.82 and 0.96)
  ctx.fillStyle = '#dbdbdb';
  ctx.fillRect(0, 0, 256, 256);

  const imgData = ctx.getImageData(0, 0, 256, 256);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 32;
    const v = Math.min(255, Math.max(200, 225 + noise));
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(24, 24);
  textureCache.set(key, texture);
  return texture;
}

let sharedTerrainMaterial: THREE.MeshStandardMaterial | null = null;

export function getSharedTerrainMaterial(): THREE.MeshStandardMaterial {
  if (sharedTerrainMaterial) return sharedTerrainMaterial;

  const diffuse = getTerrainDiffuseTexture();
  const normal = getTerrainNormalTexture();
  const roughness = getTerrainRoughnessTexture();

  sharedTerrainMaterial = new THREE.MeshStandardMaterial({
    map: diffuse,
    normalMap: normal,
    normalScale: new THREE.Vector2(0.35, 0.35),
    roughnessMap: roughness,
    roughness: 0.9,
    metalness: 0.05,
    color: '#71717a',
  });

  return sharedTerrainMaterial;
}


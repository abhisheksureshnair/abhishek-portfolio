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
 * Realistic Weathered American City Asphalt Texture
 * Medium charcoal gray with fine mineral aggregate, subtle tire tracks,
 * and micro-roughness. Never pitch black!
 */
export function getAsphaltDiffuseTexture(): THREE.CanvasTexture {
  const key = 'asphalt_diffuse_v2';
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(512, 512);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // Weathered medium charcoal gray foundation (#40454e)
  ctx.fillStyle = '#40454e';
  ctx.fillRect(0, 0, 512, 512);

  // Micro-aggregate stone flecks & bitumen noise
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 24;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise + 1));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise + 2));
  }
  ctx.putImageData(imgData, 0, 0);

  // Mineral aggregate specks (limestone & granite chips)
  for (let s = 0; s < 600; s++) {
    const sx = Math.random() * 512;
    const sy = Math.random() * 512;
    const radius = 0.6 + Math.random() * 1.8;
    const isLight = Math.random() > 0.45;
    ctx.fillStyle = isLight ? '#64748b' : '#2d3138';
    ctx.beginPath();
    ctx.arc(sx, sy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Subtle longitudinal vehicle wheel tracks (slightly darker worn lanes)
  const track1 = ctx.createLinearGradient(90, 0, 160, 0);
  track1.addColorStop(0, 'rgba(45, 49, 56, 0)');
  track1.addColorStop(0.5, 'rgba(45, 49, 56, 0.18)');
  track1.addColorStop(1, 'rgba(45, 49, 56, 0)');
  ctx.fillStyle = track1;
  ctx.fillRect(90, 0, 70, 512);

  const track2 = ctx.createLinearGradient(350, 0, 420, 0);
  track2.addColorStop(0, 'rgba(45, 49, 56, 0)');
  track2.addColorStop(0.5, 'rgba(45, 49, 56, 0.18)');
  track2.addColorStop(1, 'rgba(45, 49, 56, 0)');
  ctx.fillStyle = track2;
  ctx.fillRect(350, 0, 70, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(key, texture);
  return texture;
}

export function getAsphaltNormalTexture(): THREE.CanvasTexture {
  const key = 'asphalt_normal_v2';
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(256, 256);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  const heights = new Float32Array(256 * 256);
  for (let i = 0; i < heights.length; i++) {
    heights[i] = Math.random() * 0.35;
  }

  const imgData = ctx.createImageData(256, 256);
  const data = imgData.data;

  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      const idx = y * 256 + x;
      const xLeft = y * 256 + (x > 0 ? x - 1 : 255);
      const xRight = y * 256 + (x < 255 ? x + 1 : 0);
      const yUp = (y > 0 ? y - 1 : 255) * 256 + x;
      const yDown = (y < 255 ? y + 1 : 0) * 256 + x;

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
  texture.repeat.set(4, 4);
  textureCache.set(key, texture);
  return texture;
}

export function getAsphaltRoughnessTexture(): THREE.CanvasTexture {
  const key = 'asphalt_roughness_v2';
  if (textureCache.has(key)) return textureCache.get(key) as THREE.CanvasTexture;

  const canvas = createOffscreenCanvas(256, 256);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#b0b5be';
  ctx.fillRect(0, 0, 256, 256);

  const imgData = ctx.getImageData(0, 0, 256, 256);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 28;
    const v = Math.min(255, Math.max(160, 185 + noise));
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  textureCache.set(key, texture);
  return texture;
}

let sharedAsphaltMaterial: THREE.MeshStandardMaterial | null = null;

export function getSharedAsphaltMaterial(): THREE.MeshStandardMaterial {
  if (sharedAsphaltMaterial) return sharedAsphaltMaterial;

  const diffuse = getAsphaltDiffuseTexture();
  const normal = getAsphaltNormalTexture();
  const roughness = getAsphaltRoughnessTexture();

  sharedAsphaltMaterial = new THREE.MeshStandardMaterial({
    map: diffuse,
    normalMap: normal,
    normalScale: new THREE.Vector2(0.35, 0.35),
    roughnessMap: roughness,
    roughness: 0.82,
    metalness: 0.04,
    color: '#475569', // Real weathered charcoal asphalt (never pitch black!)
  });

  return sharedAsphaltMaterial;
}

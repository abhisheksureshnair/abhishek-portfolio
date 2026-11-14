'use client';

import * as THREE from 'three';

const textureCache = new Map<string, THREE.Texture>();

/**
 * Procedural High-Definition PBR Texture Suite for Realistic City
 * Generates photorealistic asphalt, concrete, glass facades, grass, and foliage.
 * Zero external network dependencies, instant rendering, fully cached.
 */

// 1. High-Resolution Realistic Asphalt Road Texture (512 x 512)
export function getRealisticAsphaltTexture(): THREE.CanvasTexture {
  if (textureCache.has('real_asphalt')) return textureCache.get('real_asphalt')! as THREE.CanvasTexture;

  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep dark gray asphalt base
  ctx.fillStyle = '#262b32';
  ctx.fillRect(0, 0, 512, 512);

  // Micro-aggregate gravel noise (Thousands of fine multi-tone mineral grains)
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 45;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain + 2)); // subtle cool tint
  }
  ctx.putImageData(imgData, 0, 0);

  // Subtle tar seams and tire wear patches
  ctx.fillStyle = 'rgba(15, 18, 22, 0.25)';
  for (let i = 0; i < 8; i++) {
    const y = Math.random() * 512;
    ctx.fillRect(0, y, 512, 8 + Math.random() * 16);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('real_asphalt', texture);
  return texture;
}

// 2. Realistic Concrete Sidewalk Paver Texture (512 x 512)
export function getRealisticSidewalkTexture(): THREE.CanvasTexture {
  if (textureCache.has('real_sidewalk')) return textureCache.get('real_sidewalk')! as THREE.CanvasTexture;

  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Light architectural concrete slab base
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(0, 0, 512, 512);

  // Pavement aggregate speckling
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const tone = 125 + Math.floor(Math.random() * 60);
    ctx.fillStyle = `rgb(${tone}, ${tone}, ${tone})`;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Expansion joint grid (128px grid blocks with beveled groove lines)
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 4;
  for (let p = 0; p <= 512; p += 128) {
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, 512);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(512, p);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('real_sidewalk', texture);
  return texture;
}

// 3. Realistic Modern Glass Skyscraper Facade (Reflective Windows + Night Emissive)
export function getRealisticGlassFacadeTexture(): THREE.CanvasTexture {
  if (textureCache.has('real_facade')) return textureCache.get('real_facade')! as THREE.CanvasTexture;

  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Dark obsidian architectural steel frame
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 512);

  // Window grid: 8 columns x 16 floors
  const cols = 8;
  const rows = 16;
  const cellW = 512 / cols;
  const cellH = 512 / rows;
  const padX = 4;
  const padY = 3;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellW + padX;
      const y = r * cellH + padY;
      const w = cellW - padX * 2;
      const h = cellH - padY * 2;

      // Realistic office variation (warm incandescent, cyan workstation, or blind half-drawn)
      const rand = Math.random();
      if (rand < 0.35) {
        // Active warm LED office
        const grad = ctx.createLinearGradient(x, y, x, y + h);
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(0.7, '#fde047');
        grad.addColorStop(1, '#ca8a04');
        ctx.fillStyle = grad;
      } else if (rand < 0.6) {
        // High-tech cyan developer monitor glow
        const grad = ctx.createLinearGradient(x, y, x, y + h);
        grad.addColorStop(0, '#e0f2fe');
        grad.addColorStop(0.6, '#38bdf8');
        grad.addColorStop(1, '#0284c7');
        ctx.fillStyle = grad;
      } else if (rand < 0.8) {
        // Office blinds / dim ambient
        ctx.fillStyle = '#334155';
      } else {
        // Unoccupied dark floor
        ctx.fillStyle = '#1e293b';
      }

      ctx.fillRect(x, y, w, h);

      // Glass pane reflective specular sheen highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(x, y, w, 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('real_facade', texture);
  return texture;
}

// 4. Lush Ground Lawn & Soil Texture
export function getRealisticLawnTexture(): THREE.CanvasTexture {
  if (textureCache.has('real_lawn')) return textureCache.get('real_lawn')! as THREE.CanvasTexture;

  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Deep rich turf green
  ctx.fillStyle = '#166534';
  ctx.fillRect(0, 0, 256, 256);

  // Grass blade and organic soil flecks
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const g = 80 + Math.floor(Math.random() * 80);
    ctx.fillStyle = `rgb(${Math.floor(g * 0.4)}, ${g}, ${Math.floor(g * 0.25)})`;
    ctx.fillRect(x, y, 1.8, 1.8);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('real_lawn', texture);
  return texture;
}

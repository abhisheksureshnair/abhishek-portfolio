'use client';

import * as THREE from 'three';

// Cache generated and loaded textures so they are instantiated exactly once in memory
const textureCache = new Map<string, THREE.Texture>();
let textureLoader: THREE.TextureLoader | null = null;

function getLoader(): THREE.TextureLoader {
  if (!textureLoader) {
    textureLoader = new THREE.TextureLoader();
  }
  return textureLoader;
}

/**
 * Loads a real WebP image texture from public/textures/nexus-city/
 * Three.js TextureLoader returns a valid texture handle immediately and updates when loaded.
 */
export function getNexusCityWebPTexture(
  filename: string,
  repeatX = 1,
  repeatY = 1
): THREE.Texture {
  const cacheKey = `webp_${filename}_${repeatX}_${repeatY}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey)!;

  if (typeof window === 'undefined') {
    // SSR stub
    const stub = new THREE.Texture();
    textureCache.set(cacheKey, stub);
    return stub;
  }

  const loader = getLoader();
  const texture = loader.load(`/textures/nexus-city/${filename}`);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  textureCache.set(cacheKey, texture);
  return texture;
}

export function getNexusCityDataTexture(
  filename: string,
  repeatX = 1,
  repeatY = 1
): THREE.Texture {
  const cacheKey = `data_webp_${filename}_${repeatX}_${repeatY}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey)!;

  if (typeof window === 'undefined') {
    const stub = new THREE.Texture();
    textureCache.set(cacheKey, stub);
    return stub;
  }

  const loader = getLoader();
  const texture = loader.load(`/textures/nexus-city/${filename}`);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.colorSpace = THREE.NoColorSpace; // Non-color data (roughness/normals)
  textureCache.set(cacheKey, texture);
  return texture;
}

// 1. WET ASPHALT ROAD TEXTURE
export function getWetAsphaltTexture(): THREE.Texture {
  return getNexusCityWebPTexture('road_asphalt_wet.webp', 4, 16);
}

export function getWetAsphaltRoughness(): THREE.Texture {
  return getNexusCityDataTexture('road_asphalt_roughness.webp', 4, 16);
}

// 2. MODULAR SIDEWALK CONCRETE PAVING SLABS
export function getSidewalkTexture(): THREE.Texture {
  return getNexusCityWebPTexture('sidewalk_pavement.webp', 3, 24);
}

// 3. CYBERPUNK BUILDING FACADE (ILLUMINATED OFFICE WINDOW GRIDS)
export function getBuildingFacadeTexture(hue: 'cyan' | 'amber' | 'violet'): THREE.Texture {
  return getNexusCityWebPTexture('facade_windows_emissive.webp', 2, 4);
}

export function getBuildingPanelsTexture(): THREE.Texture {
  return getNexusCityWebPTexture('facade_panels.webp', 2, 4);
}

// 4. NEON BILLBOARDS & COMMERCIAL KIOSK POSTERS
export function getHologramPosterTexture(type: 'soups' | 'nexus' | 'oasis' | 'ai'): THREE.Texture {
  if (type === 'nexus') {
    return getNexusCityWebPTexture('billboard_nexus.webp', 1, 1);
  }
  return getNexusCityWebPTexture('sign_cyber_commercial.webp', 1, 1);
}

export function getCurvedBillboardTexture(): THREE.Texture {
  return getNexusCityWebPTexture('billboard_curved_screen.webp', 1, 1);
}

export function getNexusBrandBillboardTexture(): THREE.Texture {
  return getNexusCityWebPTexture('billboard_nexus.webp', 1, 1);
}

export function getHoloMonumentCoreTexture(): THREE.Texture {
  return getNexusCityWebPTexture('hologram_monument_core.webp', 1, 1);
}

export function getMetalGrateTexture(): THREE.Texture {
  return getNexusCityWebPTexture('metal_grate_duct.webp', 2, 2);
}

// 5. CHARACTER COAT TEXTURE (DRAGON / CYBERNETIC EMBROIDERY - Image 1 & 2)
export function getCharacterCoatTexture(): THREE.CanvasTexture {
  if (textureCache.has('coat')) return textureCache.get('coat')! as THREE.CanvasTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Dark matte trenchcoat leather / ballistic weave
  ctx.fillStyle = '#0a0d14';
  ctx.fillRect(0, 0, 512, 512);

  // Hexagonal carbon weave texture
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  const hex = 16;
  for (let y = 0; y < 512; y += hex) {
    for (let x = 0; x < 512; x += hex) {
      ctx.strokeRect(x, y, hex, hex);
    }
  }

  // Golden/Cyan Cyber Dragon & Circuit Back Emblem (Matching Reference Image 1 & 2)
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  // Central circuit spine
  ctx.moveTo(256, 80);
  ctx.lineTo(256, 420);
  // Ribs
  for (let y = 140; y <= 360; y += 40) {
    ctx.moveTo(256, y);
    ctx.lineTo(190 + (y % 30), y - 20);
    ctx.moveTo(256, y);
    ctx.lineTo(322 - (y % 30), y - 20);
  }
  ctx.stroke();

  // Central Gold Foil Dragon Crest
  ctx.fillStyle = '#fbbf24';
  ctx.font = '900 68px serif';
  ctx.textAlign = 'center';
  ctx.fillText('龍', 256, 260); // Kanji "Dragon"
  ctx.font = '700 24px monospace';
  ctx.fillStyle = '#00f0ff';
  ctx.fillText('NEXUS // 01', 256, 305);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set('coat', texture);
  return texture;
}

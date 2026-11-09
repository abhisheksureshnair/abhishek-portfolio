'use client';

import * as THREE from 'three';

let asphaltTexture: THREE.CanvasTexture | null = null;
let sidewalkTexture: THREE.CanvasTexture | null = null;

/**
 * Generates a lightweight procedural asphalt texture with subtle aggregate grain
 * Zero network dependencies, zero 404 risks.
 */
export function getProceduralAsphaltTexture(): THREE.CanvasTexture {
  if (asphaltTexture) return asphaltTexture;

  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // 1. Dark charcoal asphalt base
    ctx.fillStyle = '#1e2229';
    ctx.fillRect(0, 0, 256, 256);

    // 2. Fine aggregate grains
    for (let i = 0; i < 3500; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const tone = 25 + Math.floor(Math.random() * 28);
      ctx.fillStyle = `rgb(${tone}, ${tone + 1}, ${tone + 4})`;
      ctx.fillRect(x, y, 1.2, 1.2);
    }

    // 3. Medium subtle specks
    for (let i = 0; i < 700; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const gray = 42 + Math.floor(Math.random() * 25);
      ctx.fillStyle = `rgba(${gray}, ${gray + 2}, ${gray + 5}, 0.5)`;
      ctx.fillRect(x, y, 2.0, 2.0);
    }
  }

  asphaltTexture = new THREE.CanvasTexture(canvas);
  asphaltTexture.wrapS = THREE.RepeatWrapping;
  asphaltTexture.wrapT = THREE.RepeatWrapping;
  asphaltTexture.repeat.set(4, 4);
  return asphaltTexture;
}

/**
 * Generates a lightweight procedural concrete sidewalk texture with subtle paving joints
 */
export function getProceduralSidewalkTexture(): THREE.CanvasTexture {
  if (sidewalkTexture) return sidewalkTexture;

  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Light gray stone base
    ctx.fillStyle = '#dbe2ea';
    ctx.fillRect(0, 0, 128, 128);

    // Subtle paving grid groove
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 126, 126);

    // Subtle noise specks
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * 128;
      const y = Math.random() * 128;
      const val = 180 + Math.floor(Math.random() * 35);
      ctx.fillStyle = `rgba(${val}, ${val}, ${val}, 0.25)`;
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  }

  sidewalkTexture = new THREE.CanvasTexture(canvas);
  sidewalkTexture.wrapS = THREE.RepeatWrapping;
  sidewalkTexture.wrapT = THREE.RepeatWrapping;
  sidewalkTexture.repeat.set(2, 2);
  return sidewalkTexture;
}


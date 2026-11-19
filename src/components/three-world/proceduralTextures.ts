'use client';

import * as THREE from 'three';

let asphaltTexture: THREE.CanvasTexture | null = null;
let sidewalkTexture: THREE.CanvasTexture | null = null;

/**
 * Generates a lightweight procedural asphalt texture with subtle aggregate grain.
 * High-clarity, sunny slate-gray diorama asphalt (matches reference aesthetic).
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
    // 1. Medium Slate Gray Asphalt Base (clean, bright diorama asphalt)
    ctx.fillStyle = '#384353';
    ctx.fillRect(0, 0, 256, 256);

    // 2. Fine aggregate grains
    for (let i = 0; i < 3500; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const tone = 62 + Math.floor(Math.random() * 32);
      ctx.fillStyle = `rgb(${tone}, ${tone + 4}, ${tone + 10})`;
      ctx.fillRect(x, y, 1.2, 1.2);
    }

    // 3. Medium subtle aggregate specks
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const gray = 75 + Math.floor(Math.random() * 35);
      ctx.fillStyle = `rgba(${gray}, ${gray + 4}, ${gray + 12}, 0.55)`;
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
 * Generates a lightweight procedural concrete sidewalk texture with subtle paving joints.
 * Clean, bright architectural flagstone pavers (matches reference aesthetic).
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
    // Clean bright stone base
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, 128, 128);

    // Subtle paving grid groove
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 126, 126);

    // Subtle noise specks
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * 128;
      const y = Math.random() * 128;
      const val = 210 + Math.floor(Math.random() * 35);
      ctx.fillStyle = `rgba(${val}, ${val}, ${val}, 0.3)`;
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  }

  sidewalkTexture = new THREE.CanvasTexture(canvas);
  sidewalkTexture.wrapS = THREE.RepeatWrapping;
  sidewalkTexture.wrapT = THREE.RepeatWrapping;
  sidewalkTexture.repeat.set(2, 2);
  return sidewalkTexture;
}

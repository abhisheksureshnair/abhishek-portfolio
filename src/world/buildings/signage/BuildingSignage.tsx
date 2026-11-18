'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

const signageTextureCache = new Map<string, THREE.CanvasTexture>();

function createOffscreenCanvas(width: number, height: number): HTMLCanvasElement | null {
  if (typeof window === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function getSignageTexture(
  title: string,
  subtitle?: string,
  panelColor = '#181e29',
  titleColor = '#ffffff',
  subtitleColor = '#38bdf8',
  emissiveColor = '#38bdf8'
): THREE.CanvasTexture {
  const cacheKey = `${title}_${subtitle || ''}_${panelColor}_${titleColor}_${subtitleColor}_${emissiveColor}`;
  if (signageTextureCache.has(cacheKey)) {
    return signageTextureCache.get(cacheKey)!;
  }

  const canvasWidth = 1024;
  const canvasHeight = 256;
  const canvas = createOffscreenCanvas(canvasWidth, canvasHeight);
  if (!canvas) return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  const ctx = canvas.getContext('2d')!;

  // 1. Dark Architectural Mounting Face
  ctx.fillStyle = panelColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 2. Subtle Precision Grid / Brushed Texture
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  for (let x = 0; x < canvasWidth; x += 16) {
    ctx.fillRect(x, 0, 1, canvasHeight);
  }

  // 3. Thin Architectural Border Inset
  ctx.strokeStyle = emissiveColor;
  ctx.lineWidth = 4;
  ctx.strokeRect(12, 12, canvasWidth - 24, canvasHeight - 24);

  // Corner Accent Notches
  ctx.fillStyle = emissiveColor;
  const notch = 18;
  ctx.fillRect(10, 10, notch, 4);
  ctx.fillRect(10, 10, 4, notch);
  ctx.fillRect(canvasWidth - 10 - notch, 10, notch, 4);
  ctx.fillRect(canvasWidth - 14, 10, 4, notch);
  ctx.fillRect(10, canvasHeight - 14, notch, 4);
  ctx.fillRect(10, canvasHeight - 10 - notch, 4, notch);
  ctx.fillRect(canvasWidth - 10 - notch, canvasHeight - 14, notch, 4);
  ctx.fillRect(canvasWidth - 14, canvasHeight - 10 - notch, 4, notch);

  // 4. Primary Building Name Lettering
  const hasSubtitle = Boolean(subtitle && subtitle.trim().length > 0);
  const titleY = hasSubtitle ? 110 : 138;

  // Subtle glow drop shadow
  ctx.shadowColor = emissiveColor;
  ctx.shadowBlur = 14;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.fillStyle = titleColor;
  ctx.font = 'bold 64px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, canvasWidth / 2, titleY);

  // 5. Secondary Subtitle / Specialization Text
  if (hasSubtitle) {
    ctx.shadowBlur = 8;
    ctx.fillStyle = subtitleColor;
    ctx.font = 'bold 24px "Segoe UI", Arial, monospace';
    ctx.letterSpacing = '4px';
    ctx.fillText(subtitle!, canvasWidth / 2, 185);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  signageTextureCache.set(cacheKey, texture);
  return texture;
}

export interface BuildingSignageProps {
  title: string;
  subtitle?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  width?: number;
  height?: number;
  panelDepth?: number;
  panelColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  emissiveColor?: string;
  emissiveIntensity?: number;
  mountingStyle?: 'wall-panel' | 'canopy-fascia' | 'pylon-monument' | 'dimensional' | 'parapet-fascia';
  fontSize?: number;
  subtitleFontSize?: number;
  backlight?: boolean;
}

/**
 * Phase 2.3 Reusable Architectural Building Identification Signage System
 * 
 * Provides physically mounted dimensional lettering with realistic backing panels,
 * beveled architectural borders, crisp typography, and subtle LED backlighting.
 * 100% offline, zero network dependencies, zero Suspense stalls.
 */
export const BuildingSignage: React.FC<BuildingSignageProps> = ({
  title,
  subtitle,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  width = 5.6,
  height = 1.1,
  panelDepth = 0.08,
  panelColor = '#181e29',
  titleColor = '#ffffff',
  subtitleColor = '#38bdf8',
  emissiveColor = '#38bdf8',
  emissiveIntensity = 1.6,
  mountingStyle = 'wall-panel',
  backlight = true,
}) => {
  const signageTexture = useMemo(() => {
    return getSignageTexture(
      title,
      subtitle,
      panelColor,
      titleColor,
      subtitleColor,
      emissiveColor
    );
  }, [title, subtitle, panelColor, titleColor, subtitleColor, emissiveColor]);

  const signFaceMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#ffffff',
      map: signageTexture,
      roughness: 0.35,
      metalness: 0.20,
    });
  }, [signageTexture]);

  const panelHousingMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: panelColor,
      roughness: 0.45,
      metalness: 0.65,
    });
  }, [panelColor]);

  const trimMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.35,
      metalness: 0.85,
    });
  }, []);

  const backlightMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: emissiveColor,
      transparent: true,
      opacity: 0.35,
    });
  }, [emissiveColor]);

  const actualScale: [number, number, number] = Array.isArray(scale)
    ? scale
    : [scale, scale, scale];

  return (
    <group position={position} rotation={rotation} scale={actualScale}>
      {/* 1. Main Beveled Architectural Backing Box */}
      <mesh position={[0, 0, panelDepth / 2]} receiveShadow castShadow>
        <boxGeometry args={[width, height, panelDepth]} />
        <primitive object={panelHousingMaterial} attach="material" />
      </mesh>

      {/* 2. Architectural Perimeter Trim Frame */}
      <mesh position={[0, 0, panelDepth / 2]}>
        <boxGeometry args={[width + 0.06, height + 0.06, panelDepth * 0.9]} />
        <primitive object={trimMaterial} attach="material" />
      </mesh>

      {/* 3. High-Resolution Inscribed Signage Face Panel */}
      <mesh position={[0, 0, panelDepth + 0.005]}>
        <planeGeometry args={[width * 0.98, height * 0.92]} />
        <primitive object={signFaceMaterial} attach="material" />
      </mesh>

      {/* 4. Subtle Rear LED Backlight Halo Plate */}
      {backlight && (
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[width + 0.30, height + 0.25]} />
          <primitive object={backlightMaterial} attach="material" />
        </mesh>
      )}

      {/* 5. Top Architectural Metallic Light Fixture Trough */}
      <mesh position={[0, height / 2 + 0.02, panelDepth * 0.7]}>
        <boxGeometry args={[width - 0.2, 0.03, panelDepth * 0.6]} />
        <meshStandardMaterial
          color="#e2e8f0"
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity * 0.6}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
};

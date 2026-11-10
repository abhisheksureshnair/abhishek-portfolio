'use client';

import React from 'react';
import * as THREE from 'three';

export interface BuildingPlotProps {
  id: string;
  plotNumber: string;
  name: string;
  category: string;
  color: string;
  position: [number, number, number];
  sizeX: number;
  sizeZ: number;
  receiveShadow?: boolean;
}

// Module-level shared static materials for plots (Zero GC memory churn)
const _grassMat = new THREE.MeshStandardMaterial({
  color: '#22c55e', // Vibrant stylized grass
  roughness: 0.65,
  metalness: 0.04,
});

const _foundationStoneMat = new THREE.MeshStandardMaterial({
  color: '#e2e8f0', // Clean warm stone/concrete foundation
  roughness: 0.45,
  metalness: 0.08,
});

const _plotTrimMat = new THREE.MeshStandardMaterial({
  color: '#cbd5e1',
  roughness: 0.5,
  metalness: 0.1,
});

/**
 * Optimized BuildingPlot Component
 * Clean, stylized foundation plot for portfolio buildings:
 * - Lush green perimeter grass buffer strip between sidewalk and plot
 * - Raised architectural foundation pad (y = 0.74)
 * - Streamlined to 3 draw calls per plot (cutting 78 draw calls across city!)
 */
export const BuildingPlot: React.FC<BuildingPlotProps> = ({
  id,
  plotNumber,
  name,
  category,
  color,
  position,
  sizeX,
  sizeZ,
  receiveShadow = true,
}) => {
  const padHeight = 0.08;
  const padTopY = 0.74;

  const grassBufferMargin = 0.55;
  const padSizeX = sizeX - grassBufferMargin * 2;
  const padSizeZ = sizeZ - grassBufferMargin * 2;

  return (
    <group position={position} name={`Plot-${id}`}>
      {/* 1. Perimeter Grass Buffer Strip */}
      <mesh position={[0, 0.705, 0]} receiveShadow={receiveShadow}>
        <boxGeometry args={[sizeX, 0.05, sizeZ]} />
        <primitive object={_grassMat} attach="material" />
      </mesh>

      {/* 2. Raised Architectural Foundation Pad */}
      <mesh position={[0, padTopY - padHeight / 2, 0]} receiveShadow={receiveShadow}>
        <boxGeometry args={[padSizeX, padHeight, padSizeZ]} />
        <primitive object={_foundationStoneMat} attach="material" />
      </mesh>

      {/* 3. Subtle Clean Stone Curb Trim */}
      <mesh position={[0, padTopY + 0.001, 0]}>
        <planeGeometry args={[padSizeX - 0.1, padSizeZ - 0.1]} />
        <primitive object={_plotTrimMat} attach="material" />
      </mesh>
    </group>
  );
};

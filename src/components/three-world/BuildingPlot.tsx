'use client';

import React, { useMemo } from 'react';
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

/**
 * Reusable BuildingPlot Component
 * Renders a designated empty plot reserved for portfolio buildings:
 * - Lush green perimeter grass buffer strip between sidewalk and plot
 * - Raised architectural foundation pad (y = 0.74)
 * - Stylized lot corner brackets and colored accent border
 * - Central holographic plot marker ready for future building placement
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

  const grassBufferMargin = 0.6;
  const padSizeX = sizeX - grassBufferMargin * 2;
  const padSizeZ = sizeZ - grassBufferMargin * 2;

  const halfPadX = padSizeX / 2;
  const halfPadZ = padSizeZ / 2;

  // Corner bracket size
  const bracketLen = Math.min(1.2, padSizeX * 0.2);

  return (
    <group position={position} name={`Plot-${id}`}>
      {/* 1. Perimeter Grass Buffer Strip (fills the block between sidewalk and pad) */}
      <mesh position={[0, 0.705, 0]} receiveShadow={receiveShadow}>
        <boxGeometry args={[sizeX, 0.05, sizeZ]} />
        <meshStandardMaterial
          color="#38a169" // Vibrant stylized grass
          roughness={0.7}
          metalness={0.04}
        />
      </mesh>

      {/* 2. Raised Architectural Foundation Pad */}
      <mesh position={[0, padTopY - padHeight / 2, 0]} receiveShadow={receiveShadow}>
        <boxGeometry args={[padSizeX, padHeight, padSizeZ]} />
        <meshStandardMaterial
          color="#f8fafc" // Clean stone/concrete foundation
          roughness={0.4}
          metalness={0.08}
        />
      </mesh>

      {/* 3. Outer Plot Perimeter Trim in District Accent Color */}
      <mesh position={[0, padTopY + 0.002, 0]}>
        <planeGeometry args={[padSizeX, padSizeZ]} />
        <meshStandardMaterial
          color="#e2e8f0"
          roughness={0.5}
        />
      </mesh>

      {/* 4. Lot Boundary Line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, padTopY + 0.003, 0]}>
        <planeGeometry args={[padSizeX - 0.2, padSizeZ - 0.2]} />
        <meshStandardMaterial
          color="#f1f5f9"
          roughness={0.35}
        />
      </mesh>

      {/* 5. Four Corner Lot Brackets */}
      {[
        [-halfPadX + 0.1, -halfPadZ + 0.1],
        [halfPadX - 0.1, -halfPadZ + 0.1],
        [-halfPadX + 0.1, halfPadZ - 0.1],
        [halfPadX - 0.1, halfPadZ - 0.1],
      ].map(([cx, cz], idx) => (
        <group key={idx} position={[cx, padTopY + 0.004, cz]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.22, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      ))}

      {/* 6. Central Holographic Dais / Plot Reservation Badge */}
      <group position={[0, padTopY + 0.006, 0]}>
        {/* Outer subtle ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.65, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
          />
        </mesh>
        {/* Inner solid circular platform */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
          <circleGeometry args={[1.45, 32]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.3}
            metalness={0.4}
          />
        </mesh>
        {/* Central glowing district indicator */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
          <ringGeometry args={[0.4, 0.55, 6]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>
    </group>
  );
};


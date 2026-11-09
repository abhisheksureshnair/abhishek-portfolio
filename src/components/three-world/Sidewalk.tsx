'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getProceduralSidewalkTexture } from './proceduralTextures';

export interface SidewalkProps {
  position: [number, number, number];
  width: number;
  length: number;
  orientation?: 'z' | 'x';
  curbSide?: 'left' | 'right' | 'both' | 'none';
  receiveShadow?: boolean;
}

/**
 * Reusable Sidewalk Component
 * Renders a raised light-gray pedestrian sidewalk with:
 * - Raised concrete surface at y = 0.72 (0.10m curb height above road)
 * - Beveled curb edge drop facing the asphalt roadway
 * - Subtle procedural paving joints
 */
export const Sidewalk: React.FC<SidewalkProps> = ({
  position,
  width,
  length,
  orientation = 'z',
  curbSide = 'none',
  receiveShadow = true,
}) => {
  const sidewalkTex = useMemo(() => getProceduralSidewalkTexture(), []);

  const isXAxis = orientation === 'x';
  const rotationY = isXAxis ? Math.PI / 2 : 0;

  const curbHeight = 0.10;
  const sidewalkTopY = 0.72;
  const halfWidth = width / 2;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 1. Main Raised Sidewalk Slab */}
      <mesh position={[0, sidewalkTopY - curbHeight / 2, 0]} receiveShadow={receiveShadow}>
        <boxGeometry args={[width, curbHeight, length]} />
        <meshStandardMaterial
          map={sidewalkTex}
          color="#e2e8f0"
          roughness={0.55}
          metalness={0.06}
        />
      </mesh>

      {/* 2. Curb Stone Edge - Left */}
      {(curbSide === 'left' || curbSide === 'both') && (
        <mesh position={[-halfWidth + 0.04, sidewalkTopY - curbHeight / 2, 0]}>
          <boxGeometry args={[0.08, curbHeight + 0.005, length]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.65} metalness={0.08} />
        </mesh>
      )}

      {/* 3. Curb Stone Edge - Right */}
      {(curbSide === 'right' || curbSide === 'both') && (
        <mesh position={[halfWidth - 0.04, sidewalkTopY - curbHeight / 2, 0]}>
          <boxGeometry args={[0.08, curbHeight + 0.005, length]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.65} metalness={0.08} />
        </mesh>
      )}
    </group>
  );
};


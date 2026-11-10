'use client';

import React from 'react';
import * as THREE from 'three';
import { usePerformanceQuality } from '../PerformanceControl';

interface CityGroundProps {
  size?: number;
  onGroundClick?: (point: THREE.Vector3) => void;
}

/**
 * Reusable Stylized City Ground & Platform Foundation
 * Implements a high-quality 3D game diorama base:
 * - 60x60 lush green grass-like top surface with soft tactile response
 * - Slightly raised, multi-tiered architectural foundation base (pedestal / slab)
 * - Beveled curb edge border framing the miniature city
 * - Fully receives soft shadows from directional sun
 */
export const CityGround: React.FC<CityGroundProps> = ({ size = 60, onGroundClick }) => {
  const { effectiveTier } = usePerformanceQuality();
  const enableShadows = effectiveTier !== 'low';

  const halfSize = size / 2;
  const foundationHeight = 0.6;
  const groundTopY = foundationHeight / 2; // y = 0.3

  return (
    <group
      name="CityGround"
      position={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        // Ignore click if user was dragging/orbiting the mouse (Requirement 1 & 10)
        if (e.delta > 5) return;
        if (onGroundClick) {
          onGroundClick(e.point);
        }
      }}
    >
      {/* ======================================================== */}
      {/* 1. LOWER PEDESTAL BEDROCK SLAB                           */}
      {/* ======================================================== */}
      <mesh position={[0, -0.9, 0]} receiveShadow={enableShadows}>
        <boxGeometry args={[size + 2.0, 1.2, size + 2.0]} />
        <meshStandardMaterial
          color="#1e293b" // Deep slate foundation pedestal
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>

      {/* ======================================================== */}
      {/* 2. ARCHITECTURAL CURB / FOUNDATION BEVEL RIM             */}
      {/* ======================================================== */}
      <mesh position={[0, -0.15, 0]} receiveShadow={enableShadows}>
        <boxGeometry args={[size + 0.8, 0.5, size + 0.8]} />
        <meshStandardMaterial
          color="#f1f5f9" // Clean stone/concrete trim
          roughness={0.4}
          metalness={0.08}
        />
      </mesh>

      {/* ======================================================== */}
      {/* 3. MAIN 60x60 GREEN GRASS PLATFORM                      */}
      {/* ======================================================== */}
      <mesh position={[0, groundTopY, 0]} receiveShadow={enableShadows}>
        <boxGeometry args={[size, foundationHeight, size]} />
        <meshStandardMaterial
          color="#22c55e" // Stylized vibrant lush spring grass green
          roughness={0.65}
          metalness={0.04}
        />
      </mesh>

      {/* ======================================================== */}
      {/* 4. POLISHED INNER CURB BORDER TRIM                       */}
      {/* ======================================================== */}
      {/* Subtle recessed frame giving polished miniature game aesthetic */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, groundTopY + 0.301, 0]}
        receiveShadow={enableShadows}
      >
        <planeGeometry args={[size - 0.2, size - 0.2]} />
        <meshStandardMaterial
          color="#4ade80" // Lighter fresh spring grass center
          roughness={0.6}
          metalness={0.02}
        />
      </mesh>
    </group>
  );
};


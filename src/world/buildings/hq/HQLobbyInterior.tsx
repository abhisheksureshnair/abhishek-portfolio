import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getSharedHQMaterials } from './HQMaterials';

interface HQLobbyInteriorProps {
  position?: [number, number, number];
}

/**
 * Minimal visible double-height entrance lobby interior for Abhishek S Nair Developer HQ.
 * Directly visible through the 8.2m-tall clear glass curtain wall facade at [0, 0].
 * Reserves logical structural zones for future interactive interior phases:
 * - Reception / Welcome Counter
 * - Developer Introduction Atrium
 * - Elevator Core & Shaft
 * - Staircase Corridor
 */
export const HQLobbyInterior: React.FC<HQLobbyInteriorProps> = ({
  position = [0, 0, 0],
}) => {
  const materials = useMemo(() => getSharedHQMaterials(), []);

  return (
    <group position={position}>
      {/* 1. Polished Terrazzo / Charcoal Granite Lobby Floor */}
      <mesh position={[0, 0.21, 3.5]} receiveShadow>
        <boxGeometry args={[16.6, 0.02, 10.0]} />
        <primitive object={materials.terrazzoFloor} attach="material" />
      </mesh>

      {/* 2. Warm Vertical Oak Acoustic Slats Back Feature Wall (Matches Reference Photo 2) */}
      <mesh position={[0, 4.2, -1.4]} receiveShadow>
        <boxGeometry args={[16.6, 8.0, 0.24]} />
        <primitive object={materials.timberSlats} attach="material" />
      </mesh>

      {/* 3. Reception Desk (Minimalist Architectural Monolith with Illuminated Base) */}
      <group position={[0, 0.21, 2.8]}>
        {/* Main Reception Counter */}
        <mesh position={[0, 0.55, 0]} receiveShadow>
          <boxGeometry args={[3.8, 1.10, 0.90]} />
          <primitive object={materials.whiteLimestone} attach="material" />
        </mesh>

        {/* Brushed Stainless Steel Countertop */}
        <mesh position={[0, 1.12, 0]}>
          <boxGeometry args={[3.9, 0.04, 0.95]} />
          <primitive object={materials.stainlessSteel} attach="material" />
        </mesh>

        {/* Warm Undercounter LED Kickplate Glow */}
        <mesh position={[0, 0.05, 0.46]}>
          <boxGeometry args={[3.6, 0.08, 0.04]} />
          <primitive object={materials.canopyLettering} attach="material" />
        </mesh>
      </group>

      {/* 4. Elevator Core Logical Enclosure (East Wall Partition) */}
      <group position={[8.2, 4.2, 3.5]}>
        {/* Elevator Core Wall Partition */}
        <mesh receiveShadow>
          <boxGeometry args={[0.30, 8.0, 9.6]} />
          <primitive object={materials.warmConcrete} attach="material" />
        </mesh>

        {/* Dual Elevator Door Portal Surround */}
        <mesh position={[-0.16, -2.4, 0]}>
          <boxGeometry args={[0.04, 2.8, 4.4]} />
          <primitive object={materials.structuralFraming} attach="material" />
        </mesh>

        {/* Brushed Stainless Steel Elevator Doors */}
        <mesh position={[-0.17, -2.4, -1.0]}>
          <planeGeometry args={[1.6, 2.6]} />
          <primitive object={materials.stainlessSteel} attach="material" />
        </mesh>
        <mesh position={[-0.17, -2.4, 1.0]}>
          <planeGeometry args={[1.6, 2.6]} />
          <primitive object={materials.stainlessSteel} attach="material" />
        </mesh>

        {/* Elevator Call Status Displays */}
        <mesh position={[-0.18, -0.85, 0]}>
          <boxGeometry args={[0.02, 0.25, 0.35]} />
          <primitive object={materials.canopyLettering} attach="material" />
        </mesh>
      </group>

      {/* 5. Staircase & Service Shaft Logical Enclosure (West Wall Partition) */}
      <mesh position={[-8.2, 4.2, 3.5]} receiveShadow>
        <boxGeometry args={[0.30, 8.0, 9.6]} />
        <primitive object={materials.warmConcrete} attach="material" />
      </mesh>

      {/* 6. Structural Interior Pilotis Columns (Stainless Steel Cylinders) */}
      <mesh position={[-4.5, 4.2, 4.5]} receiveShadow>
        <cylinderGeometry args={[0.32, 0.32, 8.0, 16]} />
        <primitive object={materials.stainlessSteel} attach="material" />
      </mesh>
      <mesh position={[4.5, 4.2, 4.5]} receiveShadow>
        <cylinderGeometry args={[0.32, 0.32, 8.0, 16]} />
        <primitive object={materials.stainlessSteel} attach="material" />
      </mesh>

      {/* 7. Double-Height Acoustic Ceiling Plane */}
      <mesh position={[0, 8.15, 3.5]}>
        <boxGeometry args={[16.6, 0.15, 10.0]} />
        <primitive object={materials.structuralFraming} attach="material" />
      </mesh>

      {/* 8. Warm Architectural Hospitality Interior Illumination (2800K) */}
      <pointLight
        color="#fef3c7"
        intensity={2.8}
        distance={14.0}
        position={[0, 6.0, 3.5]}
      />
    </group>
  );
};

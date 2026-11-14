'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Shared Materials for Trees & Flora
const _trunkMat = new THREE.MeshStandardMaterial({
  color: '#422a1d',
  roughness: 0.9,
  metalness: 0.05,
});

const _leafMatDeep = new THREE.MeshStandardMaterial({
  color: '#14532d',
  roughness: 0.65,
  metalness: 0.05,
});

const _leafMatVibrant = new THREE.MeshStandardMaterial({
  color: '#15803d',
  roughness: 0.6,
  metalness: 0.05,
});

const _leafMatMaple = new THREE.MeshStandardMaterial({
  color: '#991b1b',
  roughness: 0.65,
  metalness: 0.05,
});

const _flowerBushMat = new THREE.MeshStandardMaterial({
  color: '#166534',
  roughness: 0.7,
});

const _flowerPetalMat = new THREE.MeshStandardMaterial({
  color: '#f43f5e',
  roughness: 0.4,
});

const _treePitMat = new THREE.MeshStandardMaterial({
  color: '#27272a',
  roughness: 0.85,
});

const _soilMat = new THREE.MeshStandardMaterial({
  color: '#291e17',
  roughness: 0.95,
});

/**
 * Realistic Deciduous Tree (Oak / Elm)
 * Multi-layer volumetric organic canopy with branch forks and subtle wind sway
 */
function RealisticTree({
  position,
  scale = 1,
  type = 'oak',
}: {
  position: [number, number, number];
  scale?: number;
  type?: 'oak' | 'maple';
}) {
  const canopyRef = useRef<THREE.Group>(null);
  const leafMat = type === 'maple' ? _leafMatMaple : _leafMatVibrant;

  useFrame((_, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    if (canopyRef.current) {
      const time = performance.now() * 0.0015;
      canopyRef.current.rotation.z = Math.sin(time + position[0] * 0.5) * 0.035;
      canopyRef.current.rotation.x = Math.cos(time + position[2] * 0.5) * 0.025;
    }
  });

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Stone-Bordered Sidewalk Tree Pit with Soil */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[1.5, 0.06, 1.5]} />
        <primitive object={_treePitMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[1.2, 0.04, 1.2]} />
        <primitive object={_soilMat} attach="material" />
      </mesh>

      {/* Main Trunk (Tapered) */}
      <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.13, 0.22, 2.6, 8]} />
        <primitive object={_trunkMat} attach="material" />
      </mesh>

      {/* Secondary Branch Forks */}
      <mesh position={[0.2, 2.2, 0]} rotation={[0, 0, -0.45]} castShadow>
        <cylinderGeometry args={[0.07, 0.12, 1.1, 6]} />
        <primitive object={_trunkMat} attach="material" />
      </mesh>
      <mesh position={[-0.18, 2.3, 0.12]} rotation={[0.35, 0, 0.4]} castShadow>
        <cylinderGeometry args={[0.06, 0.1, 1.0, 6]} />
        <primitive object={_trunkMat} attach="material" />
      </mesh>

      {/* Volumetric Organic Leaf Clusters with Wind Sway */}
      <group ref={canopyRef} position={[0, 2.9, 0]}>
        {/* Core Center Cluster */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <sphereGeometry args={[1.15, 12, 12]} />
          <primitive object={leafMat} attach="material" />
        </mesh>
        {/* Upper Crown */}
        <mesh position={[0.15, 1.1, -0.1]} castShadow>
          <sphereGeometry args={[0.85, 10, 10]} />
          <primitive object={_leafMatDeep} attach="material" />
        </mesh>
        {/* Left Side Canopy */}
        <mesh position={[-0.65, 0.2, 0.35]} castShadow>
          <sphereGeometry args={[0.78, 10, 10]} />
          <primitive object={leafMat} attach="material" />
        </mesh>
        {/* Right Side Canopy */}
        <mesh position={[0.7, 0.3, -0.25]} castShadow>
          <sphereGeometry args={[0.82, 10, 10]} />
          <primitive object={_leafMatDeep} attach="material" />
        </mesh>
        {/* Front Canopy */}
        <mesh position={[0.1, 0.1, 0.7]} castShadow>
          <sphereGeometry args={[0.75, 10, 10]} />
          <primitive object={leafMat} attach="material" />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Landscaped Flowering Hedge Shrubbery
 */
function LandscapedHedge({ position, width = 2.4 }: { position: [number, number, number]; width?: number }) {
  return (
    <group position={position}>
      {/* Stone Planter Base */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.2, 0.3, 0.8]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>
      {/* Dense Green Hedge */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[width, 0.5, 0.6]} />
        <primitive object={_flowerBushMat} attach="material" />
      </mesh>
      {/* Flower Accents */}
      <mesh position={[-width * 0.3, 0.7, 0.15]} castShadow>
        <sphereGeometry args={[0.08, 8, 8]} />
        <primitive object={_flowerPetalMat} attach="material" />
      </mesh>
      <mesh position={[width * 0.25, 0.68, -0.1]} castShadow>
        <sphereGeometry args={[0.09, 8, 8]} />
        <primitive object={_flowerPetalMat} attach="material" />
      </mesh>
    </group>
  );
}

export const RealisticNature: React.FC = () => {
  // Tree placements along major boulevards, avenues, and park zones
  const trees = useMemo(() => {
    return [
      // North-South Boulevard Avenues (Street Trees)
      { pos: [-4.2, 0.72, -18] as [number, number, number], s: 1.05, type: 'oak' as const },
      { pos: [-4.2, 0.72, -11] as [number, number, number], s: 0.95, type: 'oak' as const },
      { pos: [-4.2, 0.72, 11] as [number, number, number], s: 1.0, type: 'oak' as const },
      { pos: [-4.2, 0.72, 18] as [number, number, number], s: 1.1, type: 'maple' as const },

      { pos: [4.2, 0.72, -18] as [number, number, number], s: 1.0, type: 'oak' as const },
      { pos: [4.2, 0.72, -11] as [number, number, number], s: 1.1, type: 'maple' as const },
      { pos: [4.2, 0.72, 11] as [number, number, number], s: 0.95, type: 'oak' as const },
      { pos: [4.2, 0.72, 18] as [number, number, number], s: 1.05, type: 'oak' as const },

      // Cross Boulevard Trees (East-West)
      { pos: [-18, 0.72, -4.2] as [number, number, number], s: 1.0, type: 'maple' as const },
      { pos: [-11, 0.72, -4.2] as [number, number, number], s: 1.05, type: 'oak' as const },
      { pos: [11, 0.72, -4.2] as [number, number, number], s: 1.0, type: 'oak' as const },
      { pos: [18, 0.72, -4.2] as [number, number, number], s: 1.15, type: 'maple' as const },

      { pos: [-18, 0.72, 4.2] as [number, number, number], s: 1.05, type: 'oak' as const },
      { pos: [-11, 0.72, 4.2] as [number, number, number], s: 1.0, type: 'oak' as const },
      { pos: [11, 0.72, 4.2] as [number, number, number], s: 1.1, type: 'maple' as const },
      { pos: [18, 0.72, 4.2] as [number, number, number], s: 1.0, type: 'oak' as const },

      // Central Plaza Park Trees
      { pos: [1.8, 0.72, -1.8] as [number, number, number], s: 1.1, type: 'maple' as const },
      { pos: [6.2, 0.72, -6.2] as [number, number, number], s: 1.15, type: 'oak' as const },
      { pos: [6.2, 0.72, -1.8] as [number, number, number], s: 0.95, type: 'oak' as const },
      { pos: [1.8, 0.72, -6.2] as [number, number, number], s: 1.0, type: 'maple' as const },
    ];
  }, []);

  const hedges = useMemo(() => {
    return [
      { pos: [-7.85, 0.74, -3.2] as [number, number, number], w: 3.2 },
      { pos: [7.85, 0.74, -3.2] as [number, number, number], w: 3.2 },
      { pos: [-7.85, 0.74, 3.2] as [number, number, number], w: 3.2 },
      { pos: [7.85, 0.74, 3.2] as [number, number, number], w: 3.2 },
    ];
  }, []);

  return (
    <group>
      {/* Deciduous and Maple Trees */}
      {trees.map((t, i) => (
        <RealisticTree key={`tree-${i}`} position={t.pos} scale={t.s} type={t.type} />
      ))}

      {/* Plaza & Building Frontage Landscaped Hedges */}
      {hedges.map((h, i) => (
        <LandscapedHedge key={`hedge-${i}`} position={h.pos} width={h.w} />
      ))}
    </group>
  );
};

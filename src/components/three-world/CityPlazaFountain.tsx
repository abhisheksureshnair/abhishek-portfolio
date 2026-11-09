'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface CityPlazaFountainProps {
  position?: [number, number, number];
}

/**
 * CityPlazaFountain Component
 * Small stylized animated plaza fountain:
 * - Tiered circular stone basin
 * - Concentric water pools with turquoise crystal water
 * - Center bubbling water spout
 * - Frame-rate independent water ripples and spray animation
 */
export const CityPlazaFountain: React.FC<CityPlazaFountainProps> = ({
  position = [3.85, 0.74, -3.85],
}) => {
  const waterRippleRef1 = useRef<THREE.Mesh>(null);
  const waterRippleRef2 = useRef<THREE.Mesh>(null);
  const waterSpoutRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const time = Date.now() * 0.001;

    // Animate water ripple scale and rotation
    if (waterRippleRef1.current) {
      waterRippleRef1.current.rotation.z += delta * 0.6;
      const s = 1.0 + Math.sin(time * 3.0) * 0.06;
      waterRippleRef1.current.scale.set(s, s, 1);
    }

    if (waterRippleRef2.current) {
      waterRippleRef2.current.rotation.z -= delta * 0.8;
      const s = 1.0 + Math.cos(time * 2.5) * 0.08;
      waterRippleRef2.current.scale.set(s, s, 1);
    }

    // Bubbling water spout oscillation
    if (waterSpoutRef.current) {
      waterSpoutRef.current.scale.y = 1.0 + Math.sin(time * 6.0) * 0.15;
    }
  });

  return (
    <group position={position} name="PlazaFountain">
      {/* 1. Outer Stone Basin */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.35, 0.3, 24]} />
        <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Basin Outer Rim Lip */}
      <mesh position={[0, 0.32, 0]}>
        <torusGeometry args={[1.2, 0.08, 8, 24]} />
        <meshStandardMaterial color="#475569" roughness={0.5} />
      </mesh>

      {/* 2. Lower Water Pool */}
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[1.15, 1.15, 0.05, 24]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#0284c7"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Ripple Rings */}
      <mesh ref={waterRippleRef1} position={[0, 0.29, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.58, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
      </mesh>
      <mesh ref={waterRippleRef2} position={[0, 0.295, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 0.86, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
      </mesh>

      {/* 3. Middle Tier Pedestal */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.35, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.3} />
      </mesh>

      {/* Middle Tier Water Bowl */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.25, 0.18, 20]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.56, 0.56, 0.04, 20]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#00f0ff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 4. Top Bubbling Water Jet / Spray */}
      <mesh ref={waterSpoutRef} position={[0, 0.86, 0]}>
        <coneGeometry args={[0.16, 0.35, 12]} />
        <meshStandardMaterial
          color="#e0f2fe"
          emissive="#38bdf8"
          emissiveIntensity={1.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Soft Underwater Glow */}
      <pointLight position={[0, 0.6, 0]} color="#38bdf8" intensity={0.9} distance={3.0} />
    </group>
  );
};


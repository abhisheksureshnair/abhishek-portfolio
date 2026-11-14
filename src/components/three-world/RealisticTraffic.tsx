'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TimeOfDay } from './AtmosphericWeatherSystem';

interface RealisticTrafficProps {
  timeOfDay?: TimeOfDay;
}

// Shared PBR materials for vehicles
const _carGlassMat = new THREE.MeshPhysicalMaterial({
  color: '#0f172a',
  transmission: 0.75,
  opacity: 1,
  transparent: true,
  roughness: 0.05,
  metalness: 0.1,
  ior: 1.52,
});

const _wheelTireMat = new THREE.MeshStandardMaterial({
  color: '#18181b',
  roughness: 0.85,
});

const _wheelRimMat = new THREE.MeshStandardMaterial({
  color: '#cbd5e1',
  metalness: 0.9,
  roughness: 0.2,
});

const _headlightMatDay = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.2 });
const _headlightMatNight = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  emissive: '#fef08a',
  emissiveIntensity: 3.5,
});

const _taillightMatNight = new THREE.MeshStandardMaterial({
  color: '#ef4444',
  emissive: '#dc2626',
  emissiveIntensity: 2.8,
});

/**
 * Detailed Modern Sedan Vehicle Model
 */
function ModernSedan({
  bodyColor = '#3b82f6',
  isNight = false,
}: {
  bodyColor?: string;
  isNight?: boolean;
}) {
  const bodyMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: bodyColor,
      metalness: 0.82,
      roughness: 0.22,
    });
  }, [bodyColor]);

  return (
    <group>
      {/* Lower Chassis */}
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[1.7, 0.45, 3.8]} />
        <primitive object={bodyMat} attach="material" />
      </mesh>

      {/* Cabin & Roof Greenhouse */}
      <mesh position={[0, 0.72, -0.2]} castShadow>
        <boxGeometry args={[1.42, 0.44, 2.1]} />
        <primitive object={_carGlassMat} attach="material" />
      </mesh>
      {/* Roof Cap */}
      <mesh position={[0, 0.96, -0.2]} castShadow>
        <boxGeometry args={[1.36, 0.06, 1.85]} />
        <primitive object={bodyMat} attach="material" />
      </mesh>

      {/* 4 Wheels (Tires & Alloy Rims) */}
      {/* Front Left */}
      <mesh position={[-0.88, 0.24, 1.15]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.2, 12]} />
        <primitive object={_wheelTireMat} attach="material" />
      </mesh>
      {/* Front Right */}
      <mesh position={[0.88, 0.24, 1.15]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.2, 12]} />
        <primitive object={_wheelTireMat} attach="material" />
      </mesh>
      {/* Rear Left */}
      <mesh position={[-0.88, 0.24, -1.15]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.2, 12]} />
        <primitive object={_wheelTireMat} attach="material" />
      </mesh>
      {/* Rear Right */}
      <mesh position={[0.88, 0.24, -1.15]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.2, 12]} />
        <primitive object={_wheelTireMat} attach="material" />
      </mesh>

      {/* LED Headlights (Front Z = +1.9) */}
      <mesh position={[-0.62, 0.38, 1.91]}>
        <boxGeometry args={[0.28, 0.12, 0.04]} />
        <primitive object={isNight ? _headlightMatNight : _headlightMatDay} attach="material" />
      </mesh>
      <mesh position={[0.62, 0.38, 1.91]}>
        <boxGeometry args={[0.28, 0.12, 0.04]} />
        <primitive object={isNight ? _headlightMatNight : _headlightMatDay} attach="material" />
      </mesh>

      {/* LED Taillights (Rear Z = -1.9) */}
      <mesh position={[-0.62, 0.42, -1.91]}>
        <boxGeometry args={[0.32, 0.1, 0.04]} />
        <primitive object={isNight ? _taillightMatNight : _carGlassMat} attach="material" />
      </mesh>
      <mesh position={[0.62, 0.42, -1.91]}>
        <boxGeometry args={[0.32, 0.1, 0.04]} />
        <primitive object={isNight ? _taillightMatNight : _carGlassMat} attach="material" />
      </mesh>

      {/* Night Headlight Beams */}
      {isNight && (
        <group position={[0, 0.38, 2.2]}>
          <spotLight
            color="#fef08a"
            intensity={3.2}
            angle={0.45}
            penumbra={0.5}
            distance={16}
            target-position={[0, 0, 10]}
          />
        </group>
      )}
    </group>
  );
}

/**
 * City Transit Metro Bus
 */
function ModernCityBus({ isNight = false }: { isNight?: boolean }) {
  const busMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#0284c7',
      metalness: 0.6,
      roughness: 0.35,
    });
  }, []);

  return (
    <group>
      {/* Bus Body */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[2.1, 1.5, 6.8]} />
        <primitive object={busMat} attach="material" />
      </mesh>
      {/* Windshield & Windows */}
      <mesh position={[0, 0.95, 0.1]}>
        <boxGeometry args={[2.14, 0.75, 6.2]} />
        <primitive object={_carGlassMat} attach="material" />
      </mesh>
      {/* Headlights */}
      <mesh position={[-0.75, 0.45, 3.42]}>
        <boxGeometry args={[0.35, 0.18, 0.05]} />
        <primitive object={isNight ? _headlightMatNight : _headlightMatDay} attach="material" />
      </mesh>
      <mesh position={[0.75, 0.45, 3.42]}>
        <boxGeometry args={[0.35, 0.18, 0.05]} />
        <primitive object={isNight ? _headlightMatNight : _headlightMatDay} attach="material" />
      </mesh>
      {/* Wheels */}
      <mesh position={[-1.08, 0.36, 2.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.24, 12]} />
        <primitive object={_wheelTireMat} attach="material" />
      </mesh>
      <mesh position={[1.08, 0.36, 2.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.24, 12]} />
        <primitive object={_wheelTireMat} attach="material" />
      </mesh>
      <mesh position={[-1.08, 0.36, -2.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.24, 12]} />
        <primitive object={_wheelTireMat} attach="material" />
      </mesh>
      <mesh position={[1.08, 0.36, -2.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.24, 12]} />
        <primitive object={_wheelTireMat} attach="material" />
      </mesh>
    </group>
  );
}

export const RealisticTraffic: React.FC<RealisticTrafficProps> = ({
  timeOfDay = 'day',
}) => {
  const isNight = timeOfDay === 'night';

  const v1Ref = useRef<THREE.Group>(null);
  const v2Ref = useRef<THREE.Group>(null);
  const v3Ref = useRef<THREE.Group>(null);
  const busRef = useRef<THREE.Group>(null);

  // Animated vehicle progress along roads
  useFrame((_, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    const dt = Math.min(delta, 0.1);

    // Vehicle 1: Northbound on Avenue (X = 1.4, Z moves -28 -> +28)
    if (v1Ref.current) {
      v1Ref.current.position.z += dt * 8.5;
      if (v1Ref.current.position.z > 28) {
        v1Ref.current.position.z = -28;
      }
    }

    // Vehicle 2: Southbound on Avenue (X = -1.4, Z moves +28 -> -28)
    if (v2Ref.current) {
      v2Ref.current.position.z -= dt * 7.8;
      if (v2Ref.current.position.z < -28) {
        v2Ref.current.position.z = 28;
      }
    }

    // Vehicle 3: Eastbound on Boulevard (Z = 1.4, X moves -28 -> +28)
    if (v3Ref.current) {
      v3Ref.current.position.x += dt * 9.2;
      if (v3Ref.current.position.x > 28) {
        v3Ref.current.position.x = -28;
      }
    }

    // City Bus: Westbound on Boulevard (Z = -1.4, X moves +28 -> -28)
    if (busRef.current) {
      busRef.current.position.x -= dt * 6.5;
      if (busRef.current.position.x < -28) {
        busRef.current.position.x = 28;
      }
    }
  });

  return (
    <group position={[0, 0.62, 0]}>
      {/* Vehicle 1: Blue Modern Sedan (Northbound) */}
      <group ref={v1Ref} position={[1.4, 0, -20]} rotation={[0, 0, 0]}>
        <ModernSedan bodyColor="#2563eb" isNight={isNight} />
      </group>

      {/* Vehicle 2: Obsidian Dark SUV (Southbound) */}
      <group ref={v2Ref} position={[-1.4, 0, 18]} rotation={[0, Math.PI, 0]}>
        <ModernSedan bodyColor="#18181b" isNight={isNight} />
      </group>

      {/* Vehicle 3: Crimson Sport Sedan (Eastbound) */}
      <group ref={v3Ref} position={[-18, 0, 1.4]} rotation={[0, Math.PI / 2, 0]}>
        <ModernSedan bodyColor="#dc2626" isNight={isNight} />
      </group>

      {/* Vehicle 4: City Transit Metro Bus (Westbound) */}
      <group ref={busRef} position={[22, 0, -1.4]} rotation={[0, -Math.PI / 2, 0]}>
        <ModernCityBus isNight={isNight} />
      </group>
    </group>
  );
};

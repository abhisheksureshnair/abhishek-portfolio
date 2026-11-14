'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getRealisticAsphaltTexture, getRealisticSidewalkTexture } from './realisticCityTextures';
import { TimeOfDay } from './AtmosphericWeatherSystem';

interface RealisticStreetsProps {
  timeOfDay?: TimeOfDay;
  onRoadClick?: (point: THREE.Vector3) => void;
}

// Shared PBR Materials
const _roadMarkingMat = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  roughness: 0.3,
  metalness: 0.1,
  emissive: '#ffffff',
  emissiveIntensity: 0.12,
});

const _yellowMarkingMat = new THREE.MeshStandardMaterial({
  color: '#facc15',
  roughness: 0.35,
  metalness: 0.1,
});

const _curbMat = new THREE.MeshStandardMaterial({
  color: '#64748b',
  roughness: 0.8,
  metalness: 0.1,
});

const _steelMat = new THREE.MeshStandardMaterial({
  color: '#334155',
  metalness: 0.85,
  roughness: 0.25,
});

const _woodBenchMat = new THREE.MeshStandardMaterial({
  color: '#78350f',
  roughness: 0.7,
});

const _drainMat = new THREE.MeshStandardMaterial({
  color: '#1e293b',
  metalness: 0.9,
  roughness: 0.4,
});

/**
 * Modern LED Streetlamp with Night Illumination Cone
 */
function ModernStreetlight({
  position,
  rotationY = 0,
  isNight = false,
}: {
  position: [number, number, number];
  rotationY?: number;
  isNight?: boolean;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Base Flange */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 0.2, 8]} />
        <primitive object={_steelMat} attach="material" />
      </mesh>

      {/* Main Mast (Tapered 4.2m) */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 4.2, 8]} />
        <primitive object={_steelMat} attach="material" />
      </mesh>

      {/* Curved Overhead Arm */}
      <mesh position={[0.45, 4.25, 0]} rotation={[0, 0, -0.25]} castShadow>
        <boxGeometry args={[1.0, 0.05, 0.07]} />
        <primitive object={_steelMat} attach="material" />
      </mesh>

      {/* Sleek LED Fixture Head */}
      <mesh position={[0.95, 4.12, 0]} castShadow>
        <boxGeometry args={[0.45, 0.08, 0.18]} />
        <primitive object={_steelMat} attach="material" />
      </mesh>

      {/* Luminous LED Panel */}
      <mesh position={[0.95, 4.07, 0]}>
        <boxGeometry args={[0.4, 0.02, 0.15]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#fde047"
          emissiveIntensity={isNight ? 3.5 : 0.8}
        />
      </mesh>

      {/* Night Street Light Beam */}
      {isNight && (
        <pointLight
          position={[0.95, 3.8, 0]}
          color="#fef08a"
          intensity={2.8}
          distance={14}
          decay={2}
        />
      )}
    </group>
  );
}

/**
 * Modern Architectural Park Bench
 */
function ModernParkBench({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Steel End Legs */}
      <mesh position={[-0.85, 0.22, 0]} castShadow>
        <boxGeometry args={[0.06, 0.44, 0.45]} />
        <primitive object={_steelMat} attach="material" />
      </mesh>
      <mesh position={[0.85, 0.22, 0]} castShadow>
        <boxGeometry args={[0.06, 0.44, 0.45]} />
        <primitive object={_steelMat} attach="material" />
      </mesh>
      {/* Wooden Slats (Seat) */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[1.76, 0.04, 0.42]} />
        <primitive object={_woodBenchMat} attach="material" />
      </mesh>
      {/* Wooden Slats (Backrest) */}
      <mesh position={[0, 0.65, -0.19]} rotation={[0.15, 0, 0]} castShadow>
        <boxGeometry args={[1.76, 0.32, 0.04]} />
        <primitive object={_woodBenchMat} attach="material" />
      </mesh>
    </group>
  );
}

/**
 * Modern Transit / Bus Stop Shelter
 */
function ModernBusShelter({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Steel Frame Pillars */}
      <mesh position={[-1.6, 1.4, -0.6]} castShadow>
        <boxGeometry args={[0.08, 2.8, 0.08]} />
        <primitive object={_steelMat} attach="material" />
      </mesh>
      <mesh position={[1.6, 1.4, -0.6]} castShadow>
        <boxGeometry args={[0.08, 2.8, 0.08]} />
        <primitive object={_steelMat} attach="material" />
      </mesh>
      {/* Glass Back Panel */}
      <mesh position={[0, 1.4, -0.6]}>
        <boxGeometry args={[3.1, 2.6, 0.04]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          transmission={0.85}
          opacity={1}
          transparent
          roughness={0.1}
          metalness={0.1}
          ior={1.5}
        />
      </mesh>
      {/* Cantilevered Roof Canopy */}
      <mesh position={[0, 2.8, 0.1]} castShadow>
        <boxGeometry args={[3.4, 0.1, 1.5]} />
        <primitive object={_steelMat} attach="material" />
      </mesh>
      {/* Shelter Bench */}
      <mesh position={[0, 0.45, -0.35]} castShadow>
        <boxGeometry args={[2.4, 0.06, 0.35]} />
        <primitive object={_woodBenchMat} attach="material" />
      </mesh>
    </group>
  );
}

/**
 * Zebra Pedestrian Crossing Markings
 */
function ZebraCrossing({ position, isHorizontal = false }: { position: [number, number, number]; isHorizontal?: boolean }) {
  const stripes = useMemo(() => {
    return [-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8];
  }, []);

  return (
    <group position={position} rotation={[0, isHorizontal ? Math.PI / 2 : 0, 0]}>
      {stripes.map((offset, i) => (
        <mesh key={i} position={[offset, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.38, 2.4]} />
          <primitive object={_roadMarkingMat} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

export const RealisticStreets: React.FC<RealisticStreetsProps> = ({
  timeOfDay = 'day',
  onRoadClick,
}) => {
  const isNight = timeOfDay === 'night';
  const asphaltTexture = useMemo(() => getRealisticAsphaltTexture(), []);
  const sidewalkTexture = useMemo(() => getRealisticSidewalkTexture(), []);

  // Road surface material
  const roadMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: asphaltTexture,
      roughness: 0.75,
      metalness: 0.12,
    });
  }, [asphaltTexture]);

  // Sidewalk material
  const sidewalkMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: sidewalkTexture,
      roughness: 0.7,
      metalness: 0.08,
    });
  }, [sidewalkTexture]);

  return (
    <group>
      {/* ======================================================== */}
      {/* 1. ASPHALT ROADWAYS (Main Arterials & Cross Boulevards)  */}
      {/* ======================================================== */}
      
      {/* North-South Arterial Avenue (X = 0, Width 5.8m, Length 60m) */}
      <mesh
        position={[0, 0.62, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={roadMat}
        onClick={(e) => {
          e.stopPropagation();
          onRoadClick?.(e.point);
        }}
      >
        <planeGeometry args={[5.8, 60]} />
      </mesh>

      {/* East-West Cross Boulevard (Z = 0, Width 5.8m, Length 60m) */}
      <mesh
        position={[0, 0.62, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={roadMat}
        onClick={(e) => {
          e.stopPropagation();
          onRoadClick?.(e.point);
        }}
      >
        <planeGeometry args={[60, 5.8]} />
      </mesh>

      {/* Double Solid Yellow Center Line (North-South) */}
      <mesh position={[-0.08, 0.625, -16]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 24]} />
        <primitive object={_yellowMarkingMat} attach="material" />
      </mesh>
      <mesh position={[0.08, 0.625, -16]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 24]} />
        <primitive object={_yellowMarkingMat} attach="material" />
      </mesh>
      <mesh position={[-0.08, 0.625, 16]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 24]} />
        <primitive object={_yellowMarkingMat} attach="material" />
      </mesh>
      <mesh position={[0.08, 0.625, 16]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 24]} />
        <primitive object={_yellowMarkingMat} attach="material" />
      </mesh>

      {/* Double Solid Yellow Center Line (East-West) */}
      <mesh position={[-16, 0.625, -0.08]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[0.08, 24]} />
        <primitive object={_yellowMarkingMat} attach="material" />
      </mesh>
      <mesh position={[-16, 0.625, 0.08]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[0.08, 24]} />
        <primitive object={_yellowMarkingMat} attach="material" />
      </mesh>
      <mesh position={[16, 0.625, -0.08]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[0.08, 24]} />
        <primitive object={_yellowMarkingMat} attach="material" />
      </mesh>
      <mesh position={[16, 0.625, 0.08]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[0.08, 24]} />
        <primitive object={_yellowMarkingMat} attach="material" />
      </mesh>

      {/* Zebra Pedestrian Crossings at Central Intersection */}
      <ZebraCrossing position={[0, 0.626, -3.8]} />
      <ZebraCrossing position={[0, 0.626, 3.8]} />
      <ZebraCrossing position={[-3.8, 0.626, 0]} isHorizontal />
      <ZebraCrossing position={[3.8, 0.626, 0]} isHorizontal />

      {/* Gutter Storm Drain Grates */}
      <mesh position={[-2.75, 0.624, -4.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 0.7]} />
        <primitive object={_drainMat} attach="material" />
      </mesh>
      <mesh position={[2.75, 0.624, -4.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 0.7]} />
        <primitive object={_drainMat} attach="material" />
      </mesh>
      <mesh position={[-2.75, 0.624, 4.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 0.7]} />
        <primitive object={_drainMat} attach="material" />
      </mesh>
      <mesh position={[2.75, 0.624, 4.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 0.7]} />
        <primitive object={_drainMat} attach="material" />
      </mesh>

      {/* ======================================================== */}
      {/* 2. RAISED SIDEWALKS & GRANITE CURBS (0.12m Step Up)      */}
      {/* ======================================================== */}
      
      {/* North-South Curbs */}
      <mesh position={[-3.0, 0.68, 0]} receiveShadow>
        <boxGeometry args={[0.2, 0.12, 60]} />
        <primitive object={_curbMat} attach="material" />
      </mesh>
      <mesh position={[3.0, 0.68, 0]} receiveShadow>
        <boxGeometry args={[0.2, 0.12, 60]} />
        <primitive object={_curbMat} attach="material" />
      </mesh>

      {/* East-West Curbs */}
      <mesh position={[0, 0.68, -3.0]} receiveShadow>
        <boxGeometry args={[60, 0.12, 0.2]} />
        <primitive object={_curbMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.68, 3.0]} receiveShadow>
        <boxGeometry args={[60, 0.12, 0.2]} />
        <primitive object={_curbMat} attach="material" />
      </mesh>

      {/* Sidewalk Paving Surface (Planes at Y = 0.74m) */}
      <mesh
        position={[-4.2, 0.74, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={sidewalkMat}
        onClick={(e) => {
          e.stopPropagation();
          onRoadClick?.(e.point);
        }}
      >
        <planeGeometry args={[2.2, 60]} />
      </mesh>
      <mesh
        position={[4.2, 0.74, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={sidewalkMat}
        onClick={(e) => {
          e.stopPropagation();
          onRoadClick?.(e.point);
        }}
      >
        <planeGeometry args={[2.2, 60]} />
      </mesh>

      {/* ======================================================== */}
      {/* 3. STREETLIGHTS & STREET FURNITURE                       */}
      {/* ======================================================== */}
      
      {/* Modern Curved LED Streetlights along Boulevards */}
      <ModernStreetlight position={[-3.6, 0.74, -14]} rotationY={Math.PI / 2} isNight={isNight} />
      <ModernStreetlight position={[-3.6, 0.74, 14]} rotationY={Math.PI / 2} isNight={isNight} />
      <ModernStreetlight position={[3.6, 0.74, -14]} rotationY={-Math.PI / 2} isNight={isNight} />
      <ModernStreetlight position={[3.6, 0.74, 14]} rotationY={-Math.PI / 2} isNight={isNight} />

      <ModernStreetlight position={[-14, 0.74, -3.6]} rotationY={0} isNight={isNight} />
      <ModernStreetlight position={[14, 0.74, -3.6]} rotationY={0} isNight={isNight} />
      <ModernStreetlight position={[-14, 0.74, 3.6]} rotationY={Math.PI} isNight={isNight} />
      <ModernStreetlight position={[14, 0.74, 3.6]} rotationY={Math.PI} isNight={isNight} />

      {/* Architectural Park Benches */}
      <ModernParkBench position={[-4.2, 0.74, -7.5]} rotationY={Math.PI / 2} />
      <ModernParkBench position={[4.2, 0.74, -7.5]} rotationY={-Math.PI / 2} />
      <ModernParkBench position={[-4.2, 0.74, 7.5]} rotationY={Math.PI / 2} />
      <ModernParkBench position={[4.2, 0.74, 7.5]} rotationY={-Math.PI / 2} />

      {/* Modern Glass Bus / Transit Shelters */}
      <ModernBusShelter position={[-4.4, 0.74, -20]} rotationY={Math.PI / 2} />
      <ModernBusShelter position={[4.4, 0.74, 20]} rotationY={-Math.PI / 2} />
    </group>
  );
};


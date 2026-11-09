'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Procedural Texture for Directional Street Signs
 */
function createDirectionalSignTexture(direction: string, destination: string): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Dark slate background with cyan/blue border
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 128);

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 5;
  ctx.strokeRect(5, 5, 502, 118);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  // Arrow icon
  ctx.font = 'bold 44px system-ui, sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(direction, 24, 64);

  // Sign text
  ctx.font = 'bold 32px system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(destination, 90, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// ========================================================
// SHARED GEOMETRIES & MATERIALS (Zero GPU Heap Duplication)
// ========================================================
const _treeTrunkGeo = new THREE.CylinderGeometry(0.1, 0.16, 1.2, 6);
const _treeTrunkMat = new THREE.MeshStandardMaterial({ color: '#643b1e', roughness: 0.8 });

const _coneGeo1 = new THREE.ConeGeometry(0.8, 1.1, 7);
const _coneGeo2 = new THREE.ConeGeometry(0.62, 0.95, 7);
const _coneGeo3 = new THREE.ConeGeometry(0.42, 0.75, 7);

const _leafMatDark = new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.6 });
const _leafMatMid = new THREE.MeshStandardMaterial({ color: '#22c55e', roughness: 0.6 });
const _leafMatLight = new THREE.MeshStandardMaterial({ color: '#4ade80', roughness: 0.5 });

const _dodecGeo1 = new THREE.DodecahedronGeometry(0.75, 0);
const _dodecGeo2 = new THREE.DodecahedronGeometry(0.5, 0);
const _dodecMatDark = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.6 });
const _dodecMatMid = new THREE.MeshStandardMaterial({ color: '#22c55e', roughness: 0.5 });

const _bushGeo1 = new THREE.DodecahedronGeometry(0.35, 0);
const _bushGeo2 = new THREE.DodecahedronGeometry(0.26, 0);

/**
 * Low-Poly Stylized Tree using Shared Geometries and Materials
 */
interface TreeProps {
  position: [number, number, number];
  scale?: number;
  type?: 'conical' | 'spherical';
  rotation?: number;
  onFoliageMount?: (el: THREE.Group | null, posX: number, posZ: number) => void;
}

const StylizedTree: React.FC<TreeProps> = ({
  position,
  scale = 1.0,
  type = 'conical',
  rotation = 0,
  onFoliageMount,
}) => {
  return (
    <group position={position} scale={[scale, scale, scale]} rotation={[0, rotation, 0]}>
      {/* Trunk */}
      <mesh position={[0, 0.6, 0]} geometry={_treeTrunkGeo} material={_treeTrunkMat} />

      {/* Foliage with ambient sway registered with parent */}
      {type === 'conical' ? (
        <group
          ref={(el) => onFoliageMount?.(el, position[0], position[2])}
          position={[0, 1.2, 0]}
        >
          <mesh position={[0, 0, 0]} castShadow geometry={_coneGeo1} material={_leafMatDark} />
          <mesh position={[0, 0.6, 0]} castShadow geometry={_coneGeo2} material={_leafMatMid} />
          <mesh position={[0, 1.15, 0]} castShadow geometry={_coneGeo3} material={_leafMatLight} />
        </group>
      ) : (
        <group
          ref={(el) => onFoliageMount?.(el, position[0], position[2])}
          position={[0, 1.5, 0]}
        >
          <mesh castShadow geometry={_dodecGeo1} material={_dodecMatDark} />
          <mesh position={[0.15, 0.25, -0.1]} castShadow geometry={_dodecGeo2} material={_dodecMatMid} />
        </group>
      )}
    </group>
  );
};

/**
 * Stylized Bush
 */
const StylizedBush: React.FC<{ position: [number, number, number]; scale?: number }> = ({
  position,
  scale = 1.0,
}) => (
  <group position={position} scale={[scale, scale, scale]}>
    <mesh position={[0, 0.25, 0]} geometry={_bushGeo1} material={_leafMatDark} />
    <mesh position={[0.2, 0.2, 0.1]} geometry={_bushGeo2} material={_leafMatMid} />
  </group>
);

/**
 * Modern Curved Gooseneck Streetlight
 */
interface StreetlightProps {
  position: [number, number, number];
  rotationY?: number;
  hasLight?: boolean;
  isNight?: boolean;
}

const ModernStreetlight: React.FC<StreetlightProps> = ({
  position,
  rotationY = 0,
  hasLight = false,
  isNight = false,
}) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    {/* Base Pad */}
    <mesh position={[0, 0.08, 0]}>
      <cylinderGeometry args={[0.16, 0.2, 0.16, 8]} />
      <meshStandardMaterial color="#1e293b" metalness={0.7} />
    </mesh>

    {/* Vertical Mast */}
    <mesh position={[0, 1.7, 0]} castShadow>
      <cylinderGeometry args={[0.05, 0.07, 3.2, 8]} />
      <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
    </mesh>

    {/* Horizontal Curved Lamp Arm */}
    <mesh position={[0.45, 3.25, 0]} rotation={[0, 0, -0.35]}>
      <boxGeometry args={[0.9, 0.05, 0.08]} />
      <meshStandardMaterial color="#334155" metalness={0.8} />
    </mesh>

    {/* Lamp Head Fixture */}
    <mesh position={[0.85, 3.1, 0]}>
      <boxGeometry args={[0.4, 0.08, 0.18]} />
      <meshStandardMaterial color="#0f172a" metalness={0.9} />
    </mesh>

    {/* Glowing Warm Emissive Panel */}
    <mesh position={[0.85, 3.05, 0]}>
      <boxGeometry args={[0.34, 0.02, 0.14]} />
      <meshStandardMaterial
        color="#fef08a"
        emissive="#fde047"
        emissiveIntensity={isNight ? 3.5 : 2.0}
      />
    </mesh>

    {/* Optional Warm Accent Downlight (Only active at night to keep daytime fragment shaders lean) */}
    {hasLight && isNight && (
      <pointLight
        position={[0.85, 2.8, 0]}
        color="#fef08a"
        intensity={2.2}
        distance={6.5}
        decay={2}
      />
    )}
  </group>
);

/**
 * Traffic Signal at Major Intersections
 */
interface TrafficSignalProps {
  position: [number, number, number];
  rotationY?: number;
}

const TrafficSignal: React.FC<TrafficSignalProps> = ({ position, rotationY = 0 }) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    {/* Base Pedestal */}
    <mesh position={[0, 0.1, 0]}>
      <cylinderGeometry args={[0.16, 0.2, 0.2, 8]} />
      <meshStandardMaterial color="#1e293b" metalness={0.7} />
    </mesh>

    {/* Vertical Post */}
    <mesh position={[0, 1.8, 0]} castShadow>
      <cylinderGeometry args={[0.06, 0.08, 3.4, 8]} />
      <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
    </mesh>

    {/* Horizontal Mast Arm Extending Over Lane */}
    <mesh position={[1.2, 3.4, 0]}>
      <boxGeometry args={[2.4, 0.08, 0.08]} />
      <meshStandardMaterial color="#1e293b" metalness={0.8} />
    </mesh>

    {/* Signal Head Housing */}
    <group position={[1.8, 3.0, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.26, 0.75, 0.24]} />
        <meshStandardMaterial color="#0a0a0c" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Red Light */}
      <mesh position={[0, 0.24, 0.125]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.2} />
      </mesh>

      {/* Amber Light */}
      <mesh position={[0, 0, 0.125]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshStandardMaterial color="#78350f" emissive="#f59e0b" emissiveIntensity={0.5} />
      </mesh>

      {/* Green Light */}
      <mesh position={[0, -0.24, 0.125]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2.2} />
      </mesh>
    </group>
  </group>
);

/**
 * Sidewalk Park Bench
 */
const ParkBench: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({
  position,
  rotationY = 0,
}) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    {/* Metal Frame Legs */}
    <mesh position={[-0.45, 0.22, 0]}>
      <boxGeometry args={[0.06, 0.44, 0.38]} />
      <meshStandardMaterial color="#475569" metalness={0.8} />
    </mesh>
    <mesh position={[0.45, 0.22, 0]}>
      <boxGeometry args={[0.06, 0.44, 0.38]} />
      <meshStandardMaterial color="#475569" metalness={0.8} />
    </mesh>

    {/* Wooden Seat Slats */}
    <mesh position={[0, 0.26, 0.05]} castShadow>
      <boxGeometry args={[1.05, 0.04, 0.34]} />
      <meshStandardMaterial color="#b45309" roughness={0.7} />
    </mesh>

    {/* Wooden Backrest */}
    <mesh position={[0, 0.48, -0.12]} rotation={[-0.15, 0, 0]} castShadow>
      <boxGeometry args={[1.05, 0.28, 0.04]} />
      <meshStandardMaterial color="#b45309" roughness={0.7} />
    </mesh>
  </group>
);

/**
 * Modern Trash Bin
 */
const TrashBin: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.32, 0]} castShadow>
      <cylinderGeometry args={[0.18, 0.16, 0.64, 12]} />
      <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
    </mesh>
    {/* Silver Top Hood */}
    <mesh position={[0, 0.66, 0]}>
      <cylinderGeometry args={[0.2, 0.2, 0.06, 12]} />
      <meshStandardMaterial color="#94a3b8" metalness={0.9} />
    </mesh>
  </group>
);

/**
 * Sidewalk Planter Box with Flowers
 */
const PlanterBox: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({
  position,
  rotationY = 0,
}) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    {/* Planter Body */}
    <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.2, 0.4, 0.5]} />
      <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.6} />
    </mesh>
    {/* Soil */}
    <mesh position={[0, 0.38, 0]}>
      <boxGeometry args={[1.12, 0.05, 0.42]} />
      <meshStandardMaterial color="#3f271a" roughness={0.9} />
    </mesh>
    {/* Shrubbery & Flowers */}
    {[-0.35, 0, 0.35].map((x, idx) => (
      <mesh key={`flower-${idx}`} position={[x, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.16, 8, 8]} />
        <meshStandardMaterial
          color={idx === 1 ? '#ec4899' : '#38bdf8'}
          roughness={0.6}
        />
      </mesh>
    ))}
  </group>
);

/**
 * Directional Road Signpost
 */
const DirectionalSignpost: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  dir1: string;
  dest1: string;
  dir2?: string;
  dest2?: string;
}> = ({ position, rotationY = 0, dir1, dest1, dir2, dest2 }) => {
  const tex1 = useMemo(() => createDirectionalSignTexture(dir1, dest1), [dir1, dest1]);
  const tex2 = useMemo(() => (dir2 && dest2 ? createDirectionalSignTexture(dir2, dest2) : null), [dir2, dest2]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Post */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 2.8, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>

      {/* Primary Signboard */}
      <mesh position={[0, 2.4, 0]} castShadow>
        <boxGeometry args={[1.4, 0.36, 0.06]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 2.4, 0.035]}>
        <planeGeometry args={[1.36, 0.32]} />
        <meshBasicMaterial map={tex1} transparent />
      </mesh>

      {/* Secondary Signboard */}
      {tex2 && (
        <>
          <mesh position={[0, 1.95, 0]} castShadow>
            <boxGeometry args={[1.4, 0.36, 0.06]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 1.95, 0.035]}>
            <planeGeometry args={[1.36, 0.32]} />
            <meshBasicMaterial map={tex2} transparent />
          </mesh>
        </>
      )}
    </group>
  );
};

/**
 * Low-Poly Stylized Parked Car
 */
const LowPolyParkedCar: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  color?: string;
}> = ({ position, rotationY = 0, color = '#f59e0b' }) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    {/* Car Lower Chassis */}
    <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.4, 0.28, 2.8]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
    </mesh>

    {/* Cabin & Glass Windows */}
    <mesh position={[0, 0.42, -0.15]} castShadow>
      <boxGeometry args={[1.2, 0.28, 1.5]} />
      <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.9} transparent opacity={0.7} />
    </mesh>

    {/* Car Roof */}
    <mesh position={[0, 0.58, -0.15]}>
      <boxGeometry args={[1.24, 0.05, 1.54]} />
      <meshStandardMaterial color={color} roughness={0.3} />
    </mesh>

    {/* 4 Wheels */}
    {[
      [-0.72, 0.12, 0.8],
      [0.72, 0.12, 0.8],
      [-0.72, 0.12, -0.8],
      [0.72, 0.12, -0.8],
    ].map(([wx, wy, wz], idx) => (
      <mesh key={`pwheel-${idx}`} position={[wx, wy, wz]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.12, 10]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
    ))}

    {/* Headlights */}
    <mesh position={[-0.45, 0.2, 1.41]}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={1.5} />
    </mesh>
    <mesh position={[0.45, 0.2, 1.41]}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={1.5} />
    </mesh>

    {/* Taillights */}
    <mesh position={[-0.45, 0.2, -1.41]}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
    </mesh>
    <mesh position={[0.45, 0.2, -1.41]}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
    </mesh>
  </group>
);

/**
 * CityStreetFurniture Component
 * Assembles environmental props across the city:
 * - Trees and bushes on grass strips
 * - Streetlights along pedestrian corridors
 * - Traffic signals at key crossroads
 * - Sidewalk benches, trash bins, and planters
 * - Parked cars in valid parking spaces
 * - Portfolio directional road signs
 */
interface CityStreetFurnitureProps {
  timeOfDay?: 'day' | 'night';
}

export const CityStreetFurniture: React.FC<CityStreetFurnitureProps> = ({
  timeOfDay = 'day',
}) => {
  const isNight = timeOfDay === 'night';
  const foliageListRef = useRef<{ el: THREE.Group; posX: number; posZ: number }[]>([]);

  const handleFoliageMount = (el: THREE.Group | null, posX: number, posZ: number) => {
    if (!el) return;
    foliageListRef.current.push({ el, posX, posZ });
  };

  // Single unified useFrame for all 16 trees (replaces 16 separate frame hooks)
  useFrame(() => {
    const t = performance.now() * 0.001;
    const list = foliageListRef.current;
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.el) {
        item.el.rotation.z = Math.sin(t * 1.6 + item.posX * 0.4 + item.posZ * 0.3) * 0.032;
        item.el.rotation.x = Math.cos(t * 1.3 + item.posX * 0.3) * 0.022;
      }
    }
  });

  return (
    <group name="CityStreetFurniture">
      {/* ======================================================== */}
      {/* 1. STYLIZED TREES ON GRASS VERGES                        */}
      {/* ======================================================== */}
      {/* Along Northwest Block (Hero HQ Verge) */}
      <StylizedTree onFoliageMount={handleFoliageMount} position={[-3.85, 0.705, -5.5]} scale={1.05} type="conical" rotation={0.4} />
      <StylizedTree onFoliageMount={handleFoliageMount} position={[-3.85, 0.705, -9.2]} scale={0.9} type="spherical" rotation={1.2} />
      <StylizedTree onFoliageMount={handleFoliageMount} position={[-5.8, 0.705, -3.85]} scale={1.1} type="conical" rotation={2.1} />
      <StylizedTree onFoliageMount={handleFoliageMount} position={[-9.8, 0.705, -3.85]} scale={0.95} type="spherical" rotation={0.8} />

      {/* Along Northeast Block (About Me Studio Verge) */}
      <StylizedTree onFoliageMount={handleFoliageMount} position={[3.85, 0.705, -5.5]} scale={1.0} type="spherical" rotation={1.5} />
      <StylizedTree onFoliageMount={handleFoliageMount} position={[3.85, 0.705, -9.2]} scale={1.15} type="conical" rotation={0.3} />
      <StylizedTree onFoliageMount={handleFoliageMount} position={[5.8, 0.705, -3.85]} scale={0.95} type="spherical" rotation={2.4} />
      <StylizedTree onFoliageMount={handleFoliageMount} position={[9.8, 0.705, -3.85]} scale={1.05} type="conical" rotation={1.1} />

      {/* Along Southwest Block (Projects Center Verge) */}
      <StylizedTree onFoliageMount={handleFoliageMount} position={[-3.85, 0.705, 5.5]} scale={1.1} type="conical" rotation={0.7} />
      <StylizedTree onFoliageMount={handleFoliageMount} position={[-3.85, 0.705, 9.2]} scale={0.95} type="spherical" rotation={1.9} />
      <StylizedTree onFoliageMount={handleFoliageMount} position={[-5.8, 0.705, 3.85]} scale={1.0} type="conical" rotation={2.8} />
      <StylizedTree onFoliageMount={handleFoliageMount} position={[-9.8, 0.705, 3.85]} scale={1.1} type="spherical" rotation={0.2} />

      {/* Along Southeast Block (Skills Tower Verge) */}
      <StylizedTree onFoliageMount={handleFoliageMount} position={[3.85, 0.705, 5.5]} scale={0.95} type="spherical" rotation={1.3} />
      <StylizedTree onFoliageMount={handleFoliageMount} position={[3.85, 0.705, 9.2]} scale={1.1} type="conical" rotation={0.6} />
      <StylizedTree onFoliageMount={handleFoliageMount} position={[5.8, 0.705, 3.85]} scale={1.05} type="conical" rotation={2.0} />
      <StylizedTree onFoliageMount={handleFoliageMount} position={[9.8, 0.705, 3.85]} scale={0.9} type="spherical" rotation={1.7} />

      {/* Stylized Bushes around the Verge Corners */}
      <StylizedBush position={[-3.85, 0.705, -7.3]} scale={1.1} />
      <StylizedBush position={[3.85, 0.705, -7.3]} scale={0.95} />
      <StylizedBush position={[-3.85, 0.705, 7.3]} scale={1.0} />
      <StylizedBush position={[3.85, 0.705, 7.3]} scale={1.15} />

      {/* ======================================================== */}
      {/* 2. MODERN STREETLIGHTS ALONG SIDEWALKS                   */}
      {/* ======================================================== */}
      {/* Central North-South Boulevard Streetlights */}
      <ModernStreetlight position={[-3.25, 0.74, -6.5]} rotationY={Math.PI / 2} hasLight isNight={isNight} />
      <ModernStreetlight position={[3.25, 0.74, -6.5]} rotationY={-Math.PI / 2} isNight={isNight} />
      <ModernStreetlight position={[-3.25, 0.74, 6.5]} rotationY={Math.PI / 2} isNight={isNight} />
      <ModernStreetlight position={[3.25, 0.74, 6.5]} rotationY={-Math.PI / 2} hasLight isNight={isNight} />

      {/* Central East-West Boulevard Streetlights */}
      <ModernStreetlight position={[-7.5, 0.74, -3.25]} rotationY={0} isNight={isNight} />
      <ModernStreetlight position={[7.5, 0.74, -3.25]} rotationY={0} hasLight isNight={isNight} />
      <ModernStreetlight position={[-7.5, 0.74, 3.25]} rotationY={Math.PI} hasLight isNight={isNight} />
      <ModernStreetlight position={[7.5, 0.74, 3.25]} rotationY={Math.PI} isNight={isNight} />

      {/* ======================================================== */}
      {/* 3. TRAFFIC SIGNALS AT MAJOR JUNCTIONS                    */}
      {/* ======================================================== */}
      {/* Central Crossroads (4 Corner Posts) */}
      <TrafficSignal position={[-3.2, 0.74, -3.2]} rotationY={Math.PI / 2} />
      <TrafficSignal position={[3.2, 0.74, -3.2]} rotationY={Math.PI} />
      <TrafficSignal position={[3.2, 0.74, 3.2]} rotationY={-Math.PI / 2} />
      <TrafficSignal position={[-3.2, 0.74, 3.2]} rotationY={0} />

      {/* North Junction (approach to Contact Hub) */}
      <TrafficSignal position={[3.2, 0.74, -13.5]} rotationY={-Math.PI / 2} />

      {/* South Junction (approach to Experience Office) */}
      <TrafficSignal position={[-3.2, 0.74, 13.5]} rotationY={Math.PI / 2} />

      {/* ======================================================== */}
      {/* 4. PARK BENCHES, TRASH BINS & PLANTER BOXES              */}
      {/* ======================================================== */}
      {/* Benches */}
      <ParkBench position={[-3.2, 0.74, -8.5]} rotationY={Math.PI / 2} />
      <ParkBench position={[3.2, 0.74, -8.5]} rotationY={-Math.PI / 2} />
      <ParkBench position={[-8.5, 0.74, 3.2]} rotationY={Math.PI} />
      <ParkBench position={[8.5, 0.74, -3.2]} rotationY={0} />

      {/* Trash Bins next to Benches */}
      <TrashBin position={[-3.2, 0.74, -9.3]} />
      <TrashBin position={[3.2, 0.74, -9.3]} />
      <TrashBin position={[-9.3, 0.74, 3.2]} />
      <TrashBin position={[9.3, 0.74, -3.2]} />

      {/* Planter Boxes at Corner Plazas */}
      <PlanterBox position={[-2.8, 0.74, -3.8]} rotationY={0} />
      <PlanterBox position={[2.8, 0.74, -3.8]} rotationY={0} />
      <PlanterBox position={[-2.8, 0.74, 3.8]} rotationY={Math.PI} />
      <PlanterBox position={[2.8, 0.74, 3.8]} rotationY={Math.PI} />

      {/* ======================================================== */}
      {/* 5. DIRECTIONAL ROAD SIGNS POINTING TO PORTFOLIO SECTIONS */}
      {/* ======================================================== */}
      {/* Northbound Signpost (pointing to Contact Hub & Hero HQ) */}
      <DirectionalSignpost
        position={[-3.2, 0.74, -2.4]}
        rotationY={Math.PI / 2}
        dir1="▲"
        dest1="CONTACT HUB"
        dir2="◄"
        dest2="HERO HQ"
      />

      {/* Southbound Signpost (pointing to Experience Office & Skills Tower) */}
      <DirectionalSignpost
        position={[3.2, 0.74, 2.4]}
        rotationY={-Math.PI / 2}
        dir1="▼"
        dest1="EXPERIENCE OFFICE"
        dir2="►"
        dest2="SKILLS TOWER"
      />

      {/* Eastbound Signpost (pointing to About Me & Projects) */}
      <DirectionalSignpost
        position={[-2.4, 0.74, 3.2]}
        rotationY={Math.PI}
        dir1="◄"
        dest1="PROJECTS CENTER"
        dir2="►"
        dest2="ABOUT ME STUDIO"
      />

      {/* ======================================================== */}
      {/* 6. PARKED CARS IN DESIGNATED ROADSIDE BAYS               */}
      {/* ======================================================== */}
      {/* Parked Car 1: Near About Me Studio (Tucked neatly beside sidewalk curb) */}
      <LowPolyParkedCar position={[12.6, 0.65, -5.2]} rotationY={0} color="#0284c7" />

      {/* Parked Car 2: Near Skills Tower */}
      <LowPolyParkedCar position={[12.6, 0.65, 5.2]} rotationY={Math.PI} color="#10b981" />

      {/* Parked Car 3: Near Hero HQ */}
      <LowPolyParkedCar position={[-12.6, 0.65, -5.2]} rotationY={0} color="#f97316" />

      {/* Parked Car 4: Near Projects Center */}
      <LowPolyParkedCar position={[-12.6, 0.65, 5.2]} rotationY={Math.PI} color="#8b5cf6" />
    </group>
  );
};


import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getSharedHQMaterials } from './HQMaterials';
import { useWorldStore, worldStore } from '../../stores/worldStore';

const LazyHQSpatialPanels = React.lazy(() =>
  import('./HQSpatialPanels').then((m) => ({ default: m.HQSpatialPanels }))
);

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
  const hqInteriorPhase = useWorldStore((s) => s.hqInteriorPhase);

  const outerRingMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const midRingRef = useRef<THREE.Mesh>(null);
  const midRingMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const innerRingMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const floorGlowMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const cyanLightRef = useRef<THREE.PointLight>(null);
  const blueLightRef = useRef<THREE.PointLight>(null);
  const activationRef = useRef<number>(0.25);
  const pulseTimeRef = useRef<number>(0);

  const interiorAccents = useMemo(() => {
    return {
      polishedFloor: new THREE.MeshStandardMaterial({
        color: '#080e1c',
        roughness: 0.16,
        metalness: 0.48,
      }),
      navyWall: new THREE.MeshStandardMaterial({
        color: '#0b1324',
        roughness: 0.42,
        metalness: 0.35,
      }),
      graphiteWall: new THREE.MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.36,
        metalness: 0.55,
      }),
      ceilingCoffer: new THREE.MeshStandardMaterial({
        color: '#070d1a',
        roughness: 0.5,
        metalness: 0.25,
      }),
      cyanStrip: new THREE.MeshBasicMaterial({
        color: '#38bdf8',
        transparent: true,
        opacity: 0.72,
      }),
      softWhiteStrip: new THREE.MeshBasicMaterial({
        color: '#e2e8f0',
        transparent: true,
        opacity: 0.48,
      }),
      platformTop: new THREE.MeshStandardMaterial({
        color: '#091122',
        roughness: 0.22,
        metalness: 0.68,
      }),
      platformRim: new THREE.MeshStandardMaterial({
        color: '#162238',
        roughness: 0.32,
        metalness: 0.82,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(interiorAccents).forEach((mat) => mat.dispose());
    };
  }, [interiorAccents]);

  // Animate platform concentric rings and arrival lighting (paused when visitor is outside)
  useFrame((_, delta) => {
    const phase = worldStore.getState().hqInteriorPhase;
    const isActive = phase === 'entering' || phase === 'inside';
    const targetAct = isActive ? 1.0 : 0.25;

    // Early exit once settled in standby outside
    if (!isActive && Math.abs(activationRef.current - targetAct) < 0.005) {
      return;
    }

    const dt = Math.min(delta, 0.05);
    activationRef.current += (targetAct - activationRef.current) * Math.min(1, dt * 3.2);
    const act = activationRef.current;

    if (isActive) {
      pulseTimeRef.current += dt;
    }
    const pulse = 0.5 + 0.5 * Math.sin(pulseTimeRef.current * 2.1);

    if (outerRingMatRef.current) {
      outerRingMatRef.current.opacity = (0.35 + 0.45 * act) * (0.82 + 0.18 * pulse);
    }
    if (midRingRef.current && isActive) {
      midRingRef.current.rotation.z += dt * 0.28;
    }
    if (midRingMatRef.current) {
      midRingMatRef.current.opacity = (0.25 + 0.45 * act) * (0.78 + 0.22 * (1 - pulse));
    }
    if (innerRingMatRef.current) {
      innerRingMatRef.current.opacity = 0.2 + 0.55 * act;
    }
    if (floorGlowMatRef.current) {
      floorGlowMatRef.current.opacity = 0.04 + 0.12 * act * (0.85 + 0.15 * pulse);
    }
    if (cyanLightRef.current) {
      cyanLightRef.current.intensity = 1.6 + 2.8 * act;
    }
    if (blueLightRef.current) {
      blueLightRef.current.intensity = 0.9 + 1.6 * act;
    }
  });

  return (
    <group position={position}>
      {/* 1. Polished Dark Graphite & Navy Architectural Floor (Top at Y = 0.22m) */}
      <mesh position={[0, 0.21, 3.5]} receiveShadow>
        <boxGeometry args={[16.6, 0.02, 10.0]} />
        <primitive object={interiorAccents.polishedFloor} attach="material" />
      </mesh>

      {/* Subtle Architectural Floor Inlay Grid Lines */}
      <mesh position={[0, 0.221, 3.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14.8, 0.025]} />
        <primitive object={interiorAccents.softWhiteStrip} attach="material" />
      </mesh>

      {/* Subtle Glowing Cyan Floor Guide Strips (Doorways -> Central Platform) */}
      <mesh position={[-2.5, 0.223, 6.7]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 2.8]} />
        <primitive object={interiorAccents.cyanStrip} attach="material" />
      </mesh>
      <mesh position={[2.5, 0.223, 6.7]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 2.8]} />
        <primitive object={interiorAccents.cyanStrip} attach="material" />
      </mesh>

      {/* 1B. Central Circular Presentation Platform (Center [0, 3.8], Top at Y = 0.28m) */}
      <group name="hq_central_platform" position={[0, 0.22, 3.8]}>
        {/* Gentle Floor Glow Halo */}
        <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.38, 3.4, 48]} />
          <meshBasicMaterial
            ref={floorGlowMatRef}
            color="#0ea5e9"
            transparent
            opacity={0.08}
            depthWrite={false}
          />
        </mesh>
        {/* Outer Stepped Rim */}
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <cylinderGeometry args={[2.35, 2.45, 0.04, 48]} />
          <primitive object={interiorAccents.platformRim} attach="material" />
        </mesh>
        {/* Main Elevated Deck (Top at Y = 0.22 + 0.06 = 0.28m) */}
        <mesh position={[0, 0.03, 0]} receiveShadow>
          <cylinderGeometry args={[2.18, 2.22, 0.06, 48]} />
          <primitive object={interiorAccents.platformTop} attach="material" />
        </mesh>
        {/* Ring 1: Outer Glowing Cyan Perimeter Ring */}
        <mesh position={[0, 0.062, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.04, 2.12, 48]} />
          <meshBasicMaterial ref={outerRingMatRef} color="#38bdf8" transparent opacity={0.65} />
        </mesh>
        {/* Ring 2: Middle Animated Blue Concentric Ring */}
        <mesh ref={midRingRef} position={[0, 0.062, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.38, 1.44, 16]} />
          <meshBasicMaterial ref={midRingMatRef} color="#3b82f6" transparent opacity={0.55} />
        </mesh>
        {/* Ring 3: Inner Soft-White Core Ring */}
        <mesh position={[0, 0.062, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.68, 0.73, 40]} />
          <meshBasicMaterial ref={innerRingMatRef} color="#e2e8f0" transparent opacity={0.45} />
        </mesh>
      </group>

      {/* 2. Sleek Dark Graphite & Navy Architectural Back Feature Wall */}
      <group position={[0, 4.2, -1.4]}>
        <mesh receiveShadow>
          <boxGeometry args={[16.6, 8.0, 0.24]} />
          <primitive object={interiorAccents.graphiteWall} attach="material" />
        </mesh>
        {/* Subtle Horizontal Cyan Architectural Accent Band */}
        <mesh position={[0, -0.4, 0.13]}>
          <boxGeometry args={[14.8, 0.04, 0.02]} />
          <primitive object={interiorAccents.cyanStrip} attach="material" />
        </mesh>
        <mesh position={[0, 2.2, 0.13]}>
          <boxGeometry args={[14.8, 0.03, 0.02]} />
          <primitive object={interiorAccents.softWhiteStrip} attach="material" />
        </mesh>
      </group>

      {/* 3. Futuristic Dark Graphite Reception Desk (Positioned near back wall) */}
      <group position={[0, 0.21, -0.35]}>
        {/* Main Reception Counter */}
        <mesh position={[0, 0.55, 0]} receiveShadow>
          <boxGeometry args={[3.4, 1.10, 0.80]} />
          <primitive object={interiorAccents.platformRim} attach="material" />
        </mesh>

        {/* Brushed Stainless Steel Countertop */}
        <mesh position={[0, 1.12, 0]}>
          <boxGeometry args={[3.5, 0.04, 0.85]} />
          <primitive object={materials.stainlessSteel} attach="material" />
        </mesh>

        {/* Cyan Undercounter LED Kickplate Glow */}
        <mesh position={[0, 0.05, 0.41]}>
          <boxGeometry args={[3.2, 0.08, 0.04]} />
          <primitive object={interiorAccents.cyanStrip} attach="material" />
        </mesh>
      </group>

      {/* 4. Elevator Core Logical Enclosure (East Wall Partition - Dark Navy Slate + Cyan Cove) */}
      <group position={[8.2, 4.2, 3.5]}>
        {/* Elevator Core Wall Partition */}
        <mesh receiveShadow>
          <boxGeometry args={[0.30, 8.0, 9.6]} />
          <primitive object={interiorAccents.navyWall} attach="material" />
        </mesh>
        {/* Vertical Cyan Architectural Cove Strip */}
        <mesh position={[-0.16, 0, -4.3]}>
          <boxGeometry args={[0.02, 7.6, 0.06]} />
          <primitive object={interiorAccents.cyanStrip} attach="material" />
        </mesh>
        <mesh position={[-0.16, 0, 4.3]}>
          <boxGeometry args={[0.02, 7.6, 0.06]} />
          <primitive object={interiorAccents.cyanStrip} attach="material" />
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

      {/* 5. Staircase & Service Shaft Logical Enclosure (West Wall Partition - Dark Navy Slate + Cyan Cove) */}
      <group position={[-8.2, 4.2, 3.5]}>
        <mesh receiveShadow>
          <boxGeometry args={[0.30, 8.0, 9.6]} />
          <primitive object={interiorAccents.navyWall} attach="material" />
        </mesh>
        <mesh position={[0.16, 0, -4.3]}>
          <boxGeometry args={[0.02, 7.6, 0.06]} />
          <primitive object={interiorAccents.cyanStrip} attach="material" />
        </mesh>
        <mesh position={[0.16, 0, 4.3]}>
          <boxGeometry args={[0.02, 7.6, 0.06]} />
          <primitive object={interiorAccents.cyanStrip} attach="material" />
        </mesh>
      </group>

      {/* 6. Perimeter Architectural Pilasters & Glass Partition Fins (Keeps Center Atrium Open) */}
      <mesh position={[-7.6, 4.2, 4.5]} receiveShadow>
        <cylinderGeometry args={[0.30, 0.30, 8.0, 16]} />
        <primitive object={materials.stainlessSteel} attach="material" />
      </mesh>
      <mesh position={[7.6, 4.2, 4.5]} receiveShadow>
        <cylinderGeometry args={[0.30, 0.30, 8.0, 16]} />
        <primitive object={materials.stainlessSteel} attach="material" />
      </mesh>
      {/* Modern Glass Partition Wings flanking Rear Corridor */}
      <mesh position={[-6.4, 2.0, -0.2]}>
        <boxGeometry args={[2.6, 3.6, 0.05]} />
        <primitive object={materials.lobbyGlass} attach="material" />
      </mesh>
      <mesh position={[6.4, 2.0, -0.2]}>
        <boxGeometry args={[2.6, 3.6, 0.05]} />
        <primitive object={materials.lobbyGlass} attach="material" />
      </mesh>

      {/* 7. Double-Height Acoustic Ceiling Plane & Recessed Cyan / Soft-White Halo + Light Bars */}
      <mesh position={[0, 8.15, 3.5]}>
        <boxGeometry args={[16.6, 0.15, 10.0]} />
        <primitive object={interiorAccents.ceilingCoffer} attach="material" />
      </mesh>
      <mesh position={[0, 8.06, 3.8]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 2.45, 48]} />
        <primitive object={interiorAccents.cyanStrip} attach="material" />
      </mesh>
      <mesh position={[0, 8.06, 3.8]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.6, 3.68, 48]} />
        <primitive object={interiorAccents.softWhiteStrip} attach="material" />
      </mesh>
      {[-5.2, 5.2].map((lx) => (
        <mesh key={`ceil-bar-${lx}`} position={[lx, 8.06, 3.5]}>
          <boxGeometry args={[0.12, 0.02, 7.2]} />
          <primitive object={interiorAccents.softWhiteStrip} attach="material" />
        </mesh>
      ))}

      {/* 8. Lazy-Loaded Floating VisionOS Spatial Panels (No monitor stands) */}
      {hqInteriorPhase !== 'outside' && (
        <Suspense fallback={null}>
          <LazyHQSpatialPanels />
        </Suspense>
      )}

      {/* Subtle South Exit Threshold Markers */}
      <mesh position={[-2.5, 0.224, 7.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.55, 24]} />
        <primitive object={interiorAccents.cyanStrip} attach="material" />
      </mesh>
      <mesh position={[2.5, 0.224, 7.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.55, 24]} />
        <primitive object={interiorAccents.cyanStrip} attach="material" />
      </mesh>

      {/* 9. Cyan & Blue Ambient Architectural Illumination (Zero shadow-casting overhead) */}
      <pointLight
        ref={cyanLightRef}
        color="#38bdf8"
        intensity={1.6}
        distance={18.0}
        position={[0, 6.2, 3.8]}
      />
      <pointLight
        ref={blueLightRef}
        color="#60a5fa"
        intensity={0.9}
        distance={14.0}
        position={[0, 3.5, 0.6]}
      />
    </group>
  );
};

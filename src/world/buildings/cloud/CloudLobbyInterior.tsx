'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getSharedCloudMaterials } from './CloudMaterials';

interface CloudLobbyInteriorProps {
  onSelectZone?: (zoneId: string) => void;
}

export const CloudLobbyInterior: React.FC<CloudLobbyInteriorProps> = ({ onSelectZone }) => {
  const materials = getSharedCloudMaterials();

  // Animation refs for central 3D holographic cloud & orbital data rings
  const holoCloudRef = useRef<THREE.Group>(null);
  const orbitalRing1Ref = useRef<THREE.Group>(null);
  const orbitalRing2Ref = useRef<THREE.Group>(null);
  const serverLedsRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (holoCloudRef.current) {
      holoCloudRef.current.position.y = 3.6 + Math.sin(t * 1.8) * 0.12;
      holoCloudRef.current.rotation.y += delta * 0.45;
    }

    if (orbitalRing1Ref.current) {
      orbitalRing1Ref.current.rotation.x += delta * 0.6;
      orbitalRing1Ref.current.rotation.y += delta * 0.35;
    }

    if (orbitalRing2Ref.current) {
      orbitalRing2Ref.current.rotation.z += delta * 0.5;
      orbitalRing2Ref.current.rotation.y -= delta * 0.4;
    }

    if (serverLedsRef.current) {
      serverLedsRef.current.intensity = 1.2 + Math.sin(t * 4.0) * 0.35;
    }
  });

  return (
    <group name="cloud_lobby_interior" position={[0, 0, 0]}>
      {/* 1. Interior Polished Ground Floor (Y = 0.25m, flush with lobby) */}
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <boxGeometry args={[20.5, 0.05, 20.5]} />
        <meshStandardMaterial color="#0b1329" roughness={0.15} metalness={0.7} />
      </mesh>

      {/* Recessed Ground LED Accent Ribbons */}
      <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.2, 4.3, 32]} />
        <primitive object={materials.cyanNeonGlow} attach="material" />
      </mesh>
      <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.8, 6.9, 32]} />
        <primitive object={materials.cyanNeonGlow} attach="material" />
      </mesh>

      {/* 2. Suspended Architectural Bridge across Double-Height Atrium (Y = 4.2m) */}
      <group position={[0, 4.2, -1.0]}>
        {/* Bridge Floor Deck */}
        <mesh receiveShadow>
          <boxGeometry args={[18.0, 0.25, 2.6]} />
          <primitive object={materials.structuralSilver} attach="material" />
        </mesh>

        {/* Bridge Under-structure Support Trusses */}
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[17.6, 0.2, 2.2]} />
          <primitive object={materials.titaniumGraphite} attach="material" />
        </mesh>

        {/* Glass Balustrades on North & South edges of bridge */}
        <mesh position={[0, 0.65, 1.25]}>
          <boxGeometry args={[17.8, 1.0, 0.06]} />
          <primitive object={materials.atriumGlass} attach="material" />
        </mesh>
        <mesh position={[0, 1.15, 1.25]}>
          <boxGeometry args={[17.8, 0.06, 0.1]} />
          <primitive object={materials.polishedSilver} attach="material" />
        </mesh>

        <mesh position={[0, 0.65, -1.25]}>
          <boxGeometry args={[17.8, 1.0, 0.06]} />
          <primitive object={materials.atriumGlass} attach="material" />
        </mesh>
        <mesh position={[0, 1.15, -1.25]}>
          <boxGeometry args={[17.8, 0.06, 0.1]} />
          <primitive object={materials.polishedSilver} attach="material" />
        </mesh>

        {/* Linear LED light strip along bridge underside */}
        <mesh position={[0, -0.36, 0]}>
          <boxGeometry args={[16.0, 0.04, 0.15]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
      </group>

      {/* 3. Central Suspended 3D Holographic Cloud & Orbital Telemetry Rings */}
      <group ref={holoCloudRef} position={[0, 3.6, 1.5]}>
        {/* Stylized 3D Cloud Geometry assembled from glowing intersecting spheres */}
        <group scale={[0.85, 0.85, 0.85]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.9, 24, 24]} />
            <primitive object={materials.cyanNeonGlow} attach="material" />
          </mesh>
          <mesh position={[-0.8, -0.2, 0]}>
            <sphereGeometry args={[0.65, 20, 20]} />
            <primitive object={materials.cyanNeonGlow} attach="material" />
          </mesh>
          <mesh position={[0.8, -0.2, 0]}>
            <sphereGeometry args={[0.68, 20, 20]} />
            <primitive object={materials.cyanNeonGlow} attach="material" />
          </mesh>
          <mesh position={[-0.45, 0.45, 0]}>
            <sphereGeometry args={[0.75, 20, 20]} />
            <primitive object={materials.cyanNeonGlow} attach="material" />
          </mesh>
          <mesh position={[0.5, 0.35, 0]}>
            <sphereGeometry args={[0.7, 20, 20]} />
            <primitive object={materials.cyanNeonGlow} attach="material" />
          </mesh>
          {/* Flat bottom base cylinder to complete cloud silhouette */}
          <mesh position={[0, -0.35, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[1.4, 1.4, 0.5, 24]} />
            <primitive object={materials.cyanNeonGlow} attach="material" />
          </mesh>
        </group>

        {/* Core Cloud Point Light */}
        <pointLight color="#00f0ff" intensity={2.2} distance={12.0} />

        {/* Orbiting Telemetry Rings */}
        <group ref={orbitalRing1Ref}>
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[2.2, 0.035, 12, 48]} />
            <primitive object={materials.cyanNeonGlow} attach="material" />
          </mesh>
          {/* Orbital Data Satellites */}
          <mesh position={[2.2, 0, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <primitive object={materials.whiteNeonGlow} attach="material" />
          </mesh>
        </group>

        <group ref={orbitalRing2Ref}>
          <mesh rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
            <torusGeometry args={[2.7, 0.03, 12, 48]} />
            <primitive object={materials.cyanAccentMuted} attach="material" />
          </mesh>
          <mesh position={[-2.7, 0, 0]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <primitive object={materials.whiteNeonGlow} attach="material" />
          </mesh>
        </group>
      </group>

      {/* 4. Interactive Technology Exhibition Consoles / Kiosks (5 Zones) */}
      {/* Zone A: Backend Architecture Kiosk (Left Front: X = -5.0, Z = 2.5) */}
      <group
        position={[-5.0, 0.25, 2.5]}
        onClick={(e) => {
          e.stopPropagation();
          if (onSelectZone) onSelectZone('backend-architecture');
        }}
      >
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[1.4, 1.1, 0.8]} />
          <primitive object={materials.titaniumGraphite} attach="material" />
        </mesh>
        <mesh position={[0, 1.15, -0.05]} rotation={[-Math.PI / 6, 0, 0]}>
          <boxGeometry args={[1.2, 0.65, 0.08]} />
          <primitive object={materials.curvedFacadeTextureMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[1.6, 0.1, 1.0]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
      </group>

      {/* Zone B: Cloud Infrastructure Kiosk (Left Rear: X = -5.0, Z = -3.5) */}
      <group
        position={[-5.0, 0.25, -3.5]}
        onClick={(e) => {
          e.stopPropagation();
          if (onSelectZone) onSelectZone('cloud-infrastructure');
        }}
      >
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[1.4, 1.1, 0.8]} />
          <primitive object={materials.titaniumGraphite} attach="material" />
        </mesh>
        <mesh position={[0, 1.15, -0.05]} rotation={[-Math.PI / 6, 0, 0]}>
          <boxGeometry args={[1.2, 0.65, 0.08]} />
          <primitive object={materials.cyberPulseScreenMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[1.6, 0.1, 1.0]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
      </group>

      {/* Zone C: API & WebSockets Kiosk (Right Front: X = 5.0, Z = 2.5) */}
      <group
        position={[5.0, 0.25, 2.5]}
        onClick={(e) => {
          e.stopPropagation();
          if (onSelectZone) onSelectZone('api-communication');
        }}
      >
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[1.4, 1.1, 0.8]} />
          <primitive object={materials.titaniumGraphite} attach="material" />
        </mesh>
        <mesh position={[0, 1.15, -0.05]} rotation={[-Math.PI / 6, 0, 0]}>
          <boxGeometry args={[1.2, 0.65, 0.08]} />
          <primitive object={materials.curvedFacadeTextureMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[1.6, 0.1, 1.0]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
      </group>

      {/* Zone D: Database & Storage Kiosk (Right Rear: X = 5.0, Z = -3.5) */}
      <group
        position={[5.0, 0.25, -3.5]}
        onClick={(e) => {
          e.stopPropagation();
          if (onSelectZone) onSelectZone('database-storage');
        }}
      >
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[1.4, 1.1, 0.8]} />
          <primitive object={materials.titaniumGraphite} attach="material" />
        </mesh>
        <mesh position={[0, 1.15, -0.05]} rotation={[-Math.PI / 6, 0, 0]}>
          <boxGeometry args={[1.2, 0.65, 0.08]} />
          <primitive object={materials.cyberPulseScreenMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[1.6, 0.1, 1.0]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
      </group>

      {/* 5. Production Server Rack Arrays along the Rear Wall (Z = -7.5) */}
      <group position={[0, 0.25, -7.5]}>
        {[-6.0, -4.2, -2.4, 2.4, 4.2, 6.0].map((rx, idx) => (
          <group key={`server-${idx}`} position={[rx, 1.6, 0]}>
            {/* Server Rack Body */}
            <mesh receiveShadow>
              <boxGeometry args={[1.5, 3.2, 0.8]} />
              <primitive object={materials.titaniumGraphite} attach="material" />
            </mesh>
            {/* Front Panel with Blinking Status LEDs Texture */}
            <mesh position={[0, 0, 0.41]}>
              <planeGeometry args={[1.4, 3.0]} />
              <primitive object={materials.serverRackMat} attach="material" />
            </mesh>
            {/* Server Rack Top Exhaust Vent */}
            <mesh position={[0, 1.65, 0]}>
              <boxGeometry args={[1.3, 0.1, 0.6]} />
              <primitive object={materials.roofMechanicalMat} attach="material" />
            </mesh>
          </group>
        ))}

        {/* Overhead Server Cable Trays */}
        <mesh position={[0, 3.4, 0]}>
          <boxGeometry args={[14.0, 0.12, 0.6]} />
          <primitive object={materials.structuralSilver} attach="material" />
        </mesh>

        {/* Server Status Cyan Ambient Glow */}
        <pointLight
          ref={serverLedsRef}
          color="#00f0ff"
          intensity={1.5}
          distance={8.0}
          position={[0, 2.0, 1.0]}
        />
      </group>

      {/* 6. Executive Reception Counter & Welcome Plinth (X = 0, Z = 5.2) */}
      <group position={[0, 0.25, 5.2]}>
        {/* Main Curved Reception Desk */}
        <mesh position={[0, 0.55, 0]} receiveShadow>
          <boxGeometry args={[3.6, 1.1, 1.2]} />
          <primitive object={materials.titaniumGraphite} attach="material" />
        </mesh>
        {/* Front Illuminating Strip */}
        <mesh position={[0, 0.55, 0.62]}>
          <boxGeometry args={[3.2, 0.08, 0.05]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
        {/* Reception Countertop */}
        <mesh position={[0, 1.12, 0]}>
          <boxGeometry args={[3.8, 0.08, 1.3]} />
          <primitive object={materials.polishedSilver} attach="material" />
        </mesh>
        {/* Operator Monitors */}
        <mesh position={[-0.8, 1.4, -0.1]} rotation={[0, 0.2, 0]}>
          <boxGeometry args={[0.8, 0.5, 0.04]} />
          <primitive object={materials.cyberPulseScreenMat} attach="material" />
        </mesh>
        <mesh position={[0.8, 1.4, -0.1]} rotation={[0, -0.2, 0]}>
          <boxGeometry args={[0.8, 0.5, 0.04]} />
          <primitive object={materials.curvedFacadeTextureMat} attach="material" />
        </mesh>
      </group>

      {/* 7. Warm Interior Atrium Ambient Lighting */}
      <pointLight color="#f8fafc" intensity={1.4} distance={16.0} position={[0, 6.0, 0]} />
      <pointLight color="#0284c7" intensity={0.9} distance={14.0} position={[0, 1.5, 0]} />
    </group>
  );
};

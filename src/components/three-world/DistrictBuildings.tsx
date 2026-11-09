'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Text } from '@react-three/drei';
import * as THREE from 'three';
import { WORLD_DISTRICTS } from './WorldConfig';
import { usePerformanceQuality } from '../PerformanceControl';
import {
  getBuildingFacadeTexture,
  getBuildingPanelsTexture,
  getCurvedBillboardTexture,
  getNexusBrandBillboardTexture,
  getHologramPosterTexture,
} from './CityTextures';

interface DistrictBuildingsProps {
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  nearestDistrictId: string | null;
  onSelectDistrict: (districtId: string) => void;
  onEnterInterior?: (districtId: string) => void;
}

// Preload GLB building models
if (typeof window !== 'undefined') {
  useGLTF.preload('/models/nexus-city/building_landmark_tower.glb');
  useGLTF.preload('/models/nexus-city/building_media_midrise.glb');
  useGLTF.preload('/models/nexus-city/building_cyber_complex.glb');
  useGLTF.preload('/models/nexus-city/building_industrial_block.glb');
}

// ========================================================
// 1. GRAND CITADEL LANDMARK TOWER (Height 48m - Spire at 0, -28)
// ========================================================
function GrandCitadelLandmark({
  isNear,
  onInteract,
  enableShadows,
}: {
  isNear: boolean;
  onInteract: () => void;
  enableShadows: boolean;
}) {
  const { scene } = useGLTF('/models/nexus-city/building_landmark_tower.glb');
  const clone = useMemo(() => scene.clone(true), [scene]);
  const beaconRef = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    if (beaconRef.current) {
      const time = performance.now() * 0.001;
      beaconRef.current.intensity = 2.5 + Math.sin(time * 3.5) * 1.5;
    }
  });

  return (
    <group position={[0, 0, -28]} onClick={onInteract}>
      {/* Real 3D Landmark Tower GLB */}
      <primitive object={clone} scale={[1.2, 1.2, 1.2]} />

      {/* Floating Interactive Holographic Title HUD */}
      <group position={[0, 9.5, 9.2]}>
        <Text
          fontSize={0.9}
          color={isNear ? '#00f0ff' : '#c084fc'}
          anchorX="center"
          anchorY="middle"
        >
          CODE NEXUS // CITADEL
        </Text>
        <Text
          position={[0, -0.65, 0]}
          fontSize={0.38}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          {isNear ? '[ PRESS E OR CLICK TO ENTER ]' : 'PRIMARY ARCHITECTURAL LANDMARK'}
        </Text>
      </group>

      {/* Spire Aviation Warning Beacon Light */}
      <pointLight
        ref={beaconRef}
        color="#c084fc"
        intensity={3.5}
        distance={45}
        position={[0, 52, 0]}
      />

      {/* Entrance Atrium Warm Welcoming Light (Section 5) */}
      <pointLight color="#38bdf8" intensity={4.5} distance={18} position={[0, 3.5, 9.5]} />
      <pointLight color="#00f0ff" intensity={3.5} distance={14} position={[0, 1.2, 8.5]} />
    </group>
  );
}

// ========================================================
// 2. CURVED MEDIA MID-RISE (Ref B - Position -22, -14)
// ========================================================
function MediaTowerMidRise({
  isNear,
  onInteract,
}: {
  isNear: boolean;
  onInteract: () => void;
}) {
  const { scene } = useGLTF('/models/nexus-city/building_media_midrise.glb');
  const clone = useMemo(() => scene.clone(true), [scene]);

  const curvedScreenTex = useMemo(() => (typeof window !== 'undefined' ? getCurvedBillboardTexture() : null), []);
  const nexusBrandTex = useMemo(() => (typeof window !== 'undefined' ? getNexusBrandBillboardTexture() : null), []);

  return (
    <group position={[-22, 0, -14]} rotation={[0, Math.PI / 4, 0]} onClick={onInteract}>
      {/* Real 3D Mid-Rise GLB */}
      <primitive object={clone} />

      {/* High-Resolution Curved LED Display Panel (Ref Image B) */}
      <mesh position={[0, 10.5, 0]}>
        <cylinderGeometry args={[8.52, 8.52, 8.4, 24, 1, true, Math.PI * 0.25, Math.PI * 0.5]} />
        <meshStandardMaterial
          map={curvedScreenTex || undefined}
          emissive="#ffffff"
          emissiveIntensity={1.4}
          roughness={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Secondary Vertical Commercial Billboard */}
      <mesh position={[7.1, 14.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[8.5, 10.5]} />
        <meshStandardMaterial
          map={nexusBrandTex || undefined}
          emissive="#38bdf8"
          emissiveIntensity={1.8}
          roughness={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating District Label */}
      <group position={[0, 5.8, 7.2]}>
        <Text
          fontSize={0.7}
          color={isNear ? '#00f0ff' : '#38bdf8'}
          anchorX="center"
          anchorY="middle"
        >
          FLOWSYNC // MEDIA TOWER
        </Text>
      </group>

      {/* Ground Storefront Lighting */}
      <pointLight color="#38bdf8" intensity={3.5} distance={14} position={[0, 2.5, 6.5]} />
    </group>
  );
}

// ========================================================
// 3. CYBER COMPLEX (Ref B & C - Position 22, -14)
// ========================================================
function CyberComplexMidRise({
  isNear,
  onInteract,
}: {
  isNear: boolean;
  onInteract: () => void;
}) {
  const { scene } = useGLTF('/models/nexus-city/building_cyber_complex.glb');
  const clone = useMemo(() => scene.clone(true), [scene]);
  const elevatorRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (elevatorRef.current) {
      const time = performance.now() * 0.001;
      // Moving glass elevator cab running up and down the illuminated shaft
      elevatorRef.current.position.y = 2.5 + ((Math.sin(time * 0.8) + 1) / 2) * 17.5;
    }
  });

  return (
    <group position={[22, 0, -14]} rotation={[0, -Math.PI / 4, 0]} onClick={onInteract}>
      {/* Real 3D Complex GLB */}
      <primitive object={clone} />

      {/* Animated Elevator Cab */}
      <mesh ref={elevatorRef} position={[7.5, 2.5, 4.5]}>
        <boxGeometry args={[1.6, 2.0, 1.6]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.8} />
        <pointLight color="#00f0ff" intensity={2.5} distance={8} />
      </mesh>

      {/* District Label */}
      <group position={[0, 5.5, 6.8]}>
        <Text
          fontSize={0.7}
          color={isNear ? '#c084fc' : '#818cf8'}
          anchorX="center"
          anchorY="middle"
        >
          ECHO AI // NEURAL LAB
        </Text>
      </group>

      {/* Warm Entrance Colonnade Light */}
      <pointLight color="#fbbf24" intensity={3.0} distance={12} position={[-5, 2.2, 4]} />
    </group>
  );
}

// ========================================================
// 4. INDUSTRIAL CYBER BLOCK (Ref A & D - Position -20, 16)
// ========================================================
function IndustrialCyberBlock({
  isNear,
  onInteract,
}: {
  isNear: boolean;
  onInteract: () => void;
}) {
  const { scene } = useGLTF('/models/nexus-city/building_industrial_block.glb');
  const clone = useMemo(() => scene.clone(true), [scene]);
  const posterTex = useMemo(() => (typeof window !== 'undefined' ? getHologramPosterTexture('soups') : null), []);

  return (
    <group position={[-20, 0, 16]} rotation={[0, Math.PI / 4, 0]} onClick={onInteract}>
      {/* Real 3D Industrial Block GLB */}
      <primitive object={clone} />

      {/* Street Storefront Illuminated Menu Board */}
      <mesh position={[0, 2.2, 6.2]}>
        <planeGeometry args={[6.5, 1.4]} />
        <meshStandardMaterial
          map={posterTex || undefined}
          emissive="#ea580c"
          emissiveIntensity={2.0}
        />
      </mesh>

      {/* District Label */}
      <group position={[0, 5.2, 7.0]}>
        <Text
          fontSize={0.65}
          color={isNear ? '#f59e0b' : '#ea580c'}
          anchorX="center"
          anchorY="middle"
        >
          KINETIC // SUB-SECTOR 05
        </Text>
      </group>

      {/* Warm Golden Storefront Lantern Light (Ref Image 1 & 4) */}
      <pointLight color="#f59e0b" intensity={4.5} distance={14} position={[0, 2.8, 7.8]} />
      <pointLight color="#ef4444" intensity={2.5} distance={10} position={[3.2, 2.8, 7.8]} />
    </group>
  );
}

// ========================================================
// 5. COMMERCIAL ARCADE & CAPSULE SUITES (Position 20, 16)
// ========================================================
function CommercialArcadeBlock({
  isNear,
  onInteract,
}: {
  isNear: boolean;
  onInteract: () => void;
}) {
  const { scene } = useGLTF('/models/nexus-city/building_industrial_block.glb');
  const clone = useMemo(() => scene.clone(true), [scene]);
  const posterTex = useMemo(() => (typeof window !== 'undefined' ? getHologramPosterTexture('oasis') : null), []);

  return (
    <group position={[20, 0, 16]} rotation={[0, -Math.PI / 4, 0]} onClick={onInteract}>
      <primitive object={clone} />

      <mesh position={[0, 2.2, 6.2]}>
        <planeGeometry args={[6.5, 1.4]} />
        <meshStandardMaterial
          map={posterTex || undefined}
          emissive="#10b981"
          emissiveIntensity={2.0}
        />
      </mesh>

      <group position={[0, 5.2, 7.0]}>
        <Text
          fontSize={0.65}
          color={isNear ? '#34d399' : '#10b981'}
          anchorX="center"
          anchorY="middle"
        >
          LIVESYNC // MOBILE NETWORK
        </Text>
      </group>

      <pointLight color="#10b981" intensity={3.8} distance={14} position={[0, 2.8, 7.8]} />
    </group>
  );
}

// ========================================================
// 6. TRANSIT TERMINAL / WEST SKYBRIDGE HUB (Position -30, 0)
// ========================================================
function TransitTerminalHub({
  isNear,
  onInteract,
}: {
  isNear: boolean;
  onInteract: () => void;
}) {
  const facadeTex = useMemo(() => (typeof window !== 'undefined' ? getBuildingFacadeTexture('cyan') : null), []);

  return (
    <group position={[-30, 0, 0]} onClick={onInteract}>
      {/* Multi-Tier Building Mass */}
      <mesh position={[0, 8, 0]}>
        <boxGeometry args={[11, 16, 14]} />
        <meshStandardMaterial map={facadeTex || undefined} color="#0c1220" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Elevated Monorail Platform & Heavy Structural Pillars (Ref D) */}
      {[-4, 4].map((z) => (
        <mesh key={z} position={[6.5, 4.5, z]}>
          <cylinderGeometry args={[0.45, 0.55, 9, 8]} />
          <meshStandardMaterial color="#182032" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* Cantilevered Glass Transit Canopy */}
      <mesh position={[6.5, 9.2, 0]}>
        <boxGeometry args={[6.5, 0.4, 14.5]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.8} transparent opacity={0.8} />
      </mesh>

      <group position={[6.2, 5.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Text fontSize={0.65} color={isNear ? '#38bdf8' : '#60a5fa'} anchorX="center" anchorY="middle">
          ABOUT // TRANSIT HUB
        </Text>
      </group>

      <pointLight color="#38bdf8" intensity={3.5} distance={14} position={[6.5, 7.5, 0]} />
    </group>
  );
}

// ========================================================
// 7. CORPORATE TECH ANNEX (Position 30, 0)
// ========================================================
function CorporateTechAnnex({
  isNear,
  onInteract,
}: {
  isNear: boolean;
  onInteract: () => void;
}) {
  const facadeTex = useMemo(() => (typeof window !== 'undefined' ? getBuildingFacadeTexture('violet') : null), []);

  return (
    <group position={[30, 0, 0]} onClick={onInteract}>
      {/* Tower Mass */}
      <mesh position={[0, 10, 0]}>
        <boxGeometry args={[11, 20, 14]} />
        <meshStandardMaterial map={facadeTex || undefined} color="#0c1022" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Rooftop Helipad Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 20.1, 0]}>
        <ringGeometry args={[3.5, 4.2, 32]} />
        <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={2.5} />
      </mesh>

      <group position={[-6.2, 5.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <Text fontSize={0.65} color={isNear ? '#2dd4bf' : '#14b8a6'} anchorX="center" anchorY="middle">
          CONTACT // TELEMETRY ARRAY
        </Text>
      </group>

      <pointLight color="#14b8a6" intensity={3.5} distance={14} position={[-6.5, 4.5, 0]} />
    </group>
  );
}

// ========================================================
// 8. SOUTH BOULEVARD GATEWAY PYLONS (Position 0, 32)
// ========================================================
function SouthGatewayPylons({
  isNear,
  onInteract,
}: {
  isNear: boolean;
  onInteract: () => void;
}) {
  const panelsTex = useMemo(() => (typeof window !== 'undefined' ? getBuildingPanelsTexture() : null), []);

  return (
    <group position={[0, 0, 32]} onClick={onInteract}>
      {/* Twin Gateway Towers on both sides of the boulevard */}
      {[-9.5, 9.5].map((x) => (
        <group key={x} position={[x, 12, 0]}>
          <mesh>
            <boxGeometry args={[7, 24, 7]} />
            <meshStandardMaterial map={panelsTex || undefined} color="#0d111d" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Vertical Cyan Guidance Ribbon */}
          <mesh position={[x < 0 ? 3.55 : -3.55, 0, 0]}>
            <planeGeometry args={[0.4, 22]} />
            <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={2.5} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* Gateway Sky Arch Connection */}
      <mesh position={[0, 22, 0]}>
        <boxGeometry args={[26, 2.5, 5]} />
        <meshStandardMaterial color="#101726" metalness={0.9} roughness={0.2} />
      </mesh>

      <group position={[0, 8.5, -4]}>
        <Text fontSize={0.7} color={isNear ? '#f472b6' : '#ec4899'} anchorX="center" anchorY="middle">
          INNSPARK HQ // SOUTH GATE
        </Text>
      </group>

      <pointLight color="#ec4899" intensity={4.0} distance={18} position={[0, 10, 0]} />
    </group>
  );
}

// ========================================================
// MAIN DISTRICT BUILDINGS CONTAINER
// ========================================================
export const DistrictBuildings: React.FC<DistrictBuildingsProps> = ({
  playerPosRef,
  nearestDistrictId,
  onSelectDistrict,
  onEnterInterior,
}) => {
  const { effectiveTier } = usePerformanceQuality();
  const enableShadows = effectiveTier !== 'low';

  return (
    <group>
      {/* 1. Landmark Spire (Code Nexus Citadel) */}
      <GrandCitadelLandmark
        isNear={nearestDistrictId === 'code-nexus'}
        onInteract={() => {
          if (onEnterInterior) onEnterInterior('code-nexus');
          else onSelectDistrict('code-nexus');
        }}
        enableShadows={enableShadows}
      />

      {/* 2. Media Tower Mid-Rise (FlowSync HQ) */}
      <MediaTowerMidRise
        isNear={nearestDistrictId === 'flowsync'}
        onInteract={() => onSelectDistrict('flowsync')}
      />

      {/* 3. Cyber Complex Mid-Rise (Echo AI Lab) */}
      <CyberComplexMidRise
        isNear={nearestDistrictId === 'echo-desktop-ai'}
        onInteract={() => onSelectDistrict('echo-desktop-ai')}
      />

      {/* 4. Industrial Cyber Block (Logistics & Kinetic) */}
      <IndustrialCyberBlock
        isNear={nearestDistrictId === 'neon-kinetic'}
        onInteract={() => onSelectDistrict('neon-kinetic')}
      />

      {/* 5. Commercial Arcade & Capsule Suites (Mobile Network) */}
      <CommercialArcadeBlock
        isNear={nearestDistrictId === 'livesync'}
        onInteract={() => onSelectDistrict('livesync')}
      />

      {/* 6. Transit Terminal Hub (About Hub) */}
      <TransitTerminalHub
        isNear={nearestDistrictId === 'about-hub'}
        onInteract={() => onSelectDistrict('about-hub')}
      />

      {/* 7. Corporate Tech Annex (Contact Center) */}
      <CorporateTechAnnex
        isNear={nearestDistrictId === 'contact-hub'}
        onInteract={() => onSelectDistrict('contact-hub')}
      />

      {/* 8. South Gateway Pylons (InnSpark HQ) */}
      <SouthGatewayPylons
        isNear={nearestDistrictId === 'innspark-hq'}
        onInteract={() => onSelectDistrict('innspark-hq')}
      />
    </group>
  );
};

'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { WORLD_DISTRICTS, WorldDistrict } from './WorldConfig';

interface DistrictBuildingsProps {
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  nearestDistrictId: string | null;
  onSelectDistrict: (districtId: string) => void;
}

// Sub-component: The Central GitHub Code Nexus Citadel
function CodeNexusBuilding({
  district,
  isNear,
  onInteract,
}: {
  district: WorldDistrict;
  isNear: boolean;
  onInteract: () => void;
}) {
  const gyroRing1Ref = useRef<THREE.Group>(null);
  const gyroRing2Ref = useRef<THREE.Group>(null);
  const coreOrbRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (gyroRing1Ref.current) gyroRing1Ref.current.rotation.y += delta * 1.2;
    if (gyroRing2Ref.current) gyroRing2Ref.current.rotation.x += delta * 0.9;
    if (coreOrbRef.current) {
      coreOrbRef.current.rotation.z += delta * 0.7;
      const mat = coreOrbRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = isNear ? 2.5 : 1.4 + Math.sin(Date.now() * 0.003) * 0.4;
      }
    }
  });

  return (
    <group position={[district.x, 0, district.z]} onClick={onInteract}>
      {/* Stepped Cyber-Pyramid Base Platform */}
      <mesh position={[0, 0.4, 0]} receiveShadow>
        <cylinderGeometry args={[6.5, 7.5, 0.8, 8]} />
        <meshStandardMaterial color="#0c0a1f" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.2, 0]} receiveShadow>
        <cylinderGeometry args={[5, 6, 0.8, 8]} />
        <meshStandardMaterial color="#171336" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Glowing Neon Ground Portal Pad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.62, 0]}>
        <ringGeometry args={[1.8, 3.8, 32]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={isNear ? 2.8 : 1.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 4 Quantum Energy Pylons at Corners */}
      {[-3.2, 3.2].map((px) =>
        [-3.2, 3.2].map((pz) => (
          <group key={`${px}-${pz}`} position={[px, 4, pz]}>
            <mesh castShadow>
              <boxGeometry args={[0.7, 6, 0.7]} />
              <meshStandardMaterial color="#1e1b4b" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 3.2, 0]}>
              <octahedronGeometry args={[0.35, 0]} />
              <meshStandardMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={2} />
            </mesh>
          </group>
        ))
      )}

      {/* Central Floating Nexus Core with Gyro Rings */}
      <group position={[0, 5.5, 0]}>
        {/* Core Git / Octocat Energy Orb */}
        <mesh ref={coreOrbRef}>
          <dodecahedronGeometry args={[1.2, 1]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={1.8}
            roughness={0.1}
          />
        </mesh>

        {/* Gyroscopic Rotating Rings */}
        <group ref={gyroRing1Ref}>
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[2.2, 0.08, 16, 48]} />
            <meshStandardMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={1.5} />
          </mesh>
        </group>
        <group ref={gyroRing2Ref}>
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <torusGeometry args={[2.8, 0.08, 16, 48]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.2} />
          </mesh>
        </group>

        {/* Dynamic Light Beam */}
        <pointLight color="#8b5cf6" intensity={isNear ? 8 : 4} distance={22} />
      </group>

      {/* Floating 3D Text Header */}
      <Float speed={2.5} rotationIntensity={0.1} floatIntensity={0.4}>
        <Text
          position={[0, 11, 0]}
          fontSize={1.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {district.name}
        </Text>
        <Text
          position={[0, 9.8, 0]}
          fontSize={0.55}
          color="#c084fc"
          anchorX="center"
          anchorY="middle"
        >
          [ ENTER PORTAL // INTERACTIVE REPO BUILDER ]
        </Text>
      </Float>
    </group>
  );
}

// Sub-component: Individual Specialized District Landmark
function DistrictTower({
  district,
  isNear,
  onInteract,
}: {
  district: WorldDistrict;
  isNear: boolean;
  onInteract: () => void;
}) {
  const featureMeshRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (featureMeshRef.current) {
      featureMeshRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group position={[district.x, 0, district.z]} onClick={onInteract}>
      {/* Ground Plaza Base */}
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <cylinderGeometry args={[district.width * 0.85, district.width, 0.5, 8]} />
        <meshStandardMaterial color="#0b0f19" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Glowing Neon Proximity Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.52, 0]}>
        <ringGeometry args={[district.width * 0.75, district.width * 0.85, 32]} />
        <meshStandardMaterial
          color={district.color}
          emissive={district.color}
          emissiveIntensity={isNear ? 2.5 : 0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main Architectural Skyscraper */}
      <mesh position={[0, district.height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[district.width, district.height, district.depth]} />
        <meshStandardMaterial
          color={isNear ? district.secondaryColor : '#090d16'}
          roughness={0.25}
          metalness={0.8}
          emissive={district.color}
          emissiveIntensity={isNear ? 0.35 : 0.08}
        />
      </mesh>

      {/* Emissive Vertical Laser Beacons along corners */}
      <mesh position={[district.width / 2, district.height / 2, district.depth / 2]}>
        <cylinderGeometry args={[0.08, 0.08, district.height, 8]} />
        <meshStandardMaterial color={district.accentColor} emissive={district.accentColor} emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[-district.width / 2, district.height / 2, district.depth / 2]}>
        <cylinderGeometry args={[0.08, 0.08, district.height, 8]} />
        <meshStandardMaterial color={district.accentColor} emissive={district.accentColor} emissiveIntensity={1.5} />
      </mesh>

      {/* Emissive Architectural Window Strips */}
      <mesh position={[0, district.height * 0.7, district.depth / 2 + 0.04]}>
        <planeGeometry args={[district.width * 0.8, 1.4]} />
        <meshStandardMaterial
          color={district.color}
          emissive={district.color}
          emissiveIntensity={isNear ? 1.6 : 0.9}
        />
      </mesh>
      <mesh position={[0, district.height * 0.4, district.depth / 2 + 0.04]}>
        <planeGeometry args={[district.width * 0.8, 1.4]} />
        <meshStandardMaterial
          color={district.color}
          emissive={district.color}
          emissiveIntensity={isNear ? 1.4 : 0.7}
        />
      </mesh>

      {/* District-Specific Procedural Floating Landmark on Rooftop */}
      <group
        ref={featureMeshRef}
        position={[0, district.height + 2.4, 0]}
      >
        {district.id === 'flowsync' && (
          // FlowSync: Floating interactive task board octahedron & socket connection matrix
          <group>
            <mesh>
              <octahedronGeometry args={[1.4, 0]} />
              <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={1.8} wireframe />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.6, 16, 16]} />
              <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
            </mesh>
          </group>
        )}

        {district.id === 'echo-desktop-ai' && (
          // Echo AI Lab: Floating neural core & browser extension badges
          <group>
            <mesh>
              <icosahedronGeometry args={[1.3, 1]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} wireframe />
            </mesh>
            {/* Satellite Nodes */}
            <mesh position={[1.8, 0, 0]}>
              <sphereGeometry args={[0.3, 12, 12]} />
              <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.8} />
            </mesh>
            <mesh position={[-1.8, 0, 0]}>
              <sphereGeometry args={[0.3, 12, 12]} />
              <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={1.8} />
            </mesh>
          </group>
        )}

        {district.id === 'livesync' && (
          // Mobile Network: Floating mobile device frame with BLE beacon ring
          <group>
            <mesh>
              <boxGeometry args={[1.2, 2.0, 0.15]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0.09]}>
              <planeGeometry args={[1.0, 1.7]} />
              <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={1.6} />
            </mesh>
            {/* Pulsing BLE Beacon Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.8, 0.05, 12, 32]} />
              <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={2} />
            </mesh>
          </group>
        )}

        {district.id === 'alphapulse-stock-ai' && (
          // AI Analytics: 3D Candlestick & neural chart array
          <group>
            <mesh position={[-0.8, 0, 0]}>
              <boxGeometry args={[0.3, 1.8, 0.3]} />
              <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2} />
            </mesh>
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[0.3, 2.4, 0.3]} />
              <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2} />
            </mesh>
            <mesh position={[0.8, -0.3, 0]}>
              <boxGeometry args={[0.3, 1.2, 0.3]} />
              <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={2} />
            </mesh>
          </group>
        )}

        {district.id === 'neon-kinetic' && (
          // Logistics Garage: Futuristic GPS cyber vehicle model
          <group>
            <mesh>
              <boxGeometry args={[2.2, 0.6, 1.2]} />
              <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.4} />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <coneGeometry args={[0.5, 1.2, 4]} />
              <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
            </mesh>
          </group>
        )}

        {district.id === 'innspark-hq' && (
          // InnSpark HQ: Double-helix corporate spire with production crystal
          <group>
            <mesh>
              <torusKnotGeometry args={[1.0, 0.22, 64, 16]} />
              <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={1.6} />
            </mesh>
          </group>
        )}

        {district.id === 'about-hub' && (
          // About Hub: Geodesic bio-dome crystal
          <group>
            <mesh>
              <dodecahedronGeometry args={[1.4, 0]} />
              <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1.8} wireframe />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.7, 16, 16]} />
              <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={1.6} />
            </mesh>
          </group>
        )}

        {district.id === 'contact-hub' && (
          // Contact Center: Multi-dish communication transmission array
          <group>
            <mesh rotation={[0.4, 0, 0]}>
              <cylinderGeometry args={[1.4, 0.2, 0.4, 16]} />
              <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={1.6} />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 2.4, 8]} />
              <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={2} />
            </mesh>
          </group>
        )}
      </group>

      {/* Floating 3D Text Billboard Labels */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.4}>
        <Text
          position={[0, district.height + 5.5, 0]}
          fontSize={1.05}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {district.name}
        </Text>
        <Text
          position={[0, district.height + 4.3, 0]}
          fontSize={0.52}
          color={district.accentColor}
          anchorX="center"
          anchorY="middle"
        >
          {district.category}
        </Text>
      </Float>

      {/* Waypoint Light Pillar */}
      <pointLight
        position={[0, district.height * 0.6, 0]}
        color={district.color}
        intensity={isNear ? 7 : 3}
        distance={20}
      />
    </group>
  );
}

export const DistrictBuildings: React.FC<DistrictBuildingsProps> = ({
  playerPosRef,
  nearestDistrictId,
  onSelectDistrict,
}) => {
  return (
    <group>
      {WORLD_DISTRICTS.map((d) => {
        const isNear = d.id === nearestDistrictId;

        if (d.id === 'code-nexus') {
          return (
            <CodeNexusBuilding
              key={d.id}
              district={d}
              isNear={isNear}
              onInteract={() => onSelectDistrict(d.id)}
            />
          );
        }

        return (
          <DistrictTower
            key={d.id}
            district={d}
            isNear={isNear}
            onInteract={() => onSelectDistrict(d.id)}
          />
        );
      })}
    </group>
  );
};

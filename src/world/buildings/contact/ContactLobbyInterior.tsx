'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getSharedContactMaterials } from './ContactMaterials';

interface ContactLobbyInteriorProps {
  onNodeClick?: (nodeId: string) => void;
}

/**
 * ContactLobbyInterior (Phase 2.6)
 * Double-height transparent communication lobby featuring:
 * 1. Suspended holographic communication globe with latitude/longitude rings
 * 2. Lightweight animated orbital connection rings & network nodes (GitHub, LinkedIn, Web, Email)
 * 3. Glowing curved panoramic digital transmission media wall (faithful to media_1794848606156_715033af.jpg)
 * 4. Architectural reception console & waiting lounge with floor LED uplights
 * 5. Single lightweight useFrame animation loop for 60+ FPS stability
 */
export const ContactLobbyInterior: React.FC<ContactLobbyInteriorProps> = ({ onNodeClick }) => {
  const materials = getSharedContactMaterials();
  const globeGroupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);

  // Single unified frame update for holographic globe and orbital communication nodes
  useFrame((_, delta) => {
    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.y += delta * 0.35;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.5;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x += delta * 0.4;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y -= delta * 0.45;
    }
  });

  return (
    <group name="contact_lobby_interior" position={[0, 0, 0]}>
      {/* 1. Double-height lobby floor */}
      <mesh position={[0, 0.28, 0]} receiveShadow>
        <cylinderGeometry args={[10.5, 10.5, 0.08, 32]} />
        <primitive object={materials.granitePodium} attach="material" />
      </mesh>

      {/* 2. Panoramic Curved Digital Transmission Ribbon (Lobby Back Wall) */}
      {/* Cylindrical arc following reference photo media_1794848606156_715033af.jpg */}
      <group position={[0, 4.2, 2.5]}>
        <mesh rotation={[0, Math.PI, 0]}>
          <cylinderGeometry
            args={[9.5, 9.5, 5.0, 32, 1, true, -Math.PI * 0.42, Math.PI * 0.84]}
          />
          <primitive object={materials.mediaRibbon} attach="material" />
        </mesh>
      </group>

      {/* 3. Suspended Holographic Communication Globe & Orbital Network (Requirement 8) */}
      <group position={[0, 4.8, -1.5]}>
        {/* Overhead suspension mount */}
        <mesh position={[0, 4.2, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 3.2, 8]} />
          <primitive object={materials.structuralColumns} attach="material" />
        </mesh>

        {/* Central Holographic Globe */}
        <group ref={globeGroupRef}>
          {/* Wireframe outer sphere */}
          <mesh>
            <sphereGeometry args={[1.5, 16, 12]} />
            <primitive object={materials.hologramGlobe} attach="material" />
          </mesh>

          {/* Solid core with subtle transparency */}
          <mesh>
            <sphereGeometry args={[1.1, 16, 12]} />
            <meshBasicMaterial
              color="#0284c7"
              transparent
              opacity={0.35}
              wireframe={false}
            />
          </mesh>

          {/* Network Communication Markers (4 Key Vertices) */}
          {/* Node 1: GitHub */}
          <mesh position={[1.2, 0.6, 0.5]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <primitive object={materials.networkNode} attach="material" />
          </mesh>
          {/* Node 2: LinkedIn */}
          <mesh position={[-1.1, -0.4, 0.7]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <primitive object={materials.networkNode} attach="material" />
          </mesh>
          {/* Node 3: Portfolio Web */}
          <mesh position={[0.4, -0.9, -1.0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <primitive object={materials.networkNode} attach="material" />
          </mesh>
          {/* Node 4: Email Inquiries */}
          <mesh position={[-0.5, 1.1, -0.8]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <primitive object={materials.networkNode} attach="material" />
          </mesh>
        </group>

        {/* Orbital Communication Rings */}
        {/* Ring 1: Equatorial tilted ring */}
        <group ref={ring1Ref} rotation={[0.4, 0.2, 0]}>
          <mesh>
            <torusGeometry args={[2.2, 0.025, 8, 48]} />
            <primitive object={materials.hologramRing} attach="material" />
          </mesh>
          {/* Orbiting data beacon */}
          <mesh position={[2.2, 0, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <primitive object={materials.networkNode} attach="material" />
          </mesh>
        </group>

        {/* Ring 2: Polar orbital ring */}
        <group ref={ring2Ref} rotation={[0, 0.5, 0.8]}>
          <mesh>
            <torusGeometry args={[2.5, 0.025, 8, 48]} />
            <primitive object={materials.hologramRing} attach="material" />
          </mesh>
          <mesh position={[0, 2.5, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <primitive object={materials.networkNode} attach="material" />
          </mesh>
        </group>

        {/* Ring 3: Wide outer connection ring */}
        <group ref={ring3Ref} rotation={[-0.6, 0.3, -0.3]}>
          <mesh>
            <torusGeometry args={[2.8, 0.02, 8, 48]} />
            <primitive object={materials.hologramRing} attach="material" />
          </mesh>
        </group>
      </group>

      {/* 4. Architectural Reception Desk & Forecourt Lounge */}
      <group position={[0, 0.3, -5.2]}>
        {/* Curved reception counter */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[2.8, 3.0, 1.1, 24, 1, true, -Math.PI * 0.35, Math.PI * 0.7]} />
          <primitive object={materials.structuralGraphite} attach="material" />
        </mesh>
        {/* Countertop */}
        <mesh position={[0, 1.12, 0]}>
          <cylinderGeometry args={[2.9, 2.9, 0.06, 24, 1, false, -Math.PI * 0.36, Math.PI * 0.72]} />
          <primitive object={materials.structuralColumns} attach="material" />
        </mesh>
        {/* Under-counter cyan LED edge */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[3.02, 3.02, 0.04, 24, 1, true, -Math.PI * 0.35, Math.PI * 0.7]} />
          <primitive object={materials.cyanAccentGlow} attach="material" />
        </mesh>
      </group>

      {/* 5. Sleek Lobby Planters & Waiting Lounges */}
      <group position={[-5.5, 0.3, -3.0]}>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[1.2, 0.7, 3.2]} />
          <primitive object={materials.structuralGraphite} attach="material" />
        </mesh>
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[0.9, 0.15, 2.9]} />
          <meshStandardMaterial color="#059669" roughness={0.8} />
        </mesh>
      </group>

      <group position={[5.5, 0.3, -3.0]}>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[1.2, 0.7, 3.2]} />
          <primitive object={materials.structuralGraphite} attach="material" />
        </mesh>
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[0.9, 0.15, 2.9]} />
          <meshStandardMaterial color="#059669" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

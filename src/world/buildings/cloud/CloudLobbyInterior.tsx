'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getSharedCloudMaterials } from './CloudMaterials';
import { CLOUD_HUB_METADATA } from './cloudMetadata';

interface CloudLobbyInteriorProps {
  onSelectZone?: (zoneId: string) => void;
}

/**
 * CloudLobbyInterior (Phase 2.8)
 * 
 * Double-height entrance lobby featuring:
 * 1. Holographic System Architecture Display:
 *    Frontend Applications → API Layer → Backend Services → Database / Firebase → Deployment Infrastructure
 *    Connected with glowing holographic laser conduits and animated data packets.
 * 2. Suspended architectural viaduct bridge across the atrium.
 * 3. Production server rack arrays along the rear wall with blinking status LEDs.
 * 4. Executive welcome counter with illuminated cyan accent glow.
 * 5. Single lightweight useFrame animation loop maintaining 60+ FPS.
 */
export const CloudLobbyInterior: React.FC<CloudLobbyInteriorProps> = ({ onSelectZone }) => {
  const materials = getSharedCloudMaterials();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Animation refs for holographic architecture pipeline & data flow
  const dataPacketGroupRef = useRef<THREE.Group>(null);
  const serverLedsRef = useRef<THREE.PointLight>(null);
  const centralCloudGroupRef = useRef<THREE.Group>(null);
  const nodePointersRef = useRef<THREE.Group[]>([]);

  // The 5 interconnected pipeline stages
  const pipelineNodes = [
    {
      id: 'frontend-apps',
      name: '1. Frontend Applications',
      subtitle: 'React • Next.js • React Native',
      pos: [-6.0, 1.2, 0.5] as [number, number, number],
      color: '#38bdf8',
    },
    {
      id: 'api-layer',
      name: '2. API Layer & Gateway',
      subtitle: 'REST APIs • Auth Middleware',
      pos: [-3.0, 1.6, -0.8] as [number, number, number],
      color: '#00f0ff',
    },
    {
      id: 'backend-services',
      name: '3. Backend Services',
      subtitle: 'Node.js • Event Loop • Workers',
      pos: [0.0, 2.0, 0.8] as [number, number, number],
      color: '#a855f7',
    },
    {
      id: 'database-firebase',
      name: '4. Database / Firebase',
      subtitle: 'Firestore • Auth • PostgreSQL',
      pos: [3.0, 1.6, -0.8] as [number, number, number],
      color: '#10b981',
    },
    {
      id: 'deployment-infra',
      name: '5. Deployment Infra',
      subtitle: 'Vercel • CI/CD • Docker',
      pos: [6.0, 1.2, 0.5] as [number, number, number],
      color: '#0284c7',
    },
  ];

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Subtle floating breathing effect on central cloud feature
    if (centralCloudGroupRef.current) {
      centralCloudGroupRef.current.position.y = 4.2 + Math.sin(t * 1.5) * 0.12;
      centralCloudGroupRef.current.rotation.y += delta * 0.35;
    }

    // Server rack LEDs blinking rhythm
    if (serverLedsRef.current) {
      serverLedsRef.current.intensity = 1.2 + Math.sin(t * 3.5) * 0.35;
    }

    // Animate data packets flowing along pipeline
    if (dataPacketGroupRef.current) {
      dataPacketGroupRef.current.children.forEach((child, idx) => {
        const offset = idx * 0.25;
        const cycle = ((t * 0.6 + offset) % 1.0);
        // Lerp between nodes 0 to 4
        const totalSegments = pipelineNodes.length - 1;
        const segmentProgress = cycle * totalSegments;
        const segmentIdx = Math.floor(segmentProgress);
        const subT = segmentProgress - segmentIdx;

        if (segmentIdx < totalSegments) {
          const p1 = pipelineNodes[segmentIdx].pos;
          const p2 = pipelineNodes[segmentIdx + 1].pos;
          child.position.x = p1[0] + (p2[0] - p1[0]) * subT;
          child.position.y = p1[1] + (p2[1] - p1[1]) * subT + Math.sin(subT * Math.PI) * 0.35;
          child.position.z = p1[2] + (p2[2] - p1[2]) * subT;
        }
      });
    }
  });

  return (
    <group name="cloud_lobby_interior" position={[0, 0, 0]}>
      {/* 1. Interior Polished Ground Floor (Y = 0.25m) */}
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <boxGeometry args={[20.5, 0.05, 20.5]} />
        <meshStandardMaterial color="#0b1329" roughness={0.15} metalness={0.7} />
      </mesh>

      {/* Recessed Ground LED Floor Guideway */}
      <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.5, 5.65, 32]} />
        <primitive object={materials.cyanNeonGlow} attach="material" />
      </mesh>

      {/* 2. Suspended Architectural Bridge across Double-Height Atrium (Y = 4.2m) */}
      <group position={[0, 4.2, -1.0]}>
        <mesh receiveShadow>
          <boxGeometry args={[18.0, 0.25, 2.6]} />
          <primitive object={materials.structuralSilver} attach="material" />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[17.6, 0.2, 2.2]} />
          <primitive object={materials.titaniumGraphite} attach="material" />
        </mesh>
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
        <mesh position={[0, -0.36, 0]}>
          <boxGeometry args={[16.0, 0.04, 0.15]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
      </group>

      {/* 3. Central Overhead Suspended Holographic Cloud Emblem */}
      <group ref={centralCloudGroupRef} position={[0, 4.2, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.7, 16, 16]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
        <mesh position={[-0.6, -0.15, 0]}>
          <sphereGeometry args={[0.5, 14, 14]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
        <mesh position={[0.6, -0.15, 0]}>
          <sphereGeometry args={[0.52, 14, 14]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
        <pointLight color="#00f0ff" intensity={1.8} distance={10.0} />
      </group>

      {/* =========================================================================
          4. HOLOGRAPHIC SYSTEM ARCHITECTURE DISPLAY:
          Frontend Applications → API Layer → Backend Services → Database / Firebase → Deployment Infrastructure
          ========================================================================= */}
      <group name="holographic_architecture_pipeline">
        {/* Laser Data Conduits connecting the 5 stages */}
        {pipelineNodes.slice(0, -1).map((curr, idx) => {
          const next = pipelineNodes[idx + 1];
          const midX = (curr.pos[0] + next.pos[0]) / 2;
          const midY = (curr.pos[1] + next.pos[1]) / 2;
          const midZ = (curr.pos[2] + next.pos[2]) / 2;
          const dx = next.pos[0] - curr.pos[0];
          const dy = next.pos[1] - curr.pos[1];
          const dz = next.pos[2] - curr.pos[2];
          const length = Math.hypot(dx, dy, dz);

          // Compute rotation to align cylinder with conduit vector
          const rotY = Math.atan2(dx, dz);
          const rotX = -Math.atan2(dy, Math.hypot(dx, dz));

          return (
            <group key={`conduit-${idx}`} position={[midX, midY, midZ]} rotation={[rotX, rotY, 0]}>
              {/* Outer Translucent Energy Sheath */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.045, 0.045, length, 8, 1, true]} />
                <meshBasicMaterial color="#00f0ff" transparent opacity={0.45} />
              </mesh>
              {/* Inner Glowing Laser Core */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.015, 0.015, length, 8]} />
                <primitive object={materials.cyanNeonGlow} attach="material" />
              </mesh>
            </group>
          );
        })}

        {/* Dynamic Animated Data Packets Traveling Along Pipeline */}
        <group ref={dataPacketGroupRef}>
          {[0, 1, 2, 3].map((pIdx) => (
            <mesh key={`packet-${pIdx}`} position={[0, 0, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}
        </group>

        {/* The 5 Interactive System Nodes */}
        {pipelineNodes.map((node) => {
          const isHovered = hoveredNode === node.id;

          return (
            <group
              key={node.id}
              position={node.pos}
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectZone) onSelectZone(node.id);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredNode(node.id);
                if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                setHoveredNode(null);
                if (typeof document !== 'undefined') document.body.style.cursor = 'auto';
              }}
            >
              {/* Pedestal Base Plinth */}
              <mesh position={[0, -0.6, 0]}>
                <cylinderGeometry args={[0.65, 0.75, 0.8, 16]} />
                <primitive object={materials.titaniumGraphite} attach="material" />
              </mesh>

              {/* Glowing Base Halo Ring */}
              <mesh position={[0, -0.19, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.68, 0.8, 24]} />
                <meshBasicMaterial color={node.color} transparent opacity={isHovered ? 0.95 : 0.55} />
              </mesh>

              {/* Floating Holographic Node Disc */}
              <mesh position={[0, 0, 0]} rotation={[-Math.PI / 6, 0, 0]}>
                <cylinderGeometry args={[0.55, 0.55, 0.08, 24]} />
                <meshStandardMaterial
                  color={node.color}
                  emissive={node.color}
                  emissiveIntensity={isHovered ? 1.6 : 0.8}
                  roughness={0.2}
                />
              </mesh>

              {/* Holographic Beacon Sphere */}
              <mesh position={[0, 0.35, 0]}>
                <sphereGeometry args={[0.14, 12, 12]} />
                <meshBasicMaterial color={isHovered ? '#ffffff' : node.color} />
              </mesh>

              {/* Hover Highlight Ring */}
              {isHovered && (
                <mesh position={[0, 0.35, 0]}>
                  <ringGeometry args={[0.22, 0.28, 24]} />
                  <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
                </mesh>
              )}
            </group>
          );
        })}
      </group>

      {/* 5. Production Server Rack Arrays along the Rear Wall (Z = -7.5) */}
      <group position={[0, 0.25, -7.5]}>
        {[-6.0, -4.2, -2.4, 2.4, 4.2, 6.0].map((rx, idx) => (
          <group key={`server-${idx}`} position={[rx, 1.6, 0]}>
            <mesh receiveShadow>
              <boxGeometry args={[1.5, 3.2, 0.8]} />
              <primitive object={materials.titaniumGraphite} attach="material" />
            </mesh>
            <mesh position={[0, 0, 0.41]}>
              <planeGeometry args={[1.4, 3.0]} />
              <primitive object={materials.serverRackMat} attach="material" />
            </mesh>
            <mesh position={[0, 1.65, 0]}>
              <boxGeometry args={[1.3, 0.1, 0.6]} />
              <primitive object={materials.roofMechanicalMat} attach="material" />
            </mesh>
          </group>
        ))}

        <mesh position={[0, 3.4, 0]}>
          <boxGeometry args={[14.0, 0.12, 0.6]} />
          <primitive object={materials.structuralSilver} attach="material" />
        </mesh>

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
        <mesh position={[0, 0.55, 0]} receiveShadow>
          <boxGeometry args={[3.6, 1.1, 1.2]} />
          <primitive object={materials.titaniumGraphite} attach="material" />
        </mesh>
        <mesh position={[0, 0.55, 0.62]}>
          <boxGeometry args={[3.2, 0.08, 0.05]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
        <mesh position={[0, 1.12, 0]}>
          <boxGeometry args={[3.8, 0.08, 1.3]} />
          <primitive object={materials.polishedSilver} attach="material" />
        </mesh>
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

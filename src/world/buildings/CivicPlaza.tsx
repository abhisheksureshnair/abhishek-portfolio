'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getSharedCityMaterials } from './BuildingArchetypes';

interface CivicPlazaProps {
  position?: [number, number, number];
}

/**
 * PHASE 2.8 — Central Civic Plaza & Urban Commons at [-40, -40] (block-0-0)
 * 
 * High-quality modern urban gathering space featuring:
 * 1. High-quality concrete and stone paving with concentric geometric flagstone patterns
 * 2. Central architectural sculpture & reflecting water basin:
 *    - Polished stainless steel & bronze twisting geometric Möbius sculpture
 * 3. Subtle ground LED lighting strips integrated flush into paving
 * 4. Directional signage monoliths pointing toward surrounding central landmarks
 * 5. Integrated modern curved architectural seating benches with warm under-bench lighting
 * 6. Accessible pedestrian pathways connecting seamlessly to adjacent sidewalks
 * 7. Clear sightlines to surrounding landmarks (HQ, Skills, About, Innovation, Cloud, etc.)
 */
export const CivicPlaza: React.FC<CivicPlazaProps> = ({
  position = [-40.0, 0, -40.0],
}) => {
  const materials = getSharedCityMaterials();
  const sculptureRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (sculptureRef.current) {
      sculptureRef.current.rotation.y += delta * 0.25;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
      ringRef.current.rotation.z += delta * 0.35;
    }
  });

  return (
    <group name="central_civic_plaza" position={position}>
      {/* =========================================================================
          1. HIGH-QUALITY ARCHITECTURAL CONCRETE & STONE PAVING PLINTH
          (23.6m x 23.6m at Y = 0.12m, top surface flush at Y = 0.24m)
          ========================================================================= */}
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[23.6, 0.24, 23.6]} />
        <primitive object={materials.flutedStone} attach="material" />
      </mesh>

      {/* Perimeter Beveled Basalt Border Frame */}
      <mesh position={[0, 0.245, 0]} receiveShadow>
        <ringGeometry args={[9.5, 11.5, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Inner Concentric Light Granite Walkway Ring */}
      <mesh position={[0, 0.246, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[4.2, 9.4, 48]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.65} metalness={0.15} />
      </mesh>

      {/* Center Dark Granite Pool Surround */}
      <mesh position={[0, 0.247, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[4.15, 36]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* =========================================================================
          2. SUBTLE GROUND LIGHTING INTEGRATED INTO PAVING
          Linear embedded LED accent strips connecting entries to center pool
          ========================================================================= */}
      {/* North-South Linear Ground LED Strips */}
      <mesh position={[0, 0.25, -7.0]}>
        <boxGeometry args={[0.08, 0.02, 5.5]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[0, 0.25, 7.0]}>
        <boxGeometry args={[0.08, 0.02, 5.5]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* East-West Linear Ground LED Strips */}
      <mesh position={[-7.0, 0.25, 0]}>
        <boxGeometry args={[5.5, 0.02, 0.08]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[7.0, 0.25, 0]}>
        <boxGeometry args={[5.5, 0.02, 0.08]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Diagonal Inset LED Navigation Nodes */}
      {[-6.2, 6.2].map((nx) =>
        [-6.2, 6.2].map((nz) => (
          <mesh key={`led-node-${nx}-${nz}`} position={[nx, 0.25, nz]}>
            <cylinderGeometry args={[0.15, 0.15, 0.02, 12]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
        ))
      )}

      {/* =========================================================================
          3. CENTRAL ARCHITECTURAL SCULPTURE & REFLECTING WATER BASIN
          Twisting geometric Möbius infinity sculpture on a circular pedestal
          ========================================================================= */}
      <group position={[0, 0.24, 0]}>
        {/* Circular Basalt Water Basin Rim (Diameter 7.2m, Height 0.45m) */}
        <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[3.6, 3.8, 0.44, 36]} />
          <primitive object={materials.flutedStone} attach="material" />
        </mesh>

        {/* Reflecting Pool Water Surface */}
        <mesh position={[0, 0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3.4, 36]} />
          <primitive object={materials.corporateGlass} attach="material" />
        </mesh>

        {/* Submerged Waterproof Aquatic Lighting */}
        <pointLight color="#38bdf8" intensity={1.8} distance={8.0} position={[0, 0.45, 0]} />

        {/* Central Geometric Pedestal Plinth */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <cylinderGeometry args={[1.2, 1.4, 0.4, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.8, 1.0, 0.2, 24]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Dynamic Architectural Sculpture: Interlocking Polished Metallic Arcs */}
        <group ref={sculptureRef} position={[0, 2.2, 0]}>
          {/* Main Brushed Stainless Steel Möbius Loop */}
          <mesh castShadow>
            <torusGeometry args={[1.2, 0.12, 16, 64]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.12} />
          </mesh>

          {/* Interlocking Anodized Bronze Arch */}
          <mesh rotation={[Math.PI / 2.2, Math.PI / 4, 0]} castShadow>
            <torusGeometry args={[1.05, 0.1, 16, 64]} />
            <meshStandardMaterial color="#d97706" metalness={0.88} roughness={0.18} />
          </mesh>

          {/* Kinetic Gimbal Inner Ring */}
          <mesh ref={ringRef} rotation={[0, Math.PI / 3, Math.PI / 4]}>
            <torusGeometry args={[0.75, 0.06, 12, 48]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.8} />
          </mesh>

          {/* Core Illuminated Energy Sphere */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>

      {/* =========================================================================
          4. DIRECTIONAL SIGNAGE MONOLITHS
          Pointing toward surrounding landmarks with crisp illuminated typography
          ========================================================================= */}
      {/* South Directory Plinth (Facing visitors entering from South Avenue X=-20) */}
      <group position={[0, 0.24, 9.8]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[2.2, 1.5, 0.35]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 1.52, 0]}>
          <boxGeometry args={[2.25, 0.05, 0.38]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.2} />
        </mesh>
        {/* Directional Guide Plaque */}
        <mesh position={[0, 0.75, -0.19]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.0, 1.3]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
      </group>

      {/* East Directory Plinth (Facing visitors entering from East Street Z=-20) */}
      <group position={[9.8, 0.24, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[2.2, 1.5, 0.35]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 1.52, 0]}>
          <boxGeometry args={[2.25, 0.05, 0.38]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.2} />
        </mesh>
      </group>

      {/* =========================================================================
          5. INTEGRATED SEATING AREAS & MODERN BENCHES
          Modern curved granite benches with teak wood slats & warm under-bench glow
          ========================================================================= */}
      {[
        { pos: [-6.8, 0.24, -6.8], rot: Math.PI / 4 },
        { pos: [6.8, 0.24, -6.8], rot: -Math.PI / 4 },
        { pos: [-6.8, 0.24, 6.8], rot: (3 * Math.PI) / 4 },
        { pos: [6.8, 0.24, 6.8], rot: -(3 * Math.PI) / 4 },
        { pos: [0, 0.24, -7.8], rot: 0 },
        { pos: [0, 0.24, 7.8], rot: 0 },
        { pos: [-7.8, 0.24, 0], rot: Math.PI / 2 },
        { pos: [7.8, 0.24, 0], rot: Math.PI / 2 },
      ].map((bench, idx) => (
        <group key={`plaza-bench-${idx}`} position={bench.pos as [number, number, number]} rotation={[0, bench.rot, 0]}>
          {/* Concrete Plinth Supports */}
          <mesh position={[-0.8, 0.22, 0]}>
            <boxGeometry args={[0.25, 0.44, 0.5]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.2} />
          </mesh>
          <mesh position={[0.8, 0.22, 0]}>
            <boxGeometry args={[0.25, 0.44, 0.5]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.2} />
          </mesh>
          {/* Teak Wood Slat Bench Top */}
          <mesh position={[0, 0.46, 0]} receiveShadow>
            <boxGeometry args={[2.0, 0.08, 0.6]} />
            <meshStandardMaterial color="#78350f" roughness={0.4} metalness={0.1} />
          </mesh>
          {/* Recessed Under-bench Warm LED Strip */}
          <mesh position={[0, 0.41, 0]}>
            <boxGeometry args={[1.6, 0.02, 0.06]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        </group>
      ))}

      {/* =========================================================================
          6. ACCESSIBLE PEDESTRIAN PATHWAY CURB RAMPS
          Connecting plaza seamlessly to sidewalks at X = -25 and Z = -25
          ========================================================================= */}
      {/* East Entrance Ramp to Avenue sidewalk */}
      <mesh position={[11.85, 0.12, 0]} receiveShadow>
        <boxGeometry args={[0.3, 0.24, 4.0]} />
        <meshStandardMaterial color="#334155" roughness={0.8} metalness={0.1} />
      </mesh>
      {/* South Entrance Ramp to Street sidewalk */}
      <mesh position={[0, 0.12, 11.85]} receiveShadow>
        <boxGeometry args={[4.0, 0.24, 0.3]} />
        <meshStandardMaterial color="#334155" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Subtle Park Ambient Lighting */}
      <pointLight color="#38bdf8" intensity={1.5} distance={18.0} position={[0, 4.0, 0]} />
    </group>
  );
};

'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePerformanceQuality } from '../PerformanceControl';

export interface SkillsBuildingProps {
  position?: [number, number, number];
  onSelect: () => void;
  isSelected?: boolean;
}

/**
 * Procedural High-Res Texture for Vertical Sign: "S K I L L S"
 * Mounted on the front facade column of the skyscraper.
 */
function createVerticalSkillsSignTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 640;
  const ctx = canvas.getContext('2d')!;

  // Dark obsidian-cyan background
  ctx.fillStyle = '#04151f';
  ctx.fillRect(0, 0, 160, 640);

  // Outer glowing neon border
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 148, 628);

  // Inner subtle accent frame
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, 132, 612);

  // Vertical Letters: S K I L L S
  const letters = ['S', 'K', 'I', 'L', 'L', 'S'];
  const startY = 80;
  const spacing = 72;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 58px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 16;

  letters.forEach((char, index) => {
    ctx.fillText(char, 80, startY + index * spacing);
  });

  // Bottom Subtitle: TECH TOWER
  ctx.shadowBlur = 0;
  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = '#22d3ee';
  ctx.letterSpacing = '3px';
  ctx.fillText('TECH', 80, 550);
  ctx.fillText('TOWER', 80, 578);

  // Tiny cyan indicator dot at bottom
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(80, 608, 5, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural Texture for Entrance Canopy Sign: "SKILLS // TECH TOWER"
 */
function createEntranceSignTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#05131d';
  ctx.fillRect(0, 0, 512, 128);

  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 5;
  ctx.strokeRect(5, 5, 502, 118);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 44px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#22d3ee';
  ctx.shadowBlur = 14;
  ctx.fillText('SKILLS TECH TOWER', 256, 52);

  ctx.shadowBlur = 0;
  ctx.font = 'bold 15px monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.letterSpacing = '5px';
  ctx.fillText('ENGINEERING STACK & TOOLS', 256, 92);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * SkillsBuilding Component
 * Tall Futuristic Skyscraper with:
 * - Teal & Cyan Glowing Windows
 * - Multi-tier architectural setbacks (podium, shaft, crown)
 * - Animated rooftop antenna with rotating radar rings
 * - Flashing beacon light atop the spire
 * - Vertical "SKILLS" signboard on south-facing facade column
 * - Pulsing cyan neon edge strips
 * - Entrance canopy and landscaped plaza
 */
export const SkillsBuilding: React.FC<SkillsBuildingProps> = ({
  position = [7.85, 0.74, 7.35],
  onSelect,
  isSelected = false,
}) => {
  const { effectiveTier, prefersReducedMotion } = usePerformanceQuality();
  const allowPointLights = effectiveTier === 'high';
  const [isHovered, setIsHovered] = useState(false);

  // Animation refs
  const rootGroupRef = useRef<THREE.Group>(null);
  const antennaRingRef1 = useRef<THREE.Group>(null);
  const antennaRingRef2 = useRef<THREE.Group>(null);
  const beaconLightRef = useRef<THREE.PointLight>(null);
  const beaconMeshRef = useRef<THREE.Mesh>(null);
  const pulseStripMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const badgeRef = useRef<THREE.Group>(null);

  // Cached procedural textures
  const verticalSignTexture = useMemo(() => createVerticalSkillsSignTexture(), []);
  const entranceSignTexture = useMemo(() => createEntranceSignTexture(), []);

  // Frame-rate independent animations
  useFrame((_, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;

    // 1. Smooth vertical lift on hover/selection
    if (rootGroupRef.current) {
      const targetY = position[1] + ((isHovered || isSelected) && !prefersReducedMotion ? 0.12 : 0);
      if (prefersReducedMotion) {
        rootGroupRef.current.position.y = targetY;
      } else {
        rootGroupRef.current.position.y += (targetY - rootGroupRef.current.position.y) * (1 - Math.exp(-12.0 * delta));
      }
    }

    const time = Date.now() * 0.001;

    // 2. Rotate antenna telecom rings (paused on reduced motion)
    if (!prefersReducedMotion) {
      if (antennaRingRef1.current) {
        antennaRingRef1.current.rotation.y += delta * 1.8;
      }
      if (antennaRingRef2.current) {
        antennaRingRef2.current.rotation.y -= delta * 1.2;
        antennaRingRef2.current.rotation.z = Math.sin(time * 2.0) * 0.15;
      }
    }

    // 3. Beacon flash on the antenna tip (every 1.2 seconds sharp pulse)
    if (beaconMeshRef.current && beaconMeshRef.current.material && !prefersReducedMotion) {
      const beaconCycle = (Math.sin(time * 5.0) + 1) * 0.5; // 0 to 1
      const sharpFlash = Math.pow(beaconCycle, 4);
      const mat = beaconMeshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.0 + sharpFlash * 4.0;
    }

    // 4. Subtle pulsing light strips along skyscraper corners
    if (pulseStripMatRef.current) {
      const pulse = 1.2 + Math.sin(time * 3.5) * 0.5;
      pulseStripMatRef.current.emissiveIntensity = isHovered || isSelected ? pulse * 1.6 : pulse;
    }

    // 5. Subtle bobbing for the floating badge
    if (badgeRef.current && !prefersReducedMotion) {
      badgeRef.current.position.y = 15.6 + Math.sin(time * 2.5) * 0.15;
    }
  });

  return (
    <group
      ref={rootGroupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setIsHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* ======================================================== */}
      {/* 1. FOUNDATION PLAZA & STEPS                              */}
      {/* ======================================================== */}
      {/* Base Foundation Slab */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[7.2, 0.2, 6.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Plaza Paver Platform */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[6.8, 0.15, 6.0]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Low Entrance Steps (Facing West / Connecting Street) */}
      <mesh position={[-3.1, 0.05, 0]}>
        <boxGeometry args={[0.5, 0.1, 2.6]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>
      <mesh position={[-2.8, 0.12, 0]}>
        <boxGeometry args={[0.5, 0.1, 2.4]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>

      {/* Plaza Perimeter LED Strip */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[6.84, 0.04, 6.04]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={isHovered ? 1.5 : 0.8}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Plaza Planters & Cyber Shrubberies */}
      <group position={[2.6, 0.25, 2.2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.0, 0.35, 1.0]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.3, 0.5, 8]} />
          <meshStandardMaterial color="#059669" roughness={0.7} />
        </mesh>
      </group>

      <group position={[2.6, 0.25, -2.2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.0, 0.35, 1.0]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.3, 0.5, 8]} />
          <meshStandardMaterial color="#059669" roughness={0.7} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 2. PODIUM LOBBY LEVEL (Y: 0.2 to 2.8)                    */}
      {/* ======================================================== */}
      <group position={[0, 1.45, 0]}>
        {/* Core Lobby Structure */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[5.2, 2.5, 4.6]} />
          <meshStandardMaterial
            color="#0b1329"
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>

        {/* Lobby Glass Enclosure */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[5.25, 2.4, 4.65]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#06b6d4"
            emissiveIntensity={0.35}
            roughness={0.1}
            metalness={0.9}
            transparent={false}
          />
        </mesh>

        {/* Grand Entrance Canopy (West Facing) */}
        <group position={[-2.8, -0.2, 0]}>
          {/* Canopy Roof Slab */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.0, 0.12, 3.2]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Glowing Underside LED Panel */}
          <mesh position={[0, -0.065, 0]}>
            <boxGeometry args={[0.9, 0.02, 3.0]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#06b6d4"
              emissiveIntensity={1.4}
            />
          </mesh>

          {/* Entrance Marquee Sign */}
          <mesh position={[-0.51, 0.3, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[2.8, 0.7]} />
            <meshBasicMaterial map={entranceSignTexture} transparent />
          </mesh>

          {/* Downward Entrance Spotlight */}
          {allowPointLights && (
            <pointLight
              position={[0, -0.3, 0]}
              color="#22d3ee"
              intensity={1.2}
              distance={4.5}
              decay={2}
            />
          )}
        </group>
      </group>

      {/* ======================================================== */}
      {/* 3. TOWER SHAFT TIER 1 (Y: 2.8 to 6.6)                    */}
      {/* ======================================================== */}
      <group position={[0, 4.7, 0]}>
        {/* Tier 1 Primary Body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.4, 3.8, 3.8]} />
          <meshStandardMaterial
            color="#091424"
            roughness={0.35}
            metalness={0.8}
          />
        </mesh>

        {/* Teal & Cyan Glowing Windows (Tier 1 Curtain Grid) */}
        {/* South Curtain Wall (Facing Main Boulevard) */}
        <mesh position={[0, 0, 1.92]}>
          <planeGeometry args={[3.8, 3.4]} />
          <meshStandardMaterial
            color="#0891b2"
            emissive="#06b6d4"
            emissiveIntensity={0.9}
            roughness={0.15}
            metalness={0.85}
          />
        </mesh>

        {/* North Curtain Wall */}
        <mesh position={[0, 0, -1.92]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[3.8, 3.4]} />
          <meshStandardMaterial
            color="#0891b2"
            emissive="#06b6d4"
            emissiveIntensity={0.8}
            roughness={0.15}
            metalness={0.85}
          />
        </mesh>

        {/* West Curtain Wall (Facing Entrance / Crossroads) */}
        <mesh position={[-2.22, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[3.2, 3.4]} />
          <meshStandardMaterial
            color="#0891b2"
            emissive="#06b6d4"
            emissiveIntensity={0.85}
            roughness={0.15}
            metalness={0.85}
          />
        </mesh>

        {/* East Curtain Wall */}
        <mesh position={[2.22, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[3.2, 3.4]} />
          <meshStandardMaterial
            color="#0891b2"
            emissive="#06b6d4"
            emissiveIntensity={0.8}
            roughness={0.15}
            metalness={0.85}
          />
        </mesh>

        {/* White / Titanium Vertical Architectural Mullions */}
        {[-1.3, 0, 1.3].map((xOffset, idx) => (
          <mesh key={`tier1-fin-s-${idx}`} position={[xOffset, 0, 1.94]} castShadow>
            <boxGeometry args={[0.08, 3.8, 0.08]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.9} />
          </mesh>
        ))}
        {[-1.3, 0, 1.3].map((xOffset, idx) => (
          <mesh key={`tier1-fin-n-${idx}`} position={[xOffset, 0, -1.94]} castShadow>
            <boxGeometry args={[0.08, 3.8, 0.08]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.9} />
          </mesh>
        ))}

        {/* Tier 1 Setback Ledge / Intermediate Cornice */}
        <mesh position={[0, 1.95, 0]}>
          <boxGeometry args={[4.6, 0.12, 4.0]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 4. TOWER SHAFT TIER 2 (Y: 6.6 to 10.2)                   */}
      {/* ======================================================== */}
      <group position={[0, 8.4, 0]}>
        {/* Tier 2 Body (Setback to 3.6m x 3.2m) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.6, 3.6, 3.2]} />
          <meshStandardMaterial
            color="#071220"
            roughness={0.3}
            metalness={0.85}
          />
        </mesh>

        {/* Glowing Window Facades */}
        <mesh position={[0, 0, 1.62]}>
          <planeGeometry args={[3.0, 3.2]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#22d3ee"
            emissiveIntensity={1.05}
            roughness={0.15}
            metalness={0.9}
          />
        </mesh>
        <mesh position={[0, 0, -1.62]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[3.0, 3.2]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#0891b2"
            emissiveIntensity={0.85}
            roughness={0.15}
            metalness={0.9}
          />
        </mesh>
        <mesh position={[-1.82, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[2.6, 3.2]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#22d3ee"
            emissiveIntensity={1.0}
            roughness={0.15}
            metalness={0.9}
          />
        </mesh>
        <mesh position={[1.82, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[2.6, 3.2]} />
          <meshStandardMaterial
            color="#0891b2"
            emissive="#0891b2"
            emissiveIntensity={0.8}
            roughness={0.15}
            metalness={0.9}
          />
        </mesh>

        {/* ======================================================== */}
        {/* VERTICAL "SKILLS" SIGN (Facade Column on South Front)    */}
        {/* ======================================================== */}
        <group position={[1.15, 0, 1.66]}>
          {/* Architectural Fin Mount */}
          <mesh castShadow>
            <boxGeometry args={[0.9, 3.4, 0.12]} />
            <meshStandardMaterial color="#0b1727" roughness={0.4} metalness={0.8} />
          </mesh>
          {/* Neon Sign Face */}
          <mesh position={[0, 0, 0.07]}>
            <planeGeometry args={[0.82, 3.28]} />
            <meshBasicMaterial map={verticalSignTexture} transparent />
          </mesh>
        </group>

        {/* Tier 2 Cornice / Terrace Band */}
        <mesh position={[0, 1.85, 0]}>
          <boxGeometry args={[3.8, 0.12, 3.4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 5. TOWER CROWN / UPPER PENTHOUSE (Y: 10.2 to 12.6)       */}
      {/* ======================================================== */}
      <group position={[0, 11.4, 0]}>
        {/* Crown Body (Setback to 2.8m x 2.4m) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.8, 2.4, 2.4]} />
          <meshStandardMaterial
            color="#060e18"
            roughness={0.25}
            metalness={0.9}
          />
        </mesh>

        {/* Crown Glass Observatory Band */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[2.84, 1.4, 2.44]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#06b6d4"
            emissiveIntensity={1.3}
            roughness={0.1}
            metalness={0.95}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Top Roof Deck Slab */}
        <mesh position={[0, 1.25, 0]}>
          <boxGeometry args={[3.0, 0.15, 2.6]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Glowing Neon Roofline Border */}
        <mesh position={[0, 1.35, 0]}>
          <boxGeometry args={[3.05, 0.05, 2.65]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={isHovered ? 2.2 : 1.4}
          />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 6. ANIMATED ROOFTOP TELECOM SPIRE & ANTENNA (Y: 12.6-15.4)*/}
      {/* ======================================================== */}
      <group position={[0, 12.7, 0]}>
        {/* Antenna Base Pedestal */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.7, 0.4, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Main Antenna Spire Mast */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.14, 2.2, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Upper Needle Tip */}
        <mesh position={[0, 2.7, 0]}>
          <cylinderGeometry args={[0.02, 0.06, 0.8, 8]} />
          <meshStandardMaterial color="#ffffff" metalness={1.0} roughness={0.1} />
        </mesh>

        {/* Animated Rotating Telecom Ring 1 */}
        <group ref={antennaRingRef1} position={[0, 1.1, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.42, 0.035, 8, 24]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#06b6d4"
              emissiveIntensity={1.2}
              metalness={0.8}
            />
          </mesh>
          {/* Crossbars */}
          <mesh>
            <boxGeometry args={[0.84, 0.03, 0.03]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
          </mesh>
        </group>

        {/* Animated Rotating Telecom Ring 2 */}
        <group ref={antennaRingRef2} position={[0, 1.8, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.26, 0.025, 8, 20]} />
            <meshStandardMaterial
              color="#22d3ee"
              emissive="#22d3ee"
              emissiveIntensity={1.4}
              metalness={0.8}
            />
          </mesh>
        </group>

        {/* Flashing Aircraft Warning Beacon on Spire Tip */}
        <mesh ref={beaconMeshRef} position={[0, 3.12, 0]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial
            color="#ff2255"
            emissive="#ff2255"
            emissiveIntensity={2.0}
            roughness={0.1}
          />
        </mesh>

        {/* Rooftop Satellite Dish Receiver */}
        <group position={[0.75, 0.15, 0.55]} rotation={[0.4, 0.6, -0.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.25, 0]} rotation={[Math.PI, 0, 0]} castShadow>
            <coneGeometry args={[0.3, 0.18, 16, 1, true]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 7. PULSING NEON LIGHT STRIPS (Corner Edges of Shafts)    */}
      {/* ======================================================== */}
      <group>
        {/* Reusable pulsing material */}
        <meshStandardMaterial
          ref={pulseStripMatRef}
          attach="material"
          color="#06b6d4"
          emissive="#00f0ff"
          emissiveIntensity={1.2}
        />

        {/* 4 Corner Strips along Lower Shaft (Tier 1) */}
        {[
          [-2.21, 4.7, 1.91],
          [2.21, 4.7, 1.91],
          [-2.21, 4.7, -1.91],
          [2.21, 4.7, -1.91],
        ].map(([x, y, z], idx) => (
          <mesh key={`tier1-neon-${idx}`} position={[x, y, z]}>
            <boxGeometry args={[0.06, 3.78, 0.06]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#00f0ff"
              emissiveIntensity={isHovered ? 2.0 : 1.2}
            />
          </mesh>
        ))}

        {/* 4 Corner Strips along Mid Shaft (Tier 2) */}
        {[
          [-1.81, 8.4, 1.61],
          [1.81, 8.4, 1.61],
          [-1.81, 8.4, -1.61],
          [1.81, 8.4, -1.61],
        ].map(([x, y, z], idx) => (
          <mesh key={`tier2-neon-${idx}`} position={[x, y, z]}>
            <boxGeometry args={[0.05, 3.58, 0.05]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#00f0ff"
              emissiveIntensity={isHovered ? 2.0 : 1.2}
            />
          </mesh>
        ))}
      </group>

      {/* ======================================================== */}
      {/* 8. INTERACTIVE HOVER / SELECTION GLOW & BADGE            */}
      {/* ======================================================== */}
      {/* Architectural Accent Glow */}
      {allowPointLights && (
        <pointLight
          position={[0, 8.0, 3.0]}
          color="#00f0ff"
          intensity={isHovered || isSelected ? 2.5 : 1.2}
          distance={9.0}
          decay={2}
        />
      )}

      {/* Floating Hover Indicator Badge */}
      {isHovered && !isSelected && (
        <group ref={badgeRef} position={[0, 16.0, 0]}>
          <mesh>
            <boxGeometry args={[3.2, 0.6, 0.1]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#06b6d4"
              emissiveIntensity={1.8}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};


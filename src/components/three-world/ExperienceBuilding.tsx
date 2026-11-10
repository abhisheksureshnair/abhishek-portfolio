'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePerformanceQuality } from '../PerformanceControl';

export interface ExperienceBuildingProps {
  position?: [number, number, number];
  onSelect: () => void;
  isSelected?: boolean;
}

/**
 * Procedural High-Res Texture for Rooftop / Facade Sign: "EXPERIENCE"
 */
function createExperienceSignTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 140;
  const ctx = canvas.getContext('2d')!;

  // Deep corporate blue-navy background
  ctx.fillStyle = '#061325';
  ctx.fillRect(0, 0, 512, 140);

  // Modern cyan-blue double border
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 5;
  ctx.strokeRect(5, 5, 502, 130);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, 488, 116);

  // Main Header: "EXPERIENCE"
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 52px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 16;
  ctx.fillText('EXPERIENCE', 256, 56);

  // Subtitle: "INNSPARK SOLUTIONS // CAREER TIMELINE"
  ctx.shadowBlur = 0;
  ctx.font = 'bold 15px monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.letterSpacing = '4px';
  ctx.fillText('INNSPARK SOLUTIONS // 3.6 YRS', 256, 104);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural Texture for Entrance Canopy Sign: "CORPORATE HEADQUARTERS"
 */
function createCanopySignTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 120;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 120);

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, 504, 112);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 38px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#0ea5e9';
  ctx.shadowBlur = 12;
  ctx.fillText('INNSPARK SOLUTIONS', 256, 48);

  ctx.shadowBlur = 0;
  ctx.font = 'bold 14px monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.letterSpacing = '5px';
  ctx.fillText('SOFTWARE DEVELOPMENT OFFICE', 256, 88);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * ExperienceBuilding Component
 * Blue-and-White Corporate Office Complex:
 * - Tripartite architectural layout matching reference image
 * - Curved central tower with horizontal white floor bands and blue glass ribbon windows
 * - Flanking curved & stepped office wings
 * - Stepped rooftop gardens with lush lawns, trees, and glass balustrades
 * - Rooftop circular glass penthouse atrium
 * - Rooftop signboard structure with illuminated "EXPERIENCE" sign
 * - Double-height ground reception lobby with white columns and front entrance
 * - Subtle animated office window illumination in useFrame
 */
export const ExperienceBuilding: React.FC<ExperienceBuildingProps> = ({
  position = [0, 0.74, 21.5],
  onSelect,
  isSelected = false,
}) => {
  const { effectiveTier, prefersReducedMotion } = usePerformanceQuality();
  const allowPointLights = effectiveTier === 'high';
  const [isHovered, setIsHovered] = useState(false);

  // Animation refs
  const rootGroupRef = useRef<THREE.Group>(null);
  const windowMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const badgeRef = useRef<THREE.Group>(null);
  const atriumFanRef = useRef<THREE.Group>(null);

  // Cached procedural textures
  const experienceSignTex = useMemo(() => createExperienceSignTexture(), []);
  const canopySignTex = useMemo(() => createCanopySignTexture(), []);

  // Frame-rate independent window light and beacon animation
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

    // 2. Subtle window light breathing/shimmer
    if (windowMaterialRef.current && !prefersReducedMotion) {
      const pulse = 0.35 + Math.sin(time * 1.8) * 0.08 + Math.cos(time * 3.1) * 0.04;
      windowMaterialRef.current.emissiveIntensity = isHovered || isSelected ? pulse * 1.8 : pulse;
    }

    // 3. Gentle floating badge bob (paused on reduced motion)
    if (badgeRef.current && !prefersReducedMotion) {
      badgeRef.current.position.y = 11.2 + Math.sin(time * 2.4) * 0.12;
    }

    // 4. Rooftop HVAC / aeration fan rotation (paused on reduced motion)
    if (atriumFanRef.current && !prefersReducedMotion) {
      atriumFanRef.current.rotation.y += delta * 2.0;
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
      {/* 1. PLAZA FOUNDATION & LANDSCAPED APPROACH                */}
      {/* ======================================================== */}
      {/* Base Foundation Concrete Slab */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[8.8, 0.2, 7.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.25} />
      </mesh>

      {/* Raised Paved Plaza Deck */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[8.4, 0.16, 6.8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.5} metalness={0.15} />
      </mesh>

      {/* Front Entrance Approach Steps (Facing North toward road intersection) */}
      <mesh position={[0, 0.08, -3.2]} receiveShadow>
        <boxGeometry args={[3.6, 0.12, 0.6]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.16, -2.8]} receiveShadow>
        <boxGeometry args={[3.2, 0.12, 0.6]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>

      {/* Front Plaza Perimeter Curbs & Accent LED Strip */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[8.44, 0.03, 6.84]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#38bdf8"
          emissiveIntensity={isHovered ? 1.6 : 0.75}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Plaza Garden Beds & Potted Diorama Trees (Left & Right) */}
      <group position={[-3.3, 0.25, -2.4]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.7, 0.8, 0.3, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.66, 0.66, 0.05, 16]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>
        {/* Stylized Miniature Tree */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.8, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.1, 0]} castShadow>
          <sphereGeometry args={[0.45, 12, 12]} />
          <meshStandardMaterial color="#16a34a" roughness={0.6} />
        </mesh>
      </group>

      <group position={[3.3, 0.25, -2.4]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.7, 0.8, 0.3, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.66, 0.66, 0.05, 16]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>
        {/* Stylized Miniature Tree */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.8, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.1, 0]} castShadow>
          <sphereGeometry args={[0.45, 12, 12]} />
          <meshStandardMaterial color="#16a34a" roughness={0.6} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 2. GROUND RECEPTION ATRIUM (Y: 0.2 to 2.2)               */}
      {/* ======================================================== */}
      <group position={[0, 1.2, 0]}>
        {/* Recessed Ground Lobby Glass Cube */}
        <mesh>
          <boxGeometry args={[7.2, 2.0, 5.4]} />
          <meshStandardMaterial
            color="#0369a1"
            emissive="#0284c7"
            emissiveIntensity={0.4}
            roughness={0.1}
            metalness={0.9}
            transparent={false}
          />
        </mesh>

        {/* Front Entrance Support Colonnade (White Pillars) */}
        {[-2.8, -1.0, 1.0, 2.8].map((xOffset, idx) => (
          <mesh key={`ground-col-${idx}`} position={[xOffset, 0, -2.75]} castShadow>
            <cylinderGeometry args={[0.14, 0.16, 2.0, 12]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.2} />
          </mesh>
        ))}

        {/* Grand Entrance Canopy (North Facing) */}
        <group position={[0, 0.2, -2.85]}>
          {/* Canopy Slab */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.2, 0.12, 1.2]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.2} />
          </mesh>

          {/* Glowing Underside Lighting */}
          <mesh position={[0, -0.065, 0]}>
            <boxGeometry args={[3.0, 0.02, 1.0]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={1.4}
            />
          </mesh>

          {/* Entrance Marquee Sign */}
          <mesh position={[0, 0.26, -0.58]}>
            <planeGeometry args={[2.6, 0.6]} />
            <meshBasicMaterial map={canopySignTex} transparent />
          </mesh>

          {/* Downward Welcome Spotlight */}
          {allowPointLights && (
            <pointLight
              position={[0, -0.3, 0]}
              color="#bae6fd"
              intensity={1.2}
              distance={4.5}
              decay={2}
            />
          )}
        </group>
      </group>

      {/* ======================================================== */}
      {/* 3. CENTRAL CURVED CORPORATE TOWER (Y: 2.2 to 8.2)        */}
      {/* ======================================================== */}
      <group position={[0, 5.2, 0.2]}>
        {/* Shared Blue Window Material with subtle animation ref */}
        <meshStandardMaterial
          ref={windowMaterialRef}
          attach="material"
          color="#0284c7"
          emissive="#0ea5e9"
          emissiveIntensity={0.35}
          roughness={0.15}
          metalness={0.85}
          transparent
          opacity={0.85}
        />

        {/* Central Cylindrical Glass Body */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[2.2, 2.2, 6.0, 32, 1, false, -Math.PI / 2, Math.PI]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0ea5e9"
            emissiveIntensity={0.35}
            roughness={0.15}
            metalness={0.85}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Central Back Enclosure */}
        <mesh position={[0, 0, 0.5]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 6.0, 1.8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* White Horizontal Floor Bands / Spandrels (6 Floors) */}
        {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((yOffset, idx) => (
          <mesh key={`central-band-${idx}`} position={[0, yOffset, 0]} castShadow>
            <cylinderGeometry args={[2.26, 2.26, 0.18, 32, 1, false, -Math.PI / 2, Math.PI]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.15} />
          </mesh>
        ))}

        {/* Two Prominent Front Vertical Pilasters Framing the Center */}
        {[-1.3, 1.3].map((xOffset, idx) => (
          <mesh key={`central-pillar-${idx}`} position={[xOffset, 0, -2.1]} castShadow>
            <boxGeometry args={[0.22, 6.4, 0.28]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.2} />
          </mesh>
        ))}

        {/* Central Roof Cornice / Overhang Band */}
        <mesh position={[0, 3.05, 0]} castShadow>
          <cylinderGeometry args={[2.35, 2.35, 0.18, 32, 1, false, -Math.PI / 2, Math.PI]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.2} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 4. LEFT WING (WEST TOWER - Y: 2.2 to 6.8)                */}
      {/* ======================================================== */}
      <group position={[-2.6, 4.4, 0.2]}>
        {/* Core Wing Body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 4.4, 3.2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Blue Ribbon Windows on Front Facade */}
        {[-1.6, -0.6, 0.4, 1.4].map((yOffset, idx) => (
          <mesh key={`left-window-${idx}`} position={[0, yOffset, -1.62]}>
            <planeGeometry args={[1.9, 0.65]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#0ea5e9"
              emissiveIntensity={0.4}
              roughness={0.15}
              metalness={0.85}
              transparent
              opacity={0.85}
            />
          </mesh>
        ))}

        {/* West Side Ribbon Windows */}
        {[-1.6, -0.6, 0.4, 1.4].map((yOffset, idx) => (
          <mesh key={`left-side-window-${idx}`} position={[-1.12, yOffset, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[2.6, 0.65]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#0ea5e9"
              emissiveIntensity={0.35}
              roughness={0.15}
              metalness={0.85}
              transparent
              opacity={0.85}
            />
          </mesh>
        ))}

        {/* Stepped Rooftop Terrace (Green Garden Deck) */}
        <group position={[0, 2.22, 0]}>
          {/* Turf Surface */}
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[2.16, 0.08, 3.16]} />
            <meshStandardMaterial color="#15803d" roughness={0.8} />
          </mesh>

          {/* Glass Safety Perimeter Balustrade */}
          <mesh position={[0, 0.35, -1.55]}>
            <boxGeometry args={[2.16, 0.5, 0.04]} />
            <meshStandardMaterial
              color="#38bdf8"
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={0.45}
            />
          </mesh>
          <mesh position={[-1.05, 0.35, 0]}>
            <boxGeometry args={[0.04, 0.5, 3.16]} />
            <meshStandardMaterial
              color="#38bdf8"
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={0.45}
            />
          </mesh>

          {/* Rooftop Garden Trees & Shrubs */}
          <group position={[-0.4, 0.1, -0.8]}>
            <mesh position={[0, 0.3, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.06, 0.4, 6]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            <mesh position={[0, 0.6, 0]} castShadow>
              <sphereGeometry args={[0.28, 10, 10]} />
              <meshStandardMaterial color="#16a34a" roughness={0.6} />
            </mesh>
          </group>

          <group position={[0.4, 0.1, 0.6]}>
            <mesh position={[0, 0.25, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.06, 0.35, 6]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            <mesh position={[0, 0.55, 0]} castShadow>
              <sphereGeometry args={[0.24, 10, 10]} />
              <meshStandardMaterial color="#22c55e" roughness={0.6} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 5. RIGHT WING (EAST TOWER - Y: 2.2 to 7.4)               */}
      {/* ======================================================== */}
      <group position={[2.6, 4.7, 0.2]}>
        {/* Core Wing Body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 5.0, 3.2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Blue Ribbon Windows on Front Facade */}
        {[-2.0, -1.0, 0.0, 1.0, 2.0].map((yOffset, idx) => (
          <mesh key={`right-window-${idx}`} position={[0, yOffset, -1.62]}>
            <planeGeometry args={[1.9, 0.65]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#0ea5e9"
              emissiveIntensity={0.4}
              roughness={0.15}
              metalness={0.85}
              transparent
              opacity={0.85}
            />
          </mesh>
        ))}

        {/* East Side Ribbon Windows */}
        {[-2.0, -1.0, 0.0, 1.0, 2.0].map((yOffset, idx) => (
          <mesh key={`right-side-window-${idx}`} position={[1.12, yOffset, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[2.6, 0.65]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#0ea5e9"
              emissiveIntensity={0.35}
              roughness={0.15}
              metalness={0.85}
              transparent
              opacity={0.85}
            />
          </mesh>
        ))}

        {/* Stepped Rooftop Terrace (Green Garden Deck) */}
        <group position={[0, 2.52, 0]}>
          {/* Turf Surface */}
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[2.16, 0.08, 3.16]} />
            <meshStandardMaterial color="#15803d" roughness={0.8} />
          </mesh>

          {/* Glass Safety Perimeter Balustrade */}
          <mesh position={[0, 0.35, -1.55]}>
            <boxGeometry args={[2.16, 0.5, 0.04]} />
            <meshStandardMaterial
              color="#38bdf8"
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={0.45}
            />
          </mesh>
          <mesh position={[1.05, 0.35, 0]}>
            <boxGeometry args={[0.04, 0.5, 3.16]} />
            <meshStandardMaterial
              color="#38bdf8"
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={0.45}
            />
          </mesh>

          {/* Rooftop Garden Trees */}
          <group position={[-0.3, 0.1, 0.4]}>
            <mesh position={[0, 0.3, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.06, 0.4, 6]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            <mesh position={[0, 0.6, 0]} castShadow>
              <sphereGeometry args={[0.26, 10, 10]} />
              <meshStandardMaterial color="#16a34a" roughness={0.6} />
            </mesh>
          </group>

          {/* ======================================================== */}
          {/* ROOFTOP BILLBOARD STRUCTURE WITH "EXPERIENCE" SIGN        */}
          {/* ======================================================== */}
          <group position={[0.2, 0.7, -0.4]}>
            {/* Structural Steel Frame Pylons */}
            <mesh position={[-0.6, 0.4, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.8, 6]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>
            <mesh position={[0.6, 0.4, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.8, 6]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>
            {/* Signboard Panel */}
            <mesh position={[0, 0.9, 0]} castShadow>
              <boxGeometry args={[1.8, 0.6, 0.08]} />
              <meshStandardMaterial color="#0b1727" roughness={0.4} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.9, -0.05]}>
              <planeGeometry args={[1.74, 0.54]} />
              <meshBasicMaterial map={experienceSignTex} transparent />
            </mesh>
          </group>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 6. MAIN ROOFTOP GARDEN & CIRCULAR ATRIUM DOME (Y: 8.2)   */}
      {/* ======================================================== */}
      <group position={[0, 8.3, 0.2]}>
        {/* Central Roof Turf Surface */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[2.2, 2.2, 0.1, 32, 1, false, -Math.PI / 2, Math.PI]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>

        {/* Curved Glass Perimeter Railing */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[2.22, 2.22, 0.5, 32, 1, true, -Math.PI / 2, Math.PI]} />
          <meshStandardMaterial
            color="#38bdf8"
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Circular Penthouse Glass Atrium Structure */}
        <group position={[0, 0.6, 0.2]}>
          {/* Circular Glass Wall */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1.4, 1.4, 1.0, 24]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#38bdf8"
              emissiveIntensity={0.4}
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={0.65}
            />
          </mesh>

          {/* Atrium White Top Cap */}
          <mesh position={[0, 0.55, 0]} castShadow>
            <cylinderGeometry args={[1.48, 1.48, 0.1, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.2} />
          </mesh>

          {/* Rooftop Aeration / HVAC Vent with rotating fan */}
          <group ref={atriumFanRef} position={[0, 0.65, 0]}>
            <mesh>
              <cylinderGeometry args={[0.3, 0.3, 0.1, 12]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.5, 0.04, 0.06]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[0.5, 0.04, 0.06]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
          </group>

          {/* Rooftop Trees on Central Deck */}
          <group position={[-1.3, -0.45, -0.4]}>
            <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.05, 0.3, 6]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            <mesh position={[0, 0.45, 0]} castShadow>
              <sphereGeometry args={[0.22, 10, 10]} />
              <meshStandardMaterial color="#16a34a" roughness={0.6} />
            </mesh>
          </group>
          <group position={[1.3, -0.45, -0.4]}>
            <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.05, 0.3, 6]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            <mesh position={[0, 0.45, 0]} castShadow>
              <sphereGeometry args={[0.22, 10, 10]} />
              <meshStandardMaterial color="#22c55e" roughness={0.6} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 7. INTERACTIVE HOVER / SELECTION GLOW & BADGE            */}
      {/* ======================================================== */}
      {/* Front Entrance Glow */}
      {allowPointLights && (
        <pointLight
          position={[0, 3.5, -3.2]}
          color="#38bdf8"
          intensity={isHovered || isSelected ? 2.8 : 1.2}
          distance={7.5}
          decay={2}
        />
      )}

      {/* Floating Hover Indicator Badge */}
      {isHovered && !isSelected && (
        <group ref={badgeRef} position={[0, 11.2, 0]}>
          <mesh>
            <boxGeometry args={[3.4, 0.6, 0.1]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#38bdf8"
              emissiveIntensity={1.8}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};


'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePerformanceQuality } from '../PerformanceControl';

export interface ContactBuildingProps {
  position?: [number, number, number];
  onSelect: () => void;
  isSelected?: boolean;
}

/**
 * Procedural High-Res Texture for Illuminated "CONTACT" Neon Sign
 */
function createContactSignTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 140;
  const ctx = canvas.getContext('2d')!;

  // Deep obsidian slate background
  ctx.fillStyle = '#080511';
  ctx.fillRect(0, 0, 512, 140);

  // Outer glowing neon magenta border
  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 128);

  // Inner subtle cyan accent border
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, 484, 112);

  // Main Header: "CONTACT"
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 58px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ec4899';
  ctx.shadowBlur = 18;
  ctx.fillText('CONTACT', 256, 56);

  // Subtitle: "COMMUNICATION HUB & NETWORKS"
  ctx.shadowBlur = 0;
  ctx.font = 'bold 15px monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.letterSpacing = '5px';
  ctx.fillText('COMMUNICATION HUB', 256, 104);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural Texture for Striped Fabric Awning (Pink & White Stripes)
 */
function createStripedAwningTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const stripeWidth = 32;
  for (let x = 0; x < 256; x += stripeWidth * 2) {
    // Pink stripe
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(x, 0, stripeWidth, 256);
    // White / soft cream stripe
    ctx.fillStyle = '#fdf2f8';
    ctx.fillRect(x + stripeWidth, 0, stripeWidth, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 1);
  return texture;
}

/**
 * ContactBuilding Component
 * Friendly Modern Communication Hub with:
 * - Cyberpunk diorama styling inspired by reference image
 * - Vibrant neon pink & blue accent tubing along roofline and base
 * - Warm illuminated ground storefront with striped awning
 * - Second-floor cantilevered terrace balcony with pink canopy
 * - Rooftop slowly rotating satellite communications dish
 * - Telecom spire with pulsing beacon lights
 * - Entrance plaza with outdoor cyber-palm tree and café table
 * - Front-facing illuminated "CONTACT" sign
 */
export const ContactBuilding: React.FC<ContactBuildingProps> = ({
  position = [0, 0.74, -21.5],
  onSelect,
  isSelected = false,
}) => {
  const { effectiveTier, prefersReducedMotion } = usePerformanceQuality();
  const allowPointLights = effectiveTier === 'high';
  const [isHovered, setIsHovered] = useState(false);

  // Animation refs
  const rootGroupRef = useRef<THREE.Group>(null);
  const satelliteDishRef = useRef<THREE.Group>(null);
  const beaconLightRef = useRef<THREE.PointLight>(null);
  const neonMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const badgeRef = useRef<THREE.Group>(null);

  // Cached procedural textures
  const contactSignTex = useMemo(() => createContactSignTexture(), []);
  const awningTex = useMemo(() => createStripedAwningTexture(), []);

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

    // 2. Slow satellite dish rotation (paused on reduced motion)
    if (satelliteDishRef.current && !prefersReducedMotion) {
      satelliteDishRef.current.rotation.y += delta * 0.45;
    }

    // 3. Subtle neon light breathing
    if (neonMatRef.current && !prefersReducedMotion) {
      const pulse = 1.3 + Math.sin(time * 3.0) * 0.35;
      neonMatRef.current.emissiveIntensity = isHovered || isSelected ? pulse * 1.5 : pulse;
    }

    // 4. Beacon light flash (paused on reduced motion)
    if (beaconLightRef.current && !prefersReducedMotion) {
      const beaconCycle = (Math.sin(time * 4.5) + 1) * 0.5;
      beaconLightRef.current.intensity = 0.8 + Math.pow(beaconCycle, 3) * 2.2;
    }

    // 5. Subtle bobbing for hover badge (paused on reduced motion)
    if (badgeRef.current && !prefersReducedMotion) {
      badgeRef.current.position.y = 9.8 + Math.sin(time * 2.5) * 0.12;
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
      {/* 1. FOUNDATION PLAZA & NEON UNDER-GLOW                    */}
      {/* ======================================================== */}
      {/* Base Foundation Concrete Slab */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[8.4, 0.2, 7.2]} />
        <meshStandardMaterial color="#0b0914" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Raised Wooden / Composite Boardwalk Deck */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[8.0, 0.15, 6.8]} />
        <meshStandardMaterial color="#1e1b2e" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Luminous Neon Cyan & Pink Perimeter Under-Glow Strip */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[8.2, 0.05, 7.0]} />
        <meshStandardMaterial
          ref={neonMatRef}
          color="#06b6d4"
          emissive="#00f0ff"
          emissiveIntensity={1.4}
        />
      </mesh>

      {/* Pink Decorative Perimeter Trim on Top Curb */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[8.04, 0.03, 6.84]} />
        <meshStandardMaterial
          color="#ec4899"
          emissive="#f43f5e"
          emissiveIntensity={isHovered ? 2.0 : 1.2}
        />
      </mesh>

      {/* Decorative Neon Underglow Pointlights (Blue & Pink) */}
      {allowPointLights && (
        <>
          <pointLight position={[-3.0, 0.3, 2.5]} color="#00f0ff" intensity={1.5} distance={4.5} />
          <pointLight position={[3.0, 0.3, 2.5]} color="#ec4899" intensity={1.5} distance={4.5} />
        </>
      )}

      {/* Front Steps (Facing South toward cross street) */}
      <mesh position={[0, 0.08, 3.2]} receiveShadow>
        <boxGeometry args={[3.2, 0.12, 0.6]} />
        <meshStandardMaterial color="#2d2847" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.16, 2.8]} receiveShadow>
        <boxGeometry args={[2.8, 0.12, 0.6]} />
        <meshStandardMaterial color="#3b355a" roughness={0.4} />
      </mesh>

      {/* Left Outdoor Lounge: Table, Cyber Palm Tree & Neon Lamp */}
      <group position={[-2.8, 0.2, 1.8]}>
        {/* Café Round Table */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.04, 16]} />
          <meshStandardMaterial color="#ec4899" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} />
        </mesh>
        {/* Two Stools */}
        <mesh position={[-0.45, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.04, 12]} />
          <meshStandardMaterial color="#06b6d4" metalness={0.7} />
        </mesh>
        <mesh position={[0.45, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.04, 12]} />
          <meshStandardMaterial color="#06b6d4" metalness={0.7} />
        </mesh>
        {/* Stylized Cyber-Palm Tree */}
        <group position={[-0.7, 0, -1.2]}>
          <mesh position={[0, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.12, 2.2, 8]} />
            <meshStandardMaterial color="#582f1b" roughness={0.8} />
          </mesh>
          {/* Palm Fronds (Tiered Cones/Spheres) */}
          <mesh position={[0, 2.2, 0]} castShadow>
            <sphereGeometry args={[0.55, 8, 8]} />
            <meshStandardMaterial color="#059669" roughness={0.6} />
          </mesh>
          <mesh position={[0.2, 2.35, 0.1]} castShadow>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshStandardMaterial color="#10b981" roughness={0.5} />
          </mesh>
        </group>
        {/* Standalone Neon Street Lamp */}
        <group position={[0.8, 0, -1.0]}>
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.8, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.9} />
          </mesh>
          <mesh position={[0, 1.85, 0]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={2.5} />
          </mesh>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 2. GROUND FLOOR - STOREFRONT & ENTRANCE (Y: 0.2 to 2.8)  */}
      {/* ======================================================== */}
      <group position={[0, 1.5, 0]}>
        {/* Ground Floor Main Dark Structure */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[6.8, 2.6, 5.0]} />
          <meshStandardMaterial color="#120e24" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Large Front Display Windows with Warm Amber Illumination */}
        <mesh position={[1.4, 0, 2.52]}>
          <planeGeometry args={[3.2, 2.0]} />
          <meshStandardMaterial
            color="#fed7aa"
            emissive="#f97316"
            emissiveIntensity={0.65}
            roughness={0.1}
            metalness={0.8}
            transparent={false}
          />
        </mesh>
        {allowPointLights && (
          <pointLight position={[1.4, 0, 2.0]} color="#ffedd5" intensity={2.2} distance={5.5} decay={2} />
        )}

        {/* Front Entrance Glass Sliding Doors */}
        <mesh position={[-1.6, -0.2, 2.52]}>
          <planeGeometry args={[1.8, 1.8]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.4}
            roughness={0.1}
            metalness={0.9}
            transparent={false}
          />
        </mesh>

        {/* Double Door White Framing */}
        <mesh position={[-1.6, -0.2, 2.53]}>
          <boxGeometry args={[1.84, 0.05, 0.04]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.9} />
        </mesh>
        <mesh position={[-1.6, -0.2, 2.53]}>
          <boxGeometry args={[0.04, 1.84, 0.04]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.9} />
        </mesh>

        {/* Ground Floor Striped Awning Over Front Glass Display */}
        <group position={[1.4, 0.95, 2.95]} rotation={[-0.32, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[3.4, 0.06, 1.1]} />
            <meshStandardMaterial map={awningTex} roughness={0.6} />
          </mesh>
          {/* Awning Support Struts */}
          <mesh position={[-1.6, -0.25, -0.4]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
          <mesh position={[1.6, -0.25, -0.4]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
        </group>

        {/* Left Side Café Window Awning */}
        <group position={[-1.6, 0.95, 2.9]} rotation={[-0.32, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[2.0, 0.05, 0.9]} />
            <meshStandardMaterial color="#ec4899" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 3. SECOND FLOOR - BALCONY & LOUNGE (Y: 2.8 to 5.4)       */}
      {/* ======================================================== */}
      <group position={[0, 4.1, 0]}>
        {/* Second Floor Core Body (Stepped slightly) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[6.2, 2.6, 4.6]} />
          <meshStandardMaterial color="#1a1435" roughness={0.35} metalness={0.5} />
        </mesh>

        {/* Second Floor Front Balcony Deck (Projecting forward at Z=2.3) */}
        <mesh position={[-1.2, -1.25, 2.4]} receiveShadow>
          <boxGeometry args={[3.2, 0.12, 1.6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Balcony Silver Metal Safety Railings */}
        <group position={[-1.2, -0.9, 3.15]}>
          <mesh>
            <boxGeometry args={[3.2, 0.04, 0.04]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
          {[-1.5, -0.75, 0, 0.75, 1.5].map((x, idx) => (
            <mesh key={`rail-p-${idx}`} position={[x, -0.25, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
          ))}
        </group>

        {/* Balcony Roof Canopy (Pink Fabric / Metal Overhang) */}
        <group position={[-1.2, 0.6, 2.6]} rotation={[-0.25, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[3.3, 0.06, 1.4]} />
            <meshStandardMaterial color="#ec4899" roughness={0.5} />
          </mesh>
          {/* Neon Tube on Edge of Canopy */}
          <mesh position={[0, 0, 0.7]}>
            <boxGeometry args={[3.32, 0.04, 0.04]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={1.8}
            />
          </mesh>
        </group>

        {/* Warm Balcony Window Sliding Doors */}
        <mesh position={[-1.2, -0.2, 2.32]}>
          <planeGeometry args={[2.8, 1.8]} />
          <meshStandardMaterial
            color="#fed7aa"
            emissive="#ea580c"
            emissiveIntensity={0.55}
            roughness={0.1}
            transparent={false}
          />
        </mesh>
        {allowPointLights && (
          <pointLight position={[-1.2, 0, 2.0]} color="#f97316" intensity={1.8} distance={4.5} />
        )}

        {/* Right Section Upper Facade & ILLUMINATED "CONTACT" SIGN */}
        <group position={[1.4, 0.3, 2.36]}>
          {/* Signboard Backing Plate */}
          <mesh castShadow>
            <boxGeometry args={[2.8, 1.0, 0.1]} />
            <meshStandardMaterial color="#090514" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Sign Face with Procedural Texture */}
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[2.72, 0.92]} />
            <meshBasicMaterial map={contactSignTex} transparent />
          </mesh>
        </group>

        {/* Vertical Glowing Neon Strip on Building Corner */}
        <mesh position={[3.12, 0, 2.32]}>
          <boxGeometry args={[0.06, 2.6, 0.06]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={2.0}
          />
        </mesh>
        <mesh position={[-3.12, 0, 2.32]}>
          <boxGeometry args={[0.06, 2.6, 0.06]} />
          <meshStandardMaterial
            color="#ec4899"
            emissive="#ec4899"
            emissiveIntensity={2.0}
          />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 4. ROOFTOP & TELECOMMUNICATIONS DECK (Y: 5.4 to 8.6)     */}
      {/* ======================================================== */}
      <group position={[0, 5.5, 0]}>
        {/* Rooftop Base Slab with Parapet Wall */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.4, 0.2, 4.8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.6} />
        </mesh>

        {/* Vibrant Magenta / Blue Neon Perimeter Glow Tubing along Roof Edge */}
        <mesh position={[0, 0.26, 2.38]}>
          <boxGeometry args={[6.42, 0.06, 0.06]} />
          <meshStandardMaterial
            color="#ec4899"
            emissive="#f43f5e"
            emissiveIntensity={isHovered ? 2.5 : 1.6}
          />
        </mesh>
        <mesh position={[0, 0.26, -2.38]}>
          <boxGeometry args={[6.42, 0.06, 0.06]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={1.4}
          />
        </mesh>
        <mesh position={[3.18, 0.26, 0]}>
          <boxGeometry args={[0.06, 0.06, 4.82]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={1.4}
          />
        </mesh>
        <mesh position={[-3.18, 0.26, 0]}>
          <boxGeometry args={[0.06, 0.06, 4.82]} />
          <meshStandardMaterial
            color="#ec4899"
            emissive="#f43f5e"
            emissiveIntensity={1.4}
          />
        </mesh>

        {/* Small Rooftop Access Penthouse & Utility Deck */}
        <mesh position={[-1.2, 0.7, -0.6]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 1.2, 2.0]} />
          <meshStandardMaterial color="#1a1435" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* ======================================================== */}
        {/* ANIMATED SLOW-ROTATING SATELLITE DISH                    */}
        {/* ======================================================== */}
        <group position={[1.4, 0.3, 0.4]}>
          {/* Dish Base Mount & Pedestal */}
          <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.25, 0.5, 12]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <sphereGeometry args={[0.15, 10, 10]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>

          {/* Rotating Dish Assembly */}
          <group ref={satelliteDishRef} position={[0, 0.6, 0]}>
            {/* Dish Parabolic Bowl (Tilted 35 degrees) */}
            <group rotation={[0.55, 0, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.85, 0.1, 0.25, 24, 1, true]} />
                <meshStandardMaterial
                  color="#f8fafc"
                  roughness={0.3}
                  metalness={0.7}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Backing Ring Trim */}
              <mesh position={[0, 0.02, 0]}>
                <torusGeometry args={[0.85, 0.025, 8, 24]} />
                <meshStandardMaterial
                  color="#00f0ff"
                  emissive="#00f0ff"
                  emissiveIntensity={1.5}
                />
              </mesh>
              {/* Central Feed Horn / Transceiver Rod */}
              <mesh position={[0, -0.35, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 0.6, 8]} />
                <meshStandardMaterial color="#0284c7" metalness={0.9} />
              </mesh>
              <mesh position={[0, -0.65, 0]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={2.5} />
              </mesh>
            </group>
          </group>
        </group>

        {/* Rooftop Telecom Transceiver Mast & Flashing Beacon */}
        <group position={[-2.0, 0.3, -1.2]}>
          <mesh position={[0, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.08, 2.2, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
          </mesh>
          {/* Crossbars */}
          <mesh position={[0, 1.3, 0]}>
            <boxGeometry args={[0.6, 0.03, 0.03]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
          <mesh position={[0, 1.7, 0]}>
            <boxGeometry args={[0.4, 0.03, 0.03]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
          {/* Top Flashing Beacon Sphere */}
          <mesh position={[0, 2.25, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={3.0} />
          </mesh>
        </group>

        {/* Small Rooftop Cyber-Shrubbery */}
        <group position={[1.8, 0.25, -1.5]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.25, 0.2, 0.3, 10]} />
            <meshStandardMaterial color="#1e1b2e" />
          </mesh>
          <mesh position={[0, 0.35, 0]} castShadow>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial color="#10b981" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 5. INTERACTIVE HOVER / SELECTION GLOW & BADGE            */}
      {/* ======================================================== */}
      {/* Front Entrance Warm Glow */}
      {allowPointLights && (
        <pointLight
          position={[0, 2.8, 3.4]}
          color="#ec4899"
          intensity={isHovered || isSelected ? 3.0 : 1.4}
          distance={7.0}
          decay={2}
        />
      )}

      {/* Floating Hover Indicator Badge */}
      {isHovered && !isSelected && (
        <group ref={badgeRef} position={[0, 9.8, 0]}>
          <mesh>
            <boxGeometry args={[3.2, 0.6, 0.1]} />
            <meshStandardMaterial
              color="#ec4899"
              emissive="#f43f5e"
              emissiveIntensity={1.8}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};


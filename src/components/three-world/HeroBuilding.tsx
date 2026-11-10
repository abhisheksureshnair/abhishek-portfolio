'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePerformanceQuality } from '../PerformanceControl';

export interface HeroBuildingProps {
  position?: [number, number, number];
  onSelect: () => void;
  isSelected?: boolean;
}

/**
 * Procedural High-Res Texture for Rooftop Sign: "ABHISHEK S NAIR"
 * Styled with crisp typography, glowing cyan neon borders and tech accents.
 */
function createRooftopSignTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Deep obsidian slate background
  ctx.fillStyle = '#070b14';
  ctx.fillRect(0, 0, 1024, 256);

  // Outer glowing cyan border
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 1008, 240);

  // Inner subtle accent frame
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(18, 18, 988, 220);

  // Corner decorative tech brackets
  ctx.fillStyle = '#00f0ff';
  const bracketSize = 18;
  ctx.fillRect(20, 20, bracketSize, 4);
  ctx.fillRect(20, 20, 4, bracketSize);
  ctx.fillRect(1004 - bracketSize, 20, bracketSize, 4);
  ctx.fillRect(1000, 20, 4, bracketSize);
  ctx.fillRect(20, 236 - bracketSize, 4, bracketSize);
  ctx.fillRect(20, 232, bracketSize, 4);
  ctx.fillRect(1000, 236 - bracketSize, 4, bracketSize);
  ctx.fillRect(1004 - bracketSize, 232, bracketSize, 4);

  // Main Title: "ABHISHEK S NAIR"
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 82px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 22;
  ctx.fillText('ABHISHEK S NAIR', 512, 104);

  // Subtitle: "FLAGSHIP HEADQUARTERS • TECH INNOVATION"
  ctx.shadowBlur = 0;
  ctx.font = 'bold 26px monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.letterSpacing = '6px';
  ctx.fillText('FLAGSHIP HEADQUARTERS • TECH INNOVATION', 512, 188);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural Texture for Front Entrance Canopy Sign: "SOFTWARE DEVELOPER"
 */
function createFrontSignTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Deep obsidian background
  ctx.fillStyle = '#050913';
  ctx.fillRect(0, 0, 512, 128);

  // Glowing cyan border
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 5;
  ctx.strokeRect(5, 5, 502, 118);

  // Text: "SOFTWARE DEVELOPER"
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 38px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 14;
  ctx.fillText('SOFTWARE DEVELOPER', 256, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural Texture for Rooftop Solar Panels (Photovoltaic cells)
 */
function createSolarPanelTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Dark navy blue silicon background
  ctx.fillStyle = '#0a1628';
  ctx.fillRect(0, 0, 256, 256);

  // Silicon wafer grid cells
  ctx.strokeStyle = '#1e3a5f';
  ctx.lineWidth = 2;
  const cols = 4;
  const rows = 4;
  const cw = 256 / cols;
  const ch = 256 / rows;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      ctx.strokeRect(c * cw + 2, r * ch + 2, cw - 4, ch - 4);
      // Faint busbar lines
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(c * cw + cw * 0.33, r * ch + 2);
      ctx.lineTo(c * cw + cw * 0.33, (r + 1) * ch - 2);
      ctx.moveTo(c * cw + cw * 0.66, r * ch + 2);
      ctx.lineTo(c * cw + cw * 0.66, (r + 1) * ch - 2);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * HeroBuilding Component
 * Architecturally Upgraded Flagship Tech Headquarters:
 * - Stepped modern massing with right-wing executive terrace setback
 * - Full-height reflective glass curtain walls with structural vertical mullions & spandrel bands
 * - Grand monumental beveled entrance portal with floating glass canopy & tension rods
 * - Illuminated double glass entrance doors with lobby reception desk interior preview
 * - Paved entrance plaza with step lights, low stone curbs & manicured topiary planters
 * - Executive 3rd-floor terrace with glass balustrade and miniature architectural greenery
 * - Industrial rooftop mechanical zone: HVAC chiller with ventilation ducts, dual solar arrays, telecom satellite dish & beacon
 * - High-res illuminated billboard sign with rear structural truss backstays and overhead LED floodlights
 */
export const HeroBuilding: React.FC<HeroBuildingProps> = ({
  position = [-7.85, 0.74, -7.35],
  onSelect,
  isSelected = false,
}) => {
  const { effectiveTier, prefersReducedMotion } = usePerformanceQuality();
  const allowPointLight = effectiveTier === 'high';

  const [isHovered, setIsHovered] = useState(false);
  const rootGroupRef = useRef<THREE.Group>(null);
  const cyanMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const satelliteDishRef = useRef<THREE.Group>(null);
  const beaconMeshRef = useRef<THREE.Mesh>(null);

  // Cached procedural textures
  const rooftopSignTex = useMemo(() => createRooftopSignTexture(), []);
  const frontSignTex = useMemo(() => createFrontSignTexture(), []);
  const solarPanelTex = useMemo(() => createSolarPanelTexture(), []);

  // Frame-rate independent animations for hover lift, pulse, satellite dish and beacon
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

    // 2. Hover/Selected breathing cyan glow
    if (cyanMaterialRef.current) {
      if (isHovered || isSelected) {
        const pulse = 1.8 + Math.sin(time * 4.0) * 0.5;
        cyanMaterialRef.current.emissiveIntensity = pulse;
      } else {
        cyanMaterialRef.current.emissiveIntensity = 1.1;
      }
    }

    // 3. Subtle glass window breathing
    if (blueGlassMat && !prefersReducedMotion) {
      blueGlassMat.emissiveIntensity = 0.22 + Math.sin(time * 1.2) * 0.05;
    }

    // 4. Slow satellite dish azimuthal sweep (paused on reduced motion)
    if (satelliteDishRef.current && !prefersReducedMotion) {
      satelliteDishRef.current.rotation.y += delta * 0.25;
    }

    // 5. Flashing rooftop aviation obstruction beacon
    if (beaconMeshRef.current && beaconMeshRef.current.material && !prefersReducedMotion) {
      const beaconCycle = (Math.sin(time * 5.0) + 1) * 0.5;
      const flash = Math.pow(beaconCycle, 5);
      (beaconMeshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.0 + flash * 4.0;
    }
  });

  const width = 6.4;
  const depth = 5.4;
  const halfW = width / 2; // 3.2
  const halfD = depth / 2; // 2.7

  // Shared reusable architectural materials
  const whiteFrameMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.22,
        metalness: 0.15,
      }),
    []
  );

  const darkTrimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#131b2e',
        roughness: 0.45,
        metalness: 0.4,
      }),
    []
  );

  const blueGlassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0284c7',
        emissive: '#0369a1',
        emissiveIntensity: 0.25,
        roughness: 0.1,
        metalness: 0.85,
        transparent: false,
      }),
    []
  );

  const cyanAccentMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#00f0ff',
        emissive: '#00f0ff',
        emissiveIntensity: 1.2,
        roughness: 0.2,
      }),
    []
  );

  const roofDeckMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#991b1b', // Terracotta reddish roof deck as in reference Image 1
        roughness: 0.8,
        metalness: 0.1,
      }),
    []
  );

  const lobbyInteriorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        emissive: '#0284c7',
        emissiveIntensity: 0.6,
        roughness: 0.3,
      }),
    []
  );

  const foliageMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#15803d',
        roughness: 0.7,
        metalness: 0.1,
      }),
    []
  );

  const pavementMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#cbd5e1',
        roughness: 0.65,
        metalness: 0.1,
      }),
    []
  );

  return (
    <group
      ref={rootGroupRef}
      position={position}
      name="HeroHeadquarters"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        if (typeof document !== 'undefined') {
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        setIsHovered(false);
        if (typeof document !== 'undefined') {
          document.body.style.cursor = 'auto';
        }
      }}
    >
      {/* ======================================================== */}
      {/* 1. FOUNDATION PLAZA PODIUM & APPROACH STEPS              */}
      {/* ======================================================== */}
      {/* Raised diorama base plinth with dark slate curb */}
      <mesh position={[0, -0.06, 0.2]} receiveShadow>
        <boxGeometry args={[width + 1.2, 0.22, depth + 1.6]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Elegant Paved Forecourt */}
      <mesh position={[0, 0.06, halfD + 0.9]} receiveShadow material={pavementMat}>
        <boxGeometry args={[4.4, 0.04, 1.6]} />
      </mesh>

      {/* Tiered Approach Steps (with inset LED step lights) */}
      <mesh position={[0, 0.16, halfD + 0.35]} castShadow receiveShadow material={whiteFrameMat}>
        <boxGeometry args={[3.2, 0.16, 0.7]} />
      </mesh>
      <mesh position={[0, 0.08, halfD + 0.85]} castShadow receiveShadow material={whiteFrameMat}>
        <boxGeometry args={[3.6, 0.16, 0.7]} />
      </mesh>
      {/* Glowing step LED strip */}
      <mesh position={[0, 0.17, halfD + 0.71]}>
        <boxGeometry args={[3.18, 0.02, 0.04]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.0} />
      </mesh>

      {/* Symmetrical Entrance Planters with Layered Topiary & Low Bollard Lights */}
      {[-2.3, 2.3].map((px, idx) => (
        <group key={`hero-planter-${idx}`} position={[px, 0.1, halfD + 0.8]}>
          {/* Planter Curb */}
          <mesh position={[0, 0.16, 0]} castShadow receiveShadow material={darkTrimMat}>
            <boxGeometry args={[0.9, 0.32, 0.9]} />
          </mesh>
          {/* Planter Top Molding */}
          <mesh position={[0, 0.33, 0]} material={whiteFrameMat}>
            <boxGeometry args={[0.96, 0.04, 0.96]} />
          </mesh>
          {/* Soil */}
          <mesh position={[0, 0.33, 0]}>
            <boxGeometry args={[0.82, 0.02, 0.82]} />
            <meshStandardMaterial color="#3f2e21" roughness={0.9} />
          </mesh>
          {/* Spherical Sculpted Foliage */}
          <mesh position={[0, 0.65, 0]} castShadow material={foliageMat}>
            <sphereGeometry args={[0.38, 14, 14]} />
          </mesh>
          {/* Flowering Accent Shrub */}
          <mesh position={[0, 0.95, 0]} castShadow>
            <sphereGeometry args={[0.18, 10, 10]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.5} />
          </mesh>
          {/* Miniature Illuminated Ground Bollard */}
          <mesh position={[px > 0 ? -0.55 : 0.55, 0.22, 0.35]} castShadow material={darkTrimMat}>
            <cylinderGeometry args={[0.05, 0.06, 0.44, 8]} />
          </mesh>
          <mesh position={[px > 0 ? -0.55 : 0.55, 0.42, 0.35]}>
            <cylinderGeometry args={[0.04, 0.04, 0.06, 8]} />
            <meshStandardMaterial color="#fef08a" emissive="#eab308" emissiveIntensity={2.2} />
          </mesh>
        </group>
      ))}

      {/* ======================================================== */}
      {/* 2. STRUCTURAL MASSING & ARCHITECTURAL SKELETON            */}
      {/* ======================================================== */}
      {/* Central Opaque Structural Core */}
      <mesh position={[-0.4, 3.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[width - 1.0, 7.2, depth - 0.4]} />
        <meshStandardMaterial color="#091224" roughness={0.65} metalness={0.3} />
      </mesh>

      {/* White Architectural Vertical Corner Columns (Heavy Chamfered Pylons) */}
      {[
        [-halfW + 0.15, -halfD + 0.15],
        [halfW - 0.15, -halfD + 0.15],
        [-halfW + 0.15, halfD - 0.15],
        [halfW - 0.15, halfD - 0.15],
      ].map(([cx, cz], idx) => (
        <mesh key={`col-${idx}`} position={[cx, 3.6, cz]} castShadow receiveShadow material={whiteFrameMat}>
          <boxGeometry args={[0.38, 7.3, 0.38]} />
        </mesh>
      ))}

      {/* ======================================================== */}
      {/* 3. FLOOR 1: GRAND MONUMENTAL ENTRANCE & GLASS LOBBY      */}
      {/* ======================================================== */}
      {/* Symmetrical Front Curtain Glass Panels */}
      <mesh position={[-2.1, 1.25, halfD + 0.02]} material={blueGlassMat}>
        <boxGeometry args={[1.7, 2.2, 0.08]} />
      </mesh>
      <mesh position={[2.1, 1.25, halfD + 0.02]} material={blueGlassMat}>
        <boxGeometry args={[1.7, 2.2, 0.08]} />
      </mesh>

      {/* Recessed Lobby Interior Glow & Reception Desk Preview */}
      <mesh position={[0, 0.5, halfD - 0.6]} material={lobbyInteriorMat}>
        <boxGeometry args={[1.6, 0.5, 0.5]} />
      </mesh>
      <mesh position={[0, 0.78, halfD - 0.6]} material={whiteFrameMat}>
        <boxGeometry args={[1.7, 0.06, 0.6]} />
      </mesh>

      {/* Grand Monumental Angled Entrance Portal Frame (Titanium Clad) */}
      <group position={[0, 1.35, halfD + 0.1]}>
        {/* Left Portal Pylon */}
        <mesh position={[-1.3, 0, 0.25]} castShadow material={whiteFrameMat}>
          <boxGeometry args={[0.32, 2.5, 0.65]} />
        </mesh>
        {/* Right Portal Pylon */}
        <mesh position={[1.3, 0, 0.25]} castShadow material={whiteFrameMat}>
          <boxGeometry args={[0.32, 2.5, 0.65]} />
        </mesh>
        {/* Monumental Portal Lintel / Transom Header */}
        <mesh position={[0, 1.25, 0.28]} castShadow material={whiteFrameMat}>
          <boxGeometry args={[2.92, 0.35, 0.72]} />
        </mesh>
        {/* Inset Dark Arch Trim */}
        <mesh position={[0, 1.05, 0.32]} material={darkTrimMat}>
          <boxGeometry args={[2.3, 0.08, 0.62]} />
        </mesh>
      </group>

      {/* Automated Double Glass Sliding Doors */}
      <mesh position={[0, 1.15, halfD + 0.05]} material={blueGlassMat}>
        <boxGeometry args={[1.9, 2.05, 0.06]} />
      </mesh>
      {/* Central Door Divide & Aluminum Mullions */}
      <mesh position={[0, 1.15, halfD + 0.09]} material={whiteFrameMat}>
        <boxGeometry args={[0.06, 2.05, 0.03]} />
      </mesh>
      {/* Sleek Stainless Steel Vertical Pull Handles */}
      {[-0.15, 0.15].map((hx, idx) => (
        <mesh key={`handle-${idx}`} position={[hx, 1.1, halfD + 0.12]} material={whiteFrameMat}>
          <boxGeometry args={[0.03, 0.6, 0.03]} />
        </mesh>
      ))}

      {/* Modern Cantilevered Glass Canopy with Diagonal Stainless Steel Tension Rods */}
      <group position={[0, 2.5, halfD + 0.8]}>
        {/* Canopy Tempered Glass Sheet */}
        <mesh castShadow material={blueGlassMat}>
          <boxGeometry args={[2.9, 0.08, 1.5]} />
        </mesh>
        {/* Canopy Polished Titanium Edge Bevel */}
        <mesh position={[0, 0, 0.76]} material={whiteFrameMat}>
          <boxGeometry args={[2.92, 0.1, 0.04]} />
        </mesh>
        {/* Canopy Underside Glowing Cyan LED Line */}
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[2.8, 0.02, 1.4]} />
          <primitive object={cyanAccentMat} attach="material" ref={cyanMaterialRef} />
        </mesh>
        {/* Stainless Steel Diagonal Tie-Rods / Suspension Cables */}
        {[-1.2, 1.2].map((tx, idx) => (
          <mesh
            key={`tie-rod-${idx}`}
            position={[tx, 0.55, -0.25]}
            rotation={[0.55, 0, 0]}
            material={whiteFrameMat}
          >
            <cylinderGeometry args={[0.025, 0.025, 1.35, 8]} />
          </mesh>
        ))}
        {/* Front Marquee Illuminated Sign: "SOFTWARE DEVELOPER" */}
        <mesh position={[0, 0.28, 0.78]} rotation={[0, 0, 0]}>
          <planeGeometry args={[2.7, 0.44]} />
          <meshStandardMaterial
            map={frontSignTex}
            emissive="#38bdf8"
            emissiveIntensity={isHovered ? 1.5 : 1.0}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Modern Architectural Wall Sconces (Exterior Accent Illumination) */}
      {[-1.8, 1.8].map((sx, idx) => (
        <group key={`hero-sconce-${idx}`} position={[sx, 1.8, halfD + 0.12]}>
          <mesh material={darkTrimMat}>
            <boxGeometry args={[0.1, 0.34, 0.08]} />
          </mesh>
          <mesh position={[0, 0.045, 0]}>
            <boxGeometry args={[0.07, 0.26, 0.02]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={3.0} />
          </mesh>
        </group>
      ))}

      {/* ======================================================== */}
      {/* 4. FLOOR 2: ENGINEERING LABS & CONTINUOUS CURTAIN GRID   */}
      {/* ======================================================== */}
      {/* Floor 2 Horizontal Cantilevered Slab */}
      <mesh position={[0, 2.5, 0]} castShadow material={whiteFrameMat}>
        <boxGeometry args={[width + 0.35, 0.22, depth + 0.35]} />
      </mesh>
      {/* Floor 2 Glowing Cyan Ribbon Strip */}
      <mesh position={[0, 2.5, halfD + 0.19]}>
        <boxGeometry args={[width + 0.37, 0.05, 0.03]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.8} />
      </mesh>

      {/* Floor 2 Front Glass Curtain Wall */}
      <mesh position={[0, 3.65, halfD + 0.03]} material={blueGlassMat}>
        <boxGeometry args={[width - 0.4, 2.05, 0.06]} />
      </mesh>
      {/* Vertical Structural Mullions Grid (Floor 2) */}
      {[-2.2, -1.1, 0, 1.1, 2.2].map((mx, idx) => (
        <mesh key={`f2-mullion-${idx}`} position={[mx, 3.65, halfD + 0.07]} material={whiteFrameMat}>
          <boxGeometry args={[0.07, 2.05, 0.05]} />
        </mesh>
      ))}
      {/* Intermediate Horizontal Spandrel Beam */}
      <mesh position={[0, 4.0, halfD + 0.06]} material={darkTrimMat}>
        <boxGeometry args={[width - 0.38, 0.12, 0.04]} />
      </mesh>

      {/* Floor 2 Side Curtain Walls */}
      <mesh position={[-halfW - 0.02, 3.65, 0]} rotation={[0, Math.PI / 2, 0]} material={blueGlassMat}>
        <boxGeometry args={[depth - 0.4, 2.05, 0.06]} />
      </mesh>
      <mesh position={[halfW + 0.02, 3.65, 0]} rotation={[0, Math.PI / 2, 0]} material={blueGlassMat}>
        <boxGeometry args={[depth - 0.4, 2.05, 0.06]} />
      </mesh>
      {/* Side Mullions */}
      {[-1.3, 0, 1.3].map((mz, idx) => (
        <mesh key={`f2-smullion-${idx}`} position={[-halfW - 0.05, 3.65, mz]} rotation={[0, Math.PI / 2, 0]} material={whiteFrameMat}>
          <boxGeometry args={[0.07, 2.05, 0.04]} />
        </mesh>
      ))}

      {/* ======================================================== */}
      {/* 5. FLOOR 3: EXECUTIVE SUITE & STEPPED OPEN TERRACE       */}
      {/* ======================================================== */}
      {/* Floor 3 Base Slab */}
      <mesh position={[0, 4.8, 0]} castShadow material={whiteFrameMat}>
        <boxGeometry args={[width + 0.35, 0.22, depth + 0.35]} />
      </mesh>
      {/* Floor 3 Glowing Cyan Accent Strip */}
      <mesh position={[0, 4.8, halfD + 0.19]}>
        <boxGeometry args={[width + 0.37, 0.05, 0.03]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.8} />
      </mesh>

      {/* Left Tower Volume Floor 3 (Enclosed Suite) */}
      <group position={[-1.1, 5.9, 0]}>
        {/* Core Enclosure */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[width * 0.62, 2.0, depth - 0.4]} />
          <meshStandardMaterial color="#091224" roughness={0.65} metalness={0.3} />
        </mesh>
        {/* Front Glass Curtain */}
        <mesh position={[0, 0, halfD - 0.18]} material={blueGlassMat}>
          <boxGeometry args={[width * 0.58, 1.95, 0.06]} />
        </mesh>
        {/* Vertical Mullions */}
        {[-1.2, 0, 1.2].map((mx, idx) => (
          <mesh key={`f3-mullion-${idx}`} position={[mx, 0, halfD - 0.14]} material={whiteFrameMat}>
            <boxGeometry args={[0.07, 1.95, 0.05]} />
          </mesh>
        ))}
      </group>

      {/* Right Wing: Executive Open-Air Sky Terrace (Stepped Setback) */}
      <group position={[2.0, 4.95, 0.2]}>
        {/* Terrace Deck Flooring (Teak / Slate Tiles) */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[2.0, 0.04, depth - 0.9]} />
          <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.2} />
        </mesh>
        {/* Glass Terrace Perimeter Balustrade */}
        {/* Front Railing */}
        <mesh position={[0, 0.35, (depth - 0.9) / 2]} material={blueGlassMat}>
          <boxGeometry args={[1.96, 0.65, 0.03]} />
        </mesh>
        <mesh position={[0, 0.68, (depth - 0.9) / 2]} material={whiteFrameMat}>
          <boxGeometry args={[2.0, 0.05, 0.05]} />
        </mesh>
        {/* Right Side Railing */}
        <mesh position={[0.98, 0.35, 0]} rotation={[0, Math.PI / 2, 0]} material={blueGlassMat}>
          <boxGeometry args={[depth - 0.9, 0.65, 0.03]} />
        </mesh>
        <mesh position={[0.98, 0.68, 0]} rotation={[0, Math.PI / 2, 0]} material={whiteFrameMat}>
          <boxGeometry args={[depth - 0.92, 0.05, 0.05]} />
        </mesh>
        {/* Terrace Architectural Planter & Miniature Bamboo */}
        <mesh position={[0.4, 0.18, -0.6]} castShadow material={darkTrimMat}>
          <boxGeometry args={[0.65, 0.32, 0.65]} />
        </mesh>
        <mesh position={[0.4, 0.52, -0.6]} castShadow material={foliageMat}>
          <cylinderGeometry args={[0.22, 0.12, 0.45, 8]} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 6. ROOFTOP MECHANICAL INFRASTRUCTURE (Image 1 Style)     */}
      {/* ======================================================== */}
      {/* Main Roof Slab (Over left tower volume) */}
      <mesh position={[-1.1, 7.0, 0]} castShadow material={whiteFrameMat}>
        <boxGeometry args={[width * 0.64 + 0.3, 0.24, depth - 0.2]} />
      </mesh>
      {/* Recessed Terracotta Roof Deck Area (As seen in Reference Image 1) */}
      <mesh position={[-1.1, 7.13, 0]} material={roofDeckMat}>
        <boxGeometry args={[width * 0.64, 0.02, depth - 0.5]} />
      </mesh>
      {/* Raised Perimeter Parapet Wall with Beveled Coping Stone */}
      <mesh position={[-1.1, 7.28, (depth - 0.5) / 2 + 0.02]} material={whiteFrameMat}>
        <boxGeometry args={[width * 0.64 + 0.2, 0.32, 0.08]} />
      </mesh>
      <mesh position={[-1.1, 7.28, -(depth - 0.5) / 2 - 0.02]} material={whiteFrameMat}>
        <boxGeometry args={[width * 0.64 + 0.2, 0.32, 0.08]} />
      </mesh>
      <mesh position={[-1.1 - (width * 0.64) / 2 - 0.02, 7.28, 0]} rotation={[0, Math.PI / 2, 0]} material={whiteFrameMat}>
        <boxGeometry args={[depth - 0.4, 0.32, 0.08]} />
      </mesh>
      {/* Glowing Cyan Roof Crown Edge */}
      <mesh position={[-1.1, 7.45, (depth - 0.5) / 2 + 0.04]}>
        <boxGeometry args={[width * 0.64 + 0.22, 0.04, 0.03]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.0} />
      </mesh>

      {/* Dual Industrial Rooftop HVAC Chiller Units (Curved Ducts & Exhaust Fan Grilles) */}
      <group position={[-2.1, 7.42, -0.6]}>
        {/* Main Chiller Enclosure */}
        <mesh castShadow material={darkTrimMat}>
          <boxGeometry args={[1.1, 0.6, 0.9]} />
        </mesh>
        {/* Twin Exhaust Fan Domes */}
        {[-0.26, 0.26].map((fx, idx) => (
          <group key={`hvac-fan-${idx}`} position={[fx, 0.31, 0]}>
            <mesh material={whiteFrameMat}>
              <cylinderGeometry args={[0.2, 0.22, 0.06, 12]} />
            </mesh>
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.02, 12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.9} />
            </mesh>
          </group>
        ))}
        {/* Galvanized Curved Ventilation Ductwork (Image 1 Style) */}
        <mesh position={[0.7, 0.15, 0.1]} material={whiteFrameMat}>
          <boxGeometry args={[0.35, 0.35, 0.6]} />
        </mesh>
      </group>

      {/* Dual Rooftop Photovoltaic Solar Arrays (Tilted 25° South-Facing) */}
      {[-0.4, 0.5].map((sx, idx) => (
        <group key={`hero-solar-${idx}`} position={[sx, 7.35, -0.7]} rotation={[0.42, 0, 0]}>
          {/* Aluminum Stand / Brackets */}
          <mesh position={[0, -0.06, 0]} material={darkTrimMat}>
            <boxGeometry args={[0.75, 0.08, 0.95]} />
          </mesh>
          {/* Photovoltaic Solar Panel Surface */}
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.72, 0.03, 0.92]} />
            <meshStandardMaterial
              map={solarPanelTex}
              roughness={0.15}
              metalness={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Motorized Communications Satellite Dish (Sweep Animation) */}
      <group ref={satelliteDishRef} position={[-0.4, 7.25, 0.8]}>
        {/* Base Pedestal */}
        <mesh position={[0, 0.1, 0]} material={darkTrimMat}>
          <cylinderGeometry args={[0.12, 0.18, 0.2, 10]} />
        </mesh>
        {/* Angled Parabolic Dish */}
        <group position={[0, 0.28, 0]} rotation={[-0.45, 0, 0]}>
          <mesh castShadow material={whiteFrameMat}>
            <cylinderGeometry args={[0.42, 0.1, 0.14, 16]} />
          </mesh>
          {/* Dish Center Feed Horn & Tripod Strut */}
          <mesh position={[0, 0.16, 0]} material={darkTrimMat}>
            <cylinderGeometry args={[0.02, 0.03, 0.24, 8]} />
          </mesh>
          <mesh position={[0, 0.28, 0]} material={cyanAccentMat}>
            <sphereGeometry args={[0.04, 8, 8]} />
          </mesh>
        </group>
      </group>

      {/* Slender Rooftop Telecom Antenna Mast with Red Aviation Flashing Beacon */}
      <group position={[-2.4, 7.25, 1.2]}>
        <mesh position={[0, 0.8, 0]} material={whiteFrameMat}>
          <cylinderGeometry args={[0.03, 0.06, 1.6, 8]} />
        </mesh>
        <mesh position={[0, 1.0, 0]} material={darkTrimMat}>
          <boxGeometry args={[0.3, 0.02, 0.02]} />
        </mesh>
        <mesh ref={beaconMeshRef} position={[0, 1.62, 0]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.5} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 7. ILLUMINATED ROOFTOP BILLBOARD SIGN                    */}
      {/* ======================================================== */}
      {/* Heavy Structural Rear Truss Backstays (Angled 10° for Isometric View) */}
      <group position={[-1.1, 8.4, 1.2]} rotation={[-0.17, 0, 0]}>
        {/* Dual Vertical Mounting Pylons */}
        {[-1.9, 1.9].map((px, idx) => (
          <mesh key={`sign-pylon-${idx}`} position={[px, -0.6, -0.05]} material={darkTrimMat}>
            <cylinderGeometry args={[0.06, 0.08, 1.4, 8]} />
          </mesh>
        ))}

        {/* Diagonal Steel Cross-Bracing Behind Billboard */}
        <mesh position={[0, -0.5, -0.1]} rotation={[0, 0, 0.35]} material={darkTrimMat}>
          <boxGeometry args={[2.8, 0.04, 0.04]} />
        </mesh>
        <mesh position={[0, -0.5, -0.1]} rotation={[0, 0, -0.35]} material={darkTrimMat}>
          <boxGeometry args={[2.8, 0.04, 0.04]} />
        </mesh>

        {/* Main Billboard Backing Chassis */}
        <mesh castShadow material={darkTrimMat}>
          <boxGeometry args={[5.0, 1.22, 0.14]} />
        </mesh>
        {/* Glowing Cyan LED Perimeter Bezel */}
        <mesh position={[0, 0, 0.072]}>
          <boxGeometry args={[5.06, 1.28, 0.02]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={isHovered || isSelected ? 2.8 : 1.6}
          />
        </mesh>
        {/* High-Res Front Sign Texture Face */}
        <mesh position={[0, 0, 0.09]}>
          <planeGeometry args={[4.92, 1.14]} />
          <meshStandardMaterial
            map={rooftopSignTex}
            emissive="#ffffff"
            emissiveIntensity={isHovered || isSelected ? 1.7 : 1.15}
            roughness={0.2}
          />
        </mesh>

        {/* Top-Mounted LED Floodlight Fixtures (Illuminating Sign Face) */}
        {[-1.8, -0.6, 0.6, 1.8].map((lx, idx) => (
          <group key={`floodlight-${idx}`} position={[lx, 0.68, 0.15]}>
            <mesh material={darkTrimMat}>
              <boxGeometry args={[0.15, 0.08, 0.2]} />
            </mesh>
            <mesh position={[0, -0.04, 0.05]}>
              <boxGeometry args={[0.12, 0.02, 0.08]} />
              <meshStandardMaterial color="#ffffff" emissive="#00f0ff" emissiveIntensity={3.0} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Ground Light Splash when Hovered or Selected (HIGH tier only) */}
      {(isHovered || isSelected) && allowPointLight && (
        <pointLight position={[0, 2.4, halfD + 1.2]} color="#00f0ff" intensity={2.2} distance={7} />
      )}
    </group>
  );
};

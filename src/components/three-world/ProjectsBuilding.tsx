'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePerformanceQuality } from '../PerformanceControl';

export interface ProjectsBuildingProps {
  position?: [number, number, number];
  onSelect: () => void;
  isSelected?: boolean;
}

/**
 * Procedural Texture for Sign: "PROJECTS // INNOVATION CENTER"
 */
function createProjectsSignTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 140;
  const ctx = canvas.getContext('2d')!;

  // Deep obsidian violet-slate glass background
  ctx.fillStyle = '#0a0817';
  ctx.fillRect(0, 0, 512, 140);

  // Glowing violet border
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 128);

  // Inner subtle cyan accent frame
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, 484, 112);

  // Tech crosshair markings in corners
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(16, 16, 12, 3);
  ctx.fillRect(16, 16, 3, 12);
  ctx.fillRect(484, 16, 12, 3);
  ctx.fillRect(493, 16, 3, 12);

  // Main Title: "PROJECTS"
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 56px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#c084fc';
  ctx.shadowBlur = 18;
  ctx.fillText('PROJECTS', 256, 56);

  // Subtitle: "INNOVATION CENTER • AI LABS"
  ctx.shadowBlur = 0;
  ctx.font = 'bold 15px monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.letterSpacing = '5px';
  ctx.fillText('INNOVATION CENTER • AI LABS', 256, 106);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural Dynamic Digital Billboard Texture Generator
 */
function createBillboardCanvas(): { canvas: HTMLCanvasElement; updateTicker: (time: number) => void } {
  if (typeof window === 'undefined') {
    return {
      canvas: (document?.createElement('canvas') as any) || {},
      updateTicker: () => {},
    };
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const items = [
    { title: 'FLOWSYNC', sub: 'Real-Time AI Sprint Collaboration' },
    { title: 'ECHO DESKTOP AI', sub: 'Cross-Platform AI Desktop Co-Pilot' },
    { title: 'TRAQINN VTS', sub: 'Real-Time GPS Bus & Fleet Tracking' },
    { title: 'TELEMEDICINE', sub: 'Bluetooth BLE Medical IoT Vitals' },
  ];

  const updateTicker = (time: number) => {
    // Cyberpunk dark background
    ctx.fillStyle = '#070614';
    ctx.fillRect(0, 0, 512, 256);

    // Cyan grid scanlines
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
    ctx.lineWidth = 1;
    for (let y = 0; y < 256; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    // Active project cycle (changes every 2.4s)
    const index = Math.floor(time / 2.4) % items.length;
    const current = items[index];

    // Animated scanline laser bar
    const scanY = (time * 120) % 256;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.fillRect(0, scanY, 512, 8);

    // Glowing border
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, 496, 240);

    // Header label
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('FEATURED EXHIBIT // VERIFIED BUILD', 32, 48);

    // Title
    ctx.font = 'bold 42px system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 12;
    ctx.fillText(current.title, 32, 116);

    // Subtitle description
    ctx.shadowBlur = 0;
    ctx.font = '18px monospace';
    ctx.fillStyle = '#c084fc';
    ctx.fillText(current.sub, 32, 168);

    // Bottom telemetry bar
    const progressWidth = ((time % 2.4) / 2.4) * 448;
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(32, 206, progressWidth, 4);
  };

  return { canvas, updateTicker };
}

/**
 * ProjectsBuilding Component
 * Architecturally Upgraded Futuristic Innovation Center:
 * - Refined glass geodesic dome with structural meridian ribs and top spire antenna
 * - Chamfered deep-violet composite hull with titanium corner pylons and horizontal louvers
 * - High-tech entrance portal with illuminated sliding doors and canopy tie-rods
 * - Animated digital billboard ticker display (throttled to 20 FPS)
 * - Sculpted hexagonal exhibition pedestal with rotating floating holographic artifact
 * - Deep panoramic exhibition viewing galleries with opaque reflective glass
 * - Illuminated "PROJECTS" marquee sign
 */
export const ProjectsBuilding: React.FC<ProjectsBuildingProps> = ({
  position = [-7.85, 0.74, 7.35],
  onSelect,
  isSelected = false,
}) => {
  const { effectiveTier, prefersReducedMotion } = usePerformanceQuality();
  const allowPointLights = effectiveTier === 'high';

  const [isHovered, setIsHovered] = useState(false);
  const rootGroupRef = useRef<THREE.Group>(null);
  const hologramRef = useRef<THREE.Group>(null);
  const spireLightRef = useRef<THREE.Mesh>(null);
  const purpleAccentMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const billboardTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const lastTickerTimeRef = useRef<number>(0);

  const signTex = useMemo(() => createProjectsSignTexture(), []);

  const billboardEngine = useMemo(() => {
    const engine = createBillboardCanvas();
    const texture = new THREE.CanvasTexture(engine.canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    billboardTextureRef.current = texture;
    return { engine, texture };
  }, []);

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

    // 2. Floating Holographic Artifact Rotation
    if (hologramRef.current && !prefersReducedMotion) {
      hologramRef.current.rotation.x += delta * 1.1;
      hologramRef.current.rotation.y += delta * 1.5;
      hologramRef.current.position.y = 1.65 + Math.sin(time * 2.5) * 0.12;
    }

    // 3. Dome Spire Beacon Flash
    if (spireLightRef.current && spireLightRef.current.material && !prefersReducedMotion) {
      const beaconCycle = (Math.sin(time * 4.5) + 1) * 0.5;
      const flash = Math.pow(beaconCycle, 4);
      (spireLightRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.2 + flash * 4.0;
    }

    // 4. Dynamic Billboard Ticker Update (Strictly throttled to 20 FPS)
    if (billboardTextureRef.current && time - lastTickerTimeRef.current >= 0.05 && !prefersReducedMotion) {
      lastTickerTimeRef.current = time;
      billboardEngine.engine.updateTicker(time);
      billboardTextureRef.current.needsUpdate = true;
    }

    // 5. Subtle dome window illumination breathing
    if (domeGlassMat && !prefersReducedMotion) {
      domeGlassMat.emissiveIntensity = 0.32 + Math.sin(time * 1.3) * 0.06;
    }

    // 6. Emissive hover glow
    if (purpleAccentMatRef.current) {
      if (isHovered || isSelected) {
        const pulse = 2.0 + Math.sin(time * 5.0) * 0.6;
        purpleAccentMatRef.current.emissiveIntensity = pulse;
      } else {
        purpleAccentMatRef.current.emissiveIntensity = 1.2;
      }
    }
  });

  const width = 6.0;
  const depth = 5.0;
  const halfW = width / 2; // 3.0
  const halfD = depth / 2; // 2.5

  // Shared Reusable Architectural Materials
  const purpleCompositeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#581c87', // Deep Royal Violet
        roughness: 0.32,
        metalness: 0.45,
      }),
    []
  );

  const titaniumSlateMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.45,
        metalness: 0.5,
      }),
    []
  );

  const reflectiveGlassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0284c7',
        emissive: '#7c3aed',
        emissiveIntensity: 0.25,
        roughness: 0.1,
        metalness: 0.88,
        transparent: false,
      }),
    []
  );

  const domeGlassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        emissive: '#0284c7',
        emissiveIntensity: 0.35,
        roughness: 0.12,
        metalness: 0.75,
        transparent: false,
      }),
    []
  );

  const cyanAccentMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#00f0ff',
        emissive: '#00f0ff',
        emissiveIntensity: 2.0,
      }),
    []
  );

  return (
    <group
      ref={rootGroupRef}
      position={position}
      name="ProjectsInnovationCenter"
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
      {/* 1. FOUNDATION PODIUM & PLAZA APRON                       */}
      {/* ======================================================== */}
      {/* Dark Titanium Base Plinth */}
      <mesh position={[0, -0.06, 0.2]} receiveShadow material={titaniumSlateMat}>
        <boxGeometry args={[width + 1.2, 0.22, depth + 1.4]} />
      </mesh>
      {/* Glowing Violet Step Trim */}
      <mesh position={[0, 0.08, halfD + 0.88]}>
        <boxGeometry args={[3.6, 0.03, 0.04]} />
        <meshStandardMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={2.0} />
      </mesh>

      {/* ======================================================== */}
      {/* 2. MAIN EXHIBITION PAVILION MASS (y = 0 to 3.6)          */}
      {/* ======================================================== */}
      {/* Primary Purple Composite Pavilion Body */}
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow material={purpleCompositeMat}>
        <boxGeometry args={[width, 3.6, depth]} />
      </mesh>

      {/* Titanium Cylindrical Corner Pylons with Inset LED Strips */}
      {[
        [-halfW + 0.1, -halfD + 0.1],
        [halfW - 0.1, -halfD + 0.1],
        [-halfW + 0.1, halfD - 0.1],
        [halfW - 0.1, halfD - 0.1],
      ].map(([cx, cz], idx) => (
        <group key={`corner-pylon-${idx}`} position={[cx, 1.8, cz]}>
          <mesh material={titaniumSlateMat}>
            <cylinderGeometry args={[0.26, 0.26, 3.65, 16]} />
          </mesh>
          <mesh position={[0, 0, 0.2]}>
            <boxGeometry args={[0.04, 3.4, 0.04]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.8} />
          </mesh>
        </group>
      ))}

      {/* Horizontal Architectural Ribbon Band */}
      <mesh position={[0, 1.8, halfD + 0.03]}>
        <boxGeometry args={[width + 0.1, 0.12, 0.04]} />
        <meshStandardMaterial
          ref={purpleAccentMatRef}
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={isHovered || isSelected ? 2.5 : 1.2}
        />
      </mesh>

      {/* Grand Entrance Double Glass Doors */}
      <group position={[0, 1.2, halfD + 0.04]}>
        <mesh material={reflectiveGlassMat}>
          <boxGeometry args={[2.0, 2.2, 0.06]} />
        </mesh>
        <mesh material={titaniumSlateMat}>
          <boxGeometry args={[0.06, 2.2, 0.08]} />
        </mesh>
        {/* Handles */}
        {[-0.14, 0.14].map((hx, idx) => (
          <mesh key={`p-handle-${idx}`} position={[hx, 0, 0.07]} material={cyanAccentMat}>
            <boxGeometry args={[0.03, 0.6, 0.03]} />
          </mesh>
        ))}
        {/* Entrance Portal Frame */}
        <mesh position={[0, 1.15, 0.35]} castShadow material={titaniumSlateMat}>
          <boxGeometry args={[2.4, 0.1, 0.8]} />
        </mesh>
      </group>

      {/* Side Exhibition Viewing Windows (East Facade) */}
      <group position={[halfW + 0.04, 1.8, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh material={reflectiveGlassMat}>
          <boxGeometry args={[3.2, 2.3, 0.06]} />
        </mesh>
        {/* Vertical Mullions */}
        {[-1.0, 0, 1.0].map((mx, idx) => (
          <mesh key={`p-mullion-${idx}`} position={[mx, 0, 0.04]} material={titaniumSlateMat}>
            <boxGeometry args={[0.08, 2.3, 0.04]} />
          </mesh>
        ))}
      </group>

      {/* ======================================================== */}
      {/* 3. REFINED GLASS GEODESIC DOME & OBSERVATION ROOF        */}
      {/* ======================================================== */}
      {/* Roof Deck Slab */}
      <mesh position={[0, 3.65, 0]} castShadow material={titaniumSlateMat}>
        <boxGeometry args={[width + 0.35, 0.18, depth + 0.35]} />
      </mesh>

      {/* Circular Observation Gallery Collar */}
      <mesh position={[0, 3.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.36, 32]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.2} />
      </mesh>

      {/* Central Refined Hemispherical Glass Dome */}
      <mesh position={[0, 3.75, 0]} material={domeGlassMat}>
        <sphereGeometry args={[2.2, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* Dome Structural Metallic Meridian Ribs & Latitudinal Rings */}
      {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((angle, idx) => (
        <mesh key={`dome-rib-${idx}`} position={[0, 3.75, 0]} rotation={[0, angle, 0]}>
          <torusGeometry args={[2.22, 0.04, 8, 28, Math.PI]} />
          <meshStandardMaterial color="#a855f7" metalness={0.85} roughness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, 4.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.035, 8, 28]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.5} />
      </mesh>

      {/* Top Spire Antenna with Flashing Cyan Beacon */}
      <group position={[0, 5.95, 0]}>
        <mesh position={[0, 0.45, 0]} material={titaniumSlateMat}>
          <cylinderGeometry args={[0.03, 0.07, 0.9, 8]} />
        </mesh>
        <mesh ref={spireLightRef} position={[0, 0.95, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.5} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 4. ILLUMINATED "PROJECTS" MARQUEE SIGN                   */}
      {/* ======================================================== */}
      <group position={[0, 3.2, halfD + 0.35]} rotation={[-0.14, 0, 0]}>
        <mesh castShadow material={titaniumSlateMat}>
          <boxGeometry args={[3.2, 0.9, 0.1]} />
        </mesh>
        <mesh position={[0, 0, 0.055]}>
          <boxGeometry args={[3.24, 0.94, 0.02]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={isHovered || isSelected ? 2.5 : 1.4} />
        </mesh>
        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[3.1, 0.82]} />
          <meshStandardMaterial
            map={signTex}
            emissive="#ffffff"
            emissiveIntensity={isHovered || isSelected ? 1.7 : 1.1}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 5. ANIMATED DIGITAL BILLBOARD DISPLAY AT ENTRANCE        */}
      {/* ======================================================== */}
      <group position={[halfW - 0.5, 1.4, halfD + 0.7]} rotation={[0, -0.32, 0]}>
        {/* Chassis Frame */}
        <mesh castShadow material={titaniumSlateMat}>
          <boxGeometry args={[2.2, 1.3, 0.1]} />
        </mesh>
        {/* Support Base Pylon */}
        <mesh position={[0, -0.9, 0]} material={titaniumSlateMat}>
          <cylinderGeometry args={[0.09, 0.12, 0.8, 12]} />
        </mesh>
        {/* Animated Display Face */}
        <mesh position={[0, 0, 0.055]}>
          <planeGeometry args={[2.1, 1.2]} />
          <meshBasicMaterial map={billboardEngine.texture} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 6. OUTDOOR EXHIBITION PLATFORM & FLOATING HOLOGRAM       */}
      {/* ======================================================== */}
      <group position={[-halfW + 0.9, 0.02, halfD + 0.9]}>
        {/* Hexagonal Exhibition Plinth */}
        <mesh position={[0, 0.14, 0]} castShadow receiveShadow material={titaniumSlateMat}>
          <cylinderGeometry args={[0.95, 1.05, 0.28, 6]} />
        </mesh>
        {/* Glowing Cyan Perimeter Ring */}
        <mesh position={[0, 0.285, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.72, 0.86, 6]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.5} />
        </mesh>

        {/* Floating Rotating Holographic Artifact */}
        <group ref={hologramRef} position={[0, 1.65, 0]}>
          {/* Inner Glowing Octahedron */}
          <mesh>
            <octahedronGeometry args={[0.44, 0]} />
            <meshStandardMaterial
              color="#a855f7"
              emissive="#a855f7"
              emissiveIntensity={2.8}
              transparent
              opacity={0.88}
              roughness={0.1}
            />
          </mesh>
          {/* Outer Gyroscope Rings */}
          <mesh rotation={[0.4, 0.4, 0]}>
            <torusGeometry args={[0.62, 0.026, 12, 28]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2.5} />
          </mesh>
        </group>

        {/* Pedestal Projector Spotlight (High tier only) */}
        {allowPointLights && (
          <pointLight position={[0, 0.4, 0]} color="#38bdf8" intensity={1.5} distance={3.5} />
        )}
      </group>

      {/* Ambient Violet Pool on Hover (High tier only) */}
      {(isHovered || isSelected) && allowPointLights && (
        <pointLight position={[0, 2.0, halfD + 1.2]} color="#c084fc" intensity={2.2} distance={6.0} />
      )}
    </group>
  );
};

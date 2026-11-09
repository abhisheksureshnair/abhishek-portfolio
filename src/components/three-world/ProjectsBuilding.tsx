'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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

  // Dark violet-slate glass background
  ctx.fillStyle = '#0d0b1a';
  ctx.fillRect(0, 0, 512, 140);

  // Glowing purple-cyan neon border
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 128);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, 484, 112);

  // Main Title: "PROJECTS"
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 54px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#c084fc';
  ctx.shadowBlur = 18;
  ctx.fillText('PROJECTS', 256, 58);

  // Subtitle: "INNOVATION CENTER"
  ctx.shadowBlur = 0;
  ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.letterSpacing = '6px';
  ctx.fillText('INNOVATION CENTER', 256, 106);

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
 * Futuristic Purple & Blue Technology Exhibition Building:
 * - Curved glass geodesic dome roof
 * - Glowing "PROJECTS" marquee sign
 * - Animated digital billboard ticker at the entrance
 * - Outdoor exhibition platform with rotating floating holographic artifact
 * - Deep purple and cyan architectural cladding
 */
export const ProjectsBuilding: React.FC<ProjectsBuildingProps> = ({
  position = [-7.85, 0.74, 7.35],
  onSelect,
  isSelected = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const hologramRef = useRef<THREE.Group>(null);
  const purpleAccentMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const billboardTextureRef = useRef<THREE.CanvasTexture | null>(null);

  const signTex = useMemo(() => createProjectsSignTexture(), []);

  const billboardEngine = useMemo(() => {
    const engine = createBillboardCanvas();
    const texture = new THREE.CanvasTexture(engine.canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    billboardTextureRef.current = texture;
    return { engine, texture };
  }, []);

  // Idle animations: holographic artifact rotation & animated billboard updates
  useFrame((_, delta) => {
    const time = performance.now() * 0.001;

    // 1. Floating Holographic Shape Animation
    if (hologramRef.current) {
      hologramRef.current.rotation.x += delta * 1.2;
      hologramRef.current.rotation.y += delta * 1.6;
      hologramRef.current.position.y = 1.65 + Math.sin(time * 2.5) * 0.12;
    }

    // 2. Dynamic Billboard Ticker Update (at 20 FPS to stay lightweight)
    if (billboardTextureRef.current) {
      billboardEngine.engine.updateTicker(time);
      billboardTextureRef.current.needsUpdate = true;
    }

    // 3. Emissive hover glow
    if (purpleAccentMatRef.current) {
      if (isHovered || isSelected) {
        const pulse = 2.0 + Math.sin(time * 6) * 0.6;
        purpleAccentMatRef.current.emissiveIntensity = pulse;
      } else {
        purpleAccentMatRef.current.emissiveIntensity = 1.2;
      }
    }
  });

  const width = 5.8;
  const depth = 4.8;
  const halfW = width / 2; // 2.9
  const halfD = depth / 2; // 2.4

  // Materials
  const purpleShellMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#6d28d9', // Futuristic Deep Purple
        roughness: 0.35,
        metalness: 0.3,
      }),
    []
  );

  const titaniumFrameMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0f172a', // Titanium Slate
        roughness: 0.5,
        metalness: 0.4,
      }),
    []
  );

  const cyanGlassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        roughness: 0.1,
        metalness: 0.2,
        transparent: true,
        opacity: 0.82,
      }),
    []
  );

  return (
    <group
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
      {/* 1. MAIN EXHIBITION HALL BASE VOLUME (y = 0 to 3.6)       */}
      {/* ======================================================== */}
      {/* Curved / Beveled Main Purple Pavilion Body */}
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow material={purpleShellMat}>
        <boxGeometry args={[width, 3.6, depth]} />
      </mesh>

      {/* Titanium Structural Corner Pillars */}
      {[
        [-halfW, -halfD],
        [halfW, -halfD],
        [-halfW, halfD],
        [halfW, halfD],
      ].map(([cx, cz], idx) => (
        <mesh key={idx} position={[cx, 1.8, cz]} material={titaniumFrameMat}>
          <cylinderGeometry args={[0.26, 0.26, 3.65, 16]} />
        </mesh>
      ))}

      {/* Glowing Cyan & Violet Mid-Band Trim */}
      <mesh position={[0, 1.8, halfD + 0.02]}>
        <boxGeometry args={[width + 0.1, 0.08, 0.04]} />
        <meshStandardMaterial
          ref={purpleAccentMatRef}
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={isHovered || isSelected ? 2.5 : 1.2}
        />
      </mesh>

      {/* East & South Glass Exhibition Viewing Bays */}
      <mesh position={[halfW + 0.02, 1.8, 0]} rotation={[0, Math.PI / 2, 0]} material={cyanGlassMat}>
        <boxGeometry args={[3.2, 2.4, 0.06]} />
      </mesh>
      <mesh position={[0, 1.8, halfD + 0.02]} material={cyanGlassMat}>
        <boxGeometry args={[3.2, 2.4, 0.06]} />
      </mesh>

      {/* ======================================================== */}
      {/* 2. CURVED GLASS GEODESIC DOME ROOF (y = 3.6 to 5.4)      */}
      {/* ======================================================== */}
      {/* Roof Platform Slab */}
      <mesh position={[0, 3.65, 0]} castShadow material={titaniumFrameMat}>
        <boxGeometry args={[width + 0.3, 0.16, depth + 0.3]} />
      </mesh>

      {/* Glowing Neon Roof Perimeter Ring */}
      <mesh position={[0, 3.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.32, 32]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2.0} />
      </mesh>

      {/* Central Translucent Curved Glass Dome */}
      <mesh position={[0, 3.75, 0]}>
        <sphereGeometry args={[2.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <primitive object={cyanGlassMat} attach="material" />
      </mesh>

      {/* Dome Structural Metallic Meridian Ribs */}
      {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((angle, idx) => (
        <mesh key={idx} position={[0, 3.75, 0]} rotation={[0, angle, 0]}>
          <torusGeometry args={[2.22, 0.035, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#a855f7" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* ======================================================== */}
      {/* 3. GLOWING "PROJECTS" MARQUEE SIGN                       */}
      {/* ======================================================== */}
      <group position={[0, 3.2, halfD + 0.3]} rotation={[-0.15, 0, 0]}>
        <mesh castShadow material={titaniumFrameMat}>
          <boxGeometry args={[2.8, 0.85, 0.08]} />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[2.7, 0.78]} />
          <meshStandardMaterial
            map={signTex}
            emissive="#ffffff"
            emissiveIntensity={isHovered || isSelected ? 1.6 : 1.1}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 4. ANIMATED DIGITAL BILLBOARD AT ENTRANCE                */}
      {/* ======================================================== */}
      <group position={[halfW - 0.5, 1.4, halfD + 0.6]} rotation={[0, -0.3, 0]}>
        {/* Billboard Frame */}
        <mesh castShadow material={titaniumFrameMat}>
          <boxGeometry args={[2.1, 1.25, 0.1]} />
        </mesh>
        {/* Support Base Pylon */}
        <mesh position={[0, -0.9, 0]} material={titaniumFrameMat}>
          <cylinderGeometry args={[0.08, 0.12, 0.8, 12]} />
        </mesh>
        {/* Animated Display Face */}
        <mesh position={[0, 0, 0.055]}>
          <planeGeometry args={[2.0, 1.15]} />
          <meshBasicMaterial map={billboardEngine.texture} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 5. SMALL OUTDOOR EXHIBITION PLATFORM & HOLOGRAM          */}
      {/* ======================================================== */}
      <group position={[-halfW + 0.8, 0.02, halfD + 0.8]}>
        {/* Raised Hexagonal Pedestal */}
        <mesh position={[0, 0.12, 0]} castShadow receiveShadow material={titaniumFrameMat}>
          <cylinderGeometry args={[0.85, 0.95, 0.24, 6]} />
        </mesh>
        {/* Glowing Cyan Edge Ring on Pedestal */}
        <mesh position={[0, 0.245, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.65, 0.78, 6]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.5} />
        </mesh>

        {/* Floating Rotating Holographic Geometric Artifact */}
        <group ref={hologramRef} position={[0, 1.65, 0]}>
          {/* Inner Glowing Octahedron */}
          <mesh>
            <octahedronGeometry args={[0.42, 0]} />
            <meshStandardMaterial
              color="#a855f7"
              emissive="#a855f7"
              emissiveIntensity={2.8}
              transparent
              opacity={0.88}
              roughness={0.1}
            />
          </mesh>
          {/* Outer Wireframe / Nested Ring */}
          <mesh rotation={[0.4, 0.4, 0]}>
            <torusGeometry args={[0.6, 0.025, 12, 24]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2.5} />
          </mesh>
        </group>

        {/* Pedestal Upward Projector Light */}
        <pointLight position={[0, 0.4, 0]} color="#38bdf8" intensity={1.5} distance={3.5} />
      </group>

      {/* Ambient Violet Pool on Hover */}
      {(isHovered || isSelected) && (
        <pointLight position={[0, 2.0, halfD + 1.2]} color="#c084fc" intensity={2.2} distance={6.0} />
      )}
    </group>
  );
};


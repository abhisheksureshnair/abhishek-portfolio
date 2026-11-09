'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface AboutBuildingProps {
  position?: [number, number, number];
  onSelect: () => void;
  isSelected?: boolean;
}

/**
 * Procedural High-Res Texture for Sign: "ABOUT ME"
 */
function createAboutSignTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  // Dark slate acrylic backing
  ctx.fillStyle = '#0f141c';
  ctx.fillRect(0, 0, 512, 160);

  // Warm orange glowing border
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 148);

  // Inner subtle accent frame
  ctx.strokeStyle = 'rgba(251, 146, 60, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, 484, 132);

  // Main Title: "ABOUT ME"
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 58px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#f97316';
  ctx.shadowBlur = 16;
  ctx.fillText('ABOUT ME', 256, 70);

  // Subtitle: "CREATIVE STUDIO"
  ctx.shadowBlur = 0;
  ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#fdba74';
  ctx.letterSpacing = '5px';
  ctx.fillText('CREATIVE STUDIO', 256, 122);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * AboutBuilding Component
 * Unique Two-Story Creative Studio:
 * - Warm orange terracotta & white architectural walls
 * - Tall floor-to-ceiling glass studio windows
 * - Rooftop terrace with wooden deck, pergola, and rooftop ventilation fan
 * - Cantilevered second-floor balcony with lush planter foliage
 * - Illuminated "ABOUT ME" sign
 * - Idle animations: rotating rooftop fan & pulsing warm interior window illumination
 */
export const AboutBuilding: React.FC<AboutBuildingProps> = ({
  position = [7.85, 0.74, -7.35],
  onSelect,
  isSelected = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const fanBladesRef = useRef<THREE.Group>(null);
  const interiorLightRef = useRef<THREE.PointLight>(null);
  const orangeAccentMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const signTex = useMemo(() => createAboutSignTexture(), []);

  // Idle animations: rooftop fan rotation & breathing window illumination
  useFrame((_, delta) => {
    // 1. Rooftop Fan Rotation
    if (fanBladesRef.current) {
      fanBladesRef.current.rotation.y += delta * 4.2;
    }

    // 2. Breathing Studio Window Light
    const time = performance.now() * 0.001;
    if (interiorLightRef.current) {
      interiorLightRef.current.intensity = 1.2 + Math.sin(time * 2.0) * 0.35;
    }

    // 3. Emissive highlight on hover/selected
    if (orangeAccentMatRef.current) {
      if (isHovered || isSelected) {
        const pulse = 1.8 + Math.sin(time * 6) * 0.5;
        orangeAccentMatRef.current.emissiveIntensity = pulse;
      } else {
        orangeAccentMatRef.current.emissiveIntensity = 1.0;
      }
    }
  });

  const width = 5.6;
  const depth = 4.6;
  const halfW = width / 2; // 2.8
  const halfD = depth / 2; // 2.3

  // Materials
  const warmOrangeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ea580c', // Warm Terracotta Orange
        roughness: 0.55,
        metalness: 0.05,
      }),
    []
  );

  const whiteStuccoMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f8fafc', // Crisp Clean White
        roughness: 0.3,
        metalness: 0.04,
      }),
    []
  );

  const timberMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#b45309', // Warm Cedar Slat
        roughness: 0.7,
        metalness: 0.05,
      }),
    []
  );

  const tallGlassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        roughness: 0.1,
        metalness: 0.25,
        transparent: true,
        opacity: 0.85,
      }),
    []
  );

  const deckWoodMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#78350f',
        roughness: 0.8,
        metalness: 0.02,
      }),
    []
  );

  const darkTrimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.6,
        metalness: 0.15,
      }),
    []
  );

  return (
    <group
      position={position}
      name="AboutBuilding"
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
      {/* 1. STRUCTURAL MASS & TWO-STORY MAIN VOLUME               */}
      {/* ======================================================== */}
      {/* Ground & Second floor main structural shell (Warm Orange) */}
      <mesh position={[0, 2.4, 0]} castShadow receiveShadow material={warmOrangeMat}>
        <boxGeometry args={[width, 4.8, depth]} />
      </mesh>

      {/* Contrasting White Architecture Frame & Cantilevered Volumes */}
      {/* White facade wing (West side) */}
      <mesh position={[-halfW + 0.9, 2.4, 0.02]} castShadow material={whiteStuccoMat}>
        <boxGeometry args={[1.8, 4.84, depth + 0.04]} />
      </mesh>

      {/* Middle Floor Dividing Slab (White) */}
      <mesh position={[0, 2.4, 0.1]} castShadow material={whiteStuccoMat}>
        <boxGeometry args={[width + 0.25, 0.2, depth + 0.25]} />
      </mesh>

      {/* ======================================================== */}
      {/* 2. GROUND FLOOR: STUDIO SHOWROOM & ENTRYWAY              */}
      {/* ======================================================== */}
      {/* Front Entrance Door & Timber Slat Accents */}
      <mesh position={[-1.2, 1.1, halfD + 0.04]} material={tallGlassMat}>
        <boxGeometry args={[1.2, 2.2, 0.06]} />
      </mesh>
      {/* Door Handle */}
      <mesh position={[-0.8, 1.1, halfD + 0.08]} material={whiteStuccoMat}>
        <boxGeometry args={[0.04, 0.45, 0.03]} />
      </mesh>

      {/* Timber Slat Wall Feature behind entry */}
      <mesh position={[-2.1, 1.1, halfD + 0.03]} material={timberMat}>
        <boxGeometry args={[0.9, 2.2, 0.04]} />
      </mesh>

      {/* Tall Studio Showcase Glass Windows (Floor 1 East Corner) */}
      <mesh position={[1.0, 1.2, halfD + 0.03]} material={tallGlassMat}>
        <boxGeometry args={[2.8, 2.0, 0.06]} />
      </mesh>
      {/* Window mullions */}
      {[-0.2, 1.0, 2.2].map((mx, idx) => (
        <mesh key={idx} position={[mx, 1.2, halfD + 0.06]} material={whiteStuccoMat}>
          <boxGeometry args={[0.08, 2.0, 0.03]} />
        </mesh>
      ))}

      {/* Side Studio Window (East facade) */}
      <mesh position={[halfW + 0.02, 1.2, 0]} rotation={[0, Math.PI / 2, 0]} material={tallGlassMat}>
        <boxGeometry args={[2.8, 2.0, 0.06]} />
      </mesh>

      {/* ======================================================== */}
      {/* 3. SECOND FLOOR: BALCONY, PLANTERS & TALL LOFT WINDOWS   */}
      {/* ======================================================== */}
      {/* Front Cantilevered Balcony Slab */}
      <mesh position={[0.7, 2.45, halfD + 0.6]} castShadow material={whiteStuccoMat}>
        <boxGeometry args={[3.4, 0.16, 1.2]} />
      </mesh>

      {/* Balcony Glass Railing */}
      <mesh position={[0.7, 2.8, halfD + 1.18]} material={tallGlassMat}>
        <boxGeometry args={[3.3, 0.55, 0.04]} />
      </mesh>
      <mesh position={[-0.95, 2.8, halfD + 0.6]} rotation={[0, Math.PI / 2, 0]} material={tallGlassMat}>
        <boxGeometry args={[1.15, 0.55, 0.04]} />
      </mesh>
      <mesh position={[2.35, 2.8, halfD + 0.6]} rotation={[0, Math.PI / 2, 0]} material={tallGlassMat}>
        <boxGeometry args={[1.15, 0.55, 0.04]} />
      </mesh>

      {/* Balcony Planter Trough with Green Foliage */}
      <group position={[0.7, 2.65, halfD + 1.1]}>
        {/* White planter trough */}
        <mesh material={whiteStuccoMat}>
          <boxGeometry args={[3.1, 0.22, 0.2]} />
        </mesh>
        {/* Lush green foliage bushes */}
        {[-1.2, -0.6, 0, 0.6, 1.2].map((bx, idx) => (
          <mesh key={idx} position={[bx, 0.16, 0]}>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshStandardMaterial color="#22c55e" roughness={0.75} />
          </mesh>
        ))}
      </group>

      {/* Floor 2 Tall Loft Windows (Behind balcony) */}
      <mesh position={[0.7, 3.65, halfD + 0.02]} material={tallGlassMat}>
        <boxGeometry args={[3.2, 1.9, 0.06]} />
      </mesh>
      {[0.0, 1.4].map((mx, idx) => (
        <mesh key={idx} position={[mx, 3.65, halfD + 0.05]} material={whiteStuccoMat}>
          <boxGeometry args={[0.08, 1.9, 0.03]} />
        </mesh>
      ))}

      {/* ======================================================== */}
      {/* 4. ILLUMINATED SIGN: "ABOUT ME"                          */}
      {/* ======================================================== */}
      {/* Positioned on the second floor front-left facade */}
      <group position={[-1.7, 3.65, halfD + 0.1]}>
        {/* Dark Backing Plaque */}
        <mesh castShadow material={darkTrimMat}>
          <boxGeometry args={[1.9, 0.75, 0.08]} />
        </mesh>
        {/* Glowing Orange Frame */}
        <mesh position={[0, 0, 0.045]}>
          <boxGeometry args={[1.94, 0.79, 0.02]} />
          <meshStandardMaterial
            ref={orangeAccentMatRef}
            color="#f97316"
            emissive="#f97316"
            emissiveIntensity={isHovered || isSelected ? 2.5 : 1.2}
          />
        </mesh>
        {/* Sign Face */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[1.85, 0.7]} />
          <meshStandardMaterial
            map={signTex}
            emissive="#ffffff"
            emissiveIntensity={isHovered || isSelected ? 1.5 : 1.0}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 5. ROOFTOP TERRACE, PERGOLA & PLANTS                     */}
      {/* ======================================================== */}
      {/* Rooftop Wooden Deck Floor */}
      <mesh position={[0, 4.88, 0]} castShadow material={deckWoodMat}>
        <boxGeometry args={[width + 0.2, 0.16, depth + 0.2]} />
      </mesh>

      {/* Rooftop White Parapet Railing */}
      <mesh position={[0, 5.25, halfD + 0.06]} material={tallGlassMat}>
        <boxGeometry args={[width, 0.6, 0.04]} />
      </mesh>
      <mesh position={[0, 5.25, -halfD - 0.06]} material={tallGlassMat}>
        <boxGeometry args={[width, 0.6, 0.04]} />
      </mesh>
      <mesh position={[-halfW - 0.06, 5.25, 0]} rotation={[0, Math.PI / 2, 0]} material={tallGlassMat}>
        <boxGeometry args={[depth, 0.6, 0.04]} />
      </mesh>
      <mesh position={[halfW + 0.06, 5.25, 0]} rotation={[0, Math.PI / 2, 0]} material={tallGlassMat}>
        <boxGeometry args={[depth, 0.6, 0.04]} />
      </mesh>

      {/* Modern Rooftop Timber Pergola (West side) */}
      <group position={[-1.2, 5.0, 0]}>
        {/* 4 Timber Posts */}
        {[
          [-1.2, -1.5],
          [1.2, -1.5],
          [-1.2, 1.5],
          [1.2, 1.5],
        ].map(([px, pz], idx) => (
          <mesh key={idx} position={[px, 1.0, pz]} material={timberMat}>
            <boxGeometry args={[0.12, 2.0, 0.12]} />
          </mesh>
        ))}
        {/* Overhead Horizontal Pergola Slats */}
        {[-1.2, -0.6, 0, 0.6, 1.2].map((sz, idx) => (
          <mesh key={idx} position={[0, 2.05, sz]} material={timberMat}>
            <boxGeometry args={[2.7, 0.08, 0.12]} />
          </mesh>
        ))}
      </group>

      {/* Potted Ornamental Trees on Terrace */}
      {[
        [2.0, -1.5],
        [2.0, 1.5],
      ].map(([tx, tz], idx) => (
        <group key={idx} position={[tx, 5.0, tz]}>
          <mesh position={[0, 0.2, 0]} material={whiteStuccoMat}>
            <cylinderGeometry args={[0.3, 0.24, 0.45, 16]} />
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <sphereGeometry args={[0.36, 16, 16]} />
            <meshStandardMaterial color="#16a34a" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* ======================================================== */}
      {/* 6. IDLE ANIMATION: ROOFTOP VENTILATION FAN               */}
      {/* ======================================================== */}
      <group position={[1.4, 5.0, -0.6]}>
        {/* Fan Plinth / Duct Housing */}
        <mesh position={[0, 0.25, 0]} material={darkTrimMat}>
          <cylinderGeometry args={[0.42, 0.48, 0.5, 16]} />
        </mesh>
        {/* Protective Cage Rim */}
        <mesh position={[0, 0.55, 0]} material={darkTrimMat}>
          <cylinderGeometry args={[0.44, 0.44, 0.1, 16]} />
        </mesh>
        {/* Rotating Fan Blades Assembly */}
        <group ref={fanBladesRef} position={[0, 0.52, 0]}>
          {/* Central Spinner Hub */}
          <mesh material={whiteStuccoMat}>
            <cylinderGeometry args={[0.1, 0.1, 0.12, 12]} />
          </mesh>
          {/* 4 Fan Blades */}
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
            <mesh key={idx} rotation={[0.2, angle, 0]} position={[Math.cos(angle) * 0.2, 0, Math.sin(angle) * 0.2]}>
              <boxGeometry args={[0.28, 0.02, 0.08]} />
              <meshStandardMaterial color="#f97316" metalness={0.4} roughness={0.3} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ======================================================== */}
      {/* 7. IDLE ANIMATION: WARM INTERIOR STUDIO LIGHT            */}
      {/* ======================================================== */}
      <pointLight
        ref={interiorLightRef}
        position={[0.5, 2.0, 0]}
        color="#fb923c"
        intensity={1.2}
        distance={7.0}
      />
    </group>
  );
};


'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface HeroBuildingProps {
  position?: [number, number, number];
  onSelect: () => void;
  isSelected?: boolean;
}

/**
 * Procedural High-Res Texture for Rooftop Sign: "ABHISHEK S NAIR"
 */
function createRooftopSignTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Dark slate/glass background
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, 1024, 256);

  // Border with cyan glow
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 1008, 240);

  // Inner subtle border
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.strokeRect(18, 18, 988, 220);

  // Main Title: "ABHISHEK S NAIR"
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 84px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 18;
  ctx.fillText('ABHISHEK S NAIR', 512, 110);

  // Subtitle: "FLAGSHIP HEADQUARTERS"
  ctx.shadowBlur = 0;
  ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.letterSpacing = '8px';
  ctx.fillText('FLAGSHIP HEADQUARTERS', 512, 190);

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

  // Dark background
  ctx.fillStyle = '#060a12';
  ctx.fillRect(0, 0, 512, 128);

  // Glowing cyan border
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, 504, 120);

  // Text: "SOFTWARE DEVELOPER"
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 40px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 14;
  ctx.fillText('SOFTWARE DEVELOPER', 256, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * HeroBuilding Component
 * 3-Floor Premium Tech Headquarters:
 * - Blue glass curtain windows with white structural framing
 * - Floor 1: Grand entrance with glass doors, floating stairs, front sign
 * - Floor 2 & 3: Modern cantilevered tech suites with cyan accent lighting
 * - Rooftop: Illuminated billboard sign "ABHISHEK S NAIR"
 * - Decorative planters and entrance illumination
 * - Subtle hover glow & click interactivity
 */
export const HeroBuilding: React.FC<HeroBuildingProps> = ({
  position = [-7.85, 0.74, -7.35],
  onSelect,
  isSelected = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const glowPulseRef = useRef<number>(0);
  const cyanMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  const rooftopSignTex = useMemo(() => createRooftopSignTexture(), []);
  const frontSignTex = useMemo(() => createFrontSignTexture(), []);

  // Frame-rate independent pulse animation for cyan accents on hover
  useFrame((_, delta) => {
    if (cyanMaterialRef.current) {
      if (isHovered || isSelected) {
        glowPulseRef.current += delta * 4;
        const pulse = 1.8 + Math.sin(glowPulseRef.current) * 0.5;
        cyanMaterialRef.current.emissiveIntensity = pulse;
      } else {
        cyanMaterialRef.current.emissiveIntensity = 1.0;
      }
    }
  });

  const width = 6.2;
  const depth = 5.2;
  const halfW = width / 2; // 3.1
  const halfD = depth / 2; // 2.6

  // Materials
  const whiteFrameMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.25,
        metalness: 0.05,
      }),
    []
  );

  const darkTrimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.6,
        metalness: 0.2,
      }),
    []
  );

  const blueGlassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0284c7',
        roughness: 0.12,
        metalness: 0.35,
        transparent: true,
        opacity: 0.88,
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

  return (
    <group
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
      {/* 1. STRUCTURAL CORE & WHITE EXTERIOR COLUMNS              */}
      {/* ======================================================== */}
      {/* Central building core mass */}
      <mesh position={[0, 3.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[width - 0.2, 7.2, depth - 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* 4 White Corner Columns */}
      {[
        [-halfW, -halfD],
        [halfW, -halfD],
        [-halfW, halfD],
        [halfW, halfD],
      ].map(([cx, cz], idx) => (
        <mesh key={idx} position={[cx, 3.6, cz]} castShadow receiveShadow material={whiteFrameMat}>
          <boxGeometry args={[0.35, 7.3, 0.35]} />
        </mesh>
      ))}

      {/* ======================================================== */}
      {/* 2. FLOOR 1: GROUND LOBBY & ENTRANCE (y = 0 to 2.4)       */}
      {/* ======================================================== */}
      {/* Front Floor 1 Glass Curtain (Left & Right of entrance) */}
      <mesh position={[-2.0, 1.2, halfD]} material={blueGlassMat}>
        <boxGeometry args={[1.8, 2.2, 0.08]} />
      </mesh>
      <mesh position={[2.0, 1.2, halfD]} material={blueGlassMat}>
        <boxGeometry args={[1.8, 2.2, 0.08]} />
      </mesh>

      {/* Double Glass Doors in Center */}
      <mesh position={[0, 1.15, halfD + 0.02]} material={blueGlassMat}>
        <boxGeometry args={[1.8, 2.1, 0.06]} />
      </mesh>
      {/* Door Frame & Aluminum Handles */}
      <mesh position={[0, 1.15, halfD + 0.06]} material={whiteFrameMat}>
        <boxGeometry args={[0.06, 2.1, 0.02]} />
      </mesh>
      {[-0.15, 0.15].map((hx, idx) => (
        <mesh key={idx} position={[hx, 1.1, halfD + 0.09]} material={whiteFrameMat}>
          <boxGeometry args={[0.04, 0.5, 0.04]} />
        </mesh>
      ))}

      {/* Modern Entrance Portico / Canopy Over Doors */}
      <mesh position={[0, 2.3, halfD + 0.7]} castShadow material={darkTrimMat}>
        <boxGeometry args={[2.8, 0.12, 1.4]} />
      </mesh>
      {/* Canopy Glowing Cyan Underside Trim */}
      <mesh position={[0, 2.24, halfD + 0.7]}>
        <boxGeometry args={[2.7, 0.02, 1.3]} />
        <primitive object={cyanAccentMat} attach="material" ref={cyanMaterialRef} />
      </mesh>

      {/* Front Sign on Canopy: "SOFTWARE DEVELOPER" */}
      <mesh position={[0, 2.48, halfD + 1.41]} rotation={[0, 0, 0]}>
        <planeGeometry args={[2.6, 0.45]} />
        <meshStandardMaterial
          map={frontSignTex}
          emissive="#38bdf8"
          emissiveIntensity={isHovered ? 1.4 : 0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Entrance Staircase (3 Floating Concrete Steps) */}
      <mesh position={[0, 0.20, halfD + 0.35]} castShadow receiveShadow material={whiteFrameMat}>
        <boxGeometry args={[2.6, 0.12, 0.6]} />
      </mesh>
      <mesh position={[0, 0.10, halfD + 0.75]} castShadow receiveShadow material={whiteFrameMat}>
        <boxGeometry args={[2.9, 0.10, 0.6]} />
      </mesh>
      <mesh position={[0, 0.04, halfD + 1.15]} castShadow receiveShadow material={whiteFrameMat}>
        <boxGeometry args={[3.2, 0.08, 0.6]} />
      </mesh>

      {/* Entrance Wall Sconce Lights */}
      {[-1.2, 1.2].map((lx, idx) => (
        <group key={idx} position={[lx, 1.6, halfD + 0.08]}>
          <mesh material={darkTrimMat}>
            <boxGeometry args={[0.08, 0.28, 0.06]} />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <boxGeometry args={[0.06, 0.22, 0.02]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.5} />
          </mesh>
        </group>
      ))}

      {/* Modern Planters & Decorative Topiary Bushes beside entrance */}
      {[-2.0, 2.0].map((px, idx) => (
        <group key={idx} position={[px, 0.2, halfD + 0.8]}>
          {/* Concrete Planter Box */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow material={whiteFrameMat}>
            <boxGeometry args={[0.7, 0.4, 0.7]} />
          </mesh>
          {/* Stylized Rounded Green Foliage */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <sphereGeometry args={[0.32, 16, 16]} />
            <meshStandardMaterial color="#22c55e" roughness={0.75} metalness={0.05} />
          </mesh>
        </group>
      ))}

      {/* ======================================================== */}
      {/* 3. FLOOR 2: ENGINEERING SUITES (y = 2.4 to 4.8)          */}
      {/* ======================================================== */}
      {/* Floor 2 Cantilevered Slab Base */}
      <mesh position={[0, 2.45, 0]} castShadow material={whiteFrameMat}>
        <boxGeometry args={[width + 0.3, 0.2, depth + 0.3]} />
      </mesh>
      {/* Floor 2 Cyan Accent Edge Strip */}
      <mesh position={[0, 2.45, halfD + 0.16]}>
        <boxGeometry args={[width + 0.32, 0.05, 0.04]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.5} />
      </mesh>

      {/* Floor 2 Curtain Glass Windows (Front, Sides, Back) */}
      <mesh position={[0, 3.6, halfD + 0.02]} material={blueGlassMat}>
        <boxGeometry args={[width - 0.4, 2.0, 0.06]} />
      </mesh>
      {/* Vertical Window Mullions */}
      {[-1.8, -0.6, 0.6, 1.8].map((mx, idx) => (
        <mesh key={idx} position={[mx, 3.6, halfD + 0.06]} material={whiteFrameMat}>
          <boxGeometry args={[0.08, 2.0, 0.04]} />
        </mesh>
      ))}

      {/* Left & Right Side Glass Windows */}
      <mesh position={[-halfW - 0.02, 3.6, 0]} rotation={[0, Math.PI / 2, 0]} material={blueGlassMat}>
        <boxGeometry args={[depth - 0.4, 2.0, 0.06]} />
      </mesh>
      <mesh position={[halfW + 0.02, 3.6, 0]} rotation={[0, Math.PI / 2, 0]} material={blueGlassMat}>
        <boxGeometry args={[depth - 0.4, 2.0, 0.06]} />
      </mesh>

      {/* ======================================================== */}
      {/* 4. FLOOR 3: EXECUTIVE & AI LAB (y = 4.8 to 7.0)          */}
      {/* ======================================================== */}
      {/* Floor 3 Slab Base */}
      <mesh position={[0, 4.85, 0]} castShadow material={whiteFrameMat}>
        <boxGeometry args={[width + 0.3, 0.2, depth + 0.3]} />
      </mesh>
      {/* Floor 3 Cyan Accent Strip */}
      <mesh position={[0, 4.85, halfD + 0.16]}>
        <boxGeometry args={[width + 0.32, 0.05, 0.04]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.5} />
      </mesh>

      {/* Floor 3 Curtain Glass Windows */}
      <mesh position={[0, 5.9, halfD + 0.02]} material={blueGlassMat}>
        <boxGeometry args={[width - 0.4, 1.9, 0.06]} />
      </mesh>
      {[-1.8, -0.6, 0.6, 1.8].map((mx, idx) => (
        <mesh key={idx} position={[mx, 5.9, halfD + 0.06]} material={whiteFrameMat}>
          <boxGeometry args={[0.08, 1.9, 0.04]} />
        </mesh>
      ))}

      {/* Left & Right Side Glass Windows Floor 3 */}
      <mesh position={[-halfW - 0.02, 5.9, 0]} rotation={[0, Math.PI / 2, 0]} material={blueGlassMat}>
        <boxGeometry args={[depth - 0.4, 1.9, 0.06]} />
      </mesh>
      <mesh position={[halfW + 0.02, 5.9, 0]} rotation={[0, Math.PI / 2, 0]} material={blueGlassMat}>
        <boxGeometry args={[depth - 0.4, 1.9, 0.06]} />
      </mesh>

      {/* ======================================================== */}
      {/* 5. ROOFTOP TERRACE & PARAPET                             */}
      {/* ======================================================== */}
      {/* Main Roof Slab */}
      <mesh position={[0, 7.05, 0]} castShadow material={whiteFrameMat}>
        <boxGeometry args={[width + 0.4, 0.24, depth + 0.4]} />
      </mesh>
      {/* Glowing Cyan Roof Crown Edge */}
      <mesh position={[0, 7.18, halfD + 0.21]}>
        <boxGeometry args={[width + 0.42, 0.06, 0.04]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.0} />
      </mesh>

      {/* Glass Safety Railing around Rooftop */}
      <mesh position={[0, 7.5, halfD + 0.15]} material={blueGlassMat}>
        <boxGeometry args={[width + 0.2, 0.6, 0.04]} />
      </mesh>
      <mesh position={[-halfW - 0.15, 7.5, 0]} rotation={[0, Math.PI / 2, 0]} material={blueGlassMat}>
        <boxGeometry args={[depth + 0.2, 0.6, 0.04]} />
      </mesh>
      <mesh position={[halfW + 0.15, 7.5, 0]} rotation={[0, Math.PI / 2, 0]} material={blueGlassMat}>
        <boxGeometry args={[depth + 0.2, 0.6, 0.04]} />
      </mesh>

      {/* Rooftop Penthouse Mechanical Box */}
      <mesh position={[0, 7.7, -1.0]} castShadow material={darkTrimMat}>
        <boxGeometry args={[2.4, 1.1, 2.0]} />
      </mesh>

      {/* ======================================================== */}
      {/* 6. ROOFTOP SIGNBOARD: "ABHISHEK S NAIR"                  */}
      {/* ======================================================== */}
      {/* Vertical Support Struts */}
      {[-1.8, 1.8].map((sx, idx) => (
        <mesh key={idx} position={[sx, 7.7, 1.6]} material={darkTrimMat}>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
        </mesh>
      ))}

      {/* Main Rooftop Signboard (Angled ~10 deg back for optimal isometric view) */}
      <group position={[0, 8.2, 1.6]} rotation={[-0.18, 0, 0]}>
        {/* Backing Frame */}
        <mesh castShadow material={darkTrimMat}>
          <boxGeometry args={[4.7, 1.15, 0.12]} />
        </mesh>
        {/* Glowing Cyan Outline Frame */}
        <mesh position={[0, 0, 0.065]}>
          <boxGeometry args={[4.74, 1.19, 0.02]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={isHovered || isSelected ? 2.5 : 1.5}
          />
        </mesh>
        {/* Front Billboard Sign Texture */}
        <mesh position={[0, 0, 0.08]}>
          <planeGeometry args={[4.6, 1.05]} />
          <meshStandardMaterial
            map={rooftopSignTex}
            emissive="#ffffff"
            emissiveIntensity={isHovered || isSelected ? 1.6 : 1.1}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Subtle Cyan Ground Light Splash when Hovered/Selected */}
      {(isHovered || isSelected) && (
        <pointLight position={[0, 2.2, halfD + 1.2]} color="#00f0ff" intensity={2.0} distance={6} />
      )}
    </group>
  );
};


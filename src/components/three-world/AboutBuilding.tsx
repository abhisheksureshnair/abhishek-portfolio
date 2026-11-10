'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePerformanceQuality } from '../PerformanceControl';

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

  // Deep obsidian slate backing
  ctx.fillStyle = '#0a0d14';
  ctx.fillRect(0, 0, 512, 160);

  // Warm orange glowing border
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 148);

  // Inner subtle accent frame
  ctx.strokeStyle = 'rgba(251, 146, 60, 0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, 484, 132);

  // Main Title: "ABOUT ME"
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 62px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#f97316';
  ctx.shadowBlur = 18;
  ctx.fillText('ABOUT ME', 256, 68);

  // Subtitle: "CREATIVE STUDIO & DESIGN"
  ctx.shadowBlur = 0;
  ctx.font = 'bold 20px monospace';
  ctx.fillStyle = '#fdba74';
  ctx.letterSpacing = '5px';
  ctx.fillText('CREATIVE STUDIO & DESIGN', 256, 122);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * AboutBuilding Component
 * Architecturally Upgraded Creative Design Studio:
 * - Stepped Scandinavian/modernist massing with warm terracotta, cedar slats & crisp white frames
 * - Ground floor gallery showroom with glazed double entrance doors & warm downlight sconces
 * - Cantilevered second-floor terrace with glass balustrade & flourishing planter boxes
 * - Rooftop garden with timber pergola slats, spinning aeration fan, ornamental trees & roof hatch
 * - Deep window reveals with aluminum mullion frames and warm reflective glass
 * - Illuminated "ABOUT ME" marquee signage with rear bracket mounts
 */
export const AboutBuilding: React.FC<AboutBuildingProps> = ({
  position = [7.85, 0.74, -7.35],
  onSelect,
  isSelected = false,
}) => {
  const { effectiveTier, prefersReducedMotion } = usePerformanceQuality();
  const allowPointLight = effectiveTier === 'high';

  const [isHovered, setIsHovered] = useState(false);
  const rootGroupRef = useRef<THREE.Group>(null);
  const fanBladesRef = useRef<THREE.Group>(null);
  const orangeAccentMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const signTex = useMemo(() => createAboutSignTexture(), []);

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

    // 2. Rooftop Fan Rotation
    if (fanBladesRef.current && !prefersReducedMotion) {
      fanBladesRef.current.rotation.y += delta * 3.8;
    }

    // 3. Subtle glass window breathing
    if (reflectiveGlassMat && !prefersReducedMotion) {
      reflectiveGlassMat.emissiveIntensity = 0.22 + Math.sin(time * 1.1 + 1.2) * 0.05;
    }

    // 4. Breathing Orange Neon Glow on Hover/Selection
    if (orangeAccentMatRef.current) {
      if (isHovered || isSelected) {
        const pulse = 1.8 + Math.sin(time * 5.0) * 0.5;
        orangeAccentMatRef.current.emissiveIntensity = pulse;
      } else {
        orangeAccentMatRef.current.emissiveIntensity = 1.1;
      }
    }
  });

  const width = 5.8;
  const depth = 4.8;
  const halfW = width / 2; // 2.9
  const halfD = depth / 2; // 2.4

  // Shared Reusable Architectural Materials
  const warmTerracottaMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c2410c', // Warm Terracotta Orange
        roughness: 0.5,
        metalness: 0.1,
      }),
    []
  );

  const whiteStuccoMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f8fafc', // Crisp Architectural White
        roughness: 0.28,
        metalness: 0.08,
      }),
    []
  );

  const cedarTimberMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#9a3412', // Warm Cedar Slat
        roughness: 0.7,
        metalness: 0.05,
      }),
    []
  );

  const reflectiveGlassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0284c7',
        emissive: '#ea580c',
        emissiveIntensity: 0.22,
        roughness: 0.1,
        metalness: 0.85,
        transparent: false,
      }),
    []
  );

  const deckWoodMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#5c2d13',
        roughness: 0.75,
        metalness: 0.05,
      }),
    []
  );

  const darkSlateMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.55,
        metalness: 0.25,
      }),
    []
  );

  const foliageMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#16a34a',
        roughness: 0.7,
        metalness: 0.05,
      }),
    []
  );

  const flowersMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f97316',
        roughness: 0.5,
      }),
    []
  );

  return (
    <group
      ref={rootGroupRef}
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
      {/* 1. FOUNDATION PLINTH & APPROACH STEPS                    */}
      {/* ======================================================== */}
      {/* Base Foundation Slab */}
      <mesh position={[0, -0.06, 0.2]} receiveShadow material={darkSlateMat}>
        <boxGeometry args={[width + 1.2, 0.22, depth + 1.4]} />
      </mesh>

      {/* Front Entrance Paved Porch */}
      <mesh position={[-1.2, 0.06, halfD + 0.6]} receiveShadow material={whiteStuccoMat}>
        <boxGeometry args={[2.4, 0.08, 1.2]} />
      </mesh>
      {/* Subtle Step LED Strip */}
      <mesh position={[-1.2, 0.09, halfD + 1.18]}>
        <boxGeometry args={[2.3, 0.02, 0.03]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={2.0} />
      </mesh>

      {/* ======================================================== */}
      {/* 2. GROUND FLOOR: STUDIO SHOWROOM & ENTRYWAY              */}
      {/* ======================================================== */}
      {/* Main Ground Floor Body (Warm Terracotta Orange) */}
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow material={warmTerracottaMat}>
        <boxGeometry args={[width, 2.5, depth]} />
      </mesh>

      {/* West Wing White Architectural Framing Pillar */}
      <mesh position={[-halfW + 0.85, 1.25, 0.04]} castShadow material={whiteStuccoMat}>
        <boxGeometry args={[1.7, 2.52, depth + 0.08]} />
      </mesh>

      {/* Vertical Cedar Louvers (Architectural Accent on Front Left) */}
      {[-2.3, -2.0, -1.7, -1.4].map((lx, idx) => (
        <mesh key={`cedar-louver-${idx}`} position={[lx, 1.25, halfD + 0.09]} material={cedarTimberMat}>
          <boxGeometry args={[0.07, 2.4, 0.08]} />
        </mesh>
      ))}

      {/* Double Glazed Studio Entrance Doors */}
      <group position={[-0.4, 1.15, halfD + 0.04]}>
        <mesh material={reflectiveGlassMat}>
          <boxGeometry args={[1.5, 2.15, 0.06]} />
        </mesh>
        {/* Door Dividing Mullion */}
        <mesh material={whiteStuccoMat}>
          <boxGeometry args={[0.05, 2.15, 0.08]} />
        </mesh>
        {/* Stainless Steel Vertical Pull Handles */}
        {[-0.12, 0.12].map((hx, idx) => (
          <mesh key={`door-handle-${idx}`} position={[hx, 0, 0.07]} material={whiteStuccoMat}>
            <boxGeometry args={[0.03, 0.6, 0.03]} />
          </mesh>
        ))}
        {/* Architectural Entrance Canopy */}
        <mesh position={[0, 1.15, 0.45]} castShadow material={darkSlateMat}>
          <boxGeometry args={[1.8, 0.08, 0.9]} />
        </mesh>
      </group>

      {/* Large Studio Gallery Display Window (East Side) */}
      <group position={[1.6, 1.25, halfD + 0.04]}>
        {/* Outer White Reveal Frame */}
        <mesh material={whiteStuccoMat}>
          <boxGeometry args={[2.5, 2.1, 0.08]} />
        </mesh>
        {/* Reflective Glass Panel */}
        <mesh position={[0, 0, 0.02]} material={reflectiveGlassMat}>
          <boxGeometry args={[2.34, 1.94, 0.06]} />
        </mesh>
        {/* Vertical Mullion */}
        <mesh position={[0, 0, 0.05]} material={whiteStuccoMat}>
          <boxGeometry args={[0.06, 1.94, 0.04]} />
        </mesh>
      </group>

      {/* Side Studio Window (East Facade) */}
      <mesh position={[halfW + 0.04, 1.25, 0]} rotation={[0, Math.PI / 2, 0]} material={reflectiveGlassMat}>
        <boxGeometry args={[2.8, 1.9, 0.06]} />
      </mesh>

      {/* ======================================================== */}
      {/* 3. MIDDLE FLOOR CANTILEVERED SLAB & ACCENT STRIP         */}
      {/* ======================================================== */}
      <mesh position={[0, 2.55, 0.1]} castShadow material={whiteStuccoMat}>
        <boxGeometry args={[width + 0.35, 0.22, depth + 0.35]} />
      </mesh>
      {/* Glowing Warm Orange LED Edge Trim */}
      <mesh position={[0, 2.55, halfD + 0.28]}>
        <boxGeometry args={[width + 0.37, 0.04, 0.03]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={1.8} />
      </mesh>

      {/* ======================================================== */}
      {/* 4. SECOND FLOOR: CANTILEVERED BALCONY & LOFT STUDIOS     */}
      {/* ======================================================== */}
      {/* Second Floor Main Body */}
      <mesh position={[0, 3.8, 0]} castShadow receiveShadow material={warmTerracottaMat}>
        <boxGeometry args={[width, 2.4, depth]} />
      </mesh>

      {/* White Architectural Box Framing on Second Floor */}
      <mesh position={[-halfW + 0.85, 3.8, 0.04]} castShadow material={whiteStuccoMat}>
        <boxGeometry args={[1.7, 2.42, depth + 0.08]} />
      </mesh>

      {/* Cantilevered Outdoor Creative Balcony (East Wing) */}
      <group position={[1.1, 2.58, halfD + 0.65]}>
        {/* Balcony Cantilever Slab (White) */}
        <mesh position={[0, 0, 0]} castShadow material={whiteStuccoMat}>
          <boxGeometry args={[3.2, 0.18, 1.3]} />
        </mesh>
        {/* Balcony Teak / Cedar Planks */}
        <mesh position={[0, 0.1, 0]} receiveShadow material={deckWoodMat}>
          <boxGeometry args={[3.12, 0.02, 1.22]} />
        </mesh>

        {/* Glass Balustrade with White Powder-Coated Top Handrail */}
        {/* Front Railing */}
        <mesh position={[0, 0.42, 0.62]} material={reflectiveGlassMat}>
          <boxGeometry args={[3.16, 0.65, 0.03]} />
        </mesh>
        <mesh position={[0, 0.75, 0.62]} material={whiteStuccoMat}>
          <boxGeometry args={[3.2, 0.04, 0.05]} />
        </mesh>
        {/* Right Side Railing */}
        <mesh position={[1.58, 0.42, 0]} rotation={[0, Math.PI / 2, 0]} material={reflectiveGlassMat}>
          <boxGeometry args={[1.24, 0.65, 0.03]} />
        </mesh>
        <mesh position={[1.58, 0.75, 0]} rotation={[0, Math.PI / 2, 0]} material={whiteStuccoMat}>
          <boxGeometry args={[1.26, 0.04, 0.05]} />
        </mesh>

        {/* Flourishing Balcony Planter Trough with Layered Greenery */}
        <group position={[0, 0.28, 0.52]}>
          <mesh material={darkSlateMat}>
            <boxGeometry args={[2.9, 0.3, 0.22]} />
          </mesh>
          {/* Sculpted Green Shrubbery & Flowering Blooms */}
          {[-1.1, -0.55, 0, 0.55, 1.1].map((px, idx) => (
            <group key={`balcony-plant-${idx}`} position={[px, 0.22, 0]}>
              <mesh castShadow material={foliageMat}>
                <sphereGeometry args={[0.18, 12, 12]} />
              </mesh>
              {idx % 2 === 0 && (
                <mesh position={[0, 0.14, 0.04]} material={flowersMat}>
                  <sphereGeometry args={[0.07, 8, 8]} />
                </mesh>
              )}
            </group>
          ))}
        </group>
      </group>

      {/* Second Floor Tall Loft Windows (Behind Balcony) */}
      <group position={[1.1, 3.8, halfD + 0.04]}>
        <mesh material={reflectiveGlassMat}>
          <boxGeometry args={[3.0, 1.9, 0.06]} />
        </mesh>
        {/* Architectural Window Mullions */}
        {[-0.95, 0, 0.95].map((mx, idx) => (
          <mesh key={`f2-mullion-${idx}`} position={[mx, 0, 0.04]} material={whiteStuccoMat}>
            <boxGeometry args={[0.06, 1.9, 0.03]} />
          </mesh>
        ))}
      </group>

      {/* ======================================================== */}
      {/* 5. ILLUMINATED MARQUEE SIGN: "ABOUT ME"                  */}
      {/* ======================================================== */}
      <group position={[-1.75, 3.8, halfD + 0.1]}>
        {/* Dark Obsidian Chassis */}
        <mesh castShadow material={darkSlateMat}>
          <boxGeometry args={[2.0, 0.85, 0.1]} />
        </mesh>
        {/* Glowing Neon Orange Frame */}
        <mesh position={[0, 0, 0.055]}>
          <boxGeometry args={[2.05, 0.9, 0.02]} />
          <meshStandardMaterial
            ref={orangeAccentMatRef}
            color="#f97316"
            emissive="#f97316"
            emissiveIntensity={isHovered || isSelected ? 2.6 : 1.2}
          />
        </mesh>
        {/* Sign Face */}
        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[1.95, 0.8]} />
          <meshStandardMaterial
            map={signTex}
            emissive="#ffffff"
            emissiveIntensity={isHovered || isSelected ? 1.6 : 1.05}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 6. ROOFTOP GARDEN TERRACE, PERGOLA & VENTILATION FAN     */}
      {/* ======================================================== */}
      {/* Rooftop Base Timber Deck Floor */}
      <mesh position={[0, 5.05, 0]} castShadow material={deckWoodMat}>
        <boxGeometry args={[width + 0.25, 0.18, depth + 0.25]} />
      </mesh>
      {/* Rooftop Perimeter Parapet Wall with White Coping Stone */}
      <mesh position={[0, 5.35, halfD + 0.08]} material={whiteStuccoMat}>
        <boxGeometry args={[width + 0.2, 0.45, 0.08]} />
      </mesh>
      <mesh position={[0, 5.35, -halfD - 0.08]} material={whiteStuccoMat}>
        <boxGeometry args={[width + 0.2, 0.45, 0.08]} />
      </mesh>
      <mesh position={[-halfW - 0.08, 5.35, 0]} rotation={[0, Math.PI / 2, 0]} material={whiteStuccoMat}>
        <boxGeometry args={[depth + 0.2, 0.45, 0.08]} />
      </mesh>
      <mesh position={[halfW + 0.08, 5.35, 0]} rotation={[0, Math.PI / 2, 0]} material={whiteStuccoMat}>
        <boxGeometry args={[depth + 0.2, 0.45, 0.08]} />
      </mesh>

      {/* Modern Rooftop Cedar Pergola (West Side) */}
      <group position={[-1.2, 5.15, 0]}>
        {/* 4 Sturdy Cedar Upright Posts */}
        {[
          [-1.2, -1.5],
          [1.2, -1.5],
          [-1.2, 1.5],
          [1.2, 1.5],
        ].map(([px, pz], idx) => (
          <mesh key={`pergola-post-${idx}`} position={[px, 1.0, pz]} material={cedarTimberMat}>
            <boxGeometry args={[0.12, 2.0, 0.12]} />
          </mesh>
        ))}
        {/* Overhead Horizontal Pergola Rafters */}
        {[-1.2, -0.6, 0, 0.6, 1.2].map((sz, idx) => (
          <mesh key={`pergola-rafter-${idx}`} position={[0, 2.05, sz]} material={cedarTimberMat}>
            <boxGeometry args={[2.7, 0.08, 0.1]} />
          </mesh>
        ))}
      </group>

      {/* Potted Ornamental Trees in Terracotta Planters */}
      {[
        [2.1, 1.4],
        [2.1, -1.4],
      ].map(([tx, tz], idx) => (
        <group key={`roof-tree-${idx}`} position={[tx, 5.15, tz]}>
          <mesh position={[0, 0.22, 0]} material={whiteStuccoMat}>
            <cylinderGeometry args={[0.32, 0.24, 0.45, 16]} />
          </mesh>
          <mesh position={[0, 0.7, 0]} castShadow material={foliageMat}>
            <sphereGeometry args={[0.4, 16, 16]} />
          </mesh>
        </group>
      ))}

      {/* Rooftop Staircase Access Hatch (Penthouse companionway) */}
      <group position={[0.4, 5.25, 0]}>
        <mesh material={darkSlateMat}>
          <boxGeometry args={[0.9, 0.6, 1.2]} />
        </mesh>
        <mesh position={[0, 0.32, 0]} material={whiteStuccoMat}>
          <boxGeometry args={[0.94, 0.05, 1.24]} />
        </mesh>
      </group>

      {/* Animated Rooftop Ventilation Fan Unit */}
      <group position={[1.5, 5.15, -0.2]}>
        <mesh position={[0, 0.25, 0]} material={darkSlateMat}>
          <cylinderGeometry args={[0.42, 0.46, 0.5, 16]} />
        </mesh>
        <mesh position={[0, 0.52, 0]} material={darkSlateMat}>
          <cylinderGeometry args={[0.44, 0.44, 0.08, 16]} />
        </mesh>
        {/* Rotating 4-Blade Impeller */}
        <group ref={fanBladesRef} position={[0, 0.5, 0]}>
          <mesh material={whiteStuccoMat}>
            <cylinderGeometry args={[0.09, 0.09, 0.12, 12]} />
          </mesh>
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
            <mesh key={`fan-blade-${idx}`} rotation={[0.2, angle, 0]} position={[Math.cos(angle) * 0.2, 0, Math.sin(angle) * 0.2]}>
              <boxGeometry args={[0.28, 0.02, 0.08]} />
              <meshStandardMaterial color="#f97316" metalness={0.5} roughness={0.3} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Subtle Warm Amber Ground Splash on Hover/Select (High Tier only) */}
      {(isHovered || isSelected) && allowPointLight && (
        <pointLight position={[0, 2.4, halfD + 1.2]} color="#f97316" intensity={2.0} distance={7} />
      )}
    </group>
  );
};

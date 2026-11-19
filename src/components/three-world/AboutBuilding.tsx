'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePerformanceQuality } from '../PerformanceControl';
import {
  getArchitecturalConcreteTexture,
  getCurtainWallGlassTexture,
  getLobbyShowroomGlassTexture,
  getArchitecturalLouversTexture,
  getGranitePaverTexture,
  getArchitecturalWoodTexture,
} from './architecturalTextures';

export interface AboutBuildingProps {
  position?: [number, number, number];
  onSelect: () => void;
  isSelected?: boolean;
}

/**
 * Creates high-res architectural signage texture:
 * "ABOUT ME // CREATIVE DESIGN STUDIO"
 */
function createArchitecturalAboutSignTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 140;
  const ctx = canvas.getContext('2d')!;

  // Deep warm slate-charcoal backing
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 140);

  // Warm terracotta accent border
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, 504, 132);

  // Main Header: "ABOUT ME"
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 48px "Segoe UI", Roboto, system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('ABOUT ME', 256, 52);

  // Subtitle: "CREATIVE STUDIO & DESIGN"
  ctx.font = '600 14px monospace';
  ctx.fillStyle = '#fdba74';
  ctx.letterSpacing = '4px';
  ctx.fillText('CREATIVE STUDIO & DESIGN', 256, 100);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * AboutBuilding — Contemporary Scandinavian Modernist Creative Studio
 * Inspired by contemporary warm-wood and glass architectural atelier pavilions:
 * - 3 articulated storeys with limestone concrete horizontal slabs
 * - Warm vertical cedar / teak architectural wood screen slats
 * - Double-height ground floor gallery showroom with warm interior lighting
 * - West-facing main entrance with cantilevered canopy and double glass doors
 * - Cantilevered second-floor terrace garden with glass balustrade & planters
 * - Rooftop architectural pergola deck with timber beams & rotating ventilation cowl
 */
export const AboutBuilding: React.FC<AboutBuildingProps> = ({
  position = [7.85, 0.74, -7.35],
  onSelect,
  isSelected = false,
}) => {
  const { effectiveTier, prefersReducedMotion } = usePerformanceQuality();
  const allowPointLights = effectiveTier === 'high';
  const [isHovered, setIsHovered] = useState(false);

  const rootGroupRef = useRef<THREE.Group>(null);
  const ventFanRef = useRef<THREE.Group>(null);

  // Textures
  const concreteTex = useMemo(() => getArchitecturalConcreteTexture(), []);
  const curtainGlassTex = useMemo(() => getCurtainWallGlassTexture(), []);
  const showroomGlassTex = useMemo(() => getLobbyShowroomGlassTexture(), []);
  const louversTex = useMemo(() => getArchitecturalLouversTexture(), []);
  const paverTex = useMemo(() => getGranitePaverTexture(), []);
  const woodTex = useMemo(() => getArchitecturalWoodTexture(), []);
  const signTex = useMemo(() => createArchitecturalAboutSignTexture(), []);

  // Shared reusable architectural materials
  const materials = useMemo(() => {
    return {
      concreteSlab: new THREE.MeshStandardMaterial({
        map: concreteTex,
        roughness: 0.75,
        metalness: 0.1,
        color: '#f8fafc',
      }),
      woodSlats: new THREE.MeshStandardMaterial({
        map: woodTex,
        roughness: 0.65,
        metalness: 0.1,
      }),
      darkMullion: new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.35,
        metalness: 0.7,
      }),
      curtainGlass: new THREE.MeshStandardMaterial({
        map: curtainGlassTex,
        roughness: 0.1,
        metalness: 0.85,
        emissive: '#fed7aa',
        emissiveIntensity: 0.2,
      }),
      showroomGlass: new THREE.MeshStandardMaterial({
        map: showroomGlassTex,
        roughness: 0.08,
        metalness: 0.9,
        emissive: '#fef08a',
        emissiveIntensity: 0.35,
      }),
      clearBalustrade: new THREE.MeshPhysicalMaterial({
        color: '#e0f2fe',
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.85,
        transparent: true,
        opacity: 0.7,
        ior: 1.5,
      }),
      louvers: new THREE.MeshStandardMaterial({
        map: louversTex,
        roughness: 0.5,
        metalness: 0.6,
      }),
      plazaPavers: new THREE.MeshStandardMaterial({
        map: paverTex,
        roughness: 0.8,
        metalness: 0.15,
      }),
      steelRod: new THREE.MeshStandardMaterial({
        color: '#94a3b8',
        roughness: 0.25,
        metalness: 0.9,
      }),
      foliage: new THREE.MeshStandardMaterial({
        color: '#166534',
        roughness: 0.8,
        metalness: 0.05,
      }),
      canopyGlass: new THREE.MeshPhysicalMaterial({
        color: '#fdba74',
        roughness: 0.1,
        metalness: 0.2,
        transmission: 0.8,
        transparent: true,
        opacity: 0.8,
      }),
    };
  }, [concreteTex, curtainGlassTex, showroomGlassTex, louversTex, paverTex, woodTex]);

  useFrame((_, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;

    if (rootGroupRef.current) {
      const targetY = position[1] + ((isHovered || isSelected) && !prefersReducedMotion ? 0.1 : 0);
      if (prefersReducedMotion) {
        rootGroupRef.current.position.y = targetY;
      } else {
        rootGroupRef.current.position.y += (targetY - rootGroupRef.current.position.y) * (1 - Math.exp(-12.0 * delta));
      }
    }

    if (ventFanRef.current && !prefersReducedMotion) {
      ventFanRef.current.rotation.y += delta * 1.5;
    }
  });

  const bW = 6.4;
  const bD = 5.6;
  const halfW = bW / 2; // 3.2
  const halfD = bD / 2; // 2.8

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
      {/* 1. ARCHITECTURAL GRANITE PLAZA & WEST APPROACH STEPS     */}
      {/* ======================================================== */}
      <mesh position={[0, 0.05, 0]} receiveShadow material={materials.plazaPavers}>
        <boxGeometry args={[7.2, 0.1, 6.4]} />
      </mesh>

      {/* West Steps facing Avenue */}
      <group position={[-halfW - 0.35, 0.05, 0]}>
        <mesh position={[0, -0.02, 0]} receiveShadow material={materials.plazaPavers}>
          <boxGeometry args={[0.7, 0.06, 3.0]} />
        </mesh>
        <mesh position={[0.15, 0.02, 0]} receiveShadow material={materials.plazaPavers}>
          <boxGeometry args={[0.5, 0.06, 2.8]} />
        </mesh>
        {/* Step warm LED accent */}
        <mesh position={[-0.34, 0.01, 0]}>
          <boxGeometry args={[0.03, 0.02, 2.9]} />
          <meshBasicMaterial color="#f97316" />
        </mesh>
      </group>

      {/* Modern Terracotta Planters */}
      {[
        [-halfW - 0.2, 0.2, 2.0],
        [-halfW - 0.2, 0.2, -2.0],
      ].map(([px, py, pz], idx) => (
        <group key={`about-planter-${idx}`} position={[px, py, pz]}>
          <mesh castShadow receiveShadow material={materials.woodSlats}>
            <boxGeometry args={[0.6, 0.35, 1.0]} />
          </mesh>
          <mesh position={[0, 0.25, 0]} castShadow material={materials.foliage}>
            <boxGeometry args={[0.48, 0.35, 0.88]} />
          </mesh>
        </group>
      ))}

      {/* ======================================================== */}
      {/* 2. GROUND FLOOR: GALLERY SHOWROOM (Height 3.6m)          */}
      {/* ======================================================== */}
      <group position={[0, 1.9, 0]}>
        {/* Corner Concrete Columns */}
        {[
          [-halfW + 0.25, 0, -halfD + 0.25],
          [halfW - 0.25, 0, -halfD + 0.25],
          [-halfW + 0.25, 0, halfD - 0.25],
          [halfW - 0.25, 0, halfD - 0.25],
        ].map(([cx, cy, cz], idx) => (
          <mesh key={`a-col-${idx}`} position={[cx, cy, cz]} castShadow receiveShadow material={materials.concreteSlab}>
            <boxGeometry args={[0.5, 3.6, 0.5]} />
          </mesh>
        ))}

        {/* Floor to Ceiling Showroom Glass */}
        {/* West Entrance Side */}
        <mesh position={[-halfW + 0.05, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={materials.showroomGlass}>
          <planeGeometry args={[bD - 0.6, 3.4]} />
        </mesh>
        {/* South Side */}
        <mesh position={[0, 0, halfD - 0.05]} material={materials.showroomGlass}>
          <planeGeometry args={[bW - 0.6, 3.4]} />
        </mesh>
        {/* North Side */}
        <mesh position={[0, 0, -halfD + 0.05]} rotation={[0, Math.PI, 0]} material={materials.showroomGlass}>
          <planeGeometry args={[bW - 0.6, 3.4]} />
        </mesh>
        {/* East Side: Warm Architectural Wood Slat Accent Wall */}
        <mesh position={[halfW - 0.05, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.woodSlats}>
          <planeGeometry args={[bD - 0.6, 3.4]} />
        </mesh>

        {/* Interior Design Exhibition Display Desk & Lighting */}
        <mesh position={[0.5, -0.6, 0]} castShadow>
          <boxGeometry args={[2.4, 0.8, 1.0]} />
          <meshStandardMaterial color="#fed7aa" emissive="#f97316" emissiveIntensity={0.65} />
        </mesh>

        {/* West Entrance Glass Double Doors */}
        <group position={[-halfW - 0.02, -0.65, 0]}>
          <mesh castShadow material={materials.darkMullion}>
            <boxGeometry args={[0.08, 2.2, 1.9]} />
          </mesh>
          <mesh position={[0, 0, -0.45]} material={materials.showroomGlass}>
            <boxGeometry args={[0.04, 2.05, 0.82]} />
          </mesh>
          <mesh position={[0, 0, 0.45]} material={materials.showroomGlass}>
            <boxGeometry args={[0.04, 2.05, 0.82]} />
          </mesh>
          {/* Wood/Aluminum Pull Handles */}
          <mesh position={[-0.04, 0, -0.05]} material={materials.woodSlats}>
            <cylinderGeometry args={[0.02, 0.02, 0.75, 8]} />
          </mesh>
          <mesh position={[-0.04, 0, 0.05]} material={materials.woodSlats}>
            <cylinderGeometry args={[0.02, 0.02, 0.75, 8]} />
          </mesh>
        </group>

        {/* Cantilevered Glass & Timber Entrance Canopy */}
        <group position={[-halfW - 0.8, 0.7, 0]}>
          <mesh castShadow receiveShadow material={materials.canopyGlass}>
            <boxGeometry args={[1.5, 0.08, 2.6]} />
          </mesh>
          <mesh castShadow material={materials.darkMullion}>
            <boxGeometry args={[1.54, 0.1, 2.64]} />
          </mesh>
          {/* Tension Rods */}
          {[-1.1, 1.1].map((rz, idx) => (
            <mesh
              key={`about-tension-${idx}`}
              position={[0.55, 0.7, rz]}
              rotation={[0, 0, -Math.PI / 6]}
              material={materials.steelRod}
            >
              <cylinderGeometry args={[0.016, 0.016, 1.5, 8]} />
            </mesh>
          ))}
          {/* Marquee Sign */}
          <mesh position={[-0.76, 0.25, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[2.5, 0.55]} />
            <meshBasicMaterial map={signTex} transparent />
          </mesh>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 3. STOREY 2: ATELIER STUDIO & CANTILEVERED TERRACE       */}
      {/* ======================================================== */}
      <group position={[0, 3.8, 0]}>
        {/* Cantilevered Floor Slab (Extends further west for terrace) */}
        <mesh position={[-0.3, 0.1, 0]} castShadow receiveShadow material={materials.concreteSlab}>
          <boxGeometry args={[bW + 0.9, 0.22, bD + 0.3]} />
        </mesh>

        {/* Outdoor Terrace Decking (West projection) */}
        <mesh position={[-halfW - 0.35, 0.22, 0]} material={materials.woodSlats}>
          <boxGeometry args={[0.8, 0.02, bD]} />
        </mesh>

        {/* Glass Balustrade on Cantilevered Terrace */}
        <group position={[-halfW - 0.75, 0.65, 0]}>
          <mesh material={materials.clearBalustrade}>
            <boxGeometry args={[0.04, 0.9, bD + 0.1]} />
          </mesh>
          <mesh position={[0, 0.46, 0]} material={materials.steelRod}>
            <boxGeometry args={[0.06, 0.04, bD + 0.12]} />
          </mesh>
        </group>

        {/* Level 2 Studio Walls & Windows (Y: 0.2 to 2.4) */}
        <group position={[0, 1.25, 0]}>
          {/* Window Facades */}
          <mesh position={[-halfW + 0.02, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={materials.curtainGlass}>
            <planeGeometry args={[bD - 0.2, 2.1]} />
          </mesh>
          <mesh position={[halfW - 0.02, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.curtainGlass}>
            <planeGeometry args={[bD - 0.2, 2.1]} />
          </mesh>
          <mesh position={[0, 0, halfD - 0.02]} material={materials.curtainGlass}>
            <planeGeometry args={[bW - 0.2, 2.1]} />
          </mesh>
          <mesh position={[0, 0, -halfD + 0.02]} rotation={[0, Math.PI, 0]} material={materials.curtainGlass}>
            <planeGeometry args={[bW - 0.2, 2.1]} />
          </mesh>

          {/* Vertical Architectural Cedar Sun-Shade Louvers */}
          {[-1.6, -0.5, 0.5, 1.6].map((lx, idx) => (
            <mesh key={`about-slat-${idx}`} position={[lx, 0, halfD + 0.05]} castShadow material={materials.woodSlats}>
              <boxGeometry args={[0.12, 2.1, 0.08]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ======================================================== */}
      {/* 4. STOREY 3: ROOFTOP TIMBER PERGOLA DECK & GARDEN        */}
      {/* ======================================================== */}
      <group position={[0, 6.2, 0]}>
        {/* Roof Slab */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow material={materials.concreteSlab}>
          <boxGeometry args={[bW + 0.3, 0.2, bD + 0.3]} />
        </mesh>

        {/* Roof Decking */}
        <mesh position={[0, 0.21, 0]} material={materials.woodSlats}>
          <boxGeometry args={[bW - 0.4, 0.02, bD - 0.4]} />
        </mesh>

        {/* Architectural Timber Pergola Structure */}
        <group position={[0, 1.4, 0]}>
          {/* Pergola Columns */}
          {[
            [-1.8, 0, -1.8],
            [1.8, 0, -1.8],
            [-1.8, 0, 1.8],
            [1.8, 0, 1.8],
          ].map(([cx, cy, cz], idx) => (
            <mesh key={`perg-col-${idx}`} position={[cx, 0, cz]} castShadow material={materials.woodSlats}>
              <boxGeometry args={[0.15, 2.4, 0.15]} />
            </mesh>
          ))}
          {/* Pergola Roof Slats (Rhythmic horizontal beams) */}
          {[-1.6, -1.0, -0.4, 0.2, 0.8, 1.4].map((pz, idx) => (
            <mesh key={`perg-beam-${idx}`} position={[0, 1.25, pz]} castShadow material={materials.woodSlats}>
              <boxGeometry args={[4.2, 0.1, 0.08]} />
            </mesh>
          ))}
        </group>

        {/* Rooftop Ventilation Unit with Rotating Cowl */}
        <group position={[-1.8, 0.5, 1.5]}>
          <mesh castShadow material={materials.darkMullion}>
            <cylinderGeometry args={[0.3, 0.35, 0.6, 12]} />
          </mesh>
          <group ref={ventFanRef} position={[0, 0.35, 0]}>
            <mesh material={materials.steelRod}>
              <coneGeometry args={[0.32, 0.25, 12]} />
            </mesh>
          </group>
        </group>

        {/* Rooftop Parapet Railings */}
        {[-halfW - 0.1, halfW + 0.1].map((rx, idx) => (
          <mesh key={`about-rail-${idx}`} position={[rx, 0.5, 0]} material={materials.steelRod}>
            <boxGeometry args={[0.04, 0.8, bD]} />
          </mesh>
        ))}
      </group>

      {/* ======================================================== */}
      {/* 5. HOVER / SELECTION ACCENT GLOW                         */}
      {/* ======================================================== */}
      {allowPointLights && (isHovered || isSelected) && (
        <pointLight
          position={[-3.5, 2.8, 0]}
          color="#f97316"
          intensity={isSelected ? 3.0 : 1.8}
          distance={8.0}
          decay={2}
        />
      )}
    </group>
  );
};

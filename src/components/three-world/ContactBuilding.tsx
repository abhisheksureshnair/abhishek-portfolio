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

export interface ContactBuildingProps {
  position?: [number, number, number];
  onSelect: () => void;
  isSelected?: boolean;
}

/**
 * Creates high-res architectural signage:
 * "CONTACT // COMMUNICATIONS HUB"
 */
function createArchitecturalContactSignTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 140;
  const ctx = canvas.getContext('2d')!;

  // Deep obsidian slate backing
  ctx.fillStyle = '#0b0c16';
  ctx.fillRect(0, 0, 512, 140);

  // Modern pink accent border
  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, 504, 132);

  // Header: "CONTACT"
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 48px "Segoe UI", Roboto, system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('CONTACT', 256, 52);

  // Subtitle: "COMMUNICATIONS HUB // NETWORKS"
  ctx.font = '600 14px monospace';
  ctx.fillStyle = '#f472b6';
  ctx.letterSpacing = '5px';
  ctx.fillText('COMMUNICATIONS HUB // DIRECT', 256, 100);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * ContactBuilding — Contemporary Communications Hub & Boutique Pavilion
 * 3 articulated storeys featuring:
 * - Clean architectural concrete slabs with warm wood slat panels
 * - Expansive floor-to-ceiling corner glass curtain walls
 * - South-facing welcoming ground floor communications lounge with entrance canopy & double doors
 * - Cantilevered second-floor terrace with glass balustrades & planters
 * - Rooftop satellite communications dish, antenna spire with red aviation beacon
 */
export const ContactBuilding: React.FC<ContactBuildingProps> = ({
  position = [0, 0.74, -21.5],
  onSelect,
  isSelected = false,
}) => {
  const { effectiveTier, prefersReducedMotion } = usePerformanceQuality();
  const allowPointLights = effectiveTier === 'high';
  const [isHovered, setIsHovered] = useState(false);

  const rootGroupRef = useRef<THREE.Group>(null);
  const beaconMeshRef = useRef<THREE.Mesh>(null);
  const dishRef = useRef<THREE.Group>(null);

  // Textures
  const concreteTex = useMemo(() => getArchitecturalConcreteTexture(), []);
  const curtainGlassTex = useMemo(() => getCurtainWallGlassTexture(), []);
  const showroomGlassTex = useMemo(() => getLobbyShowroomGlassTexture(), []);
  const louversTex = useMemo(() => getArchitecturalLouversTexture(), []);
  const paverTex = useMemo(() => getGranitePaverTexture(), []);
  const woodTex = useMemo(() => getArchitecturalWoodTexture(), []);
  const signTex = useMemo(() => createArchitecturalContactSignTexture(), []);

  // Shared reusable materials
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
      darkZinc: new THREE.MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.35,
        metalness: 0.75,
      }),
      curtainGlass: new THREE.MeshStandardMaterial({
        map: curtainGlassTex,
        roughness: 0.1,
        metalness: 0.88,
        emissive: '#f472b6',
        emissiveIntensity: 0.18,
      }),
      showroomGlass: new THREE.MeshStandardMaterial({
        map: showroomGlassTex,
        roughness: 0.08,
        metalness: 0.9,
        emissive: '#fde047',
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
        color: '#15803d',
        roughness: 0.8,
        metalness: 0.05,
      }),
      canopyGlass: new THREE.MeshPhysicalMaterial({
        color: '#ec4899',
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

    const time = Date.now() * 0.001;

    // Red beacon pulse
    if (beaconMeshRef.current && !prefersReducedMotion) {
      const cycle = (Math.sin(time * 5.0) + 1) * 0.5;
      const flash = Math.pow(cycle, 5);
      const mat = beaconMeshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.0 + flash * 4.0;
    }

    // Dish slow rotation
    if (dishRef.current && !prefersReducedMotion) {
      dishRef.current.rotation.y += delta * 0.25;
    }
  });

  const bW = 7.0;
  const bD = 6.0;
  const halfW = bW / 2; // 3.5
  const halfD = bD / 2; // 3.0

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
      {/* 1. ARCHITECTURAL GRANITE PLAZA & SOUTH STEPS             */}
      {/* ======================================================== */}
      <mesh position={[0, 0.05, 0]} receiveShadow material={materials.plazaPavers}>
        <boxGeometry args={[7.8, 0.1, 6.8]} />
      </mesh>

      {/* South Approach Steps facing Street (Z = +halfD) */}
      <group position={[0, 0.05, halfD + 0.35]}>
        <mesh position={[0, -0.02, 0]} receiveShadow material={materials.plazaPavers}>
          <boxGeometry args={[3.4, 0.06, 0.7]} />
        </mesh>
        <mesh position={[0, 0.02, -0.15]} receiveShadow material={materials.plazaPavers}>
          <boxGeometry args={[3.2, 0.06, 0.5]} />
        </mesh>
        <mesh position={[0, 0.01, 0.34]}>
          <boxGeometry args={[3.3, 0.02, 0.03]} />
          <meshBasicMaterial color="#ec4899" />
        </mesh>
      </group>

      {/* Planters flanking entrance */}
      {[
        [-2.4, 0.2, halfD + 0.2],
        [2.4, 0.2, halfD + 0.2],
      ].map(([px, py, pz], idx) => (
        <group key={`cnt-planter-${idx}`} position={[px, py, pz]}>
          <mesh castShadow receiveShadow material={materials.darkZinc}>
            <boxGeometry args={[1.2, 0.35, 0.6]} />
          </mesh>
          <mesh position={[0, 0.25, 0]} castShadow material={materials.foliage}>
            <boxGeometry args={[1.05, 0.35, 0.48]} />
          </mesh>
        </group>
      ))}

      {/* ======================================================== */}
      {/* 2. GROUND FLOOR: COMMUNICATIONS SHOWROOM (Height 3.6m)   */}
      {/* ======================================================== */}
      <group position={[0, 1.9, 0]}>
        {/* Corner Concrete Columns */}
        {[
          [-halfW + 0.25, 0, -halfD + 0.25],
          [halfW - 0.25, 0, -halfD + 0.25],
          [-halfW + 0.25, 0, halfD - 0.25],
          [halfW - 0.25, 0, halfD - 0.25],
        ].map(([cx, cy, cz], idx) => (
          <mesh key={`c-col-${idx}`} position={[cx, cy, cz]} castShadow receiveShadow material={materials.concreteSlab}>
            <boxGeometry args={[0.5, 3.6, 0.5]} />
          </mesh>
        ))}

        {/* Double-Height Glass Curtain Showroom */}
        {/* South (Main Entrance Facade) */}
        <mesh position={[0, 0, halfD - 0.05]} material={materials.showroomGlass}>
          <planeGeometry args={[bW - 0.6, 3.4]} />
        </mesh>
        {/* North */}
        <mesh position={[0, 0, -halfD + 0.05]} rotation={[0, Math.PI, 0]} material={materials.showroomGlass}>
          <planeGeometry args={[bW - 0.6, 3.4]} />
        </mesh>
        {/* West */}
        <mesh position={[-halfW + 0.05, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={materials.showroomGlass}>
          <planeGeometry args={[bD - 0.6, 3.4]} />
        </mesh>
        {/* East */}
        <mesh position={[halfW - 0.05, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.showroomGlass}>
          <planeGeometry args={[bD - 0.6, 3.4]} />
        </mesh>

        {/* Interior Lounge Counter & Wood Feature Wall */}
        <mesh position={[0, -0.6, -0.5]} castShadow>
          <boxGeometry args={[2.6, 0.8, 1.0]} />
          <meshStandardMaterial color="#fef08a" emissive="#ec4899" emissiveIntensity={0.4} />
        </mesh>

        {/* South Entrance Glass Double Doors */}
        <group position={[0, -0.65, halfD + 0.02]}>
          <mesh castShadow material={materials.darkZinc}>
            <boxGeometry args={[2.2, 2.2, 0.08]} />
          </mesh>
          <mesh position={[-0.52, 0, 0]} material={materials.showroomGlass}>
            <boxGeometry args={[0.96, 2.05, 0.04]} />
          </mesh>
          <mesh position={[0.52, 0, 0]} material={materials.showroomGlass}>
            <boxGeometry args={[0.96, 2.05, 0.04]} />
          </mesh>
          <mesh position={[-0.06, 0, 0.04]} material={materials.steelRod}>
            <cylinderGeometry args={[0.015, 0.015, 0.75, 8]} />
          </mesh>
          <mesh position={[0.06, 0, 0.04]} material={materials.steelRod}>
            <cylinderGeometry args={[0.015, 0.015, 0.75, 8]} />
          </mesh>
        </group>

        {/* Cantilevered Glass & Steel Entrance Canopy */}
        <group position={[0, 0.75, halfD + 0.8]}>
          <mesh castShadow receiveShadow material={materials.canopyGlass}>
            <boxGeometry args={[3.0, 0.08, 1.5]} />
          </mesh>
          <mesh castShadow material={materials.darkZinc}>
            <boxGeometry args={[3.04, 0.1, 1.54]} />
          </mesh>
          {/* Tension Rods */}
          {[-1.3, 1.3].map((rx, idx) => (
            <mesh
              key={`cnt-tension-${idx}`}
              position={[rx, 0.7, -0.55]}
              rotation={[Math.PI / 6, 0, 0]}
              material={materials.steelRod}
            >
              <cylinderGeometry args={[0.018, 0.018, 1.6, 8]} />
            </mesh>
          ))}
          {/* Signboard above Canopy */}
          <mesh position={[0, 0.25, 0.76]}>
            <planeGeometry args={[2.8, 0.55]} />
            <meshBasicMaterial map={signTex} transparent />
          </mesh>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 3. STOREY 2: COMMUNICATIONS OFFICE                       */}
      {/* ======================================================== */}
      <group position={[0, 3.8, 0]}>
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow material={materials.concreteSlab}>
          <boxGeometry args={[bW + 0.3, 0.22, bD + 0.3]} />
        </mesh>

        {/* Level 2 Glazing and Wood Panels */}
        <group position={[0, 1.25, 0]}>
          <mesh position={[0, 0, halfD - 0.02]} material={materials.curtainGlass}>
            <planeGeometry args={[bW - 0.2, 2.1]} />
          </mesh>
          <mesh position={[0, 0, -halfD + 0.02]} rotation={[0, Math.PI, 0]} material={materials.curtainGlass}>
            <planeGeometry args={[bW - 0.2, 2.1]} />
          </mesh>
          <mesh position={[-halfW + 0.02, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={materials.curtainGlass}>
            <planeGeometry args={[bD - 0.2, 2.1]} />
          </mesh>
          <mesh position={[halfW - 0.02, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.curtainGlass}>
            <planeGeometry args={[bD - 0.2, 2.1]} />
          </mesh>

          {/* Architectural Vertical Wood Slats */}
          {[-2.0, -0.7, 0.7, 2.0].map((lx, idx) => (
            <mesh key={`cnt-slat-${idx}`} position={[lx, 0, halfD + 0.05]} castShadow material={materials.woodSlats}>
              <boxGeometry args={[0.12, 2.1, 0.08]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ======================================================== */}
      {/* 4. STOREY 3: ROOFTOP COMMUNICATIONS ARRAY & TERRACE      */}
      {/* ======================================================== */}
      <group position={[0, 6.2, 0]}>
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow material={materials.concreteSlab}>
          <boxGeometry args={[bW + 0.3, 0.2, bD + 0.3]} />
        </mesh>

        {/* Mechanical & Telecom Core with Louvers */}
        <mesh position={[-1.2, 0.7, 0]} castShadow receiveShadow material={materials.louvers}>
          <boxGeometry args={[2.0, 1.4, 2.4]} />
        </mesh>
        <mesh position={[-1.2, 1.45, 0]} material={materials.concreteSlab}>
          <boxGeometry args={[2.2, 0.12, 2.6]} />
        </mesh>

        {/* Rotating Satellite Dish */}
        <group ref={dishRef} position={[1.4, 0.6, 0.4]} rotation={[0.4, 0.6, 0]}>
          <mesh material={materials.steelRod}>
            <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
          </mesh>
          <mesh position={[0, 0.25, 0]} rotation={[Math.PI, 0, 0]} castShadow>
            <coneGeometry args={[0.38, 0.22, 16, 1, true]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.8} roughness={0.25} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Parapet Railing */}
        {[-halfW - 0.1, halfW + 0.1].map((rx, idx) => (
          <mesh key={`cnt-rail-${idx}`} position={[rx, 0.45, 0]} material={materials.steelRod}>
            <boxGeometry args={[0.04, 0.9, bD]} />
          </mesh>
        ))}

        {/* Telecom Spire & Red Aviation Warning Beacon */}
        <group position={[-1.2, 1.5, 0]}>
          <mesh position={[0, 0.8, 0]} material={materials.steelRod}>
            <cylinderGeometry args={[0.02, 0.06, 1.6, 8]} />
          </mesh>
          <mesh ref={beaconMeshRef} position={[0, 1.65, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.5} />
          </mesh>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 5. HOVER / SELECTION ACCENT GLOW                         */}
      {/* ======================================================== */}
      {allowPointLights && (isHovered || isSelected) && (
        <pointLight
          position={[0, 3.0, halfD + 1.5]}
          color="#ec4899"
          intensity={isSelected ? 3.0 : 1.8}
          distance={8.0}
          decay={2}
        />
      )}
    </group>
  );
};

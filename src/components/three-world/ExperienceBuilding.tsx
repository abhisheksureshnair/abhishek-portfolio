'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePerformanceQuality } from '../PerformanceControl';
import {
  getArchitecturalConcreteTexture,
  getFlutedStoneTexture,
  getCurtainWallGlassTexture,
  getLobbyShowroomGlassTexture,
  getArchitecturalLouversTexture,
  getGranitePaverTexture,
} from './architecturalTextures';

export interface ExperienceBuildingProps {
  position?: [number, number, number];
  onSelect: () => void;
  isSelected?: boolean;
}

/**
 * Creates high-res architectural corporate signage:
 * "INNSPARK SOLUTIONS // EXPERIENCE"
 */
function createArchitecturalExperienceSignTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 140;
  const ctx = canvas.getContext('2d')!;

  // Dark corporate navy backing
  ctx.fillStyle = '#0a1122';
  ctx.fillRect(0, 0, 640, 140);

  // Elegant steel-blue border
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, 632, 132);

  // Title: "INNSPARK SOLUTIONS"
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 46px "Segoe UI", Roboto, system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('INNSPARK SOLUTIONS', 320, 52);

  // Subtitle: "EXPERIENCE // PRODUCTION DELIVERY"
  ctx.font = '600 14px monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.letterSpacing = '5px';
  ctx.fillText('EXPERIENCE // 3+ YEARS PRODUCTION', 320, 100);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * ExperienceBuilding — High-Rise Corporate Office (Reference Image 2 Style)
 * 5 articulated storeys featuring:
 * - Fluted champagne-limestone vertical architectural piers
 * - Dark metal spandrels and recessed ribbon curtain-wall glazing
 * - North-facing grand entrance portico with architectural columns and revolving door
 * - Rooftop cooling towers, elevator penthouse, and red aviation beacon
 */
export const ExperienceBuilding: React.FC<ExperienceBuildingProps> = ({
  position = [0, 0.74, 21.5],
  onSelect,
  isSelected = false,
}) => {
  const { effectiveTier, prefersReducedMotion } = usePerformanceQuality();
  const allowPointLights = effectiveTier === 'high';
  const [isHovered, setIsHovered] = useState(false);

  const rootGroupRef = useRef<THREE.Group>(null);
  const beaconMeshRef = useRef<THREE.Mesh>(null);
  const revolvingDoorRef = useRef<THREE.Group>(null);

  // Textures
  const concreteTex = useMemo(() => getArchitecturalConcreteTexture(), []);
  const flutedStoneTex = useMemo(() => getFlutedStoneTexture(), []);
  const curtainGlassTex = useMemo(() => getCurtainWallGlassTexture(), []);
  const showroomGlassTex = useMemo(() => getLobbyShowroomGlassTexture(), []);
  const louversTex = useMemo(() => getArchitecturalLouversTexture(), []);
  const paverTex = useMemo(() => getGranitePaverTexture(), []);
  const signTex = useMemo(() => createArchitecturalExperienceSignTexture(), []);

  // Shared reusable materials
  const materials = useMemo(() => {
    return {
      concreteSlab: new THREE.MeshStandardMaterial({
        map: concreteTex,
        roughness: 0.75,
        metalness: 0.1,
        color: '#f8fafc',
      }),
      flutedStone: new THREE.MeshStandardMaterial({
        map: flutedStoneTex,
        roughness: 0.6,
        metalness: 0.15,
      }),
      darkSpandrel: new THREE.MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.35,
        metalness: 0.75,
      }),
      curtainGlass: new THREE.MeshStandardMaterial({
        map: curtainGlassTex,
        roughness: 0.1,
        metalness: 0.88,
        emissive: '#fef08a',
        emissiveIntensity: 0.18,
      }),
      showroomGlass: new THREE.MeshStandardMaterial({
        map: showroomGlassTex,
        roughness: 0.08,
        metalness: 0.9,
        emissive: '#fde047',
        emissiveIntensity: 0.35,
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
        color: '#0284c7',
        roughness: 0.1,
        metalness: 0.2,
        transmission: 0.8,
        transparent: true,
        opacity: 0.8,
      }),
    };
  }, [concreteTex, flutedStoneTex, curtainGlassTex, showroomGlassTex, louversTex, paverTex]);

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

    // Revolving door slow spin
    if (revolvingDoorRef.current && !prefersReducedMotion) {
      revolvingDoorRef.current.rotation.y += delta * 0.4;
    }
  });

  const bW = 7.2;
  const bD = 6.2;
  const halfW = bW / 2; // 3.6
  const halfD = bD / 2; // 3.1

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
      {/* 1. PLAZA PODIUM & NORTH ENTRANCE STEPS                   */}
      {/* ======================================================== */}
      <mesh position={[0, 0.05, 0]} receiveShadow material={materials.plazaPavers}>
        <boxGeometry args={[8.0, 0.1, 7.0]} />
      </mesh>

      {/* North Approach Steps facing Street (Z = -halfD) */}
      <group position={[0, 0.05, -halfD - 0.35]}>
        <mesh position={[0, -0.02, 0]} receiveShadow material={materials.plazaPavers}>
          <boxGeometry args={[3.6, 0.06, 0.7]} />
        </mesh>
        <mesh position={[0, 0.02, 0.15]} receiveShadow material={materials.plazaPavers}>
          <boxGeometry args={[3.4, 0.06, 0.5]} />
        </mesh>
        <mesh position={[0, 0.01, -0.34]}>
          <boxGeometry args={[3.5, 0.02, 0.03]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
      </group>

      {/* Planters flanking entrance */}
      {[
        [-2.6, 0.2, -halfD - 0.2],
        [2.6, 0.2, -halfD - 0.2],
      ].map(([px, py, pz], idx) => (
        <group key={`exp-planter-${idx}`} position={[px, py, pz]}>
          <mesh castShadow receiveShadow material={materials.flutedStone}>
            <boxGeometry args={[1.2, 0.35, 0.6]} />
          </mesh>
          <mesh position={[0, 0.25, 0]} castShadow material={materials.foliage}>
            <boxGeometry args={[1.05, 0.35, 0.48]} />
          </mesh>
        </group>
      ))}

      {/* ======================================================== */}
      {/* 2. GROUND FLOOR: GRAND CORPORATE LOBBY (Height 3.8m)     */}
      {/* ======================================================== */}
      <group position={[0, 2.0, 0]}>
        {/* Fluted Stone Corner Columns */}
        {[
          [-halfW + 0.3, 0, -halfD + 0.3],
          [halfW - 0.3, 0, -halfD + 0.3],
          [-halfW + 0.3, 0, halfD - 0.3],
          [halfW - 0.3, 0, halfD - 0.3],
        ].map(([cx, cy, cz], idx) => (
          <mesh key={`e-col-${idx}`} position={[cx, cy, cz]} castShadow receiveShadow material={materials.flutedStone}>
            <boxGeometry args={[0.6, 3.8, 0.6]} />
          </mesh>
        ))}

        {/* Double-Height Showroom Glass Walls */}
        <mesh position={[0, 0, -halfD + 0.05]} rotation={[0, Math.PI, 0]} material={materials.showroomGlass}>
          <planeGeometry args={[bW - 0.8, 3.6]} />
        </mesh>
        <mesh position={[0, 0, halfD - 0.05]} material={materials.showroomGlass}>
          <planeGeometry args={[bW - 0.8, 3.6]} />
        </mesh>
        <mesh position={[-halfW + 0.05, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={materials.showroomGlass}>
          <planeGeometry args={[bD - 0.8, 3.6]} />
        </mesh>
        <mesh position={[halfW - 0.05, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.showroomGlass}>
          <planeGeometry args={[bD - 0.8, 3.6]} />
        </mesh>

        {/* Interior Corporate Reception Core */}
        <mesh position={[0, -0.6, 0.4]} castShadow>
          <boxGeometry args={[2.8, 0.9, 1.2]} />
          <meshStandardMaterial color="#fef08a" emissive="#0284c7" emissiveIntensity={0.4} />
        </mesh>

        {/* North Revolving Glass Entrance Door */}
        <group position={[0, -0.65, -halfD - 0.02]}>
          {/* Drum Enclosure */}
          <mesh castShadow material={materials.darkSpandrel}>
            <cylinderGeometry args={[1.1, 1.1, 2.3, 16, 1, true]} />
          </mesh>
          {/* Rotating Glass Blades */}
          <group ref={revolvingDoorRef}>
            <mesh material={materials.showroomGlass}>
              <boxGeometry args={[2.0, 2.15, 0.03]} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]} material={materials.showroomGlass}>
              <boxGeometry args={[2.0, 2.15, 0.03]} />
            </mesh>
          </group>
        </group>

        {/* Grand Entrance Canopy */}
        <group position={[0, 0.8, -halfD - 0.8]}>
          <mesh castShadow receiveShadow material={materials.canopyGlass}>
            <boxGeometry args={[3.2, 0.08, 1.5]} />
          </mesh>
          <mesh castShadow material={materials.darkSpandrel}>
            <boxGeometry args={[3.24, 0.1, 1.54]} />
          </mesh>
          {/* Tension Rods */}
          {[-1.4, 1.4].map((rx, idx) => (
            <mesh
              key={`exp-tension-${idx}`}
              position={[rx, 0.7, 0.55]}
              rotation={[-Math.PI / 6, 0, 0]}
              material={materials.steelRod}
            >
              <cylinderGeometry args={[0.018, 0.018, 1.6, 8]} />
            </mesh>
          ))}
          {/* Signboard above Canopy */}
          <mesh position={[0, 0.25, -0.76]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[3.0, 0.55]} />
            <meshBasicMaterial map={signTex} transparent />
          </mesh>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 3. STOREYS 2 THROUGH 5: FLUTED STONE & RIBBON GLAZING    */}
      {/* ======================================================== */}
      {[
        { floor: 2, yBase: 3.9, height: 2.3 },
        { floor: 3, yBase: 6.2, height: 2.3 },
        { floor: 4, yBase: 8.5, height: 2.3 },
        { floor: 5, yBase: 10.8, height: 2.3 },
      ].map(({ floor, yBase, height }) => {
        const slabY = yBase + 0.1;
        const windowY = yBase + 0.2 + (height - 0.4) / 2;
        const windowH = height - 0.4;

        return (
          <group key={`exp-level-${floor}`}>
            {/* Horizontal Projecting Slab */}
            <mesh position={[0, slabY, 0]} castShadow receiveShadow material={materials.concreteSlab}>
              <boxGeometry args={[bW + 0.3, 0.22, bD + 0.3]} />
            </mesh>

            {/* Recessed Curtain Wall Glazing */}
            <mesh position={[0, windowY, -halfD + 0.02]} rotation={[0, Math.PI, 0]} material={materials.curtainGlass}>
              <planeGeometry args={[bW - 0.2, windowH]} />
            </mesh>
            <mesh position={[0, windowY, halfD - 0.02]} material={materials.curtainGlass}>
              <planeGeometry args={[bW - 0.2, windowH]} />
            </mesh>
            <mesh position={[-halfW + 0.02, windowY, 0]} rotation={[0, -Math.PI / 2, 0]} material={materials.curtainGlass}>
              <planeGeometry args={[bD - 0.2, windowH]} />
            </mesh>
            <mesh position={[halfW - 0.02, windowY, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.curtainGlass}>
              <planeGeometry args={[bD - 0.2, windowH]} />
            </mesh>

            {/* Vertical Fluted Architectural Stone Piers (Image 2 Style) */}
            {[-2.4, -0.8, 0.8, 2.4].map((px, idx) => (
              <React.Fragment key={`exp-pier-${floor}-${idx}`}>
                <mesh position={[px, windowY, -halfD - 0.04]} castShadow material={materials.flutedStone}>
                  <boxGeometry args={[0.32, windowH, 0.18]} />
                </mesh>
                <mesh position={[px, windowY, halfD + 0.04]} castShadow material={materials.flutedStone}>
                  <boxGeometry args={[0.32, windowH, 0.18]} />
                </mesh>
              </React.Fragment>
            ))}
          </group>
        );
      })}

      {/* ======================================================== */}
      {/* 4. ROOFTOP MECHANICAL PENTHOUSE & COOLING TOWERS         */}
      {/* ======================================================== */}
      <group position={[0, 13.2, 0]}>
        {/* Roof Slab */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow material={materials.concreteSlab}>
          <boxGeometry args={[bW + 0.3, 0.2, bD + 0.3]} />
        </mesh>

        {/* Central Elevator & HVAC Penthouse */}
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow material={materials.louvers}>
          <boxGeometry args={[3.2, 1.6, 2.8]} />
        </mesh>
        <mesh position={[0, 1.65, 0]} material={materials.concreteSlab}>
          <boxGeometry args={[3.4, 0.12, 3.0]} />
        </mesh>

        {/* Industrial Rooftop Cooling Towers */}
        {[-1.8, 1.8].map((cx, idx) => (
          <group key={`exp-cool-${idx}`} position={[cx, 0.45, 0]}>
            <mesh castShadow material={materials.darkSpandrel}>
              <cylinderGeometry args={[0.5, 0.5, 0.9, 16]} />
            </mesh>
            <mesh position={[0, 0.47, 0]}>
              <cylinderGeometry args={[0.45, 0.45, 0.05, 16]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Parapet Railings */}
        {[-halfW - 0.1, halfW + 0.1].map((rx, idx) => (
          <mesh key={`exp-rail-${idx}`} position={[rx, 0.45, 0]} material={materials.steelRod}>
            <boxGeometry args={[0.04, 0.9, bD]} />
          </mesh>
        ))}

        {/* Spire & Red Aviation Beacon */}
        <group position={[0, 1.7, 0]}>
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
          position={[0, 3.0, -halfD - 1.5]}
          color="#0284c7"
          intensity={isSelected ? 3.0 : 1.8}
          distance={8.0}
          decay={2}
        />
      )}
    </group>
  );
};

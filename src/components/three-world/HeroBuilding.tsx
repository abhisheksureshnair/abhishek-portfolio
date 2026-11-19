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

export interface HeroBuildingProps {
  position?: [number, number, number];
  onSelect: () => void;
  isSelected?: boolean;
}

/**
 * Creates high-res architectural corporate lettermark signage:
 * "ABHISHEK S NAIR // FLAGSHIP HEADQUARTERS"
 */
function createArchitecturalHeroSignTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  // Deep obsidian charcoal backing
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, 768, 160);

  // Subtle beveled aluminum border
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, 756, 148);

  // Title: "ABHISHEK S NAIR"
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 52px "Segoe UI", Roboto, system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('ABHISHEK S NAIR', 384, 58);

  // Subtitle: "FLAGSHIP HEADQUARTERS // SOFTWARE ARCHITECTURE"
  ctx.font = '600 16px monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.letterSpacing = '5px';
  ctx.fillText('FLAGSHIP HEADQUARTERS // SOFTWARE ARCHITECTURE', 384, 114);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates procedural texture for rooftop solar panel arrays
 */
function createSolarPhotovoltaicTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0c1b33';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  const cols = 4;
  const rows = 4;
  const cw = 256 / cols;
  const ch = 256 / rows;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      ctx.strokeRect(c * cw + 2, r * ch + 2, cw - 4, ch - 4);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.moveTo(c * cw + cw * 0.5, r * ch + 2);
      ctx.lineTo(c * cw + cw * 0.5, (r + 1) * ch - 2);
      ctx.stroke();
      ctx.strokeStyle = '#38bdf8';
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * HeroBuilding — Flagship Architectural Corporate Headquarters
 * Contemporary 4-story commercial building (Image 1 style):
 * - Clean white precast concrete floor slabs with articulated reveal joints
 * - Floor-to-ceiling curtain wall glazing with recessed dark bronze mullions
 * - Double-height ground floor glass showroom lobby with warm interior reception
 * - South-facing grand entrance with cantilevered steel-and-glass canopy
 * - 3rd-floor executive outdoor terrace with glass balustrade & planters
 * - Full industrial rooftop zone: dual HVAC chiller units, dual photovoltaic solar arrays,
 *   satellite communication dish, and elevator core with red aviation beacon
 */
export const HeroBuilding: React.FC<HeroBuildingProps> = ({
  position = [-7.85, 0.74, -7.35],
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
  const woodDeckTex = useMemo(() => getArchitecturalWoodTexture(), []);
  const signTex = useMemo(() => createArchitecturalHeroSignTexture(), []);
  const solarTex = useMemo(() => createSolarPhotovoltaicTexture(), []);

  // Shared reusable materials
  const materials = useMemo(() => {
    return {
      concreteSlab: new THREE.MeshStandardMaterial({
        map: concreteTex,
        roughness: 0.72,
        metalness: 0.1,
        color: '#f8fafc',
      }),
      darkMullion: new THREE.MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.35,
        metalness: 0.65,
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
      woodDeck: new THREE.MeshStandardMaterial({
        map: woodDeckTex,
        roughness: 0.7,
        metalness: 0.1,
      }),
      plazaPavers: new THREE.MeshStandardMaterial({
        map: paverTex,
        roughness: 0.8,
        metalness: 0.15,
      }),
      solarPanels: new THREE.MeshStandardMaterial({
        map: solarTex,
        roughness: 0.15,
        metalness: 0.85,
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
        color: '#38bdf8',
        roughness: 0.1,
        metalness: 0.2,
        transmission: 0.8,
        transparent: true,
        opacity: 0.8,
      }),
    };
  }, [concreteTex, curtainGlassTex, showroomGlassTex, louversTex, paverTex, woodDeckTex, solarTex]);

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

    // Slow satellite dish azimuth sweep
    if (dishRef.current && !prefersReducedMotion) {
      dishRef.current.rotation.y += delta * 0.2;
    }
  });

  const bW = 6.6;
  const bD = 5.8;
  const halfW = bW / 2; // 3.3
  const halfD = bD / 2; // 2.9

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
      {/* 1. GRANITE PLAZA & SOUTHERN ENTRANCE STEPS               */}
      {/* ======================================================== */}
      {/* Base Plaza Podium */}
      <mesh position={[0, 0.05, 0]} receiveShadow material={materials.plazaPavers}>
        <boxGeometry args={[7.4, 0.1, 6.6]} />
      </mesh>

      {/* South Entrance Approach Steps (Facing Street at Z = +halfD) */}
      <group position={[0, 0.05, halfD + 0.35]}>
        <mesh position={[0, -0.02, 0]} receiveShadow material={materials.plazaPavers}>
          <boxGeometry args={[3.4, 0.06, 0.7]} />
        </mesh>
        <mesh position={[0, 0.02, -0.15]} receiveShadow material={materials.plazaPavers}>
          <boxGeometry args={[3.2, 0.06, 0.5]} />
        </mesh>
        {/* LED step accent */}
        <mesh position={[0, 0.01, 0.34]}>
          <boxGeometry args={[3.3, 0.02, 0.03]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Flanking Architectural Planters with Greenery */}
      {[
        [-2.4, 0.2, halfD + 0.2],
        [2.4, 0.2, halfD + 0.2],
      ].map(([px, py, pz], idx) => (
        <group key={`hero-planter-${idx}`} position={[px, py, pz]}>
          <mesh castShadow receiveShadow material={materials.concreteSlab}>
            <boxGeometry args={[1.2, 0.35, 0.6]} />
          </mesh>
          <mesh position={[0, 0.25, 0]} castShadow material={materials.foliage}>
            <boxGeometry args={[1.05, 0.35, 0.48]} />
          </mesh>
        </group>
      ))}

      {/* ======================================================== */}
      {/* 2. GROUND FLOOR: GRAND COMMERCIAL RECEPTION LOBBY        */}
      {/* ======================================================== */}
      {/* Floor-to-ceiling 3.8m double-height showroom */}
      <group position={[0, 2.0, 0]}>
        {/* Structural Corner Concrete Columns */}
        {[
          [-halfW + 0.25, 0, -halfD + 0.25],
          [halfW - 0.25, 0, -halfD + 0.25],
          [-halfW + 0.25, 0, halfD - 0.25],
          [halfW - 0.25, 0, halfD - 0.25],
        ].map(([cx, cy, cz], idx) => (
          <mesh key={`h-col-${idx}`} position={[cx, cy, cz]} castShadow receiveShadow material={materials.concreteSlab}>
            <boxGeometry args={[0.5, 3.8, 0.5]} />
          </mesh>
        ))}

        {/* Double-Height Glass Curtain Facades */}
        {/* South (Main Entrance Facade) */}
        <mesh position={[0, 0, halfD - 0.05]} material={materials.showroomGlass}>
          <planeGeometry args={[bW - 0.6, 3.6]} />
        </mesh>
        {/* North Facade */}
        <mesh position={[0, 0, -halfD + 0.05]} rotation={[0, Math.PI, 0]} material={materials.showroomGlass}>
          <planeGeometry args={[bW - 0.6, 3.6]} />
        </mesh>
        {/* West Facade */}
        <mesh position={[-halfW + 0.05, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={materials.showroomGlass}>
          <planeGeometry args={[bD - 0.6, 3.6]} />
        </mesh>
        {/* East Facade */}
        <mesh position={[halfW - 0.05, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.showroomGlass}>
          <planeGeometry args={[bD - 0.6, 3.6]} />
        </mesh>

        {/* Interior Lobby Warm Reception Desk & Back Wall */}
        <mesh position={[0, -0.6, -0.4]} castShadow>
          <boxGeometry args={[2.6, 0.9, 1.0]} />
          <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={0.65} />
        </mesh>
        <mesh position={[0, 0, -1.2]} material={materials.woodDeck}>
          <boxGeometry args={[3.2, 3.6, 0.1]} />
        </mesh>

        {/* South Entrance Glass Sliding Doors & Handles */}
        <group position={[0, -0.65, halfD + 0.02]}>
          <mesh castShadow material={materials.darkMullion}>
            <boxGeometry args={[2.2, 2.3, 0.08]} />
          </mesh>
          <mesh position={[-0.52, 0, 0]} material={materials.showroomGlass}>
            <boxGeometry args={[0.96, 2.15, 0.04]} />
          </mesh>
          <mesh position={[0.52, 0, 0]} material={materials.showroomGlass}>
            <boxGeometry args={[0.96, 2.15, 0.04]} />
          </mesh>
          {/* Vertical stainless steel pull handles */}
          <mesh position={[-0.06, 0, 0.04]} material={materials.steelRod}>
            <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
          </mesh>
          <mesh position={[0.06, 0, 0.04]} material={materials.steelRod}>
            <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
          </mesh>
        </group>

        {/* Cantilevered Glass & Steel Entrance Canopy */}
        <group position={[0, 0.8, halfD + 0.8]}>
          <mesh castShadow receiveShadow material={materials.canopyGlass}>
            <boxGeometry args={[3.0, 0.08, 1.5]} />
          </mesh>
          <mesh castShadow material={materials.darkMullion}>
            <boxGeometry args={[3.04, 0.1, 1.54]} />
          </mesh>
          <mesh position={[0, -0.06, 0]}>
            <boxGeometry args={[2.8, 0.02, 1.3]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.2} />
          </mesh>
          {/* Tension Rods */}
          {[-1.3, 1.3].map((rx, idx) => (
            <mesh
              key={`hero-tension-${idx}`}
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
      {/* 3. STOREYS 2 & 3: CONTEMPORARY ARCHITECTURAL OFFICE      */}
      {/* ======================================================== */}
      {[
        { floor: 2, yBase: 3.9, height: 2.3 },
        { floor: 3, yBase: 6.2, height: 2.3 },
      ].map(({ floor, yBase, height }) => {
        const slabY = yBase + 0.1;
        const windowY = yBase + 0.2 + (height - 0.4) / 2;
        const windowH = height - 0.4;

        return (
          <group key={`hero-level-${floor}`}>
            {/* Horizontal Projecting Precast Concrete Slab */}
            <mesh position={[0, slabY, 0]} castShadow receiveShadow material={materials.concreteSlab}>
              <boxGeometry args={[bW + 0.3, 0.22, bD + 0.3]} />
            </mesh>

            {/* Recessed Glazed Window Facades */}
            <mesh position={[0, windowY, halfD - 0.02]} material={materials.curtainGlass}>
              <planeGeometry args={[bW - 0.2, windowH]} />
            </mesh>
            <mesh position={[0, windowY, -halfD + 0.02]} rotation={[0, Math.PI, 0]} material={materials.curtainGlass}>
              <planeGeometry args={[bW - 0.2, windowH]} />
            </mesh>
            <mesh position={[-halfW + 0.02, windowY, 0]} rotation={[0, -Math.PI / 2, 0]} material={materials.curtainGlass}>
              <planeGeometry args={[bD - 0.2, windowH]} />
            </mesh>
            <mesh position={[halfW - 0.02, windowY, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.curtainGlass}>
              <planeGeometry args={[bD - 0.2, windowH]} />
            </mesh>

            {/* Vertical Dark Mullions with Architectural Relief */}
            {[-2.0, -0.7, 0.7, 2.0].map((mx, idx) => (
              <React.Fragment key={`h-mullion-${floor}-${idx}`}>
                <mesh position={[mx, windowY, halfD + 0.03]} castShadow material={materials.darkMullion}>
                  <boxGeometry args={[0.07, windowH, 0.1]} />
                </mesh>
                <mesh position={[mx, windowY, -halfD - 0.03]} castShadow material={materials.darkMullion}>
                  <boxGeometry args={[0.07, windowH, 0.1]} />
                </mesh>
              </React.Fragment>
            ))}
          </group>
        );
      })}

      {/* ======================================================== */}
      {/* 4. STOREY 4: EXECUTIVE PENTHOUSE & SETBACK TERRACE       */}
      {/* ======================================================== */}
      {/* Terrace Deck at Y: 8.5 */}
      <group position={[0, 8.5, 0]}>
        {/* Main Floor Slab */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow material={materials.concreteSlab}>
          <boxGeometry args={[bW + 0.3, 0.2, bD + 0.3]} />
        </mesh>

        {/* South Setback Terrace Decking */}
        <mesh position={[0, 0.21, halfD - 0.65]} material={materials.woodDeck}>
          <boxGeometry args={[bW - 0.4, 0.02, 1.2]} />
        </mesh>

        {/* Glass Balustrade on South Terrace */}
        <group position={[0, 0.65, halfD + 0.1]}>
          <mesh material={materials.clearBalustrade}>
            <boxGeometry args={[bW + 0.1, 0.9, 0.04]} />
          </mesh>
          <mesh position={[0, 0.46, 0]} material={materials.steelRod}>
            <boxGeometry args={[bW + 0.12, 0.04, 0.06]} />
          </mesh>
        </group>
      </group>

      {/* Level 4 Penthouse (Set back from south edge by 1.4m) */}
      <group position={[0, 9.7, -0.7]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[bW - 0.6, 2.2, bD - 1.8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Penthouse Glass */}
        <mesh position={[0, 0, (bD - 1.8) / 2 + 0.01]} material={materials.curtainGlass}>
          <planeGeometry args={[bW - 0.8, 2.0]} />
        </mesh>
        {/* Penthouse Roof Cap */}
        <mesh position={[0, 1.2, 0]} castShadow material={materials.concreteSlab}>
          <boxGeometry args={[bW - 0.3, 0.2, bD - 1.5]} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 5. INDUSTRIAL ROOFTOP MECHANICAL ZONE                    */}
      {/* ======================================================== */}
      <group position={[0, 11.0, -0.7]}>
        {/* Elevator Core with Louvered Panels */}
        <mesh position={[-1.2, 0.7, 0]} castShadow receiveShadow material={materials.louvers}>
          <boxGeometry args={[1.8, 1.4, 1.8]} />
        </mesh>
        <mesh position={[-1.2, 1.45, 0]} material={materials.concreteSlab}>
          <boxGeometry args={[2.0, 0.12, 2.0]} />
        </mesh>

        {/* Dual Industrial HVAC Chiller Units with Fan Grilles */}
        <group position={[1.2, 0.4, -0.2]}>
          <mesh castShadow receiveShadow material={materials.darkMullion}>
            <boxGeometry args={[1.4, 0.7, 0.9]} />
          </mesh>
          <mesh position={[-0.35, 0.37, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.05, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
          <mesh position={[0.35, 0.37, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.05, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
        </group>

        {/* Dual Rooftop Photovoltaic Solar Arrays (Angled to Sun) */}
        {[-0.8, 0.8].map((sx, idx) => (
          <group key={`hero-solar-${idx}`} position={[sx, 0.35, 1.1]} rotation={[-Math.PI / 8, 0, 0]}>
            <mesh castShadow material={materials.solarPanels}>
              <boxGeometry args={[1.2, 0.05, 0.9]} />
            </mesh>
            <mesh position={[0, -0.15, 0]} material={materials.steelRod}>
              <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
            </mesh>
          </group>
        ))}

        {/* Rotating Satellite Communications Dish */}
        <group ref={dishRef} position={[1.4, 0.6, 1.1]} rotation={[0.4, 0.5, 0]}>
          <mesh material={materials.steelRod}>
            <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
          </mesh>
          <mesh position={[0, 0.25, 0]} rotation={[Math.PI, 0, 0]} castShadow>
            <coneGeometry args={[0.35, 0.2, 16, 1, true]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.25} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Rooftop Mast & Flashing Red Aviation Beacon */}
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
      {/* 6. HOVER / SELECTION ACCENT GLOW                         */}
      {/* ======================================================== */}
      {allowPointLights && (isHovered || isSelected) && (
        <pointLight
          position={[0, 3.0, halfD + 1.5]}
          color="#38bdf8"
          intensity={isSelected ? 3.0 : 1.8}
          distance={8.0}
          decay={2}
        />
      )}
    </group>
  );
};

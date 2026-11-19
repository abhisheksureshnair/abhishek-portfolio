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

export interface SkillsBuildingProps {
  position?: [number, number, number];
  onSelect: () => void;
  isSelected?: boolean;
}

/**
 * Creates an elegant, realistic architectural metal/acrylic signage texture
 * "SKILLS TECH TOWER // ENGINEERING STACK"
 */
function createArchitecturalSkillsSignTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Brushed architectural dark bronze/charcoal backing
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 128);

  // Subtle beveled aluminum border
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, 504, 120);

  // Primary Header: "SKILLS TECH TOWER"
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 36px "Segoe UI", Roboto, system-ui, sans-serif';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('SKILLS TECH TOWER', 256, 48);

  // Subtitle: "ENGINEERING STACK & ARCHITECTURE"
  ctx.font = '600 13px monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.letterSpacing = '4px';
  ctx.fillText('ENGINEERING STACK & ARCHITECTURE', 256, 88);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * SkillsBuilding — Flagship Contemporary Commercial Office Tower
 * Modeled on modern architectural office typologies (Reference Images 1 & 2):
 * - 7 articulated storeys with limestone concrete horizontal floor slabs
 * - Recessed dark bronze curtain-wall mullions with realistic glass depth
 * - Double-height ground floor glass showroom lobby with warm interior illumination
 * - Cantilevered glass & steel entrance canopy with tension tie-rods
 * - 5th-floor executive setback terrace with glass balustrades & architectural planters
 * - Full rooftop mechanical penthouse: HVAC chillers, ducted fan vents, elevator core
 * - Telecom spire with flashing red aviation obstruction beacon
 */
export const SkillsBuilding: React.FC<SkillsBuildingProps> = ({
  position = [7.85, 0.74, 7.35],
  onSelect,
  isSelected = false,
}) => {
  const { effectiveTier, prefersReducedMotion } = usePerformanceQuality();
  const allowPointLights = effectiveTier === 'high';
  const [isHovered, setIsHovered] = useState(false);

  const rootGroupRef = useRef<THREE.Group>(null);
  const beaconMeshRef = useRef<THREE.Mesh>(null);
  const lobbyGlowRef = useRef<THREE.PointLight>(null);
  const antennaRingRef = useRef<THREE.Group>(null);

  // Architectural PBR textures
  const concreteTex = useMemo(() => getArchitecturalConcreteTexture(), []);
  const curtainGlassTex = useMemo(() => getCurtainWallGlassTexture(), []);
  const showroomGlassTex = useMemo(() => getLobbyShowroomGlassTexture(), []);
  const louversTex = useMemo(() => getArchitecturalLouversTexture(), []);
  const paverTex = useMemo(() => getGranitePaverTexture(), []);
  const woodDeckTex = useMemo(() => getArchitecturalWoodTexture(), []);
  const signTex = useMemo(() => createArchitecturalSkillsSignTexture(), []);

  // Shared reusable architectural PBR materials
  const materials = useMemo(() => {
    return {
      concreteSlab: new THREE.MeshStandardMaterial({
        map: concreteTex,
        roughness: 0.75,
        metalness: 0.1,
        color: '#f1f5f9',
      }),
      darkMullion: new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.35,
        metalness: 0.7,
      }),
      curtainGlass: new THREE.MeshStandardMaterial({
        map: curtainGlassTex,
        roughness: 0.12,
        metalness: 0.85,
        emissive: '#fde047',
        emissiveIntensity: 0.15,
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
      foliage: new THREE.MeshStandardMaterial({
        color: '#166534',
        roughness: 0.8,
        metalness: 0.05,
      }),
      canopyGlass: new THREE.MeshPhysicalMaterial({
        color: '#38bdf8',
        roughness: 0.1,
        metalness: 0.2,
        transmission: 0.75,
        transparent: true,
        opacity: 0.8,
      }),
      steelRod: new THREE.MeshStandardMaterial({
        color: '#94a3b8',
        roughness: 0.2,
        metalness: 0.95,
      }),
      warmInteriorGlow: new THREE.MeshStandardMaterial({
        color: '#fef08a',
        emissive: '#fde047',
        emissiveIntensity: 0.8,
        roughness: 0.4,
      }),
    };
  }, [concreteTex, curtainGlassTex, showroomGlassTex, louversTex, paverTex, woodDeckTex]);

  // Frame animations
  useFrame((_, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;

    // Smooth hover/selection vertical response
    if (rootGroupRef.current) {
      const targetY = position[1] + ((isHovered || isSelected) && !prefersReducedMotion ? 0.1 : 0);
      if (prefersReducedMotion) {
        rootGroupRef.current.position.y = targetY;
      } else {
        rootGroupRef.current.position.y += (targetY - rootGroupRef.current.position.y) * (1 - Math.exp(-12.0 * delta));
      }
    }

    const time = Date.now() * 0.001;

    // Red aviation obstacle beacon flash
    if (beaconMeshRef.current && !prefersReducedMotion) {
      const cycle = (Math.sin(time * 5.0) + 1) * 0.5;
      const flash = Math.pow(cycle, 5);
      const mat = beaconMeshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.0 + flash * 4.0;
    }

    // Slow telecom antenna rotation
    if (antennaRingRef.current && !prefersReducedMotion) {
      antennaRingRef.current.rotation.y += delta * 0.8;
    }
  });

  // Building geometry dimensions (fits safely inside [3.5, 12.2] x [3.5, 11.2])
  // Width: 6.6m, Depth: 6.0m. Ground floor is 4.0m high, upper floors 2.2m each.
  const bW = 6.4;
  const bD = 5.8;
  const halfW = bW / 2; // 3.2
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
      {/* 1. ARCHITECTURAL ENTRANCE PLAZA & STEPS                  */}
      {/* ======================================================== */}
      {/* Granite Paver Plaza Platform */}
      <mesh position={[0, 0.05, 0]} receiveShadow material={materials.plazaPavers}>
        <boxGeometry args={[7.2, 0.1, 6.6]} />
      </mesh>

      {/* Western Entrance Approach Steps (Facing Avenue at X = -3.2) */}
      <group position={[-halfW - 0.35, 0.05, 0]}>
        <mesh position={[0, -0.02, 0]} receiveShadow material={materials.plazaPavers}>
          <boxGeometry args={[0.7, 0.06, 3.2]} />
        </mesh>
        <mesh position={[0.15, 0.02, 0]} receiveShadow material={materials.plazaPavers}>
          <boxGeometry args={[0.5, 0.06, 3.0]} />
        </mesh>
        {/* Step LED Accent Line */}
        <mesh position={[-0.34, 0.01, 0]}>
          <boxGeometry args={[0.03, 0.02, 3.1]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Modern Architectural Planters with Manicured Shrubs (Plaza Edges) */}
      {[
        [-halfW - 0.2, 0.2, 2.2],
        [-halfW - 0.2, 0.2, -2.2],
      ].map(([px, py, pz], idx) => (
        <group key={`plaza-planter-${idx}`} position={[px, py, pz]}>
          <mesh castShadow receiveShadow material={materials.concreteSlab}>
            <boxGeometry args={[0.6, 0.35, 1.2]} />
          </mesh>
          <mesh position={[0, 0.25, 0]} castShadow material={materials.foliage}>
            <boxGeometry args={[0.48, 0.35, 1.05]} />
          </mesh>
        </group>
      ))}

      {/* ======================================================== */}
      {/* 2. GROUND FLOOR: DOUBLE-HEIGHT GLASS LOBBY & SHOPFRONT   */}
      {/* ======================================================== */}
      {/* Floor to ceiling height: 3.8m (Y: 0.1 to 3.9) */}
      <group position={[0, 2.0, 0]}>
        {/* Reinforced Concrete Structural Columns (4 Corners) */}
        {[
          [-halfW + 0.25, 0, -halfD + 0.25],
          [halfW - 0.25, 0, -halfD + 0.25],
          [-halfW + 0.25, 0, halfD - 0.25],
          [halfW - 0.25, 0, halfD - 0.25],
        ].map(([cx, cy, cz], idx) => (
          <mesh key={`col-${idx}`} position={[cx, cy, cz]} castShadow receiveShadow material={materials.concreteSlab}>
            <boxGeometry args={[0.5, 3.8, 0.5]} />
          </mesh>
        ))}

        {/* Double-Height Glass Curtain Enclosure with Interior Warm Lighting */}
        {/* West Facade (Main Entrance Side) */}
        <mesh position={[-halfW + 0.05, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={materials.showroomGlass}>
          <planeGeometry args={[bD - 0.6, 3.6]} />
        </mesh>
        {/* South Facade */}
        <mesh position={[0, 0, halfD - 0.05]} material={materials.showroomGlass}>
          <planeGeometry args={[bW - 0.6, 3.6]} />
        </mesh>
        {/* East Facade */}
        <mesh position={[halfW - 0.05, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.showroomGlass}>
          <planeGeometry args={[bD - 0.6, 3.6]} />
        </mesh>
        {/* North Facade */}
        <mesh position={[0, 0, -halfD + 0.05]} rotation={[0, Math.PI, 0]} material={materials.showroomGlass}>
          <planeGeometry args={[bW - 0.6, 3.6]} />
        </mesh>

        {/* Interior Lobby Architectural Depth (Warm Reception Core) */}
        <mesh position={[0.4, -0.6, 0]} castShadow material={materials.warmInteriorGlow}>
          <boxGeometry args={[2.8, 0.9, 1.2]} />
        </mesh>
        {/* Interior Acoustic Wood Slatted Back Wall */}
        <mesh position={[1.4, 0, 0]} material={materials.woodDeck}>
          <boxGeometry args={[0.1, 3.6, 3.2]} />
        </mesh>

        {/* Ground Floor Interior Downlight */}
        {allowPointLights && (
          <pointLight
            ref={lobbyGlowRef}
            position={[-0.5, 0.8, 0]}
            color="#fef08a"
            intensity={1.8}
            distance={6.5}
            decay={2}
          />
        )}

        {/* Western Entrance Doors & Mullion Frame */}
        <group position={[-halfW - 0.02, -0.65, 0]}>
          {/* Aluminum Door Frame */}
          <mesh castShadow material={materials.darkMullion}>
            <boxGeometry args={[0.08, 2.3, 2.0]} />
          </mesh>
          {/* Glass Panels */}
          <mesh position={[0, 0, -0.48]} material={materials.showroomGlass}>
            <boxGeometry args={[0.04, 2.15, 0.88]} />
          </mesh>
          <mesh position={[0, 0, 0.48]} material={materials.showroomGlass}>
            <boxGeometry args={[0.04, 2.15, 0.88]} />
          </mesh>
          {/* Stainless Steel Vertical Pull Handles */}
          <mesh position={[-0.04, 0, -0.06]} material={materials.steelRod}>
            <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
          </mesh>
          <mesh position={[-0.04, 0, 0.06]} material={materials.steelRod}>
            <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
          </mesh>
        </group>

        {/* Grand Cantilevered Entrance Canopy with Tension Tie-Rods */}
        <group position={[-halfW - 0.8, 0.8, 0]}>
          {/* Clear Glass Canopy Roof Slab */}
          <mesh castShadow receiveShadow material={materials.canopyGlass}>
            <boxGeometry args={[1.5, 0.08, 2.8]} />
          </mesh>
          {/* Steel Perimeter Edge Trim */}
          <mesh castShadow material={materials.darkMullion}>
            <boxGeometry args={[1.54, 0.1, 2.84]} />
          </mesh>
          {/* Underside Downlight Strip */}
          <mesh position={[0, -0.06, 0]}>
            <boxGeometry args={[1.3, 0.02, 2.6]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.2} />
          </mesh>
          {/* Structural Stainless Steel Tension Tie-Rods */}
          {[-1.2, 1.2].map((rz, idx) => (
            <mesh
              key={`tension-rod-${idx}`}
              position={[0.55, 0.7, rz]}
              rotation={[0, 0, -Math.PI / 6]}
              material={materials.steelRod}
            >
              <cylinderGeometry args={[0.018, 0.018, 1.6, 8]} />
            </mesh>
          ))}
          {/* Architectural Entrance Marquee Sign */}
          <mesh position={[-0.76, 0.25, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[2.6, 0.55]} />
            <meshBasicMaterial map={signTex} transparent />
          </mesh>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 3. STOREYS 2 THROUGH 5: CONTEMPORARY CURTAIN WALL TOWER  */}
      {/* ======================================================== */}
      {/* Floor Slabs and Window Bands for Floors 2, 3, 4, 5 */}
      {[
        { floor: 2, yBase: 3.9, height: 2.2 },
        { floor: 3, yBase: 6.1, height: 2.2 },
        { floor: 4, yBase: 8.3, height: 2.2 },
        { floor: 5, yBase: 10.5, height: 2.2 },
      ].map(({ floor, yBase, height }) => {
        const slabY = yBase + 0.1;
        const windowY = yBase + 0.2 + (height - 0.4) / 2;
        const windowH = height - 0.4;

        return (
          <group key={`tower-level-${floor}`}>
            {/* Horizontal Projecting Limestone Concrete Floor Slab */}
            <mesh position={[0, slabY, 0]} castShadow receiveShadow material={materials.concreteSlab}>
              <boxGeometry args={[bW + 0.3, 0.22, bD + 0.3]} />
            </mesh>

            {/* Recessed Glazed Window Facades (Floor-to-Ceiling with Mullions) */}
            {/* West Facade */}
            <mesh position={[-halfW + 0.02, windowY, 0]} rotation={[0, -Math.PI / 2, 0]} material={materials.curtainGlass}>
              <planeGeometry args={[bD - 0.2, windowH]} />
            </mesh>
            {/* East Facade */}
            <mesh position={[halfW - 0.02, windowY, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.curtainGlass}>
              <planeGeometry args={[bD - 0.2, windowH]} />
            </mesh>
            {/* South Facade */}
            <mesh position={[0, windowY, halfD - 0.02]} material={materials.curtainGlass}>
              <planeGeometry args={[bW - 0.2, windowH]} />
            </mesh>
            {/* North Facade */}
            <mesh position={[0, windowY, -halfD + 0.02]} rotation={[0, Math.PI, 0]} material={materials.curtainGlass}>
              <planeGeometry args={[bW - 0.2, windowH]} />
            </mesh>

            {/* Vertical Dark Bronze Mullions (Image 1 Style) */}
            {[-2.0, -0.7, 0.7, 2.0].map((mx, idx) => (
              <React.Fragment key={`mullions-${floor}-${idx}`}>
                <mesh position={[mx, windowY, halfD + 0.03]} castShadow material={materials.darkMullion}>
                  <boxGeometry args={[0.07, windowH, 0.1]} />
                </mesh>
                <mesh position={[mx, windowY, -halfD - 0.03]} castShadow material={materials.darkMullion}>
                  <boxGeometry args={[0.07, windowH, 0.1]} />
                </mesh>
              </React.Fragment>
            ))}
            {[-1.8, 0, 1.8].map((mz, idx) => (
              <React.Fragment key={`mullions-side-${floor}-${idx}`}>
                <mesh position={[-halfW - 0.03, windowY, mz]} castShadow material={materials.darkMullion}>
                  <boxGeometry args={[0.1, windowH, 0.07]} />
                </mesh>
                <mesh position={[halfW + 0.03, windowY, mz]} castShadow material={materials.darkMullion}>
                  <boxGeometry args={[0.1, windowH, 0.07]} />
                </mesh>
              </React.Fragment>
            ))}
          </group>
        );
      })}

      {/* ======================================================== */}
      {/* 4. STOREYS 6 & 7: EXECUTIVE PENTHOUSE & SETBACK TERRACE */}
      {/* ======================================================== */}
      {/* 5th Floor Setback Terrace Deck at Y: 12.7 */}
      <group position={[0, 12.7, 0]}>
        {/* Main Intermediate Roof / Terrace Slab */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow material={materials.concreteSlab}>
          <boxGeometry args={[bW + 0.3, 0.2, bD + 0.3]} />
        </mesh>

        {/* Timber Decking on Outdoor Terrace Zone */}
        <mesh position={[-halfW + 0.75, 0.21, 0]} material={materials.woodDeck}>
          <boxGeometry args={[1.2, 0.02, bD - 0.4]} />
        </mesh>

        {/* Perimeter Tempered Glass Balustrades with Stainless Handrail */}
        {/* West Edge Balustrade */}
        <group position={[-halfW - 0.1, 0.65, 0]}>
          <mesh material={materials.clearBalustrade}>
            <boxGeometry args={[0.04, 0.9, bD + 0.1]} />
          </mesh>
          <mesh position={[0, 0.46, 0]} material={materials.steelRod}>
            <boxGeometry args={[0.06, 0.04, bD + 0.12]} />
          </mesh>
        </group>
        {/* North & South Edge Return Balustrades */}
        <group position={[-halfW + 0.6, 0.65, halfD + 0.1]}>
          <mesh material={materials.clearBalustrade}>
            <boxGeometry args={[1.4, 0.9, 0.04]} />
          </mesh>
          <mesh position={[0, 0.46, 0]} material={materials.steelRod}>
            <boxGeometry args={[1.42, 0.04, 0.06]} />
          </mesh>
        </group>
        <group position={[-halfW + 0.6, 0.65, -halfD - 0.1]}>
          <mesh material={materials.clearBalustrade}>
            <boxGeometry args={[1.4, 0.9, 0.04]} />
          </mesh>
          <mesh position={[0, 0.46, 0]} material={materials.steelRod}>
            <boxGeometry args={[1.42, 0.04, 0.06]} />
          </mesh>
        </group>

        {/* Outdoor Terrace Architectural Planters */}
        <mesh position={[-halfW + 0.35, 0.4, 1.8]} castShadow material={materials.concreteSlab}>
          <boxGeometry args={[0.4, 0.4, 1.2]} />
        </mesh>
        <mesh position={[-halfW + 0.35, 0.65, 1.8]} material={materials.foliage}>
          <boxGeometry args={[0.3, 0.3, 1.1]} />
        </mesh>
      </group>

      {/* Setback Penthouse Levels 6 & 7 (Width: 4.8m, Depth: 5.4m) */}
      {[
        { level: 6, yBase: 12.9, height: 2.1 },
        { level: 7, yBase: 15.0, height: 2.1 },
      ].map(({ level, yBase, height }) => {
        const pW = 4.8;
        const pD = 5.2;
        const pX = 0.7; // shifted slightly east for west terrace
        const windowY = yBase + height / 2;

        return (
          <group key={`penthouse-level-${level}`}>
            {/* Penthouse Glass Envelope */}
            <mesh position={[pX, windowY, 0]} castShadow receiveShadow>
              <boxGeometry args={[pW, height - 0.2, pD]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
            </mesh>

            {/* Glass curtain facades */}
            <mesh position={[pX - pW / 2 - 0.01, windowY, 0]} rotation={[0, -Math.PI / 2, 0]} material={materials.curtainGlass}>
              <planeGeometry args={[pD * 0.95, height - 0.25]} />
            </mesh>
            <mesh position={[pX + pW / 2 + 0.01, windowY, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.curtainGlass}>
              <planeGeometry args={[pD * 0.95, height - 0.25]} />
            </mesh>
            <mesh position={[pX, windowY, pD / 2 + 0.01]} material={materials.curtainGlass}>
              <planeGeometry args={[pW * 0.95, height - 0.25]} />
            </mesh>
            <mesh position={[pX, windowY, -pD / 2 - 0.01]} rotation={[0, Math.PI, 0]} material={materials.curtainGlass}>
              <planeGeometry args={[pW * 0.95, height - 0.25]} />
            </mesh>

            {/* Intermediate Slab */}
            <mesh position={[pX, yBase + height, 0]} castShadow material={materials.concreteSlab}>
              <boxGeometry args={[pW + 0.25, 0.18, pD + 0.25]} />
            </mesh>
          </group>
        );
      })}

      {/* ======================================================== */}
      {/* 5. ROOFTOP MECHANICAL PENTHOUSE & INDUSTRIAL HVAC       */}
      {/* ======================================================== */}
      <group position={[0.7, 17.2, 0]}>
        {/* Elevator Motor Room / Mechanical Core with Louvers */}
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow material={materials.louvers}>
          <boxGeometry args={[3.2, 1.8, 3.0]} />
        </mesh>
        {/* Concrete Overrun Cap */}
        <mesh position={[0, 1.85, 0]} material={materials.concreteSlab}>
          <boxGeometry args={[3.4, 0.15, 3.2]} />
        </mesh>

        {/* Dual Industrial HVAC Chiller Units */}
        <group position={[-1.2, 0.45, 1.8]}>
          <mesh castShadow receiveShadow material={materials.darkMullion}>
            <boxGeometry args={[1.4, 0.8, 0.9]} />
          </mesh>
          {/* Fan Grille 1 */}
          <mesh position={[-0.35, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
          {/* Fan Grille 2 */}
          <mesh position={[0.35, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
        </group>

        {/* Galvanized Ductwork Run */}
        <mesh position={[0.4, 0.3, 1.8]} material={materials.steelRod}>
          <boxGeometry args={[1.5, 0.35, 0.35]} />
        </mesh>

        {/* Rooftop Perimeter Safety Parapet Railings */}
        {[-2.3, 2.3].map((rx, idx) => (
          <mesh key={`roof-rail-${idx}`} position={[rx, 0.45, 0]} material={materials.steelRod}>
            <boxGeometry args={[0.04, 0.9, 5.0]} />
          </mesh>
        ))}

        {/* Communication Antenna Spire with Aviation Warning Beacon */}
        <group position={[0, 1.9, 0]}>
          {/* Base Pedestal */}
          <mesh position={[0, 0.2, 0]} material={materials.steelRod}>
            <cylinderGeometry args={[0.2, 0.3, 0.4, 8]} />
          </mesh>
          {/* Lattice Mast */}
          <mesh position={[0, 1.4, 0]} material={materials.steelRod}>
            <cylinderGeometry args={[0.04, 0.1, 2.2, 8]} />
          </mesh>
          {/* Rotating Microwave Drum / Radar Ring */}
          <group ref={antennaRingRef} position={[0, 1.6, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.35, 0.025, 8, 20]} />
              <meshStandardMaterial color="#38bdf8" metalness={0.9} />
            </mesh>
          </group>
          {/* Upper Needle Tip */}
          <mesh position={[0, 2.7, 0]} material={materials.steelRod}>
            <cylinderGeometry args={[0.015, 0.04, 0.8, 6]} />
          </mesh>
          {/* Flashing Red Aircraft Obstruction Beacon */}
          <mesh ref={beaconMeshRef} position={[0, 3.12, 0]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={2.5}
              roughness={0.1}
            />
          </mesh>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 6. HOVER / SELECTION SUBTLE ARCHITECTURAL GLOW           */}
      {/* ======================================================== */}
      {allowPointLights && (isHovered || isSelected) && (
        <pointLight
          position={[-3.5, 3.0, 0]}
          color="#38bdf8"
          intensity={isSelected ? 3.0 : 1.8}
          distance={8.0}
          decay={2}
        />
      )}
    </group>
  );
};

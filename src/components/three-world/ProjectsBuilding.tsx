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
} from './architecturalTextures';

export interface ProjectsBuildingProps {
  position?: [number, number, number];
  onSelect: () => void;
  isSelected?: boolean;
}

/**
 * Creates high-res architectural signage texture:
 * "PROJECTS // INNOVATION CENTER"
 */
function createArchitecturalProjectsSignTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 140;
  const ctx = canvas.getContext('2d')!;

  // Dark violet-slate architectural backing
  ctx.fillStyle = '#0b0f19';
  ctx.fillRect(0, 0, 512, 140);

  // High-tech violet border
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, 504, 132);

  // Title: "PROJECTS"
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 48px "Segoe UI", Roboto, system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('PROJECTS', 256, 52);

  // Subtitle: "INNOVATION CENTER // AI LABS"
  ctx.font = '600 14px monospace';
  ctx.fillStyle = '#c084fc';
  ctx.letterSpacing = '4px';
  ctx.fillText('INNOVATION CENTER // AI LABS', 256, 100);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural Dynamic Digital Project Display for Ground Floor Showroom
 */
function createProjectDisplayTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#070b14';
  ctx.fillRect(0, 0, 512, 256);

  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 2;
  ctx.strokeRect(8, 8, 496, 240);

  ctx.font = '700 24px monospace';
  ctx.fillStyle = '#c084fc';
  ctx.fillText('FEATURED INNOVATION PROJECTS', 28, 48);

  ctx.font = '600 16px "Segoe UI", sans-serif';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('• FLOWSYNC: Real-Time AI Sprint Collaboration', 28, 96);
  ctx.fillText('• ECHO DESKTOP AI: Cross-Platform Co-Pilot', 28, 136);
  ctx.fillText('• TRAQINN VTS: Real-Time GPS Fleet Engine', 28, 176);
  ctx.fillText('• BLE TELEMEDICINE: Vital Telemetry Nodes', 28, 216);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * ProjectsBuilding — Contemporary High-Tech Innovation Center
 * 4 articulated storeys with dark zinc and curtain-wall architecture:
 * - Horizontal aluminum sunshade louvers (brise-soleil fins)
 * - Double-height exhibition showroom with digital project boards behind glass
 * - Eastern entrance facing the main avenue with glass canopy & tension rods
 * - Rooftop mechanical penthouse, solar arrays, and telecom link
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
  const beaconMeshRef = useRef<THREE.Mesh>(null);

  // Textures
  const concreteTex = useMemo(() => getArchitecturalConcreteTexture(), []);
  const curtainGlassTex = useMemo(() => getCurtainWallGlassTexture(), []);
  const showroomGlassTex = useMemo(() => getLobbyShowroomGlassTexture(), []);
  const louversTex = useMemo(() => getArchitecturalLouversTexture(), []);
  const paverTex = useMemo(() => getGranitePaverTexture(), []);
  const signTex = useMemo(() => createArchitecturalProjectsSignTexture(), []);
  const displayTex = useMemo(() => createProjectDisplayTexture(), []);

  // Shared reusable materials
  const materials = useMemo(() => {
    return {
      concreteSlab: new THREE.MeshStandardMaterial({
        map: concreteTex,
        roughness: 0.75,
        metalness: 0.1,
        color: '#e2e8f0',
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
        emissive: '#c084fc',
        emissiveIntensity: 0.16,
      }),
      showroomGlass: new THREE.MeshStandardMaterial({
        map: showroomGlassTex,
        roughness: 0.08,
        metalness: 0.9,
        emissive: '#fde047',
        emissiveIntensity: 0.35,
      }),
      sunshades: new THREE.MeshStandardMaterial({
        color: '#64748b',
        roughness: 0.3,
        metalness: 0.85,
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
        color: '#a855f7',
        roughness: 0.1,
        metalness: 0.2,
        transmission: 0.8,
        transparent: true,
        opacity: 0.8,
      }),
      displayScreen: new THREE.MeshBasicMaterial({
        map: displayTex,
      }),
    };
  }, [concreteTex, curtainGlassTex, showroomGlassTex, louversTex, paverTex, displayTex]);

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
  });

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
      {/* 1. ARCHITECTURAL GRANITE PLAZA & EAST STEPS              */}
      {/* ======================================================== */}
      <mesh position={[0, 0.05, 0]} receiveShadow material={materials.plazaPavers}>
        <boxGeometry args={[7.2, 0.1, 6.6]} />
      </mesh>

      {/* East Steps facing Avenue (X = +halfW) */}
      <group position={[halfW + 0.35, 0.05, 0]}>
        <mesh position={[0, -0.02, 0]} receiveShadow material={materials.plazaPavers}>
          <boxGeometry args={[0.7, 0.06, 3.2]} />
        </mesh>
        <mesh position={[-0.15, 0.02, 0]} receiveShadow material={materials.plazaPavers}>
          <boxGeometry args={[0.5, 0.06, 3.0]} />
        </mesh>
        {/* Step purple LED accent */}
        <mesh position={[0.34, 0.01, 0]}>
          <boxGeometry args={[0.03, 0.02, 3.1]} />
          <meshBasicMaterial color="#a855f7" />
        </mesh>
      </group>

      {/* Planters flanking approach */}
      {[
        [halfW + 0.2, 0.2, 2.2],
        [halfW + 0.2, 0.2, -2.2],
      ].map(([px, py, pz], idx) => (
        <group key={`proj-planter-${idx}`} position={[px, py, pz]}>
          <mesh castShadow receiveShadow material={materials.darkZinc}>
            <boxGeometry args={[0.6, 0.35, 1.2]} />
          </mesh>
          <mesh position={[0, 0.25, 0]} castShadow material={materials.foliage}>
            <boxGeometry args={[0.48, 0.35, 1.05]} />
          </mesh>
        </group>
      ))}

      {/* ======================================================== */}
      {/* 2. GROUND FLOOR: HIGH-TECH EXHIBITION SHOWROOM           */}
      {/* ======================================================== */}
      <group position={[0, 2.0, 0]}>
        {/* Corner Zinc Columns */}
        {[
          [-halfW + 0.25, 0, -halfD + 0.25],
          [halfW - 0.25, 0, -halfD + 0.25],
          [-halfW + 0.25, 0, halfD - 0.25],
          [halfW - 0.25, 0, halfD - 0.25],
        ].map(([cx, cy, cz], idx) => (
          <mesh key={`p-col-${idx}`} position={[cx, cy, cz]} castShadow receiveShadow material={materials.darkZinc}>
            <boxGeometry args={[0.5, 3.8, 0.5]} />
          </mesh>
        ))}

        {/* Double-Height Glass Curtain Showroom */}
        {/* East (Entrance Facade facing Avenue) */}
        <mesh position={[halfW - 0.05, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.showroomGlass}>
          <planeGeometry args={[bD - 0.6, 3.6]} />
        </mesh>
        {/* North */}
        <mesh position={[0, 0, -halfD + 0.05]} rotation={[0, Math.PI, 0]} material={materials.showroomGlass}>
          <planeGeometry args={[bW - 0.6, 3.6]} />
        </mesh>
        {/* South */}
        <mesh position={[0, 0, halfD - 0.05]} material={materials.showroomGlass}>
          <planeGeometry args={[bW - 0.6, 3.6]} />
        </mesh>
        {/* West */}
        <mesh position={[-halfW + 0.05, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={materials.showroomGlass}>
          <planeGeometry args={[bD - 0.6, 3.6]} />
        </mesh>

        {/* Interior Digital Project Showcase Display Board */}
        <mesh position={[-0.8, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.displayScreen}>
          <planeGeometry args={[2.8, 1.4]} />
        </mesh>

        {/* East Entrance Glass Double Doors */}
        <group position={[halfW + 0.02, -0.65, 0]}>
          <mesh castShadow material={materials.darkZinc}>
            <boxGeometry args={[0.08, 2.3, 2.0]} />
          </mesh>
          <mesh position={[0, 0, -0.48]} material={materials.showroomGlass}>
            <boxGeometry args={[0.04, 2.15, 0.88]} />
          </mesh>
          <mesh position={[0, 0, 0.48]} material={materials.showroomGlass}>
            <boxGeometry args={[0.04, 2.15, 0.88]} />
          </mesh>
          <mesh position={[0.04, 0, -0.06]} material={materials.steelRod}>
            <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
          </mesh>
          <mesh position={[0.04, 0, 0.06]} material={materials.steelRod}>
            <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
          </mesh>
        </group>

        {/* Cantilevered Glass & Steel Entrance Canopy */}
        <group position={[halfW + 0.8, 0.8, 0]}>
          <mesh castShadow receiveShadow material={materials.canopyGlass}>
            <boxGeometry args={[1.5, 0.08, 2.8]} />
          </mesh>
          <mesh castShadow material={materials.darkZinc}>
            <boxGeometry args={[1.54, 0.1, 2.84]} />
          </mesh>
          {/* Tension Rods */}
          {[-1.2, 1.2].map((rz, idx) => (
            <mesh
              key={`proj-tension-${idx}`}
              position={[-0.55, 0.7, rz]}
              rotation={[0, 0, Math.PI / 6]}
              material={materials.steelRod}
            >
              <cylinderGeometry args={[0.018, 0.018, 1.6, 8]} />
            </mesh>
          ))}
          {/* Signboard above Canopy */}
          <mesh position={[0.76, 0.25, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[2.6, 0.55]} />
            <meshBasicMaterial map={signTex} transparent />
          </mesh>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 3. STOREYS 2 THROUGH 4: CURTAIN WALL WITH BRISE-SOLEIL   */}
      {/* ======================================================== */}
      {[
        { floor: 2, yBase: 3.9, height: 2.3 },
        { floor: 3, yBase: 6.2, height: 2.3 },
        { floor: 4, yBase: 8.5, height: 2.3 },
      ].map(({ floor, yBase, height }) => {
        const slabY = yBase + 0.1;
        const windowY = yBase + 0.2 + (height - 0.4) / 2;
        const windowH = height - 0.4;

        return (
          <group key={`proj-level-${floor}`}>
            {/* Horizontal Projecting Slab */}
            <mesh position={[0, slabY, 0]} castShadow receiveShadow material={materials.concreteSlab}>
              <boxGeometry args={[bW + 0.3, 0.22, bD + 0.3]} />
            </mesh>

            {/* Recessed Curtain Wall Glazing */}
            <mesh position={[halfW - 0.02, windowY, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.curtainGlass}>
              <planeGeometry args={[bD - 0.2, windowH]} />
            </mesh>
            <mesh position={[-halfW + 0.02, windowY, 0]} rotation={[0, -Math.PI / 2, 0]} material={materials.curtainGlass}>
              <planeGeometry args={[bD - 0.2, windowH]} />
            </mesh>
            <mesh position={[0, windowY, halfD - 0.02]} material={materials.curtainGlass}>
              <planeGeometry args={[bW - 0.2, windowH]} />
            </mesh>
            <mesh position={[0, windowY, -halfD + 0.02]} rotation={[0, Math.PI, 0]} material={materials.curtainGlass}>
              <planeGeometry args={[bW - 0.2, windowH]} />
            </mesh>

            {/* Horizontal Brise-Soleil Architectural Sunshade Blades */}
            {[-0.4, 0.4].map((sy, idx) => (
              <React.Fragment key={`sunshade-${floor}-${idx}`}>
                <mesh position={[0, windowY + sy, halfD + 0.15]} castShadow material={materials.sunshades}>
                  <boxGeometry args={[bW + 0.1, 0.04, 0.25]} />
                </mesh>
                <mesh position={[0, windowY + sy, -halfD - 0.15]} castShadow material={materials.sunshades}>
                  <boxGeometry args={[bW + 0.1, 0.04, 0.25]} />
                </mesh>
              </React.Fragment>
            ))}
          </group>
        );
      })}

      {/* ======================================================== */}
      {/* 4. ROOFTOP MECHANICAL EQUIPMENT & SOLAR ARRAYS           */}
      {/* ======================================================== */}
      <group position={[0, 10.9, 0]}>
        {/* Roof Slab */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow material={materials.concreteSlab}>
          <boxGeometry args={[bW + 0.3, 0.2, bD + 0.3]} />
        </mesh>

        {/* Louvered Mechanical Enclosure */}
        <mesh position={[-1.2, 0.7, 0]} castShadow receiveShadow material={materials.louvers}>
          <boxGeometry args={[2.0, 1.4, 2.4]} />
        </mesh>
        <mesh position={[-1.2, 1.45, 0]} material={materials.concreteSlab}>
          <boxGeometry args={[2.2, 0.12, 2.6]} />
        </mesh>

        {/* Dual Industrial HVAC Units */}
        <group position={[1.4, 0.4, -0.4]}>
          <mesh castShadow receiveShadow material={materials.darkZinc}>
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

        {/* Rooftop Parapet Railing */}
        {[-halfW - 0.1, halfW + 0.1].map((rx, idx) => (
          <mesh key={`proj-rail-${idx}`} position={[rx, 0.45, 0]} material={materials.steelRod}>
            <boxGeometry args={[0.04, 0.9, bD]} />
          </mesh>
        ))}

        {/* Spire & Aviation Beacon */}
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
          position={[3.5, 3.0, 0]}
          color="#a855f7"
          intensity={isSelected ? 3.0 : 1.8}
          distance={8.0}
          decay={2}
        />
      )}
    </group>
  );
};

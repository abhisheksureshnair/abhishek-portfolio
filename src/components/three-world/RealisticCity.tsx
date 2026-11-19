'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { HeroBuilding } from './HeroBuilding';
import { AboutBuilding } from './AboutBuilding';
import { ProjectsBuilding } from './ProjectsBuilding';
import { SkillsBuilding } from './SkillsBuilding';
import { ExperienceBuilding } from './ExperienceBuilding';
import { ContactBuilding } from './ContactBuilding';
import { CityAvatarController } from './CityAvatarController';
import { SelectedBuildingType } from './CityCameraController';
import { TimeOfDay } from './AtmosphericWeatherSystem';
import { usePerformanceQuality } from '../PerformanceControl';

// Upgraded Realistic City Modules
import { RealisticStreets } from './RealisticStreets';
import { RealisticNature } from './RealisticNature';
import { RealisticAvatar, AmbientPedestrians } from './RealisticAvatar';
import { RealisticTraffic } from './RealisticTraffic';
import { RealisticTrafficSignals } from './RealisticTrafficSignals';
import { CityPlazaFountain } from './CityPlazaFountain';
import {
  getArchitecturalConcreteTexture,
  getCurtainWallGlassTexture,
  getFlutedStoneTexture,
  getArchitecturalLouversTexture,
  getGranitePaverTexture,
  getArchitecturalWoodTexture,
  getUrbanAsphaltDetailedTexture,
  getMulchSoilTexture,
} from './architecturalTextures';

interface RealisticCityProps {
  visible?: boolean;
  timeOfDay?: TimeOfDay;
  selectedBuilding: SelectedBuildingType;
  onSelectBuilding: (bId: SelectedBuildingType) => void;
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  rotationRef: React.MutableRefObject<number>;
  quaternionRef: React.MutableRefObject<THREE.Quaternion>;
  currentSpeedRef: React.MutableRefObject<number>;
  isMovingRef: React.MutableRefObject<boolean>;
  keysPressedRef: React.MutableRefObject<Record<string, boolean>>;
  targetWalkPosRef: React.MutableRefObject<THREE.Vector3 | null>;
  onGroundClick?: (point: THREE.Vector3) => void;
}

/**
 * Waterfront Canal & Hardwood Boardwalk Promenade
 */
function CityWaterCanal() {
  const waterMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#0891b2',
      transmission: 0.65,
      opacity: 0.95,
      transparent: true,
      roughness: 0.08,
      metalness: 0.85,
      ior: 1.33,
    });
  }, []);

  const woodDeckTex = useMemo(() => getArchitecturalWoodTexture(), []);

  return (
    <group position={[-28, 0.45, 0]}>
      {/* Reflective Water Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={waterMaterial}>
        <planeGeometry args={[14, 64]} />
      </mesh>

      {/* Granite Ashlar Canal Retaining Wall */}
      <mesh position={[7.1, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.58, 64]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>

      {/* Raised Teak Wood Boardwalk Promenade Platform (Y = 0.74m) */}
      <mesh position={[8.35, 0.29, 0]} receiveShadow>
        <boxGeometry args={[2.4, 0.04, 64]} />
        <meshStandardMaterial map={woodDeckTex} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Stainless Steel Cable Safety Railing (posts and handrail) */}
      <group position={[7.15, 0.65, 0]}>
        <mesh>
          <boxGeometry args={[0.04, 0.88, 64]} />
          <meshPhysicalMaterial
            color="#e0f2fe"
            transmission={0.85}
            roughness={0.08}
            transparent
            opacity={0.65}
          />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[0.06, 0.04, 64.1]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.95} />
        </mesh>
      </group>

      {/* Waterfront Viewing Benches */}
      {[-20, -7, 7, 20].map((bz, idx) => (
        <group key={`canal-bench-${idx}`} position={[8.4, 0.31, bz]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh position={[0, 0.42, 0]} castShadow>
            <boxGeometry args={[1.6, 0.05, 0.45]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.62, -0.2]} castShadow>
            <boxGeometry args={[1.6, 0.25, 0.05]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
          <mesh position={[-0.7, 0.21, 0]}>
            <boxGeometry args={[0.08, 0.42, 0.42]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
          <mesh position={[0.7, 0.21, 0]}>
            <boxGeometry args={[0.08, 0.42, 0.42]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Expanded High-Rise Modern Glass & Steel Skyscraper Skyline & Distant Urban Depth
 * Multi-tier setbacks, articulated floor slabs, vertical structural mullions,
 * mechanical penthouses, and distant background metropolitan blocks.
 */
function CityExpandedSkyline({ timeOfDay }: { timeOfDay: TimeOfDay }) {
  const isNight = timeOfDay === 'night';
  const concreteTex = useMemo(() => getArchitecturalConcreteTexture(), []);
  const curtainGlassTex = useMemo(() => getCurtainWallGlassTexture(), []);
  const flutedStoneTex = useMemo(() => getFlutedStoneTexture(), []);
  const louversTex = useMemo(() => getArchitecturalLouversTexture(), []);

  // Shared reusable materials
  const skylineMaterials = useMemo(() => {
    return {
      concrete: new THREE.MeshStandardMaterial({
        map: concreteTex,
        roughness: 0.75,
        metalness: 0.1,
        color: '#cbd5e1',
      }),
      flutedStone: new THREE.MeshStandardMaterial({
        map: flutedStoneTex,
        roughness: 0.65,
        metalness: 0.15,
      }),
      darkSteel: new THREE.MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.35,
        metalness: 0.7,
      }),
      curtainGlass: new THREE.MeshStandardMaterial({
        map: curtainGlassTex,
        roughness: 0.1,
        metalness: 0.88,
        emissive: '#fde047',
        emissiveIntensity: isNight ? 0.45 : 0.08,
      }),
      louvers: new THREE.MeshStandardMaterial({
        map: louversTex,
        roughness: 0.5,
        metalness: 0.6,
      }),
      beacon: new THREE.MeshBasicMaterial({ color: '#ef4444' }),
      antennaSteel: new THREE.MeshStandardMaterial({
        color: '#94a3b8',
        metalness: 0.95,
        roughness: 0.15,
      }),
    };
  }, [concreteTex, curtainGlassTex, flutedStoneTex, louversTex, isNight]);

  // Primary 10 Perimeter Architectural Skyscrapers (Radius ~30m - 38m)
  const primaryTowers = useMemo(() => {
    return [
      // North skyline (Financial Hub)
      { x: -16, z: -32, w: 9, d: 8, h: 38, style: 'stepped', primaryMat: 'concrete' },
      { x: 16, z: -32, w: 10, d: 9, h: 46, style: 'supertall', primaryMat: 'darkSteel' },
      { x: 28, z: -26, w: 8, d: 8, h: 34, style: 'fluted', primaryMat: 'flutedStone' },
      // East skyline (Tech Park)
      { x: 32, z: -12, w: 8, d: 9, h: 40, style: 'stepped', primaryMat: 'darkSteel' },
      { x: 32, z: 8, w: 9, d: 8, h: 36, style: 'fluted', primaryMat: 'flutedStone' },
      { x: 28, z: 26, w: 9, d: 9, h: 42, style: 'supertall', primaryMat: 'concrete' },
      // South skyline (Commercial Core)
      { x: 16, z: 32, w: 8, d: 8, h: 32, style: 'stepped', primaryMat: 'concrete' },
      { x: -16, z: 32, w: 9, d: 9, h: 36, style: 'supertall', primaryMat: 'darkSteel' },
      // West skyline behind waterfront
      { x: -38, z: -14, w: 8, d: 8, h: 30, style: 'fluted', primaryMat: 'concrete' },
      { x: -38, z: 14, w: 8, d: 8, h: 34, style: 'stepped', primaryMat: 'flutedStone' },
    ];
  }, []);

  // Distant Background Metropolitan Blocks (Radius ~55m - 85m)
  // Provides immense skyline depth and unbroken urban horizon
  const distantBlocks = useMemo(() => {
    return [
      { x: -55, z: -45, w: 14, d: 12, h: 32 },
      { x: 55, z: -45, w: 12, d: 14, h: 36 },
      { x: -55, z: 45, w: 12, d: 12, h: 28 },
      { x: 55, z: 45, w: 14, d: 12, h: 34 },
      { x: 0, z: -68, w: 18, d: 14, h: 44 },
      { x: 0, z: 68, w: 16, d: 14, h: 38 },
      { x: -72, z: 0, w: 14, d: 18, h: 35 },
      { x: 72, z: 0, w: 14, d: 16, h: 42 },
      { x: -45, z: -70, w: 12, d: 12, h: 30 },
      { x: 45, z: -70, w: 14, d: 12, h: 38 },
      { x: -45, z: 70, w: 12, d: 14, h: 26 },
      { x: 45, z: 70, w: 14, d: 12, h: 32 },
    ];
  }, []);

  return (
    <group name="CityExpandedSkyline">
      {/* 1. Primary Perimeter Skyscraper Towers */}
      {primaryTowers.map((tower, idx) => {
        const podH = tower.h * 0.22;
        const shaftH = tower.h * 0.6;
        const crownH = tower.h * 0.18;
        const mat =
          tower.primaryMat === 'flutedStone'
            ? skylineMaterials.flutedStone
            : tower.primaryMat === 'concrete'
            ? skylineMaterials.concrete
            : skylineMaterials.darkSteel;

        return (
          <group key={`pri-tower-${idx}`} position={[tower.x, 0.74, tower.z]}>
            {/* Podium */}
            <mesh position={[0, podH / 2, 0]} castShadow receiveShadow material={mat}>
              <boxGeometry args={[tower.w + 0.6, podH, tower.d + 0.6]} />
            </mesh>
            <mesh position={[0, podH + 0.1, 0]} material={skylineMaterials.concrete}>
              <boxGeometry args={[tower.w + 0.9, 0.2, tower.d + 0.9]} />
            </mesh>

            {/* Shaft with 4-Sided Glass Curtain Wall */}
            <group position={[0, podH + shaftH / 2, 0]}>
              <mesh castShadow receiveShadow material={skylineMaterials.darkSteel}>
                <boxGeometry args={[tower.w, shaftH, tower.d]} />
              </mesh>
              <mesh position={[0, 0, tower.d / 2 + 0.05]} material={skylineMaterials.curtainGlass}>
                <planeGeometry args={[tower.w * 0.92, shaftH * 0.96]} />
              </mesh>
              <mesh position={[0, 0, -tower.d / 2 - 0.05]} rotation={[0, Math.PI, 0]} material={skylineMaterials.curtainGlass}>
                <planeGeometry args={[tower.w * 0.92, shaftH * 0.96]} />
              </mesh>
              <mesh position={[-tower.w / 2 - 0.05, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={skylineMaterials.curtainGlass}>
                <planeGeometry args={[tower.d * 0.92, shaftH * 0.96]} />
              </mesh>
              <mesh position={[tower.w / 2 + 0.05, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={skylineMaterials.curtainGlass}>
                <planeGeometry args={[tower.d * 0.92, shaftH * 0.96]} />
              </mesh>

              {/* Vertical Architectural Fin Mullions */}
              {[-tower.w * 0.35, 0, tower.w * 0.35].map((fx, fIdx) => (
                <React.Fragment key={`sky-fin-${idx}-${fIdx}`}>
                  <mesh position={[fx, 0, tower.d / 2 + 0.08]} material={mat}>
                    <boxGeometry args={[0.18, shaftH, 0.12]} />
                  </mesh>
                  <mesh position={[fx, 0, -tower.d / 2 - 0.08]} material={mat}>
                    <boxGeometry args={[0.18, shaftH, 0.12]} />
                  </mesh>
                </React.Fragment>
              ))}
            </group>

            {/* Crown / Setback Penthouse */}
            <group position={[0, podH + shaftH + crownH / 2, 0]}>
              <mesh castShadow receiveShadow material={skylineMaterials.darkSteel}>
                <boxGeometry args={[tower.w * 0.72, crownH, tower.d * 0.72]} />
              </mesh>
              <mesh position={[0, 0, (tower.d * 0.72) / 2 + 0.03]} material={skylineMaterials.curtainGlass}>
                <planeGeometry args={[tower.w * 0.65, crownH * 0.85]} />
              </mesh>
              <mesh position={[0, 0, -(tower.d * 0.72) / 2 - 0.03]} rotation={[0, Math.PI, 0]} material={skylineMaterials.curtainGlass}>
                <planeGeometry args={[tower.w * 0.65, crownH * 0.85]} />
              </mesh>
            </group>

            {/* Mechanical Core & Louvers */}
            <mesh position={[0, tower.h + 1.1, 0]} castShadow material={skylineMaterials.louvers}>
              <boxGeometry args={[tower.w * 0.45, 2.2, tower.d * 0.45]} />
            </mesh>
            <mesh position={[0, tower.h + 2.25, 0]} material={skylineMaterials.concrete}>
              <boxGeometry args={[tower.w * 0.48, 0.15, tower.d * 0.48]} />
            </mesh>

            {/* Cooling Towers */}
            <group position={[tower.w * 0.2, tower.h + 0.8, tower.d * 0.2]}>
              <mesh material={skylineMaterials.darkSteel}>
                <cylinderGeometry args={[0.45, 0.45, 1.2, 12]} />
              </mesh>
            </group>

            {/* Antenna Mast with Flashing Red Beacon */}
            <mesh position={[0, tower.h + 3.8, 0]} material={skylineMaterials.antennaSteel}>
              <cylinderGeometry args={[0.04, 0.1, 3.2, 8]} />
            </mesh>
            <mesh position={[0, tower.h + 5.5, 0]} material={skylineMaterials.beacon}>
              <sphereGeometry args={[0.2, 8, 8]} />
            </mesh>
          </group>
        );
      })}

      {/* 2. Distant Secondary Metropolitan Blocks (Atmospheric Horizon Depth) */}
      {distantBlocks.map((blk, idx) => (
        <group key={`dist-blk-${idx}`} position={[blk.x, 0.74 + blk.h / 2, blk.z]}>
          <mesh castShadow receiveShadow material={skylineMaterials.darkSteel}>
            <boxGeometry args={[blk.w, blk.h, blk.d]} />
          </mesh>
          <mesh position={[0, 0, blk.d / 2 + 0.06]} material={skylineMaterials.curtainGlass}>
            <planeGeometry args={[blk.w * 0.94, blk.h * 0.94]} />
          </mesh>
          <mesh position={[0, 0, -blk.d / 2 - 0.06]} rotation={[0, Math.PI, 0]} material={skylineMaterials.curtainGlass}>
            <planeGeometry args={[blk.w * 0.94, blk.h * 0.94]} />
          </mesh>
          <mesh position={[-blk.w / 2 - 0.06, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={skylineMaterials.curtainGlass}>
            <planeGeometry args={[blk.d * 0.94, blk.h * 0.94]} />
          </mesh>
          <mesh position={[blk.w / 2 + 0.06, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={skylineMaterials.curtainGlass}>
            <planeGeometry args={[blk.d * 0.94, blk.h * 0.94]} />
          </mesh>

          {/* Rooftop Penthouse Cap */}
          <mesh position={[0, blk.h / 2 + 1.2, 0]} material={skylineMaterials.louvers}>
            <boxGeometry args={[blk.w * 0.5, 2.4, blk.d * 0.5]} />
          </mesh>
          <mesh position={[0, blk.h / 2 + 3.0, 0]} material={skylineMaterials.antennaSteel}>
            <cylinderGeometry args={[0.04, 0.08, 2.0, 6]} />
          </mesh>
          <mesh position={[0, blk.h / 2 + 4.1, 0]} material={skylineMaterials.beacon}>
            <sphereGeometry args={[0.2, 8, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export const RealisticCity: React.FC<RealisticCityProps> = ({
  visible = true,
  timeOfDay = 'day',
  selectedBuilding,
  onSelectBuilding,
  playerPosRef,
  rotationRef,
  quaternionRef,
  currentSpeedRef,
  isMovingRef,
  keysPressedRef,
  targetWalkPosRef,
  onGroundClick,
}) => {
  const { effectiveTier } = usePerformanceQuality();

  // PBR Textures
  const urbanAsphaltTex = useMemo(() => getUrbanAsphaltDetailedTexture(), []);
  const concreteTex = useMemo(() => getArchitecturalConcreteTexture(), []);
  const granitePaverTex = useMemo(() => getGranitePaverTexture(), []);
  const mulchSoilTex = useMemo(() => getMulchSoilTexture(), []);

  if (!visible) return null;

  return (
    <group>
      {/* ======================================================== */}
      {/* 1. EXTENDED METROPOLITAN BASE & URBAN LAND-USE PLOTS     */}
      {/* ======================================================== */}

      {/* Continuous Metropolitan Base Apron (260m x 260m) — Eliminates floating island */}
      <mesh
        position={[0, 0.52, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onGroundClick?.(e.point);
        }}
      >
        <planeGeometry args={[260, 260]} />
        <meshStandardMaterial
          map={urbanAsphaltTex}
          roughness={0.88}
          metalness={0.1}
        />
      </mesh>

      {/* Central District Architectural Concrete Subgrade (70m x 70m) */}
      <mesh
        position={[0, 0.58, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onGroundClick?.(e.point);
        }}
      >
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial
          map={concreteTex}
          roughness={0.8}
          metalness={0.12}
        />
      </mesh>

      {/* Structural Foundation Pedestal Rim */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[72, 1.3, 72]} />
        <meshStandardMaterial color="#1e293b" roughness={0.75} />
      </mesh>

      {/* Urban Land-Use Plots & Pedestrian Plazas */}
      {/* NW Plot: Hero HQ Executive Arrival Forecourt */}
      <mesh
        position={[-9.5, 0.73, -9.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onGroundClick?.(e.point);
        }}
      >
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial map={granitePaverTex} roughness={0.75} />
      </mesh>

      {/* NE Plot: About Me Studio & Civic Fountain Plaza */}
      <mesh
        position={[9.5, 0.73, -9.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onGroundClick?.(e.point);
        }}
      >
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial map={granitePaverTex} roughness={0.75} />
      </mesh>

      {/* SW Plot: Projects Innovation Center & Research Courtyard */}
      <mesh
        position={[-9.5, 0.73, 9.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onGroundClick?.(e.point);
        }}
      >
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial map={granitePaverTex} roughness={0.75} />
      </mesh>

      {/* SE Plot: Skills Tech Tower Arrival Forecourt */}
      <mesh
        position={[9.5, 0.73, 9.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onGroundClick?.(e.point);
        }}
      >
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial map={granitePaverTex} roughness={0.75} />
      </mesh>

      {/* North Plot: Contact Communications Terrace */}
      <mesh
        position={[0, 0.73, -21.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onGroundClick?.(e.point);
        }}
      >
        <planeGeometry args={[12, 11]} />
        <meshStandardMaterial map={granitePaverTex} roughness={0.75} />
      </mesh>

      {/* South Plot: Experience InnSpark Corporate Forecourt */}
      <mesh
        position={[0, 0.73, 21.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onGroundClick?.(e.point);
        }}
      >
        <planeGeometry args={[12, 11]} />
        <meshStandardMaterial map={granitePaverTex} roughness={0.75} />
      </mesh>

      {/* Landscaped Buffer Parks & Organic Mulch Beds (Deliberate Greenery) */}
      {[
        [-17.5, 0.732, -9.5, 3.0, 12],
        [-9.5, 0.732, -17.5, 12, 3.0],
        [17.5, 0.732, -9.5, 3.0, 12],
        [9.5, 0.732, -17.5, 12, 3.0],
        [-17.5, 0.732, 9.5, 3.0, 12],
        [-9.5, 0.732, 17.5, 12, 3.0],
        [17.5, 0.732, 9.5, 3.0, 12],
        [9.5, 0.732, 17.5, 12, 3.0],
      ].map(([px, py, pz, pw, pd], idx) => (
        <group key={`land-buffer-${idx}`} position={[px as number, py as number, pz as number]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[pw as number, pd as number]} />
            <meshStandardMaterial map={mulchSoilTex} roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.04, 0]}>
            <boxGeometry args={[(pw as number) + 0.1, 0.08, (pd as number) + 0.1]} />
            <meshStandardMaterial color="#64748b" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Urban Land-Use Plots & Pedestrian Plazas */}
      {/* NW Plot: Hero HQ Executive Arrival Forecourt */}
      <mesh
        position={[-9.5, 0.73, -9.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onGroundClick?.(e.point);
        }}
      >
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial map={granitePaverTex} roughness={0.75} />
      </mesh>

      {/* NE Plot: About Me Studio & Civic Fountain Plaza */}
      <mesh
        position={[9.5, 0.73, -9.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onGroundClick?.(e.point);
        }}
      >
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial map={granitePaverTex} roughness={0.75} />
      </mesh>

      {/* SW Plot: Projects Innovation Center & Research Courtyard */}
      <mesh
        position={[-9.5, 0.73, 9.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onGroundClick?.(e.point);
        }}
      >
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial map={granitePaverTex} roughness={0.75} />
      </mesh>

      {/* SE Plot: Skills Tech Tower Arrival Forecourt */}
      <mesh
        position={[9.5, 0.73, 9.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onGroundClick?.(e.point);
        }}
      >
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial map={granitePaverTex} roughness={0.75} />
      </mesh>

      {/* North Plot: Contact Communications Terrace */}
      <mesh
        position={[0, 0.73, -21.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onGroundClick?.(e.point);
        }}
      >
        <planeGeometry args={[12, 11]} />
        <meshStandardMaterial map={granitePaverTex} roughness={0.75} />
      </mesh>

      {/* South Plot: Experience InnSpark Corporate Forecourt */}
      <mesh
        position={[0, 0.73, 21.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onGroundClick?.(e.point);
        }}
      >
        <planeGeometry args={[12, 11]} />
        <meshStandardMaterial map={granitePaverTex} roughness={0.75} />
      </mesh>

      {/* Landscaped Buffer Parks & Organic Mulch Beds (Deliberate Greenery) */}
      {[
        [-17.5, 0.732, -9.5, 3.0, 12],
        [-9.5, 0.732, -17.5, 12, 3.0],
        [17.5, 0.732, -9.5, 3.0, 12],
        [9.5, 0.732, -17.5, 12, 3.0],
        [-17.5, 0.732, 9.5, 3.0, 12],
        [-9.5, 0.732, 17.5, 12, 3.0],
        [17.5, 0.732, 9.5, 3.0, 12],
        [9.5, 0.732, 17.5, 12, 3.0],
      ].map(([px, py, pz, pw, pd], idx) => (
        <group key={`land-buffer-${idx}`} position={[px as number, py as number, pz as number]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[pw as number, pd as number]} />
            <meshStandardMaterial map={mulchSoilTex} roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.04, 0]}>
            <boxGeometry args={[(pw as number) + 0.1, 0.08, (pd as number) + 0.1]} />
            <meshStandardMaterial color="#64748b" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* ======================================================== */}
      {/* 2. REALISTIC ASPHALT STREETS, SIDEWALKS & LIGHTING       */}
      {/* ======================================================== */}
      <RealisticStreets timeOfDay={timeOfDay} onRoadClick={onGroundClick} />

      {/* ======================================================== */}
      {/* 3. EXPANDED MODERN SKYSCRAPER SKYLINE                    */}
      {/* ======================================================== */}
      <CityExpandedSkyline timeOfDay={timeOfDay} />

      {/* ======================================================== */}
      {/* 4. WATERFRONT CANAL PROMENADE                            */}
      {/* ======================================================== */}
      <CityWaterCanal />

      {/* ======================================================== */}
      {/* 5. REALISTIC 3D NATURE & LANDSCAPING (Trees & Hedges)    */}
      {/* ======================================================== */}
      <RealisticNature />

      {/* ======================================================== */}
      {/* 6. CIVIC PLAZA ANIMATED FOUNTAIN                         */}
      {/* ======================================================== */}
      <CityPlazaFountain position={[3.85, 0.74, -3.85]} />

      {/* ======================================================== */}
      {/* 7. COINCIDENT 4-CORNER INTERSECTION TRAFFIC SIGNALS      */}
      {/* ======================================================== */}
      <RealisticTrafficSignals timeOfDay={timeOfDay} />

      {/* ======================================================== */}
      {/* 8. REALISTIC TRAFFIC & MOVING VEHICLES                   */}
      {/* ======================================================== */}
      <RealisticTraffic timeOfDay={timeOfDay} playerPosRef={playerPosRef} />

      {/* ======================================================== */}
      {/* 9. AMBIENT SIDEWALK PEDESTRIANS & CROSSWALK AI          */}
      {/* ======================================================== */}
      <AmbientPedestrians playerPosRef={playerPosRef} />

      {/* ======================================================== */}
      {/* 9. AVATAR MOVEMENT CONTROLLER                            */}
      {/* ======================================================== */}
      <CityAvatarController
        playerPosRef={playerPosRef}
        rotationRef={rotationRef}
        quaternionRef={quaternionRef}
        currentSpeedRef={currentSpeedRef}
        isMovingRef={isMovingRef}
        keysPressedRef={keysPressedRef}
        targetWalkPosRef={targetWalkPosRef}
        onSelectBuilding={onSelectBuilding}
        isModalOpen={selectedBuilding !== null}
      />

      {/* ======================================================== */}
      {/* 10. REALISTIC 1.82M HUMAN DEVELOPER AVATAR               */}
      {/* ======================================================== */}
      <RealisticAvatar
        positionRef={playerPosRef}
        rotationRef={rotationRef}
        quaternionRef={quaternionRef}
        currentSpeedRef={currentSpeedRef}
        isMovingRef={isMovingRef}
      />

      {/* ======================================================== */}
      {/* 11. FLAGSHIP INTERACTIVE PORTFOLIO HEADQUARTERS          */}
      {/* ======================================================== */}
      {/* Hero Headquarters: Flagship 4-Floor Architectural Center */}
      <HeroBuilding
        position={[-7.85, 0.74, -7.35]}
        onSelect={() => onSelectBuilding('hero')}
        isSelected={selectedBuilding === 'hero'}
      />

      {/* About Me Studio: Terrace Creative Studio */}
      <AboutBuilding
        position={[7.85, 0.74, -7.35]}
        onSelect={() => onSelectBuilding('about')}
        isSelected={selectedBuilding === 'about'}
      />

      {/* Projects Innovation Center: Glass Exhibition Gallery */}
      <ProjectsBuilding
        position={[-7.85, 0.74, 7.35]}
        onSelect={() => onSelectBuilding('projects')}
        isSelected={selectedBuilding === 'projects'}
      />

      {/* Central Skills Tech Tower: Premium Glass & Steel Skyscraper */}
      <SkillsBuilding
        position={[7.85, 0.74, 7.35]}
        onSelect={() => onSelectBuilding('skills')}
        isSelected={selectedBuilding === 'skills'}
      />

      {/* Experience Office: Corporate Complex */}
      <ExperienceBuilding
        position={[0, 0.74, 21.5]}
        onSelect={() => onSelectBuilding('experience')}
        isSelected={selectedBuilding === 'experience'}
      />

      {/* Contact Hub: Communications Center */}
      <ContactBuilding
        position={[0, 0.74, -21.5]}
        onSelect={() => onSelectBuilding('contact')}
        isSelected={selectedBuilding === 'contact'}
      />
    </group>
  );
};

'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  getOrganicBarkTexture,
  getFoliageAtlasTexture,
  getOrnamentalGrassTexture,
  getPerennialFlowerTexture,
  getCastIronTreeGrateTexture,
  getTreeContactShadowTexture,
  getMulchSoilTexture,
} from './architecturalTextures';

export type TreeSpecies = 'oak' | 'birch' | 'maple';

interface TreeProps {
  position: [number, number, number];
  scale?: number;
  rotationY?: number;
  species?: TreeSpecies;
  hasGrate?: boolean;
}

/**
 * Shared Nature Materials Factory
 * Cached singletons ensuring minimal GPU draw calls, zero texture duplication,
 * and high-performance alpha testing.
 */
function useNatureMaterials() {
  return useMemo(() => {
    // 1. Organic Bark Materials
    const barkOak = new THREE.MeshStandardMaterial({
      map: getOrganicBarkTexture('oak'),
      roughness: 0.88,
      metalness: 0.05,
      color: '#ffffff',
    });
    const barkBirch = new THREE.MeshStandardMaterial({
      map: getOrganicBarkTexture('birch'),
      roughness: 0.82,
      metalness: 0.05,
      color: '#ffffff',
    });
    const barkMaple = new THREE.MeshStandardMaterial({
      map: getOrganicBarkTexture('maple'),
      roughness: 0.85,
      metalness: 0.05,
      color: '#ffffff',
    });

    // 2. Botanical Foliage Card Materials (Alpha Tested for crisp silhouettes & dappled sunlight)
    const foliageOak = new THREE.MeshStandardMaterial({
      map: getFoliageAtlasTexture('oak'),
      alphaTest: 0.35,
      transparent: true,
      side: THREE.DoubleSide,
      roughness: 0.55,
      metalness: 0.02,
      depthWrite: true,
    });
    const foliageBirch = new THREE.MeshStandardMaterial({
      map: getFoliageAtlasTexture('birch'),
      alphaTest: 0.35,
      transparent: true,
      side: THREE.DoubleSide,
      roughness: 0.5,
      metalness: 0.02,
      depthWrite: true,
    });
    const foliageMaple = new THREE.MeshStandardMaterial({
      map: getFoliageAtlasTexture('maple'),
      alphaTest: 0.35,
      transparent: true,
      side: THREE.DoubleSide,
      roughness: 0.55,
      metalness: 0.02,
      depthWrite: true,
    });

    // 3. Ground Flora: Feather Fountain Grass (Pennisetum)
    const ornamentalGrass = new THREE.MeshStandardMaterial({
      map: getOrnamentalGrassTexture(),
      alphaTest: 0.3,
      transparent: true,
      side: THREE.DoubleSide,
      roughness: 0.65,
      metalness: 0.02,
      depthWrite: true,
    });

    // 4. Ground Flora: Perennial Salvia / Lavender Flower Spikes
    const perennialFlower = new THREE.MeshStandardMaterial({
      map: getPerennialFlowerTexture(),
      alphaTest: 0.3,
      transparent: true,
      side: THREE.DoubleSide,
      roughness: 0.6,
      depthWrite: true,
    });

    // 5. Urban Infrastructure: Cast-Iron Slotted Tree Grate
    const treeGrate = new THREE.MeshStandardMaterial({
      map: getCastIronTreeGrateTexture(),
      roughness: 0.5,
      metalness: 0.82,
    });

    // 6. Ground Shadow: Dappled Ambient Occlusion Contact Shadow Disc
    const contactShadow = new THREE.MeshBasicMaterial({
      map: getTreeContactShadowTexture(),
      transparent: true,
      depthWrite: false,
    });

    // 7. Organic Mulch & Humus Soil
    const mulchSoil = new THREE.MeshStandardMaterial({
      map: getMulchSoilTexture(),
      roughness: 0.95,
      metalness: 0.02,
    });

    // 8. River Pebble Drainage Gutters
    const riverPebble = new THREE.MeshStandardMaterial({
      color: '#64748b',
      roughness: 0.7,
      metalness: 0.15,
    });

    // 9. Planter Granite Curb Coping
    const curbStone = new THREE.MeshStandardMaterial({
      color: '#475569',
      roughness: 0.75,
      metalness: 0.15,
    });

    // 10. Manicured Boxwood Hedge
    const boxwoodFoliage = new THREE.MeshStandardMaterial({
      color: '#15803d',
      roughness: 0.75,
      metalness: 0.02,
    });

    return {
      bark: { oak: barkOak, birch: barkBirch, maple: barkMaple },
      foliage: { oak: foliageOak, birch: foliageBirch, maple: foliageMaple },
      ornamentalGrass,
      perennialFlower,
      treeGrate,
      contactShadow,
      mulchSoil,
      riverPebble,
      curbStone,
      boxwoodFoliage,
    };
  }, []);
}

/**
 * Foliage Cross-Plane Cluster
 * Composed of intersecting double-sided alpha-tested planes creating dense,
 * leafy branch tips that let daylight filter through naturally (no spheres!).
 */
function FoliageCluster({
  position,
  scale = 1.6,
  foliageMat,
}: {
  position: [number, number, number];
  scale?: number;
  foliageMat: THREE.Material;
}) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Plane A: Primary vertical plane */}
      <mesh castShadow receiveShadow>
        <planeGeometry args={[1.65, 1.45]} />
        <primitive object={foliageMat} attach="material" />
      </mesh>
      {/* Plane B: 60-degree rotated intersecting plane */}
      <mesh rotation={[0.08, Math.PI / 3, 0.05]} castShadow receiveShadow>
        <planeGeometry args={[1.6, 1.4]} />
        <primitive object={foliageMat} attach="material" />
      </mesh>
      {/* Plane C: 120-degree rotated intersecting plane */}
      <mesh rotation={[-0.06, (Math.PI * 2) / 3, -0.08]} castShadow receiveShadow>
        <planeGeometry args={[1.55, 1.4]} />
        <primitive object={foliageMat} attach="material" />
      </mesh>
      {/* Plane D: Tilted sun-catching canopy dome cap */}
      <mesh rotation={[-Math.PI / 3, 0.35, 0.15]} castShadow receiveShadow>
        <planeGeometry args={[1.4, 1.3]} />
        <primitive object={foliageMat} attach="material" />
      </mesh>
    </group>
  );
}

/**
 * Realistic Botanical 3D Tree
 * Features organic flared root spurs, irregular curved trunk, scaffold branches,
 * multi-cluster alpha-tested foliage cards, subtle wind animation, contact shadow,
 * and optional sidewalk cast-iron tree grate.
 */
function RealisticTree({
  position,
  scale = 1,
  rotationY = 0,
  species = 'oak',
  hasGrate = true,
  materials,
}: TreeProps & { materials: ReturnType<typeof useNatureMaterials> }) {
  const canopyRef = useRef<THREE.Group>(null);
  const scaffoldRef = useRef<THREE.Group>(null);

  const barkMat = materials.bark[species];
  const foliageMat = materials.foliage[species];

  // Botanical dimensions based on species
  const isBirch = species === 'birch';
  const isMaple = species === 'maple';

  const trunkBaseRadius = isBirch ? 0.13 : isMaple ? 0.18 : 0.22;
  const trunkMidRadius = isBirch ? 0.09 : isMaple ? 0.13 : 0.16;
  const trunkTopRadius = isBirch ? 0.065 : isMaple ? 0.09 : 0.11;
  const trunkHeight = isBirch ? 3.2 : isMaple ? 2.5 : 2.7;

  // Gentle procedural wind sway
  useFrame((state) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    const time = state.clock.getElapsedTime() * 1.35 + position[0] * 0.4 + position[2] * 0.3;

    if (canopyRef.current) {
      canopyRef.current.rotation.z = Math.sin(time) * 0.032;
      canopyRef.current.rotation.x = Math.cos(time * 0.85) * 0.022;
    }
    if (scaffoldRef.current) {
      scaffoldRef.current.rotation.z = Math.sin(time * 0.9) * 0.015;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={[scale, scale, scale]}>
      {/* 1. Ambient Dappled Contact Shadow Disc on Pavement (Y = 0.005) */}
      <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.8, 3.8]} />
        <primitive object={materials.contactShadow} attach="material" />
      </mesh>

      {/* 2. Sidewalk Cast-Iron Tree Grate & Mulch Pit */}
      {hasGrate && (
        <group position={[0, 0.01, 0]}>
          {/* Recessed dark mulch soil bed */}
          <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.36, 1.36]} />
            <primitive object={materials.mulchSoil} attach="material" />
          </mesh>
          {/* Slotted Cast-Iron Architectural Tree Grate (1.4m x 1.4m) */}
          <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.4, 1.4]} />
            <primitive object={materials.treeGrate} attach="material" />
          </mesh>
        </group>
      )}

      {/* 3. Flared Basal Root Spurs Spreading into Soil (4 Natural Spurs) */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, rIdx) => (
        <group key={`root-${rIdx}`} rotation={[0, angle + 0.25, 0]}>
          <mesh position={[trunkBaseRadius * 0.9, 0.09, 0]} rotation={[0, 0, -0.68]} castShadow>
            <cylinderGeometry args={[trunkBaseRadius * 0.45, trunkBaseRadius * 0.85, 0.32, 6]} />
            <primitive object={barkMat} attach="material" />
          </mesh>
        </group>
      ))}

      {/* 4. Irregular Curved Tapered Main Trunk */}
      {/* Lower Trunk Section (Y: 0 to 1.3m) with natural subtle lean */}
      <mesh
        position={[0.02, 0.65, 0.01]}
        rotation={[0.035, 0.2, -0.045]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[trunkMidRadius, trunkBaseRadius, 1.3, 8]} />
        <primitive object={barkMat} attach="material" />
      </mesh>

      {/* Mid Trunk Section (Y: 1.3 to 2.5m) with organic counter-curve */}
      <mesh
        position={[0.055, 1.85, -0.015]}
        rotation={[-0.04, 0.4, 0.05]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[trunkTopRadius, trunkMidRadius, trunkHeight - 1.3, 8]} />
        <primitive object={barkMat} attach="material" />
      </mesh>

      {/* 5. Scaffold Branch Structure (Organic 3-Fork Armature) */}
      <group ref={scaffoldRef} position={[0.06, trunkHeight - 0.15, 0]}>
        {/* Scaffold Branch 1 (North-East, 38 deg elevation) */}
        <group rotation={[0.35, 0.25, -0.42]}>
          <mesh position={[0, 0.65, 0]} castShadow>
            <cylinderGeometry args={[trunkTopRadius * 0.55, trunkTopRadius * 0.9, 1.3, 6]} />
            <primitive object={barkMat} attach="material" />
          </mesh>
          <mesh position={[0.12, 1.25, 0]} rotation={[0, 0, -0.45]} castShadow>
            <cylinderGeometry args={[0.03, trunkTopRadius * 0.55, 0.85, 5]} />
            <primitive object={barkMat} attach="material" />
          </mesh>
        </group>

        {/* Scaffold Branch 2 (South-West, 40 deg elevation) */}
        <group rotation={[-0.32, 2.2, 0.38]}>
          <mesh position={[0, 0.62, 0]} castShadow>
            <cylinderGeometry args={[trunkTopRadius * 0.5, trunkTopRadius * 0.85, 1.25, 6]} />
            <primitive object={barkMat} attach="material" />
          </mesh>
          <mesh position={[-0.1, 1.18, 0.06]} rotation={[0.32, 0, 0.42]} castShadow>
            <cylinderGeometry args={[0.028, trunkTopRadius * 0.5, 0.8, 5]} />
            <primitive object={barkMat} attach="material" />
          </mesh>
        </group>

        {/* Scaffold Branch 3 (Central Upper Leader, upright) */}
        <group rotation={[0.18, -1.3, 0.14]}>
          <mesh position={[0, 0.78, 0]} castShadow>
            <cylinderGeometry args={[trunkTopRadius * 0.45, trunkTopRadius * 0.8, 1.55, 6]} />
            <primitive object={barkMat} attach="material" />
          </mesh>
        </group>
      </group>

      {/* 6. Volumetric Multi-Cluster Leaf Canopy (Intersecting Botanical Cards) */}
      <group ref={canopyRef} position={[0.06, trunkHeight + 0.35, 0]}>
        {/* Core Center Crown */}
        <FoliageCluster position={[0, 0.45, 0]} scale={isBirch ? 1.5 : 1.75} foliageMat={foliageMat} />

        {/* High Leader Cluster */}
        <FoliageCluster position={[0.1, 1.35, -0.05]} scale={isBirch ? 1.4 : 1.55} foliageMat={foliageMat} />

        {/* North-East Spreading Canopy */}
        <FoliageCluster position={[0.95, 0.25, -0.4]} scale={isBirch ? 1.35 : 1.6} foliageMat={foliageMat} />

        {/* South-West Spreading Canopy */}
        <FoliageCluster position={[-0.9, 0.15, 0.45]} scale={isBirch ? 1.35 : 1.6} foliageMat={foliageMat} />

        {/* Front Canopy Cluster */}
        <FoliageCluster position={[0.2, -0.05, 0.85]} scale={isBirch ? 1.3 : 1.55} foliageMat={foliageMat} />

        {/* Back Canopy Cluster */}
        <FoliageCluster position={[-0.25, 0.3, -0.85]} scale={isBirch ? 1.3 : 1.55} foliageMat={foliageMat} />

        {/* Lower Lateral Skirt */}
        <FoliageCluster position={[-0.65, -0.4, -0.2]} scale={isBirch ? 1.2 : 1.45} foliageMat={foliageMat} />
        <FoliageCluster position={[0.6, -0.35, 0.3]} scale={isBirch ? 1.2 : 1.45} foliageMat={foliageMat} />
      </group>
    </group>
  );
}

/**
 * Ornamental Feather Fountain Grass (Pennisetum) Clump
 * Softly swaying mounded grass blades with golden feathery plumes.
 */
function OrnamentalGrassTuft({
  position,
  scale = 1,
  materials,
}: {
  position: [number, number, number];
  scale?: number;
  materials: ReturnType<typeof useNatureMaterials>;
}) {
  const grassRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    if (grassRef.current) {
      const t = state.clock.getElapsedTime() * 1.8 + position[0] * 0.7 + position[2] * 0.5;
      grassRef.current.rotation.z = Math.sin(t) * 0.045;
      grassRef.current.rotation.x = Math.cos(t * 0.85) * 0.03;
    }
  });

  return (
    <group ref={grassRef} position={position} scale={[scale, scale, scale]}>
      {/* 3 intersecting fan planes forming a full 3D dome */}
      <mesh position={[0, 0.32, 0]}>
        <planeGeometry args={[0.72, 0.65]} />
        <primitive object={materials.ornamentalGrass} attach="material" />
      </mesh>
      <mesh position={[0, 0.32, 0]} rotation={[0, Math.PI / 3, 0]}>
        <planeGeometry args={[0.7, 0.65]} />
        <primitive object={materials.ornamentalGrass} attach="material" />
      </mesh>
      <mesh position={[0, 0.32, 0]} rotation={[0, (Math.PI * 2) / 3, 0]}>
        <planeGeometry args={[0.7, 0.65]} />
        <primitive object={materials.ornamentalGrass} attach="material" />
      </mesh>
    </group>
  );
}

/**
 * Perennial Salvia / Lavender Flower Cluster
 * Vibrant purple flowering spikes clustered in urban garden beds.
 */
function PerennialFlowerCluster({
  position,
  scale = 1,
  materials,
}: {
  position: [number, number, number];
  scale?: number;
  materials: ReturnType<typeof useNatureMaterials>;
}) {
  const flowerRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    if (flowerRef.current) {
      const t = state.clock.getElapsedTime() * 1.6 + position[0] * 0.6 + position[2] * 0.4;
      flowerRef.current.rotation.z = Math.sin(t) * 0.035;
    }
  });

  return (
    <group ref={flowerRef} position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.3, 0]}>
        <planeGeometry args={[0.62, 0.6]} />
        <primitive object={materials.perennialFlower} attach="material" />
      </mesh>
      <mesh position={[0, 0.3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.62, 0.6]} />
        <primitive object={materials.perennialFlower} attach="material" />
      </mesh>
    </group>
  );
}

/**
 * Curbside Bio-Retention Swale / Linear Rain Garden (Reference Images 1 & 2)
 * High-end urban streetscape feature: granite curb perimeter, dark organic mulch,
 * river pebble drainage gutter, mounded ornamental fountain grasses, and purple flower spikes.
 */
function SidewalkBioSwale({
  position,
  length = 6.4,
  width = 0.9,
  rotationY = 0,
  materials,
}: {
  position: [number, number, number];
  length?: number;
  width?: number;
  rotationY?: number;
  materials: ReturnType<typeof useNatureMaterials>;
}) {
  const grassOffsets = useMemo(() => {
    const list: number[] = [];
    const step = 1.35;
    for (let x = -length / 2 + 0.8; x <= length / 2 - 0.8; x += step) {
      list.push(x);
    }
    return list;
  }, [length]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 1. Beveled Granite Planter Bed Curbs */}
      <mesh position={[0, 0.05, -width / 2]} receiveShadow>
        <boxGeometry args={[length + 0.16, 0.1, 0.12]} />
        <primitive object={materials.curbStone} attach="material" />
      </mesh>
      <mesh position={[0, 0.05, width / 2]} receiveShadow>
        <boxGeometry args={[length + 0.16, 0.1, 0.12]} />
        <primitive object={materials.curbStone} attach="material" />
      </mesh>
      <mesh position={[-length / 2 - 0.02, 0.05, 0]} receiveShadow>
        <boxGeometry args={[0.12, 0.1, width + 0.16]} />
        <primitive object={materials.curbStone} attach="material" />
      </mesh>
      <mesh position={[length / 2 + 0.02, 0.05, 0]} receiveShadow>
        <boxGeometry args={[0.12, 0.1, width + 0.16]} />
        <primitive object={materials.curbStone} attach="material" />
      </mesh>

      {/* 2. Recessed Rich Shredded Bark Mulch Soil Bed */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[length, width]} />
        <primitive object={materials.mulchSoil} attach="material" />
      </mesh>

      {/* 3. River Pebble Drainage Infiltration Gutter along bed center */}
      <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length * 0.92, 0.22]} />
        <primitive object={materials.riverPebble} attach="material" />
      </mesh>

      {/* 4. Alternating Ornamental Grasses & Perennial Flower Clusters */}
      {grassOffsets.map((ox, idx) => (
        <React.Fragment key={`swale-flora-${idx}`}>
          {/* Feather fountain grass tuft */}
          <OrnamentalGrassTuft
            position={[ox, 0.035, (idx % 2 === 0 ? 0.18 : -0.18)]}
            scale={0.95 + (idx % 3) * 0.1}
            materials={materials}
          />
          {/* Lavender / Salvia flower spike cluster */}
          <PerennialFlowerCluster
            position={[ox + 0.55, 0.035, (idx % 2 === 0 ? -0.16 : 0.16)]}
            scale={0.9 + (idx % 2) * 0.15}
            materials={materials}
          />
        </React.Fragment>
      ))}
    </group>
  );
}

/**
 * Contemporary Manicured Boxwood Planter Hedge (Reference Image 1 Style)
 * Crisp chamfered stone planter with dense architectural green hedge.
 */
function ManicuredBoxwoodHedge({
  position,
  width = 3.2,
  rotationY = 0,
  materials,
}: {
  position: [number, number, number];
  width?: number;
  rotationY?: number;
  materials: ReturnType<typeof useNatureMaterials>;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Precast Architectural Stone Planter Box */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.2, 0.36, 0.7]} />
        <primitive object={materials.curbStone} attach="material" />
      </mesh>
      {/* Recessed Soil Rim */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[width, 0.04, 0.5]} />
        <primitive object={materials.mulchSoil} attach="material" />
      </mesh>
      {/* Dense Architectural Boxwood Hedge Form */}
      <mesh position={[0, 0.58, 0]} castShadow>
        <boxGeometry args={[width * 0.96, 0.44, 0.46]} />
        <primitive object={materials.boxwoodFoliage} attach="material" />
      </mesh>
    </group>
  );
}

/**
 * Master Realistic Nature & Urban Greenery System
 * Integrates 3 distinct tree species (Oak, Birch, Maple) in sidewalk tree grates,
 * curbside bio-retention swales, plaza flower gardens, and manicured hedges.
 */
export const RealisticNature: React.FC = () => {
  const materials = useNatureMaterials();

  // 1. Street Trees along primary boulevards (Sidewalk Tree Pits at X = ±5.8m & Z = ±5.8m, Y = 0.74m)
  const streetTrees = useMemo(() => {
    return [
      // North-South Boulevard West Sidewalk (X = -5.8m)
      { pos: [-5.8, 0.74, -22] as [number, number, number], s: 1.08, r: 0.3, sp: 'oak' as const },
      { pos: [-5.8, 0.74, -16] as [number, number, number], s: 1.0, r: 1.2, sp: 'birch' as const },
      { pos: [-5.8, 0.74, -10] as [number, number, number], s: 1.05, r: 2.1, sp: 'maple' as const },
      { pos: [-5.8, 0.74, 10] as [number, number, number], s: 1.02, r: 0.8, sp: 'birch' as const },
      { pos: [-5.8, 0.74, 16] as [number, number, number], s: 1.1, r: 2.7, sp: 'oak' as const },
      { pos: [-5.8, 0.74, 22] as [number, number, number], s: 1.05, r: 1.5, sp: 'maple' as const },

      // North-South Boulevard East Sidewalk (X = +5.8m)
      { pos: [5.8, 0.74, -22] as [number, number, number], s: 1.06, r: 1.1, sp: 'maple' as const },
      { pos: [5.8, 0.74, -16] as [number, number, number], s: 1.05, r: 2.4, sp: 'oak' as const },
      { pos: [5.8, 0.74, -10] as [number, number, number], s: 0.98, r: 0.5, sp: 'birch' as const },
      { pos: [5.8, 0.74, 10] as [number, number, number], s: 1.0, r: 1.8, sp: 'oak' as const },
      { pos: [5.8, 0.74, 16] as [number, number, number], s: 1.05, r: 0.9, sp: 'birch' as const },
      { pos: [5.8, 0.74, 22] as [number, number, number], s: 1.1, r: 2.9, sp: 'oak' as const },

      // East-West Cross Boulevard North Sidewalk (Z = -5.8m)
      { pos: [-22, 0.74, -5.8] as [number, number, number], s: 1.04, r: 0.7, sp: 'oak' as const },
      { pos: [-16, 0.74, -5.8] as [number, number, number], s: 1.1, r: 1.9, sp: 'maple' as const },
      { pos: [-10, 0.74, -5.8] as [number, number, number], s: 0.98, r: 2.8, sp: 'birch' as const },
      { pos: [10, 0.74, -5.8] as [number, number, number], s: 1.02, r: 0.4, sp: 'oak' as const },
      { pos: [16, 0.74, -5.8] as [number, number, number], s: 1.0, r: 1.6, sp: 'birch' as const },
      { pos: [22, 0.74, -5.8] as [number, number, number], s: 1.08, r: 2.3, sp: 'maple' as const },

      // East-West Cross Boulevard South Sidewalk (Z = +5.8m)
      { pos: [-22, 0.74, 5.8] as [number, number, number], s: 1.0, r: 1.4, sp: 'birch' as const },
      { pos: [-16, 0.74, 5.8] as [number, number, number], s: 1.06, r: 2.5, sp: 'oak' as const },
      { pos: [-10, 0.74, 5.8] as [number, number, number], s: 1.02, r: 0.2, sp: 'maple' as const },
      { pos: [10, 0.74, 5.8] as [number, number, number], s: 1.05, r: 1.7, sp: 'maple' as const },
      { pos: [16, 0.74, 5.8] as [number, number, number], s: 1.0, r: 2.9, sp: 'oak' as const },
      { pos: [22, 0.74, 5.8] as [number, number, number], s: 1.04, r: 0.6, sp: 'birch' as const },

      // Civic Plaza & Pocket Park Specimen Trees
      { pos: [1.8, 0.74, -1.8] as [number, number, number], s: 1.15, r: 0.8, sp: 'maple' as const },
      { pos: [6.2, 0.74, -6.2] as [number, number, number], s: 1.1, r: 2.2, sp: 'birch' as const },
      { pos: [-14, 0.74, 14] as [number, number, number], s: 1.25, r: 1.1, sp: 'oak' as const },
      { pos: [14, 0.74, 14] as [number, number, number], s: 1.18, r: 2.0, sp: 'maple' as const },
      { pos: [-14, 0.74, -14] as [number, number, number], s: 1.1, r: 0.5, sp: 'birch' as const },
      { pos: [14, 0.74, -14] as [number, number, number], s: 1.12, r: 1.8, sp: 'oak' as const },

      // Waterfront Promenade Avenue Trees (X = -19.6m)
      { pos: [-19.6, 0.74, -16] as [number, number, number], s: 1.05, r: 1.3, sp: 'birch' as const },
      { pos: [-19.6, 0.74, 0] as [number, number, number], s: 1.12, r: 2.6, sp: 'oak' as const },
      { pos: [-19.6, 0.74, 16] as [number, number, number], s: 1.06, r: 0.4, sp: 'birch' as const },
    ];
  }, []);

  // 2. Curbside Bio-Retention Swale Planters (along boulevard sidewalk curbs)
  const bioSwales = useMemo(() => {
    return [
      { pos: [-4.95, 0.74, -16] as [number, number, number], len: 6.2, rot: 0 },
      { pos: [-4.95, 0.74, 16] as [number, number, number], len: 6.2, rot: 0 },
      { pos: [4.95, 0.74, -16] as [number, number, number], len: 6.2, rot: 0 },
      { pos: [4.95, 0.74, 16] as [number, number, number], len: 6.2, rot: 0 },
      { pos: [-16, 0.74, -4.95] as [number, number, number], len: 6.2, rot: Math.PI / 2 },
      { pos: [16, 0.74, -4.95] as [number, number, number], len: 6.2, rot: Math.PI / 2 },
      { pos: [-16, 0.74, 4.95] as [number, number, number], len: 6.2, rot: Math.PI / 2 },
      { pos: [16, 0.74, 4.95] as [number, number, number], len: 6.2, rot: Math.PI / 2 },
    ];
  }, []);

  // 3. Manicured Boxwood Planter Hedges
  const hedges = useMemo(() => {
    return [
      { pos: [-7.85, 0.74, -4.5] as [number, number, number], w: 3.2, rot: 0 },
      { pos: [7.85, 0.74, -4.5] as [number, number, number], w: 3.2, rot: 0 },
      { pos: [-7.85, 0.74, 4.5] as [number, number, number], w: 3.2, rot: 0 },
      { pos: [7.85, 0.74, 4.5] as [number, number, number], w: 3.2, rot: 0 },
      { pos: [-14.5, 0.74, 0] as [number, number, number], w: 2.8, rot: Math.PI / 2 },
      { pos: [14.5, 0.74, 0] as [number, number, number], w: 2.8, rot: Math.PI / 2 },
    ];
  }, []);

  // 4. Civic Plaza & Courtyard Floral Clusters
  const plazaFlora = useMemo(() => {
    return [
      // Around Civic Fountain Basin (3.85, 0.74, -3.85)
      { pos: [2.5, 0.74, -3.85] as [number, number, number], type: 'grass' as const, s: 1.1 },
      { pos: [5.2, 0.74, -3.85] as [number, number, number], type: 'flower' as const, s: 1.05 },
      { pos: [3.85, 0.74, -2.5] as [number, number, number], type: 'grass' as const, s: 1.15 },
      { pos: [3.85, 0.74, -5.2] as [number, number, number], type: 'flower' as const, s: 1.1 },

      // Hero Building Arrival Forecourt
      { pos: [-9.5, 0.74, -7.5] as [number, number, number], type: 'grass' as const, s: 1.0 },
      { pos: [-9.5, 0.74, -11.5] as [number, number, number], type: 'flower' as const, s: 1.0 },

      // About Building Arrival Forecourt
      { pos: [9.5, 0.74, -7.5] as [number, number, number], type: 'flower' as const, s: 1.0 },
      { pos: [9.5, 0.74, -11.5] as [number, number, number], type: 'grass' as const, s: 1.0 },

      // Skills Tech Tower Courtyard
      { pos: [7.8, 0.74, 9.5] as [number, number, number], type: 'grass' as const, s: 1.1 },
      { pos: [11.2, 0.74, 9.5] as [number, number, number], type: 'flower' as const, s: 1.1 },
    ];
  }, []);

  return (
    <group name="RealisticUrbanNature">
      {/* 1. Botanical 3D Trees (Oak, Birch, Maple) */}
      {streetTrees.map((tree, i) => (
        <RealisticTree
          key={`tree-${i}`}
          position={tree.pos}
          scale={tree.s}
          rotationY={tree.r}
          species={tree.sp}
          hasGrate={true}
          materials={materials}
        />
      ))}

      {/* 2. Curbside Bio-Retention Swale Planters with Fountain Grass & Flowers */}
      {bioSwales.map((swale, i) => (
        <SidewalkBioSwale
          key={`swale-${i}`}
          position={swale.pos}
          length={swale.len}
          rotationY={swale.rot}
          materials={materials}
        />
      ))}

      {/* 3. Manicured Boxwood Planter Hedges */}
      {hedges.map((hedge, i) => (
        <ManicuredBoxwoodHedge
          key={`hedge-${i}`}
          position={hedge.pos}
          width={hedge.w}
          rotationY={hedge.rot}
          materials={materials}
        />
      ))}

      {/* 4. Civic Plaza Accent Grasses & Lavender Flowers */}
      {plazaFlora.map((flora, i) =>
        flora.type === 'grass' ? (
          <OrnamentalGrassTuft
            key={`plaza-flora-${i}`}
            position={flora.pos}
            scale={flora.s}
            materials={materials}
          />
        ) : (
          <PerennialFlowerCluster
            key={`plaza-flora-${i}`}
            position={flora.pos}
            scale={flora.s}
            materials={materials}
          />
        )
      )}
    </group>
  );
};

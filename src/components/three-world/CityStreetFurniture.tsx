'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePerformanceQuality } from '../PerformanceControl';
import { CompleteVehicle } from './CityVehicles';
import { getTrafficSignalState } from './CityTrafficSignals';

/**
 * Procedural Texture for Directional Street Signs
 */
function createDirectionalSignTexture(direction: string, destination: string): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document?.createElement('canvas') as any);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 128);

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 5;
  ctx.strokeRect(5, 5, 502, 118);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  ctx.font = 'bold 44px system-ui, sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(direction, 24, 64);

  ctx.font = 'bold 32px system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(destination, 90, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// ========================================================
// SHARED STATIC GEOMETRIES & MATERIALS (Zero GPU Heap Duplication)
// ========================================================
const _treeTrunkGeo = new THREE.CylinderGeometry(0.1, 0.16, 1.2, 6);
const _treeTrunkMat = new THREE.MeshStandardMaterial({ color: '#643b1e', roughness: 0.8 });

const _coneGeo1 = new THREE.ConeGeometry(0.8, 1.1, 7);
const _coneGeo2 = new THREE.ConeGeometry(0.62, 0.95, 7);
const _coneGeo3 = new THREE.ConeGeometry(0.42, 0.75, 7);

const _leafMatDark = new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.55 });
const _leafMatMid = new THREE.MeshStandardMaterial({ color: '#22c55e', roughness: 0.5 });
const _leafMatLight = new THREE.MeshStandardMaterial({ color: '#4ade80', roughness: 0.45 });

const _dodecGeo1 = new THREE.DodecahedronGeometry(0.75, 0);
const _dodecGeo2 = new THREE.DodecahedronGeometry(0.5, 0);
const _dodecMatDark = new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.55 });
const _dodecMatMid = new THREE.MeshStandardMaterial({ color: '#22c55e', roughness: 0.5 });

const _bushGeo1 = new THREE.DodecahedronGeometry(0.35, 0);
const _bushGeo2 = new THREE.DodecahedronGeometry(0.26, 0);

// Streetlights shared assets
const _lightBaseGeo = new THREE.CylinderGeometry(0.16, 0.2, 0.16, 8);
const _lightMastGeo = new THREE.CylinderGeometry(0.05, 0.07, 3.2, 8);
const _lightArmGeo = new THREE.BoxGeometry(0.9, 0.05, 0.08);
const _lightHeadGeo = new THREE.BoxGeometry(0.4, 0.08, 0.18);
const _lightPanelGeo = new THREE.BoxGeometry(0.34, 0.02, 0.14);

const _metalDarkMat = new THREE.MeshStandardMaterial({ color: '#334155', metalness: 0.8, roughness: 0.3 });
const _basePadMat = new THREE.MeshStandardMaterial({ color: '#1e293b', metalness: 0.7 });
const _lampFixtureMat = new THREE.MeshStandardMaterial({ color: '#0f172a', metalness: 0.9 });
const _lampEmissiveMatDay = new THREE.MeshStandardMaterial({ color: '#fffbeb', emissive: '#fef08a', emissiveIntensity: 1.2 });
const _lampEmissiveMatNight = new THREE.MeshStandardMaterial({ color: '#fef08a', emissive: '#fde047', emissiveIntensity: 3.5 });

// Furniture shared assets
const _benchLegGeo = new THREE.BoxGeometry(0.08, 0.44, 0.55);
const _benchSlatGeo = new THREE.BoxGeometry(1.4, 0.04, 0.1);
const _benchWoodMat = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.7 });

const _binBodyGeo = new THREE.CylinderGeometry(0.2, 0.16, 0.7, 10);
const _binLidGeo = new THREE.CylinderGeometry(0.21, 0.21, 0.08, 10);
const _binMat = new THREE.MeshStandardMaterial({ color: '#334155', metalness: 0.6 });

const _planterBoxGeo = new THREE.BoxGeometry(1.2, 0.45, 0.6);
const _planterFoliageGeo = new THREE.BoxGeometry(1.1, 0.25, 0.5);
const _planterBoxMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.5 });
const _planterFoliageMat = new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.65 });

const _flowerGeo = new THREE.DodecahedronGeometry(0.08, 0);
const _flowerRedMat = new THREE.MeshStandardMaterial({ color: '#ef4444', roughness: 0.4 });
const _flowerYellowMat = new THREE.MeshStandardMaterial({ color: '#facc15', roughness: 0.4 });
const _flowerPurpleMat = new THREE.MeshStandardMaterial({ color: '#a855f7', roughness: 0.4 });

const _dummy = new THREE.Object3D();

// Tree configuration data
interface TreeConfig {
  pos: [number, number, number];
  scale: number;
  rot: number;
}

const CONICAL_TREES: TreeConfig[] = [
  { pos: [-3.85, 0.705, -5.5], scale: 1.05, rot: 0.4 },
  { pos: [-5.8, 0.705, -3.85], scale: 1.1, rot: 2.1 },
  { pos: [3.85, 0.705, -9.2], scale: 1.15, rot: 0.3 },
  { pos: [9.8, 0.705, -3.85], scale: 1.05, rot: 1.1 },
  { pos: [-3.85, 0.705, 5.5], scale: 1.1, rot: 0.7 },
  { pos: [-5.8, 0.705, 3.85], scale: 1.0, rot: 2.8 },
  { pos: [3.85, 0.705, 9.2], scale: 1.1, rot: 0.6 },
  { pos: [5.8, 0.705, 3.85], scale: 1.05, rot: 2.0 },
];

const SPHERICAL_TREES: TreeConfig[] = [
  { pos: [-3.85, 0.705, -9.2], scale: 0.9, rot: 1.2 },
  { pos: [-9.8, 0.705, -3.85], scale: 0.95, rot: 0.8 },
  { pos: [3.85, 0.705, -5.5], scale: 1.0, rot: 1.5 },
  { pos: [5.8, 0.705, -3.85], scale: 0.95, rot: 2.4 },
  { pos: [-3.85, 0.705, 9.2], scale: 0.95, rot: 1.9 },
  { pos: [-9.8, 0.705, 3.85], scale: 1.1, rot: 0.2 },
  { pos: [3.85, 0.705, 5.5], scale: 0.95, rot: 1.3 },
  { pos: [9.8, 0.705, 3.85], scale: 0.9, rot: 1.7 },
];

const BUSH_POSITIONS: [number, number, number, number][] = [
  [-3.85, 0.705, -7.3, 1.1],
  [3.85, 0.705, -7.3, 0.95],
  [-3.85, 0.705, 7.3, 1.0],
  [3.85, 0.705, 7.3, 1.15],
];

/**
 * High-Performance Instanced Trees Component (Requirement 3)
 * Consolidates all 16 trees and 4 bushes into 7 InstancedMesh draw calls instead of 64 separate calls!
 */
const InstancedCityFoliage: React.FC<{ enableShadows: boolean }> = ({ enableShadows }) => {
  const { prefersReducedMotion } = usePerformanceQuality();
  const trunksRef = useRef<THREE.InstancedMesh>(null);
  const canopyGroupRef = useRef<THREE.Group>(null);
  const cone1Ref = useRef<THREE.InstancedMesh>(null);
  const cone2Ref = useRef<THREE.InstancedMesh>(null);
  const cone3Ref = useRef<THREE.InstancedMesh>(null);
  const dodec1Ref = useRef<THREE.InstancedMesh>(null);
  const dodec2Ref = useRef<THREE.InstancedMesh>(null);
  const bush1Ref = useRef<THREE.InstancedMesh>(null);
  const bush2Ref = useRef<THREE.InstancedMesh>(null);

  // Gentle, lightweight tree canopy movement (Requirement 4, 10 & 12)
  useFrame(() => {
    if (typeof document !== 'undefined' && document.hidden) return;
    if (prefersReducedMotion || !canopyGroupRef.current) return;

    const time = performance.now() * 0.001;
    canopyGroupRef.current.rotation.z = Math.sin(time * 1.4) * 0.007;
    canopyGroupRef.current.rotation.x = Math.cos(time * 1.1) * 0.005;
  });

  // Initialize instances once on mount
  useEffect(() => {
    // 1. All 16 Trunks
    if (trunksRef.current) {
      let idx = 0;
      for (const t of CONICAL_TREES) {
        _dummy.position.set(t.pos[0], t.pos[1] + 0.6 * t.scale, t.pos[2]);
        _dummy.rotation.set(0, t.rot, 0);
        _dummy.scale.set(t.scale, t.scale, t.scale);
        _dummy.updateMatrix();
        trunksRef.current.setMatrixAt(idx++, _dummy.matrix);
      }
      for (const t of SPHERICAL_TREES) {
        _dummy.position.set(t.pos[0], t.pos[1] + 0.6 * t.scale, t.pos[2]);
        _dummy.rotation.set(0, t.rot, 0);
        _dummy.scale.set(t.scale, t.scale, t.scale);
        _dummy.updateMatrix();
        trunksRef.current.setMatrixAt(idx++, _dummy.matrix);
      }
      trunksRef.current.instanceMatrix.needsUpdate = true;
    }

    // 2. Conical Foliage
    if (cone1Ref.current && cone2Ref.current && cone3Ref.current) {
      for (let i = 0; i < CONICAL_TREES.length; i++) {
        const t = CONICAL_TREES[i];
        const baseY = t.pos[1] + 1.2 * t.scale;

        // Tier 1 (bottom cone)
        _dummy.position.set(t.pos[0], baseY, t.pos[2]);
        _dummy.rotation.set(0, t.rot, 0);
        _dummy.scale.set(t.scale, t.scale, t.scale);
        _dummy.updateMatrix();
        cone1Ref.current.setMatrixAt(i, _dummy.matrix);

        // Tier 2 (middle cone)
        _dummy.position.set(t.pos[0], baseY + 0.6 * t.scale, t.pos[2]);
        _dummy.updateMatrix();
        cone2Ref.current.setMatrixAt(i, _dummy.matrix);

        // Tier 3 (top cone)
        _dummy.position.set(t.pos[0], baseY + 1.15 * t.scale, t.pos[2]);
        _dummy.updateMatrix();
        cone3Ref.current.setMatrixAt(i, _dummy.matrix);
      }
      cone1Ref.current.instanceMatrix.needsUpdate = true;
      cone2Ref.current.instanceMatrix.needsUpdate = true;
      cone3Ref.current.instanceMatrix.needsUpdate = true;
    }

    // 3. Spherical Foliage
    if (dodec1Ref.current && dodec2Ref.current) {
      for (let i = 0; i < SPHERICAL_TREES.length; i++) {
        const t = SPHERICAL_TREES[i];
        const baseY = t.pos[1] + 1.5 * t.scale;

        // Main dodecahedron
        _dummy.position.set(t.pos[0], baseY, t.pos[2]);
        _dummy.rotation.set(0, t.rot, 0);
        _dummy.scale.set(t.scale, t.scale, t.scale);
        _dummy.updateMatrix();
        dodec1Ref.current.setMatrixAt(i, _dummy.matrix);

        // Secondary accent dodecahedron
        _dummy.position.set(t.pos[0] + 0.15 * t.scale, baseY + 0.25 * t.scale, t.pos[2] - 0.1 * t.scale);
        _dummy.updateMatrix();
        dodec2Ref.current.setMatrixAt(i, _dummy.matrix);
      }
      dodec1Ref.current.instanceMatrix.needsUpdate = true;
      dodec2Ref.current.instanceMatrix.needsUpdate = true;
    }

    // 4. Bushes
    if (bush1Ref.current && bush2Ref.current) {
      for (let i = 0; i < BUSH_POSITIONS.length; i++) {
        const [bx, by, bz, bs] = BUSH_POSITIONS[i];
        _dummy.position.set(bx, by + 0.25 * bs, bz);
        _dummy.rotation.set(0, i * 1.1, 0);
        _dummy.scale.set(bs, bs, bs);
        _dummy.updateMatrix();
        bush1Ref.current.setMatrixAt(i, _dummy.matrix);

        _dummy.position.set(bx + 0.15 * bs, by + 0.35 * bs, bz - 0.05 * bs);
        _dummy.updateMatrix();
        bush2Ref.current.setMatrixAt(i, _dummy.matrix);
      }
      bush1Ref.current.instanceMatrix.needsUpdate = true;
      bush2Ref.current.instanceMatrix.needsUpdate = true;
    }
  }, []);

  return (
    <group name="InstancedFoliage">
      {/* 16 Tree Trunks (1 Draw Call) */}
      <instancedMesh
        ref={trunksRef}
        args={[_treeTrunkGeo, _treeTrunkMat, 16]}
        frustumCulled={false}
      />

      {/* Gentle Swaying Tree Canopy Group (Requirement 4) */}
      <group ref={canopyGroupRef}>
        {/* Conical Tree Foliage (3 Draw Calls) */}
        <instancedMesh
          ref={cone1Ref}
          args={[_coneGeo1, _leafMatDark, 8]}
          castShadow={enableShadows}
          frustumCulled={false}
        />
        <instancedMesh
          ref={cone2Ref}
          args={[_coneGeo2, _leafMatMid, 8]}
          castShadow={enableShadows}
          frustumCulled={false}
        />
        <instancedMesh
          ref={cone3Ref}
          args={[_coneGeo3, _leafMatLight, 8]}
          castShadow={enableShadows}
          frustumCulled={false}
        />

        {/* Spherical Tree Foliage (2 Draw Calls) */}
        <instancedMesh
          ref={dodec1Ref}
          args={[_dodecGeo1, _dodecMatDark, 8]}
          castShadow={enableShadows}
          frustumCulled={false}
        />
        <instancedMesh
          ref={dodec2Ref}
          args={[_dodecGeo2, _dodecMatMid, 8]}
          castShadow={enableShadows}
          frustumCulled={false}
        />

        {/* Bushes (2 Draw Calls) */}
        <instancedMesh
          ref={bush1Ref}
          args={[_bushGeo1, _leafMatDark, 4]}
          frustumCulled={false}
        />
        <instancedMesh
          ref={bush2Ref}
          args={[_bushGeo2, _leafMatMid, 4]}
          frustumCulled={false}
        />
      </group>
    </group>
  );
};

/**
 * Modern Streetlight with Shared Geometries
 */
const ModernStreetlight: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  hasLight?: boolean;
  isNight?: boolean;
  allowPointLight?: boolean;
  enableShadows?: boolean;
}> = ({
  position,
  rotationY = 0,
  hasLight = false,
  isNight = false,
  allowPointLight = true,
  enableShadows = false,
}) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    <mesh position={[0, 0.08, 0]} geometry={_lightBaseGeo} material={_basePadMat} />
    <mesh position={[0, 1.7, 0]} castShadow={enableShadows} geometry={_lightMastGeo} material={_metalDarkMat} />
    <mesh position={[0.45, 3.25, 0]} rotation={[0, 0, -0.35]} geometry={_lightArmGeo} material={_metalDarkMat} />
    <mesh position={[0.85, 3.1, 0]} geometry={_lightHeadGeo} material={_lampFixtureMat} />
    <mesh position={[0.85, 3.05, 0]} geometry={_lightPanelGeo} material={isNight ? _lampEmissiveMatNight : _lampEmissiveMatDay} />

    {hasLight && isNight && allowPointLight && (
      <pointLight position={[0.85, 2.8, 0]} color="#fde047" intensity={2.0} distance={7.5} decay={2} />
    )}
  </group>
);

/**
 * Traffic Signal at Major Intersections
 */
// Traffic Signals Shared Static Geometries & Coordinated Dynamic Lenses
const _signalHousingGeo = new THREE.BoxGeometry(0.24, 0.72, 0.24);
const _signalLensGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 8);

const _sigLensRedNS = new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#ef4444', emissiveIntensity: 2.8 });
const _sigLensYellowNS = new THREE.MeshStandardMaterial({ color: '#eab308', emissive: '#eab308', emissiveIntensity: 0.1 });
const _sigLensGreenNS = new THREE.MeshStandardMaterial({ color: '#22c55e', emissive: '#22c55e', emissiveIntensity: 0.1 });

const _sigLensRedEW = new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#ef4444', emissiveIntensity: 0.1 });
const _sigLensYellowEW = new THREE.MeshStandardMaterial({ color: '#eab308', emissive: '#eab308', emissiveIntensity: 0.1 });
const _sigLensGreenEW = new THREE.MeshStandardMaterial({ color: '#22c55e', emissive: '#22c55e', emissiveIntensity: 2.8 });

const TrafficSignal: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  direction?: 'ns' | 'ew';
}> = ({ position, rotationY = 0, direction = 'ns' }) => {
  const isNS = direction === 'ns';
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.1, 0]} geometry={_lightBaseGeo} material={_basePadMat} />
      <mesh position={[0, 1.8, 0]} geometry={_lightMastGeo} material={_basePadMat} />
      <mesh position={[1.2, 3.4, 0]} geometry={_lightArmGeo} material={_basePadMat} />
      <group position={[1.8, 3.0, 0]}>
        <mesh geometry={_signalHousingGeo} material={_lampFixtureMat} />
        <mesh position={[0, 0.22, 0.12]} rotation={[Math.PI / 2, 0, 0]} geometry={_signalLensGeo} material={isNS ? _sigLensRedNS : _sigLensRedEW} />
        <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]} geometry={_signalLensGeo} material={isNS ? _sigLensYellowNS : _sigLensYellowEW} />
        <mesh position={[0, -0.22, 0.12]} rotation={[Math.PI / 2, 0, 0]} geometry={_signalLensGeo} material={isNS ? _sigLensGreenNS : _sigLensGreenEW} />
      </group>
    </group>
  );
};

/**
 * Park Bench with Shared Geometries
 */
const ParkBench: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({ position, rotationY = 0 }) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    <mesh position={[-0.6, 0.22, 0]} geometry={_benchLegGeo} material={_binMat} />
    <mesh position={[0.6, 0.22, 0]} geometry={_benchLegGeo} material={_binMat} />
    <mesh position={[0, 0.44, 0.12]} geometry={_benchSlatGeo} material={_benchWoodMat} />
    <mesh position={[0, 0.44, -0.04]} geometry={_benchSlatGeo} material={_benchWoodMat} />
    <mesh position={[0, 0.44, -0.20]} geometry={_benchSlatGeo} material={_benchWoodMat} />
    <mesh position={[0, 0.72, -0.26]} rotation={[0.15, 0, 0]} geometry={_benchSlatGeo} material={_benchWoodMat} />
  </group>
);

/**
 * Trash Bin with Shared Geometries
 */
const TrashBin: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.35, 0]} geometry={_binBodyGeo} material={_binMat} />
    <mesh position={[0, 0.72, 0]} geometry={_binLidGeo} material={_basePadMat} />
  </group>
);

/**
 * Planter Box with Shared Geometries and Flowering Blooms
 */
const PlanterBox: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({ position, rotationY = 0 }) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    <mesh position={[0, 0.22, 0]} geometry={_planterBoxGeo} material={_planterBoxMat} />
    <mesh position={[0, 0.42, 0]} geometry={_planterFoliageGeo} material={_planterFoliageMat} />
    {/* Stylized colorful flowering blooms */}
    <mesh position={[-0.32, 0.58, 0]} geometry={_flowerGeo} material={_flowerRedMat} />
    <mesh position={[0, 0.60, 0.05]} geometry={_flowerGeo} material={_flowerYellowMat} />
    <mesh position={[0.32, 0.58, -0.04]} geometry={_flowerGeo} material={_flowerPurpleMat} />
  </group>
);

/**
 * Miniature Stylized Fire Hydrant
 */
const FireHydrant: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.18, 0]}>
      <cylinderGeometry args={[0.08, 0.1, 0.36, 8]} />
      <meshStandardMaterial color="#dc2626" roughness={0.35} metalness={0.2} />
    </mesh>
    <mesh position={[0, 0.38, 0]}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshStandardMaterial color="#dc2626" roughness={0.35} metalness={0.2} />
    </mesh>
    <mesh position={[0, 0.24, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.035, 0.035, 0.22, 8]} />
      <meshStandardMaterial color="#991b1b" metalness={0.4} />
    </mesh>
  </group>
);

/**
 * Directional Signpost
 */
const DirectionalSignpost: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  dir1: string;
  dest1: string;
  dir2?: string;
  dest2?: string;
}> = ({ position, rotationY = 0, dir1, dest1, dir2, dest2 }) => {
  const tex1 = useMemo(() => createDirectionalSignTexture(dir1, dest1), [dir1, dest1]);
  const tex2 = useMemo(() => (dir2 && dest2 ? createDirectionalSignTexture(dir2, dest2) : null), [dir2, dest2]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 2.5, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.7} />
      </mesh>
      <mesh position={[0, 2.4, 0]}>
        <boxGeometry args={[1.4, 0.36, 0.06]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 2.4, 0.035]}>
        <planeGeometry args={[1.36, 0.32]} />
        <meshBasicMaterial map={tex1} />
      </mesh>
      {tex2 && (
        <>
          <mesh position={[0, 1.95, 0]}>
            <boxGeometry args={[1.4, 0.36, 0.06]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 1.95, 0.035]}>
            <planeGeometry args={[1.36, 0.32]} />
            <meshBasicMaterial map={tex2} />
          </mesh>
        </>
      )}
    </group>
  );
};

/**
 * CityStreetFurniture Component
 */
export const CityStreetFurniture: React.FC<{ timeOfDay?: 'day' | 'night' }> = ({
  timeOfDay = 'day',
}) => {
  const { effectiveTier } = usePerformanceQuality();
  const isNight = timeOfDay === 'night';
  const enableShadows = effectiveTier !== 'low';
  const allowPointLights = effectiveTier === 'high';

  // Synchronized traffic light phase cycle
  useFrame(() => {
    const timeSec = Date.now() * 0.001;
    const { nsPhase, ewPhase } = getTrafficSignalState(timeSec);

    // North-South signal lens updates
    _sigLensRedNS.emissiveIntensity = nsPhase === 'red' ? 3.0 : 0.15;
    _sigLensYellowNS.emissiveIntensity = nsPhase === 'yellow' ? 3.0 : 0.15;
    _sigLensGreenNS.emissiveIntensity = nsPhase === 'green' ? 3.0 : 0.15;

    // East-West signal lens updates
    _sigLensRedEW.emissiveIntensity = ewPhase === 'red' ? 3.0 : 0.15;
    _sigLensYellowEW.emissiveIntensity = ewPhase === 'yellow' ? 3.0 : 0.15;
    _sigLensGreenEW.emissiveIntensity = ewPhase === 'green' ? 3.0 : 0.15;
  });

  return (
    <group name="CityStreetFurniture">
      {/* 1. INSTANCED TREES & BUSHES (7 Draw Calls instead of 64!) */}
      <InstancedCityFoliage enableShadows={enableShadows} />

      {/* 2. MODERN STREETLIGHTS ALONG SIDEWALKS */}
      <ModernStreetlight position={[-3.25, 0.74, -6.5]} rotationY={Math.PI / 2} hasLight isNight={isNight} allowPointLight={allowPointLights} enableShadows={enableShadows} />
      <ModernStreetlight position={[3.25, 0.74, -6.5]} rotationY={-Math.PI / 2} isNight={isNight} allowPointLight={allowPointLights} enableShadows={enableShadows} />
      <ModernStreetlight position={[-3.25, 0.74, 6.5]} rotationY={Math.PI / 2} isNight={isNight} allowPointLight={allowPointLights} enableShadows={enableShadows} />
      <ModernStreetlight position={[3.25, 0.74, 6.5]} rotationY={-Math.PI / 2} hasLight isNight={isNight} allowPointLight={allowPointLights} enableShadows={enableShadows} />
      <ModernStreetlight position={[-7.5, 0.74, -3.25]} rotationY={0} isNight={isNight} allowPointLight={allowPointLights} enableShadows={enableShadows} />
      <ModernStreetlight position={[7.5, 0.74, -3.25]} rotationY={0} hasLight isNight={isNight} allowPointLight={allowPointLights} enableShadows={enableShadows} />
      <ModernStreetlight position={[-7.5, 0.74, 3.25]} rotationY={Math.PI} hasLight isNight={isNight} allowPointLight={allowPointLights} enableShadows={enableShadows} />
      <ModernStreetlight position={[7.5, 0.74, 3.25]} rotationY={Math.PI} isNight={isNight} allowPointLight={allowPointLights} enableShadows={enableShadows} />

      {/* 3. TRAFFIC SIGNALS AT MAJOR JUNCTIONS (Synchronized with Traffic System) */}
      <TrafficSignal position={[-3.2, 0.74, -3.2]} rotationY={Math.PI / 2} direction="ew" />
      <TrafficSignal position={[3.2, 0.74, -3.2]} rotationY={Math.PI} direction="ns" />
      <TrafficSignal position={[3.2, 0.74, 3.2]} rotationY={-Math.PI / 2} direction="ew" />
      <TrafficSignal position={[-3.2, 0.74, 3.2]} rotationY={0} direction="ns" />
      <TrafficSignal position={[3.2, 0.74, -13.5]} rotationY={-Math.PI / 2} direction="ew" />
      <TrafficSignal position={[-3.2, 0.74, 13.5]} rotationY={Math.PI / 2} direction="ew" />

      {/* 4. PARK BENCHES, TRASH BINS & PLANTER BOXES */}
      <ParkBench position={[-3.2, 0.74, -8.5]} rotationY={Math.PI / 2} />
      <ParkBench position={[3.2, 0.74, -8.5]} rotationY={-Math.PI / 2} />
      <ParkBench position={[-8.5, 0.74, 3.2]} rotationY={Math.PI} />
      <ParkBench position={[8.5, 0.74, -3.2]} rotationY={0} />

      <TrashBin position={[-3.2, 0.74, -9.3]} />
      <TrashBin position={[3.2, 0.74, -9.3]} />
      <TrashBin position={[-9.3, 0.74, 3.2]} />
      <TrashBin position={[9.3, 0.74, -3.2]} />

      <PlanterBox position={[-2.8, 0.74, -3.8]} rotationY={0} />
      <PlanterBox position={[2.8, 0.74, -3.8]} rotationY={0} />
      <PlanterBox position={[-2.8, 0.74, 3.8]} rotationY={Math.PI} />
      <PlanterBox position={[2.8, 0.74, 3.8]} rotationY={Math.PI} />
      <PlanterBox position={[-2.8, 0.74, -9.8]} rotationY={0} />
      <PlanterBox position={[2.8, 0.74, -9.8]} rotationY={0} />
      <PlanterBox position={[-2.8, 0.74, 9.8]} rotationY={Math.PI} />
      <PlanterBox position={[2.8, 0.74, 9.8]} rotationY={Math.PI} />

      {/* Decorative Fire Hydrants at Corner Curbs */}
      <FireHydrant position={[-3.6, 0.74, -13.5]} />
      <FireHydrant position={[3.6, 0.74, 13.5]} />

      {/* 5. DIRECTIONAL ROAD SIGNS */}
      <DirectionalSignpost position={[-3.2, 0.74, -2.4]} rotationY={Math.PI / 2} dir1="▲" dest1="CONTACT HUB" dir2="◄" dest2="HERO HQ" />
      <DirectionalSignpost position={[3.2, 0.74, 2.4]} rotationY={-Math.PI / 2} dir1="▼" dest1="EXPERIENCE OFFICE" dir2="►" dest2="SKILLS TOWER" />
      <DirectionalSignpost position={[-2.4, 0.74, 3.2]} rotationY={Math.PI} dir1="◄" dest1="PROJECTS CENTER" dir2="►" dest2="ABOUT ME STUDIO" />

      {/* 6. PARKED CARS (Showcasing all 3 stylized vehicle types: Hatchback, Sedan & Small SUV) */}
      {/* 6a. Modern Sedan (Crimson Red) */}
      <CompleteVehicle type="sedan" color="#dc2626" position={[12.6, 0.65, -5.2]} rotationY={0} enableShadows={enableShadows} />
      {/* 6b. Small SUV (Arctic White with Silver Roof Rails) */}
      <CompleteVehicle type="suv" color="#f8fafc" position={[12.6, 0.65, 5.2]} rotationY={Math.PI} enableShadows={enableShadows} />
      {/* 6c. Compact Hatchback (Sunset Orange, Image 1 Style) */}
      <CompleteVehicle type="hatchback" color="#f97316" position={[-12.6, 0.65, -5.2]} rotationY={0} enableShadows={enableShadows} />
      {/* 6d. Compact Hatchback (Emerald Green) */}
      <CompleteVehicle type="hatchback" color="#059669" position={[-12.6, 0.65, 5.2]} rotationY={Math.PI} enableShadows={enableShadows} />
    </group>
  );
};

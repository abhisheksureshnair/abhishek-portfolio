'use client';

import React, { forwardRef } from 'react';
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export type VehicleType = 'hatchback' | 'sedan' | 'suv';
export type VehicleAccessory = 'none' | 'taxi' | 'police' | 'spoiler';

export interface VehicleProps {
  type: VehicleType;
  color: string;
  accessory?: VehicleAccessory;
  enableShadows?: boolean;
}

// ============================================================================
// SHARED STATIC MATERIALS (Zero GPU Heap Duplication across all city cars)
// ============================================================================
export const _wheelRubberMat = new THREE.MeshStandardMaterial({
  color: '#1e293b',
  roughness: 0.85,
  metalness: 0.1,
});

export const _wheelRimMat = new THREE.MeshStandardMaterial({
  color: '#e2e8f0',
  metalness: 0.85,
  roughness: 0.2,
});

export const _wheelHubMat = new THREE.MeshStandardMaterial({
  color: '#0f172a',
  metalness: 0.9,
  roughness: 0.3,
});

export const _carGlassMat = new THREE.MeshStandardMaterial({
  color: '#0f172a',
  emissive: '#0284c7',
  emissiveIntensity: 0.25,
  roughness: 0.08,
  metalness: 0.92,
  transparent: false,
});

export const _headlightMat = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  emissive: '#fffbeb',
  emissiveIntensity: 2.5,
  roughness: 0.1,
});

export const _drlAmberMat = new THREE.MeshStandardMaterial({
  color: '#fbbf24',
  emissive: '#f59e0b',
  emissiveIntensity: 2.4,
  roughness: 0.1,
});

export const _taillightMat = new THREE.MeshStandardMaterial({
  color: '#ef4444',
  emissive: '#ef4444',
  emissiveIntensity: 2.5,
  roughness: 0.1,
});

export const _grilleMat = new THREE.MeshStandardMaterial({
  color: '#090d16',
  roughness: 0.75,
  metalness: 0.2,
});

export const _darkTrimMat = new THREE.MeshStandardMaterial({
  color: '#1e293b',
  roughness: 0.6,
  metalness: 0.3,
});

export const _skidPlateMat = new THREE.MeshStandardMaterial({
  color: '#94a3b8',
  metalness: 0.75,
  roughness: 0.3,
});

// Cache of body paint materials by hex color
const _paintMaterialCache = new Map<string, THREE.MeshStandardMaterial>();

export function getCarPaintMaterial(color: string): THREE.MeshStandardMaterial {
  let mat = _paintMaterialCache.get(color);
  if (!mat) {
    mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.28,
      metalness: 0.35,
    });
    _paintMaterialCache.set(color, mat);
  }
  return mat;
}

// ============================================================================
// SHARED STATIC GEOMETRIES (Optimized via Geometry Merging)
// ============================================================================
// 1. Universal Wheels
const _tireGeoStandard = new THREE.CylinderGeometry(0.22, 0.22, 0.14, 12);
const _rimGeoStandard = new THREE.CylinderGeometry(0.155, 0.155, 0.142, 8);
const _hubGeoStandard = new THREE.CylinderGeometry(0.048, 0.048, 0.145, 6);

const _tireGeoSUV = new THREE.CylinderGeometry(0.25, 0.25, 0.16, 12);
const _rimGeoSUV = new THREE.CylinderGeometry(0.175, 0.175, 0.162, 8);
const _hubGeoSUV = new THREE.CylinderGeometry(0.055, 0.055, 0.165, 6);

// Compound Wheel Geometries (Tire + Rim + Hub merged for 1 draw call per wheel axle!)
function createCompoundWheel(isSUV: boolean): THREE.BufferGeometry {
  const tire = (isSUV ? _tireGeoSUV : _tireGeoStandard).clone();
  const rim = (isSUV ? _rimGeoSUV : _rimGeoStandard).clone();
  const hub = (isSUV ? _hubGeoSUV : _hubGeoStandard).clone();
  const merged = BufferGeometryUtils.mergeGeometries([tire, rim, hub]);
  return merged || tire;
}

const _compoundWheelStandard = createCompoundWheel(false);
const _compoundWheelSUV = createCompoundWheel(true);

// 2. Hatchback Merged Geometries
function buildHatchbackGeometries() {
  const c1 = new THREE.BoxGeometry(1.32, 0.24, 2.7);
  c1.translate(0, 0.22, 0);

  const c2 = new THREE.BoxGeometry(1.26, 0.14, 0.88);
  c2.rotateX(-0.14);
  c2.translate(0, 0.32, 0.82);

  const c3 = new THREE.BoxGeometry(1.14, 0.04, 1.45);
  c3.translate(0, 0.81, -0.06);

  const c4 = new THREE.BoxGeometry(1.16, 0.04, 0.18);
  c4.translate(0, 0.83, -0.81);

  const c5 = new THREE.BoxGeometry(1.34, 0.16, 0.22);
  c5.translate(0, 0.16, 1.36);

  const c6 = new THREE.BoxGeometry(1.34, 0.18, 0.2);
  c6.translate(0, 0.17, -1.36);

  const m1 = new THREE.BoxGeometry(0.14, 0.08, 0.08);
  m1.translate(-0.72, 0.52, 0.28);
  const m2 = new THREE.BoxGeometry(0.14, 0.08, 0.08);
  m2.translate(0.72, 0.52, 0.28);

  const bodyMerged = BufferGeometryUtils.mergeGeometries([c1, c2, c3, c4, c5, c6, m1, m2])!;

  // Headlights
  const hl1 = new THREE.BoxGeometry(0.26, 0.1, 0.1);
  hl1.rotateY(-0.12);
  hl1.translate(-0.46, 0.27, 1.4);
  const hl2 = new THREE.BoxGeometry(0.26, 0.1, 0.1);
  hl2.rotateY(0.12);
  hl2.translate(0.46, 0.27, 1.4);
  const headlightsMerged = BufferGeometryUtils.mergeGeometries([hl1, hl2])!;

  // Taillights
  const tl1 = new THREE.BoxGeometry(0.12, 0.24, 0.06);
  tl1.translate(-0.52, 0.44, -1.38);
  const tl2 = new THREE.BoxGeometry(0.12, 0.24, 0.06);
  tl2.translate(0.52, 0.44, -1.38);
  const taillightsMerged = BufferGeometryUtils.mergeGeometries([tl1, tl2])!;

  // Grilles
  const g1 = new THREE.BoxGeometry(0.82, 0.11, 0.04);
  g1.translate(0, 0.24, 1.48);
  const g2 = new THREE.BoxGeometry(0.96, 0.09, 0.04);
  g2.translate(0, 0.12, 1.48);
  const grillesMerged = BufferGeometryUtils.mergeGeometries([g1, g2])!;

  const cabinGeo = new THREE.BoxGeometry(1.18, 0.44, 1.48);
  cabinGeo.translate(0, 0.58, -0.06);

  return { bodyMerged, headlightsMerged, taillightsMerged, grillesMerged, cabinGeo };
}

const _hatchAssets = buildHatchbackGeometries();

// 3. Sedan Merged Geometries
function buildSedanGeometries() {
  const s1 = new THREE.BoxGeometry(1.36, 0.22, 3.2);
  s1.translate(0, 0.21, 0);

  const s2 = new THREE.BoxGeometry(1.3, 0.12, 1.05);
  s2.rotateX(-0.11);
  s2.translate(0, 0.3, 0.98);

  const s3 = new THREE.BoxGeometry(1.18, 0.04, 1.5);
  s3.translate(0, 0.74, -0.05);

  const s4 = new THREE.BoxGeometry(1.28, 0.08, 0.55);
  s4.translate(0, 0.33, -1.28);

  const s5 = new THREE.BoxGeometry(1.38, 0.14, 0.22);
  s5.translate(0, 0.15, 1.58);

  const s6 = new THREE.BoxGeometry(1.38, 0.16, 0.2);
  s6.translate(0, 0.16, -1.58);

  const m1 = new THREE.BoxGeometry(0.14, 0.08, 0.08);
  m1.translate(-0.74, 0.48, 0.35);
  const m2 = new THREE.BoxGeometry(0.14, 0.08, 0.08);
  m2.translate(0.74, 0.48, 0.35);

  const bodyMerged = BufferGeometryUtils.mergeGeometries([s1, s2, s3, s4, s5, s6, m1, m2])!;

  // Headlights
  const hl1 = new THREE.BoxGeometry(0.28, 0.08, 0.12);
  hl1.rotateY(-0.16);
  hl1.translate(-0.51, 0.24, 1.6);
  const hl2 = new THREE.BoxGeometry(0.28, 0.08, 0.12);
  hl2.rotateY(0.16);
  hl2.translate(0.51, 0.24, 1.6);
  const headlightsMerged = BufferGeometryUtils.mergeGeometries([hl1, hl2])!;

  // DRL Eyebrows
  const drl1 = new THREE.BoxGeometry(0.26, 0.025, 0.11);
  drl1.rotateY(-0.16);
  drl1.translate(-0.51, 0.29, 1.6);
  const drl2 = new THREE.BoxGeometry(0.26, 0.025, 0.11);
  drl2.rotateY(0.16);
  drl2.translate(0.51, 0.29, 1.6);
  const drlMerged = BufferGeometryUtils.mergeGeometries([drl1, drl2])!;

  // Taillight bar
  const tailBarGeo = new THREE.BoxGeometry(1.18, 0.06, 0.04);
  tailBarGeo.translate(0, 0.32, -1.69);

  // Grille
  const grilleGeo = new THREE.BoxGeometry(0.94, 0.12, 0.04);
  grilleGeo.translate(0, 0.2, 1.7);

  // Side skirt
  const sideSkirtGeo = new THREE.BoxGeometry(1.38, 0.05, 1.8);
  sideSkirtGeo.translate(0, 0.11, 0);

  const cabinGeo = new THREE.BoxGeometry(1.22, 0.38, 1.55);
  cabinGeo.translate(0, 0.54, -0.05);

  return { bodyMerged, headlightsMerged, drlMerged, tailBarGeo, grilleGeo, sideSkirtGeo, cabinGeo };
}

const _sedanAssets = buildSedanGeometries();

// 4. SUV Merged Geometries
function buildSUVGeometries() {
  const u1 = new THREE.BoxGeometry(1.4, 0.28, 3.05);
  u1.translate(0, 0.26, 0);

  const u2 = new THREE.BoxGeometry(1.36, 0.22, 0.98);
  u2.rotateX(-0.08);
  u2.translate(0, 0.42, 0.95);

  const u3 = new THREE.BoxGeometry(1.24, 0.05, 1.68);
  u3.translate(0, 0.93, -0.06);

  const u4 = new THREE.BoxGeometry(1.36, 0.48, 0.14);
  u4.translate(0, 0.58, -1.46);

  const m1 = new THREE.BoxGeometry(0.14, 0.08, 0.08);
  m1.translate(-0.78, 0.6, 0.36);
  const m2 = new THREE.BoxGeometry(0.14, 0.08, 0.08);
  m2.translate(0.78, 0.6, 0.36);

  const bodyMerged = BufferGeometryUtils.mergeGeometries([u1, u2, u3, u4, m1, m2])!;

  // Bumpers
  const fb = new THREE.BoxGeometry(1.42, 0.22, 0.24);
  fb.translate(0, 0.22, 1.5);
  const rb = new THREE.BoxGeometry(1.42, 0.22, 0.24);
  rb.translate(0, 0.22, -1.5);
  const bumpersMerged = BufferGeometryUtils.mergeGeometries([fb, rb])!;

  // Skid plates
  const sp1 = new THREE.BoxGeometry(0.72, 0.12, 0.04);
  sp1.translate(0, 0.16, 1.63);
  const sp2 = new THREE.BoxGeometry(0.72, 0.12, 0.04);
  sp2.translate(0, 0.16, -1.63);
  const rr1 = new THREE.BoxGeometry(0.04, 0.05, 1.35);
  rr1.translate(-0.56, 0.98, -0.06);
  const rr2 = new THREE.BoxGeometry(0.04, 0.05, 1.35);
  rr2.translate(0.56, 0.98, -0.06);
  const silverTrimMerged = BufferGeometryUtils.mergeGeometries([sp1, sp2, rr1, rr2])!;

  // Headlights
  const hl1 = new THREE.BoxGeometry(0.24, 0.12, 0.1);
  hl1.translate(-0.52, 0.38, 1.52);
  const hl2 = new THREE.BoxGeometry(0.24, 0.12, 0.1);
  hl2.translate(0.52, 0.38, 1.52);
  const headlightsMerged = BufferGeometryUtils.mergeGeometries([hl1, hl2])!;

  // Taillights
  const tl1 = new THREE.BoxGeometry(0.12, 0.28, 0.06);
  tl1.translate(-0.56, 0.56, -1.54);
  const tl2 = new THREE.BoxGeometry(0.12, 0.28, 0.06);
  tl2.translate(0.56, 0.56, -1.54);
  const taillightsMerged = BufferGeometryUtils.mergeGeometries([tl1, tl2])!;

  // Grille
  const grilleGeo = new THREE.BoxGeometry(0.92, 0.16, 0.04);
  grilleGeo.translate(0, 0.35, 1.58);

  const cabinGeo = new THREE.BoxGeometry(1.26, 0.48, 1.68);
  cabinGeo.translate(0, 0.68, -0.06);

  return { bodyMerged, bumpersMerged, silverTrimMerged, headlightsMerged, taillightsMerged, grilleGeo, cabinGeo };
}

const _suvAssets = buildSUVGeometries();

// Accessories
const _taxiSignBaseGeo = new THREE.BoxGeometry(0.48, 0.12, 0.2);
const _taxiSignFinGeo = new THREE.BoxGeometry(0.3, 0.04, 0.06);
const _policeBarBaseGeo = new THREE.BoxGeometry(0.65, 0.06, 0.18);
const _policeRedLensGeo = new THREE.BoxGeometry(0.26, 0.08, 0.14);
const _policeBlueLensGeo = new THREE.BoxGeometry(0.26, 0.08, 0.14);
const _sportsSpoilerWingGeo = new THREE.BoxGeometry(1.28, 0.04, 0.22);
const _sportsSpoilerStrutGeo = new THREE.BoxGeometry(0.04, 0.18, 0.06);

// ============================================================================
// VEHICLE WHEELS COMPONENT (Rotates in place on individual axles!)
// ============================================================================
export interface VehicleWheelsProps {
  type: VehicleType;
}

export const VehicleWheels = forwardRef<THREE.Group, VehicleWheelsProps>(({ type }, ref) => {
  const isSUV = type === 'suv';
  const wheelGeo = isSUV ? _compoundWheelSUV : _compoundWheelStandard;

  // Track & wheelbase based on vehicle type
  const track = isSUV ? 0.73 : type === 'sedan' ? 0.71 : 0.69;
  const frontZ = isSUV ? 0.85 : type === 'sedan' ? 0.94 : 0.74;
  const rearZ = isSUV ? -0.85 : type === 'sedan' ? -0.94 : -0.74;
  const wheelY = isSUV ? 0.16 : 0.14;

  const positions: [number, number, number][] = [
    [-track, wheelY, frontZ],
    [track, wheelY, frontZ],
    [-track, wheelY, rearZ],
    [track, wheelY, rearZ],
  ];

  return (
    <group ref={ref} name="VehicleWheelsContainer">
      {positions.map(([wx, wy, wz], idx) => (
        <group key={`wheel-mount-${idx}`} position={[wx, wy, wz]}>
          {/* Wheel Axle Child: Rotates in place around its local lateral axis */}
          <group rotation={[0, 0, Math.PI / 2]}>
            <mesh geometry={wheelGeo} material={_wheelRubberMat} />
          </group>
        </group>
      ))}
    </group>
  );
});
VehicleWheels.displayName = 'VehicleWheels';

// ============================================================================
// 1. COMPACT HATCHBACK BODY (Streamlined to 5 Draw Calls)
// ============================================================================
export const HatchbackChassis: React.FC<{
  color: string;
  accessory?: VehicleAccessory;
  enableShadows?: boolean;
}> = ({ color, accessory = 'none', enableShadows = false }) => {
  const bodyMat = getCarPaintMaterial(color);

  return (
    <group>
      {/* 1. Merged Car Body */}
      <mesh castShadow={enableShadows} geometry={_hatchAssets.bodyMerged} material={bodyMat} />

      {/* 2. Glass Greenhouse */}
      <mesh geometry={_hatchAssets.cabinGeo} material={_carGlassMat} />

      {/* 3. Front Grille */}
      <mesh geometry={_hatchAssets.grillesMerged} material={_grilleMat} />

      {/* 4. Headlights */}
      <mesh geometry={_hatchAssets.headlightsMerged} material={_headlightMat} />

      {/* 5. Taillights */}
      <mesh geometry={_hatchAssets.taillightsMerged} material={_taillightMat} />

      {/* Optional Accessories */}
      {accessory === 'taxi' && (
        <group position={[0, 0.89, -0.06]}>
          <mesh geometry={_taxiSignBaseGeo}>
            <meshStandardMaterial color="#fef08a" emissive="#fde047" emissiveIntensity={2.2} />
          </mesh>
          <mesh position={[0, 0.08, 0]} geometry={_taxiSignFinGeo} material={_darkTrimMat} />
        </group>
      )}

      {accessory === 'police' && (
        <group position={[0, 0.87, -0.06]}>
          <mesh geometry={_policeBarBaseGeo} material={_darkTrimMat} />
          <mesh position={[-0.18, 0.04, 0]} geometry={_policeRedLensGeo}>
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3.0} />
          </mesh>
          <mesh position={[0.18, 0.04, 0]} geometry={_policeBlueLensGeo}>
            <meshStandardMaterial color="#0284c7" emissive="#00f0ff" emissiveIntensity={3.0} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// ============================================================================
// 2. MODERN SEDAN BODY (Streamlined to 6 Draw Calls)
// ============================================================================
export const SedanChassis: React.FC<{
  color: string;
  accessory?: VehicleAccessory;
  enableShadows?: boolean;
}> = ({ color, accessory = 'none', enableShadows = false }) => {
  const bodyMat = getCarPaintMaterial(color);

  return (
    <group>
      {/* 1. Merged Car Body */}
      <mesh castShadow={enableShadows} geometry={_sedanAssets.bodyMerged} material={bodyMat} />

      {/* 2. Cabin Glass */}
      <mesh geometry={_sedanAssets.cabinGeo} material={_carGlassMat} />

      {/* 3. Grille & Side Skirt */}
      <mesh geometry={_sedanAssets.grilleGeo} material={_grilleMat} />
      <mesh geometry={_sedanAssets.sideSkirtGeo} material={_darkTrimMat} />

      {/* 4. Headlights & Amber DRLs */}
      <mesh geometry={_sedanAssets.headlightsMerged} material={_headlightMat} />
      <mesh geometry={_sedanAssets.drlMerged} material={_drlAmberMat} />

      {/* 5. Continuous Red Taillight Bar */}
      <mesh geometry={_sedanAssets.tailBarGeo} material={_taillightMat} />

      {/* Optional Accessories */}
      {accessory === 'taxi' && (
        <group position={[0, 0.82, -0.05]}>
          <mesh geometry={_taxiSignBaseGeo}>
            <meshStandardMaterial color="#fef08a" emissive="#fde047" emissiveIntensity={2.2} />
          </mesh>
          <mesh position={[0, 0.08, 0]} geometry={_taxiSignFinGeo} material={_darkTrimMat} />
        </group>
      )}

      {accessory === 'police' && (
        <group position={[0, 0.8, -0.05]}>
          <mesh geometry={_policeBarBaseGeo} material={_darkTrimMat} />
          <mesh position={[-0.18, 0.04, 0]} geometry={_policeRedLensGeo}>
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3.0} />
          </mesh>
          <mesh position={[0.18, 0.04, 0]} geometry={_policeBlueLensGeo}>
            <meshStandardMaterial color="#0284c7" emissive="#00f0ff" emissiveIntensity={3.0} />
          </mesh>
        </group>
      )}

      {accessory === 'spoiler' && (
        <group position={[0, 0.45, -1.48]}>
          <mesh position={[0, 0.12, 0]} geometry={_sportsSpoilerWingGeo} material={_darkTrimMat} />
          <mesh position={[-0.48, 0, 0]} geometry={_sportsSpoilerStrutGeo} material={_darkTrimMat} />
          <mesh position={[0.48, 0, 0]} geometry={_sportsSpoilerStrutGeo} material={_darkTrimMat} />
        </group>
      )}
    </group>
  );
};

// ============================================================================
// 3. SMALL SUV / URBAN CROSSOVER BODY (Streamlined to 6 Draw Calls)
// ============================================================================
export const SuvChassis: React.FC<{
  color: string;
  accessory?: VehicleAccessory;
  enableShadows?: boolean;
}> = ({ color, accessory = 'none', enableShadows = false }) => {
  const bodyMat = getCarPaintMaterial(color);

  return (
    <group>
      {/* 1. Merged Body */}
      <mesh castShadow={enableShadows} geometry={_suvAssets.bodyMerged} material={bodyMat} />

      {/* 2. Upright Panoramic Cabin Glass */}
      <mesh geometry={_suvAssets.cabinGeo} material={_carGlassMat} />

      {/* 3. Chunky Bumpers */}
      <mesh geometry={_suvAssets.bumpersMerged} material={_darkTrimMat} />

      {/* 4. Silver Skid Plates & Roof Rails */}
      <mesh geometry={_suvAssets.silverTrimMerged} material={_skidPlateMat} />

      {/* 5. Front Grille */}
      <mesh geometry={_suvAssets.grilleGeo} material={_grilleMat} />

      {/* 6. Headlights & Taillights */}
      <mesh geometry={_suvAssets.headlightsMerged} material={_headlightMat} />
      <mesh geometry={_suvAssets.taillightsMerged} material={_taillightMat} />

      {/* Optional Accessories */}
      {accessory === 'taxi' && (
        <group position={[0, 1.01, -0.06]}>
          <mesh geometry={_taxiSignBaseGeo}>
            <meshStandardMaterial color="#fef08a" emissive="#fde047" emissiveIntensity={2.2} />
          </mesh>
          <mesh position={[0, 0.08, 0]} geometry={_taxiSignFinGeo} material={_darkTrimMat} />
        </group>
      )}

      {accessory === 'police' && (
        <group position={[0, 0.99, -0.06]}>
          <mesh geometry={_policeBarBaseGeo} material={_darkTrimMat} />
          <mesh position={[-0.18, 0.04, 0]} geometry={_policeRedLensGeo}>
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3.0} />
          </mesh>
          <mesh position={[0.18, 0.04, 0]} geometry={_policeBlueLensGeo}>
            <meshStandardMaterial color="#0284c7" emissive="#00f0ff" emissiveIntensity={3.0} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// ============================================================================
// UNIFIED CITY VEHICLE CHASSIS COMPONENT
// ============================================================================
export const VehicleChassis: React.FC<{
  type: VehicleType;
  color: string;
  accessory?: VehicleAccessory;
  enableShadows?: boolean;
}> = ({ type, color, accessory = 'none', enableShadows = false }) => {
  switch (type) {
    case 'hatchback':
      return <HatchbackChassis color={color} accessory={accessory} enableShadows={enableShadows} />;
    case 'sedan':
      return <SedanChassis color={color} accessory={accessory} enableShadows={enableShadows} />;
    case 'suv':
      return <SuvChassis color={color} accessory={accessory} enableShadows={enableShadows} />;
    default:
      return <HatchbackChassis color={color} accessory={accessory} enableShadows={enableShadows} />;
  }
};

// ============================================================================
// COMPLETE STANDALONE VEHICLE (For Parked Cars or Direct Scene Placement)
// ============================================================================
export interface CompleteVehicleProps {
  type: VehicleType;
  color: string;
  position?: [number, number, number];
  rotationY?: number;
  accessory?: VehicleAccessory;
  enableShadows?: boolean;
  wheelRef?: React.Ref<THREE.Group>;
}

export const CompleteVehicle: React.FC<CompleteVehicleProps> = ({
  type,
  color,
  position = [0, 0, 0],
  rotationY = 0,
  accessory = 'none',
  enableShadows = false,
  wheelRef,
}) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <VehicleChassis type={type} color={color} accessory={accessory} enableShadows={enableShadows} />
      <VehicleWheels ref={wheelRef} type={type} />
    </group>
  );
};

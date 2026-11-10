'use client';

import React, { useMemo, forwardRef } from 'react';
import * as THREE from 'three';

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
  color: '#18181b',
  roughness: 0.88,
  metalness: 0.05,
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
  emissiveIntensity: 3.0,
  roughness: 0.1,
});

export const _drlAmberMat = new THREE.MeshStandardMaterial({
  color: '#fbbf24',
  emissive: '#f59e0b',
  emissiveIntensity: 2.8,
  roughness: 0.1,
});

export const _taillightMat = new THREE.MeshStandardMaterial({
  color: '#ef4444',
  emissive: '#ef4444',
  emissiveIntensity: 2.8,
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

export const _chromeMat = new THREE.MeshStandardMaterial({
  color: '#f8fafc',
  metalness: 0.95,
  roughness: 0.12,
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
      roughness: 0.24,
      metalness: 0.45,
    });
    _paintMaterialCache.set(color, mat);
  }
  return mat;
}

// ============================================================================
// SHARED STATIC GEOMETRIES
// ============================================================================
// 1. Universal Wheels
const _tireGeoStandard = new THREE.CylinderGeometry(0.22, 0.22, 0.14, 14);
const _rimGeoStandard = new THREE.CylinderGeometry(0.155, 0.155, 0.142, 10);
const _hubGeoStandard = new THREE.CylinderGeometry(0.048, 0.048, 0.145, 8);

const _tireGeoSUV = new THREE.CylinderGeometry(0.25, 0.25, 0.16, 14);
const _rimGeoSUV = new THREE.CylinderGeometry(0.175, 0.175, 0.162, 10);
const _hubGeoSUV = new THREE.CylinderGeometry(0.055, 0.055, 0.165, 8);

// 2. Hatchback Geometries (Reference Image 1: Orange Compact Hatchback)
const _hatchChassisGeo = new THREE.BoxGeometry(1.32, 0.24, 2.7);
const _hatchHoodGeo = new THREE.BoxGeometry(1.26, 0.14, 0.88);
const _hatchCabinGeo = new THREE.BoxGeometry(1.18, 0.44, 1.48);
const _hatchRoofGeo = new THREE.BoxGeometry(1.14, 0.04, 1.45);
const _hatchSpoilerGeo = new THREE.BoxGeometry(1.16, 0.04, 0.18);
const _hatchFrontBumperGeo = new THREE.BoxGeometry(1.34, 0.16, 0.22);
const _hatchRearBumperGeo = new THREE.BoxGeometry(1.34, 0.18, 0.2);
const _hatchGrilleGeo = new THREE.BoxGeometry(0.82, 0.11, 0.04);
const _hatchLowerGrilleGeo = new THREE.BoxGeometry(0.96, 0.09, 0.04);
const _hatchHeadlightGeo = new THREE.BoxGeometry(0.26, 0.1, 0.1);
const _hatchTaillightGeo = new THREE.BoxGeometry(0.12, 0.24, 0.06);
const _mirrorGeo = new THREE.BoxGeometry(0.14, 0.08, 0.08);

// 3. Modern Sedan Geometries (Reference Image 2: Sleek Low-Poly Grey Sedan)
const _sedanChassisGeo = new THREE.BoxGeometry(1.36, 0.22, 3.2);
const _sedanHoodWedgeGeo = new THREE.BoxGeometry(1.3, 0.12, 1.05);
const _sedanCabinGeo = new THREE.BoxGeometry(1.22, 0.38, 1.55);
const _sedanRoofGeo = new THREE.BoxGeometry(1.18, 0.04, 1.5);
const _sedanTrunkGeo = new THREE.BoxGeometry(1.28, 0.08, 0.55);
const _sedanFrontBumperGeo = new THREE.BoxGeometry(1.38, 0.14, 0.22);
const _sedanRearBumperGeo = new THREE.BoxGeometry(1.38, 0.16, 0.2);
const _sedanGrilleGeo = new THREE.BoxGeometry(0.94, 0.12, 0.04);
const _sedanHeadlightGeo = new THREE.BoxGeometry(0.28, 0.08, 0.12);
const _sedanDrlEyebrowGeo = new THREE.BoxGeometry(0.26, 0.025, 0.11);
const _sedanTailBarGeo = new THREE.BoxGeometry(1.18, 0.06, 0.04);
const _sedanSideSkirtGeo = new THREE.BoxGeometry(1.38, 0.05, 1.8);

// 4. Small SUV Geometries (Rugged Urban Crossover)
const _suvChassisGeo = new THREE.BoxGeometry(1.4, 0.28, 3.05);
const _suvHoodGeo = new THREE.BoxGeometry(1.36, 0.22, 0.98);
const _suvCabinGeo = new THREE.BoxGeometry(1.26, 0.48, 1.68);
const _suvRoofGeo = new THREE.BoxGeometry(1.24, 0.05, 1.68);
const _suvTailgateGeo = new THREE.BoxGeometry(1.36, 0.48, 0.14);
const _suvFrontBumperGeo = new THREE.BoxGeometry(1.42, 0.22, 0.24);
const _suvRearBumperGeo = new THREE.BoxGeometry(1.42, 0.22, 0.24);
const _suvSkidPlateGeo = new THREE.BoxGeometry(0.72, 0.12, 0.04);
const _suvGrilleGeo = new THREE.BoxGeometry(0.92, 0.16, 0.04);
const _suvHeadlightGeo = new THREE.BoxGeometry(0.24, 0.12, 0.1);
const _suvTaillightGeo = new THREE.BoxGeometry(0.12, 0.28, 0.06);
const _suvRoofRailGeo = new THREE.BoxGeometry(0.04, 0.05, 1.35);

// 5. Accessories Geometries
const _taxiSignBaseGeo = new THREE.BoxGeometry(0.48, 0.12, 0.2);
const _taxiSignFinGeo = new THREE.BoxGeometry(0.3, 0.04, 0.06);
const _policeBarBaseGeo = new THREE.BoxGeometry(0.65, 0.06, 0.18);
const _policeRedLensGeo = new THREE.BoxGeometry(0.26, 0.08, 0.14);
const _policeBlueLensGeo = new THREE.BoxGeometry(0.26, 0.08, 0.14);
const _sportsSpoilerWingGeo = new THREE.BoxGeometry(1.28, 0.04, 0.22);
const _sportsSpoilerStrutGeo = new THREE.BoxGeometry(0.04, 0.18, 0.06);

// ============================================================================
// VEHICLE WHEELS COMPONENT (Accepts Ref for Frame-Rate Independent Rotation)
// ============================================================================
export interface VehicleWheelsProps {
  type: VehicleType;
}

export const VehicleWheels = forwardRef<THREE.Group, VehicleWheelsProps>(({ type }, ref) => {
  const isSUV = type === 'suv';
  const tireGeo = isSUV ? _tireGeoSUV : _tireGeoStandard;
  const rimGeo = isSUV ? _rimGeoSUV : _rimGeoStandard;
  const hubGeo = isSUV ? _hubGeoSUV : _hubGeoStandard;

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
    <group ref={ref}>
      {positions.map(([wx, wy, wz], idx) => (
        <group key={`wheel-${idx}`} position={[wx, wy, wz]} rotation={[0, 0, Math.PI / 2]}>
          {/* Black Rubber Tire */}
          <mesh geometry={tireGeo} material={_wheelRubberMat} />
          {/* 5-Spoke Star Silver Alloy Rim */}
          <mesh geometry={rimGeo} material={_wheelRimMat} />
          {/* Center Hub */}
          <mesh geometry={hubGeo} material={_wheelHubMat} />
        </group>
      ))}
    </group>
  );
});
VehicleWheels.displayName = 'VehicleWheels';

// ============================================================================
// 1. COMPACT HATCHBACK BODY
// Inspired by Reference Image 1: Orange Hatchback with low hood, tall rounded cabin,
// rear roof spoiler, crisp headlights, honeycomb grille, and side mirrors.
// ============================================================================
export const HatchbackChassis: React.FC<{
  color: string;
  accessory?: VehicleAccessory;
  enableShadows?: boolean;
}> = ({ color, accessory = 'none', enableShadows = false }) => {
  const bodyMat = getCarPaintMaterial(color);

  return (
    <group>
      {/* Lower Main Hull */}
      <mesh position={[0, 0.22, 0]} castShadow={enableShadows} geometry={_hatchChassisGeo} material={bodyMat} />

      {/* Sloping Front Hood */}
      <mesh
        position={[0, 0.32, 0.82]}
        rotation={[-0.14, 0, 0]}
        castShadow={enableShadows}
        geometry={_hatchHoodGeo}
        material={bodyMat}
      />

      {/* Cabin Core with Dark Reflective Glass */}
      <mesh position={[0, 0.58, -0.06]} geometry={_hatchCabinGeo} material={_carGlassMat} />

      {/* Body-Colored Roof Panel */}
      <mesh position={[0, 0.81, -0.06]} castShadow={enableShadows} geometry={_hatchRoofGeo} material={bodyMat} />

      {/* Sporty Rear Roof Hatch Spoiler Lip */}
      <mesh position={[0, 0.83, -0.81]} geometry={_hatchSpoilerGeo} material={bodyMat} />

      {/* Front Sculpted Bumper & Air Dam */}
      <mesh position={[0, 0.16, 1.36]} geometry={_hatchFrontBumperGeo} material={bodyMat} />

      {/* Upper Grille with Honeycomb Texture */}
      <mesh position={[0, 0.24, 1.48]} geometry={_hatchGrilleGeo} material={_grilleMat} />
      {/* Lower Air Intake Scoop */}
      <mesh position={[0, 0.12, 1.48]} geometry={_hatchLowerGrilleGeo} material={_grilleMat} />

      {/* Dual Swept-Back Front Headlights */}
      <mesh position={[-0.46, 0.27, 1.4]} rotation={[0, -0.12, 0]} geometry={_hatchHeadlightGeo} material={_headlightMat} />
      <mesh position={[0.46, 0.27, 1.4]} rotation={[0, 0.12, 0]} geometry={_hatchHeadlightGeo} material={_headlightMat} />

      {/* Rear Bumper & Apron */}
      <mesh position={[0, 0.17, -1.36]} geometry={_hatchRearBumperGeo} material={bodyMat} />

      {/* Rear Vertical Red Taillights */}
      <mesh position={[-0.52, 0.44, -1.38]} geometry={_hatchTaillightGeo} material={_taillightMat} />
      <mesh position={[0.52, 0.44, -1.38]} geometry={_hatchTaillightGeo} material={_taillightMat} />

      {/* Aerodynamic Side Mirrors */}
      <mesh position={[-0.72, 0.52, 0.28]} geometry={_mirrorGeo} material={bodyMat} />
      <mesh position={[0.72, 0.52, 0.28]} geometry={_mirrorGeo} material={bodyMat} />

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
// 2. MODERN SEDAN BODY
// Inspired by Reference Image 2: Sleek Low-Poly Grey Sedan with 3-box profile,
// long wedge hood, coupe-like cabin, sweeping trunk, amber DRL headlights, and side skirts.
// ============================================================================
export const SedanChassis: React.FC<{
  color: string;
  accessory?: VehicleAccessory;
  enableShadows?: boolean;
}> = ({ color, accessory = 'none', enableShadows = false }) => {
  const bodyMat = getCarPaintMaterial(color);

  return (
    <group>
      {/* Lower Main Hull */}
      <mesh position={[0, 0.21, 0]} castShadow={enableShadows} geometry={_sedanChassisGeo} material={bodyMat} />

      {/* Long Sloping Front Wedge Hood */}
      <mesh
        position={[0, 0.3, 0.98]}
        rotation={[-0.11, 0, 0]}
        castShadow={enableShadows}
        geometry={_sedanHoodWedgeGeo}
        material={bodyMat}
      />

      {/* Sleek Raked Coupe Greenhouse Glass */}
      <mesh position={[0, 0.54, -0.05]} geometry={_sedanCabinGeo} material={_carGlassMat} />

      {/* Roof Panel */}
      <mesh position={[0, 0.74, -0.05]} castShadow={enableShadows} geometry={_sedanRoofGeo} material={bodyMat} />

      {/* Distinct Rear Trunk Lid (3-Box Silhouette) */}
      <mesh position={[0, 0.33, -1.28]} castShadow={enableShadows} geometry={_sedanTrunkGeo} material={bodyMat} />

      {/* Front Sculpted Bumper & Chin Splitter */}
      <mesh position={[0, 0.15, 1.58]} geometry={_sedanFrontBumperGeo} material={bodyMat} />

      {/* Horizontal Slatted Grille */}
      <mesh position={[0, 0.2, 1.7]} geometry={_sedanGrilleGeo} material={_grilleMat} />

      {/* Angular LED Headlights (Swept-back) */}
      <mesh position={[-0.51, 0.24, 1.6]} rotation={[0, -0.16, 0]} geometry={_sedanHeadlightGeo} material={_headlightMat} />
      <mesh position={[0.51, 0.24, 1.6]} rotation={[0, 0.16, 0]} geometry={_sedanHeadlightGeo} material={_headlightMat} />

      {/* Amber DRL Eyebrows (Reference Image 2 Feature) */}
      <mesh position={[-0.51, 0.29, 1.6]} rotation={[0, -0.16, 0]} geometry={_sedanDrlEyebrowGeo} material={_drlAmberMat} />
      <mesh position={[0.51, 0.29, 1.6]} rotation={[0, 0.16, 0]} geometry={_sedanDrlEyebrowGeo} material={_drlAmberMat} />

      {/* Rear Bumper & Diffuser */}
      <mesh position={[0, 0.16, -1.58]} geometry={_sedanRearBumperGeo} material={bodyMat} />

      {/* Full-Width Continuous Red LED Taillight Bar */}
      <mesh position={[0, 0.32, -1.69]} geometry={_sedanTailBarBarMat ? _sedanTailBarGeo : _sedanTailBarGeo} material={_taillightMat} />

      {/* Dark Rocker Panel Side Skirts */}
      <mesh position={[0, 0.11, 0]} geometry={_sedanSideSkirtGeo} material={_darkTrimMat} />

      {/* Sleek Side Mirrors */}
      <mesh position={[-0.74, 0.48, 0.35]} geometry={_mirrorGeo} material={bodyMat} />
      <mesh position={[0.74, 0.48, 0.35]} geometry={_mirrorGeo} material={bodyMat} />

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
const _sedanTailBarBarMat = true;

// ============================================================================
// 3. SMALL SUV / URBAN CROSSOVER BODY
// High-riding stance, commanding blunt hood, level roof with silver roof rack rails,
// rugged skid plates, protective cladding, and elevated ground clearance.
// ============================================================================
export const SuvChassis: React.FC<{
  color: string;
  accessory?: VehicleAccessory;
  enableShadows?: boolean;
}> = ({ color, accessory = 'none', enableShadows = false }) => {
  const bodyMat = getCarPaintMaterial(color);

  return (
    <group>
      {/* Elevated SUV Lower Hull */}
      <mesh position={[0, 0.26, 0]} castShadow={enableShadows} geometry={_suvChassisGeo} material={bodyMat} />

      {/* Commanding Blunt Front Hood */}
      <mesh
        position={[0, 0.42, 0.95]}
        rotation={[-0.08, 0, 0]}
        castShadow={enableShadows}
        geometry={_suvHoodGeo}
        material={bodyMat}
      />

      {/* Upright Panoramic Cabin Glass */}
      <mesh position={[0, 0.68, -0.06]} geometry={_suvCabinGeo} material={_carGlassMat} />

      {/* Level Roof Panel */}
      <mesh position={[0, 0.93, -0.06]} castShadow={enableShadows} geometry={_suvRoofGeo} material={bodyMat} />

      {/* Squared-Off Rear Cargo Tailgate */}
      <mesh position={[0, 0.58, -1.46]} geometry={_suvTailgateGeo} material={bodyMat} />

      {/* Twin Silver SUV Roof Rack Rails */}
      <mesh position={[-0.56, 0.98, -0.06]} geometry={_suvRoofRailGeo} material={_skidPlateMat} />
      <mesh position={[0.56, 0.98, -0.06]} geometry={_suvRoofRailGeo} material={_skidPlateMat} />

      {/* Front Chunky Bumper */}
      <mesh position={[0, 0.22, 1.5]} geometry={_suvFrontBumperGeo} material={_darkTrimMat} />
      {/* Front Silver Skid Plate Insert */}
      <mesh position={[0, 0.16, 1.63]} geometry={_suvSkidPlateGeo} material={_skidPlateMat} />

      {/* Bold SUV Front Grille */}
      <mesh position={[0, 0.35, 1.58]} geometry={_suvGrilleGeo} material={_grilleMat} />

      {/* High-Mounted Dual Projector Headlights */}
      <mesh position={[-0.52, 0.38, 1.52]} geometry={_suvHeadlightGeo} material={_headlightMat} />
      <mesh position={[0.52, 0.38, 1.52]} geometry={_suvHeadlightGeo} material={_headlightMat} />

      {/* Rear Bumper & Rear Skid Plate */}
      <mesh position={[0, 0.22, -1.5]} geometry={_suvRearBumperGeo} material={_darkTrimMat} />
      <mesh position={[0, 0.16, -1.63]} geometry={_suvSkidPlateGeo} material={_skidPlateMat} />

      {/* High-Mounted Rugged Taillight Pods */}
      <mesh position={[-0.56, 0.56, -1.54]} geometry={_suvTaillightGeo} material={_taillightMat} />
      <mesh position={[0.56, 0.56, -1.54]} geometry={_suvTaillightGeo} material={_taillightMat} />

      {/* Sturdy SUV Side Mirrors */}
      <mesh position={[-0.78, 0.6, 0.36]} geometry={_mirrorGeo} material={bodyMat} />
      <mesh position={[0.78, 0.6, 0.36]} geometry={_mirrorGeo} material={bodyMat} />

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


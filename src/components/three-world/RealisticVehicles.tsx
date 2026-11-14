'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

export type VehicleModelType = 'sedan' | 'suv' | 'hatchback' | 'taxi' | 'van' | 'bus' | 'motorcycle';

export interface VehicleVisualProps {
  type: VehicleModelType;
  color?: string;
  isNight?: boolean;
  isBraking?: boolean;
  isTurningLeft?: boolean;
  isTurningRight?: boolean;
  steeringAngle?: number; // radians
  wheelRotation?: number; // radians
}

// ============================================================================
// SHARED PBR VEHICLE MATERIALS (High Performance, Zero GC Heap Duplication)
// ============================================================================
export const _carGlassMat = new THREE.MeshPhysicalMaterial({
  color: '#090d16',
  transmission: 0.8,
  opacity: 1,
  transparent: true,
  roughness: 0.04,
  metalness: 0.88,
  ior: 1.52,
});

export const _rubberTireMat = new THREE.MeshStandardMaterial({
  color: '#18181b',
  roughness: 0.9,
  metalness: 0.05,
});

export const _alloyRimMat = new THREE.MeshStandardMaterial({
  color: '#e2e8f0',
  metalness: 0.92,
  roughness: 0.18,
});

export const _brakeDiscMat = new THREE.MeshStandardMaterial({
  color: '#94a3b8',
  metalness: 0.95,
  roughness: 0.25,
});

export const _darkTrimMat = new THREE.MeshStandardMaterial({
  color: '#0f172a',
  roughness: 0.65,
  metalness: 0.2,
});

export const _chromeMat = new THREE.MeshStandardMaterial({
  color: '#f8fafc',
  metalness: 0.98,
  roughness: 0.1,
});

export const _headlightDayMat = new THREE.MeshStandardMaterial({
  color: '#f8fafc',
  roughness: 0.15,
  metalness: 0.3,
});

export const _headlightNightMat = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  emissive: '#fef08a',
  emissiveIntensity: 3.8,
  roughness: 0.1,
});

export const _taillightCruiseMat = new THREE.MeshStandardMaterial({
  color: '#991b1b',
  emissive: '#7f1d1d',
  emissiveIntensity: 1.2,
  roughness: 0.2,
});

export const _taillightBrakeMat = new THREE.MeshStandardMaterial({
  color: '#ef4444',
  emissive: '#dc2626',
  emissiveIntensity: 4.5,
  roughness: 0.1,
});

export const _turnIndicatorMat = new THREE.MeshStandardMaterial({
  color: '#f59e0b',
  emissive: '#d97706',
  emissiveIntensity: 3.8,
  roughness: 0.1,
});

export const _taxiSignMat = new THREE.MeshStandardMaterial({
  color: '#fef08a',
  emissive: '#facc15',
  emissiveIntensity: 2.2,
  roughness: 0.2,
});

export const _contactShadowMat = new THREE.MeshBasicMaterial({
  color: '#020617',
  transparent: true,
  opacity: 0.55,
});

// Cache body paint materials by hex
const _paintCache = new Map<string, THREE.MeshStandardMaterial>();
export function getCarPaint(hex: string, metallic = 0.85, roughness = 0.22): THREE.MeshStandardMaterial {
  const key = `${hex}-${metallic}-${roughness}`;
  let mat = _paintCache.get(key);
  if (!mat) {
    mat = new THREE.MeshStandardMaterial({
      color: hex,
      metalness: metallic,
      roughness: roughness,
    });
    _paintCache.set(key, mat);
  }
  return mat;
}

// Interior silhouette material (seats & dash seen through glass)
const _interiorMat = new THREE.MeshStandardMaterial({
  color: '#1e293b',
  roughness: 0.85,
});

/**
 * Detailed Alloy Wheel with Tire Tread & Brake Caliper
 */
export function DetailedWheel({
  radius = 0.28,
  width = 0.18,
  rotationX = 0,
}: {
  radius?: number;
  width?: number;
  rotationX?: number;
}) {
  return (
    <group rotation={[rotationX, 0, 0]}>
      {/* Outer Rubber Tire */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[radius, radius, width, 16]} />
        <primitive object={_rubberTireMat} attach="material" />
      </mesh>
      {/* Recessed Alloy Rim */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0.005, 0, 0]} castShadow>
        <cylinderGeometry args={[radius * 0.72, radius * 0.72, width * 1.02, 12]} />
        <primitive object={_alloyRimMat} attach="material" />
      </mesh>
      {/* Brake Disc */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.01, 0, 0]}>
        <cylinderGeometry args={[radius * 0.55, radius * 0.55, width * 0.4, 8]} />
        <primitive object={_brakeDiscMat} attach="material" />
      </mesh>
      {/* Center Hubcap Logo */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[width * 0.52, 0, 0]}>
        <cylinderGeometry args={[radius * 0.18, radius * 0.18, 0.02, 8]} />
        <primitive object={_chromeMat} attach="material" />
      </mesh>
    </group>
  );
}

/**
 * Soft Ground Contact Shadow Decal
 */
export function VehicleContactShadow({ width, length }: { width: number; length: number }) {
  return (
    <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width, length]} />
      <primitive object={_contactShadowMat} attach="material" />
    </mesh>
  );
}

/**
 * 1. Detailed Modern Sport Sedan
 */
export function ModernSedanModel({
  color = '#2563eb',
  isNight = false,
  isBraking = false,
  isTurningLeft = false,
  isTurningRight = false,
  steeringAngle = 0,
  wheelRotation = 0,
}: VehicleVisualProps) {
  const paintMat = useMemo(() => getCarPaint(color, 0.85, 0.2), [color]);
  const isBlink = Math.sin(performance.now() * 0.012) > 0;

  return (
    <group>
      {/* Contact Shadow */}
      <VehicleContactShadow width={2.0} length={4.2} />

      {/* Main Chassis / Lower Body */}
      <mesh position={[0, 0.34, 0]} castShadow>
        <boxGeometry args={[1.74, 0.44, 4.0]} />
        <primitive object={paintMat} attach="material" />
      </mesh>

      {/* Front Hood Slope (Rake) */}
      <mesh position={[0, 0.44, 1.15]} rotation={[-0.14, 0, 0]} castShadow>
        <boxGeometry args={[1.68, 0.18, 1.4]} />
        <primitive object={paintMat} attach="material" />
      </mesh>

      {/* Rear Trunk Lid */}
      <mesh position={[0, 0.48, -1.35]} castShadow>
        <boxGeometry args={[1.66, 0.18, 1.05]} />
        <primitive object={paintMat} attach="material" />
      </mesh>

      {/* Cabin Greenhouse Glass */}
      <mesh position={[0, 0.74, -0.15]} castShadow>
        <boxGeometry args={[1.44, 0.46, 2.15]} />
        <primitive object={_carGlassMat} attach="material" />
      </mesh>

      {/* Roof Panel */}
      <mesh position={[0, 0.98, -0.15]} castShadow>
        <boxGeometry args={[1.36, 0.06, 1.85]} />
        <primitive object={paintMat} attach="material" />
      </mesh>

      {/* Interior Silhouettes (Front Bucket Seats & Steering Wheel) */}
      <mesh position={[-0.35, 0.65, -0.1]} castShadow>
        <boxGeometry args={[0.38, 0.42, 0.38]} />
        <primitive object={_interiorMat} attach="material" />
      </mesh>
      <mesh position={[0.35, 0.65, -0.1]} castShadow>
        <boxGeometry args={[0.38, 0.42, 0.38]} />
        <primitive object={_interiorMat} attach="material" />
      </mesh>
      <mesh position={[-0.35, 0.68, 0.25]} rotation={[0.4, 0, 0]}>
        <torusGeometry args={[0.12, 0.02, 6, 12]} />
        <primitive object={_darkTrimMat} attach="material" />
      </mesh>

      {/* Side Mirrors */}
      <mesh position={[-0.86, 0.65, 0.45]} castShadow>
        <boxGeometry args={[0.12, 0.09, 0.18]} />
        <primitive object={paintMat} attach="material" />
      </mesh>
      <mesh position={[0.86, 0.65, 0.45]} castShadow>
        <boxGeometry args={[0.12, 0.09, 0.18]} />
        <primitive object={paintMat} attach="material" />
      </mesh>

      {/* Front Radiator Grille */}
      <mesh position={[0, 0.3, 2.01]}>
        <boxGeometry args={[0.9, 0.22, 0.04]} />
        <primitive object={_darkTrimMat} attach="material" />
      </mesh>

      {/* Projector Headlights (Front Z = 2.0) */}
      <mesh position={[-0.64, 0.38, 2.01]}>
        <boxGeometry args={[0.3, 0.12, 0.04]} />
        <primitive object={isNight ? _headlightNightMat : _headlightDayMat} attach="material" />
      </mesh>
      <mesh position={[0.64, 0.38, 2.01]}>
        <boxGeometry args={[0.3, 0.12, 0.04]} />
        <primitive object={isNight ? _headlightNightMat : _headlightDayMat} attach="material" />
      </mesh>

      {/* Front Turn Indicators */}
      <mesh position={[-0.8, 0.38, 1.98]}>
        <boxGeometry args={[0.08, 0.1, 0.04]} />
        <primitive object={isTurningLeft && isBlink ? _turnIndicatorMat : _darkTrimMat} attach="material" />
      </mesh>
      <mesh position={[0.8, 0.38, 1.98]}>
        <boxGeometry args={[0.08, 0.1, 0.04]} />
        <primitive object={isTurningRight && isBlink ? _turnIndicatorMat : _darkTrimMat} attach="material" />
      </mesh>

      {/* LED Taillight Lightbar (Rear Z = -2.01) */}
      <mesh position={[0, 0.46, -2.01]}>
        <boxGeometry args={[1.5, 0.08, 0.04]} />
        <primitive object={isBraking ? _taillightBrakeMat : _taillightCruiseMat} attach="material" />
      </mesh>

      {/* Night Headlight Beams */}
      {isNight && (
        <group position={[0, 0.4, 2.2]}>
          <spotLight
            color="#fef08a"
            intensity={3.5}
            angle={0.48}
            penumbra={0.5}
            distance={16}
            target-position={[0, 0, 10]}
          />
        </group>
      )}

      {/* Wheels with Front Steering Pivots */}
      {/* Front Left */}
      <group position={[-0.88, 0.25, 1.2]} rotation={[0, steeringAngle, 0]}>
        <DetailedWheel rotationX={wheelRotation} />
      </group>
      {/* Front Right */}
      <group position={[0.88, 0.25, 1.2]} rotation={[0, steeringAngle, 0]}>
        <DetailedWheel rotationX={wheelRotation} />
      </group>
      {/* Rear Left */}
      <group position={[-0.88, 0.25, -1.2]}>
        <DetailedWheel rotationX={wheelRotation} />
      </group>
      {/* Rear Right */}
      <group position={[0.88, 0.25, -1.2]}>
        <DetailedWheel rotationX={wheelRotation} />
      </group>
    </group>
  );
}

/**
 * 2. Modern SUV (High Stance, Roof Rails, Rugged Lower Cladding)
 */
export function ModernSUVModel({
  color = '#18181b',
  isNight = false,
  isBraking = false,
  isTurningLeft = false,
  isTurningRight = false,
  steeringAngle = 0,
  wheelRotation = 0,
}: VehicleVisualProps) {
  const paintMat = useMemo(() => getCarPaint(color, 0.78, 0.25), [color]);
  const isBlink = Math.sin(performance.now() * 0.012) > 0;

  return (
    <group>
      <VehicleContactShadow width={2.2} length={4.4} />

      {/* Lower Protective Cladding */}
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[1.86, 0.3, 4.3]} />
        <primitive object={_darkTrimMat} attach="material" />
      </mesh>

      {/* Upper Main Body */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[1.82, 0.48, 4.2]} />
        <primitive object={paintMat} attach="material" />
      </mesh>

      {/* SUV Greenhouse & Pillars */}
      <mesh position={[0, 1.05, -0.2]} castShadow>
        <boxGeometry args={[1.56, 0.52, 2.7]} />
        <primitive object={_carGlassMat} attach="material" />
      </mesh>

      {/* Roof with Roof Rails */}
      <mesh position={[0, 1.32, -0.2]} castShadow>
        <boxGeometry args={[1.5, 0.08, 2.6]} />
        <primitive object={paintMat} attach="material" />
      </mesh>
      {/* Roof Rails */}
      <mesh position={[-0.65, 1.4, -0.2]}>
        <boxGeometry args={[0.06, 0.08, 2.2]} />
        <primitive object={_chromeMat} attach="material" />
      </mesh>
      <mesh position={[0.65, 1.4, -0.2]}>
        <boxGeometry args={[0.06, 0.08, 2.2]} />
        <primitive object={_chromeMat} attach="material" />
      </mesh>

      {/* Front Headlights & Fog Lamps */}
      <mesh position={[-0.72, 0.65, 2.11]}>
        <boxGeometry args={[0.32, 0.16, 0.04]} />
        <primitive object={isNight ? _headlightNightMat : _headlightDayMat} attach="material" />
      </mesh>
      <mesh position={[0.72, 0.65, 2.11]}>
        <boxGeometry args={[0.32, 0.16, 0.04]} />
        <primitive object={isNight ? _headlightNightMat : _headlightDayMat} attach="material" />
      </mesh>

      {/* Rear Taillight Bars */}
      <mesh position={[-0.72, 0.72, -2.11]}>
        <boxGeometry args={[0.3, 0.45, 0.04]} />
        <primitive object={isBraking ? _taillightBrakeMat : _taillightCruiseMat} attach="material" />
      </mesh>
      <mesh position={[0.72, 0.72, -2.11]}>
        <boxGeometry args={[0.3, 0.45, 0.04]} />
        <primitive object={isBraking ? _taillightBrakeMat : _taillightCruiseMat} attach="material" />
      </mesh>

      {/* Night Headlight Beams */}
      {isNight && (
        <group position={[0, 0.65, 2.3]}>
          <spotLight color="#fef08a" intensity={3.8} angle={0.5} penumbra={0.5} distance={18} />
        </group>
      )}

      {/* Heavy-Duty Larger Wheels */}
      <group position={[-0.94, 0.32, 1.3]} rotation={[0, steeringAngle, 0]}>
        <DetailedWheel radius={0.34} width={0.22} rotationX={wheelRotation} />
      </group>
      <group position={[0.94, 0.32, 1.3]} rotation={[0, steeringAngle, 0]}>
        <DetailedWheel radius={0.34} width={0.22} rotationX={wheelRotation} />
      </group>
      <group position={[-0.94, 0.32, -1.3]}>
        <DetailedWheel radius={0.34} width={0.22} rotationX={wheelRotation} />
      </group>
      <group position={[0.94, 0.32, -1.3]}>
        <DetailedWheel radius={0.34} width={0.22} rotationX={wheelRotation} />
      </group>
    </group>
  );
}

/**
 * 3. Metropolitan City Yellow Taxi with Roof Beacon
 */
export function ModernTaxiModel(props: VehicleVisualProps) {
  return (
    <group>
      <ModernSedanModel {...props} color="#eab308" />
      {/* Illuminated Roof Taxi Sign */}
      <group position={[0, 1.08, -0.15]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.14, 0.18]} />
          <primitive object={_taxiSignMat} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.095]}>
          <planeGeometry args={[0.38, 0.08]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>
      {/* Checker Stripe Decals along side panels */}
      <mesh position={[-0.88, 0.44, 0]}>
        <boxGeometry args={[0.01, 0.06, 2.4]} />
        <primitive object={_darkTrimMat} attach="material" />
      </mesh>
      <mesh position={[0.88, 0.44, 0]}>
        <boxGeometry args={[0.01, 0.06, 2.4]} />
        <primitive object={_darkTrimMat} attach="material" />
      </mesh>
    </group>
  );
}

/**
 * 4. Express Delivery Cargo Van
 */
export function ModernVanModel({
  color = '#f8fafc',
  isNight = false,
  isBraking = false,
  isTurningLeft = false,
  isTurningRight = false,
  steeringAngle = 0,
  wheelRotation = 0,
}: VehicleVisualProps) {
  const paintMat = useMemo(() => getCarPaint(color, 0.6, 0.4), [color]);

  return (
    <group>
      <VehicleContactShadow width={2.1} length={4.8} />

      {/* Tall Cargo Box Body */}
      <mesh position={[0, 0.95, -0.3]} castShadow>
        <boxGeometry args={[1.86, 1.45, 3.8]} />
        <primitive object={paintMat} attach="material" />
      </mesh>

      {/* Front Cab Hood & Bumper */}
      <mesh position={[0, 0.6, 1.85]} castShadow>
        <boxGeometry args={[1.82, 0.65, 0.9]} />
        <primitive object={paintMat} attach="material" />
      </mesh>

      {/* Windshield & Front Side Windows */}
      <mesh position={[0, 1.15, 1.45]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[1.76, 0.58, 0.4]} />
        <primitive object={_carGlassMat} attach="material" />
      </mesh>

      {/* Front Headlights */}
      <mesh position={[-0.72, 0.58, 2.31]}>
        <boxGeometry args={[0.3, 0.2, 0.04]} />
        <primitive object={isNight ? _headlightNightMat : _headlightDayMat} attach="material" />
      </mesh>
      <mesh position={[0.72, 0.58, 2.31]}>
        <boxGeometry args={[0.3, 0.2, 0.04]} />
        <primitive object={isNight ? _headlightNightMat : _headlightDayMat} attach="material" />
      </mesh>

      {/* Rear Vertical Taillights */}
      <mesh position={[-0.85, 0.85, -2.21]}>
        <boxGeometry args={[0.1, 0.5, 0.04]} />
        <primitive object={isBraking ? _taillightBrakeMat : _taillightCruiseMat} attach="material" />
      </mesh>
      <mesh position={[0.85, 0.85, -2.21]}>
        <boxGeometry args={[0.1, 0.5, 0.04]} />
        <primitive object={isBraking ? _taillightBrakeMat : _taillightCruiseMat} attach="material" />
      </mesh>

      {/* Wheels */}
      <group position={[-0.92, 0.3, 1.4]} rotation={[0, steeringAngle, 0]}>
        <DetailedWheel radius={0.31} width={0.2} rotationX={wheelRotation} />
      </group>
      <group position={[0.92, 0.3, 1.4]} rotation={[0, steeringAngle, 0]}>
        <DetailedWheel radius={0.31} width={0.2} rotationX={wheelRotation} />
      </group>
      <group position={[-0.92, 0.3, -1.4]}>
        <DetailedWheel radius={0.31} width={0.2} rotationX={wheelRotation} />
      </group>
      <group position={[0.92, 0.3, -1.4]}>
        <DetailedWheel radius={0.31} width={0.2} rotationX={wheelRotation} />
      </group>
    </group>
  );
}

/**
 * 5. City Transit Metro Bus (Long Dual-Axle Coach)
 */
export function ModernBusModel({
  isNight = false,
  isBraking = false,
  steeringAngle = 0,
  wheelRotation = 0,
}: VehicleVisualProps) {
  const busBodyMat = useMemo(() => getCarPaint('#0284c7', 0.65, 0.3), []);

  return (
    <group>
      <VehicleContactShadow width={2.4} length={7.6} />

      {/* Main Bus Chassis & Lower Structure */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[2.2, 1.6, 7.2]} />
        <primitive object={busBodyMat} attach="material" />
      </mesh>

      {/* Continuous Panoramic Glass Side Ribbons */}
      <mesh position={[0, 1.25, 0.1]}>
        <boxGeometry args={[2.24, 0.85, 6.6]} />
        <primitive object={_carGlassMat} attach="material" />
      </mesh>

      {/* Front Windshield with Rake */}
      <mesh position={[0, 1.25, 3.61]}>
        <boxGeometry args={[2.0, 0.9, 0.05]} />
        <primitive object={_carGlassMat} attach="material" />
      </mesh>

      {/* Front Destination Board LED ("TECH METROPOLIS METRO") */}
      <mesh position={[0, 1.82, 3.61]}>
        <boxGeometry args={[1.6, 0.22, 0.05]} />
        <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={2.5} />
      </mesh>

      {/* Rooftop HVAC Cooling Units */}
      <mesh position={[0, 1.88, -0.6]} castShadow>
        <boxGeometry args={[1.5, 0.25, 2.4]} />
        <primitive object={_darkTrimMat} attach="material" />
      </mesh>

      {/* Headlights */}
      <mesh position={[-0.8, 0.45, 3.62]}>
        <boxGeometry args={[0.35, 0.18, 0.04]} />
        <primitive object={isNight ? _headlightNightMat : _headlightDayMat} attach="material" />
      </mesh>
      <mesh position={[0.8, 0.45, 3.62]}>
        <boxGeometry args={[0.35, 0.18, 0.04]} />
        <primitive object={isNight ? _headlightNightMat : _headlightDayMat} attach="material" />
      </mesh>

      {/* Rear Taillight Clusters */}
      <mesh position={[-0.8, 0.65, -3.62]}>
        <boxGeometry args={[0.2, 0.6, 0.04]} />
        <primitive object={isBraking ? _taillightBrakeMat : _taillightCruiseMat} attach="material" />
      </mesh>
      <mesh position={[0.8, 0.65, -3.62]}>
        <boxGeometry args={[0.2, 0.6, 0.04]} />
        <primitive object={isBraking ? _taillightBrakeMat : _taillightCruiseMat} attach="material" />
      </mesh>

      {/* Heavy-Duty Dual Axle Wheels */}
      {/* Front Steered Axle */}
      <group position={[-1.12, 0.38, 2.4]} rotation={[0, steeringAngle, 0]}>
        <DetailedWheel radius={0.38} width={0.24} rotationX={wheelRotation} />
      </group>
      <group position={[1.12, 0.38, 2.4]} rotation={[0, steeringAngle, 0]}>
        <DetailedWheel radius={0.38} width={0.24} rotationX={wheelRotation} />
      </group>
      {/* Rear Dual Axle 1 */}
      <group position={[-1.12, 0.38, -1.8]}>
        <DetailedWheel radius={0.38} width={0.24} rotationX={wheelRotation} />
      </group>
      <group position={[1.12, 0.38, -1.8]}>
        <DetailedWheel radius={0.38} width={0.24} rotationX={wheelRotation} />
      </group>
      {/* Rear Dual Axle 2 */}
      <group position={[-1.12, 0.38, -2.6]}>
        <DetailedWheel radius={0.38} width={0.24} rotationX={wheelRotation} />
      </group>
      <group position={[1.12, 0.38, -2.6]}>
        <DetailedWheel radius={0.38} width={0.24} rotationX={wheelRotation} />
      </group>
    </group>
  );
}

/**
 * 6. Modern Motorcycle / Scooter with Articulated Rider Silhouette
 */
export function ModernMotorcycleModel({
  color = '#ef4444',
  isNight = false,
  isBraking = false,
  steeringAngle = 0,
  wheelRotation = 0,
}: VehicleVisualProps) {
  const frameMat = useMemo(() => getCarPaint(color, 0.9, 0.2), [color]);

  return (
    <group>
      <VehicleContactShadow width={0.8} length={2.2} />

      {/* Chassis Frame & Engine Block */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[0.32, 0.38, 1.1]} />
        <primitive object={_darkTrimMat} attach="material" />
      </mesh>

      {/* Sculpted Fuel Tank */}
      <mesh position={[0, 0.65, 0.15]} castShadow>
        <boxGeometry args={[0.34, 0.24, 0.55]} />
        <primitive object={frameMat} attach="material" />
      </mesh>

      {/* Contoured Biker Seat */}
      <mesh position={[0, 0.62, -0.3]} castShadow>
        <boxGeometry args={[0.26, 0.12, 0.45]} />
        <primitive object={_interiorMat} attach="material" />
      </mesh>

      {/* Front Fork & Handlebars */}
      <group position={[0, 0.65, 0.65]} rotation={[0, steeringAngle, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.6, 6]} />
          <primitive object={_chromeMat} attach="material" />
        </mesh>
        {/* Handlebars */}
        <mesh position={[0, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.68, 6]} />
          <primitive object={_darkTrimMat} attach="material" />
        </mesh>
        {/* Front Headlight */}
        <mesh position={[0, 0.08, 0.1]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <primitive object={isNight ? _headlightNightMat : _headlightDayMat} attach="material" />
        </mesh>
      </group>

      {/* Rear Taillight & License Mount */}
      <mesh position={[0, 0.58, -0.75]}>
        <boxGeometry args={[0.14, 0.08, 0.05]} />
        <primitive object={isBraking ? _taillightBrakeMat : _taillightCruiseMat} attach="material" />
      </mesh>

      {/* Front & Rear Spoke Wheels */}
      <group position={[0, 0.28, 0.75]} rotation={[0, steeringAngle, 0]}>
        <DetailedWheel radius={0.28} width={0.12} rotationX={wheelRotation} />
      </group>
      <group position={[0, 0.28, -0.65]}>
        <DetailedWheel radius={0.28} width={0.14} rotationX={wheelRotation} />
      </group>

      {/* Articulated Rider Silhouette (Torso, Helmet, Limbs) */}
      <group position={[0, 0.85, -0.15]}>
        {/* Rider Torso with Leather Jacket */}
        <mesh position={[0, 0.18, 0]} rotation={[0.25, 0, 0]} castShadow>
          <boxGeometry args={[0.34, 0.45, 0.22]} />
          <primitive object={_darkTrimMat} attach="material" />
        </mesh>
        {/* Helmet */}
        <mesh position={[0, 0.5, 0.06]} castShadow>
          <sphereGeometry args={[0.13, 12, 12]} />
          <primitive object={frameMat} attach="material" />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Universal Vehicle Model Renderer
 */
export const RealisticVehicleModel: React.FC<VehicleVisualProps> = (props) => {
  switch (props.type) {
    case 'suv':
      return <ModernSUVModel {...props} />;
    case 'hatchback':
      return <ModernSedanModel {...props} color={props.color || '#06b6d4'} />;
    case 'taxi':
      return <ModernTaxiModel {...props} />;
    case 'van':
      return <ModernVanModel {...props} />;
    case 'bus':
      return <ModernBusModel {...props} />;
    case 'motorcycle':
      return <ModernMotorcycleModel {...props} />;
    case 'sedan':
    default:
      return <ModernSedanModel {...props} />;
  }
};

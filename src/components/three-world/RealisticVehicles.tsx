'use client';

import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Preload all authentic GLB vehicle models
useGLTF.preload('/models/vehicles/sedan.glb');
useGLTF.preload('/models/vehicles/suv.glb');
useGLTF.preload('/models/vehicles/taxi.glb');
useGLTF.preload('/models/vehicles/bus.glb');
useGLTF.preload('/models/vehicles/van.glb');
useGLTF.preload('/models/vehicles/bicycle.glb');

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
// SHARED PBR VEHICLE MATERIALS (High Performance, Photorealistic Automotive)
// ============================================================================
export const _carGlassMat = new THREE.MeshPhysicalMaterial({
  color: '#090d16',
  transmission: 0.85,
  opacity: 1,
  transparent: true,
  roughness: 0.04,
  metalness: 0.88,
  ior: 1.52,
});

export const _rubberTireMat = new THREE.MeshStandardMaterial({
  color: '#18181b',
  roughness: 0.88,
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

/**
 * Detailed Alloy Wheel with Tire Tread & Hubcap
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
 * Soft Ground Contact Shadow Decal on Asphalt
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
 * Reusable Hook to Load & Upgrade Vehicle GLB Bodywork to PBR Standards
 */
function useUpgradedVehicleGLB(
  path: string,
  color?: string,
  isNight = false,
  isBraking = false
): THREE.Group {
  const { scene } = useGLTF(path);

  const upgraded = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        const upgradedMats = mats.map((mat) => {
          const name = mat.name.toLowerCase();
          if (name.includes('vidro')) {
            return _carGlassMat;
          }
          if (name.includes('escuro')) {
            return _rubberTireMat;
          }
          if (name.includes('metal')) {
            return _chromeMat;
          }
          if (name.includes('flor_amarela')) {
            return isNight ? _headlightNightMat : _headlightDayMat;
          }
          if (name.includes('vermelho')) {
            return isBraking ? _taillightBrakeMat : _taillightCruiseMat;
          }
          // Main automotive body panel paint
          if (color) {
            return getCarPaint(color, 0.85, 0.22);
          }
          return mat;
        });

        mesh.material = Array.isArray(mesh.material) ? upgradedMats : upgradedMats[0];
      }
    });
    return c;
  }, [scene, color, isNight, isBraking]);

  return upgraded;
}

/**
 * 1. Detailed Modern Sport Sedan (GLB Model + PBR Automotive Paint)
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
  const bodyScene = useUpgradedVehicleGLB('/models/vehicles/sedan.glb', color, isNight, isBraking);
  const isBlink = Math.sin(performance.now() * 0.012) > 0;

  return (
    <group>
      {/* Soft Contact Ambient Shadow on Pavement */}
      <VehicleContactShadow width={2.1} length={4.5} />

      {/* Photorealistic GLB Body (Scaled to 4.36m length, 2.01m width, 1.48m height) */}
      <group position={[0, 0, 0]} rotation={[0, Math.PI, 0]} scale={[4.8, 4.8, 4.8]}>
        <primitive object={bodyScene} />
      </group>

      {/* Front Projector Headlight Beams (Night Mode) */}
      {isNight && (
        <group position={[0, 0.45, 2.2]}>
          <spotLight
            color="#fef08a"
            intensity={3.6}
            angle={0.48}
            penumbra={0.5}
            distance={16}
            target-position={[0, 0, 10]}
          />
        </group>
      )}

      {/* Front Turn Indicators */}
      {isTurningLeft && isBlink && (
        <mesh position={[-0.82, 0.42, 2.05]}>
          <boxGeometry args={[0.1, 0.08, 0.04]} />
          <primitive object={_turnIndicatorMat} attach="material" />
        </mesh>
      )}
      {isTurningRight && isBlink && (
        <mesh position={[0.82, 0.42, 2.05]}>
          <boxGeometry args={[0.1, 0.08, 0.04]} />
          <primitive object={_turnIndicatorMat} attach="material" />
        </mesh>
      )}

      {/* Rear LED Brake / Cruise Lightbar Overlay */}
      <mesh position={[0, 0.52, -2.15]}>
        <boxGeometry args={[1.5, 0.08, 0.04]} />
        <primitive object={isBraking ? _taillightBrakeMat : _taillightCruiseMat} attach="material" />
      </mesh>

      {/* Rotating Wheels with Front Steering Pivots */}
      <group position={[-0.92, 0.28, 1.25]} rotation={[0, steeringAngle, 0]}>
        <DetailedWheel radius={0.28} width={0.18} rotationX={wheelRotation} />
      </group>
      <group position={[0.92, 0.28, 1.25]} rotation={[0, steeringAngle, 0]}>
        <DetailedWheel radius={0.28} width={0.18} rotationX={wheelRotation} />
      </group>
      <group position={[-0.92, 0.28, -1.25]}>
        <DetailedWheel radius={0.28} width={0.18} rotationX={wheelRotation} />
      </group>
      <group position={[0.92, 0.28, -1.25]}>
        <DetailedWheel radius={0.28} width={0.18} rotationX={wheelRotation} />
      </group>
    </group>
  );
}

/**
 * 2. Modern SUV / Electric Crossover (GLB Model)
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
  const bodyScene = useUpgradedVehicleGLB('/models/vehicles/suv.glb', color, isNight, isBraking);
  const isBlink = Math.sin(performance.now() * 0.012) > 0;

  return (
    <group>
      <VehicleContactShadow width={2.2} length={4.7} />

      {/* Photorealistic GLB Body (Scaled to 4.65m length, 2.06m width, 1.52m height) */}
      <group position={[0, 0, 0]} rotation={[0, Math.PI, 0]} scale={[4.9, 4.9, 4.9]}>
        <primitive object={bodyScene} />
      </group>

      {/* Front Projector Headlights (Night Mode) */}
      {isNight && (
        <group position={[0, 0.6, 2.3]}>
          <spotLight color="#fef08a" intensity={3.8} angle={0.5} penumbra={0.5} distance={18} />
        </group>
      )}

      {/* Turn Indicators */}
      {isTurningLeft && isBlink && (
        <mesh position={[-0.85, 0.58, 2.2]}>
          <boxGeometry args={[0.12, 0.1, 0.04]} />
          <primitive object={_turnIndicatorMat} attach="material" />
        </mesh>
      )}
      {isTurningRight && isBlink && (
        <mesh position={[0.85, 0.58, 2.2]}>
          <boxGeometry args={[0.12, 0.1, 0.04]} />
          <primitive object={_turnIndicatorMat} attach="material" />
        </mesh>
      )}

      {/* Rear Taillight / Brake Light Clusters */}
      <mesh position={[-0.75, 0.68, -2.28]}>
        <boxGeometry args={[0.26, 0.35, 0.04]} />
        <primitive object={isBraking ? _taillightBrakeMat : _taillightCruiseMat} attach="material" />
      </mesh>
      <mesh position={[0.75, 0.68, -2.28]}>
        <boxGeometry args={[0.26, 0.35, 0.04]} />
        <primitive object={isBraking ? _taillightBrakeMat : _taillightCruiseMat} attach="material" />
      </mesh>

      {/* Heavy-Duty Wheels */}
      <group position={[-0.96, 0.32, 1.35]} rotation={[0, steeringAngle, 0]}>
        <DetailedWheel radius={0.32} width={0.22} rotationX={wheelRotation} />
      </group>
      <group position={[0.96, 0.32, 1.35]} rotation={[0, steeringAngle, 0]}>
        <DetailedWheel radius={0.32} width={0.22} rotationX={wheelRotation} />
      </group>
      <group position={[-0.96, 0.32, -1.35]}>
        <DetailedWheel radius={0.32} width={0.22} rotationX={wheelRotation} />
      </group>
      <group position={[0.96, 0.32, -1.35]}>
        <DetailedWheel radius={0.32} width={0.22} rotationX={wheelRotation} />
      </group>
    </group>
  );
}

/**
 * 3. Metropolitan City Yellow Taxi (GLB Model + Illuminated Roof Beacon)
 */
export function ModernTaxiModel(props: VehicleVisualProps) {
  const bodyScene = useUpgradedVehicleGLB('/models/vehicles/taxi.glb', '#eab308', props.isNight, props.isBraking);
  const isBlink = Math.sin(performance.now() * 0.012) > 0;

  return (
    <group>
      <VehicleContactShadow width={2.1} length={4.6} />

      <group position={[0, 0, 0]} rotation={[0, Math.PI, 0]} scale={[4.8, 4.8, 4.8]}>
        <primitive object={bodyScene} />
      </group>

      {/* Illuminated Roof Taxi Sign */}
      <group position={[0, 1.55, -0.15]}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.16, 0.2]} />
          <primitive object={_taxiSignMat} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0.105]}>
          <planeGeometry args={[0.42, 0.1]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>

      {/* Night Headlights */}
      {props.isNight && (
        <group position={[0, 0.45, 2.2]}>
          <spotLight color="#fef08a" intensity={3.6} angle={0.48} penumbra={0.5} distance={16} />
        </group>
      )}

      {/* Rear Taillight / Brake Light */}
      <mesh position={[0, 0.52, -2.2]}>
        <boxGeometry args={[1.5, 0.08, 0.04]} />
        <primitive object={props.isBraking ? _taillightBrakeMat : _taillightCruiseMat} attach="material" />
      </mesh>

      {/* Turn Indicators */}
      {props.isTurningLeft && isBlink && (
        <mesh position={[-0.82, 0.42, 2.1]}>
          <boxGeometry args={[0.1, 0.08, 0.04]} />
          <primitive object={_turnIndicatorMat} attach="material" />
        </mesh>
      )}
      {props.isTurningRight && isBlink && (
        <mesh position={[0.82, 0.42, 2.1]}>
          <boxGeometry args={[0.1, 0.08, 0.04]} />
          <primitive object={_turnIndicatorMat} attach="material" />
        </mesh>
      )}

      {/* Wheels */}
      <group position={[-0.92, 0.28, 1.25]} rotation={[0, props.steeringAngle ?? 0, 0]}>
        <DetailedWheel radius={0.28} width={0.18} rotationX={props.wheelRotation} />
      </group>
      <group position={[0.92, 0.28, 1.25]} rotation={[0, props.steeringAngle ?? 0, 0]}>
        <DetailedWheel radius={0.28} width={0.18} rotationX={props.wheelRotation} />
      </group>
      <group position={[-0.92, 0.28, -1.25]}>
        <DetailedWheel radius={0.28} width={0.18} rotationX={props.wheelRotation} />
      </group>
      <group position={[0.92, 0.28, -1.25]}>
        <DetailedWheel radius={0.28} width={0.18} rotationX={props.wheelRotation} />
      </group>
    </group>
  );
}

/**
 * 4. Express Delivery Cargo Van (GLB Model)
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
  const bodyScene = useUpgradedVehicleGLB('/models/vehicles/van.glb', color, isNight, isBraking);

  return (
    <group>
      <VehicleContactShadow width={2.4} length={6.6} />

      {/* Scaled to 6.5m length, 2.48m width */}
      <group position={[0, 0, 0]} rotation={[0, Math.PI, 0]} scale={[4.6, 4.6, 4.6]}>
        <primitive object={bodyScene} />
      </group>

      {/* Night Headlights */}
      {isNight && (
        <group position={[0, 0.75, 3.2]}>
          <spotLight color="#fef08a" intensity={3.8} angle={0.5} penumbra={0.5} distance={18} />
        </group>
      )}

      {/* Rear Vertical Taillights */}
      <mesh position={[-0.95, 0.95, -3.25]}>
        <boxGeometry args={[0.12, 0.6, 0.04]} />
        <primitive object={isBraking ? _taillightBrakeMat : _taillightCruiseMat} attach="material" />
      </mesh>
      <mesh position={[0.95, 0.95, -3.25]}>
        <boxGeometry args={[0.12, 0.6, 0.04]} />
        <primitive object={isBraking ? _taillightBrakeMat : _taillightCruiseMat} attach="material" />
      </mesh>

      {/* Wheels */}
      <group position={[-1.02, 0.32, 1.8]} rotation={[0, steeringAngle, 0]}>
        <DetailedWheel radius={0.34} width={0.22} rotationX={wheelRotation} />
      </group>
      <group position={[1.02, 0.32, 1.8]} rotation={[0, steeringAngle, 0]}>
        <DetailedWheel radius={0.34} width={0.22} rotationX={wheelRotation} />
      </group>
      <group position={[-1.02, 0.32, -1.8]}>
        <DetailedWheel radius={0.34} width={0.22} rotationX={wheelRotation} />
      </group>
      <group position={[1.02, 0.32, -1.8]}>
        <DetailedWheel radius={0.34} width={0.22} rotationX={wheelRotation} />
      </group>
    </group>
  );
}

/**
 * 5. City Transit Metro Bus (GLB Model + Illuminated Route Sign)
 */
export function ModernBusModel({
  isNight = false,
  isBraking = false,
  steeringAngle = 0,
  wheelRotation = 0,
}: VehicleVisualProps) {
  const bodyScene = useUpgradedVehicleGLB('/models/vehicles/bus.glb', '#0284c7', isNight, isBraking);

  return (
    <group>
      <VehicleContactShadow width={2.7} length={9.9} />

      {/* Scaled to 9.72m length, 2.70m width, 2.80m height */}
      <group position={[0, 0, 0]} rotation={[0, Math.PI, 0]} scale={[5.4, 5.4, 5.4]}>
        <primitive object={bodyScene} />
      </group>

      {/* Front Illuminated Destination Display ("METRO TECH TRANSIT") */}
      <mesh position={[0, 2.45, 4.88]}>
        <boxGeometry args={[1.8, 0.28, 0.05]} />
        <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={2.8} />
      </mesh>

      {/* Night Headlights */}
      {isNight && (
        <group position={[0, 0.65, 4.9]}>
          <spotLight color="#fef08a" intensity={4.2} angle={0.52} penumbra={0.5} distance={20} />
        </group>
      )}

      {/* Rear Taillight / Brake Lights */}
      <mesh position={[-0.95, 0.85, -4.9]}>
        <boxGeometry args={[0.22, 0.7, 0.04]} />
        <primitive object={isBraking ? _taillightBrakeMat : _taillightCruiseMat} attach="material" />
      </mesh>
      <mesh position={[0.95, 0.85, -4.9]}>
        <boxGeometry args={[0.22, 0.7, 0.04]} />
        <primitive object={isBraking ? _taillightBrakeMat : _taillightCruiseMat} attach="material" />
      </mesh>

      {/* Heavy-Duty Dual Axle Wheels */}
      <group position={[-1.2, 0.42, 2.8]} rotation={[0, steeringAngle, 0]}>
        <DetailedWheel radius={0.42} width={0.26} rotationX={wheelRotation} />
      </group>
      <group position={[1.2, 0.42, 2.8]} rotation={[0, steeringAngle, 0]}>
        <DetailedWheel radius={0.42} width={0.26} rotationX={wheelRotation} />
      </group>
      <group position={[-1.2, 0.42, -2.6]}>
        <DetailedWheel radius={0.42} width={0.26} rotationX={wheelRotation} />
      </group>
      <group position={[1.2, 0.42, -2.6]}>
        <DetailedWheel radius={0.42} width={0.26} rotationX={wheelRotation} />
      </group>
    </group>
  );
}

/**
 * 6. Modern Motorcycle / Scooter with Rider
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
        <primitive object={_darkTrimMat} attach="material" />
      </mesh>

      {/* Front Fork & Handlebars */}
      <group position={[0, 0.65, 0.65]} rotation={[0, steeringAngle, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.6, 6]} />
          <primitive object={_chromeMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.68, 6]} />
          <primitive object={_darkTrimMat} attach="material" />
        </mesh>
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

      {/* Spoke Wheels */}
      <group position={[0, 0.28, 0.75]} rotation={[0, steeringAngle, 0]}>
        <DetailedWheel radius={0.28} width={0.12} rotationX={wheelRotation} />
      </group>
      <group position={[0, 0.28, -0.65]}>
        <DetailedWheel radius={0.28} width={0.14} rotationX={wheelRotation} />
      </group>

      {/* Articulated Rider Silhouette */}
      <group position={[0, 0.85, -0.15]}>
        <mesh position={[0, 0.18, 0]} rotation={[0.25, 0, 0]} castShadow>
          <boxGeometry args={[0.34, 0.45, 0.22]} />
          <primitive object={_darkTrimMat} attach="material" />
        </mesh>
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

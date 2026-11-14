'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getTrafficSignalState, SignalPhase } from './CityTrafficSignals';

interface RealisticTrafficSignalsProps {
  timeOfDay?: string;
}

// ============================================================================
// SHARED MATERIALS & GEOMETRIES FOR TRAFFIC SIGNALS (Zero GC Heap Churn)
// ============================================================================
const _poleMat = new THREE.MeshStandardMaterial({
  color: '#334155',
  metalness: 0.85,
  roughness: 0.3,
});

const _signalHousingMat = new THREE.MeshStandardMaterial({
  color: '#0f172a',
  metalness: 0.9,
  roughness: 0.35,
});

const _hoodMat = new THREE.MeshStandardMaterial({
  color: '#020617',
  roughness: 0.8,
});

// Vehicular Signal Light Materials
const _redOnMat = new THREE.MeshStandardMaterial({
  color: '#ef4444',
  emissive: '#dc2626',
  emissiveIntensity: 3.5,
  roughness: 0.1,
});
const _redOffMat = new THREE.MeshStandardMaterial({ color: '#450a0a', roughness: 0.6 });

const _yellowOnMat = new THREE.MeshStandardMaterial({
  color: '#facc15',
  emissive: '#eab308',
  emissiveIntensity: 3.5,
  roughness: 0.1,
});
const _yellowOffMat = new THREE.MeshStandardMaterial({ color: '#422006', roughness: 0.6 });

const _greenOnMat = new THREE.MeshStandardMaterial({
  color: '#22c55e',
  emissive: '#16a34a',
  emissiveIntensity: 3.5,
  roughness: 0.1,
});
const _greenOffMat = new THREE.MeshStandardMaterial({ color: '#052e16', roughness: 0.6 });

// Pedestrian Signal Light Materials
const _pedDontWalkOnMat = new THREE.MeshStandardMaterial({
  color: '#ef4444',
  emissive: '#dc2626',
  emissiveIntensity: 3.2,
  roughness: 0.1,
});
const _pedDontWalkOffMat = new THREE.MeshStandardMaterial({ color: '#450a0a', roughness: 0.7 });

const _pedWalkOnMat = new THREE.MeshStandardMaterial({
  color: '#38bdf8',
  emissive: '#0284c7',
  emissiveIntensity: 3.4,
  roughness: 0.1,
});
const _pedWalkOffMat = new THREE.MeshStandardMaterial({ color: '#082f49', roughness: 0.7 });

/**
 * 3-Aspect Vehicular Signal Head (Red, Yellow, Green)
 */
function VehicularSignalHead({ phase }: { phase: SignalPhase }) {
  return (
    <group>
      {/* Housing Box with Backing Plate */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.34, 0.94, 0.22]} />
        <primitive object={_signalHousingMat} attach="material" />
      </mesh>
      {/* Backing Shield Border */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[0.44, 1.04, 0.02]} />
        <primitive object={_signalHousingMat} attach="material" />
      </mesh>

      {/* Red Lens (Top) */}
      <group position={[0, 0.28, 0.11]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.085, 0.085, 0.04, 16]} />
          <primitive object={phase === 'red' ? _redOnMat : _redOffMat} attach="material" />
        </mesh>
        {/* Visor Hood */}
        <mesh position={[0, 0.06, 0.05]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.2, 0.02, 0.12]} />
          <primitive object={_hoodMat} attach="material" />
        </mesh>
      </group>

      {/* Yellow / Amber Lens (Middle) */}
      <group position={[0, 0, 0.11]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.085, 0.085, 0.04, 16]} />
          <primitive object={phase === 'yellow' ? _yellowOnMat : _yellowOffMat} attach="material" />
        </mesh>
        {/* Visor Hood */}
        <mesh position={[0, 0.06, 0.05]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.2, 0.02, 0.12]} />
          <primitive object={_hoodMat} attach="material" />
        </mesh>
      </group>

      {/* Green Lens (Bottom) */}
      <group position={[0, -0.28, 0.11]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.085, 0.085, 0.04, 16]} />
          <primitive object={phase === 'green' ? _greenOnMat : _greenOffMat} attach="material" />
        </mesh>
        {/* Visor Hood */}
        <mesh position={[0, 0.06, 0.05]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.2, 0.02, 0.12]} />
          <primitive object={_hoodMat} attach="material" />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Pedestrian Crossing Signal Head (DON'T WALK hand / WALK pedestrian)
 */
function PedestrianSignalHead({ isWalk }: { isWalk: boolean }) {
  return (
    <group>
      {/* Pedestrian Housing */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.26, 0.52, 0.16]} />
        <primitive object={_signalHousingMat} attach="material" />
      </mesh>

      {/* DON'T WALK Section (Top) */}
      <mesh position={[0, 0.12, 0.08]}>
        <boxGeometry args={[0.16, 0.16, 0.02]} />
        <primitive object={!isWalk ? _pedDontWalkOnMat : _pedDontWalkOffMat} attach="material" />
      </mesh>

      {/* WALK Section (Bottom) */}
      <mesh position={[0, -0.12, 0.08]}>
        <boxGeometry args={[0.16, 0.16, 0.02]} />
        <primitive object={isWalk ? _pedWalkOnMat : _pedWalkOffMat} attach="material" />
      </mesh>
    </group>
  );
}

/**
 * Complete Signal Gantry Post with Overhead Arm and Pedestrian Head
 */
function SignalGantryPost({
  position,
  rotationY,
  vehicularPhase,
  pedestrianWalk,
}: {
  position: [number, number, number];
  rotationY: number;
  vehicularPhase: SignalPhase;
  pedestrianWalk: boolean;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Base Foundation Plate */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.24, 0.2, 8]} />
        <primitive object={_poleMat} attach="material" />
      </mesh>

      {/* Vertical Mast (3.8m) */}
      <mesh position={[0, 2.0, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 3.8, 8]} />
        <primitive object={_poleMat} attach="material" />
      </mesh>

      {/* Horizontal Cantilever Arm extending toward the road lane */}
      <mesh position={[0.95, 3.75, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.05, 0.065, 1.9, 8]} />
        <primitive object={_poleMat} attach="material" />
      </mesh>

      {/* Overhead Vehicular Signal (facing oncoming traffic lane) */}
      <group position={[1.65, 3.45, 0]}>
        <VehicularSignalHead phase={vehicularPhase} />
      </group>

      {/* Lower Secondary Vehicular Signal on upright mast */}
      <group position={[0.15, 2.65, 0]} rotation={[0, 0, 0]}>
        <VehicularSignalHead phase={vehicularPhase} />
      </group>

      {/* Pedestrian Crossing Signal on mast facing crosswalk */}
      <group position={[0, 1.6, 0.14]} rotation={[0, 0, 0]}>
        <PedestrianSignalHead isWalk={pedestrianWalk} />
      </group>
    </group>
  );
}

/**
 * Coordinated 4-Corner Intersection Traffic Signals Component
 */
export const RealisticTrafficSignals: React.FC<RealisticTrafficSignalsProps> = () => {
  const signalRef = useRef({
    nsVehiclePhase: 'green' as SignalPhase,
    ewVehiclePhase: 'red' as SignalPhase,
    nsCrosswalkWalk: false,
    ewCrosswalkWalk: true,
  });

  const [, forceRender] = React.useState(0);

  // Poll signal state smoothly every frame
  useFrame(() => {
    const timeSec = performance.now() * 0.001;
    const state = getTrafficSignalState(timeSec);

    // If state changed phase, trigger visual re-render of lenses
    if (
      state.nsVehiclePhase !== signalRef.current.nsVehiclePhase ||
      state.ewVehiclePhase !== signalRef.current.ewVehiclePhase ||
      state.nsCrosswalkWalk !== signalRef.current.nsCrosswalkWalk ||
      state.ewCrosswalkWalk !== signalRef.current.ewCrosswalkWalk
    ) {
      signalRef.current = state;
      forceRender((c) => c + 1);
    }
  });

  const { nsVehiclePhase, ewVehiclePhase, nsCrosswalkWalk, ewCrosswalkWalk } = signalRef.current;

  return (
    <group name="IntersectionTrafficSignals">
      {/* 1. Northwest Corner (Controls Southbound Avenue traffic & Eastbound crosswalk) */}
      <SignalGantryPost
        position={[-3.6, 0.74, -3.6]}
        rotationY={0} // Facing Southbound traffic (+Z)
        vehicularPhase={nsVehiclePhase}
        pedestrianWalk={ewCrosswalkWalk}
      />

      {/* 2. Northeast Corner (Controls Westbound Boulevard traffic & Northbound crosswalk) */}
      <SignalGantryPost
        position={[3.6, 0.74, -3.6]}
        rotationY={-Math.PI / 2} // Facing Westbound traffic (-X)
        vehicularPhase={ewVehiclePhase}
        pedestrianWalk={nsCrosswalkWalk}
      />

      {/* 3. Southeast Corner (Controls Northbound Avenue traffic & Westbound crosswalk) */}
      <SignalGantryPost
        position={[3.6, 0.74, 3.6]}
        rotationY={Math.PI} // Facing Northbound traffic (-Z)
        vehicularPhase={nsVehiclePhase}
        pedestrianWalk={ewCrosswalkWalk}
      />

      {/* 4. Southwest Corner (Controls Eastbound Boulevard traffic & Southbound crosswalk) */}
      <SignalGantryPost
        position={[-3.6, 0.74, 3.6]}
        rotationY={Math.PI / 2} // Facing Eastbound traffic (+X)
        vehicularPhase={ewVehiclePhase}
        pedestrianWalk={nsCrosswalkWalk}
      />
    </group>
  );
};

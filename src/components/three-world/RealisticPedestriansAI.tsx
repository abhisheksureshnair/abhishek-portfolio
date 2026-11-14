'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getTrafficSignalState } from './CityTrafficSignals';
import { usePerformanceQuality } from '../PerformanceControl';

interface RealisticPedestriansAIProps {
  playerPosRef?: React.MutableRefObject<THREE.Vector3>;
}

// ============================================================================
// SHARED MATERIALS FOR HUMANS (Zero GC Heap Duplication)
// ============================================================================
const _skinTones = [
  new THREE.MeshStandardMaterial({ color: '#f5d0b0', roughness: 0.65 }), // Light
  new THREE.MeshStandardMaterial({ color: '#e2ba99', roughness: 0.65 }), // Medium warm
  new THREE.MeshStandardMaterial({ color: '#c68642', roughness: 0.65 }), // Tan / olive
  new THREE.MeshStandardMaterial({ color: '#8d5524', roughness: 0.65 }), // Deep bronze
];

const _hairColors = [
  new THREE.MeshStandardMaterial({ color: '#1c1917', roughness: 0.8 }), // Black
  new THREE.MeshStandardMaterial({ color: '#451a03', roughness: 0.8 }), // Dark Brown
  new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.75 }), // Chestnut
  new THREE.MeshStandardMaterial({ color: '#ca8a04', roughness: 0.75 }), // Blonde
];

const _clothingPants = [
  new THREE.MeshStandardMaterial({ color: '#090d16', roughness: 0.8 }), // Charcoal dark
  new THREE.MeshStandardMaterial({ color: '#1e3a8a', roughness: 0.8 }), // Denim blue
  new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.8 }), // Slate
  new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.75 }), // Khaki
];

const _shoesMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.4 });
const _darkShoesMat = new THREE.MeshStandardMaterial({ color: '#18181b', roughness: 0.5 });
const _phoneMat = new THREE.MeshStandardMaterial({
  color: '#0f172a',
  emissive: '#38bdf8',
  emissiveIntensity: 0.8,
  roughness: 0.2,
});
const _briefcaseMat = new THREE.MeshStandardMaterial({ color: '#451a03', roughness: 0.4, metalness: 0.2 });

const _pedContactShadowMat = new THREE.MeshBasicMaterial({
  color: '#020617',
  transparent: true,
  opacity: 0.4,
});

export type PedestrianArchetype = 'commuter' | 'casual' | 'urban' | 'tech' | 'seated';

export interface PedestrianConfig {
  id: string;
  archetype: PedestrianArchetype;
  jacketColor: string;
  skinToneIdx: number;
  hairIdx: number;
  pantsIdx: number;
  heightScale: number;
  // Sidewalk or Crosswalk Route
  routeType: 'sidewalk-loop' | 'crosswalk-ns' | 'crosswalk-ew' | 'bench-seated';
  startX: number;
  startZ: number;
  targetX: number;
  targetZ: number;
  walkingSpeed: number; // m/s
  seatedPosition?: [number, number, number];
  seatedRotationY?: number;
}

/**
 * Detailed 3D Human Model with Articulated Limbs and Clothing Styles
 */
function DetailedHumanMesh({
  config,
  stridePhase = 0,
  isWalking = true,
  isHoldingPhone = false,
  isSeated = false,
}: {
  config: PedestrianConfig;
  stridePhase?: number;
  isWalking?: boolean;
  isHoldingPhone?: boolean;
  isSeated?: boolean;
}) {
  const skinMat = _skinTones[config.skinToneIdx % _skinTones.length];
  const hairMat = _hairColors[config.hairIdx % _hairColors.length];
  const pantsMat = _clothingPants[config.pantsIdx % _clothingPants.length];
  const jacketMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: config.jacketColor, roughness: 0.7 }),
    [config.jacketColor]
  );

  const stride = isWalking ? Math.sin(stridePhase) * 0.48 : 0;
  const armStride = isWalking ? -Math.sin(stridePhase) * 0.42 : 0;
  const bounce = isWalking ? Math.abs(Math.sin(stridePhase)) * 0.04 : 0;

  if (isSeated) {
    // Seated Pose on Park Bench
    return (
      <group scale={[config.heightScale, config.heightScale, config.heightScale]}>
        {/* Soft Shadow */}
        <mesh position={[0, -0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.55, 0.55]} />
          <primitive object={_pedContactShadowMat} attach="material" />
        </mesh>

        {/* Torso & Head */}
        <group position={[0, 0.42, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.38, 0.48, 0.22]} />
            <primitive object={jacketMat} attach="material" />
          </mesh>
          <mesh position={[0, 0.38, 0]} castShadow>
            <sphereGeometry args={[0.12, 12, 12]} />
            <primitive object={skinMat} attach="material" />
          </mesh>
          <mesh position={[0, 0.42, -0.02]} castShadow>
            <sphereGeometry args={[0.125, 12, 12]} />
            <primitive object={hairMat} attach="material" />
          </mesh>
        </group>

        {/* Thighs Horizontal Forward */}
        <mesh position={[-0.1, 0.16, 0.16]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.32, 4, 6]} />
          <primitive object={pantsMat} attach="material" />
        </mesh>
        <mesh position={[0.1, 0.16, 0.16]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.32, 4, 6]} />
          <primitive object={pantsMat} attach="material" />
        </mesh>

        {/* Calves Vertical Down */}
        <mesh position={[-0.1, -0.08, 0.34]} castShadow>
          <capsuleGeometry args={[0.065, 0.32, 4, 6]} />
          <primitive object={pantsMat} attach="material" />
        </mesh>
        <mesh position={[0.1, -0.08, 0.34]} castShadow>
          <capsuleGeometry args={[0.065, 0.32, 4, 6]} />
          <primitive object={pantsMat} attach="material" />
        </mesh>

        {/* Hands Resting on Lap */}
        <mesh position={[-0.1, 0.22, 0.28]} castShadow>
          <sphereGeometry args={[0.04, 6, 6]} />
          <primitive object={skinMat} attach="material" />
        </mesh>
        <mesh position={[0.1, 0.22, 0.28]} castShadow>
          <sphereGeometry args={[0.04, 6, 6]} />
          <primitive object={skinMat} attach="material" />
        </mesh>
      </group>
    );
  }

  return (
    <group scale={[config.heightScale, config.heightScale, config.heightScale]}>
      {/* Contact Shadow Decal under feet */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.55, 0.55]} />
        <primitive object={_pedContactShadowMat} attach="material" />
      </mesh>

      {/* Pelvis & Upper Body with Walk Bounce */}
      <group position={[0, 0.88 + bounce, 0]}>
        {/* Torso / Jacket */}
        <mesh position={[0, 0.26, 0]} castShadow>
          <boxGeometry args={[0.38, 0.48, 0.22]} />
          <primitive object={jacketMat} attach="material" />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 0.54, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 0.1, 8]} />
          <primitive object={skinMat} attach="material" />
        </mesh>

        {/* Head Cranium */}
        <mesh position={[0, 0.68, 0]} castShadow>
          <sphereGeometry args={[0.12, 12, 12]} />
          <primitive object={skinMat} attach="material" />
        </mesh>

        {/* Hair */}
        <mesh position={[0, 0.73, -0.02]} castShadow>
          <sphereGeometry args={[0.13, 12, 12]} />
          <primitive object={hairMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.78, 0.05]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.14, 0.06, 0.08]} />
          <primitive object={hairMat} attach="material" />
        </mesh>

        {/* Left Arm */}
        <group position={[-0.24, 0.42, 0]} rotation={[armStride, 0, 0]}>
          <mesh position={[0, -0.2, 0]} castShadow>
            <capsuleGeometry args={[0.055, 0.3, 4, 6]} />
            <primitive object={jacketMat} attach="material" />
          </mesh>
          <mesh position={[0, -0.38, 0]} castShadow>
            <sphereGeometry args={[0.04, 6, 6]} />
            <primitive object={skinMat} attach="material" />
          </mesh>
          {/* Commuter Briefcase */}
          {config.archetype === 'commuter' && (
            <mesh position={[-0.08, -0.42, 0]} castShadow>
              <boxGeometry args={[0.08, 0.26, 0.36]} />
              <primitive object={_briefcaseMat} attach="material" />
            </mesh>
          )}
        </group>

        {/* Right Arm (Normal Swing or Holding Smartphone) */}
        {isHoldingPhone ? (
          <group position={[0.24, 0.42, 0]} rotation={[-0.95, -0.4, 0]}>
            <mesh position={[0, -0.18, 0]} castShadow>
              <capsuleGeometry args={[0.055, 0.28, 4, 6]} />
              <primitive object={jacketMat} attach="material" />
            </mesh>
            <mesh position={[0, -0.34, 0]} castShadow>
              <sphereGeometry args={[0.04, 6, 6]} />
              <primitive object={skinMat} attach="material" />
            </mesh>
            {/* Illuminated Smartphone */}
            <mesh position={[0, -0.36, 0.06]} rotation={[0.4, 0, 0]}>
              <boxGeometry args={[0.08, 0.14, 0.015]} />
              <primitive object={_phoneMat} attach="material" />
            </mesh>
          </group>
        ) : (
          <group position={[0.24, 0.42, 0]} rotation={[-armStride, 0, 0]}>
            <mesh position={[0, -0.2, 0]} castShadow>
              <capsuleGeometry args={[0.055, 0.3, 4, 6]} />
              <primitive object={jacketMat} attach="material" />
            </mesh>
            <mesh position={[0, -0.38, 0]} castShadow>
              <sphereGeometry args={[0.04, 6, 6]} />
              <primitive object={skinMat} attach="material" />
            </mesh>
          </group>
        )}

        {/* Left Leg */}
        <group position={[-0.11, 0, 0]} rotation={[stride, 0, 0]}>
          <mesh position={[0, -0.38, 0]} castShadow>
            <capsuleGeometry args={[0.07, 0.54, 4, 6]} />
            <primitive object={pantsMat} attach="material" />
          </mesh>
          <mesh position={[0, -0.82, 0.04]} castShadow>
            <boxGeometry args={[0.1, 0.08, 0.22]} />
            <primitive object={config.archetype === 'commuter' ? _darkShoesMat : _shoesMat} attach="material" />
          </mesh>
        </group>

        {/* Right Leg */}
        <group position={[0.11, 0, 0]} rotation={[-stride, 0, 0]}>
          <mesh position={[0, -0.38, 0]} castShadow>
            <capsuleGeometry args={[0.07, 0.54, 4, 6]} />
            <primitive object={pantsMat} attach="material" />
          </mesh>
          <mesh position={[0, -0.82, 0.04]} castShadow>
            <boxGeometry args={[0.1, 0.08, 0.22]} />
            <primitive object={config.archetype === 'commuter' ? _darkShoesMat : _shoesMat} attach="material" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/**
 * Intelligent Pedestrian AI System Component
 */
export const RealisticPedestriansAI: React.FC<RealisticPedestriansAIProps> = ({
  playerPosRef,
}) => {
  const { effectiveTier } = usePerformanceQuality();

  // Diverse Pedestrian Roster Populating Sidewalks, Crossings & Benches
  const pedestriansRef = useRef<(PedestrianConfig & {
    x: number;
    y: number;
    z: number;
    heading: number;
    progress: number;
    stridePhase: number;
    isWalking: boolean;
    isHoldingPhone: boolean;
    waitingForSignal: boolean;
  })[]>([
    // 1. Commuter Crossing North-South Avenue on West Crosswalk
    {
      id: 'ped-cross-ns-1',
      archetype: 'commuter',
      jacketColor: '#1e293b',
      skinToneIdx: 1,
      hairIdx: 0,
      pantsIdx: 0,
      heightScale: 1.0,
      routeType: 'crosswalk-ns',
      startX: -3.8,
      startZ: -3.8,
      targetX: 3.8,
      targetZ: -3.8,
      walkingSpeed: 1.3,
      x: -3.8,
      y: 0.74,
      z: -3.8,
      heading: Math.PI / 2,
      progress: 0.1,
      stridePhase: 0,
      isWalking: true,
      isHoldingPhone: false,
      waitingForSignal: false,
    },
    // 2. Tech Urbanite with Smartphone Crossing North-South Avenue on East Crosswalk
    {
      id: 'ped-cross-ns-2',
      archetype: 'tech',
      jacketColor: '#0284c7',
      skinToneIdx: 2,
      hairIdx: 1,
      pantsIdx: 1,
      heightScale: 1.02,
      routeType: 'crosswalk-ns',
      startX: 3.8,
      startZ: 3.8,
      targetX: -3.8,
      targetZ: 3.8,
      walkingSpeed: 1.25,
      x: 3.8,
      y: 0.74,
      z: 3.8,
      heading: -Math.PI / 2,
      progress: 0.7,
      stridePhase: 1.5,
      isWalking: true,
      isHoldingPhone: true,
      waitingForSignal: false,
    },
    // 3. Casual Pedestrian Crossing East-West Boulevard
    {
      id: 'ped-cross-ew-1',
      archetype: 'casual',
      jacketColor: '#dc2626',
      skinToneIdx: 0,
      hairIdx: 2,
      pantsIdx: 2,
      heightScale: 0.98,
      routeType: 'crosswalk-ew',
      startX: -3.8,
      startZ: -3.8,
      targetX: -3.8,
      targetZ: 3.8,
      walkingSpeed: 1.35,
      x: -3.8,
      y: 0.74,
      z: -3.8,
      heading: 0,
      progress: 0.3,
      stridePhase: 2.2,
      isWalking: true,
      isHoldingPhone: false,
      waitingForSignal: false,
    },
    // 4. Urban Commuter Crossing East-West Boulevard (East Side)
    {
      id: 'ped-cross-ew-2',
      archetype: 'urban',
      jacketColor: '#059669',
      skinToneIdx: 3,
      hairIdx: 0,
      pantsIdx: 0,
      heightScale: 1.04,
      routeType: 'crosswalk-ew',
      startX: 3.8,
      startZ: 3.8,
      targetX: 3.8,
      targetZ: -3.8,
      walkingSpeed: 1.2,
      x: 3.8,
      y: 0.74,
      z: 3.8,
      heading: Math.PI,
      progress: 0.85,
      stridePhase: 3.0,
      isWalking: true,
      isHoldingPhone: false,
      waitingForSignal: false,
    },
    // 5. Strolling on Northwest Sidewalk Promenade
    {
      id: 'ped-sidewalk-1',
      archetype: 'urban',
      jacketColor: '#9333ea',
      skinToneIdx: 1,
      hairIdx: 3,
      pantsIdx: 1,
      heightScale: 0.96,
      routeType: 'sidewalk-loop',
      startX: -4.2,
      startZ: -6.0,
      targetX: -4.2,
      targetZ: -24.0,
      walkingSpeed: 1.15,
      x: -4.2,
      y: 0.74,
      z: -12.0,
      heading: Math.PI,
      progress: 0.4,
      stridePhase: 0.8,
      isWalking: true,
      isHoldingPhone: true,
      waitingForSignal: false,
    },
    // 6. Strolling on Northeast Sidewalk Promenade
    {
      id: 'ped-sidewalk-2',
      archetype: 'casual',
      jacketColor: '#f59e0b',
      skinToneIdx: 2,
      hairIdx: 1,
      pantsIdx: 2,
      heightScale: 1.0,
      routeType: 'sidewalk-loop',
      startX: 4.2,
      startZ: -22.0,
      targetX: 4.2,
      targetZ: -6.0,
      walkingSpeed: 1.3,
      x: 4.2,
      y: 0.74,
      z: -14.0,
      heading: 0,
      progress: 0.6,
      stridePhase: 1.9,
      isWalking: true,
      isHoldingPhone: false,
      waitingForSignal: false,
    },
    // 7. Strolling on Southeast Sidewalk near Skills Tower
    {
      id: 'ped-sidewalk-3',
      archetype: 'tech',
      jacketColor: '#06b6d4',
      skinToneIdx: 0,
      hairIdx: 0,
      pantsIdx: 0,
      heightScale: 1.02,
      routeType: 'sidewalk-loop',
      startX: 4.2,
      startZ: 6.0,
      targetX: 4.2,
      targetZ: 24.0,
      walkingSpeed: 1.25,
      x: 4.2,
      y: 0.74,
      z: 14.0,
      heading: 0,
      progress: 0.35,
      stridePhase: 2.7,
      isWalking: true,
      isHoldingPhone: false,
      waitingForSignal: false,
    },
    // 8. Seated on Park Bench (West Promenade at [-4.2, 0.74, -7.5])
    {
      id: 'ped-bench-1',
      archetype: 'seated',
      jacketColor: '#475569',
      skinToneIdx: 1,
      hairIdx: 2,
      pantsIdx: 3,
      heightScale: 1.0,
      routeType: 'bench-seated',
      startX: -4.2,
      startZ: -7.5,
      targetX: -4.2,
      targetZ: -7.5,
      walkingSpeed: 0,
      x: -4.2,
      y: 0.74,
      z: -7.5,
      heading: Math.PI / 2, // Facing avenue
      progress: 0,
      stridePhase: 0,
      isWalking: false,
      isHoldingPhone: false,
      waitingForSignal: false,
      seatedPosition: [-4.2, 0.74, -7.5],
      seatedRotationY: Math.PI / 2,
    },
    // 9. Seated on Park Bench (East Promenade at [4.2, 0.74, 7.5])
    {
      id: 'ped-bench-2',
      archetype: 'seated',
      jacketColor: '#ea580c',
      skinToneIdx: 2,
      hairIdx: 0,
      pantsIdx: 1,
      heightScale: 0.98,
      routeType: 'bench-seated',
      startX: 4.2,
      startZ: 7.5,
      targetX: 4.2,
      targetZ: 7.5,
      walkingSpeed: 0,
      x: 4.2,
      y: 0.74,
      z: 7.5,
      heading: -Math.PI / 2, // Facing avenue
      progress: 0,
      stridePhase: 0,
      isWalking: false,
      isHoldingPhone: true,
      waitingForSignal: false,
      seatedPosition: [4.2, 0.74, 7.5],
      seatedRotationY: -Math.PI / 2,
    },
  ]);

  const groupRefs = useRef<(THREE.Group | null)[]>([]);

  // Filter according to quality tier
  const activeCount = useMemo(() => {
    if (effectiveTier === 'low') return 4;
    if (effectiveTier === 'medium') return 6;
    return pedestriansRef.current.length; // 9 on high
  }, [effectiveTier]);

  useFrame((_, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    const dt = Math.min(delta, 0.08);
    const timeSec = performance.now() * 0.001;
    const signalState = getTrafficSignalState(timeSec);

    const pPos = playerPosRef?.current;
    const peds = pedestriansRef.current;

    for (let i = 0; i < activeCount; i++) {
      const p = peds[i];
      if (p.routeType === 'bench-seated') continue;

      let canWalk = true;

      // 1. Crosswalk Traffic Signal Compliance
      if (p.routeType === 'crosswalk-ns') {
        // Crossing across North-South Avenue: only safe if nsCrosswalkWalk is TRUE!
        const isNearCurb = p.progress < 0.15 || p.progress > 0.85;
        if (isNearCurb && !signalState.nsCrosswalkWalk) {
          canWalk = false;
          p.waitingForSignal = true;
        } else {
          p.waitingForSignal = false;
        }
      } else if (p.routeType === 'crosswalk-ew') {
        // Crossing across East-West Boulevard: only safe if ewCrosswalkWalk is TRUE!
        const isNearCurb = p.progress < 0.15 || p.progress > 0.85;
        if (isNearCurb && !signalState.ewCrosswalkWalk) {
          canWalk = false;
          p.waitingForSignal = true;
        } else {
          p.waitingForSignal = false;
        }
      }

      // 2. Local Avoidance of Player Avatar
      let lateralAvoidanceX = 0;
      let lateralAvoidanceZ = 0;
      if (pPos) {
        const toPlayerX = pPos.x - p.x;
        const toPlayerZ = pPos.z - p.z;
        const distToPlayer = Math.hypot(toPlayerX, toPlayerZ);

        if (distToPlayer < 1.6 && distToPlayer > 0.01) {
          // Gently push lateral direction perpendicular to travel
          const push = (1.6 - distToPlayer) * 0.8;
          lateralAvoidanceX = (-toPlayerX / distToPlayer) * push;
          lateralAvoidanceZ = (-toPlayerZ / distToPlayer) * push;
        }
      }

      // 3. Advance Progress along Route
      if (canWalk) {
        p.isWalking = true;
        p.progress += (p.walkingSpeed * dt) / Math.hypot(p.targetX - p.startX, p.targetZ - p.startZ);

        // Turn around upon reaching end of path
        if (p.progress >= 1.0) {
          p.progress = 0;
          const tempX = p.startX;
          const tempZ = p.startZ;
          p.startX = p.targetX;
          p.startZ = p.targetZ;
          p.targetX = tempX;
          p.targetZ = tempZ;
        }

        // Interpolate world position
        p.x = p.startX + (p.targetX - p.startX) * p.progress + lateralAvoidanceX;
        p.z = p.startZ + (p.targetZ - p.startZ) * p.progress + lateralAvoidanceZ;

        // Street level vs Sidewalk step down:
        // When crossing road (progress between 0.12 and 0.88), step down to road height Y = 0.62
        const isCrossingRoad =
          (p.routeType === 'crosswalk-ns' || p.routeType === 'crosswalk-ew') &&
          p.progress > 0.12 &&
          p.progress < 0.88;
        p.y = isCrossingRoad ? 0.62 : 0.74;

        // Heading direction
        const dx = p.targetX - p.startX;
        const dz = p.targetZ - p.startZ;
        p.heading = Math.atan2(dx, dz);

        // Stride cadence
        p.stridePhase += dt * (p.walkingSpeed * 6.5);
      } else {
        // Idle Waiting State
        p.isWalking = false;
        p.stridePhase = 0;
      }

      // 4. Update Three.js Group Directly
      const grp = groupRefs.current[i];
      if (grp) {
        grp.position.set(p.x, p.y, p.z);
        grp.rotation.y = p.heading;
      }
    }
  });

  return (
    <group name="RealisticPedestriansAI">
      {pedestriansRef.current.slice(0, activeCount).map((p, idx) => (
        <group
          key={p.id}
          ref={(el) => {
            groupRefs.current[idx] = el;
          }}
          position={p.seatedPosition || [p.x, p.y, p.z]}
          rotation={[0, p.seatedRotationY ?? p.heading, 0]}
        >
          <DetailedHumanMesh
            config={p}
            stridePhase={p.stridePhase}
            isWalking={p.isWalking}
            isHoldingPhone={p.isHoldingPhone}
            isSeated={p.routeType === 'bench-seated'}
          />
        </group>
      ))}
    </group>
  );
};

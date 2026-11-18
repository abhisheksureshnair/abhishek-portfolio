'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { getTrafficSignalState } from './CityTrafficSignals';
import { usePerformanceQuality } from '../PerformanceControl';
import { getTreeContactShadowTexture } from './architecturalTextures';

// Preload all rigged character models and skeletal animation libraries
useGLTF.preload('/models/characters/Michelle.glb');
useGLTF.preload('/models/characters/Soldier.glb');
useGLTF.preload('/models/characters/Walking.glb');
useGLTF.preload('/models/characters/Standing_Idle.glb');
useGLTF.preload('/models/characters/Sitting_Idle.glb');
useGLTF.preload('/models/characters/Talking.glb');
useGLTF.preload('/models/characters/Texting_While_Standing.glb');

interface RealisticPedestriansAIProps {
  playerPosRef?: React.MutableRefObject<THREE.Vector3>;
}

export type PedestrianAction = 'walk' | 'idle' | 'sit' | 'talk' | 'text';

export interface PedestrianState {
  id: string;
  model: 'michelle' | 'soldier';
  clothingColor?: string;
  routeType: 'sidewalk-loop' | 'crosswalk-ns' | 'crosswalk-ew' | 'building-entrance' | 'static-talk' | 'static-text' | 'bench-seated';
  startX: number;
  startZ: number;
  targetX: number;
  targetZ: number;
  x: number;
  y: number;
  z: number;
  heading: number;
  progress: number;
  walkingSpeed: number;
  currentAction: PedestrianAction;
  initialAction: PedestrianAction;
  lateralAvoidX: number;
  lateralAvoidZ: number;
  phoneTimer?: number;
}

/**
 * Remove root-motion Z forward translation from walk clip
 * Ensures character walks in-place cleanly while pathing handles world navigation.
 */
function makeWalkInPlace(clip: THREE.AnimationClip): THREE.AnimationClip {
  const cloned = clip.clone();
  for (const track of cloned.tracks) {
    if (track.name.endsWith('.position')) {
      const vals = track.values;
      for (let i = 2; i < vals.length; i += 3) {
        vals[i] = 0; // Lock forward displacement to zero
      }
    }
  }
  return cloned;
}

/**
 * Individual Rigged 3D Character Instance
 * Features unique skeletal clone, smooth animation blending, contact shadow,
 * and distance-based LOD throttling.
 */
function RiggedPedestrianInstance({
  ped,
  model,
  clothingColor,
  michelleScene,
  soldierScene,
  walkClip,
  idleClip,
  sitClip,
  talkClip,
  textClip,
  contactShadowTex,
  playerPosRef,
}: {
  ped: PedestrianState;
  model: 'michelle' | 'soldier';
  clothingColor?: string;
  michelleScene: THREE.Group;
  soldierScene: THREE.Group;
  walkClip: THREE.AnimationClip;
  idleClip: THREE.AnimationClip;
  sitClip: THREE.AnimationClip;
  talkClip: THREE.AnimationClip;
  textClip: THREE.AnimationClip;
  contactShadowTex: THREE.Texture;
  playerPosRef?: React.MutableRefObject<THREE.Vector3>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<Record<PedestrianAction, THREE.AnimationAction | null>>({
    walk: null,
    idle: null,
    sit: null,
    talk: null,
    text: null,
  });
  const currentActionRef = useRef<PedestrianAction>(ped.initialAction);
  const frameCountRef = useRef<number>(0);

  // 1. Clone Unique Skinned Mesh Hierarchy for this character
  const charScene = useMemo(() => {
    const baseScene = model === 'michelle' ? michelleScene : soldierScene;
    const cloned = clone(baseScene);
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (clothingColor && mesh.material) {
          const mat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
          if (mat.color) {
            mat.color.set(clothingColor);
          }
          mesh.material = mat;
        }
      }
    });
    return cloned;
  }, [model, michelleScene, soldierScene, clothingColor]);

  // 2. Initialize Animation Mixer and bind all animation actions
  useEffect(() => {
    if (!charScene) return;
    const mixer = new THREE.AnimationMixer(charScene);
    mixerRef.current = mixer;

    actionsRef.current = {
      walk: walkClip ? mixer.clipAction(walkClip) : null,
      idle: idleClip ? mixer.clipAction(idleClip) : null,
      sit: sitClip ? mixer.clipAction(sitClip) : null,
      talk: talkClip ? mixer.clipAction(talkClip) : null,
      text: textClip ? mixer.clipAction(textClip) : null,
    };

    const initial = actionsRef.current[ped.initialAction];
    if (initial) {
      initial.play();
      currentActionRef.current = ped.initialAction;
    }

    return () => {
      mixer.stopAllAction();
    };
  }, [charScene, walkClip, idleClip, sitClip, talkClip, textClip, ped.initialAction]);

  // 3. Animation Blending, Navigation Synchronization & LOD
  useFrame((_, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    const dt = Math.min(delta, 0.08);

    // Distance-Based LOD Optimization
    const pPos = playerPosRef?.current;
    let distToPlayer = 10;
    if (pPos) {
      distToPlayer = Math.hypot(pPos.x - ped.x, pPos.z - ped.z);
    }

    // Skip skeletal update entirely if beyond 65 meters
    if (distToPlayer > 65) return;

    // Sub-sample updates for distant pedestrians (35m - 65m)
    frameCountRef.current++;
    if (distToPlayer > 35 && frameCountRef.current % 2 !== 0) {
      return;
    }

    // Smooth Cross-Fade Animation Blending when action state changes
    if (currentActionRef.current !== ped.currentAction) {
      const prevAction = actionsRef.current[currentActionRef.current];
      const nextAction = actionsRef.current[ped.currentAction];

      if (prevAction && nextAction && prevAction !== nextAction) {
        nextAction.reset();
        nextAction.crossFadeFrom(prevAction, 0.25, true);
        nextAction.play();
        currentActionRef.current = ped.currentAction;
      }
    }

    // Adjust walking stride timescale to synchronize with velocity
    if (ped.currentAction === 'walk' && actionsRef.current.walk) {
      actionsRef.current.walk.timeScale = Math.max(0.75, Math.min(1.4, ped.walkingSpeed / 1.3));
    }

    // Advance skeletal animation mixer
    mixerRef.current?.update(dt);

    // Update Three.js world transform
    if (groupRef.current) {
      groupRef.current.position.set(ped.x, ped.y, ped.z);
      groupRef.current.rotation.y = ped.heading;
    }
  });

  const scaleVal = model === 'michelle' ? 1.05 : 1.0;

  return (
    <group ref={groupRef} position={[ped.x, ped.y, ped.z]} rotation={[0, ped.heading, 0]} scale={[scaleVal, scaleVal, scaleVal]}>
      {/* Contact Shadow Decal under feet / bench */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial
          map={contactShadowTex}
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </mesh>

      {/* Rigged Skinned Mesh */}
      <primitive object={charScene} />
    </group>
  );
}

/**
 * Master Pedestrian AI System Component
 * Simulates active urban street life:
 * - Natural sidewalk walking loops
 * - Traffic light compliant crosswalk crossings
 * - Street cafe diners talking in small groups
 * - Seated pedestrians on park benches
 * - Smartphone texting pedestrians
 * - Local avoidance of player and approaching traffic
 */
export const RealisticPedestriansAI: React.FC<RealisticPedestriansAIProps> = ({
  playerPosRef,
}) => {
  const { effectiveTier } = usePerformanceQuality();

  // Load Character Base Models
  const michelleGLTF = useGLTF('/models/characters/Michelle.glb');
  const soldierGLTF = useGLTF('/models/characters/Soldier.glb');

  // Load Skeletal Animation Libraries
  const walkGLTF = useGLTF('/models/characters/Walking.glb');
  const idleGLTF = useGLTF('/models/characters/Standing_Idle.glb');
  const sitGLTF = useGLTF('/models/characters/Sitting_Idle.glb');
  const talkGLTF = useGLTF('/models/characters/Talking.glb');
  const textGLTF = useGLTF('/models/characters/Texting_While_Standing.glb');

  const contactShadowTex = useMemo(() => getTreeContactShadowTexture(), []);

  // Process In-Place Walking Animation Clip
  const walkClip = useMemo(() => {
    return walkGLTF.animations[0] ? makeWalkInPlace(walkGLTF.animations[0]) : null;
  }, [walkGLTF]);

  const idleClip = idleGLTF.animations[0] || null;
  const sitClip = sitGLTF.animations[0] || null;
  const talkClip = talkGLTF.animations[0] || null;
  const textClip = textGLTF.animations[0] || null;

  // Pedestrian Population Roster (13 Distinct Urban Characters)
  const pedestriansRef = useRef<PedestrianState[]>([
    // 1. Urban Shopper (Female - Michelle) on Northwest Sidewalk Promenade
    {
      id: 'ped-walker-1',
      model: 'michelle',
      clothingColor: '#0284c7', // Cyan / Sapphire dress
      routeType: 'sidewalk-loop',
      startX: -5.8,
      startZ: -22.0,
      targetX: -5.8,
      targetZ: -6.5,
      x: -5.8,
      y: 0.74,
      z: -14.0,
      heading: 0,
      progress: 0.5,
      walkingSpeed: 1.25,
      currentAction: 'walk',
      initialAction: 'walk',
      lateralAvoidX: 0,
      lateralAvoidZ: 0,
    },
    // 2. Tech Professional (Male - Soldier) on Northeast Sidewalk Promenade
    {
      id: 'ped-walker-2',
      model: 'soldier',
      clothingColor: '#1e293b', // Slate / Charcoal
      routeType: 'sidewalk-loop',
      startX: 5.8,
      startZ: -22.0,
      targetX: 5.8,
      targetZ: -6.5,
      x: 5.8,
      y: 0.74,
      z: -18.0,
      heading: 0,
      progress: 0.25,
      walkingSpeed: 1.3,
      currentAction: 'walk',
      initialAction: 'walk',
      lateralAvoidX: 0,
      lateralAvoidZ: 0,
    },
    // 3. Creative Consultant (Female - Michelle) on Southeast Sidewalk near Skills Tower
    {
      id: 'ped-walker-3',
      model: 'michelle',
      clothingColor: '#ea580c', // Terracotta dress
      routeType: 'sidewalk-loop',
      startX: 5.8,
      startZ: 6.5,
      targetX: 5.8,
      targetZ: 22.0,
      x: 5.8,
      y: 0.74,
      z: 14.0,
      heading: 0,
      progress: 0.45,
      walkingSpeed: 1.2,
      currentAction: 'walk',
      initialAction: 'walk',
      lateralAvoidX: 0,
      lateralAvoidZ: 0,
    },
    // 4. Boardwalk Stroller (Male - Soldier) along Waterfront Canal Promenade
    {
      id: 'ped-walker-4',
      model: 'soldier',
      clothingColor: '#059669', // Emerald jacket
      routeType: 'sidewalk-loop',
      startX: -19.6,
      startZ: -18.0,
      targetX: -19.6,
      targetZ: 18.0,
      x: -19.6,
      y: 0.74,
      z: 0.0,
      heading: 0,
      progress: 0.5,
      walkingSpeed: 1.35,
      currentAction: 'walk',
      initialAction: 'walk',
      lateralAvoidX: 0,
      lateralAvoidZ: 0,
    },
    // 5. Commuter Crossing North-South Avenue on North Zebra Crossing (Z = -3.8m)
    {
      id: 'ped-cross-ns-1',
      model: 'soldier',
      clothingColor: '#334155', // Charcoal commuter
      routeType: 'crosswalk-ns',
      startX: -5.8,
      startZ: -3.8,
      targetX: 5.8,
      targetZ: -3.8,
      x: -5.8,
      y: 0.74,
      z: -3.8,
      heading: Math.PI / 2,
      progress: 0.05,
      walkingSpeed: 1.3,
      currentAction: 'idle',
      initialAction: 'idle',
      lateralAvoidX: 0,
      lateralAvoidZ: 0,
    },
    // 6. Commuter Crossing North-South Avenue on South Zebra Crossing (Z = 3.8m)
    {
      id: 'ped-cross-ns-2',
      model: 'michelle',
      clothingColor: '#16a34a', // Forest green dress
      routeType: 'crosswalk-ns',
      startX: 5.8,
      startZ: 3.8,
      targetX: -5.8,
      targetZ: 3.8,
      x: 5.8,
      y: 0.74,
      z: 3.8,
      heading: -Math.PI / 2,
      progress: 0.1,
      walkingSpeed: 1.25,
      currentAction: 'idle',
      initialAction: 'idle',
      lateralAvoidX: 0,
      lateralAvoidZ: 0,
    },
    // 7. Pedestrian Crossing East-West Boulevard on West Crosswalk (X = -3.8m)
    {
      id: 'ped-cross-ew-1',
      model: 'michelle',
      clothingColor: '#dc2626', // Crimson red dress
      routeType: 'crosswalk-ew',
      startX: -3.8,
      startZ: -5.8,
      targetX: -3.8,
      targetZ: 5.8,
      x: -3.8,
      y: 0.74,
      z: -5.8,
      heading: 0,
      progress: 0.08,
      walkingSpeed: 1.3,
      currentAction: 'idle',
      initialAction: 'idle',
      lateralAvoidX: 0,
      lateralAvoidZ: 0,
    },
    // 8. Pedestrian Crossing East-West Boulevard on East Crosswalk (X = 3.8m)
    {
      id: 'ped-cross-ew-2',
      model: 'soldier',
      clothingColor: '#d97706', // Warm amber
      routeType: 'crosswalk-ew',
      startX: 3.8,
      startZ: 5.8,
      targetX: 3.8,
      targetZ: -5.8,
      x: 3.8,
      y: 0.74,
      z: 5.8,
      heading: Math.PI,
      progress: 0.06,
      walkingSpeed: 1.25,
      currentAction: 'idle',
      initialAction: 'idle',
      lateralAvoidX: 0,
      lateralAvoidZ: 0,
    },
    // 9. Smartphone Checking Pedestrian near Transit Pylon (X = -5.2m, Z = -10.5m)
    {
      id: 'ped-phone-1',
      model: 'michelle',
      clothingColor: '#9333ea', // Royal purple
      routeType: 'static-text',
      startX: -5.2,
      startZ: -10.5,
      targetX: -5.2,
      targetZ: -10.5,
      x: -5.2,
      y: 0.74,
      z: -10.5,
      heading: Math.PI * 0.25,
      progress: 0,
      walkingSpeed: 0,
      currentAction: 'text',
      initialAction: 'text',
      lateralAvoidX: 0,
      lateralAvoidZ: 0,
    },
    // 10. Café Patio Conversational Group A (Talking Pedestrian)
    {
      id: 'ped-talk-1',
      model: 'michelle',
      clothingColor: '#e11d48', // Rose dress
      routeType: 'static-talk',
      startX: -0.6,
      startZ: 2.1,
      targetX: -0.6,
      targetZ: 2.1,
      x: -0.6,
      y: 0.74,
      z: 2.1,
      heading: Math.PI * 0.15, // Facing companion
      progress: 0,
      walkingSpeed: 0,
      currentAction: 'talk',
      initialAction: 'talk',
      lateralAvoidX: 0,
      lateralAvoidZ: 0,
    },
    // 11. Café Patio Conversational Group B (Listening Companion)
    {
      id: 'ped-talk-2',
      model: 'soldier',
      clothingColor: '#0f172a', // Navy suit
      routeType: 'static-talk',
      startX: 0.2,
      startZ: 2.3,
      targetX: 0.2,
      targetZ: 2.3,
      x: 0.2,
      y: 0.74,
      z: 2.3,
      heading: -Math.PI * 0.85, // Facing companion
      progress: 0,
      walkingSpeed: 0,
      currentAction: 'idle',
      initialAction: 'idle',
      lateralAvoidX: 0,
      lateralAvoidZ: 0,
    },
    // 12. Seated Pedestrian on West Promenade Park Bench ([-4.2, 0.74, -7.5])
    {
      id: 'ped-bench-1',
      model: 'michelle',
      clothingColor: '#64748b', // Slate dress
      routeType: 'bench-seated',
      startX: -4.2,
      startZ: -7.5,
      targetX: -4.2,
      targetZ: -7.5,
      x: -4.2,
      y: 0.74,
      z: -7.5,
      heading: Math.PI / 2, // Facing avenue
      progress: 0,
      walkingSpeed: 0,
      currentAction: 'sit',
      initialAction: 'sit',
      lateralAvoidX: 0,
      lateralAvoidZ: 0,
    },
    // 13. Seated Pedestrian on East Promenade Park Bench ([4.2, 0.74, 7.5])
    {
      id: 'ped-bench-2',
      model: 'soldier',
      clothingColor: '#475569', // Casual grey
      routeType: 'bench-seated',
      startX: 4.2,
      startZ: 7.5,
      targetX: 4.2,
      targetZ: 7.5,
      x: 4.2,
      y: 0.74,
      z: 7.5,
      heading: -Math.PI / 2, // Facing avenue
      progress: 0,
      walkingSpeed: 0,
      currentAction: 'sit',
      initialAction: 'sit',
      lateralAvoidX: 0,
      lateralAvoidZ: 0,
    },
  ]);

  // Scaled according to quality tier
  const activeCount = useMemo(() => {
    if (effectiveTier === 'low') return 6;
    if (effectiveTier === 'medium') return 9;
    return pedestriansRef.current.length; // 13 on high
  }, [effectiveTier]);

  // Master AI Simulation Loop
  useFrame((_, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    const dt = Math.min(delta, 0.08);
    const timeSec = performance.now() * 0.001;
    const signalState = getTrafficSignalState(timeSec);
    const pPos = playerPosRef?.current;
    const peds = pedestriansRef.current;

    for (let i = 0; i < activeCount; i++) {
      const p = peds[i];
      if (p.routeType === 'bench-seated' || p.routeType === 'static-talk' || p.routeType === 'static-text') {
        continue;
      }

      let canWalk = true;

      // 1. Crosswalk Traffic Light Compliance
      if (p.routeType === 'crosswalk-ns') {
        const isNearCurb = p.progress < 0.12 || p.progress > 0.88;
        if (isNearCurb && !signalState.nsCrosswalkWalk) {
          canWalk = false;
        }
      } else if (p.routeType === 'crosswalk-ew') {
        const isNearCurb = p.progress < 0.12 || p.progress > 0.88;
        if (isNearCurb && !signalState.ewCrosswalkWalk) {
          canWalk = false;
        }
      }

      // 2. Local Avoidance of Player Avatar
      let avoidX = 0;
      let avoidZ = 0;
      if (pPos) {
        const dx = pPos.x - p.x;
        const dz = pPos.z - p.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 1.7 && dist > 0.02) {
          const push = (1.7 - dist) * 0.75;
          avoidX = (-dx / dist) * push;
          avoidZ = (-dz / dist) * push;
        }
      }
      p.lateralAvoidX = p.lateralAvoidX * 0.88 + avoidX * 0.12;
      p.lateralAvoidZ = p.lateralAvoidZ * 0.88 + avoidZ * 0.12;

      // 3. Navigation Update
      if (canWalk) {
        p.currentAction = 'walk';
        const routeDist = Math.hypot(p.targetX - p.startX, p.targetZ - p.startZ);
        p.progress += (p.walkingSpeed * dt) / Math.max(1, routeDist);

        // Turn around upon reaching destination
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
        p.x = p.startX + (p.targetX - p.startX) * p.progress + p.lateralAvoidX;
        p.z = p.startZ + (p.targetZ - p.startZ) * p.progress + p.lateralAvoidZ;

        // Elevation step between Sidewalk (0.74m) and Roadway (0.62m)
        const isCrossingRoadway =
          (p.routeType === 'crosswalk-ns' || p.routeType === 'crosswalk-ew') &&
          p.progress > 0.14 &&
          p.progress < 0.86;
        p.y = isCrossingRoadway ? 0.62 : 0.74;

        // Heading direction
        const hdx = p.targetX - p.startX;
        const hdz = p.targetZ - p.startZ;
        p.heading = Math.atan2(hdx, hdz);
      } else {
        // Waiting at Curb: Switch to Idle or Texting animation
        p.currentAction = p.model === 'michelle' ? 'text' : 'idle';
      }
    }
  });

  if (!walkClip || !idleClip) return null;

  return (
    <group name="RealisticPedestriansAI">
      {pedestriansRef.current.slice(0, activeCount).map((p) => (
        <RiggedPedestrianInstance
          key={p.id}
          ped={p}
          model={p.model}
          clothingColor={p.clothingColor}
          michelleScene={michelleGLTF.scene}
          soldierScene={soldierGLTF.scene}
          walkClip={walkClip}
          idleClip={idleClip}
          sitClip={sitClip || idleClip}
          talkClip={talkClip || idleClip}
          textClip={textClip || idleClip}
          contactShadowTex={contactShadowTex}
          playerPosRef={playerPosRef}
        />
      ))}
    </group>
  );
};

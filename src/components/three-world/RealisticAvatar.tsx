'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { urbanAudio } from './CityUrbanAudio';
import { RealisticPedestriansAI } from './RealisticPedestriansAI';
import { getTreeContactShadowTexture } from './architecturalTextures';

// Preload the photorealistic character model
useGLTF.preload('/models/characters/Soldier.glb');

interface RealisticAvatarProps {
  positionRef: React.MutableRefObject<THREE.Vector3>;
  rotationRef: React.MutableRefObject<number>;
  isMovingRef: React.MutableRefObject<boolean>;
  quaternionRef?: React.MutableRefObject<THREE.Quaternion>;
  currentSpeedRef?: React.MutableRefObject<number>;
}

const _upAxis = new THREE.Vector3(0, 1, 0);
const _targetQuat = new THREE.Quaternion();

/**
 * Photorealistic 1.83m Rigged Human 3D Developer Avatar
 * Features:
 * - Detailed rigged character model with natural human skeletal proportions
 * - Smooth skeletal animation blending between Idle, Walk, and Sprint
 * - Velocity-synchronized stride timescale to eliminate foot-sliding
 * - Quaternion-interpolated smooth heading rotation
 * - Ground contact ambient shadow decal
 * - Synchronized footstep audio integration
 */
export const RealisticAvatar: React.FC<RealisticAvatarProps> = ({
  positionRef,
  rotationRef,
  isMovingRef,
  quaternionRef,
  currentSpeedRef,
}) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const internalQuatRef = useRef<THREE.Quaternion>(new THREE.Quaternion());
  const stepTimerRef = useRef<number>(0);

  // Load the rigged character model and its embedded skeletal animations
  const { scene, animations } = useGLTF('/models/characters/Soldier.glb');

  // Clone unique skinned mesh hierarchy for this avatar instance
  const avatarScene = useMemo(() => {
    const cloned = clone(scene);
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return cloned;
  }, [scene]);

  const contactShadowTex = useMemo(() => getTreeContactShadowTexture(), []);

  // Animation Mixer and Action References
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<{
    idle?: THREE.AnimationAction;
    walk?: THREE.AnimationAction;
    run?: THREE.AnimationAction;
  }>({});
  const activeActionNameRef = useRef<'idle' | 'walk' | 'run'>('idle');

  // Initialize Animation Actions and default state
  useEffect(() => {
    if (!avatarScene || animations.length === 0) return;
    const mixer = new THREE.AnimationMixer(avatarScene);
    mixerRef.current = mixer;

    const idleClip = animations.find((a) => a.name.toLowerCase().includes('idle'));
    const walkClip = animations.find((a) => a.name.toLowerCase().includes('walk'));
    const runClip = animations.find((a) => a.name.toLowerCase().includes('run'));

    if (idleClip) actionsRef.current.idle = mixer.clipAction(idleClip);
    if (walkClip) actionsRef.current.walk = mixer.clipAction(walkClip);
    if (runClip) actionsRef.current.run = mixer.clipAction(runClip);

    // Initial state: Idle breathing
    const initialAction = actionsRef.current.idle;
    if (initialAction) {
      initialAction.play();
      activeActionNameRef.current = 'idle';
    }

    return () => {
      mixer.stopAllAction();
    };
  }, [avatarScene, animations]);

  useFrame((_, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    const dt = Math.min(delta, 0.08);

    // 1. Sync world position
    if (rootGroupRef.current && positionRef.current) {
      rootGroupRef.current.position.copy(positionRef.current);
    }

    // 2. Smooth heading rotation via quaternion SLERP
    const targetHeading = rotationRef.current;
    _targetQuat.setFromAxisAngle(_upAxis, targetHeading);
    internalQuatRef.current.slerp(_targetQuat, 1 - Math.exp(-14.0 * dt));

    if (rootGroupRef.current) {
      rootGroupRef.current.quaternion.copy(internalQuatRef.current);
    }
    if (quaternionRef) {
      quaternionRef.current.copy(internalQuatRef.current);
    }

    // 3. Movement speed & locomotion state
    const isMoving = isMovingRef.current;
    const speed = currentSpeedRef ? currentSpeedRef.current : isMoving ? 5.0 : 0;
    const isSprinting = speed > 5.8;

    const targetActionName: 'idle' | 'walk' | 'run' = !isMoving
      ? 'idle'
      : isSprinting
      ? 'run'
      : 'walk';

    // 4. Smooth Cross-Fade Animation Blending
    if (activeActionNameRef.current !== targetActionName) {
      const currentAction = actionsRef.current[activeActionNameRef.current];
      const targetAction = actionsRef.current[targetActionName];

      if (currentAction && targetAction && currentAction !== targetAction) {
        targetAction.reset();
        targetAction.crossFadeFrom(currentAction, 0.22, true);
        targetAction.play();
        activeActionNameRef.current = targetActionName;
      }
    }

    // 5. Dynamic Stride Timescale (Synchronizes foot speed to world velocity)
    if (isMoving) {
      if (actionsRef.current.walk) {
        actionsRef.current.walk.timeScale = Math.max(0.75, Math.min(1.8, speed / 3.4));
      }
      if (actionsRef.current.run) {
        actionsRef.current.run.timeScale = Math.max(0.9, Math.min(2.0, speed / 6.0));
      }

      // Footstep audio cadence
      stepTimerRef.current += dt * (isSprinting ? 4.6 : 3.0);
      if (stepTimerRef.current >= 1.0) {
        stepTimerRef.current -= 1.0;
        urbanAudio.playFootstep(isSprinting);
      }
    } else {
      stepTimerRef.current = 0;
    }

    // 6. Update Skeletal Animation Mixer
    mixerRef.current?.update(dt);
  });

  return (
    <group ref={rootGroupRef}>
      {/* Soft Contact Ambient Shadow Decal on Pavement */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.75, 0.75]} />
        <meshBasicMaterial
          map={contactShadowTex}
          transparent
          opacity={0.65}
          depthWrite={false}
        />
      </mesh>

      {/* Rigged Photorealistic Character Model */}
      <primitive object={avatarScene} />
    </group>
  );
};

/**
 * Ambient Pedestrians Export (Delegates directly to RealisticPedestriansAI)
 */
export const AmbientPedestrians: React.FC<{ playerPosRef?: React.MutableRefObject<THREE.Vector3> }> = ({
  playerPosRef,
}) => {
  return <RealisticPedestriansAI playerPosRef={playerPosRef} />;
};

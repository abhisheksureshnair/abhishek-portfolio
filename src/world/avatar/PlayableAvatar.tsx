'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { getCityRoadNetwork } from '../WorldConfig';
import { getDistrictFreeRoamNavigator } from './districtFreeRoamNavigator';
import { worldStore } from '../stores/worldStore';
import { urbanAudio } from '@/components/three-world/CityUrbanAudio';
import { getTreeContactShadowTexture } from '@/components/three-world/architecturalTextures';
import { avatarGameplayState } from './avatarGameplayState';

// Preload assets
useGLTF.preload('/models/characters/Soldier.glb');
useTexture.preload('/models/characters/developer_diffuse.jpg');

interface PlayableAvatarProps {
  onInteractLandmark?: (landmarkId: string) => void;
  avatarPosRef?: React.MutableRefObject<THREE.Vector3>;
  avatarQuatRef?: React.MutableRefObject<THREE.Quaternion>;
}

// Module-level static scratch objects to eliminate GC allocations
const _upAxis = new THREE.Vector3(0, 1, 0);
const _targetQuat = new THREE.Quaternion();
const _moveVec = new THREE.Vector3();
const _camFwd = new THREE.Vector3();
const _camRgt = new THREE.Vector3();

// Physics & Controller Constants per Phase 3.0.5 GTA-Style Specification
const WALK_SPEED = 2.2; // 2.2 m/s walk speed
const SPRINT_SPEED = 5.0; // 5.0 m/s sprint speed
const ACCEL_RATE = 12.0; // 12 m/s² acceleration
const DECEL_RATE = 16.0; // 16 m/s² deceleration
const ROTATION_SPEED = 10.0; // 10 rad/s smooth turn rate
const CROSSFADE_DURATION = 0.2; // 0.2s smooth animation crossfade

export const PlayableAvatar: React.FC<PlayableAvatarProps> = ({
  onInteractLandmark,
  avatarPosRef: externalPosRef,
  avatarQuatRef: externalQuatRef,
}) => {
  const { camera } = useThree();
  const rootGroupRef = useRef<THREE.Group>(null);

  // Central 3x3 District Free-Roaming Navigation System
  const network = useMemo(() => getCityRoadNetwork(), []);
  const navigator = useMemo(() => getDistrictFreeRoamNavigator(network), [network]);
  const searchParams = useSearchParams();
  const avatarPosParam = searchParams.get('avatar_pos') || searchParams.get('pos');

  const contactShadowTex = useMemo(() => getTreeContactShadowTexture(), []);

  // Spawn Point near Developer HQ on South sidewalk (or query override)
  const spawnPoint = useMemo(() => {
    if (avatarPosParam === 'crosswalk') {
      return { x: 20.0, y: 0.22, z: 13.8, heading: Math.PI / 2 };
    } else if (avatarPosParam === 'road') {
      return { x: 0.0, y: 0.22, z: 20.0, heading: 0 };
    } else if (avatarPosParam === 'avenue') {
      return { x: -20.0, y: 0.22, z: 0.0, heading: 0 };
    } else if (avatarPosParam === 'plaza') {
      return { x: -35.0, y: 0.22, z: -35.0, heading: 0 };
    } else if (avatarPosParam === 'perimeter_west') {
      return { x: -64.0, y: 0.22, z: 0.0, heading: Math.PI / 2 };
    } else if (avatarPosParam === 'perimeter_east') {
      return { x: 64.0, y: 0.22, z: 0.0, heading: -Math.PI / 2 };
    } else if (avatarPosParam === 'perimeter_north') {
      return { x: 0.0, y: 0.22, z: -64.0, heading: Math.PI };
    } else if (avatarPosParam === 'perimeter_south') {
      return { x: 0.0, y: 0.22, z: 64.0, heading: 0 };
    } else if (avatarPosParam === 'innovation') {
      return { x: 26.2, y: 0.22, z: -40.0, heading: Math.PI / 2 };
    } else if (avatarPosParam === 'interaction') {
      return { x: 0.0, y: 0.22, z: 10.5, heading: Math.PI };
    } else if (avatarPosParam === 'skills') {
      return { x: -26.2, y: 0.22, z: 0.0, heading: -Math.PI / 2 };
    } else if (avatarPosParam === 'career') {
      return { x: 26.2, y: 0.22, z: 0.0, heading: Math.PI / 2 };
    } else if (avatarPosParam === 'about') {
      return { x: 0.0, y: 0.22, z: -26.2, heading: Math.PI };
    } else if (avatarPosParam === 'contact') {
      return { x: -40.0, y: 0.22, z: 26.2, heading: 0 };
    } else if (avatarPosParam === 'ai') {
      return { x: 0.0, y: 0.22, z: 26.2, heading: 0 };
    }
    return navigator.getHQSpawn();
  }, [avatarPosParam, navigator]);

  // Internal Avatar Position & Locomotion Refs
  const posRef = useRef<THREE.Vector3>(new THREE.Vector3(spawnPoint.x, spawnPoint.y, spawnPoint.z));
  const quatRef = useRef<THREE.Quaternion>(
    new THREE.Quaternion().setFromAxisAngle(_upAxis, spawnPoint.heading)
  );
  const velocityRef = useRef<{ x: number; z: number }>({ x: 0, z: 0 });
  const speedRef = useRef<number>(0);
  const stepTimerRef = useRef<number>(0);
  const keysPressedRef = useRef<Record<string, boolean>>({});

  // Initialize camera gameplay state behind avatar at spawn
  useEffect(() => {
    avatarGameplayState.initializeSpawn(spawnPoint.heading);
  }, [spawnPoint]);

  // Connect to external refs if supplied
  useEffect(() => {
    if (externalPosRef) externalPosRef.current = posRef.current;
    if (externalQuatRef) externalQuatRef.current = quatRef.current;
  }, [externalPosRef, externalQuatRef]);

  // Load 3D Rigged Human Model & Modern Casual Textures
  const { scene, animations } = useGLTF('/models/characters/Soldier.glb');
  const developerDiffuseMap = useTexture('/models/characters/developer_diffuse.jpg');

  useMemo(() => {
    developerDiffuseMap.flipY = false;
    developerDiffuseMap.colorSpace = THREE.SRGBColorSpace;
  }, [developerDiffuseMap]);

  // Clone skinned character hierarchy and apply modern casual developer materials
  const avatarScene = useMemo(() => {
    const cloned = clone(scene);
    // Phase 3.0.6 Section 2: 180° visual model rotation correction.
    // Soldier.glb model natively faces -Z in rest pose; rotating by PI aligns visual front with controller +Z.
    cloned.rotation.y = Math.PI;

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.name === 'vanguard_visor') {
          // Hide combat visor for realistic casual modern developer look
          mesh.visible = false;
        } else if (mesh.name === 'vanguard_Mesh') {
          // Apply black leather jacket, grey shirt, dark jeans, and sneaker textures
          mesh.material = new THREE.MeshStandardMaterial({
            map: developerDiffuseMap,
            roughness: 0.62,
            metalness: 0.12,
          });
        }
      }
    });

    return cloned;
  }, [scene, developerDiffuseMap]);

  // Animation Mixer and Locomotion Actions
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<{
    idle?: THREE.AnimationAction;
    walk?: THREE.AnimationAction;
    run?: THREE.AnimationAction;
  }>({});
  const activeActionNameRef = useRef<'idle' | 'walk' | 'run'>('idle');

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

    const initialAction = actionsRef.current.idle;
    if (initialAction) {
      initialAction.play();
      activeActionNameRef.current = 'idle';
    }

    return () => {
      mixer.stopAllAction();
    };
  }, [avatarScene, animations]);

  // Keyboard Event Listeners with focus and blur guards
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disregard if user is typing in an input field or text area
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      keysPressedRef.current[e.key.toLowerCase()] = true;
      keysPressedRef.current[e.code] = true;

      // [E] Key: Interact with nearby portfolio landmark
      if (e.key.toLowerCase() === 'e' || e.code === 'KeyE') {
        const isInteracting = worldStore.getState().isInteracting;
        if (isInteracting) return; // Guard against repeated trigger
        const prompt = worldStore.getState().activeLandmarkPrompt;
        if (prompt && onInteractLandmark) {
          worldStore.getState().setIsInteracting(true);
          worldStore.getState().setSavedAvatarState({
            x: posRef.current.x,
            y: posRef.current.y,
            z: posRef.current.z,
            heading: 0,
          });
          onInteractLandmark(prompt.id);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key.toLowerCase()] = false;
      keysPressedRef.current[e.code] = false;
    };

    const handleBlur = () => {
      keysPressedRef.current = {};
    };

    const handleFocus = () => {
      keysPressedRef.current = {};
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [onInteractLandmark]);

  // Main Locomotion & Navigation Update Loop (Priority 1: runs first before camera follow)
  useFrame((_, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    const dt = Math.min(delta, 0.05);

    // If a portfolio dashboard or modal interface is currently open, freeze avatar locomotion
    const isInteracting = worldStore.getState().isInteracting;
    if (isInteracting) {
      velocityRef.current.x = 0;
      velocityRef.current.z = 0;
      speedRef.current = 0;
      avatarGameplayState.isMoving = false;
      avatarGameplayState.currentSpeed = 0;

      if (activeActionNameRef.current !== 'idle') {
        const curAct = actionsRef.current[activeActionNameRef.current];
        const idleAct = actionsRef.current.idle;
        if (curAct && idleAct && curAct !== idleAct) {
          idleAct.reset().crossFadeFrom(curAct, CROSSFADE_DURATION, true).play();
          activeActionNameRef.current = 'idle';
        }
      }
      mixerRef.current?.update(dt);
      return;
    }

    const keys = keysPressedRef.current;
    let inputForward = 0;
    let inputStrafe = 0;

    if (keys['w'] || keys['arrowup'] || keys['keyw']) inputForward += 1;
    if (keys['s'] || keys['arrowdown'] || keys['keys']) inputForward -= 1;
    if (keys['d'] || keys['arrowright'] || keys['keyd']) inputStrafe += 1;
    if (keys['a'] || keys['arrowleft'] || keys['keya']) inputStrafe -= 1;

    const isRunning = keys['shift'] || keys['shiftleft'] || keys['shiftright'];
    const targetMaxSpeed = isRunning ? SPRINT_SPEED : WALK_SPEED;

    // 1. Authoritative Camera-Relative Direction (Phase 3.0.6 Section 3):
    // Uses camera.getWorldDirection(cameraForward), horizontal projection (y=0, normalized).
    // For W input, moves along cameraForward (positive dot product).
    camera.getWorldDirection(_camFwd);
    _camFwd.y = 0;
    if (_camFwd.lengthSq() > 0.0001) {
      _camFwd.normalize();
    } else {
      _camFwd.set(0, 0, -1);
    }
    _camRgt.crossVectors(_camFwd, _upAxis).normalize();

    _moveVec.set(0, 0, 0);
    _moveVec.addScaledVector(_camFwd, inputForward);
    _moveVec.addScaledVector(_camRgt, inputStrafe);

    // Normalize diagonal movement vector so diagonal travel is never faster than orthogonal
    if (_moveVec.lengthSq() > 0.001) {
      _moveVec.normalize();
    }

    const hasInput = _moveVec.lengthSq() > 0.001;

    // 2. Realistic Movement Physics (12 m/s² accel, 16 m/s² decel per Phase 3.0.5 spec)
    const targetVx = hasInput ? _moveVec.x * targetMaxSpeed : 0;
    const targetVz = hasInput ? _moveVec.z * targetMaxSpeed : 0;
    const rate = hasInput ? ACCEL_RATE : DECEL_RATE;

    const diffX = targetVx - velocityRef.current.x;
    const diffZ = targetVz - velocityRef.current.z;
    const diffDist = Math.hypot(diffX, diffZ);
    const maxDeltaV = rate * dt;

    if (diffDist <= maxDeltaV) {
      velocityRef.current.x = targetVx;
      velocityRef.current.z = targetVz;
    } else {
      velocityRef.current.x += (diffX / diffDist) * maxDeltaV;
      velocityRef.current.z += (diffZ / diffDist) * maxDeltaV;
    }

    const curSpeed = Math.hypot(velocityRef.current.x, velocityRef.current.z);
    speedRef.current = curSpeed;
    const isMoving = curSpeed > 0.15;

    // Publish locomotion telemetry to shared authoritative state
    avatarGameplayState.isMoving = isMoving;
    avatarGameplayState.isMovingForward = hasInput && inputForward > 0;
    avatarGameplayState.currentSpeed = curSpeed;

    // 3. Smooth Shortest-Angle Character Rotation (10 rad/s via rotateTowards)
    // When moving: character turns smoothly to face travel direction
    // When stationary: character maintains its exact facing direction without any drift
    if (isMoving) {
      const heading = Math.atan2(velocityRef.current.x, velocityRef.current.z);
      _targetQuat.setFromAxisAngle(_upAxis, heading);
      quatRef.current.rotateTowards(_targetQuat, ROTATION_SPEED * dt);
    }

    // 4. Central 3x3 District Free-Roaming Constraint & Building Collision
    const constraint = navigator.constrainMovement(
      posRef.current.x,
      posRef.current.z,
      velocityRef.current.x,
      velocityRef.current.z,
      dt
    );

    posRef.current.x = constraint.x;
    posRef.current.z = constraint.z;

    // Check Landmark Proximity for [E] Interaction Prompt
    const nearbyLandmark = navigator.checkLandmarkProximity(
      posRef.current.x,
      posRef.current.z
    );
    const curPrompt = worldStore.getState().activeLandmarkPrompt;

    if (nearbyLandmark && (!curPrompt || curPrompt.id !== nearbyLandmark.id)) {
      worldStore.getState().setActiveLandmarkPrompt({
        id: nearbyLandmark.id,
        name: nearbyLandmark.name,
        subtitle: nearbyLandmark.subtitle,
      });
    } else if (!nearbyLandmark && curPrompt) {
      worldStore.getState().setActiveLandmarkPrompt(null);
    }

    // Sync 3D transforms
    if (rootGroupRef.current) {
      rootGroupRef.current.position.set(posRef.current.x, posRef.current.y, posRef.current.z);
      rootGroupRef.current.quaternion.copy(quatRef.current);
    }

    if (typeof window !== 'undefined') {
      (window as any).__avatarPos = posRef.current;
      (window as any).__avatarVelocity = velocityRef.current;
      (window as any).__avatarSpeed = curSpeed;
    }

    // 5. Animation State Machine: Idle -> Walk -> Run with smooth crossfading
    const isSprinting = isRunning && curSpeed > 2.8;
    const targetAction: 'idle' | 'walk' | 'run' = !isMoving
      ? 'idle'
      : isSprinting
      ? 'run'
      : 'walk';

    if (activeActionNameRef.current !== targetAction) {
      const curAct = actionsRef.current[activeActionNameRef.current];
      const nextAct = actionsRef.current[targetAction];
      if (curAct && nextAct && curAct !== nextAct) {
        nextAct.reset();
        nextAct.crossFadeFrom(curAct, CROSSFADE_DURATION, true);
        nextAct.play();
        activeActionNameRef.current = targetAction;
      }
    }

    // 6. Dynamic Stride Timescale (Synchronizes leg stride frequency to ground velocity to eliminate foot sliding)
    if (isMoving) {
      if (actionsRef.current.walk) {
        actionsRef.current.walk.timeScale = Math.max(0.6, Math.min(1.5, curSpeed / WALK_SPEED));
      }
      if (actionsRef.current.run) {
        actionsRef.current.run.timeScale = Math.max(0.7, Math.min(1.6, curSpeed / SPRINT_SPEED));
      }

      // Footstep Sound Cadence synchronized with locomotion speed
      const stepRate = isSprinting
        ? (curSpeed / SPRINT_SPEED) * 5.0
        : (curSpeed / WALK_SPEED) * 3.2;
      stepTimerRef.current += dt * stepRate;
      if (stepTimerRef.current >= 1.0) {
        stepTimerRef.current -= 1.0;
        urbanAudio.playFootstep(isSprinting);
      }
    } else {
      stepTimerRef.current = 0;
    }

    // Update Skeletal Animation Mixer
    mixerRef.current?.update(dt);
  }); // Default priority: runs with frame loop, preserving R3F automatic scene render

  return (
    <group ref={rootGroupRef} position={[spawnPoint.x, spawnPoint.y, spawnPoint.z]}>
      {/* Soft Contact Ambient Radial Shadow Decal on Pavement */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.9, 0.9]} />
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

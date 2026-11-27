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
    } else if (avatarPosParam === 'cloud') {
      return { x: 40.0, y: 0.22, z: 24.5, heading: 0 };
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
  const proximityTimerRef = useRef<number>(0);
  const keysPressedRef = useRef<Record<string, boolean>>({});
  const hqSeqRef = useRef<{ step: number; doorX: number; doorWait: number }>({
    step: 0,
    doorX: 2.5,
    doorWait: 0,
  });
  const hqExitCooldownUntilRef = useRef<number>(0);
  const stuckTimerRef = useRef<number>(0);
  const hasLoggedStuckRef = useRef<boolean>(false);

  // Initialize camera gameplay state behind avatar at spawn
  useEffect(() => {
    avatarGameplayState.initializeSpawn(spawnPoint.heading);
  }, [spawnPoint]);

  // Connect to external refs if supplied
  useEffect(() => {
    if (externalPosRef) externalPosRef.current = posRef.current;
    if (externalQuatRef) externalQuatRef.current = quatRef.current;
    if (rootGroupRef.current) {
      rootGroupRef.current.position.copy(posRef.current);
      rootGroupRef.current.quaternion.copy(quatRef.current);
    }
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

  useEffect(() => {
    if (avatarScene) {
      worldStore.getState().setIsAvatarReady(true);
    }
  }, [avatarScene]);

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

  // Keyboard & HQ Enter/Exit Event Listeners with focus and blur guards
  useEffect(() => {
    const startHQEntry = () => {
      const { hqInteriorPhase, isInteracting, isAvatarControlsEnabled } = worldStore.getState();
      if (hqInteriorPhase !== 'outside' || isInteracting || !isAvatarControlsEnabled) return;
      if (performance.now() < hqExitCooldownUntilRef.current) return;

      const doorX = posRef.current.x >= 0 ? 2.5 : -2.5;
      hqSeqRef.current = { step: 0, doorX, doorWait: 0.38 };
      velocityRef.current.x = 0;
      velocityRef.current.z = 0;
      speedRef.current = 0;
      worldStore.getState().setActiveLandmarkPrompt(null);
      worldStore.getState().setHqDoorsOpen(true);
      worldStore.getState().setHqInteriorPhase('entering');
    };

    const startHQExit = () => {
      const { hqInteriorPhase } = worldStore.getState();
      if (hqInteriorPhase !== 'inside') return;
      const doorX = posRef.current.x >= 0 ? 2.5 : -2.5;
      hqSeqRef.current = { step: 0, doorX, doorWait: 0.38 };
      velocityRef.current.x = 0;
      velocityRef.current.z = 0;
      speedRef.current = 0;
      if (rootGroupRef.current) {
        rootGroupRef.current.visible = true;
      }
      worldStore.getState().setHqNearExit(false);
      worldStore.getState().setHqHighlightedPanel(null);
      worldStore.getState().setHqExpandedPanel(null);
      worldStore.getState().setHqDoorsOpen(true);
      worldStore.getState().setHqInteriorPhase('exiting');
    };

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

      // [E] Key: Interact with nearby portfolio landmark, HQ spatial panel, or HQ exit doorway
      if (e.key.toLowerCase() === 'e' || e.code === 'KeyE') {
        const { isInteracting, isAvatarControlsEnabled, hqInteriorPhase, hqNearExit } =
          worldStore.getState();
        if (isInteracting || !isAvatarControlsEnabled) return;

        if (hqInteriorPhase === 'inside') {
          if (hqNearExit) {
            startHQExit();
          } else {
            window.dispatchEvent(new CustomEvent('hq-panel-interact'));
          }
          return;
        }

        if (hqInteriorPhase !== 'outside') return;
        const prompt = worldStore.getState().activeLandmarkPrompt;
        if (prompt?.id === 'hq') {
          startHQEntry();
          return;
        }
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
    window.addEventListener('hq-enter-trigger', startHQEntry);
    window.addEventListener('hq-exit-trigger', startHQExit);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('hq-enter-trigger', startHQEntry);
      window.removeEventListener('hq-exit-trigger', startHQExit);
    };
  }, [onInteractLandmark]);

  // Main Locomotion & Navigation Update Loop (Priority 1: runs first before camera follow)
  useFrame((_, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    const dt = Math.min(delta, 0.05);

    // If a portfolio dashboard/modal is open or initial camera intro is still settling, freeze avatar locomotion
    const { isInteracting, isAvatarControlsEnabled, hqInteriorPhase } = worldStore.getState();
    if (isInteracting || !isAvatarControlsEnabled) {
      velocityRef.current.x = 0;
      velocityRef.current.z = 0;
      speedRef.current = 0;
      avatarGameplayState.isMoving = false;
      avatarGameplayState.currentSpeed = 0;

      if (rootGroupRef.current) {
        rootGroupRef.current.position.set(posRef.current.x, posRef.current.y, posRef.current.z);
        rootGroupRef.current.quaternion.copy(quatRef.current);
      }

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

    // Automated physical walk-in / walk-out sequence for Flagship Headquarters
    if (hqInteriorPhase === 'entering' || hqInteriorPhase === 'exiting') {
      const seq = hqSeqRef.current;

      // Wait briefly for glass doors to swing open before crossing doorway
      if (seq.doorWait > 0) {
        seq.doorWait = Math.max(0, seq.doorWait - dt);
        if (rootGroupRef.current) {
          rootGroupRef.current.position.set(posRef.current.x, posRef.current.y, posRef.current.z);
          rootGroupRef.current.quaternion.copy(quatRef.current);
        }
        mixerRef.current?.update(dt);
        return;
      }

      const enterWaypoints: [number, number, number][] = [
        [seq.doorX, 0.22, 9.3],
        [seq.doorX, 0.22, 7.0],
        [0, 0.28, 3.8],
      ];
      const exitWaypoints: [number, number, number][] = [
        [seq.doorX, 0.22, 7.2],
        [seq.doorX, 0.22, 10.6],
      ];
      const waypoints = hqInteriorPhase === 'entering' ? enterWaypoints : exitWaypoints;
      const target = waypoints[Math.min(seq.step, waypoints.length - 1)];

      const dx = target[0] - posRef.current.x;
      const dz = target[2] - posRef.current.z;
      const dist = Math.hypot(dx, dz);
      const walkSpeed = 2.5;

      if (dist > 0.12) {
        const stepDist = Math.min(dist, walkSpeed * dt);
        const nx = dx / dist;
        const nz = dz / dist;
        posRef.current.x += nx * stepDist;
        posRef.current.z += nz * stepDist;
        posRef.current.y += (target[1] - posRef.current.y) * Math.min(1, dt * 8.0);

        const heading = Math.atan2(nx, nz);
        _targetQuat.setFromAxisAngle(_upAxis, heading);
        quatRef.current.rotateTowards(_targetQuat, ROTATION_SPEED * dt);

        avatarGameplayState.isMoving = true;
        avatarGameplayState.isMovingForward = true;
        avatarGameplayState.currentSpeed = walkSpeed;

        if (activeActionNameRef.current !== 'walk') {
          const curAct = actionsRef.current[activeActionNameRef.current];
          const walkAct = actionsRef.current.walk;
          if (curAct && walkAct && curAct !== walkAct) {
            walkAct.reset().crossFadeFrom(curAct, CROSSFADE_DURATION, true).play();
            activeActionNameRef.current = 'walk';
          }
        }
      } else {
        posRef.current.set(target[0], target[1], target[2]);
        if (seq.step < waypoints.length - 1) {
          seq.step += 1;
        } else if (hqInteriorPhase === 'entering') {
          // Arrived at center presentation platform: face North (-Z) and enter first-person immersive view
          _targetQuat.setFromAxisAngle(_upAxis, Math.PI);
          quatRef.current.copy(_targetQuat);
          avatarGameplayState.isMoving = false;
          avatarGameplayState.currentSpeed = 0;
          if (rootGroupRef.current) {
            rootGroupRef.current.visible = false;
          }
          worldStore.getState().setHqDoorsOpen(false);
          worldStore.getState().setHqInteriorPhase('inside');
        } else {
          // Arrived outside doorway: restore normal city exploration with re-entry cooldown
          hqExitCooldownUntilRef.current = performance.now() + 1500;
          avatarGameplayState.isMoving = false;
          avatarGameplayState.currentSpeed = 0;
          if (rootGroupRef.current) {
            rootGroupRef.current.visible = true;
          }
          worldStore.getState().setHqDoorsOpen(false);
          worldStore.getState().setHqInteriorPhase('outside');
        }
      }

      if (rootGroupRef.current) {
        rootGroupRef.current.position.set(posRef.current.x, posRef.current.y, posRef.current.z);
        rootGroupRef.current.quaternion.copy(quatRef.current);
      }
      mixerRef.current?.update(dt);
      return;
    }

    if (rootGroupRef.current) {
      rootGroupRef.current.visible = hqInteriorPhase !== 'inside';
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

    // 4. Collision & Surface Elevation (HQ Interior vs Central 3x3 District)
    const prevX = posRef.current.x;
    const prevZ = posRef.current.z;
    let constraintResult;

    if (hqInteriorPhase === 'inside') {
      constraintResult = navigator.constrainHQInteriorMovement(
        prevX,
        prevZ,
        velocityRef.current.x,
        velocityRef.current.z,
        dt
      );
      posRef.current.x = constraintResult.x;
      posRef.current.z = constraintResult.z;
      const targetFloorY = navigator.getHQInteriorFloorY(posRef.current.x, posRef.current.z);
      posRef.current.y += (targetFloorY - posRef.current.y) * Math.min(1, dt * 12.0);

      // Update exit doorway proximity only when boolean state changes
      const nearExit =
        posRef.current.z >= 6.4 &&
        (Math.abs(posRef.current.x - 2.5) <= 1.6 || Math.abs(posRef.current.x + 2.5) <= 1.6);
      if (worldStore.getState().hqNearExit !== nearExit) {
        worldStore.getState().setHqNearExit(nearExit);
      }
    } else {
      constraintResult = navigator.constrainMovement(
        prevX,
        prevZ,
        velocityRef.current.x,
        velocityRef.current.z,
        dt
      );

      posRef.current.x = constraintResult.x;
      posRef.current.z = constraintResult.z;
      posRef.current.y = 0.22;

      // Check Landmark Proximity for [E] Interaction Prompt (throttled to ~6Hz for optimal CPU frame budget)
      proximityTimerRef.current += dt;
      if (proximityTimerRef.current >= 0.16) {
        proximityTimerRef.current = 0;
        const nearbyLandmark = navigator.checkLandmarkProximity(
          posRef.current.x,
          posRef.current.z
        );
        const curPrompt = worldStore.getState().activeLandmarkPrompt;
        const isHqCooldown =
          nearbyLandmark?.id === 'hq' && performance.now() < hqExitCooldownUntilRef.current;

        if (nearbyLandmark && !isHqCooldown && (!curPrompt || curPrompt.id !== nearbyLandmark.id)) {
          worldStore.getState().setActiveLandmarkPrompt({
            id: nearbyLandmark.id,
            name: nearbyLandmark.name,
            subtitle: nearbyLandmark.subtitle,
          });
        } else if ((!nearbyLandmark || isHqCooldown) && curPrompt) {
          worldStore.getState().setActiveLandmarkPrompt(null);
        }
      }
    }

    // Publish collision telemetry & detect sustained stuck states
    avatarGameplayState.isColliding = constraintResult.isBlocked;
    avatarGameplayState.lastColliderId = constraintResult.colliderId;
    avatarGameplayState.lastContactX = constraintResult.contactX;
    avatarGameplayState.lastContactZ = constraintResult.contactZ;
    avatarGameplayState.lastNormalX = constraintResult.normalX;
    avatarGameplayState.lastNormalZ = constraintResult.normalZ;
    avatarGameplayState.lastMoveDirX = hasInput ? _moveVec.x : 0;
    avatarGameplayState.lastMoveDirZ = hasInput ? _moveVec.z : 0;

    const actualDisp = Math.hypot(posRef.current.x - prevX, posRef.current.z - prevZ);
    if (hasInput && curSpeed > 0.4 && actualDisp < 0.08 * dt) {
      stuckTimerRef.current += dt;
      if (stuckTimerRef.current >= 0.75 && !hasLoggedStuckRef.current) {
        hasLoggedStuckRef.current = true;
        const dotNormal =
          _moveVec.x * constraintResult.normalX + _moveVec.z * constraintResult.normalZ;
        const isDirectWallBlock = constraintResult.isBlocked && dotNormal < -0.75;
        console.warn('[PlayableAvatar] Sustained zero displacement detected', {
          colliderId: constraintResult.colliderId,
          isDirectWallBlock,
          position: [posRef.current.x.toFixed(2), posRef.current.z.toFixed(2)],
          attemptedDir: [_moveVec.x.toFixed(2), _moveVec.z.toFixed(2)],
          normal: [constraintResult.normalX.toFixed(2), constraintResult.normalZ.toFixed(2)],
        });
      }
    } else {
      stuckTimerRef.current = 0;
      hasLoggedStuckRef.current = false;
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

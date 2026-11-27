'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWorldStore, worldStore } from '../stores/worldStore';
import { getCityRoadNetwork } from '../WorldConfig';
import { getDistrictFreeRoamNavigator } from './districtFreeRoamNavigator';
import { avatarGameplayState } from './avatarGameplayState';

interface ThirdPersonCameraProps {
  avatarPosRef: React.MutableRefObject<THREE.Vector3>;
  avatarQuatRef?: React.MutableRefObject<THREE.Quaternion>;
}

// Module-level static scratch objects to eliminate GC allocations
const _camLookTarget = new THREE.Vector3();
const _avatarEuler = new THREE.Euler(0, 0, 0, 'YXZ');

// Configuration Constants per Phase 3.0.5 GTA-Style Specification
const TARGET_HEIGHT = 1.5; // 1.5m above avatar ground position (chest/head level)
const AVATAR_FOV = 70; // 70° FOV per Section 2 specification
const INTRO_DURATION = 1.25; // 1.25s smooth GTA-style initial settle
const INTRO_START_DISTANCE = 6.0; // Slightly behind avatar
const INTRO_START_PITCH = 0.52; // ~30° downward, slightly above avatar

export const ThirdPersonCamera: React.FC<ThirdPersonCameraProps> = ({
  avatarPosRef,
  avatarQuatRef,
}) => {
  const { camera, gl } = useThree();
  const cameraMode = useWorldStore((s) => s.cameraMode);
  const isInteracting = useWorldStore((s) => s.isInteracting);

  // Central district collision geometry for camera occlusion avoidance
  const network = useMemo(() => getCityRoadNetwork(), []);
  const navigator = useMemo(() => getDistrictFreeRoamNavigator(network), [network]);

  const distanceRef = useRef<number>(avatarGameplayState.cameraDistance);
  const isPointerLockedRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const lastMouseXRef = useRef<number>(0);
  const lastMouseYRef = useRef<number>(0);
  const isFirstMountRef = useRef<boolean>(true);
  const isPlayingIntroRef = useRef<boolean>(false);
  const introElapsedRef = useRef<number>(0);
  const interiorBlendRef = useRef<number>(0); // 0 = 3rd-person follow, 1 = 1st-person eye-level

  const computeClearDistance = useMemo(() => {
    return (
      target: THREE.Vector3,
      unitX: number,
      unitZ: number,
      desiredDist: number,
      ignoreHqCollider: boolean = false
    ): number => {
      let maxClearDistance = desiredDist;
      const stepCount = 8;
      const camMargin = 0.45;

      for (let i = 1; i <= stepCount; i++) {
        const testDist = (desiredDist * i) / stepCount;
        const testX = target.x + unitX * testDist;
        const testZ = target.z + unitZ * testDist;

        for (let j = 0; j < navigator.colliders.length; j++) {
          const c = navigator.colliders[j];
          if (ignoreHqCollider && c.id === 'hq-main') continue;
          if (
            testX >= c.minX - camMargin &&
            testX <= c.maxX + camMargin &&
            testZ >= c.minZ - camMargin &&
            testZ <= c.maxZ + camMargin
          ) {
            maxClearDistance = Math.max(1.8, (desiredDist * (i - 1)) / stepCount - 0.2);
            break;
          }
        }
        if (maxClearDistance < desiredDist) break;
      }
      return maxClearDistance;
    };
  }, [navigator]);

  // 1. Field of View Management (70° for third-person open world, restore on exit)
  useEffect(() => {
    if (cameraMode === 'avatar') {
      const persCam = camera as THREE.PerspectiveCamera;
      const prevFov = persCam.fov;
      persCam.fov = AVATAR_FOV;
      persCam.updateProjectionMatrix();

      return () => {
        persCam.fov = prevFov;
        persCam.updateProjectionMatrix();
      };
    }
  }, [cameraMode, camera]);

  // 2. Initialize Camera Directly Behind Avatar on Mount / Mode Entry
  useEffect(() => {
    if (cameraMode !== 'avatar') {
      isFirstMountRef.current = true;
      isPlayingIntroRef.current = false;
      return;
    }

    if (avatarQuatRef?.current) {
      _avatarEuler.setFromQuaternion(avatarQuatRef.current, 'YXZ');
      avatarGameplayState.initializeSpawn(_avatarEuler.y);
    }

    const { hasCompletedInitialIntro } = worldStore.getState();
    if (!hasCompletedInitialIntro) {
      isPlayingIntroRef.current = true;
      introElapsedRef.current = 0;
      distanceRef.current = INTRO_START_DISTANCE;
    } else {
      isPlayingIntroRef.current = false;
      distanceRef.current = avatarGameplayState.cameraDistance;
      worldStore.getState().setIsAvatarControlsEnabled(true);
    }

    // Position camera immediately before first visible render to avoid any aerial frame flash
    if (avatarPosRef.current) {
      _camLookTarget.set(
        avatarPosRef.current.x,
        avatarPosRef.current.y + TARGET_HEIGHT,
        avatarPosRef.current.z
      );
      const initPitch = isPlayingIntroRef.current ? INTRO_START_PITCH : avatarGameplayState.cameraPitch;
      const initDist = isPlayingIntroRef.current ? INTRO_START_DISTANCE : avatarGameplayState.targetDistance;
      const yaw = avatarGameplayState.cameraYaw;
      const cosPitch = Math.cos(initPitch);
      const ux = cosPitch * Math.sin(yaw);
      const uy = Math.sin(initPitch);
      const uz = cosPitch * Math.cos(yaw);
      const clearDist = computeClearDistance(_camLookTarget, ux, uz, initDist);
      camera.position.set(
        _camLookTarget.x + clearDist * ux,
        Math.max(0.6, _camLookTarget.y + clearDist * uy),
        _camLookTarget.z + clearDist * uz
      );
      camera.lookAt(_camLookTarget);
      isFirstMountRef.current = false;
    }

    const handleResetAvatar = () => {
      console.log('[ThirdPersonCamera] Resetting camera directly behind avatar');
      if (avatarQuatRef?.current) {
        _avatarEuler.setFromQuaternion(avatarQuatRef.current, 'YXZ');
        avatarGameplayState.initializeSpawn(_avatarEuler.y);
      } else {
        avatarGameplayState.initializeSpawn(0);
      }
      isPlayingIntroRef.current = false;
      distanceRef.current = 3.5;
      isFirstMountRef.current = true;
    };

    window.addEventListener('reset-avatar-camera', handleResetAvatar);
    return () => window.removeEventListener('reset-avatar-camera', handleResetAvatar);
  }, [cameraMode, avatarQuatRef, avatarPosRef, camera, computeClearDistance]);

  // 3. Pointer Lock and Mouse Control Lifecycle
  useEffect(() => {
    if (cameraMode !== 'avatar') return;

    const dom = gl.domElement;

    const onCanvasClick = () => {
      const { isInteracting: interacting, isAvatarControlsEnabled } = worldStore.getState();
      if (interacting || !isAvatarControlsEnabled) return;
      if (document.pointerLockElement !== dom) {
        dom.requestPointerLock?.().catch(() => {});
      }
    };

    const onPointerLockChange = () => {
      const locked = document.pointerLockElement === dom;
      isPointerLockedRef.current = locked;
      worldStore.getState().setIsPointerLocked(locked);
    };

    const onPointerLockError = () => {
      isPointerLockedRef.current = false;
      worldStore.getState().setIsPointerLocked(false);
    };

    // Mouse look: Pointer Lock or Fallback Drag (Zero GC heap allocations)
    const onMouseMove = (e: MouseEvent) => {
      const { isInteracting: interacting, isAvatarControlsEnabled } = worldStore.getState();
      if (interacting || !isAvatarControlsEnabled) return;

      const isFirstPerson = worldStore.getState().hqInteriorPhase === 'inside';
      if (isPointerLockedRef.current) {
        avatarGameplayState.handleMouseMove(e.movementX, e.movementY, 0.0022, isFirstPerson);
      } else if (isDraggingRef.current) {
        const dx = e.clientX - lastMouseXRef.current;
        const dy = e.clientY - lastMouseYRef.current;
        lastMouseXRef.current = e.clientX;
        lastMouseYRef.current = e.clientY;
        avatarGameplayState.handleMouseMove(dx, dy, 0.0035, isFirstPerson);
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const { isInteracting: interacting, isAvatarControlsEnabled } = worldStore.getState();
      if (interacting || !isAvatarControlsEnabled) return;
      if (e.button === 0 || e.pointerType === 'touch') {
        isDraggingRef.current = true;
        lastMouseXRef.current = e.clientX;
        lastMouseYRef.current = e.clientY;
      }
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    // Scroll wheel zoom: 2.0m to 7.5m range
    const onWheel = (e: WheelEvent) => {
      const { isInteracting: interacting, isAvatarControlsEnabled } = worldStore.getState();
      if (interacting || !isAvatarControlsEnabled) return;
      e.preventDefault();
      avatarGameplayState.handleWheelZoom(e.deltaY);
    };

    dom.addEventListener('click', onCanvasClick);
    document.addEventListener('pointerlockchange', onPointerLockChange);
    document.addEventListener('pointerlockerror', onPointerLockError);
    window.addEventListener('mousemove', onMouseMove);
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      dom.removeEventListener('click', onCanvasClick);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      document.removeEventListener('pointerlockerror', onPointerLockError);
      window.removeEventListener('mousemove', onMouseMove);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      if (document.pointerLockElement === dom) {
        document.exitPointerLock?.();
      }
      worldStore.getState().setIsPointerLocked(false);
    };
  }, [cameraMode, gl]);

  // Release pointer lock whenever an interactive building modal opens
  useEffect(() => {
    if (isInteracting && document.pointerLockElement === gl.domElement) {
      document.exitPointerLock?.();
    }
  }, [isInteracting, gl]);

  // 4. Frame-Rate Independent Camera Follow Loop (Priority 2: runs immediately after avatar locomotion)
  useFrame((_, delta) => {
    if (cameraMode !== 'avatar') return;
    const dt = Math.min(delta, 0.05);

    const avatarPos = avatarPosRef.current;
    if (!avatarPos) return;

    // First frame initialization if needed
    if (!avatarGameplayState.hasInitialized && avatarQuatRef?.current) {
      _avatarEuler.setFromQuaternion(avatarQuatRef.current, 'YXZ');
      avatarGameplayState.initializeSpawn(_avatarEuler.y);
      distanceRef.current = avatarGameplayState.cameraDistance;
    }

    // Look-at Target: Centered on avatar upper body (1.5m above ground position)
    _camLookTarget.set(avatarPos.x, avatarPos.y + TARGET_HEIGHT, avatarPos.z);

    const hqPhase = worldStore.getState().hqInteriorPhase;

    // HQ Interior First-Person Immersive Camera & Smooth Enter/Exit Blending
    if (hqPhase !== 'outside') {
      // Eye-level position clamped safely inside HQ interior walls
      const eyeX = Math.max(-7.55, Math.min(7.55, avatarPos.x));
      const eyeY = avatarPos.y + 1.62;
      const eyeZ = Math.max(-0.85, Math.min(8.15, avatarPos.z));

      if (hqPhase === 'inside') {
        interiorBlendRef.current = 1.0;
        const yaw = avatarGameplayState.cameraYaw;
        const pitch = Math.max(-0.95, Math.min(0.95, avatarGameplayState.cameraPitch));
        const fpFactor = 1.0 - Math.exp(-18.0 * dt);

        camera.position.x += (eyeX - camera.position.x) * fpFactor;
        camera.position.y += (eyeY - camera.position.y) * fpFactor;
        camera.position.z += (eyeZ - camera.position.z) * fpFactor;

        // First-person look direction from yaw/pitch (non-inverted: mouse up -> pitch increases -> lookY increases)
        const cosPitch = Math.cos(pitch);
        const lookX = camera.position.x - cosPitch * Math.sin(yaw) * 4.0;
        const lookY = camera.position.y + Math.sin(pitch) * 4.0;
        const lookZ = camera.position.z - cosPitch * Math.cos(yaw) * 4.0;
        camera.lookAt(lookX, lookY, lookZ);
        return;
      }

      // 'entering' or 'exiting': smoothly blend between 3rd-person follow and 1st-person eye-level
      if (hqPhase === 'entering') {
        const targetBlend = avatarPos.z < 6.2 ? 1.0 : 0.0;
        interiorBlendRef.current += (targetBlend - interiorBlendRef.current) * Math.min(1.0, dt * 3.2);
        // Gently align yaw toward North (0 mod 2PI) as avatar approaches platform
        if (avatarPos.z < 6.2) {
          let diff = (0 - avatarGameplayState.cameraYaw) % (Math.PI * 2);
          if (diff > Math.PI) diff -= Math.PI * 2;
          if (diff < -Math.PI) diff += Math.PI * 2;
          avatarGameplayState.cameraYaw += diff * Math.min(1.0, dt * 3.5);
          avatarGameplayState.cameraPitch += (0.04 - avatarGameplayState.cameraPitch) * Math.min(1.0, dt * 3.5);
        }
      } else {
        // 'exiting': blend back to 3rd-person follow
        interiorBlendRef.current += (0.0 - interiorBlendRef.current) * Math.min(1.0, dt * 3.8);
        avatarGameplayState.cameraPitch += (0.2618 - avatarGameplayState.cameraPitch) * Math.min(1.0, dt * 3.5);
      }

      const b = Math.max(0, Math.min(1, interiorBlendRef.current));
      const yaw = avatarGameplayState.cameraYaw;
      const pitch = avatarGameplayState.cameraPitch;
      const cosPitch = Math.cos(pitch);
      const ux = cosPitch * Math.sin(yaw);
      const uy = Math.sin(pitch);
      const uz = cosPitch * Math.cos(yaw);

      const followDist = 3.2;
      const followX = _camLookTarget.x + followDist * ux;
      const followY = Math.max(0.8, _camLookTarget.y + followDist * uy);
      const followZ = _camLookTarget.z + followDist * uz;

      const desiredX = THREE.MathUtils.lerp(followX, eyeX, b);
      const desiredY = THREE.MathUtils.lerp(followY, eyeY, b);
      const desiredZ = THREE.MathUtils.lerp(followZ, eyeZ, b);

      const smooth = 1.0 - Math.exp(-12.0 * dt);
      camera.position.x += (desiredX - camera.position.x) * smooth;
      camera.position.y += (desiredY - camera.position.y) * smooth;
      camera.position.z += (desiredZ - camera.position.z) * smooth;

      const fpLookX = camera.position.x - cosPitch * Math.sin(yaw) * 4.0;
      const fpLookY = camera.position.y + Math.sin(pitch) * 4.0;
      const fpLookZ = camera.position.z - cosPitch * Math.cos(yaw) * 4.0;
      camera.lookAt(
        THREE.MathUtils.lerp(_camLookTarget.x, fpLookX, b),
        THREE.MathUtils.lerp(_camLookTarget.y, fpLookY, b),
        THREE.MathUtils.lerp(_camLookTarget.z, fpLookZ, b)
      );
      return;
    }

    interiorBlendRef.current = 0;

    // Initial GTA-style 1.25s settle transition from slightly above & behind to follow position
    if (isPlayingIntroRef.current) {
      const { isWorldRevealed, hasCompletedInitialIntro } = worldStore.getState();
      if (hasCompletedInitialIntro) {
        isPlayingIntroRef.current = false;
      } else {
        if (isWorldRevealed) {
          introElapsedRef.current += dt;
        }
        const rawT = Math.min(1, introElapsedRef.current / INTRO_DURATION);
        // Smooth cubic ease-in-out
        const easedT =
          rawT < 0.5 ? 4 * rawT * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

        const yaw = avatarGameplayState.cameraYaw;
        const introPitch = THREE.MathUtils.lerp(
          INTRO_START_PITCH,
          avatarGameplayState.cameraPitch,
          easedT
        );
        const introDist = THREE.MathUtils.lerp(
          INTRO_START_DISTANCE,
          avatarGameplayState.targetDistance,
          easedT
        );

        const cosPitch = Math.cos(introPitch);
        const ux = cosPitch * Math.sin(yaw);
        const uy = Math.sin(introPitch);
        const uz = cosPitch * Math.cos(yaw);

        const effectiveIntroDist = computeClearDistance(_camLookTarget, ux, uz, introDist);
        camera.position.set(
          _camLookTarget.x + effectiveIntroDist * ux,
          Math.max(0.6, _camLookTarget.y + effectiveIntroDist * uy),
          _camLookTarget.z + effectiveIntroDist * uz
        );
        camera.lookAt(_camLookTarget);

        if (rawT >= 1) {
          isPlayingIntroRef.current = false;
          isFirstMountRef.current = false;
          distanceRef.current = effectiveIntroDist;
          avatarGameplayState.lastMouseInputTime = performance.now();
          worldStore.getState().setHasCompletedInitialIntro(true);
          worldStore.getState().setIsAvatarControlsEnabled(true);
        }
        return;
      }
    }

    // GTA-Style Automatic Camera Alignment behind avatar during continuous locomotion
    if (avatarQuatRef?.current) {
      _avatarEuler.setFromQuaternion(avatarQuatRef.current, 'YXZ');
      avatarGameplayState.updateAutoAlignment(_avatarEuler.y, dt);
    }

    const yaw = avatarGameplayState.cameraYaw;
    const pitch = avatarGameplayState.cameraPitch;
    const targetDist = avatarGameplayState.targetDistance;

    // Unit Spherical Offset Vector from Look-Target toward Camera
    const cosPitch = Math.cos(pitch);
    const unitOffsetX = cosPitch * Math.sin(yaw);
    const unitOffsetY = Math.sin(pitch);
    const unitOffsetZ = cosPitch * Math.cos(yaw);

    // Camera Building Occlusion Avoidance (Raymarch from look-target toward camera)
    const maxClearDistance = computeClearDistance(_camLookTarget, unitOffsetX, unitOffsetZ, targetDist);

    // Smooth distance damping
    distanceRef.current += (maxClearDistance - distanceRef.current) * Math.min(1.0, 12.0 * dt);
    const effectiveDist = distanceRef.current;

    // Exact Camera Position: lookTarget + sphericalOffset(yaw, pitch, distance)
    const desiredCamX = _camLookTarget.x + effectiveDist * unitOffsetX;
    const desiredCamY = Math.max(0.6, _camLookTarget.y + effectiveDist * unitOffsetY);
    const desiredCamZ = _camLookTarget.z + effectiveDist * unitOffsetZ;

    if (isFirstMountRef.current) {
      camera.position.set(desiredCamX, desiredCamY, desiredCamZ);
      camera.lookAt(_camLookTarget);
      isFirstMountRef.current = false;
    } else {
      // Spring-smoothed camera position follow (GTA-style follow without delayed lag)
      const followFactor = 1.0 - Math.exp(-16.0 * dt);
      camera.position.x += (desiredCamX - camera.position.x) * followFactor;
      camera.position.y += (desiredCamY - camera.position.y) * followFactor;
      camera.position.z += (desiredCamZ - camera.position.z) * followFactor;
      camera.lookAt(_camLookTarget);
    }

    // Failsafe recovery: check for NaN/Infinity in camera state
    if (
      !Number.isFinite(camera.position.x) ||
      !Number.isFinite(camera.position.y) ||
      !Number.isFinite(camera.position.z) ||
      !Number.isFinite(camera.quaternion.x) ||
      !Number.isFinite(camera.quaternion.y) ||
      !Number.isFinite(camera.quaternion.z) ||
      !Number.isFinite(camera.quaternion.w)
    ) {
      console.warn('[ThirdPersonCamera] Invalid camera values detected (NaN/Infinity). Executing automatic recovery.');
      camera.position.set(_camLookTarget.x, _camLookTarget.y + 1.2, _camLookTarget.z + 3.5);
      camera.up.set(0, 1, 0);
      camera.lookAt(_camLookTarget);
      return;
    }
  }); // Default priority: runs with frame loop, preserving R3F automatic scene render

  return null;
};

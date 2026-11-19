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
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isFirstMountRef = useRef<boolean>(true);

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
      return;
    }

    if (avatarQuatRef?.current) {
      _avatarEuler.setFromQuaternion(avatarQuatRef.current, 'YXZ');
      avatarGameplayState.initializeSpawn(_avatarEuler.y);
      distanceRef.current = avatarGameplayState.cameraDistance;
    }

    const handleResetAvatar = () => {
      console.log('[ThirdPersonCamera] Resetting camera directly behind avatar');
      if (avatarQuatRef?.current) {
        _avatarEuler.setFromQuaternion(avatarQuatRef.current, 'YXZ');
        avatarGameplayState.initializeSpawn(_avatarEuler.y);
      } else {
        avatarGameplayState.initializeSpawn(0);
      }
      distanceRef.current = 3.5;
      isFirstMountRef.current = true;
    };

    window.addEventListener('reset-avatar-camera', handleResetAvatar);
    return () => window.removeEventListener('reset-avatar-camera', handleResetAvatar);
  }, [cameraMode, avatarQuatRef]);

  // 3. Pointer Lock and Mouse Control Lifecycle
  useEffect(() => {
    if (cameraMode !== 'avatar') return;

    const dom = gl.domElement;

    const onCanvasClick = () => {
      if (worldStore.getState().isInteracting) return;
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

    // Mouse look: Pointer Lock or Fallback Drag
    const onMouseMove = (e: MouseEvent) => {
      if (worldStore.getState().isInteracting) return;

      if (isPointerLockedRef.current) {
        avatarGameplayState.handleMouseMove(e.movementX, e.movementY, 0.0022);
      } else if (isDraggingRef.current) {
        const dx = e.clientX - lastMousePosRef.current.x;
        const dy = e.clientY - lastMousePosRef.current.y;
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
        avatarGameplayState.handleMouseMove(dx, dy, 0.0035);
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (worldStore.getState().isInteracting) return;
      if (e.button === 0 || e.pointerType === 'touch') {
        isDraggingRef.current = true;
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    // Scroll wheel zoom: 2.0m to 7.5m range
    const onWheel = (e: WheelEvent) => {
      if (worldStore.getState().isInteracting) return;
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

    // GTA-Style Automatic Camera Alignment behind avatar during continuous locomotion
    if (avatarQuatRef?.current) {
      _avatarEuler.setFromQuaternion(avatarQuatRef.current, 'YXZ');
      avatarGameplayState.updateAutoAlignment(_avatarEuler.y, dt);
    }

    // Look-at Target: Centered on avatar upper body (1.5m above ground position)
    _camLookTarget.set(avatarPos.x, avatarPos.y + TARGET_HEIGHT, avatarPos.z);

    const yaw = avatarGameplayState.cameraYaw;
    const pitch = avatarGameplayState.cameraPitch;
    const targetDist = avatarGameplayState.targetDistance;

    // Unit Spherical Offset Vector from Look-Target toward Camera
    const cosPitch = Math.cos(pitch);
    const unitOffsetX = cosPitch * Math.sin(yaw);
    const unitOffsetY = Math.sin(pitch);
    const unitOffsetZ = cosPitch * Math.cos(yaw);

    // Camera Building Occlusion Avoidance (Raymarch from look-target toward camera)
    let maxClearDistance = targetDist;
    const stepCount = 8;
    const camMargin = 0.45;

    for (let i = 1; i <= stepCount; i++) {
      const testDist = (targetDist * i) / stepCount;
      const testX = _camLookTarget.x + unitOffsetX * testDist;
      const testZ = _camLookTarget.z + unitOffsetZ * testDist;

      for (let j = 0; j < navigator.colliders.length; j++) {
        const c = navigator.colliders[j];
        if (
          testX >= c.minX - camMargin &&
          testX <= c.maxX + camMargin &&
          testZ >= c.minZ - camMargin &&
          testZ <= c.maxZ + camMargin
        ) {
          maxClearDistance = Math.max(1.8, ((targetDist * (i - 1)) / stepCount) - 0.2);
          break;
        }
      }
      if (maxClearDistance < targetDist) break;
    }

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

'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { WORLD_DISTRICTS } from './WorldConfig';

interface CinematicCameraControllerProps {
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  rotationRef: React.MutableRefObject<number>;
  isMovingRef: React.MutableRefObject<boolean>;
  isIntroActive: boolean;
  onIntroComplete: () => void;
  cameraMode: 'follow' | 'tactical';
  keysPressedRef: React.MutableRefObject<Record<string, boolean>>;
}

// Module-scoped static scratch vectors (ZERO heap allocation inside useFrame!)
const _startCam = new THREE.Vector3(0, 2.5, -16);
const _targetCam = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();
const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _tacticalPos = new THREE.Vector3();

/**
 * AAA Street-Level Over-The-Shoulder Third-Person Camera Engine (Matching Reference Image 1)
 * Features:
 * - Real street-level eye height (1.8m - 2.2m)
 * - Cinematic over-the-shoulder framing with smooth mouse orbit
 * - Mouse wheel zoom damping (2.2m - 7.0m)
 * - Dynamic collision response against district buildings
 * - Fast cinematic street intro sweep gliding down the neon avenue
 */
export const CinematicCameraController: React.FC<CinematicCameraControllerProps> = ({
  playerPosRef,
  rotationRef,
  isMovingRef,
  isIntroActive,
  onIntroComplete,
  cameraMode,
  keysPressedRef,
}) => {
  const { camera } = useThree();
  const introStartTimeRef = useRef<number | null>(null);

  // Third-person camera orbit and pitch angles relative to player
  const cameraOrbitAngleRef = useRef<number>(0); // 0 = looking straight North down the avenue
  const cameraPitchRef = useRef<number>(0.12); // gentle street-level eye gaze
  const cameraZoomRef = useRef<number>(3.8); // 3.8m distance behind player
  const isPointerDraggingRef = useRef<boolean>(false);
  const previousMouseXRef = useRef<number>(0);
  const previousMouseYRef = useRef<number>(0);

  // Mouse orbit & wheel zoom event listeners
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.closest('button, a, input')) return;
      isPointerDraggingRef.current = true;
      previousMouseXRef.current = e.clientX;
      previousMouseYRef.current = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerDraggingRef.current) return;
      const deltaX = e.clientX - previousMouseXRef.current;
      const deltaY = e.clientY - previousMouseYRef.current;
      previousMouseXRef.current = e.clientX;
      previousMouseYRef.current = e.clientY;

      cameraOrbitAngleRef.current -= deltaX * 0.0055;
      // Clamp pitch to keep camera at street level without flipping
      cameraPitchRef.current = Math.max(
        -0.2,
        Math.min(0.65, cameraPitchRef.current + deltaY * 0.004)
      );
    };

    const handleMouseUp = () => {
      isPointerDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      cameraZoomRef.current = Math.max(
        2.2,
        Math.min(7.5, cameraZoomRef.current + e.deltaY * 0.004)
      );
    };

    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useFrame((state, delta) => {
    const time = performance.now() * 0.001;

    // ========================================================
    // 1. CINEMATIC STREET-LEVEL INTRO SWEEP
    // ========================================================
    if (isIntroActive) {
      if (introStartTimeRef.current === null) {
        introStartTimeRef.current = time;
      }
      const introElapsed = time - introStartTimeRef.current;
      const introDuration = 3.6;

      if (introElapsed >= introDuration) {
        onIntroComplete();
        return;
      }

      const t = introElapsed / introDuration;
      // Smooth cubic ease-in-out
      const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      // Glide camera forward from 16m in front at street level to behind the avatar's shoulder
      const px = playerPosRef.current.x;
      const pz = playerPosRef.current.z;

      _startCam.set(px, 1.8, pz - 14);
      _targetCam.set(px + 0.35, 2.1, pz + 3.8);

      camera.position.lerpVectors(_startCam, _targetCam, easeT);
      _lookTarget.set(px, 1.45, pz);
      camera.lookAt(_lookTarget);
      return;
    }

    // ========================================================
    // 2. PLAYER LOCOMOTION & BUILDING COLLISION
    // ========================================================
    const keys = keysPressedRef.current;
    let moveX = 0;
    let moveZ = 0;

    if (keys['w'] || keys['W'] || keys['ArrowUp']) moveZ -= 1;
    if (keys['s'] || keys['S'] || keys['ArrowDown']) moveZ += 1;
    if (keys['a'] || keys['A'] || keys['ArrowLeft']) moveX -= 1;
    if (keys['d'] || keys['D'] || keys['ArrowRight']) moveX += 1;

    const isRunning = keys['Shift'] || keys['ShiftLeft'] || keys['ShiftRight'];
    const isMoving = moveX !== 0 || moveZ !== 0;
    isMovingRef.current = isMoving;

    if (isMoving) {
      const baseSpeed = isRunning ? 14.5 : 8.5; // Walk vs Sprint
      const camYaw = cameraOrbitAngleRef.current;

      _forward.set(-Math.sin(camYaw), 0, -Math.cos(camYaw));
      _right.set(Math.cos(camYaw), 0, -Math.sin(camYaw));

      _dir.set(0, 0, 0)
        .addScaledVector(_forward, -moveZ)
        .addScaledVector(_right, moveX)
        .normalize();

      const nextX = playerPosRef.current.x + _dir.x * baseSpeed * delta;
      const nextZ = playerPosRef.current.z + _dir.z * baseSpeed * delta;

      // Smooth heading orientation toward movement direction
      rotationRef.current = Math.atan2(_dir.x, _dir.z);

      // Building & Monument Collision Detection
      let collides = false;

      // 1. Central Monument Plinth Collision (radius 3.2m at 0, 0)
      if (Math.hypot(nextX, nextZ) < 3.2) {
        collides = true;
      }

      // 2. Building AABB Box Collisions
      if (!collides) {
        for (let i = 0; i < WORLD_DISTRICTS.length; i++) {
          const d = WORLD_DISTRICTS[i];
          const halfW = (d.width || 8) * 0.46;
          const halfD = (d.depth || 8) * 0.46;
          const dx = Math.abs(nextX - d.x);
          const dz = Math.abs(nextZ - d.z);

          if (dx < halfW && dz < halfD) {
            collides = true;
            break;
          }
        }
      }

      if (!collides) {
        // City street boundary clamping (Nexus City perimeter: -56m to 56m)
        playerPosRef.current.x = Math.max(-56, Math.min(56, nextX));
        playerPosRef.current.z = Math.max(-56, Math.min(56, nextZ));
      }
    }

    // ========================================================
    // 3. STREET-LEVEL THIRD-PERSON OVER-THE-SHOULDER CAMERA
    // ========================================================
    if (cameraMode === 'follow') {
      const dist = cameraZoomRef.current;
      const orbit = cameraOrbitAngleRef.current;
      const pitch = cameraPitchRef.current;

      // Eye-level camera height: ~1.85m to 2.3m
      const camHeight = 1.85 + pitch * 1.8;
      // Slight +0.35m offset to the right shoulder for cinematic action-RPG feel (Image 1)
      const shoulderOffsetX = Math.cos(orbit) * 0.35;
      const shoulderOffsetZ = -Math.sin(orbit) * 0.35;

      const targetX = playerPosRef.current.x + Math.sin(orbit) * dist + shoulderOffsetX;
      const targetZ = playerPosRef.current.z + Math.cos(orbit) * dist + shoulderOffsetZ;
      const targetY = Math.max(0.6, playerPosRef.current.y + camHeight);

      // Smooth camera damping for silky feel
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, delta * 9);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, delta * 9);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 9);

      // Look slightly forward of the player's chest at eye level
      _lookTarget.set(
        playerPosRef.current.x,
        playerPosRef.current.y + 1.45,
        playerPosRef.current.z
      );
      camera.lookAt(_lookTarget);
    } else {
      // Tactical Overhead Map View
      _tacticalPos.set(
        playerPosRef.current.x,
        playerPosRef.current.y + 26,
        playerPosRef.current.z + 16
      );
      camera.position.lerp(_tacticalPos, delta * 4);
      camera.lookAt(playerPosRef.current);
    }
  });

  return null;
};

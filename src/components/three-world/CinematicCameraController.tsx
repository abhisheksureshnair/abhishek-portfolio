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

  // Third-person camera orbit angle relative to player
  const cameraOrbitAngleRef = useRef<number>(0);
  const cameraPitchRef = useRef<number>(0.28); // gentle downward tilt
  const isPointerDraggingRef = useRef<boolean>(false);
  const previousMouseXRef = useRef<number>(0);
  const previousMouseYRef = useRef<number>(0);

  // Mouse drag handler for orbiting camera around player
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // Don't capture clicks on HUD buttons
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

      cameraOrbitAngleRef.current -= deltaX * 0.005;
      cameraPitchRef.current = Math.max(
        0.05,
        Math.min(1.2, cameraPitchRef.current + deltaY * 0.004)
      );
    };

    const handleMouseUp = () => {
      isPointerDraggingRef.current = false;
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // ========================================================
    // 1. INTRO CINEMATIC CAMERA SWEEP
    // ========================================================
    if (isIntroActive) {
      if (introStartTimeRef.current === null) {
        introStartTimeRef.current = time;
      }
      const introElapsed = time - introStartTimeRef.current;
      const introDuration = 4.0; // 4 seconds cinematic intro

      if (introElapsed >= introDuration) {
        onIntroComplete();
        return;
      }

      // Smooth cubic ease-in-out curve
      const t = introElapsed / introDuration;
      const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      // Start: High vantage point [0, 38, 56]
      // End: Behind player [0, 4.5, 14]
      const startCam = new THREE.Vector3(0, 36, 52);
      const targetCam = new THREE.Vector3(
        playerPosRef.current.x,
        playerPosRef.current.y + 4.5,
        playerPosRef.current.z + 8.5
      );

      camera.position.lerpVectors(startCam, targetCam, easeT);
      camera.lookAt(
        new THREE.Vector3(
          playerPosRef.current.x,
          playerPosRef.current.y + 1.2,
          playerPosRef.current.z
        )
      );
      return;
    }

    // ========================================================
    // 2. PLAYER MOVEMENT & COLLISION RESOLUTION (Render Loop!)
    // ========================================================
    const keys = keysPressedRef.current;
    let moveX = 0;
    let moveZ = 0;

    if (keys['w'] || keys['W'] || keys['ArrowUp']) moveZ -= 1;
    if (keys['s'] || keys['S'] || keys['ArrowDown']) moveZ += 1;
    if (keys['a'] || keys['A'] || keys['ArrowLeft']) moveX -= 1;
    if (keys['d'] || keys['D'] || keys['ArrowRight']) moveX += 1;

    const isMoving = moveX !== 0 || moveZ !== 0;
    isMovingRef.current = isMoving;

    if (isMoving) {
      // Speed in units/sec
      const speed = 12.0;

      // Rotate movement vector relative to camera heading
      const camYaw = cameraOrbitAngleRef.current;
      const forward = new THREE.Vector3(-Math.sin(camYaw), 0, -Math.cos(camYaw));
      const right = new THREE.Vector3(Math.cos(camYaw), 0, -Math.sin(camYaw));

      const dir = new THREE.Vector3()
        .addScaledVector(forward, -moveZ)
        .addScaledVector(right, moveX)
        .normalize();

      // Desired new position
      const nextX = playerPosRef.current.x + dir.x * speed * delta;
      const nextZ = playerPosRef.current.z + dir.z * speed * delta;

      // Update avatar facing orientation
      rotationRef.current = Math.atan2(dir.x, dir.z);

      // Building Collision Detection against all 9 districts
      let collides = false;
      for (const d of WORLD_DISTRICTS) {
        // Safe clearance radius around building
        const clearance = Math.max(d.width, d.depth) * 0.55 + 0.5;
        const dx = nextX - d.x;
        const dz = nextZ - d.z;
        const distSq = dx * dx + dz * dz;

        if (distSq < clearance * clearance) {
          collides = true;
          break;
        }
      }

      if (!collides) {
        // Clamp city outer boundary (-44 to 44)
        playerPosRef.current.x = Math.max(-44, Math.min(44, nextX));
        playerPosRef.current.z = Math.max(-44, Math.min(44, nextZ));
      }
    }

    // ========================================================
    // 3. THIRD-PERSON FOLLOW CAMERA
    // ========================================================
    if (cameraMode === 'follow') {
      const followDist = 8.5;
      const camHeight = 3.8 + cameraPitchRef.current * 4.0;
      const orbit = cameraOrbitAngleRef.current;

      const idealCamX = playerPosRef.current.x + Math.sin(orbit) * followDist;
      const idealCamZ = playerPosRef.current.z + Math.cos(orbit) * followDist;
      const idealCamY = playerPosRef.current.y + camHeight;

      // Smooth camera follow with damping
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, idealCamX, delta * 8);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, idealCamY, delta * 8);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, idealCamZ, delta * 8);

      const lookTarget = new THREE.Vector3(
        playerPosRef.current.x,
        playerPosRef.current.y + 1.2,
        playerPosRef.current.z
      );
      camera.lookAt(lookTarget);
    } else {
      // Tactical Overhead View
      const tacticalPos = new THREE.Vector3(
        playerPosRef.current.x,
        playerPosRef.current.y + 24,
        playerPosRef.current.z + 18
      );
      camera.position.lerp(tacticalPos, delta * 4);
      camera.lookAt(playerPosRef.current);
    }
  });

  return null;
};

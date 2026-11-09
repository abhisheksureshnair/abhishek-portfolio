'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

export type SelectedBuildingType = 'hero' | 'about' | 'projects' | 'skills' | 'experience' | 'contact' | null;

interface CityCameraControllerProps {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  selectedBuilding?: SelectedBuildingType;
  cameraMode?: 'follow' | 'tactical';
  playerPosRef?: React.MutableRefObject<THREE.Vector3>;
  isIntroActive?: boolean;
  onIntroComplete?: () => void;
  // Backward compatibility props
  isHeroSelected?: boolean;
  heroPosition?: [number, number, number];
  aboutPosition?: [number, number, number];
  projectsPosition?: [number, number, number];
  skillsPosition?: [number, number, number];
  experiencePosition?: [number, number, number];
  contactPosition?: [number, number, number];
}

// Module-level scratch vectors to prevent runtime heap allocation
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _lerpCamPos = new THREE.Vector3();
const _scratchVec1 = new THREE.Vector3();
const _scratchVec2 = new THREE.Vector3();
const _defaultCamPos = new THREE.Vector3(18, 16, 22);
const _defaultLookAt = new THREE.Vector3(0, 0, 0);

/**
 * CityCameraController
 * 
 * Features:
 * 1. Cinematic introductory flyover arc sweeping over the entire 60x60 diorama city
 * 2. Reduced-motion respect (instant bypass of flyover if requested by system)
 * 3. Smooth parabolic camera flight between buildings (avoids clipping through skyscrapers)
 * 4. Responsive mobile camera framing (adjusts isometric distance for portrait viewports)
 * 5. Third-person follow camera tracking the miniature developer avatar
 * 6. Free OrbitControls in Tactical mode
 */
export const CityCameraController: React.FC<CityCameraControllerProps> = ({
  controlsRef,
  selectedBuilding = null,
  cameraMode = 'follow',
  playerPosRef,
  isIntroActive = false,
  onIntroComplete,
  isHeroSelected = false,
  heroPosition = [-7.85, 0.74, -7.35],
  aboutPosition = [7.85, 0.74, -7.35],
  projectsPosition = [-7.85, 0.74, 7.35],
  skillsPosition = [7.85, 0.74, 7.35],
  experiencePosition = [0, 0.74, 21.5],
  contactPosition = [0, 0.74, -21.5],
}) => {
  const { camera, size } = useThree();
  const isTransitioningRef = useRef(true);
  const introStartTimeRef = useRef<number | null>(null);
  const previousBuildingRef = useRef<SelectedBuildingType>(null);
  const travelProgressRef = useRef<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const activeSelection = selectedBuilding ?? (isHeroSelected ? 'hero' : null);

  // Check system reduced-motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Reset transition timer when selection or mode changes
  useEffect(() => {
    isTransitioningRef.current = true;
    travelProgressRef.current = 0;
    previousBuildingRef.current = activeSelection;
  }, [activeSelection, cameraMode]);

  // Handle intro start / skip
  useEffect(() => {
    if (isIntroActive) {
      if (prefersReducedMotion) {
        // If reduced motion is preferred, immediately finish intro without spinning
        onIntroComplete?.();
        return;
      }
      introStartTimeRef.current = performance.now() * 0.001;
    } else {
      introStartTimeRef.current = null;
    }
  }, [isIntroActive, prefersReducedMotion, onIntroComplete]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    const time = performance.now() * 0.001;
    const isMobile = size.width < 768 || size.width / size.height < 1.0;
    const mobileDistMultiplier = isMobile ? 1.34 : 1.0;

    // ========================================================
    // 1. CINEMATIC INTRODUCTORY FLYOVER
    // ========================================================
    if (isIntroActive && !prefersReducedMotion) {
      if (introStartTimeRef.current === null) {
        introStartTimeRef.current = time;
      }
      const introElapsed = time - introStartTimeRef.current;
      const introDuration = 4.8; // seconds

      if (introElapsed >= introDuration) {
        onIntroComplete?.();
      } else {
        const t = introElapsed / introDuration;
        // Smooth cubic ease-in-out
        const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        // Sweep camera in an elevated arc around the diorama
        const angle = 0.85 + easeT * 1.1;
        const radius = (38 - easeT * 14) * mobileDistMultiplier;
        const camX = Math.cos(angle) * radius;
        const camZ = Math.sin(angle) * radius;
        const camY = 32 - easeT * 18;

        const px = playerPosRef?.current?.x ?? 0;
        const py = playerPosRef?.current?.y ?? 0.62;
        const pz = playerPosRef?.current?.z ?? 14;

        camera.position.set(camX, camY, camZ);
        _scratchVec1.set(0, 2.5, 0);
        _scratchVec2.set(px, py + 1.0, pz);
        _targetLookAt.lerpVectors(_scratchVec1, _scratchVec2, easeT);
        controls.target.copy(_targetLookAt);
        const prevDamping = controls.enableDamping;
        controls.enableDamping = false;
        controls.update();
        controls.enableDamping = prevDamping;
        return;
      }
    }

    // ========================================================
    // 2. TARGET POSITION COMPUTATION
    // ========================================================
    if (activeSelection === 'hero') {
      const [hx, hy, hz] = heroPosition;
      _targetLookAt.set(hx, hy + 2.2, hz + 1.2);
      _targetCamPos.set(
        hx + 5.2 * mobileDistMultiplier,
        hy + 3.8 * mobileDistMultiplier,
        hz + 6.8 * mobileDistMultiplier
      );
    } else if (activeSelection === 'about') {
      const [ax, ay, az] = aboutPosition;
      _targetLookAt.set(ax, ay + 2.0, az + 0.8);
      _targetCamPos.set(
        ax + 4.8 * mobileDistMultiplier,
        ay + 3.4 * mobileDistMultiplier,
        az + 6.2 * mobileDistMultiplier
      );
    } else if (activeSelection === 'projects') {
      const [px, py, pz] = projectsPosition;
      _targetLookAt.set(px, py + 2.2, pz + 0.8);
      _targetCamPos.set(
        px + 5.2 * mobileDistMultiplier,
        py + 3.8 * mobileDistMultiplier,
        pz + 6.6 * mobileDistMultiplier
      );
    } else if (activeSelection === 'skills') {
      const [sx, sy, sz] = skillsPosition;
      _targetLookAt.set(sx, sy + 4.2, sz + 0.8);
      _targetCamPos.set(
        sx + 5.8 * mobileDistMultiplier,
        sy + 5.6 * mobileDistMultiplier,
        sz + 7.6 * mobileDistMultiplier
      );
    } else if (activeSelection === 'experience') {
      const [ex, ey, ez] = experiencePosition;
      _targetLookAt.set(ex, ey + 3.4, ez - 0.4);
      _targetCamPos.set(
        ex + 4.8 * mobileDistMultiplier,
        ey + 4.6 * mobileDistMultiplier,
        ez - 7.6 * mobileDistMultiplier
      );
    } else if (activeSelection === 'contact') {
      const [cx, cy, cz] = contactPosition;
      _targetLookAt.set(cx, cy + 2.8, cz + 0.4);
      _targetCamPos.set(
        cx - 4.8 * mobileDistMultiplier,
        cy + 4.2 * mobileDistMultiplier,
        cz + 7.6 * mobileDistMultiplier
      );
    } else if (cameraMode === 'follow' && playerPosRef) {
      // Third-Person Elevated Isometric Follow Camera
      const px = playerPosRef.current.x;
      const py = playerPosRef.current.y;
      const pz = playerPosRef.current.z;

      _targetLookAt.set(px, py + 0.85, pz);
      _targetCamPos.set(
        px + 8.5 * mobileDistMultiplier,
        py + 8.0 * mobileDistMultiplier,
        pz + 10.5 * mobileDistMultiplier
      );
      isTransitioningRef.current = true;
    } else {
      // Tactical Mode: Full diorama city overview
      _targetLookAt.copy(_defaultLookAt);
      _targetCamPos.set(
        _defaultCamPos.x * mobileDistMultiplier,
        _defaultCamPos.y * mobileDistMultiplier,
        _defaultCamPos.z * mobileDistMultiplier
      );
    }

    // ========================================================
    // 3. FRAME-RATE INDEPENDENT LERP & SMOOTH ARC TRAVEL
    // ========================================================
    if (isTransitioningRef.current) {
      travelProgressRef.current = Math.min(1, travelProgressRef.current + delta * 2.5);

      // Parabolic elevation lift during inter-building travel to avoid clipping
      let parabolicLift = 0;
      if (activeSelection !== null && travelProgressRef.current < 1) {
        parabolicLift = Math.sin(travelProgressRef.current * Math.PI) * 2.8;
      }

      const lambda = prefersReducedMotion
        ? 14
        : cameraMode === 'follow' && !activeSelection
        ? 5.5
        : 4.2;
      const factor = 1 - Math.exp(-lambda * delta);

      // Safe non-mutating copy for camera position interpolation
      _lerpCamPos.copy(_targetCamPos);
      _lerpCamPos.y += parabolicLift;

      camera.position.lerp(_lerpCamPos, factor);
      controls.target.lerp(_targetLookAt, factor);
      const prevDamping = controls.enableDamping;
      controls.enableDamping = false;
      controls.update();
      controls.enableDamping = prevDamping;

      // Only finish transition if not continuously tracking moving player
      if (cameraMode !== 'follow' || activeSelection !== null) {
        const distPos = camera.position.distanceTo(_targetCamPos);
        const distTarget = controls.target.distanceTo(_targetLookAt);
        if (distPos < 0.05 && distTarget < 0.05) {
          isTransitioningRef.current = false;
        }
      }
    }
  });

  return null;
};

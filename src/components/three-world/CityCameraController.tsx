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

// Module-level static scratch objects (Zero runtime GC allocation)
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _lerpCamPos = new THREE.Vector3();
const _scratchVec1 = new THREE.Vector3();
const _scratchVec2 = new THREE.Vector3();
const _defaultCamPos = new THREE.Vector3(18, 16, 22);
const _defaultLookAt = new THREE.Vector3(0, 0, 0);

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

  // User mouse orbit tracking ref (Requirement 6 & 11)
  const isUserOrbitingRef = useRef(false);

  // User's custom spherical follow offset relative to player
  const followOffsetRef = useRef<THREE.Vector3>(new THREE.Vector3(8.5, 8.0, 10.5));
  const hasInitializedOffsetRef = useRef(false);

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

  // Listen to OrbitControls events to guarantee follow camera and OrbitControls NEVER update simultaneously (Requirement 6)
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleOrbitStart = () => {
      isUserOrbitingRef.current = true;
    };

    const handleOrbitEnd = () => {
      isUserOrbitingRef.current = false;
      // When user finishes orbiting, preserve the newly chosen relative offset from the target
      if (controls && controls.target) {
        followOffsetRef.current.copy(camera.position).sub(controls.target);
        // Clamp minimum and maximum follow distance
        const len = followOffsetRef.current.length();
        const clampedLen = Math.max(5.5, Math.min(26.0, len));
        followOffsetRef.current.multiplyScalar(clampedLen / len);
        // Ensure camera stays above ground
        if (followOffsetRef.current.y < 1.6) {
          followOffsetRef.current.y = 1.6;
        }
      }
    };

    controls.addEventListener('start', handleOrbitStart);
    controls.addEventListener('end', handleOrbitEnd);

    return () => {
      controls.removeEventListener('start', handleOrbitStart);
      controls.removeEventListener('end', handleOrbitEnd);
    };
  }, [controlsRef.current, camera]);

  // Reset transition timer when selection or mode changes
  useEffect(() => {
    isTransitioningRef.current = true;
    travelProgressRef.current = 0;
    previousBuildingRef.current = activeSelection;

    // Reset default follow offset when switching into follow mode
    if (cameraMode === 'follow' && !activeSelection) {
      const isMobile = size.width < 768 || size.width / size.height < 1.0;
      const mult = isMobile ? 1.34 : 1.0;
      followOffsetRef.current.set(8.5 * mult, 8.0 * mult, 10.5 * mult);
    }
  }, [activeSelection, cameraMode, size.width, size.height]);

  // Handle intro start / skip
  useEffect(() => {
    if (isIntroActive) {
      if (prefersReducedMotion) {
        onIntroComplete?.();
        return;
      }
      introStartTimeRef.current = performance.now() * 0.001;
    } else {
      introStartTimeRef.current = null;
    }
  }, [isIntroActive, prefersReducedMotion, onIntroComplete]);

  useFrame((_, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;

    const controls = controlsRef.current;
    if (!controls) return;

    // Clamp delta time to 50ms to prevent sudden camera jumps on lag spikes (Requirement 2 & 10)
    const dt = Math.min(delta, 0.05);
    const time = performance.now() * 0.001;
    const isMobile = size.width < 768 || size.width / size.height < 1.0;
    const mobileDistMultiplier = isMobile ? 1.34 : 1.0;

    // Initialize follow offset once if needed
    if (!hasInitializedOffsetRef.current) {
      followOffsetRef.current.set(
        8.5 * mobileDistMultiplier,
        8.0 * mobileDistMultiplier,
        10.5 * mobileDistMultiplier
      );
      hasInitializedOffsetRef.current = true;
    }

    // ========================================================
    // 1. CINEMATIC INTRODUCTORY FLYOVER
    // ========================================================
    if (isIntroActive && !prefersReducedMotion) {
      // Disable OrbitControls during flyover to prevent simultaneous camera mutations
      controls.enabled = false;

      if (introStartTimeRef.current === null) {
        introStartTimeRef.current = time;
      }
      const introElapsed = time - introStartTimeRef.current;
      const introDuration = 4.8; // seconds

      if (introElapsed >= introDuration) {
        controls.enabled = true;
        onIntroComplete?.();
      } else {
        const t = introElapsed / introDuration;
        const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

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
        controls.update();
        return;
      }
    }

    // ========================================================
    // 2. USER IS ACTIVELY ORBITING (Requirement 6 & 11)
    // ========================================================
    if (isUserOrbitingRef.current) {
      // While user is actively orbiting with mouse/touch, OrbitControls has exclusive authority.
      // Follow camera MUST NOT modify camera.position or controls.target simultaneously.
      // Continuously update follow offset so release transitions seamlessly.
      if (controls.target) {
        followOffsetRef.current.copy(camera.position).sub(controls.target);
      }
      return;
    }

    // ========================================================
    // 3. TARGET POSITION & ORIENTATION COMPUTATION
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
      // Third-Person Smooth Follow Camera (persisting user-chosen orbit angle)
      const px = playerPosRef.current.x;
      const pz = playerPosRef.current.z;

      // Stable look-at height at avatar chest level (decoupled from road/sidewalk curb hops)
      _targetLookAt.set(px, 1.45, pz);
      _targetCamPos.copy(_targetLookAt).add(followOffsetRef.current);
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
    // 4. DELTA-TIME-AWARE DAMPING & SMOOTH CAMERA FOLLOWING (Requirement 5)
    // ========================================================
    if (isTransitioningRef.current) {
      travelProgressRef.current = Math.min(1, travelProgressRef.current + dt * 2.5);

      // Parabolic elevation lift during inter-building travel to avoid clipping skyscrapers
      let parabolicLift = 0;
      if (activeSelection !== null && travelProgressRef.current < 1) {
        parabolicLift = Math.sin(travelProgressRef.current * Math.PI) * 2.8;
      }

      // Responsive, fluid tracking rate following camera-systems skill (lambda ~ 11.0)
      const lambda = prefersReducedMotion
        ? 16.0
        : cameraMode === 'follow' && !activeSelection
        ? 11.0
        : 5.5;
      // Exact exponential decay factor: 1 - e^(-lambda * dt) (Requirement 2 & 5)
      const factor = 1 - Math.exp(-lambda * dt);

      _lerpCamPos.copy(_targetCamPos);
      _lerpCamPos.y += parabolicLift;

      // In steady follow mode, smoothly damp target and keep camera positioned relative to target
      if (cameraMode === 'follow' && !activeSelection) {
        controls.target.lerp(_targetLookAt, factor);
        _targetCamPos.copy(controls.target).add(followOffsetRef.current);
        camera.position.lerp(_targetCamPos, factor);
      } else {
        camera.position.lerp(_lerpCamPos, factor);
        controls.target.lerp(_targetLookAt, factor);
      }

      // For tactical mode or building focus, complete transition when arrived
      if (cameraMode !== 'follow' || activeSelection !== null) {
        const distPos = camera.position.distanceTo(_targetCamPos);
        const distTarget = controls.target.distanceTo(_targetLookAt);
        if (distPos < 0.05 && distTarget < 0.05) {
          isTransitioningRef.current = false;
          controls.enabled = true;
        }
      }
    }
  });

  return null;
};

'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { SelectedBuildingType } from './CityCameraController';
import { EarthLocation } from './RealisticEarth';

export type WorldViewMode = 'space' | 'descending' | 'city' | 'ascending';
export type CityCameraPerspective = 'aerial' | 'street' | 'drone' | 'first-person';

interface SpaceToCityCameraControllerProps {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  viewMode: WorldViewMode;
  onViewModeChange: (mode: WorldViewMode) => void;
  targetLocation: EarthLocation | null;
  cityPerspective?: CityCameraPerspective;
  selectedBuilding?: SelectedBuildingType;
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  rotationRef?: React.MutableRefObject<number>;
  onTransitionProgress?: (progress: number, altitude: number) => void;
  // Building coordinate targets in city space
  heroPosition?: [number, number, number];
  aboutPosition?: [number, number, number];
  projectsPosition?: [number, number, number];
  skillsPosition?: [number, number, number];
  experiencePosition?: [number, number, number];
  contactPosition?: [number, number, number];
}

// Module-level static vectors (Zero GC allocation)
const _spaceCamPos = new THREE.Vector3(0, 16, 75);
const _spaceLookAt = new THREE.Vector3(0, 0, 0);

const _cityAerialPos = new THREE.Vector3(22, 20, 26);
const _cityAerialLookAt = new THREE.Vector3(0, 0.5, 0);

const _tempVec1 = new THREE.Vector3();
const _tempVec2 = new THREE.Vector3();
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();

// Building bounding boxes for camera collision avoidance
const BUILDING_BOUNDS = [
  { minX: -12.5, maxX: -3.2, minZ: -12.0, maxZ: -2.7, h: 14 }, // Hero
  { minX: 3.2, maxX: 12.5, minZ: -12.0, maxZ: -2.7, h: 12 },  // About
  { minX: -12.5, maxX: -3.2, minZ: 2.7, maxZ: 12.0, h: 14 },  // Projects
  { minX: 3.2, maxX: 12.5, minZ: 2.7, maxZ: 12.0, h: 26 },   // Skills Tech Tower
  { minX: -4.5, maxX: 4.5, minZ: 17.0, maxZ: 26.0, h: 12 },   // Experience
  { minX: -4.5, maxX: 4.5, minZ: -26.0, maxZ: -17.0, h: 12 }, // Contact
];

function avoidBuildingCollision(pos: THREE.Vector3) {
  for (const b of BUILDING_BOUNDS) {
    if (
      pos.x >= b.minX - 0.5 &&
      pos.x <= b.maxX + 0.5 &&
      pos.z >= b.minZ - 0.5 &&
      pos.z <= b.maxZ + 0.5 &&
      pos.y <= b.h + 0.8
    ) {
      // Push camera outside or above the roof
      pos.y = Math.max(pos.y, b.h + 1.8);
    }
  }
  // Prevent clipping under the asphalt/sidewalk
  pos.y = Math.max(0.85, pos.y);
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export const SpaceToCityCameraController: React.FC<SpaceToCityCameraControllerProps> = ({
  controlsRef,
  viewMode,
  onViewModeChange,
  targetLocation,
  cityPerspective = 'aerial',
  selectedBuilding = null,
  playerPosRef,
  rotationRef,
  onTransitionProgress,
  heroPosition = [-7.85, 0.74, -7.35],
  aboutPosition = [7.85, 0.74, -7.35],
  projectsPosition = [-7.85, 0.74, 7.35],
  skillsPosition = [7.85, 0.74, 7.35],
  experiencePosition = [0, 0.74, 21.5],
  contactPosition = [0, 0.74, -21.5],
}) => {
  const { camera } = useThree();
  const transitionTimeRef = useRef(0);
  const transitionDuration = 3.6;

  const startCamPosRef = useRef(new THREE.Vector3());
  const startLookAtRef = useRef(new THREE.Vector3());
  const droneAngleRef = useRef(0);

  // Setup transitions when viewMode changes
  useEffect(() => {
    if (viewMode === 'descending' || viewMode === 'ascending') {
      transitionTimeRef.current = 0;
      startCamPosRef.current.copy(camera.position);
      if (controlsRef.current) {
        startLookAtRef.current.copy(controlsRef.current.target);
        controlsRef.current.enabled = false;
      } else {
        startLookAtRef.current.set(0, 0, 0);
      }
    } else {
      if (controlsRef.current) {
        controlsRef.current.enabled = cityPerspective !== 'first-person';
      }
    }
  }, [viewMode, camera, controlsRef, cityPerspective]);

  useFrame((_, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    const dt = Math.min(delta, 0.1);

    // ==========================================
    // 1. SPACE MODE (Free orbit around Earth)
    // ==========================================
    if (viewMode === 'space') {
      if (controlsRef.current) {
        controlsRef.current.minDistance = 32;
        controlsRef.current.maxDistance = 140;
        controlsRef.current.enableDamping = true;
        controlsRef.current.dampingFactor = 0.05;
        controlsRef.current.target.set(0, 0, 0);
      }
      if (onTransitionProgress) {
        onTransitionProgress(0, camera.position.length());
      }
      return;
    }

    // =======================================================
    // 2. DESCENDING TRANSITION (Space -> Atmosphere -> City)
    // =======================================================
    if (viewMode === 'descending') {
      transitionTimeRef.current += dt;
      const linearT = Math.min(1.0, transitionTimeRef.current / transitionDuration);
      const easedT = easeInOutCubic(linearT);

      _targetCamPos.lerpVectors(startCamPosRef.current, _cityAerialPos, easedT);
      _targetLookAt.lerpVectors(startLookAtRef.current, _cityAerialLookAt, easedT);

      camera.position.copy(_targetCamPos);
      camera.lookAt(_targetLookAt);

      if (controlsRef.current) {
        controlsRef.current.target.copy(_targetLookAt);
      }

      const currentAltitude = THREE.MathUtils.lerp(75, 20, easedT);
      if (onTransitionProgress) {
        onTransitionProgress(easedT, currentAltitude);
      }

      if (linearT >= 1.0) {
        onViewModeChange('city');
        if (controlsRef.current) {
          controlsRef.current.enabled = true;
        }
      }
      return;
    }

    // =====================================================
    // 3. ASCENDING TRANSITION (City -> Atmosphere -> Space)
    // =====================================================
    if (viewMode === 'ascending') {
      transitionTimeRef.current += dt;
      const linearT = Math.min(1.0, transitionTimeRef.current / transitionDuration);
      const easedT = easeInOutCubic(linearT);

      _targetCamPos.lerpVectors(startCamPosRef.current, _spaceCamPos, easedT);
      _targetLookAt.lerpVectors(startLookAtRef.current, _spaceLookAt, easedT);

      camera.position.copy(_targetCamPos);
      camera.lookAt(_targetLookAt);

      if (controlsRef.current) {
        controlsRef.current.target.copy(_targetLookAt);
      }

      const currentAltitude = THREE.MathUtils.lerp(20, 75, easedT);
      if (onTransitionProgress) {
        onTransitionProgress(1.0 - easedT, currentAltitude);
      }

      if (linearT >= 1.0) {
        onViewModeChange('space');
        if (controlsRef.current) {
          controlsRef.current.enabled = true;
        }
      }
      return;
    }

    // ==========================================
    // 4. CITY MODE (Exploration inside 3D City)
    // ==========================================
    if (viewMode === 'city') {
      if (controlsRef.current) {
        controlsRef.current.minDistance = 6;
        controlsRef.current.maxDistance = 65;
        controlsRef.current.maxPolarAngle = Math.PI / 2 - 0.04;
      }

      // A) Building Inspection Focus
      if (selectedBuilding !== null) {
        let bPos: [number, number, number] = [0, 0, 0];
        let offset: [number, number, number] = [0, 8, 12];

        if (selectedBuilding === 'hero') {
          bPos = heroPosition;
          offset = [4, 7, 10];
        } else if (selectedBuilding === 'about') {
          bPos = aboutPosition;
          offset = [-4, 7, 10];
        } else if (selectedBuilding === 'projects') {
          bPos = projectsPosition;
          offset = [4, 7, 10];
        } else if (selectedBuilding === 'skills') {
          bPos = skillsPosition;
          offset = [-4, 8, 10];
        } else if (selectedBuilding === 'experience') {
          bPos = experiencePosition;
          offset = [0, 8, 12];
        } else if (selectedBuilding === 'contact') {
          bPos = contactPosition;
          offset = [0, 8, -12];
        }

        _tempVec1.set(bPos[0] + offset[0], bPos[1] + offset[1], bPos[2] + offset[2]);
        _tempVec2.set(bPos[0], bPos[1] + 2.5, bPos[2]);

        avoidBuildingCollision(_tempVec1);

        camera.position.lerp(_tempVec1, 1 - Math.exp(-4.5 * dt));
        if (controlsRef.current) {
          controlsRef.current.target.lerp(_tempVec2, 1 - Math.exp(-4.5 * dt));
        }
        return;
      }

      // B) First-Person Exploration View
      if (cityPerspective === 'first-person' && playerPosRef?.current) {
        const px = playerPosRef.current.x;
        const py = playerPosRef.current.y;
        const pz = playerPosRef.current.z;
        const heading = rotationRef ? rotationRef.current : 0;

        _tempVec1.set(px, py + 1.72, pz); // Eye height (1.72m)
        const forwardX = -Math.sin(heading) * 10;
        const forwardZ = -Math.cos(heading) * 10;
        _tempVec2.set(px + forwardX, py + 1.72, pz + forwardZ);

        camera.position.lerp(_tempVec1, 1 - Math.exp(-12.0 * dt));
        camera.lookAt(_tempVec2);
        return;
      }

      // C) Street Level (Third-Person Follow Developer Avatar with Collision Avoidance)
      if (cityPerspective === 'street' && playerPosRef?.current) {
        const px = playerPosRef.current.x;
        const py = playerPosRef.current.y;
        const pz = playerPosRef.current.z;

        _tempVec1.set(px + 7.5, py + 7.0, pz + 8.5);
        _tempVec2.set(px, py + 1.4, pz);

        avoidBuildingCollision(_tempVec1);

        camera.position.lerp(_tempVec1, 1 - Math.exp(-5.0 * dt));
        if (controlsRef.current) {
          controlsRef.current.target.lerp(_tempVec2, 1 - Math.exp(-5.0 * dt));
        }
        return;
      }

      // D) Drone View (Cinematic orbital sweep around downtown skyline)
      if (cityPerspective === 'drone') {
        droneAngleRef.current += dt * 0.12;
        const radius = 28;
        const height = 16 + Math.sin(droneAngleRef.current * 0.5) * 4;
        const dx = Math.sin(droneAngleRef.current) * radius;
        const dz = Math.cos(droneAngleRef.current) * radius;

        _tempVec1.set(dx, height, dz);
        _tempVec2.set(0, 2, 0);

        avoidBuildingCollision(_tempVec1);

        camera.position.lerp(_tempVec1, 1 - Math.exp(-3.0 * dt));
        if (controlsRef.current) {
          controlsRef.current.target.lerp(_tempVec2, 1 - Math.exp(-3.0 * dt));
        }
        return;
      }

      // E) Aerial Orbit mode: User operates OrbitControls freely around city center
    }
  });

  return null;
};

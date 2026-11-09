'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { SelectedBuildingType } from './CityCameraController';

interface BuildingZone {
  id: SelectedBuildingType;
  name: string;
  label: string;
  color: string;
  accent: string;
  center: [number, number];
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  entrance: [number, number];
}

export const CITY_BUILDING_ZONES: BuildingZone[] = [
  {
    id: 'hero',
    name: 'Hero Headquarters',
    label: 'EXPLORE HERO HQ',
    color: '#00f0ff',
    accent: '#2563eb',
    center: [-7.85, -7.35],
    bounds: { minX: -12.2, maxX: -3.5, minZ: -11.2, maxZ: -3.5 },
    entrance: [-4.2, -7.35],
  },
  {
    id: 'about',
    name: 'About Me Studio',
    label: 'VIEW ABOUT ME',
    color: '#f97316',
    accent: '#ea580c',
    center: [7.85, -7.35],
    bounds: { minX: 3.5, maxX: 12.2, minZ: -11.2, maxZ: -3.5 },
    entrance: [4.2, -7.35],
  },
  {
    id: 'projects',
    name: 'Projects Innovation Center',
    label: 'VIEW PROJECTS',
    color: '#a855f7',
    accent: '#7c3aed',
    center: [-7.85, 7.35],
    bounds: { minX: -12.2, maxX: -3.5, minZ: 3.5, maxZ: 11.2 },
    entrance: [-4.2, 7.35],
  },
  {
    id: 'skills',
    name: 'Skills Tech Tower',
    label: 'INSPECT SKILLS',
    color: '#06b6d4',
    accent: '#0284c7',
    center: [7.85, 7.35],
    bounds: { minX: 3.5, maxX: 12.2, minZ: 3.5, maxZ: 11.2 },
    entrance: [4.2, 7.35],
  },
  {
    id: 'experience',
    name: 'Experience Corporate Office',
    label: 'VIEW EXPERIENCE',
    color: '#3b82f6',
    accent: '#1d4ed8',
    center: [0, 21.5],
    bounds: { minX: -4.5, maxX: 4.5, minZ: 17.5, maxZ: 25.5 },
    entrance: [0, 17.8],
  },
  {
    id: 'contact',
    name: 'Contact Hub',
    label: 'CONTACT ME',
    color: '#ec4899',
    accent: '#be185d',
    center: [0, -21.5],
    bounds: { minX: -4.5, maxX: 4.5, minZ: -25.5, maxZ: -17.5 },
    entrance: [0, -17.8],
  },
];

// Obstacle collision zones (including the central plaza fountain)
const OBSTACLES = [
  ...CITY_BUILDING_ZONES.map((b) => b.bounds),
  // Central Plaza Fountain obstacle
  { minX: 2.2, maxX: 5.5, minZ: -5.5, maxZ: -2.2 },
];

const CITY_BOUNDS = { minX: -27.2, maxX: 27.2, minZ: -27.2, maxZ: 27.2 };

interface CityAvatarControllerProps {
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  rotationRef: React.MutableRefObject<number>;
  isMovingRef: React.MutableRefObject<boolean>;
  keysPressedRef: React.MutableRefObject<Record<string, boolean>>;
  targetWalkPosRef: React.MutableRefObject<THREE.Vector3 | null>;
  onSelectBuilding: (buildingId: SelectedBuildingType) => void;
  isModalOpen: boolean;
}

export const CityAvatarController: React.FC<CityAvatarControllerProps> = ({
  playerPosRef,
  rotationRef,
  isMovingRef,
  keysPressedRef,
  targetWalkPosRef,
  onSelectBuilding,
  isModalOpen,
}) => {
  const [nearbyBuilding, setNearbyBuilding] = useState<BuildingZone | null>(null);
  const clickTargetMeshRef = useRef<THREE.Mesh>(null);

  // Check collision against all obstacles & city perimeter
  const checkCollision = (x: number, z: number): boolean => {
    // City boundary check
    if (
      x < CITY_BOUNDS.minX ||
      x > CITY_BOUNDS.maxX ||
      z < CITY_BOUNDS.minZ ||
      z > CITY_BOUNDS.maxZ
    ) {
      return true;
    }

    // Avatar collision radius: 0.32m
    const radius = 0.32;
    for (let i = 0; i < OBSTACLES.length; i++) {
      const obs = OBSTACLES[i];
      if (
        x + radius > obs.minX &&
        x - radius < obs.maxX &&
        z + radius > obs.minZ &&
        z - radius < obs.maxZ
      ) {
        return true;
      }
    }
    return false;
  };

  useFrame((_, delta) => {
    // If modal is active, halt character motion
    if (isModalOpen) {
      isMovingRef.current = false;
      return;
    }

    const keys = keysPressedRef.current;
    let inputX = 0;
    let inputZ = 0;

    // Cardinal city grid navigation:
    // W / ArrowUp = North (-Z)
    // S / ArrowDown = South (+Z)
    // A / ArrowLeft = West (-X)
    // D / ArrowRight = East (+X)
    if (keys['w'] || keys['W'] || keys['ArrowUp']) inputZ -= 1;
    if (keys['s'] || keys['S'] || keys['ArrowDown']) inputZ += 1;
    if (keys['a'] || keys['A'] || keys['ArrowLeft']) inputX -= 1;
    if (keys['d'] || keys['D'] || keys['ArrowRight']) inputX += 1;

    const isRunning = keys['Shift'] || keys['ShiftLeft'] || keys['ShiftRight'];
    const walkSpeed = isRunning ? 7.5 : 4.6;

    let dirX = 0;
    let dirZ = 0;
    let moving = false;

    if (inputX !== 0 || inputZ !== 0) {
      // Direct keyboard / virtual D-pad input takes priority over click-to-walk
      targetWalkPosRef.current = null;
      const len = Math.hypot(inputX, inputZ);
      dirX = inputX / len;
      dirZ = inputZ / len;
      moving = true;
    } else if (targetWalkPosRef.current) {
      // Click-to-walk navigation
      const tx = targetWalkPosRef.current.x - playerPosRef.current.x;
      const tz = targetWalkPosRef.current.z - playerPosRef.current.z;
      const dist = Math.hypot(tx, tz);

      if (dist > 0.2) {
        dirX = tx / dist;
        dirZ = tz / dist;
        moving = true;
      } else {
        // Reached target walk point
        targetWalkPosRef.current = null;
      }
    }

    isMovingRef.current = moving;

    if (moving) {
      // Calculate target yaw angle
      rotationRef.current = Math.atan2(dirX, dirZ);

      const moveStep = walkSpeed * delta;
      const nextX = playerPosRef.current.x + dirX * moveStep;
      const nextZ = playerPosRef.current.z + dirZ * moveStep;

      // Smooth collision resolution with axis-separated wall sliding
      const currentX = playerPosRef.current.x;
      const currentZ = playerPosRef.current.z;

      const collidesBoth = checkCollision(nextX, nextZ);
      if (!collidesBoth) {
        playerPosRef.current.x = nextX;
        playerPosRef.current.z = nextZ;
      } else {
        // Try sliding horizontally along X
        if (!checkCollision(nextX, currentZ)) {
          playerPosRef.current.x = nextX;
        }
        // Try sliding vertically along Z
        if (!checkCollision(currentX, nextZ)) {
          playerPosRef.current.z = nextZ;
        }
      }
    }

    // Determine surface elevation (Sidewalk: 0.74, Road: 0.62)
    const px = playerPosRef.current.x;
    const pz = playerPosRef.current.z;

    // Main boulevards bounds
    const onMainNSBoulevard = Math.abs(px) < 2.45 && Math.abs(pz) < 26.5;
    const onMainEWBoulevard = Math.abs(pz) < 2.45 && Math.abs(px) < 26.5;
    const isRoad = onMainNSBoulevard || onMainEWBoulevard;
    const targetY = isRoad ? 0.62 : 0.74;

    // Smoothly lerp height to avoid sharp vertical snapping
    playerPosRef.current.y += (targetY - playerPosRef.current.y) * Math.min(1, delta * 12);

    // Pulse click-to-walk ring animation
    if (clickTargetMeshRef.current && targetWalkPosRef.current) {
      const time = performance.now() * 0.001;
      const scale = 0.35 + Math.sin(time * 6) * 0.05;
      clickTargetMeshRef.current.scale.set(scale, scale, scale);
    }

    // Check proximity to building entrances/zones (every frame for responsive prompt)
    let foundNear: BuildingZone | null = null;
    let minEntranceDist = 4.8;

    for (let i = 0; i < CITY_BUILDING_ZONES.length; i++) {
      const zone = CITY_BUILDING_ZONES[i];
      const dx = px - zone.entrance[0];
      const dz = pz - zone.entrance[1];
      const dist = Math.hypot(dx, dz);

      if (dist < minEntranceDist) {
        minEntranceDist = dist;
        foundNear = zone;
      }
    }

    if (foundNear?.id !== nearbyBuilding?.id) {
      setNearbyBuilding(foundNear);
    }
  });

  return (
    <>
      {/* Click-to-Walk Destination Target Pulse Ring */}
      {targetWalkPosRef.current && (
        <mesh
          ref={clickTargetMeshRef}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[
            targetWalkPosRef.current.x,
            targetWalkPosRef.current.y + 0.02,
            targetWalkPosRef.current.z,
          ]}
        >
          <ringGeometry args={[0.25, 0.35, 32]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.75} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Floating 3D Interaction Indicator Pill over Avatar when Near Building */}
      {nearbyBuilding && !isModalOpen && (
        <group
          position={[
            playerPosRef.current.x,
            playerPosRef.current.y + 1.85,
            playerPosRef.current.z,
          ]}
        >
          <Billboard follow lockX={false} lockY={false} lockZ={false}>
            {/* Clickable Pill Badge */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectBuilding(nearbyBuilding.id);
              }}
              position={[0, 0, 0]}
            >
              <planeGeometry args={[1.75, 0.38]} />
              <meshBasicMaterial color="#090d16" transparent opacity={0.92} />
            </mesh>

            {/* Glowing Accent Border */}
            <lineSegments position={[0, 0, 0.01]}>
              <edgesGeometry args={[new THREE.PlaneGeometry(1.75, 0.38)]} />
              <lineBasicMaterial color={nearbyBuilding.color} linewidth={2} />
            </lineSegments>

            {/* Prompt Text */}
            <Text
              position={[0, 0.01, 0.02]}
              fontSize={0.115}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {`[E] ${nearbyBuilding.label}`}
            </Text>
          </Billboard>
        </group>
      )}
    </>
  );
};


'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { SelectedBuildingType } from './CityCameraController';
import {
  isPointColliding,
  calculateClickToWalkPath,
  NavPoint,
  CITY_BOUNDS,
  AVATAR_RADIUS,
  CITY_BUILDING_ZONES,
  BuildingZone,
} from './cityNavigation';

export { CITY_BUILDING_ZONES };
export type { BuildingZone };

interface CityAvatarControllerProps {
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  rotationRef: React.MutableRefObject<number>;
  isMovingRef: React.MutableRefObject<boolean>;
  keysPressedRef: React.MutableRefObject<Record<string, boolean>>;
  targetWalkPosRef: React.MutableRefObject<THREE.Vector3 | null>;
  onSelectBuilding: (buildingId: SelectedBuildingType) => void;
  isModalOpen: boolean;
  quaternionRef?: React.MutableRefObject<THREE.Quaternion>;
  currentSpeedRef?: React.MutableRefObject<number>;
}

// Module-level static scratch objects to prevent garbage collection churn
const _upAxis = new THREE.Vector3(0, 1, 0);
const _targetQuat = new THREE.Quaternion();

export const CityAvatarController: React.FC<CityAvatarControllerProps> = ({
  playerPosRef,
  rotationRef,
  isMovingRef,
  keysPressedRef,
  targetWalkPosRef,
  onSelectBuilding,
  isModalOpen,
  quaternionRef,
  currentSpeedRef,
}) => {
  const clickTargetMeshRef = useRef<THREE.Mesh>(null);
  const promptGroupRef = useRef<THREE.Group>(null);
  const promptTextRef = useRef<any>(null);
  const borderMatRef = useRef<THREE.LineBasicMaterial>(null);
  const activeNearZoneRef = useRef<BuildingZone | null>(null);

  // Velocity tracking ref for smooth acceleration and deceleration
  const velocityRef = useRef<{ x: number; z: number }>({ x: 0, z: 0 });

  // Internal quaternion ref if parent doesn't provide one
  const internalQuatRef = useRef<THREE.Quaternion>(new THREE.Quaternion());
  const activeQuatRef = quaternionRef || internalQuatRef;

  // Cached click-to-walk pathfinding refs
  const cachedWaypointsRef = useRef<NavPoint[]>([]);
  const waypointIndexRef = useRef<number>(0);
  const lastTargetPosRef = useRef<{ x: number; z: number } | null>(null);
  const stuckFramesRef = useRef<number>(0);
  const lastProgressPosRef = useRef<{ x: number; z: number }>({ x: 0, z: 0 });

  // Statically allocated and memoized geometries/materials (Zero GC heap churn)
  const pillGeo = useMemo(() => new THREE.PlaneGeometry(1.75, 0.38), []);
  const edgesGeo = useMemo(() => new THREE.EdgesGeometry(pillGeo), [pillGeo]);
  const pillMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#090d16', transparent: true, opacity: 0.92 }),
    []
  );

  useFrame((_, delta) => {
    // 1. Clamp delta time to 50ms to completely prevent lag spikes & teleporting through walls
    const dt = Math.min(delta, 0.05);

    // If modal is active, halt character motion immediately
    if (isModalOpen) {
      isMovingRef.current = false;
      velocityRef.current.x = 0;
      velocityRef.current.z = 0;
      if (currentSpeedRef) currentSpeedRef.current = 0;
      if (promptGroupRef.current) promptGroupRef.current.visible = false;
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
    if (keys['w'] || keys['W'] || keys['KeyW'] || keys['ArrowUp']) inputZ -= 1;
    if (keys['s'] || keys['S'] || keys['KeyS'] || keys['ArrowDown']) inputZ += 1;
    if (keys['a'] || keys['A'] || keys['KeyA'] || keys['ArrowLeft']) inputX -= 1;
    if (keys['d'] || keys['D'] || keys['KeyD'] || keys['ArrowRight']) inputX += 1;

    const isRunning = keys['Shift'] || keys['shift'] || keys['ShiftLeft'] || keys['ShiftRight'];
    const maxSpeed = isRunning ? 7.2 : 4.4;

    let targetDirX = 0;
    let targetDirZ = 0;
    let hasMovementIntent = false;
    let isClickToWalk = false;
    let distanceToFinalTarget = Infinity;

    // =========================================================================
    // 2. INPUT PROCESSING & CLICK-TO-WALK PATHFINDING
    // =========================================================================
    if (inputX !== 0 || inputZ !== 0) {
      // Direct keyboard input cancels active click-to-walk path
      targetWalkPosRef.current = null;
      lastTargetPosRef.current = null;
      cachedWaypointsRef.current = [];
      waypointIndexRef.current = 0;

      const len = Math.hypot(inputX, inputZ);
      targetDirX = inputX / len;
      targetDirZ = inputZ / len;
      hasMovementIntent = true;
    } else if (targetWalkPosRef.current) {
      const currentTarget = targetWalkPosRef.current;
      const px = playerPosRef.current.x;
      const pz = playerPosRef.current.z;

      // Check if destination changed or replanning is required (Requirement 8)
      const isNewDestination =
        !lastTargetPosRef.current ||
        Math.hypot(
          currentTarget.x - lastTargetPosRef.current.x,
          currentTarget.z - lastTargetPosRef.current.z
        ) > 0.25;

      if (isNewDestination) {
        lastTargetPosRef.current = { x: currentTarget.x, z: currentTarget.z };
        cachedWaypointsRef.current = calculateClickToWalkPath(px, pz, currentTarget.x, currentTarget.z);
        waypointIndexRef.current = 0;
        stuckFramesRef.current = 0;
        lastProgressPosRef.current = { x: px, z: pz };
      }

      const waypoints = cachedWaypointsRef.current;
      const currentIdx = waypointIndexRef.current;

      if (waypoints.length > 0 && currentIdx < waypoints.length) {
        isClickToWalk = true;
        const targetWaypoint = waypoints[currentIdx];
        const dx = targetWaypoint.x - px;
        const dz = targetWaypoint.z - pz;
        const distToWaypoint = Math.hypot(dx, dz);

        // Distance to the final destination in the path
        const finalWaypoint = waypoints[waypoints.length - 1];
        distanceToFinalTarget = Math.hypot(finalWaypoint.x - px, finalWaypoint.z - pz);

        const isLastWaypoint = currentIdx === waypoints.length - 1;
        const arrivalRadius = isLastWaypoint ? 0.22 : 0.55;

        if (distToWaypoint <= arrivalRadius) {
          // Reached intermediate or final waypoint
          waypointIndexRef.current += 1;
          if (waypointIndexRef.current >= waypoints.length) {
            // Arrived at final destination!
            targetWalkPosRef.current = null;
            lastTargetPosRef.current = null;
            cachedWaypointsRef.current = [];
          }
        } else {
          targetDirX = dx / distToWaypoint;
          targetDirZ = dz / distToWaypoint;
          hasMovementIntent = true;

          // Stuck detection & replanning
          const movedSinceLastCheck = Math.hypot(
            px - lastProgressPosRef.current.x,
            pz - lastProgressPosRef.current.z
          );
          if (movedSinceLastCheck < 0.003) {
            stuckFramesRef.current += 1;
            if (stuckFramesRef.current > 60) {
              // Stuck: trigger a replan once
              cachedWaypointsRef.current = calculateClickToWalkPath(
                px,
                pz,
                currentTarget.x,
                currentTarget.z
              );
              waypointIndexRef.current = 0;
              stuckFramesRef.current = 0;
            }
          } else {
            stuckFramesRef.current = 0;
            lastProgressPosRef.current = { x: px, z: pz };
          }
        }
      } else {
        targetWalkPosRef.current = null;
        lastTargetPosRef.current = null;
      }
    }

    // =========================================================================
    // 3. FRAME-RATE INDEPENDENT ACCELERATION & DECELERATION (Requirement 2 & 9)
    // =========================================================================
    let targetSpeed = 0;
    if (hasMovementIntent) {
      targetSpeed = maxSpeed;

      // Arrival deceleration behavior when approaching click-to-walk destination
      if (isClickToWalk && distanceToFinalTarget < 1.4) {
        const ramp = Math.max(0.18, distanceToFinalTarget / 1.4);
        targetSpeed = maxSpeed * ramp;
      }
    }

    const desiredVelX = targetDirX * targetSpeed;
    const desiredVelZ = targetDirZ * targetSpeed;

    // Use exponential decay rate for silky frame-rate independent response
    const accelRate = hasMovementIntent ? 14.0 : 18.0;
    const accelFactor = 1 - Math.exp(-accelRate * dt);

    velocityRef.current.x += (desiredVelX - velocityRef.current.x) * accelFactor;
    velocityRef.current.z += (desiredVelZ - velocityRef.current.z) * accelFactor;

    const currentSpeed = Math.hypot(velocityRef.current.x, velocityRef.current.z);
    if (!hasMovementIntent && currentSpeed < 0.04) {
      velocityRef.current.x = 0;
      velocityRef.current.z = 0;
    }

    const actualSpeed = Math.hypot(velocityRef.current.x, velocityRef.current.z);
    if (currentSpeedRef) {
      currentSpeedRef.current = actualSpeed;
    }

    const isMoving = actualSpeed > 0.08;
    isMovingRef.current = isMoving;

    // =========================================================================
    // 4. SMOOTH CHARACTER ROTATION USING QUATERNIONS (Requirement 4)
    // =========================================================================
    if (actualSpeed > 0.12) {
      const headingYaw = Math.atan2(velocityRef.current.x, velocityRef.current.z);
      rotationRef.current = headingYaw;

      // Target quaternion from current movement velocity heading
      _targetQuat.setFromAxisAngle(_upAxis, headingYaw);

      // Delta-time aware quaternion slerp (Requirement 4)
      const rotFactor = 1 - Math.exp(-18.0 * dt);
      activeQuatRef.current.slerp(_targetQuat, rotFactor);
    }

    // =========================================================================
    // 5. CACHED COLLISION SLIDING & POSITION UPDATES (Requirement 7 & 10)
    // =========================================================================
    if (isMoving) {
      const stepX = velocityRef.current.x * dt;
      const stepZ = velocityRef.current.z * dt;

      const currentX = playerPosRef.current.x;
      const currentZ = playerPosRef.current.z;

      const nextX = currentX + stepX;
      const nextZ = currentZ + stepZ;

      // Check collision against pre-cached static boundaries
      if (!isPointColliding(nextX, nextZ)) {
        playerPosRef.current.x = nextX;
        playerPosRef.current.z = nextZ;
      } else {
        // Axis-separated wall sliding:
        // Try sliding along X
        if (!isPointColliding(nextX, currentZ)) {
          playerPosRef.current.x = nextX;
          velocityRef.current.z *= 0.3;
        } else if (!isPointColliding(currentX, nextZ)) {
          // Try sliding along Z
          playerPosRef.current.z = nextZ;
          velocityRef.current.x *= 0.3;
        } else {
          velocityRef.current.x = 0;
          velocityRef.current.z = 0;
        }
      }

      // Hard clamp inside city boundaries to prevent falling off the world
      playerPosRef.current.x = Math.max(
        CITY_BOUNDS.minX + AVATAR_RADIUS,
        Math.min(CITY_BOUNDS.maxX - AVATAR_RADIUS, playerPosRef.current.x)
      );
      playerPosRef.current.z = Math.max(
        CITY_BOUNDS.minZ + AVATAR_RADIUS,
        Math.min(CITY_BOUNDS.maxZ - AVATAR_RADIUS, playerPosRef.current.z)
      );
    }

    // =========================================================================
    // 6. SURFACE ELEVATION DAMPING (Sidewalk: 0.74, Road: 0.62)
    // =========================================================================
    const px = playerPosRef.current.x;
    const pz = playerPosRef.current.z;

    const onMainNSBoulevard = Math.abs(px) < 2.45 && Math.abs(pz) < 26.5;
    const onMainEWBoulevard = Math.abs(pz) < 2.45 && Math.abs(px) < 26.5;
    const isRoad = onMainNSBoulevard || onMainEWBoulevard;
    const targetY = isRoad ? 0.62 : 0.74;

    // Delta-time-aware exponential vertical height damping
    const heightFactor = 1 - Math.exp(-14.0 * dt);
    playerPosRef.current.y += (targetY - playerPosRef.current.y) * heightFactor;
    const py = playerPosRef.current.y;

    // =========================================================================
    // 7. CLICK-TO-WALK PULSE RING (Zero-rerender DOM/Mesh update)
    // =========================================================================
    if (clickTargetMeshRef.current) {
      if (targetWalkPosRef.current) {
        clickTargetMeshRef.current.visible = true;
        clickTargetMeshRef.current.position.set(
          targetWalkPosRef.current.x,
          targetWalkPosRef.current.y + 0.02,
          targetWalkPosRef.current.z
        );
        const time = performance.now() * 0.001;
        const scale = 0.35 + Math.sin(time * 6) * 0.05;
        clickTargetMeshRef.current.scale.set(scale, scale, scale);
      } else {
        clickTargetMeshRef.current.visible = false;
      }
    }

    // =========================================================================
    // 8. BUILDING INTERACTION PROXIMITY CHECK (Zero-rerender DOM/Mesh update)
    // =========================================================================
    let foundNear: BuildingZone | null = null;
    let minEntranceDist = 5.2;

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

    if (promptGroupRef.current) {
      if (foundNear && !isModalOpen) {
        promptGroupRef.current.visible = true;
        promptGroupRef.current.position.set(px, py + 1.85, pz);

        if (activeNearZoneRef.current?.id !== foundNear.id) {
          activeNearZoneRef.current = foundNear;
          if (promptTextRef.current) {
            promptTextRef.current.text = `[E] ${foundNear.label}`;
          }
          if (borderMatRef.current) {
            borderMatRef.current.color.set(foundNear.color);
          }
        }
      } else {
        promptGroupRef.current.visible = false;
        activeNearZoneRef.current = null;
      }
    }
  });

  return (
    <>
      {/* Click-to-Walk Destination Target Pulse Ring (Zero-rerender visibility toggle) */}
      <mesh
        ref={clickTargetMeshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        visible={false}
      >
        <ringGeometry args={[0.25, 0.35, 32]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.75} side={THREE.DoubleSide} />
      </mesh>

      {/* Floating 3D Interaction Indicator Pill over Avatar */}
      <group ref={promptGroupRef} position={[0, 0, 0]} visible={false}>
        <Billboard follow lockX={false} lockY={false} lockZ={false}>
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              if (activeNearZoneRef.current) {
                onSelectBuilding(activeNearZoneRef.current.id);
              }
            }}
            geometry={pillGeo}
            material={pillMat}
          />

          <lineSegments geometry={edgesGeo}>
            <lineBasicMaterial ref={borderMatRef} color="#00f0ff" linewidth={2} />
          </lineSegments>

          <Text
            ref={promptTextRef}
            position={[0, 0.01, 0.02]}
            fontSize={0.115}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            [E] ENTER
          </Text>
        </Billboard>
      </group>
    </>
  );
};

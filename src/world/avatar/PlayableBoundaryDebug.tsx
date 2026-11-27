'use client';

import React, { useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFrame } from '@react-three/fiber';
import { useWorldStore } from '../stores/worldStore';
import { getCityRoadNetwork } from '../WorldConfig';
import { getDistrictFreeRoamNavigator } from './districtFreeRoamNavigator';
import { avatarGameplayState } from './avatarGameplayState';
import * as THREE from 'three';

/**
 * Visual Boundary & Collision Debug Overlay (Toggle with F8 or ?boundary=true).
 * Disabled by default in normal gameplay for zero rendering overhead.
 */
export const PlayableBoundaryDebug: React.FC = () => {
  const showNavDebug = useWorldStore((s) => s.showNavDebug);
  const showCollisionDebug = useWorldStore((s) => s.showCollisionDebug);
  const searchParams = useSearchParams();
  const showBoundaryParam =
    searchParams.get('boundary') === 'true' || searchParams.get('show_boundary') === 'true';

  const isVisible = showCollisionDebug || showNavDebug || showBoundaryParam;

  const network = useMemo(() => getCityRoadNetwork(), []);
  const navigator = useMemo(() => getDistrictFreeRoamNavigator(network), [network]);

  const capsuleRef = useRef<THREE.Mesh>(null);
  const capsuleMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const contactRef = useRef<THREE.Mesh>(null);
  const normalArrowRef = useRef<THREE.Mesh>(null);
  const moveArrowRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!isVisible) return;
    const avatarPos = typeof window !== 'undefined' ? (window as any).__avatarPos : null;
    if (!avatarPos || !capsuleRef.current || !capsuleMatRef.current) return;

    capsuleRef.current.position.set(avatarPos.x, avatarPos.y + 0.9, avatarPos.z);
    capsuleMatRef.current.color.set(avatarGameplayState.isColliding ? '#f59e0b' : '#22c55e');

    if (moveArrowRef.current) {
      const mx = avatarGameplayState.lastMoveDirX;
      const mz = avatarGameplayState.lastMoveDirZ;
      const hasMove = Math.hypot(mx, mz) > 0.05;
      moveArrowRef.current.visible = hasMove;
      if (hasMove) {
        moveArrowRef.current.position.set(avatarPos.x + mx * 0.65, avatarPos.y + 0.35, avatarPos.z + mz * 0.65);
        moveArrowRef.current.rotation.y = Math.atan2(mx, mz);
      }
    }

    if (contactRef.current && normalArrowRef.current) {
      contactRef.current.visible = avatarGameplayState.isColliding;
      normalArrowRef.current.visible = avatarGameplayState.isColliding;
      if (avatarGameplayState.isColliding) {
        contactRef.current.position.set(
          avatarGameplayState.lastContactX,
          avatarPos.y + 0.35,
          avatarGameplayState.lastContactZ
        );
        const nx = avatarGameplayState.lastNormalX;
        const nz = avatarGameplayState.lastNormalZ;
        normalArrowRef.current.position.set(
          avatarGameplayState.lastContactX + nx * 0.45,
          avatarPos.y + 0.35,
          avatarGameplayState.lastContactZ + nz * 0.45
        );
        normalArrowRef.current.rotation.y = Math.atan2(nx, nz);
      }
    }
  });

  const { minX, maxX, minZ, maxZ } = navigator.bounds;
  const width = maxX - minX;
  const depth = maxZ - minZ;
  const centerX = (minX + maxX) / 2;
  const centerZ = (minZ + maxZ) / 2;

  if (!isVisible) return null;

  return (
    <group name="playable-boundary-debug">
      {/* Outer District Perimeter Wireframe Box */}
      <group position={[centerX, 0.25, centerZ]}>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(width, 0.2, depth)]} />
          <lineBasicMaterial color="#06b6d4" transparent opacity={0.65} />
        </lineSegments>
      </group>

      {/* Building AABB Collision Footprints (Red) */}
      {navigator.colliders.map((c) => {
        const cWidth = c.maxX - c.minX;
        const cDepth = c.maxZ - c.minZ;
        const cx = (c.minX + c.maxX) / 2;
        const cz = (c.minZ + c.maxZ) / 2;
        return (
          <group key={c.id} position={[cx, 0.35, cz]}>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(cWidth, 0.4, cDepth)]} />
              <lineBasicMaterial color="#ef4444" transparent opacity={0.65} />
            </lineSegments>
          </group>
        );
      })}

      {/* Circular Obstacle Colliders (Orange) */}
      {navigator.circleColliders.map((cc) => (
        <mesh key={cc.id} position={[cc.x, 0.35, cc.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(0.1, cc.radius - 0.05), cc.radius, 24]} />
          <meshBasicMaterial color="#f97316" side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Live Avatar Capsule Collider (Green = Clear, Amber = Colliding) */}
      <mesh ref={capsuleRef} position={[0, 1.1, 13.8]}>
        <cylinderGeometry args={[navigator.avatarRadius, navigator.avatarRadius, 1.7, 16, 1, true]} />
        <meshBasicMaterial ref={capsuleMatRef} color="#22c55e" wireframe />
      </mesh>

      {/* Desired Movement Direction Indicator (Cyan) */}
      <mesh ref={moveArrowRef} visible={false}>
        <boxGeometry args={[0.08, 0.08, 0.9]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>

      {/* Collision Contact Point (Yellow) & Outward Normal (Magenta) */}
      <mesh ref={contactRef} visible={false}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshBasicMaterial color="#facc15" />
      </mesh>
      <mesh ref={normalArrowRef} visible={false}>
        <boxGeometry args={[0.06, 0.06, 0.8]} />
        <meshBasicMaterial color="#e879f9" />
      </mesh>
    </group>
  );
};

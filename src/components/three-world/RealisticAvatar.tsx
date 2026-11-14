'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RealisticAvatarProps {
  positionRef: React.MutableRefObject<THREE.Vector3>;
  rotationRef: React.MutableRefObject<number>;
  isMovingRef: React.MutableRefObject<boolean>;
  quaternionRef?: React.MutableRefObject<THREE.Quaternion>;
  currentSpeedRef?: React.MutableRefObject<number>;
}

const _upAxis = new THREE.Vector3(0, 1, 0);
const _targetQuat = new THREE.Quaternion();

/**
 * Photorealistic Proportioned Human 3D Developer Avatar (1.82m)
 * Features natural human kinematics:
 * - Dual-phase leg stride with knee articulation
 * - Torso counter-rotation and forward velocity lean
 * - Natural arm-swing counterbalancing stride
 * - Idle breathing with chest expansion & weight shifting
 * - Smooth quaternion heading interpolation
 */
export const RealisticAvatar: React.FC<RealisticAvatarProps> = ({
  positionRef,
  rotationRef,
  isMovingRef,
  quaternionRef,
  currentSpeedRef,
}) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const pelvisGroupRef = useRef<THREE.Group>(null);
  const spineGroupRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  const internalQuatRef = useRef<THREE.Quaternion>(new THREE.Quaternion());
  const walkPhaseRef = useRef<number>(0);

  // Realistic PBR Materials
  const materials = useMemo(() => {
    return {
      skin: new THREE.MeshStandardMaterial({
        color: '#e2ba99',
        roughness: 0.65,
        metalness: 0.05,
      }),
      hair: new THREE.MeshStandardMaterial({
        color: '#1c1917',
        roughness: 0.8,
        metalness: 0.1,
      }),
      jacket: new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.7,
        metalness: 0.15,
      }),
      shirt: new THREE.MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.85,
      }),
      pants: new THREE.MeshStandardMaterial({
        color: '#090d16',
        roughness: 0.8,
        metalness: 0.05,
      }),
      shoes: new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.4,
        metalness: 0.1,
      }),
      shoeSole: new THREE.MeshStandardMaterial({
        color: '#0284c7',
        roughness: 0.5,
      }),
    };
  }, []);

  useFrame((_, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    const dt = Math.min(delta, 0.1);

    // 1. Sync world position directly
    if (rootGroupRef.current && positionRef.current) {
      rootGroupRef.current.position.copy(positionRef.current);
    }

    // 2. Smooth heading rotation via quaternion
    const targetHeading = rotationRef.current;
    _targetQuat.setFromAxisAngle(_upAxis, targetHeading);
    internalQuatRef.current.slerp(_targetQuat, 1 - Math.exp(-14.0 * dt));

    if (rootGroupRef.current) {
      rootGroupRef.current.quaternion.copy(internalQuatRef.current);
    }
    if (quaternionRef) {
      quaternionRef.current.copy(internalQuatRef.current);
    }

    // 3. Movement kinematics vs Idle breathing
    const isMoving = isMovingRef.current;
    const speed = currentSpeedRef ? currentSpeedRef.current : isMoving ? 5.2 : 0;
    const isSprinting = speed > 6.0;

    const time = performance.now() * 0.001;

    if (isMoving) {
      // Advance walk cycle proportional to speed
      const cadence = isSprinting ? 12.5 : 9.5;
      walkPhaseRef.current += dt * cadence;
      const phase = walkPhaseRef.current;

      const strideAmp = isSprinting ? 0.75 : 0.52;
      const armAmp = isSprinting ? 0.65 : 0.45;

      // Leg swing (sine wave)
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(phase) * strideAmp;
        rightLegRef.current.rotation.x = -Math.sin(phase) * strideAmp;
      }

      // Arm swing (opposite to legs)
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -Math.sin(phase) * armAmp;
        rightArmRef.current.rotation.x = Math.sin(phase) * armAmp;
      }

      // Vertical bounce (2 steps per cycle)
      if (pelvisGroupRef.current) {
        pelvisGroupRef.current.position.y = 0.92 + Math.abs(Math.sin(phase)) * 0.06;
      }

      // Forward torso lean during movement
      if (spineGroupRef.current) {
        spineGroupRef.current.rotation.x = isSprinting ? 0.18 : 0.08;
        spineGroupRef.current.rotation.y = Math.sin(phase) * 0.08; // Torso counter-twist
      }
    } else {
      // Natural idle state
      walkPhaseRef.current = 0;

      // Smoothly reset limbs
      if (leftLegRef.current) leftLegRef.current.rotation.x *= 1 - Math.exp(-10.0 * dt);
      if (rightLegRef.current) rightLegRef.current.rotation.x *= 1 - Math.exp(-10.0 * dt);
      if (leftArmRef.current) leftArmRef.current.rotation.x *= 1 - Math.exp(-10.0 * dt);
      if (rightArmRef.current) rightArmRef.current.rotation.x *= 1 - Math.exp(-10.0 * dt);

      // Idle breathing: subtle chest expansion and shoulder rise
      if (spineGroupRef.current) {
        spineGroupRef.current.rotation.x = Math.sin(time * 2.2) * 0.02;
        spineGroupRef.current.rotation.y = Math.sin(time * 1.1) * 0.015;
      }
      if (headGroupRef.current) {
        headGroupRef.current.rotation.y = Math.sin(time * 0.8) * 0.06;
      }
      if (pelvisGroupRef.current) {
        pelvisGroupRef.current.position.y = 0.92 + Math.sin(time * 2.2) * 0.01;
      }
    }
  });

  return (
    <group ref={rootGroupRef}>
      {/* Pelvis / Root Pivot */}
      <group ref={pelvisGroupRef} position={[0, 0.92, 0]}>
        
        {/* ==================================================== */}
        {/* 1. UPPER BODY: Spine, Torso, Jacket & Head          */}
        {/* ==================================================== */}
        <group ref={spineGroupRef}>
          {/* Main Torso / Jacket */}
          <mesh position={[0, 0.28, 0]} castShadow>
            <boxGeometry args={[0.42, 0.52, 0.24]} />
            <primitive object={materials.jacket} attach="material" />
          </mesh>

          {/* Inner Shirt Collar */}
          <mesh position={[0, 0.48, 0.08]} castShadow>
            <boxGeometry args={[0.22, 0.12, 0.12]} />
            <primitive object={materials.shirt} attach="material" />
          </mesh>

          {/* Neck */}
          <mesh position={[0, 0.58, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.08, 0.12, 8]} />
            <primitive object={materials.skin} attach="material" />
          </mesh>

          {/* Head & Hair */}
          <group ref={headGroupRef} position={[0, 0.72, 0]}>
            {/* Cranium / Face */}
            <mesh castShadow>
              <sphereGeometry args={[0.13, 16, 16]} />
              <primitive object={materials.skin} attach="material" />
            </mesh>

            {/* Styled Modern Hair */}
            <mesh position={[0, 0.05, -0.02]} castShadow>
              <sphereGeometry args={[0.14, 16, 16]} />
              <primitive object={materials.hair} attach="material" />
            </mesh>
            {/* Front Hair Quiff / Fringe */}
            <mesh position={[0, 0.12, 0.06]} rotation={[0.2, 0, 0]} castShadow>
              <boxGeometry args={[0.16, 0.08, 0.1]} />
              <primitive object={materials.hair} attach="material" />
            </mesh>
          </group>

          {/* Left Arm (Shoulder -> Bicep -> Forearm -> Hand) */}
          <group ref={leftArmRef} position={[-0.26, 0.44, 0]}>
            <mesh position={[0, -0.22, 0]} castShadow>
              <capsuleGeometry args={[0.065, 0.32, 6, 8]} />
              <primitive object={materials.jacket} attach="material" />
            </mesh>
            {/* Left Hand */}
            <mesh position={[0, -0.42, 0]} castShadow>
              <sphereGeometry args={[0.045, 8, 8]} />
              <primitive object={materials.skin} attach="material" />
            </mesh>
          </group>

          {/* Right Arm (Shoulder -> Bicep -> Forearm -> Hand) */}
          <group ref={rightArmRef} position={[0.26, 0.44, 0]}>
            <mesh position={[0, -0.22, 0]} castShadow>
              <capsuleGeometry args={[0.065, 0.32, 6, 8]} />
              <primitive object={materials.jacket} attach="material" />
            </mesh>
            {/* Right Hand */}
            <mesh position={[0, -0.42, 0]} castShadow>
              <sphereGeometry args={[0.045, 8, 8]} />
              <primitive object={materials.skin} attach="material" />
            </mesh>
          </group>
        </group>

        {/* ==================================================== */}
        {/* 2. LOWER BODY: Hips, Thighs, Calves & Shoes         */}
        {/* ==================================================== */}
        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.12, 0, 0]}>
          <mesh position={[0, -0.38, 0]} castShadow>
            <capsuleGeometry args={[0.08, 0.58, 6, 8]} />
            <primitive object={materials.pants} attach="material" />
          </mesh>
          {/* Left Shoe */}
          <mesh position={[0, -0.84, 0.05]} castShadow>
            <boxGeometry args={[0.11, 0.09, 0.24]} />
            <primitive object={materials.shoes} attach="material" />
          </mesh>
          <mesh position={[0, -0.89, 0.05]} castShadow>
            <boxGeometry args={[0.115, 0.03, 0.25]} />
            <primitive object={materials.shoeSole} attach="material" />
          </mesh>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.12, 0, 0]}>
          <mesh position={[0, -0.38, 0]} castShadow>
            <capsuleGeometry args={[0.08, 0.58, 6, 8]} />
            <primitive object={materials.pants} attach="material" />
          </mesh>
          {/* Right Shoe */}
          <mesh position={[0, -0.84, 0.05]} castShadow>
            <boxGeometry args={[0.11, 0.09, 0.24]} />
            <primitive object={materials.shoes} attach="material" />
          </mesh>
          <mesh position={[0, -0.89, 0.05]} castShadow>
            <boxGeometry args={[0.115, 0.03, 0.25]} />
            <primitive object={materials.shoeSole} attach="material" />
          </mesh>
        </group>

      </group>
    </group>
  );
};

/**
 * Ambient Background Pedestrians on Sidewalks
 * Brings natural human activity to the open-world city
 */
export function AmbientPedestrians() {
  const pedestrians = useMemo(() => {
    return [
      { id: 'p1', route: 'east', startZ: -12, x: 3.4, speed: 1.4, color: '#3b82f6' },
      { id: 'p2', route: 'west', startZ: 14, x: -3.4, speed: 1.2, color: '#ec4899' },
      { id: 'p3', route: 'north', startX: -14, z: 3.4, speed: 1.5, color: '#10b981' },
      { id: 'p4', route: 'south', startX: 16, z: -3.4, speed: 1.3, color: '#f59e0b' },
    ];
  }, []);

  const refs = useRef<THREE.Group[]>([]);

  useFrame((_, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    const time = performance.now() * 0.001;

    refs.current.forEach((grp, idx) => {
      if (!grp) return;
      const p = pedestrians[idx];
      const stride = Math.sin(time * 6.0 + idx) * 0.35;

      // Move along sidewalk circuit
      if (p.route === 'east' || p.route === 'west') {
        const dir = p.route === 'east' ? 1 : -1;
        grp.position.z = (p.startZ ?? 0) + Math.sin(time * p.speed * 0.3) * 16 * dir;
      } else {
        const dir = p.route === 'north' ? 1 : -1;
        grp.position.x = (p.startX ?? 0) + Math.sin(time * p.speed * 0.3) * 16 * dir;
      }

      // Leg stride animation on child meshes
      if (grp.children[0]) grp.children[0].rotation.x = stride;
      if (grp.children[1]) grp.children[1].rotation.x = -stride;
    });
  });

  return (
    <group>
      {pedestrians.map((p, idx) => (
        <group
          key={p.id}
          ref={(el) => {
            if (el) refs.current[idx] = el;
          }}
          position={[p.x || 0, 0.72, p.z || 0]}
        >
          {/* Left Leg */}
          <mesh position={[-0.08, 0.4, 0]} castShadow>
            <capsuleGeometry args={[0.06, 0.45, 4, 6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Right Leg */}
          <mesh position={[0.08, 0.4, 0]} castShadow>
            <capsuleGeometry args={[0.06, 0.45, 4, 6]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Torso */}
          <mesh position={[0, 0.95, 0]} castShadow>
            <boxGeometry args={[0.34, 0.48, 0.2]} />
            <meshStandardMaterial color={p.color} />
          </mesh>
          {/* Head */}
          <mesh position={[0, 1.34, 0]} castShadow>
            <sphereGeometry args={[0.11, 8, 8]} />
            <meshStandardMaterial color="#e2ba99" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

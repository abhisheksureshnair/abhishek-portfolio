'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { urbanAudio } from './CityUrbanAudio';
import { RealisticPedestriansAI } from './RealisticPedestriansAI';

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
 * - Dual-phase leg stride with knee articulation and foot placement
 * - Torso counter-rotation and forward velocity lean
 * - Dual-joint arm-swing counterbalancing stride with elbow flexion
 * - Idle breathing with chest expansion, weight shifting & subtle head look
 * - Ground contact shadow decal firmly rooting avatar to pavement
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
  
  // Left leg joints
  const leftThighRef = useRef<THREE.Group>(null);
  const leftCalfRef = useRef<THREE.Group>(null);
  
  // Right leg joints
  const rightThighRef = useRef<THREE.Group>(null);
  const rightCalfRef = useRef<THREE.Group>(null);
  
  // Left arm joints
  const leftArmRef = useRef<THREE.Group>(null);
  const leftForearmRef = useRef<THREE.Group>(null);
  
  // Right arm joints
  const rightArmRef = useRef<THREE.Group>(null);
  const rightForearmRef = useRef<THREE.Group>(null);

  const internalQuatRef = useRef<THREE.Quaternion>(new THREE.Quaternion());
  const walkPhaseRef = useRef<number>(0);
  const lastStepPhaseRef = useRef<number>(0);

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
        roughness: 0.65,
        metalness: 0.18,
      }),
      jacketTrim: new THREE.MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.85,
      }),
      hoodie: new THREE.MeshStandardMaterial({
        color: '#334155',
        roughness: 0.8,
      }),
      pants: new THREE.MeshStandardMaterial({
        color: '#090d16',
        roughness: 0.82,
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
      shadow: new THREE.MeshBasicMaterial({
        color: '#020617',
        transparent: true,
        opacity: 0.45,
      }),
    };
  }, []);

  useFrame((_, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    const dt = Math.min(delta, 0.08);

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
      // Cadence adapts to speed
      const cadence = isSprinting ? 12.8 : 9.6;
      walkPhaseRef.current += dt * cadence;
      const phase = walkPhaseRef.current;

      // Footstep audio trigger
      const currentCycle = Math.floor(phase / Math.PI);
      if (currentCycle !== lastStepPhaseRef.current) {
        lastStepPhaseRef.current = currentCycle;
        urbanAudio.playFootstep(isSprinting);
      }

      const strideAmp = isSprinting ? 0.78 : 0.54;
      const armAmp = isSprinting ? 0.68 : 0.46;

      const leftLegAngle = Math.sin(phase) * strideAmp;
      const rightLegAngle = -Math.sin(phase) * strideAmp;

      // Leg stride with knee bend:
      // When swinging forward (angle > 0), knee flexes backward. When back, knee is locked straight.
      if (leftThighRef.current && leftCalfRef.current) {
        leftThighRef.current.rotation.x = leftLegAngle;
        leftCalfRef.current.rotation.x = leftLegAngle > 0 ? leftLegAngle * 0.85 : 0;
      }
      if (rightThighRef.current && rightCalfRef.current) {
        rightThighRef.current.rotation.x = rightLegAngle;
        rightCalfRef.current.rotation.x = rightLegAngle > 0 ? rightLegAngle * 0.85 : 0;
      }

      // Arm swing with elbow flexion (opposite to legs)
      if (leftArmRef.current && leftForearmRef.current) {
        leftArmRef.current.rotation.x = -leftLegAngle * (armAmp / strideAmp);
        leftForearmRef.current.rotation.x = Math.max(0, -leftLegAngle * 0.4);
      }
      if (rightArmRef.current && rightForearmRef.current) {
        rightArmRef.current.rotation.x = -rightLegAngle * (armAmp / strideAmp);
        rightForearmRef.current.rotation.x = Math.max(0, -rightLegAngle * 0.4);
      }

      // Vertical bounce (2 steps per stride cycle)
      if (pelvisGroupRef.current) {
        pelvisGroupRef.current.position.y = 0.92 + Math.abs(Math.sin(phase)) * (isSprinting ? 0.08 : 0.05);
      }

      // Forward torso lean during movement & subtle torso counter-twist
      if (spineGroupRef.current) {
        spineGroupRef.current.rotation.x = isSprinting ? 0.22 : 0.1;
        spineGroupRef.current.rotation.y = Math.sin(phase) * 0.08;
      }
    } else {
      // Natural idle state
      walkPhaseRef.current = 0;

      // Smoothly return limbs to resting stance
      const resetSpeed = 1 - Math.exp(-10.0 * dt);
      if (leftThighRef.current) leftThighRef.current.rotation.x *= 1 - resetSpeed;
      if (leftCalfRef.current) leftCalfRef.current.rotation.x *= 1 - resetSpeed;
      if (rightThighRef.current) rightThighRef.current.rotation.x *= 1 - resetSpeed;
      if (rightCalfRef.current) rightCalfRef.current.rotation.x *= 1 - resetSpeed;
      if (leftArmRef.current) leftArmRef.current.rotation.x *= 1 - resetSpeed;
      if (leftForearmRef.current) leftForearmRef.current.rotation.x *= 1 - resetSpeed;
      if (rightArmRef.current) rightArmRef.current.rotation.x *= 1 - resetSpeed;
      if (rightForearmRef.current) rightForearmRef.current.rotation.x *= 1 - resetSpeed;

      // Idle breathing: subtle chest expansion and shoulder rise
      if (spineGroupRef.current) {
        spineGroupRef.current.rotation.x = Math.sin(time * 2.2) * 0.02;
        spineGroupRef.current.rotation.y = Math.sin(time * 1.1) * 0.015;
      }
      if (headGroupRef.current) {
        headGroupRef.current.rotation.y = Math.sin(time * 0.8) * 0.08;
      }
      if (pelvisGroupRef.current) {
        pelvisGroupRef.current.position.y = 0.92 + Math.sin(time * 2.2) * 0.01;
      }
    }
  });

  return (
    <group ref={rootGroupRef}>
      {/* Contact Shadow Decal under feet */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.62, 0.62]} />
        <primitive object={materials.shadow} attach="material" />
      </mesh>

      {/* Pelvis / Root Pivot */}
      <group ref={pelvisGroupRef} position={[0, 0.92, 0]}>
        {/* ==================================================== */}
        {/* 1. UPPER BODY: Spine, Torso, Jacket & Head          */}
        {/* ==================================================== */}
        <group ref={spineGroupRef}>
          {/* Main Torso / Layered Bomber Jacket */}
          <mesh position={[0, 0.28, 0]} castShadow>
            <boxGeometry args={[0.44, 0.52, 0.26]} />
            <primitive object={materials.jacket} attach="material" />
          </mesh>

          {/* Front Jacket Zipper & Trim */}
          <mesh position={[0, 0.28, 0.132]}>
            <boxGeometry args={[0.04, 0.5, 0.01]} />
            <primitive object={materials.jacketTrim} attach="material" />
          </mesh>

          {/* Inner Layered Hoodie Collar */}
          <mesh position={[0, 0.48, 0.06]} castShadow>
            <boxGeometry args={[0.24, 0.14, 0.16]} />
            <primitive object={materials.hoodie} attach="material" />
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
            {/* Front Hair Quiff */}
            <mesh position={[0, 0.12, 0.06]} rotation={[0.2, 0, 0]} castShadow>
              <boxGeometry args={[0.16, 0.08, 0.1]} />
              <primitive object={materials.hair} attach="material" />
            </mesh>
          </group>

          {/* Left Arm: Shoulder -> Upper Arm -> Forearm -> Hand */}
          <group ref={leftArmRef} position={[-0.27, 0.44, 0]}>
            <mesh position={[0, -0.15, 0]} castShadow>
              <capsuleGeometry args={[0.065, 0.22, 4, 6]} />
              <primitive object={materials.jacket} attach="material" />
            </mesh>
            {/* Forearm & Elbow Joint */}
            <group ref={leftForearmRef} position={[0, -0.28, 0]}>
              <mesh position={[0, -0.12, 0]} castShadow>
                <capsuleGeometry args={[0.055, 0.18, 4, 6]} />
                <primitive object={materials.jacket} attach="material" />
              </mesh>
              {/* Left Hand */}
              <mesh position={[0, -0.24, 0]} castShadow>
                <sphereGeometry args={[0.045, 8, 8]} />
                <primitive object={materials.skin} attach="material" />
              </mesh>
            </group>
          </group>

          {/* Right Arm: Shoulder -> Upper Arm -> Forearm -> Hand */}
          <group ref={rightArmRef} position={[0.27, 0.44, 0]}>
            <mesh position={[0, -0.15, 0]} castShadow>
              <capsuleGeometry args={[0.065, 0.22, 4, 6]} />
              <primitive object={materials.jacket} attach="material" />
            </mesh>
            {/* Forearm & Elbow Joint */}
            <group ref={rightForearmRef} position={[0, -0.28, 0]}>
              <mesh position={[0, -0.12, 0]} castShadow>
                <capsuleGeometry args={[0.055, 0.18, 4, 6]} />
                <primitive object={materials.jacket} attach="material" />
              </mesh>
              {/* Right Hand */}
              <mesh position={[0, -0.24, 0]} castShadow>
                <sphereGeometry args={[0.045, 8, 8]} />
                <primitive object={materials.skin} attach="material" />
              </mesh>
            </group>
          </group>
        </group>

        {/* ==================================================== */}
        {/* 2. LOWER BODY: Thighs, Articulated Knees & Shoes    */}
        {/* ==================================================== */}
        {/* Left Leg: Thigh -> Knee -> Calf -> Shoe */}
        <group ref={leftThighRef} position={[-0.12, 0, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <capsuleGeometry args={[0.08, 0.32, 4, 6]} />
            <primitive object={materials.pants} attach="material" />
          </mesh>
          {/* Calf / Lower Leg */}
          <group ref={leftCalfRef} position={[0, -0.42, 0]}>
            <mesh position={[0, -0.2, 0]} castShadow>
              <capsuleGeometry args={[0.075, 0.3, 4, 6]} />
              <primitive object={materials.pants} attach="material" />
            </mesh>
            {/* Left Sneaker & Sole */}
            <mesh position={[0, -0.42, 0.05]} castShadow>
              <boxGeometry args={[0.11, 0.09, 0.24]} />
              <primitive object={materials.shoes} attach="material" />
            </mesh>
            <mesh position={[0, -0.47, 0.05]} castShadow>
              <boxGeometry args={[0.115, 0.03, 0.25]} />
              <primitive object={materials.shoeSole} attach="material" />
            </mesh>
          </group>
        </group>

        {/* Right Leg: Thigh -> Knee -> Calf -> Shoe */}
        <group ref={rightThighRef} position={[0.12, 0, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <capsuleGeometry args={[0.08, 0.32, 4, 6]} />
            <primitive object={materials.pants} attach="material" />
          </mesh>
          {/* Calf / Lower Leg */}
          <group ref={rightCalfRef} position={[0, -0.42, 0]}>
            <mesh position={[0, -0.2, 0]} castShadow>
              <capsuleGeometry args={[0.075, 0.3, 4, 6]} />
              <primitive object={materials.pants} attach="material" />
            </mesh>
            {/* Right Sneaker & Sole */}
            <mesh position={[0, -0.42, 0.05]} castShadow>
              <boxGeometry args={[0.11, 0.09, 0.24]} />
              <primitive object={materials.shoes} attach="material" />
            </mesh>
            <mesh position={[0, -0.47, 0.05]} castShadow>
              <boxGeometry args={[0.115, 0.03, 0.25]} />
              <primitive object={materials.shoeSole} attach="material" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};

/**
 * Ambient Pedestrians Export (Delegates directly to RealisticPedestriansAI)
 */
export const AmbientPedestrians: React.FC<{ playerPosRef?: React.MutableRefObject<THREE.Vector3> }> = ({
  playerPosRef,
}) => {
  return <RealisticPedestriansAI playerPosRef={playerPosRef} />;
};

'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DeveloperAvatar3DProps {
  positionRef: React.MutableRefObject<THREE.Vector3>;
  rotationRef: React.MutableRefObject<number>;
  isMovingRef: React.MutableRefObject<boolean>;
}

/**
 * Stylized 3D Miniature Developer Avatar (Matching User Reference Image)
 * 
 * Features:
 * - Cute stylized chibi proportions (~1.45m height)
 * - Modern dark casual outfit: charcoal hoodie with front zipper, pouch pocket, and backpack
 * - Dark tapered cargo trousers
 * - High-top brown & white sneakers with white soles and toe caps
 * - Detailed head with stylized dark swept-back tapered hair, big expressive blue eyes, and eyebrows
 * - Idle breathing & head sway
 * - Frame-rate independent walking stride kinematics (alternating arms and legs, vertical bounce, forward lean)
 * - Smooth yaw rotation toward movement heading
 * - High performance: zero React re-renders during motion
 */
export const DeveloperAvatar3D: React.FC<DeveloperAvatar3DProps> = ({
  positionRef,
  rotationRef,
  isMovingRef,
}) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const bodyGroupRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  // Smooth rotation tracking
  const currentRotationRef = useRef<number>(0);

  // Memoized shared materials for optimal rendering performance
  const materials = useMemo(() => {
    return {
      skin: new THREE.MeshStandardMaterial({
        color: '#f6caa8',
        roughness: 0.6,
        metalness: 0.05,
      }),
      hair: new THREE.MeshStandardMaterial({
        color: '#261b15',
        roughness: 0.75,
        metalness: 0.1,
      }),
      hairFade: new THREE.MeshStandardMaterial({
        color: '#3d2b22',
        roughness: 0.85,
        metalness: 0.05,
      }),
      hoodie: new THREE.MeshStandardMaterial({
        color: '#2e333a',
        roughness: 0.8,
        metalness: 0.05,
      }),
      hoodieDark: new THREE.MeshStandardMaterial({
        color: '#22252a',
        roughness: 0.85,
        metalness: 0.05,
      }),
      zipper: new THREE.MeshStandardMaterial({
        color: '#94a3b8',
        roughness: 0.35,
        metalness: 0.7,
      }),
      backpack: new THREE.MeshStandardMaterial({
        color: '#3d444d',
        roughness: 0.75,
        metalness: 0.1,
      }),
      pants: new THREE.MeshStandardMaterial({
        color: '#25292f',
        roughness: 0.85,
        metalness: 0.05,
      }),
      sneakerBrown: new THREE.MeshStandardMaterial({
        color: '#6c4328',
        roughness: 0.7,
        metalness: 0.1,
      }),
      sneakerWhite: new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.45,
        metalness: 0.1,
      }),
      eyeWhite: new THREE.MeshBasicMaterial({
        color: '#ffffff',
      }),
      eyeIris: new THREE.MeshBasicMaterial({
        color: '#0284c7',
      }),
      eyePupil: new THREE.MeshBasicMaterial({
        color: '#090d16',
      }),
      eyebrow: new THREE.MeshBasicMaterial({
        color: '#211610',
      }),
      shadow: new THREE.MeshBasicMaterial({
        color: '#000000',
        transparent: true,
        opacity: 0.4,
      }),
    };
  }, []);

  useFrame((_, delta) => {
    if (!rootGroupRef.current) return;

    // 1. Sync avatar root position directly without React re-render
    rootGroupRef.current.position.copy(positionRef.current);

    // 2. Smoothly interpolate yaw rotation toward target heading
    const targetRot = rotationRef.current;
    let diff = targetRot - currentRotationRef.current;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    currentRotationRef.current += diff * Math.min(1, delta * 14);
    rootGroupRef.current.rotation.y = currentRotationRef.current;

    const time = performance.now() * 0.001;
    const isMoving = isMovingRef.current;

    // 3. Locomotion & Skeletal Kinematics
    if (isMoving) {
      // Natural walking stride frequency
      const stride = Math.sin(time * 11);
      const verticalBounce = Math.abs(Math.sin(time * 11)) * 0.045;

      // Leg stride oscillation
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = stride * 0.75;
        rightLegRef.current.rotation.x = -stride * 0.75;
      }

      // Arm swing (opposing legs)
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -stride * 0.65;
        rightArmRef.current.rotation.x = stride * 0.65;
      }

      // Dynamic forward athletic lean and bounce
      if (bodyGroupRef.current) {
        bodyGroupRef.current.position.y = 0.52 + verticalBounce;
        bodyGroupRef.current.rotation.x = 0.1;
        bodyGroupRef.current.rotation.y = Math.sin(time * 11) * 0.04; // subtle pelvis sway
      }

      if (headGroupRef.current) {
        headGroupRef.current.rotation.x = -0.05;
        headGroupRef.current.rotation.y = Math.sin(time * 5.5) * 0.03;
      }
    } else {
      // Idle breathing and head sway
      const idleBreathing = Math.sin(time * 2.4) * 0.015;
      const headSway = Math.sin(time * 1.6) * 0.04;
      const armSway = Math.sin(time * 1.8) * 0.03;

      if (bodyGroupRef.current) {
        bodyGroupRef.current.position.y = 0.52 + idleBreathing;
        bodyGroupRef.current.rotation.x = 0;
        bodyGroupRef.current.rotation.y = 0;
      }

      if (headGroupRef.current) {
        headGroupRef.current.rotation.x = idleBreathing * 0.5;
        headGroupRef.current.rotation.y = headSway;
      }

      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = 0;
        rightLegRef.current.rotation.x = 0;
      }

      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = armSway;
        rightArmRef.current.rotation.x = -armSway;
      }
    }
  });

  return (
    <group ref={rootGroupRef}>
      {/* Ground Contact Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[0.38, 24]} />
        <primitive object={materials.shadow} attach="material" />
      </mesh>

      {/* ======================================================== */}
      {/* LEGS & SNEAKERS (Hips pivot at y = 0.48)                 */}
      {/* ======================================================== */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.11, 0.46, 0]}>
        {/* Thigh & Shin Joggers */}
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.072, 0.065, 0.42, 12]} />
          <primitive object={materials.pants} attach="material" />
        </mesh>
        {/* Knee fold detail */}
        <mesh position={[0, -0.19, 0.02]}>
          <boxGeometry args={[0.13, 0.05, 0.08]} />
          <primitive object={materials.hoodieDark} attach="material" />
        </mesh>

        {/* Left High-Top Sneaker */}
        <group position={[0, -0.42, 0.04]}>
          {/* Sneaker Brown Body */}
          <mesh position={[0, 0.06, 0.01]} castShadow>
            <boxGeometry args={[0.13, 0.1, 0.22]} />
            <primitive object={materials.sneakerBrown} attach="material" />
          </mesh>
          {/* White Rubber Midsole / Tread */}
          <mesh position={[0, 0.018, 0.02]} castShadow>
            <boxGeometry args={[0.14, 0.038, 0.24]} />
            <primitive object={materials.sneakerWhite} attach="material" />
          </mesh>
          {/* White Rubber Toe Cap */}
          <mesh position={[0, 0.042, 0.1]} castShadow>
            <boxGeometry args={[0.125, 0.05, 0.08]} />
            <primitive object={materials.sneakerWhite} attach="material" />
          </mesh>
          {/* White Laces */}
          <mesh position={[0, 0.09, 0.03]}>
            <boxGeometry args={[0.07, 0.02, 0.1]} />
            <primitive object={materials.sneakerWhite} attach="material" />
          </mesh>
        </group>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.11, 0.46, 0]}>
        {/* Thigh & Shin Joggers */}
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.072, 0.065, 0.42, 12]} />
          <primitive object={materials.pants} attach="material" />
        </mesh>
        {/* Knee fold detail */}
        <mesh position={[0, -0.19, 0.02]}>
          <boxGeometry args={[0.13, 0.05, 0.08]} />
          <primitive object={materials.hoodieDark} attach="material" />
        </mesh>

        {/* Right High-Top Sneaker */}
        <group position={[0, -0.42, 0.04]}>
          {/* Sneaker Brown Body */}
          <mesh position={[0, 0.06, 0.01]} castShadow>
            <boxGeometry args={[0.13, 0.1, 0.22]} />
            <primitive object={materials.sneakerBrown} attach="material" />
          </mesh>
          {/* White Rubber Midsole / Tread */}
          <mesh position={[0, 0.018, 0.02]} castShadow>
            <boxGeometry args={[0.14, 0.038, 0.24]} />
            <primitive object={materials.sneakerWhite} attach="material" />
          </mesh>
          {/* White Rubber Toe Cap */}
          <mesh position={[0, 0.042, 0.1]} castShadow>
            <boxGeometry args={[0.125, 0.05, 0.08]} />
            <primitive object={materials.sneakerWhite} attach="material" />
          </mesh>
          {/* White Laces */}
          <mesh position={[0, 0.09, 0.03]}>
            <boxGeometry args={[0.07, 0.02, 0.1]} />
            <primitive object={materials.sneakerWhite} attach="material" />
          </mesh>
        </group>
      </group>

      {/* ======================================================== */}
      {/* UPPER BODY & TORSO GROUP                                 */}
      {/* ======================================================== */}
      <group ref={bodyGroupRef} position={[0, 0.52, 0]}>
        {/* Hoodie Lower Hem / Waist */}
        <mesh position={[0, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.175, 0.18, 0.08, 16]} />
          <primitive object={materials.hoodieDark} attach="material" />
        </mesh>

        {/* Hoodie Main Torso */}
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.195, 0.175, 0.26, 16]} />
          <primitive object={materials.hoodie} attach="material" />
        </mesh>

        {/* Center Zipper Line */}
        <mesh position={[0, 0.18, 0.172]}>
          <boxGeometry args={[0.018, 0.26, 0.01]} />
          <primitive object={materials.zipper} attach="material" />
        </mesh>

        {/* Hoodie Kangaroo / Side Pockets */}
        <mesh position={[0, 0.11, 0.155]}>
          <boxGeometry args={[0.22, 0.09, 0.04]} />
          <primitive object={materials.hoodieDark} attach="material" />
        </mesh>

        {/* Collar / Cowl Hood Rim around Neck */}
        <mesh position={[0, 0.32, -0.01]} castShadow>
          <torusGeometry args={[0.14, 0.055, 10, 20]} />
          <primitive object={materials.hoodie} attach="material" />
        </mesh>

        {/* Backpack on Back */}
        <group position={[0, 0.2, -0.17]}>
          <mesh castShadow>
            <boxGeometry args={[0.26, 0.28, 0.12]} />
            <primitive object={materials.backpack} attach="material" />
          </mesh>
          {/* Top Grab Handle */}
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[0.09, 0.03, 0.03]} />
            <primitive object={materials.hoodieDark} attach="material" />
          </mesh>
          {/* Shoulder Straps */}
          <mesh position={[-0.1, 0.06, 0.09]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.035, 0.24, 0.04]} />
            <primitive object={materials.hoodieDark} attach="material" />
          </mesh>
          <mesh position={[0.1, 0.06, 0.09]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.035, 0.24, 0.04]} />
            <primitive object={materials.hoodieDark} attach="material" />
          </mesh>
        </group>

        {/* Left Arm (Shoulder pivot at x = -0.23, y = 0.28) */}
        <group ref={leftArmRef} position={[-0.23, 0.28, 0]}>
          {/* Hoodie Sleeve */}
          <mesh position={[0, -0.14, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.055, 0.28, 12]} />
            <primitive object={materials.hoodie} attach="material" />
          </mesh>
          {/* Sleeve Cuff */}
          <mesh position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.058, 0.055, 0.04, 12]} />
            <primitive object={materials.hoodieDark} attach="material" />
          </mesh>
          {/* Left Hand */}
          <mesh position={[0, -0.34, 0]} castShadow>
            <sphereGeometry args={[0.05, 12, 12]} />
            <primitive object={materials.skin} attach="material" />
          </mesh>
        </group>

        {/* Right Arm (Shoulder pivot at x = 0.23, y = 0.28) */}
        <group ref={rightArmRef} position={[0.23, 0.28, 0]}>
          {/* Hoodie Sleeve */}
          <mesh position={[0, -0.14, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.055, 0.28, 12]} />
            <primitive object={materials.hoodie} attach="material" />
          </mesh>
          {/* Sleeve Cuff */}
          <mesh position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.058, 0.055, 0.04, 12]} />
            <primitive object={materials.hoodieDark} attach="material" />
          </mesh>
          {/* Right Hand */}
          <mesh position={[0, -0.34, 0]} castShadow>
            <sphereGeometry args={[0.05, 12, 12]} />
            <primitive object={materials.skin} attach="material" />
          </mesh>
        </group>

        {/* ======================================================== */}
        {/* HEAD & STYLIZED HAIR (Neck pivot at y = 0.35)            */}
        {/* ======================================================== */}
        <group ref={headGroupRef} position={[0, 0.35, 0]}>
          {/* Neck */}
          <mesh position={[0, 0.03, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.075, 0.08, 12]} />
            <primitive object={materials.skin} attach="material" />
          </mesh>

          {/* Stylized Chibi Head */}
          <mesh position={[0, 0.23, 0.02]} castShadow>
            <sphereGeometry args={[0.22, 24, 24]} />
            <primitive object={materials.skin} attach="material" />
          </mesh>

          {/* Small Stylized Nose */}
          <mesh position={[0, 0.2, 0.23]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <primitive object={materials.skin} attach="material" />
          </mesh>

          {/* Left Eye */}
          <group position={[-0.085, 0.24, 0.19]} rotation={[-0.05, -0.25, 0]}>
            {/* White Sclera */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.048, 14, 14]} />
              <primitive object={materials.eyeWhite} attach="material" />
            </mesh>
            {/* Vibrant Blue Iris */}
            <mesh position={[0.005, 0, 0.032]}>
              <sphereGeometry args={[0.028, 12, 12]} />
              <primitive object={materials.eyeIris} attach="material" />
            </mesh>
            {/* Dark Pupil */}
            <mesh position={[0.005, 0, 0.045]}>
              <sphereGeometry args={[0.015, 10, 10]} />
              <primitive object={materials.eyePupil} attach="material" />
            </mesh>
            {/* Cute White Eye Specular Highlight */}
            <mesh position={[0.014, 0.012, 0.052]}>
              <sphereGeometry args={[0.006, 6, 6]} />
              <primitive object={materials.eyeWhite} attach="material" />
            </mesh>
          </group>

          {/* Right Eye */}
          <group position={[0.085, 0.24, 0.19]} rotation={[-0.05, 0.25, 0]}>
            {/* White Sclera */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.048, 14, 14]} />
              <primitive object={materials.eyeWhite} attach="material" />
            </mesh>
            {/* Vibrant Blue Iris */}
            <mesh position={[-0.005, 0, 0.032]}>
              <sphereGeometry args={[0.028, 12, 12]} />
              <primitive object={materials.eyeIris} attach="material" />
            </mesh>
            {/* Dark Pupil */}
            <mesh position={[-0.005, 0, 0.045]}>
              <sphereGeometry args={[0.015, 10, 10]} />
              <primitive object={materials.eyePupil} attach="material" />
            </mesh>
            {/* Cute White Eye Specular Highlight */}
            <mesh position={[-0.004, 0.012, 0.052]}>
              <sphereGeometry args={[0.006, 6, 6]} />
              <primitive object={materials.eyeWhite} attach="material" />
            </mesh>
          </group>

          {/* Left Eyebrow */}
          <mesh position={[-0.085, 0.3, 0.21]} rotation={[0.05, -0.2, 0.15]}>
            <boxGeometry args={[0.065, 0.014, 0.02]} />
            <primitive object={materials.eyebrow} attach="material" />
          </mesh>

          {/* Right Eyebrow */}
          <mesh position={[0.085, 0.3, 0.21]} rotation={[0.05, 0.2, -0.15]}>
            <boxGeometry args={[0.065, 0.014, 0.02]} />
            <primitive object={materials.eyebrow} attach="material" />
          </mesh>

          {/* ======================================================== */}
          {/* STYLIZED HAIR (Modern swept-back pompadour + side taper) */}
          {/* ======================================================== */}
          {/* Side Fade / Taper Left */}
          <mesh position={[-0.18, 0.26, 0.01]} rotation={[0, 0, 0.15]}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <primitive object={materials.hairFade} attach="material" />
          </mesh>
          {/* Side Fade / Taper Right */}
          <mesh position={[0.18, 0.26, 0.01]} rotation={[0, 0, -0.15]}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <primitive object={materials.hairFade} attach="material" />
          </mesh>
          {/* Back of Head Hair */}
          <mesh position={[0, 0.24, -0.09]} castShadow>
            <sphereGeometry args={[0.17, 14, 14]} />
            <primitive object={materials.hair} attach="material" />
          </mesh>
          {/* Main Top Hair Volume */}
          <mesh position={[0, 0.39, 0.02]} castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <primitive object={materials.hair} attach="material" />
          </mesh>
          {/* Swept-Back Front Tufts */}
          <mesh position={[0, 0.42, 0.09]} rotation={[-0.35, 0, 0]} castShadow>
            <boxGeometry args={[0.22, 0.1, 0.18]} />
            <primitive object={materials.hair} attach="material" />
          </mesh>
          {/* Front Quiff Tip */}
          <mesh position={[0, 0.45, 0.13]} rotation={[-0.5, 0, 0]}>
            <coneGeometry args={[0.09, 0.14, 8]} />
            <primitive object={materials.hair} attach="material" />
          </mesh>
        </group>
      </group>
    </group>
  );
};

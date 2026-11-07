'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DeveloperAvatar3DProps {
  positionRef: React.MutableRefObject<THREE.Vector3>;
  rotationRef: React.MutableRefObject<number>;
  isMovingRef: React.MutableRefObject<boolean>;
}

export const DeveloperAvatar3D: React.FC<DeveloperAvatar3DProps> = ({
  positionRef,
  rotationRef,
  isMovingRef,
}) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const bodyGroupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const visorRef = useRef<THREE.Mesh>(null);
  const thrusterGlowRef = useRef<THREE.PointLight>(null);

  // Smooth rotation angle tracking
  const currentRotationRef = useRef<number>(0);

  useFrame((state, delta) => {
    if (!rootGroupRef.current) return;

    // Direct translation from positionRef (NO React state re-render!)
    rootGroupRef.current.position.copy(positionRef.current);

    // Smoothly interpolate rotation toward target heading
    const targetRot = rotationRef.current;
    let diff = targetRot - currentRotationRef.current;

    // Normalize angle to shortest path (-PI to PI)
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;

    currentRotationRef.current += diff * Math.min(1, delta * 12);
    rootGroupRef.current.rotation.y = currentRotationRef.current;

    const time = state.clock.getElapsedTime();
    const isMoving = isMovingRef.current;

    if (isMoving) {
      // Walking locomotion cycle (stride frequency 10 rad/s)
      const walkCycle = Math.sin(time * 11);

      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = walkCycle * 0.65;
        rightLegRef.current.rotation.x = -walkCycle * 0.65;
      }

      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -walkCycle * 0.55;
        rightArmRef.current.rotation.x = walkCycle * 0.55;
      }

      // Dynamic forward athletic lean while running
      if (bodyGroupRef.current) {
        bodyGroupRef.current.rotation.x = 0.12;
        bodyGroupRef.current.position.y = 0.95 + Math.abs(Math.sin(time * 22)) * 0.08;
      }
    } else {
      // Idle breathing and hovering micro-dynamics
      const idleBob = Math.sin(time * 2.2) * 0.04;
      const armSway = Math.sin(time * 1.5) * 0.06;

      if (bodyGroupRef.current) {
        bodyGroupRef.current.rotation.x = 0;
        bodyGroupRef.current.position.y = 0.95 + idleBob;
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

    // Visor neon pulse
    if (visorRef.current) {
      const mat = visorRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 1.2 + Math.sin(time * 3) * 0.4;
      }
    }

    // Thruster light intensity modulation
    if (thrusterGlowRef.current) {
      thrusterGlowRef.current.intensity = isMoving
        ? 3.5 + Math.random() * 0.5
        : 1.8 + Math.sin(time * 4) * 0.4;
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, 0, 0]}>
      {/* Dynamic Ground Holographic Ring / Player Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.4, 0.65, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[0.38, 32]} />
        <meshBasicMaterial
          color="#030712"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main Avatar Body Rig */}
      <group ref={bodyGroupRef} position={[0, 0.95, 0]}>
        {/* Head / Cybernetic Helmet */}
        <group position={[0, 0.52, 0]}>
          {/* Main Helmet Shell */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.22, 18, 18]} />
            <meshStandardMaterial
              color="#0f172a"
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>

          {/* Glowing Cybernetic Visor Strip (Abhishek ASN Visor) */}
          <mesh ref={visorRef} position={[0, 0.03, 0.16]}>
            <boxGeometry args={[0.24, 0.07, 0.1]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={1.4}
              roughness={0.1}
            />
          </mesh>

          {/* Helmet Tech Ear Pieces */}
          <mesh position={[0.22, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.05, 12]} />
            <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[-0.22, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.05, 12]} />
            <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.5} />
          </mesh>
        </group>

        {/* Torso / Developer Tactical Jacket */}
        <group position={[0, 0.12, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.22, 0.18, 0.48, 16]} />
            <meshStandardMaterial
              color="#1e1b4b"
              roughness={0.3}
              metalness={0.6}
            />
          </mesh>

          {/* Chest Cyber Core Emblem */}
          <mesh position={[0, 0.08, 0.19]}>
            <boxGeometry args={[0.1, 0.08, 0.02]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={1.5}
            />
          </mesh>

          {/* Anti-Gravity Jetpack / Energy Reactor on Back */}
          <group position={[0, 0.06, -0.2]}>
            <mesh castShadow>
              <boxGeometry args={[0.26, 0.32, 0.12]} />
              <meshStandardMaterial color="#090d16" metalness={0.9} roughness={0.15} />
            </mesh>
            {/* Dual Thruster Nozzles */}
            <mesh position={[-0.08, -0.16, 0]} rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.05, 0.1, 12]} />
              <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={1} />
            </mesh>
            <mesh position={[0.08, -0.16, 0]} rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.05, 0.1, 12]} />
              <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={1} />
            </mesh>
            {/* Thruster Dynamic Light */}
            <pointLight
              ref={thrusterGlowRef}
              position={[0, -0.2, 0]}
              color="#38bdf8"
              distance={4}
              intensity={2.2}
            />
          </group>
        </group>

        {/* Left Arm Rig */}
        <group ref={leftArmRef} position={[-0.28, 0.26, 0]}>
          <mesh position={[0, -0.2, 0]} castShadow>
            <capsuleGeometry args={[0.055, 0.3, 8, 12]} />
            <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.5} />
          </mesh>
          {/* Forearm HUD Band */}
          <mesh position={[0, -0.22, 0.04]}>
            <boxGeometry args={[0.07, 0.08, 0.04]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1} />
          </mesh>
        </group>

        {/* Right Arm Rig */}
        <group ref={rightArmRef} position={[0.28, 0.26, 0]}>
          <mesh position={[0, -0.2, 0]} castShadow>
            <capsuleGeometry args={[0.055, 0.3, 8, 12]} />
            <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.5} />
          </mesh>
        </group>

        {/* Left Leg Rig */}
        <group ref={leftLegRef} position={[-0.11, -0.16, 0]}>
          <mesh position={[0, -0.35, 0]} castShadow>
            <capsuleGeometry args={[0.065, 0.42, 8, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.4} />
          </mesh>
          {/* Boot Magnetizer */}
          <mesh position={[0, -0.58, 0.04]}>
            <boxGeometry args={[0.09, 0.08, 0.16]} />
            <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.6} />
          </mesh>
        </group>

        {/* Right Leg Rig */}
        <group ref={rightLegRef} position={[0.11, -0.16, 0]}>
          <mesh position={[0, -0.35, 0]} castShadow>
            <capsuleGeometry args={[0.065, 0.42, 8, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.4} />
          </mesh>
          {/* Boot Magnetizer */}
          <mesh position={[0, -0.58, 0.04]}>
            <boxGeometry args={[0.09, 0.08, 0.16]} />
            <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  );
};


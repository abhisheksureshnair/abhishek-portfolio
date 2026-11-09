'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

interface DistrictInteriorProps {
  interiorId: 'code-nexus' | 'echo-desktop-ai' | 'flowsync';
  onExit: () => void;
}

/**
 * High-Detail Futuristic Sci-Fi Building Interior (Matching Reference Image 3)
 * Features:
 * - Panoramic curved observation window overlooking Nexus City
 * - Central quantum energy pedestal with levitating holographic core
 * - Articulated robotic arms focused on the central core (Image 3)
 * - Multi-monitor interactive console workstations with telemetry
 * - Hexagonal illuminated cyber floor plates and neon ceiling ribs
 * - Clear Exit Doorway with [E] Exit trigger
 */
export const DistrictInterior: React.FC<DistrictInteriorProps> = ({
  interiorId,
  onExit,
}) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const robotArmsRef = useRef<THREE.Group>(null);

  // Configure theme colors according to the district
  const config =
    interiorId === 'code-nexus'
      ? {
          title: 'GITHUB // CODE NEXUS VAULT',
          subtitle: 'Verified Repositories & Real-Time Staged Build Terminal',
          themeColor: '#8b5cf6',
          accentColor: '#c084fc',
          coreType: 'octocat',
          tag1: '30+ Live Repos',
          tag2: 'Automated Deployments',
          tag3: 'Architecture Graph',
        }
      : interiorId === 'echo-desktop-ai'
      ? {
          title: 'ECHO AI // NEURAL RESEARCH LAB',
          subtitle: 'Electron.js + Multi-Browser Extension LLM Workspace',
          themeColor: '#00f0ff',
          accentColor: '#38bdf8',
          coreType: 'neural',
          tag1: 'Streaming LLM Tokens',
          tag2: 'IPC Extension Bridge',
          tag3: 'Context Window Optimizer',
        }
      : {
          title: 'FLOWSYNC // COLLABORATIVE OPERATIONS HQ',
          subtitle: 'Real-Time Task Boards & NVIDIA NIM Predictive Telemetry',
          themeColor: '#6366f1',
          accentColor: '#818cf8',
          coreType: 'sync',
          tag1: 'Socket.IO Channels',
          tag2: 'NVIDIA NIM Inference',
          tag3: 'State Machine Engine',
        };

  useFrame((state, delta) => {
    const time = performance.now() * 0.001;

    // Central levitating quantum core dynamics
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 1.2;
      coreRef.current.position.y = 1.9 + Math.sin(time * 2.5) * 0.12;
    }

    if (ring1Ref.current) ring1Ref.current.rotation.x += delta * 1.5;
    if (ring2Ref.current) ring2Ref.current.rotation.z += delta * 1.1;

    // Subtle robotic arm calibration kinematics (Image 3)
    if (robotArmsRef.current) {
      const children = robotArmsRef.current.children;
      for (let i = 0; i < children.length; i++) {
        children[i].rotation.z = Math.sin(time * 1.5 + i * 1.2) * 0.08;
      }
    }
  });

  return (
    <group position={[0, 100, 0]}>
      {/* ======================================================== */}
      {/* 1. ROOM ARCHITECTURE & BULKHEAD RIBS (Image 3 Style)     */}
      {/* ======================================================== */}
      {/* Hexagonal Main Floor (Radius 16m) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry args={[16, 16, 0.2, 6]} />
        <meshStandardMaterial color="#060912" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Hexagonal Floor Neon Circuit Lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.12, 0]}>
        <ringGeometry args={[5.2, 5.5, 6]} />
        <meshStandardMaterial
          color={config.themeColor}
          emissive={config.themeColor}
          emissiveIntensity={2.5}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.12, 0]}>
        <ringGeometry args={[11.5, 11.8, 6]} />
        <meshStandardMaterial
          color={config.accentColor}
          emissive={config.accentColor}
          emissiveIntensity={2.0}
        />
      </mesh>

      {/* Semicircular Curved Rear Bulkhead Wall */}
      <mesh position={[0, 6, 0]}>
        <cylinderGeometry args={[15.8, 15.8, 12, 32, 1, true, 0, Math.PI * 1.4]} />
        <meshStandardMaterial
          color="#090e1c"
          roughness={0.4}
          metalness={0.7}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Ceiling Dome with Neon Ribs (Image 3) */}
      <mesh position={[0, 11.8, 0]}>
        <cylinderGeometry args={[15.5, 15.5, 0.4, 6]} />
        <meshStandardMaterial color="#060914" roughness={0.5} />
      </mesh>

      {/* Semicircular Panoramic Observation Window (Image 3) */}
      <group position={[0, 6, 15.2]} rotation={[0, Math.PI, 0]}>
        <mesh>
          <planeGeometry args={[18, 9]} />
          <meshStandardMaterial
            color="#38bdf8"
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.35}
          />
        </mesh>
        {/* City Skyline Silhouette Backdrop through the window */}
        <mesh position={[0, 0, -2]}>
          <planeGeometry args={[26, 12]} />
          <meshBasicMaterial color="#04060c" />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 2. CENTRAL QUANTUM PEDESTAL & CORE (Matching Image 3)    */}
      {/* ======================================================== */}
      <group position={[0, 0, 0]}>
        {/* 3-Tier Stepped Octagonal Pedestal Base */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[3.2, 3.6, 0.7, 8]} />
          <meshStandardMaterial color="#0a0f1d" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[2.5, 2.9, 0.5, 8]} />
          <meshStandardMaterial color="#10172a" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Transparent Cylindrical Energy Containment Chamber */}
        <mesh position={[0, 2.4, 0]}>
          <cylinderGeometry args={[1.8, 1.8, 2.6, 24, 1, true]} />
          <meshStandardMaterial
            color="#00f0ff"
            transparent
            opacity={0.25}
            roughness={0.05}
            metalness={0.95}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Levitating Central Quantum Core (Image 3) */}
        <mesh ref={coreRef} position={[0, 1.9, 0]}>
          <dodecahedronGeometry args={[0.95, 1]} />
          <meshStandardMaterial
            color={config.themeColor}
            emissive={config.themeColor}
            emissiveIntensity={2.8}
            roughness={0.1}
          />
        </mesh>

        {/* Gyroscope Rings Around Core */}
        <group ref={ring1Ref} position={[0, 1.9, 0]}>
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[1.4, 0.05, 16, 32]} />
            <meshStandardMaterial color="#ffffff" emissive={config.accentColor} emissiveIntensity={2.5} />
          </mesh>
        </group>
        <group ref={ring2Ref} position={[0, 1.9, 0]}>
          <mesh rotation={[0, Math.PI / 3, 0]}>
            <torusGeometry args={[1.6, 0.05, 16, 32]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.5} />
          </mesh>
        </group>

        {/* Core Radiance Light */}
        <pointLight color={config.themeColor} intensity={6.0} distance={18} position={[0, 2.5, 0]} />
      </group>

      {/* ======================================================== */}
      {/* 3. ARTICULATED ROBOTIC CALIBRATION ARMS (Matching Image 3)*/}
      {/* ======================================================== */}
      <group ref={robotArmsRef}>
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, idx) => {
          const bx = Math.cos(angle) * 4.6;
          const bz = Math.sin(angle) * 4.6;
          return (
            <group key={idx} position={[bx, 0, bz]} rotation={[0, -angle + Math.PI, 0]}>
              {/* Base Turret */}
              <mesh position={[0, 0.45, 0]}>
                <cylinderGeometry args={[0.45, 0.55, 0.9, 12]} />
                <meshStandardMaterial color="#0e1726" metalness={0.9} roughness={0.2} />
              </mesh>
              {/* Lower Segment */}
              <mesh position={[0, 1.35, 0.2]} rotation={[0.45, 0, 0]}>
                <boxGeometry args={[0.22, 1.4, 0.22]} />
                <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.3} />
              </mesh>
              {/* Upper Segment Extending Toward Core */}
              <mesh position={[0, 2.1, 0.8]} rotation={[-0.7, 0, 0]}>
                <boxGeometry args={[0.18, 1.3, 0.18]} />
                <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.3} />
              </mesh>
              {/* Laser Emitter Tip */}
              <mesh position={[0, 2.5, 1.3]} rotation={[-Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.12, 0.35, 12]} />
                <meshStandardMaterial color={config.themeColor} emissive={config.themeColor} emissiveIntensity={3} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ======================================================== */}
      {/* 4. WORKSTATION CONSOLES & TELEMETRY DISPLAYS (Image 3)   */}
      {/* ======================================================== */}
      {[-5.5, 5.5].map((cx, idx) => (
        <group key={idx} position={[cx, 0, -5]} rotation={[0, cx < 0 ? 0.35 : -0.35, 0]}>
          {/* Curved Desk Console */}
          <mesh position={[0, 0.55, 0]}>
            <boxGeometry args={[3.4, 1.1, 1.4]} />
            <meshStandardMaterial color="#0b1220" metalness={0.85} roughness={0.25} />
          </mesh>

          {/* Angled Holographic Monitor Displays */}
          <mesh position={[-0.8, 1.45, 0.2]} rotation={[-0.2, 0.2, 0]}>
            <planeGeometry args={[1.3, 0.8]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.0} />
          </mesh>
          <mesh position={[0.8, 1.45, 0.2]} rotation={[-0.2, -0.2, 0]}>
            <planeGeometry args={[1.3, 0.8]} />
            <meshStandardMaterial color={config.themeColor} emissive={config.themeColor} emissiveIntensity={2.0} />
          </mesh>
        </group>
      ))}

      {/* 3D Holographic Title Banner inside interior */}
      <Float speed={2} rotationIntensity={0.04} floatIntensity={0.15}>
        <Text
          position={[0, 7.8, -4]}
          fontSize={0.85}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {config.title}
        </Text>
        <Text
          position={[0, 7.0, -4]}
          fontSize={0.38}
          color={config.accentColor}
          anchorX="center"
          anchorY="middle"
        >
          {config.subtitle}
        </Text>
      </Float>

      {/* ======================================================== */}
      {/* 5. ILLUMINATED EXIT DOORWAY & TRIGGER                    */}
      {/* ======================================================== */}
      <group position={[0, 0, -14.8]} onClick={onExit}>
        {/* Door Frame Arch */}
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[4.2, 5.0, 0.4]} />
          <meshStandardMaterial color="#0b101d" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Luminous Exit Energy Shield */}
        <mesh position={[0, 2.5, 0.1]}>
          <planeGeometry args={[3.2, 4.4]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={2.0}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Floating Exit Prompt */}
        <Text
          position={[0, 5.4, 0.3]}
          fontSize={0.46}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          [ CLICK OR PRESS 'E' TO EXIT TO NEXUS CITY ]
        </Text>

        <pointLight color="#ef4444" intensity={3.5} distance={10} position={[0, 2.5, 1]} />
      </group>

      {/* Interior Ambient & Mood Lighting */}
      <ambientLight intensity={0.45} color="#0f172a" />
      <directionalLight position={[0, 10, 0]} intensity={1.2} color="#ffffff" />
    </group>
  );
};

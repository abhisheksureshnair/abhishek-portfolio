'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Moving traffic / data pulse packets on roadways
function RoadDataPulses() {
  const pulseCount = 36;
  const pulseGroupRef = useRef<THREE.Group>(null);

  const pulses = useMemo(() => {
    return Array.from({ length: pulseCount }).map(() => ({
      axis: Math.random() > 0.5 ? 'x' : 'z',
      fixedCoord: (Math.floor(Math.random() * 7) - 3) * 12, // Road lanes at -36, -24, -12, 0, 12, 24, 36
      speed: (Math.random() * 15 + 10) * (Math.random() > 0.5 ? 1 : -1),
      currentPos: Math.random() * 120 - 60,
      color: Math.random() > 0.4 ? '#00f0ff' : '#818cf8',
      size: Math.random() * 0.4 + 0.3,
    }));
  }, []);

  useFrame((_, delta) => {
    if (!pulseGroupRef.current) return;
    const children = pulseGroupRef.current.children;

    for (let i = 0; i < pulses.length; i++) {
      const p = pulses[i];
      p.currentPos += p.speed * delta;
      if (p.currentPos > 65) p.currentPos = -65;
      if (p.currentPos < -65) p.currentPos = 65;

      const mesh = children[i] as THREE.Mesh;
      if (mesh) {
        if (p.axis === 'x') {
          mesh.position.set(p.currentPos, 0.08, p.fixedCoord);
        } else {
          mesh.position.set(p.fixedCoord, 0.08, p.currentPos);
        }
      }
    }
  });

  return (
    <group ref={pulseGroupRef}>
      {pulses.map((p, i) => (
        <mesh key={i} position={[0, 0.08, 0]}>
          <boxGeometry args={[p.axis === 'x' ? 1.6 : 0.25, 0.05, p.axis === 'z' ? 1.6 : 0.25]} />
          <meshBasicMaterial color={p.color} />
        </mesh>
      ))}
    </group>
  );
}

// Background futuristic skyline buildings
function BackgroundSkyline() {
  const towers = useMemo(() => {
    const arr: { x: number; z: number; w: number; h: number; d: number; color: string; spire: boolean }[] = [];
    const colors = ['#090d16', '#0f172a', '#1e1b4b', '#030712'];
    const accentColors = ['#6366f1', '#00f0ff', '#a855f7', '#f59e0b'];

    // Perimeter ring 1: radius ~60 to 80
    for (let angle = 0; angle < Math.PI * 2; angle += 0.22) {
      const radius = 62 + Math.sin(angle * 4) * 12;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const h = 25 + Math.random() * 35;
      const w = 6 + Math.random() * 5;
      const d = 6 + Math.random() * 5;
      const col = colors[Math.floor(Math.random() * colors.length)];
      arr.push({ x, z, w, h, d, color: col, spire: Math.random() > 0.4 });
    }

    // Outer perimeter ring 2: radius ~90 to 110
    for (let angle = 0; angle < Math.PI * 2; angle += 0.3) {
      const radius = 95 + Math.sin(angle * 3) * 15;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const h = 40 + Math.random() * 55;
      const w = 9 + Math.random() * 8;
      const d = 9 + Math.random() * 8;
      const col = colors[Math.floor(Math.random() * colors.length)];
      arr.push({ x, z, w, h, d, color: col, spire: Math.random() > 0.3 });
    }

    return arr;
  }, []);

  return (
    <group>
      {towers.map((t, idx) => (
        <group key={idx} position={[t.x, t.h / 2, t.z]}>
          {/* Main Tower Mass */}
          <mesh>
            <boxGeometry args={[t.w, t.h, t.d]} />
            <meshStandardMaterial
              color={t.color}
              metalness={0.8}
              roughness={0.25}
            />
          </mesh>

          {/* Glowing Window Strips (Emissive bands) */}
          <mesh position={[0, t.h * 0.2, t.d / 2 + 0.05]}>
            <planeGeometry args={[t.w * 0.75, 1.2]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={0.8}
            />
          </mesh>
          <mesh position={[0, -t.h * 0.1, t.d / 2 + 0.05]}>
            <planeGeometry args={[t.w * 0.75, 1.2]} />
            <meshStandardMaterial
              color="#6366f1"
              emissive="#6366f1"
              emissiveIntensity={0.6}
            />
          </mesh>

          {/* Roof Spire with blinking aviation beacon */}
          {t.spire && (
            <mesh position={[0, t.h / 2 + 3, 0]}>
              <cylinderGeometry args={[0.1, 0.4, 6, 8]} />
              <meshStandardMaterial
                color="#f43f5e"
                emissive="#f43f5e"
                emissiveIntensity={1.5}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

export const CityEnvironment: React.FC = () => {
  return (
    <group>
      {/* Sci-Fi Atmospheric Fog */}
      <fog attach="fog" args={['#030509', 25, 130]} />

      {/* Main Ground Floor Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[260, 260]} />
        <meshStandardMaterial
          color="#060911"
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>

      {/* Cybernetic High-Tech Grid Over Ground */}
      <gridHelper
        args={[240, 60, '#6366f1', '#1e293b']}
        position={[0, 0.01, 0]}
      />

      {/* Main Cyber Boulevard Avenues (Crossroads X & Z) */}
      {/* North-South Main Highway (Z axis) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[7, 160]} />
        <meshStandardMaterial
          color="#0b1120"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      {/* Highway Glowing Cyan Edge Strips */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.5, 0.04, 0]}>
        <planeGeometry args={[0.18, 160]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.5, 0.04, 0]}>
        <planeGeometry args={[0.18, 160]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* East-West Main Highway (X axis) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[160, 7]} />
        <meshStandardMaterial
          color="#0b1120"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      {/* Highway Glowing Violet Edge Strips */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, -3.5]}>
        <planeGeometry args={[160, 0.18]} />
        <meshBasicMaterial color="#818cf8" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 3.5]}>
        <planeGeometry args={[160, 0.18]} />
        <meshBasicMaterial color="#818cf8" />
      </mesh>

      {/* Diagonal Transit Avenues to Corner Districts */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[0, 0.025, 0]}>
        <planeGeometry args={[4, 140]} />
        <meshStandardMaterial color="#090d18" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, -Math.PI / 4]} position={[0, 0.025, 0]}>
        <planeGeometry args={[4, 140]} />
        <meshStandardMaterial color="#090d18" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Traffic Data Pulses */}
      <RoadDataPulses />

      {/* Background Skyline */}
      <BackgroundSkyline />

      {/* Deep Space Atmospheric Particle Stars / Embers */}
      <points position={[0, 40, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                Array.from({ length: 600 * 3 }).map(() => (Math.random() - 0.5) * 200)
              ),
              3,
            ]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.8}
          color="#38bdf8"
          transparent
          opacity={0.65}
          sizeAttenuation
        />
      </points>

      {/* Volumetric Lights */}
      <ambientLight intensity={0.45} color="#1e1b4b" />
      <directionalLight
        position={[40, 60, 30]}
        intensity={1.2}
        color="#38bdf8"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={150}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
      />
      <directionalLight
        position={[-40, 45, -30]}
        intensity={0.75}
        color="#818cf8"
      />
    </group>
  );
};

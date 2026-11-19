'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { usePerformanceQuality } from '../PerformanceControl';
import {
  getWetAsphaltTexture,
  getWetAsphaltRoughness,
  getSidewalkTexture,
  getHologramPosterTexture,
  getBuildingFacadeTexture,
  getMetalGrateTexture,
  getHoloMonumentCoreTexture,
} from './CityTextures';

// Preload GLB assets for instant rendering
if (typeof window !== 'undefined') {
  useGLTF.preload('/models/nexus-city/monument_central.glb');
  useGLTF.preload('/models/nexus-city/prop_bench_planter.glb');
  useGLTF.preload('/models/nexus-city/prop_holo_kiosk.glb');
  useGLTF.preload('/models/nexus-city/prop_overhead_gantry.glb');
  useGLTF.preload('/models/nexus-city/prop_streetlight.glb');
}

// ========================================================
// 1. CENTRAL PLAZA MONUMENT (Spiral & Holographic Dais - Ref B & C)
// ========================================================
function CentralPlazaMonument() {
  const { scene } = useGLTF('/models/nexus-city/monument_central.glb');
  const clone = useMemo(() => scene.clone(true), [scene]);
  const groupRef = useRef<THREE.Group>(null);
  const holoCoreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const holoTex = useMemo(() => (typeof window !== 'undefined' ? getHoloMonumentCoreTexture() : null), []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Find and animate quantum rings and holographic core
      if (holoCoreRef.current) {
        holoCoreRef.current.rotation.y += delta * 0.8;
        holoCoreRef.current.rotation.x += delta * 0.4;
      }
      if (ringRef.current) {
        ringRef.current.rotation.z += delta * 1.2;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Real 3D Monument GLB */}
      <primitive object={clone} />

      {/* Floating Holographic Energy Core Plane (Ref C) */}
      <mesh ref={holoCoreRef} position={[0, 7.2, 0]}>
        <planeGeometry args={[2.8, 2.8]} />
        <meshStandardMaterial
          map={holoTex || undefined}
          transparent
          opacity={0.85}
          emissive="#00f0ff"
          emissiveIntensity={2.5}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Second Perpendicular Holographic Plane for 3D Volume */}
      <mesh position={[0, 7.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.8, 2.8]} />
        <meshStandardMaterial
          map={holoTex || undefined}
          transparent
          opacity={0.85}
          emissive="#c084fc"
          emissiveIntensity={2.2}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Central Plaza Upward Energy Column Spotlight */}
      <pointLight color="#00f0ff" intensity={4.5} distance={16} position={[0, 2.5, 0]} />
      <pointLight color="#c084fc" intensity={3.5} distance={20} position={[0, 8.5, 0]} />
    </group>
  );
}

// ========================================================
// 2. PLAZA BENCHES & INTEGRATED PLANTERS (Ref B)
// ========================================================
function PlazaBenchesAndPlanters() {
  const { scene } = useGLTF('/models/nexus-city/prop_bench_planter.glb');

  // Place 8 benches in a symmetrical circle around the central plaza
  const instances = useMemo(() => {
    const list: { x: number; z: number; rotY: number }[] = [];
    const count = 8;
    const radius = 13.5;
    for (let i = 0; i < count; i++) {
      const angle = (i * Math.PI * 2) / count;
      list.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        rotY: angle + Math.PI / 2,
      });
    }
    return list;
  }, []);

  return (
    <group>
      {instances.map((item, idx) => (
        <group key={idx} position={[item.x, 0.08, item.z]} rotation={[0, item.rotY, 0]}>
          <primitive object={scene.clone(true)} />
          <pointLight color="#38bdf8" intensity={0.8} distance={4.5} position={[2.0, 0.4, 0]} />
        </group>
      ))}
    </group>
  );
}

// ========================================================
// 3. HOLOGRAPHIC INFORMATION KIOSKS (Ref B & C)
// ========================================================
function PlazaHoloKiosks() {
  const { scene } = useGLTF('/models/nexus-city/prop_holo_kiosk.glb');
  const posterTex = useMemo(() => (typeof window !== 'undefined' ? getHologramPosterTexture('nexus') : null), []);

  const kiosks = useMemo(
    () => [
      { x: -6.5, z: 8.5, rotY: -Math.PI / 4, type: 'nexus' as const },
      { x: 6.5, z: 8.5, rotY: Math.PI / 4, type: 'ai' as const },
      { x: -6.5, z: -8.5, rotY: (-3 * Math.PI) / 4, type: 'soups' as const },
      { x: 6.5, z: -8.5, rotY: (3 * Math.PI) / 4, type: 'oasis' as const },
    ],
    []
  );

  return (
    <group>
      {kiosks.map((k, idx) => (
        <group key={idx} position={[k.x, 0.08, k.z]} rotation={[0, k.rotY, 0]}>
          <primitive object={scene.clone(true)} />
          {/* Animated Hologram Screen Plane */}
          <mesh position={[0, 1.48, 0.12]} rotation={[-Math.PI / 6, 0, 0]}>
            <planeGeometry args={[1.15, 0.75]} />
            <meshStandardMaterial
              map={posterTex || undefined}
              emissive="#00f0ff"
              emissiveIntensity={2.2}
              roughness={0.1}
            />
          </mesh>
          <pointLight color="#00f0ff" intensity={2.2} distance={6} position={[0, 1.6, 0.5]} />
        </group>
      ))}
    </group>
  );
}

// ========================================================
// 4. STREETLIGHTS & ILLUMINATION POOLS (Ref A & B)
// ========================================================
function AvenueStreetlights() {
  const { scene } = useGLTF('/models/nexus-city/prop_streetlight.glb');

  // Spaced rhythmically along the North-South & East-West sidewalks
  const poles = useMemo(
    () => [
      { x: -7.2, z: 24, rotY: 0 },
      { x: 7.2, z: 24, rotY: Math.PI },
      { x: -7.2, z: 12, rotY: 0 },
      { x: 7.2, z: 12, rotY: Math.PI },
      { x: -7.2, z: -12, rotY: 0 },
      { x: 7.2, z: -12, rotY: Math.PI },
      { x: -7.2, z: -24, rotY: 0 },
      { x: 7.2, z: -24, rotY: Math.PI },
      // East-West cross boulevard streetlights
      { x: 24, z: -7.2, rotY: Math.PI / 2 },
      { x: 24, z: 7.2, rotY: -Math.PI / 2 },
      { x: -24, z: -7.2, rotY: Math.PI / 2 },
      { x: -24, z: 7.2, rotY: -Math.PI / 2 },
    ],
    []
  );

  return (
    <group>
      {poles.map((p, idx) => (
        <group key={idx} position={[p.x, 0.08, p.z]} rotation={[0, p.rotY, 0]}>
          <primitive object={scene.clone(true)} />
          {/* Amber Roadway Downward Spotlight */}
          <pointLight
            color="#fbbf24"
            intensity={3.2}
            distance={16}
            position={[1.8, 7.2, 0]}
            decay={2}
          />
          {/* Cyan Sidewalk Downward Light */}
          <pointLight
            color="#38bdf8"
            intensity={1.8}
            distance={10}
            position={[-1.0, 6.0, 0]}
            decay={2}
          />
        </group>
      ))}
    </group>
  );
}

// ========================================================
// 5. OVERHEAD HIGHWAY TRUSS GANTRIES (Ref A & D)
// ========================================================
function OverheadHighwayGantries() {
  const { scene } = useGLTF('/models/nexus-city/prop_overhead_gantry.glb');

  return (
    <group>
      {/* South Gantry (Framing arrival street) */}
      <group position={[0, 0, 22]}>
        <primitive object={scene.clone(true)} />
        <pointLight color="#38bdf8" intensity={4.0} distance={18} position={[0, 9.0, 0]} />
      </group>

      {/* North Gantry (Entering Citadel approach) */}
      <group position={[0, 0, -20]} rotation={[0, Math.PI, 0]}>
        <primitive object={scene.clone(true)} />
        <pointLight color="#00f0ff" intensity={4.0} distance={18} position={[0, 9.0, 0]} />
      </group>
    </group>
  );
}

// ========================================================
// 6. OVERHEAD UTILITY CONDUITS & CABLES (Ref A & D)
// ========================================================
function OverheadStreetCables() {
  const cableLines = useMemo(() => {
    const list: { start: THREE.Vector3; end: THREE.Vector3; droop: number; color: string }[] = [];
    // Cross-street sagging power cables
    list.push({
      start: new THREE.Vector3(-8.5, 8.5, 18),
      end: new THREE.Vector3(8.5, 8.2, 16),
      droop: 1.4,
      color: '#111625',
    });
    list.push({
      start: new THREE.Vector3(-8.5, 8.0, 10),
      end: new THREE.Vector3(8.5, 8.4, 8),
      droop: 1.2,
      color: '#111625',
    });
    list.push({
      start: new THREE.Vector3(-8.5, 8.6, -10),
      end: new THREE.Vector3(8.5, 8.1, -12),
      droop: 1.3,
      color: '#111625',
    });
    return list;
  }, []);

  return (
    <group>
      {cableLines.map((c, idx) => {
        const points = [];
        for (let i = 0; i <= 24; i++) {
          const t = i / 24;
          const x = THREE.MathUtils.lerp(c.start.x, c.end.x, t);
          const z = THREE.MathUtils.lerp(c.start.z, c.end.z, t);
          const y = THREE.MathUtils.lerp(c.start.y, c.end.y, t) - Math.sin(t * Math.PI) * c.droop;
          points.push(new THREE.Vector3(x, y, z));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        return (
          <mesh key={idx}>
            <tubeGeometry args={[curve, 24, 0.03, 6, false]} />
            <meshStandardMaterial color={c.color} metalness={0.9} roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

// ========================================================
// 7. ANIMATED PATROL DRONES (Ref A & B)
// ========================================================
function CityPatrolDrones() {
  const drone1Ref = useRef<THREE.Group>(null);
  const drone2Ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const time = performance.now() * 0.001;

    // Drone 1 orbits North-South highway
    if (drone1Ref.current) {
      drone1Ref.current.position.x = Math.sin(time * 0.45) * 12;
      drone1Ref.current.position.z = Math.cos(time * 0.45) * 26;
      drone1Ref.current.position.y = 8.5 + Math.sin(time * 1.8) * 0.8;
      drone1Ref.current.rotation.y = time * 0.45 + Math.PI / 2;
    }

    // Drone 2 patrols East-West corridor
    if (drone2Ref.current) {
      drone2Ref.current.position.x = Math.cos(time * 0.35) * 28;
      drone2Ref.current.position.z = Math.sin(time * 0.35) * 14;
      drone2Ref.current.position.y = 11.0 + Math.cos(time * 1.5) * 0.7;
      drone2Ref.current.rotation.y = -time * 0.35;
    }
  });

  return (
    <group>
      {/* Drone 1 */}
      <group ref={drone1Ref} position={[0, 8.5, 15]}>
        <mesh castShadow>
          <boxGeometry args={[1.3, 0.28, 0.85]} />
          <meshStandardMaterial color="#0c1222" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Quad Rotor Thruster Nacelles */}
        {[-0.65, 0.65].map((dx) =>
          [-0.45, 0.45].map((dz) => (
            <mesh key={`${dx}-${dz}`} position={[dx, 0.06, dz]}>
              <cylinderGeometry args={[0.22, 0.22, 0.08, 12]} />
              <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={3.0} />
            </mesh>
          ))
        )}
        {/* Forward Scanning Spotlight */}
        <pointLight color="#38bdf8" intensity={4.5} distance={24} position={[0, -0.4, 0.6]} />
      </group>

      {/* Drone 2 */}
      <group ref={drone2Ref} position={[15, 11, 0]}>
        <mesh castShadow>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color="#1e1848" metalness={0.9} roughness={0.2} />
        </mesh>
        <pointLight color="#c084fc" intensity={4.5} distance={22} position={[0, -0.4, 0]} />
      </group>
    </group>
  );
}

// ========================================================
// 8. DISTANT HIGH-TECH METROPOLIS SKYLINE
// ========================================================
function DistantCitySkyline({ effectiveTier }: { effectiveTier: string }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const cyanFacade = useMemo(() => (typeof window !== 'undefined' ? getBuildingFacadeTexture('cyan') : null), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const towers = useMemo(() => {
    const list: { x: number; z: number; w: number; h: number; d: number }[] = [];
    const step = effectiveTier === 'low' ? 0.35 : 0.2;

    // Perimeter Urban Ring (Radius 65m to 110m)
    for (let a = 0; a < Math.PI * 2; a += step) {
      const rad = 70 + Math.sin(a * 5) * 16;
      const x = Math.cos(a) * rad;
      const z = Math.sin(a) * rad;
      const h = 36 + Math.abs(Math.sin(a * 7)) * 54; // Towers 36m to 90m tall!
      const w = 9 + Math.abs(Math.cos(a * 4)) * 6;
      const d = 9 + Math.abs(Math.sin(a * 6)) * 6;
      list.push({ x, z, w, h, d });
    }

    return list;
  }, [effectiveTier]);

  useFrame(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < towers.length; i++) {
      const t = towers[i];
      dummy.position.set(t.x, t.h / 2, t.z);
      dummy.scale.set(t.w, t.h, t.d);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, towers.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        map={cyanFacade || undefined}
        color="#080d1a"
        metalness={0.85}
        roughness={0.25}
      />
    </instancedMesh>
  );
}

// ========================================================
// MAIN EXPANDED CITY ENVIRONMENT (NEXUS CITY V1)
// ========================================================
export const CityEnvironment: React.FC = () => {
  const { effectiveTier } = usePerformanceQuality();

  const asphaltTex = useMemo(() => (typeof window !== 'undefined' ? getWetAsphaltTexture() : null), []);
  const asphaltRough = useMemo(() => (typeof window !== 'undefined' ? getWetAsphaltRoughness() : null), []);
  const sidewalkTex = useMemo(() => (typeof window !== 'undefined' ? getSidewalkTexture() : null), []);
  const grateTex = useMemo(() => (typeof window !== 'undefined' ? getMetalGrateTexture() : null), []);

  const enableShadows = effectiveTier !== 'low';
  const shadowMapSize = effectiveTier === 'high' ? 1024 : 512;

  return (
    <group>
      {/* Sci-Fi Atmospheric Blue-Hour Fog (Ref A, B, D) */}
      <fog attach="fog" args={['#060914', 22, 115]} />

      {/* ======================================================== */}
      {/* 1. STREET ROADS WITH REAL WET ASPHALT TEXTURE & REFLECTIONS */}
      {/* ======================================================== */}
      {/* North-South Grand Avenue (14m wide, 130m long) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow={enableShadows}>
        <planeGeometry args={[14, 130]} />
        <meshStandardMaterial
          map={asphaltTex || undefined}
          roughnessMap={asphaltRough || undefined}
          color="#161c2a"
          roughness={0.25}
          metalness={0.65}
        />
      </mesh>

      {/* East-West Cross Boulevard (14m wide, 130m long) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.022, 0]} receiveShadow={enableShadows}>
        <planeGeometry args={[130, 14]} />
        <meshStandardMaterial
          map={asphaltTex || undefined}
          roughnessMap={asphaltRough || undefined}
          color="#161c2a"
          roughness={0.25}
          metalness={0.65}
        />
      </mesh>

      {/* Street Drainage Grates along road borders */}
      {[-6.6, 6.6].map((x) =>
        [-20, -10, 10, 20].map((z) => (
          <mesh key={`${x}-${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.025, z]}>
            <planeGeometry args={[0.7, 1.4]} />
            <meshStandardMaterial
              map={grateTex || undefined}
              color="#0d111a"
              metalness={0.9}
              roughness={0.3}
            />
          </mesh>
        ))
      )}

      {/* Central Grand Nexus Plaza (36m Diameter) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.028, 0]}>
        <circleGeometry args={[18, 48]} />
        <meshStandardMaterial
          map={sidewalkTex || undefined}
          color="#151d2c"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Central Plaza Glowing Cyan Hexagon Trim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.032, 0]}>
        <ringGeometry args={[17.2, 17.8, 6]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.8} />
      </mesh>

      {/* Central Plaza Inner Violet Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.033, 0]}>
        <ringGeometry args={[10.5, 10.9, 36]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={2.5} />
      </mesh>

      {/* ======================================================== */}
      {/* 2. ELEVATED SIDEWALKS & WALKWAYS (Curbs 0.18m High)      */}
      {/* ======================================================== */}
      {/* West Sidewalk */}
      <mesh position={[-9.6, 0.09, 0]} receiveShadow={enableShadows}>
        <boxGeometry args={[5.2, 0.18, 128]} />
        <meshStandardMaterial map={sidewalkTex || undefined} color="#1b2434" roughness={0.4} />
      </mesh>
      {/* East Sidewalk */}
      <mesh position={[9.6, 0.09, 0]} receiveShadow={enableShadows}>
        <boxGeometry args={[5.2, 0.18, 128]} />
        <meshStandardMaterial map={sidewalkTex || undefined} color="#1b2434" roughness={0.4} />
      </mesh>
      {/* North Sidewalk */}
      <mesh position={[0, 0.09, -9.6]} receiveShadow={enableShadows}>
        <boxGeometry args={[128, 0.18, 5.2]} />
        <meshStandardMaterial map={sidewalkTex || undefined} color="#1b2434" roughness={0.4} />
      </mesh>
      {/* South Sidewalk */}
      <mesh position={[0, 0.09, 9.6]} receiveShadow={enableShadows}>
        <boxGeometry args={[128, 0.18, 5.2]} />
        <meshStandardMaterial map={sidewalkTex || undefined} color="#1b2434" roughness={0.4} />
      </mesh>

      {/* Glowing Neon Curb Guide Trims (Cyan & Violet) */}
      <mesh position={[-7.0, 0.18, 0]}>
        <boxGeometry args={[0.08, 0.02, 128]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[7.0, 0.18, 0]}>
        <boxGeometry args={[0.08, 0.02, 128]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0, 0.18, -7.0]}>
        <boxGeometry args={[128, 0.02, 0.08]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0, 0.18, 7.0]}>
        <boxGeometry args={[128, 0.02, 0.08]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={2.5} />
      </mesh>

      {/* Sub-Foundation Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[260, 260]} />
        <meshStandardMaterial color="#05070f" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* ======================================================== */}
      {/* 3. REAL 3D PROPS, MONUMENT, FURNITURE & CABLES           */}
      {/* ======================================================== */}
      <CentralPlazaMonument />
      <PlazaBenchesAndPlanters />
      <PlazaHoloKiosks />
      <AvenueStreetlights />
      <OverheadHighwayGantries />
      <OverheadStreetCables />
      <CityPatrolDrones />
      <DistantCitySkyline effectiveTier={effectiveTier} />

      {/* ======================================================== */}
      {/* 4. DYNAMIC ENVIRONMENTAL LIGHTING (Ref A, B, C, D Mood)  */}
      {/* ======================================================== */}
      {/* Deep Midnight Blue Atmospheric Fill */}
      <ambientLight intensity={0.7} color="#121832" />

      {/* Key Directional Moonlight / Sky Glow */}
      <directionalLight
        position={[32, 55, 22]}
        intensity={1.2}
        color="#38bdf8"
        castShadow={enableShadows}
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
        shadow-camera-far={130}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bias={-0.0004}
      />

      {/* Warm Magenta / Amber City Counter-Fill */}
      <directionalLight position={[-32, 42, -22]} intensity={0.65} color="#c084fc" />
    </group>
  );
};

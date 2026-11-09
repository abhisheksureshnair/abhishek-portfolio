'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Point2D {
  x: number;
  z: number;
}

interface PathSample {
  x: number;
  z: number;
  distance: number;
  angle: number;
}

interface CircuitPath {
  samples: PathSample[];
  totalLength: number;
}

/**
 * Builds a smooth closed-loop road circuit with rounded bezier corners.
 */
function buildCircuit(corners: Point2D[], cornerRadius = 2.2, samplesPerTurn = 10): CircuitPath {
  const count = corners.length;
  const rawPoints: Point2D[] = [];

  for (let i = 0; i < count; i++) {
    const prev = corners[(i - 1 + count) % count];
    const curr = corners[i];
    const next = corners[(i + 1) % count];

    // Direction vectors
    const vIn = { x: curr.x - prev.x, z: curr.z - prev.z };
    const lenIn = Math.hypot(vIn.x, vIn.z);
    const nIn = { x: vIn.x / lenIn, z: vIn.z / lenIn };

    const vOut = { x: next.x - curr.x, z: next.z - curr.z };
    const lenOut = Math.hypot(vOut.x, vOut.z);
    const nOut = { x: vOut.x / lenOut, z: vOut.z / lenOut };

    const actualR = Math.min(cornerRadius, lenIn * 0.45, lenOut * 0.45);

    // Start and end points of the rounded corner
    const pStart = {
      x: curr.x - nIn.x * actualR,
      z: curr.z - nIn.z * actualR,
    };
    const pEnd = {
      x: curr.x + nOut.x * actualR,
      z: curr.z + nOut.z * actualR,
    };

    // Quadratic Bezier corner interpolation
    for (let s = 0; s <= samplesPerTurn; s++) {
      const t = s / samplesPerTurn;
      const oneMinusT = 1 - t;
      const bx = oneMinusT * oneMinusT * pStart.x + 2 * oneMinusT * t * curr.x + t * t * pEnd.x;
      const bz = oneMinusT * oneMinusT * pStart.z + 2 * oneMinusT * t * curr.z + t * t * pEnd.z;
      rawPoints.push({ x: bx, z: bz });
    }
  }

  // Calculate cumulative arc distances and tangent angles
  const samples: PathSample[] = [];
  let totalLength = 0;

  for (let i = 0; i < rawPoints.length; i++) {
    const curr = rawPoints[i];
    const next = rawPoints[(i + 1) % rawPoints.length];
    const dx = next.x - curr.x;
    const dz = next.z - curr.z;
    const segLen = Math.hypot(dx, dz);

    const angle = Math.atan2(dx, dz);
    samples.push({
      x: curr.x,
      z: curr.z,
      distance: totalLength,
      angle,
    });
    totalLength += segLen;
  }

  return { samples, totalLength };
}

/**
 * Samples a continuous road position and angle along a circuit.
 */
function sampleCircuit(circuit: CircuitPath, targetDistance: number, out: { x: number; z: number; angle: number }) {
  const normDist = ((targetDistance % circuit.totalLength) + circuit.totalLength) % circuit.totalLength;
  const samples = circuit.samples;

  // Binary search for efficiency
  let low = 0;
  let high = samples.length - 1;

  while (low <= high) {
    const mid = (low + high) >> 1;
    if (samples[mid].distance <= normDist) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  const idxA = Math.max(0, high);
  const idxB = (idxA + 1) % samples.length;

  const sA = samples[idxA];
  const sB = samples[idxB];

  let span = sB.distance - sA.distance;
  if (span < 0) span += circuit.totalLength;

  const localDist = normDist - sA.distance;
  const t = span > 0 ? Math.min(1, Math.max(0, localDist / span)) : 0;

  out.x = sA.x + (sB.x - sA.x) * t;
  out.z = sA.z + (sB.z - sA.z) * t;

  // Tangent interpolation
  let diff = sB.angle - sA.angle;
  while (diff < -Math.PI) diff += Math.PI * 2;
  while (diff > Math.PI) diff -= Math.PI * 2;
  out.angle = sA.angle + diff * t;
}

/**
 * Low-Poly Stylized Animated Car Model
 */
interface CarModelProps {
  type: 'taxi' | 'sports' | 'coupe' | 'van' | 'police';
  color: string;
}

const CarBody: React.FC<CarModelProps> = ({ type, color }) => {
  return (
    <group>
      {/* Lower Main Chassis */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.35, 0.26, type === 'van' ? 3.0 : 2.7]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Cabin & Windows */}
      {type === 'van' ? (
        <group position={[0, 0.62, -0.2]}>
          <mesh castShadow>
            <boxGeometry args={[1.25, 0.58, 2.2]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          {/* Van Front Glass */}
          <mesh position={[0, 0, 1.11]}>
            <planeGeometry args={[1.1, 0.45]} />
            <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
          </mesh>
        </group>
      ) : (
        <group position={[0, 0.48, -0.1]}>
          <mesh castShadow>
            <boxGeometry args={[1.15, 0.32, 1.45]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#0369a1"
              emissiveIntensity={0.2}
              roughness={0.1}
              metalness={0.85}
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Roof Panel */}
          <mesh position={[0, 0.17, 0]}>
            <boxGeometry args={[1.18, 0.04, 1.48]} />
            <meshStandardMaterial color={color} roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* Type-Specific Roof Fixture */}
      {type === 'taxi' && (
        <group position={[0, 0.72, -0.1]}>
          <mesh>
            <boxGeometry args={[0.5, 0.12, 0.22]} />
            <meshStandardMaterial color="#fef08a" emissive="#fde047" emissiveIntensity={2.0} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.3, 0.04, 0.06]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
      )}

      {type === 'police' && (
        <group position={[0, 0.72, -0.1]}>
          {/* Red & Blue Emergency Light Bar */}
          <mesh position={[-0.2, 0, 0]}>
            <boxGeometry args={[0.24, 0.1, 0.16]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3.0} />
          </mesh>
          <mesh position={[0.2, 0, 0]}>
            <boxGeometry args={[0.24, 0.1, 0.16]} />
            <meshStandardMaterial color="#0284c7" emissive="#00f0ff" emissiveIntensity={3.0} />
          </mesh>
        </group>
      )}

      {type === 'sports' && (
        <group position={[0, 0.52, -1.25]}>
          {/* Aerodynamic Rear Spoiler */}
          <mesh castShadow>
            <boxGeometry args={[1.25, 0.05, 0.22]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          <mesh position={[-0.5, -0.1, 0]}>
            <boxGeometry args={[0.04, 0.2, 0.06]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.5, -0.1, 0]}>
            <boxGeometry args={[0.04, 0.2, 0.06]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
      )}

      {/* Bumpers */}
      <mesh position={[0, 0.16, 1.38]}>
        <boxGeometry args={[1.38, 0.12, 0.1]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.16, -1.38]}>
        <boxGeometry args={[1.38, 0.12, 0.1]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} />
      </mesh>

      {/* Headlights (Warm White Glow) */}
      <mesh position={[-0.45, 0.24, 1.41]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0.45, 0.24, 1.41]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={2.5} />
      </mesh>

      {/* Taillights (Red Glow) */}
      <mesh position={[-0.45, 0.24, -1.41]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0.45, 0.24, -1.41]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.5} />
      </mesh>
    </group>
  );
};

/**
 * CityTrafficSystem Component
 * Manages 4 to 5 animated low-poly cars on continuous road circuits:
 * - Stays strictly on valid asphalt road lanes
 * - Smooth quadratic bezier turns at intersections
 * - Frame-rate independent speed and wheel rotation
 * - Zero real-time object allocation in useFrame
 */
export const CityTrafficSystem: React.FC = () => {
  // Precompute 4 closed-loop road circuits
  const circuits = useMemo(() => {
    // Circuit 1: Outer City Ring (Clockwise, right-hand drive lane)
    // Runs along outer streets: West Street (x=-13.95), North Cross (z=-12.95), East Street (x=13.95), South Cross (z=12.95)
    const c1 = buildCircuit([
      { x: -13.95, z: 12.0 },
      { x: -13.95, z: -12.0 },
      { x: 13.95, z: -12.0 },
      { x: 13.95, z: 12.0 },
    ]);

    // Circuit 2: Northeast Block Loop (Central Blvd North -> East on North Cross -> South on East St -> West on Central Blvd)
    const c2 = buildCircuit([
      { x: 1.4, z: 0.0 },
      { x: 1.4, z: -12.0 },
      { x: 13.95, z: -12.0 },
      { x: 13.95, z: 0.0 },
    ]);

    // Circuit 3: Southwest Block Loop (Central Blvd South -> West on South Cross -> North on West St -> East on Central Blvd)
    const c3 = buildCircuit([
      { x: -1.4, z: 0.0 },
      { x: -1.4, z: 12.0 },
      { x: -13.95, z: 12.0 },
      { x: -13.95, z: 0.0 },
    ]);

    // Circuit 4: Southeast Block Loop (South on East St -> West on South Cross -> North on Central Blvd -> East on Central Blvd)
    const c4 = buildCircuit([
      { x: 13.95, z: 0.0 },
      { x: 13.95, z: 12.0 },
      { x: 1.4, z: 12.0 },
      { x: 1.4, z: 0.0 },
    ]);

    return [c1, c2, c3, c4];
  }, []);

  // 5 Active Vehicle Configs
  const vehicles = useMemo(() => [
    { id: 'taxi-1', type: 'taxi' as const, color: '#f59e0b', circuitIdx: 0, speed: 5.6, dist: 0 },
    { id: 'sports-1', type: 'sports' as const, color: '#06b6d4', circuitIdx: 1, speed: 6.8, dist: 15 },
    { id: 'coupe-1', type: 'coupe' as const, color: '#ef4444', circuitIdx: 2, speed: 6.0, dist: 8 },
    { id: 'van-1', type: 'van' as const, color: '#10b981', circuitIdx: 0, speed: 4.8, dist: 55 },
    { id: 'police-1', type: 'police' as const, color: '#0f172a', circuitIdx: 3, speed: 7.2, dist: 22 },
  ], []);

  // Vehicle refs
  const carRefs = useRef<(THREE.Group | null)[]>([]);
  const wheelRefs = useRef<(THREE.Group | null)[]>([]);

  // Distance tracking ref
  const distancesRef = useRef<number[]>(vehicles.map((v) => v.dist));

  // Scratch transform object
  const scratchPos = useMemo(() => ({ x: 0, z: 0, angle: 0 }), []);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.1);

    for (let i = 0; i < vehicles.length; i++) {
      const v = vehicles[i];
      const carGroup = carRefs.current[i];
      if (!carGroup) continue;

      const circuit = circuits[v.circuitIdx];
      distancesRef.current[i] += v.speed * clampedDelta;

      // Sample position and heading
      sampleCircuit(circuit, distancesRef.current[i], scratchPos);

      // Road elevation is 0.62. Car chassis sits cleanly at y = 0.65
      carGroup.position.set(scratchPos.x, 0.65, scratchPos.z);
      carGroup.rotation.y = scratchPos.angle;

      // Rotate wheels based on distance traveled (radius = 0.22)
      const wheelGroup = wheelRefs.current[i];
      if (wheelGroup) {
        wheelGroup.rotation.x += (v.speed * clampedDelta) / 0.22;
      }
    }
  });

  return (
    <group name="CityTrafficSystem">
      {vehicles.map((v, i) => (
        <group
          key={v.id}
          ref={(el) => {
            carRefs.current[i] = el;
          }}
        >
          {/* Car Body Model */}
          <CarBody type={v.type} color={v.color} />

          {/* 4 Rotating Wheels Assembly */}
          <group
            ref={(el) => {
              wheelRefs.current[i] = el;
            }}
          >
            {[
              [-0.72, 0.14, 0.75],
              [0.72, 0.14, 0.75],
              [-0.72, 0.14, -0.75],
              [0.72, 0.14, -0.75],
            ].map(([wx, wy, wz], wIdx) => (
              <mesh key={`wheel-${wIdx}`} position={[wx, wy, wz]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.22, 0.22, 0.14, 10]} />
                <meshStandardMaterial color="#0f172a" roughness={0.8} />
              </mesh>
            ))}
          </group>
        </group>
      ))}
    </group>
  );
};

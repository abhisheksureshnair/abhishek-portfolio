'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { VehicleType, VehicleAccessory, VehicleChassis, VehicleWheels } from './CityVehicles';
import { usePerformanceQuality } from '../PerformanceControl';
import { getTrafficSignalState, SignalPhase } from './CityTrafficSignals';

interface Point2D {
  x: number;
  z: number;
}

interface PathSample {
  x: number;
  z: number;
  distance: number;
  angle: number;
  isCurved: boolean;
}

interface StopLine {
  dist: number; // Arc-length distance along circuit
  x: number;
  z: number;
  direction: 'ns' | 'ew';
}

interface AdvancedCircuitPath {
  samples: PathSample[];
  totalLength: number;
  stopLines: StopLine[];
}

/**
 * Builds a continuous closed-loop road circuit with smooth cubic Bezier turns and stop lines.
 */
function buildAdvancedCircuit(
  corners: Point2D[],
  stopLineDefinitions: { x: number; z: number; heading: number; direction: 'ns' | 'ew' }[] = [],
  cornerRadius = 2.6
): AdvancedCircuitPath {
  const count = corners.length;
  const rawPoints: { x: number; z: number; isCurved: boolean }[] = [];

  for (let i = 0; i < count; i++) {
    const prev = corners[(i - 1 + count) % count];
    const curr = corners[i];
    const next = corners[(i + 1) % count];

    // Inbound & outbound direction vectors
    const vIn = { x: curr.x - prev.x, z: curr.z - prev.z };
    const lenIn = Math.hypot(vIn.x, vIn.z);
    const nIn = { x: vIn.x / lenIn, z: vIn.z / lenIn };

    const vOut = { x: next.x - curr.x, z: next.z - curr.z };
    const lenOut = Math.hypot(vOut.x, vOut.z);
    const nOut = { x: vOut.x / lenOut, z: vOut.z / lenOut };

    const actualR = Math.min(cornerRadius, lenIn * 0.45, lenOut * 0.45);
    const pStart = { x: curr.x - nIn.x * actualR, z: curr.z - nIn.z * actualR };
    const pEnd = { x: curr.x + nOut.x * actualR, z: curr.z + nOut.z * actualR };

    // 1. Subdivide straight segment between previous curve end and current curve start
    if (rawPoints.length > 0) {
      const lastP = rawPoints[rawPoints.length - 1];
      const distStraight = Math.hypot(pStart.x - lastP.x, pStart.z - lastP.z);
      const steps = Math.max(1, Math.floor(distStraight / 0.4));
      for (let st = 1; st < steps; st++) {
        const u = st / steps;
        rawPoints.push({
          x: lastP.x + (pStart.x - lastP.x) * u,
          z: lastP.z + (pStart.z - lastP.z) * u,
          isCurved: false,
        });
      }
    }

    // 2. Cubic Bezier curve for turn (circular arc approximation)
    const k = actualR * 0.552;
    const c1 = { x: pStart.x + nIn.x * k, z: pStart.z + nIn.z * k };
    const c2 = { x: pEnd.x - nOut.x * k, z: pEnd.z - nOut.z * k };

    const CURVE_STEPS = 16;
    for (let s = 0; s <= CURVE_STEPS; s++) {
      const t = s / CURVE_STEPS;
      const oneMinusT = 1 - t;
      const bx =
        oneMinusT * oneMinusT * oneMinusT * pStart.x +
        3 * oneMinusT * oneMinusT * t * c1.x +
        3 * oneMinusT * t * t * c2.x +
        t * t * t * pEnd.x;
      const bz =
        oneMinusT * oneMinusT * oneMinusT * pStart.z +
        3 * oneMinusT * oneMinusT * t * c1.z +
        3 * oneMinusT * t * t * c2.z +
        t * t * t * pEnd.z;
      rawPoints.push({ x: bx, z: bz, isCurved: true });
    }
  }

  // Connect closing segment back to first point
  const firstP = rawPoints[0];
  const lastP = rawPoints[rawPoints.length - 1];
  const distClose = Math.hypot(firstP.x - lastP.x, firstP.z - lastP.z);
  const stepsClose = Math.max(1, Math.floor(distClose / 0.4));
  for (let st = 1; st < stepsClose; st++) {
    const u = st / stepsClose;
    rawPoints.push({
      x: lastP.x + (firstP.x - lastP.x) * u,
      z: lastP.z + (firstP.z - lastP.z) * u,
      isCurved: false,
    });
  }

  // Calculate cumulative distances and tangents
  const samples: PathSample[] = [];
  let totalLength = 0;

  for (let i = 0; i < rawPoints.length; i++) {
    const curr = rawPoints[i];
    const next = rawPoints[(i + 1) % rawPoints.length];
    const dx = next.x - curr.x;
    const dz = next.z - curr.z;
    const segLen = Math.hypot(dx, dz);

    if (segLen > 0.0001) {
      const angle = Math.atan2(dx, dz);
      samples.push({
        x: curr.x,
        z: curr.z,
        distance: totalLength,
        angle,
        isCurved: curr.isCurved,
      });
      totalLength += segLen;
    }
  }

  // Map stop line triggers to exact arc-length distances on this circuit
  const stopLines: StopLine[] = [];
  for (const def of stopLineDefinitions) {
    let bestDist = -1;
    let minDist = 3.5;

    for (let i = 0; i < samples.length; i++) {
      const s = samples[i];
      const d = Math.hypot(s.x - def.x, s.z - def.z);
      if (d < minDist) {
        let angleDiff = Math.abs(s.angle - def.heading);
        while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);
        if (angleDiff < 0.85) {
          minDist = d;
          bestDist = s.distance;
        }
      }
    }

    if (bestDist !== -1) {
      stopLines.push({
        dist: bestDist,
        x: def.x,
        z: def.z,
        direction: def.direction,
      });
    }
  }

  return { samples, totalLength, stopLines };
}

/**
 * High-performance binary search sampling along a circuit.
 */
function sampleCircuit(
  circuit: AdvancedCircuitPath,
  targetDistance: number,
  out: { x: number; z: number; angle: number; isCurved: boolean }
) {
  const normDist = ((targetDistance % circuit.totalLength) + circuit.totalLength) % circuit.totalLength;
  const samples = circuit.samples;

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
  out.isCurved = sA.isCurved || sB.isCurved;

  // Shortest angular tangent interpolation
  let diff = sB.angle - sA.angle;
  while (diff < -Math.PI) diff += Math.PI * 2;
  while (diff > Math.PI) diff -= Math.PI * 2;
  out.angle = sA.angle + diff * t;
}

export interface VehicleConfig {
  id: string;
  type: VehicleType;
  color: string;
  accessory?: VehicleAccessory;
  circuitIdx: number;
  baseCruisingSpeed: number; // m/s
  initialDist: number;
}

/**
 * CityTrafficSystem Component
 * Production-ready intelligent traffic engine:
 * - 5 stylized 3D vehicles following strictly valid, right-hand drive road lanes
 * - Smooth cubic Bezier intersection turns with natural corner deceleration
 * - Traffic signal detection & stopping behind intersection zebra crossings
 * - Smooth gradual acceleration, deceleration, and car-following collision prevention
 * - Realistic delta-time-aware steering rotation damping
 * - Physically accurate wheel rotation based on distance and tire radius
 * - Zero React re-renders in useFrame (100% mutable ref updates)
 */
export const CityTrafficSystem: React.FC = () => {
  const { effectiveTier } = usePerformanceQuality();
  const enableShadows = effectiveTier !== 'low';

  // Standard stop lines for major intersections
  const standardStopLines = useMemo(
    () => [
      // 1. Center Crossroads (X=0, Z=0)
      { x: 1.4, z: -3.2, heading: 0, direction: 'ns' as const }, // Southbound approach
      { x: -1.4, z: 3.2, heading: Math.PI, direction: 'ns' as const }, // Northbound approach
      { x: -3.2, z: -1.4, heading: Math.PI / 2, direction: 'ew' as const }, // Eastbound approach
      { x: 3.2, z: 1.4, heading: -Math.PI / 2, direction: 'ew' as const }, // Westbound approach

      // 2. North Junction (X=0, Z=-14)
      { x: 1.4, z: -17.2, heading: 0, direction: 'ns' as const },
      { x: -1.4, z: -10.8, heading: Math.PI, direction: 'ns' as const },
      { x: -3.2, z: -12.95, heading: Math.PI / 2, direction: 'ew' as const },
      { x: 3.2, z: -12.95, heading: -Math.PI / 2, direction: 'ew' as const },

      // 3. South Junction (X=0, Z=14)
      { x: 1.4, z: 10.8, heading: 0, direction: 'ns' as const },
      { x: -1.4, z: 17.2, heading: Math.PI, direction: 'ns' as const },
      { x: -3.2, z: 12.95, heading: Math.PI / 2, direction: 'ew' as const },
      { x: 3.2, z: 12.95, heading: -Math.PI / 2, direction: 'ew' as const },

      // 4. West Junction (X=-15, Z=0)
      { x: -13.95, z: -3.2, heading: 0, direction: 'ns' as const },
      { x: -13.95, z: 3.2, heading: Math.PI, direction: 'ns' as const },

      // 5. East Junction (X=15, Z=0)
      { x: 13.95, z: -3.2, heading: 0, direction: 'ns' as const },
      { x: 13.95, z: 3.2, heading: Math.PI, direction: 'ns' as const },
    ],
    []
  );

  // Precompute 4 closed-loop road circuits strictly aligned to right-hand traffic
  const circuits = useMemo(() => {
    // Circuit 0: Outer City Ring (Clockwise perimeter: West St -> North Cross -> East St -> South Cross)
    const c0 = buildAdvancedCircuit(
      [
        { x: -13.95, z: 12.0 },
        { x: -13.95, z: -12.0 },
        { x: 13.95, z: -12.0 },
        { x: 13.95, z: 12.0 },
      ],
      standardStopLines,
      2.6
    );

    // Circuit 1: Northeast Boulevard Loop (Central Ave South -> East St -> North Cross St)
    const c1 = buildAdvancedCircuit(
      [
        { x: 1.4, z: 0.0 },
        { x: 1.4, z: -12.0 },
        { x: 13.95, z: -12.0 },
        { x: 13.95, z: -1.4 },
        { x: 1.4, z: -1.4 },
      ],
      standardStopLines,
      2.5
    );

    // Circuit 2: Southwest Boulevard Loop (Central Ave North -> West St -> South Cross St)
    const c2 = buildAdvancedCircuit(
      [
        { x: -1.4, z: 0.0 },
        { x: -1.4, z: 12.0 },
        { x: -13.95, z: 12.0 },
        { x: -13.95, z: 1.4 },
        { x: -1.4, z: 1.4 },
      ],
      standardStopLines,
      2.5
    );

    // Circuit 3: Southeast Boulevard Loop
    const c3 = buildAdvancedCircuit(
      [
        { x: 13.95, z: 0.0 },
        { x: 13.95, z: 12.0 },
        { x: 1.4, z: 12.0 },
        { x: 1.4, z: 0.0 },
      ],
      standardStopLines,
      2.5
    );

    return [c0, c1, c2, c3];
  }, [standardStopLines]);

  // 5 Active Vehicle Configs
  const vehicleConfigs: VehicleConfig[] = useMemo(
    () => [
      {
        id: 'hatchback-orange',
        type: 'hatchback',
        color: '#f97316',
        accessory: 'none',
        circuitIdx: 0,
        baseCruisingSpeed: 5.6,
        initialDist: 0,
      },
      {
        id: 'sedan-cyber-grey',
        type: 'sedan',
        color: '#94a3b8',
        accessory: 'spoiler',
        circuitIdx: 1,
        baseCruisingSpeed: 6.4,
        initialDist: 18,
      },
      {
        id: 'sedan-taxi-yellow',
        type: 'sedan',
        color: '#f59e0b',
        accessory: 'taxi',
        circuitIdx: 2,
        baseCruisingSpeed: 5.8,
        initialDist: 10,
      },
      {
        id: 'suv-urban-cyan',
        type: 'suv',
        color: '#06b6d4',
        accessory: 'none',
        circuitIdx: 0,
        baseCruisingSpeed: 5.0,
        initialDist: 50,
      },
      {
        id: 'sedan-police-cruiser',
        type: 'sedan',
        color: '#0b1329',
        accessory: 'police',
        circuitIdx: 3,
        baseCruisingSpeed: 6.8,
        initialDist: 22,
      },
    ],
    []
  );

  // Vehicle DOM/Scene Refs
  const carRefs = useRef<(THREE.Group | null)[]>([]);
  const wheelRefs = useRef<(THREE.Group | null)[]>([]);

  // Simulation State Refs (Mutable Float64 arrays for 60 FPS zero-allocation physics)
  const simState = useRef({
    distances: vehicleConfigs.map((v) => v.initialDist),
    currentSpeeds: vehicleConfigs.map((v) => v.baseCruisingSpeed * 0.8),
    headings: vehicleConfigs.map(() => 0),
    positions: vehicleConfigs.map(() => ({ x: 0, z: 0 })),
  });

  // Reusable scratch objects
  const scratchSample = useMemo(() => ({ x: 0, z: 0, angle: 0, isCurved: false }), []);

  // Traffic Physics Constants
  const ACCEL_RATE = 2.8; // m/s^2 smooth throttle
  const DECEL_RATE = 4.4; // m/s^2 smooth braking
  const TURN_MAX_SPEED = 3.6; // m/s cornering speed
  const STEERING_LAG = 10.5; // rad/s natural steering rate

  useFrame((_, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    const clampedDelta = Math.min(delta, 0.08);
    const timeSec = Date.now() * 0.001;
    const { nsPhase, ewPhase } = getTrafficSignalState(timeSec);

    const count = vehicleConfigs.length;
    const state = simState.current;

    // STEP 1: Calculate target desired speed for each vehicle
    const desiredSpeeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const config = vehicleConfigs[i];
      const circuit = circuits[config.circuitIdx];
      const currentDist = state.distances[i];
      let desired = config.baseCruisingSpeed;

      // 1a. Decelerate if in or approaching a turn
      sampleCircuit(circuit, currentDist + 1.8, scratchSample);
      if (scratchSample.isCurved) {
        desired = Math.min(desired, TURN_MAX_SPEED);
      }

      // 1b. Check traffic signal stop lines ahead on this circuit
      for (let sIdx = 0; sIdx < circuit.stopLines.length; sIdx++) {
        const stopLine = circuit.stopLines[sIdx];
        let distToStop = stopLine.dist - currentDist;
        if (distToStop < -1.0) distToStop += circuit.totalLength;

        // Approaching within stopping window (0.4m to 7.2m before stop line)
        if (distToStop > 0.4 && distToStop < 7.2) {
          const phase: SignalPhase = stopLine.direction === 'ns' ? nsPhase : ewPhase;

          if (phase === 'red' || (phase === 'yellow' && distToStop > 2.0)) {
            // Smooth quadratic braking curve
            const stopFactor = Math.max(0, (distToStop - 0.7) / 6.0);
            const targetBrakingSpeed = config.baseCruisingSpeed * Math.pow(stopFactor, 1.4);
            desired = Math.min(desired, targetBrakingSpeed);

            if (distToStop <= 0.8) {
              desired = 0;
            }
          }
        }
      }

      // 1c. Car-Following / Anti-Collision (Avoid overlapping cars ahead)
      for (let j = 0; j < count; j++) {
        if (i === j) continue;

        // Same circuit check:
        if (config.circuitIdx === vehicleConfigs[j].circuitIdx) {
          let distAhead = state.distances[j] - currentDist;
          if (distAhead < 0) distAhead += circuit.totalLength;

          if (distAhead > 0.1 && distAhead < 6.0) {
            if (distAhead <= 2.6) {
              desired = 0; // Immediate full stop to prevent bumper clipping
            } else {
              const followFactor = Math.max(0, (distAhead - 2.6) / 3.4);
              const followSpeed = state.currentSpeeds[j] * followFactor;
              desired = Math.min(desired, followSpeed);
            }
          }
        } else {
          // Different circuits converging near junctions
          const dx = state.positions[j].x - state.positions[i].x;
          const dz = state.positions[j].z - state.positions[i].z;
          const dist2D = Math.hypot(dx, dz);

          if (dist2D < 3.8) {
            // Yield to vehicle that has priority or is already moving faster
            if (i > j && state.currentSpeeds[j] > 0.5) {
              desired = Math.min(desired, 0);
            }
          }
        }
      }

      desiredSpeeds[i] = desired;
    }

    // STEP 2: Apply smooth physics integration & update transforms
    for (let i = 0; i < count; i++) {
      const config = vehicleConfigs[i];
      const circuit = circuits[config.circuitIdx];
      const carGroup = carRefs.current[i];
      if (!carGroup) continue;

      // 2a. Gradual acceleration and deceleration
      const targetSpeed = desiredSpeeds[i];
      let speed = state.currentSpeeds[i];

      if (speed < targetSpeed) {
        speed = Math.min(targetSpeed, speed + ACCEL_RATE * clampedDelta);
      } else if (speed > targetSpeed) {
        speed = Math.max(targetSpeed, speed - DECEL_RATE * clampedDelta);
      }
      state.currentSpeeds[i] = speed;

      // 2b. Advance distance along path
      state.distances[i] = (state.distances[i] + speed * clampedDelta) % circuit.totalLength;

      // 2c. Sample continuous trajectory & road direction
      sampleCircuit(circuit, state.distances[i], scratchSample);
      state.positions[i].x = scratchSample.x;
      state.positions[i].z = scratchSample.z;

      // Road plane is at 0.62. Car chassis sits cleanly at y = 0.65
      carGroup.position.set(scratchSample.x, 0.65, scratchSample.z);

      // 2d. Smooth steering and rotation damping during turns
      let angleDiff = scratchSample.angle - state.headings[i];
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;

      state.headings[i] += angleDiff * Math.min(1.0, STEERING_LAG * clampedDelta);
      carGroup.rotation.y = state.headings[i];

      // 2e. Physically accurate wheel rotation based on tire radius
      const wheelGroup = wheelRefs.current[i];
      if (wheelGroup) {
        const wheelRadius = config.type === 'suv' ? 0.25 : 0.22;
        wheelGroup.rotation.x += (speed * clampedDelta) / wheelRadius;
      }
    }
  });

  return (
    <group name="CityTrafficSystem">
      {vehicleConfigs.map((v, i) => (
        <group
          key={v.id}
          ref={(el) => {
            carRefs.current[i] = el;
          }}
        >
          {/* Stylized Recognizable 3D Car Body */}
          <VehicleChassis
            type={v.type}
            color={v.color}
            accessory={v.accessory}
            enableShadows={enableShadows}
          />

          {/* 4 Rotating Rubber Tires with Silver Star-Spoke Rims */}
          <VehicleWheels
            type={v.type}
            ref={(el) => {
              wheelRefs.current[i] = el;
            }}
          />
        </group>
      ))}
    </group>
  );
};

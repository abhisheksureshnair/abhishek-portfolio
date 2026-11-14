'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  VehicleModelType,
  RealisticVehicleModel,
} from './RealisticVehicles';
import { getTrafficSignalState, SignalPhase } from './CityTrafficSignals';
import { usePerformanceQuality } from '../PerformanceControl';
import { TimeOfDay } from './AtmosphericWeatherSystem';

interface RealisticTrafficAIProps {
  timeOfDay?: TimeOfDay;
  playerPosRef?: React.MutableRefObject<THREE.Vector3>;
}

interface PathNode {
  x: number;
  z: number;
}

interface Waypoint {
  x: number;
  z: number;
  heading: number; // radians
  distance: number;
  isCurved: boolean;
}

interface TrafficCircuit {
  waypoints: Waypoint[];
  totalLength: number;
  axis: 'ns' | 'ew';
  stopDistances: number[]; // Distances along circuit corresponding to stop lines
}

/**
 * Builds a smooth road path with cubic Bézier rounded corners.
 */
function buildTrafficCircuit(corners: PathNode[], cornerRadius = 3.2): TrafficCircuit {
  const count = corners.length;
  const rawPoints: { x: number; z: number; isCurved: boolean }[] = [];

  for (let i = 0; i < count; i++) {
    const prev = corners[(i - 1 + count) % count];
    const curr = corners[i];
    const next = corners[(i + 1) % count];

    const vIn = { x: curr.x - prev.x, z: curr.z - prev.z };
    const lenIn = Math.hypot(vIn.x, vIn.z);
    const nIn = { x: vIn.x / lenIn, z: vIn.z / lenIn };

    const vOut = { x: next.x - curr.x, z: next.z - curr.z };
    const lenOut = Math.hypot(vOut.x, vOut.z);
    const nOut = { x: vOut.x / lenOut, z: vOut.z / lenOut };

    const actualR = Math.min(cornerRadius, lenIn * 0.42, lenOut * 0.42);
    const pStart = { x: curr.x - nIn.x * actualR, z: curr.z - nIn.z * actualR };
    const pEnd = { x: curr.x + nOut.x * actualR, z: curr.z + nOut.z * actualR };

    // Subdivide straight segment
    if (rawPoints.length > 0) {
      const lastP = rawPoints[rawPoints.length - 1];
      const distStraight = Math.hypot(pStart.x - lastP.x, pStart.z - lastP.z);
      const steps = Math.max(1, Math.floor(distStraight / 0.5));
      for (let st = 1; st < steps; st++) {
        const u = st / steps;
        rawPoints.push({
          x: lastP.x + (pStart.x - lastP.x) * u,
          z: lastP.z + (pStart.z - lastP.z) * u,
          isCurved: false,
        });
      }
    }

    // Cubic Bézier curve for smooth corner turn
    const k = actualR * 0.552;
    const c1 = { x: pStart.x + nIn.x * k, z: pStart.z + nIn.z * k };
    const c2 = { x: pEnd.x - nOut.x * k, z: pEnd.z - nOut.z * k };

    const CURVE_STEPS = 12;
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

  // Calculate cumulative distances and tangents
  const waypoints: Waypoint[] = [];
  let totalLength = 0;

  for (let i = 0; i < rawPoints.length; i++) {
    const curr = rawPoints[i];
    const next = rawPoints[(i + 1) % rawPoints.length];
    const dx = next.x - curr.x;
    const dz = next.z - curr.z;
    const segLen = Math.hypot(dx, dz);

    if (segLen > 0.001) {
      const heading = Math.atan2(dx, dz);
      waypoints.push({
        x: curr.x,
        z: curr.z,
        heading,
        distance: totalLength,
        isCurved: curr.isCurved,
      });
      totalLength += segLen;
    }
  }

  // Identify stop lines near (0, 0) intersection (within distance 3.8m of center)
  const stopDistances: number[] = [];
  for (const wp of waypoints) {
    const distToCenter = Math.hypot(wp.x, wp.z);
    if (distToCenter >= 3.2 && distToCenter <= 3.8) {
      // Check if moving towards center (dot product with center direction > 0)
      const toCenterX = -wp.x;
      const toCenterZ = -wp.z;
      const moveX = Math.sin(wp.heading);
      const moveZ = Math.cos(wp.heading);
      if (toCenterX * moveX + toCenterZ * moveZ > 0.7) {
        if (!stopDistances.some((d) => Math.abs(d - wp.distance) < 5.0)) {
          stopDistances.push(wp.distance);
        }
      }
    }
  }

  const axis: 'ns' | 'ew' = Math.abs(corners[0].x - corners[1].x) < 2.0 ? 'ns' : 'ew';
  return { waypoints, totalLength, axis, stopDistances };
}

/**
 * Fast binary search sampling along circuit path.
 */
function sampleCircuit(
  circuit: TrafficCircuit,
  distance: number,
  out: { x: number; z: number; heading: number; isCurved: boolean }
) {
  const normDist = ((distance % circuit.totalLength) + circuit.totalLength) % circuit.totalLength;
  const wps = circuit.waypoints;

  let low = 0;
  let high = wps.length - 1;

  while (low <= high) {
    const mid = (low + high) >> 1;
    if (wps[mid].distance <= normDist) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  const idxA = Math.max(0, high);
  const idxB = (idxA + 1) % wps.length;

  const a = wps[idxA];
  const b = wps[idxB];

  let span = b.distance - a.distance;
  if (span < 0) span += circuit.totalLength;

  const localDist = normDist - a.distance;
  const t = span > 0 ? Math.min(1, Math.max(0, localDist / span)) : 0;

  out.x = a.x + (b.x - a.x) * t;
  out.z = a.z + (b.z - a.z) * t;
  out.isCurved = a.isCurved || b.isCurved;

  let diff = b.heading - a.heading;
  while (diff < -Math.PI) diff += Math.PI * 2;
  while (diff > Math.PI) diff -= Math.PI * 2;
  out.heading = a.heading + diff * t;
}

interface ActiveVehicleState {
  id: string;
  type: VehicleModelType;
  color: string;
  circuitIdx: number;
  distance: number;
  currentSpeed: number;
  targetSpeed: number;
  steeringAngle: number;
  wheelRotation: number;
  isBraking: boolean;
  isTurningLeft: boolean;
  isTurningRight: boolean;
  x: number;
  z: number;
  heading: number;
}

/**
 * Intelligent Vehicle Traffic Engine Component
 */
export const RealisticTrafficAI: React.FC<RealisticTrafficAIProps> = ({
  timeOfDay = 'day',
  playerPosRef,
}) => {
  const { effectiveTier } = usePerformanceQuality();
  const isNight = timeOfDay === 'night';

  // 1. Precalculate 4 Diverse Road Circuits Strictly Following Right-Hand Traffic
  const circuits = useMemo(() => {
    // Circuit 0: North-South Main Arterial Avenue Loop
    // Driving Southbound on X = -1.45, then returning Northbound on X = +1.45 via perimeter turnarounds
    const c0 = buildTrafficCircuit([
      { x: -1.45, z: -28 },
      { x: -1.45, z: 28 },
      { x: 1.45, z: 28 },
      { x: 1.45, z: -28 },
    ]);

    // Circuit 1: East-West Cross Boulevard Loop
    // Driving Eastbound on Z = 1.45, then Westbound on Z = -1.45
    const c1 = buildTrafficCircuit([
      { x: -28, z: 1.45 },
      { x: 28, z: 1.45 },
      { x: 28, z: -1.45 },
      { x: -28, z: -1.45 },
    ]);

    // Circuit 2: Central District Outer Ring (Right turns clockwise)
    const c2 = buildTrafficCircuit([
      { x: -1.45, z: -26 },
      { x: -1.45, z: 1.45 },
      { x: 26, z: 1.45 },
      { x: 26, z: -1.45 },
      { x: 1.45, z: -1.45 },
      { x: 1.45, z: -26 },
    ]);

    // Circuit 3: Southwest Commercial Loop
    const c3 = buildTrafficCircuit([
      { x: -1.45, z: 2.0 },
      { x: -1.45, z: 26 },
      { x: -26, z: 26 },
      { x: -26, z: -1.45 },
      { x: -2.0, z: -1.45 },
      { x: -1.45, z: -1.0 },
    ]);

    return [c0, c1, c2, c3];
  }, []);

  // 2. Initialize Vehicle Fleet with Diverse Models & Colors
  const vehiclesRef = useRef<ActiveVehicleState[]>([
    // Blue Sport Sedan (Southbound Avenue)
    {
      id: 'v-sedan-1',
      type: 'sedan',
      color: '#2563eb',
      circuitIdx: 0,
      distance: 8.0,
      currentSpeed: 7.2,
      targetSpeed: 7.2,
      steeringAngle: 0,
      wheelRotation: 0,
      isBraking: false,
      isTurningLeft: false,
      isTurningRight: false,
      x: -1.45,
      z: -20,
      heading: 0,
    },
    // Obsidian Black SUV (Northbound Avenue)
    {
      id: 'v-suv-1',
      type: 'suv',
      color: '#18181b',
      circuitIdx: 0,
      distance: 68.0,
      currentSpeed: 6.8,
      targetSpeed: 6.8,
      steeringAngle: 0,
      wheelRotation: 0,
      isBraking: false,
      isTurningLeft: false,
      isTurningRight: false,
      x: 1.45,
      z: 20,
      heading: Math.PI,
    },
    // Metropolitan Yellow Taxi (Eastbound Boulevard)
    {
      id: 'v-taxi-1',
      type: 'taxi',
      color: '#eab308',
      circuitIdx: 1,
      distance: 12.0,
      currentSpeed: 7.5,
      targetSpeed: 7.5,
      steeringAngle: 0,
      wheelRotation: 0,
      isBraking: false,
      isTurningLeft: false,
      isTurningRight: false,
      x: -16,
      z: 1.45,
      heading: Math.PI / 2,
    },
    // City Transit Metro Bus (Westbound Boulevard)
    {
      id: 'v-bus-1',
      type: 'bus',
      color: '#0284c7',
      circuitIdx: 1,
      distance: 64.0,
      currentSpeed: 5.6,
      targetSpeed: 5.6,
      steeringAngle: 0,
      wheelRotation: 0,
      isBraking: false,
      isTurningLeft: false,
      isTurningRight: false,
      x: 18,
      z: -1.45,
      heading: -Math.PI / 2,
    },
    // Express Delivery Van (District Ring)
    {
      id: 'v-van-1',
      type: 'van',
      color: '#f8fafc',
      circuitIdx: 2,
      distance: 30.0,
      currentSpeed: 6.2,
      targetSpeed: 6.2,
      steeringAngle: 0,
      wheelRotation: 0,
      isBraking: false,
      isTurningLeft: false,
      isTurningRight: false,
      x: 10,
      z: 1.45,
      heading: Math.PI / 2,
    },
    // Crimson Sport Motorcycle (Southwest Loop)
    {
      id: 'v-moto-1',
      type: 'motorcycle',
      color: '#ef4444',
      circuitIdx: 3,
      distance: 15.0,
      currentSpeed: 8.5,
      targetSpeed: 8.5,
      steeringAngle: 0,
      wheelRotation: 0,
      isBraking: false,
      isTurningLeft: false,
      isTurningRight: false,
      x: -1.45,
      z: 10,
      heading: 0,
    },
  ]);

  // Group references for Three.js scene graph direct transformations (zero re-render churn)
  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const [, setFrameTick] = React.useState(0);

  // Scratch objects for useFrame
  const sampleScratch = useMemo(
    () => ({ x: 0, z: 0, heading: 0, isCurved: false }),
    []
  );

  // Filter vehicles according to performance tier
  const activeCount = useMemo(() => {
    if (effectiveTier === 'low') return 3;
    if (effectiveTier === 'medium') return 4;
    return vehiclesRef.current.length; // 6 on high
  }, [effectiveTier]);

  useFrame((_, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    const dt = Math.min(delta, 0.08);
    const timeSec = performance.now() * 0.001;
    const signalState = getTrafficSignalState(timeSec);

    const vehicles = vehiclesRef.current;
    const pPos = playerPosRef?.current;

    for (let i = 0; i < activeCount; i++) {
      const v = vehicles[i];
      const circuit = circuits[v.circuitIdx];

      // Default cruising speed
      let desiredSpeed = v.targetSpeed;
      let shouldBrake = false;

      // 1. Traffic Light Stop Line Logic
      const distToCenter = Math.hypot(v.x, v.z);
      const isApproachingIntersection = distToCenter < 12.0 && distToCenter > 3.0;

      if (isApproachingIntersection) {
        const isNS = Math.abs(Math.sin(v.heading)) < 0.7; // Heading predominantly North or South
        const relevantPhase: SignalPhase = isNS
          ? signalState.nsVehiclePhase
          : signalState.ewVehiclePhase;

        if (relevantPhase === 'red' || relevantPhase === 'yellow') {
          // Decelerate smoothly to stop at stop line (distToCenter ≈ 3.4m)
          const brakingDistance = Math.max(0.1, distToCenter - 3.4);
          if (brakingDistance < 8.0) {
            desiredSpeed = Math.min(desiredSpeed, Math.max(0, brakingDistance * 1.2));
            shouldBrake = true;
          }
        }
      }

      // 2. Car-Following Safety Buffer (Prevent bumping the vehicle ahead)
      for (let j = 0; j < activeCount; j++) {
        if (i === j) continue;
        const other = vehicles[j];
        if (other.circuitIdx === v.circuitIdx) {
          let distBetween = other.distance - v.distance;
          if (distBetween < 0) distBetween += circuit.totalLength;

          if (distBetween > 0 && distBetween < 6.8) {
            // Decelerate smoothly behind vehicle ahead
            desiredSpeed = Math.min(desiredSpeed, Math.max(0, other.currentSpeed - 0.5));
            shouldBrake = true;
          }
        }
      }

      // 3. Player Avatar Collision Avoidance (Stop if player stands in lane)
      if (pPos) {
        const toPlayerX = pPos.x - v.x;
        const toPlayerZ = pPos.z - v.z;
        const distToPlayer = Math.hypot(toPlayerX, toPlayerZ);

        if (distToPlayer < 4.2) {
          const moveDirX = Math.sin(v.heading);
          const moveDirZ = Math.cos(v.heading);
          const dot = toPlayerX * moveDirX + toPlayerZ * moveDirZ;
          if (dot > 0.5) {
            // Player is in front of the vehicle
            desiredSpeed = 0;
            shouldBrake = true;
          }
        }
      }

      // 4. Smooth Acceleration / Deceleration Kinematics
      if (v.currentSpeed < desiredSpeed) {
        v.currentSpeed = Math.min(desiredSpeed, v.currentSpeed + dt * 3.5); // Accelerate
      } else if (v.currentSpeed > desiredSpeed) {
        v.currentSpeed = Math.max(desiredSpeed, v.currentSpeed - dt * 6.5); // Brake smoothly
      }

      v.isBraking = shouldBrake || v.currentSpeed < desiredSpeed - 0.4;

      // 5. Advance Distance Along Circuit
      v.distance = (v.distance + v.currentSpeed * dt) % circuit.totalLength;

      // 6. Sample Position & Heading from Circuit
      sampleCircuit(circuit, v.distance, sampleScratch);
      v.x = sampleScratch.x;
      v.z = sampleScratch.z;

      // 7. Calculate Front Wheel Steering Angle & Turn Indicators
      const prevHeading = v.heading;
      let dHeading = sampleScratch.heading - prevHeading;
      while (dHeading < -Math.PI) dHeading += Math.PI * 2;
      while (dHeading > Math.PI) dHeading -= Math.PI * 2;

      v.heading = sampleScratch.heading;

      // Steering angle based on angular change rate
      const targetSteering = Math.max(-0.48, Math.min(0.48, (dHeading / Math.max(dt, 0.001)) * 0.12));
      v.steeringAngle += (targetSteering - v.steeringAngle) * (1 - Math.exp(-12 * dt));

      v.isTurningLeft = v.steeringAngle > 0.06;
      v.isTurningRight = v.steeringAngle < -0.06;

      // 8. Roll Wheels Proportional to Travel Distance
      const tireRadius = v.type === 'bus' ? 0.38 : v.type === 'suv' ? 0.34 : 0.28;
      v.wheelRotation += (v.currentSpeed * dt) / tireRadius;

      // 9. Directly Sync Three.js Group Transforms (Zero React state overhead)
      const grp = groupRefs.current[i];
      if (grp) {
        grp.position.set(v.x, 0.62, v.z);
        grp.rotation.y = v.heading;
      }
    }
  });

  return (
    <group name="RealisticTrafficAI">
      {/* Active Moving Vehicles */}
      {vehiclesRef.current.slice(0, activeCount).map((v, idx) => (
        <group
          key={v.id}
          ref={(el) => {
            groupRefs.current[idx] = el;
          }}
          position={[v.x, 0.62, v.z]}
          rotation={[0, v.heading, 0]}
        >
          <RealisticVehicleModel
            type={v.type}
            color={v.color}
            isNight={isNight}
            isBraking={v.isBraking}
            isTurningLeft={v.isTurningLeft}
            isTurningRight={v.isTurningRight}
            steeringAngle={v.steeringAngle}
            wheelRotation={v.wheelRotation}
          />
        </group>
      ))}

      {/* Realistic Parked Cars in Curbside Parking Bays */}
      <group name="CurbsideParkedVehicles" position={[0, 0.62, 0]}>
        {/* Parked Sedan 1 (Northwest Curbside Parking Bay) */}
        <group position={[-4.2, 0, -16]} rotation={[0, 0, 0]}>
          <RealisticVehicleModel type="sedan" color="#475569" isNight={isNight} />
        </group>
        {/* Parked Hatchback (Southwest Curbside Parking Bay) */}
        <group position={[-4.2, 0, 16]} rotation={[0, 0, 0]}>
          <RealisticVehicleModel type="hatchback" color="#0d9488" isNight={isNight} />
        </group>
        {/* Parked SUV (Northeast Curbside Parking Bay) */}
        <group position={[4.2, 0, -16]} rotation={[0, Math.PI, 0]}>
          <RealisticVehicleModel type="suv" color="#f8fafc" isNight={isNight} />
        </group>
        {/* Parked Taxi (Southeast Curbside Parking Bay) */}
        <group position={[4.2, 0, 16]} rotation={[0, Math.PI, 0]}>
          <RealisticVehicleModel type="taxi" isNight={isNight} />
        </group>
      </group>
    </group>
  );
};

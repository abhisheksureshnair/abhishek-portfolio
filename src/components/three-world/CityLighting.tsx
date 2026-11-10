'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePerformanceQuality } from '../PerformanceControl';

export type TimeOfDay = 'day' | 'night';

interface CityLightingProps {
  castShadows?: boolean;
  timeOfDay?: TimeOfDay;
}

// Module-level static colors and vectors (Zero per-frame allocations)
const _dayAmbColor = new THREE.Color('#ffffff');
const _nightAmbColor = new THREE.Color('#38bdf8');

const _daySkyColor = new THREE.Color('#7dd3fc');
const _nightSkyColor = new THREE.Color('#38bdf8');
const _dayGroundColor = new THREE.Color('#bbf7d0');
const _nightGroundColor = new THREE.Color('#1e1b4b');

const _daySunColor = new THREE.Color('#fffdf2');
const _nightMoonColor = new THREE.Color('#bae6fd');
const _daySunPos = new THREE.Vector3(24, 32, 18);
const _nightMoonPos = new THREE.Vector3(18, 26, 14);

const _dayFillColor = new THREE.Color('#fed7aa');
const _nightFillColor = new THREE.Color('#818cf8');

const _dayRimColor = new THREE.Color('#e0e7ff');
const _nightRimColor = new THREE.Color('#6366f1');

/**
 * Reusable Stylized City Lighting Component with Smooth Day/Night Transitions
 */
export const CityLighting: React.FC<CityLightingProps> = ({
  castShadows = true,
  timeOfDay = 'day',
}) => {
  const { effectiveTier, prefersReducedMotion } = usePerformanceQuality();
  const enableShadows = castShadows && effectiveTier !== 'low';
  const shadowMapSize = effectiveTier === 'high' ? 2048 : 1024;

  const ambientRef = useRef<THREE.AmbientLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  // Transition progress: 0.0 = full Day, 1.0 = full Night
  const progressRef = useRef(timeOfDay === 'night' ? 1.0 : 0.0);

  useFrame((_, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;

    const target = timeOfDay === 'night' ? 1.0 : 0.0;
    const dt = Math.min(delta, 0.1);

    // Only update light intensities, colors and matrices during active transitions (saves CPU/GPU overhead)
    if (Math.abs(progressRef.current - target) > 0.0005) {
      if (prefersReducedMotion) {
        progressRef.current = target;
      } else {
        const damp = 1 - Math.exp(-4.2 * dt);
        progressRef.current += (target - progressRef.current) * damp;
      }

      const t = progressRef.current;

      // 1. Ambient Light interpolation
      if (ambientRef.current) {
        ambientRef.current.intensity = THREE.MathUtils.lerp(0.95, 0.72, t);
        ambientRef.current.color.lerpColors(_dayAmbColor, _nightAmbColor, t);
      }

      // 2. Hemisphere Light interpolation
      if (hemiRef.current) {
        hemiRef.current.intensity = THREE.MathUtils.lerp(0.85, 0.65, t);
        hemiRef.current.color.lerpColors(_daySkyColor, _nightSkyColor, t);
        hemiRef.current.groundColor.lerpColors(_dayGroundColor, _nightGroundColor, t);
      }

      // 3. Primary Key Light (Sun -> Moon)
      if (keyLightRef.current) {
        keyLightRef.current.intensity = THREE.MathUtils.lerp(2.3, 1.35, t);
        keyLightRef.current.color.lerpColors(_daySunColor, _nightMoonColor, t);
        keyLightRef.current.position.lerpVectors(_daySunPos, _nightMoonPos, t);
      }

      // 4. Secondary Fill Light
      if (fillLightRef.current) {
        fillLightRef.current.intensity = THREE.MathUtils.lerp(0.85, 0.65, t);
        fillLightRef.current.color.lerpColors(_dayFillColor, _nightFillColor, t);
      }

      // 5. Tertiary Sky-Bounce Light
      if (rimLightRef.current) {
        rimLightRef.current.intensity = THREE.MathUtils.lerp(0.45, 0.40, t);
        rimLightRef.current.color.lerpColors(_dayRimColor, _nightRimColor, t);
      }

      // 6. Night Accent Center Point Light
      if (pointLightRef.current && effectiveTier !== 'low') {
        const maxIntensity = effectiveTier === 'high' ? 1.6 : 1.1;
        pointLightRef.current.intensity = maxIntensity * Math.max(0, (t - 0.2) / 0.8);
      }
    }
  });

  return (
    <group name="CityLighting">
      {/* 1. Ambient Light */}
      <ambientLight
        ref={ambientRef}
        intensity={timeOfDay === 'night' ? 0.72 : 0.95}
        color={timeOfDay === 'night' ? '#38bdf8' : '#ffffff'}
      />

      {/* 2. Hemisphere Light */}
      <hemisphereLight
        ref={hemiRef}
        args={[
          timeOfDay === 'night' ? '#38bdf8' : '#7dd3fc',
          timeOfDay === 'night' ? '#1e1b4b' : '#bbf7d0',
          timeOfDay === 'night' ? 0.65 : 0.85,
        ]}
      />

      {/* 3. Primary Key Light */}
      <directionalLight
        ref={keyLightRef}
        position={timeOfDay === 'night' ? [18, 26, 14] : [24, 32, 18]}
        intensity={timeOfDay === 'night' ? 1.35 : 2.3}
        color={timeOfDay === 'night' ? '#bae6fd' : '#fffdf2'}
        castShadow={enableShadows}
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
        shadow-camera-near={1}
        shadow-camera-far={95}
        shadow-camera-left={-38}
        shadow-camera-right={38}
        shadow-camera-top={38}
        shadow-camera-bottom={-38}
        shadow-bias={-0.00015}
        shadow-normalBias={0.02}
      />

      {/* 4. Secondary Warm Fill Light */}
      <directionalLight
        ref={fillLightRef}
        position={[-22, 18, -18]}
        intensity={timeOfDay === 'night' ? 0.65 : 0.85}
        color={timeOfDay === 'night' ? '#818cf8' : '#fed7aa'}
        castShadow={false}
      />

      {/* 5. Tertiary Sky-Bounce Light */}
      <directionalLight
        ref={rimLightRef}
        position={[-10, 22, 22]}
        intensity={timeOfDay === 'night' ? 0.4 : 0.45}
        color={timeOfDay === 'night' ? '#6366f1' : '#e0e7ff'}
        castShadow={false}
      />

      {/* 6. Night Accent Glow */}
      {effectiveTier !== 'low' && (
        <pointLight
          ref={pointLightRef}
          position={[0, 6, 0]}
          intensity={timeOfDay === 'night' ? (effectiveTier === 'high' ? 1.6 : 1.1) : 0}
          distance={42}
          color="#38bdf8"
        />
      )}
    </group>
  );
};

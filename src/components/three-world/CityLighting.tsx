'use client';

import React from 'react';
import * as THREE from 'three';
import { usePerformanceQuality } from '../PerformanceControl';

export type TimeOfDay = 'day' | 'night';

interface CityLightingProps {
  castShadows?: boolean;
  timeOfDay?: TimeOfDay;
}

/**
 * Reusable Stylized City Lighting Component
 * Supports both vibrant diorama daylight and dramatic cyberpunk night lighting:
 * - Day Mode: Warm sun key light, bright sky/grass hemisphere, soft fill
 * - Night Mode: Cool moon directional light, deep indigo/cyan ambient, illuminated neon highlights
 * - Responsive shadow map resolution based on GPU performance tier
 */
export const CityLighting: React.FC<CityLightingProps> = ({
  castShadows = true,
  timeOfDay = 'day',
}) => {
  const { effectiveTier } = usePerformanceQuality();
  const enableShadows = castShadows && effectiveTier !== 'low';
  const shadowMapSize = effectiveTier === 'high' ? 2048 : 1024;
  const isNight = timeOfDay === 'night';

  return (
    <group name="CityLighting">
      {/* 1. Ambient Light - Clean base illumination */}
      <ambientLight
        intensity={isNight ? 0.38 : 0.65}
        color={isNight ? '#312e81' : '#ffffff'}
      />

      {/* 2. Hemisphere Light - Sky dome with ground bounce */}
      <hemisphereLight
        args={[
          isNight ? '#4338ca' : '#bae6fd', // Sky color
          isNight ? '#064e3b' : '#86efac', // Ground bounce color
          isNight ? 0.45 : 0.55,           // Intensity
        ]}
      />

      {/* 3. Primary Key Light (Sun in Day, Moon at Night) */}
      <directionalLight
        position={isNight ? [18, 24, 14] : [22, 28, 16]}
        intensity={isNight ? 0.75 : 1.6}
        color={isNight ? '#93c5fd' : '#fffbf0'}
        castShadow={enableShadows}
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
        shadow-camera-near={1}
        shadow-camera-far={90}
        shadow-camera-left={-36}
        shadow-camera-right={36}
        shadow-camera-top={36}
        shadow-camera-bottom={-36}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
      />

      {/* 4. Secondary Soft Fill Light */}
      <directionalLight
        position={[-18, 14, -16]}
        intensity={isNight ? 0.35 : 0.4}
        color={isNight ? '#c084fc' : '#c7d2fe'}
        castShadow={false}
      />

      {/* 5. Night Accent Ambient Glow (Soft cyan city center bounce) */}
      {isNight && (
        <pointLight
          position={[0, 6, 0]}
          intensity={1.8}
          distance={35}
          color="#38bdf8"
        />
      )}
    </group>
  );
};

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useWorldStore } from '../stores/worldStore';
import { applyDaylightEnvironment } from './DaylightEnvironment';

/**
 * Natural American City Daylight & Directional Lighting Suite
 * - Balanced sunlight illuminating south-facing building facades directly
 * - Soft PCF contact shadows under window sills, canopies, and cornices
 * - Rich hemisphere skylight and ambient ground bounce
 * - Full PBR image-based lighting (IBL) via procedural daylight environment map
 */
export const WorldLighting: React.FC = () => {
  const { gl, scene } = useThree();
  const timeOfDay = useWorldStore((s) => s.timeOfDay);
  const sunLightRef = useRef<THREE.DirectionalLight>(null);

  // Apply procedural daylight environment map to the scene
  useEffect(() => {
    applyDaylightEnvironment(gl, scene);
  }, [gl, scene]);

  // Sun parameters calibrated for balanced daytime illumination
  // Positioned in the South sky (+Z) so it directly strikes the front building facades!
  const sunColor =
    timeOfDay === 'day'
      ? '#fffbeb' // Natural warm white daylight (approx 5500K)
      : timeOfDay === 'sunset'
      ? '#fb923c' // Golden hour amber
      : '#93c5fd'; // Clear moonlight

  const sunIntensity =
    timeOfDay === 'day' ? 2.4 : timeOfDay === 'sunset' ? 1.6 : 0.45;

  const sunPosition: [number, number, number] =
    timeOfDay === 'day'
      ? [-40, 85, 60] // South-Southwest high sun directly illuminating front facades
      : timeOfDay === 'sunset'
      ? [-100, 18, 40]
      : [45, 65, 45];

  const hemiSkyColor =
    timeOfDay === 'day'
      ? '#7dd3fc' // Vibrant daylight sky blue fill
      : timeOfDay === 'sunset'
      ? '#fed7aa'
      : '#334155';

  const hemiGroundColor =
    timeOfDay === 'day'
      ? '#64748b' // Warm urban stone / pavement bounce fill (never pitch black!)
      : timeOfDay === 'sunset'
      ? '#292524'
      : '#0f172a';

  const hemiIntensity =
    timeOfDay === 'day' ? 1.15 : timeOfDay === 'sunset' ? 0.75 : 0.35;

  return (
    <group name="WorldLighting">
      {/* 1. Realistic Directional Sunlight with Soft PCF Shadows */}
      <directionalLight
        ref={sunLightRef}
        color={sunColor}
        intensity={sunIntensity}
        position={sunPosition}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={260}
        shadow-camera-left={-95}
        shadow-camera-right={95}
        shadow-camera-top={95}
        shadow-camera-bottom={-95}
        shadow-bias={-0.00015}
        shadow-normalBias={0.02}
      />

      {/* 2. Natural Hemisphere Sky/Ground Ambient Bounce Light */}
      <hemisphereLight
        args={[hemiSkyColor, hemiGroundColor, hemiIntensity]}
        position={[0, 80, 0]}
      />

      {/* 3. Balanced Ambient Light for Shadow Fill */}
      <ambientLight
        color={timeOfDay === 'day' ? '#f8fafc' : '#1e293b'}
        intensity={timeOfDay === 'day' ? 0.42 : 0.15}
      />
    </group>
  );
};

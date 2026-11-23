import React from 'react';
import { Sky } from '@react-three/drei';
import { useWorldStore } from '../stores/worldStore';

/**
 * Natural American City Sky & Continuous Atmospheric Horizon
 * Eliminates the abrupt black horizon cut by seamlessly blending the terrain
 * and sky with a natural atmospheric haze gradient ring.
 */
export const WorldSky: React.FC = () => {
  const timeOfDay = useWorldStore((s) => s.timeOfDay);

  const sunPosition: [number, number, number] =
    timeOfDay === 'day'
      ? [-40, 85, 60] // Matching WorldLighting daylight sun
      : timeOfDay === 'sunset'
      ? [-100, 18, 40]
      : [-30, -60, -30];

  // Natural atmospheric haze tones matching the clear daylight sky horizon
  const fogColor =
    timeOfDay === 'day'
      ? '#a8c5dd' // Clean atmospheric daylight blue-grey
      : timeOfDay === 'sunset'
      ? '#c27848' // Warm amber sunset haze
      : '#0a0f1d'; // Deep midnight blue

  // Fog starts at 650m to ensure the entire island and waterfront stay crisp and clear,
  // while distant open ocean smoothly dissolves into the atmospheric horizon
  const fogNear = timeOfDay === 'day' ? 650 : timeOfDay === 'sunset' ? 550 : 400;
  const fogFar = timeOfDay === 'day' ? 4200 : timeOfDay === 'sunset' ? 3600 : 2800;

  return (
    <>
      <color attach="background" args={[fogColor]} />
      {/* Subtle atmospheric perspective for distant ocean horizon */}
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />

      {/* Physical Rayleigh-Scattering Sky Dome */}
      <Sky
        distance={450000}
        sunPosition={sunPosition}
        turbidity={timeOfDay === 'sunset' ? 8.0 : 2.6} // Low turbidity = clear, brilliant sky
        rayleigh={timeOfDay === 'sunset' ? 3.0 : 1.2}  // Natural daylight blue
        mieCoefficient={0.0025}
        mieDirectionalG={0.88}
      />
    </>
  );
};

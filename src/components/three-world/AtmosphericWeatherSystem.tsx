'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { usePerformanceQuality } from '../PerformanceControl';

export type TimeOfDay = 'day' | 'sunset' | 'night';
export type WeatherType = 'clear' | 'rain' | 'fog';

interface AtmosphericWeatherSystemProps {
  timeOfDay?: TimeOfDay;
  weather?: WeatherType;
  castShadows?: boolean;
}

// Module-level static colors to eliminate per-frame allocations
const _daySky = new THREE.Color('#7dd3fc');
const _sunsetSky = new THREE.Color('#fdba74');
const _nightSky = new THREE.Color('#0c1938');

const _dayFog = new THREE.Color('#bae6fd');
const _sunsetFog = new THREE.Color('#fed7aa');
const _nightFog = new THREE.Color('#0b1933');
const _rainFog = new THREE.Color('#475569');

const _daySun = new THREE.Color('#fffef0');
const _sunsetSun = new THREE.Color('#ff8c42');
const _nightMoon = new THREE.Color('#93c5fd');

const _daySunPos = new THREE.Vector3(30, 45, 25);
const _sunsetSunPos = new THREE.Vector3(50, 12, 10);
const _nightMoonPos = new THREE.Vector3(-20, 35, -20);

export const AtmosphericWeatherSystem: React.FC<AtmosphericWeatherSystemProps> = ({
  timeOfDay = 'day',
  weather = 'clear',
  castShadows = true,
}) => {
  const { gl, scene } = useThree();
  const { effectiveTier } = usePerformanceQuality();
  const enableShadows = castShadows && effectiveTier !== 'low';

  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const rainPointsRef = useRef<THREE.Points>(null);

  // Transition smoothing progress (0.0: day, 0.5: sunset, 1.0: night)
  const timeProgressRef = useRef(timeOfDay === 'night' ? 1.0 : timeOfDay === 'sunset' ? 0.5 : 0.0);

  // Rain particle system (2000 rain streaks in a 80x50x80 box)
  const rainGeo = useMemo(() => {
    if (weather !== 'rain') return null;
    const count = effectiveTier === 'low' ? 700 : 2000;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = Math.random() * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      velocities[i] = 28 + Math.random() * 15;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));
    return geo;
  }, [weather, effectiveTier]);

  // Rain material
  const rainMat = useMemo(() => {
    return new THREE.PointsMaterial({
      color: '#cbd5e1',
      size: 0.28,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame((_, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    const dt = Math.min(delta, 0.1);

    // 1. Smoothly interpolate time of day parameters
    const targetProgress = timeOfDay === 'night' ? 1.0 : timeOfDay === 'sunset' ? 0.5 : 0.0;
    timeProgressRef.current += (targetProgress - timeProgressRef.current) * (1 - Math.exp(-4.5 * dt));
    const t = timeProgressRef.current;

    // Calculate dynamic sun/moon position
    const currentSunPos = new THREE.Vector3();
    if (t < 0.5) {
      // Day to Sunset
      const localT = t * 2.0;
      currentSunPos.lerpVectors(_daySunPos, _sunsetSunPos, localT);
    } else {
      // Sunset to Night
      const localT = (t - 0.5) * 2.0;
      currentSunPos.lerpVectors(_sunsetSunPos, _nightMoonPos, localT);
    }

    if (dirLightRef.current) {
      dirLightRef.current.position.copy(currentSunPos);
      if (t < 0.5) {
        dirLightRef.current.color.lerpColors(_daySun, _sunsetSun, t * 2.0);
        dirLightRef.current.intensity = THREE.MathUtils.lerp(1.9, 1.4, t * 2.0);
      } else {
        dirLightRef.current.color.lerpColors(_sunsetSun, _nightMoon, (t - 0.5) * 2.0);
        dirLightRef.current.intensity = THREE.MathUtils.lerp(1.4, 0.45, (t - 0.5) * 2.0);
      }
    }

    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(0.65, 0.2, t);
    }

    // 2. Scene Fog & Background
    if (scene.background && (scene.background as THREE.Color).isColor) {
      const bg = scene.background as THREE.Color;
      if (weather === 'rain') {
        bg.lerp(_rainFog, 0.05);
      } else if (t < 0.5) {
        bg.lerpColors(_daySky, _sunsetSky, t * 2.0);
      } else {
        bg.lerpColors(_sunsetSky, _nightSky, (t - 0.5) * 2.0);
      }
    }

    if (scene.fog && (scene.fog as THREE.Fog).isFog) {
      const fog = scene.fog as THREE.Fog;
      if (weather === 'fog') {
        fog.near = 15;
        fog.far = 65;
        fog.color.lerp(new THREE.Color('#94a3b8'), 0.05);
      } else if (weather === 'rain') {
        fog.near = 25;
        fog.far = 90;
        fog.color.lerp(_rainFog, 0.05);
      } else {
        fog.near = 40;
        fog.far = 140;
        if (t < 0.5) {
          fog.color.lerpColors(_dayFog, _sunsetFog, t * 2.0);
        } else {
          fog.color.lerpColors(_sunsetFog, _nightFog, (t - 0.5) * 2.0);
        }
      }
    }

    // 3. Animate Rain Particles
    if (weather === 'rain' && rainPointsRef.current && rainGeo) {
      const posAttr = rainGeo.getAttribute('position') as THREE.BufferAttribute;
      const velAttr = rainGeo.getAttribute('velocity') as THREE.BufferAttribute;
      const pos = posAttr.array as Float32Array;
      const vel = velAttr.array as Float32Array;

      for (let i = 0; i < vel.length; i++) {
        pos[i * 3 + 1] -= vel[i] * dt;
        // Reset above when hitting ground
        if (pos[i * 3 + 1] < 0) {
          pos[i * 3 + 1] = 50;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Dynamic Directional Sunlight / Moonlight */}
      <directionalLight
        ref={dirLightRef}
        position={[30, 45, 25]}
        castShadow={enableShadows}
        shadow-mapSize-width={effectiveTier === 'high' ? 2048 : 1024}
        shadow-mapSize-height={effectiveTier === 'high' ? 2048 : 1024}
        shadow-camera-near={0.5}
        shadow-camera-far={180}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        shadow-bias={-0.0004}
      />

      {/* Atmospheric Hemisphere Light (Sky & Ground bounce) */}
      <hemisphereLight
        ref={hemiLightRef}
        args={['#bae6fd', '#334155', 0.6]}
      />

      {/* Ambient Fill Light */}
      <ambientLight ref={ambientLightRef} intensity={0.5} />

      {/* Rain Particle Engine */}
      {weather === 'rain' && rainGeo && (
        <points ref={rainPointsRef} geometry={rainGeo} material={rainMat} />
      )}
    </group>
  );
};


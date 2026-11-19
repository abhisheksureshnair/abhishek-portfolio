'use client';

import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  getEarthAlbedoTexture,
  getEarthSpecularTexture,
  getEarthNightLightsTexture,
  getEarthCloudsTexture,
} from './earthTextures';
import { createAtmosphereMaterial } from './AtmosphereShader';
import { usePerformanceQuality } from '../PerformanceControl';

export interface EarthLocation {
  id: string;
  name: string;
  country: string;
  tagline: string;
  lat: number;
  lon: number;
  isPortfolioCity?: boolean;
}

export const EARTH_LOCATIONS: EarthLocation[] = [
  {
    id: 'portfolio-metropolis',
    name: 'Tech Metropolis',
    country: 'Global HQ',
    tagline: 'Abhishek S Nair // Full 3D Interactive World',
    lat: 15.0,
    lon: 75.0,
    isPortfolioCity: true,
  },
  {
    id: 'san-francisco',
    name: 'San Francisco',
    country: 'United States',
    tagline: 'Silicon Valley // AI & Cloud Infrastructure',
    lat: 37.77,
    lon: -122.42,
  },
  {
    id: 'new-york',
    name: 'New York',
    country: 'United States',
    tagline: 'FinTech // High-Frequency Telemetry',
    lat: 40.71,
    lon: -74.0,
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    tagline: 'European Core // Enterprise Systems',
    lat: 51.5,
    lon: -0.12,
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    tagline: 'Future Tech // Real-time Robotics',
    lat: 35.67,
    lon: 139.65,
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    country: 'India',
    tagline: 'Silicon Valley of India // Innovation Hub',
    lat: 12.97,
    lon: 77.59,
  },
];

export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

interface RealisticEarthProps {
  radius?: number;
  sunPosition?: THREE.Vector3;
  onSelectLocation?: (location: EarthLocation) => void;
  selectedLocationId?: string | null;
  isZooming?: boolean;
  autoRotate?: boolean;
}

export const RealisticEarth: React.FC<RealisticEarthProps> = ({
  radius = 24,
  sunPosition = new THREE.Vector3(60, 20, 50),
  onSelectLocation,
  selectedLocationId,
  isZooming = false,
  autoRotate = true,
}) => {
  const { effectiveTier } = usePerformanceQuality();
  const earthGroupRef = useRef<THREE.Group>(null);
  const earthMeshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  // High-Resolution Procedural Textures
  const albedoMap = useMemo(() => getEarthAlbedoTexture(), []);
  const specularMap = useMemo(() => getEarthSpecularTexture(), []);
  const nightLightsMap = useMemo(() => getEarthNightLightsTexture(), []);
  const cloudsMap = useMemo(() => getEarthCloudsTexture(), []);

  // Custom Day/Night Earth Surface Material Shader
  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uDayTexture: { value: albedoMap },
        uNightTexture: { value: nightLightsMap },
        uSpecularTexture: { value: specularMap },
        uSunDirection: { value: sunPosition.clone().normalize() },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uDayTexture;
        uniform sampler2D uNightTexture;
        uniform sampler2D uSpecularTexture;
        uniform vec3 uSunDirection;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 sunDir = normalize(uSunDirection);

          // Sunlight incidence factor: >0 is day, <0 is night
          float sunDot = dot(normal, sunDir);
          
          // Smooth day/night twilight transition zone
          float dayFactor = smoothstep(-0.15, 0.25, sunDot);
          float nightFactor = 1.0 - dayFactor;

          // Day surface albedo and night city lights
          vec4 dayColor = texture2D(uDayTexture, vUv);
          vec4 nightColor = texture2D(uNightTexture, vUv);
          vec4 specColor = texture2D(uSpecularTexture, vUv);

          // Specular glint on daylight ocean water
          vec3 viewDir = normalize(cameraPosition - vPosition);
          vec3 halfDir = normalize(sunDir + viewDir);
          float specAngle = max(0.0, dot(normal, halfDir));
          float specular = pow(specAngle, 45.0) * specColor.r * 1.5;

          // Realistic atmospheric diffuse wrap
          vec3 litDay = dayColor.rgb * (max(0.05, sunDot * 0.95 + 0.1)) + vec3(specular * 0.9, specular * 0.95, specular);
          vec3 litNight = nightColor.rgb * 1.7; // Boost city luminescence

          vec3 finalColor = mix(litNight, litDay, dayFactor);

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, [albedoMap, nightLightsMap, specularMap, sunPosition]);

  // Atmosphere Glow Shader Material
  const atmosphereMaterial = useMemo(() => {
    const mat = createAtmosphereMaterial('#38bdf8');
    mat.uniforms.uSunPosition.value.copy(sunPosition);
    return mat;
  }, [sunPosition]);

  // Frame animation loop
  useFrame((_, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;
    const dt = Math.min(delta, 0.1);

    // Keep shader sun direction uniform in sync
    earthMaterial.uniforms.uSunDirection.value.copy(sunPosition).normalize();
    atmosphereMaterial.uniforms.uSunPosition.value.copy(sunPosition);

    // Smooth Earth planetary axial rotation when not zooming into a city
    if (autoRotate && !isZooming && earthGroupRef.current) {
      earthGroupRef.current.rotation.y += dt * 0.035;
    }

    // Clouds rotate independently with differential orbital wind
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += dt * 0.05;
    }
  });

  // Calculate Cartesian positions for markers
  const locationMarkers = useMemo(() => {
    return EARTH_LOCATIONS.map((loc) => {
      const pos = latLonToVector3(loc.lat, loc.lon, radius + 0.18);
      const normal = pos.clone().normalize();
      return { ...loc, position: pos, normal };
    });
  }, [radius]);

  // High-Density Realistic Starfield Points (3D Cosmos)
  const starfieldGeo = useMemo(() => {
    const count = effectiveTier === 'low' ? 800 : 2500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const dist = 280 + Math.random() * 80;

      positions[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = dist * Math.cos(phi);

      // Star temperature color variation (blue, white, amber)
      const t = Math.random();
      if (t < 0.6) {
        colors[i * 3] = 0.9;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 1.0;
      } else if (t < 0.85) {
        colors[i * 3] = 0.6;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 1.0;
      } else {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 0.6;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [effectiveTier]);

  return (
    <group>
      {/* 1. Deep Space Cosmic Starfield */}
      <points geometry={starfieldGeo}>
        <pointsMaterial
          size={1.6}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.88}
        />
      </points>

      {/* 2. Earth Group (Rotates along geographical axis) */}
      <group ref={earthGroupRef}>
        {/* Core Earth Surface Sphere */}
        <mesh ref={earthMeshRef} material={earthMaterial}>
          <sphereGeometry args={[radius, 64, 64]} />
        </mesh>

        {/* Dynamic Cloud Sphere */}
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[radius * 1.016, 48, 48]} />
          <meshStandardMaterial
            map={cloudsMap}
            transparent
            opacity={0.72}
            blending={THREE.NormalBlending}
            roughness={1}
            metalness={0}
            depthWrite={false}
          />
        </mesh>

        {/* 3. Interactive City Location Beacons */}
        {locationMarkers.map((loc) => {
          const isHovered = hoveredLocation === loc.id;
          const isSelected = selectedLocationId === loc.id;
          const isHQ = loc.isPortfolioCity;

          return (
            <group
              key={loc.id}
              position={loc.position}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredLocation(loc.id);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredLocation(null);
                document.body.style.cursor = 'auto';
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectLocation) onSelectLocation(loc);
              }}
            >
              {/* Pulsing Base Ring */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.35, 0.55, 32]} />
                <meshBasicMaterial
                  color={isHQ ? '#38bdf8' : isSelected ? '#a855f7' : '#22d3ee'}
                  side={THREE.DoubleSide}
                  transparent
                  opacity={isHovered ? 0.95 : 0.75}
                />
              </mesh>

              {/* Vertical Laser Beacon Beam */}
              <mesh position={[0, 0.75, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 1.5, 8]} />
                <meshBasicMaterial
                  color={isHQ ? '#60a5fa' : '#38bdf8'}
                  transparent
                  opacity={0.8}
                />
              </mesh>

              {/* Glowing Landmark Orb */}
              <mesh position={[0, 1.5, 0]}>
                <sphereGeometry args={[isHovered ? 0.35 : 0.24, 16, 16]} />
                <meshBasicMaterial
                  color={isHQ ? '#38bdf8' : isSelected ? '#c084fc' : '#67e8f9'}
                />
              </mesh>

              {/* Holographic 3D HTML Tooltip */}
              <Html
                position={[0, 2.0, 0]}
                center
                distanceFactor={50}
                style={{
                  pointerEvents: 'none',
                  transition: 'all 0.2s ease',
                  opacity: isHovered || isSelected || isHQ ? 1 : 0.75,
                }}
              >
                <div
                  className={`px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-mono whitespace-nowrap transition-all shadow-xl ${
                    isHQ
                      ? 'bg-cyan-950/80 border-cyan-400/80 text-cyan-200 ring-2 ring-cyan-500/30'
                      : 'bg-zinc-950/80 border-white/20 text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full animate-ping ${
                        isHQ ? 'bg-cyan-400' : 'bg-indigo-400'
                      }`}
                    />
                    <span className="font-bold tracking-wider uppercase">{loc.name}</span>
                  </div>
                  {isHovered && (
                    <div className="text-[10px] text-zinc-400 mt-0.5">
                      {loc.tagline} &bull; <span className="text-cyan-400">Click to fly in</span>
                    </div>
                  )}
                </div>
              </Html>
            </group>
          );
        })}
      </group>

      {/* 4. Atmospheric Scattering Glow (Outer Halo) */}
      <mesh material={atmosphereMaterial}>
        <sphereGeometry args={[radius * 1.15, 64, 64]} />
      </mesh>
    </group>
  );
};


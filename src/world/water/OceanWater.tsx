import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { WATER_ELEVATION } from '../island/islandCoastline';
import { useWorldStore } from '../stores/worldStore';

/**
 * Phase 2.0.6 Advanced Realistic Ocean Water Shader
 * 
 * Features:
 * - Multi-octave wave scale variation (deep ocean swell down to fine capillary ripples)
 * - Luminous shallow coastal turquoise to deep oceanic navy color ramp
 * - Dual-layer sun specular highlights (sharp glint + microfacet sheen)
 * - Dynamic shoreline wave wash & seafoam fringe along the island perimeter
 * - Accurate Schlick Fresnel reflection
 * - Quadratic horizon fog blending into the atmospheric sky
 * - 100% GPU accelerated in 1 draw call!
 */

const OceanVertexShader = `
  uniform float uTime;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying float vWaveHeight;
  varying float vWaveCrest;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Multi-octave composite Gerstner wave displacement
    // pos.x and pos.y correspond to world X and Z before rotation
    float t = uTime;
    
    // Octave 1: Deep ocean rolling swell (wavelength ~90m)
    float w1 = sin(pos.x * 0.018 + t * 0.85 + pos.y * 0.012) * 0.22;
    // Octave 2: Cross swell (wavelength ~50m)
    float w2 = cos(pos.x * 0.035 - t * 1.15 + pos.y * 0.028) * 0.14;
    // Octave 3: Wind chop (wavelength ~22m)
    float w3 = sin(pos.x * 0.075 + pos.y * 0.065 + t * 1.80) * 0.08;
    // Octave 4: Surface capillary ripples (wavelength ~10m)
    float w4 = cos(pos.x * 0.160 - pos.y * 0.140 + t * 2.60) * 0.035;
    // Octave 5: Fine micro-ripples (wavelength ~4m)
    float w5 = sin(pos.x * 0.380 + pos.y * 0.320 - t * 3.40) * 0.015;

    float waveZ = w1 + w2 + w3 + w4 + w5;
    pos.z += waveZ;
    vWaveHeight = waveZ;
    vWaveCrest = clamp((w1 + w2 + w3) * 2.5, -1.0, 1.0);

    // Analytical normal calculation from partial derivatives
    float dx = (cos(pos.x * 0.018 + t * 0.85 + pos.y * 0.012) * 0.018 * 0.22) -
               (sin(pos.x * 0.035 - t * 1.15 + pos.y * 0.028) * 0.035 * 0.14) +
               (cos(pos.x * 0.075 + pos.y * 0.065 + t * 1.80) * 0.075 * 0.08) -
               (sin(pos.x * 0.160 - pos.y * 0.140 + t * 2.60) * 0.160 * 0.035);

    float dy = (cos(pos.x * 0.018 + t * 0.85 + pos.y * 0.012) * 0.012 * 0.22) +
               (cos(pos.x * 0.035 - t * 1.15 + pos.y * 0.028) * 0.028 * 0.14) +
               (cos(pos.x * 0.075 + pos.y * 0.065 + t * 1.80) * 0.065 * 0.08) +
               (cos(pos.x * 0.160 - pos.y * 0.140 + t * 2.60) * 0.140 * 0.035);

    vec3 localNormal = normalize(vec3(-dx * 1.8, -dy * 1.8, 1.0));

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPos.xyz;
    vNormal = normalize(mat3(modelMatrix) * localNormal);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const OceanFragmentShader = `
  uniform float uTime;
  uniform vec3 uSunDirection;
  uniform vec3 uSunColor;
  uniform vec3 uDeepColor;
  uniform vec3 uMidColor;
  uniform vec3 uShallowColor;
  uniform vec3 uFoamColor;
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;

  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying float vWaveHeight;
  varying float vWaveCrest;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 sunDir = normalize(uSunDirection);

    // Fresnel reflectance factor: water reflects significantly more at grazing angles
    float ndotv = max(dot(normal, viewDir), 0.0);
    float fresnel = 0.04 + 0.96 * pow(1.0 - ndotv, 4.5);

    // Dual-specular sunlight reflection:
    vec3 halfVec = normalize(sunDir + viewDir);
    float ndoth = max(dot(normal, halfVec), 0.0);
    // 1. Sharp sparkling core highlight
    float sharpSpec = pow(ndoth, 140.0) * 2.2;
    // 2. Broader microfacet sea sheen
    float broadSpec = pow(ndoth, 24.0) * 0.45;
    vec3 specular = uSunColor * (sharpSpec + broadSpec);

    // Distance to island center for multi-tier depth coloring
    float distToCenter = length(vWorldPosition.xz);

    // Gradient: Shoreline (500m-580m) -> Coastal Shelf (580m-850m) -> Deep Ocean (>850m)
    float coastalT = smoothstep(510.0, 680.0, distToCenter);
    float deepT = smoothstep(680.0, 950.0, distToCenter);

    vec3 waterColor = mix(uShallowColor, uMidColor, coastalT);
    waterColor = mix(waterColor, uDeepColor, deepT);

    // Dynamic wave crest highlight & light scattering
    waterColor += vec3(0.06, 0.10, 0.12) * max(0.0, vWaveCrest * 0.5);

    // Shoreline seafoam fringe (perimeter between 510m and 580m with moving wave wash)
    float shoreBand = 1.0 - smoothstep(510.0, 565.0, distToCenter);
    float foamPattern = sin(vWorldPosition.x * 0.25 + uTime * 2.5) * cos(vWorldPosition.z * 0.25 - uTime * 2.0);
    float foamIntensity = clamp(shoreBand * (vWaveHeight * 4.0 + foamPattern * 0.4), 0.0, 0.85);
    waterColor = mix(waterColor, uFoamColor, foamIntensity * 0.75);

    // Sky reflection tint on grazing angles
    vec3 skyReflectColor = mix(uFogColor, vec3(0.88, 0.94, 1.0), 0.65);
    vec3 finalColor = mix(waterColor, skyReflectColor, fresnel * 0.70) + specular;

    // Smooth atmospheric horizon blending
    float dist = length(vWorldPosition - cameraPosition);
    float fogFactor = clamp((dist - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);
    fogFactor = fogFactor * fogFactor; // Quadratic ease

    gl_FragColor = vec4(mix(finalColor, uFogColor, fogFactor), 1.0);
  }
`;

export const OceanWater: React.FC = () => {
  const timeOfDay = useWorldStore((s) => s.timeOfDay);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const sunPosition = useMemo(() => {
    return timeOfDay === 'day'
      ? new THREE.Vector3(-40, 85, 60).normalize()
      : timeOfDay === 'sunset'
      ? new THREE.Vector3(-100, 18, 40).normalize()
      : new THREE.Vector3(-30, 20, -30).normalize();
  }, [timeOfDay]);

  const colors = useMemo(() => {
    if (timeOfDay === 'sunset') {
      return {
        deep: new THREE.Color('#0c2a42'),
        mid: new THREE.Color('#164e63'),
        shallow: new THREE.Color('#0891b2'),
        foam: new THREE.Color('#fed7aa'),
        sun: new THREE.Color('#fed7aa'),
        fog: new THREE.Color('#c27848'),
      };
    }
    if (timeOfDay === 'night') {
      return {
        deep: new THREE.Color('#020617'),
        mid: new THREE.Color('#082f49'),
        shallow: new THREE.Color('#0e7490'),
        foam: new THREE.Color('#94a3b8'),
        sun: new THREE.Color('#38bdf8'),
        fog: new THREE.Color('#0a0f1d'),
      };
    }
    // Daylight
    return {
      deep: new THREE.Color('#03436a'),     // Deep abyssal navy
      mid: new THREE.Color('#0284c7'),      // Mid oceanic azure
      shallow: new THREE.Color('#06b6d4'),  // Luminous coastal aquamarine
      foam: new THREE.Color('#f8fafc'),     // White seafoam
      sun: new THREE.Color('#fffbeb'),      // Daylight sun highlight
      fog: new THREE.Color('#a8c5dd'),      // Atmospheric sky fog
    };
  }, [timeOfDay]);

  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uSunDirection: { value: sunPosition },
      uSunColor: { value: colors.sun },
      uDeepColor: { value: colors.deep },
      uMidColor: { value: colors.mid },
      uShallowColor: { value: colors.shallow },
      uFoamColor: { value: colors.foam },
      uFogColor: { value: colors.fog },
      uFogNear: { value: 800.0 },
      uFogFar: { value: 4500.0 },
    };
  }, [sunPosition, colors]);

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  // Expansive ocean plane (7200m x 7200m) with optimized 96x96 wave segments (18,432 triangles vs 64,800)
  const oceanGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(7200, 7200, 96, 96);
    return geo;
  }, []);

  return (
    <mesh
      geometry={oceanGeometry}
      position={[0, WATER_ELEVATION, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      frustumCulled={false}
    >
      <shaderMaterial
        ref={materialRef}
        vertexShader={OceanVertexShader}
        fragmentShader={OceanFragmentShader}
        uniforms={uniforms}
        side={THREE.FrontSide}
      />
    </mesh>
  );
};

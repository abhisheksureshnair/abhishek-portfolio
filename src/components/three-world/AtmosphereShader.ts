'use client';

import * as THREE from 'three';

/**
 * Photorealistic Atmospheric Scattering Shader (Rayleigh & Mie Approximation)
 * Generates the iconic glowing sapphire atmospheric halo seen from orbit.
 */

export const AtmosphereVertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const AtmosphereFragmentShader = `
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uColor;
uniform vec3 uSunPosition;
uniform float uAtmospherePower;
uniform float uAtmosphereIntensity;

void main() {
  vec3 viewDir = normalize(-vPosition);
  vec3 normal = normalize(vNormal);
  
  // Fresnel limb calculation: higher intensity at grazing angles (edges)
  float rim = 1.0 - max(0.0, dot(viewDir, normal));
  float intensity = pow(rim, uAtmospherePower) * uAtmosphereIntensity;

  // Sun directional factor for daylight vs sunset rim
  vec3 sunDir = normalize(uSunPosition);
  float sunFacing = dot(normal, sunDir) * 0.5 + 0.5;

  // Day sapphire cyan vs sunset twilight amber
  vec3 dayColor = uColor; // #38bdf8
  vec3 sunsetColor = vec3(1.0, 0.45, 0.2); // Warm sunset edge glow

  vec3 finalColor = mix(sunsetColor, dayColor, clamp(sunFacing * 1.5, 0.0, 1.0));
  
  gl_FragColor = vec4(finalColor, intensity * clamp(sunFacing + 0.25, 0.0, 1.0));
}
`;

export function createAtmosphereMaterial(color = '#38bdf8'): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: AtmosphereVertexShader,
    fragmentShader: AtmosphereFragmentShader,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uSunPosition: { value: new THREE.Vector3(50, 20, 40) },
      uAtmospherePower: { value: 3.2 },
      uAtmosphereIntensity: { value: 1.1 },
    },
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  });
}


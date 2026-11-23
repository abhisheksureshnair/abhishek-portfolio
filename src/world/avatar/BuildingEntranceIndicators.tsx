'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LANDMARK_PORTALS } from './pedestrianNavigator';

// Generate lightweight glowing entrance portal ring texture
function getEntrancePortalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 256, 256);

    // Outer subtle glow ring
    ctx.beginPath();
    ctx.arc(128, 128, 115, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Inner dashed accent ring
    ctx.beginPath();
    ctx.setLineDash([8, 8]);
    ctx.arc(128, 128, 95, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Center radial soft fill
    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 115);
    grad.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
    grad.addColorStop(0.6, 'rgba(14, 165, 233, 0.12)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(128, 128, 115, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

// Shared static geometries and materials to eliminate duplicate GC allocations
const _decalPlaneGeo = new THREE.PlaneGeometry(2.5, 2.5);
const _beaconPillarGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8);
const _beaconCapGeo = new THREE.SphereGeometry(0.06, 8, 8);
const _beaconPillarMat = new THREE.MeshStandardMaterial({ color: '#1e293b', metalness: 0.9, roughness: 0.2 });
const _beaconCapMat = new THREE.MeshBasicMaterial({ color: '#38bdf8' });

export const BuildingEntranceIndicators: React.FC = () => {
  const portalTex = useMemo(() => {
    if (typeof document === 'undefined') return null;
    return getEntrancePortalTexture();
  }, []);

  const materialsRef = useRef<THREE.MeshBasicMaterial[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const pulseOpacity = 0.55 + Math.sin(t * 2.5) * 0.2;
    const mats = materialsRef.current;
    for (let i = 0; i < mats.length; i++) {
      const mat = mats[i];
      if (mat) mat.opacity = pulseOpacity;
    }
  });

  if (!portalTex) return null;

  return (
    <group name="building-entrance-indicators">
      {LANDMARK_PORTALS.map((portal, idx) => (
        <group key={portal.id} position={[portal.portalX, 0.025, portal.portalZ]}>
          {/* Subtle Ground-level Glowing Interaction Decal Ring */}
          <mesh geometry={_decalPlaneGeo} rotation={[-Math.PI / 2, 0, 0]}>
            <meshBasicMaterial
              ref={(el) => {
                if (el) materialsRef.current[idx] = el;
              }}
              map={portalTex}
              transparent
              opacity={0.65}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Dual Sleek Architectural Entrance Beacon Accents (Shared Meshes) */}
          <mesh geometry={_beaconPillarGeo} material={_beaconPillarMat} position={[-1.1, 0.35, 0]} />
          <mesh geometry={_beaconCapGeo} material={_beaconCapMat} position={[-1.1, 0.72, 0]} />

          <mesh geometry={_beaconPillarGeo} material={_beaconPillarMat} position={[1.1, 0.35, 0]} />
          <mesh geometry={_beaconCapGeo} material={_beaconCapMat} position={[1.1, 0.72, 0]} />
        </group>
      ))}
    </group>
  );
};

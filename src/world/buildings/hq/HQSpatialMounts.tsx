'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

export type HQSpatialSlotId =
  | 'introduction'
  | 'experience'
  | 'technology'
  | 'development_focus'
  | 'portfolio_navigation';

export interface HQSpatialPanelSlot {
  id: HQSpatialSlotId;
  label: string;
  position: [number, number, number];
  rotationY: number;
  accentColor: string;
}

/**
 * Spatial panel anchor positions arranged in a comfortable eye-level semicircle
 * (~3.35m radius) around the Flagship HQ central platform at [0, 0.28, 3.8].
 */
export const HQ_SPATIAL_PANEL_SLOTS: HQSpatialPanelSlot[] = [
  {
    id: 'introduction',
    label: 'INTRODUCTION',
    position: [0, 0.24, 0.45],
    rotationY: 0,
    accentColor: '#38bdf8',
  },
  {
    id: 'experience',
    label: 'EXPERIENCE',
    position: [-2.35, 0.22, 1.35],
    rotationY: Math.PI * 0.22,
    accentColor: '#60a5fa',
  },
  {
    id: 'technology',
    label: 'SKILLS & TECHNOLOGIES',
    position: [2.35, 0.22, 1.35],
    rotationY: -Math.PI * 0.22,
    accentColor: '#22d3ee',
  },
  {
    id: 'development_focus',
    label: 'PROJECTS',
    position: [-3.35, 0.22, 3.45],
    rotationY: Math.PI * 0.44,
    accentColor: '#38bdf8',
  },
  {
    id: 'portfolio_navigation',
    label: 'CONTACT & NAVIGATION',
    position: [3.35, 0.22, 3.45],
    rotationY: -Math.PI * 0.44,
    accentColor: '#60a5fa',
  },
];

// Shared lightweight geometries for all 5 spatial panel mounts
const _baseGeo = new THREE.CylinderGeometry(0.42, 0.5, 0.12, 16);
const _ringGeo = new THREE.RingGeometry(0.46, 0.52, 24);
const _stemGeo = new THREE.BoxGeometry(0.08, 1.35, 0.08);
const _frameGeo = new THREE.BoxGeometry(1.7, 1.05, 0.04);

interface HQSpatialMountsProps {
  slots?: HQSpatialPanelSlot[];
}

export const HQSpatialMounts: React.FC<HQSpatialMountsProps> = ({
  slots = HQ_SPATIAL_PANEL_SLOTS,
}) => {
  const materials = useMemo(() => {
    return {
      pedestal: new THREE.MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.35,
        metalness: 0.75,
      }),
      frame: new THREE.MeshStandardMaterial({
        color: '#0b1220',
        roughness: 0.28,
        metalness: 0.65,
      }),
      cyanGlow: new THREE.MeshBasicMaterial({
        color: '#38bdf8',
        transparent: true,
        opacity: 0.55,
      }),
      blueGlow: new THREE.MeshBasicMaterial({
        color: '#60a5fa',
        transparent: true,
        opacity: 0.45,
      }),
    };
  }, []);

  return (
    <group name="hq_spatial_panel_mounts">
      {slots.map((slot) => {
        const glowMat =
          slot.accentColor === '#60a5fa' ? materials.blueGlow : materials.cyanGlow;
        return (
          <group
            key={slot.id}
            name={`spatial-mount-${slot.id}`}
            position={slot.position}
            rotation={[0, slot.rotationY, 0]}
          >
            {/* Floor Anchor Pedestal */}
            <mesh position={[0, 0.06, 0]} geometry={_baseGeo} material={materials.pedestal} />
            <mesh
              position={[0, 0.008, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              geometry={_ringGeo}
              material={glowMat}
            />
            {/* Support Stem */}
            <mesh position={[0, 0.78, -0.06]} geometry={_stemGeo} material={materials.pedestal} />
            {/* Reserved Spatial Panel Backing Frame (Eye-level ~1.75m) */}
            <mesh position={[0, 1.62, 0]} geometry={_frameGeo} material={materials.frame} />
            {/* Top & Bottom Subtle Cyan Accent Bars */}
            <mesh position={[0, 2.16, 0.025]}>
              <boxGeometry args={[1.66, 0.025, 0.015]} />
              <primitive object={glowMat} attach="material" />
            </mesh>
            <mesh position={[0, 1.08, 0.025]}>
              <boxGeometry args={[1.66, 0.025, 0.015]} />
              <primitive object={glowMat} attach="material" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

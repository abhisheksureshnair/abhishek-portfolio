'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getProceduralSidewalkTexture } from './proceduralTextures';

export interface SidewalkProps {
  position: [number, number, number];
  width: number;
  length: number;
  orientation?: 'z' | 'x';
  curbSide?: 'left' | 'right' | 'both' | 'none';
  receiveShadow?: boolean;
}

let _sharedSidewalkMat: THREE.MeshStandardMaterial | null = null;
function getSharedSidewalkMaterial(): THREE.MeshStandardMaterial {
  if (!_sharedSidewalkMat) {
    const tex = getProceduralSidewalkTexture();
    _sharedSidewalkMat = new THREE.MeshStandardMaterial({
      map: tex,
      color: '#f8fafc',
      roughness: 0.5,
      metalness: 0.05,
    });
  }
  return _sharedSidewalkMat;
}

const _curbMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.55, metalness: 0.08 });

export const Sidewalk: React.FC<SidewalkProps> = ({
  position,
  width,
  length,
  orientation = 'z',
  curbSide = 'none',
  receiveShadow = true,
}) => {
  const sidewalkMat = useMemo(() => getSharedSidewalkMaterial(), []);

  const isXAxis = orientation === 'x';
  const rotationY = isXAxis ? Math.PI / 2 : 0;

  const curbHeight = 0.10;
  const sidewalkTopY = 0.72;
  const halfWidth = width / 2;

  const slabGeo = useMemo(() => new THREE.BoxGeometry(width, curbHeight, length), [width, curbHeight, length]);
  const curbGeo = useMemo(() => new THREE.BoxGeometry(0.08, curbHeight + 0.005, length), [curbHeight, length]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 1. Main Raised Sidewalk Slab */}
      <mesh
        position={[0, sidewalkTopY - curbHeight / 2, 0]}
        receiveShadow={receiveShadow}
        geometry={slabGeo}
        material={sidewalkMat}
      />

      {/* 2. Curb Stone Edge - Left */}
      {(curbSide === 'left' || curbSide === 'both') && (
        <mesh
          position={[-halfWidth + 0.04, sidewalkTopY - curbHeight / 2, 0]}
          geometry={curbGeo}
          material={_curbMat}
        />
      )}

      {/* 3. Curb Stone Edge - Right */}
      {(curbSide === 'right' || curbSide === 'both') && (
        <mesh
          position={[halfWidth - 0.04, sidewalkTopY - curbHeight / 2, 0]}
          geometry={curbGeo}
          material={_curbMat}
        />
      )}
    </group>
  );
};

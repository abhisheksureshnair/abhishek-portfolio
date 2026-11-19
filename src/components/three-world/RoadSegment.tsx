'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { getProceduralAsphaltTexture } from './proceduralTextures';

export interface RoadSegmentProps {
  position: [number, number, number];
  width: number;
  length: number;
  orientation?: 'z' | 'x'; // 'z' = North-South, 'x' = East-West
  hasCenterLine?: boolean;
  hasEdgeLines?: boolean;
  receiveShadow?: boolean;
}

// Module-level shared static geometries and materials
const _dashGeo = new THREE.PlaneGeometry(0.14, 1.2);
const _markingMat = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  roughness: 0.35,
  metalness: 0.05,
  emissive: '#ffffff',
  emissiveIntensity: 0.15,
  transparent: false,
});
const _edgeLineMat = new THREE.MeshStandardMaterial({
  color: '#f8fafc',
  roughness: 0.4,
  metalness: 0.05,
  emissive: '#f8fafc',
  emissiveIntensity: 0.1,
  transparent: false,
});
const _shoulderMat = new THREE.MeshStandardMaterial({ color: '#242e3b', roughness: 0.85 });

let _sharedAsphaltMat: THREE.MeshStandardMaterial | null = null;
function getSharedAsphaltMaterial(): THREE.MeshStandardMaterial {
  if (!_sharedAsphaltMat) {
    const tex = getProceduralAsphaltTexture();
    _sharedAsphaltMat = new THREE.MeshStandardMaterial({
      map: tex,
      color: '#3b4758',
      roughness: 0.72,
      metalness: 0.06,
    });
  }
  return _sharedAsphaltMat;
}

const _dummy = new THREE.Object3D();

export const RoadSegment: React.FC<RoadSegmentProps> = ({
  position,
  width,
  length,
  orientation = 'z',
  hasCenterLine = true,
  hasEdgeLines = true,
  receiveShadow = true,
}) => {
  const asphaltMat = useMemo(() => getSharedAsphaltMaterial(), []);

  // Calculate dashes along road length
  const dashLength = 1.2;
  const dashGap = 0.9;
  const period = dashLength + dashGap;

  const dashes = useMemo(() => {
    if (!hasCenterLine) return [];
    const count = Math.floor((length - 0.6) / period);
    const start = -((count - 1) * period) / 2;
    const list: number[] = [];
    for (let i = 0; i < count; i++) {
      list.push(start + i * period);
    }
    return list;
  }, [length, period, hasCenterLine]);

  const isXAxis = orientation === 'x';
  const rotationY = isXAxis ? Math.PI / 2 : 0;

  const halfWidth = width / 2;
  const edgeLineOffset = halfWidth - 0.18;

  const roadBedGeo = useMemo(() => new THREE.BoxGeometry(width, 0.04, length), [width, length]);
  const shoulderGeo = useMemo(() => new THREE.BoxGeometry(0.06, 0.03, length), [length]);
  const edgeLineGeo = useMemo(() => new THREE.PlaneGeometry(0.1, length), [length]);

  // Instanced Dashed Center Lines (1 Draw Call instead of N individual meshes)
  const dashesInstancedRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (dashesInstancedRef.current && dashes.length > 0) {
      for (let i = 0; i < dashes.length; i++) {
        _dummy.position.set(0, 0.625, dashes[i]);
        _dummy.rotation.set(-Math.PI / 2, 0, 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        dashesInstancedRef.current.setMatrixAt(i, _dummy.matrix);
      }
      dashesInstancedRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [dashes]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 1. Main Asphalt Bed (top at y = 0.62) */}
      <mesh
        position={[0, 0.62, 0]}
        receiveShadow={receiveShadow}
        geometry={roadBedGeo}
        material={asphaltMat}
      />

      {/* 2. Chamfered Road Shoulder Borders */}
      {[-halfWidth, halfWidth].map((xSide, idx) => (
        <mesh
          key={idx}
          position={[xSide, 0.615, 0]}
          geometry={shoulderGeo}
          material={_shoulderMat}
        />
      ))}

      {/* 3. Solid White Edge Lines (y = 0.625) */}
      {hasEdgeLines &&
        [-edgeLineOffset, edgeLineOffset].map((xOffset, idx) => (
          <mesh
            key={idx}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[xOffset, 0.625, 0]}
            geometry={edgeLineGeo}
            material={_edgeLineMat}
          />
        ))}

      {/* 4. Instanced Dashed White Center Lane Line (1 Draw Call) */}
      {hasCenterLine && dashes.length > 0 && (
        <instancedMesh
          ref={dashesInstancedRef}
          args={[_dashGeo, _markingMat, dashes.length]}
          frustumCulled={false}
        />
      )}
    </group>
  );
};

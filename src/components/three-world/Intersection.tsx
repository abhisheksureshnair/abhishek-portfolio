'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { getProceduralAsphaltTexture } from './proceduralTextures';

export interface IntersectionProps {
  position: [number, number, number];
  sizeX: number;
  sizeZ: number;
  crossings?: {
    north?: boolean;
    south?: boolean;
    east?: boolean;
    west?: boolean;
  };
  receiveShadow?: boolean;
}

// Module-level shared static geometries and materials (Zero GPU re-allocation)
const _nsStripeGeo = new THREE.PlaneGeometry(0.24, 1.3);
const _ewStripeGeo = new THREE.PlaneGeometry(1.3, 0.24);
const _stripeMat = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  roughness: 0.3,
  metalness: 0.05,
  emissive: '#ffffff',
  emissiveIntensity: 0.2,
  transparent: false,
});

const _stopLineMat = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  roughness: 0.35,
  metalness: 0.05,
  emissive: '#ffffff',
  emissiveIntensity: 0.15,
  transparent: false,
});

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

export const Intersection: React.FC<IntersectionProps> = ({
  position,
  sizeX,
  sizeZ,
  crossings = { north: true, south: true, east: true, west: true },
  receiveShadow = true,
}) => {
  const asphaltMat = useMemo(() => getSharedAsphaltMaterial(), []);

  const stripeWidth = 0.24;
  const stripeSpacing = 0.20;
  const stripePeriod = stripeWidth + stripeSpacing;

  // Stripes for North/South crossings (spread across X)
  const nsStripes = useMemo(() => {
    const usableWidth = sizeX - 0.8;
    const count = Math.max(3, Math.floor(usableWidth / stripePeriod));
    const start = -((count - 1) * stripePeriod) / 2;
    const list: number[] = [];
    for (let i = 0; i < count; i++) {
      list.push(start + i * stripePeriod);
    }
    return list;
  }, [sizeX, stripePeriod]);

  // Stripes for East/West crossings (spread across Z)
  const ewStripes = useMemo(() => {
    const usableWidth = sizeZ - 0.8;
    const count = Math.max(3, Math.floor(usableWidth / stripePeriod));
    const start = -((count - 1) * stripePeriod) / 2;
    const list: number[] = [];
    for (let i = 0; i < count; i++) {
      list.push(start + i * stripePeriod);
    }
    return list;
  }, [sizeZ, stripePeriod]);

  const halfX = sizeX / 2;
  const halfZ = sizeZ / 2;
  const crossingStripeLength = 1.3;

  const boxGeo = useMemo(() => new THREE.BoxGeometry(sizeX, 0.04, sizeZ), [sizeX, sizeZ]);
  const nsStopLineGeo = useMemo(() => new THREE.PlaneGeometry(sizeX * 0.42, 0.26), [sizeX]);
  const ewStopLineGeo = useMemo(() => new THREE.PlaneGeometry(0.26, sizeZ * 0.42), [sizeZ]);

  // Instanced Meshes for Zebra Crossings
  const nsInstancedRef = useRef<THREE.InstancedMesh>(null);
  const ewInstancedRef = useRef<THREE.InstancedMesh>(null);

  const totalNsInstances = (crossings.north ? nsStripes.length : 0) + (crossings.south ? nsStripes.length : 0);
  const totalEwInstances = (crossings.west ? ewStripes.length : 0) + (crossings.east ? ewStripes.length : 0);

  useEffect(() => {
    if (nsInstancedRef.current && totalNsInstances > 0) {
      let idx = 0;
      if (crossings.north) {
        const zPos = -halfZ + crossingStripeLength / 2 + 0.1;
        for (let i = 0; i < nsStripes.length; i++) {
          _dummy.position.set(nsStripes[i], 0.626, zPos);
          _dummy.rotation.set(-Math.PI / 2, 0, 0);
          _dummy.scale.set(1, 1, 1);
          _dummy.updateMatrix();
          nsInstancedRef.current.setMatrixAt(idx++, _dummy.matrix);
        }
      }
      if (crossings.south) {
        const zPos = halfZ - crossingStripeLength / 2 - 0.1;
        for (let i = 0; i < nsStripes.length; i++) {
          _dummy.position.set(nsStripes[i], 0.626, zPos);
          _dummy.rotation.set(-Math.PI / 2, 0, 0);
          _dummy.scale.set(1, 1, 1);
          _dummy.updateMatrix();
          nsInstancedRef.current.setMatrixAt(idx++, _dummy.matrix);
        }
      }
      nsInstancedRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [crossings.north, crossings.south, nsStripes, halfZ, totalNsInstances]);

  useEffect(() => {
    if (ewInstancedRef.current && totalEwInstances > 0) {
      let idx = 0;
      if (crossings.west) {
        const xPos = -halfX + crossingStripeLength / 2 + 0.1;
        for (let i = 0; i < ewStripes.length; i++) {
          _dummy.position.set(xPos, 0.626, ewStripes[i]);
          _dummy.rotation.set(-Math.PI / 2, 0, 0);
          _dummy.scale.set(1, 1, 1);
          _dummy.updateMatrix();
          ewInstancedRef.current.setMatrixAt(idx++, _dummy.matrix);
        }
      }
      if (crossings.east) {
        const xPos = halfX - crossingStripeLength / 2 - 0.1;
        for (let i = 0; i < ewStripes.length; i++) {
          _dummy.position.set(xPos, 0.626, ewStripes[i]);
          _dummy.rotation.set(-Math.PI / 2, 0, 0);
          _dummy.scale.set(1, 1, 1);
          _dummy.updateMatrix();
          ewInstancedRef.current.setMatrixAt(idx++, _dummy.matrix);
        }
      }
      ewInstancedRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [crossings.west, crossings.east, ewStripes, halfX, totalEwInstances]);

  return (
    <group position={position}>
      {/* 1. Main Junction Asphalt Bed */}
      <mesh
        position={[0, 0.62, 0]}
        receiveShadow={receiveShadow}
        geometry={boxGeo}
        material={asphaltMat}
      />

      {/* 2. Instanced North & South Zebra Stripes */}
      {totalNsInstances > 0 && (
        <instancedMesh
          ref={nsInstancedRef}
          args={[_nsStripeGeo, _stripeMat, totalNsInstances]}
          frustumCulled={false}
        />
      )}

      {/* 3. Instanced East & West Zebra Stripes */}
      {totalEwInstances > 0 && (
        <instancedMesh
          ref={ewInstancedRef}
          args={[_ewStripeGeo, _stripeMat, totalEwInstances]}
          frustumCulled={false}
        />
      )}

      {/* 4. Transverse Stop Bars Before Crossings (Requirement: clean road intersections) */}
      {crossings.north && (
        <mesh
          position={[sizeX * 0.22, 0.626, -halfZ + crossingStripeLength + 0.32]}
          rotation={[-Math.PI / 2, 0, 0]}
          geometry={nsStopLineGeo}
          material={_stopLineMat}
        />
      )}
      {crossings.south && (
        <mesh
          position={[-sizeX * 0.22, 0.626, halfZ - crossingStripeLength - 0.32]}
          rotation={[-Math.PI / 2, 0, 0]}
          geometry={nsStopLineGeo}
          material={_stopLineMat}
        />
      )}
      {crossings.west && (
        <mesh
          position={[-halfX + crossingStripeLength + 0.32, 0.626, -sizeZ * 0.22]}
          rotation={[-Math.PI / 2, 0, 0]}
          geometry={ewStopLineGeo}
          material={_stopLineMat}
        />
      )}
      {crossings.east && (
        <mesh
          position={[halfX - crossingStripeLength - 0.32, 0.626, sizeZ * 0.22]}
          rotation={[-Math.PI / 2, 0, 0]}
          geometry={ewStopLineGeo}
          material={_stopLineMat}
        />
      )}
    </group>
  );
};

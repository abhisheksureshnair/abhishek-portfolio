import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { getCityRoadNetwork } from '../WorldConfig';
import { getSharedSidewalkMaterial } from './SidewalkMaterials';

interface SidewalkProps {
  onSidewalkClick?: (point: THREE.Vector3) => void;
}

/**
 * High-Performance Instanced Sidewalk Plinth & Tactile Paving System
 * Uses 100% batched InstancedMesh:
 * - 9 Central Block Sidewalk Slabs (1 draw call)
 * - 36 Tactile Warning Pads (1 draw call)
 * Eliminates duplicate non-instanced Curb meshes (already instanced in UnifiedCityRoads).
 */
export const Sidewalk: React.FC<SidewalkProps> = ({ onSidewalkClick }) => {
  const sidewalkMaterial = useMemo(() => getSharedSidewalkMaterial(), []);
  const network = useMemo(() => getCityRoadNetwork(), []);

  const tactileMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#eab308', // Accessible safety yellow
      roughness: 0.65,
      metalness: 0.1,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
  }, []);

  const { slabMatrices, padMatrices } = useMemo(() => {
    const dummy = new THREE.Object3D();
    const slabs: THREE.Matrix4[] = [];
    const pads: THREE.Matrix4[] = [];

    network.blocks.forEach((block) => {
      const b = block.sidewalkBoundary;
      const bw = b.maxX - b.minX;
      const bd = b.maxZ - b.minZ;

      // 1. Raised concrete sidewalk plinth for the entire block
      dummy.position.set(block.center[0], 0.11, block.center[1]);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(bw, 0.18, bd);
      dummy.updateMatrix();
      slabs.push(dummy.matrix.clone());

      // 2. Tactile warning pads at the 4 block corners facing crosswalks
      const cornerOffsets: [number, number][] = [
        [b.minX + 1.2, b.minZ + 1.2],
        [b.maxX - 1.2, b.minZ + 1.2],
        [b.minX + 1.2, b.maxZ - 1.2],
        [b.maxX - 1.2, b.maxZ - 1.2],
      ];

      cornerOffsets.forEach(([tcx, tcz]) => {
        dummy.position.set(tcx, 0.202, tcz);
        dummy.rotation.set(-Math.PI / 2, 0, 0);
        dummy.scale.set(1.2, 1.2, 1);
        dummy.updateMatrix();
        pads.push(dummy.matrix.clone());
      });
    });

    return { slabMatrices: slabs, padMatrices: pads };
  }, [network]);

  const slabRef = useRef<THREE.InstancedMesh>(null);
  const padRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (slabRef.current) {
      slabMatrices.forEach((m, i) => slabRef.current!.setMatrixAt(i, m));
      slabRef.current.instanceMatrix.needsUpdate = true;
    }
    if (padRef.current) {
      padMatrices.forEach((m, i) => padRef.current!.setMatrixAt(i, m));
      padRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [slabMatrices, padMatrices]);

  const boxGeo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const planeGeo = useMemo(() => new THREE.PlaneGeometry(1, 1), []);

  return (
    <group name="SidewalkSystem">
      {/* 1. Batched Concrete Sidewalk Slabs */}
      {slabMatrices.length > 0 && (
        <instancedMesh
          ref={slabRef}
          args={[boxGeo, sidewalkMaterial, slabMatrices.length]}
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            onSidewalkClick?.(e.point);
          }}
        />
      )}

      {/* 2. Batched Tactile Blister Paving Warning Pads */}
      {padMatrices.length > 0 && (
        <instancedMesh
          ref={padRef}
          args={[planeGeo, tactileMaterial, padMatrices.length]}
        />
      )}
    </group>
  );
};

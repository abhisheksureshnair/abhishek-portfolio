import React, { useMemo } from 'react';
import * as THREE from 'three';
import { GridIntersectionData, WORLD_CONFIG } from '../WorldConfig';
import { getSharedAsphaltMaterial } from './AsphaltMaterials';

interface IntersectionProps {
  intersection: GridIntersectionData;
  onIntersectionClick?: (point: THREE.Vector3) => void;
}

export const Intersection: React.FC<IntersectionProps> = ({
  intersection,
  onIntersectionClick,
}) => {
  const asphaltMaterial = useMemo(() => getSharedAsphaltMaterial(), []);

  return (
    <group
      position={[
        intersection.center[0],
        WORLD_CONFIG.roadElevation,
        intersection.center[1],
      ]}
    >
      {/* Intersection Box Asphalt Surface */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        material={asphaltMaterial}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onIntersectionClick?.(e.point);
        }}
      >
        <planeGeometry args={[intersection.width, intersection.length]} />
      </mesh>

      {/* Reserved mounting foundations for future traffic signals */}
      {intersection.trafficSignalPositions.map(([sx, sz], idx) => (
        <mesh
          key={`sig-base-${idx}`}
          position={[sx - intersection.center[0], 0.1, sz - intersection.center[1]]}
          receiveShadow
        >
          <cylinderGeometry args={[0.25, 0.28, 0.2, 8]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
};

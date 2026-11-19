import React, { useMemo } from 'react';
import * as THREE from 'three';
import { GridRoadData, WORLD_CONFIG } from '../WorldConfig';
import { getSharedAsphaltMaterial } from './AsphaltMaterials';

interface RoadSegmentProps {
  road: GridRoadData;
  onRoadClick?: (point: THREE.Vector3) => void;
}

export const RoadSegment: React.FC<RoadSegmentProps> = ({ road, onRoadClick }) => {
  const asphaltMaterial = useMemo(() => getSharedAsphaltMaterial(), []);

  const { length, angle, centerX, centerZ } = useMemo(() => {
    const dx = road.end[0] - road.start[0];
    const dz = road.end[1] - road.start[1];
    const length = Math.hypot(dx, dz);
    const angle = Math.atan2(dz, dx);
    const centerX = (road.start[0] + road.end[0]) / 2;
    const centerZ = (road.start[1] + road.end[1]) / 2;
    return { length, angle, centerX, centerZ };
  }, [road]);

  return (
    <group position={[centerX, WORLD_CONFIG.roadElevation, centerZ]} rotation={[0, -angle, 0]}>
      {/* Main Asphalt Road Surface */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        material={asphaltMaterial}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onRoadClick?.(e.point);
        }}
      >
        <planeGeometry args={[length, road.width]} />
      </mesh>
    </group>
  );
};

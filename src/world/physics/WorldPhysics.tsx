import React, { useMemo } from 'react';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { WORLD_CONFIG, getCityRoadNetwork } from '../WorldConfig';

interface WorldPhysicsProps {
  children?: React.ReactNode;
}

export const WorldPhysics: React.FC<WorldPhysicsProps> = ({ children }) => {
  const halfTerrain = WORLD_CONFIG.terrainSize / 2;
  const network = useMemo(() => getCityRoadNetwork(), []);

  return (
    <Physics gravity={[0, -9.81, 0]}>
      {/* 1. Global Static Ground & Road Collision Foundation */}
      <RigidBody type="fixed" colliders={false} name="static-ground">
        {/* Continuous ground collision floor */}
        <CuboidCollider
          args={[halfTerrain, 0.2, halfTerrain]}
          position={[0, -0.2, 0]}
        />

        {/* Raised Sidewalk & Block Plinths for all 9 Rectangular City Blocks */}
        {network.blocks.map((block) => (
          <CuboidCollider
            key={`phys-${block.id}`}
            args={[block.dimensions[0] / 2, 0.09, block.dimensions[1] / 2]}
            position={[block.center[0], 0.11, block.center[1]]}
          />
        ))}
      </RigidBody>

      {children}
    </Physics>
  );
};

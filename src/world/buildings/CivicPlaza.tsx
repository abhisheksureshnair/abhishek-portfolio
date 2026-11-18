import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getSharedCityMaterials } from './BuildingArchetypes';

interface CivicPlazaProps {
  position?: [number, number, number];
}

/**
 * Northwest Civic Plaza & Botanical Park (Relocated to former HQ parcel at [-40, -40])
 * Elegant civic open space with granite walkways, manicured lawn parterres,
 * ornamental circular stone fountain, and perimeter limestone planter seating.
 * 100% lightweight geometry with shared materials.
 */
export const CivicPlaza: React.FC<CivicPlazaProps> = ({
  position = [-40.0, 0, -40.0],
}) => {
  const materials = useMemo(() => getSharedCityMaterials(), []);

  return (
    <group position={position}>
      {/* 1. Main Plaza Granite Paving Plinth (23.2m x 23.2m at Y = 0.12m, top at Y = 0.24m) */}
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[23.2, 0.24, 23.2]} />
        <primitive object={materials.flutedStone} attach="material" />
      </mesh>

      {/* 2. Four Manicured Green Lawn Parterres in the 4 quadrants (top at Y = 0.255m) */}
      {/* Quadrant NW */}
      <mesh position={[-6.0, 0.245, -6.0]} receiveShadow>
        <boxGeometry args={[8.5, 0.02, 8.5]} />
        <primitive object={materials.parkGrass} attach="material" />
      </mesh>
      {/* Quadrant NE */}
      <mesh position={[6.0, 0.245, -6.0]} receiveShadow>
        <boxGeometry args={[8.5, 0.02, 8.5]} />
        <primitive object={materials.parkGrass} attach="material" />
      </mesh>
      {/* Quadrant SW */}
      <mesh position={[-6.0, 0.245, 6.0]} receiveShadow>
        <boxGeometry args={[8.5, 0.02, 8.5]} />
        <primitive object={materials.parkGrass} attach="material" />
      </mesh>
      {/* Quadrant SE */}
      <mesh position={[6.0, 0.245, 6.0]} receiveShadow>
        <boxGeometry args={[8.5, 0.02, 8.5]} />
        <primitive object={materials.parkGrass} attach="material" />
      </mesh>

      {/* 3. Central Circular Ornamental Stone Fountain Basin (Diameter 6.4m) */}
      <group position={[0, 0.24, 0]}>
        {/* Stone Fountain Basin Coping Rim */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[3.2, 3.4, 0.50, 32]} />
          <primitive object={materials.flutedStone} attach="material" />
        </mesh>

        {/* Reflective Water Surface */}
        <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.9, 32]} />
          <primitive object={materials.corporateGlass} attach="material" />
        </mesh>

        {/* Central Fountain Tiered Pedestal */}
        <mesh position={[0, 0.65, 0]} castShadow>
          <cylinderGeometry args={[0.7, 0.9, 0.8, 16]} />
          <primitive object={materials.flutedStone} attach="material" />
        </mesh>
        <mesh position={[0, 1.15, 0]} castShadow>
          <cylinderGeometry args={[1.4, 1.4, 0.20, 24]} />
          <primitive object={materials.flutedStone} attach="material" />
        </mesh>
      </group>

      {/* 4. Perimeter Stone Planters with Low Coping along corners */}
      {[-9.5, 9.5].map((px) =>
        [-9.5, 9.5].map((pz) => (
          <mesh
            key={`planter-${px}-${pz}`}
            position={[px, 0.35, pz]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[2.6, 0.35, 2.6]} />
            <primitive object={materials.precastConcrete} attach="material" />
          </mesh>
        ))
      )}

      {/* 5. Subtle Soft Park Lighting Accent */}
      <pointLight
        color="#38bdf8"
        intensity={1.2}
        distance={15.0}
        position={[0, 2.0, 0]}
      />
    </group>
  );
};

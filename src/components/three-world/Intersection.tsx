'use client';

import React, { useMemo } from 'react';
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

/**
 * Reusable Intersection Component
 * Renders a clean road junction with:
 * - Seamless asphalt surface matching road segments
 * - Clean interior with NO overlapping dashed center lines
 * - Stylized zebra crossings at selected entry points
 * - Exact layering preventing z-fighting (asphalt y = 0.62, zebra markings y = 0.626)
 */
const _nsStripeGeo = new THREE.PlaneGeometry(0.24, 1.3);
const _ewStripeGeo = new THREE.PlaneGeometry(1.3, 0.24);
const _stripeMat = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  roughness: 0.35,
  metalness: 0.05,
});

export const Intersection: React.FC<IntersectionProps> = ({
  position,
  sizeX,
  sizeZ,
  crossings = { north: true, south: true, east: true, west: true },
  receiveShadow = true,
}) => {
  const asphaltTex = useMemo(() => getProceduralAsphaltTexture(), []);

  // Generate stripes for zebra crossings
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

  return (
    <group position={position}>
      {/* 1. Main Junction Asphalt Box */}
      <mesh position={[0, 0.62, 0]} receiveShadow={receiveShadow} geometry={boxGeo}>
        <meshStandardMaterial
          map={asphaltTex}
          color="#222730"
          roughness={0.78}
          metalness={0.08}
        />
      </mesh>

      {/* 2. North Zebra Crossing (positioned at northern edge, stripes aligned N-S) */}
      {crossings.north && (
        <group position={[0, 0.626, -halfZ + crossingStripeLength / 2 + 0.1]}>
          {nsStripes.map((xPos, idx) => (
            <mesh
              key={idx}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[xPos, 0, 0]}
              geometry={_nsStripeGeo}
              material={_stripeMat}
            />
          ))}
        </group>
      )}

      {/* 3. South Zebra Crossing (positioned at southern edge) */}
      {crossings.south && (
        <group position={[0, 0.626, halfZ - crossingStripeLength / 2 - 0.1]}>
          {nsStripes.map((xPos, idx) => (
            <mesh
              key={idx}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[xPos, 0, 0]}
              geometry={_nsStripeGeo}
              material={_stripeMat}
            />
          ))}
        </group>
      )}

      {/* 4. West Zebra Crossing (positioned at western edge, stripes aligned E-W) */}
      {crossings.west && (
        <group position={[-halfX + crossingStripeLength / 2 + 0.1, 0.626, 0]}>
          {ewStripes.map((zPos, idx) => (
            <mesh
              key={idx}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0, zPos]}
              geometry={_ewStripeGeo}
              material={_stripeMat}
            />
          ))}
        </group>
      )}

      {/* 5. East Zebra Crossing (positioned at eastern edge) */}
      {crossings.east && (
        <group position={[halfX - crossingStripeLength / 2 - 0.1, 0.626, 0]}>
          {ewStripes.map((zPos, idx) => (
            <mesh
              key={idx}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0, zPos]}
              geometry={_ewStripeGeo}
              material={_stripeMat}
            />
          ))}
        </group>
      )}
    </group>
  );
};


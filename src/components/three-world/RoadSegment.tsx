'use client';

import React, { useMemo } from 'react';
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

/**
 * Reusable RoadSegment component
 * Renders a dark asphalt roadway with:
 * - Subtle procedural asphalt texture
 * - White dashed center lane markings
 * - Solid white outer edge lines
 * - Exact layering preventing z-fighting (road y = 0.62, markings y = 0.625)
 */
export const RoadSegment: React.FC<RoadSegmentProps> = ({
  position,
  width,
  length,
  orientation = 'z',
  hasCenterLine = true,
  hasEdgeLines = true,
  receiveShadow = true,
}) => {
  const asphaltTex = useMemo(() => getProceduralAsphaltTexture(), []);

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

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 1. Main Asphalt Bed (top at y = 0.62) */}
      <mesh position={[0, 0.62, 0]} receiveShadow={receiveShadow}>
        <boxGeometry args={[width, 0.04, length]} />
        <meshStandardMaterial
          map={asphaltTex}
          color="#222730"
          roughness={0.78}
          metalness={0.08}
        />
      </mesh>

      {/* 2. Slightly Rounded / Chamfered Road Shoulder Borders */}
      {[-halfWidth, halfWidth].map((xSide, idx) => (
        <mesh key={idx} position={[xSide, 0.615, 0]}>
          <boxGeometry args={[0.06, 0.03, length]} />
          <meshStandardMaterial color="#1a1e24" roughness={0.9} />
        </mesh>
      ))}

      {/* 3. Solid White Edge Lines (y = 0.625) */}
      {hasEdgeLines &&
        [-edgeLineOffset, edgeLineOffset].map((xOffset, idx) => (
          <mesh
            key={idx}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[xOffset, 0.625, 0]}
          >
            <planeGeometry args={[0.1, length]} />
            <meshStandardMaterial
              color="#f8fafc"
              roughness={0.4}
              metalness={0.05}
            />
          </mesh>
        ))}

      {/* 4. Dashed White Center Lane Line (y = 0.625) */}
      {hasCenterLine &&
        dashes.map((zOffset, idx) => (
          <mesh
            key={idx}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.625, zOffset]}
          >
            <planeGeometry args={[0.14, dashLength]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.35}
              metalness={0.05}
            />
          </mesh>
        ))}
    </group>
  );
};


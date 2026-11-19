import React, { useMemo } from 'react';
import * as THREE from 'three';
import { WORLD_CONFIG, GridRoadData, GridIntersectionData } from '../WorldConfig';

const whitePaintMaterial = new THREE.MeshStandardMaterial({
  color: '#e5e7eb',
  roughness: 0.65,
  metalness: 0.02,
  polygonOffset: true,
  polygonOffsetFactor: -2,
  polygonOffsetUnits: -2,
});

const yellowPaintMaterial = new THREE.MeshStandardMaterial({
  color: '#eab308',
  roughness: 0.65,
  metalness: 0.02,
  polygonOffset: true,
  polygonOffsetFactor: -2,
  polygonOffsetUnits: -2,
});

interface RoadMarkingsProps {
  roads: GridRoadData[];
  intersections: GridIntersectionData[];
}

export const RoadMarkings: React.FC<RoadMarkingsProps> = ({ roads, intersections }) => {
  const y = WORLD_CONFIG.markingsElevation;

  // 1. Road Segment Markings: Double Yellow Centerlines & Solid White Edge Lines
  const { solidLines } = useMemo(() => {
    const lines: { pos: [number, number, number]; rot: number; size: [number, number]; color: 'white' | 'yellow' }[] = [];

    roads.forEach((road) => {
      const dx = road.end[0] - road.start[0];
      const dz = road.end[1] - road.start[1];
      const length = Math.hypot(dx, dz);
      const angle = Math.atan2(dz, dx);
      const cx = (road.start[0] + road.end[0]) / 2;
      const cz = (road.start[1] + road.end[1]) / 2;

      const nx = -Math.sin(angle);
      const nz = Math.cos(angle);

      // Outer White Edge Lines (0.15m wide, along road boundaries)
      const edgeOffset = road.width / 2 - 0.25;
      lines.push({
        pos: [cx + nx * edgeOffset, y, cz + nz * edgeOffset],
        rot: -angle,
        size: [length, 0.15],
        color: 'white',
      });
      lines.push({
        pos: [cx - nx * edgeOffset, y, cz - nz * edgeOffset],
        rot: -angle,
        size: [length, 0.15],
        color: 'white',
      });

      // Standard American Double Yellow Centerline (0.12m stripe, 0.15m separation)
      const yellowGap = 0.15;
      lines.push({
        pos: [cx + nx * yellowGap, y, cz + nz * yellowGap],
        rot: -angle,
        size: [length, 0.12],
        color: 'yellow',
      });
      lines.push({
        pos: [cx - nx * yellowGap, y, cz - nz * yellowGap],
        rot: -angle,
        size: [length, 0.12],
        color: 'yellow',
      });
    });

    return { solidLines: lines };
  }, [roads, y]);

  // 2. Intersection Crosswalks & Stop Lines
  const { crosswalkStripes, stopLines } = useMemo(() => {
    const stripes: { pos: [number, number, number]; rot: number; size: [number, number] }[] = [];
    const stops: { pos: [number, number, number]; rot: number; size: [number, number] }[] = [];

    intersections.forEach((inter) => {
      const cx = inter.center[0];
      const cz = inter.center[1];
      const hw = inter.width / 2;
      const hl = inter.length / 2;

      // 4 Approach arms
      const arms: {
        cx: number;
        cz: number;
        rot: number;
        span: number;
        inSideX: number;
        inSideZ: number;
        isZ: boolean;
        dir: number;
      }[] = [
        // North arm (Z = cz - hl)
        { cx, cz: cz - hl - 1.6, rot: 0, span: inter.width, inSideX: -2.3, inSideZ: 0, isZ: true, dir: -1 },
        // South arm (Z = cz + hl)
        { cx, cz: cz + hl + 1.6, rot: 0, span: inter.width, inSideX: 2.3, inSideZ: 0, isZ: true, dir: 1 },
        // West arm (X = cx - hw)
        { cx: cx - hw - 1.6, cz, rot: Math.PI / 2, span: inter.length, inSideX: 0, inSideZ: 2.3, isZ: false, dir: -1 },
        // East arm (X = cx + hw)
        { cx: cx + hw + 1.6, cz, rot: Math.PI / 2, span: inter.length, inSideX: 0, inSideZ: -2.3, isZ: false, dir: 1 },
      ];

      arms.forEach((arm) => {
        // Stop Line on incoming right-hand traffic side
        const stopDistance = 1.6;
        if (arm.isZ) {
          stops.push({
            pos: [arm.cx + arm.inSideX, y, arm.cz + arm.dir * stopDistance],
            rot: 0,
            size: [inter.width / 2 - 0.4, 0.45],
          });
        } else {
          stops.push({
            pos: [arm.cx + arm.dir * stopDistance, y, arm.cz + arm.inSideZ],
            rot: Math.PI / 2,
            size: [inter.length / 2 - 0.4, 0.45],
          });
        }

        // Continental Crosswalk: 0.5m wide white bars spaced 0.5m apart
        const stripeWidth = 0.5;
        const gap = 0.5;
        const step = stripeWidth + gap;
        const numStripes = Math.floor((arm.span - 1.0) / step);
        const startOffset = -((numStripes - 1) * step) / 2;

        for (let s = 0; s < numStripes; s++) {
          const offset = startOffset + s * step;
          if (arm.isZ) {
            stripes.push({
              pos: [arm.cx + offset, y, arm.cz],
              rot: Math.PI / 2,
              size: [2.8, stripeWidth],
            });
          } else {
            stripes.push({
              pos: [arm.cx, y, arm.cz + offset],
              rot: 0,
              size: [2.8, stripeWidth],
            });
          }
        }
      });
    });

    return { crosswalkStripes: stripes, stopLines: stops };
  }, [intersections, y]);

  return (
    <group name="RoadMarkings">
      {/* 1. Solid Double Yellow Centerlines & Edge Lines */}
      {solidLines.map((line, idx) => (
        <mesh
          key={`solid-${idx}`}
          rotation={[-Math.PI / 2, 0, line.rot]}
          position={line.pos}
          material={line.color === 'yellow' ? yellowPaintMaterial : whitePaintMaterial}
        >
          <planeGeometry args={[line.size[0], line.size[1]]} />
        </mesh>
      ))}

      {/* 2. Intersection Stop Lines */}
      {stopLines.map((stop, idx) => (
        <mesh
          key={`stop-${idx}`}
          rotation={[-Math.PI / 2, 0, stop.rot]}
          position={stop.pos}
          material={whitePaintMaterial}
        >
          <planeGeometry args={[stop.size[0], stop.size[1]]} />
        </mesh>
      ))}

      {/* 3. Continental Crosswalk Stripes */}
      {crosswalkStripes.map((stripe, idx) => (
        <mesh
          key={`cross-${idx}`}
          rotation={[-Math.PI / 2, 0, stripe.rot]}
          position={stripe.pos}
          material={whitePaintMaterial}
        >
          <planeGeometry args={[stripe.size[0], stripe.size[1]]} />
        </mesh>
      ))}
    </group>
  );
};

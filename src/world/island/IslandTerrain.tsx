import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createIslandShape } from './islandCoastline';
import { getSharedTerrainMaterial } from '../terrain/TerrainMaterials';
import { getCityRoadNetwork } from '../WorldConfig';

interface IslandTerrainProps {
  onGroundClick?: (point: THREE.Vector3) => void;
}

/**
 * Phase 2.0.5 Island Landmass Terrain
 * 
 * Replaces the old square 1400m ground plane with an organic island landmass:
 * - 100% continuous terrain matching the organic coastline perimeter
 * - Top surface at Y = 0.00m supporting all 361 city blocks and 375 buildings
 * - UVs aligned to real-world 40m grid spacing for seamless material tiling
 * - Preserves the 9 protected central portfolio plot survey foundations
 * - Zero water clipping: sits firmly 1.20m above the ocean water level
 */
export const IslandTerrain: React.FC<IslandTerrainProps> = ({ onGroundClick }) => {
  const terrainMaterial = useMemo(() => getSharedTerrainMaterial(), []);
  const network = useMemo(() => getCityRoadNetwork(), []);

  // 1. Generate Triangulated Organic Island Geometry from Coastline Shape
  const islandGeometry = useMemo(() => {
    const shape = createIslandShape();
    const geo = new THREE.ShapeGeometry(shape);

    // Compute real-world UV coordinates matching the 40m city block pitch
    const pos = geo.attributes.position;
    const uvs = new Float32Array((pos.count) * 2);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i); // Note: In 2D Shape, Y corresponds to world Z
      uvs[i * 2] = x / 40.0;
      uvs[i * 2 + 1] = -y / 40.0; // Shape Y = -Z, so -Y = Z
    }
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geo.computeVertexNormals();
    return geo;
  }, []);

  // 2. Survey foundations for the remaining unbuilt protected central portfolio plots
  // Built parcels (HQ, Innovation Center, Skills Tower, Civic Plaza, Career Center, About Studio, Contact Hub, AI Research Center) manage their own plinths & forecourts
  const BUILT_PORTFOLIO_BLOCK_IDS = useMemo(
    () => new Set(['block-0-0', 'block-1-1', 'block-0-2', 'block-1-0', 'block-1-2', 'block-0-1', 'block-2-0', 'block-2-1']),
    []
  );

  const unbuiltProtectedPlots = useMemo(() => {
    return network.blocks
      .filter((block) => block.isProtectedDistrict && block.reservedPlot && !BUILT_PORTFOLIO_BLOCK_IDS.has(block.id))
      .map((block) => {
        const b = block.buildableArea;
        const width = b.maxX - b.minX;
        const depth = b.maxZ - b.minZ;
        return {
          id: block.id,
          center: block.center,
          width,
          depth,
          color: block.reservedPlot!.color,
          title: block.reservedPlot!.title,
        };
      });
  }, [network, BUILT_PORTFOLIO_BLOCK_IDS]);

  return (
    <group name="IslandTerrainSystem">
      {/* 1. Main Continuous Organic Island Landmass */}
      <mesh
        geometry={islandGeometry}
        material={terrainMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          // Restrict click-to-move strictly to the central explorable Zone A [-64m, +64m]
          if (Math.abs(e.point.x) <= 64.0 && Math.abs(e.point.z) <= 64.0) {
            onGroundClick?.(e.point);
          }
        }}
      />

      {/* 2. Finished 3D Survey Pads for Unbuilt Central Portfolio Plots (Zero Z-Fighting) */}
      {unbuiltProtectedPlots.map((plot) => {
        const halfW = (plot.width - 0.4) / 2;
        const halfD = (plot.depth - 0.4) / 2;
        return (
          <group key={plot.id} position={[plot.center[0], 0, plot.center[1]]}>
            {/* Solid 3D Base Pad (Elevated to Y = 0.24m top, 4cm above 0.20m sidewalk) */}
            <mesh position={[0, 0.22, 0]} receiveShadow>
              <boxGeometry args={[plot.width - 0.4, 0.04, plot.depth - 0.4]} />
              <meshStandardMaterial
                color="#1e293b"
                roughness={0.85}
                metalness={0.12}
              />
            </mesh>

            {/* Subtle Perimeter Architectural Curb Trim */}
            <lineSegments position={[0, 0.242, 0]}>
              <edgesGeometry args={[new THREE.BoxGeometry(plot.width - 0.4, 0.005, plot.depth - 0.4)]} />
              <lineBasicMaterial color={plot.color} linewidth={1.5} />
            </lineSegments>

            {/* Corner Survey Stanchions with Project Identity Accent */}
            {[
              [-halfW, -halfD],
              [halfW, -halfD],
              [-halfW, halfD],
              [halfW, halfD],
            ].map(([cx, cz], idx) => (
              <group key={`corner-stanchion-${idx}`} position={[cx, 0.24, cz]}>
                <mesh position={[0, 0.35, 0]}>
                  <cylinderGeometry args={[0.06, 0.07, 0.70, 8]} />
                  <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.8} />
                </mesh>
                <mesh position={[0, 0.72, 0]}>
                  <sphereGeometry args={[0.08, 12, 12]} />
                  <meshStandardMaterial
                    color={plot.color}
                    emissive={plot.color}
                    emissiveIntensity={1.5}
                  />
                </mesh>
              </group>
            ))}
          </group>
        );
      })}
    </group>
  );
};

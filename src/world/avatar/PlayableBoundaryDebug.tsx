'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWorldStore } from '../stores/worldStore';
import { getCityRoadNetwork } from '../WorldConfig';
import { getDistrictFreeRoamNavigator } from './districtFreeRoamNavigator';
import * as THREE from 'three';

/**
 * Visual Boundary Debug Overlay for Central 3x3 Playable District.
 * Requirement 7:
 * - Invisible by default in production.
 * - Only visible when debug toggle (showNavDebug or ?boundary=true) is activated for dev testing.
 */
export const PlayableBoundaryDebug: React.FC = () => {
  const showNavDebug = useWorldStore((s) => s.showNavDebug);
  const searchParams = useSearchParams();
  const showBoundaryParam = searchParams.get('boundary') === 'true' || searchParams.get('show_boundary') === 'true';

  const network = useMemo(() => getCityRoadNetwork(), []);
  const navigator = useMemo(() => getDistrictFreeRoamNavigator(network), [network]);

  const { minX, maxX, minZ, maxZ } = navigator.bounds;
  const width = maxX - minX;
  const depth = maxZ - minZ;
  const centerX = (minX + maxX) / 2;
  const centerZ = (minZ + maxZ) / 2;

  // Do not render visible lines in production
  if (!showNavDebug && !showBoundaryParam) return null;

  return (
    <group name="playable-boundary-debug" position={[centerX, 0.25, centerZ]}>
      {/* Outer District Perimeter Wireframe Box */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(width, 0.2, depth)]} />
        <lineBasicMaterial color="#06b6d4" transparent opacity={0.65} linewidth={2} />
      </lineSegments>

      {/* Building Collision Footprint Wireframes */}
      {navigator.colliders.map((c) => {
        const cWidth = c.maxX - c.minX;
        const cDepth = c.maxZ - c.minZ;
        const cx = (c.minX + c.maxX) / 2 - centerX;
        const cz = (c.minZ + c.maxZ) / 2 - centerZ;
        return (
          <group key={c.id} position={[cx, 0.1, cz]}>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(cWidth, 0.3, cDepth)]} />
              <lineBasicMaterial color="#ef4444" transparent opacity={0.5} />
            </lineSegments>
          </group>
        );
      })}
    </group>
  );
};

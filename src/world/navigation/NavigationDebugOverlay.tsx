import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { getCityRoadNetwork } from './cityGridBuilder';
import { getPedestrianGraph } from './pedestrianGraph';
import { LANDMARK_PORTALS } from '../avatar/pedestrianNavigator';
import { useWorldStore } from '../stores/worldStore';

export const NavigationDebugOverlay: React.FC = () => {
  const showNavDebug = useWorldStore((s) => s.showNavDebug);
  const network = useMemo(() => getCityRoadNetwork(), []);
  const pedGraph = useMemo(() => getPedestrianGraph(network), [network]);


  // Vehicle Lane Line Geometries
  const { straightLines, turnCurves } = useMemo(() => {
    const sPts: THREE.Vector3[] = [];
    const tPts: THREE.Vector3[] = [];

    network.vehicleGraph.laneArray.forEach((lane) => {
      const pts = lane.waypoints.map((w) => new THREE.Vector3(w.x, w.y + 0.05, w.z));

      if (lane.turnType === 'road-lane') {
        sPts.push(...pts);
      } else {
        for (let i = 0; i < pts.length - 1; i++) {
          tPts.push(pts[i], pts[i + 1]);
        }
      }
    });

    return { straightLines: sPts, turnCurves: tPts };
  }, [network]);

  // Pedestrian Sidewalk, Crosswalk & Entrance Line Geometries
  const { sidewalkLines, crosswalkLines, entranceLines, corridorBoundaries } = useMemo(() => {
    const sPts: THREE.Vector3[] = [];
    const cPts: THREE.Vector3[] = [];
    const ePts: THREE.Vector3[] = [];
    const bPts: THREE.Vector3[] = [];

    pedGraph.edges.forEach((edge) => {
      const n1 = pedGraph.nodes.get(edge.from);
      const n2 = pedGraph.nodes.get(edge.to);
      if (!n1 || !n2) return;

      const yOffset = edge.isCrosswalk ? 0.08 : 0.09;
      const p1 = new THREE.Vector3(n1.x, n1.y + yOffset, n1.z);
      const p2 = new THREE.Vector3(n2.x, n2.y + yOffset, n2.z);

      if (edge.isEntrance) {
        ePts.push(p1, p2);
      } else if (edge.isCrosswalk) {
        cPts.push(p1, p2);
      } else {
        sPts.push(p1, p2);
      }

      // Compute Walkable Corridor Boundary Lines
      const dx = n2.x - n1.x;
      const dz = n2.z - n1.z;
      const len = Math.hypot(dx, dz);
      if (len > 0.001) {
        const nx = -dz / len;
        const nz = dx / len;
        const hw = edge.corridorHalfWidth || (edge.isEntrance ? 1.4 : edge.isCrosswalk ? 1.1 : 0.95);

        // Left boundary
        bPts.push(
          new THREE.Vector3(n1.x + nx * hw, n1.y + yOffset, n1.z + nz * hw),
          new THREE.Vector3(n2.x + nx * hw, n2.y + yOffset, n2.z + nz * hw)
        );
        // Right boundary
        bPts.push(
          new THREE.Vector3(n1.x - nx * hw, n1.y + yOffset, n1.z - nz * hw),
          new THREE.Vector3(n2.x - nx * hw, n2.y + yOffset, n2.z - nz * hw)
        );
      }
    });

    return {
      sidewalkLines: sPts,
      crosswalkLines: cPts,
      entranceLines: ePts,
      corridorBoundaries: bPts,
    };
  }, [pedGraph]);

  if (!showNavDebug) return null;

  return (
    <group name="NavigationDebugOverlay">
      {/* 1. Vehicle Straight Road Lane Centerlines (Cyan) */}
      {straightLines.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(straightLines.flatMap((v) => [v.x, v.y, v.z])), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#06b6d4" linewidth={1.5} opacity={0.65} transparent />
        </lineSegments>
      )}

      {/* 2. Vehicle Intersection Turning Bézier Curves (Magenta) */}
      {turnCurves.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(turnCurves.flatMap((v) => [v.x, v.y, v.z])), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ec4899" linewidth={1.5} opacity={0.65} transparent />
        </lineSegments>
      )}

      {/* 3. Pedestrian Sidewalk Centerlines (Emerald) */}
      {sidewalkLines.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(sidewalkLines.flatMap((v) => [v.x, v.y, v.z])), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#10b981" linewidth={2.5} />
        </lineSegments>
      )}

      {/* 4. Pedestrian Crosswalk Connections (Amber Gold) */}
      {crosswalkLines.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(crosswalkLines.flatMap((v) => [v.x, v.y, v.z])), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#f59e0b" linewidth={3.5} />
        </lineSegments>
      )}

      {/* 5. Landmark Entrance Walkway Branches (Violet) */}
      {entranceLines.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(entranceLines.flatMap((v) => [v.x, v.y, v.z])), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#a855f7" linewidth={3} />
        </lineSegments>
      )}

      {/* 6. Walkable Corridor Lateral Boundaries (White / Light Cyan) */}
      {corridorBoundaries.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(corridorBoundaries.flatMap((v) => [v.x, v.y, v.z])), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#e0f2fe" opacity={0.45} transparent linewidth={1} />
        </lineSegments>
      )}

      {/* 7. Pedestrian Graph Node Indicators (Spheres) */}
      {pedGraph.nodeArray.map((node) => {
        const color =
          node.type === 'entrance'
            ? '#a855f7'
            : node.type === 'crosswalk-end'
            ? '#f59e0b'
            : node.type === 'walkway'
            ? '#38bdf8'
            : '#10b981';
        const radius = node.type === 'entrance' ? 0.35 : 0.22;

        return (
          <mesh key={node.id} position={[node.x, node.y + 0.1, node.z]}>
            <sphereGeometry args={[radius, 8, 8]} />
            <meshBasicMaterial color={color} />
          </mesh>
        );
      })}

      {/* 8. Landmark Portal Interaction Zones */}
      {LANDMARK_PORTALS.map((portal) => (
        <group key={`portal-zone-${portal.id}`} position={[portal.portalX, 0.25, portal.portalZ]}>
          {/* Ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[portal.interactionRadius - 0.15, portal.interactionRadius, 32]} />
            <meshBasicMaterial color="#06b6d4" opacity={0.4} transparent side={THREE.DoubleSide} />
          </mesh>
          <Html center distanceFactor={35} className="pointer-events-none select-none">
            <div className="bg-black/85 border border-cyan-400 text-cyan-300 font-mono text-[9px] px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap">
              {portal.name} Portal ({portal.interactionRadius}m)
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
};

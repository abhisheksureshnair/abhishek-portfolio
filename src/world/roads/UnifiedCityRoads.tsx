import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import {
  CITY_LAYOUT_CONFIG,
  getCityBlocks,
  getCityIntersections,
  getCityRoadSegments,
  getCityCrosswalks,
} from '../layout/cityLayoutConfig';
import { getSharedAsphaltMaterial } from './AsphaltMaterials';
import { getSharedSidewalkMaterial } from '../sidewalks/SidewalkMaterials';

const whiteMarkingMaterial = new THREE.MeshStandardMaterial({
  color: '#f8fafc',
  roughness: 0.55,
  metalness: 0.02,
  polygonOffset: true,
  polygonOffsetFactor: -2,
  polygonOffsetUnits: -2,
});

const yellowMarkingMaterial = new THREE.MeshStandardMaterial({
  color: '#eab308',
  roughness: 0.55,
  metalness: 0.02,
  polygonOffset: true,
  polygonOffsetFactor: -2,
  polygonOffsetUnits: -2,
});

const curbGraniteMaterial = new THREE.MeshStandardMaterial({
  color: '#94a3b8',
  roughness: 0.70,
  metalness: 0.05,
});

interface UnifiedCityRoadsProps {
  onRoadClick?: (point: THREE.Vector3) => void;
}

/**
 * High-Performance Instanced Unified Road, Sidewalk, and Crosswalk System
 * Driven 100% from CITY_LAYOUT_CONFIG mathematical ground truth.
 * - Zero overlapping road geometry
 * - Zero floating markings
 * - Perfectly aligned continental crosswalks with stop bars
 * - Seamless sidewalk plinths with beveled granite curbs
 */
export const UnifiedCityRoads: React.FC<UnifiedCityRoadsProps> = ({ onRoadClick }) => {
  const asphaltMaterial = useMemo(() => getSharedAsphaltMaterial(), []);
  const sidewalkMaterial = useMemo(() => getSharedSidewalkMaterial(), []);

  const blocks = useMemo(() => getCityBlocks(), []);
  const intersections = useMemo(() => getCityIntersections(), []);
  const roadSegments = useMemo(() => getCityRoadSegments(), []);
  const crosswalks = useMemo(() => getCityCrosswalks(), []);

  const { elevations } = CITY_LAYOUT_CONFIG;

  // Compute instanced matrices for all road and sidewalk elements
  const batches = useMemo(() => {
    const dummy = new THREE.Object3D();

    const roadSurfaces: THREE.Matrix4[] = [];
    const intersectionSurfaces: THREE.Matrix4[] = [];
    const sidewalkPlinths: THREE.Matrix4[] = [];
    const graniteCurbs: THREE.Matrix4[] = [];
    const yellowDoubleCenterlines: THREE.Matrix4[] = [];
    const whiteEdgeLines: THREE.Matrix4[] = [];
    const whiteCrosswalkStripes: THREE.Matrix4[] = [];
    const whiteStopBars: THREE.Matrix4[] = [];

    // 1. Road Segments (Asphalt plane at Y = 0.02m)
    roadSegments.forEach((seg) => {
      dummy.position.set(seg.center[0], elevations.road, seg.center[1]);
      dummy.rotation.set(-Math.PI / 2, 0, 0);
      dummy.scale.set(seg.width, seg.length, 1);
      dummy.updateMatrix();
      roadSurfaces.push(dummy.matrix.clone());

      // Centerline & Edge Lines
      const margin = 5.0; // Stop markings 5m before intersection to leave clear room for crosswalk & stop bar
      const markLength = Math.max(1, seg.length - margin * 2);

      if (seg.orientation === 'north-south') {
        // Double yellow centerline (two 0.12m lines with 0.12m gap)
        const offset = 0.10;
        dummy.position.set(seg.center[0] - offset, elevations.markings, seg.center[1]);
        dummy.rotation.set(-Math.PI / 2, 0, 0);
        dummy.scale.set(0.12, markLength, 1);
        dummy.updateMatrix();
        yellowDoubleCenterlines.push(dummy.matrix.clone());

        dummy.position.set(seg.center[0] + offset, elevations.markings, seg.center[1]);
        dummy.updateMatrix();
        yellowDoubleCenterlines.push(dummy.matrix.clone());

        // Solid white edge lines (0.15m wide at distance 4.65m from centerline, strictly stopped before crosswalks)
        const edgeX = seg.width / 2 - 0.35;
        dummy.position.set(seg.center[0] - edgeX, elevations.markings, seg.center[1]);
        dummy.scale.set(0.15, markLength, 1);
        dummy.updateMatrix();
        whiteEdgeLines.push(dummy.matrix.clone());

        dummy.position.set(seg.center[0] + edgeX, elevations.markings, seg.center[1]);
        dummy.updateMatrix();
        whiteEdgeLines.push(dummy.matrix.clone());
      } else {
        // East-West Road Segment
        const offset = 0.10;
        dummy.position.set(seg.center[0], elevations.markings, seg.center[1] - offset);
        dummy.rotation.set(-Math.PI / 2, 0, 0);
        dummy.scale.set(markLength, 0.12, 1);
        dummy.updateMatrix();
        yellowDoubleCenterlines.push(dummy.matrix.clone());

        dummy.position.set(seg.center[0], elevations.markings, seg.center[1] + offset);
        dummy.updateMatrix();
        yellowDoubleCenterlines.push(dummy.matrix.clone());

        // White edge lines (strictly stopped before crosswalks)
        const edgeZ = seg.width / 2 - 0.35;
        dummy.position.set(seg.center[0], elevations.markings, seg.center[1] - edgeZ);
        dummy.scale.set(markLength, 0.15, 1);
        dummy.updateMatrix();
        whiteEdgeLines.push(dummy.matrix.clone());

        dummy.position.set(seg.center[0], elevations.markings, seg.center[1] + edgeZ);
        dummy.updateMatrix();
        whiteEdgeLines.push(dummy.matrix.clone());
      }
    });

    // 2. Intersections (Asphalt square at Y = 0.02m)
    intersections.forEach((inter) => {
      dummy.position.set(inter.center[0], elevations.road, inter.center[1]);
      dummy.rotation.set(-Math.PI / 2, 0, 0);
      dummy.scale.set(inter.size, inter.size, 1);
      dummy.updateMatrix();
      intersectionSurfaces.push(dummy.matrix.clone());
    });

    // 3. Sidewalk Plinths (Raised 0.18m box plinth at Y = 0.10m, top surface Y = 0.20m)
    // Only for non-protected background blocks (central district has its own detailed Sidewalk component)
    blocks.forEach((b) => {
      if (b.isProtectedDistrict) return;

      const w = b.outerBounds.maxX - b.outerBounds.minX; // 30.0m
      const d = b.outerBounds.maxZ - b.outerBounds.minZ; // 30.0m

      dummy.position.set(b.center[0], elevations.curbTop / 2, b.center[1]);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(w, elevations.curbTop, d);
      dummy.updateMatrix();
      sidewalkPlinths.push(dummy.matrix.clone());

      // Perimeter Granite Curbs for outer block (0.16m thickness, 0.20m height)
      const curbThick = 0.16;
      const curbH = elevations.curbTop;
      const curbY = curbH / 2;

      // North & South curbs
      dummy.position.set(b.center[0], curbY, b.outerBounds.minZ + curbThick / 2);
      dummy.scale.set(w, curbH, curbThick);
      dummy.updateMatrix();
      graniteCurbs.push(dummy.matrix.clone());

      dummy.position.set(b.center[0], curbY, b.outerBounds.maxZ - curbThick / 2);
      dummy.updateMatrix();
      graniteCurbs.push(dummy.matrix.clone());

      // West & East curbs
      dummy.position.set(b.outerBounds.minX + curbThick / 2, curbY, b.center[1]);
      dummy.scale.set(curbThick, curbH, d - curbThick * 2);
      dummy.updateMatrix();
      graniteCurbs.push(dummy.matrix.clone());

      dummy.position.set(b.outerBounds.maxX - curbThick / 2, curbY, b.center[1]);
      dummy.updateMatrix();
      graniteCurbs.push(dummy.matrix.clone());
    });

    // 4. Crosswalks (Continental Zebra Stripes & Stop Bars)
    crosswalks.forEach((cw) => {
      // Zebra stripes
      cw.stripes.forEach((st) => {
        dummy.position.set(st.center[0], elevations.markings, st.center[1]);
        dummy.rotation.set(-Math.PI / 2, 0, 0);
        dummy.scale.set(st.size[0], st.size[1], 1);
        dummy.updateMatrix();
        whiteCrosswalkStripes.push(dummy.matrix.clone());
      });

      // Stop Bar (Solid transverse white bar 0.45m wide)
      dummy.position.set(cw.stopBar.center[0], elevations.markings, cw.stopBar.center[1]);
      dummy.rotation.set(-Math.PI / 2, 0, 0);
      dummy.scale.set(cw.stopBar.size[0], cw.stopBar.size[1], 1);
      dummy.updateMatrix();
      whiteStopBars.push(dummy.matrix.clone());
    });

    return {
      roadSurfaces,
      intersectionSurfaces,
      sidewalkPlinths,
      graniteCurbs,
      yellowDoubleCenterlines,
      whiteEdgeLines,
      whiteCrosswalkStripes,
      whiteStopBars,
    };
  }, [blocks, intersections, roadSegments, crosswalks, elevations]);

  // Set matrices on InstancedMesh refs
  const roadRef = useRef<THREE.InstancedMesh>(null);
  const interRef = useRef<THREE.InstancedMesh>(null);
  const sidewalkRef = useRef<THREE.InstancedMesh>(null);
  const curbRef = useRef<THREE.InstancedMesh>(null);
  const yellowRef = useRef<THREE.InstancedMesh>(null);
  const edgeRef = useRef<THREE.InstancedMesh>(null);
  const stripeRef = useRef<THREE.InstancedMesh>(null);
  const stopBarRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const apply = (ref: React.RefObject<THREE.InstancedMesh | null>, matrices: THREE.Matrix4[]) => {
      if (!ref.current || matrices.length === 0) return;
      matrices.forEach((m, idx) => ref.current!.setMatrixAt(idx, m));
      ref.current.instanceMatrix.needsUpdate = true;
      ref.current.frustumCulled = false;
    };

    apply(roadRef, batches.roadSurfaces);
    apply(interRef, batches.intersectionSurfaces);
    apply(sidewalkRef, batches.sidewalkPlinths);
    apply(curbRef, batches.graniteCurbs);
    apply(yellowRef, batches.yellowDoubleCenterlines);
    apply(edgeRef, batches.whiteEdgeLines);
    apply(stripeRef, batches.whiteCrosswalkStripes);
    apply(stopBarRef, batches.whiteStopBars);
  }, [batches]);

  const planeGeo = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const boxGeo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  return (
    <group name="UnifiedCityRoads">
      {/* 1. Road Segments */}
      {batches.roadSurfaces.length > 0 && (
        <instancedMesh
          ref={roadRef}
          args={[planeGeo, asphaltMaterial, batches.roadSurfaces.length]}
          receiveShadow
          onClick={(e) => {
            if (onRoadClick && e.point) {
              e.stopPropagation();
              onRoadClick(e.point);
            }
          }}
        />
      )}

      {/* 2. Intersections */}
      {batches.intersectionSurfaces.length > 0 && (
        <instancedMesh
          ref={interRef}
          args={[planeGeo, asphaltMaterial, batches.intersectionSurfaces.length]}
          receiveShadow
          onClick={(e) => {
            if (onRoadClick && e.point) {
              e.stopPropagation();
              onRoadClick(e.point);
            }
          }}
        />
      )}

      {/* 3. Outer Block Sidewalk Plinths */}
      {batches.sidewalkPlinths.length > 0 && (
        <instancedMesh
          ref={sidewalkRef}
          args={[boxGeo, sidewalkMaterial, batches.sidewalkPlinths.length]}
          receiveShadow
        />
      )}

      {/* 3b. Outer Block Granite Curbs */}
      {batches.graniteCurbs.length > 0 && (
        <instancedMesh
          ref={curbRef}
          args={[boxGeo, curbGraniteMaterial, batches.graniteCurbs.length]}
          receiveShadow
        />
      )}

      {/* 4. Yellow Double Centerlines */}
      {batches.yellowDoubleCenterlines.length > 0 && (
        <instancedMesh
          ref={yellowRef}
          args={[planeGeo, yellowMarkingMaterial, batches.yellowDoubleCenterlines.length]}
        />
      )}

      {/* 5. White Edge Lines */}
      {batches.whiteEdgeLines.length > 0 && (
        <instancedMesh
          ref={edgeRef}
          args={[planeGeo, whiteMarkingMaterial, batches.whiteEdgeLines.length]}
        />
      )}

      {/* 6. Continental Crosswalk Stripes */}
      {batches.whiteCrosswalkStripes.length > 0 && (
        <instancedMesh
          ref={stripeRef}
          args={[planeGeo, whiteMarkingMaterial, batches.whiteCrosswalkStripes.length]}
        />
      )}

      {/* 7. Intersection Stop Bars */}
      {batches.whiteStopBars.length > 0 && (
        <instancedMesh
          ref={stopBarRef}
          args={[planeGeo, whiteMarkingMaterial, batches.whiteStopBars.length]}
        />
      )}
    </group>
  );
};


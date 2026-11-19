import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import {
  COASTLINE_VERTICES,
  WATER_ELEVATION,
  SEAWALL_TOP_ELEVATION,
  SEAWALL_BOTTOM_ELEVATION,
  PROMENADE_WIDTH,
  CoastlineVertex,
} from './islandCoastline';

/**
 * Phase 2.0.6 Realistic Waterfront Infrastructure & Marine Perimeter
 * 
 * Completely eliminates the artificial white perimeter outline and platform appearance:
 * - Urban Concrete Seawalls placed ONLY in the East Harbor and South Battery
 * - Natural Sloping Sandy Beach Cove in the Southwest (Y = 0.20m -> -1.60m)
 * - Clustered Granite Riprap Boulders along the Northwest Rocky Headland
 * - Low Natural Stone Riprap along the West & North Scenic Drives
 * - Weathered granite promenade pavers (matching city sidewalk tones, zero stark white)
 * - 8 Harbor Piers, Maritime Terminal, and Historic Battery Lighthouse
 */

export const WaterfrontPerimeter: React.FC = () => {
  // Shared materials for marine infrastructure
  const seawallMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#334155', // Weathered marine concrete / granite
      roughness: 0.90,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
  }, []);

  const promenadeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#52525b', // Architectural dark slate / granite pavers
      roughness: 0.82,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });
  }, []);

  const pierWoodMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#3e2723', // Weathered timber decking
      roughness: 0.92,
      metalness: 0.04,
    });
  }, []);

  const pilingMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#1e293b', // Creosote dark timber / steel pilings
      roughness: 0.85,
    });
  }, []);

  const sandMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#d4b996', // Coastal beach sand
      roughness: 0.96,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });
  }, []);

  const rockMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#3f3f46', // Granite riprap boulders
      roughness: 0.92,
      metalness: 0.05,
    });
  }, []);

  // 1. Generate Seawalls, Beach, Riprap, and Promenades per Zone
  const {
    seawallGeometry,
    promenadeGeometry,
    beachGeometry,
    riprapGeometry,
    boulderMatrices,
    bollardMatrices,
  } = useMemo(() => {
    const N = COASTLINE_VERTICES.length;

    // Seawall buffers
    const sPos: number[] = [];
    const sNorm: number[] = [];
    const sIdx: number[] = [];

    // Promenade walkway buffers
    const pPos: number[] = [];
    const pNorm: number[] = [];
    const pIdx: number[] = [];

    // Sandy beach buffers
    const bPos: number[] = [];
    const bNorm: number[] = [];
    const bIdx: number[] = [];

    // Riprap rock buffers
    const rPos: number[] = [];
    const rNorm: number[] = [];
    const rIdx: number[] = [];

    const boulders: THREE.Matrix4[] = [];
    const bollards: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();

    for (let i = 0; i < N; i++) {
      const v = COASTLINE_VERTICES[i];
      const nextV = COASTLINE_VERTICES[(i + 1) % N];

      if (v.zone === 'urban_seawall' || v.zone === 'battery_promenade') {
        // A. Urban Concrete Seawall: vertical drop from Y = 0.20m to Y = -2.40m
        const sBase = sPos.length / 3;
        sPos.push(
          v.x, SEAWALL_TOP_ELEVATION, v.z,
          v.x, SEAWALL_BOTTOM_ELEVATION, v.z,
          nextV.x, SEAWALL_TOP_ELEVATION, nextV.z,
          nextV.x, SEAWALL_BOTTOM_ELEVATION, nextV.z
        );
        sNorm.push(
          v.normalX, 0, v.normalZ,
          v.normalX, 0, v.normalZ,
          nextV.normalX, 0, nextV.normalZ,
          nextV.normalX, 0, nextV.normalZ
        );
        sIdx.push(
          sBase, sBase + 1, sBase + 2,
          sBase + 2, sBase + 1, sBase + 3
        );

        // Paved Promenade (12m wide, Y = 0.21m)
        const inX1 = v.x - v.normalX * PROMENADE_WIDTH;
        const inZ1 = v.z - v.normalZ * PROMENADE_WIDTH;
        const inX2 = nextV.x - nextV.normalX * PROMENADE_WIDTH;
        const inZ2 = nextV.z - nextV.normalZ * PROMENADE_WIDTH;

        const pBase = pPos.length / 3;
        pPos.push(
          v.x, SEAWALL_TOP_ELEVATION + 0.01, v.z,
          inX1, SEAWALL_TOP_ELEVATION + 0.01, inZ1,
          nextV.x, SEAWALL_TOP_ELEVATION + 0.01, nextV.z,
          inX2, SEAWALL_TOP_ELEVATION + 0.01, inZ2
        );
        pNorm.push(0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0);
        pIdx.push(
          pBase, pBase + 1, pBase + 2,
          pBase + 2, pBase + 1, pBase + 3
        );

        // Bollards along urban seawall
        if (i % 3 === 0) {
          dummy.position.set(v.x - v.normalX * 0.8, SEAWALL_TOP_ELEVATION + 0.35, v.z - v.normalZ * 0.8);
          dummy.scale.set(0.35, 0.70, 0.35);
          dummy.updateMatrix();
          bollards.push(dummy.matrix.clone());
        }
      } else if (v.zone === 'sandy_beach') {
        // B. Natural Sloping Sandy Beach Cove (Y = 0.20m -> -1.60m into water)
        // Extends 28m out into the shallow water
        const beachWidth = 28.0;
        const outX1 = v.x + v.normalX * beachWidth;
        const outZ1 = v.z + v.normalZ * beachWidth;
        const outX2 = nextV.x + nextV.normalX * beachWidth;
        const outZ2 = nextV.z + nextV.normalZ * beachWidth;

        const inX1 = v.x - v.normalX * 10.0;
        const inZ1 = v.z - v.normalZ * 10.0;
        const inX2 = nextV.x - nextV.normalX * 10.0;
        const inZ2 = nextV.z - nextV.normalZ * 10.0;

        const bBase = bPos.length / 3;
        // Upper shore to shallow seabed
        bPos.push(
          inX1, 0.20, inZ1,
          outX1, -1.60, outZ1,
          inX2, 0.20, inZ2,
          outX2, -1.60, outZ2
        );
        bNorm.push(
          0, 1, 0,
          v.normalX * 0.2, 0.95, v.normalZ * 0.2,
          0, 1, 0,
          nextV.normalX * 0.2, 0.95, nextV.normalZ * 0.2
        );
        bIdx.push(
          bBase, bBase + 1, bBase + 2,
          bBase + 2, bBase + 1, bBase + 3
        );
      } else {
        // C. Rocky Headland & Scenic Drive: Sloping riprap embankment
        const riprapWidth = 16.0;
        const outX1 = v.x + v.normalX * riprapWidth;
        const outZ1 = v.z + v.normalZ * riprapWidth;
        const outX2 = nextV.x + nextV.normalX * riprapWidth;
        const outZ2 = nextV.z + nextV.normalZ * riprapWidth;

        const rBase = rPos.length / 3;
        rPos.push(
          v.x, 0.20, v.z,
          outX1, -1.80, outZ1,
          nextV.x, 0.20, nextV.z,
          outX2, -1.80, outZ2
        );
        rNorm.push(
          v.normalX * 0.3, 0.9, v.normalZ * 0.3,
          v.normalX * 0.5, 0.8, v.normalZ * 0.5,
          nextV.normalX * 0.3, 0.9, nextV.normalZ * 0.3,
          nextV.normalX * 0.5, 0.8, nextV.normalZ * 0.5
        );
        rIdx.push(
          rBase, rBase + 1, rBase + 2,
          rBase + 2, rBase + 1, rBase + 3
        );

        // Clustered 3D boulders on rocky headland
        if (v.zone === 'rocky_headland' && i % 2 === 0) {
          const bScale = 2.0 + Math.sin(i * 13.7) * 1.2;
          dummy.position.set(v.x + v.normalX * (4.0 + Math.cos(i) * 3.0), -0.20, v.z + v.normalZ * (4.0 + Math.cos(i) * 3.0));
          dummy.rotation.set(Math.sin(i), Math.cos(i * 2), Math.sin(i * 3));
          dummy.scale.set(bScale, bScale * 0.8, bScale);
          dummy.updateMatrix();
          boulders.push(dummy.matrix.clone());
        }
      }
    }

    const sGeo = new THREE.BufferGeometry();
    if (sPos.length > 0) {
      sGeo.setAttribute('position', new THREE.Float32BufferAttribute(sPos, 3));
      sGeo.setAttribute('normal', new THREE.Float32BufferAttribute(sNorm, 3));
      sGeo.setIndex(sIdx);
    }

    const pGeo = new THREE.BufferGeometry();
    if (pPos.length > 0) {
      pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3));
      pGeo.setAttribute('normal', new THREE.Float32BufferAttribute(pNorm, 3));
      pGeo.setIndex(pIdx);
    }

    const bGeo = new THREE.BufferGeometry();
    if (bPos.length > 0) {
      bGeo.setAttribute('position', new THREE.Float32BufferAttribute(bPos, 3));
      bGeo.setAttribute('normal', new THREE.Float32BufferAttribute(bNorm, 3));
      bGeo.setIndex(bIdx);
    }

    const rGeo = new THREE.BufferGeometry();
    if (rPos.length > 0) {
      rGeo.setAttribute('position', new THREE.Float32BufferAttribute(rPos, 3));
      rGeo.setAttribute('normal', new THREE.Float32BufferAttribute(rNorm, 3));
      rGeo.setIndex(rIdx);
    }

    return {
      seawallGeometry: sGeo,
      promenadeGeometry: pGeo,
      beachGeometry: bGeo,
      riprapGeometry: rGeo,
      boulderMatrices: boulders,
      bollardMatrices: bollards,
    };
  }, []);

  // 2. Generate Harbor Piers, Terminal Silhouettes, and Lighthouse Beacon
  const { pierDecks, pilings, buildings } = useMemo(() => {
    const deckMatrices: THREE.Matrix4[] = [];
    const pileMatrices: THREE.Matrix4[] = [];
    const bldgMatrices: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();

    // 8 Selectively Placed Coastal Structures around the island
    const pierConfigs: [number, number, number, string][] = [
      [350, 22, 90, 'commercial'],  // Pier 17 (East River)
      [15, 20, 80, 'commercial'],   // Pier 15 (East River)
      [45, 18, 70, 'cargo'],        // Northeast Maritime Cargo Slip
      [95, 24, 115, 'battery'],     // South Battery Lookout Pier & Beacon
      [135, 18, 65, 'marina'],      // Southwest Marina Boardwalk
      [180, 20, 80, 'recreation'],  // West Hudson Recreation Pier
      [225, 16, 60, 'fishing'],     // Northwest Fishing Pier
      [285, 18, 75, 'lookout'],     // North Headland Observation Dock
    ];

    pierConfigs.forEach(([deg, width, length, type]) => {
      const v = COASTLINE_VERTICES[Math.floor((deg / 360) * COASTLINE_VERTICES.length)];
      if (!v) return;

      const rootX = v.x;
      const rootZ = v.z;
      const angle = Math.atan2(v.normalZ, v.normalX);

      const halfL = length / 2;
      const midX = rootX + v.normalX * halfL;
      const midZ = rootZ + v.normalZ * halfL;

      // 1. Pier Deck (sitting at Y = 0.35m)
      dummy.position.set(midX, 0.35, midZ);
      dummy.rotation.set(0, -angle + Math.PI / 2, 0);
      dummy.scale.set(width, 0.45, length);
      dummy.updateMatrix();
      deckMatrices.push(dummy.matrix.clone());

      // 2. Structural Pilings under pier
      const rows = Math.floor(length / 10);
      for (let r = 1; r <= rows; r++) {
        const pDist = r * 10 - 2;
        const px = rootX + v.normalX * pDist;
        const pz = rootZ + v.normalZ * pDist;

        [-width * 0.42, width * 0.42].forEach((offset) => {
          const perpX = -v.normalZ * offset;
          const perpZ = v.normalX * offset;
          dummy.position.set(px + perpX, -1.0, pz + perpZ);
          dummy.rotation.set(0, 0, 0);
          dummy.scale.set(0.65, 2.7, 0.65);
          dummy.updateMatrix();
          pileMatrices.push(dummy.matrix.clone());
        });
      }

      // 3. Pier landmark architecture
      if (type === 'commercial' || type === 'cargo') {
        const shedX = rootX + v.normalX * (length * 0.42);
        const shedZ = rootZ + v.normalZ * (length * 0.42);
        dummy.position.set(shedX, 3.0, shedZ);
        dummy.rotation.set(0, -angle + Math.PI / 2, 0);
        dummy.scale.set(width * 0.75, 5.0, length * 0.45);
        dummy.updateMatrix();
        bldgMatrices.push(dummy.matrix.clone());
      } else if (type === 'battery') {
        // Historic Harbor Beacon / Lighthouse at Battery Pier tip
        const tipX = rootX + v.normalX * (length - 8);
        const tipZ = rootZ + v.normalZ * (length - 8);
        dummy.position.set(tipX, 7.5, tipZ);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(4.5, 14.0, 4.5);
        dummy.updateMatrix();
        bldgMatrices.push(dummy.matrix.clone());
      }
    });

    return {
      pierDecks: deckMatrices,
      pilings: pileMatrices,
      buildings: bldgMatrices,
    };
  }, []);

  const boulderRef = useRef<THREE.InstancedMesh>(null);
  const bollardRef = useRef<THREE.InstancedMesh>(null);
  const pierDeckRef = useRef<THREE.InstancedMesh>(null);
  const pilingRef = useRef<THREE.InstancedMesh>(null);
  const buildingRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (boulderRef.current) {
      boulderMatrices.forEach((m, i) => boulderRef.current!.setMatrixAt(i, m));
      boulderRef.current.instanceMatrix.needsUpdate = true;
    }
    if (bollardRef.current) {
      bollardMatrices.forEach((m, i) => bollardRef.current!.setMatrixAt(i, m));
      bollardRef.current.instanceMatrix.needsUpdate = true;
    }
    if (pierDeckRef.current) {
      pierDecks.forEach((m, i) => pierDeckRef.current!.setMatrixAt(i, m));
      pierDeckRef.current.instanceMatrix.needsUpdate = true;
    }
    if (pilingRef.current) {
      pilings.forEach((m, i) => pilingRef.current!.setMatrixAt(i, m));
      pilingRef.current.instanceMatrix.needsUpdate = true;
    }
    if (buildingRef.current) {
      buildings.forEach((m, i) => buildingRef.current!.setMatrixAt(i, m));
      buildingRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [boulderMatrices, bollardMatrices, pierDecks, pilings, buildings]);

  return (
    <group name="WaterfrontInfrastructure">
      {/* 1. Urban Seawalls (East Harbor & South Battery only) */}
      {seawallGeometry.attributes.position && (
        <mesh
          geometry={seawallGeometry}
          material={seawallMaterial}
          receiveShadow
        />
      )}

      {/* 2. Paved Promenade Walkways */}
      {promenadeGeometry.attributes.position && (
        <mesh
          geometry={promenadeGeometry}
          material={promenadeMaterial}
          receiveShadow
        />
      )}

      {/* 3. Natural Sloping Sandy Beach Cove (Southwest) */}
      {beachGeometry.attributes.position && (
        <mesh
          geometry={beachGeometry}
          material={sandMaterial}
          receiveShadow
        />
      )}

      {/* 4. Natural Riprap Rock Embankment (West & North Shore) */}
      {riprapGeometry.attributes.position && (
        <mesh
          geometry={riprapGeometry}
          material={rockMaterial}
          receiveShadow
        />
      )}

      {/* 5. Clustered 3D Granite Boulders on Northwest Headland */}
      {boulderMatrices.length > 0 && (
        <instancedMesh
          ref={boulderRef}
          args={[new THREE.DodecahedronGeometry(1, 1), rockMaterial, boulderMatrices.length]}
          receiveShadow
        />
      )}

      {/* 6. Marine Promenade Bollards */}
      {bollardMatrices.length > 0 && (
        <instancedMesh
          ref={bollardRef}
          args={[new THREE.CylinderGeometry(0.3, 0.35, 1, 8), seawallMaterial, bollardMatrices.length]}
        />
      )}

      {/* 7. Harbor Pier Decks */}
      {pierDecks.length > 0 && (
        <instancedMesh
          ref={pierDeckRef}
          args={[new THREE.BoxGeometry(1, 1, 1), pierWoodMaterial, pierDecks.length]}
          receiveShadow
        />
      )}

      {/* 8. Structural Pier Pilings */}
      {pilings.length > 0 && (
        <instancedMesh
          ref={pilingRef}
          args={[new THREE.CylinderGeometry(0.5, 0.5, 1, 8), pilingMaterial, pilings.length]}
          receiveShadow
        />
      )}

      {/* 9. Dockside Terminals & Battery Lighthouse Silhouette */}
      {buildings.length > 0 && (
        <instancedMesh
          ref={buildingRef}
          args={[new THREE.BoxGeometry(1, 1, 1), seawallMaterial, buildings.length]}
          receiveShadow
          castShadow
        />
      )}
    </group>
  );
};

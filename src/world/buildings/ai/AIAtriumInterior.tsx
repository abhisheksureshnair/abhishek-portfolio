'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getSharedAIMaterials } from './AIMaterials';

interface AIAtriumInteriorProps {
  onNodeClick?: (nodeId: string) => void;
}

interface NeuralNode {
  id: string;
  pos: [number, number, number];
  layer: number;
  type: 'violet' | 'cyan';
}

interface NeuralSynapse {
  id: string;
  from: [number, number, number];
  to: [number, number, number];
}

/**
 * AIAtriumInterior (Phase 2.7)
 * Double-height research atrium featuring:
 * 1. Signature suspended 3D neural-network sculpture visible through the front glass
 * 2. 4-layer network topology (Input, Hidden 1, Hidden 2, Output) with pulsing synapsing connections
 * 3. Single lightweight useFrame animation loop (subtle undulation and orbital precession)
 * 4. Research telemetry consoles, computational server racks, and minimalist lounge
 */
export const AIAtriumInterior: React.FC<AIAtriumInteriorProps> = ({ onNodeClick }) => {
  const materials = getSharedAIMaterials();
  const networkGroupRef = useRef<THREE.Group>(null);

  // Generate 4-layer 3D neural network topology
  const { nodes, synapses } = useMemo(() => {
    const layerDefs = [
      { layer: 0, x: -2.4, yCount: 3, type: 'cyan' as const },
      { layer: 1, x: -0.8, yCount: 4, type: 'violet' as const },
      { layer: 2, x: 0.8, yCount: 4, type: 'violet' as const },
      { layer: 3, x: 2.4, yCount: 2, type: 'cyan' as const },
    ];

    const nodeList: NeuralNode[] = [];
    const layerNodes: [number, number, number][][] = [[], [], [], []];

    layerDefs.forEach(({ layer, x, yCount, type }) => {
      const ySpacing = 1.0;
      const yStart = -((yCount - 1) * ySpacing) / 2;

      for (let i = 0; i < yCount; i++) {
        const y = yStart + i * ySpacing;
        const z = (Math.sin(layer * 1.5 + i) * 0.4);
        const pos: [number, number, number] = [x, y, z];
        nodeList.push({ id: `node-${layer}-${i}`, pos, layer, type });
        layerNodes[layer].push(pos);
      }
    });

    const synapseList: NeuralSynapse[] = [];
    for (let l = 0; l < 3; l++) {
      const fromNodes = layerNodes[l];
      const toNodes = layerNodes[l + 1];

      fromNodes.forEach((from, fIdx) => {
        toNodes.forEach((to, tIdx) => {
          // Prune some connections for a cleaner, high-tech architectural wireframe look
          if ((fIdx + tIdx) % 2 === 0 || fIdx === tIdx) {
            synapseList.push({
              id: `syn-${l}-${fIdx}-${tIdx}`,
              from,
              to,
            });
          }
        });
      });
    }

    return { nodes: nodeList, synapses: synapseList };
  }, []);

  // Single unified lightweight frame update
  useFrame((state, delta) => {
    if (networkGroupRef.current) {
      // Gentle precession around Y
      networkGroupRef.current.rotation.y += delta * 0.25;
      // Subtle vertical breathing float
      networkGroupRef.current.position.y = 4.8 + Math.sin(state.clock.elapsedTime * 1.2) * 0.15;
    }
  });

  return (
    <group name="ai_atrium_interior" position={[0, 0, 0]}>
      {/* 1. Atrium Ground Floor */}
      <mesh position={[0, 0.28, 0]} receiveShadow>
        <cylinderGeometry args={[9.5, 9.5, 0.08, 32]} />
        <primitive object={materials.granitePodium} attach="material" />
      </mesh>

      {/* 2. Signature Suspended AI Neural-Network Sculpture (Section 5) */}
      <group position={[0, 4.8, -1.8]}>
        {/* Overhead suspension mount rod */}
        <mesh position={[0, 4.5, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 3.8, 8]} />
          <primitive object={materials.structuralSilver} attach="material" />
        </mesh>

        <group ref={networkGroupRef}>
          {/* Neural Nodes */}
          {nodes.map((node) => (
            <mesh key={node.id} position={node.pos}>
              <sphereGeometry args={[0.16, 12, 12]} />
              <primitive
                object={node.type === 'violet' ? materials.neuralNodeViolet : materials.neuralNodeCyan}
                attach="material"
              />
            </mesh>
          ))}

          {/* Synapses (Rendered as lightweight connecting cylinders) */}
          {synapses.map((syn) => {
            const vFrom = new THREE.Vector3(...syn.from);
            const vTo = new THREE.Vector3(...syn.to);
            const distance = vFrom.distanceTo(vTo);
            const mid = vFrom.clone().add(vTo).multiplyScalar(0.5);

            // Compute orientation quaternion
            const orientation = new THREE.Matrix4();
            orientation.lookAt(vFrom, vTo, new THREE.Vector3(0, 1, 0));
            const rot = new THREE.Euler().setFromRotationMatrix(orientation);

            return (
              <group key={syn.id} position={mid.toArray()} rotation={[rot.x + Math.PI / 2, rot.y, rot.z]}>
                <mesh>
                  <cylinderGeometry args={[0.015, 0.015, distance, 6]} />
                  <primitive object={materials.neuralSynapse} attach="material" />
                </mesh>
              </group>
            );
          })}

          {/* Surrounding Holographic Data Rings */}
          <mesh rotation={[0.4, 0.2, 0]}>
            <torusGeometry args={[3.2, 0.02, 8, 48]} />
            <primitive object={materials.violetAccentGlow} attach="material" />
          </mesh>
          <mesh rotation={[-0.4, 0.6, 0.3]}>
            <torusGeometry args={[3.5, 0.015, 8, 48]} />
            <primitive object={materials.cyanAccentGlow} attach="material" />
          </mesh>
        </group>
      </group>

      {/* 3. Research Lab Computation Servers & Consoles (Lobby Perimeter) */}
      <group position={[0, 0.3, -5.2]}>
        {/* Curved intelligence console */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[2.6, 2.8, 1.1, 24, 1, true, -Math.PI * 0.35, Math.PI * 0.7]} />
          <primitive object={materials.structuralTitanium} attach="material" />
        </mesh>
        {/* Console top */}
        <mesh position={[0, 1.12, 0]}>
          <cylinderGeometry args={[2.7, 2.7, 0.06, 24, 1, false, -Math.PI * 0.36, Math.PI * 0.72]} />
          <primitive object={materials.structuralSilver} attach="material" />
        </mesh>
        {/* Console glowing violet telemetry edge */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[2.82, 2.82, 0.04, 24, 1, true, -Math.PI * 0.35, Math.PI * 0.7]} />
          <primitive object={materials.violetAccentGlow} attach="material" />
        </mesh>
      </group>

      {/* Computational Server Racks against back wall */}
      {[-4.0, 4.0].map((x, idx) => (
        <group key={`rack-${idx}`} position={[x, 0.3, 3.5]}>
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[1.8, 3.0, 0.8]} />
            <primitive object={materials.structuralTitanium} attach="material" />
          </mesh>
          {/* Server status indicator lights */}
          <mesh position={[0, 1.5, 0.42]}>
            <planeGeometry args={[1.6, 2.6]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.65} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

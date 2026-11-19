import React from 'react';
import * as THREE from 'three';
import { getSharedInnovationMaterials } from './InnovationMaterials';
import { InnovationKiosks } from './InnovationKiosks';

interface InnovationInteriorProps {
  onSelectProject?: (projectId: string) => void;
}

export const InnovationInterior: React.FC<InnovationInteriorProps> = ({ onSelectProject }) => {
  const materials = getSharedInnovationMaterials();

  return (
    <group name="innovation_interior" position={[0, 0, 0]}>
      {/* 1. Polished Terrazzo Showroom Floor (Elevated to Y = 0.245m, top at Y = 0.255m) */}
      <mesh position={[0, 0.245, -0.5]} receiveShadow>
        <boxGeometry args={[21.0, 0.02, 17.0]} />
        <primitive object={materials.terrazzoFloor} attach="material" />
      </mesh>

      {/* 2. Soaring North Media Hologram Wall (Reference Image 4) */}
      <group position={[0, 4.8, -8.6]}>
        {/* Dark Backing Enclosure */}
        <mesh position={[0, 0, -0.1]} receiveShadow>
          <boxGeometry args={[16.0, 7.8, 0.2]} />
          <primitive object={materials.darkZinc} attach="material" />
        </mesh>

        {/* Luminous High-Tech Screen Surface */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[15.6, 7.4]} />
          <primitive object={materials.mediaWall} attach="material" />
        </mesh>

        {/* Outer Cyan Glowing Bezel Trim */}
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[15.8, 7.6]} />
          <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.65} />
        </mesh>
      </group>

      {/* 3. Floating Mezzanine Balcony & Observation Gallery (Reference Image 4) */}
      <group position={[0, 5.2, -4.5]}>
        {/* Mezzanine Walkway Deck */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[19.6, 0.35, 7.2]} />
          <primitive object={materials.darkZinc} attach="material" />
        </mesh>

        {/* Sculpted White Architectural Fascia Band (Reference Image 4) */}
        <mesh position={[0, -0.02, 3.62]}>
          <boxGeometry args={[19.6, 0.38, 0.08]} />
          <primitive object={materials.whiteLimestone} attach="material" />
        </mesh>

        {/* Glowing Linear LED Underside Edge Ribbon (Reference Image 4) */}
        <mesh position={[0, -0.20, 3.64]}>
          <boxGeometry args={[19.6, 0.08, 0.04]} />
          <primitive object={materials.neonRibbon} attach="material" />
        </mesh>

        {/* Clear Glass Balustrade on Mezzanine Edge */}
        <mesh position={[0, 0.65, 3.6]}>
          <boxGeometry args={[19.6, 0.95, 0.04]} />
          <primitive object={materials.atriumGlass} attach="material" />
        </mesh>
        {/* Stainless Steel Handrail */}
        <mesh position={[0, 1.15, 3.6]}>
          <boxGeometry args={[19.6, 0.05, 0.08]} />
          <primitive object={materials.stainlessSteel} attach="material" />
        </mesh>
      </group>

      {/* 4. Structural Cylindrical Columns (Stainless Steel) */}
      {[-7.5, 7.5].map((cx) => (
        <React.Fragment key={`column-${cx}`}>
          <mesh position={[cx, 4.2, 1.5]} receiveShadow>
            <cylinderGeometry args={[0.32, 0.32, 8.2, 20]} />
            <primitive object={materials.stainlessSteel} attach="material" />
          </mesh>
          <mesh position={[cx, 4.2, -5.5]} receiveShadow>
            <cylinderGeometry args={[0.32, 0.32, 8.2, 20]} />
            <primitive object={materials.stainlessSteel} attach="material" />
          </mesh>
        </React.Fragment>
      ))}

      {/* 5. Minimalist Architectural Reception Counter */}
      <group position={[0, 0.25, 4.5]}>
        <mesh position={[0, 0.55, 0]} receiveShadow>
          <boxGeometry args={[3.4, 1.1, 0.8]} />
          <primitive object={materials.whiteLimestone} attach="material" />
        </mesh>
        {/* Brushed Stainless Countertop */}
        <mesh position={[0, 1.12, 0]}>
          <boxGeometry args={[3.5, 0.04, 0.85]} />
          <primitive object={materials.stainlessSteel} attach="material" />
        </mesh>
        {/* Glowing Cyan LED Kickplate */}
        <mesh position={[0, 0.05, 0.41]}>
          <boxGeometry args={[3.2, 0.08, 0.04]} />
          <primitive object={materials.neonRibbon} attach="material" />
        </mesh>
      </group>

      {/* 6. Four Interactive Project Exhibition Kiosks */}
      <InnovationKiosks onSelectProject={onSelectProject} />

      {/* 7. Subtle Hospitality Atrium Point Light (Single budgeted light) */}
      <pointLight
        color="#38bdf8"
        intensity={2.2}
        distance={18.0}
        position={[0, 5.5, -1.0]}
      />
    </group>
  );
};

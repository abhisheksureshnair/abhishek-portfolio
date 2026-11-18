'use client';

import React from 'react';
import * as THREE from 'three';
import { getSharedAboutStudioMaterials } from './AboutStudioMaterials';

interface AboutStudioInteriorProps {
  visible?: boolean;
}

/**
 * AboutStudioInterior — Double-height contemporary exhibition gallery & media wall
 * Visible through the panoramic floor-to-ceiling glass facade.
 */
export const AboutStudioInterior: React.FC<AboutStudioInteriorProps> = ({ visible = true }) => {
  if (!visible) return null;

  const materials = getSharedAboutStudioMaterials();

  return (
    <group name="about_studio_interior" position={[0, 0.24, 0]}>
      {/* 1. Gallery Terrazzo Floor */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18.4, 18.4]} />
        <primitive object={materials.galleryTerrazzo} attach="material" />
      </mesh>

      {/* 2. Interactive Digital Media Wall (North Gallery Wall) */}
      <group position={[0, 2.4, -7.8]}>
        {/* Main Media Screen Frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[7.2, 3.2, 0.15]} />
          <primitive object={materials.structuralBronze} attach="material" />
        </mesh>

        {/* Illuminated Screen Panel */}
        <mesh position={[0, 0, 0.08]}>
          <planeGeometry args={[6.8, 2.8]} />
          <primitive object={materials.mediaScreen} attach="material" />
        </mesh>

        {/* 3 Active Display Cards on Media Wall */}
        {[-2.0, 0, 2.0].map((xOffset, idx) => (
          <group key={idx} position={[xOffset, 0, 0.1]}>
            <mesh>
              <planeGeometry args={[1.7, 2.2]} />
              <meshBasicMaterial
                color={idx === 0 ? '#38bdf8' : idx === 1 ? '#f97316' : '#10b981'}
                transparent
                opacity={0.35}
              />
            </mesh>
            <mesh position={[0, 0.9, 0.01]}>
              <planeGeometry args={[1.5, 0.18]} />
              <meshBasicMaterial
                color={idx === 0 ? '#38bdf8' : idx === 1 ? '#f97316' : '#10b981'}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* 3. Developer Journey Exhibition Pedestals (5 Stages) */}
      {[-4.8, -2.4, 0, 2.4, 4.8].map((xPos, idx) => {
        const colors = ['#38bdf8', '#00f0ff', '#f97316', '#10b981', '#a855f7'];
        return (
          <group key={idx} position={[xPos, 0, -2.5]}>
            {/* White pedestal base */}
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.38, 0.44, 1.0, 16]} />
              <primitive object={materials.limestoneWall} attach="material" />
            </mesh>

            {/* Bronze display cap */}
            <mesh position={[0, 1.02, 0]}>
              <cylinderGeometry args={[0.42, 0.42, 0.05, 16]} />
              <primitive object={materials.structuralBronze} attach="material" />
            </mesh>

            {/* Glowing stage acrylic artifact */}
            <mesh position={[0, 1.25, 0]}>
              <boxGeometry args={[0.32, 0.42, 0.08]} />
              <meshStandardMaterial
                color={colors[idx]}
                emissive={colors[idx]}
                emissiveIntensity={1.4}
                roughness={0.2}
                transparent
                opacity={0.88}
              />
            </mesh>

            {/* Halo ring light on floor */}
            <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.5, 0.62, 24]} />
              <meshBasicMaterial
                color={colors[idx]}
                transparent
                opacity={0.4}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}

      {/* 4. Reception & Welcome Lounge Console */}
      <group position={[0, 0.5, 3.5]}>
        {/* Curving reception desk */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.2, 1.0, 0.9]} />
          <primitive object={materials.limestoneWall} attach="material" />
        </mesh>
        <mesh position={[0, 0.52, 0]}>
          <boxGeometry args={[3.3, 0.06, 0.95]} />
          <primitive object={materials.timberScreenSlat} attach="material" />
        </mesh>
        {/* Amber accent trim */}
        <mesh position={[0, -0.4, 0.46]}>
          <planeGeometry args={[3.0, 0.08]} />
          <primitive object={materials.signageGlow} attach="material" />
        </mesh>
      </group>

      {/* 5. Architectural Indoor Planters with Foliage */}
      {[-6.2, 6.2].map((xPos, idx) => (
        <group key={idx} position={[xPos, 0, 2.0]}>
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[1.2, 0.7, 3.6]} />
            <primitive object={materials.limestoneWall} attach="material" />
          </mesh>
          <mesh position={[0, 0.72, 0]}>
            <boxGeometry args={[1.0, 0.05, 3.4]} />
            <meshStandardMaterial color="#2d3748" roughness={0.9} />
          </mesh>
          {/* Foliage spheres */}
          {[-1.2, -0.4, 0.4, 1.2].map((zOffset, fIdx) => (
            <mesh key={fIdx} position={[0, 1.15, zOffset]}>
              <sphereGeometry args={[0.38, 8, 8]} />
              <meshStandardMaterial color="#15803d" roughness={0.7} />
            </mesh>
          ))}
        </group>
      ))}

      {/* 6. Linear Recessed Downlight Slats in Ceiling */}
      {[-4.0, -1.5, 1.5, 4.0].map((xPos, idx) => (
        <mesh key={idx} position={[xPos, 4.6, -1.0]}>
          <boxGeometry args={[0.15, 0.04, 10.0]} />
          <primitive object={materials.recessedLightSlat} attach="material" />
        </mesh>
      ))}
    </group>
  );
};

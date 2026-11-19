'use client';

import React, { useState } from 'react';
import * as THREE from 'three';
import { getSharedSkillsMaterials } from './SkillsMaterials';
import { SKILLS_TOWER_METADATA } from './skillsMetadata';

interface SkillsLobbyInteriorProps {
  onSelectFloor?: (floorNumber: number) => void;
  onInteract?: () => void;
}

export const SkillsLobbyInterior: React.FC<SkillsLobbyInteriorProps> = ({
  onSelectFloor,
  onInteract,
}) => {
  const materials = getSharedSkillsMaterials();
  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null);

  const handleConsoleClick = (e: any) => {
    e.stopPropagation();
    if (onInteract) onInteract();
    else if (onSelectFloor) onSelectFloor(1);
  };

  return (
    <group name="skills_lobby_interior" position={[0, 0, 0]}>
      {/* 1. Polished Terrazzo Showroom Floor (Elevated to Y = 0.245m, top at Y = 0.255m) */}
      <mesh position={[0, 0.245, 0]} receiveShadow>
        <boxGeometry args={[21.0, 0.02, 21.0]} />
        <primitive object={materials.terrazzoFloor} attach="material" />
      </mesh>

      {/* 2. Soaring West Technology Directory Wall Display */}
      {/* Positioned on the West interior wall (facing incoming visitors from the East entrance) */}
      <group position={[-9.8, 4.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Dark Backing Panel */}
        <mesh position={[0, 0, -0.08]} receiveShadow>
          <boxGeometry args={[14.4, 7.2, 0.16]} />
          <primitive object={materials.darkMullions} attach="material" />
        </mesh>

        {/* High-Resolution Interactive Screen */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[14.0, 6.8]} />
          <primitive object={materials.directoryScreen} attach="material" />
        </mesh>

        {/* Outer Emerald Neon Frame */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[14.15, 6.95]} />
          <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.65} />
        </mesh>
      </group>

      {/* 3. Interactive Technology Pedestal Console (Center Lobby) */}
      <group
        position={[-2.5, 0.255, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={handleConsoleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredFloor(1);
          if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredFloor(null);
          if (typeof document !== 'undefined') document.body.style.cursor = 'auto';
        }}
      >
        {/* Base Plinth */}
        <mesh position={[0, 0.04, 0]} receiveShadow>
          <cylinderGeometry args={[1.2, 1.3, 0.08, 24]} />
          <primitive object={materials.darkMullions} attach="material" />
        </mesh>

        {/* Glowing Emerald Floor Halo Ring */}
        <mesh position={[0, 0.085, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.15, 1.35, 32]} />
          <meshBasicMaterial
            color="#10b981"
            transparent
            opacity={hoveredFloor !== null ? 0.95 : 0.6}
          />
        </mesh>

        {/* Pedestal Stem */}
        <mesh position={[0, 0.55, 0]} receiveShadow>
          <boxGeometry args={[0.7, 0.95, 0.35]} />
          <primitive object={materials.stainlessSteel} attach="material" />
        </mesh>

        {/* Angled Touch Console */}
        <group position={[0, 1.05, 0]} rotation={[-Math.PI / 6, 0, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[1.6, 1.1, 0.08]} />
            <primitive object={materials.darkMullions} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.045]}>
            <planeGeometry args={[1.52, 1.02]} />
            <primitive object={materials.directoryScreen} attach="material" />
          </mesh>
          {hoveredFloor !== null && (
            <mesh position={[0, 0, 0.048]}>
              <planeGeometry args={[1.54, 1.04]} />
              <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.8} />
            </mesh>
          )}
        </group>
      </group>

      {/* 4. Floating Mezzanine Balcony & Observation Gallery */}
      <group position={[0, 5.2, 0]}>
        {/* Mezzanine Walkway Rim Deck */}
        <mesh position={[-4.5, 0, 0]} receiveShadow>
          <boxGeometry args={[10.5, 0.35, 19.6]} />
          <primitive object={materials.darkMullions} attach="material" />
        </mesh>

        {/* Sculpted White Architectural Fascia Band */}
        <mesh position={[0.8, -0.02, 0]}>
          <boxGeometry args={[0.10, 0.38, 19.6]} />
          <primitive object={materials.whiteLimestone} attach="material" />
        </mesh>

        {/* Glowing Cyan LED Edge Ribbon */}
        <mesh position={[0.86, -0.20, 0]}>
          <boxGeometry args={[0.04, 0.08, 19.6]} />
          <primitive object={materials.cyanAccent} attach="material" />
        </mesh>

        {/* Clear Glass Balustrade on Mezzanine Edge */}
        <mesh position={[0.8, 0.65, 0]}>
          <boxGeometry args={[0.04, 0.95, 19.6]} />
          <primitive object={materials.lobbyGlass} attach="material" />
        </mesh>
        {/* Stainless Steel Handrail */}
        <mesh position={[0.8, 1.15, 0]}>
          <boxGeometry args={[0.08, 0.05, 19.6]} />
          <primitive object={materials.stainlessSteel} attach="material" />
        </mesh>
      </group>

      {/* 5. Structural Cylindrical Columns (Stainless Steel) */}
      {[-6.5, 4.5].map((cx) =>
        [-6.5, 6.5].map((cz) => (
          <mesh
            key={`column-${cx}-${cz}`}
            position={[cx, 4.2, cz]}
            receiveShadow
          >
            <cylinderGeometry args={[0.30, 0.30, 8.4, 20]} />
            <primitive object={materials.stainlessSteel} attach="material" />
          </mesh>
        ))
      )}

      {/* 6. Minimalist Architectural Reception Counter */}
      <group position={[3.0, 0.255, -4.5]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 0.55, 0]} receiveShadow>
          <boxGeometry args={[3.4, 1.1, 0.8]} />
          <primitive object={materials.whiteLimestone} attach="material" />
        </mesh>
        <mesh position={[0, 1.12, 0]}>
          <boxGeometry args={[3.5, 0.04, 0.85]} />
          <primitive object={materials.stainlessSteel} attach="material" />
        </mesh>
        <mesh position={[0, 0.05, 0.41]}>
          <boxGeometry args={[3.2, 0.08, 0.04]} />
          <primitive object={materials.cyanAccent} attach="material" />
        </mesh>
      </group>

      {/* 7. Subtle Hospitality Lobby Point Light (Single budgeted light) */}
      <pointLight
        color="#38bdf8"
        intensity={2.0}
        distance={18.0}
        position={[0, 5.5, 0]}
      />
    </group>
  );
};

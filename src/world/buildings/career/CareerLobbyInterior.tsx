import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getSharedCareerMaterials } from './CareerMaterials';

interface CareerLobbyInteriorProps {
  onInteract?: () => void;
}

/**
 * Signature Double-Height Entrance Lobby Interior for Career & Experience Center
 * 
 * Features:
 * 1. Warm Acoustic Timber Slat Ceiling Grid (Inspired by Reference Photo Atrium)
 * 2. Signature Illuminated Vertical Career Timeline Display:
 *    - 7.2m glass and dark bronze architectural pylon with vertical light spine
 *    - Illuminated milestone rings marking career progression (2020 -> Present)
 * 3. Polished terrazzo atrium floor with recessed floor luminaires
 * 4. Indoor architectural landscaping box with greenery
 * 5. Minimalist executive reception console
 */
export const CareerLobbyInterior: React.FC<CareerLobbyInteriorProps> = ({ onInteract }) => {
  const materials = useMemo(() => getSharedCareerMaterials(), []);

  // Timeline milestone ring elevations along the 7.2m vertical column
  const timelineMilestones = useMemo(
    () => [
      { y: 1.2, label: '2020: B.Sc. Foundations', color: '#38bdf8' },
      { y: 2.4, label: '2023: InnSpark Software Developer', color: '#ec4899' },
      { y: 3.6, label: '2023-24: VTS & Telemedicine IoT', color: '#06b6d4' },
      { y: 4.8, label: '2024: SafeNet & AI Applications', color: '#10b981' },
      { y: 6.0, label: '2026: MCA (72%) & Full-Stack', color: '#a855f7' },
      { y: 6.9, label: 'Present: 3.6 Yrs Software Dev', color: '#38bdf8' },
    ],
    []
  );

  return (
    <group name="career_lobby_interior">
      {/* 1. Polished Terrazzo Atrium Floor (y = 0.25m) */}
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <boxGeometry args={[11.6, 0.02, 16.4]} />
        <primitive object={materials.terrazzoFloor} attach="material" />
      </mesh>

      {/* 2. Warm Acoustic Timber Slat Ceiling Grid (at Y = 8.1m) */}
      <mesh position={[0, 8.12, 0]}>
        <boxGeometry args={[11.8, 0.04, 16.6]} />
        <primitive object={materials.acousticWoodSoffit} attach="material" />
      </mesh>

      {/* Horizontal Timber Louver Beams (Ref Photo) */}
      {[-4, -2, 0, 2, 4].map((lx) => (
        <mesh key={`ceiling-louver-${lx}`} position={[lx, 8.04, 0]}>
          <boxGeometry args={[0.16, 0.12, 16.4]} />
          <primitive object={materials.darkBronzeFrame} attach="material" />
        </mesh>
      ))}

      {/* 3. SIGNATURE VERTICAL ILLUMINATED CAREER TIMELINE FEATURE */}
      {/* Positioned prominently at center-back of the glass atrium [X = 0, Z = -3.5] */}
      <group position={[0, 0.26, -3.5]} onClick={onInteract}>
        {/* Blackened Bronze Base Plinth */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[1.4, 1.5, 0.50, 24]} />
          <primitive object={materials.darkBronzeFrame} attach="material" />
        </mesh>

        {/* Central Vertical Structural Core Column */}
        <mesh position={[0, 3.8, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 7.2, 16]} />
          <primitive object={materials.warmMullions} attach="material" />
        </mesh>

        {/* Outer Monolithic Transparent Glass Pylon Enclosure */}
        <mesh position={[0, 3.8, 0]}>
          <cylinderGeometry args={[0.95, 0.95, 7.2, 24, 1, true]} />
          <primitive object={materials.timelineGlass} attach="material" />
        </mesh>

        {/* Continuous Vertical Emissive Light Ribbon Spine */}
        <mesh position={[0, 3.8, 0.24]}>
          <boxGeometry args={[0.04, 7.2, 0.02]} />
          <primitive object={materials.timelineGlow} attach="material" />
        </mesh>

        {/* Illuminated Career Milestone Rings */}
        {timelineMilestones.map((ms, idx) => (
          <group key={`milestone-ring-${idx}`} position={[0, ms.y, 0]}>
            {/* Glowing Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.92, 0.035, 8, 24]} />
              <meshStandardMaterial
                color={ms.color}
                emissive={ms.color}
                emissiveIntensity={2.4}
                roughness={0.2}
              />
            </mesh>
            {/* Core Node Marker */}
            <mesh position={[0, 0, 0.28]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <primitive object={materials.timelineNodeActive} attach="material" />
            </mesh>
          </group>
        ))}

        {/* Pylon Crown Cap */}
        <mesh position={[0, 7.42, 0]}>
          <cylinderGeometry args={[1.1, 1.1, 0.08, 24]} />
          <primitive object={materials.darkBronzeFrame} attach="material" />
        </mesh>
      </group>

      {/* 4. Minimalist Executive Reception Console */}
      <group position={[0, 0.26, 2.5]}>
        {/* Main Travertine Counter Body */}
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[3.8, 1.10, 0.90]} />
          <primitive object={materials.travertineBase} attach="material" />
        </mesh>
        {/* Dark Bronze Countertop */}
        <mesh position={[0, 1.12, 0]}>
          <boxGeometry args={[3.9, 0.04, 0.95]} />
          <primitive object={materials.darkBronzeFrame} attach="material" />
        </mesh>
        {/* Subtle Undercounter Accent Light */}
        <mesh position={[0, 0.04, 0.46]}>
          <boxGeometry args={[3.6, 0.03, 0.02]} />
          <primitive object={materials.timelineGlow} attach="material" />
        </mesh>
      </group>

      {/* 5. Indoor Architectural Landscaping Planters with Greenery */}
      {[-3.6, 3.6].map((px) => (
        <group key={`indoor-planter-${px}`} position={[px, 0.26, -0.5]}>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[1.8, 0.50, 4.2]} />
            <primitive object={materials.darkBronzeFrame} attach="material" />
          </mesh>
          <mesh position={[0, 0.52, 0]}>
            <boxGeometry args={[1.6, 0.12, 4.0]} />
            <meshStandardMaterial color="#14532d" roughness={0.8} />
          </mesh>
          {/* Ficus foliage clusters */}
          {[-1.2, 0, 1.2].map((fz) => (
            <mesh key={`foliage-${fz}`} position={[0, 1.2, fz]}>
              <sphereGeometry args={[0.55, 8, 8]} />
              <meshStandardMaterial color="#166534" roughness={0.7} />
            </mesh>
          ))}
        </group>
      ))}

      {/* 6. Structural Colonnade Pilotis Columns Flanking the Atrium */}
      {[-4.8, 4.8].map((cx) => (
        <React.Fragment key={`atrium-col-${cx}`}>
          <mesh position={[cx, 4.2, -4.5]}>
            <cylinderGeometry args={[0.32, 0.32, 8.0, 16]} />
            <primitive object={materials.darkBronzeFrame} attach="material" />
          </mesh>
          <mesh position={[cx, 4.2, 4.5]}>
            <cylinderGeometry args={[0.32, 0.32, 8.0, 16]} />
            <primitive object={materials.darkBronzeFrame} attach="material" />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
};

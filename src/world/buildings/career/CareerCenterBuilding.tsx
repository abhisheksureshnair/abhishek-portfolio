'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getSharedCareerMaterials } from './CareerMaterials';
import { CareerLobbyInterior } from './CareerLobbyInterior';
import { CAREER_CENTER_METADATA } from './careerMetadata';
import { BuildingSignage } from '../signage/BuildingSignage';
import { StreetDirectoryBoard } from '../signage/StreetDirectoryBoard';
import { useWorldStore, worldStore } from '../../stores/worldStore';
import { useLandmarkInteriorLOD } from '../landmarkLod';

interface CareerCenterBuildingProps {
  position?: [number, number, number];
  onInteract?: () => void;
}

/**
 * PHASE 2.4 — Career & Experience Center
 * 
 * Distinctive 8-storey corporate headquarters located at [40, 0] (block-1-2):
 * - Faithful to reference photo (media_1794757027497_04a68104.jpg):
 *   1. Symmetrical corporate architecture with North & South office wings
 *   2. Central 4-storey transparent glass atrium with warm acoustic timber ceiling grid
 *   3. Signature illuminated vertical career timeline display in the lobby
 *   4. Dark bronze architectural window framing, horizontal spandrel bands, vertical mullions
 *   5. West cantilevered entrance portal canopy facing Central Avenue with dimensional signage:
 *      "CAREER & EXPERIENCE CENTER // SOFTWARE ENGINEERING • PROFESSIONAL JOURNEY"
 *   6. Street-level physical directory board on the sidewalk
 *   7. Stepped rooftop terrace with clean parapets (zero spires or floating boxes)
 *   8. Built-in LOD optimization for solid 60+ FPS performance
 */
export const CareerCenterBuilding: React.FC<CareerCenterBuildingProps> = ({
  position = [40.0, 0, 0.0],
  onInteract,
}) => {
  const materials = getSharedCareerMaterials();
  const selectedLandmark = useWorldStore((s) => s.selectedLandmark);
  const hoveredLandmark = useWorldStore((s) => s.hoveredLandmark);
  const cameraPreset = useWorldStore((s) => s.cameraPreset);

  const isSelected = selectedLandmark === 'career';
  const isHovered = hoveredLandmark === 'career';
  const showInterior = useLandmarkInteriorLOD([position[0], position[2]], 'career');
  const isFarView = !showInterior;

  const handleBuildingClick = (e: any) => {
    e.stopPropagation();
    worldStore.getState().setSelectedLandmark('career');
    worldStore.getState().setCameraView('orbit', 'career_three_quarter');
    if (onInteract) onInteract();
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    worldStore.getState().setHoveredLandmark('career');
  };

  const handlePointerOut = () => {
    worldStore.getState().setHoveredLandmark(null);
  };

  // 8 Floors elevations: Ground (0.24m - 4.4m), Storeys 1-7 (each 4.2m) up to 34.8m
  const wingFloors = useMemo(
    () => [
      { num: 1, y: 4.4 },
      { num: 2, y: 8.6 },
      { num: 3, y: 12.8 },
      { num: 4, y: 17.0 },
      { num: 5, y: 21.2 },
      { num: 6, y: 25.4 },
      { num: 7, y: 29.6 },
    ],
    []
  );

  return (
    <group
      name="portfolio_career_center"
      position={position}
      onClick={handleBuildingClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Selection / Hover Outline Highlight Box */}
      {(isSelected || isHovered) && (
        <group position={[0, 0.26, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[24.2, 24.2]} />
            <meshBasicMaterial
              color={isSelected ? '#f59e0b' : '#fbbf24'}
              wireframe
              transparent
              opacity={isSelected ? 0.9 : 0.45}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(24.0, 0.12, 24.0)]} />
            <lineBasicMaterial
              color={isSelected ? '#f59e0b' : '#fbbf24'}
              linewidth={2}
              transparent
              opacity={isSelected ? 1.0 : 0.6}
            />
          </lineSegments>
        </group>
      )}

      {/* ======================================================== */}
      {/* 1. PLINTH FOUNDATION & WEST FORECOURT ENTRANCE TERRACE   */}
      {/* Footprint: [-11.8, 11.8] x [-11.8, 11.8]                 */}
      {/* ======================================================== */}
      {/* Main Base Plinth (Top at Y = 0.24m, 4cm step above 0.20m sidewalk) */}
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[23.6, 0.24, 23.6]} />
        <primitive object={materials.travertineBase} attach="material" />
      </mesh>

      {/* West Entrance Granite Paved Plaza (Facing Central Avenue: X in [-11.8, -6.5]) */}
      <mesh position={[-9.15, 0.245, 0]} receiveShadow>
        <boxGeometry args={[5.3, 0.01, 23.2]} />
        <primitive object={materials.granitePavers} attach="material" />
      </mesh>

      {/* West Forecourt Manicured Boxwood Planters (Flanking Entrance) */}
      {[-7.8, 7.8].map((pz) => (
        <group key={`career-planter-${pz}`} position={[-9.0, 0.24, pz]}>
          <mesh position={[0, 0.18, 0]} receiveShadow>
            <boxGeometry args={[3.6, 0.36, 6.2]} />
            <primitive object={materials.whiteLimestone} attach="material" />
          </mesh>
          <mesh position={[0, 0.38, 0]}>
            <boxGeometry args={[3.2, 0.20, 5.8]} />
            <meshStandardMaterial color="#166534" roughness={0.75} />
          </mesh>
        </group>
      ))}

      {/* ======================================================== */}
      {/* 2. CENTRAL TRANSPARENT GLASS ATRIUM (LOD-managed)        */}
      {/* Linking the North and South Wings (Z in [-4.5, 4.5])     */}
      {/* ======================================================== */}
      {showInterior && <CareerLobbyInterior onInteract={onInteract} />}

      {/* Central Atrium Front West Glass Curtain Wall Facade (X = -6.5, Z in [-4.5, 4.5]) */}
      <group position={[-6.5, 4.3, 0]}>
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[0.08, 8.2, 9.0]} />
          <primitive object={materials.atriumClearGlass} attach="material" />
        </mesh>
        {/* Atrium Vertical Structural Mullions */}
        {[-3.0, -1.0, 1.0, 3.0].map((mz) => (
          <mesh key={`atrium-mullion-${mz}`} position={[0.05, 0, mz]}>
            <boxGeometry args={[0.12, 8.2, 0.12]} />
            <primitive object={materials.darkBronzeFrame} attach="material" />
          </mesh>
        ))}
      </group>

      {/* ======================================================== */}
      {/* 3. WEST ENTRANCE PORTAL & CANTILEVERED CANOPY            */}
      {/* Projects Westward toward Central Avenue at X = -6.5      */}
      {/* ======================================================== */}
      <group position={[-6.5, 0.24, 0]}>
        {/* Cantilevered Entrance Canopy (Projects from X = -6.5 to X = -9.8, depth 3.3m) */}
        <mesh position={[-1.65, 4.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.3, 0.32, 9.6]} />
          <primitive object={materials.canopyTrim} attach="material" />
        </mesh>

        {/* Acoustic Timber Slat Soffit Underside */}
        <mesh position={[-1.65, 4.02, 0]}>
          <boxGeometry args={[3.1, 0.02, 9.4]} />
          <primitive object={materials.acousticWoodSoffit} attach="material" />
        </mesh>

        {/* Underside Recessed Downlights (LOD) */}
        {!isFarView && [-3, -1, 1, 3].map((lz) => (
          <mesh key={`career-light-${lz}`} position={[-1.65, 4.01, lz]}>
            <cylinderGeometry args={[0.12, 0.12, 0.02, 12]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.8} />
          </mesh>
        ))}

        {/* Primary West Entrance Dimensional Signage (Canopy Header) */}
        <BuildingSignage
          title="CAREER & EXPERIENCE CENTER"
          subtitle="SOFTWARE ENGINEERING • PROFESSIONAL JOURNEY"
          position={[-3.32, 4.2, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          width={9.2}
          height={0.42}
          mountingStyle="canopy-fascia"
          panelColor="#090d16"
          titleColor="#ffffff"
          subtitleColor="#ec4899"
          emissiveColor="#ec4899"
          emissiveIntensity={1.8}
          fontSize={0.20}
          subtitleFontSize={0.09}
        />

        {/* Double Revolving & Sliding Glass Doors Assembly (LOD) */}
        {!isFarView && (
          <group position={[0, 1.6, 0]}>
            {/* Left Glazed Entrance Lite */}
            <mesh position={[0, 0, -2.4]}>
              <boxGeometry args={[0.06, 3.2, 2.0]} />
              <primitive object={materials.atriumClearGlass} attach="material" />
            </mesh>
            {/* Center Revolving Portal Drum */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[1.3, 1.3, 3.2, 24, 1, true]} />
              <primitive object={materials.atriumClearGlass} attach="material" />
            </mesh>
            <mesh position={[0, 1.61, 0]}>
              <cylinderGeometry args={[1.34, 1.34, 0.05, 24]} />
              <primitive object={materials.darkBronzeFrame} attach="material" />
            </mesh>
            {/* Right Glazed Entrance Lite */}
            <mesh position={[0, 0, 2.4]}>
              <boxGeometry args={[0.06, 3.2, 2.0]} />
              <primitive object={materials.atriumClearGlass} attach="material" />
            </mesh>
          </group>
        )}
      </group>

      {/* ======================================================== */}
      {/* 4. NORTH & SOUTH CORPORATE OFFICE WINGS (7–8 STOREYS)    */}
      {/* Stepped corporate massing matching reference photo       */}
      {/* ======================================================== */}
      {/* A. NORTH WING (Z in [-11.2, -4.5], X in [-6.5, 6.5]) */}
      <group position={[0, 0.24, -7.85]}>
        {/* Main 6-Storey Lower Volume (Height 25.2m) */}
        <mesh position={[0, 12.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[13.2, 25.2, 6.7]} />
          <primitive object={materials.corporateBronzeGlass} attach="material" />
        </mesh>

        {/* Stepped Floors 7–8 Upper Penthouse Volume (Height 8.4m, setback to Z = -7.5) */}
        <mesh position={[0, 29.4, -0.4]} castShadow receiveShadow>
          <boxGeometry args={[12.6, 8.4, 5.9]} />
          <primitive object={materials.corporateBronzeGlass} attach="material" />
        </mesh>

        {/* Level 6 Open-Air Stepped Rooftop Terrace Slab */}
        <mesh position={[0, 25.2, 2.7]} receiveShadow>
          <boxGeometry args={[12.8, 0.20, 1.3]} />
          <primitive object={materials.granitePavers} attach="material" />
        </mesh>
        {/* Clean Architectural Glass Balustrade */}
        <mesh position={[0, 25.7, 3.3]}>
          <boxGeometry args={[12.6, 0.90, 0.05]} />
          <primitive object={materials.atriumClearGlass} attach="material" />
        </mesh>

        {/* Clean North Wing Rooftop Parapets (at Y = 33.6m) */}
        <mesh position={[0, 34.1, -0.4]}>
          <boxGeometry args={[12.8, 1.0, 6.1]} />
          <primitive object={materials.darkBronzeFrame} attach="material" />
        </mesh>

        {/* Horizontal Floor Spandrel Bands */}
        {wingFloors.map((fl) => (
          <mesh key={`north-spandrel-${fl.num}`} position={[0, fl.y, 0]}>
            <boxGeometry args={[13.4, 0.32, 6.9]} />
            <primitive object={materials.darkBronzeFrame} attach="material" />
          </mesh>
        ))}

        {/* Vertical Architectural Bronze Mullions (LOD) */}
        {!isFarView && [-5.5, -3.3, -1.1, 1.1, 3.3, 5.5].map((mx) => (
          <mesh key={`north-mullion-${mx}`} position={[mx, 12.6, 3.4]}>
            <boxGeometry args={[0.14, 25.2, 0.12]} />
            <primitive object={materials.warmMullions} attach="material" />
          </mesh>
        ))}
      </group>

      {/* B. SOUTH WING (Z in [4.5, 11.2], X in [-6.5, 6.5]) */}
      <group position={[0, 0.24, 7.85]}>
        {/* Main 6-Storey Lower Volume (Height 25.2m) */}
        <mesh position={[0, 12.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[13.2, 25.2, 6.7]} />
          <primitive object={materials.corporateBronzeGlass} attach="material" />
        </mesh>

        {/* Stepped Floors 7–8 Upper Penthouse Volume (Height 8.4m, setback to Z = 7.5) */}
        <mesh position={[0, 29.4, 0.4]} castShadow receiveShadow>
          <boxGeometry args={[12.6, 8.4, 5.9]} />
          <primitive object={materials.corporateBronzeGlass} attach="material" />
        </mesh>

        {/* Level 6 Open-Air Stepped Rooftop Terrace Slab */}
        <mesh position={[0, 25.2, -2.7]} receiveShadow>
          <boxGeometry args={[12.8, 0.20, 1.3]} />
          <primitive object={materials.granitePavers} attach="material" />
        </mesh>
        {/* Clean Architectural Glass Balustrade */}
        <mesh position={[0, 25.7, -3.3]}>
          <boxGeometry args={[12.6, 0.90, 0.05]} />
          <primitive object={materials.atriumClearGlass} attach="material" />
        </mesh>

        {/* Clean South Wing Rooftop Parapets (at Y = 33.6m) */}
        <mesh position={[0, 34.1, 0.4]}>
          <boxGeometry args={[12.8, 1.0, 6.1]} />
          <primitive object={materials.darkBronzeFrame} attach="material" />
        </mesh>

        {/* Horizontal Floor Spandrel Bands */}
        {wingFloors.map((fl) => (
          <mesh key={`south-spandrel-${fl.num}`} position={[0, fl.y, 0]}>
            <boxGeometry args={[13.4, 0.32, 6.9]} />
            <primitive object={materials.darkBronzeFrame} attach="material" />
          </mesh>
        ))}

        {/* Vertical Architectural Bronze Mullions (LOD) */}
        {!isFarView && [-5.5, -3.3, -1.1, 1.1, 3.3, 5.5].map((mx) => (
          <mesh key={`south-mullion-${mx}`} position={[mx, 12.6, -3.4]}>
            <boxGeometry args={[0.14, 25.2, 0.12]} />
            <primitive object={materials.warmMullions} attach="material" />
          </mesh>
        ))}
      </group>

      {/* ======================================================== */}
      {/* 5. STREET DIRECTORY BOARD & FORECOURT AMENITIES          */}
      {/* ======================================================== */}
      {/* Street-Level Physical Building Directory Board (on West sidewalk) */}
      <StreetDirectoryBoard
        title="CAREER & EXPERIENCE"
        subtitle="Professional Journey"
        department="ENGINEERING OFFICES & ATRIUM"
        position={[-10.8, 0.24, 4.8]}
        rotation={[0, Math.PI / 2, 0]}
        accentColor="#ec4899"
      />

      {/* Parapet Fascia Signage on West Roof (Visible from elevated / aerial views) */}
      <BuildingSignage
        title="CAREER & EXPERIENCE CENTER"
        subtitle="SOFTWARE ENGINEERING • PROFESSIONAL JOURNEY"
        position={[0, 34.2, -7.85]}
        rotation={[0, -Math.PI / 2, 0]}
        width={6.4}
        height={0.80}
        mountingStyle="parapet-fascia"
        panelColor="#090d16"
        titleColor="#ffffff"
        subtitleColor="#ec4899"
        emissiveColor="#ffffff"
        emissiveIntensity={1.4}
        fontSize={0.24}
        subtitleFontSize={0.08}
      />

      {/* Stainless Steel / Bronze Entrance Bollards along West Sidewalk Edge (LOD) */}
      {!isFarView && [-10, -7.5, -5, -2.5, 2.5, 5, 7.5, 10].map((bz) => (
        <group key={`career-bollard-${bz}`} position={[-11.5, 0.24, bz]}>
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.84, 16]} />
            <primitive object={materials.darkBronzeFrame} attach="material" />
          </mesh>
          <mesh position={[0, 0.82, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.05, 16]} />
            <primitive object={materials.timelineGlow} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

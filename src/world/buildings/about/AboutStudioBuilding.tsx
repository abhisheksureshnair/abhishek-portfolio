'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getSharedAboutStudioMaterials } from './AboutStudioMaterials';
import { AboutStudioInterior } from './AboutStudioInterior';
import { ABOUT_STUDIO_METADATA } from './aboutMetadata';
import { BuildingSignage } from '../signage/BuildingSignage';
import { StreetDirectoryBoard } from '../signage/StreetDirectoryBoard';
import { useWorldStore, worldStore } from '../../stores/worldStore';
import { useLandmarkInteriorLOD } from '../landmarkLod';

interface AboutStudioBuildingProps {
  position?: [number, number, number];
  onInteract?: () => void;
}

/**
 * PHASE 2.5 — About Me Studio & Developer Journey
 * 
 * Distinctive 3-storey contemporary cultural exhibition studio at [0, -40] (block-0-1):
 * - Faithful to reference photo (media_1794827385268_8a05b94a.jpg):
 *   1. Deep dramatic cantilevered roof with warm timber / wood slat soffit
 *   2. Linear recessed downlight slats along the natural timber ceiling
 *   3. Raised architectural concrete / limestone podium with steps to viewing terrace
 *   4. Architectural wire-mesh guardrail with dark steel top rail along the terrace
 *   5. Floor-to-ceiling panoramic glass curtain wall with dark bronze frames
 *   6. Double-height ground floor exhibition gallery with digital media wall
 *   7. Stepped asymmetrical massing with natural timber & smooth limestone wall accents
 *   8. Rooftop observation terrace with guardrails, benches, and skyline views
 *   9. Prominent physical dimensional signage:
 *      "ABOUT ME STUDIO // MY STORY • EDUCATION • DEVELOPER JOURNEY"
 *   10. Street-level physical directory board on the sidewalk
 *   11. Built-in LOD optimization for 60+ FPS performance
 */
// Pre-allocated static geometries for zero-allocation hover / selection highlights
const _aboutHighlightPlaneGeo = new THREE.PlaneGeometry(24.2, 24.2);
const _aboutHighlightEdgesGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(24.0, 0.12, 24.0));

export const AboutStudioBuilding: React.FC<AboutStudioBuildingProps> = ({
  position = [0.0, 0, -40.0],
  onInteract,
}) => {
  const materials = getSharedAboutStudioMaterials();
  const selectedLandmark = useWorldStore((s) => s.selectedLandmark);
  const hoveredLandmark = useWorldStore((s) => s.hoveredLandmark);
  const cameraPreset = useWorldStore((s) => s.cameraPreset);

  const isSelected = selectedLandmark === 'about';
  const isHovered = hoveredLandmark === 'about';
  const showInterior = useLandmarkInteriorLOD([position[0], position[2]], 'about');
  const isFarView = !showInterior;

  const handleBuildingClick = (e: any) => {
    e.stopPropagation();
    worldStore.getState().setSelectedLandmark('about');
    worldStore.getState().setCameraView('orbit', 'about_three_quarter');
    if (onInteract) onInteract();
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    worldStore.getState().setHoveredLandmark('about');
  };

  const handlePointerOut = () => {
    worldStore.getState().setHoveredLandmark(null);
  };

  return (
    <group
      name="portfolio_about_studio"
      position={position}
      onClick={handleBuildingClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* 0. Selection / Hover Outline Highlight Box */}
      {(isSelected || isHovered) && (
        <group position={[0, 0.26, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={_aboutHighlightPlaneGeo}>
            <meshBasicMaterial
              color={isSelected ? '#f97316' : '#fdba74'}
              wireframe
              transparent
              opacity={isSelected ? 0.9 : 0.45}
            />
          </mesh>
          <lineSegments geometry={_aboutHighlightEdgesGeo}>
            <lineBasicMaterial
              color={isSelected ? '#f97316' : '#fdba74'}
              linewidth={2}
              transparent
              opacity={isSelected ? 1.0 : 0.6}
            />
          </lineSegments>
        </group>
      )}

      {/* 1. Raised Concrete/Limestone Terrace Podium (Matching Reference Photo) */}
      {/* Flush bevel over sidewalk at Y = 0.24m, stepping up to Y = 0.65m viewing terrace */}
      <group position={[0, 0, 0]}>
        {/* Sub-base bevel plinth */}
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[23.6, 0.24, 23.6]} />
          <primitive object={materials.limestonePodium} attach="material" />
        </mesh>

        {/* Elevated Terrace Deck (Y = 0.24m to 0.65m) */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[22.4, 0.42, 22.4]} />
          <primitive object={materials.limestonePodium} attach="material" />
        </mesh>

        {/* Terraced Steps leading up to the South Main Entrance (Y = 0.24 to 0.65m) */}
        {[0, 1, 2].map((stepIdx) => {
          const stepY = 0.24 + stepIdx * 0.14;
          const stepZ = 11.2 + stepIdx * 0.4;
          return (
            <mesh key={stepIdx} position={[0, stepY, stepZ]}>
              <boxGeometry args={[7.2, 0.14, 0.5]} />
              <primitive object={materials.limestonePodium} attach="material" />
            </mesh>
          );
        })}

        {/* Perimeter Wire-Mesh Guardrail along the Terrace Deck */}
        {/* South Guardrail sections (flanking the central steps) */}
        {[-7.2, 7.2].map((xOffset, idx) => (
          <group key={idx} position={[xOffset, 0.65, 10.9]}>
            {/* Mesh infill */}
            <mesh position={[0, 0.45, 0]}>
              <planeGeometry args={[6.8, 0.9]} />
              <primitive object={materials.guardrailMesh} attach="material" />
            </mesh>
            {/* Top handrail */}
            <mesh position={[0, 0.92, 0]}>
              <boxGeometry args={[6.8, 0.05, 0.06]} />
              <primitive object={materials.guardrailTopRail} attach="material" />
            </mesh>
            {/* Stanchions */}
            {[-3.2, 0, 3.2].map((sX, sIdx) => (
              <mesh key={sIdx} position={[sX, 0.45, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 0.9, 8]} />
                <primitive object={materials.guardrailTopRail} attach="material" />
              </mesh>
            ))}
          </group>
        ))}

        {/* East & West Perimeter Guardrails */}
        {[-10.9, 10.9].map((xPos, idx) => (
          <group key={idx} position={[xPos, 0.65, 0]} rotation={[0, Math.PI / 2, 0]}>
            <mesh position={[0, 0.45, 0]}>
              <planeGeometry args={[21.2, 0.9]} />
              <primitive object={materials.guardrailMesh} attach="material" />
            </mesh>
            <mesh position={[0, 0.92, 0]}>
              <boxGeometry args={[21.2, 0.05, 0.06]} />
              <primitive object={materials.guardrailTopRail} attach="material" />
            </mesh>
            {[-9.5, -4.5, 0, 4.5, 9.5].map((sX, sIdx) => (
              <mesh key={sIdx} position={[sX, 0.45, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 0.9, 8]} />
                <primitive object={materials.guardrailTopRail} attach="material" />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* 2. Ground Floor & Double-Height Exhibition Gallery (Y = 0.65m to Y = 5.4m) */}
      <group position={[0, 0.65, 0]}>
        {/* Panoramic Glass Curtain Walls (Floor-to-ceiling as in reference photo) */}
        {/* South Main Glass Facade */}
        <mesh position={[0, 2.3, 8.8]}>
          <planeGeometry args={[18.8, 4.6]} />
          <primitive object={materials.curtainGlass} attach="material" />
        </mesh>

        {/* East Glass Wall */}
        <mesh position={[9.4, 2.3, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[17.6, 4.6]} />
          <primitive object={materials.curtainGlass} attach="material" />
        </mesh>

        {/* West Glass Wall */}
        <mesh position={[-9.4, 2.3, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[17.6, 4.6]} />
          <primitive object={materials.curtainGlass} attach="material" />
        </mesh>

        {/* North Feature Wall (Limestone + Timber Accents) */}
        <mesh position={[0, 2.3, -8.8]}>
          <boxGeometry args={[18.8, 4.6, 0.4]} />
          <primitive object={materials.limestoneWall} attach="material" />
        </mesh>

        {/* Vertical Structural Bronze Mullions & Columns along South Facade */}
        {[-8.5, -5.5, -2.5, 0, 2.5, 5.5, 8.5].map((xOffset, idx) => (
          <group key={idx} position={[xOffset, 2.3, 8.85]}>
            <mesh>
              <boxGeometry args={[0.18, 4.6, 0.22]} />
              <primitive object={materials.structuralBronze} attach="material" />
            </mesh>
          </group>
        ))}

        {/* East/West Mullions */}
        {[-6.0, -2.0, 2.0, 6.0].map((zOffset, idx) => (
          <React.Fragment key={idx}>
            <mesh position={[9.42, 2.3, zOffset]}>
              <boxGeometry args={[0.22, 4.6, 0.18]} />
              <primitive object={materials.structuralBronze} attach="material" />
            </mesh>
            <mesh position={[-9.42, 2.3, zOffset]}>
              <boxGeometry args={[0.22, 4.6, 0.18]} />
              <primitive object={materials.structuralBronze} attach="material" />
            </mesh>
          </React.Fragment>
        ))}

        {/* Main Double Glass Entrance Doors at South Portal */}
        <group position={[0, 1.4, 8.9]}>
          <mesh>
            <boxGeometry args={[2.8, 2.8, 0.08]} />
            <primitive object={materials.atriumGlass} attach="material" />
          </mesh>
          {/* Bronze Door Frames & Handles */}
          <mesh position={[-0.7, 0, 0.05]}>
            <boxGeometry args={[0.04, 0.8, 0.04]} />
            <primitive object={materials.structuralBronze} attach="material" />
          </mesh>
          <mesh position={[0.7, 0, 0.05]}>
            <boxGeometry args={[0.04, 0.8, 0.04]} />
            <primitive object={materials.structuralBronze} attach="material" />
          </mesh>
        </group>
      </group>

      {/* 3. Deep Dramatic Cantilevered Roof with Warm Timber Soffit (Core Reference Feature) */}
      {/* Positioned at Y = 5.4m with deep overhang extending beyond walls */}
      <group position={[0, 5.4, 0]}>
        {/* Underside Warm Timber Soffit (extends 2.2m beyond glass walls) */}
        <mesh position={[0, -0.05, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[23.2, 21.6]} />
          <primitive object={materials.timberSoffit} attach="material" />
        </mesh>

        {/* Linear Recessed Downlight Slats in Timber Soffit (Matching Reference Photo) */}
        {[-8.0, -4.8, -1.6, 1.6, 4.8, 8.0].map((xOffset, idx) => (
          <mesh key={idx} position={[xOffset, -0.04, 8.4]}>
            <boxGeometry args={[0.12, 0.04, 2.8]} />
            <primitive object={materials.recessedLightSlat} attach="material" />
          </mesh>
        ))}

        {/* Sleek Dark Bronze Fascia Perimeter Edge */}
        <mesh position={[0, 0.22, 0.4]}>
          <boxGeometry args={[23.4, 0.44, 21.8]} />
          <primitive object={materials.structuralBronze} attach="material" />
        </mesh>
      </group>

      {/* 4. Second & Third Stepped Articulated Gallery Wings (Y = 5.8m to Y = 13.6m) */}
      <group position={[0, 5.8, 0]}>
        {/* Floor 2: Stepped Upper Studio Volume (L-shaped Asymmetrical Massing) */}
        {/* East/North Studio Wing */}
        <group position={[2.2, 0, -1.8]}>
          {/* Wall Structure */}
          <mesh position={[0, 1.8, 0]}>
            <boxGeometry args={[14.4, 3.6, 12.8]} />
            <primitive object={materials.limestoneWall} attach="material" />
          </mesh>
          {/* Panoramic Strip Glazing along South & West */}
          <mesh position={[0, 1.8, 6.42]}>
            <planeGeometry args={[13.2, 2.2]} />
            <primitive object={materials.curtainGlass} attach="material" />
          </mesh>
          <mesh position={[-7.22, 1.8, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[11.6, 2.2]} />
            <primitive object={materials.curtainGlass} attach="material" />
          </mesh>
          {/* Mullions on Floor 2 */}
          {[-4.5, -1.5, 1.5, 4.5].map((xPos, idx) => (
            <mesh key={idx} position={[xPos, 1.8, 6.45]}>
              <boxGeometry args={[0.12, 2.2, 0.1]} />
              <primitive object={materials.structuralBronze} attach="material" />
            </mesh>
          ))}
        </group>

        {/* Floor 3 / Upper Atelier Studio (Y = 3.6m to 7.2m) */}
        <group position={[1.0, 3.6, -2.6]}>
          <mesh position={[0, 1.8, 0]}>
            <boxGeometry args={[12.0, 3.6, 10.4]} />
            <primitive object={materials.limestoneWall} attach="material" />
          </mesh>
          {/* South Ribbon Window */}
          <mesh position={[0, 1.8, 5.22]}>
            <planeGeometry args={[10.8, 2.0]} />
            <primitive object={materials.curtainGlass} attach="material" />
          </mesh>
          {/* Natural Vertical Timber Screen Accent Slats (Reference Requirement) */}
          {[-5.0, -4.6, -4.2, -3.8, 3.8, 4.2, 4.6, 5.0].map((xPos, idx) => (
            <mesh key={idx} position={[xPos, 1.8, 5.25]}>
              <boxGeometry args={[0.08, 3.4, 0.15]} />
              <primitive object={materials.timberScreenSlat} attach="material" />
            </mesh>
          ))}
        </group>
      </group>

      {/* 5. Rooftop Viewing Terrace & Observation Deck (Y = 13.0m to 14.4m) */}
      <group position={[1.0, 13.0, -2.6]}>
        {/* Terrace Paver Floor */}
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[11.6, 10.0]} />
          <primitive object={materials.limestonePodium} attach="material" />
        </mesh>

        {/* Architectural Guardrails with Mesh Infill (Matching Lower Terrace) */}
        {/* South Guardrail */}
        <group position={[0, 0.08, 5.0]}>
          <mesh position={[0, 0.5, 0]}>
            <planeGeometry args={[11.4, 1.0]} />
            <primitive object={materials.guardrailMesh} attach="material" />
          </mesh>
          <mesh position={[0, 1.02, 0]}>
            <boxGeometry args={[11.4, 0.05, 0.06]} />
            <primitive object={materials.guardrailTopRail} attach="material" />
          </mesh>
        </group>
        {/* West Guardrail */}
        <group position={[-5.8, 0.08, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh position={[0, 0.5, 0]}>
            <planeGeometry args={[9.8, 1.0]} />
            <primitive object={materials.guardrailMesh} attach="material" />
          </mesh>
          <mesh position={[0, 1.02, 0]}>
            <boxGeometry args={[9.8, 0.05, 0.06]} />
            <primitive object={materials.guardrailTopRail} attach="material" />
          </mesh>
        </group>

        {/* Minimalist Architectural Viewing Benches (Section 8) */}
        {[-3.0, 3.0].map((xOffset, idx) => (
          <group key={idx} position={[xOffset, 0.3, 3.5]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2.2, 0.45, 0.6]} />
              <primitive object={materials.limestoneWall} attach="material" />
            </mesh>
            <mesh position={[0, 0.24, 0]}>
              <boxGeometry args={[2.3, 0.06, 0.65]} />
              <primitive object={materials.timberScreenSlat} attach="material" />
            </mesh>
          </group>
        ))}

        {/* Subtle Ambient Perimeter Guardrail Glow */}
        <mesh position={[0, 0.1, 4.95]}>
          <boxGeometry args={[11.2, 0.02, 0.02]} />
          <primitive object={materials.signageGlow} attach="material" />
        </mesh>
      </group>

      {/* 6. Section 3: Prominent Physical Dimensional Building Name Sign */}
      {/* Positioned over the South cantilever entrance portal facing Central Avenue */}
      <BuildingSignage
        title={ABOUT_STUDIO_METADATA.title}
        subtitle={ABOUT_STUDIO_METADATA.subtitle}
        position={[0, 5.3, 11.2]}
        rotation={[0, 0, 0]}
        width={9.6}
        height={1.15}
        panelColor="#0f172a"
        titleColor="#ffffff"
        subtitleColor="#f97316"
        emissiveColor="#f97316"
        emissiveIntensity={1.8}
      />

      {/* 7. Section 3: Street-Level Physical Building Directory Board */}
      {/* Installed on the sidewalk near the entrance at [6.5, 0.24, 11.8] */}
      <StreetDirectoryBoard
        title={ABOUT_STUDIO_METADATA.title}
        subtitle={ABOUT_STUDIO_METADATA.subtitle}
        department="DISTRICT 02 // CREATIVE EXHIBITION STUDIO"
        position={[6.5, 0.24, 11.8]}
        rotation={[0, 0, 0]}
        accentColor="#f97316"
      />

      {/* 8. Double-Height Ground Floor Exhibition Gallery Interior */}
      <AboutStudioInterior visible={showInterior} />
    </group>
  );
};

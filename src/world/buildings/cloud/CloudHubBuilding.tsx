'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getSharedCloudMaterials } from './CloudMaterials';
import { CloudLobbyInterior } from './CloudLobbyInterior';
import { BuildingSignage } from '../signage/BuildingSignage';
import { StreetDirectoryBoard } from '../signage/StreetDirectoryBoard';
import { useWorldStore, worldStore } from '../../stores/worldStore';
import { useLandmarkInteriorLOD } from '../landmarkLod';

interface CloudHubBuildingProps {
  position?: [number, number, number];
  onInteract?: () => void;
  onSelectZone?: (zoneId: string) => void;
}

/**
 * PHASE 2.8 — Cloud & Systems Engineering Hub Architectural Citadel
 * 
 * Distinctive 5-storey modern technology headquarters at [40, 40] (block-2-2):
 * - Faithful to user reference photo (media_1795088664563_b9d9109e.jpg):
 *   1. Asymmetrical layered architecture with aerodynamic curved Northwest corner facade
 *   2. Dark titanium / graphite exterior panels with high-res cyan digital cloud HUD & circuit telemetry
 *   3. Large lower-corner cybernetic display screen with circular energy vortex telemetry
 *   4. Double-height transparent glass curtain wall ground floor & mezzanine with silver mullions
 *   5. Explorable interior featuring suspended architectural bridge, server rack banks, and 5 exhibition kiosks
 *   6. Recessed glass entrance with cantilevered canopy and warm welcome illumination
 *   7. Realistic rooftop with low-profile HVAC chiller units, cooling fans, elevator mechanical penthouse, and antenna array
 *   8. Prominent integrated physical signage:
 *      "CLOUD & SYSTEMS ENGINEERING HUB"
 *      "BACKEND • CLOUD • APIs • INFRASTRUCTURE"
 *   9. Full LOD efficiency maintaining 60+ FPS
 */
export const CloudHubBuilding: React.FC<CloudHubBuildingProps> = ({
  position = [40.0, 0, 40.0],
  onInteract,
  onSelectZone,
}) => {
  const materials = getSharedCloudMaterials();
  const selectedLandmark = useWorldStore((s) => s.selectedLandmark);
  const hoveredLandmark = useWorldStore((s) => s.hoveredLandmark);
  const cameraPreset = useWorldStore((s) => s.cameraPreset);

  const isSelected = selectedLandmark === 'cloud';
  const isHovered = hoveredLandmark === 'cloud';
  const showInterior = useLandmarkInteriorLOD([position[0], position[2]], 'cloud');

  // Animation ref for cyber pulse screen and subtle rooftop radar rotation
  const cyberScreenRef = useRef<THREE.Mesh>(null);
  const radarRef = useRef<THREE.Group>(null);
  const hvacFan1Ref = useRef<THREE.Mesh>(null);
  const hvacFan2Ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (radarRef.current) {
      radarRef.current.rotation.y += delta * 0.75;
    }
    if (hvacFan1Ref.current) {
      hvacFan1Ref.current.rotation.z += delta * 6.0;
    }
    if (hvacFan2Ref.current) {
      hvacFan2Ref.current.rotation.z += delta * 5.2;
    }
  });

  const handleBuildingClick = (e: any) => {
    e.stopPropagation();
    worldStore.getState().setSelectedLandmark('cloud');
    worldStore.getState().setCameraView('orbit', 'cloud_three_quarter');
    if (onInteract) onInteract();
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    worldStore.getState().setHoveredLandmark('cloud');
  };

  const handlePointerOut = () => {
    worldStore.getState().setHoveredLandmark(null);
  };

  return (
    <group
      name="portfolio_cloud_systems_hub"
      position={position}
      onClick={handleBuildingClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* 0. Selection / Hover Outline Highlight Box */}
      {(isSelected || isHovered) && (
        <group position={[0, 0.26, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[24.4, 24.4]} />
            <meshBasicMaterial
              color="#00f0ff"
              transparent
              opacity={isSelected ? 0.35 : 0.18}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(24.4, 0.1, 24.4)]} />
            <lineBasicMaterial color="#00f0ff" linewidth={2} />
          </lineSegments>
        </group>
      )}

      {/* 1. Forecourt Plaza Granite Deck (23.8m x 23.8m, Flush at Y=0.24m) */}
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[23.8, 0.24, 23.8]} />
        <primitive object={materials.granitePodium} attach="material" />
      </mesh>

      {/* Recessed Ground LED Accent Strip along West & North Plinth Edges */}
      <mesh position={[-11.85, 0.25, 0]}>
        <boxGeometry args={[0.08, 0.02, 23.6]} />
        <primitive object={materials.cyanNeonGlow} attach="material" />
      </mesh>
      <mesh position={[0, 0.25, -11.85]}>
        <boxGeometry args={[23.6, 0.02, 0.08]} />
        <primitive object={materials.cyanNeonGlow} attach="material" />
      </mesh>

      {/* Monumental Entrance Steps (North side connecting flush to sidewalk at Z = -11.9m) */}
      <group position={[0, 0, -11.0]}>
        <mesh position={[0, 0.06, -0.6]} receiveShadow>
          <boxGeometry args={[14.0, 0.12, 1.2]} />
          <primitive object={materials.concretePaver} attach="material" />
        </mesh>
        <mesh position={[0, 0.18, 0.2]} receiveShadow>
          <boxGeometry args={[12.4, 0.12, 1.0]} />
          <primitive object={materials.granitePodium} attach="material" />
        </mesh>
        {/* Step Inset LED Strip */}
        <mesh position={[0, 0.13, -0.01]}>
          <boxGeometry args={[12.4, 0.02, 0.04]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
      </group>

      {/* =========================================================================
          VOLUME 1: GROUND & MEZZANINE DOUBLE-HEIGHT GLASS ATRIUM (Y = 0.24m to 7.0m)
          Floor-to-ceiling structural glazing with polished silver mullions
          ========================================================================= */}
      <group position={[0, 3.62, 0]}>
        {/* North Glass Facade (Entrance side) */}
        <mesh position={[0, 0, -10.0]}>
          <boxGeometry args={[20.2, 6.76, 0.1]} />
          <primitive object={materials.atriumGlass} attach="material" />
        </mesh>
        {/* West Glass Facade (Avenue side) */}
        <mesh position={[-10.0, 0, 0]}>
          <boxGeometry args={[0.1, 6.76, 20.2]} />
          <primitive object={materials.atriumGlass} attach="material" />
        </mesh>
        {/* South & East Solid Structural Shearing Walls */}
        <mesh position={[0, 0, 10.0]} castShadow receiveShadow>
          <boxGeometry args={[20.2, 6.76, 0.3]} />
          <primitive object={materials.titaniumGraphite} attach="material" />
        </mesh>
        <mesh position={[10.0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.3, 6.76, 20.2]} />
          <primitive object={materials.titaniumGraphite} attach="material" />
        </mesh>

        {/* Vertical Silver Structural Mullions (North Glazing) */}
        {[-8.0, -5.0, -2.0, 2.0, 5.0, 8.0].map((mx, idx) => (
          <mesh key={`north-mullion-${idx}`} position={[mx, 0, -10.0]} castShadow>
            <boxGeometry args={[0.14, 6.76, 0.22]} />
            <primitive object={materials.structuralSilver} attach="material" />
          </mesh>
        ))}

        {/* Vertical Silver Structural Mullions (West Glazing) */}
        {[-7.0, -4.0, -1.0, 2.0, 5.0, 8.0].map((mz, idx) => (
          <mesh key={`west-mullion-${idx}`} position={[-10.0, 0, mz]} castShadow>
            <boxGeometry args={[0.22, 6.76, 0.14]} />
            <primitive object={materials.structuralSilver} attach="material" />
          </mesh>
        ))}

        {/* Horizontal Intermediate Transom Bar at Y = 3.6m (separating ground & mezzanine) */}
        <mesh position={[0, 0.2, -10.0]} castShadow>
          <boxGeometry args={[20.2, 0.16, 0.25]} />
          <primitive object={materials.structuralSilver} attach="material" />
        </mesh>
        <mesh position={[-10.0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.25, 0.16, 20.2]} />
          <primitive object={materials.structuralSilver} attach="material" />
        </mesh>
      </group>

      {/* Recessed Main Glass Entrance (North side center: X=0, Z=-10.0) */}
      <group position={[0, 0.24, -10.0]}>
        {/* Recessed Vestibule Frame */}
        <mesh position={[0, 1.8, 0.3]} castShadow>
          <boxGeometry args={[4.2, 3.6, 0.8]} />
          <primitive object={materials.titaniumGraphite} attach="material" />
        </mesh>

        {/* Automatic Sliding Glass Doors */}
        <mesh position={[-0.95, 1.4, -0.05]}>
          <boxGeometry args={[1.8, 2.8, 0.06]} />
          <primitive object={materials.curtainGlassDarkBlue} attach="material" />
        </mesh>
        <mesh position={[0.95, 1.4, -0.05]}>
          <boxGeometry args={[1.8, 2.8, 0.06]} />
          <primitive object={materials.curtainGlassDarkBlue} attach="material" />
        </mesh>

        {/* Entrance Portal Brushed Steel Door Frames */}
        <mesh position={[-0.95, 1.4, 0]}>
          <boxGeometry args={[1.85, 2.85, 0.04]} />
          <primitive object={materials.polishedSilver} attach="material" />
        </mesh>
        <mesh position={[0.95, 1.4, 0]}>
          <boxGeometry args={[1.85, 2.85, 0.04]} />
          <primitive object={materials.polishedSilver} attach="material" />
        </mesh>

        {/* Suspended Sleek Entrance Canopy */}
        <mesh position={[0, 3.2, -1.2]} castShadow>
          <boxGeometry args={[4.8, 0.2, 2.4]} />
          <primitive object={materials.titaniumGraphite} attach="material" />
        </mesh>
        <mesh position={[0, 3.12, -1.2]}>
          <boxGeometry args={[4.4, 0.04, 2.0]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>

        {/* Entrance Spotlight welcoming visitors */}
        <pointLight color="#00f0ff" intensity={1.8} distance={8.0} position={[0, 3.0, -1.2]} />
      </group>

      {/* =========================================================================
          VOLUME 2: AERODYNAMIC CURVED UPPER MASSING (Y = 7.0m to 19.5m)
          Aerodynamic rounded Northwest corner with glowing cyan cloud HUD panels
          ========================================================================= */}
      <group position={[0, 13.25, 0]}>
        {/* Main Upper Cantilevered Body */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[21.2, 12.5, 21.2]} />
          <primitive object={materials.titaniumGraphite} attach="material" />
        </mesh>

        {/* North Upper Facade with Cyan Cloud Emblem & Circuit Board Telemetry */}
        <mesh position={[0, 0, -10.66]}>
          <planeGeometry args={[21.0, 12.3]} />
          <primitive object={materials.curvedFacadeTextureMat} attach="material" />
        </mesh>

        {/* West Upper Facade with Matching Cloud & Telemetry Mesh */}
        <mesh position={[-10.66, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[21.0, 12.3]} />
          <primitive object={materials.curvedFacadeTextureMat} attach="material" />
        </mesh>

        {/* Aerodynamic Rounded Northwest Corner Cladding Shell (Radius 3.2m curve) */}
        <group position={[-9.0, 0, -9.0]}>
          <mesh rotation={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[2.8, 2.8, 12.4, 24, 1, false, Math.PI, Math.PI * 0.5]} />
            <primitive object={materials.curvedFacadeTextureMat} attach="material" />
          </mesh>
          {/* Top & Bottom Accent Trim Rings */}
          <mesh position={[0, 6.2, 0]}>
            <cylinderGeometry args={[2.85, 2.85, 0.15, 24, 1, false, Math.PI, Math.PI * 0.5]} />
            <primitive object={materials.cyanNeonGlow} attach="material" />
          </mesh>
          <mesh position={[0, -6.2, 0]}>
            <cylinderGeometry args={[2.85, 2.85, 0.15, 24, 1, false, Math.PI, Math.PI * 0.5]} />
            <primitive object={materials.cyanNeonGlow} attach="material" />
          </mesh>
        </group>

        {/* Continuous Cyan Neon Contour Lines running horizontally along facade seam */}
        <mesh position={[0, -6.15, -10.7]}>
          <boxGeometry args={[21.4, 0.1, 0.1]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
        <mesh position={[-10.7, -6.15, 0]}>
          <boxGeometry args={[0.1, 0.1, 21.4]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>

        {/* Roof Parapet Crown Glowing Cyan Neon Ribbon */}
        <mesh position={[0, 6.2, -10.7]}>
          <boxGeometry args={[21.4, 0.12, 0.1]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
        <mesh position={[-10.7, 6.2, 0]}>
          <boxGeometry args={[0.1, 0.12, 21.4]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
        <mesh position={[0, 6.2, 10.7]}>
          <boxGeometry args={[21.4, 0.12, 0.1]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
        <mesh position={[10.7, 6.2, 0]}>
          <boxGeometry args={[0.1, 0.12, 21.4]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
      </group>

      {/* =========================================================================
          VOLUME 3: LOWER-CORNER HIGH-TECH CYBERNETIC DISPLAY SCREEN
          Replicating the iconic circular vortex / telemetry screen from reference photo
          ========================================================================= */}
      <group position={[-10.15, 3.8, -6.5]}>
        {/* Screen Bezel & Mounting Housing */}
        <mesh castShadow>
          <boxGeometry args={[0.3, 4.4, 5.2]} />
          <primitive object={materials.titaniumGraphite} attach="material" />
        </mesh>
        {/* West-facing Cyber Display Screen */}
        <mesh ref={cyberScreenRef} position={[-0.16, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[5.0, 4.2]} />
          <primitive object={materials.cyberPulseScreenMat} attach="material" />
        </mesh>
        {/* Screen Glowing Cyan Edge Frame */}
        <mesh position={[-0.16, 2.12, 0]}>
          <boxGeometry args={[0.04, 0.06, 5.0]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
        <mesh position={[-0.16, -2.12, 0]}>
          <boxGeometry args={[0.04, 0.06, 5.0]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
      </group>

      {/* Second Display Screen on North Entrance Approach (X = 6.5, Z = -10.15) */}
      <group position={[6.5, 3.8, -10.15]}>
        <mesh castShadow>
          <boxGeometry args={[5.2, 4.4, 0.3]} />
          <primitive object={materials.titaniumGraphite} attach="material" />
        </mesh>
        <mesh position={[0, 0, -0.16]}>
          <planeGeometry args={[5.0, 4.2]} />
          <primitive object={materials.curvedFacadeTextureMat} attach="material" />
        </mesh>
      </group>

      {/* =========================================================================
          VOLUME 4: PROMINENT ARCHITECTURAL SIGNAGE
          Primary: CLOUD & SYSTEMS ENGINEERING HUB
          Secondary: BACKEND • CLOUD • APIs • INFRASTRUCTURE
          ========================================================================= */}
      <group position={[0, 7.35, -10.72]}>
        {/* Sign Backing Plate */}
        <mesh castShadow>
          <boxGeometry args={[18.4, 1.4, 0.16]} />
          <primitive object={materials.titaniumGraphite} attach="material" />
        </mesh>
        {/* Sign Face with High-Contrast Typography */}
        <mesh position={[0, 0, -0.09]}>
          <planeGeometry args={[18.2, 1.3]} />
          <primitive object={materials.signageMat} attach="material" />
        </mesh>
      </group>

      {/* West Facade Secondary Signage */}
      <group position={[-10.72, 7.35, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[16.0, 1.4, 0.16]} />
          <primitive object={materials.titaniumGraphite} attach="material" />
        </mesh>
        <mesh position={[0, 0, -0.09]}>
          <planeGeometry args={[15.8, 1.3]} />
          <primitive object={materials.signageMat} attach="material" />
        </mesh>
      </group>

      {/* =========================================================================
          VOLUME 5: REALISTIC ROOF ARCHITECTURE (Y = 19.5m to 23.5m)
          HVAC Chillers, Cooling Ducts, Mechanical Penthouse, Satellite Dish & Spire
          ========================================================================= */}
      <group position={[0, 19.5, 0]}>
        {/* Recessed Gravel / Bitumen Roof Deck */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[19.8, 0.2, 19.8]} />
          <primitive object={materials.concretePaver} attach="material" />
        </mesh>

        {/* Roof Perimeter Safety Parapet Coping */}
        <mesh position={[0, 0.6, -10.0]} castShadow>
          <boxGeometry args={[20.4, 0.8, 0.4]} />
          <primitive object={materials.structuralSilver} attach="material" />
        </mesh>
        <mesh position={[0, 0.6, 10.0]} castShadow>
          <boxGeometry args={[20.4, 0.8, 0.4]} />
          <primitive object={materials.structuralSilver} attach="material" />
        </mesh>
        <mesh position={[-10.0, 0.6, 0]} castShadow>
          <boxGeometry args={[0.4, 0.8, 20.4]} />
          <primitive object={materials.structuralSilver} attach="material" />
        </mesh>
        <mesh position={[10.0, 0.6, 0]} castShadow>
          <boxGeometry args={[0.4, 0.8, 20.4]} />
          <primitive object={materials.structuralSilver} attach="material" />
        </mesh>

        {/* Central Elevator & Stair Mechanical Penthouse */}
        <group position={[2.5, 1.6, 2.5]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[6.0, 3.2, 6.0]} />
            <primitive object={materials.titaniumGraphite} attach="material" />
          </mesh>
          <mesh position={[0, 1.65, 0]}>
            <boxGeometry args={[6.2, 0.15, 6.2]} />
            <primitive object={materials.structuralSilver} attach="material" />
          </mesh>
          {/* Penthouse Louver Vents */}
          <mesh position={[0, 0.5, -3.02]}>
            <planeGeometry args={[4.2, 1.8]} />
            <primitive object={materials.roofMechanicalMat} attach="material" />
          </mesh>
        </group>

        {/* Low-profile HVAC Chiller Units (Northwest quadrant of roof) */}
        {[-4.5, -1.5].map((hx, idx) => (
          <group key={`hvac-${idx}`} position={[hx, 0.9, -4.5]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2.2, 1.6, 3.2]} />
              <primitive object={materials.roofMechanicalMat} attach="material" />
            </mesh>
            {/* Chiller Fan Hoods */}
            <mesh position={[0, 0.85, -0.7]}>
              <cylinderGeometry args={[0.65, 0.7, 0.15, 16]} />
              <primitive object={materials.structuralSilver} attach="material" />
            </mesh>
            <mesh
              ref={idx === 0 ? hvacFan1Ref : hvacFan2Ref}
              position={[0, 0.94, -0.7]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <circleGeometry args={[0.6, 6]} />
              <primitive object={materials.titaniumGraphite} attach="material" />
            </mesh>

            <mesh position={[0, 0.85, 0.7]}>
              <cylinderGeometry args={[0.65, 0.7, 0.15, 16]} />
              <primitive object={materials.structuralSilver} attach="material" />
            </mesh>
          </group>
        ))}

        {/* Rooftop Microwave / Satellite Communications Array */}
        <group ref={radarRef} position={[-5.5, 1.8, 5.0]}>
          {/* Pedestal Stand */}
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.25, 1.2, 8]} />
            <primitive object={materials.structuralSilver} attach="material" />
          </mesh>
          {/* Parabolic Dish Antenna */}
          <mesh position={[0, 1.4, 0]} rotation={[0.4, 0, 0]}>
            <sphereGeometry args={[1.1, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
            <primitive object={materials.polishedSilver} attach="material" />
          </mesh>
          {/* Antenna Transceiver Horn */}
          <mesh position={[0, 1.6, 0.4]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.08, 0.6, 8]} />
            <primitive object={materials.cyanNeonGlow} attach="material" />
          </mesh>
        </group>

        {/* Sleek Corner Architectural Telemetry Spire with Red FAA Aircraft Beacon */}
        <group position={[8.5, 0, 8.5]}>
          <mesh position={[0, 3.2, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.22, 6.4, 8]} />
            <primitive object={materials.structuralSilver} attach="material" />
          </mesh>
          <mesh position={[0, 6.5, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <pointLight color="#ef4444" intensity={1.5} distance={10.0} position={[0, 6.5, 0]} />
        </group>
      </group>

      {/* =========================================================================
          VOLUME 6: EXPLORABLE INTERIOR LOBBY (Mounted inside double-height volume)
          ========================================================================= */}
      {showInterior && <CloudLobbyInterior onSelectZone={onSelectZone} />}

      {/* =========================================================================
          VOLUME 7: STREET-LEVEL DIRECTORY BOARD
          North Sidewalk Directory Board at X = 7.5, Z = -11.6 (Facing North)
          ========================================================================= */}
      <StreetDirectoryBoard
        title="CLOUD & SYSTEMS ENGINEERING HUB"
        subtitle="BACKEND • CLOUD • APIs • INFRASTRUCTURE"
        department="DISTRICT 08 // PLOT B"
        position={[7.5, 0.24, -11.6]}
        rotation={[0, 0, 0]}
        accentColor="#00f0ff"
      />

      {/* Architectural Facade Spotlights */}
      <pointLight color="#00f0ff" intensity={1.6} distance={15.0} position={[0, 8.0, -12.5]} />
      <pointLight color="#38bdf8" intensity={1.4} distance={15.0} position={[-12.5, 8.0, 0]} />
    </group>
  );
};

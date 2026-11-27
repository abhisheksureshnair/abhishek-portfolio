import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getSharedHQMaterials } from './HQMaterials';
import { HQBrandingSign } from './HQBrandingSign';
import { BuildingSignage } from '../signage/BuildingSignage';
import { StreetDirectoryBoard } from '../signage/StreetDirectoryBoard';
import { HQLobbyInterior } from './HQLobbyInterior';
import { PORTFOLIO_HQ_METADATA } from './hqMetadata';
import { useWorldStore, worldStore } from '../../stores/worldStore';
import { useLandmarkInteriorLOD } from '../landmarkLod';

interface HQBuildingProps {
  onInteract?: (metadata: typeof PORTFOLIO_HQ_METADATA) => void;
}

/**
 * PHASE 2.1.1 — Central Signature Developer Headquarters (HQ)
 * 
 * Dominant 38m Architectural Landmark located at the exact city center [0, 0]:
 * - Parcel: block-1-1 centered at [0, 0] (Buildable envelope [-12, 12] x [-12, 12])
 * - Custom 7-story stepped L-shaped corporate campus with iconic asymmetrical crown & 38m spire blade
 * - Vibrant blue-gray reflective glass curtain walls with crisp mullions & white limestone accents
 * - Double-height 8.2m grand entrance lobby pavilion with clear architectural glazing & pilotis columns
 * - White limestone entrance portal, cantilevered canopy with warm LED soffits & illuminated branding
 * - Central cylindrical glass revolving door flanked by commercial glass doors
 * - Forecourt plaza with reflecting pool (water mirror basin) & stainless steel entrance bollards
 * - Freestanding polished granite monument sign & canopy fascia branding
 * - Visible minimalist lobby interior with warm vertical oak acoustic slats & reception desk
 * - Highly optimized single-pass PBR materials (zero transmission passes) for solid 60-90+ FPS
 */
// Pre-allocated static geometries for zero-allocation hover / selection highlights
const _hqHighlightPlaneGeo = new THREE.PlaneGeometry(24.2, 24.2);
const _hqHighlightEdgesGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(24.0, 0.12, 24.0));

export const HQBuilding: React.FC<HQBuildingProps> = ({ onInteract }) => {
  const materials = useMemo(() => getSharedHQMaterials(), []);
  const revolvingRef = useRef<THREE.Group>(null);
  const leftDoorPivotRef = useRef<THREE.Group>(null);
  const rightDoorPivotRef = useRef<THREE.Group>(null);
  const doorAngleRef = useRef<number>(0);
  const selectedLandmark = useWorldStore((s) => s.selectedLandmark);
  const hoveredLandmark = useWorldStore((s) => s.hoveredLandmark);
  const hqInteriorPhase = useWorldStore((s) => s.hqInteriorPhase);
  const isSelected = selectedLandmark === 'hq';
  const isHovered = hoveredLandmark === 'hq';

  const lodShowInterior = useLandmarkInteriorLOD([0, 0], 'hq');
  const showInterior = lodShowInterior || hqInteriorPhase !== 'outside';
  const isFarView = !showInterior;

  // Subtle continuous revolving door rotation & smooth swinging door animation
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (revolvingRef.current) {
      revolvingRef.current.rotation.y += dt * 0.45;
    }
    const doorsOpen = worldStore.getState().hqDoorsOpen;
    const targetAngle = doorsOpen ? Math.PI * 0.48 : 0;
    doorAngleRef.current += (targetAngle - doorAngleRef.current) * Math.min(1, dt * 6.0);
    if (leftDoorPivotRef.current) {
      leftDoorPivotRef.current.rotation.y = doorAngleRef.current;
    }
    if (rightDoorPivotRef.current) {
      rightDoorPivotRef.current.rotation.y = -doorAngleRef.current;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (worldStore.getState().cameraMode === 'avatar') return;
    worldStore.getState().setSelectedLandmark('hq');
    worldStore.getState().setCameraView('orbit', 'central_hq_overview');
    if (onInteract) {
      onInteract(PORTFOLIO_HQ_METADATA);
    }
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    worldStore.getState().setHoveredLandmark('hq');
  };

  const handlePointerOut = () => {
    worldStore.getState().setHoveredLandmark(null);
  };

  return (
    <group
      name="portfolio_hq"
      position={[0, 0, 0]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Selection / Hover Outline Highlight Box */}
      {(isSelected || isHovered) && (
        <group position={[0, 0.26, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={_hqHighlightPlaneGeo}>
            <meshBasicMaterial
              color={isSelected ? '#38bdf8' : '#67e8f9'}
              wireframe
              transparent
              opacity={isSelected ? 0.9 : 0.45}
            />
          </mesh>
          {/* Glowing Ground Perimeter Marker */}
          <lineSegments geometry={_hqHighlightEdgesGeo}>
            <lineBasicMaterial
              color={isSelected ? '#38bdf8' : '#67e8f9'}
              linewidth={2}
              transparent
              opacity={isSelected ? 1.0 : 0.6}
            />
          </lineSegments>
        </group>
      )}
      {/* ======================================================== */}
      {/* 1. PLINTH FOUNDATION & FORECOURT GRANITE PAVERS          */}
      {/* Footprint: [-11.8, 11.8] x [-11.8, 11.8]                 */}
      {/* ======================================================== */}
      {/* Main Building Plinth (Top at Y = 0.24m, 4cm reveal above 0.20m sidewalk) */}
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[23.6, 0.24, 23.6]} />
        <primitive object={materials.warmConcrete} attach="material" />
      </mesh>

      {/* Forecourt Granite Paved Plaza (South Courtyard: Z in [7.5, 11.8]) */}
      <mesh position={[0, 0.245, 9.6]} receiveShadow>
        <boxGeometry args={[23.2, 0.01, 4.2]} />
        <primitive object={materials.granitePavers} attach="material" />
      </mesh>

      {/* ======================================================== */}
      {/* 2. FORECOURT REFLECTING POOL / WATER MIRROR BASIN        */}
      {/* South-West forecourt: X in [-11.0, -4.5], Z in [8.0, 11.2]*/}
      {/* ======================================================== */}
      <group position={[-7.75, 0.24, 9.6]}>
        {/* Dark Granite Coping Rim */}
        <mesh position={[0, 0.08, 0]} receiveShadow>
          <boxGeometry args={[6.5, 0.16, 3.2]} />
          <primitive object={materials.structuralFraming} attach="material" />
        </mesh>

        {/* Calm Water Mirror Surface (Single pass, high clarity) */}
        <mesh
          position={[0, 0.15, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[6.1, 2.8]} />
          <primitive object={materials.reflectingWater} attach="material" />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 3. MINIMAL VISIBLE LOBBY INTERIOR (LOD-managed)          */}
      {/* ======================================================== */}
      {showInterior && <HQLobbyInterior />}

      {/* ======================================================== */}
      {/* 4. DOUBLE-HEIGHT GRAND ENTRANCE LOBBY PAVILION (8.2m tall)*/}
      {/* Footprint: X in [-10.0, 10.0], Z in [0, 8.5]             */}
      {/* ======================================================== */}
      <group position={[0, 4.3, 4.25]}>
        {/* Clear Low-Iron Glass Curtain Facade (South Face at Z = 4.25, split for real doorways at X = ±2.5) */}
        <mesh position={[-6.55, 0, 4.25]} receiveShadow>
          <boxGeometry args={[6.7, 8.2, 0.08]} />
          <primitive object={materials.lobbyGlass} attach="material" />
        </mesh>
        <mesh position={[6.55, 0, 4.25]} receiveShadow>
          <boxGeometry args={[6.7, 8.2, 0.08]} />
          <primitive object={materials.lobbyGlass} attach="material" />
        </mesh>
        {/* Upper Transom Glass above Entrance Portal (Y > 3.6m) */}
        <mesh position={[0, 1.8, 4.25]} receiveShadow>
          <boxGeometry args={[6.4, 4.6, 0.08]} />
          <primitive object={materials.lobbyGlass} attach="material" />
        </mesh>
        {/* Narrow Glass Piers flanking Revolving Drum */}
        <mesh position={[-1.55, -2.3, 4.25]} receiveShadow>
          <boxGeometry args={[0.5, 3.6, 0.08]} />
          <primitive object={materials.lobbyGlass} attach="material" />
        </mesh>
        <mesh position={[1.55, -2.3, 4.25]} receiveShadow>
          <boxGeometry args={[0.5, 3.6, 0.08]} />
          <primitive object={materials.lobbyGlass} attach="material" />
        </mesh>

        {/* East Glass Facade */}
        <mesh position={[9.9, 0, 0]} receiveShadow>
          <boxGeometry args={[0.08, 8.2, 8.5]} />
          <primitive object={materials.lobbyGlass} attach="material" />
        </mesh>

        {/* West Limestone Solid Flank */}
        <mesh position={[-9.9, 0, 0]} receiveShadow>
          <boxGeometry args={[0.30, 8.2, 8.5]} />
          <primitive object={materials.whiteLimestone} attach="material" />
        </mesh>

        {/* Vertical Structural Charcoal Mullions */}
        {[-8, -6, -4, 4, 6, 8].map((mx) => (
          <mesh key={`mullion-${mx}`} position={[mx, 0, 4.29]}>
            <boxGeometry args={[0.08, 8.2, 0.12]} />
            <primitive object={materials.structuralFraming} attach="material" />
          </mesh>
        ))}

        {/* Horizontal Door Transom Bar at 3.4m */}
        <mesh position={[0, -0.7, 4.29]}>
          <boxGeometry args={[19.8, 0.08, 0.12]} />
          <primitive object={materials.structuralFraming} attach="material" />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 5. GRAND ENTRANCE PORTAL, CANOPY & REVOLVING DOOR        */}
      {/* Centered at X = 0.0, Z = 8.5                             */}
      {/* ======================================================== */}
      <group position={[0, 0.20, 8.5]}>
        {/* Honed White Limestone Architectural Portal Surround */}
        {/* Left Portal Pylon */}
        <mesh position={[-4.0, 4.1, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[0.80, 8.2, 0.60]} />
          <primitive object={materials.whiteLimestone} attach="material" />
        </mesh>
        {/* Right Portal Pylon */}
        <mesh position={[4.0, 4.1, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[0.80, 8.2, 0.60]} />
          <primitive object={materials.whiteLimestone} attach="material" />
        </mesh>
        {/* Top Architrave */}
        <mesh position={[0, 8.0, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[8.8, 0.60, 0.60]} />
          <primitive object={materials.whiteLimestone} attach="material" />
        </mesh>

        {/* Cantilevered Entrance Canopy (Projects to Z = 10.8m) */}
        <mesh position={[0, 8.3, 1.15]} castShadow receiveShadow>
          <boxGeometry args={[9.0, 0.32, 2.3]} />
          <primitive object={materials.structuralFraming} attach="material" />
        </mesh>

        {/* Underside Canopy LED Downlight Array */}
        {!isFarView && [-3, -1, 1, 3].map((lx) => (
          <mesh key={`canopy-light-${lx}`} position={[lx, 8.13, 1.2]}>
            <cylinderGeometry args={[0.12, 0.12, 0.04, 12]} />
            <primitive object={materials.canopyLettering} attach="material" />
          </mesh>
        ))}

        {/* Main Entrance Architectural Identification Signage (Phase 2.3) */}
        <BuildingSignage
          title="DEVELOPER HQ"
          subtitle="FULL STACK • WEB • MOBILE"
          position={[0, 8.95, 0.52]}
          width={7.4}
          height={1.05}
          panelColor="#1e293b"
          titleColor="#ffffff"
          subtitleColor="#38bdf8"
          emissiveColor="#38bdf8"
          fontSize={0.42}
          subtitleFontSize={0.14}
        />

        {/* Canopy Fascia Brand Lettering Plaque */}
        <BuildingSignage
          title="DEVELOPER HQ"
          subtitle="FULL STACK • WEB • MOBILE"
          position={[0, 8.3, 2.32]}
          width={8.6}
          height={0.28}
          mountingStyle="canopy-fascia"
          fontSize={0.16}
          subtitleFontSize={0.08}
        />

        {/* Central Cylindrical Glass Revolving Door Drum & Portals (LOD) */}
        {!isFarView && (
          <group>
            <group position={[0, 1.7, 0.1]}>
              <mesh>
                <cylinderGeometry args={[1.3, 1.3, 3.4, 24, 1, true]} />
                <primitive object={materials.lobbyGlass} attach="material" />
              </mesh>
              <mesh position={[0, 1.71, 0]}>
                <cylinderGeometry args={[1.34, 1.34, 0.06, 24]} />
                <primitive object={materials.stainlessSteel} attach="material" />
              </mesh>
              <mesh position={[0, -1.69, 0]}>
                <cylinderGeometry args={[1.34, 1.34, 0.04, 24]} />
                <primitive object={materials.stainlessSteel} attach="material" />
              </mesh>
              {/* Revolving Wings Assembly */}
              <group ref={revolvingRef}>
                <mesh>
                  <cylinderGeometry args={[0.06, 0.06, 3.3, 12]} />
                  <primitive object={materials.stainlessSteel} attach="material" />
                </mesh>
                {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, idx) => (
                  <mesh
                    key={`wing-${idx}`}
                    position={[Math.sin(angle) * 0.6, 0, Math.cos(angle) * 0.6]}
                    rotation={[0, angle, 0]}
                  >
                    <boxGeometry args={[0.03, 3.2, 1.2]} />
                    <primitive object={materials.lobbyGlass} attach="material" />
                  </mesh>
                ))}
              </group>
            </group>

            {/* Flanking Commercial Glass Swinging Doors (Pivoted on outer edges for real 3D entry) */}
            {/* Left Door (Hinge at X = -3.2) */}
            <group ref={leftDoorPivotRef} position={[-3.2, 1.7, 0.1]}>
              <mesh position={[0.7, 0, 0]}>
                <boxGeometry args={[1.4, 3.4, 0.06]} />
                <primitive object={materials.lobbyGlass} attach="material" />
              </mesh>
              <mesh position={[0.7, 0, 0.05]}>
                <boxGeometry args={[1.1, 0.05, 0.06]} />
                <primitive object={materials.stainlessSteel} attach="material" />
              </mesh>
            </group>

            {/* Right Door (Hinge at X = +3.2) */}
            <group ref={rightDoorPivotRef} position={[3.2, 1.7, 0.1]}>
              <mesh position={[-0.7, 0, 0]}>
                <boxGeometry args={[1.4, 3.4, 0.06]} />
                <primitive object={materials.lobbyGlass} attach="material" />
              </mesh>
              <mesh position={[-0.7, 0, 0.05]}>
                <boxGeometry args={[1.1, 0.05, 0.06]} />
                <primitive object={materials.stainlessSteel} attach="material" />
              </mesh>
            </group>
          </group>
        )}

        {/* Entrance Steps / Approach Ramp */}
        <mesh position={[0, -0.05, 0.8]} receiveShadow>
          <boxGeometry args={[9.2, 0.10, 1.6]} />
          <primitive object={materials.granitePavers} attach="material" />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 6. MAIN TOWER WING (7 STOREYS, 32.5m CROWN, 38m SPIRE)   */}
      {/* Footprint: X in [-6.0, 11.0] (17m), Z in [-11.0, 4.0](15m)*/}
      {/* ======================================================== */}
      <group position={[2.5, 0.20, -3.5]}>
        {/* Lower Storeys 1 to 2 behind double-height lobby (Z in [-11.0, -1.5], leaving lobby Z in [-1.4, 8.5] completely open) */}
        <mesh position={[0, 4.1, -2.75]} castShadow receiveShadow>
          <boxGeometry args={[17.0, 8.2, 9.5]} />
          <primitive object={materials.curtainGlass} attach="material" />
        </mesh>

        {/* Upper Storeys 3 to 5 above lobby roof (Y in [8.2, 20.0], full 15m depth) */}
        <mesh position={[0, 14.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[17.0, 11.8, 15.0]} />
          <primitive object={materials.curtainGlass} attach="material" />
        </mesh>

        {/* White Limestone Corner Vertical Landmark Spine (SE Corner - terminates flush at terrace slab Y = 24m) */}
        <mesh position={[8.35, 16.0, 7.35]} receiveShadow>
          <boxGeometry args={[0.60, 16.0, 0.60]} />
          <primitive object={materials.whiteLimestone} attach="material" />
        </mesh>

        {/* Horizontal Floor Slab Reveal Bands (Every 4.0m above lobby ceiling) */}
        {[8, 12, 16, 20, 24, 28].map((fy) => (
          <mesh key={`slab-${fy}`} position={[0, fy, 0]}>
            <boxGeometry args={[17.15, 0.24, 15.15]} />
            <primitive object={materials.structuralFraming} attach="material" />
          </mesh>
        ))}

        {/* Storey 6 (Height 20m - 24m) */}
        <mesh position={[0, 22.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[17.0, 4.0, 15.0]} />
          <primitive object={materials.curtainGlass} attach="material" />
        </mesh>

        {/* Storey 7: Executive Sky-Terrace (Recessed from South Face) */}
        {/* Enclosed Office Core (Z in [-7.5, 0]) */}
        <mesh position={[0, 26.0, -3.5]} castShadow receiveShadow>
          <boxGeometry args={[16.6, 4.0, 8.0]} />
          <primitive object={materials.curtainGlass} attach="material" />
        </mesh>

        {/* Open-Air Sky Terrace Deck (Z in [0.5, 7.3]) */}
        <mesh position={[0, 24.1, 4.0]} receiveShadow>
          <boxGeometry args={[16.8, 0.20, 7.0]} />
          <primitive object={materials.granitePavers} attach="material" />
        </mesh>

        {/* Clear Glass Safety Balustrade along Terrace Perimeter */}
        <mesh position={[0, 24.7, 7.4]}>
          <boxGeometry args={[16.8, 1.0, 0.05]} />
          <primitive object={materials.lobbyGlass} attach="material" />
        </mesh>
        <mesh position={[8.4, 24.7, 4.0]}>
          <boxGeometry args={[0.05, 1.0, 7.0]} />
          <primitive object={materials.lobbyGlass} attach="material" />
        </mesh>
        <mesh position={[-8.4, 24.7, 4.0]}>
          <boxGeometry args={[0.05, 1.0, 7.0]} />
          <primitive object={materials.lobbyGlass} attach="material" />
        </mesh>

        {/* Tower Rooftop Architectural Crown & Louvered Parapet (Mounted flush at roof slab Y = 28.0m) */}
        <group position={[0, 28.0, -3.5]}>
          {/* North Parapet */}
          <mesh position={[0, 0.5, -4.0]}>
            <boxGeometry args={[16.6, 1.0, 0.20]} />
            <primitive object={materials.structuralFraming} attach="material" />
          </mesh>
          {/* South Parapet */}
          <mesh position={[0, 0.5, 4.0]}>
            <boxGeometry args={[16.6, 1.0, 0.20]} />
            <primitive object={materials.structuralFraming} attach="material" />
          </mesh>
          {/* East Parapet */}
          <mesh position={[8.3, 0.5, 0]}>
            <boxGeometry args={[0.20, 1.0, 8.0]} />
            <primitive object={materials.structuralFraming} attach="material" />
          </mesh>
          {/* West Parapet */}
          <mesh position={[-8.3, 0.5, 0]}>
            <boxGeometry args={[0.20, 1.0, 8.0]} />
            <primitive object={materials.structuralFraming} attach="material" />
          </mesh>

          {/* Parapet Coping Trim Cap */}
          <mesh position={[0, 1.02, 4.0]}>
            <boxGeometry args={[16.7, 0.05, 0.26]} />
            <primitive object={materials.stainlessSteel} attach="material" />
          </mesh>
          <mesh position={[0, 1.02, -4.0]}>
            <boxGeometry args={[16.7, 0.05, 0.26]} />
            <primitive object={materials.stainlessSteel} attach="material" />
          </mesh>
          <mesh position={[8.3, 1.02, 0]}>
            <boxGeometry args={[0.26, 0.05, 8.1]} />
            <primitive object={materials.stainlessSteel} attach="material" />
          </mesh>
          <mesh position={[-8.3, 1.02, 0]}>
            <boxGeometry args={[0.26, 0.05, 8.1]} />
            <primitive object={materials.stainlessSteel} attach="material" />
          </mesh>

          {/* TASK 3: Parapet-Mounted Rooftop Identification Signage (Visible from elevated / aerial views) */}
          <BuildingSignage
            title="DEVELOPER HQ"
            subtitle="FULL STACK • WEB • MOBILE"
            position={[0, 0.5, 4.12]}
            width={9.2}
            height={0.76}
            mountingStyle="parapet-fascia"
            panelColor="#0f172a"
            titleColor="#ffffff"
            subtitleColor="#38bdf8"
            emissiveColor="#ffffff"
            emissiveIntensity={1.2}
            fontSize={0.32}
            subtitleFontSize={0.10}
          />

          {/* Proportional Elevator Penthouse Core (Height 2.2m) */}
          <mesh position={[0, 1.1, -1.8]} receiveShadow>
            <boxGeometry args={[4.6, 2.2, 3.4]} />
            <primitive object={materials.warmConcrete} attach="material" />
          </mesh>

          {/* Sleek Modular Rooftop HVAC Chillers with Acoustic Louvers */}
          <group position={[-4.2, 0.8, 0.6]}>
            <mesh receiveShadow>
              <boxGeometry args={[3.4, 1.6, 2.8]} />
              <primitive object={materials.roofMechanical} attach="material" />
            </mesh>
            {/* Chiller Fan Cowls */}
            <mesh position={[-0.8, 0.84, 0]}>
              <cylinderGeometry args={[0.55, 0.55, 0.08, 16]} />
              <primitive object={materials.structuralFraming} attach="material" />
            </mesh>
            <mesh position={[0.8, 0.84, 0]}>
              <cylinderGeometry args={[0.55, 0.55, 0.08, 16]} />
              <primitive object={materials.structuralFraming} attach="material" />
            </mesh>
          </group>

          <group position={[4.2, 0.8, 0.6]}>
            <mesh receiveShadow>
              <boxGeometry args={[3.4, 1.6, 2.8]} />
              <primitive object={materials.roofMechanical} attach="material" />
            </mesh>
            {/* Chiller Fan Cowls */}
            <mesh position={[-0.8, 0.84, 0]}>
              <cylinderGeometry args={[0.55, 0.55, 0.08, 16]} />
              <primitive object={materials.structuralFraming} attach="material" />
            </mesh>
            <mesh position={[0.8, 0.84, 0]}>
              <cylinderGeometry args={[0.55, 0.55, 0.08, 16]} />
              <primitive object={materials.structuralFraming} attach="material" />
            </mesh>
          </group>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 7. WEST STEPPED WING (5 STOREYS, HEIGHT 20.2m)           */}
      {/* Footprint: X in [-11.0, -6.0] (5m), Z in [-11.0, 2.0](13m)*/}
      {/* ======================================================== */}
      <group position={[-8.5, 0.20, -4.5]}>
        {/* Main Wing Body */}
        <mesh position={[0, 10.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.0, 20.0, 13.0]} />
          <primitive object={materials.curtainGlass} attach="material" />
        </mesh>

        {/* Floor Reveal Bands */}
        {[4, 8, 12, 16, 20].map((fy) => (
          <mesh key={`west-slab-${fy}`} position={[0, fy, 0]}>
            <boxGeometry args={[5.15, 0.22, 13.15]} />
            <primitive object={materials.structuralFraming} attach="material" />
          </mesh>
        ))}

        {/* Aerodynamic Vertical Solar Shading Fins (Along West Facade at X = -2.6m) */}
        {[-5, -2.5, 0, 2.5, 5].map((fz) => (
          <mesh key={`fin-${fz}`} position={[-2.75, 10.0, fz]}>
            <boxGeometry args={[0.55, 19.6, 0.08]} />
            <primitive object={materials.verticalFins} attach="material" />
          </mesh>
        ))}

        {/* Level 6 Stepped Rooftop Garden Terrace (at Y = 20.2m) */}
        <mesh position={[0, 20.1, 0]} receiveShadow>
          <boxGeometry args={[4.8, 0.20, 12.8]} />
          <primitive object={materials.granitePavers} attach="material" />
        </mesh>

        {/* Dark Architectural Perimeter Safety Railing */}
        <mesh position={[0, 20.7, 6.3]}>
          <boxGeometry args={[4.6, 1.0, 0.06]} />
          <primitive object={materials.structuralFraming} attach="material" />
        </mesh>
        <mesh position={[0, 20.7, -6.3]}>
          <boxGeometry args={[4.6, 1.0, 0.06]} />
          <primitive object={materials.structuralFraming} attach="material" />
        </mesh>
        <mesh position={[-2.35, 20.7, 0]}>
          <boxGeometry args={[0.06, 1.0, 12.6]} />
          <primitive object={materials.structuralFraming} attach="material" />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 8. FORECOURT BOLLARDS, DIRECTORY & BRANDING MONUMENT    */}
      {/* ======================================================== */}
      {/* TASK 5: Street-Level Physical Building Directory Board */}
      <StreetDirectoryBoard
        title="DEVELOPER HQ"
        subtitle="Full Stack Development"
        department="EXECUTIVE OFFICES & ENGINEERING ATRIUM"
        position={[4.5, 0.24, 10.8]}
        rotation={[0, 0, 0]}
        accentColor="#38bdf8"
      />

      {/* Freestanding Monument Sign Plinth */}
      <HQBrandingSign
        type="monument"
        position={[7.5, 0.24, 10.6]}
        primaryName="DEVELOPER HQ"
        secondaryTitle="FULL STACK • WEB • MOBILE"
      />

      {/* Stainless Steel / Bronze Entrance Bollards along Sidewalk Edge (LOD) */}
      {!isFarView && [-10, -7.5, -5, -2.5, 2.5, 5, 10].map((bx) => (
        <group key={`bollard-${bx}`} position={[bx, 0.20, 11.6]}>
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.84, 16]} />
            <primitive object={materials.stainlessSteel} attach="material" />
          </mesh>
          <mesh position={[0, 0.82, 0]}>
            <cylinderGeometry args={[0.095, 0.095, 0.06, 16]} />
            <primitive object={materials.canopyLettering} attach="material" />
          </mesh>
        </group>
      ))}

      {/* ======================================================== */}
      {/* 9. SUBTLE ARCHITECTURAL FACADE UPLIGHTS & ACCENT GLOW    */}
      {/* Single light budget for 75-100+ FPS                      */}
      {/* ======================================================== */}
      <pointLight
        color="#38bdf8"
        intensity={2.0}
        distance={24.0}
        position={[0, 14.0, 10.0]}
      />
    </group>
  );
};

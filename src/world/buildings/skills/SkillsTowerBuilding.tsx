'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getSharedSkillsMaterials } from './SkillsMaterials';
import { SkillsLobbyInterior } from './SkillsLobbyInterior';
import { SKILLS_TOWER_METADATA } from './skillsMetadata';
import { BuildingSignage } from '../signage/BuildingSignage';
import { StreetDirectoryBoard } from '../signage/StreetDirectoryBoard';
import { useWorldStore, worldStore } from '../../stores/worldStore';

interface SkillsTowerBuildingProps {
  position?: [number, number, number];
  selectedFloor?: number | null;
  onInteract?: () => void;
  onSelectFloor?: (floorNumber: number) => void;
}

/**
 * PHASE 2.3 — Custom Skills & Technology Tower
 * 
 * Distinctive 10-storey premium technology tower located at [-40, 0] (block-1-0):
 * - Inspired by modern sculptured architecture (Reference Image):
 *   1. Monolithic dark charcoal exterior shell with iconic sweeping parabolic cutout
 *   2. Soaring curved ribbon glass curtain wall with projecting warm bronze floor slab bands
 *   3. Right-flank vertical architectural bronze fins curving gracefully into the crown
 *   4. Double-height entrance lobby with warm acoustic timber slat portal
 *   5. Illuminated sweeping architectural crown & open-air rooftop Technology Observatory
 *   6. Real-time 3D interactive floor highlighting corresponding to technical categories
 *   7. Reusable offline dimensional signage & sidewalk street directory board
 * 
 * 100% Single-Pass PBR materials for high 60-90+ FPS performance.
 */
export const SkillsTowerBuilding: React.FC<SkillsTowerBuildingProps> = ({
  position = [-40.0, 0, 0.0],
  selectedFloor = null,
  onInteract,
  onSelectFloor,
}) => {
  const materials = getSharedSkillsMaterials();
  const selectedLandmark = useWorldStore((s) => s.selectedLandmark);
  const hoveredLandmark = useWorldStore((s) => s.hoveredLandmark);
  const isSelected = selectedLandmark === 'skills';
  const isHovered = hoveredLandmark === 'skills';
  const cameraPreset = useWorldStore((s) => s.cameraPreset);
  const isFarView = cameraPreset === 'landmarks_skyline' || cameraPreset === 'full_island_aerial' || cameraPreset === 'downtown_skyline';
  const showInterior = isSelected || !isFarView;

  const handleBuildingClick = (e: any) => {
    e.stopPropagation();
    worldStore.getState().setSelectedLandmark('skills');
    worldStore.getState().setCameraView('orbit', 'skills_three_quarter');
    if (onInteract) onInteract();
    else if (onSelectFloor) onSelectFloor(1);
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    worldStore.getState().setHoveredLandmark('skills');
  };

  const handlePointerOut = () => {
    worldStore.getState().setHoveredLandmark(null);
  };

  // 10 Floor slab elevations (Ground to Roof)
  const floorLevels = useMemo(() => [
    { num: 0, label: 'Ground Floor', y: 0.24, height: 4.0 },
    { num: 1, label: 'Floor 1 — Frontend', y: 4.24, height: 3.6 },
    { num: 2, label: 'Floor 2 — Mobile', y: 7.84, height: 3.6 },
    { num: 3, label: 'Floor 3 — Backend', y: 11.44, height: 3.6 },
    { num: 4, label: 'Floor 4 — Full Stack', y: 15.04, height: 3.6 },
    { num: 5, label: 'Floor 5 — Programming', y: 18.64, height: 3.6 },
    { num: 6, label: 'Floor 6 — Databases', y: 22.24, height: 3.6 },
    { num: 7, label: 'Floor 7 — Dev Tools', y: 25.84, height: 3.6 },
    { num: 8, label: 'Floor 8 — AI & Research', y: 29.44, height: 3.6 },
    { num: 9, label: 'Roof — Observatory', y: 33.04, height: 4.2 },
  ], []);

  const activeHighlightedFloor = floorLevels.find(
    (fl) => fl.num === selectedFloor
  );

  return (
    <group
      name="portfolio_skills_tower"
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
              color={isSelected ? '#38bdf8' : '#67e8f9'}
              wireframe
              transparent
              opacity={isSelected ? 0.9 : 0.45}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(24.0, 0.12, 24.0)]} />
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
      {/* 1. PLINTH FOUNDATION & FORECOURT ENTRANCE TERRACE        */}
      {/* Footprint: [-11.8, 11.8] x [-11.8, 11.8]                 */}
      {/* ======================================================== */}
      {/* Main Base Plinth (Top at Y = 0.24m, clean 4cm step above 0.20m sidewalk) */}
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[23.6, 0.24, 23.6]} />
        <primitive object={materials.whiteLimestone} attach="material" />
      </mesh>

      {/* East Entrance Granite Paved Terrace (Facing Avenue: X in [7.5, 11.8], top at Y = 0.255m) */}
      <mesh position={[9.6, 0.245, 0]} receiveShadow>
        <boxGeometry args={[4.2, 0.01, 23.2]} />
        <primitive object={materials.granitePavers} attach="material" />
      </mesh>

      {/* Accessible Entrance Approach Threshold Ramp (East edge at X = 11.6m) */}
      <mesh position={[11.6, 0.22, 0]} receiveShadow>
        <boxGeometry args={[0.6, 0.04, 12.0]} />
        <primitive object={materials.granitePavers} attach="material" />
      </mesh>

      {/* East Forecourt Manicured Planters (Flanking Entrance) */}
      {[-7.5, 7.5].map((pz) => (
        <group key={`planter-${pz}`} position={[9.6, 0.24, pz]}>
          <mesh position={[0, 0.18, 0]} receiveShadow>
            <boxGeometry args={[3.2, 0.36, 6.6]} />
            <primitive object={materials.whiteLimestone} attach="material" />
          </mesh>
          <mesh position={[0, 0.38, 0]}>
            <boxGeometry args={[2.8, 0.20, 6.2]} />
            <meshStandardMaterial color="#166534" roughness={0.75} />
          </mesh>
        </group>
      ))}

      {/* ======================================================== */}
      {/* 2. GROUND-FLOOR DOUBLE-HEIGHT LOBBY INTERIOR (LOD)       */}
      {/* ======================================================== */}
      {showInterior && <SkillsLobbyInterior onSelectFloor={onSelectFloor} onInteract={onInteract} />}

      {/* ======================================================== */}
      {/* 3. MAIN TOWER CORE & CURVED GLASS CURTAIN WALL (10 FLOORS)*/}
      {/* Height: 0.24m to 33.0m (Floors Ground to 8)               */}
      {/* ======================================================== */}
      <group position={[0, 0, 0]}>
        {/* Main Ribbon Glazing Glass Volume (17.2m x 32.8m x 17.2m) */}
        <mesh position={[0, 16.64, 0]} castShadow receiveShadow>
          <boxGeometry args={[17.2, 32.8, 17.2]} />
          <primitive object={materials.towerCurtainGlass} attach="material" />
        </mesh>

        {/* 10 Projecting Warm Bronze Horizontal Floor Slab Fascias (Reference Image) */}
        {floorLevels.map((fl) => (
          <group key={`floor-slab-${fl.num}`} position={[0, fl.y, 0]}>
            {/* Projecting Bronze Slab Cornice Reveal */}
            <mesh position={[0, 0.12, 0]}>
              <boxGeometry args={[17.7, 0.24, 17.7]} />
              <primitive object={materials.warmBronze} attach="material" />
            </mesh>
            {/* Subtle Bronze Under-Soffit Reveal (LOD) */}
            {!isFarView && (
              <mesh position={[0, -0.04, 0]}>
                <boxGeometry args={[17.5, 0.08, 17.5]} />
                <primitive object={materials.darkMullions} attach="material" />
              </mesh>
            )}
          </group>
        ))}

        {/* ======================================================== */}
        {/* 4. MONOLITHIC DARK CHARCOAL SHEAR WALL & PARABOLIC CUTOUT*/}
        {/* (Signature Architectural Form from Reference Image)     */}
        {/* ======================================================== */}
        {/* West Solid Monolithic Shear Wall Flank */}
        <mesh position={[-8.9, 16.64, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 33.2, 18.0]} />
          <primitive object={materials.darkCharcoalFrame} attach="material" />
        </mesh>

        {/* North Solid Monolithic Wall Flank */}
        <mesh position={[0, 16.64, -8.9]} castShadow receiveShadow>
          <boxGeometry args={[17.8, 33.2, 0.7]} />
          <primitive object={materials.darkCharcoalFrame} attach="material" />
        </mesh>

        {/* Primary Facade Sweeping Parabolic Curved Cutout Cladding */}
        {/* Stepped sculptural arches forming the sweeping elliptical cutout (Ref Image) */}
        {[
          { y: 3.5, w: 5.4, x: -6.0, z: 8.9 },
          { y: 7.5, w: 4.8, x: -6.3, z: 8.9 },
          { y: 11.5, w: 4.2, x: -6.6, z: 8.9 },
          { y: 15.5, w: 3.8, x: -6.8, z: 8.9 },
          { y: 19.5, w: 3.6, x: -6.9, z: 8.9 },
          { y: 23.5, w: 4.0, x: -6.7, z: 8.9 },
          { y: 27.5, w: 4.6, x: -6.4, z: 8.9 },
          { y: 31.5, w: 5.6, x: -5.9, z: 8.9 },
        ].map((arch, idx) => (
          <mesh key={`curved-shell-${idx}`} position={[arch.x, arch.y, arch.z]}>
            <boxGeometry args={[arch.w, 3.8, 0.65]} />
            <primitive object={materials.darkCharcoalFrame} attach="material" />
          </mesh>
        ))}

        {/* Inner Bronze Edge Trim tracing the sweeping curve (LOD) */}
        {!isFarView && [
          { y: 3.5, x: -3.2, z: 9.05 },
          { y: 7.5, x: -3.8, z: 9.05 },
          { y: 11.5, x: -4.4, z: 9.05 },
          { y: 15.5, x: -4.8, z: 9.05 },
          { y: 19.5, x: -5.0, z: 9.05 },
          { y: 23.5, x: -4.6, z: 9.05 },
          { y: 27.5, x: -4.0, z: 9.05 },
          { y: 31.5, x: -3.0, z: 9.05 },
        ].map((trim, idx) => (
          <mesh key={`bronze-curve-trim-${idx}`} position={[trim.x, trim.y, trim.z]}>
            <boxGeometry args={[0.22, 3.8, 0.15]} />
            <primitive object={materials.warmBronze} attach="material" />
          </mesh>
        ))}

        {/* ======================================================== */}
        {/* 5. RIGHT-FLANK VERTICAL BRONZE ARCHITECTURAL FINS (LOD)  */}
        {/* ======================================================== */}
        {!isFarView && [3.5, 5.0, 6.5, 8.0].map((fz) => (
          <mesh key={`right-fin-${fz}`} position={[8.95, 17.5, fz]}>
            <boxGeometry args={[0.22, 34.0, 0.12]} />
            <primitive object={materials.verticalFins} attach="material" />
          </mesh>
        ))}

        {/* ======================================================== */}
        {/* 6. INTERACTIVE 3D FLOOR HIGHLIGHT BAND                   */}
        {/* Highlights the currently selected skill floor in real time*/}
        {/* ======================================================== */}
        {activeHighlightedFloor && (
          <group position={[0, activeHighlightedFloor.y + activeHighlightedFloor.height / 2, 0]}>
            {/* Glowing Emissive Floor Perimeter Band */}
            <mesh>
              <boxGeometry args={[18.0, activeHighlightedFloor.height, 18.0]} />
              <meshBasicMaterial
                color="#00f0ff"
                wireframe
                transparent
                opacity={0.85}
              />
            </mesh>
            {/* Bright Cyan Glowing Edge Strips */}
            <mesh position={[0, 0, 9.05]}>
              <boxGeometry args={[18.1, 0.15, 0.1]} />
              <primitive object={materials.cyanAccent} attach="material" />
            </mesh>
            <mesh position={[9.05, 0, 0]}>
              <boxGeometry args={[0.1, 0.15, 18.1]} />
              <primitive object={materials.cyanAccent} attach="material" />
            </mesh>
          </group>
        )}
      </group>

      {/* ======================================================== */}
      {/* 7. EAST ENTRANCE PORTAL, CANOPY & NAME BOARD             */}
      {/* Facing Central Avenue at X = 8.8m                         */}
      {/* ======================================================== */}
      <group position={[8.8, 0.24, 0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Architectural Charcoal Portal Frame Pier */}
        <mesh position={[-4.2, 4.2, 0.2]} receiveShadow>
          <boxGeometry args={[0.80, 8.4, 0.60]} />
          <primitive object={materials.darkCharcoalFrame} attach="material" />
        </mesh>
        <mesh position={[4.2, 4.2, 0.2]} receiveShadow>
          <boxGeometry args={[0.80, 8.4, 0.60]} />
          <primitive object={materials.darkCharcoalFrame} attach="material" />
        </mesh>
        <mesh position={[0, 8.1, 0.2]} receiveShadow>
          <boxGeometry args={[9.2, 0.60, 0.60]} />
          <primitive object={materials.darkCharcoalFrame} attach="material" />
        </mesh>

        {/* Cantilevered Entrance Canopy (Projects toward Avenue) */}
        <mesh position={[0, 4.4, 1.4]} castShadow receiveShadow>
          <boxGeometry args={[9.0, 0.32, 2.6]} />
          <primitive object={materials.darkMullions} attach="material" />
        </mesh>

        {/* Warm Acoustic Timber Slat Soffit Underside */}
        <mesh position={[0, 4.22, 1.4]}>
          <boxGeometry args={[8.8, 0.02, 2.4]} />
          <primitive object={materials.warmWoodSoffit} attach="material" />
        </mesh>

        {/* Recessed Warm Downlight Arrays */}
        {[-3, -1, 1, 3].map((lx) => (
          <mesh key={`canopy-downlight-${lx}`} position={[lx, 4.20, 1.4]}>
            <cylinderGeometry args={[0.14, 0.14, 0.02, 16]} />
            <primitive object={materials.bronzeAccent} attach="material" />
          </mesh>
        ))}

        {/* TASK 3: Main Entrance Primary Architectural Name Board */}
        <BuildingSignage
          title="SKILLS & TECHNOLOGY TOWER"
          subtitle="FULL STACK • MOBILE • CLOUD • AI"
          position={[0, 5.2, 1.4]}
          width={8.6}
          height={1.05}
          panelColor="#0f172a"
          titleColor="#ffffff"
          subtitleColor="#38bdf8"
          emissiveColor="#38bdf8"
          emissiveIntensity={1.8}
          fontSize={0.36}
          subtitleFontSize={0.12}
        />

        {/* Canopy Fascia Signboard */}
        <BuildingSignage
          title="SKILLS & TECHNOLOGY TOWER"
          subtitle="FULL STACK • MOBILE • CLOUD • AI"
          position={[0, 4.4, 2.72]}
          width={8.8}
          height={0.28}
          mountingStyle="canopy-fascia"
          titleColor="#ffffff"
          subtitleColor="#f59e0b"
          emissiveColor="#f59e0b"
          fontSize={0.16}
          subtitleFontSize={0.075}
        />

        {/* Automatic Sliding Glass Doors */}
        <mesh position={[-1.8, 1.6, 0.1]}>
          <boxGeometry args={[1.5, 3.2, 0.05]} />
          <primitive object={materials.lobbyGlass} attach="material" />
        </mesh>
        <mesh position={[1.8, 1.6, 0.1]}>
          <boxGeometry args={[1.5, 3.2, 0.05]} />
          <primitive object={materials.lobbyGlass} attach="material" />
        </mesh>
        <mesh position={[0, 1.6, 0.12]}>
          <boxGeometry args={[2.0, 3.2, 0.05]} />
          <primitive object={materials.lobbyGlass} attach="material" />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 8. ILLUMINATED SWEEPING ARCHITECTURAL CROWN & OBSERVATORY */}
      {/* Height: 33.0m to 42.0m                                   */}
      {/* ======================================================== */}
      <group position={[0, 33.0, 0]}>
        {/* Open-Air Technology Observatory Deck */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[16.8, 0.20, 16.8]} />
          <primitive object={materials.granitePavers} attach="material" />
        </mesh>

        {/* Observatory Bronze Perimeter Railing */}
        <mesh position={[0, 0.7, 8.35]}>
          <boxGeometry args={[16.8, 1.0, 0.06]} />
          <primitive object={materials.warmBronze} attach="material" />
        </mesh>
        <mesh position={[8.35, 0.7, 0]}>
          <boxGeometry args={[0.06, 1.0, 16.8]} />
          <primitive object={materials.warmBronze} attach="material" />
        </mesh>
        <mesh position={[-8.35, 0.7, 0]}>
          <boxGeometry args={[0.06, 1.0, 16.8]} />
          <primitive object={materials.warmBronze} attach="material" />
        </mesh>

        {/* Sweeping Arched Charcoal Shell Canopy (Reference Image) */}
        {/* Left Sweeping Arch Wall (Rising to Y = 42.0m!) */}
        <mesh position={[-8.8, 4.4, 0]} castShadow>
          <boxGeometry args={[0.7, 8.8, 17.6]} />
          <primitive object={materials.darkCharcoalFrame} attach="material" />
        </mesh>

        {/* Curved Roof Arch Cap */}
        <mesh position={[-4.0, 8.6, 0]} castShadow>
          <boxGeometry args={[9.5, 0.6, 17.6]} />
          <primitive object={materials.darkCharcoalFrame} attach="material" />
        </mesh>

        {/* Warm Bronze Ceiling Underside of Arch Canopy */}
        <mesh position={[-4.0, 8.28, 0]}>
          <boxGeometry args={[9.3, 0.04, 17.4]} />
          <primitive object={materials.warmBronze} attach="material" />
        </mesh>

        {/* Right-Flank Curving Bronze Fins crowning over the observatory */}
        {[3.5, 5.0, 6.5, 8.0].map((fz) => (
          <mesh key={`crown-fin-${fz}`} position={[8.4, 3.6, fz]}>
            <boxGeometry args={[0.22, 7.2, 0.12]} />
            <primitive object={materials.verticalFins} attach="material" />
          </mesh>
        ))}

        {/* Crown Illuminated Cyan & Bronze LED Edge Ribbon */}
        <mesh position={[-4.0, 8.92, 8.82]}>
          <boxGeometry args={[9.5, 0.08, 0.04]} />
          <primitive object={materials.cyanAccent} attach="material" />
        </mesh>
        <mesh position={[-8.82, 8.92, 0]}>
          <boxGeometry args={[0.04, 0.08, 17.6]} />
          <primitive object={materials.cyanAccent} attach="material" />
        </mesh>

        {/* Parapet-Mounted Rooftop Identification Signage (Visible from elevated cameras) */}
        <BuildingSignage
          title="SKILLS & TECHNOLOGY TOWER"
          subtitle="FULL STACK • MOBILE • CLOUD • AI"
          position={[0, 1.2, 8.42]}
          width={9.4}
          height={0.80}
          mountingStyle="parapet-fascia"
          panelColor="#0f172a"
          titleColor="#ffffff"
          subtitleColor="#38bdf8"
          emissiveColor="#38bdf8"
          emissiveIntensity={1.6}
          fontSize={0.32}
          subtitleFontSize={0.10}
        />

        {/* Compact, properly scaled mechanical elevator core */}
        <mesh position={[0, 1.6, -2.5]} receiveShadow>
          <boxGeometry args={[4.4, 3.2, 4.4]} />
          <primitive object={materials.darkMullions} attach="material" />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 9. STREET-LEVEL BUILDING DIRECTORY BOARD & BOLLARDS      */}
      {/* Located along the sidewalk near the East entrance         */}
      {/* ======================================================== */}
      {/* TASK 3: Street-Level Physical Building Directory Board */}
      <StreetDirectoryBoard
        title="SKILLS TOWER"
        subtitle="Technical Skills Matrix"
        department="10 FLOORS // ENGINEERING • MOBILE • CLOUD • AI"
        position={[10.8, 0.24, -4.5]}
        rotation={[0, Math.PI / 2, 0]}
        accentColor="#38bdf8"
      />

      {/* Stainless Steel Entrance Bollards along East Sidewalk Edge (X = 11.6m) */}
      {[-10, -7.5, -5, -2.5, 2.5, 5, 7.5, 10].map((bz) => (
        <group key={`skills-bollard-${bz}`} position={[11.6, 0.20, bz]}>
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.84, 16]} />
            <primitive object={materials.stainlessSteel} attach="material" />
          </mesh>
          <mesh position={[0, 0.82, 0]}>
            <cylinderGeometry args={[0.095, 0.095, 0.06, 16]} />
            <primitive object={materials.bronzeAccent} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Subtle Nighttime Accent Luminaire (Single budgeted light) */}
      <pointLight
        color="#38bdf8"
        intensity={2.2}
        distance={22.0}
        position={[9.5, 6.0, 0]}
      />
    </group>
  );
};

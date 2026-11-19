import React, { useRef } from 'react';
import * as THREE from 'three';
import { getSharedInnovationMaterials } from './InnovationMaterials';
import { InnovationInterior } from './InnovationInterior';
import { INNOVATION_CENTER_METADATA } from './innovationMetadata';
import { BuildingSignage } from '../signage/BuildingSignage';
import { StreetDirectoryBoard } from '../signage/StreetDirectoryBoard';
import { useWorldStore, worldStore } from '../../stores/worldStore';
import { useLandmarkInteriorLOD } from '../landmarkLod';

interface InnovationCenterBuildingProps {
  position?: [number, number, number];
  onInteract?: (metadata: typeof INNOVATION_CENTER_METADATA) => void;
  onSelectProject?: (projectId: string) => void;
}

/**
 * Phase 2.2.1 — Signature Innovation & Projects Center (Refined & Optimized)
 */
export const InnovationCenterBuilding: React.FC<InnovationCenterBuildingProps> = ({
  position = [40.0, 0, -40.0],
  onInteract,
  onSelectProject,
}) => {
  const materials = getSharedInnovationMaterials();
  const selectedLandmark = useWorldStore((s) => s.selectedLandmark);
  const hoveredLandmark = useWorldStore((s) => s.hoveredLandmark);
  const isSelected = selectedLandmark === 'innovation';
  const isHovered = hoveredLandmark === 'innovation';
  const showInterior = useLandmarkInteriorLOD([position[0], position[2]], 'innovation');
  const isFarView = !showInterior;

  const handleBuildingClick = (e: any) => {
    e.stopPropagation();
    worldStore.getState().setSelectedLandmark('innovation');
    worldStore.getState().setCameraView('orbit', 'innovation_three_quarter');
    if (onInteract) {
      onInteract(INNOVATION_CENTER_METADATA);
    }
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    worldStore.getState().setHoveredLandmark('innovation');
  };

  const handlePointerOut = () => {
    worldStore.getState().setHoveredLandmark(null);
  };

  return (
    <group
      name="portfolio_innovation_center"
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
              color={isSelected ? '#00f0ff' : '#67e8f9'}
              wireframe
              transparent
              opacity={isSelected ? 0.9 : 0.45}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(24.0, 0.12, 24.0)]} />
            <lineBasicMaterial
              color={isSelected ? '#00f0ff' : '#67e8f9'}
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

      {/* South Entrance Granite Paved Terrace (Z in [7.5, 11.8], top at Y = 0.255m) */}
      <mesh position={[0, 0.245, 9.6]} receiveShadow>
        <boxGeometry args={[23.2, 0.01, 4.2]} />
        <primitive object={materials.granitePavers} attach="material" />
      </mesh>

      {/* Accessible Entrance Approach Ramp / Threshold (Z = 11.6m) */}
      <mesh position={[0, 0.22, 11.6]} receiveShadow>
        <boxGeometry args={[12.0, 0.04, 0.6]} />
        <primitive object={materials.granitePavers} attach="material" />
      </mesh>

      {/* FORECOURT REFLECTING POOL / WATER MIRROR BASIN (Reference Images 1 & 2) */}
      {/* Located in West Forecourt: X in [-10.8, -4.2], Z in [8.0, 11.2] */}
      <group position={[-7.5, 0.24, 9.6]}>
        {/* Dark Granite Coping Rim */}
        <mesh position={[0, 0.08, 0]} receiveShadow>
          <boxGeometry args={[6.6, 0.16, 3.2]} />
          <primitive object={materials.structuralFraming} attach="material" />
        </mesh>

        {/* Calm Water Mirror Surface (Single pass PBR) */}
        <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[6.2, 2.8]} />
          <primitive object={materials.reflectingWater} attach="material" />
        </mesh>
      </group>

      {/* FORECOURT MANICURED PLANTERS & BOXWOOD HEDGING (Reference Image 1) */}
      {/* Located in East Forecourt: X in [4.2, 10.8], Z in [8.0, 11.2] */}
      <group position={[7.5, 0.24, 9.6]}>
        {/* Limestone Planter Box */}
        <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.6, 0.36, 3.2]} />
          <primitive object={materials.whiteLimestone} attach="material" />
        </mesh>
        {/* Manicured Boxwood Greenery */}
        <mesh position={[0, 0.38, 0]} castShadow>
          <boxGeometry args={[6.2, 0.20, 2.8]} />
          <meshStandardMaterial color="#166534" roughness={0.75} />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 2. GROUND-FLOOR DOUBLE-HEIGHT EXHIBITION ATRIUM (LOD)    */}
      {/* ======================================================== */}
      {showInterior && <InnovationInterior onSelectProject={onSelectProject} />}

      {/* ======================================================== */}
      {/* 3. GROUND-FLOOR DOUBLE-HEIGHT FACADES (8.4m height)       */}
      {/* Footprint: X in [-10.5, 10.5], Z in [-9.5, 8.5]          */}
      {/* ======================================================== */}
      <group position={[0, 4.4, 0]}>
        {/* South Clear Glass Facade (Z = 8.5) */}
        <mesh position={[0, 0, 8.5]} receiveShadow>
          <boxGeometry args={[21.0, 8.4, 0.08]} />
          <primitive object={materials.atriumGlass} attach="material" />
        </mesh>

        {/* East Clear Glass Facade (X = 10.5) with Vertical Architectural Fins */}
        <mesh position={[10.5, 0, -0.5]} receiveShadow>
          <boxGeometry args={[0.08, 8.4, 18.0]} />
          <primitive object={materials.atriumGlass} attach="material" />
        </mesh>
        {/* East Vertical Architectural Fins */}
        {[-8, -5, -2, 1, 4, 7].map((fz) => (
          <mesh key={`east-fin-${fz}`} position={[10.65, 0, fz]}>
            <boxGeometry args={[0.22, 8.4, 0.08]} />
            <primitive object={materials.structuralFraming} attach="material" />
          </mesh>
        ))}

        {/* West Articulated Facade (X = -10.5) with Glass View Strips & Fins */}
        <mesh position={[-10.5, 0, -0.5]} receiveShadow>
          <boxGeometry args={[0.25, 8.4, 18.0]} />
          <primitive object={materials.darkZinc} attach="material" />
        </mesh>
        {/* West Recessed Glazing Ribbon Slots */}
        {[-6, 0, 6].map((wz) => (
          <mesh key={`west-window-${wz}`} position={[-10.45, 0, wz]} receiveShadow>
            <boxGeometry args={[0.15, 6.4, 3.2]} />
            <primitive object={materials.atriumGlass} attach="material" />
          </mesh>
        ))}
        {/* West Vertical Architectural Fins */}
        {[-8, -5, -2, 1, 4, 7].map((fz) => (
          <mesh key={`west-fin-${fz}`} position={[-10.65, 0, fz]}>
            <boxGeometry args={[0.22, 8.4, 0.08]} />
            <primitive object={materials.structuralFraming} attach="material" />
          </mesh>
        ))}

        {/* North Articulated Service Facade (Z = -9.5) */}
        <mesh position={[0, 0, -9.5]} receiveShadow>
          <boxGeometry args={[21.0, 8.4, 0.25]} />
          <primitive object={materials.darkZinc} attach="material" />
        </mesh>
        {/* North Horizontal Floor Reveal & Recessed Technical Louvers */}
        <mesh position={[0, 0, -9.62]}>
          <boxGeometry args={[21.2, 0.30, 0.10]} />
          <primitive object={materials.structuralFraming} attach="material" />
        </mesh>
        {[-6, 0, 6].map((nx) => (
          <mesh key={`north-louver-${nx}`} position={[nx, 0, -9.64]}>
            <boxGeometry args={[3.8, 4.2, 0.08]} />
            <primitive object={materials.structuralFraming} attach="material" />
          </mesh>
        ))}

        {/* Monumental Colonnade Pilotis Columns (Reference Image 2) */}
        {[-8.5, -4.5, 4.5, 8.5].map((cx) => (
          <mesh key={`pilotis-${cx}`} position={[cx, 0, 8.7]} receiveShadow>
            <cylinderGeometry args={[0.24, 0.24, 8.4, 20]} />
            <primitive object={materials.stainlessSteel} attach="material" />
          </mesh>
        ))}

        {/* South Facade Diagonal Diagrid Exoskeleton Members (LOD) */}
        {!isFarView && [-8, -4, 0, 4, 8].map((dx) => (
          <React.Fragment key={`diagrid-south-${dx}`}>
            {/* Left Diagonal */}
            <mesh position={[dx, 0, 8.58]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.14, 11.8, 0.10]} />
              <primitive object={materials.stainlessSteel} attach="material" />
            </mesh>
            {/* Right Diagonal */}
            <mesh position={[dx, 0, 8.58]} rotation={[0, 0, -Math.PI / 4]}>
              <boxGeometry args={[0.14, 11.8, 0.10]} />
              <primitive object={materials.stainlessSteel} attach="material" />
            </mesh>
          </React.Fragment>
        ))}
      </group>

      {/* ======================================================== */}
      {/* 4. SIGNATURE ENTRANCE PORTAL, CANOPY & SLIDING DOORS     */}
      {/* Centered at X = 0.0, Z = 8.5                             */}
      {/* ======================================================== */}
      <group position={[0, 0.24, 8.5]}>
        {/* White Honed Architectural Limestone Portal Frame */}
        {/* Left Portal Pylon */}
        <mesh position={[-3.6, 4.2, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[0.70, 8.4, 0.50]} />
          <primitive object={materials.whiteLimestone} attach="material" />
        </mesh>
        {/* Right Portal Pylon */}
        <mesh position={[3.6, 4.2, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[0.70, 8.4, 0.50]} />
          <primitive object={materials.whiteLimestone} attach="material" />
        </mesh>
        {/* Portal Architrave */}
        <mesh position={[0, 8.1, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[7.9, 0.60, 0.50]} />
          <primitive object={materials.whiteLimestone} attach="material" />
        </mesh>

        {/* Modern Cantilevered Entrance Canopy (Projects forward to Z = 10.8m) */}
        <mesh position={[0, 4.2, 1.15]} castShadow receiveShadow>
          <boxGeometry args={[8.4, 0.30, 2.3]} />
          <primitive object={materials.darkZinc} attach="material" />
        </mesh>

        {/* WARM ACOUSTIC TIMBER SLAT SOFFIT (Reference Image 2) */}
        <mesh position={[0, 4.04, 1.15]}>
          <boxGeometry args={[8.2, 0.02, 2.1]} />
          <primitive object={materials.warmWoodSoffit} attach="material" />
        </mesh>

        {/* Canopy Underside Warm Recessed LED Light Troughs (LOD) */}
        {!isFarView && [-2.5, 0, 2.5].map((lx) => (
          <mesh key={`canopy-trough-${lx}`} position={[lx, 4.03, 1.15]}>
            <boxGeometry args={[1.6, 0.02, 1.6]} />
            <primitive object={materials.canopyLettering} attach="material" />
          </mesh>
        ))}

        {/* Architectural Entrance Portal Identification Board (Phase 2.3) */}
        <BuildingSignage
          title="INNOVATION CENTER"
          subtitle="PROJECTS • RESEARCH • DEVELOPMENT"
          position={[0, 8.8, 0.52]}
          width={7.4}
          height={0.95}
          panelColor="#0f172a"
          titleColor="#ffffff"
          subtitleColor="#00f0ff"
          emissiveColor="#00f0ff"
          emissiveIntensity={1.8}
          fontSize={0.38}
          subtitleFontSize={0.13}
        />

        {/* Illuminated "INNOVATION CENTER" Canopy Fascia Signage */}
        <BuildingSignage
          title="INNOVATION CENTER"
          subtitle="PROJECTS • RESEARCH • DEVELOPMENT"
          position={[0, 4.2, 2.34]}
          width={8.0}
          height={0.24}
          mountingStyle="canopy-fascia"
          fontSize={0.15}
          subtitleFontSize={0.07}
        />

        {/* Automatic Sliding Glass Doors Assembly (LOD) */}
        {!isFarView && (
          <group>
            {/* Fixed Glass Side Lites */}
            <mesh position={[-2.0, 1.6, 0.1]}>
              <boxGeometry args={[1.5, 3.2, 0.05]} />
              <primitive object={materials.atriumGlass} attach="material" />
            </mesh>
            <mesh position={[2.0, 1.6, 0.1]}>
              <boxGeometry args={[1.5, 3.2, 0.05]} />
              <primitive object={materials.atriumGlass} attach="material" />
            </mesh>

            {/* Center Sliding Glass Doors */}
            <mesh position={[-0.6, 1.6, 0.12]}>
              <boxGeometry args={[1.2, 3.2, 0.05]} />
              <primitive object={materials.atriumGlass} attach="material" />
            </mesh>
            <mesh position={[0.6, 1.6, 0.12]}>
              <boxGeometry args={[1.2, 3.2, 0.05]} />
              <primitive object={materials.atriumGlass} attach="material" />
            </mesh>

            {/* Door Framing & Overhead Header Bar */}
            <mesh position={[0, 3.25, 0.12]}>
              <boxGeometry args={[5.6, 0.10, 0.10]} />
              <primitive object={materials.stainlessSteel} attach="material" />
            </mesh>
          </group>
        )}
      </group>

      {/* ======================================================== */}
      {/* 5. LEVELS 3 & 4: CANTILEVERED UPPER VOLUME (8.6m - 18.5m)*/}
      {/* Asymmetrical Forward & Side Projection (Ref Image 1 & 3) */}
      {/* ======================================================== */}
      <group position={[0, 13.5, -1.0]}>
        {/* Main Cantilevered Body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[22.4, 9.8, 17.5]} />
          <primitive object={materials.curtainGlass} attach="material" />
        </mesh>

        {/* Dark Zinc Floor & Soffit Band (Level 3 Cantilever Underside) */}
        <mesh position={[0, -4.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[22.6, 0.40, 17.7]} />
          <primitive object={materials.darkZinc} attach="material" />
        </mesh>

        {/* Level 4 Intermediate Slab Reveal */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[22.5, 0.25, 17.6]} />
          <primitive object={materials.structuralFraming} attach="material" />
        </mesh>

        {/* White Architectural Limestone Accent Border Frame */}
        <mesh position={[-11.25, 0, 8.7]} castShadow>
          <boxGeometry args={[0.40, 9.8, 0.40]} />
          <primitive object={materials.whiteLimestone} attach="material" />
        </mesh>
        <mesh position={[11.25, 0, 8.7]} castShadow>
          <boxGeometry args={[0.40, 9.8, 0.40]} />
          <primitive object={materials.whiteLimestone} attach="material" />
        </mesh>
        <mesh position={[0, 4.8, 8.7]} castShadow>
          <boxGeometry args={[22.8, 0.40, 0.40]} />
          <primitive object={materials.whiteLimestone} attach="material" />
        </mesh>

        {/* Horizontal Brise-Soleil Aerodynamic Sunshade Louvers */}
        {[-2.5, 2.5].map((sy) => (
          <mesh key={`sunshade-${sy}`} position={[0, sy, 8.95]}>
            <boxGeometry args={[22.0, 0.10, 0.50]} />
            <primitive object={materials.stainlessSteel} attach="material" />
          </mesh>
        ))}
      </group>

      {/* ======================================================== */}
      {/* 6. LEVEL 5: RECESSED R&D SKY TERRACE & PAVILION (18.5m - 24m) */}
      {/* ======================================================== */}
      <group position={[0, 21.2, -4.5]}>
        {/* Enclosed Office & Lab Penthouse Core */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[20.0, 5.4, 10.5]} />
          <primitive object={materials.curtainGlass} attach="material" />
        </mesh>

        {/* Open-Air Sky Terrace Deck (South of Enclosure at Z in [0.75, 6.75]) */}
        <mesh position={[0, -2.6, 5.8]} receiveShadow>
          <boxGeometry args={[20.2, 0.20, 5.8]} />
          <primitive object={materials.granitePavers} attach="material" />
        </mesh>

        {/* Landscaped Planter Box with Lush Greenery */}
        <mesh position={[0, -2.25, 8.4]} castShadow>
          <boxGeometry args={[19.6, 0.45, 0.45]} />
          <primitive object={materials.whiteLimestone} attach="material" />
        </mesh>
        <mesh position={[0, -1.95, 8.4]}>
          <boxGeometry args={[19.4, 0.20, 0.40]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>

        {/* Clear Glass Balustrade on Terrace Rim */}
        <mesh position={[0, -2.0, 8.65]}>
          <boxGeometry args={[20.0, 1.0, 0.05]} />
          <primitive object={materials.atriumGlass} attach="material" />
        </mesh>
        <mesh position={[-10.0, -2.0, 5.8]}>
          <boxGeometry args={[0.05, 1.0, 5.8]} />
          <primitive object={materials.atriumGlass} attach="material" />
        </mesh>
        <mesh position={[10.0, -2.0, 5.8]}>
          <boxGeometry args={[0.05, 1.0, 5.8]} />
          <primitive object={materials.atriumGlass} attach="material" />
        </mesh>
      </group>

      {/* ======================================================== */}
      {/* 7. ROOFTOP CROWN, PARAPET & MECHANICAL CHILLERS          */}
      {/* Mounted flush on Level 5 roof slab at Y = 23.9m           */}
      {/* ======================================================== */}
      <group position={[0, 23.9, -4.5]}>
        {/* Sleek Dark Zinc Parapet Wall (1.0m height) */}
        <mesh position={[0, 0.5, 5.2]}>
          <boxGeometry args={[20.2, 1.0, 0.20]} />
          <primitive object={materials.darkZinc} attach="material" />
        </mesh>
        <mesh position={[0, 0.5, -5.2]}>
          <boxGeometry args={[20.2, 1.0, 0.20]} />
          <primitive object={materials.darkZinc} attach="material" />
        </mesh>
        <mesh position={[-10.1, 0.5, 0]}>
          <boxGeometry args={[0.20, 1.0, 10.6]} />
          <primitive object={materials.darkZinc} attach="material" />
        </mesh>
        <mesh position={[10.1, 0.5, 0]}>
          <boxGeometry args={[0.20, 1.0, 10.6]} />
          <primitive object={materials.darkZinc} attach="material" />
        </mesh>

        {/* Parapet Coping Trim Cap */}
        <mesh position={[0, 1.02, 5.2]}>
          <boxGeometry args={[20.3, 0.05, 0.26]} />
          <primitive object={materials.stainlessSteel} attach="material" />
        </mesh>
        <mesh position={[0, 1.02, -5.2]}>
          <boxGeometry args={[20.3, 0.05, 0.26]} />
          <primitive object={materials.stainlessSteel} attach="material" />
        </mesh>
        <mesh position={[-10.1, 1.02, 0]}>
          <boxGeometry args={[0.26, 0.05, 10.7]} />
          <primitive object={materials.stainlessSteel} attach="material" />
        </mesh>
        <mesh position={[10.1, 1.02, 0]}>
          <boxGeometry args={[0.26, 0.05, 10.7]} />
          <primitive object={materials.stainlessSteel} attach="material" />
        </mesh>

        {/* TASK 3: Parapet-Mounted Rooftop Identification Signage (Visible from elevated / aerial views) */}
        <BuildingSignage
          title="INNOVATION CENTER"
          subtitle="PROJECTS • RESEARCH • DEVELOPMENT"
          position={[0, 0.5, 5.32]}
          width={9.8}
          height={0.76}
          mountingStyle="parapet-fascia"
          panelColor="#0f172a"
          titleColor="#ffffff"
          subtitleColor="#00f0ff"
          emissiveColor="#00f0ff"
          emissiveIntensity={1.5}
          fontSize={0.32}
          subtitleFontSize={0.10}
        />

        {/* Proportional Modular HVAC Mechanical Units with Acoustic Louvers */}
        <group position={[-4.5, 0.8, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[3.8, 1.6, 3.2]} />
            <primitive object={materials.darkZinc} attach="material" />
          </mesh>
          <mesh position={[-0.8, 0.84, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 0.08, 16]} />
            <primitive object={materials.structuralFraming} attach="material" />
          </mesh>
          <mesh position={[0.8, 0.84, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 0.08, 16]} />
            <primitive object={materials.structuralFraming} attach="material" />
          </mesh>
        </group>

        <group position={[4.5, 0.8, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[3.8, 1.6, 3.2]} />
            <primitive object={materials.darkZinc} attach="material" />
          </mesh>
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

      {/* ======================================================== */}
      {/* 8. FORECOURT BOLLARDS, DIRECTORY & PYLON MONUMENT       */}
      {/* ======================================================== */}
      {/* TASK 5: Street-Level Physical Building Directory Board */}
      <StreetDirectoryBoard
        title="INNOVATION CENTER"
        subtitle="Projects & Research"
        department="APPLIED R&D • INTERACTIVE LABS"
        position={[4.8, 0.24, 10.8]}
        rotation={[0, 0, 0]}
        accentColor="#00f0ff"
      />
      {/* Freestanding Pylon Monument Sign */}
      <group position={[8.5, 0.24, 10.6]}>
        {/* Granite Plinth Base */}
        <mesh position={[0, 0.20, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.0, 0.40, 0.60]} />
          <primitive object={materials.darkZinc} attach="material" />
        </mesh>
        {/* Double-Sided Architectural Signboard */}
        <BuildingSignage
          title="INNOVATION CENTER"
          subtitle="PROJECTS • RESEARCH • DEVELOPMENT"
          position={[0, 1.05, 0]}
          width={2.8}
          height={1.3}
          panelColor="#0f172a"
          titleColor="#ffffff"
          subtitleColor="#00f0ff"
          emissiveColor="#00f0ff"
          fontSize={0.21}
          subtitleFontSize={0.075}
        />
      </group>

      {/* Stainless Steel Entrance Bollards along Sidewalk Edge (LOD) */}
      {!isFarView && [-10, -7.5, -5, -2.5, 2.5, 5, 10].map((bx) => (
        <group key={`inno-bollard-${bx}`} position={[bx, 0.20, 11.6]}>
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.84, 16]} />
            <primitive object={materials.stainlessSteel} attach="material" />
          </mesh>
          <mesh position={[0, 0.82, 0]}>
            <cylinderGeometry args={[0.095, 0.095, 0.06, 16]} />
            <primitive object={materials.neonRibbon} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

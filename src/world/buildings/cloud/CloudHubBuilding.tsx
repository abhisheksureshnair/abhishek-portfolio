'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getSharedCloudMaterials } from './CloudMaterials';
import { CloudLobbyInterior } from './CloudLobbyInterior';
import { StreetDirectoryBoard } from '../signage/StreetDirectoryBoard';
import { useWorldStore, worldStore } from '../../stores/worldStore';
import { useLandmarkInteriorLOD } from '../landmarkLod';

interface CloudHubBuildingProps {
  position?: [number, number, number];
  onInteract?: () => void;
  onSelectZone?: (zoneId: string) => void;
}

/**
 * PHASE 2.8 — Cloud Ecosystem Hub
 * 
 * Distinctive 6-storey futuristic technology headquarters at [40, 40] (block-2-2):
 * - Faithful to user reference photo (media_1795097568600_5322bbdc.jpg):
 *   1. Sweeping Parabolic Curved Glass Facade:
 *      Iconic rising curved glass curtain wall with vertical silver structural mullions/fins and sloping roofline.
 *   2. Signature Feature: Illuminated Cyan Cloud Constellation & Network Ribbon:
 *      Glowing undulating light streams and digital constellation nodes suspended along the upper glass facade.
 *   3. Curved Cantilevered Pedestrian Viaduct / Skybridge:
 *      Sweeping elevated walkway with landscaped green terrace deck, balustrade, and structural pilotis columns.
 *   4. Recessed Double-Height Glass Entrance Lobby:
 *      Transparent ground floor glazing with warm interior hospitality illumination.
 *   5. Interactive 5-Node Holographic Architecture Display inside lobby:
 *      Frontend Apps → API Layer → Backend Services → Database / Firebase → Deployment Infra.
 *   6. Dimensional Entrance Signage & Street Directory:
 *      "CLOUD ECOSYSTEM HUB" // "CONNECT • BUILD • DEPLOY"
 *   7. Realistic rooftop mechanical penthouse, HVAC chillers, and satellite communication dish.
 *   8. Full LOD efficiency maintaining 60+ FPS.
 */
export const CloudHubBuilding: React.FC<CloudHubBuildingProps> = ({
  position = [40.0, 0, 40.0],
  onInteract,
  onSelectZone,
}) => {
  const materials = getSharedCloudMaterials();
  const selectedLandmark = useWorldStore((s) => s.selectedLandmark);
  const hoveredLandmark = useWorldStore((s) => s.hoveredLandmark);

  const isSelected = selectedLandmark === 'cloud';
  const isHovered = hoveredLandmark === 'cloud';
  const showInterior = useLandmarkInteriorLOD([position[0], position[2]], 'cloud');

  // Animation refs for glowing cloud stream ribbon and rooftop radar
  const cloudRibbonRef = useRef<THREE.Group>(null);
  const radarRef = useRef<THREE.Group>(null);
  const hvacFan1Ref = useRef<THREE.Mesh>(null);
  const hvacFan2Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (radarRef.current) {
      radarRef.current.rotation.y += delta * 0.75;
    }
    if (hvacFan1Ref.current) {
      hvacFan1Ref.current.rotation.z += delta * 6.0;
    }
    if (hvacFan2Ref.current) {
      hvacFan2Ref.current.rotation.z += delta * 5.2;
    }

    // Subtle undulation on glowing cyan network ribbon
    if (cloudRibbonRef.current) {
      cloudRibbonRef.current.position.y = 14.5 + Math.sin(t * 1.2) * 0.15;
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
      name="portfolio_cloud_ecosystem_hub"
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

      {/* Recessed Ground LED Accent Strip along Plinth Edges */}
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
        <mesh position={[0, 0.13, -0.01]}>
          <boxGeometry args={[12.4, 0.02, 0.04]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
      </group>

      {/* Landscaped Forecourt Greenery & Glowing LED Curb Strips (Image 1 Feature) */}
      <group position={[-8.5, 0.24, -8.2]}>
        <mesh position={[0, 0.06, 0]} receiveShadow>
          <cylinderGeometry args={[2.8, 3.2, 0.12, 24]} />
          <meshStandardMaterial color="#14532d" roughness={0.85} />
        </mesh>
        {/* Illuminated Neon Curb Ring */}
        <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.75, 2.9, 24]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
        {/* Modern Campus Tree */}
        <group position={[0, 0.12, 0]}>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.08, 0.14, 2.4, 8]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
          <mesh position={[0, 2.8, 0]}>
            <sphereGeometry args={[1.2, 12, 12]} />
            <meshStandardMaterial color="#15803d" roughness={0.7} />
          </mesh>
        </group>
      </group>

      <group position={[9.0, 0.24, -4.5]}>
        <mesh position={[0, 0.06, 0]} receiveShadow>
          <cylinderGeometry args={[2.2, 2.6, 0.12, 24]} />
          <meshStandardMaterial color="#14532d" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.15, 2.3, 24]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
        {/* Modern Campus Tree */}
        <group position={[0, 0.12, 0]}>
          <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.08, 0.13, 2.2, 8]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
          <mesh position={[0, 2.5, 0]}>
            <sphereGeometry args={[1.05, 12, 12]} />
            <meshStandardMaterial color="#15803d" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* =========================================================================
          VOLUME 1: SWEEPING PARABOLIC CURVED GLASS FACADE (REFERENCE PHOTO FEATURE)
          Rising majestically with vertical structural fins and blue-gray glazing
          ========================================================================= */}
      <group position={[0, 11.5, 0]}>
        {/* Main Curved Glass Curtain Wall Body */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry
            args={[10.6, 11.2, 22.0, 36, 1, false, -Math.PI * 0.48, Math.PI * 0.96]}
          />
          <primitive object={materials.curtainGlassDarkBlue} attach="material" />
        </mesh>

        {/* East/South Structural Backing Wall Enclosing Private Cores */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry
            args={[10.5, 11.1, 22.0, 24, 1, false, Math.PI * 0.48, Math.PI * 1.04]}
          />
          <primitive object={materials.titaniumGraphite} attach="material" />
        </mesh>

        {/* Vertical Silver Architectural Fins / Mullions (Reference Photo) */}
        {[-8, -6.5, -5, -3.5, -2, -0.5, 1, 2.5, 4, 5.5, 7, 8.5].map((angleStep, idx) => {
          const rad = (angleStep / 10) * Math.PI * 0.46;
          const fx = Math.sin(rad) * 11.25;
          const fz = -Math.cos(rad) * 11.25;
          return (
            <mesh key={`fin-${idx}`} position={[fx, 0, fz]} rotation={[0, -rad, 0]}>
              <boxGeometry args={[0.08, 22.2, 0.35]} />
              <primitive object={materials.structuralSilver} attach="material" />
            </mesh>
          );
        })}

        {/* Sloping Parabolic Crown Rim along Roofline (Reflecting sweeping photo curve) */}
        <mesh position={[0, 11.1, 0]} rotation={[0.08, 0, 0.12]}>
          <cylinderGeometry
            args={[10.75, 10.75, 0.3, 36, 1, true, -Math.PI * 0.5, Math.PI * 1.0]}
          />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>

        {/* Prominent Glowing Cyan Cloud Facade Screen (North Facade - Image 1 Feature) */}
        <group position={[0, 3.2, -10.9]}>
          <mesh castShadow>
            <boxGeometry args={[14.8, 8.8, 0.25]} />
            <primitive object={materials.titaniumGraphite} attach="material" />
          </mesh>
          <mesh position={[0, 0, -0.14]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[14.5, 8.5]} />
            <primitive object={materials.curvedFacadeTextureMat} attach="material" />
          </mesh>
          {/* Glowing Cybernetic Border Trim */}
          <lineSegments position={[0, 0, -0.15]}>
            <edgesGeometry args={[new THREE.BoxGeometry(14.56, 8.56, 0.02)]} />
            <lineBasicMaterial color="#00f0ff" linewidth={2} />
          </lineSegments>
        </group>

        {/* Prominent Glowing Cyan Cloud Facade Screen (East Facade - Image 1 Feature) */}
        <group position={[10.9, 3.2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[14.8, 8.8, 0.25]} />
            <primitive object={materials.titaniumGraphite} attach="material" />
          </mesh>
          <mesh position={[0, 0, -0.14]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[14.5, 8.5]} />
            <primitive object={materials.curvedFacadeTextureMat} attach="material" />
          </mesh>
          <lineSegments position={[0, 0, -0.15]}>
            <edgesGeometry args={[new THREE.BoxGeometry(14.56, 8.56, 0.02)]} />
            <lineBasicMaterial color="#00f0ff" linewidth={2} />
          </lineSegments>
        </group>
      </group>

      {/* =========================================================================
          SIGNATURE FEATURE: ILLUMINATED CYAN CLOUD CONSTELLATION & NETWORK RIBBON
          Undulating glowing data streams running along the upper curved glass
          ========================================================================= */}
      <group ref={cloudRibbonRef} position={[0, 14.5, -8.2]}>
        {/* Continuous Undulating Glowing Stream Loops (Reference Photo) */}
        <mesh rotation={[0.18, 0, -0.15]}>
          <torusGeometry args={[5.8, 0.08, 8, 48]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
        <mesh position={[0, 1.2, 0.3]} rotation={[-0.12, 0.2, 0.1]}>
          <torusGeometry args={[4.6, 0.065, 8, 48]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>
        <mesh position={[0, -1.0, 0.2]} rotation={[0.25, -0.1, -0.08]}>
          <torusGeometry args={[3.8, 0.06, 8, 48]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>

        {/* Floating Constellation Data Nodes */}
        {[-3.8, -1.8, 0, 1.8, 3.8].map((nx, idx) => (
          <group key={`c-node-${idx}`} position={[nx, Math.sin(idx * 1.4) * 0.8, (idx % 2) * 0.3]}>
            <mesh>
              <sphereGeometry args={[0.16, 12, 12]} />
              <primitive object={materials.whiteNeonGlow} attach="material" />
            </mesh>
            <mesh>
              <ringGeometry args={[0.22, 0.28, 16]} />
              <meshBasicMaterial color="#00f0ff" side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

        {/* Ambient Cyan Aura from the Cloud Network Ribbon */}
        <pointLight color="#00f0ff" intensity={2.4} distance={16.0} position={[0, 0, 1.0]} />
      </group>

      {/* =========================================================================
          VOLUME 2: CURVED CANTILEVERED PEDESTRIAN VIADUCT / SKYBRIDGE
          Sweeping elevated viaduct with landscaped green terrace & pilotis columns
          ========================================================================= */}
      <group position={[-8.5, 4.4, -2.5]}>
        {/* Viaduct Curving Walkway Deck */}
        <mesh position={[0, 0, 0]} rotation={[0, 0.25, 0]} receiveShadow>
          <boxGeometry args={[4.5, 0.45, 14.5]} />
          <primitive object={materials.concretePaver} attach="material" />
        </mesh>

        {/* Landscaped Greenery Terrace Surface on Top */}
        <mesh position={[0, 0.24, 0]} rotation={[0, 0.25, 0]}>
          <boxGeometry args={[3.8, 0.08, 13.8]} />
          <meshStandardMaterial color="#166534" roughness={0.8} />
        </mesh>

        {/* Modern Brushed Steel Edge Balustrade */}
        <mesh position={[-2.1, 0.7, 0]} rotation={[0, 0.25, 0]}>
          <boxGeometry args={[0.08, 0.9, 14.4]} />
          <primitive object={materials.atriumGlass} attach="material" />
        </mesh>
        <mesh position={[-2.1, 1.16, 0]} rotation={[0, 0.25, 0]}>
          <boxGeometry args={[0.12, 0.06, 14.5]} />
          <primitive object={materials.structuralSilver} attach="material" />
        </mesh>

        {/* Underside Structural Pilotis Columns (Stainless Steel) */}
        {[-5.0, 0, 5.0].map((pz, idx) => (
          <mesh key={`viaduct-col-${idx}`} position={[0, -2.2, pz]}>
            <cylinderGeometry args={[0.28, 0.28, 4.2, 16]} />
            <primitive object={materials.structuralSilver} attach="material" />
          </mesh>
        ))}

        {/* Warm Underside Hospitality Lighting under Viaduct Walkway */}
        <pointLight color="#fef3c7" intensity={1.8} distance={10.0} position={[0, -1.8, 0]} />
      </group>

      {/* =========================================================================
          VOLUME 3: RECESSED GROUND-FLOOR DOUBLE-HEIGHT LOBBY & ENTRANCE PORTAL
          Facing North towards Street Z=20 at [40, 30.5]
          ========================================================================= */}
      <group position={[0, 0.24, -9.6]}>
        {/* Clear Glass Atrium Facade */}
        <mesh position={[0, 3.4, 0]}>
          <boxGeometry args={[16.2, 6.8, 0.1]} />
          <primitive object={materials.atriumGlass} attach="material" />
        </mesh>

        {/* Recessed Vestibule Portal Frame */}
        <mesh position={[0, 1.8, 0.4]}>
          <boxGeometry args={[5.2, 3.6, 0.9]} />
          <primitive object={materials.titaniumGraphite} attach="material" />
        </mesh>

        {/* Automatic Sliding Glass Doors */}
        <mesh position={[-1.2, 1.4, 0.02]}>
          <boxGeometry args={[2.0, 2.8, 0.06]} />
          <primitive object={materials.atriumGlass} attach="material" />
        </mesh>
        <mesh position={[1.2, 1.4, 0.02]}>
          <boxGeometry args={[2.0, 2.8, 0.06]} />
          <primitive object={materials.atriumGlass} attach="material" />
        </mesh>

        {/* Glowing Circular Cyber-Energy Pulse / Portal Screen (Image 1 Feature) */}
        <group position={[6.2, 2.4, 0.1]}>
          <mesh castShadow>
            <boxGeometry args={[3.2, 3.2, 0.2]} />
            <primitive object={materials.titaniumGraphite} attach="material" />
          </mesh>
          <mesh position={[0, 0, -0.11]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[3.0, 3.0]} />
            <primitive object={materials.cyberPulseScreenMat} attach="material" />
          </mesh>
          <lineSegments position={[0, 0, -0.12]}>
            <edgesGeometry args={[new THREE.BoxGeometry(3.04, 3.04, 0.02)]} />
            <lineBasicMaterial color="#00f0ff" linewidth={2} />
          </lineSegments>
          <pointLight color="#00f0ff" intensity={2.2} distance={8.0} position={[0, 0, -1.0]} />
        </group>

        {/* Door Trim Frames */}
        <mesh position={[-1.2, 1.4, 0.06]}>
          <boxGeometry args={[2.05, 2.85, 0.03]} />
          <primitive object={materials.polishedSilver} attach="material" />
        </mesh>
        <mesh position={[1.2, 1.4, 0.06]}>
          <boxGeometry args={[2.05, 2.85, 0.03]} />
          <primitive object={materials.polishedSilver} attach="material" />
        </mesh>

        {/* Cantilevered Titanium Entrance Canopy */}
        <mesh position={[0, 3.4, -1.4]} castShadow>
          <boxGeometry args={[6.4, 0.24, 2.8]} />
          <primitive object={materials.titaniumGraphite} attach="material" />
        </mesh>
        <mesh position={[0, 3.29, -1.4]}>
          <boxGeometry args={[6.0, 0.03, 2.4]} />
          <primitive object={materials.cyanNeonGlow} attach="material" />
        </mesh>

        {/* Warm Hospitality Downlights */}
        <pointLight color="#f8fafc" intensity={2.2} distance={9.0} position={[0, 3.2, -1.2]} />
      </group>

      {/* =========================================================================
          VOLUME 4: PROMINENT DIMENSIONAL ENTRANCE SIGNAGE
          Primary: CLOUD ECOSYSTEM HUB
          Secondary: CONNECT • BUILD • DEPLOY
          ========================================================================= */}
      <group position={[0, 4.4, -10.9]}>
        {/* Sign Backing Housing */}
        <mesh castShadow>
          <boxGeometry args={[14.2, 1.35, 0.2]} />
          <primitive object={materials.titaniumGraphite} attach="material" />
        </mesh>
        {/* High-Contrast Sign Face */}
        <mesh position={[0, 0, -0.11]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[14.0, 1.25]} />
          <primitive object={materials.signageMat} attach="material" />
        </mesh>
      </group>

      {/* =========================================================================
          VOLUME 5: REALISTIC ROOF ARCHITECTURE (Concealed behind sweeping parapet)
          Mechanical Penthouse, HVAC chillers, and satellite communications dish
          ========================================================================= */}
      <group position={[0, 22.2, 0]}>
        {/* Recessed Bitumen Roof Deck */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[18.5, 0.2, 18.5]} />
          <primitive object={materials.concretePaver} attach="material" />
        </mesh>

        {/* Central Elevator & HVAC Mechanical Penthouse */}
        <group position={[2.5, 1.6, 2.5]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[5.5, 3.0, 5.5]} />
            <primitive object={materials.titaniumGraphite} attach="material" />
          </mesh>
          <mesh position={[0, 1.55, 0]}>
            <boxGeometry args={[5.7, 0.12, 5.7]} />
            <primitive object={materials.structuralSilver} attach="material" />
          </mesh>
        </group>

        {/* Low-Profile HVAC Chillers */}
        {[-3.5, -0.5].map((hx, idx) => (
          <group key={`hvac-${idx}`} position={[hx, 0.8, -3.5]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2.0, 1.4, 2.8]} />
              <primitive object={materials.roofMechanicalMat} attach="material" />
            </mesh>
            <mesh position={[0, 0.75, -0.6]}>
              <cylinderGeometry args={[0.55, 0.6, 0.12, 16]} />
              <primitive object={materials.structuralSilver} attach="material" />
            </mesh>
            <mesh
              ref={idx === 0 ? hvacFan1Ref : hvacFan2Ref}
              position={[0, 0.82, -0.6]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <circleGeometry args={[0.5, 6]} />
              <primitive object={materials.titaniumGraphite} attach="material" />
            </mesh>
          </group>
        ))}

        {/* Rooftop Satellite Dish Antenna Array */}
        <group ref={radarRef} position={[-4.5, 1.6, 4.0]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.12, 0.2, 1.0, 8]} />
            <primitive object={materials.structuralSilver} attach="material" />
          </mesh>
          <mesh position={[0, 1.2, 0]} rotation={[0.4, 0, 0]}>
            <sphereGeometry args={[0.95, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
            <primitive object={materials.polishedSilver} attach="material" />
          </mesh>
          <mesh position={[0, 1.35, 0.35]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.06, 0.5, 8]} />
            <primitive object={materials.cyanNeonGlow} attach="material" />
          </mesh>
        </group>

        {/* Corner Aviation Beacon Spire */}
        <group position={[7.5, 0, 7.5]}>
          <mesh position={[0, 2.5, 0]}>
            <cylinderGeometry args={[0.05, 0.18, 5.0, 8]} />
            <primitive object={materials.structuralSilver} attach="material" />
          </mesh>
          <mesh position={[0, 5.1, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      </group>

      {/* =========================================================================
          VOLUME 6: EXPLORABLE INTERIOR LOBBY (Mounted inside double-height volume)
          Features the 5-Stage Holographic Architecture Pipeline
          ========================================================================= */}
      {showInterior && <CloudLobbyInterior onSelectZone={onSelectZone} />}

      {/* =========================================================================
          VOLUME 7: STREET-LEVEL DIRECTORY BOARD
          North Sidewalk Directory Board at X = 7.5, Z = -11.6 (Facing North)
          ========================================================================= */}
      <StreetDirectoryBoard
        title="CLOUD ECOSYSTEM HUB"
        subtitle="CONNECT • BUILD • DEPLOY"
        department="DISTRICT 08 // CLOUD & SYSTEMS"
        position={[7.5, 0.24, -11.6]}
        rotation={[0, 0, 0]}
        accentColor="#00f0ff"
      />

      {/* Architectural Facade Spotlights */}
      <pointLight color="#00f0ff" intensity={1.8} distance={18.0} position={[0, 8.0, -12.5]} />
      <pointLight color="#38bdf8" intensity={1.4} distance={16.0} position={[-12.5, 8.0, 0]} />
    </group>
  );
};

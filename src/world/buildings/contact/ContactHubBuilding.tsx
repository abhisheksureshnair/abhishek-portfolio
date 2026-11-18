'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getSharedContactMaterials } from './ContactMaterials';
import { ContactLobbyInterior } from './ContactLobbyInterior';
import { CONTACT_HUB_METADATA } from './contactMetadata';
import { BuildingSignage } from '../signage/BuildingSignage';
import { StreetDirectoryBoard } from '../signage/StreetDirectoryBoard';
import { useWorldStore, worldStore } from '../../stores/worldStore';

interface ContactHubBuildingProps {
  position?: [number, number, number];
  onInteract?: () => void;
}

/**
 * PHASE 2.7.1 — Contact & Collaboration Hub Architectural Refinement
 * 
 * Distinctive 6-storey futuristic communication headquarters at [-40, 40] (block-2-0):
 * - Faithful to reference photo (media_1795005456202_bf2f1ab0.jpg):
 *   1. Completely eliminates the unwanted oversized slanted slab/ramp that obscured the building.
 *   2. Sweeping concave glass curtain wall with vertical aluminum mullions and clean floor slabs.
 *   3. Dramatic vaulted architectural archway / swooping undercroft with glowing illuminated ribs underneath.
 *   4. Double-height transparent lobby entrance with revolving glass doors and titanium canopy.
 *   5. Rich timber/stone forecourt boardwalk deck.
 *   6. Reflecting pool water basin with vertical illuminated fiber-optic light spires.
 *   7. Dimensional physical signage:
 *      "CONTACT & COLLABORATION HUB // LET'S CONNECT • BUILD • INNOVATE"
 *   8. Street-level physical directory board on the sidewalk plaza.
 *   9. Full LOD and memory efficiency maintaining 60+ FPS.
 */
export const ContactHubBuilding: React.FC<ContactHubBuildingProps> = ({
  position = [-40.0, 0, 40.0],
  onInteract,
}) => {
  const materials = getSharedContactMaterials();
  const selectedLandmark = useWorldStore((s) => s.selectedLandmark);
  const hoveredLandmark = useWorldStore((s) => s.hoveredLandmark);
  const cameraPreset = useWorldStore((s) => s.cameraPreset);

  const isSelected = selectedLandmark === 'contact';
  const isHovered = hoveredLandmark === 'contact';
  const isFarView =
    cameraPreset === 'landmarks_skyline' ||
    cameraPreset === 'full_island_aerial' ||
    cameraPreset === 'downtown_skyline' ||
    cameraPreset === 'five_landmarks_aerial' ||
    cameraPreset === 'all_six_landmarks_aerial' ||
    cameraPreset === 'all_seven_landmarks_aerial';
  const showInterior = isSelected || !isFarView;

  const handleBuildingClick = (e: any) => {
    e.stopPropagation();
    worldStore.getState().setSelectedLandmark('contact');
    worldStore.getState().setCameraView('orbit', 'contact_three_quarter');
    if (onInteract) onInteract();
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    worldStore.getState().setHoveredLandmark('contact');
  };

  const handlePointerOut = () => {
    worldStore.getState().setHoveredLandmark(null);
  };

  // Vertical aluminum mullions for the curved glass facade
  const mullionPositions = useMemo(() => {
    const list: { pos: [number, number, number]; rotY: number }[] = [];
    const radius = 10.0;
    const startAngle = -Math.PI * 0.42;
    const endAngle = Math.PI * 0.42;
    const count = 19;
    for (let i = 0; i < count; i++) {
      const angle = startAngle + (i / (count - 1)) * (endAngle - startAngle);
      list.push({
        pos: [Math.sin(angle) * radius, 10.2, -Math.cos(angle) * radius],
        rotY: -angle,
      });
    }
    return list;
  }, []);

  // Parallel illuminated ribs underneath the vaulted archway (as in reference photo)
  const archRibs = useMemo(() => {
    const ribs: { x: number; y: number; z: number; rotZ: number; height: number }[] = [];
    const count = 14;
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1); // 0 to 1
      const x = -1.5 + t * 9.0;
      // Parabolic arch curve: y peaks around x=3
      const archFactor = 1 - Math.pow((t - 0.5) * 2, 2);
      const y = 3.2 + archFactor * 4.8;
      const z = -2.0 - Math.sin(t * Math.PI) * 2.2;
      const rotZ = -(t - 0.5) * 0.45;
      ribs.push({ x, y, z, rotZ, height: 4.5 + archFactor * 3.5 });
    }
    return ribs;
  }, []);

  // Foreground illuminated fiber-optic light spires in reflecting pool
  const lightSpires = useMemo(() => {
    const spires: [number, number, number, number][] = [];
    for (let i = 0; i < 28; i++) {
      const sx = 2.0 + (i % 7) * 0.8 + (Math.sin(i * 3.7) * 0.3);
      const sz = -8.2 - Math.floor(i / 7) * 0.7 + (Math.cos(i * 2.1) * 0.25);
      const h = 0.6 + (Math.sin(i * 1.5) + 1.0) * 0.55;
      spires.push([sx, 0.24 + h / 2, sz, h]);
    }
    return spires;
  }, []);

  return (
    <group
      name="portfolio_contact_hub"
      position={position}
      onClick={handleBuildingClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* 0. Selection / Hover Outline Highlight Box */}
      {(isSelected || isHovered) && (
        <group position={[0, 0.26, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[24.2, 24.2]} />
            <meshBasicMaterial
              color="#00f0ff"
              transparent
              opacity={isSelected ? 0.35 : 0.18}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(24.2, 0.1, 24.2)]} />
            <lineBasicMaterial color="#00f0ff" linewidth={2} />
          </lineSegments>
        </group>
      )}

      {/* 1. Forecourt Granite Podium & Deck (23.6m x 23.6m, Flush at Y=0.24m) */}
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[23.6, 0.24, 23.6]} />
        <primitive object={materials.granitePodium} attach="material" />
      </mesh>

      {/* North sidewalk beveled curb */}
      <mesh position={[0, 0.06, -11.9]} receiveShadow>
        <boxGeometry args={[23.8, 0.12, 0.24]} />
        <primitive object={materials.structuralGraphite} attach="material" />
      </mesh>

      {/* Rich Teak/Timber Boardwalk Deck (Plaza Left Half, matching reference photo) */}
      <mesh position={[-5.8, 0.25, -9.2]} receiveShadow>
        <boxGeometry args={[11.2, 0.04, 5.2]} />
        <primitive object={materials.timberDeckPlaza} attach="material" />
      </mesh>

      {/* Reflecting Pool Basin (Plaza Right Half, matching reference photo) */}
      <group position={[5.2, 0.24, -9.2]}>
        {/* Pool coping */}
        <mesh position={[0, 0.06, 0]} receiveShadow>
          <boxGeometry args={[9.8, 0.14, 5.2]} />
          <primitive object={materials.structuralGraphite} attach="material" />
        </mesh>
        {/* Reflective Water Surface */}
        <mesh position={[0, 0.13, 0]}>
          <boxGeometry args={[9.4, 0.02, 4.8]} />
          <primitive object={materials.reflectingWater} attach="material" />
        </mesh>
      </group>

      {/* Field of Glowing Fiber-Optic Light Spires (In reflecting pool) */}
      {lightSpires.map(([sx, sy, sz, h], idx) => (
        <mesh key={`spire-${idx}`} position={[sx, sy, sz]}>
          <cylinderGeometry args={[0.02, 0.02, h, 6]} />
          <primitive object={materials.illuminatedSpire} attach="material" />
        </mesh>
      ))}

      {/* =========================================================================
          2. MAIN BUILDING STRUCTURE: 6-STOREY CURVED MASSING
          ========================================================================= */}
      {/* Floor Slabs Hierarchy */}
      {[0.26, 4.0, 7.8, 11.6, 15.4, 19.2].map((y, idx) => (
        <mesh key={`slab-${idx}`} position={[0, y, 0]} receiveShadow>
          <cylinderGeometry args={[10.2, 10.2, 0.35, 32]} />
          <primitive object={materials.shellInterior} attach="material" />
        </mesh>
      ))}

      {/* Panoramic Sweeping Curved Glass Curtain Wall (North Entrance Facade) */}
      <mesh position={[0, 10.2, 0]}>
        <cylinderGeometry
          args={[9.8, 10.2, 19.8, 36, 1, true, -Math.PI * 0.42, Math.PI * 0.84]}
        />
        <primitive object={materials.curtainGlass} attach="material" />
      </mesh>

      {/* Inner Glowing Warm Core with Illuminated Office Windows (Warm Golden Glow) */}
      <mesh position={[0, 10.2, 0]}>
        <cylinderGeometry
          args={[9.6, 10.0, 19.6, 36, 1, true, -Math.PI * 0.41, Math.PI * 0.82]}
        />
        <meshStandardMaterial
          color="#fef3c7"
          emissive="#d97706"
          emissiveIntensity={0.55}
          roughness={0.4}
        />
      </mesh>

      {/* Rear Structural Graphite Facade Enclosing Private Offices */}
      <mesh position={[0, 10.2, 0]}>
        <cylinderGeometry
          args={[9.8, 10.2, 19.8, 32, 1, true, Math.PI * 0.42, Math.PI * 1.16]}
        />
        <primitive object={materials.structuralGraphite} attach="material" />
      </mesh>

      {/* Vertical Aluminum Facade Mullions (Giving architectural rhythm & elegance) */}
      {mullionPositions.map((m, idx) => (
        <mesh key={`mullion-${idx}`} position={m.pos} rotation={[0, m.rotY, 0]}>
          <boxGeometry args={[0.08, 19.8, 0.22]} />
          <primitive object={materials.mullionSilver} attach="material" />
        </mesh>
      ))}

      {/* =========================================================================
          3. MONUMENTAL SWEEPING VAULTED ARCHWAY / UNDERCROFT (REFERENCE PHOTO)
          Swooping architectural portal with illuminated ribs underneath
          ========================================================================= */}
      <group position={[3.2, 5.8, -4.5]}>
        {/* Sweeping Parabolic Arch Outer Shell */}
        <mesh position={[0, 1.2, 0]} rotation={[0.15, 0, 0]} castShadow>
          <cylinderGeometry
            args={[7.2, 7.8, 8.4, 28, 1, true, -Math.PI * 0.38, Math.PI * 0.76]}
          />
          <primitive object={materials.shellExterior} attach="material" />
        </mesh>

        {/* Archway Interior Soffit Lining */}
        <mesh position={[0, 1.15, 0]} rotation={[0.15, 0, 0]}>
          <cylinderGeometry
            args={[7.05, 7.65, 8.2, 28, 1, true, -Math.PI * 0.36, Math.PI * 0.72]}
          />
          <primitive object={materials.shellInterior} attach="material" />
        </mesh>

        {/* Parallel Glowing Architectural Ribs / Louvers (Warm-White / Violet illumination) */}
        {archRibs.map((rib, idx) => (
          <group key={`arch-rib-${idx}`} position={[rib.x - 3.2, rib.y - 5.8, rib.z + 4.5]} rotation={[0, 0, rib.rotZ]}>
            <mesh>
              <boxGeometry args={[0.08, rib.height, 0.24]} />
              <primitive object={materials.archRibsWarmGlow} attach="material" />
            </mesh>
          </group>
        ))}
      </group>

      {/* =========================================================================
          4. CONTINUOUS AERODYNAMIC ROOF CANOPY & ILLUMINATED CROWN
          ========================================================================= */}
      <group position={[0, 19.6, 0]}>
        {/* Sweeping Aerodynamic Roof Slab */}
        <mesh position={[0, 0.5, -0.6]} rotation={[0.08, 0, 0]} castShadow>
          <cylinderGeometry
            args={[10.6, 10.8, 0.8, 32, 1, false, -Math.PI * 0.44, Math.PI * 0.88]}
          />
          <primitive object={materials.shellExterior} attach="material" />
        </mesh>

        {/* Illuminated Cyan Crown Rim Fascia */}
        <mesh position={[0, 0.82, -0.6]} rotation={[0.08, 0, 0]}>
          <cylinderGeometry
            args={[10.75, 10.75, 0.15, 32, 1, true, -Math.PI * 0.43, Math.PI * 0.86]}
          />
          <primitive object={materials.cyanAccentGlow} attach="material" />
        </mesh>

        {/* Clean Mechanical Penthouse Enclosure */}
        <mesh position={[0, 1.6, 2.5]}>
          <boxGeometry args={[7.2, 1.8, 5.4]} />
          <primitive object={materials.structuralGraphite} attach="material" />
        </mesh>
      </group>

      {/* =========================================================================
          5. ENTRANCE PORTAL, REVOLVING GLASS DOORS & MONUMENT SIGNAGE
          ========================================================================= */}
      <group position={[-3.5, 0.24, -9.6]}>
        {/* Modern Flat Titanium Entrance Canopy */}
        <mesh position={[0, 3.8, -0.6]} castShadow>
          <boxGeometry args={[7.2, 0.35, 2.6]} />
          <primitive object={materials.structuralGraphite} attach="material" />
        </mesh>

        {/* Cyan Under-Canopy Lighting Strip */}
        <mesh position={[0, 3.6, -0.6]}>
          <boxGeometry args={[6.8, 0.04, 2.2]} />
          <primitive object={materials.cyanAccentGlow} attach="material" />
        </mesh>

        {/* Central High-Tech Revolving Glass Door */}
        <group position={[0, 1.6, 0]}>
          <mesh>
            <cylinderGeometry args={[1.5, 1.5, 2.8, 16, 1, true]} />
            <primitive object={materials.curtainGlass} attach="material" />
          </mesh>
          <mesh>
            <boxGeometry args={[2.8, 2.7, 0.06]} />
            <primitive object={materials.curtainGlass} attach="material" />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[2.8, 2.7, 0.06]} />
            <primitive object={materials.curtainGlass} attach="material" />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.06, 0.06, 2.8, 12]} />
            <primitive object={materials.structuralColumns} attach="material" />
          </mesh>
        </group>

        {/* Flanking Automatic Sliding Secondary Doors */}
        <mesh position={[-2.4, 1.6, 0]}>
          <boxGeometry args={[1.5, 2.8, 0.08]} />
          <primitive object={materials.curtainGlass} attach="material" />
        </mesh>
        <mesh position={[2.4, 1.6, 0]}>
          <boxGeometry args={[1.5, 2.8, 0.08]} />
          <primitive object={materials.curtainGlass} attach="material" />
        </mesh>
      </group>

      {/* Main Dimensional Architectural Signage (Mounted directly on Entrance Portal Fascia) */}
      <group position={[-3.5, 4.4, -10.8]} rotation={[0, Math.PI, 0]}>
        <BuildingSignage
          title="CONTACT & COLLABORATION HUB"
          subtitle="LET'S CONNECT • BUILD • INNOVATE"
          width={9.2}
          height={1.3}
          panelColor="#090d16"
          titleColor="#ffffff"
          subtitleColor="#00f0ff"
          emissiveColor="#00f0ff"
          emissiveIntensity={2.2}
        />
      </group>

      {/* Street-Level Physical Directory Board (On Sidewalk Plaza) */}
      <StreetDirectoryBoard
        title={CONTACT_HUB_METADATA.name}
        subtitle={CONTACT_HUB_METADATA.subtitle}
        department="DISTRICT 06 // COMMUNICATIONS HUB"
        position={[7.5, 0.24, -10.6]}
        rotation={[0, -0.25, 0]}
        accentColor="#00f0ff"
      />

      {/* =========================================================================
          6. INTERIOR DOUBLE-HEIGHT LOBBY (with Suspended Holographic Globe)
          ========================================================================= */}
      {showInterior && <ContactLobbyInterior />}
    </group>
  );
};

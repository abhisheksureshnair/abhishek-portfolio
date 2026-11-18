'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getSharedAIMaterials } from './AIMaterials';
import { AIAtriumInterior } from './AIAtriumInterior';
import { AI_RESEARCH_METADATA } from './aiMetadata';
import { BuildingSignage } from '../signage/BuildingSignage';
import { StreetDirectoryBoard } from '../signage/StreetDirectoryBoard';
import { useWorldStore, worldStore } from '../../stores/worldStore';

interface AIResearchBuildingProps {
  position?: [number, number, number];
  onInteract?: () => void;
}

/**
 * PHASE 2.7.1 — AI Research & Innovation Center Architectural Refinement
 * 
 * Distinctive 6-storey futuristic research institute at [0, 40] (block-2-1):
 * - Faithful to reference photo (media_1795005442354_a8d54234.jpg):
 *   1. Three Articulated Architectural Volumes:
 *      - Central double-height transparent grand entrance atrium with cantilevered upper volume and holographic HUD screen
 *      - East vertical monolith tower with AI emblem and illuminated architectural typography
 *      - West stepped research wing with cantilevered glass terrace and rounded contour lines
 *   2. Dark titanium structural frames with continuous cyan/blue glowing neon contour ribbons
 *   3. Blue-gray architectural curtain wall glass (MeshPhysicalMaterial)
 *   4. Plaza Forecourt:
 *      - Circular reflecting pool basin with central pedestal holding a glowing holographic AI neural sphere with orbital rings
 *      - Monumental wide entrance steps connecting flush to the sidewalk plaza
 *   5. Clean, integrated roofline with low-profile mechanical penthouse and continuous illuminated crown ribbon (no disconnected fin spires)
 *   6. Prominent dimensional physical signage:
 *      "AI RESEARCH CENTER // INTELLIGENCE • AUTOMATION • INNOVATION"
 *   7. Full LOD and memory efficiency maintaining 60+ FPS
 */
export const AIResearchBuilding: React.FC<AIResearchBuildingProps> = ({
  position = [0.0, 0, 40.0],
  onInteract,
}) => {
  const materials = getSharedAIMaterials();
  const selectedLandmark = useWorldStore((s) => s.selectedLandmark);
  const hoveredLandmark = useWorldStore((s) => s.hoveredLandmark);
  const cameraPreset = useWorldStore((s) => s.cameraPreset);

  const isSelected = selectedLandmark === 'ai';
  const isHovered = hoveredLandmark === 'ai';
  const isFarView =
    cameraPreset === 'landmarks_skyline' ||
    cameraPreset === 'full_island_aerial' ||
    cameraPreset === 'downtown_skyline' ||
    cameraPreset === 'all_seven_landmarks_aerial';
  const showInterior = isSelected || !isFarView;

  // Refs for gentle holographic sphere and orbital ring rotation
  const holoSphereRef = useRef<THREE.Mesh>(null);
  const orbitalRing1Ref = useRef<THREE.Group>(null);
  const orbitalRing2Ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (holoSphereRef.current) {
      holoSphereRef.current.rotation.y += delta * 0.4;
    }
    if (orbitalRing1Ref.current) {
      orbitalRing1Ref.current.rotation.x += delta * 0.5;
      orbitalRing1Ref.current.rotation.y += delta * 0.3;
    }
    if (orbitalRing2Ref.current) {
      orbitalRing2Ref.current.rotation.z += delta * 0.4;
      orbitalRing2Ref.current.rotation.y -= delta * 0.35;
    }
  });

  const handleBuildingClick = (e: any) => {
    e.stopPropagation();
    worldStore.getState().setSelectedLandmark('ai');
    worldStore.getState().setCameraView('orbit', 'ai_three_quarter');
    if (onInteract) onInteract();
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    worldStore.getState().setHoveredLandmark('ai');
  };

  const handlePointerOut = () => {
    worldStore.getState().setHoveredLandmark(null);
  };

  return (
    <group
      name="portfolio_ai_research_center"
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

      {/* 1. Forecourt Plaza Granite Deck (23.6m x 23.6m, Flush at Y=0.24m) */}
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[23.6, 0.24, 23.6]} />
        <primitive object={materials.granitePodium} attach="material" />
      </mesh>

      {/* North entrance beveled curb step */}
      <mesh position={[0, 0.06, -11.9]} receiveShadow>
        <boxGeometry args={[23.8, 0.12, 0.24]} />
        <primitive object={materials.titaniumDark} attach="material" />
      </mesh>

      {/* =========================================================================
          VOLUME 1: EAST RESEARCH MONOLITH (X = 6.8m, Y = 9.2m, Z = 0.5m)
          Vertical 4-Storey Architectural Tower with Vertical AI Emblem & Typography
          ========================================================================= */}
      <group position={[6.8, 9.2, 0.5]}>
        {/* Core Monolith Body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[6.8, 18.0, 14.0]} />
          <primitive object={materials.titaniumDark} attach="material" />
        </mesh>

        {/* East Facade Glazing Inset */}
        <mesh position={[3.42, 0, 0]}>
          <boxGeometry args={[0.1, 15.6, 11.6]} />
          <primitive object={materials.curtainGlassBlueGray} attach="material" />
        </mesh>

        {/* Horizontal Titanium Floor Band Reveals */}
        {[-4.5, 0.0, 4.5].map((yOffset, idx) => (
          <mesh key={`east-band-${idx}`} position={[0, yOffset, 0]}>
            <boxGeometry args={[6.9, 0.35, 14.1]} />
            <primitive object={materials.titaniumMid} attach="material" />
          </mesh>
        ))}

        {/* North Face Signage Monolith Panel (Facing Entrance Plaza) */}
        <mesh position={[0, -0.5, -7.02]} rotation={[0, Math.PI, 0]} receiveShadow>
          <planeGeometry args={[5.8, 14.8]} />
          <primitive object={materials.monolithSignTexture} attach="material" />
        </mesh>

        {/* Vertical Glowing Neon Contour Ribbons (Cyan / Blue) framing East Monolith */}
        {/* Left vertical edge */}
        <mesh position={[-3.38, 0, -7.02]}>
          <boxGeometry args={[0.12, 17.8, 0.12]} />
          <primitive object={materials.neonRibbonCyan} attach="material" />
        </mesh>
        {/* Right vertical edge */}
        <mesh position={[3.38, 0, -7.02]}>
          <boxGeometry args={[0.12, 17.8, 0.12]} />
          <primitive object={materials.neonRibbonCyan} attach="material" />
        </mesh>
        {/* Top horizontal roof edge */}
        <mesh position={[0, 8.98, -7.02]}>
          <boxGeometry args={[6.85, 0.14, 0.12]} />
          <primitive object={materials.neonRibbonBlue} attach="material" />
        </mesh>
        {/* Bottom edge glow */}
        <mesh position={[0, -8.95, -7.02]}>
          <boxGeometry args={[6.85, 0.1, 0.12]} />
          <primitive object={materials.neonRibbonCyan} attach="material" />
        </mesh>

        {/* East Monolith Roof Parapet & Low-Profile Penthouse */}
        <mesh position={[0, 9.4, 0]}>
          <boxGeometry args={[5.8, 0.8, 12.0]} />
          <primitive object={materials.titaniumMid} attach="material" />
        </mesh>
      </group>

      {/* =========================================================================
          VOLUME 2: CENTRAL ENTRANCE ATRIUM & HOLOGRAPHIC HUD SCREEN
          Double-Height Soaring Glass Atrium with Cantilevered Upper HUD Display
          ========================================================================= */}
      <group position={[0, 0, 0]}>
        {/* Double-Height Ground Floor Atrium Glazed Volume (Y = 0.24 -> 8.2m) */}
        <mesh position={[0, 4.2, -1.0]}>
          <boxGeometry args={[6.6, 7.8, 12.0]} />
          <primitive object={materials.curtainGlassBlueGray} attach="material" />
        </mesh>

        {/* Upper Cantilevered Volume (Y = 8.2 -> 15.6m, Z = -1.5m) */}
        <group position={[0, 11.8, -1.5]}>
          {/* Main Upper Box */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[6.8, 7.2, 11.0]} />
            <primitive object={materials.titaniumDark} attach="material" />
          </mesh>

          {/* Large Front Holographic AI HUD Screen (Facing North towards Plaza) */}
          {/* Faithful reproduction of glowing HUD display in media_1795005442354_a8d54234.jpg */}
          <mesh position={[0, 0, -5.52]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[6.2, 5.6]} />
            <primitive object={materials.holographicHudScreen} attach="material" />
          </mesh>

          {/* Surrounding Neon Contour Ribbon around the HUD screen */}
          {/* Top border */}
          <mesh position={[0, 2.9, -5.53]}>
            <boxGeometry args={[6.4, 0.12, 0.08]} />
            <primitive object={materials.neonRibbonCyan} attach="material" />
          </mesh>
          {/* Bottom border */}
          <mesh position={[0, -2.9, -5.53]}>
            <boxGeometry args={[6.4, 0.12, 0.08]} />
            <primitive object={materials.neonRibbonCyan} attach="material" />
          </mesh>
          {/* Left border */}
          <mesh position={[-3.15, 0, -5.53]}>
            <boxGeometry args={[0.12, 5.8, 0.08]} />
            <primitive object={materials.neonRibbonBlue} attach="material" />
          </mesh>
          {/* Right border */}
          <mesh position={[3.15, 0, -5.53]}>
            <boxGeometry args={[0.12, 5.8, 0.08]} />
            <primitive object={materials.neonRibbonBlue} attach="material" />
          </mesh>

          {/* Roof Terrace / Clean Penthouse */}
          <mesh position={[0, 3.8, 0]}>
            <boxGeometry args={[6.4, 0.4, 10.4]} />
            <primitive object={materials.titaniumMid} attach="material" />
          </mesh>
          {/* Illuminated Roof Crown Ribbon */}
          <mesh position={[0, 4.02, 0]}>
            <boxGeometry args={[6.5, 0.08, 10.5]} />
            <primitive object={materials.neonRibbonCyan} attach="material" />
          </mesh>
        </group>

        {/* Grand Entrance Canopy & Portal (Y = 4.0m, Cantilevering to Z = -8.2m) */}
        <group position={[0, 4.0, -7.2]}>
          {/* Titanium Portal Canopy */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[7.2, 0.4, 2.6]} />
            <primitive object={materials.titaniumDark} attach="material" />
          </mesh>
          {/* Glowing Under-Canopy Lighting Strip */}
          <mesh position={[0, -0.21, 0]}>
            <boxGeometry args={[6.8, 0.04, 2.2]} />
            <primitive object={materials.neonRibbonCyan} attach="material" />
          </mesh>
          {/* Front Fascia Edge Glow */}
          <mesh position={[0, 0, -1.31]}>
            <boxGeometry args={[7.24, 0.12, 0.06]} />
            <primitive object={materials.neonRibbonBlue} attach="material" />
          </mesh>
        </group>

        {/* Double Entrance Glass Doors & Titanium Frame (Z = -7.0m) */}
        <group position={[0, 0.24, -7.0]}>
          {/* Left Door */}
          <mesh position={[-1.2, 1.8, 0]}>
            <boxGeometry args={[1.8, 3.5, 0.08]} />
            <primitive object={materials.curtainGlassBlueGray} attach="material" />
          </mesh>
          {/* Right Door */}
          <mesh position={[1.2, 1.8, 0]}>
            <boxGeometry args={[1.8, 3.5, 0.08]} />
            <primitive object={materials.curtainGlassBlueGray} attach="material" />
          </mesh>
          {/* Door Handles (Polished Silver) */}
          <mesh position={[-0.4, 1.8, -0.06]}>
            <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
            <primitive object={materials.polishedSilver} attach="material" />
          </mesh>
          <mesh position={[0.4, 1.8, -0.06]}>
            <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
            <primitive object={materials.polishedSilver} attach="material" />
          </mesh>
        </group>

        {/* Monumental Wide Entrance Steps (Connecting Flush to Sidewalk Plaza) */}
        <group position={[0, 0.24, -8.2]}>
          {[0, 1, 2, 3].map((stepIdx) => {
            const stepY = (3 - stepIdx) * 0.08;
            const stepZ = -stepIdx * 0.6;
            const stepWidth = 7.4 + stepIdx * 0.4;
            return (
              <mesh key={`step-${stepIdx}`} position={[0, stepY / 2, stepZ]} receiveShadow>
                <boxGeometry args={[stepWidth, stepY + 0.04, 0.65]} />
                <primitive object={materials.titaniumDark} attach="material" />
              </mesh>
            );
          })}
        </group>
      </group>

      {/* =========================================================================
          VOLUME 3: WEST STEPPED RESEARCH WING (X = -6.8m, Y = 6.2m, Z = 0.5m)
          Cantilevered Stepped Massing with Observation Terrace & Rounded Neon Ribbons
          ========================================================================= */}
      <group position={[-6.8, 6.2, 0.5]}>
        {/* Lower Lab Volume (Ground to Level 2, Y = 0.24 -> 7.8m) */}
        <mesh position={[0, -2.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.8, 7.4, 13.0]} />
          <primitive object={materials.titaniumDark} attach="material" />
        </mesh>

        {/* Blue-Gray Ribbon Windows on Lower Lab */}
        <mesh position={[0, -2.4, -6.52]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[6.2, 5.2]} />
          <primitive object={materials.curtainGlassBlueGray} attach="material" />
        </mesh>

        {/* Cantilevered Overhang Floor Slab (Level 2 Setback) */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[7.2, 0.45, 13.4]} />
          <primitive object={materials.titaniumMid} attach="material" />
        </mesh>

        {/* Upper Setback Lab Suite (Floors 3–4, Y = 7.8 -> 13.5m) */}
        <mesh position={[0.5, 4.2, 0.8]} castShadow receiveShadow>
          <boxGeometry args={[5.8, 5.2, 10.4]} />
          <primitive object={materials.titaniumDark} attach="material" />
        </mesh>

        {/* Upper Level Glazing Ribbon */}
        <mesh position={[0.5, 4.2, -4.42]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[5.2, 4.2]} />
          <primitive object={materials.curtainGlassBlueGray} attach="material" />
        </mesh>

        {/* Outdoor Landscaped Observation Terrace Deck (Level 2 Roof Deck) */}
        <mesh position={[-1.6, 1.65, -4.2]}>
          <boxGeometry args={[3.2, 0.06, 3.8]} />
          <primitive object={materials.granitePodium} attach="material" />
        </mesh>

        {/* Terrace Glass Balustrade */}
        <mesh position={[-1.6, 2.2, -6.15]}>
          <boxGeometry args={[3.2, 0.9, 0.06]} />
          <primitive object={materials.curtainGlassBlueGray} attach="material" />
        </mesh>

        {/* Continuous Rounded Neon Edge Ribbons (Cyan / Violet) */}
        {/* Cantilever Lower Rim Contour Ribbon */}
        <mesh position={[0, 1.4, -6.72]}>
          <boxGeometry args={[7.24, 0.12, 0.08]} />
          <primitive object={materials.neonRibbonCyan} attach="material" />
        </mesh>
        {/* West Side Longitudinal Contour Ribbon */}
        <mesh position={[-3.62, 1.4, 0]}>
          <boxGeometry args={[0.08, 0.12, 13.42]} />
          <primitive object={materials.neonRibbonCyan} attach="material" />
        </mesh>
        {/* Upper Setback Roof Contour Ribbon */}
        <mesh position={[0.5, 6.82, -4.42]}>
          <boxGeometry args={[5.85, 0.1, 0.08]} />
          <primitive object={materials.neonRibbonViolet} attach="material" />
        </mesh>
      </group>

      {/* =========================================================================
          FORECOURT PLAZA FEATURES (Matching media_1795005442354_a8d54234.jpg)
          Circular Reflecting Pool & Glowing Holographic AI Sphere
          ========================================================================= */}
      <group position={[-6.8, 0.24, -9.0]}>
        {/* Circular Pool Granite Coping / Curb (R = 2.4m, Height = 0.25m) */}
        <mesh position={[0, 0.12, 0]} receiveShadow>
          <cylinderGeometry args={[2.5, 2.5, 0.24, 32]} />
          <primitive object={materials.titaniumDark} attach="material" />
        </mesh>

        {/* Deep Reflective Pool Water Surface */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[2.3, 2.3, 0.04, 32]} />
          <primitive object={materials.reflectingPoolWater} attach="material" />
        </mesh>

        {/* Illuminated Pool Perimeter Neon Ring */}
        <mesh position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.32, 2.44, 32]} />
          <primitive object={materials.neonRibbonCyan} attach="material" />
        </mesh>

        {/* Central Cylindrical Pedestal for Hologram */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.5, 0.6, 0.6, 24]} />
          <primitive object={materials.titaniumMid} attach="material" />
        </mesh>
        <mesh position={[0, 0.81, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.04, 24]} />
          <primitive object={materials.neonRibbonCyan} attach="material" />
        </mesh>

        {/* Signature Glowing Holographic AI Neural Sphere with Concentric Orbital Rings */}
        <group position={[0, 1.8, 0]}>
          {/* Wireframe Hologram Sphere */}
          <mesh ref={holoSphereRef}>
            <sphereGeometry args={[0.75, 16, 16]} />
            <primitive object={materials.holographicAiSphere} attach="material" />
          </mesh>

          {/* Inner Glowing Core Sphere */}
          <mesh>
            <sphereGeometry args={[0.35, 16, 16]} />
            <primitive object={materials.neonRibbonCyan} attach="material" />
          </mesh>

          {/* Concentric Orbital Rings */}
          <group ref={orbitalRing1Ref} rotation={[0.4, 0.2, 0]}>
            <mesh>
              <torusGeometry args={[1.1, 0.02, 8, 36]} />
              <primitive object={materials.hologramOrbitalRing} attach="material" />
            </mesh>
          </group>

          <group ref={orbitalRing2Ref} rotation={[-0.5, 0.6, 0.3]}>
            <mesh>
              <torusGeometry args={[1.35, 0.018, 8, 36]} />
              <primitive object={materials.neonRibbonCyan} attach="material" />
            </mesh>
          </group>
        </group>
      </group>

      {/* Forecourt Planter Beds & Low Perimeter Ground Lighting */}
      <group position={[6.5, 0.24, -9.6]}>
        <mesh position={[0, 0.2, 0]} receiveShadow>
          <boxGeometry args={[3.2, 0.4, 2.4]} />
          <primitive object={materials.titaniumDark} attach="material" />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[2.9, 0.06, 2.1]} />
          <meshStandardMaterial color="#0f766e" roughness={0.7} />
        </mesh>
        {/* Planter Edge Glow */}
        <mesh position={[0, 0.41, -1.21]}>
          <boxGeometry args={[3.24, 0.06, 0.04]} />
          <primitive object={materials.neonRibbonCyan} attach="material" />
        </mesh>
      </group>

      {/* =========================================================================
          SIGNAGE & DIRECTORY MONUMENT
          ========================================================================= */}
      {/* 1. Main Architectural Facade Signage (Above Entrance Portal) */}
      <group position={[0, 4.4, -8.6]} rotation={[0, Math.PI, 0]}>
        <BuildingSignage
          title="AI RESEARCH CENTER"
          subtitle="INTELLIGENCE • AUTOMATION • INNOVATION"
          width={8.6}
          height={1.2}
          panelColor="#050811"
          titleColor="#ffffff"
          subtitleColor="#00f0ff"
          emissiveColor="#00f0ff"
          emissiveIntensity={2.4}
        />
      </group>

      {/* 2. Sidewalk Ground Monument Directory Board (Foreground Entrance) */}
      <StreetDirectoryBoard
        title={AI_RESEARCH_METADATA.name}
        subtitle="INTELLIGENCE • AUTOMATION • INNOVATION"
        department="DISTRICT 07 // ARTIFICIAL INTELLIGENCE LABS"
        position={[4.0, 0.24, -10.8]}
        rotation={[0, -0.15, 0]}
        accentColor="#00f0ff"
      />

      {/* =========================================================================
          INTERIOR RESEARCH ATRIUM (LOD Controlled)
          ========================================================================= */}
      {showInterior && <AIAtriumInterior />}
    </group>
  );
};

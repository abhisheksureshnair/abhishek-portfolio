'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { HeroBuilding } from './HeroBuilding';
import { AboutBuilding } from './AboutBuilding';
import { ProjectsBuilding } from './ProjectsBuilding';
import { SkillsBuilding } from './SkillsBuilding';
import { ExperienceBuilding } from './ExperienceBuilding';
import { ContactBuilding } from './ContactBuilding';
import { CityAvatarController } from './CityAvatarController';
import { SelectedBuildingType } from './CityCameraController';
import { TimeOfDay } from './AtmosphericWeatherSystem';
import { usePerformanceQuality } from '../PerformanceControl';

// Upgraded Realistic City Modules
import { RealisticStreets } from './RealisticStreets';
import { RealisticNature } from './RealisticNature';
import { RealisticAvatar, AmbientPedestrians } from './RealisticAvatar';
import { RealisticTraffic } from './RealisticTraffic';
import { RealisticTrafficSignals } from './RealisticTrafficSignals';
import { CityPlazaFountain } from './CityPlazaFountain';
import { getRealisticLawnTexture, getRealisticGlassFacadeTexture } from './realisticCityTextures';

interface RealisticCityProps {
  visible?: boolean;
  timeOfDay?: TimeOfDay;
  selectedBuilding: SelectedBuildingType;
  onSelectBuilding: (bId: SelectedBuildingType) => void;
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  rotationRef: React.MutableRefObject<number>;
  quaternionRef: React.MutableRefObject<THREE.Quaternion>;
  currentSpeedRef: React.MutableRefObject<number>;
  isMovingRef: React.MutableRefObject<boolean>;
  keysPressedRef: React.MutableRefObject<Record<string, boolean>>;
  targetWalkPosRef: React.MutableRefObject<THREE.Vector3 | null>;
  onGroundClick?: (point: THREE.Vector3) => void;
}

/**
 * Waterfront Canal & Promenade
 */
function CityWaterCanal() {
  const waterMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#0891b2',
      transmission: 0.6,
      opacity: 0.95,
      transparent: true,
      roughness: 0.08,
      metalness: 0.85,
      ior: 1.33,
    });
  }, []);

  return (
    <group position={[-28, 0.45, 0]}>
      {/* Reflective Water Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={waterMaterial}>
        <planeGeometry args={[14, 60]} />
      </mesh>
      {/* Promenade Stone Border */}
      <mesh position={[7.1, 0.25, 0]}>
        <boxGeometry args={[0.4, 0.5, 60]} />
        <meshStandardMaterial color="#64748b" roughness={0.6} />
      </mesh>
    </group>
  );
}

/**
 * Expanded High-Rise Modern Glass & Steel Skyscraper Skyline
 * Features realistic PBR facade materials with illuminated office window matrices
 */
function CityExpandedSkyline({ timeOfDay }: { timeOfDay: TimeOfDay }) {
  const isNight = timeOfDay === 'night';
  const glassFacadeTex = useMemo(() => getRealisticGlassFacadeTexture(), []);

  const towers = useMemo(() => {
    return [
      // North skyline (Financial Hub)
      { x: -16, z: -32, w: 9, d: 8, h: 38, baseColor: '#0f172a' },
      { x: 16, z: -32, w: 10, d: 9, h: 44, baseColor: '#1e293b' },
      { x: 28, z: -26, w: 8, d: 8, h: 34, baseColor: '#0f172a' },
      // East skyline (Tech Park)
      { x: 32, z: -12, w: 8, d: 9, h: 40, baseColor: '#1e293b' },
      { x: 32, z: 8, w: 9, d: 8, h: 36, baseColor: '#0f172a' },
      { x: 28, z: 26, w: 9, d: 9, h: 42, baseColor: '#1e293b' },
      // South skyline (Commercial Core)
      { x: 16, z: 32, w: 8, d: 8, h: 32, baseColor: '#0f172a' },
      { x: -16, z: 32, w: 9, d: 9, h: 36, baseColor: '#1e293b' },
      // West skyline behind waterfront
      { x: -38, z: -14, w: 8, d: 8, h: 30, baseColor: '#0f172a' },
      { x: -38, z: 14, w: 8, d: 8, h: 32, baseColor: '#1e293b' },
    ];
  }, []);

  return (
    <group>
      {towers.map((tower, idx) => (
        <group key={idx} position={[tower.x, 0.74 + tower.h / 2, tower.z]}>
          {/* Main Tower Mass (Steel/Concrete core) */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[tower.w, tower.h, tower.d]} />
            <meshStandardMaterial
              color={tower.baseColor}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>

          {/* Curtain-Wall Reflective Glass Facade Panels */}
          <mesh position={[0, 0, tower.d / 2 + 0.05]}>
            <planeGeometry args={[tower.w * 0.9, tower.h * 0.94]} />
            <meshStandardMaterial
              map={glassFacadeTex}
              roughness={0.12}
              metalness={0.88}
              emissive="#fde047"
              emissiveIntensity={isNight ? 0.45 : 0.04}
            />
          </mesh>

          {/* Mechanical Penthouse & Cooling Towers */}
          <mesh position={[0, tower.h / 2 + 1.2, 0]} castShadow>
            <boxGeometry args={[tower.w * 0.45, 2.4, tower.d * 0.45]} />
            <meshStandardMaterial color="#475569" roughness={0.75} />
          </mesh>

          {/* Rooftop Antenna Mast with Flashing Aviation Beacon */}
          <mesh position={[0, tower.h / 2 + 3.4, 0]}>
            <cylinderGeometry args={[0.04, 0.08, 2.4, 6]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
          <mesh position={[0, tower.h / 2 + 4.6, 0]}>
            <sphereGeometry args={[0.22, 8, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export const RealisticCity: React.FC<RealisticCityProps> = ({
  visible = true,
  timeOfDay = 'day',
  selectedBuilding,
  onSelectBuilding,
  playerPosRef,
  rotationRef,
  quaternionRef,
  currentSpeedRef,
  isMovingRef,
  keysPressedRef,
  targetWalkPosRef,
  onGroundClick,
}) => {
  const { effectiveTier } = usePerformanceQuality();
  const lawnTexture = useMemo(() => getRealisticLawnTexture(), []);

  if (!visible) return null;

  return (
    <group>
      {/* ======================================================== */}
      {/* 1. REALISTIC GROUND LAWN & FOUNDATION SLAB               */}
      {/* ======================================================== */}
      <mesh
        position={[0, 0.58, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onGroundClick?.(e.point);
        }}
      >
        <planeGeometry args={[72, 72]} />
        <meshStandardMaterial
          map={lawnTexture}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Concrete Sub-grade Foundation Base */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[74, 1.2, 74]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>

      {/* ======================================================== */}
      {/* 2. REALISTIC ASPHALT STREETS, SIDEWALKS & LIGHTING       */}
      {/* ======================================================== */}
      <RealisticStreets timeOfDay={timeOfDay} onRoadClick={onGroundClick} />

      {/* ======================================================== */}
      {/* 3. EXPANDED MODERN SKYSCRAPER SKYLINE                    */}
      {/* ======================================================== */}
      <CityExpandedSkyline timeOfDay={timeOfDay} />

      {/* ======================================================== */}
      {/* 4. WATERFRONT CANAL PROMENADE                            */}
      {/* ======================================================== */}
      <CityWaterCanal />

      {/* ======================================================== */}
      {/* 5. REALISTIC 3D NATURE & LANDSCAPING (Trees & Hedges)    */}
      {/* ======================================================== */}
      <RealisticNature />

      {/* ======================================================== */}
      {/* 6. CIVIC PLAZA ANIMATED FOUNTAIN                         */}
      {/* ======================================================== */}
      <CityPlazaFountain position={[3.85, 0.74, -3.85]} />

      {/* ======================================================== */}
      {/* 7. COINCIDENT 4-CORNER INTERSECTION TRAFFIC SIGNALS      */}
      {/* ======================================================== */}
      <RealisticTrafficSignals timeOfDay={timeOfDay} />

      {/* ======================================================== */}
      {/* 8. REALISTIC TRAFFIC & MOVING VEHICLES                   */}
      {/* ======================================================== */}
      <RealisticTraffic timeOfDay={timeOfDay} playerPosRef={playerPosRef} />

      {/* ======================================================== */}
      {/* 9. AMBIENT SIDEWALK PEDESTRIANS & CROSSWALK AI          */}
      {/* ======================================================== */}
      <AmbientPedestrians playerPosRef={playerPosRef} />

      {/* ======================================================== */}
      {/* 9. AVATAR MOVEMENT CONTROLLER                            */}
      {/* ======================================================== */}
      <CityAvatarController
        playerPosRef={playerPosRef}
        rotationRef={rotationRef}
        quaternionRef={quaternionRef}
        currentSpeedRef={currentSpeedRef}
        isMovingRef={isMovingRef}
        keysPressedRef={keysPressedRef}
        targetWalkPosRef={targetWalkPosRef}
        onSelectBuilding={onSelectBuilding}
        isModalOpen={selectedBuilding !== null}
      />

      {/* ======================================================== */}
      {/* 10. REALISTIC 1.82M HUMAN DEVELOPER AVATAR               */}
      {/* ======================================================== */}
      <RealisticAvatar
        positionRef={playerPosRef}
        rotationRef={rotationRef}
        quaternionRef={quaternionRef}
        currentSpeedRef={currentSpeedRef}
        isMovingRef={isMovingRef}
      />

      {/* ======================================================== */}
      {/* 11. FLAGSHIP INTERACTIVE PORTFOLIO HEADQUARTERS          */}
      {/* ======================================================== */}
      {/* Hero Headquarters: Flagship 3-Floor Architectural Center */}
      <HeroBuilding
        position={[-7.85, 0.74, -7.35]}
        onSelect={() => onSelectBuilding('hero')}
        isSelected={selectedBuilding === 'hero'}
      />

      {/* About Me Studio: Terrace Creative Studio */}
      <AboutBuilding
        position={[7.85, 0.74, -7.35]}
        onSelect={() => onSelectBuilding('about')}
        isSelected={selectedBuilding === 'about'}
      />

      {/* Projects Innovation Center: Glass Exhibition Gallery */}
      <ProjectsBuilding
        position={[-7.85, 0.74, 7.35]}
        onSelect={() => onSelectBuilding('projects')}
        isSelected={selectedBuilding === 'projects'}
      />

      {/* Central Skills Tech Tower: Premium Glass & Steel Skyscraper */}
      <SkillsBuilding
        position={[7.85, 0.74, 7.35]}
        onSelect={() => onSelectBuilding('skills')}
        isSelected={selectedBuilding === 'skills'}
      />

      {/* Experience Office: Corporate Complex */}
      <ExperienceBuilding
        position={[0, 0.74, 21.5]}
        onSelect={() => onSelectBuilding('experience')}
        isSelected={selectedBuilding === 'experience'}
      />

      {/* Contact Hub: Communications Center */}
      <ContactBuilding
        position={[0, 0.74, -21.5]}
        onSelect={() => onSelectBuilding('contact')}
        isSelected={selectedBuilding === 'contact'}
      />
    </group>
  );
};

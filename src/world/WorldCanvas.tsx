import React, { Suspense, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useWorldStore, worldStore } from './stores/worldStore';
import { WORLD_CONFIG } from './WorldConfig';
import { WorldSky } from './lighting/WorldSky';
import { WorldLighting } from './lighting/WorldLighting';
import { WorldPhysics } from './physics/WorldPhysics';
import { Terrain } from './terrain/Terrain';
import { Sidewalk } from './sidewalks/Sidewalk';
import { UnifiedCityRoads } from './roads/UnifiedCityRoads';
import { ModularBuildingRenderer } from './buildings/ModularBuildingRenderer';
import { UrbanExtensionZoneB } from './scenery/UrbanExtensionZoneB';
import { HQBuilding } from './buildings/hq/HQBuilding';
import { CivicPlaza } from './buildings/CivicPlaza';
import { InnovationCenterBuilding } from './buildings/innovation/InnovationCenterBuilding';
import { SkillsTowerBuilding } from './buildings/skills/SkillsTowerBuilding';
import { CareerCenterBuilding } from './buildings/career/CareerCenterBuilding';
import { AboutStudioBuilding } from './buildings/about/AboutStudioBuilding';
import { ContactHubBuilding } from './buildings/contact/ContactHubBuilding';
import { AIResearchBuilding } from './buildings/ai/AIResearchBuilding';
import { OceanWater } from './water/OceanWater';
import { WaterfrontPerimeter } from './island/WaterfrontPerimeter';
import { OrbitCamera } from './camera/OrbitCamera';
import { StoryCamera } from './camera/StoryCamera';
import { PlayableAvatar } from './avatar/PlayableAvatar';
import { ThirdPersonCamera } from './avatar/ThirdPersonCamera';
import { BuildingEntranceIndicators } from './avatar/BuildingEntranceIndicators';
import { PlayableBoundaryDebug } from './avatar/PlayableBoundaryDebug';
import { NavigationDebugOverlay } from './navigation/NavigationDebugOverlay';
import { PerformanceMetricsCollector } from './performance/PerformanceMonitor';

interface WorldCanvasProps {
  onGroundClick?: (point: THREE.Vector3) => void;
  referenceBlockOnly?: boolean;
  onHQInteract?: () => void;
  onInnovationInteract?: (metadata: any) => void;
  onSelectProject?: (projectId: string) => void;
  onSkillsInteract?: () => void;
  onSelectSkillFloor?: (floor: number) => void;
  selectedSkillFloor?: number | null;
  onCareerInteract?: () => void;
  onAboutInteract?: () => void;
  onContactInteract?: () => void;
  onAIInteract?: () => void;
}

export const WorldCanvas: React.FC<WorldCanvasProps> = ({
  onGroundClick,
  referenceBlockOnly,
  onHQInteract,
  onInnovationInteract,
  onSelectProject,
  onSkillsInteract,
  onSelectSkillFloor,
  selectedSkillFloor = null,
  onCareerInteract,
  onAboutInteract,
  onContactInteract,
  onAIInteract,
}) => {
  const cameraMode = useWorldStore((s) => s.cameraMode);
  const downtownMode = useWorldStore((s) => s.downtownMode);
  const isRefOnly = referenceBlockOnly !== undefined ? referenceBlockOnly : downtownMode === 'reference';

  const avatarPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.22, 13.8));
  const avatarQuatRef = useRef<THREE.Quaternion>(new THREE.Quaternion());

  const handleLandmarkInteract = useCallback(
    (landmarkId: string) => {
      if (landmarkId === 'hq' && onHQInteract) onHQInteract();
      else if (landmarkId === 'innovation' && onInnovationInteract)
        onInnovationInteract({ id: 'inno', title: 'Innovation Center' });
      else if (landmarkId === 'skills' && onSkillsInteract) onSkillsInteract();
      else if (landmarkId === 'career' && onCareerInteract) onCareerInteract();
      else if (landmarkId === 'about' && onAboutInteract) onAboutInteract();
      else if (landmarkId === 'contact' && onContactInteract) onContactInteract();
      else if (landmarkId === 'ai' && onAIInteract) onAIInteract();
    },
    [
      onHQInteract,
      onInnovationInteract,
      onSkillsInteract,
      onCareerInteract,
      onAboutInteract,
      onContactInteract,
      onAIInteract,
    ]
  );

  return (
    <Canvas
      shadows
      camera={{
        position: WORLD_CONFIG.camera.orbitSpawn,
        fov: WORLD_CONFIG.camera.fov,
        near: WORLD_CONFIG.camera.near,
        far: WORLD_CONFIG.camera.far,
      }}
      dpr={[1, 1.35]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      onCreated={({ gl, scene }) => {
        if (typeof window !== 'undefined') {
          (window as any).__scene = scene;
          (window as any).__gl = gl;
        }
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFShadowMap;
        worldStore.getState().setIsSceneReady(true);
      }}
      className="w-full h-full block"
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        {/* 1. Atmospheric Daylight Sky & Subtle Atmospheric Perspective */}
        <WorldSky />

        {/* 1b. Phase 2.0.5 Continuous Ocean Water Surface Surrounding the Island */}
        <OceanWater />

        {/* 2. Realistic Daylight & Soft Directional Sun Shadowing */}
        <WorldLighting />

        {/* 3. Physics & World Collision Foundations */}
        <WorldPhysics>
          {/* Continuous Organic Island Landmass Ground Terrain */}
          <Terrain onGroundClick={onGroundClick} />

          {/* Central Protected District Sidewalks & Curbs */}
          <Sidewalk onSidewalkClick={onGroundClick} />
        </WorldPhysics>

        {/* 3b. Phase 2.0.5 Waterfront Marine Infrastructure, Seawalls, Promenade & Piers */}
        <WaterfrontPerimeter />

        {/* 4. Phase 1.9 Unified City Roads, Intersections, Crosswalks & Sidewalk Plinths */}
        <UnifiedCityRoads onRoadClick={onGroundClick} />

        {/* 5. Phase 2.0 Zone A Modular Downtown Architecture (40 Background Blocks) */}
        <ModularBuildingRenderer referenceBlockOnly={isRefOnly} />

        {/* 5b. Phase 2.0.4 Zone B & C Unified Continuous Metropolis Grid (312 Extension Blocks) */}
        {!isRefOnly && <UrbanExtensionZoneB />}

        {/* 5c. Phase 2.1.1 Signature Developer Headquarters (HQ) at City Center [0, 0] */}
        <HQBuilding onInteract={onHQInteract} />

        {/* 5d. Phase 2.1.1 Northwest Civic Plaza & Botanical Park at [-40, -40] */}
        <CivicPlaza position={[-40.0, 0, -40.0]} />

        {/* 5e. Phase 2.2 Signature Innovation & Projects Center at [40, -40] */}
        <InnovationCenterBuilding
          position={[40.0, 0, -40.0]}
          onInteract={onInnovationInteract}
          onSelectProject={onSelectProject}
        />

        {/* 5f. Phase 2.3 Custom Skills & Technology Tower at [-40, 0] */}
        <SkillsTowerBuilding
          position={[-40.0, 0, 0.0]}
          selectedFloor={selectedSkillFloor}
          onInteract={onSkillsInteract}
          onSelectFloor={onSelectSkillFloor}
        />

        {/* 5g. Phase 2.4 Career & Experience Center at [40, 0] */}
        <CareerCenterBuilding
          position={[40.0, 0, 0.0]}
          onInteract={onCareerInteract}
        />

        {/* 5h. Phase 2.5 About Me Studio at [0, -40] */}
        <AboutStudioBuilding
          position={[0.0, 0, -40.0]}
          onInteract={onAboutInteract}
        />

        {/* 5i. Phase 2.6 Contact & Collaboration Hub at [-40, 40] */}
        <ContactHubBuilding
          position={[-40.0, 0, 40.0]}
          onInteract={onContactInteract}
        />

        {/* 5j. Phase 2.7 AI Research & Innovation Center at [0, 40] */}
        <AIResearchBuilding
          position={[0.0, 0, 40.0]}
          onInteract={onAIInteract}
        />

        {/* 5k. Phase 3.0.1 Interactive Building Entrance Identification & Ground Decals */}
        <BuildingEntranceIndicators />

        {/* 5l. Phase 3.0.2 Playable Boundary Visual Debug (Dev toggle only) */}
        <PlayableBoundaryDebug />

        {/* 5m. Phase 3.0 Playable Main Avatar on Central 3x3 Free-Roaming Surface */}
        <PlayableAvatar
          onInteractLandmark={handleLandmarkInteract}
          avatarPosRef={avatarPosRef}
          avatarQuatRef={avatarQuatRef}
        />

        {/* 6. Active Camera Controller (Orbit vs Story Ground vs Avatar Third-Person) */}
        {cameraMode === 'avatar' ? (
          <ThirdPersonCamera avatarPosRef={avatarPosRef} avatarQuatRef={avatarQuatRef} />
        ) : cameraMode === 'story' ? (
          <StoryCamera />
        ) : (
          <OrbitCamera />
        )}

        {/* 7. Autonomous Vehicle & Pedestrian Navigation Debug Overlay */}
        <NavigationDebugOverlay />

        {/* 8. In-Canvas Performance Telemetry Collector */}
        <PerformanceMetricsCollector />
      </Suspense>
    </Canvas>
  );
};

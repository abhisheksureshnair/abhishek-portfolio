'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { WORLD_DISTRICTS, WorldDistrict } from './WorldConfig';
import { CityLighting, TimeOfDay } from './CityLighting';
import { CityGround } from './CityGround';
import { CityRoadNetwork } from './CityRoadNetwork';
import { HeroBuilding } from './HeroBuilding';
import { HeroBuildingOverlay } from './HeroBuildingOverlay';
import { AboutBuilding } from './AboutBuilding';
import { AboutBuildingOverlay } from './AboutBuildingOverlay';
import { ProjectsBuilding } from './ProjectsBuilding';
import { ProjectsBuildingOverlay } from './ProjectsBuildingOverlay';
import { SkillsBuilding } from './SkillsBuilding';
import { SkillsBuildingOverlay } from './SkillsBuildingOverlay';
import { ExperienceBuilding } from './ExperienceBuilding';
import { ExperienceBuildingOverlay } from './ExperienceBuildingOverlay';
import { ContactBuilding } from './ContactBuilding';
import { ContactBuildingOverlay } from './ContactBuildingOverlay';
import { CityStreetFurniture } from './CityStreetFurniture';
import { CityPlazaFountain } from './CityPlazaFountain';
import { CityTrafficSystem } from './CityTrafficSystem';
import { CityCameraController, SelectedBuildingType } from './CityCameraController';
import { DeveloperAvatar3D } from './DeveloperAvatar3D';
import { CityAvatarController, CITY_BUILDING_ZONES } from './CityAvatarController';
import { CityLoadingScreen } from './CityLoadingScreen';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { WorldHUD } from './WorldHUD';
import { ProjectOverlay } from '@/components/experience/ProjectOverlay';
import { FlowSyncModal } from '@/components/FlowSyncModal';
import { usePerformanceQuality } from '../PerformanceControl';
import { WebGLDiagnosticManager } from './WebGLDiagnosticManager';
import { Sparkles, AlertTriangle, RefreshCw } from 'lucide-react';

const _daySky = new THREE.Color('#bae6fd');
const _nightSky = new THREE.Color('#0c1938');

/**
 * Syncs tone mapping, exposure, sky background, and atmospheric fog with smooth transitions
 */
function CanvasToneMappingManager({ timeOfDay }: { timeOfDay: TimeOfDay }) {
  const { gl, scene } = useThree();
  const { prefersReducedMotion } = usePerformanceQuality();
  const progressRef = useRef(timeOfDay === 'night' ? 1.0 : 0.0);

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
  }, [gl]);

  useFrame((_, delta) => {
    if (typeof document !== 'undefined' && document.hidden) return;

    const target = timeOfDay === 'night' ? 1.0 : 0.0;
    const dt = Math.min(delta, 0.1);

    if (prefersReducedMotion) {
      progressRef.current = target;
    } else {
      const damp = 1 - Math.exp(-4.2 * dt);
      progressRef.current += (target - progressRef.current) * damp;
    }

    const t = progressRef.current;
    gl.toneMappingExposure = THREE.MathUtils.lerp(1.25, 1.15, t);

    // Smoothly transition scene background & fog
    if (scene.background && (scene.background as THREE.Color).isColor) {
      (scene.background as THREE.Color).lerpColors(_daySky, _nightSky, t);
    }
    if (scene.fog && (scene.fog as THREE.Fog).isFog) {
      const fog = scene.fog as THREE.Fog;
      fog.color.lerpColors(_daySky, _nightSky, t);
      fog.near = THREE.MathUtils.lerp(45, 35, t);
      fog.far = THREE.MathUtils.lerp(120, 105, t);
    }
  });

  return null;
}

export const WorldScene: React.FC = () => {
  const router = useRouter();
  const { effectiveTier } = usePerformanceQuality();

  // HUD, Recovery & Game State
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<SelectedBuildingType>(null);
  const [isIntroActive, setIsIntroActive] = useState<boolean>(true);
  const [cameraMode, setCameraMode] = useState<'follow' | 'tactical'>('follow');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [isSceneReady, setIsSceneReady] = useState<boolean>(false);
  const [soundMuted, setSoundMuted] = useState<boolean>(true);
  const [nearestDistrict, setNearestDistrict] = useState<WorldDistrict | null>(null);
  const [discoveredDistricts, setDiscoveredDistricts] = useState<string[]>(['code-nexus']);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  const [isFlowSyncCaseStudyOpen, setIsFlowSyncCaseStudyOpen] = useState<boolean>(false);
  const [webGlAvailable, setWebGlAvailable] = useState<boolean>(true);

  // Avatar transform refs for zero React re-renders during 60fps movement
  const playerPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.62, 14));
  const rotationRef = useRef<number>(0);
  const quaternionRef = useRef<THREE.Quaternion>(new THREE.Quaternion());
  const currentSpeedRef = useRef<number>(0);
  const isMovingRef = useRef<boolean>(false);
  const keysPressedRef = useRef<Record<string, boolean>>({});
  const targetWalkPosRef = useRef<THREE.Vector3 | null>(null);

  // Ground and road click-to-walk handler
  const handleGroundClick = useCallback((point: THREE.Vector3) => {
    if (selectedBuilding !== null || isIntroActive) return;
    targetWalkPosRef.current = point.clone();
  }, [selectedBuilding, isIntroActive]);

  // Enterable Building Interiors (Image 3)
  const streetPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 14));
  const [activeInterior, setActiveInterior] = useState<'code-nexus' | 'echo-desktop-ai' | 'flowsync' | null>(null);

  const handleEnterInterior = useCallback((districtId: string) => {
    if (districtId === 'code-nexus' || districtId === 'echo-desktop-ai' || districtId === 'flowsync') {
      streetPosRef.current.copy(playerPosRef.current);
      // Place player inside the high-tech interior room
      playerPosRef.current.set(0, 100, 4);
      setActiveInterior(districtId as any);
    }
  }, []);

  const handleExitInterior = useCallback(() => {
    // Return player to street coordinates directly outside the building entrance
    playerPosRef.current.copy(streetPosRef.current);
    setActiveInterior(null);
  }, []);

  // WebGL Context Restoration & Resilience Lifecycle
  const [contextStatus, setContextStatus] = useState<'normal' | 'lost' | 'failed'>('normal');
  const [canvasKey, setCanvasKey] = useState<number>(0);
  const retryCountRef = useRef<number>(0);

  // Check WebGL support & check if intro was already seen in this session
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      setWebGlAvailable(!!gl);
    } catch (e) {
      setWebGlAvailable(false);
    }

    const seenIntro = sessionStorage.getItem('developer_universe_intro_done');
    if (seenIntro) {
      setIsIntroActive(false);
    }

    // Check if player returned from /github-universe
    const savedPos = sessionStorage.getItem('universe_return_pos');
    if (savedPos) {
      try {
        const parsed = JSON.parse(savedPos);
        playerPosRef.current.set(parsed.x, 0, parsed.z);
        sessionStorage.removeItem('universe_return_pos');
      } catch (e) { }
    }
  }, []);

  // District Interaction Dispatcher
  const handleDistrictInteraction = useCallback(
    (districtId: string) => {
      // Enter interactive 3D interior for supported buildings (Image 3)
      if (districtId === 'code-nexus' || districtId === 'echo-desktop-ai' || districtId === 'flowsync') {
        handleEnterInterior(districtId);
        return;
      }

      const district = WORLD_DISTRICTS.find((d) => d.id === districtId);
      if (!district) return;

      if (district.isPortal) {
        sessionStorage.setItem(
          'universe_return_pos',
          JSON.stringify({ x: playerPosRef.current.x, z: playerPosRef.current.z })
        );
        router.push(district.portalRoute || '/github-universe');
        return;
      }

      setSelectedDistrictId(district.id);
    },
    [handleEnterInterior, router]
  );

  // Keyboard Event Handlers (Bound once with ref dependencies to avoid re-binding)
  const nearestDistrictRef = useRef<WorldDistrict | null>(null);
  nearestDistrictRef.current = nearestDistrict;
  const activeInteriorRef = useRef<string | null>(null);
  activeInteriorRef.current = activeInterior;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key] = true;

      // Escape closes open building modal
      if (e.key === 'Escape') {
        setSelectedBuilding(null);
        return;
      }

      // Handle 'E' or Space interaction trigger
      if (e.key === 'e' || e.key === 'E' || e.key === ' ') {
        if (activeInteriorRef.current) {
          handleExitInterior();
          return;
        }

        // Check if player is near any of the 6 city buildings
        const px = playerPosRef.current.x;
        const pz = playerPosRef.current.z;
        for (let i = 0; i < CITY_BUILDING_ZONES.length; i++) {
          const zone = CITY_BUILDING_ZONES[i];
          const dist = Math.hypot(px - zone.entrance[0], pz - zone.entrance[1]);
          if (dist < 4.8) {
            setSelectedBuilding(zone.id);
            return;
          }
        }

        if (nearestDistrictRef.current) {
          handleDistrictInteraction(nearestDistrictRef.current.id);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown, { passive: true });
    window.addEventListener('keyup', handleKeyUp, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleDistrictInteraction]);

  // Proximity detection loop (Runs at 8Hz; updates React state ONLY when nearest district changes!)
  useEffect(() => {
    const proximityTimer = setInterval(() => {
      const px = playerPosRef.current.x;
      const pz = playerPosRef.current.z;

      let closest: WorldDistrict | null = null;
      let minDist = 7.5; // Trigger threshold radius

      for (let i = 0; i < WORLD_DISTRICTS.length; i++) {
        const d = WORLD_DISTRICTS[i];
        const dx = d.x - px;
        const dz = d.z - pz;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < minDist) {
          minDist = dist;
          closest = d;
        }
      }

      // Only trigger state update if district changes, preventing constant re-renders
      setNearestDistrict((prev) => (prev?.id === closest?.id ? prev : closest));

      if (closest) {
        setDiscoveredDistricts((prev) =>
          prev.includes(closest!.id) ? prev : [...prev, closest!.id]
        );
      }
    }, 125);

    return () => clearInterval(proximityTimer);
  }, []);

  const handleSkipIntro = () => {
    setIsIntroActive(false);
    sessionStorage.setItem('developer_universe_intro_done', 'true');
  };

  const handleReplayIntro = () => {
    setIsIntroActive(true);
    sessionStorage.removeItem('developer_universe_intro_done');
  };

  const handleVirtualMove = (key: string, isDown: boolean) => {
    keysPressedRef.current[key] = isDown;
  };

  // Graceful WebGL Context Management
  const handleContextLost = useCallback(() => {
    setContextStatus('lost');
    // Allow up to 3 seconds for driver auto-restoration before displaying interactive fallback
    setTimeout(() => {
      setContextStatus((curr) => (curr === 'lost' ? 'failed' : curr));
    }, 3000);
  }, []);

  const handleContextRestored = useCallback(() => {
    setContextStatus('normal');
    // Increment canvas key to cleanly remount scene graph with fresh GL state
    setCanvasKey((prev) => prev + 1);
  }, []);

  const handleManualRetry = useCallback(() => {
    if (retryCountRef.current < 4) {
      retryCountRef.current += 1;
      setContextStatus('normal');
      setCanvasKey((prev) => prev + 1);
    } else {
      router.push('/');
    }
  }, [router]);

  if (!webGlAvailable) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center font-mono">
        <div className="max-w-md space-y-4 p-8 rounded-3xl bg-zinc-900 border border-white/10">
          <h2 className="text-xl font-bold text-cyan-400">WebGL Acceleration Required</h2>
          <p className="text-xs text-zinc-400">
            Your current browser or display driver has WebGL acceleration disabled. You can explore the full portfolio in Classic Mode or explore the interactive GitHub Universe.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
            >
              Return to Classic Portfolio
            </button>
            <button
              onClick={() => router.push('/github-universe')}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-white text-xs font-bold"
            >
              Open GitHub Code Nexus
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Adaptive Graphics settings directly controlling R3F Canvas
  const dprConfig: number | [number, number] =
    effectiveTier === 'low'
      ? 1.0
      : effectiveTier === 'medium'
        ? [1, 1.25]
        : [1, 1.75];

  const shadowSetting = effectiveTier === 'low' ? false : 'percentage';

  return (
    <div
      className={`relative w-full h-screen min-h-screen ${timeOfDay === 'night' ? 'bg-[#0c1938]' : 'bg-[#bae6fd]'
        } overflow-hidden select-none`}
      style={{ width: '100%', height: '100vh', minHeight: '100vh' }}
    >
      {/* 3D Loading Screen with Progress & Instant Bypass */}
      <CityLoadingScreen isReady={isSceneReady} onDismiss={() => setIsSceneReady(true)} />

      {/* 3D Canvas Viewport with Auto-Recovery Key */}
      <Canvas
        key={canvasKey}
        shadows={effectiveTier === 'low' ? false : 'percentage'}
        camera={{ position: [18, 16, 22], fov: 45, near: 0.1, far: 500 }}
        dpr={dprConfig}
        gl={{
          antialias: effectiveTier !== 'low',
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = timeOfDay === 'night' ? 1.15 : 1.25;
          if (effectiveTier !== 'low') {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFShadowMap;
          } else {
            gl.shadowMap.enabled = false;
          }
          setIsSceneReady(true);
        }}
        className="w-full h-full block"
        style={{ width: '100%', height: '100%' }}
      >
        <React.Suspense fallback={null}>
          {/* Tone Mapping & Exposure Manager */}
          <CanvasToneMappingManager timeOfDay={timeOfDay} />

          {/* Soft Sunny Daylight vs Deep Midnight Sapphire Atmosphere & Fog */}
          <color attach="background" args={[timeOfDay === 'night' ? '#0c1938' : '#bae6fd']} />
          <fog
            attach="fog"
            args={[
              timeOfDay === 'night' ? '#0c1938' : '#bae6fd',
              timeOfDay === 'night' ? 35 : 45,
              timeOfDay === 'night' ? 105 : 120,
            ]}
          />

          {/* WebGL Context Interruption & Telemetry Monitor */}
          <WebGLDiagnosticManager
            onContextLost={handleContextLost}
            onContextRestored={handleContextRestored}
          />

          {/* OrbitControls for Smooth Camera Rotation & Debugging */}
          <OrbitControls
            ref={controlsRef}
            makeDefault
            target={[0, 0, 0]}
            minDistance={8}
            maxDistance={70}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minPolarAngle={0.1}
            enableDamping
            dampingFactor={0.05}
          />

          {/* Frame-Rate Independent Camera Controller for Building focus, Avatar Follow & Intro Flyover */}
          <CityCameraController
            controlsRef={controlsRef}
            selectedBuilding={selectedBuilding}
            cameraMode={cameraMode}
            playerPosRef={playerPosRef}
            isIntroActive={isIntroActive}
            onIntroComplete={() => {
              setIsIntroActive(false);
              sessionStorage.setItem('developer_universe_intro_done', 'true');
            }}
            heroPosition={[-7.85, 0.74, -7.35]}
            aboutPosition={[7.85, 0.74, -7.35]}
            projectsPosition={[-7.85, 0.74, 7.35]}
            skillsPosition={[7.85, 0.74, 7.35]}
            experiencePosition={[0, 0.74, 21.5]}
            contactPosition={[0, 0.74, -21.5]}
          />

          {/* Reusable Stylized Diorama Lighting with Day / Night Mode */}
          <CityLighting timeOfDay={timeOfDay} />

          {/* Reusable 60x60 Raised Ground Platform */}
          <CityGround size={60} onGroundClick={handleGroundClick} />

          {/* Reusable City Road & Sidewalk Network */}
          <CityRoadNetwork onRoadClick={handleGroundClick} />

          {/* Environmental Details: Trees (with ambient sway), Bushes, Streetlights, Signals & Parked Cars */}
          <CityStreetFurniture timeOfDay={timeOfDay} />

          {/* Civic Central Plaza Animated Fountain */}
          <CityPlazaFountain position={[3.85, 0.74, -3.85]} />

          {/* Animated Traffic System: 5 Moving Low-Poly Vehicles on Road Circuits */}
          <CityTrafficSystem />

          {/* Stylized 3D Developer Avatar Movement & Building Proximity Controller */}
          <CityAvatarController
            playerPosRef={playerPosRef}
            rotationRef={rotationRef}
            quaternionRef={quaternionRef}
            currentSpeedRef={currentSpeedRef}
            isMovingRef={isMovingRef}
            keysPressedRef={keysPressedRef}
            targetWalkPosRef={targetWalkPosRef}
            onSelectBuilding={(bId) => setSelectedBuilding(bId)}
            isModalOpen={selectedBuilding !== null}
          />

          {/* Stylized 3D Developer Avatar (Chibi Casual Outfit, Head, Backpack, Sneakers, Locomotion) */}
          <DeveloperAvatar3D
            positionRef={playerPosRef}
            rotationRef={rotationRef}
            quaternionRef={quaternionRef}
            currentSpeedRef={currentSpeedRef}
            isMovingRef={isMovingRef}
          />

          {/* Hero Headquarters: 3-Floor Interactive Flagship Building (Plot 01) */}
          <HeroBuilding
            position={[-7.85, 0.74, -7.35]}
            onSelect={() => setSelectedBuilding('hero')}
            isSelected={selectedBuilding === 'hero'}
          />

          {/* About Me Creative Studio: 2-Story Studio with Terrace & Balcony (Plot 02) */}
          <AboutBuilding
            position={[7.85, 0.74, -7.35]}
            onSelect={() => setSelectedBuilding('about')}
            isSelected={selectedBuilding === 'about'}
          />

          {/* Projects Innovation Center: Futuristic Purple & Blue Exhibition Building (Plot 03) */}
          <ProjectsBuilding
            position={[-7.85, 0.74, 7.35]}
            onSelect={() => setSelectedBuilding('projects')}
            isSelected={selectedBuilding === 'projects'}
          />

          {/* Skills Tech Tower: Tall Futuristic Skyscraper with Glowing Windows & Antenna (Plot 04) */}
          <SkillsBuilding
            position={[7.85, 0.74, 7.35]}
            onSelect={() => setSelectedBuilding('skills')}
            isSelected={selectedBuilding === 'skills'}
          />

          {/* Experience Office: Professional Blue-and-White Corporate Office Complex (Plot 06) */}
          <ExperienceBuilding
            position={[0, 0.74, 21.5]}
            onSelect={() => setSelectedBuilding('experience')}
            isSelected={selectedBuilding === 'experience'}
          />

          {/* Contact Hub: Friendly Modern Communication Hub with Pink & Blue Accents (Plot 05) */}
          <ContactBuilding
            position={[0, 0.74, -21.5]}
            onSelect={() => setSelectedBuilding('contact')}
            isSelected={selectedBuilding === 'contact'}
          />
        </React.Suspense>
      </Canvas>

      {/* Hero Headquarters Interactive HTML Modal Overlay */}
      <HeroBuildingOverlay
        isOpen={selectedBuilding === 'hero'}
        onClose={() => setSelectedBuilding(null)}
        onExplorePortfolio={() => {
          setSelectedBuilding(null);
          router.push('/experience');
        }}
      />

      {/* About Me Creative Studio Interactive HTML Information Panel */}
      <AboutBuildingOverlay
        isOpen={selectedBuilding === 'about'}
        onClose={() => setSelectedBuilding(null)}
      />

      {/* Projects Innovation Center Interactive Projects Gallery Overlay */}
      <ProjectsBuildingOverlay
        isOpen={selectedBuilding === 'projects'}
        onClose={() => setSelectedBuilding(null)}
      />

      {/* Skills Tech Tower Interactive Skills Engineering Panel */}
      <SkillsBuildingOverlay
        isOpen={selectedBuilding === 'skills'}
        onClose={() => setSelectedBuilding(null)}
      />

      {/* Experience Office Interactive Career Timeline Panel */}
      <ExperienceBuildingOverlay
        isOpen={selectedBuilding === 'experience'}
        onClose={() => setSelectedBuilding(null)}
      />

      {/* Contact Hub Interactive Communication & Transmission Panel */}
      <ContactBuildingOverlay
        isOpen={selectedBuilding === 'contact'}
        onClose={() => setSelectedBuilding(null)}
      />

      {/* 2D Interactive HUD & Radar MiniMap (Zero-React-Rerender) */}
      <WorldHUD
        isIntroActive={isIntroActive}
        onSkipIntro={handleSkipIntro}
        onReplayIntro={handleReplayIntro}
        discoveredDistricts={discoveredDistricts}
        nearestDistrict={nearestDistrict}
        onInteractDistrict={handleDistrictInteraction}
        cameraMode={cameraMode}
        onToggleCameraMode={() =>
          setCameraMode((prev) => (prev === 'follow' ? 'tactical' : 'follow'))
        }
        soundMuted={soundMuted}
        onToggleSound={() => setSoundMuted((prev) => !prev)}
        playerPosRef={playerPosRef}
        onVirtualMove={handleVirtualMove}
        activeInterior={activeInterior}
        onExitInterior={handleExitInterior}
        timeOfDay={timeOfDay}
        onToggleTimeOfDay={() => setTimeOfDay((prev) => (prev === 'day' ? 'night' : 'day'))}
        selectedBuilding={selectedBuilding}
        onSelectBuilding={(bId) => setSelectedBuilding(bId)}
      />

      {/* Selected District Project Overlay Modal */}
      {selectedDistrictId && (
        <ProjectOverlay
          locationId={selectedDistrictId}
          onClose={() => setSelectedDistrictId(null)}
          onOpenFlowSyncCaseStudy={() => {
            setSelectedDistrictId(null);
            setIsFlowSyncCaseStudyOpen(true);
          }}
        />
      )}

      {/* FlowSync Interactive Case Study Modal */}
      <FlowSyncModal
        isOpen={isFlowSyncCaseStudyOpen}
        onClose={() => setIsFlowSyncCaseStudyOpen(false)}
      />

      {/* Interactive WebGL Context Interruption Fallback with Retry */}
      {(contextStatus === 'failed' || contextStatus === 'lost') && (
        <div className="absolute inset-0 z-50 bg-[#030509]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center font-mono">
          <div className="max-w-md space-y-5 p-8 rounded-3xl bg-zinc-950 border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)]">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <AlertTriangle className="w-7 h-7 text-amber-400 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white tracking-tight uppercase">
                {contextStatus === 'lost' ? 'Restoring 3D Simulation...' : '3D Acceleration Paused'}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {contextStatus === 'lost'
                  ? 'A GPU context interruption was detected. Attempting automatic restoration...'
                  : 'The WebGL hardware context was interrupted by the GPU driver. You can reload the 3D scene or explore the lightweight Classic Portfolio.'}
              </p>
            </div>
            {contextStatus === 'failed' && (
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleManualRetry}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry 3D World</span>
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-xs font-semibold transition-all"
                >
                  Classic Mode
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

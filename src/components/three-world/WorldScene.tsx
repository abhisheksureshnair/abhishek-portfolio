'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { WORLD_DISTRICTS, WorldDistrict } from './WorldConfig';
import { HeroBuildingOverlay } from './HeroBuildingOverlay';
import { AboutBuildingOverlay } from './AboutBuildingOverlay';
import { ProjectsBuildingOverlay } from './ProjectsBuildingOverlay';
import { SkillsBuildingOverlay } from './SkillsBuildingOverlay';
import { ExperienceBuildingOverlay } from './ExperienceBuildingOverlay';
import { ContactBuildingOverlay } from './ContactBuildingOverlay';
import { SelectedBuildingType } from './CityCameraController';
import { CITY_BUILDING_ZONES } from './CityAvatarController';
import { CityLoadingScreen } from './CityLoadingScreen';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { WorldHUD } from './WorldHUD';
import { ProjectOverlay } from '@/components/experience/ProjectOverlay';
import { FlowSyncModal } from '@/components/FlowSyncModal';
import { usePerformanceQuality, usePerformanceTelemetry } from '../PerformanceControl';
import { WebGLDiagnosticManager } from './WebGLDiagnosticManager';
import { AlertTriangle, RefreshCw } from 'lucide-react';

// New Photorealistic Space & City Components
import { RealisticEarth, EARTH_LOCATIONS, EarthLocation } from './RealisticEarth';
import { RealisticCity } from './RealisticCity';
import {
  SpaceToCityCameraController,
  WorldViewMode,
  CityCameraPerspective,
} from './SpaceToCityCameraController';
import {
  AtmosphericWeatherSystem,
  TimeOfDay,
  WeatherType,
} from './AtmosphericWeatherSystem';

export const WorldScene: React.FC = () => {
  const router = useRouter();
  const { effectiveTier } = usePerformanceQuality();
  const { updateTelemetry } = usePerformanceTelemetry();

  // Space-to-City View Mode state
  const [viewMode, setViewMode] = useState<WorldViewMode>('space');
  const [targetLocation, setTargetLocation] = useState<EarthLocation | null>(EARTH_LOCATIONS[0]);
  const [transitionProgress, setTransitionProgress] = useState<number>(0);
  const [transitionAltitude, setTransitionAltitude] = useState<number>(75);

  // Weather & Lighting state
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [weather, setWeather] = useState<WeatherType>('clear');
  const [cityPerspective, setCityPerspective] = useState<CityCameraPerspective>('aerial');

  // Controls, Overlays & Game State
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<SelectedBuildingType>(null);
  const [isIntroActive, setIsIntroActive] = useState<boolean>(true);
  const [cameraMode, setCameraMode] = useState<'follow' | 'tactical'>('follow');
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
  const handleGroundClick = useCallback(
    (point: THREE.Vector3) => {
      if (selectedBuilding !== null || isIntroActive || viewMode !== 'city') return;
      targetWalkPosRef.current = point.clone();
    },
    [selectedBuilding, isIntroActive, viewMode]
  );

  // Enterable Building Interiors
  const streetPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 14));
  const [activeInterior, setActiveInterior] = useState<'code-nexus' | 'echo-desktop-ai' | 'flowsync' | null>(null);

  const handleEnterInterior = useCallback((districtId: string) => {
    if (districtId === 'code-nexus' || districtId === 'echo-desktop-ai' || districtId === 'flowsync') {
      streetPosRef.current.copy(playerPosRef.current);
      playerPosRef.current.set(0, 100, 4);
      setActiveInterior(districtId as any);
    }
  }, []);

  const handleExitInterior = useCallback(() => {
    playerPosRef.current.copy(streetPosRef.current);
    setActiveInterior(null);
  }, []);

  // WebGL Context Restoration & Resilience Lifecycle
  const [contextStatus, setContextStatus] = useState<'normal' | 'lost' | 'failed'>('normal');
  const [canvasKey, setCanvasKey] = useState<number>(0);
  const retryCountRef = useRef<number>(0);

  // Check WebGL support & session intro state
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

    const savedPos = sessionStorage.getItem('universe_return_pos');
    if (savedPos) {
      try {
        const parsed = JSON.parse(savedPos);
        playerPosRef.current.set(parsed.x, 0, parsed.z);
        sessionStorage.removeItem('universe_return_pos');
      } catch (e) {}
    }
  }, []);

  // District Interaction Dispatcher
  const handleDistrictInteraction = useCallback(
    (districtId: string) => {
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

  // Keyboard Event Handlers
  const nearestDistrictRef = useRef<WorldDistrict | null>(null);
  nearestDistrictRef.current = nearestDistrict;
  const activeInteriorRef = useRef<string | null>(null);
  activeInteriorRef.current = activeInterior;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key.toLowerCase()] = true;
      keysPressedRef.current[e.key] = true;
      if (e.code) keysPressedRef.current[e.code] = true;

      if (e.key === 'Escape') {
        setSelectedBuilding(null);
        return;
      }

      if (e.key === 'e' || e.key === 'E' || e.key === ' ') {
        if (activeInteriorRef.current) {
          handleExitInterior();
          return;
        }

        const px = playerPosRef.current.x;
        const pz = playerPosRef.current.z;
        for (let i = 0; i < CITY_BUILDING_ZONES.length; i++) {
          const zone = CITY_BUILDING_ZONES[i];
          const dist = Math.hypot(px - zone.entrance[0], pz - zone.entrance[1]);
          if (dist < 5.2) {
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
      keysPressedRef.current[e.key.toLowerCase()] = false;
      keysPressedRef.current[e.key] = false;
      if (e.code) keysPressedRef.current[e.code] = false;
    };

    const handleBlur = () => {
      keysPressedRef.current = {};
    };

    window.addEventListener('keydown', handleKeyDown, { passive: true });
    window.addEventListener('keyup', handleKeyUp, { passive: true });
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [handleDistrictInteraction, handleExitInterior]);

  // Proximity detection loop (8Hz)
  useEffect(() => {
    if (viewMode !== 'city') return;

    const proximityTimer = setInterval(() => {
      const px = playerPosRef.current.x;
      const pz = playerPosRef.current.z;

      let closest: WorldDistrict | null = null;
      let minDist = 7.5;

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

      setNearestDistrict((prev) => (prev?.id === closest?.id ? prev : closest));

      if (closest) {
        setDiscoveredDistricts((prev) =>
          prev.includes(closest!.id) ? prev : [...prev, closest!.id]
        );
      }
    }, 125);

    return () => clearInterval(proximityTimer);
  }, [viewMode]);

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

  // Location select handler from space mode
  const handleSelectEarthLocation = (loc: EarthLocation) => {
    setTargetLocation(loc);
    setViewMode('descending');
  };

  // Graceful WebGL Context Management
  const handleContextLost = useCallback(() => {
    setContextStatus('lost');
    setTimeout(() => {
      setContextStatus((curr) => (curr === 'lost' ? 'failed' : curr));
    }, 3000);
  }, []);

  const handleContextRestored = useCallback(() => {
    setContextStatus('normal');
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

  const dprConfig: number | [number, number] =
    effectiveTier === 'low' ? 1.0 : effectiveTier === 'medium' ? [1, 1.25] : [1, 1.75];

  // Dynamic background color based on viewMode & timeOfDay
  const canvasBgColor =
    viewMode === 'space'
      ? '#020617'
      : timeOfDay === 'night'
      ? '#0c1938'
      : timeOfDay === 'sunset'
      ? '#fdba74'
      : '#bae6fd';

  return (
    <div
      className="relative w-full h-screen min-h-screen overflow-hidden select-none bg-black"
      style={{ width: '100%', height: '100vh', minHeight: '100vh' }}
    >
      {/* 3D Loading Screen with Progress & Instant Bypass */}
      <CityLoadingScreen isReady={isSceneReady} onDismiss={() => setIsSceneReady(true)} />

      {/* 3D Canvas Viewport */}
      <Canvas
        key={canvasKey}
        shadows={effectiveTier !== 'low'}
        camera={{ position: [0, 16, 75], fov: 45, near: 0.1, far: 800 }}
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
          {/* Background color and atmospheric distance fog */}
          <color attach="background" args={[canvasBgColor]} />
          <fog
            attach="fog"
            args={[
              canvasBgColor,
              viewMode === 'space' ? 150 : 35,
              viewMode === 'space' ? 500 : 125,
            ]}
          />

          {/* WebGL Diagnostic Manager */}
          <WebGLDiagnosticManager
            onContextLost={handleContextLost}
            onContextRestored={handleContextRestored}
            onStatsUpdate={(stats) => {
              updateTelemetry(stats.avgFps, stats.avgFrameTimeMs);
            }}
          />

          {/* Orbit Controls (Used for free camera orbit) */}
          <OrbitControls
            ref={controlsRef}
            makeDefault
            target={[0, 0, 0]}
            minDistance={viewMode === 'space' ? 32 : 6}
            maxDistance={viewMode === 'space' ? 140 : 65}
            maxPolarAngle={viewMode === 'space' ? Math.PI : Math.PI / 2 - 0.04}
            enableDamping
            dampingFactor={0.05}
          />

          {/* Cinematic Space-to-City Smooth Camera Controller */}
          <SpaceToCityCameraController
            controlsRef={controlsRef}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            targetLocation={targetLocation}
            cityPerspective={cityPerspective}
            selectedBuilding={selectedBuilding}
            playerPosRef={playerPosRef}
            rotationRef={rotationRef}
            onTransitionProgress={(prog, alt) => {
              setTransitionProgress(prog);
              setTransitionAltitude(alt);
            }}
          />

          {/* Dynamic Sunlight / Moonlight & Weather System */}
          <AtmosphericWeatherSystem
            timeOfDay={timeOfDay}
            weather={weather}
            castShadows={viewMode === 'city'}
          />

          {/* 1. Realistic 3D Earth (Rendered in Space & during transitions) */}
          {(viewMode === 'space' || viewMode === 'descending' || viewMode === 'ascending') && (
            <RealisticEarth
              radius={24}
              onSelectLocation={handleSelectEarthLocation}
              selectedLocationId={targetLocation?.id}
              isZooming={viewMode === 'descending'}
              autoRotate={viewMode === 'space'}
            />
          )}

          {/* 2. Realistic 3D City (Rendered in City & during transitions) */}
          {(viewMode === 'city' || viewMode === 'descending' || viewMode === 'ascending') && (
            <RealisticCity
              visible={true}
              timeOfDay={timeOfDay}
              selectedBuilding={selectedBuilding}
              onSelectBuilding={setSelectedBuilding}
              playerPosRef={playerPosRef}
              rotationRef={rotationRef}
              quaternionRef={quaternionRef}
              currentSpeedRef={currentSpeedRef}
              isMovingRef={isMovingRef}
              keysPressedRef={keysPressedRef}
              targetWalkPosRef={targetWalkPosRef}
              onGroundClick={handleGroundClick}
            />
          )}
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

      {/* Upgraded 2D Interactive HUD with Space / City Modes */}
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
        onToggleTimeOfDay={() => {
          setTimeOfDay((prev) =>
            prev === 'day' ? 'sunset' : prev === 'sunset' ? 'night' : 'day'
          );
        }}
        selectedBuilding={selectedBuilding}
        onSelectBuilding={(bId) => setSelectedBuilding(bId)}
        // Space-to-City Controls
        viewMode={viewMode}
        onSetViewMode={setViewMode}
        targetLocation={targetLocation}
        onSelectLocation={handleSelectEarthLocation}
        weather={weather}
        onToggleWeather={() => {
          setWeather((prev) => (prev === 'clear' ? 'rain' : prev === 'rain' ? 'fog' : 'clear'));
        }}
        cityPerspective={cityPerspective}
        onToggleCityPerspective={() => {
          setCityPerspective((prev) =>
            prev === 'aerial' ? 'street' : prev === 'street' ? 'first-person' : prev === 'first-person' ? 'drone' : 'aerial'
          );
        }}
        transitionProgress={transitionProgress}
        transitionAltitude={transitionAltitude}
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

      {/* Interactive WebGL Context Interruption Fallback */}
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

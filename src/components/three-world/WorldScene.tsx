'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { WORLD_DISTRICTS, WorldDistrict } from './WorldConfig';
import { CityEnvironment } from './CityEnvironment';
import { DeveloperAvatar3D } from './DeveloperAvatar3D';
import { DistrictBuildings } from './DistrictBuildings';
import { CinematicCameraController } from './CinematicCameraController';
import { WorldHUD } from './WorldHUD';
import { ProjectOverlay } from '@/components/experience/ProjectOverlay';
import { FlowSyncModal } from '@/components/FlowSyncModal';

export const WorldScene: React.FC = () => {
  const router = useRouter();

  // Avatar transform refs for 60fps render loop with zero React re-renders during movement
  const playerPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 8));
  const rotationRef = useRef<number>(0);
  const isMovingRef = useRef<boolean>(false);
  const keysPressedRef = useRef<Record<string, boolean>>({});

  // HUD & Game State
  const [isIntroActive, setIsIntroActive] = useState<boolean>(true);
  const [cameraMode, setCameraMode] = useState<'follow' | 'tactical'>('follow');
  const [soundMuted, setSoundMuted] = useState<boolean>(true);
  const [nearestDistrict, setNearestDistrict] = useState<WorldDistrict | null>(null);
  const [discoveredDistricts, setDiscoveredDistricts] = useState<string[]>(['code-nexus']);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  const [isFlowSyncCaseStudyOpen, setIsFlowSyncCaseStudyOpen] = useState<boolean>(false);
  const [webGlAvailable, setWebGlAvailable] = useState<boolean>(true);

  // Position snapshot for 2D minimap sync (polled gently at 10Hz)
  const [radarPlayerPos, setRadarPlayerPos] = useState<{ x: number; z: number }>({ x: 0, z: 8 });

  // Check WebGL support & check if intro was already seen in this session
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebGlAvailable(false);
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
      } catch (e) {}
    }
  }, []);

  // District Interaction Dispatcher
  const handleDistrictInteraction = useCallback(
    (districtId: string) => {
      const district = WORLD_DISTRICTS.find((d) => d.id === districtId);
      if (!district) return;

      if (district.isPortal) {
        // Save current coordinates before warp
        sessionStorage.setItem(
          'universe_return_pos',
          JSON.stringify({ x: playerPosRef.current.x, z: playerPosRef.current.z })
        );
        router.push(district.portalRoute || '/github-universe');
        return;
      }

      if (district.id === 'flowsync') {
        setIsFlowSyncCaseStudyOpen(true);
      } else {
        setSelectedDistrictId(district.id);
      }
    },
    [router]
  );

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key] = true;

      // Handle 'E' or Space interaction trigger
      if ((e.key === 'e' || e.key === 'E' || e.key === ' ') && nearestDistrict) {
        handleDistrictInteraction(nearestDistrict.id);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearestDistrict, handleDistrictInteraction]);

  // Proximity detection loop (Runs at 10Hz to preserve 60FPS Three.js canvas)
  useEffect(() => {
    const proximityTimer = setInterval(() => {
      const px = playerPosRef.current.x;
      const pz = playerPosRef.current.z;

      setRadarPlayerPos({ x: px, z: pz });

      let closest: WorldDistrict | null = null;
      let minDist = 7.5; // Trigger threshold radius

      for (const d of WORLD_DISTRICTS) {
        const dx = d.x - px;
        const dz = d.z - pz;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < minDist) {
          minDist = dist;
          closest = d;
        }
      }

      setNearestDistrict(closest);

      if (closest && !discoveredDistricts.includes(closest.id)) {
        setDiscoveredDistricts((prev) => [...prev, closest!.id]);
      }
    }, 100);

    return () => clearInterval(proximityTimer);
  }, [discoveredDistricts]);

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

  return (
    <div className="relative w-full h-screen bg-[#030509] overflow-hidden select-none">
      
      {/* 3D Canvas Viewport */}
      <Canvas
        shadows
        camera={{ position: [0, 36, 52], fov: 46 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        className="w-full h-full block"
      >
        {/* Futuristic City Environment & Lighting */}
        <CityEnvironment />

        {/* 9 Architectural Districts & Code Nexus Citadel */}
        <DistrictBuildings
          playerPosRef={playerPosRef}
          nearestDistrictId={nearestDistrict?.id || null}
          onSelectDistrict={handleDistrictInteraction}
        />

        {/* 3D Animated Developer Avatar */}
        <DeveloperAvatar3D
          positionRef={playerPosRef}
          rotationRef={rotationRef}
          isMovingRef={isMovingRef}
        />

        {/* Cinematic & Third-Person Camera Engine */}
        <CinematicCameraController
          playerPosRef={playerPosRef}
          rotationRef={rotationRef}
          isMovingRef={isMovingRef}
          isIntroActive={isIntroActive}
          onIntroComplete={() => {
            setIsIntroActive(false);
            sessionStorage.setItem('developer_universe_intro_done', 'true');
          }}
          cameraMode={cameraMode}
          keysPressedRef={keysPressedRef}
        />
      </Canvas>

      {/* 2D Interactive HUD, Radar MiniMap & Controls */}
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
        playerPos={radarPlayerPos}
        onVirtualMove={handleVirtualMove}
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

    </div>
  );
};

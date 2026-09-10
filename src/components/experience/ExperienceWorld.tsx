'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { HUD } from './HUD';
import { MiniMap, LocationMarker } from './MiniMap';
import { MissionSystem, Mission } from './MissionSystem';
import { ProjectOverlay } from './ProjectOverlay';
import { AbiAiGuide } from './AbiAiGuide';
import { MobileControls } from './MobileControls';
import { FlowSyncModal } from '../FlowSyncModal';

// District Location Coordinates in 3D Space
const DISTRICTS = [
  { id: 'flowsync', name: 'FLOW SYNC HQ', category: 'Full-Stack + AI', x: -18, z: -18, color: '#6366f1' },
  { id: 'echo-desktop-ai', name: 'ECHO AI LAB', category: 'Electron + LLM', x: 18, z: -18, color: '#38bdf8' },
  { id: 'livesync', name: 'MOBILE NETWORK', category: 'React Native', x: -22, z: 12, color: '#10b981' },
  { id: 'alphapulse-stock-ai', name: 'AI ANALYTICS', category: 'FastAPI Python', x: 22, z: 12, color: '#a855f7' },
  { id: 'neon-kinetic', name: 'LOGISTICS GARAGE', category: 'Flutter GPS', x: 0, z: -28, color: '#f59e0b' },
  { id: 'innspark-hq', name: 'INNSPARK HQ', category: 'InnSpark Role', x: 0, z: 25, color: '#ec4899' },
  { id: 'about-hub', name: 'ABOUT HUB', category: 'Bio Persona', x: -28, z: 0, color: '#3b82f6' },
  { id: 'contact-hub', name: 'CONTACT CENTER', category: 'Direct Links', x: 28, z: 0, color: '#14b8a6' },
];

// Initial Missions List
const INITIAL_MISSIONS: Mission[] = [
  { id: 'm1', title: 'MISSION 01: Full-Stack Intelligence', targetLocationId: 'flowsync', locationName: 'FLOW SYNC HQ', completed: false },
  { id: 'm2', title: 'MISSION 02: Desktop & Browser AI', targetLocationId: 'echo-desktop-ai', locationName: 'ECHO AI LAB', completed: false },
  { id: 'm3', title: 'MISSION 03: Mobile Engineering', targetLocationId: 'livesync', locationName: 'MOBILE NETWORK', completed: false },
  { id: 'm4', title: 'MISSION 04: Algorithmic Financial AI', targetLocationId: 'alphapulse-stock-ai', locationName: 'AI ANALYTICS', completed: false },
  { id: 'm5', title: 'MISSION 05: Fleet Telematics', targetLocationId: 'neon-kinetic', locationName: 'LOGISTICS GARAGE', completed: false },
  { id: 'm6', title: 'MISSION 06: Commercial Experience', targetLocationId: 'innspark-hq', locationName: 'INNSPARK HQ', completed: false },
];

// 3D Avatar Mesh Component
function PlayerAvatar({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 1.5;
    }
  });

  return (
    <group position={position}>
      {/* Outer Glowing Energy Ring */}
      <mesh ref={meshRef} position={[0, 0.4, 0]}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color="#6366f1" wireframe emissive="#6366f1" emissiveIntensity={0.8} />
      </mesh>

      {/* Core Glowing Orb */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1} />
      </mesh>

      {/* Ground Shadow Light */}
      <pointLight position={[0, 0.5, 0]} color="#6366f1" intensity={2} distance={6} />
    </group>
  );
}

// 3D Building & Waypoint District Mesh
function DistrictBuilding({
  district,
  isNear,
  onInteract,
}: {
  district: (typeof DISTRICTS)[0];
  isNear: boolean;
  onInteract: () => void;
}) {
  return (
    <group position={[district.x, 0, district.z]} onClick={onInteract}>
      {/* Main Skyscraper Block */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[5, 8, 5]} />
        <meshStandardMaterial
          color={isNear ? district.color : '#18181b'}
          roughness={0.2}
          metalness={0.8}
          emissive={district.color}
          emissiveIntensity={isNear ? 0.6 : 0.15}
        />
      </mesh>

      {/* Glowing Rooftop Spire */}
      <mesh position={[0, 9.5, 0]}>
        <coneGeometry args={[1, 3, 4]} />
        <meshStandardMaterial color={district.color} emissive={district.color} emissiveIntensity={1} />
      </mesh>

      {/* Floating Hologram Label */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          position={[0, 12, 0]}
          fontSize={1.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {district.name}
        </Text>
        <Text
          position={[0, 10.8, 0]}
          fontSize={0.6}
          color={district.color}
          anchorX="center"
          anchorY="middle"
        >
          {district.category}
        </Text>
      </Float>

      {/* Waypoint Light Pillar */}
      <pointLight position={[0, 5, 0]} color={district.color} intensity={isNear ? 5 : 2} distance={15} />
    </group>
  );
}

// Nighttime City Ground Grid & Environment Props
function CityGrid() {
  return (
    <group>
      {/* Ground Floor Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#070709" roughness={0.9} metalness={0.2} />
      </mesh>

      {/* Grid Lines Visual */}
      <gridHelper args={[120, 40, '#6366f1', '#27272a']} position={[0, 0, 0]} />

      {/* Ambient Street Particle Lights */}
      {[-35, -15, 0, 15, 35].map((x) =>
        [-35, -15, 0, 15, 35].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.1, z]}>
            <cylinderGeometry args={[0.1, 0.1, 0.2, 8]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} />
          </mesh>
        ))
      )}
    </group>
  );
}

export const ExperienceWorld: React.FC = () => {
  const [playerPos, setPlayerPos] = useState({ x: 0, z: 0 });
  const [discoveredLocationIds, setDiscoveredLocationIds] = useState<string[]>([]);
  const [activeLocationId, setActiveLocationId] = useState<string | null>(null);
  const [selectedOverlayLocationId, setSelectedOverlayLocationId] = useState<string | null>(null);
  const [isFlowSyncCaseStudyOpen, setIsFlowSyncCaseStudyOpen] = useState(false);

  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [latestDiscovery, setLatestDiscovery] = useState<string | null>(null);
  const [isAiGuideOpen, setIsAiGuideOpen] = useState(false);
  const [soundMuted, setSoundMuted] = useState(true);

  // Keyboard Movement Handler (WASD / Arrows / E)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 1.2;
      setPlayerPos((prev) => {
        let newX = prev.x;
        let newZ = prev.z;

        if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') newZ -= step;
        if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') newZ += step;
        if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') newX -= step;
        if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') newX += step;

        // Clamp boundaries (-40 to 40)
        newX = Math.max(-38, Math.min(38, newX));
        newZ = Math.max(-38, Math.min(38, newZ));

        return { x: newX, z: newZ };
      });

      // Interact trigger on E or Space
      if ((e.key === 'e' || e.key === 'E' || e.key === ' ') && activeLocationId) {
        setSelectedOverlayLocationId(activeLocationId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLocationId]);

  // Proximity Detection Engine
  useEffect(() => {
    let nearest: (typeof DISTRICTS)[0] | null = null;
    let minDist = 7; // Proximity threshold radius

    DISTRICTS.forEach((d) => {
      const dx = d.x - playerPos.x;
      const dz = d.z - playerPos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < minDist) {
        nearest = d;
      }
    });

    if (nearest) {
      const loc = nearest as (typeof DISTRICTS)[0];
      setActiveLocationId(loc.id);

      // Check discovery
      if (!discoveredLocationIds.includes(loc.id)) {
        setDiscoveredLocationIds((prev) => [...prev, loc.id]);
        setLatestDiscovery(loc.name);

        // Complete mission
        setMissions((prevMissions) =>
          prevMissions.map((m) =>
            m.targetLocationId === loc.id ? { ...m, completed: true } : m
          )
        );
      }
    } else {
      setActiveLocationId(null);
    }
  }, [playerPos, discoveredLocationIds]);

  // Handle Mobile Controls Movement
  const handleMobileMove = (dir: 'up' | 'down' | 'left' | 'right') => {
    const step = 2.5;
    setPlayerPos((prev) => {
      let newX = prev.x;
      let newZ = prev.z;
      if (dir === 'up') newZ -= step;
      if (dir === 'down') newZ += step;
      if (dir === 'left') newX -= step;
      if (dir === 'right') newX += step;
      return { x: Math.max(-38, Math.min(38, newX)), z: Math.max(-38, Math.min(38, newZ)) };
    });
  };

  // Handle Teleport / Click from MiniMap
  const handleTeleportToLocation = (locId: string) => {
    const loc = DISTRICTS.find((d) => d.id === locId);
    if (loc) {
      setPlayerPos({ x: loc.x, z: loc.z + 4 });
      setSelectedOverlayLocationId(locId);
    }
  };

  const markers: LocationMarker[] = DISTRICTS.map((d) => ({
    id: d.id,
    name: d.name,
    category: d.category,
    x: d.x,
    z: d.z,
    discovered: discoveredLocationIds.includes(d.id),
  }));

  const activeLocation = DISTRICTS.find((d) => d.id === activeLocationId);

  return (
    <div className="relative w-full h-screen bg-[#070709] overflow-hidden select-none">
      
      {/* 3D Canvas Scene */}
      <Canvas
        camera={{ position: [playerPos.x, 18, playerPos.z + 24], fov: 45 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[20, 40, 20]} intensity={1.2} color="#818cf8" />
        <fog attach="fog" args={['#070709', 20, 75]} />

        {/* City Environment */}
        <CityGrid />

        {/* District Skyscraper Locations */}
        {DISTRICTS.map((d) => (
          <DistrictBuilding
            key={d.id}
            district={d}
            isNear={activeLocationId === d.id}
            onInteract={() => {
              setPlayerPos({ x: d.x, z: d.z + 4 });
              setSelectedOverlayLocationId(d.id);
            }}
          />
        ))}

        {/* Player Avatar */}
        <PlayerAvatar position={[playerPos.x, 0, playerPos.z]} />

        {/* Camera Orbit Control */}
        <OrbitControls
          target={[playerPos.x, 2, playerPos.z]}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>

      {/* Game HUD */}
      <HUD
        discoveredCount={discoveredLocationIds.length}
        totalLocations={DISTRICTS.length}
        onOpenAiGuide={() => setIsAiGuideOpen(true)}
        soundMuted={soundMuted}
        onToggleSound={() => setSoundMuted(!soundMuted)}
        activeLocationName={activeLocation?.name || null}
        onInteract={() => {
          if (activeLocationId) setSelectedOverlayLocationId(activeLocationId);
        }}
      />

      {/* MiniMap */}
      <MiniMap
        playerPos={playerPos}
        locations={markers}
        onSelectLocation={handleTeleportToLocation}
      />

      {/* Mission System */}
      <MissionSystem
        missions={missions}
        latestDiscoveryNotification={latestDiscovery}
        onClearNotification={() => setLatestDiscovery(null)}
      />

      {/* Mobile Touch Joystick */}
      <MobileControls onMove={handleMobileMove} />

      {/* In-Game Location Project Overlay */}
      <ProjectOverlay
        locationId={selectedOverlayLocationId}
        onClose={() => setSelectedOverlayLocationId(null)}
        onOpenFlowSyncCaseStudy={() => setIsFlowSyncCaseStudyOpen(true)}
      />

      {/* ABI AI Assistant */}
      <AbiAiGuide isOpen={isAiGuideOpen} onClose={() => setIsAiGuideOpen(false)} />

      {/* Flagship FlowSync Case Study Drawer */}
      <FlowSyncModal
        isOpen={isFlowSyncCaseStudyOpen}
        onClose={() => setIsFlowSyncCaseStudyOpen(false)}
      />

    </div>
  );
};

'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  ArrowLeft,
  Navigation,
  GitBranch,
  Volume2,
  VolumeX,
  FastForward,
  RefreshCw,
  Eye,
  Crosshair,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  Gauge,
  Sun,
  Sunset,
  Moon,
  CloudRain,
  Cloud,
  Globe,
  Rocket,
  MapPin,
  Camera,
} from 'lucide-react';
import * as THREE from 'three';
import { WORLD_DISTRICTS, WorldDistrict } from './WorldConfig';
import { usePerformanceQuality, usePerformanceTelemetry, PerformanceSelector } from '../PerformanceControl';
import { WorldViewMode, CityCameraPerspective } from './SpaceToCityCameraController';
import { EARTH_LOCATIONS, EarthLocation } from './RealisticEarth';
import { TimeOfDay, WeatherType } from './AtmosphericWeatherSystem';
import { urbanAudio } from './CityUrbanAudio';

interface WorldHUDProps {
  isIntroActive: boolean;
  onSkipIntro: () => void;
  onReplayIntro: () => void;
  discoveredDistricts: string[];
  nearestDistrict: WorldDistrict | null;
  onInteractDistrict: (districtId: string) => void;
  cameraMode: 'follow' | 'tactical';
  onToggleCameraMode: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
  onVirtualMove: (key: string, isDown: boolean) => void;
  activeInterior?: string | null;
  onExitInterior?: () => void;
  timeOfDay?: TimeOfDay;
  onToggleTimeOfDay?: () => void;
  selectedBuilding?: string | null;
  onSelectBuilding?: (building: any) => void;
  // Space to City Extensions
  viewMode?: WorldViewMode;
  onSetViewMode?: (mode: WorldViewMode) => void;
  targetLocation?: EarthLocation | null;
  onSelectLocation?: (loc: EarthLocation) => void;
  weather?: WeatherType;
  onToggleWeather?: () => void;
  cityPerspective?: CityCameraPerspective;
  onToggleCityPerspective?: () => void;
  transitionProgress?: number;
  transitionAltitude?: number;
}

// Zero-re-render Radar Player Marker (Updates directly via requestAnimationFrame & DOM style)
function RadarPlayerMarker({
  playerPosRef,
}: {
  playerPosRef: React.MutableRefObject<THREE.Vector3>;
}) {
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animId: number;
    const update = () => {
      if (markerRef.current && playerPosRef.current) {
        const px = playerPosRef.current.x;
        const pz = playerPosRef.current.z;
        const left = ((px + 48) / 96) * 100;
        const top = ((pz + 48) / 96) * 100;
        markerRef.current.style.left = `${left}%`;
        markerRef.current.style.top = `${top}%`;
      }
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [playerPosRef]);

  return (
    <div
      ref={markerRef}
      className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
      style={{ left: '50%', top: '50%' }}
    >
      <div className="w-full h-full rounded-full bg-cyan-400 border border-white shadow-lg shadow-cyan-400 animate-ping" />
      <div className="absolute inset-0.5 rounded-full bg-cyan-300" />
    </div>
  );
}

// Dynamic FPS Counter Badge
function FpsBadge() {
  const { fps } = usePerformanceTelemetry();
  return (
    <span className="font-mono text-zinc-400 font-semibold">
      {fps > 0 ? `${fps} FPS` : '60 FPS'}
    </span>
  );
}

export const WorldHUD: React.FC<WorldHUDProps> = ({
  isIntroActive,
  onSkipIntro,
  onReplayIntro,
  discoveredDistricts,
  nearestDistrict,
  onInteractDistrict,
  cameraMode,
  onToggleCameraMode,
  soundMuted,
  onToggleSound,
  playerPosRef,
  onVirtualMove,
  activeInterior,
  onExitInterior,
  timeOfDay = 'day',
  onToggleTimeOfDay,
  selectedBuilding,
  onSelectBuilding,
  viewMode = 'city',
  onSetViewMode,
  targetLocation,
  onSelectLocation,
  weather = 'clear',
  onToggleWeather,
  cityPerspective = 'aerial',
  onToggleCityPerspective,
  transitionProgress = 0,
  transitionAltitude = 0,
}) => {
  const { effectiveTier } = usePerformanceQuality();

  const navItems = [
    { id: 'hero', label: 'HQ' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Career' },
    { id: 'contact', label: 'Contact' },
  ];

  const isSpace = viewMode === 'space';
  const isTransitioning = viewMode === 'descending' || viewMode === 'ascending';

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 sm:p-5 font-mono select-none">
      
      {/* ======================================================== */}
      {/* 1. ATMOSPHERIC TRANSITION TELEMETRY HUD                 */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-cyan-950/20 backdrop-blur-[2px]"
          >
            {/* Speed Lines / Condensation Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(14,165,233,0.2)_80%,rgba(2,6,23,0.8)_100%)]" />

            <div className="relative z-10 flex flex-col items-center gap-3 p-6 rounded-3xl bg-zinc-950/85 border border-cyan-500/40 shadow-2xl backdrop-blur-xl text-center max-w-sm">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase">
                <Rocket className="w-4 h-4 animate-bounce" />
                <span>
                  {viewMode === 'descending' ? 'Orbital Insertion // Descending' : 'Orbital Ascent // Climbing'}
                </span>
              </div>

              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500"
                  style={{ width: `${Math.round(transitionProgress * 100)}%` }}
                />
              </div>

              <div className="flex justify-between w-full text-[11px] text-zinc-400 font-mono">
                <span>ALTITUDE: <strong>{Math.round(transitionAltitude * 100)} KM</strong></span>
                <span>TARGET: <strong className="text-cyan-300">{targetLocation?.name || 'Tech Metropolis'}</strong></span>
              </div>

              <p className="text-[10px] text-zinc-500 animate-pulse">
                {viewMode === 'descending'
                  ? 'Piercing cloud deck & streaming high-res 3D geometry...'
                  : 'Leaving troposphere & entering Earth orbital space...'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 2. CINEMATIC WELCOME MODAL                               */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isIntroActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-zinc-950/95 border border-cyan-500/30 shadow-[0_0_60px_rgba(0,240,255,0.15)] text-center space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase">
                <Globe className="w-3.5 h-3.5" />
                <span>PHOTOREALISTIC 3D UNIVERSE</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                PLANET EARTH &bull;{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  PORTFOLIO METROPOLIS
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-md mx-auto">
                Explore an authentic photorealistic Earth from orbit, zoom seamlessly into detailed 3D cities, and explore Abhishek&apos;s interactive portfolio headquarters.
              </p>

              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    onSkipIntro();
                    onSetViewMode?.('city');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xl shadow-cyan-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>EXPLORE 3D CITY</span>
                </button>
                <button
                  onClick={() => {
                    onSkipIntro();
                    onSetViewMode?.('space');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>VIEW PLANET EARTH (ORBIT)</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 3. TOP MISSION & TELEMETRY STRIP                         */}
      {/* ======================================================== */}
      {!isIntroActive && (
        <div className="space-y-2 w-full">
          <div className="pointer-events-auto flex items-center justify-between gap-3 w-full">
            
            {/* Top Left: Navigation & Mode Indicator */}
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950/85 hover:bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white text-xs backdrop-blur-md shadow-xl transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Classic Portfolio</span>
              </Link>

              {/* View Mode Toggle: Orbit vs Surface */}
              <button
                onClick={() => {
                  if (isSpace) {
                    onSetViewMode?.('descending');
                  } else {
                    onSetViewMode?.('ascending');
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95 ${
                  isSpace
                    ? 'bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border-purple-500/40 text-purple-200'
                    : 'bg-gradient-to-r from-cyan-900/80 to-blue-900/80 border-cyan-500/40 text-cyan-200'
                }`}
                title={isSpace ? 'Descend to Surface 3D City' : 'Ascend to Planet Earth Orbit'}
              >
                {isSpace ? (
                  <>
                    <Rocket className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span>FLY TO CITY</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5 text-purple-400" />
                    <span>ASCEND TO ORBIT</span>
                  </>
                )}
              </button>
            </div>

            {/* Top Center: City Building Fast-Nav (When in City Mode) */}
            {!isSpace && (
              <nav
                aria-label="Portfolio Sections Navigation"
                className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-zinc-950/85 border border-white/10 backdrop-blur-md shadow-xl"
              >
                {navItems.map((item) => {
                  const isActive = selectedBuilding === item.id;
                  return (
                    <button
                      key={item.label}
                      onClick={() => onSelectBuilding?.(item.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/25 font-bold'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            )}

            {/* Top Center: Earth City Destination Selector (When in Space Mode) */}
            {isSpace && (
              <div className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-950/85 border border-white/10 backdrop-blur-md shadow-xl">
                <span className="text-[10px] text-zinc-500 px-2 font-bold uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" /> LOCATIONS:
                </span>
                {EARTH_LOCATIONS.map((loc) => {
                  const isTarget = targetLocation?.id === loc.id;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => onSelectLocation?.(loc)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                        isTarget
                          ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {loc.name}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Top Right Controls Group */}
            <div className="flex items-center gap-2">
              {/* Day / Sunset / Night Lighting Toggle */}
              {onToggleTimeOfDay && (
                <button
                  onClick={onToggleTimeOfDay}
                  className="p-2 rounded-xl bg-zinc-950/85 hover:bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95"
                  title={`Lighting: ${timeOfDay.toUpperCase()} (Click to change)`}
                  aria-label="Toggle Lighting Time"
                >
                  {timeOfDay === 'day' && <Sun className="w-3.5 h-3.5 text-amber-400" />}
                  {timeOfDay === 'sunset' && <Sunset className="w-3.5 h-3.5 text-orange-400" />}
                  {timeOfDay === 'night' && <Moon className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              )}

              {/* Weather Toggle (Clear / Rain / Fog) */}
              {!isSpace && onToggleWeather && (
                <button
                  onClick={onToggleWeather}
                  className="p-2 rounded-xl bg-zinc-950/85 hover:bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95"
                  title={`Weather: ${weather.toUpperCase()} (Click to toggle)`}
                >
                  {weather === 'clear' && <Sun className="w-3.5 h-3.5 text-yellow-300" />}
                  {weather === 'rain' && <CloudRain className="w-3.5 h-3.5 text-cyan-400" />}
                  {weather === 'fog' && <Cloud className="w-3.5 h-3.5 text-slate-300" />}
                </button>
              )}

              {/* City Camera Perspective (Aerial / Street / Drone) */}
              {!isSpace && onToggleCityPerspective && (
                <button
                  onClick={onToggleCityPerspective}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-950/85 hover:bg-zinc-900 border border-white/10 text-xs text-zinc-300 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                  title="Switch Camera Perspective"
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline capitalize">{cityPerspective}</span>
                </button>
              )}

              {/* Visual Quality Selector */}
              <PerformanceSelector />

              {/* Urban Audio SFX Toggle */}
              <button
                onClick={() => {
                  urbanAudio.toggleMute();
                  onToggleSound();
                }}
                className="p-2 rounded-xl bg-zinc-950/85 hover:bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95"
                title={soundMuted ? 'Unmute Urban SFX & Footsteps' : 'Mute Urban SFX'}
                aria-label="Toggle Audio"
              >
                {soundMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                )}
              </button>

              {/* Replay Intro Button */}
              <button
                onClick={onReplayIntro}
                className="p-2 rounded-xl bg-zinc-950/85 hover:bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                title="Replay Cinematic Intro"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Accessible Mobile Scrolling Navigation Pills */}
          {!isSpace && (
            <nav
              aria-label="Mobile Portfolio Sections"
              className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none pointer-events-auto"
            >
              {navItems.map((item) => {
                const isActive = selectedBuilding === item.id;
                return (
                  <button
                    key={`m-${item.label}`}
                    onClick={() => onSelectBuilding?.(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex-shrink-0 px-3 py-1 rounded-xl text-[11px] font-semibold backdrop-blur-md transition-all ${
                      isActive
                        ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30'
                        : 'bg-zinc-950/85 border border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. CENTER PROXIMITY INTERACTION BANNER (CITY MODE)       */}
      {/* ======================================================== */}
      <AnimatePresence>
        {!isIntroActive && !isSpace && nearestDistrict && !activeInterior && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="pointer-events-auto self-center mb-6 max-w-md w-full"
          >
            <div className="rounded-2xl bg-zinc-950/90 border border-cyan-500/40 p-4 shadow-[0_15px_45px_rgba(0,240,255,0.25)] backdrop-blur-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${nearestDistrict.color}25`, border: `1px solid ${nearestDistrict.color}60` }}
                >
                  <Sparkles className="w-5 h-5" style={{ color: nearestDistrict.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400 tracking-wider uppercase font-semibold">
                      NEARBY DISTRICT
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-white/10 text-cyan-300">
                      {nearestDistrict.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {nearestDistrict.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => onInteractDistrict(nearestDistrict.id)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-1.5 flex-shrink-0"
              >
                <span>
                  {nearestDistrict.id === 'code-nexus' ||
                  nearestDistrict.id === 'echo-desktop-ai' ||
                  nearestDistrict.id === 'flowsync'
                    ? 'ENTER INTERIOR'
                    : nearestDistrict.isPortal
                    ? 'ENTER WARP'
                    : 'INSPECT'}
                </span>
                <span className="hidden sm:inline text-[10px] opacity-75">[E]</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 5. BOTTOM HUD BAR (RADAR MINIMAP & CONTROLS)             */}
      {/* ======================================================== */}
      {!isIntroActive && (
        <div className="pointer-events-auto flex items-end justify-between gap-4 w-full">
          
          {/* Bottom Left: Controls Legend */}
          <div className="hidden sm:flex flex-col gap-1 p-3 rounded-2xl bg-zinc-950/85 border border-white/10 backdrop-blur-md text-[10px] text-zinc-400 shadow-xl">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold mb-0.5">
              <Navigation className="w-3 h-3 text-cyan-400" />
              <span>{isSpace ? 'EARTH ORBIT CONTROLS' : 'AVATAR EXPLORER CONTROLS'}</span>
            </div>
            {isSpace ? (
              <>
                <div>[Left Drag] — Rotate Planet Earth</div>
                <div>[Right Drag / Scroll] — Zoom In / Out</div>
                <div>[Click City Beacon] — Fly Into 3D City</div>
              </>
            ) : (
              <>
                <div>[W, A, S, D] / [Arrows] — Walk</div>
                <div>[Click Ground] — Walk to Point</div>
                <div>[Shift] — Sprint Run</div>
                <div>[Mouse Drag] — Orbit Camera</div>
                <div>[E] or [Space] — Inspect Building</div>
              </>
            )}
          </div>

          {/* Mobile Virtual D-Pad (only in City mode on mobile/touch screens) */}
          {!isSpace && (
            <div className="sm:hidden grid grid-cols-3 gap-1 w-32 p-1.5 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md">
              <div />
              <button
                onPointerDown={() => onVirtualMove('ArrowUp', true)}
                onPointerUp={() => onVirtualMove('ArrowUp', false)}
                onPointerLeave={() => onVirtualMove('ArrowUp', false)}
                onPointerCancel={() => onVirtualMove('ArrowUp', false)}
                className="p-2.5 rounded-xl bg-zinc-900 active:bg-cyan-600 text-white flex items-center justify-center"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <div />
              <button
                onPointerDown={() => onVirtualMove('ArrowLeft', true)}
                onPointerUp={() => onVirtualMove('ArrowLeft', false)}
                onPointerLeave={() => onVirtualMove('ArrowLeft', false)}
                onPointerCancel={() => onVirtualMove('ArrowLeft', false)}
                className="p-2.5 rounded-xl bg-zinc-900 active:bg-cyan-600 text-white flex items-center justify-center"
              >
                <ArrowLeftIcon className="w-4 h-4" />
              </button>
              <button
                onPointerDown={() => onVirtualMove('ArrowDown', true)}
                onPointerUp={() => onVirtualMove('ArrowDown', false)}
                onPointerLeave={() => onVirtualMove('ArrowDown', false)}
                onPointerCancel={() => onVirtualMove('ArrowDown', false)}
                className="p-2.5 rounded-xl bg-zinc-900 active:bg-cyan-600 text-white flex items-center justify-center"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onPointerDown={() => onVirtualMove('ArrowRight', true)}
                onPointerUp={() => onVirtualMove('ArrowRight', false)}
                onPointerLeave={() => onVirtualMove('ArrowRight', false)}
                onPointerCancel={() => onVirtualMove('ArrowRight', false)}
                className="p-2.5 rounded-xl bg-zinc-900 active:bg-cyan-600 text-white flex items-center justify-center"
              >
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Bottom Right: Radar MiniMap in City Mode OR Planet Telemetry in Space Mode */}
          <div className="flex flex-col p-2.5 rounded-2xl bg-zinc-950/85 border border-white/10 backdrop-blur-md shadow-2xl w-44 h-44 sm:w-48 sm:h-48">
            <div className="flex items-center justify-between text-[10px] text-zinc-400 px-1 mb-1">
              <span className="flex items-center gap-1 text-cyan-400 font-bold">
                <Crosshair className="w-3 h-3 animate-spin" /> {isSpace ? 'GLOBAL GPS' : 'RADAR NAV'}
              </span>
              <span className="text-[9px] text-zinc-500 font-mono">
                {isSpace ? 'EARTH 1:1' : '6 DISTRICTS'}
              </span>
            </div>

            {/* Radar Viewport Grid */}
            <div className="relative flex-1 my-1 rounded-2xl bg-zinc-900/90 border border-white/5 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15),transparent_70%)] pointer-events-none" />

              {isSpace ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-zinc-400 text-[10px] space-y-1">
                  <Globe className="w-6 h-6 text-cyan-400 animate-pulse" />
                  <div className="text-white font-bold">ORBITAL VIEW</div>
                  <div className="text-[9px] text-zinc-500">6 Global Beacons Active</div>
                </div>
              ) : (
                <>
                  {/* Player Marker */}
                  <RadarPlayerMarker playerPosRef={playerPosRef} />

                  {/* 6 District Markers */}
                  {WORLD_DISTRICTS.map((d) => {
                    const leftPercent = ((d.x + 48) / 96) * 100;
                    const topPercent = ((d.z + 48) / 96) * 100;
                    const isDiscovered = discoveredDistricts.includes(d.id);

                    return (
                      <button
                        key={d.id}
                        onClick={() => onInteractDistrict(d.id)}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-150 z-10 ${
                          d.isPortal
                            ? 'w-3.5 h-3.5 bg-purple-400 border border-white shadow-md shadow-purple-400'
                            : isDiscovered
                            ? 'w-2.5 h-2.5 bg-emerald-400 border border-white'
                            : 'w-2 h-2 bg-indigo-400 border border-zinc-700'
                        }`}
                        style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                        title={`${d.name} (${d.category})`}
                      />
                    );
                  })}
                </>
              )}
            </div>

            <div className="flex items-center justify-between text-[9px] text-zinc-400 px-1">
              <span>TIER: <strong className="text-cyan-300">{effectiveTier.toUpperCase()}</strong></span>
              <FpsBadge />
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

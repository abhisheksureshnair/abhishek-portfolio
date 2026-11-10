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
  Moon,
} from 'lucide-react';
import * as THREE from 'three';
import { WORLD_DISTRICTS, WorldDistrict } from './WorldConfig';
import { usePerformanceQuality, usePerformanceTelemetry, PerformanceSelector } from '../PerformanceControl';

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
  timeOfDay?: 'day' | 'night';
  onToggleTimeOfDay?: () => void;
  selectedBuilding?: string | null;
  onSelectBuilding?: (building: any) => void;
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
      className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 border border-white shadow-[0_0_10px_#22d3ee] z-20 pointer-events-none"
      style={{ left: '50%', top: '58%' }}
    />
  );
}

function FpsBadge() {
  const { fps } = usePerformanceTelemetry();
  return <span className="text-emerald-400 font-bold">{fps > 0 ? `${fps} FPS` : '60 FPS'}</span>;
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
  selectedBuilding = null,
  onSelectBuilding,
}) => {
  const { effectiveTier } = usePerformanceQuality();

  const navItems = [
    { id: null, label: 'City View' },
    { id: 'hero', label: 'Hero HQ' },
    { id: 'about', label: 'About Me' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-3 sm:p-5 font-mono select-none">
      
      {/* ======================================================== */}
      {/* 1. CINEMATIC INTRO TITLE & SKIP OVERLAY                  */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isIntroActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-center space-y-4 max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>3D METROPOLIS SIMULATION INITIALIZING</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-[0_10px_35px_rgba(0,240,255,0.4)]">
                ABHISHEK S NAIR // <br />
                <span className="bg-gradient-to-r from-cyan-300 via-white to-indigo-300 bg-clip-text text-transparent">
                  PORTFOLIO METROPOLIS
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-md mx-auto">
                Explore an authentic 3D interactive developer city. Walk through boulevards, examine 6 portfolio headquarters, and interact with live projects and experience.
              </p>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={onSkipIntro}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xl shadow-cyan-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <FastForward className="w-4 h-4" />
                  <span>EXPLORE 3D CITY</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 2. TOP MISSION / NAVIGATION STRIP                        */}
      {/* ======================================================== */}
      {!isIntroActive && (
        <div className="space-y-2 w-full">
          <div className="pointer-events-auto flex items-center justify-between gap-3 w-full">
            {/* Top Left Navigation Buttons */}
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950/85 hover:bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white text-xs backdrop-blur-md shadow-xl transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Classic Portfolio</span>
              </Link>

              <Link
                href="/github-universe"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 text-xs backdrop-blur-md shadow-xl shadow-indigo-500/10 transition-all"
              >
                <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                <span>GitHub Nexus</span>
              </Link>
            </div>

            {/* Top Center: Accessible Navigation Bar (Desktop & Tablet) */}
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

            {/* Top Right Controls Group */}
            <div className="flex items-center gap-2">
              {/* Day / Night Lighting Toggle */}
              {onToggleTimeOfDay && (
                <button
                  onClick={onToggleTimeOfDay}
                  className="p-2 rounded-xl bg-zinc-950/85 hover:bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95"
                  title={timeOfDay === 'night' ? 'Switch to Daylight' : 'Switch to Night Lights'}
                  aria-label={timeOfDay === 'night' ? 'Switch to Daylight' : 'Switch to Night Lights'}
                >
                  {timeOfDay === 'night' ? (
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                </button>
              )}

              {/* Visual Quality / Adaptive Graphics Tier Selector */}
              <PerformanceSelector />

              {/* Camera View Mode Switcher */}
              <button
                onClick={onToggleCameraMode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950/85 hover:bg-zinc-900 border border-white/10 text-xs text-zinc-300 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                title="Switch Camera Mode"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">
                  {cameraMode === 'follow' ? 'Follow Avatar' : 'Free Camera'}
                </span>
              </button>

              {/* Replay Intro Button */}
              <button
                onClick={onReplayIntro}
                className="p-2 rounded-xl bg-zinc-950/85 hover:bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                title="Replay Cinematic Intro"
                aria-label="Replay Cinematic Intro"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Accessible Mobile Scrolling Navigation Pills */}
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
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. CENTER PROXIMITY INTERACTION BANNER                   */}
      {/* ======================================================== */}
      <AnimatePresence>
        {!isIntroActive && nearestDistrict && !activeInterior && (
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
      {/* 4. BOTTOM HUD BAR (RADAR MINIMAP & CONTROLS)             */}
      {/* ======================================================== */}
      {!isIntroActive && (
        <div className="pointer-events-auto flex items-end justify-between gap-4 w-full">
          
          {/* Bottom Left: Controls Legend */}
          <div className="hidden sm:flex flex-col gap-1 p-3 rounded-2xl bg-zinc-950/85 border border-white/10 backdrop-blur-md text-[10px] text-zinc-400 shadow-xl">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold mb-0.5">
              <Navigation className="w-3 h-3 text-cyan-400" />
              <span>AVATAR EXPLORER CONTROLS</span>
            </div>
            <div>[W, A, S, D] / [Arrows] — Walk</div>
            <div>[Click / Tap Ground] — Walk to Point</div>
            <div>[Shift] — Sprint Run</div>
            <div>[Mouse Drag] — Orbit Camera</div>
            <div>[E] or [Space] — Inspect Building</div>
          </div>

          {/* Mobile Virtual D-Pad (only visible on mobile/touch screens) */}
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

          {/* Bottom Right: Radar MiniMap (Zero-Rerender via playerPosRef) */}
          <div className="flex flex-col p-2.5 rounded-2xl bg-zinc-950/85 border border-white/10 backdrop-blur-md shadow-2xl w-44 h-44 sm:w-48 sm:h-48">
            <div className="flex items-center justify-between text-[10px] text-zinc-400 px-1 mb-1">
              <span className="flex items-center gap-1 text-cyan-400 font-bold">
                <Crosshair className="w-3 h-3 animate-spin" /> RADAR NAV
              </span>
              <span className="text-[9px] text-zinc-500 font-mono">9 DISTRICTS</span>
            </div>

            {/* Radar Viewport Grid */}
            <div className="relative flex-1 my-1 rounded-2xl bg-zinc-900/90 border border-white/5 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15),transparent_70%)] pointer-events-none" />

              {/* Zero-React-Rerender Player Marker */}
              <RadarPlayerMarker playerPosRef={playerPosRef} />

              {/* 9 District Markers */}
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

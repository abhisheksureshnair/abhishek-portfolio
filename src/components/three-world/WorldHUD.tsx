'use client';

import React from 'react';
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
} from 'lucide-react';
import { WORLD_DISTRICTS, WorldDistrict } from './WorldConfig';

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
  playerPos: { x: number; z: number };
  onVirtualMove: (key: string, isDown: boolean) => void;
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
  playerPos,
  onVirtualMove,
}) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-3 sm:p-6 font-mono select-none">
      
      {/* ======================================================== */}
      {/* 1. CINEMATIC INTRO TITLE & SKIP OVERLAY                  */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isIntroActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-t from-black/80 via-transparent to-black/80 pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-center space-y-4 max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>3D SIMULATION INITIALIZING</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-[0_10px_35px_rgba(99,102,241,0.5)]">
                ABHISHEK // <br />
                <span className="bg-gradient-to-r from-indigo-300 via-white to-cyan-300 bg-clip-text text-transparent">
                  DEVELOPER UNIVERSE
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-md mx-auto">
                Explore 9 interactive futuristic engineering districts. Uncover production telemetry, full-stack systems, mobile apps, and the central GitHub Code Nexus.
              </p>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={onSkipIntro}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-bold shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <FastForward className="w-4 h-4" />
                  <span>START EXPLORATION</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 2. TOP GLOBAL HUD BAR                                    */}
      {/* ======================================================== */}
      {!isIntroActive && (
        <div className="pointer-events-auto flex items-center justify-between w-full">
          {/* Top Left Branding & Mission Tracker */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950/85 hover:bg-zinc-900 border border-white/10 text-zinc-300 text-xs backdrop-blur-md shadow-xl transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Classic Portfolio</span>
            </Link>

            <Link
              href="/github-universe"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 text-xs backdrop-blur-md shadow-xl shadow-indigo-500/10 transition-all"
            >
              <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">GitHub Nexus</span>
            </Link>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950/85 border border-white/10 text-xs text-zinc-400 backdrop-blur-md">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                Discovered: <strong className="text-white">{discoveredDistricts.length}</strong> / {WORLD_DISTRICTS.length} Districts
              </span>
            </div>
          </div>

          {/* Top Right Controls Group */}
          <div className="flex items-center gap-2">
            {/* Camera View Mode Switcher */}
            <button
              onClick={onToggleCameraMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950/85 hover:bg-zinc-900 border border-white/10 text-xs text-zinc-300 backdrop-blur-md transition-all"
              title="Switch Camera Mode"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">
                {cameraMode === 'follow' ? 'Third-Person' : 'Tactical Free'}
              </span>
            </button>

            {/* Replay Intro Button */}
            <button
              onClick={onReplayIntro}
              className="p-2 rounded-xl bg-zinc-950/85 hover:bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white backdrop-blur-md transition-all"
              title="Replay Cinematic Intro"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={onToggleSound}
              className="p-2 rounded-xl bg-zinc-950/85 hover:bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white backdrop-blur-md transition-all"
              title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-400" />}
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. CENTER PROXIMITY INTERACTION BANNER                   */}
      {/* ======================================================== */}
      <AnimatePresence>
        {!isIntroActive && nearestDistrict && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="pointer-events-auto self-center mb-6 max-w-md w-full"
          >
            <div
              className={`p-4 rounded-2xl backdrop-blur-xl border-2 shadow-2xl flex items-center justify-between gap-4 ${
                nearestDistrict.isPortal
                  ? 'bg-purple-950/95 border-purple-400 shadow-[0_0_40px_rgba(168,85,247,0.4)]'
                  : 'bg-zinc-950/95 border-indigo-500 shadow-[0_0_35px_rgba(99,102,241,0.35)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`px-2.5 py-1.5 rounded-lg text-black font-black text-xs uppercase animate-pulse ${
                    nearestDistrict.isPortal ? 'bg-purple-400' : 'bg-indigo-400'
                  }`}
                >
                  PRESS E
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-wider">
                    {nearestDistrict.isPortal ? 'Portal Hyper-Jump' : 'Explore Landmark'}
                  </div>
                  <div className="text-sm font-extrabold text-white">
                    {nearestDistrict.name}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onInteractDistrict(nearestDistrict.id)}
                className={`px-4 py-2 rounded-xl text-black font-bold text-xs uppercase transition-all hover:scale-105 active:scale-95 ${
                  nearestDistrict.isPortal
                    ? 'bg-gradient-to-r from-purple-400 to-indigo-300'
                    : 'bg-white hover:bg-zinc-100'
                }`}
              >
                {nearestDistrict.isPortal ? 'ENTER PORTAL' : 'VIEW DETAILS'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 4. BOTTOM BAR: RADAR MINIMAP & CONTROLS HUD             */}
      {/* ======================================================== */}
      {!isIntroActive && (
        <div className="pointer-events-auto flex items-end justify-between w-full">
          
          {/* Controls Guide (Desktop) or Mobile D-Pad */}
          <div className="flex flex-col gap-2">
            {/* Desktop Keyboard Legend */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-zinc-950/85 border border-white/10 text-[11px] text-zinc-400 backdrop-blur-md">
              <span><strong className="text-white">WASD / ARROWS</strong> : Move</span>
              <span>•</span>
              <span><strong className="text-white">MOUSE DRAG</strong> : Orbit</span>
              <span>•</span>
              <span><strong className="text-white">E / CLICK</strong> : Inspect</span>
            </div>

            {/* Mobile Touch On-Screen D-Pad (Visible on small screens) */}
            <div className="flex sm:hidden flex-col items-center gap-1 p-2 rounded-2xl bg-zinc-950/90 border border-white/10 backdrop-blur-xl">
              <button
                onTouchStart={() => onVirtualMove('w', true)}
                onTouchEnd={() => onVirtualMove('w', false)}
                onMouseDown={() => onVirtualMove('w', true)}
                onMouseUp={() => onVirtualMove('w', false)}
                className="w-10 h-10 rounded-xl bg-zinc-800 active:bg-indigo-600 flex items-center justify-center text-white"
                aria-label="Move Up"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1">
                <button
                  onTouchStart={() => onVirtualMove('a', true)}
                  onTouchEnd={() => onVirtualMove('a', false)}
                  onMouseDown={() => onVirtualMove('a', true)}
                  onMouseUp={() => onVirtualMove('a', false)}
                  className="w-10 h-10 rounded-xl bg-zinc-800 active:bg-indigo-600 flex items-center justify-center text-white"
                  aria-label="Move Left"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <button
                  onTouchStart={() => onVirtualMove('s', true)}
                  onTouchEnd={() => onVirtualMove('s', false)}
                  onMouseDown={() => onVirtualMove('s', true)}
                  onMouseUp={() => onVirtualMove('s', false)}
                  className="w-10 h-10 rounded-xl bg-zinc-800 active:bg-indigo-600 flex items-center justify-center text-white"
                  aria-label="Move Down"
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
                <button
                  onTouchStart={() => onVirtualMove('d', true)}
                  onTouchEnd={() => onVirtualMove('d', false)}
                  onMouseDown={() => onVirtualMove('d', true)}
                  onMouseUp={() => onVirtualMove('d', false)}
                  className="w-10 h-10 rounded-xl bg-zinc-800 active:bg-indigo-600 flex items-center justify-center text-white"
                  aria-label="Move Right"
                >
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Radar MiniMap Viewport */}
          <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-zinc-950/90 border-2 border-white/10 p-2.5 backdrop-blur-xl shadow-2xl flex flex-col justify-between relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between text-[10px] text-zinc-400 border-b border-white/10 pb-1 z-10">
              <span className="flex items-center gap-1 text-cyan-400 font-bold">
                <Crosshair className="w-3 h-3 animate-spin" /> RADAR NAV
              </span>
              <span className="text-[9px] text-zinc-500 font-mono">9 DISTRICTS</span>
            </div>

            {/* Radar Viewport Grid */}
            <div className="relative flex-1 my-1 rounded-2xl bg-zinc-900/90 border border-white/5 overflow-hidden">
              {/* Radar Sweep Beam */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15),transparent_70%)] pointer-events-none" />

              {/* Player Position Pulse Marker */}
              <div
                className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 border border-white shadow-[0_0_10px_#22d3ee] z-20"
                style={{
                  left: `${((playerPos.x + 48) / 96) * 100}%`,
                  top: `${((playerPos.z + 48) / 96) * 100}%`,
                }}
              />

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

            {/* Legend */}
            <div className="flex items-center justify-between text-[9px] text-zinc-400 pt-1 border-t border-white/10 z-10">
              <span className="text-cyan-400">● Player</span>
              <span className="text-purple-400">● Nexus</span>
              <span className="text-emerald-400">● Discovered</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};


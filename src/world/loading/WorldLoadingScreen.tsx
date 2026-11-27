'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useProgress } from '@react-three/drei';
import { useWorldStore, worldStore } from '../stores/worldStore';
import { Compass, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface WorldLoadingScreenProps {
  onSwitchToStory?: () => void;
  onEnterWorldOverride?: () => void;
}

export const WorldLoadingScreen: React.FC<WorldLoadingScreenProps> = ({
  onSwitchToStory,
  onEnterWorldOverride,
}) => {
  const { active, progress, errors, item, loaded, total } = useProgress();
  const isSceneReady = useWorldStore((s) => s.isSceneReady);
  const isAvatarReady = useWorldStore((s) => s.isAvatarReady);

  const [displayProgress, setDisplayProgress] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [hasFinished, setHasFinished] = useState<boolean>(false);
  const [forceEnter, setForceEnter] = useState<boolean>(false);

  // Smoothly interpolate displayed progress toward target progress
  useEffect(() => {
    const target = active ? Math.min(95, Math.max(progress, 15)) : isSceneReady && isAvatarReady ? 100 : 90;
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < target) {
          const step = Math.max(1, (target - prev) * 0.2);
          return Math.min(target, prev + step);
        }
        return prev;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [active, progress, isSceneReady, isAvatarReady]);

  // Determine readiness: asset loading done, scene & avatar initialized, progress reached 100%
  const isFullyReady = (isSceneReady && isAvatarReady && !active && displayProgress >= 99) || forceEnter;

  useEffect(() => {
    if (isFullyReady && !isFadingOut && !hasFinished) {
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
        worldStore.getState().setIsWorldRevealed(true);
      }, 50);
      const finishTimer = setTimeout(() => {
        setHasFinished(true);
      }, 750); // 700ms smooth fade transition
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(finishTimer);
      };
    }
  }, [isFullyReady, isFadingOut, hasFinished]);

  // Clean status label based on what is currently loading
  const currentStatus = useMemo(() => {
    if (errors.length > 0) return 'Notice: Some optional assets had load warnings';
    if (isFullyReady) return 'Metropolis Simulation Ready';
    if (!isSceneReady && displayProgress >= 90) return 'Finalizing Lighting & Shadow Buffers...';
    if (!item) return 'Initializing 3D Universe Assets...';
    if (item.includes('Soldier.glb')) return 'Streaming Avatar Skeletal Mesh...';
    if (item.includes('.jpg') || item.includes('.png') || item.includes('.webp'))
      return 'Streaming Architectural Textures...';
    if (item.includes('.glb') || item.includes('.gltf')) return 'Loading District Geometries...';
    return 'Compiling Metropolis Shaders...';
  }, [item, errors.length, isFullyReady, isSceneReady, displayProgress]);

  if (hasFinished) return null;

  return (
    <div
      aria-label="3D World Loading Screen"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030509] select-none transition-opacity duration-700 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      {/* Background Ambient Cyber Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.12)_0%,rgba(3,5,9,0.95)_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Loader Card */}
      <div className="relative z-10 w-full max-w-md px-6 sm:px-8 py-8 mx-4 flex flex-col items-center text-center">
        {/* Animated Brand Emblem */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-md">
            {isFullyReady ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-in zoom-in-75 duration-300" />
            ) : (
              <Compass className="w-8 h-8 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
            )}
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 opacity-20 blur-md -z-10" />
        </div>

        {/* Title & District Details */}
        <div className="space-y-1.5 mb-6">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-cyan-400">
              ABHISHEK S NAIR // DEVELOPER UNIVERSE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono">
            Loading 3D Metropolis
          </h2>
          <p className="text-xs text-zinc-400 max-w-xs font-sans">
            Initializing 9 districts, interactive landmark buildings, autonomous traffic, and dynamic lighting.
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full space-y-2 mb-4">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-zinc-400 truncate max-w-[260px] text-left">{currentStatus}</span>
            <span className="text-cyan-300 font-bold ml-2 shrink-0">
              {Math.round(displayProgress)}%
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-zinc-900 border border-white/10 p-0.5 overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-400 transition-all duration-150 ease-out shadow-[0_0_12px_rgba(6,182,212,0.6)]"
              style={{ width: `${Math.max(4, displayProgress)}%` }}
            />
          </div>

          {total > 0 && (
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
              <span>Assets Cached & Streamed</span>
              <span>
                {loaded} / {total} files
              </span>
            </div>
          )}
        </div>

        {/* Error / Fallback Recovery Controls */}
        {errors.length > 0 && (
          <div className="w-full mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left text-xs font-mono text-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-bold">Minor asset delay detected</p>
              <p className="text-[11px] text-zinc-400">
                The world simulation can continue with procedural fallbacks.
              </p>
            </div>
          </div>
        )}

        {/* Override / Navigation Buttons */}
        <div className="flex items-center gap-3 mt-2">
          {(!isFullyReady || errors.length > 0) && (
            <button
              onClick={() => {
                setForceEnter(true);
                worldStore.getState().setIsWorldRevealed(true);
                onEnterWorldOverride?.();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/15 text-zinc-300 hover:text-white text-xs font-mono transition-all hover:scale-105 active:scale-95"
            >
              Enter Immediately
            </button>
          )}

          {onSwitchToStory && (
            <button
              onClick={onSwitchToStory}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:text-white text-xs font-mono transition-all hover:scale-105 active:scale-95"
            >
              <span>Story Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Lightweight Static Pre-Hydration Fallback for React Suspense
 */
export const WorldLoadingFallback: React.FC = () => {
  return (
    <div className="relative w-full h-screen bg-[#030509] flex flex-col items-center justify-center select-none overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0%,rgba(3,5,9,0.98)_70%)] pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div className="w-14 h-14 rounded-2xl bg-cyan-950/40 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.25)] mb-4">
          <Compass className="w-7 h-7 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
            ABHISHEK S NAIR // DEVELOPER UNIVERSE
          </span>
        </div>
        <h2 className="text-lg font-mono font-bold text-white mb-2">
          Loading 3D Simulation...
        </h2>
        <div className="w-48 h-1.5 rounded-full bg-zinc-900 border border-white/10 overflow-hidden">
          <div className="h-full w-1/3 rounded-full bg-cyan-400 animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};

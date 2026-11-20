'use client';

import React from 'react';
import { useWorldStore } from '../stores/worldStore';
import { MousePointer, Eye, Move, Zap } from 'lucide-react';

export const PointerLockOverlay: React.FC = () => {
  const cameraMode = useWorldStore((s) => s.cameraMode);
  const isInteracting = useWorldStore((s) => s.isInteracting);
  const isPointerLocked = useWorldStore((s) => s.isPointerLocked);

  // Only active in avatar third-person mode when modal overlays are closed
  if (cameraMode !== 'avatar' || isInteracting) return null;

  const handleRequestLock = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.requestPointerLock?.();
    }
  };

  return (
    <>
      {/* 1. Pointer Lock Resume / Activate Prompt (shown when cursor is free) */}
      {!isPointerLocked && (
        <div className="fixed top-24 sm:top-28 left-1/2 -translate-x-1/2 z-30 pointer-events-auto select-none animate-in fade-in slide-in-from-top-4 duration-200 max-w-[calc(100vw-32px)]">
          <button
            onClick={handleRequestLock}
            className="group flex items-center gap-3.5 px-5 py-2 rounded-full bg-zinc-950/85 hover:bg-zinc-900/95 backdrop-blur-xl border border-cyan-500/40 hover:border-cyan-400 text-white shadow-2xl shadow-cyan-950/50 transition-all duration-200 hover:scale-[1.02] active:scale-98 cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/30 transition-colors">
              <Eye className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            </div>

            <div className="flex items-center gap-2 text-xs font-mono tracking-wide">
              <span className="font-bold text-cyan-300 uppercase">Click to Look & Control</span>
              <span className="text-zinc-500">|</span>
              <span className="text-zinc-400 flex items-center gap-1.5">
                <kbd className="bg-zinc-800 text-zinc-300 px-1 py-0.5 rounded text-[10px] font-sans border border-zinc-700">W,A,S,D</kbd> Move
              </span>
              <span className="text-zinc-500">|</span>
              <span className="text-zinc-400 flex items-center gap-1.5">
                <kbd className="bg-zinc-800 text-zinc-300 px-1 py-0.5 rounded text-[10px] font-sans border border-zinc-700">Shift</kbd> Sprint
              </span>
              <span className="text-zinc-500">|</span>
              <span className="text-zinc-400 flex items-center gap-1.5">
                <kbd className="bg-zinc-800 text-zinc-300 px-1 py-0.5 rounded text-[10px] font-sans border border-zinc-700">Esc</kbd> Pause
              </span>
            </div>
          </button>
        </div>
      )}

      {/* 2. Active Pointer Lock Subtle HUD Status (shown when cursor is locked) */}
      {isPointerLocked && (
        <>
          {/* Minimal Subtle Reticle in Screen Center */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none select-none opacity-40">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
          </div>

          {/* Escape Prompt in Top Bar */}
          <div className="fixed top-20 right-6 z-30 pointer-events-none select-none opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950/70 backdrop-blur-md border border-zinc-800 text-[11px] font-mono text-zinc-400">
              <kbd className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-[10px] border border-zinc-700">ESC</kbd>
              <span>Unlock Cursor</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

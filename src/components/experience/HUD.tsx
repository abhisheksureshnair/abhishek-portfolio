'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Compass, Bot, Volume2, VolumeX, Navigation } from 'lucide-react';

interface HUDProps {
  discoveredCount: number;
  totalLocations: number;
  onOpenAiGuide: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  activeLocationName?: string | null;
  onInteract?: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  discoveredCount,
  totalLocations,
  onOpenAiGuide,
  soundMuted,
  onToggleSound,
  activeLocationName,
  onInteract,
}) => {
  const router = useRouter();

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex flex-col justify-between p-4 sm:p-6 font-mono selection:bg-none">
      
      {/* Top Bar */}
      <div className="pointer-events-auto flex items-center justify-between w-full">
        
        {/* Top Left Branding */}
        <div className="flex items-center gap-3 bg-zinc-950/80 backdrop-blur-md border border-zinc-800/80 px-4 py-2 rounded-2xl shadow-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <div>
            <div className="text-xs font-extrabold text-white tracking-tight">ABHISHEK S NAIR</div>
            <div className="text-[10px] text-indigo-400">EXPERIENCE MODE v2.0</div>
          </div>
        </div>

        {/* Top Right Action Group */}
        <div className="flex items-center gap-3">
          
          {/* AI Guide Trigger */}
          <button
            onClick={onOpenAiGuide}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-indigo-950/80 hover:bg-indigo-900/90 border border-indigo-500/40 text-indigo-300 text-xs font-semibold backdrop-blur-md transition-all shadow-lg shadow-indigo-500/10"
            title="Open ABI AI Guide"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">ABI AI GUIDE</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2.5 rounded-2xl bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white backdrop-blur-md transition-all"
            title={soundMuted ? 'Enable Ambient Audio' : 'Mute Audio'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Persistent Exit to Professional Mode Button */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-indigo-500/50 text-zinc-200 text-xs font-bold backdrop-blur-md transition-all shadow-xl"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>PROFESSIONAL MODE</span>
          </button>

        </div>
      </div>

      {/* Center Interaction Prompt (When near a building location) */}
      {activeLocationName && (
        <div className="pointer-events-auto self-center bg-indigo-950/90 border-2 border-indigo-500 text-white px-6 py-3.5 rounded-2xl backdrop-blur-xl shadow-2xl animate-bounce flex items-center gap-4">
          <div className="px-2.5 py-1 rounded bg-indigo-500 text-black font-extrabold text-xs">
            PRESS E
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-300">Approach Location</div>
            <div className="text-sm font-extrabold text-white">{activeLocationName}</div>
          </div>
          {onInteract && (
            <button
              onClick={onInteract}
              className="ml-2 px-4 py-1.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors"
            >
              EXPLORE
            </button>
          )}
        </div>
      )}

      {/* Bottom Bar Controls Guide & Discovery Status */}
      <div className="pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
        
        {/* Controls Indicator */}
        <div className="hidden sm:flex items-center gap-4 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 px-4 py-2 rounded-2xl text-[11px] text-zinc-400">
          <span><strong className="text-zinc-200">WASD / ARROWS</strong> : Move</span>
          <span>•</span>
          <span><strong className="text-zinc-200">MOUSE</strong> : Look</span>
          <span>•</span>
          <span><strong className="text-zinc-200">E / CLICK</strong> : Interact</span>
        </div>

        {/* Discovery Progress Tracker */}
        <div className="flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 px-4 py-2 rounded-2xl text-xs text-zinc-300">
          <Compass className="w-4 h-4 text-indigo-400" />
          <span>Discovered: <strong className="text-indigo-400">{discoveredCount} / {totalLocations}</strong> Locations</span>
        </div>

      </div>

    </div>
  );
};

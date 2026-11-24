'use client';

import React from 'react';
import { useWorldStore, worldStore } from '../stores/worldStore';
import { Building2, ArrowRight } from 'lucide-react';

interface AvatarInteractionPromptProps {
  onInteract?: (landmarkId: string) => void;
}

export const AvatarInteractionPrompt: React.FC<AvatarInteractionPromptProps> = ({
  onInteract,
}) => {
  const prompt = useWorldStore((s) => s.activeLandmarkPrompt);
  const cameraMode = useWorldStore((s) => s.cameraMode);
  const isInteracting = useWorldStore((s) => s.isInteracting);

  // Hide prompt if no nearby entrance, not in avatar mode, or already inside a building modal
  if (!prompt || cameraMode !== 'avatar' || isInteracting) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 pointer-events-auto select-none animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-zinc-950/95 backdrop-blur-xl border border-cyan-400/50 rounded-2xl px-5 py-3 shadow-2xl shadow-cyan-950/60 flex items-center gap-4 text-white">
        {/* Landmark Icon Badge */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/25 to-blue-600/35 border border-cyan-400/50 flex items-center justify-center shrink-0 shadow-inner">
          <Building2 className="w-5 h-5 text-cyan-300 animate-pulse" />
        </div>

        {/* Building Title & Subtitle */}
        <div className="flex flex-col pr-1">
          <span className="text-sm font-extrabold text-white tracking-wider font-mono">
            {prompt.name}
          </span>
          <span className="text-[11px] text-zinc-400 font-sans line-clamp-1">
            {prompt.subtitle}
          </span>
        </div>

        {/* Enter Building Action Button ([E] ENTER — BUILDING NAME per Requirement 6) */}
        <button
          onClick={() => {
            worldStore.getState().setIsInteracting(true);
            if (onInteract) {
              onInteract(prompt.id);
            }
          }}
          className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-xs tracking-wider transition-all duration-150 shadow-lg shadow-cyan-500/30 active:scale-95 cursor-pointer shrink-0 font-mono"
        >
          <kbd className="bg-black/25 text-black px-1.5 py-0.5 rounded text-[11px] font-black border border-black/10">
            E
          </kbd>
          <span className="truncate max-w-[140px] sm:max-w-[200px]">ENTER — {prompt.name}</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>
    </div>
  );
};

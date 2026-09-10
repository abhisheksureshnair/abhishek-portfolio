'use client';

import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Compass } from 'lucide-react';

interface MobileControlsProps {
  onMove: (dir: 'up' | 'down' | 'left' | 'right') => void;
  onInteract?: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ onMove, onInteract }) => {
  return (
    <div className="pointer-events-auto fixed bottom-6 left-6 z-40 block md:hidden">
      <div className="flex flex-col items-center gap-1.5 p-3 rounded-3xl bg-zinc-950/90 border border-zinc-800 backdrop-blur-xl shadow-2xl">
        <button
          onClick={() => onMove('up')}
          className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white active:bg-indigo-600 transition-colors"
          aria-label="Move Forward"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onMove('left')}
            className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white active:bg-indigo-600 transition-colors"
            aria-label="Move Left"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Compass className="w-4 h-4 animate-spin" />
          </div>
          <button
            onClick={() => onMove('right')}
            className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white active:bg-indigo-600 transition-colors"
            aria-label="Move Right"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => onMove('down')}
          className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white active:bg-indigo-600 transition-colors"
          aria-label="Move Backward"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

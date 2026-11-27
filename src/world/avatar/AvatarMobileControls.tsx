'use client';

import React, { useState, useEffect } from 'react';
import { useWorldStore } from '../stores/worldStore';
import { Zap, Hand } from 'lucide-react';

interface AvatarMobileControlsProps {
  onInteract?: (landmarkId: string) => void;
}

export const AvatarMobileControls: React.FC<AvatarMobileControlsProps> = ({
  onInteract,
}) => {
  const cameraMode = useWorldStore((s) => s.cameraMode);
  const prompt = useWorldStore((s) => s.activeLandmarkPrompt);
  const isAvatarControlsEnabled = useWorldStore((s) => s.isAvatarControlsEnabled);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [isSprinting, setIsSprinting] = useState<boolean>(false);

  useEffect(() => {
    const checkTouch = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(hasTouch && window.innerWidth < 1024);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  if (cameraMode !== 'avatar' || !isTouchDevice || !isAvatarControlsEnabled) return null;

  const simulateKey = (key: string, isDown: boolean) => {
    const eventType = isDown ? 'keydown' : 'keyup';
    window.dispatchEvent(new KeyboardEvent(eventType, { key, code: key }));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none">
      {/* On-screen Directional Pad (Bottom-Left) */}
      <div className="absolute bottom-6 left-6 pointer-events-auto flex flex-col items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
        <button
          onTouchStart={() => simulateKey('w', true)}
          onTouchEnd={() => simulateKey('w', false)}
          onMouseDown={() => simulateKey('w', true)}
          onMouseUp={() => simulateKey('w', false)}
          className="w-12 h-12 rounded-2xl bg-zinc-900/80 backdrop-blur-md border border-white/20 text-white font-mono font-bold flex items-center justify-center active:bg-cyan-500 active:text-black shadow-lg"
        >
          ▲
        </button>
        <div className="flex items-center gap-1.5">
          <button
            onTouchStart={() => simulateKey('a', true)}
            onTouchEnd={() => simulateKey('a', false)}
            onMouseDown={() => simulateKey('a', true)}
            onMouseUp={() => simulateKey('a', false)}
            className="w-12 h-12 rounded-2xl bg-zinc-900/80 backdrop-blur-md border border-white/20 text-white font-mono font-bold flex items-center justify-center active:bg-cyan-500 active:text-black shadow-lg"
          >
            ◀
          </button>
          <button
            onTouchStart={() => simulateKey('s', true)}
            onTouchEnd={() => simulateKey('s', false)}
            onMouseDown={() => simulateKey('s', true)}
            onMouseUp={() => simulateKey('s', false)}
            className="w-12 h-12 rounded-2xl bg-zinc-900/80 backdrop-blur-md border border-white/20 text-white font-mono font-bold flex items-center justify-center active:bg-cyan-500 active:text-black shadow-lg"
          >
            ▼
          </button>
          <button
            onTouchStart={() => simulateKey('d', true)}
            onTouchEnd={() => simulateKey('d', false)}
            onMouseDown={() => simulateKey('d', true)}
            onMouseUp={() => simulateKey('d', false)}
            className="w-12 h-12 rounded-2xl bg-zinc-900/80 backdrop-blur-md border border-white/20 text-white font-mono font-bold flex items-center justify-center active:bg-cyan-500 active:text-black shadow-lg"
          >
            ▶
          </button>
        </div>
      </div>

      {/* On-screen Action Controls (Bottom-Right) */}
      <div className="absolute bottom-6 right-6 pointer-events-auto flex items-center gap-3">
        {/* Sprint Toggle */}
        <button
          onClick={() => {
            const next = !isSprinting;
            setIsSprinting(next);
            simulateKey('Shift', next);
          }}
          className={`w-14 h-14 rounded-2xl backdrop-blur-md border flex flex-col items-center justify-center shadow-lg transition-all ${
            isSprinting
              ? 'bg-cyan-500 text-black border-cyan-300 font-bold'
              : 'bg-zinc-900/80 text-white border-white/20'
          }`}
        >
          <Zap className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-mono uppercase">RUN</span>
        </button>

        {/* Interact Button */}
        {prompt && (
          <button
            onClick={() => onInteract && onInteract(prompt.id)}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-black font-bold border border-cyan-300 flex flex-col items-center justify-center shadow-xl shadow-cyan-500/40 animate-bounce active:scale-95"
          >
            <Hand className="w-6 h-6 mb-0.5" />
            <span className="text-[10px] font-mono tracking-wider">ENTER</span>
          </button>
        )}
      </div>
    </div>
  );
};

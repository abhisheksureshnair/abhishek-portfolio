'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Gauge, Sparkles, Zap, Shield, Check } from 'lucide-react';

export type PerformanceTier = 'auto' | 'high' | 'balanced' | 'low';

interface PerformanceContextType {
  tier: PerformanceTier;
  effectiveTier: 'high' | 'balanced' | 'low';
  setTier: (tier: PerformanceTier) => void;
  prefersReducedMotion: boolean;
  fps: number;
}

const PerformanceContext = createContext<PerformanceContextType>({
  tier: 'balanced',
  effectiveTier: 'balanced',
  setTier: () => {},
  prefersReducedMotion: false,
  fps: 60,
});

export const usePerformanceQuality = () => useContext(PerformanceContext);

export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tier, setTierState] = useState<PerformanceTier>('balanced');
  const [effectiveTier, setEffectiveTier] = useState<'high' | 'balanced' | 'low'>('balanced');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);

  // Initialize preference from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    // Load saved tier
    const saved = localStorage.getItem('asn_performance_tier') as PerformanceTier | null;
    const initialTier = saved && ['auto', 'high', 'balanced', 'low'].includes(saved) ? saved : 'balanced';
    setTierState(initialTier);

    // Determine effective tier
    if (initialTier === 'auto') {
      const cores = navigator.hardwareConcurrency || 4;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile || cores <= 4) {
        setEffectiveTier('low');
      } else if (cores >= 8) {
        setEffectiveTier('high');
      } else {
        setEffectiveTier('balanced');
      }
    } else {
      setEffectiveTier(initialTier);
    }

    // Lightweight FPS monitor (runs only for 3 seconds to measure baseline)
    let frames = 0;
    let startTime = performance.now();
    let animId: number;

    const measure = (now: number) => {
      frames++;
      if (now - startTime >= 1000) {
        const measuredFps = Math.round((frames * 1000) / (now - startTime));
        setFps(measuredFps);
        frames = 0;
        startTime = now;
      }
      animId = requestAnimationFrame(measure);
    };

    animId = requestAnimationFrame(measure);
    const stopMeasure = setTimeout(() => {
      cancelAnimationFrame(animId);
    }, 4000);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      clearTimeout(stopMeasure);
      cancelAnimationFrame(animId);
    };
  }, []);

  const setTier = useCallback((newTier: PerformanceTier) => {
    setTierState(newTier);
    if (typeof window !== 'undefined') {
      localStorage.setItem('asn_performance_tier', newTier);
    }

    if (newTier === 'auto') {
      const cores = navigator.hardwareConcurrency || 4;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile || cores <= 4) {
        setEffectiveTier('low');
      } else if (cores >= 8) {
        setEffectiveTier('high');
      } else {
        setEffectiveTier('balanced');
      }
    } else {
      setEffectiveTier(newTier);
    }
  }, []);

  return (
    <PerformanceContext.Provider
      value={{
        tier,
        effectiveTier,
        setTier,
        prefersReducedMotion,
        fps,
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
};

export const PerformanceSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { tier, effectiveTier, setTier, fps } = usePerformanceQuality();
  const [isOpen, setIsOpen] = useState(false);

  const options: { id: PerformanceTier; label: string; desc: string; icon: any }[] = [
    {
      id: 'auto',
      label: 'Auto Detect',
      desc: 'Adapts dynamically to device CPU & refresh rate',
      icon: Gauge,
    },
    {
      id: 'high',
      label: 'High Fidelity',
      desc: 'Maximum particles, reflections & depth lighting',
      icon: Sparkles,
    },
    {
      id: 'balanced',
      label: 'Balanced (Recommended)',
      desc: 'Optimal 60 FPS performance with cinematic visual polish',
      icon: Zap,
    },
    {
      id: 'low',
      label: 'Battery & Low Power',
      desc: 'Restricted particles & shadows for mobile or low-spec devices',
      icon: Shield,
    },
  ];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/90 border border-white/10 hover:border-indigo-500/50 text-[10px] font-mono text-zinc-400 hover:text-white transition-all shadow-sm"
        title="Visual Quality & Performance Controls"
        aria-label="Visual Quality & Performance Controls"
      >
        <Gauge className="w-3 h-3 text-cyan-400" />
        <span className="uppercase">{tier}</span>
        <span className="hidden sm:inline text-zinc-600 font-sans">•</span>
        <span className="hidden sm:inline text-emerald-400">{fps > 0 ? `${fps} FPS` : '60 FPS'}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-72 p-2 rounded-2xl bg-[#090d16]/95 border border-white/15 backdrop-blur-2xl shadow-2xl z-50 text-left font-sans animate-in fade-in zoom-in-95 duration-150">
            <div className="p-2 border-b border-white/10 mb-1 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                Performance Quality
              </span>
              <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                {effectiveTier.toUpperCase()} MODE
              </span>
            </div>

            <div className="space-y-1">
              {options.map((opt) => {
                const isSelected = tier === opt.id;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setTier(opt.id);
                      setIsOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-indigo-600/25 border border-indigo-500/40 text-white'
                        : 'hover:bg-white/5 text-zinc-400 hover:text-zinc-200 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isSelected ? 'text-cyan-400' : 'text-zinc-500'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold leading-tight font-mono">{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};


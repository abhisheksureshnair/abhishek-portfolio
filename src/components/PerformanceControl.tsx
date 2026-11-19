'use client';

// Early browser console filter to silence deprecated THREE.Clock warning (migrated to modern THREE.Timer)
if (typeof window !== 'undefined') {
  const filterClockWarning = (args: any[]) => {
    for (let i = 0; i < args.length; i++) {
      const str = String(args[i] || '');
      if (str.includes('THREE.Clock') || (str.includes('Clock') && str.includes('Timer'))) {
        return true;
      }
    }
    return false;
  };

  const origWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (filterClockWarning(args)) return;
    origWarn.apply(console, args);
  };

  const origError = console.error;
  console.error = (...args: any[]) => {
    if (filterClockWarning(args)) return;
    origError.apply(console, args);
  };
}

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Gauge, Sparkles, Zap, Shield, Check } from 'lucide-react';

export type PerformanceTier = 'auto' | 'high' | 'medium' | 'balanced' | 'low';
export type EffectiveQualityTier = 'high' | 'medium' | 'low';

export interface PerformanceQualityContextType {
  tier: PerformanceTier;
  effectiveTier: EffectiveQualityTier;
  setTier: (tier: PerformanceTier) => void;
  prefersReducedMotion: boolean;
  fps: number; // backward compatibility
  avgFrameTime: number; // backward compatibility
}

export interface PerformanceTelemetryContextType {
  fps: number;
  avgFrameTime: number;
  updateTelemetry: (fps: number, frameTime: number) => void;
}

const PerformanceContext = createContext<PerformanceQualityContextType>({
  tier: 'auto',
  effectiveTier: 'medium',
  setTier: () => {},
  prefersReducedMotion: false,
  fps: 60,
  avgFrameTime: 16.6,
});

const TelemetryContext = createContext<PerformanceTelemetryContextType>({
  fps: 60,
  avgFrameTime: 16.6,
  updateTelemetry: () => {},
});

export const usePerformanceQuality = () => useContext(PerformanceContext);
export const usePerformanceTelemetry = () => useContext(TelemetryContext);

// Initial device tier determination
function getHardwareInitialTier(): EffectiveQualityTier {
  if (typeof navigator === 'undefined') return 'medium';
  const cores = navigator.hardwareConcurrency || 4;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile || cores <= 4) {
    return 'low';
  } else if (cores >= 8) {
    return 'high';
  }
  return 'medium';
}

function normalizeTier(t: PerformanceTier): EffectiveQualityTier {
  if (t === 'balanced' || t === 'medium') return 'medium';
  if (t === 'high') return 'high';
  if (t === 'low') return 'low';
  return 'medium';
}

export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tier, setTierState] = useState<PerformanceTier>('auto');
  const [effectiveTier, setEffectiveTier] = useState<EffectiveQualityTier>('medium');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);
  const [avgFrameTime, setAvgFrameTime] = useState<number>(16.6);

  // Hysteresis refs for AUTO mode (Requirement 13)
  const tierRef = useRef<PerformanceTier>('auto');
  tierRef.current = tier;
  const effectiveTierRef = useRef<EffectiveQualityTier>('medium');
  effectiveTierRef.current = effectiveTier;

  const lowFpsStartTimeRef = useRef<number | null>(null);
  const highFpsStartTimeRef = useRef<number | null>(null);
  const lastTierChangeTimeRef = useRef<number>(performance.now());

  // Hysteresis constants:
  // Down-switch threshold: < 45 FPS sustained for 3.0 seconds
  // Up-switch threshold:   > 58 FPS sustained for 7.0 seconds (much stricter to avoid ping-pong)
  // Cooldown period:       8.0 seconds between any automatic tier shifts
  const HYSTERESIS_DOWN_FPS = 45;
  const HYSTERESIS_DOWN_TIME = 3000;
  const HYSTERESIS_UP_FPS = 58;
  const HYSTERESIS_UP_TIME = 7000;
  const HYSTERESIS_COOLDOWN = 8000;

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
    const initialTier = saved && ['auto', 'high', 'medium', 'balanced', 'low'].includes(saved) ? saved : 'auto';
    setTierState(initialTier);

    if (initialTier === 'auto') {
      const hwTier = getHardwareInitialTier();
      setEffectiveTier(hwTier);
    } else {
      setEffectiveTier(normalizeTier(initialTier));
    }

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  const updateTelemetry = useCallback((currentInstantFps: number, currentFrameTime: number) => {
    setFps(currentInstantFps);
    setAvgFrameTime(currentFrameTime);

    // AUTO Mode Hysteresis Evaluation using R3F's single engine loop
    if (tierRef.current === 'auto') {
      const now = performance.now();
      const currentEffTier = effectiveTierRef.current;
      const timeSinceLastChange = now - lastTierChangeTimeRef.current;

      if (timeSinceLastChange > HYSTERESIS_COOLDOWN) {
        if (currentInstantFps < HYSTERESIS_DOWN_FPS) {
          highFpsStartTimeRef.current = null;
          if (lowFpsStartTimeRef.current === null) {
            lowFpsStartTimeRef.current = now;
          } else if (now - lowFpsStartTimeRef.current >= HYSTERESIS_DOWN_TIME) {
            if (currentEffTier === 'high') {
              setEffectiveTier('medium');
              lastTierChangeTimeRef.current = now;
              lowFpsStartTimeRef.current = null;
            } else if (currentEffTier === 'medium') {
              setEffectiveTier('low');
              lastTierChangeTimeRef.current = now;
              lowFpsStartTimeRef.current = null;
            }
          }
        } else if (currentInstantFps >= HYSTERESIS_UP_FPS) {
          lowFpsStartTimeRef.current = null;
          if (highFpsStartTimeRef.current === null) {
            highFpsStartTimeRef.current = now;
          } else if (now - highFpsStartTimeRef.current >= HYSTERESIS_UP_TIME) {
            if (currentEffTier === 'low') {
              setEffectiveTier('medium');
              lastTierChangeTimeRef.current = now;
              highFpsStartTimeRef.current = null;
            } else if (currentEffTier === 'medium') {
              setEffectiveTier('high');
              lastTierChangeTimeRef.current = now;
              highFpsStartTimeRef.current = null;
            }
          }
        } else {
          lowFpsStartTimeRef.current = null;
          highFpsStartTimeRef.current = null;
        }
      }
    }
  }, []);

  const setTier = useCallback((newTier: PerformanceTier) => {
    setTierState(newTier);
    if (typeof window !== 'undefined') {
      localStorage.setItem('asn_performance_tier', newTier);
    }

    if (newTier === 'auto') {
      const hwTier = getHardwareInitialTier();
      setEffectiveTier(hwTier);
      lastTierChangeTimeRef.current = performance.now();
    } else {
      setEffectiveTier(normalizeTier(newTier));
    }
  }, []);

  // Memoize quality context so 3D meshes DO NOT re-render on telemetry updates
  const qualityValue = React.useMemo<PerformanceQualityContextType>(() => ({
    tier,
    effectiveTier,
    setTier,
    prefersReducedMotion,
    fps,
    avgFrameTime,
  }), [tier, effectiveTier, setTier, prefersReducedMotion]);

  const telemetryValue = React.useMemo<PerformanceTelemetryContextType>(() => ({
    fps,
    avgFrameTime,
    updateTelemetry,
  }), [fps, avgFrameTime, updateTelemetry]);

  return (
    <PerformanceContext.Provider value={qualityValue}>
      <TelemetryContext.Provider value={telemetryValue}>
        {children}
      </TelemetryContext.Provider>
    </PerformanceContext.Provider>
  );
};

export const PerformanceSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { tier, effectiveTier, setTier } = usePerformanceQuality();
  const { fps } = usePerformanceTelemetry();
  const [isOpen, setIsOpen] = useState(false);

  const options: { id: PerformanceTier; label: string; desc: string; icon: any }[] = [
    {
      id: 'auto',
      label: 'Auto Detect (Dynamic)',
      desc: 'Adapts with hysteresis between Low, Medium and High based on live GPU frame times',
      icon: Gauge,
    },
    {
      id: 'high',
      label: 'High Quality',
      desc: '2048x2048 shadow maps, PCF filtering, 1.75 DPR, full foliage instancing',
      icon: Sparkles,
    },
    {
      id: 'medium',
      label: 'Medium Quality (Balanced)',
      desc: '1024x1024 shadow maps, 1.25 DPR, instanced geometry, smooth 60 FPS',
      icon: Zap,
    },
    {
      id: 'low',
      label: 'Low Quality (Battery Saver)',
      desc: 'Disabled shadow maps, 1.0 DPR, zero point lights, maximum mobile battery efficiency',
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
        <span className="uppercase">{tier === 'balanced' ? 'MEDIUM' : tier}</span>
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
                const isSelected = tier === opt.id || (tier === 'balanced' && opt.id === 'medium');
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

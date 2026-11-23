import React, { useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useWorldStore, worldStore } from '../stores/worldStore';
import { Activity, Minimize2, Maximize2 } from 'lucide-react';

/**
 * In-Canvas Three.js Telemetry Collector
 * Samples renderer info at 4Hz (every 250ms) to avoid React re-renders.
 */
export const PerformanceMetricsCollector: React.FC = () => {
  const { gl } = useThree();
  const frameCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const sustainedLowFpsRef = useRef<number>(0);
  const sustainedHighFpsRef = useRef<number>(0);
  const lastQualityChangeTimeRef = useRef<number>(0);

  useFrame(() => {
    frameCountRef.current += 1;
    const now = performance.now();
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = now;
      lastQualityChangeTimeRef.current = now;
      return;
    }
    const elapsed = now - lastTimeRef.current;

    // Sample every 250ms (4Hz)
    if (elapsed >= 250) {
      const fps = Math.round((frameCountRef.current * 1000) / elapsed);
      const frameTimeMs = parseFloat((elapsed / frameCountRef.current).toFixed(1));

      // Extract WebGL memory usage if available
      let memoryMB = 0;
      if (typeof window !== 'undefined' && (performance as any).memory) {
        memoryMB = Math.round(
          (performance as any).memory.usedJSHeapSize / (1024 * 1024)
        );
      }

      const currentState = worldStore.getState();

      // Adaptive Graphics Quality logic for 'auto' profile
      if (currentState.qualityProfile === 'auto') {
        const timeSinceChange = now - lastQualityChangeTimeRef.current;
        if (fps < 38) {
          sustainedLowFpsRef.current += elapsed;
          sustainedHighFpsRef.current = 0;
        } else if (fps >= 55) {
          sustainedHighFpsRef.current += elapsed;
          sustainedLowFpsRef.current = 0;
        } else {
          sustainedLowFpsRef.current = Math.max(0, sustainedLowFpsRef.current - elapsed * 0.5);
          sustainedHighFpsRef.current = Math.max(0, sustainedHighFpsRef.current - elapsed * 0.5);
        }

        // Stepping down on sustained low framerate (> 3.0s)
        if (sustainedLowFpsRef.current >= 3000 && timeSinceChange >= 5000) {
          if (currentState.effectiveQuality === 'high') {
            worldStore.getState().setEffectiveQuality('medium');
            lastQualityChangeTimeRef.current = now;
            sustainedLowFpsRef.current = 0;
          } else if (currentState.effectiveQuality === 'medium') {
            worldStore.getState().setEffectiveQuality('low');
            lastQualityChangeTimeRef.current = now;
            sustainedLowFpsRef.current = 0;
          }
        }

        // Stepping up on sustained high framerate (> 6.0s)
        if (sustainedHighFpsRef.current >= 6000 && timeSinceChange >= 5000) {
          if (currentState.effectiveQuality === 'low') {
            worldStore.getState().setEffectiveQuality('medium');
            lastQualityChangeTimeRef.current = now;
            sustainedHighFpsRef.current = 0;
          } else if (currentState.effectiveQuality === 'medium') {
            worldStore.getState().setEffectiveQuality('high');
            lastQualityChangeTimeRef.current = now;
            sustainedHighFpsRef.current = 0;
          }
        }
      }

      worldStore.getState().setPerformanceStats({
        fps,
        drawCalls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        geometries: gl.info.memory.geometries,
        textures: gl.info.memory.textures,
        memoryMB,
        frameTimeMs,
      });

      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }
  });

  return null;
};

/**
 * 2D HUD Performance Monitor Widget
 */
export const PerformanceMonitorHUD: React.FC = () => {
  const stats = useWorldStore((s) => s.performanceStats);
  const show = useWorldStore((s) => s.showPerfMonitor);
  const toggle = useWorldStore((s) => s.togglePerfMonitor);
  const qualityProfile = useWorldStore((s) => s.qualityProfile);
  const effectiveQuality = useWorldStore((s) => s.effectiveQuality);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  if (!show) return null;

  const fpsColor =
    stats.fps >= 55
      ? 'text-emerald-400'
      : stats.fps >= 30
      ? 'text-amber-400'
      : 'text-rose-400';

  return (
    <aside
      aria-label="3D Engine Performance Diagnostics"
      className="fixed bottom-4 right-4 z-30 font-mono text-xs select-none max-w-[calc(100vw-32px)]"
    >
      <div className="bg-zinc-950/90 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-2xl shadow-black/60 text-zinc-300 w-60 sm:w-64 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-bold text-white text-[11px] tracking-wider uppercase">
              Engine Telemetry
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              aria-label={isMinimized ? 'Expand Telemetry' : 'Minimize Telemetry'}
              className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white"
            >
              {isMinimized ? (
                <Maximize2 className="w-3 h-3" />
              ) : (
                <Minimize2 className="w-3 h-3" />
              )}
            </button>
            <button
              onClick={toggle}
              aria-label="Close Telemetry"
              className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white text-[10px]"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Primary Metrics */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="bg-black/40 rounded-xl p-2 border border-white/5">
            <div className="text-[10px] text-zinc-400 uppercase tracking-tight">
              Framerate
            </div>
            <div className={`text-xl font-black ${fpsColor}`}>
              {stats.fps}{' '}
              <span className="text-[10px] font-normal text-zinc-500">FPS</span>
            </div>
          </div>
          <div className="bg-black/40 rounded-xl p-2 border border-white/5">
            <div className="text-[10px] text-zinc-400 uppercase tracking-tight">
              Frametime
            </div>
            <div className="text-xl font-black text-cyan-300">
              {stats.frameTimeMs}{' '}
              <span className="text-[10px] font-normal text-zinc-500">ms</span>
            </div>
          </div>
        </div>

        {/* Extended Stats */}
        {!isMinimized && (
          <div className="space-y-1.5 pt-1 text-[11px]">
            <div className="flex justify-between items-center text-zinc-400">
              <span>Quality Tier:</span>
              <span className="font-bold text-cyan-300">
                {qualityProfile === 'auto'
                  ? `AUTO (${effectiveQuality.toUpperCase()})`
                  : qualityProfile.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>Draw Calls:</span>
              <span className="font-bold text-emerald-300">
                {stats.drawCalls}
              </span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>Triangles:</span>
              <span className="font-bold text-zinc-200">
                {stats.triangles.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>Geometries:</span>
              <span className="font-bold text-zinc-200">{stats.geometries}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>Textures:</span>
              <span className="font-bold text-zinc-200">{stats.textures}</span>
            </div>
            {stats.memoryMB > 0 && (
              <div className="flex justify-between items-center text-zinc-400">
                <span>JS Heap:</span>
                <span className="font-bold text-amber-300">
                  {stats.memoryMB} MB
                </span>
              </div>
            )}
            <div className="mt-2 pt-2 border-t border-white/10 text-[9px] text-zinc-400 leading-tight">
              Phase 2.10 Engine Telemetry
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};


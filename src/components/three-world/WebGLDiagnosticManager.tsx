'use client';

import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Global mount tracking across route changes
let gCanvasMountCount = 0;
let gActiveContextCount = 0;

// Cleanly intercept and silence deprecated THREE.Clock warning (migrated to modern THREE.Timer in r185+)
if (typeof window !== 'undefined') {
  if (typeof (THREE as any).setConsoleFunction === 'function') {
    const origConsole = (THREE as any).getConsoleFunction?.();
    (THREE as any).setConsoleFunction((type: string, message: string, ...args: any[]) => {
      if (typeof message === 'string' && message.includes('Clock')) return;
      if (origConsole) origConsole(type, message, ...args);
      else (console as any)[type]?.(message, ...args);
    });
  }
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (args.some((arg) => typeof arg === 'string' && arg.includes('Clock'))) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

export interface WebGLDiagnosticStats {
  mountCount: number;
  activeContexts: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  programs: number;
  fps: number;
  avgFps: number;
  onePercentLowFps: number;
  avgFrameTimeMs: number;
  spikesCount: number;
  dpr: number;
  resolution: string;
}

interface WebGLDiagnosticManagerProps {
  onContextLost?: () => void;
  onContextRestored?: () => void;
  onStatsUpdate?: (stats: WebGLDiagnosticStats) => void;
  showDevOverlay?: boolean;
}

const BUFFER_SIZE = 120;

/**
 * High-precision WebGL Lifecycle, Performance Profiling & Diagnostic Monitor
 * - Tracks Canvas mounts, context creation, and destruction
 * - Profiles exact draw calls, triangles, memory geometries and textures
 * - Calculates rolling Average FPS, 1% Low FPS, Frame-Time (ms), and Frame-Time Spikes (>33.3ms)
 * - Updates Dev Overlay directly via DOM to ensure zero React rerender overhead
 */
export function WebGLDiagnosticManager({
  onContextLost,
  onContextRestored,
  onStatsUpdate,
  showDevOverlay = process.env.NODE_ENV !== 'production',
}: WebGLDiagnosticManagerProps) {
  const { gl } = useThree();
  const isUnmountingRef = useRef<boolean>(false);
  const mountTimeRef = useRef<number>(Date.now());

  // High-precision frame timing ring buffer
  const frameTimesRef = useRef<Float32Array>(new Float32Array(BUFFER_SIZE));
  const frameIdxRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const lastStatsEmitTimeRef = useRef<number>(performance.now());
  const spikesCountRef = useRef<number>(0);

  // Dev overlay DOM ref for zero-rerender updates
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gCanvasMountCount += 1;
    gActiveContextCount += 1;
    const currentMountId = gCanvasMountCount;
    mountTimeRef.current = Date.now();
    isUnmountingRef.current = false;

    const canvas = gl.domElement;

    // Create development telemetry overlay if enabled
    let overlayEl: HTMLDivElement | null = null;
    if (showDevOverlay && typeof document !== 'undefined') {
      overlayEl = document.createElement('div');
      overlayEl.id = 'webgl-dev-profiler';
      overlayEl.style.position = 'fixed';
      overlayEl.style.top = '10px';
      overlayEl.style.right = '12px';
      overlayEl.style.zIndex = '9999';
      overlayEl.style.padding = '6px 12px';
      overlayEl.style.borderRadius = '10px';
      overlayEl.style.backgroundColor = 'rgba(3, 7, 18, 0.88)';
      overlayEl.style.border = '1px solid rgba(56, 189, 248, 0.35)';
      overlayEl.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
      overlayEl.style.color = '#38bdf8';
      overlayEl.style.fontFamily = 'ui-monospace, monospace';
      overlayEl.style.fontSize = '11px';
      overlayEl.style.lineHeight = '1.4';
      overlayEl.style.pointerEvents = 'none';
      overlayEl.style.userSelect = 'none';
      overlayEl.innerText = 'Profiling 3D City Engine...';
      document.body.appendChild(overlayEl);
      overlayRef.current = overlayEl;
    }

    console.info(
      `%c[WebGL Diagnostics] Canvas #${currentMountId} Mounted%c\n` +
      `• Renderer: ${gl.capabilities.isWebGL2 ? 'WebGL 2.0' : 'WebGL 1.0'}\n` +
      `• Canvas Resolution: ${canvas.width} x ${canvas.height} (DPR: ${window.devicePixelRatio.toFixed(2)})\n` +
      `• Max Textures: ${gl.capabilities.maxTextures}\n` +
      `• Active Canvases: ${gActiveContextCount}`,
      'color: #06b6d4; font-weight: bold;',
      'color: inherit;'
    );

    // 1. Context Lost Handler
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      const elapsedSinceMount = (Date.now() - mountTimeRef.current) / 1000;
      const isIntentional = isUnmountingRef.current;

      if (isIntentional) return;

      console.warn(
        `%c[WebGL Diagnostics] Context Loss Detected!%c\n` +
        `• Elapsed: ${elapsedSinceMount.toFixed(2)}s\n` +
        `• Draw Calls at loss: ${gl.info.render.calls}\n` +
        `• Triangles: ${gl.info.render.triangles}\n` +
        `• Geometries: ${gl.info.memory.geometries}\n` +
        `• Textures: ${gl.info.memory.textures}`,
        'color: #f59e0b; font-weight: bold;',
        'color: inherit;'
      );

      if (onContextLost) onContextLost();
    };

    // 2. Context Restored Handler
    const handleContextRestored = () => {
      console.info(
        `%c[WebGL Diagnostics] Context Restored Successfully!%c\n` +
        `• GPU driver restored WebGL context for Canvas #${currentMountId}.`,
        'color: #10b981; font-weight: bold;',
        'color: inherit;'
      );

      if (onContextRestored) onContextRestored();
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    return () => {
      isUnmountingRef.current = true;
      gActiveContextCount = Math.max(0, gActiveContextCount - 1);

      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);

      if (overlayEl && overlayEl.parentNode) {
        overlayEl.parentNode.removeChild(overlayEl);
      }
      overlayRef.current = null;
    };
  }, [gl, onContextLost, onContextRestored, showDevOverlay]);

  // High-precision per-frame performance and GPU memory telemetry loop
  useFrame(() => {
    const now = performance.now();
    const frameDelta = now - lastTimeRef.current;
    lastTimeRef.current = now;

    // Record into ring buffer
    const idx = frameIdxRef.current % BUFFER_SIZE;
    frameTimesRef.current[idx] = frameDelta;
    frameIdxRef.current += 1;
    frameCountRef.current += 1;

    // Detect frame-time spikes (> 33.3ms, dropped below 30 FPS)
    if (frameDelta > 33.3) {
      spikesCountRef.current += 1;
    }

    const elapsedSinceEmit = now - lastStatsEmitTimeRef.current;

    // Calculate metrics and update dev overlay every 400ms
    if (elapsedSinceEmit >= 400) {
      const sampleCount = Math.min(frameIdxRef.current, BUFFER_SIZE);
      if (sampleCount === 0) return;

      let sumTime = 0;
      const sortedTimes: number[] = [];
      for (let i = 0; i < sampleCount; i++) {
        const t = frameTimesRef.current[i];
        sumTime += t;
        sortedTimes.push(t);
      }

      sortedTimes.sort((a, b) => a - b);
      const avgFrameTimeMs = sumTime / sampleCount;
      const avgFps = Math.round(1000 / Math.max(0.001, avgFrameTimeMs));
      const instantFps = Math.round((frameCountRef.current * 1000) / elapsedSinceEmit);

      // 1% Low frame time (99th percentile slowest frame)
      const p99Idx = Math.min(sortedTimes.length - 1, Math.floor(sortedTimes.length * 0.99));
      const p99FrameTimeMs = sortedTimes[p99Idx];
      const onePercentLowFps = Math.round(1000 / Math.max(0.001, p99FrameTimeMs));

      const calls = gl.info.render.calls;
      const tris = gl.info.render.triangles;
      const geos = gl.info.memory.geometries;
      const texs = gl.info.memory.textures;
      const programs = (gl.info as any).programs?.length ?? 0;

      // Update Dev Overlay directly via DOM (Zero React rerender!)
      if (overlayRef.current) {
        const fpsColor = avgFps >= 55 ? '#34d399' : avgFps >= 40 ? '#facc15' : '#f87171';
        overlayRef.current.innerHTML = `
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${fpsColor};"></span>
            <span style="font-weight:700;color:${fpsColor};">${avgFps} FPS</span>
            <span style="color:#94a3b8;font-size:10px;">(1% Low: <strong style="color:#e2e8f0;">${onePercentLowFps}</strong>)</span>
            <span style="color:#64748b;">|</span>
            <span style="color:#cbd5e1;">${avgFrameTimeMs.toFixed(1)}ms</span>
            <span style="color:${spikesCountRef.current > 0 ? '#fb923c' : '#64748b'};font-size:10px;">[Spikes: ${spikesCountRef.current}]</span>
          </div>
          <div style="color:#94a3b8;font-size:10px;margin-top:2px;">
            Calls: <strong style="color:#f8fafc;">${calls}</strong> &bull; Tris: <strong style="color:#f8fafc;">${(tris / 1000).toFixed(1)}k</strong> &bull; Shaders: <strong style="color:#f8fafc;">${programs}</strong> &bull; Mem: ${geos}g / ${texs}t
          </div>
        `;
      }

      if (onStatsUpdate) {
        onStatsUpdate({
          mountCount: gCanvasMountCount,
          activeContexts: gActiveContextCount,
          drawCalls: calls,
          triangles: tris,
          geometries: geos,
          textures: texs,
          programs,
          fps: instantFps,
          avgFps,
          onePercentLowFps,
          avgFrameTimeMs,
          spikesCount: spikesCountRef.current,
          dpr: gl.getPixelRatio(),
          resolution: `${gl.domElement.width}x${gl.domElement.height}`,
        });
      }

      // Reset window counter
      frameCountRef.current = 0;
      lastStatsEmitTimeRef.current = now;
    }
  });

  return null;
}

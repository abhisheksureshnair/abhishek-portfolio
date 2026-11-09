'use client';

import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Global mount tracking across route changes
let gCanvasMountCount = 0;
let gActiveContextCount = 0;

export interface WebGLDiagnosticStats {
  mountCount: number;
  activeContexts: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  fps: number;
  dpr: number;
  resolution: string;
}

interface WebGLDiagnosticManagerProps {
  onContextLost?: () => void;
  onContextRestored?: () => void;
  onStatsUpdate?: (stats: WebGLDiagnosticStats) => void;
}

/**
 * High-precision WebGL Lifecycle & Diagnostic Monitor
 * - Tracks Canvas mounts, context creation, and destruction
 * - Accurately differentiates intentional unmounts from unexpected GPU crashes
 * - Streams live draw calls, memory, textures, and geometry counts
 */
export function WebGLDiagnosticManager({
  onContextLost,
  onContextRestored,
  onStatsUpdate,
}: WebGLDiagnosticManagerProps) {
  const { gl, scene } = useThree();
  const isUnmountingRef = useRef<boolean>(false);
  const mountTimeRef = useRef<number>(Date.now());
  const frameCountRef = useRef<number>(0);
  const lastFpsCalcTimeRef = useRef<number>(performance.now());
  const currentFpsRef = useRef<number>(60);

  useEffect(() => {
    gCanvasMountCount += 1;
    gActiveContextCount += 1;
    const currentMountId = gCanvasMountCount;
    mountTimeRef.current = Date.now();
    isUnmountingRef.current = false;

    const canvas = gl.domElement;
    const glContext = gl.getContext();

    console.info(
      `%c[WebGL Diagnostics] Canvas #${currentMountId} Mounted%c\n` +
      `• Renderer: ${gl.capabilities.isWebGL2 ? 'WebGL 2.0' : 'WebGL 1.0'}\n` +
      `• Canvas Resolution: ${canvas.width} x ${canvas.height} (DPR: ${window.devicePixelRatio.toFixed(2)})\n` +
      `• Max Textures: ${gl.capabilities.maxTextures}\n` +
      `• Active Canvases in Session: ${gActiveContextCount}`,
      'color: #06b6d4; font-weight: bold;',
      'color: inherit;'
    );

    // 1. Context Lost Handler
    const handleContextLost = (e: Event) => {
      e.preventDefault(); // Required: prevents browser from permanently destroying the context
      const elapsedSinceMount = (Date.now() - mountTimeRef.current) / 1000;
      const isIntentional = isUnmountingRef.current;

      if (isIntentional) {
        console.info(
          `[WebGL Diagnostics] Canvas #${currentMountId} unmounted cleanly. Normal context disposal.`
        );
        return;
      }

      const phase = elapsedSinceMount < 2.5 ? 'INITIAL_MOUNT' : 'ACTIVE_RENDERING';

      console.warn(
        `%c[WebGL Diagnostics] Context Loss Detected!%c\n` +
        `• Phase: ${phase} (${elapsedSinceMount.toFixed(2)}s into lifecycle)\n` +
        `• Draw Calls at loss: ${gl.info.render.calls}\n` +
        `• Triangles: ${gl.info.render.triangles}\n` +
        `• Geometries in memory: ${gl.info.memory.geometries}\n` +
        `• Textures in memory: ${gl.info.memory.textures}\n` +
        `• DPR: ${gl.getPixelRatio()}`,
        'color: #f59e0b; font-weight: bold;',
        'color: inherit;'
      );

      if (onContextLost) {
        onContextLost();
      }
    };

    // 2. Context Restored Handler
    const handleContextRestored = () => {
      console.info(
        `%c[WebGL Diagnostics] Context Restored Successfully!%c\n` +
        `• GPU driver restored WebGL context for Canvas #${currentMountId}.`,
        'color: #10b981; font-weight: bold;',
        'color: inherit;'
      );

      if (onContextRestored) {
        onContextRestored();
      }
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    return () => {
      // Mark as intentional unmount BEFORE removing event listeners
      isUnmountingRef.current = true;
      gActiveContextCount = Math.max(0, gActiveContextCount - 1);

      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);

      console.info(
        `[WebGL Diagnostics] Canvas #${currentMountId} Unmounted. Active contexts remaining: ${gActiveContextCount}`
      );
    };
  }, [gl, onContextLost, onContextRestored]);

  // Per-frame performance and GPU memory telemetry loop
  useFrame(() => {
    frameCountRef.current += 1;
    const now = performance.now();
    const elapsed = now - lastFpsCalcTimeRef.current;

    // Calculate FPS and emit stats once every 500ms
    if (elapsed >= 500) {
      currentFpsRef.current = Math.round((frameCountRef.current * 1000) / elapsed);
      frameCountRef.current = 0;
      lastFpsCalcTimeRef.current = now;

      if (onStatsUpdate && gl) {
        onStatsUpdate({
          mountCount: gCanvasMountCount,
          activeContexts: gActiveContextCount,
          drawCalls: gl.info.render.calls,
          triangles: gl.info.render.triangles,
          geometries: gl.info.memory.geometries,
          textures: gl.info.memory.textures,
          fps: currentFpsRef.current,
          dpr: gl.getPixelRatio(),
          resolution: `${gl.domElement.width}x${gl.domElement.height}`,
        });
      }
    }
  });

  return null;
}


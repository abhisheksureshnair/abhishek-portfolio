'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Reusable animation timer hook replacing deprecated THREE.Clock with modern THREE.Timer
 * Preserves smooth delta-time and elapsed-time animation behavior in Three.js r185+
 */
export function useThreeTimer() {
  const timerRef = useRef<THREE.Timer | null>(null);
  const timeDataRef = useRef<{ delta: number; elapsed: number }>({ delta: 0, elapsed: 0 });

  if (!timerRef.current) {
    timerRef.current = new THREE.Timer();
  }

  useEffect(() => {
    return () => {
      timerRef.current?.dispose();
    };
  }, []);

  useFrame(() => {
    if (timerRef.current) {
      timerRef.current.update();
      timeDataRef.current.delta = timerRef.current.getDelta();
      timeDataRef.current.elapsed = timerRef.current.getElapsed();
    }
  });

  return {
    timer: timerRef.current,
    timeDataRef,
  };
}


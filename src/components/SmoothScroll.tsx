'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { usePerformanceQuality } from './PerformanceControl';

export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { effectiveTier, prefersReducedMotion } = usePerformanceQuality();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // If reduced motion or low tier, keep native scroll for maximum responsiveness
    if (prefersReducedMotion || effectiveTier === 'low') {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.1,
      infinite: false,
    });
    lenisRef.current = lenis;

    let animationFrameId: number;
    let isRunning = true;

    function raf(time: number) {
      if (isRunning) {
        lenis.raf(time);
        animationFrameId = requestAnimationFrame(raf);
      }
    }

    animationFrameId = requestAnimationFrame(raf);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (!isRunning) {
          isRunning = true;
          animationFrameId = requestAnimationFrame(raf);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isRunning = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion, effectiveTier]);

  return <>{children}</>;
};

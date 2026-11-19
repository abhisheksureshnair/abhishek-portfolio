'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export type CursorVariant = 'default' | 'pointer' | 'view' | 'text' | 'portal' | 'terminal';

export const CustomCursor: React.FC = () => {
  const [cursorVariant, setCursorVariant] = useState<CursorVariant>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string>('');

  // Zero-react-rerender MotionValues for raw mouse coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for cursor-following light
  const smoothX = useSpring(cursorX, { damping: 28, stiffness: 220, mass: 0.4 });
  const smoothY = useSpring(cursorY, { damping: 28, stiffness: 220, mass: 0.4 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouch(touchDevice);
      if (touchDevice) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setIsTouch(true);
        return;
      }
    }

    const updateMousePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('input, textarea, [contenteditable="true"]')) {
        setCursorVariant('default');
        setCursorLabel('');
        return;
      }

      const interactive = target.closest('a, button, [role="button"], [data-cursor]');
      if (interactive) {
        const customCursorAttr = interactive.getAttribute('data-cursor');
        if (customCursorAttr === 'view') {
          setCursorVariant('view');
          setCursorLabel('EXPLORE');
        } else if (customCursorAttr === 'portal') {
          setCursorVariant('portal');
          setCursorLabel('WARP');
        } else if (customCursorAttr === 'terminal') {
          setCursorVariant('terminal');
          setCursorLabel('RUN');
        } else if (customCursorAttr === 'text') {
          setCursorVariant('text');
          setCursorLabel('');
        } else {
          setCursorVariant('pointer');
          setCursorLabel('');
        }
      } else {
        setCursorVariant('default');
        setCursorLabel('');
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible, cursorX, cursorY]);

  if (isTouch || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden custom-cursor">
      {/* Ambient cursor-following glow light */}
      <motion.div
        className="fixed top-0 left-0 w-80 h-80 rounded-full bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-transparent blur-3xl pointer-events-none"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Precision cursor dot / halo directly bound to cursor coordinates */}
      <motion.div
        className="fixed top-0 left-0 rounded-full flex items-center justify-center text-[9px] font-bold tracking-widest text-slate-900 uppercase shadow-2xl backdrop-blur-sm pointer-events-none"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: cursorVariant === 'view' ? 68 : cursorVariant === 'portal' ? 64 : cursorVariant === 'pointer' ? 42 : cursorVariant === 'terminal' ? 56 : 14,
          height: cursorVariant === 'view' ? 68 : cursorVariant === 'portal' ? 64 : cursorVariant === 'pointer' ? 42 : cursorVariant === 'terminal' ? 56 : 14,
          backgroundColor:
            cursorVariant === 'view'
              ? 'rgba(56, 189, 248, 0.9)'
              : cursorVariant === 'portal'
                ? 'rgba(168, 85, 247, 0.85)'
                : cursorVariant === 'pointer'
                  ? 'rgba(99, 102, 241, 0.25)'
                  : cursorVariant === 'terminal'
                    ? 'rgba(16, 185, 129, 0.85)'
                    : 'rgba(255, 255, 255, 0.75)',
          border:
            cursorVariant === 'pointer'
              ? '1.5px solid rgba(129, 140, 248, 0.8)'
              : cursorVariant === 'view'
                ? '1.5px solid rgba(255, 255, 255, 0.95)'
                : cursorVariant === 'portal'
                  ? '2px solid rgba(236, 72, 153, 0.9)'
                  : cursorVariant === 'terminal'
                    ? '1.5px solid rgba(52, 211, 153, 0.9)'
                    : '1px solid rgba(255, 255, 255, 0.6)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      >
        {cursorLabel && (
          <span className="font-mono text-black font-extrabold">{cursorLabel}</span>
        )}
      </motion.div>
    </div>
  );
};

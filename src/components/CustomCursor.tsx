'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export type CursorVariant = 'default' | 'pointer' | 'view' | 'text' | 'portal' | 'terminal';

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorVariant, setCursorVariant] = useState<CursorVariant>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string>('');

  // Smooth springs for cursor-following light
  const smoothX = useSpring(mousePosition.x, { damping: 28, stiffness: 220, mass: 0.5 });
  const smoothY = useSpring(mousePosition.y, { damping: 28, stiffness: 220, mass: 0.5 });

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
      setMousePosition({ x: e.clientX, y: e.clientY });
      smoothX.set(e.clientX);
      smoothY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Do not hijack cursor inside forms, native inputs or textareas
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

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible, smoothX, smoothY]);

  if (isTouch || !isVisible) return null;

  const variants = {
    default: {
      x: mousePosition.x - 7,
      y: mousePosition.y - 7,
      height: 14,
      width: 14,
      backgroundColor: 'rgba(255, 255, 255, 0.75)',
      border: '1px solid rgba(255, 255, 255, 0.6)',
      mixBlendMode: 'difference' as const,
      transition: { type: 'spring' as const, damping: 30, stiffness: 400, mass: 0.2 },
    },
    pointer: {
      x: mousePosition.x - 22,
      y: mousePosition.y - 22,
      height: 44,
      width: 44,
      backgroundColor: 'rgba(99, 102, 241, 0.25)',
      border: '1.5px solid rgba(129, 140, 248, 0.8)',
      mixBlendMode: 'normal' as const,
      transition: { type: 'spring' as const, damping: 25, stiffness: 350 },
    },
    view: {
      x: mousePosition.x - 34,
      y: mousePosition.y - 34,
      height: 68,
      width: 68,
      backgroundColor: 'rgba(56, 189, 248, 0.9)',
      border: '1.5px solid rgba(255, 255, 255, 0.95)',
      mixBlendMode: 'normal' as const,
      transition: { type: 'spring' as const, damping: 20, stiffness: 300 },
    },
    portal: {
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      height: 64,
      width: 64,
      backgroundColor: 'rgba(168, 85, 247, 0.85)',
      border: '2px solid rgba(236, 72, 153, 0.9)',
      mixBlendMode: 'normal' as const,
      transition: { type: 'spring' as const, damping: 22, stiffness: 320 },
    },
    terminal: {
      x: mousePosition.x - 28,
      y: mousePosition.y - 28,
      height: 56,
      width: 56,
      backgroundColor: 'rgba(16, 185, 129, 0.85)',
      border: '1.5px solid rgba(52, 211, 153, 0.9)',
      mixBlendMode: 'normal' as const,
      transition: { type: 'spring' as const, damping: 22, stiffness: 320 },
    },
    text: {
      x: mousePosition.x - 2,
      y: mousePosition.y - 12,
      height: 24,
      width: 3,
      backgroundColor: '#38bdf8',
      border: 'none',
      mixBlendMode: 'normal' as const,
    },
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
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

      {/* Precision cursor badge */}
      <motion.div
        className="fixed top-0 left-0 rounded-full flex items-center justify-center text-[9px] font-bold tracking-widest text-slate-900 uppercase shadow-2xl backdrop-blur-sm"
        animate={cursorVariant}
        variants={variants}
      >
        {cursorLabel && (
          <span className="font-mono text-black font-extrabold">{cursorLabel}</span>
        )}
      </motion.div>
    </div>
  );
};

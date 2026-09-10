'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorVariant, setCursorVariant] = useState<'default' | 'pointer' | 'view' | 'text'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check if device is touch-enabled
    if (typeof window !== 'undefined') {
      const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouch(touchDevice);
      if (touchDevice) return;
    }

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor]');
      if (interactive) {
        const customCursorAttr = interactive.getAttribute('data-cursor');
        if (customCursorAttr === 'view') {
          setCursorVariant('view');
        } else if (customCursorAttr === 'text') {
          setCursorVariant('text');
        } else {
          setCursorVariant('pointer');
        }
      } else {
        setCursorVariant('default');
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
  }, [isVisible]);

  if (isTouch || !isVisible) return null;

  const variants = {
    default: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      height: 16,
      width: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      mixBlendMode: 'difference' as const,
      transition: { type: 'spring' as const, damping: 30, stiffness: 400, mass: 0.2 },
    },
    pointer: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      height: 48,
      width: 48,
      backgroundColor: 'rgba(99, 102, 241, 0.25)',
      border: '1px solid rgba(129, 140, 248, 0.6)',
      mixBlendMode: 'normal' as const,
      transition: { type: 'spring' as const, damping: 25, stiffness: 350 },
    },
    view: {
      x: mousePosition.x - 36,
      y: mousePosition.y - 36,
      height: 72,
      width: 72,
      backgroundColor: 'rgba(16, 185, 129, 0.85)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      mixBlendMode: 'normal' as const,
      transition: { type: 'spring' as const, damping: 20, stiffness: 300 },
    },
    text: {
      x: mousePosition.x - 2,
      y: mousePosition.y - 12,
      height: 24,
      width: 4,
      backgroundColor: '#6366f1',
      border: 'none',
      mixBlendMode: 'normal' as const,
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <motion.div
        className="fixed top-0 left-0 rounded-full flex items-center justify-center text-[10px] font-bold tracking-widest text-black uppercase shadow-lg backdrop-blur-sm"
        animate={cursorVariant}
        variants={variants}
      >
        {cursorVariant === 'view' && <span>VIEW</span>}
      </motion.div>
    </div>
  );
};

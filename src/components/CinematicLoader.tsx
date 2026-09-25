'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicLoaderProps {
  onLoaded?: () => void;
}

export const CinematicLoader: React.FC<CinematicLoaderProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user already saw loader this session to keep experience fast
    const hasSeenLoader = sessionStorage.getItem('asn_loader_seen');
    if (hasSeenLoader) {
      setIsVisible(false);
      onLoaded?.();
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('asn_loader_seen', 'true');
            onLoaded?.();
          }, 450);
          return 100;
        }
        // Smooth logarithmic easing
        const step = Math.max(1, Math.floor((100 - prev) * 0.15));
        return Math.min(100, prev + step);
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onLoaded]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="cinematic-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030508] text-white selection:bg-indigo-500/30 overflow-hidden"
        >
          {/* Subtle Ambient Background Radial Light */}
          <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-xs w-full px-6 text-center">
            
            {/* ASN Monogram Emblem */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative mb-8"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-indigo-500/20 via-zinc-900 to-black border border-indigo-500/40 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                <span className="font-mono text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-cyan-300">
                  ASN
                </span>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-1 rounded-2xl border border-indigo-500/20 border-dashed pointer-events-none"
              />
            </motion.div>

            {/* Identity & Status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="space-y-1.5 mb-8"
            >
              <h1 className="text-xs font-mono font-bold tracking-[0.3em] uppercase text-zinc-300">
                Abhishek S Nair
              </h1>
              <p className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase">
                Cinematic Portfolio
              </p>
            </motion.div>

            {/* Minimal Progress Bar */}
            <div className="w-full bg-zinc-900/90 border border-white/10 rounded-full h-1 overflow-hidden relative mb-3">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-400 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.1 }}
              />
            </div>

            {/* Percentage & System Status */}
            <div className="w-full flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SYSTEM INITIALIZING
              </span>
              <span className="text-zinc-300 font-bold">{progress}%</span>
            </div>

            {/* Quick Skip button for immediate access */}
            <button
              onClick={() => {
                setIsVisible(false);
                sessionStorage.setItem('asn_loader_seen', 'true');
                onLoaded?.();
              }}
              className="mt-8 text-[10px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors uppercase tracking-widest"
            >
              [ Skip Intro ]
            </button>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

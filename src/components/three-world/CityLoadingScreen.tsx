'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CityLoadingScreenProps {
  onDismiss?: () => void;
  isReady?: boolean;
}

export const CityLoadingScreen: React.FC<CityLoadingScreenProps> = ({
  onDismiss,
  isReady = false,
}) => {
  const [progress, setProgress] = useState(15);
  const [showFallback, setShowFallback] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Smooth simulated preload progress up to 90%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) {
          clearInterval(interval);
          return 92;
        }
        return prev + Math.floor(Math.random() * 15 + 8);
      });
    }, 120);

    // Show instant bypass button after 3.5 seconds
    const fallbackTimer = setTimeout(() => {
      setShowFallback(true);
    }, 3500);

    // Safety auto-dismiss: ensure loading screen NEVER blocks the 3D city longer than 1.2s
    const safetyTimer = setTimeout(() => {
      setProgress(100);
      setIsVisible(false);
      onDismiss?.();
    }, 1200);

    return () => {
      clearInterval(interval);
      clearTimeout(fallbackTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

  // When 3D Canvas reports ready, jump to 100% and fade out
  useEffect(() => {
    if (isReady) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isReady, onDismiss]);

  const handleInstantEnter = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-[#070b19] flex flex-col items-center justify-center p-6 text-center font-mono select-none"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent_70%)] pointer-events-none" />

          <div className="relative max-w-sm w-full space-y-6">
            {/* Holographic Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Initializing 3D City Diorama</span>
            </div>

            {/* City Title */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                Abhishek S Nair
              </h2>
              <p className="text-xs text-zinc-400">
                Interactive Developer Metropolis &bull; 60fps WebGL
              </p>
            </div>

            {/* Progress Bar Container */}
            <div className="space-y-2">
              <div className="w-full h-2 rounded-full bg-zinc-900 border border-white/10 overflow-hidden p-0.5 shadow-inner">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 shadow-[0_0_15px_rgba(56,189,248,0.5)]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span>Loading textures & materials...</span>
                <span className="text-cyan-400 font-bold">{progress}%</span>
              </div>
            </div>

            {/* Useful Instant Bypass Button if Network is Slow */}
            {showFallback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-2"
              >
                <button
                  onClick={handleInstantEnter}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white text-xs font-bold transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                  <span>Enter City Directly</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


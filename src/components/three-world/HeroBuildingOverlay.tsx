'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Building2,
  ExternalLink,
  Code2,
  Briefcase,
  Sparkles,
  ArrowRight,
  Layers,
  Cpu,
} from 'lucide-react';
import { PERSONAL_INFO } from '@/data/portfolioData';

interface HeroBuildingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onExplorePortfolio: () => void;
}

/**
 * Hero Building HTML Modal Overlay
 * Displays rich interactive profile details when the Hero Headquarters is clicked.
 * Handles ESC key dismissal and prevents click-through to the 3D scene.
 */
export const HeroBuildingOverlay: React.FC<HeroBuildingOverlayProps> = ({
  isOpen,
  onClose,
  onExplorePortfolio,
}) => {
  // ESC key listener to restore city camera
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-md font-mono pointer-events-auto"
          onClick={onClose}
        >
          {/* Prevent modal box click from closing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl rounded-3xl bg-slate-950/95 border border-cyan-500/30 p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.2)] text-white overflow-hidden"
          >
            {/* Background cyan gradient flare */}
            <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

            {/* Header with Badges & Close Button */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs tracking-wider uppercase font-semibold">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>FLAGSHIP HEADQUARTERS // PLOT 01</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>{PERSONAL_INFO.name}</span>
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                </h2>
                <p className="text-xs sm:text-sm text-cyan-300/90 font-medium tracking-wide">
                  {PERSONAL_INFO.title} • {PERSONAL_INFO.subtitle}
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all active:scale-95"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bio Body */}
            <div className="py-5 space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              <p className="font-light">
                {PERSONAL_INFO.tagline}
              </p>
              <p className="text-xs text-zinc-400 font-mono leading-normal bg-white/[0.03] p-3.5 rounded-2xl border border-white/5">
                {PERSONAL_INFO.bioStory}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5 py-2 border-t border-white/10 pt-4 font-mono">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-lg font-black text-cyan-400">3+</div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Years Exp</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-lg font-black text-emerald-400">Web • App</div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Full-Stack</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-lg font-black text-indigo-400">AI / LLM</div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Integrated</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-5 border-t border-white/10 mt-3 font-mono">
              <button
                onClick={onExplorePortfolio}
                className="w-full sm:flex-1 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs tracking-wider uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
              >
                <span>Explore Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold tracking-wider uppercase transition-all"
              >
                <span>Back to City [ESC]</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


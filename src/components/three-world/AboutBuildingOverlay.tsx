'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  GraduationCap,
  Briefcase,
  Sparkles,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Award,
  Layers,
  MapPin,
  Code2,
} from 'lucide-react';
import { PERSONAL_INFO, JOURNEY_TIMELINE, EDUCATION_DATA, PROFESSIONAL_EXPERIENCE } from '@/data/portfolioData';

interface AboutBuildingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * AboutBuildingOverlay Component
 * Polished HTML information panel displaying:
 * - Developer introduction & verified summary
 * - 3.6 Years of Software Development Experience
 * - Completed MCA (AI Specialization) & BSc Computer Science
 * - Personal Journey timeline & verified professional highlights
 * - Zero invented employers, achievements, or dates
 * - Smooth entrance/exit animations & ESC key handling
 */
export const AboutBuildingOverlay: React.FC<AboutBuildingOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'journey' | 'education'>('overview');

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
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md font-mono pointer-events-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl bg-slate-950/95 border border-orange-500/30 p-5 sm:p-7 shadow-[0_0_60px_rgba(249,115,22,0.2)] text-white overflow-hidden flex flex-col"
          >
            {/* Warm orange & amber decorative flare */}
            <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

            {/* Header with Title & Close Button */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 shrink-0">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs tracking-wider uppercase font-semibold">
                  <User className="w-3.5 h-3.5 text-orange-400" />
                  <span>DEVELOPER STUDIO // ABOUT ME</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>{PERSONAL_INFO.name}</span>
                  <Sparkles className="w-4 h-4 text-orange-400" />
                </h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-orange-200/90">
                  <span className="font-semibold text-white">{PERSONAL_INFO.title}</span>
                  <span>•</span>
                  <span>3.6 Years Software Dev Experience</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-zinc-400">
                    <MapPin className="w-3 h-3" />
                    {PERSONAL_INFO.location}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all active:scale-95"
                title="Back to City (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 pt-3 pb-2 border-b border-white/5 shrink-0 text-xs font-mono">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'overview'
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('journey')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'journey'
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Journey & Experience
              </button>
              <button
                onClick={() => setActiveTab('education')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'education'
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Degrees & Academics
              </button>
            </div>

            {/* Scrollable Tab Content */}
            <div className="overflow-y-auto pr-1 py-4 space-y-4 font-sans text-xs sm:text-sm text-zinc-300 leading-relaxed custom-scrollbar">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                    <h3 className="text-xs font-mono font-bold text-orange-300 uppercase tracking-wider">
                      Developer Introduction
                    </h3>
                    <p className="text-zinc-300 font-light leading-relaxed">
                      {PERSONAL_INFO.bioStory}
                    </p>
                  </div>

                  {/* Current Employment Box */}
                  <div className="p-4 rounded-2xl bg-orange-950/20 border border-orange-500/20 space-y-2 font-mono">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-orange-400 font-bold flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        {PERSONAL_INFO.currentCompany}
                      </span>
                      <span className="text-zinc-400">{PERSONAL_INFO.currentPeriod}</span>
                    </div>
                    <div className="text-xs text-white font-semibold">
                      Role: {PERSONAL_INFO.currentRole} ({PERSONAL_INFO.currentDepartment})
                    </div>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                      Contributing to software development projects involving application development, feature implementation, integrations, debugging, testing, and technical problem solving.
                    </p>
                  </div>

                  {/* Professional Highlights Bullet Points */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2.5">
                    <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                      Professional Highlights
                    </h3>
                    <ul className="space-y-2 text-xs text-zinc-300 font-sans">
                      {PROFESSIONAL_EXPERIENCE.highlights.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'journey' && (
                <div className="space-y-4">
                  <div className="space-y-3 font-mono">
                    {JOURNEY_TIMELINE.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-orange-500/20 transition-all space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-orange-300 font-bold">{item.title}</span>
                          <span className="text-zinc-400 text-[11px] px-2 py-0.5 rounded-md bg-white/5">
                            {item.period}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-300 font-sans">
                          {item.organization} • <span className="text-orange-200/80">{item.role}</span>
                        </div>
                        <p className="text-xs text-zinc-400 font-sans leading-relaxed pt-1">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'education' && (
                <div className="space-y-3 font-mono">
                  {/* MCA Degree */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-950/30 to-slate-900/40 border border-orange-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="inline-flex items-center gap-1.5 text-orange-400 font-bold">
                        <GraduationCap className="w-4 h-4" />
                        <span>Master of Computer Applications (MCA)</span>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-semibold">
                        AI Specialization
                      </span>
                    </div>
                    <div className="text-xs text-white">Manipal University Jaipur</div>
                    <div className="text-xs text-zinc-400 font-sans leading-relaxed">
                      Specialization in Artificial Intelligence, Deep Learning, Distributed Computing Architectures, and Machine Learning Systems.
                    </div>
                    <div className="text-[11px] text-zinc-400 pt-1">Period: 2024 – 2026</div>
                  </div>

                  {/* BSc Degree */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="inline-flex items-center gap-1.5 text-zinc-200 font-bold">
                        <GraduationCap className="w-4 h-4 text-zinc-400" />
                        <span>Bachelor of Science (BSc) in Computer Science</span>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                        Graduated
                      </span>
                    </div>
                    <div className="text-xs text-zinc-300">Mannam Memorial NSS College</div>
                    <div className="text-xs text-zinc-400 font-sans leading-relaxed">
                      Rigorous foundation in Computer Science, Data Structures & Algorithms, Object-Oriented Programming, and Relational Database Management Systems.
                    </div>
                    <div className="text-[11px] text-zinc-400 pt-1">Period: 2020 – 2023</div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 shrink-0 font-mono">
              <div className="text-[11px] text-zinc-400 hidden sm:block">
                Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">ESC</kbd> to return
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                >
                  <span>Back to City</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


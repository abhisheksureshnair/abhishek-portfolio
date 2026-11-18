'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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
  Smartphone,
  Server,
  Cpu,
  Tv,
  Heart,
  Globe,
  Compass,
} from 'lucide-react';
import {
  ABOUT_STUDIO_METADATA,
  JourneyStage,
  EducationExhibition,
  MediaWallHighlight,
} from '@/world/buildings/about/aboutMetadata';

interface AboutBuildingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'intro' | 'journey' | 'education' | 'media';
}

export const AboutBuildingOverlay: React.FC<AboutBuildingOverlayProps> = ({
  isOpen,
  onClose,
  initialTab = 'intro',
}) => {
  const [activeTab, setActiveTab] = useState<'intro' | 'journey' | 'education' | 'media'>(initialTab);
  const [selectedJourneyStage, setSelectedJourneyStage] = useState<JourneyStage>(
    ABOUT_STUDIO_METADATA.journeyStages[0]
  );
  const [selectedMediaHighlight, setSelectedMediaHighlight] = useState<MediaWallHighlight>(
    ABOUT_STUDIO_METADATA.mediaWallHighlights[0]
  );

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

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
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md pointer-events-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[88vh] rounded-3xl bg-zinc-950/95 border border-orange-500/30 p-5 sm:p-7 shadow-[0_0_60px_rgba(249,115,22,0.25)] text-white overflow-hidden flex flex-col backdrop-blur-xl"
          >
            {/* Warm decorative gradients */}
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

            {/* Header with Title & Close Button */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 shrink-0">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs tracking-wider uppercase font-semibold font-mono">
                  <User className="w-3.5 h-3.5 text-orange-400" />
                  <span>{ABOUT_STUDIO_METADATA.district}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>{ABOUT_STUDIO_METADATA.title}</span>
                  <Sparkles className="w-4 h-4 text-orange-400" />
                </h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-orange-200/90 font-mono">
                  <span className="font-semibold text-white">
                    {ABOUT_STUDIO_METADATA.introduction.name}
                  </span>
                  <span>•</span>
                  <span>{ABOUT_STUDIO_METADATA.introduction.experienceYears} Software Development Exp</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-zinc-400">
                    <MapPin className="w-3 h-3" />
                    {ABOUT_STUDIO_METADATA.introduction.location}
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
            <div className="flex items-center gap-2 pt-3 pb-2 border-b border-white/5 shrink-0 text-xs font-mono overflow-x-auto select-none">
              <button
                onClick={() => setActiveTab('intro')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'intro'
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold shadow-md shadow-orange-500/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>INTRODUCTION</span>
              </button>
              <button
                onClick={() => setActiveTab('journey')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'journey'
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold shadow-md shadow-orange-500/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>DEVELOPER JOURNEY (5 STAGES)</span>
              </button>
              <button
                onClick={() => setActiveTab('education')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'education'
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold shadow-md shadow-orange-500/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>EDUCATION (MCA & B.SC.)</span>
              </button>
              <button
                onClick={() => setActiveTab('media')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'media'
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold shadow-md shadow-orange-500/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>MEDIA WALL & HIGHLIGHTS</span>
              </button>
            </div>

            {/* Scrollable Tab Content */}
            <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed custom-scrollbar">
              {/* TAB 1: PERSONAL INTRODUCTION */}
              {activeTab === 'intro' && (
                <div className="space-y-4">
                  {/* Hero Intro Card with Approved Profile Image */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-950/20 via-zinc-900 to-zinc-900/80 border border-orange-500/30 flex flex-col md:flex-row items-center gap-5">
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-orange-500/40 shrink-0 shadow-xl shadow-orange-500/10">
                      <Image
                        src={ABOUT_STUDIO_METADATA.introduction.profileImage}
                        alt={ABOUT_STUDIO_METADATA.introduction.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 112px, 128px"
                      />
                    </div>
                    <div className="space-y-2 flex-1 text-center md:text-left">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                          Active Full Stack & Mobile Engineer
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        {ABOUT_STUDIO_METADATA.introduction.name}
                      </h3>
                      <p className="text-xs text-orange-300 font-mono font-semibold">
                        {ABOUT_STUDIO_METADATA.introduction.role} —{' '}
                        {ABOUT_STUDIO_METADATA.introduction.experienceYears} Experience
                      </p>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                        {ABOUT_STUDIO_METADATA.introduction.bio}
                      </p>
                    </div>
                  </div>

                  {/* Core Technical Practice Competencies */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-mono font-bold text-orange-300 uppercase tracking-wider">
                      Core Engineering Competencies (Verified):
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {ABOUT_STUDIO_METADATA.introduction.coreCompetencies.map((comp, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 flex items-start gap-2.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                          <span className="text-xs text-zinc-200">{comp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary Metric Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/10 text-center">
                      <div className="text-lg font-bold font-mono text-orange-400">3.6 Years</div>
                      <div className="text-[10px] font-mono text-zinc-400 uppercase">Software Experience</div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/10 text-center">
                      <div className="text-lg font-bold font-mono text-cyan-400">MCA 72%</div>
                      <div className="text-[10px] font-mono text-zinc-400 uppercase">AI Specialization</div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/10 text-center">
                      <div className="text-lg font-bold font-mono text-emerald-400">B.Sc. CS</div>
                      <div className="text-[10px] font-mono text-zinc-400 uppercase">Honors Graduate</div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/10 text-center">
                      <div className="text-lg font-bold font-mono text-purple-400">Production</div>
                      <div className="text-[10px] font-mono text-zinc-400 uppercase">Enterprise Mobile & Web</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DEVELOPER JOURNEY (5 STAGES) */}
              {activeTab === 'journey' && (
                <div className="space-y-4">
                  {/* Stage Selection Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
                    {ABOUT_STUDIO_METADATA.journeyStages.map((stage) => {
                      const isSelected = selectedJourneyStage.id === stage.id;
                      return (
                        <button
                          key={stage.id}
                          onClick={() => setSelectedJourneyStage(stage)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50 shadow-md shadow-orange-500/10'
                              : 'bg-zinc-900/70 text-zinc-400 hover:text-white border border-white/5'
                          }`}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: stage.themeColor }}
                          />
                          <span>Stage {stage.stageNumber}: {stage.category}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Journey Stage Card */}
                  <div className="p-5 rounded-2xl bg-zinc-900/80 border border-orange-500/30 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase"
                            style={{
                              backgroundColor: `${selectedJourneyStage.themeColor}20`,
                              color: selectedJourneyStage.themeColor,
                              border: `1px solid ${selectedJourneyStage.themeColor}40`,
                            }}
                          >
                            Stage {selectedJourneyStage.stageNumber} // {selectedJourneyStage.period}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mt-1">
                          {selectedJourneyStage.title}
                        </h3>
                      </div>
                      <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-3 py-1 rounded-xl border border-white/10">
                        {selectedJourneyStage.period}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-light">
                      {selectedJourneyStage.summary}
                    </p>

                    {/* Milestones list */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                        Key Milestones & Focus Areas:
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedJourneyStage.milestones.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            className="p-2.5 rounded-xl bg-zinc-950/60 border border-white/5 flex items-start gap-2.5 text-xs text-zinc-300"
                          >
                            <ArrowRight
                              className="w-3.5 h-3.5 shrink-0 mt-0.5"
                              style={{ color: selectedJourneyStage.themeColor }}
                            />
                            <span>{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technologies tags */}
                    <div>
                      <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2">
                        Technologies & Tools:
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedJourneyStage.keyTechnologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-950 border border-white/10 text-zinc-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: EDUCATION (MCA & B.SC.) */}
              {activeTab === 'education' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-orange-950/20 border border-orange-500/30 flex items-center gap-3 font-mono">
                    <GraduationCap className="w-6 h-6 text-orange-400 shrink-0" />
                    <div>
                      <h3 className="text-sm font-bold text-white">Academic Qualifications</h3>
                      <p className="text-xs text-zinc-400">
                        Formal higher education in computer science, software engineering, and artificial intelligence.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ABOUT_STUDIO_METADATA.education.map((edu) => (
                      <div
                        key={edu.id}
                        className="p-5 rounded-2xl bg-zinc-900/70 border border-white/10 hover:border-orange-500/40 transition-all flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase"
                              style={{
                                backgroundColor: `${edu.accentColor}20`,
                                color: edu.accentColor,
                                border: `1px solid ${edu.accentColor}40`,
                              }}
                            >
                              {edu.status}
                            </span>
                            <span className="text-xs font-mono text-zinc-400">{edu.period}</span>
                          </div>

                          <div>
                            <h4 className="text-base font-bold text-white">{edu.degree}</h4>
                            <div className="text-xs font-semibold text-orange-400 mt-0.5 font-mono">
                              {edu.field}
                            </div>
                            <div className="text-xs text-zinc-400 mt-1">{edu.institution}</div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-white/5 flex items-center justify-between font-mono">
                            <span className="text-xs text-zinc-400">Academic Standing:</span>
                            <span
                              className="text-xs font-bold"
                              style={{ color: edu.accentColor }}
                            >
                              {edu.standing}
                            </span>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                              Core Academic Coursework:
                            </div>
                            {edu.coursework.map((course, cIdx) => (
                              <div
                                key={cIdx}
                                className="text-xs text-zinc-300 flex items-start gap-2"
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                  style={{ backgroundColor: edu.accentColor }}
                                />
                                <span>{course}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: MEDIA WALL & HIGHLIGHTS */}
              {activeTab === 'media' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    {/* Left: Media Wall Item Cards */}
                    <div className="lg:col-span-6 space-y-2.5">
                      {ABOUT_STUDIO_METADATA.mediaWallHighlights.map((hl) => {
                        const isSelected = selectedMediaHighlight.id === hl.id;
                        return (
                          <div
                            key={hl.id}
                            onClick={() => setSelectedMediaHighlight(hl)}
                            className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                              isSelected
                                ? 'bg-zinc-900 border-orange-500/60 shadow-lg shadow-orange-500/10'
                                : 'bg-zinc-950/60 hover:bg-zinc-900/60 border-white/5'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase"
                                style={{
                                  backgroundColor: `${hl.accentColor}20`,
                                  color: hl.accentColor,
                                  border: `1px solid ${hl.accentColor}40`,
                                }}
                              >
                                {hl.category}
                              </span>
                              <ArrowRight
                                className={`w-3.5 h-3.5 transition-transform ${
                                  isSelected ? 'text-orange-400 translate-x-1' : 'text-zinc-600'
                                }`}
                              />
                            </div>
                            <h4 className="text-sm font-bold text-white mt-1.5">{hl.title}</h4>
                            <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{hl.tagline}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Right: Detailed Inspection Panel */}
                    <div className="lg:col-span-6 p-5 rounded-2xl bg-zinc-900/80 border border-orange-500/30 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span
                          className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase"
                          style={{
                            backgroundColor: `${selectedMediaHighlight.accentColor}20`,
                            color: selectedMediaHighlight.accentColor,
                            border: `1px solid ${selectedMediaHighlight.accentColor}40`,
                          }}
                        >
                          {selectedMediaHighlight.category}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white">
                          {selectedMediaHighlight.title}
                        </h3>
                        <div
                          className="text-xs font-semibold mt-0.5 font-mono"
                          style={{ color: selectedMediaHighlight.accentColor }}
                        >
                          {selectedMediaHighlight.tagline}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light p-3.5 rounded-xl bg-zinc-950/80 border border-white/5">
                        {selectedMediaHighlight.description}
                      </p>

                      <div>
                        <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                          Related Context:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedMediaHighlight.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-950 border border-white/10 text-zinc-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Bar */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-500 shrink-0">
              <span className="hidden sm:inline">About Me Studio // District 02 Creative Exhibition</span>
              <span className="text-zinc-400">Press [ESC] to return to city</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

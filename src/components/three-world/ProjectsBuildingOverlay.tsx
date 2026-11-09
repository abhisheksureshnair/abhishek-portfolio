'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Layers,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Smartphone,
  Activity,
  CheckCircle2,
  Navigation,
  Bluetooth,
  Lock,
} from 'lucide-react';
import { GithubIcon } from '@/components/Icons';
import { ALL_PROJECTS, Project } from '@/data/portfolioData';

interface ProjectsBuildingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Verified list of portfolio projects
 * Incorporates the verified commercial GPS vehicle & school bus tracking application
 * (TraqInn School Bus Locator / Vehicle Tracking System) alongside all verified builds.
 */
interface DisplayProject extends Project {
  displayTitle: string;
}

export const ProjectsBuildingOverlay: React.FC<ProjectsBuildingOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'AI & WEB' | 'GPS & MOBILE' | 'SYSTEMS & TOOLS'>('ALL');
  const [activeProject, setActiveProject] = useState<DisplayProject | null>(null);

  // Normalize project list with verified display names
  const projectsList: DisplayProject[] = ALL_PROJECTS.map((p) => {
    if (p.id === 'vts-gps-tracking') {
      return {
        ...p,
        displayTitle: 'TraqInn School Bus Locator // Vehicle Tracking System (VTS)',
      };
    }
    return {
      ...p,
      displayTitle: p.title,
    };
  });

  // Filter projects by domain
  const filteredProjects = projectsList.filter((p) => {
    if (selectedFilter === 'AI & WEB') {
      return p.category.includes('FULL STACK') || p.category.includes('AI') || p.category.includes('LLM');
    }
    if (selectedFilter === 'GPS & MOBILE') {
      return p.category.includes('GPS') || p.technologies.includes('Flutter') || p.technologies.includes('React Native');
    }
    if (selectedFilter === 'SYSTEMS & TOOLS') {
      return p.category.includes('SECURITY') || p.category.includes('DEVELOPER TOOL') || p.technologies.includes('Bluetooth BLE');
    }
    return true;
  });

  // ESC key listener to restore city camera
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeProject) {
          setActiveProject(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeProject, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-md font-mono pointer-events-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-slate-950/95 border border-purple-500/30 p-5 sm:p-7 shadow-[0_0_70px_rgba(168,85,247,0.22)] text-white overflow-hidden flex flex-col"
          >
            {/* Ambient Purple & Blue Glow Blobs */}
            <div className="absolute -top-28 -right-28 w-72 h-72 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-28 -left-28 w-72 h-72 rounded-full bg-cyan-600/15 blur-3xl pointer-events-none" />

            {/* Header with Title, Stats & Close Button */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 shrink-0">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs tracking-wider uppercase font-semibold">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>INNOVATION CENTER // VERIFIED PORTFOLIO BUILDS</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>Projects Exhibition</span>
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </h2>
                <p className="text-xs text-purple-200/80">
                  Full-stack platforms, real-time telemetry, cross-platform mobile, hardware IoT & desktop AI
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all active:scale-95"
                title="Back to City (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-3 pb-2 border-b border-white/5 shrink-0 text-xs font-mono">
              {(['ALL', 'AI & WEB', 'GPS & MOBILE', 'SYSTEMS & TOOLS'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedFilter(tab)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    selectedFilter === tab
                      ? 'bg-purple-500/25 text-purple-300 border border-purple-500/40 font-bold shadow-lg shadow-purple-500/15'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Projects Grid Container */}
            <div className="overflow-y-auto pr-1 py-4 font-sans text-xs sm:text-sm text-zinc-300 leading-relaxed custom-scrollbar flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProjects.map((project) => {
                  const isPersonal = project.type === 'personal';

                  return (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition-all flex flex-col justify-between group space-y-3.5"
                    >
                      {/* Top Badges */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              isPersonal
                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            }`}
                          >
                            {isPersonal ? 'Flagship Build' : 'Production Work'}
                          </span>
                          <span className="text-zinc-400">{project.year}</span>
                        </div>

                        {/* Title & Tagline */}
                        <h3 className="text-base font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors">
                          {project.displayTitle}
                        </h3>
                        <p className="text-xs text-zinc-400 leading-normal line-clamp-3">
                          {project.description}
                        </p>
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="space-y-3 pt-1">
                        <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                          {project.technologies.slice(0, 5).map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/5 text-purple-200/90"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 5 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-white/[0.04] text-zinc-400">
                              +{project.technologies.length - 5}
                            </span>
                          )}
                        </div>

                        {/* Actions & Links */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 font-mono text-xs">
                          <div className="flex items-center gap-2">
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all"
                                title="View on GitHub"
                              >
                                <GithubIcon className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {project.confidentialNotice && (
                              <span
                                className="text-[10px] text-zinc-400 inline-flex items-center gap-1"
                                title={project.confidentialNotice}
                              >
                                <Lock className="w-3 h-3 text-amber-400" />
                                <span>Commercial IP</span>
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => setActiveProject(project)}
                            className="px-3 py-1 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
                          >
                            <span>Inspect Spec</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Footer Action */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 shrink-0 font-mono text-xs">
              <div className="text-[11px] text-zinc-400 hidden sm:block">
                Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">ESC</kbd> to return
              </div>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2"
              >
                <span>Back to City</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Deep Project Inspection Modal Drawer */}
            <AnimatePresence>
              {activeProject && (
                <div
                  className="absolute inset-0 z-20 flex flex-col justify-end bg-black/80 backdrop-blur-md p-3 sm:p-5"
                  onClick={() => setActiveProject(null)}
                >
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-h-[85vh] rounded-3xl bg-slate-900 border border-purple-500/40 p-5 sm:p-7 overflow-y-auto space-y-4 text-white shadow-2xl"
                  >
                    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                      <div>
                        <div className="text-[11px] font-mono text-purple-400 font-bold uppercase">
                          {activeProject.category}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white">
                          {activeProject.displayTitle}
                        </h3>
                        <p className="text-xs text-zinc-400 font-mono">{activeProject.role}</p>
                      </div>
                      <button
                        onClick={() => setActiveProject(null)}
                        className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                      {activeProject.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2 pt-1">
                      <h4 className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
                        Key Architecture & Features
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300 font-sans">
                        {activeProject.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Verified Tech Stack */}
                    <div className="space-y-2 pt-1 font-mono">
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        Verified Technology Stack
                      </h4>
                      <div className="flex flex-wrap gap-1.5 text-xs">
                        {activeProject.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* GitHub Link if available */}
                    {activeProject.githubUrl && (
                      <div className="pt-2 font-mono">
                        <a
                          href={activeProject.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold hover:scale-105 transition-all shadow-lg shadow-purple-600/30"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                          <span>View Source on GitHub</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


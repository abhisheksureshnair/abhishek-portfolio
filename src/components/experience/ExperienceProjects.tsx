'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Smartphone, Terminal, ShieldCheck, Sparkles, Building2, UserCheck } from 'lucide-react';
import { EXPERIENCE_DATA, ExperienceProject } from './ExperienceData';
import { ExperienceProjectModal } from './ExperienceProjectModal';
import { useExperienceMode } from './ExperienceModeContext';

export const ExperienceProjects: React.FC = () => {
  const { mode } = useExperienceMode();
  const [filter, setFilter] = useState<'all' | 'professional' | 'personal' | 'mobile' | 'fullstack'>('all');
  const [selectedProject, setSelectedProject] = useState<ExperienceProject | null>(null);

  // Sync filter when global mode changes
  useEffect(() => {
    if (mode === 'mobile') setFilter('mobile');
    else if (mode === 'fullstack') setFilter('fullstack');
    else setFilter('all');
  }, [mode]);

  const filteredProjects = EXPERIENCE_DATA.projects.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'professional') return p.type === 'professional';
    if (filter === 'personal') return p.type === 'personal';
    if (filter === 'mobile') {
      return (
        p.tags.includes('React Native') ||
        p.tags.includes('Flutter') ||
        p.categoryTag.includes('APPLICATION')
      );
    }
    if (filter === 'fullstack') {
      return (
        p.type === 'personal' ||
        p.categoryTag.includes('FULL STACK') ||
        p.categoryTag.includes('AI')
      );
    }
    return true;
  });

  return (
    <section
      id="projects"
      className="relative z-20 min-h-screen bg-[#050505] px-6 py-24 sm:px-12 md:px-20 lg:px-28"
    >
      {/* Background radial glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-amber-500/5 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-amber-400 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>04 / Verified Software Projects</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase">
                Selected <span className="text-amber-400">Projects.</span>
              </h2>
              <p className="mt-3 max-w-2xl text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
                A collection of web, mobile, desktop and AI applications built across professional and independent development work.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-neutral-900/60 p-1.5 backdrop-blur-md">
              <button
                onClick={() => setFilter('all')}
                className={`rounded-full px-4 py-1.5 text-xs font-mono font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-amber-500 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                All Works ({EXPERIENCE_DATA.projects.length})
              </button>

              <button
                onClick={() => setFilter('professional')}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-mono font-medium transition-all ${
                  filter === 'professional'
                    ? 'bg-amber-600 text-white font-bold shadow-[0_0_15px_rgba(217,119,6,0.5)]'
                    : 'text-neutral-400 hover:text-amber-400'
                }`}
              >
                <Building2 className="h-3 w-3" />
                <span>Professional (4)</span>
              </button>

              <button
                onClick={() => setFilter('personal')}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-mono font-medium transition-all ${
                  filter === 'personal'
                    ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(0,229,255,0.5)]'
                    : 'text-neutral-400 hover:text-cyan-400'
                }`}
              >
                <UserCheck className="h-3 w-3" />
                <span>Personal (2)</span>
              </button>

              <button
                onClick={() => setFilter('mobile')}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-mono font-medium transition-all ${
                  filter === 'mobile'
                    ? 'bg-emerald-500 text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                    : 'text-neutral-400 hover:text-emerald-400'
                }`}
              >
                <Smartphone className="h-3 w-3" />
                <span>Mobile (3)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Card Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project, idx) => {
              const isProfessional = project.type === 'professional';

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={`group relative flex flex-col justify-between rounded-2xl border p-8 sm:p-10 backdrop-blur-xl transition-all duration-500 ${
                    isProfessional
                      ? 'border-amber-500/20 bg-neutral-950/70 hover:border-amber-500/60 hover:shadow-[0_0_45px_rgba(245,158,11,0.2)]'
                      : 'border-cyan-500/20 bg-neutral-950/70 hover:border-cyan-400/60 hover:shadow-[0_0_45px_rgba(0,229,255,0.18)]'
                  }`}
                >
                  <div>
                    {/* Meta Header */}
                    <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-6">
                      <span className="flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            isProfessional ? 'text-amber-400' : 'text-cyan-400'
                          }`}
                        >
                          {isProfessional ? '🏢 PROFESSIONAL (INNSPARK)' : '🚀 PERSONAL BUILD'}
                        </span>
                        <span className="text-neutral-600">/</span>
                        <span>{project.categoryTag}</span>
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-neutral-300">
                        {project.year}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className={`text-2xl sm:text-3xl font-bold tracking-tight text-white transition-colors duration-300 mb-4 flex items-center justify-between ${
                        isProfessional
                          ? 'group-hover:text-amber-300'
                          : 'group-hover:text-cyan-300'
                      }`}
                    >
                      <span>{project.title}</span>
                      <ArrowUpRight className="h-6 w-6 text-neutral-500 transition-all duration-300 group-hover:text-amber-400 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-neutral-300 leading-relaxed font-light mb-6">
                      {project.description}
                    </p>

                    {/* Metrics Highlight Pills */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.metrics.map((metric, mIdx) => (
                        <span
                          key={mIdx}
                          className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-mono text-neutral-300"
                        >
                          <ShieldCheck
                            className={`h-3 w-3 ${
                              isProfessional ? 'text-amber-400' : 'text-cyan-400'
                            }`}
                          />
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Tags & Action Button */}
                  <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-mono text-neutral-400 bg-neutral-900/80 px-2 py-0.5 rounded border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => setSelectedProject(project)}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider transition-all ${
                        isProfessional
                          ? 'border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300'
                          : 'border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300'
                      }`}
                    >
                      <Terminal className="h-3.5 w-3.5" />
                      <span>Architecture Case</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Case Study Modal */}
      {selectedProject && (
        <ExperienceProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};

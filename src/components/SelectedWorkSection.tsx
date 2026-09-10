'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, Eye, CheckCircle2, Terminal } from 'lucide-react';
import { SELECTED_PROJECTS, Project } from '../data/portfolioData';
import { GithubIcon } from './Icons';

interface SelectedWorkSectionProps {
  onOpenFlowSyncCaseStudy: () => void;
}

export const SelectedWorkSection: React.FC<SelectedWorkSectionProps> = ({
  onOpenFlowSyncCaseStudy,
}) => {
  return (
    <section id="selected-work" className="py-28 bg-zinc-950 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-3">
              // Flagship Engineering
            </div>
            <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
              Selected Work
            </h2>
          </div>
          <p className="max-w-md text-zinc-400 text-sm font-light leading-relaxed">
            Independent products and systems demonstrating end-to-end full-stack development, mobile engineering, WebSockets real-time sync, and AI integrations.
          </p>
        </div>

        {/* Large Visual Project Presentations */}
        <div className="space-y-16">
          {SELECTED_PROJECTS.map((project, idx) => {
            const isFlagship = project.isFlagship;
            const isFlowSync = project.id === 'flowsync';

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`group relative p-8 sm:p-12 rounded-3xl border transition-all duration-500 overflow-hidden ${
                  isFlagship
                    ? 'bg-gradient-to-b from-indigo-950/30 via-zinc-900/90 to-zinc-950 border-indigo-500/50 shadow-2xl'
                    : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/80'
                }`}
                data-cursor="view"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  
                  {/* Left Column: Information & Story */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-indigo-400">
                        PROJECT {project.number}
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                        {project.category}
                      </span>
                      {isFlagship && (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/30">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>FLAGSHIP CASE STUDY</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-sm font-mono text-indigo-400">
                      {project.tagline}
                    </p>

                    <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
                      {project.description}
                    </p>

                    {/* Highlights Bullet points */}
                    <div className="space-y-2.5 pt-2">
                      {project.highlights.map((hl, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 font-light">
                          <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-6 flex flex-wrap items-center gap-4 border-t border-zinc-800/80">
                      {isFlowSync && (
                        <button
                          onClick={onOpenFlowSyncCaseStudy}
                          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30 transform hover:-translate-y-0.5"
                          data-cursor="pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Full Technical Case Study</span>
                        </button>
                      )}
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono transition-all"
                        data-cursor="pointer"
                      >
                        <GithubIcon className="w-4 h-4" />
                        <span>GitHub Repository</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
                      </a>
                    </div>

                  </div>

                  {/* Right Column: High-Fidelity UI Device Mockup Frame */}
                  <div className="lg:col-span-5">
                    <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-5 shadow-2xl overflow-hidden glass-panel space-y-4 transform group-hover:scale-[1.02] transition-transform duration-500">
                      
                      {/* Top Window Bar */}
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                          <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                          <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                        </div>
                        <span className="text-xs font-mono text-zinc-500">{project.id}.app.local</span>
                      </div>

                      {/* Mockup Dynamic Content Card */}
                      <div className="space-y-3 font-mono text-xs">
                        <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-white font-bold">{project.title} Engine Status</span>
                          </div>
                          <span className="text-emerald-400 font-bold">Active</span>
                        </div>

                        {project.stats?.map((st, i) => (
                          <div key={i} className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-zinc-300">
                            <span>{st.label}</span>
                            <span className="text-indigo-400 font-bold">{st.value}</span>
                          </div>
                        ))}

                        <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 text-[11px] leading-relaxed">
                          <span className="text-indigo-300 block font-bold mb-1">// Product Feature Summary</span>
                          {project.highlights[0]}
                        </div>
                      </div>

                      {isFlowSync && (
                        <button
                          onClick={onOpenFlowSyncCaseStudy}
                          className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-indigo-300 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                        >
                          <Terminal className="w-4 h-4" />
                          <span>Inspect FlowSync Architecture</span>
                        </button>
                      )}

                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

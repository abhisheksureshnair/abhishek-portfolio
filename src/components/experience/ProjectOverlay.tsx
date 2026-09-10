'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Sparkles, CheckCircle2, Terminal, ArrowUpRight, Shield, Radio, Smartphone, Cpu, Building2 } from 'lucide-react';
import { SELECTED_PROJECTS, PROFESSIONAL_EXPERIENCE, PERSONAL_INFO } from '../../data/portfolioData';
import { GithubIcon, LinkedinIcon } from '../Icons';

interface ProjectOverlayProps {
  locationId: string | null;
  onClose: () => void;
  onOpenFlowSyncCaseStudy?: () => void;
}

export const ProjectOverlay: React.FC<ProjectOverlayProps> = ({
  locationId,
  onClose,
  onOpenFlowSyncCaseStudy,
}) => {
  if (!locationId) return null;

  // Resolve location content
  let projectData = SELECTED_PROJECTS.find((p) => p.id === locationId);
  let isInnspark = locationId === 'innspark-hq';
  let isAbout = locationId === 'about-hub';
  let isContact = locationId === 'contact-hub';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto">
        
        {/* Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Cinematic Card Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col font-mono"
        >
          {/* Header Bar */}
          <div className="p-6 sm:p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80 sticky top-0 z-20 backdrop-blur-md">
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">
                // DISTRICT EXPLORATION
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {projectData?.title || (isInnspark ? 'InnSpark Solutions HQ' : isAbout ? 'About Abhishek' : 'Contact Center')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
              aria-label="Close Overlay"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-10 overflow-y-auto space-y-8 flex-1 font-sans">
            
            {/* Project Card */}
            {projectData && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold">
                    {projectData.category}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">{projectData.tagline}</span>
                </div>

                <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
                  {projectData.description}
                </p>

                {/* Features */}
                <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <h4 className="text-xs font-mono uppercase text-indigo-400 font-bold tracking-wider">
                    Core Technical Accomplishments:
                  </h4>
                  {projectData.highlights.map((hl, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300 font-light">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-2">
                  {projectData.stack.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* InnSpark HQ Experience */}
            {isInnspark && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                    COMMERCIAL EXPERIENCE
                  </span>
                  <span className="text-xs font-mono text-zinc-400">{PROFESSIONAL_EXPERIENCE.period}</span>
                </div>

                <h3 className="text-xl font-bold text-white">{PROFESSIONAL_EXPERIENCE.role}</h3>
                <p className="text-sm text-indigo-400 font-semibold">{PROFESSIONAL_EXPERIENCE.company}</p>

                <p className="text-sm text-zinc-300 font-light leading-relaxed">
                  {PROFESSIONAL_EXPERIENCE.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PROFESSIONAL_EXPERIENCE.projects.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                      <h5 className="text-xs font-bold text-white mb-1">{p.title}</h5>
                      <span className="text-[10px] font-mono text-emerald-400 block mb-2">{p.domain}</span>
                      <p className="text-[11px] text-zinc-400 font-light">{p.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About Hub */}
            {isAbout && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">Abhishek S Nair</h3>
                <p className="text-sm text-zinc-300 font-light leading-relaxed">
                  {PERSONAL_INFO.bio}
                </p>
                <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 space-y-2">
                  <div>Status: <strong className="text-emerald-400">{PERSONAL_INFO.availability}</strong></div>
                  <div>Experience: <strong className="text-zinc-200">3+ Years Professional Development</strong></div>
                </div>
              </div>
            )}

            {/* Contact Hub */}
            {isContact && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">Let's Build Something Useful</h3>
                <p className="text-sm text-zinc-300 font-light leading-relaxed">
                  Direct channels to connect with Abhishek:
                </p>
                <div className="space-y-3">
                  <a
                    href={`mailto:${PERSONAL_INFO.email}`}
                    className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between hover:border-zinc-700 transition-colors"
                  >
                    <span className="text-xs font-mono text-white">Email: {PERSONAL_INFO.email}</span>
                    <ArrowUpRight className="w-4 h-4 text-indigo-400" />
                  </a>
                  <a
                    href={PERSONAL_INFO.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between hover:border-zinc-700 transition-colors"
                  >
                    <span className="text-xs font-mono text-white">GitHub: github.com/abhisheksureshnair</span>
                    <ArrowUpRight className="w-4 h-4 text-indigo-400" />
                  </a>
                  <a
                    href={PERSONAL_INFO.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between hover:border-zinc-700 transition-colors"
                  >
                    <span className="text-xs font-mono text-white">LinkedIn: linkedin.com/in/abhisheksnair</span>
                    <ArrowUpRight className="w-4 h-4 text-indigo-400" />
                  </a>
                </div>
              </div>
            )}

          </div>

          {/* Footer CTAs */}
          <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-500">Verified Portfolio Data</span>
            <div className="flex items-center gap-3">
              {projectData?.id === 'flowsync' && onOpenFlowSyncCaseStudy && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenFlowSyncCaseStudy();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                >
                  Open Full Case Study
                </button>
              )}
              {projectData?.githubUrl && (
                <a
                  href={projectData.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono flex items-center gap-2 transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-mono hover:text-white"
              >
                Close
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

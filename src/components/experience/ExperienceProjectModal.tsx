'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ShieldCheck, Tag, Calendar, User, Cpu } from 'lucide-react';
import { GithubIcon } from '../Icons';
import { ExperienceProject } from './ExperienceData';

interface ExperienceProjectModalProps {
  project: ExperienceProject;
  onClose: () => void;
}

export const ExperienceProjectModal: React.FC<ExperienceProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const isProfessional = project.type === 'professional';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/15 bg-[#0a0a0a] p-6 sm:p-10 shadow-[0_0_80px_rgba(245,158,11,0.15)] z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 rounded-full border border-white/10 bg-white/5 p-2 text-neutral-400 transition-colors hover:border-amber-500 hover:bg-amber-500/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="mb-8 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono uppercase tracking-widest ${
                  isProfessional
                    ? 'border border-amber-500/40 bg-amber-500/10 text-amber-300'
                    : 'border border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                }`}
              >
                <Cpu className="h-3.5 w-3.5" />
                {project.categoryTag}
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-mono text-neutral-400">
                {isProfessional ? 'EMPLOYMENT PROJECT' : 'INDEPENDENT BUILD'}
              </span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {project.title}
            </h3>

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                {project.year}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-amber-400" />
                {project.deliveryContext}
              </span>
            </div>
          </div>

          {/* Deep Dive Content */}
          <div className="space-y-6 text-neutral-300">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">
                Executive Architecture &amp; Delivery
              </h4>
              <p className="text-base sm:text-lg font-light leading-relaxed">
                {project.longDescription}
              </p>
            </div>

            {/* Performance Metrics */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3">
                Key Technical Achievements
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {project.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm font-mono text-white"
                  >
                    <ShieldCheck className="h-4 w-4 text-amber-400 flex-shrink-0" />
                    <span>{metric}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3">
                Verified Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-neutral-900 px-3 py-1.5 text-xs font-mono text-neutral-300"
                  >
                    <Tag className="h-3 w-3 text-amber-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 hover:border-amber-400 px-4 py-2 text-xs font-mono text-white transition-all"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>View Repository</span>
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="rounded-full bg-amber-500 px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-black transition-all hover:bg-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]"
            >
              Close Details
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

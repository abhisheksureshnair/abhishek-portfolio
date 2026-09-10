'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Calendar, MapPin, CheckCircle2, ChevronDown, Radio, Smartphone, Shield, Bluetooth } from 'lucide-react';
import { PROFESSIONAL_EXPERIENCE, PERSONAL_INFO } from '../data/portfolioData';

export const ExperienceSection: React.FC = () => {
  const [expandedProjId, setExpandedProjId] = useState<string | null>(null);

  const toggleProjectExpand = (id: string) => {
    setExpandedProjId(expandedProjId === id ? null : id);
  };

  const projectIcons: Record<string, any> = {
    'prof-telemedicine': Smartphone,
    'prof-fleet-tracking': Radio,
    'prof-safenet': Shield,
    'prof-ble-debugger': Bluetooth,
  };

  return (
    <section id="experience" className="py-24 bg-zinc-950 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-16">
          <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-3">
            // Career Track
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Professional Experience
          </h2>
          <p className="mt-3 text-zinc-400 text-sm max-w-xl font-light">
            Commercial software development at InnSpark Solutions Pvt. Ltd., engineering production mobile applications, real-time telemetry platforms, and hardware IoT solutions.
          </p>
        </div>

        {/* Experience Timeline Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-10 rounded-3xl bg-zinc-900/60 border border-zinc-800 shadow-2xl glass-panel relative overflow-hidden mb-16"
        >
          {/* Top Company Info Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-zinc-800 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                  FULL-TIME ROLE
                </span>
                <span className="text-xs font-mono text-zinc-500">{PROFESSIONAL_EXPERIENCE.type}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {PROFESSIONAL_EXPERIENCE.role}
              </h3>
              <p className="text-lg font-semibold text-indigo-400 mt-1">
                {PROFESSIONAL_EXPERIENCE.company}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:items-end gap-3 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>{PROFESSIONAL_EXPERIENCE.period}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>{PERSONAL_INFO.location}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed mb-8">
            {PROFESSIONAL_EXPERIENCE.description}
          </p>

          {/* Key Achievements */}
          <h4 className="text-xs font-mono uppercase text-zinc-500 tracking-wider mb-6">
            Key Achievements & Engineering Responsibilities:
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {PROFESSIONAL_EXPERIENCE.achievements.map((ach, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800/90 flex items-start gap-3.5"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                  {ach}
                </span>
              </div>
            ))}
          </div>

        </motion.div>

        {/* Commercial Production Projects Expandable Story Rows */}
        <div>
          <h3 className="text-xs font-mono uppercase text-indigo-400 tracking-widest mb-6">
            // Commercial Projects Delivered at InnSpark Solutions
          </h3>

          <div className="space-y-4">
            {PROFESSIONAL_EXPERIENCE.projects.map((proj) => {
              const Icon = projectIcons[proj.id] || Radio;
              const isExpanded = expandedProjId === proj.id;

              return (
                <div
                  key={proj.id}
                  className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all"
                >
                  <button
                    onClick={() => toggleProjectExpand(proj.id)}
                    className="w-full text-left flex items-center justify-between group"
                    data-cursor="pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block mb-1">
                          {proj.domain} • Production Application
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {proj.title}
                        </h4>
                      </div>
                    </div>

                    <ChevronDown
                      className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180 text-indigo-400' : 'group-hover:text-zinc-300'
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden pt-4 mt-4 border-t border-zinc-800/60 space-y-4"
                      >
                        <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                          {proj.summary}
                        </p>

                        <div className="space-y-2">
                          {proj.keyContributions.map((c, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                              <span>{c}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {proj.tech.map((t) => (
                            <span key={t} className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-400">
                              {t}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

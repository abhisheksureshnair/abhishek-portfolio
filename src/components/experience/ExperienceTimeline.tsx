'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Code } from 'lucide-react';
import { EXPERIENCE_DATA } from './ExperienceData';

export const ExperienceTimeline: React.FC = () => {
  return (
    <section
      id="journey"
      className="relative z-20 bg-[#050505] px-6 py-24 sm:px-12 md:px-20 lg:px-28 border-t border-white/10"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-neutral-300 backdrop-blur-md">
            <Briefcase className="h-3.5 w-3.5 text-amber-400" />
            <span>06 / Verified Professional Career &amp; Education</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase">
            Experience &amp; <span className="text-amber-400">Milestones.</span>
          </h2>
          <p className="max-w-xl text-base text-neutral-400 font-light leading-relaxed">
            Directly sourced from actual employment records and verified academic degrees.
          </p>
        </div>

        {/* Timeline List */}
        <div className="space-y-6">
          {EXPERIENCE_DATA.experience.map((exp, idx) => (
            <motion.div
              key={exp.period + idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="rounded-2xl p-6 sm:p-8 border border-white/10 bg-neutral-950/70 backdrop-blur-md hover:border-amber-500/40 transition-all duration-300 flex flex-col md:flex-row md:items-start justify-between gap-6"
            >
              <div className="md:w-1/3">
                <span className="inline-block rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-mono text-amber-300 font-semibold">
                  {exp.period}
                </span>
                <div className="mt-3 text-sm font-semibold text-white">{exp.organization}</div>
                <div className="mt-1 text-xs font-mono text-neutral-400">{exp.badge}</div>
              </div>

              <div className="md:w-2/3 space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center justify-between">
                  <span>{exp.role}</span>
                </h3>
                <p className="text-sm text-neutral-300 font-light leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

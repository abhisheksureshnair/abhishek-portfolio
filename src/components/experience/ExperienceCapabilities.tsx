'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Terminal, Sparkles, Cpu, Flame } from 'lucide-react';
import { EXPERIENCE_DATA } from './ExperienceData';

export const ExperienceCapabilities: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section
      id="capabilities"
      className="relative z-20 bg-[#050505] px-6 py-24 sm:px-12 md:px-20 lg:px-28 border-t border-white/10"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-neutral-300 backdrop-blur-md">
            <Cpu className="h-3.5 w-3.5 text-amber-400" />
            <span>05 / Technical Capabilities Matrix</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase">
            Engineering <span className="text-amber-400">Capabilities.</span>
          </h2>

          <p className="max-w-2xl text-base text-neutral-400 font-light leading-relaxed">
            Full-stack web architectures, cross-platform application systems, real-time telemetry, and AI/LLM integrations.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-3 border-b border-white/10 pb-6 mb-10">
          {EXPERIENCE_DATA.capabilities.map((cat, idx) => {
            const isMobile = cat.type === 'mobile';
            const isFullstack = cat.type === 'fullstack';
            const isActive = activeTab === idx;

            return (
              <button
                key={cat.title}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-mono font-medium transition-all duration-300 ${
                  isActive
                    ? isMobile
                      ? 'bg-amber-600 text-white shadow-[0_0_20px_rgba(217,119,6,0.5)]'
                      : isFullstack
                      ? 'bg-cyan-500 text-black font-semibold shadow-[0_0_20px_rgba(0,229,255,0.5)]'
                      : 'bg-emerald-500 text-black font-semibold shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                    : 'border border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {isMobile && <Smartphone className="h-3.5 w-3.5" />}
                {isFullstack && <Terminal className="h-3.5 w-3.5" />}
                {!isMobile && !isFullstack && <Sparkles className="h-3.5 w-3.5" />}
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {EXPERIENCE_DATA.capabilities[activeTab].skills.map((skill, sIdx) => {
            const isMobile = EXPERIENCE_DATA.capabilities[activeTab].type === 'mobile';
            const isFullstack = EXPERIENCE_DATA.capabilities[activeTab].type === 'fullstack';

            return (
              <div
                key={skill.name}
                className={`rounded-xl p-6 border bg-neutral-950/70 backdrop-blur-md transition-all duration-300 flex flex-col justify-between ${
                  isMobile
                    ? 'border-amber-500/20 hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]'
                    : isFullstack
                    ? 'border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(0,229,255,0.15)]'
                    : 'border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <Flame
                        className={`h-4 w-4 ${
                          isMobile
                            ? 'text-amber-500'
                            : isFullstack
                            ? 'text-cyan-400'
                            : 'text-emerald-400'
                        }`}
                      />
                      {skill.name}
                    </h4>

                    <span
                      className={`text-xs font-mono font-bold ${
                        isMobile
                          ? 'text-amber-400'
                          : isFullstack
                          ? 'text-cyan-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {skill.level}%
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 font-mono mb-4">{skill.note}</p>
                </div>

                {/* Progress bar indicator */}
                <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 0.8, delay: sIdx * 0.08 }}
                    className={`h-full rounded-full ${
                      isMobile
                        ? 'bg-gradient-to-r from-amber-600 to-orange-500'
                        : isFullstack
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                        : 'bg-gradient-to-r from-teal-500 to-emerald-400'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

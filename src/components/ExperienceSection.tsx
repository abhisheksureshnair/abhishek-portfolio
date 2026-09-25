'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, CheckCircle2, Smartphone, Radio, Shield, Bluetooth, Layers, Building2 } from 'lucide-react';
import { PROFESSIONAL_EXPERIENCE_DATA, PERSONAL_INFO } from '../data/portfolioData';

export const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="py-32 bg-[#030508] relative border-t border-white/5 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-cinematic-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <span>// 02. PROFESSIONAL EMPLOYMENT TIMELINE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Professional Experience
          </h2>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base font-light max-w-2xl leading-relaxed">
            Contributing to software development projects involving application development, feature implementation, integrations, debugging, testing and technical problem solving.
          </p>
        </div>

        {/* Experience Timeline Card */}
        <div className="relative">
          
          {/* Main Employment Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-zinc-900/80 via-zinc-950 to-black border border-white/10 shadow-2xl relative overflow-hidden"
          >
            {/* Top Bar: Role, Company, Period */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-8 mb-8 border-b border-white/10 gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    OFFICIAL COMPANY DESIGNATION
                  </span>
                  <span className="text-xs font-mono text-cyan-300 uppercase tracking-wider font-semibold">
                    Area: {PROFESSIONAL_EXPERIENCE_DATA.department}
                  </span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {PROFESSIONAL_EXPERIENCE_DATA.officialTitle}
                </h3>
                <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mt-1 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  <span>{PROFESSIONAL_EXPERIENCE_DATA.company}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-300">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>{PROFESSIONAL_EXPERIENCE_DATA.period}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>{PROFESSIONAL_EXPERIENCE_DATA.location}</span>
                </div>
              </div>
            </div>

            {/* Description Paragraph */}
            <p className="text-base text-zinc-300 font-light leading-relaxed mb-10 max-w-4xl">
              {PROFESSIONAL_EXPERIENCE_DATA.description}
            </p>

            {/* Key Metrics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {PROFESSIONAL_EXPERIENCE_DATA.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="p-5 rounded-2xl bg-zinc-950/80 border border-white/5 space-y-1.5"
                >
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                    Verified Record
                  </span>
                  <p className="font-mono text-2xl sm:text-3xl font-black text-white">
                    {metric.value}
                  </p>
                  <p className="text-xs font-mono text-zinc-400 uppercase">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Engineering Responsibilities & Verified Deliveries */}
            <div>
              <h4 className="text-xs font-mono uppercase text-indigo-300 tracking-widest mb-6 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Professional Responsibilities & Engineering Deliveries:</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROFESSIONAL_EXPERIENCE_DATA.responsibilities.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-zinc-900/40 border border-white/5 flex items-start gap-3.5 hover:border-indigo-500/30 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Production Domains */}
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs font-mono text-zinc-500 uppercase">
                Production Domains Handled at InnSpark:
              </span>
              <div className="flex flex-wrap gap-2">
                {PROFESSIONAL_EXPERIENCE_DATA.domains.map((dom) => (
                  <span
                    key={dom}
                    className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300"
                  >
                    {dom}
                  </span>
                ))}
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};

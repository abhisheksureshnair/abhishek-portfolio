'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Milestone, 
  GraduationCap, 
  Award, 
  Sparkles, 
  Calendar, 
  Building, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { JOURNEY_TIMELINE, EDUCATION_DATA, CERTIFICATIONS_DATA } from '../data/portfolioData';

export const JourneyEducationSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'journey' | 'education' | 'certifications'>('journey');

  return (
    <section id="journey" className="py-32 bg-[#030508] relative border-t border-white/5 overflow-hidden">
      
      {/* Background Radiance */}
      <div className="absolute top-1/2 right-10 w-[550px] h-[550px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-cinematic-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Milestone className="w-4 h-4 text-cyan-400" />
              <span>// 06. MILESTONES & CREDENTIALS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Developer Journey & Credentials
            </h2>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-950 border border-white/10">
            <button
              onClick={() => setActiveTab('journey')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === 'journey'
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
              data-cursor="pointer"
            >
              <Milestone className="w-3.5 h-3.5" />
              <span>Journey (4)</span>
            </button>

            <button
              onClick={() => setActiveTab('education')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === 'education'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
              data-cursor="pointer"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Education (2)</span>
            </button>

            <button
              onClick={() => setActiveTab('certifications')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === 'certifications'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
              data-cursor="pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Certifications (4)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Panels */}
        <AnimatePresence mode="wait">
          
          {/* 1. DEVELOPER JOURNEY TIMELINE */}
          {activeTab === 'journey' && (
            <motion.div
              key="journey-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              {/* Vertical connecting line */}
              <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-indigo-500 via-cyan-400 to-purple-500 -translate-x-1/2 hidden sm:block opacity-40" />

              <div className="space-y-12">
                {JOURNEY_TIMELINE.map((item, idx) => {
                  const isEven = idx % 2 === 0;

                  return (
                    <div
                      key={item.period}
                      className={`relative flex flex-col sm:flex-row items-center gap-8 ${
                        isEven ? 'sm:flex-row-reverse' : ''
                      }`}
                    >
                      {/* Content Card */}
                      <div className="w-full sm:w-1/2">
                        <div className="p-8 rounded-3xl bg-zinc-950/80 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 shadow-xl space-y-4">
                          
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold">
                              {item.period}
                            </span>
                            {item.badge && (
                              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                                {item.badge}
                              </span>
                            )}
                          </div>

                          <div>
                            <h3 className="text-xl font-extrabold text-white">
                              {item.title}
                            </h3>
                            <p className="text-xs font-mono text-zinc-400 mt-1 flex items-center gap-1.5">
                              <Building className="w-3.5 h-3.5 text-indigo-400" />
                              <span>{item.organization}</span>
                            </p>
                          </div>

                          <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                            {item.description}
                          </p>

                        </div>
                      </div>

                      {/* Center Node Marker */}
                      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#030508] border-2 border-indigo-500 shadow-lg shadow-indigo-500/50 flex items-center justify-center z-10 hidden sm:flex">
                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                      </div>

                      {/* Empty balance spacer */}
                      <div className="w-full sm:w-1/2 hidden sm:block" />

                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 2. EDUCATION SECTION */}
          {activeTab === 'education' && (
            <motion.div
              key="education-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {EDUCATION_DATA.map((edu) => (
                <div
                  key={edu.id}
                  className="p-8 rounded-3xl bg-gradient-to-b from-zinc-900/60 via-zinc-950 to-black border border-white/10 hover:border-indigo-500/40 transition-all shadow-2xl flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
                        {edu.period}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        {edu.degree}
                      </h3>
                      <p className="text-sm font-semibold text-cyan-300 mt-1">
                        {edu.institution}
                      </p>
                    </div>

                    {edu.specialization && (
                      <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                        {edu.specialization}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500">Degree Status</span>
                    <span className="text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {edu.status}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* 3. CERTIFICATIONS SECTION */}
          {activeTab === 'certifications' && (
            <motion.div
              key="certifications-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {CERTIFICATIONS_DATA.map((cert) => (
                <div
                  key={cert.id}
                  className="p-8 rounded-3xl bg-zinc-950/80 border border-white/10 hover:border-purple-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-6 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-purple-950/50 border border-purple-500/30 text-purple-400 group-hover:scale-110 transition-transform">
                        <Award className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono text-zinc-400">
                        Issued {cert.issued}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block mb-1">
                        {cert.issuer} • {cert.category}
                      </span>
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                        {cert.title}
                      </h3>
                    </div>

                    {/* Verified Competencies */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {cert.skillsCovered.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/5 text-[11px] font-mono text-zinc-300 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          <span>{skill}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-500">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      Verified Credential
                    </span>
                    <span>{cert.issuer}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </section>
  );
};

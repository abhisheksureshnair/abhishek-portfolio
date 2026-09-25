'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  Smartphone, 
  Server, 
  Database, 
  Cpu, 
  Radio, 
  Monitor, 
  Terminal, 
  Sparkles,
  Layers,
  Shield,
  FileCode
} from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';

export const TechnologyUniverse: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categoryIcons: Record<string, any> = {
    FRONTEND: Code,
    BACKEND: Server,
    'MOBILE & CROSS-PLATFORM': Smartphone,
    DATABASES: Database,
    'AI & GENERATIVE AI': Cpu,
    'APIS & INTEGRATIONS': Radio,
    'DESKTOP & CROSS-PLATFORM': Monitor,
    TOOLS: Terminal,
    'AI DEVELOPMENT TOOLS': Sparkles,
  };

  const categoryAccents: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    FRONTEND: { bg: 'from-blue-500/10 to-indigo-500/10', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
    BACKEND: { bg: 'from-emerald-500/10 to-green-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
    'MOBILE & CROSS-PLATFORM': { bg: 'from-cyan-500/10 to-teal-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
    DATABASES: { bg: 'from-yellow-500/10 to-amber-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
    'AI & GENERATIVE AI': { bg: 'from-purple-500/10 to-pink-500/10', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
    'APIS & INTEGRATIONS': { bg: 'from-indigo-500/10 to-cyan-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400', glow: 'shadow-indigo-500/20' },
    'DESKTOP & CROSS-PLATFORM': { bg: 'from-violet-500/10 to-purple-500/10', border: 'border-violet-500/30', text: 'text-violet-400', glow: 'shadow-violet-500/20' },
    TOOLS: { bg: 'from-zinc-500/10 to-slate-500/10', border: 'border-zinc-500/30', text: 'text-zinc-300', glow: 'shadow-zinc-500/20' },
    'AI DEVELOPMENT TOOLS': { bg: 'from-fuchsia-500/10 to-indigo-500/10', border: 'border-fuchsia-500/30', text: 'text-fuchsia-400', glow: 'shadow-fuchsia-500/20' },
  };

  const displayedCategories = selectedCategory === 'ALL'
    ? SKILL_CATEGORIES
    : SKILL_CATEGORIES.filter((cat) => cat.category === selectedCategory);

  return (
    <section id="stack" className="py-32 bg-[#030508] relative border-t border-white/5 overflow-hidden">
      
      {/* Background Radiance & Circuit Lines */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute inset-0 bg-cinematic-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>// 04. VERIFIED TECHNICAL TOOLSET</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Technology Universe
            </h2>
          </div>
          <p className="max-w-md text-zinc-400 text-sm font-light leading-relaxed">
            Verified technical competencies across programming languages, frontend, cross-platform mobile, backend APIs, databases, AI/LLMs, and developer tooling.
          </p>
        </div>

        {/* Orbit Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-12">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-zinc-950/80 border border-white/10 text-zinc-400 hover:text-white'
            }`}
            data-cursor="pointer"
          >
            All Categories ({SKILL_CATEGORIES.length})
          </button>
          {SKILL_CATEGORIES.map((item) => {
            const isSelected = selectedCategory === item.category;
            const Icon = categoryIcons[item.category] || Layers;
            return (
              <button
                key={item.category}
                onClick={() => setSelectedCategory(item.category)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-zinc-950/80 border border-white/10 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
                data-cursor="pointer"
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.category}</span>
              </button>
            );
          })}
        </div>

        {/* Technology Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {displayedCategories.map((group, index) => {
              const Icon = categoryIcons[group.category] || Layers;
              const accent = categoryAccents[group.category] || categoryAccents['FRONTEND'];

              return (
                <motion.div
                  key={group.category}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  className={`group p-6 rounded-3xl bg-gradient-to-b ${accent.bg} via-zinc-950/90 to-black border ${accent.border} shadow-xl hover:${accent.glow} transition-all duration-300 flex flex-col justify-between relative overflow-hidden`}
                  data-cursor="pointer"
                >
                  {/* Subtle top light edge */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  <div>
                    {/* Category Title & Icon */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-2xl bg-zinc-900 border border-white/10 ${accent.text} group-hover:scale-110 transition-transform`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                            CATEGORY 0{index + 1}
                          </span>
                          <h3 className="text-sm font-black font-mono tracking-wider text-white">
                            {group.category}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Explanatory description if provided (e.g. for Mobile) */}
                    {group.description && (
                      <p className="text-[11px] font-mono text-cyan-300/90 mb-3 bg-cyan-950/30 p-2.5 rounded-xl border border-cyan-500/20">
                        {group.description}
                      </p>
                    )}

                    {/* Floating Nodes Pills */}
                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <motion.span
                          key={skill}
                          whileHover={{ scale: 1.05 }}
                          className="px-3 py-1.5 rounded-xl bg-zinc-950/90 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white hover:border-indigo-500/50 transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-70" />
                          <span>{skill}</span>
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Node Bottom Telemetry Status */}
                  <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>{group.skills.length} VERIFIED ITEMS</span>
                    <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      VERIFIED
                    </span>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

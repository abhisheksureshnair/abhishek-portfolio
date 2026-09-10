'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Code, Smartphone, Server, Database, Cpu, Radio, Monitor, Terminal } from 'lucide-react';
import { TECHNICAL_TOOLBOX } from '../data/portfolioData';

export const TechnicalToolboxSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const allToolboxSkills = TECHNICAL_TOOLBOX.flatMap((c) =>
    c.skills.map((s) => ({ name: s, category: c.category }))
  );

  const categoryIcons: Record<string, any> = {
    FRONTEND: Code,
    MOBILE: Smartphone,
    BACKEND: Server,
    DATABASE: Database,
    'AI & ML': Cpu,
    INTEGRATIONS: Radio,
    DESKTOP: Monitor,
    'TOOLS & DEVOPS': Terminal,
  };

  const displayedSkills =
    activeCategory === 'All'
      ? allToolboxSkills
      : allToolboxSkills.filter((s) => s.category === activeCategory);

  return (
    <section id="toolbox" className="py-24 bg-zinc-950 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-3">
              // Technical Stack
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Technical Toolbox
            </h2>
          </div>
          <p className="max-w-md text-zinc-400 text-sm font-light leading-relaxed">
            A single unified catalog of languages, frameworks, databases, and engineering tools I utilize in production software.
          </p>
        </div>

        {/* Filter Categories Bar */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              activeCategory === 'All'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
            data-cursor="pointer"
          >
            All Stack ({allToolboxSkills.length})
          </button>
          {TECHNICAL_TOOLBOX.map((cat) => {
            const isActive = activeCategory === cat.category;
            return (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
                data-cursor="pointer"
              >
                {cat.category}
              </button>
            );
          })}
        </div>

        {/* Category Cards Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TECHNICAL_TOOLBOX.map((group) => {
            const Icon = categoryIcons[group.category] || Wrench;
            return (
              <div
                key={group.category}
                className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-zinc-800 text-indigo-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white tracking-wider font-mono">
                      {group.category}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

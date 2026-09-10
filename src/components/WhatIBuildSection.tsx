'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Smartphone, Server, Bot, Radio, CheckCircle2 } from 'lucide-react';
import { WHAT_I_BUILD } from '../data/portfolioData';

export const WhatIBuildSection: React.FC = () => {
  const icons = [Globe, Smartphone, Server, Bot, Radio];

  return (
    <section id="what-i-build" className="py-24 bg-zinc-950 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-3">
              // Editorial Focus
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              What I Build
            </h2>
          </div>
          <p className="max-w-md text-zinc-400 text-sm font-light leading-relaxed">
            I build end-to-end digital software across web interfaces, cross-platform mobile apps, real-time servers, and generative AI integrations.
          </p>
        </div>

        {/* 5 Editorial Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHAT_I_BUILD.map((item, idx) => {
            const Icon = icons[idx] || Globe;
            return (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 hover:border-indigo-500/50 hover:bg-zinc-900/70 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-sm font-bold text-zinc-600 group-hover:text-indigo-400 transition-colors">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white mb-2 tracking-tight group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-zinc-300 font-semibold mb-3">
                    {item.summary}
                  </p>

                  <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6">
                    {item.details}
                  </p>
                </div>

                <div className="pt-6 border-t border-zinc-800/60 flex flex-wrap gap-1.5">
                  {item.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

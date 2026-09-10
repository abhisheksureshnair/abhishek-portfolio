'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, ArrowUpRight, Code2, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from './Icons';
import { PERSONAL_INFO, SELECTED_PROJECTS } from '../data/portfolioData';

export const GithubSection: React.FC = () => {
  return (
    <section className="py-24 bg-zinc-950 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-3">
              // Open Source & Activity Proof
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              GitHub Engineering Activity
            </h2>
          </div>
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-indigo-500/50 text-white text-xs font-semibold tracking-wide transition-all w-fit"
            data-cursor="pointer"
          >
            <GithubIcon className="w-4 h-4 text-indigo-400" />
            <span>@abhisheksureshnair on GitHub</span>
            <ArrowUpRight className="w-4 h-4 text-zinc-500" />
          </a>
        </div>

        {/* Profile Stats Summary Box */}
        <div className="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 mb-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
            <span className="text-xs font-mono text-zinc-500 block mb-1">Public Repositories</span>
            <span className="text-3xl font-extrabold text-white font-mono">15+</span>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
            <span className="text-xs font-mono text-zinc-500 block mb-1">Primary Languages</span>
            <span className="text-3xl font-extrabold text-indigo-400 font-mono">JS / Dart / Python</span>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
            <span className="text-xs font-mono text-zinc-500 block mb-1">Architectures</span>
            <span className="text-3xl font-extrabold text-cyan-400 font-mono">Web / App / AI</span>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
            <span className="text-xs font-mono text-zinc-500 block mb-1">Verified Account</span>
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-mono text-emerald-400 font-bold">Active Engineer</span>
            </div>
          </div>
        </div>

        {/* Verified GitHub Repositories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SELECTED_PROJECTS.map((repo) => (
            <a
              key={repo.id}
              href={repo.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-300 flex flex-col justify-between"
              data-cursor="pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {repo.title}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                </div>
                <p className="text-xs text-zinc-400 font-light leading-relaxed mb-4 line-clamp-2">
                  {repo.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-500">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  {repo.stack[0]}
                </span>
                <span>GitHub Public Repo</span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};

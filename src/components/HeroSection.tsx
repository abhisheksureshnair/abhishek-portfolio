'use client';

import React from 'react';
import { ProtectedImage } from './ProtectedImage';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { HeroCanvas } from './HeroCanvas';
import { GithubIcon, LinkedinIcon } from './Icons';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-noise">
      {/* Interactive Hero Canvas */}
      <HeroCanvas />

      {/* Ambient Radial Gradient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-start justify-center">
        
        {/* Availability Pill & Headshot Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-4 mb-6"
        >
          {/* Headshot Thumbnail Badge */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-indigo-500/40 shadow-xl shadow-indigo-500/20 flex-shrink-0">
            <ProtectedImage
              alt="Abhishek S Nair"
              className="w-full h-full"
              objectFit="cover"
              objectPosition="top"
            />
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono tracking-wider text-zinc-300 uppercase">
              Full-Stack Developer • Web, Mobile & AI
            </span>
          </div>
          <span className="hidden sm:inline-block text-xs font-mono text-zinc-500">
            3+ Yrs Professional Exp
          </span>
        </motion.div>

        {/* Primary Name & Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-2 mb-6"
        >
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-none">
            ABHISHEK S NAIR
          </h1>
          <p className="text-2xl sm:text-4xl font-light tracking-wide text-zinc-400">
            Full-Stack Developer <span className="animate-shimmer font-semibold">building Web, Mobile & AI</span> products.
          </p>
        </motion.div>

        {/* Short Human Supporting Statement */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-base sm:text-lg text-zinc-400 font-light leading-relaxed mb-8"
        >
          I build scalable digital products across web, mobile, backend and AI. From reactive web applications and production mobile apps to real-time WebSockets telemetry and LLM integrations.
        </motion.p>

        {/* Action Buttons & Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
        >
          {/* Primary CTA */}
          <a
            href="#selected-work"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5"
            data-cursor="pointer"
          >
            <span>VIEW SELECTED WORK</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          {/* Social Icons Bar */}
          <div className="flex items-center gap-3 ml-0 sm:ml-4 pt-2 sm:pt-0">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all"
              data-cursor="pointer"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all"
              data-cursor="pointer"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              aria-label="Email Abhishek"
              className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all"
              data-cursor="pointer"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* Quick Engineering Proof Numbers Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-white/5 w-full grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {PERSONAL_INFO.stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                {stat.value}
              </span>
              <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

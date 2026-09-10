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

        {/* Mission-status / engineering proof strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, delay: 0.15, ease: 'easeOut' }}
          className="relative mt-16 w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 shadow-[0_24px_80px_-28px_rgba(79,70,229,0.6)] backdrop-blur-xl"
        >
          {/* Technical grid, scanline, and ambient accent details */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(34,211,238,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.07)_1px,transparent_1px)] [background-size:24px_24px]"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-indigo-500/10 via-cyan-400/5 to-transparent blur-2xl" />
          <motion.div
            aria-hidden="true"
            animate={{ x: ['-120%', '260%'] }}
            transition={{ duration: 5.5, repeat: Infinity, repeatDelay: 2.5, ease: 'linear' }}
            className="pointer-events-none absolute top-0 h-full w-24 -skew-x-12 bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent"
          />

          <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-3 sm:px-7">
            <div className="flex items-center gap-2 text-[9px] font-mono font-semibold uppercase tracking-[0.24em] text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.9)]" />
              Mission telemetry
            </div>
            <div className="flex items-center gap-2 text-[9px] font-mono font-semibold uppercase tracking-[0.18em] text-emerald-300/90">
              <span className="hidden sm:inline text-zinc-600">SYSTEM STATUS //</span>
              Active
            </div>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-[0.9fr_0.9fr_1.5fr]">
            {PERSONAL_INFO.stats.filter((stat) => stat.isNumeric).map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.12 }}
                className={`group relative px-5 py-6 sm:px-7 sm:py-8 ${idx > 0 ? 'border-t border-white/10 md:border-l md:border-t-0' : ''}`}
              >
                <div className="mb-4 flex items-center justify-between text-[9px] font-mono font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  <span>{idx === 0 ? 'Experience' : 'Production'}</span>
                  <span className="text-cyan-300/70">0{idx + 1}</span>
                </div>
                <div className="flex items-end gap-3">
                  <span className="font-mono text-6xl font-black leading-none tracking-[-0.1em] text-white drop-shadow-[0_0_24px_rgba(99,102,241,0.35)] sm:text-7xl">
                    {stat.value}
                  </span>
                  <span className="mb-1 max-w-24 text-[10px] font-mono uppercase leading-relaxed tracking-[0.14em] text-zinc-400">
                    {stat.label}
                  </span>
                </div>
                <div className="mt-5 h-px w-full overflow-hidden bg-white/10">
                  <motion.div
                    animate={{ x: ['-100%', '220%'] }}
                    transition={{ duration: 3.5 + idx, repeat: Infinity, repeatDelay: 1.5, ease: 'linear' }}
                    className="h-px w-1/2 bg-gradient-to-r from-transparent via-cyan-300 to-transparent"
                  />
                </div>
              </motion.div>
            ))}

            {PERSONAL_INFO.stats.filter((stat) => !stat.isNumeric).map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.44 }}
                className="relative border-t border-white/10 px-5 py-6 md:border-l md:border-t-0 sm:px-7 sm:py-8"
              >
                <div className="mb-5 flex items-center justify-between text-[9px] font-mono font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  <span>Specialization</span>
                  <span className="text-purple-300/80">03</span>
                </div>
                <p className="max-w-md font-mono text-base font-semibold uppercase leading-relaxed tracking-[0.16em] text-zinc-200 sm:text-lg">
                  {stat.label}
                </p>
                <div className="mt-6 flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.2em] text-cyan-200/80">
                  <span className="h-px w-8 bg-cyan-300/70" />
                  Multi-platform systems
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

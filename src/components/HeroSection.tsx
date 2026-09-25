'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, FileText, Sparkles, Terminal } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { HeroCanvas } from './HeroCanvas';
import { GithubIcon, LinkedinIcon } from './Icons';

interface HeroSectionProps {
  onOpenResume?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenResume }) => {
  const letters = "ABHISHEK S NAIR".split("");

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-32 pb-16 overflow-hidden bg-[#030508]">
      {/* 3D Celestial Neural Canvas */}
      <HeroCanvas />

      {/* Cinematic Lighting Radiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Background Cinematic Grid Lines */}
      <div className="absolute inset-0 bg-cinematic-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
        
        {/* Monogram Badge & Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-wrap items-center gap-3.5 mb-8"
        >
          {/* Minimalist Monogram Emblem */}
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/25 via-zinc-900 to-black border border-indigo-500/40 shadow-xl shadow-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <span className="font-mono text-base font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-cyan-300">
              ASN
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-xl shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-medium tracking-wider text-zinc-300 uppercase">
              Software Developer • Available for Roles
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-500/30 text-[11px] font-mono text-indigo-300">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>3+ Years of Software Development</span>
          </div>
        </motion.div>

        {/* Character-by-character Dramatic Name Reveal */}
        <div className="mb-4 overflow-hidden">
          <motion.h1
            className="text-5xl sm:text-7xl lg:text-9xl font-black tracking-tighter text-white leading-none flex flex-wrap"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.03,
                },
              },
            }}
          >
            {letters.map((char, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 60 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className={char === " " ? "mr-4" : ""}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        {/* Professional Title Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="space-y-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="h-0.5 w-12 bg-gradient-to-r from-indigo-500 to-cyan-400" />
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-light tracking-wide text-zinc-300 uppercase">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-cyan-300">
                SOFTWARE DEVELOPER
              </span>
            </h2>
          </div>

          {/* Staged Tech Pill Badge: Web • Mobile • AI Applications */}
          <p className="font-mono text-base sm:text-lg text-cyan-300 font-semibold tracking-wide flex items-center gap-2">
            <span>Web</span>
            <span className="text-zinc-600">•</span>
            <span>Mobile</span>
            <span className="text-zinc-600">•</span>
            <span>AI Applications</span>
          </p>
        </motion.div>

        {/* Narrative Statement */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="max-w-2xl text-base sm:text-lg text-zinc-400 font-light leading-relaxed mb-10"
        >
          Building modern web, mobile, desktop and AI-powered applications with a focus on practical product development, real-time systems and clean user experiences.
        </motion.p>

        {/* Action Group: Explore Portfolio CTA, Resume, Socials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="flex flex-wrap items-center gap-4 mb-16"
        >
          {/* Primary CTA */}
          <a
            href="#projects"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm tracking-wider flex items-center gap-3 shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-1"
            data-cursor="pointer"
          >
            <span>EXPLORE PORTFOLIO</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>

          {/* Download Resume Button */}
          {onOpenResume ? (
            <button
              onClick={onOpenResume}
              className="px-6 py-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 hover:border-indigo-500/50 text-zinc-200 font-semibold text-sm tracking-wide flex items-center gap-2.5 transition-all shadow-md"
              data-cursor="pointer"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Resume (PDF)</span>
            </button>
          ) : (
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download
              className="px-6 py-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 hover:border-indigo-500/50 text-zinc-200 font-semibold text-sm tracking-wide flex items-center gap-2.5 transition-all shadow-md"
              data-cursor="pointer"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Download Resume</span>
            </a>
          )}

          {/* Social Icons Bar */}
          <div className="flex items-center gap-2.5">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 text-zinc-400 hover:text-white hover:border-indigo-500/50 transition-all"
              data-cursor="pointer"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 text-zinc-400 hover:text-white hover:border-indigo-500/50 transition-all"
              data-cursor="pointer"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* Telemetry Proof Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="w-full rounded-2xl border border-white/10 bg-zinc-950/60 backdrop-blur-xl p-5 sm:p-6 shadow-2xl relative overflow-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {PERSONAL_INFO.stats.map((stat, i) => (
              <div key={stat.label} className={`${i > 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''}`}>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
                  Verified Metric 0{i + 1}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl sm:text-4xl font-black text-white">
                    {stat.value}
                  </span>
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wide">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Subtle Scroll Indicator at bottom */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between text-[11px] font-mono text-zinc-600 pt-8">
        <span className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          SYSTEM.ASN // VERIFIED PROFILE
        </span>
        <a
          href="#about"
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          data-cursor="pointer"
        >
          <span>SCROLL TO ABOUT</span>
          <ArrowDown className="w-3 h-3 text-cyan-400 animate-bounce" />
        </a>
      </div>
    </section>
  );
};

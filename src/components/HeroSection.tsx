'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDown, FileText, Sparkles, Compass, GitBranch, Mail, RotateCcw } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { HeroCanvas } from './HeroCanvas';
import { GithubIcon, LinkedinIcon } from './Icons';
import { InteractivePortrait } from './portrait-3d/InteractivePortrait';
import { SectionBackdrop } from './background/SectionBackdrop';

interface HeroSectionProps {
  onOpenResume?: () => void;
  onReplayIntro?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenResume, onReplayIntro }) => {
  const letters = 'ABHISHEK S NAIR'.split('');

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-16 overflow-hidden bg-[#030508]">
      {/* 3D Celestial Neural Canvas (Paused when offscreen, 0 shadowBlur) */}
      <HeroCanvas />

      {/* Distinct Section Backdrop */}
      <SectionBackdrop variant="hero" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
        
        {/* Two-Column Responsive Grid: Content (Left) + Interactive 3D Portrait (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center mb-12">
          
          {/* Left Column: Story, Title, Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Monogram Badge & Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              {/* Minimalist Monogram Emblem */}
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500/25 via-zinc-900 to-black border border-indigo-500/40 shadow-xl shadow-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <span className="font-mono text-sm font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-cyan-300">
                  ASN
                </span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-xl shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono font-medium tracking-wider text-zinc-300 uppercase">
                  Available for Roles • Analyst at InnSpark
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-500/30 text-[11px] font-mono text-indigo-300">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>3+ Years Software Development</span>
              </div>
            </motion.div>

            {/* Character-by-character Dramatic Name Reveal */}
            <div className="mb-4 overflow-hidden">
              <motion.h1
                className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-white leading-none flex flex-wrap"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.025,
                    },
                  },
                }}
              >
                {letters.map((char, index) => (
                  <motion.span
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 50 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                    className={char === ' ' ? 'mr-3' : ''}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.h1>
            </div>

            {/* Professional Title Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="space-y-3 mb-6"
            >
              <div className="flex items-center gap-3">
                <div className="h-0.5 w-10 bg-gradient-to-r from-indigo-500 to-cyan-400" />
                <h2 className="text-lg sm:text-2xl font-light tracking-wide text-zinc-300 uppercase">
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-cyan-300">
                    SOFTWARE DEVELOPER
                  </span>
                </h2>
              </div>

              {/* Staged Tech Pill Badge */}
              <p className="font-mono text-sm sm:text-base text-cyan-300 font-semibold tracking-wide flex items-center gap-2">
                <span>Web Platforms</span>
                <span className="text-zinc-600">•</span>
                <span>Mobile Apps</span>
                <span className="text-zinc-600">•</span>
                <span>AI / LLM Systems</span>
              </p>
            </motion.div>

            {/* Narrative Statement */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-xl text-sm sm:text-base text-zinc-400 font-light leading-relaxed mb-8"
            >
              {PERSONAL_INFO.tagline}
            </motion.p>

            {/* Working CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="flex flex-wrap items-center gap-3"
            >
              {/* 1. Explore Projects */}
              <a
                href="#projects"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs tracking-wider flex items-center gap-2 shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
                data-cursor="pointer"
              >
                <span>EXPLORE PROJECTS</span>
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              </a>

              {/* 2. Enter 3D World */}
              <Link
                href="/experience?view=world"
                className="px-5 py-3.5 rounded-2xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 hover:text-white font-mono font-bold text-xs tracking-wider flex items-center gap-2 shadow-lg shadow-indigo-500/15 transition-all transform hover:-translate-y-0.5"
                data-cursor="pointer"
                title="Enter 3D Open-World Simulation"
              >
                <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>3D OPEN WORLD</span>
              </Link>

              {/* 3. GitHub Universe */}
              <Link
                href="/github-universe"
                className="px-4 py-3.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 hover:border-cyan-500/50 text-cyan-300 font-mono font-bold text-xs tracking-wider flex items-center gap-2 transition-all shadow-md"
                data-cursor="pointer"
                title="Open Staged GitHub Universe"
              >
                <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                <span>GITHUB UNIVERSE</span>
              </Link>

              {/* 4. Replay Assembly Intro */}
              {onReplayIntro && (
                <button
                  onClick={onReplayIntro}
                  className="px-3.5 py-3.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 hover:border-indigo-400 text-indigo-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shadow-md"
                  title="Replay Cinematic Website Assembly Introduction"
                  data-cursor="pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Intro</span>
                </button>
              )}

              {/* 5. Download Resume Button */}
              {onOpenResume ? (
                <button
                  onClick={onOpenResume}
                  className="px-4 py-3.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 text-zinc-300 font-semibold text-xs flex items-center gap-2 transition-all shadow-md"
                  data-cursor="pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Resume</span>
                </button>
              ) : (
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="px-4 py-3.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 text-zinc-300 font-semibold text-xs flex items-center gap-2 transition-all shadow-md"
                  data-cursor="pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Resume</span>
                </a>
              )}

              {/* Social Icons Bar */}
              <div className="flex items-center gap-2">
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

          </div>

          {/* Right Column: Interactive 3D Portrait Centerpiece */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <InteractivePortrait variant="hero" />
          </motion.div>

        </div>

        {/* Telemetry Proof Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
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
    </section>
  );
};

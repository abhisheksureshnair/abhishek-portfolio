'use client';

import React from 'react';
import { motion, useTransform, useScroll } from 'framer-motion';
import { Smartphone, Terminal, Activity, Cpu, Sparkles } from 'lucide-react';
import { EXPERIENCE_DATA } from './ExperienceData';
import { useScrolly } from './ExperienceScrollyCanvas';

export const ExperienceOverlay: React.FC = () => {
  const context = useScrolly();
  const { scrollYProgress: fallbackScroll } = useScroll();
  const scrollYProgress = context?.scrollYProgress || fallbackScroll;

  // Section 1: Hero (0% to ~22%)
  const s1Opacity = useTransform(scrollYProgress, [0, 0.12, 0.22], [1, 0.9, 0]);
  const s1Y = useTransform(scrollYProgress, [0, 0.22], [0, -70]);
  const s1Scale = useTransform(scrollYProgress, [0, 0.22], [1, 0.95]);

  // Section 2: Mobile Discipline (24% to ~48%)
  const s2Opacity = useTransform(
    scrollYProgress,
    [0.22, 0.28, 0.44, 0.50],
    [0, 1, 1, 0]
  );
  const s2Y = useTransform(
    scrollYProgress,
    [0.22, 0.32, 0.44, 0.50],
    [50, 0, 0, -50]
  );

  // Section 3: Full Stack Discipline (52% to ~74%)
  const s3Opacity = useTransform(
    scrollYProgress,
    [0.50, 0.56, 0.70, 0.76],
    [0, 1, 1, 0]
  );
  const s3Y = useTransform(
    scrollYProgress,
    [0.50, 0.58, 0.70, 0.76],
    [50, 0, 0, -50]
  );

  // Section 4: Dual Synthesis Climax (78% to ~98%)
  const s4Opacity = useTransform(
    scrollYProgress,
    [0.76, 0.82, 0.94, 0.99],
    [0, 1, 1, 0]
  );
  const s4Y = useTransform(
    scrollYProgress,
    [0.76, 0.84, 0.94, 0.99],
    [60, 0, 0, -30]
  );
  const s4Scale = useTransform(scrollYProgress, [0.80, 0.92], [0.96, 1]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-full w-full pointer-events-none select-none">
      {/* ============================================================ */}
      {/* SECTION 1: 0% Scroll - Abhishek S Nair (Hero)                */}
      {/* ============================================================ */}
      <motion.div
        style={{ opacity: s1Opacity, y: s1Y, scale: s1Scale }}
        className="absolute inset-0 flex flex-col items-center justify-between py-12 sm:py-16 px-6 text-center"
      >
        {/* Top Status & HUD Bar */}
        <div className="pt-12 md:pt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-black/70 px-4 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>
            <span className="text-[11px] font-mono tracking-widest uppercase text-amber-300">
              {EXPERIENCE_DATA.hero.status}
            </span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-mono text-neutral-400 backdrop-blur-md">
            <span className="text-amber-400 font-bold">MODE ●</span>
            <span>{EXPERIENCE_DATA.hero.timecode}</span>
          </div>

          <div className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-mono text-neutral-400 backdrop-blur-md">
            <span>{EXPERIENCE_DATA.hero.officialRole}</span>
          </div>
        </div>

        {/* Framing Header (positioned gracefully above center) */}
        <div className="max-w-3xl space-y-2 mt-4 sm:mt-6">
          <div className="inline-block">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight uppercase text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)]">
              {EXPERIENCE_DATA.hero.name}
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-400 mt-1 opacity-90 rounded-full" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm sm:text-lg md:text-xl font-light text-neutral-200">
            <span className="text-amber-400 font-bold">SOFTWARE DEVELOPER</span>
            <span className="text-neutral-500">•</span>
            <span className="text-cyan-400 font-bold">WEB • MOBILE • AI APPLICATIONS</span>
          </div>
        </div>

        {/* Bottom Framing Cards (below chest/shoulders) */}
        <div className="space-y-4 mb-2 max-w-xl">
          <p className="mx-auto text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            &ldquo;{EXPERIENCE_DATA.hero.statement}&rdquo;
          </p>

          {/* Quick Tools Row */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {EXPERIENCE_DATA.hero.mobileSkills.map((s) => (
              <span
                key={s.name}
                className="rounded-md border border-amber-500/30 bg-black/60 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-amber-300 backdrop-blur-sm"
              >
                {s.name}
              </span>
            ))}
            <span className="text-neutral-600 text-xs hidden sm:inline">|</span>
            {EXPERIENCE_DATA.hero.fullstackSkills.map((s) => (
              <span
                key={s.name}
                className="rounded-md border border-cyan-500/30 bg-black/60 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-cyan-300 backdrop-blur-sm"
              >
                {s.name}
              </span>
            ))}
          </div>

          {/* Scroll Prompt */}
          <div className="flex flex-col items-center gap-2 pt-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400">
              Scroll to explore
            </span>
            <div className="relative h-8 w-5 rounded-full border border-white/20 p-1 flex justify-center">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* SECTION 2: ~30% Scroll - Mobile Discipline (Left Aligned)     */}
      {/* Portrait is dynamically panned to the RIGHT                  */}
      {/* ============================================================ */}
      <motion.div
        style={{ opacity: s2Opacity, y: s2Y }}
        className="absolute inset-0 flex items-center justify-start px-6 sm:px-12 md:px-20 lg:px-28"
      >
        <div className="max-w-xl space-y-5 bg-black/40 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-amber-400">
            <Smartphone className="h-3.5 w-3.5" />
            <span>01 / Application &amp; Mobile Development</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            PRODUCTION APPS <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              WEB, MOBILE &amp; REAL-TIME.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
            Application development across React Native and Flutter, with live fleet GPS tracking, Bluetooth BLE hardware telemetry, and platform security integrations.
          </p>

          {/* Telemetry HUD Card */}
          <div className="rounded-xl p-3.5 border border-amber-500/25 bg-neutral-950/80 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Activity className="h-3 w-3 animate-pulse" />
                <span>HARDWARE TELEMETRY STREAM</span>
              </span>
              <span>GATT PROTOCOL [SUB-50ms]</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="bg-neutral-900/90 p-2 rounded border border-white/5">
                <div className="text-neutral-500 text-[10px]">BLE STATUS</div>
                <div className="text-emerald-400 font-bold">CONNECTED</div>
              </div>
              <div className="bg-neutral-900/90 p-2 rounded border border-white/5">
                <div className="text-neutral-500 text-[10px]">GPS FIX</div>
                <div className="text-amber-400 font-bold">ACTIVE ●</div>
              </div>
              <div className="bg-neutral-900/90 p-2 rounded border border-white/5">
                <div className="text-neutral-500 text-[10px]">SYNC SPEED</div>
                <div className="text-cyan-400 font-bold">60 FPS</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-3 py-1 rounded-md text-xs font-mono bg-white/5 border border-white/10 text-neutral-200">
              React Native &amp; Flutter
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-mono bg-white/5 border border-white/10 text-cyan-300">
              Bluetooth BLE GATT
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-mono bg-white/5 border border-white/10 text-emerald-300">
              Google Maps &amp; Geofencing
            </span>
          </div>
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* SECTION 3: ~60% Scroll - Full Stack MERN & AI (Right Aligned) */}
      {/* Portrait is dynamically panned to the LEFT                   */}
      {/* ============================================================ */}
      <motion.div
        style={{ opacity: s3Opacity, y: s3Y }}
        className="absolute inset-0 flex items-center justify-end px-6 sm:px-12 md:px-20 lg:px-28 text-right"
      >
        <div className="max-w-xl space-y-5 bg-black/40 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 flex flex-col items-end">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-cyan-400">
            <Terminal className="h-3.5 w-3.5" />
            <span>02 / Full Stack Architecture &amp; AI Systems</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            FLOWSYNC &amp; ECHO AI <br />
            <span className="text-cyan-400">INDEPENDENT BUILDS.</span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-lg text-right">
            Scalable MERN products with React 19, Node.js, MongoDB, Socket.IO, and NVIDIA NIM LLM integrations. Engineering cross-platform desktop assistants and companion browser extensions for Chrome, Brave, Edge, and Firefox.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-1">
            <div className="p-3 rounded-xl text-left border border-cyan-500/30 bg-neutral-950/80">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <Cpu className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white">FlowSync SaaS</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                React 19, Socket.IO, NVIDIA NIM LLM task breakdown, and risk analysis.
              </p>
            </div>
            <div className="p-3 rounded-xl text-left border border-cyan-500/30 bg-neutral-950/80">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <Terminal className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white">Echo Desktop AI</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Electron.js desktop copilot with companion extensions for Chrome, Brave &amp; Edge.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* SECTION 4: ~85% Scroll - The Dual Climax (Bottom Anchored)   */}
      {/* Positioned in lower third so his face is completely clear!   */}
      {/* ============================================================ */}
      <motion.div
        style={{ opacity: s4Opacity, y: s4Y, scale: s4Scale }}
        className="absolute inset-x-0 bottom-8 sm:bottom-12 flex flex-col items-center justify-end px-6 text-center pointer-events-auto"
      >
        <div className="max-w-2xl w-full space-y-4 bg-black/60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/15 shadow-[0_10px_50px_rgba(0,0,0,0.9)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-black/70 px-4 py-1 text-xs font-mono uppercase tracking-widest text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>03 / End-to-End Synthesis</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-tight">
            ONE DEVELOPER. <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400 bg-clip-text text-transparent">
              END-TO-END MASTERY.
            </span>
          </h2>

          <p className="mx-auto max-w-lg text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
            Whether architecting hardware-connected mobile telemetry in production or crafting AI-driven full-stack platforms — I deliver clean, resilient software.
          </p>

          {/* Dual Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => scrollToSection('projects')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-black shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Explore Projects</span>
            </button>

            <button
              onClick={() => scrollToSection('capabilities')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-cyan-300 shadow-[0_0_25px_rgba(0,229,255,0.15)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-cyan-500/20 hover:border-cyan-400 active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Technical Capabilities</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

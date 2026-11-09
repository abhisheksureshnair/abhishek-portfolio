'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FastForward,
  RotateCcw,
  Sparkles,
  Compass,
  Code2,
  GitBranch,
  Cpu,
  Layers,
  ExternalLink,
  Terminal,
  Activity,
  Box,
} from 'lucide-react';
import Image from 'next/image';

interface WebsiteAssemblyIntroProps {
  onComplete?: () => void;
  forcePlay?: boolean;
}

export const WebsiteAssemblyIntro: React.FC<WebsiteAssemblyIntroProps> = ({
  onComplete,
  forcePlay = false,
}) => {
  // Stage 1: Digital Void, Stage 2: Windows Fly-In, Stage 3: Construction & Docking, Stage 4: Expansion & Handoff, Stage 5: Completed
  const [stage, setStage] = useState<number>(1);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const hasTriggeredCompleteRef = useRef<boolean>(false);

  const completeIntro = () => {
    if (hasTriggeredCompleteRef.current) return;
    hasTriggeredCompleteRef.current = true;
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('asn_assembly_intro_seen', 'true');
    }
    onComplete?.();
  };

  useEffect(() => {
    // Check if user already saw the intro in this session (unless forced via replay)
    if (!forcePlay && typeof window !== 'undefined') {
      const alreadySeen = sessionStorage.getItem('asn_assembly_intro_seen');
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (alreadySeen || prefersReducedMotion) {
        completeIntro();
        return;
      }
    }

    let isMounted = true;

    // Keyboard listener for Esc to skip immediately
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        completeIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Fail-safe timeout: never block page for more than 5 seconds under any circumstance
    const failSafeTimer = setTimeout(() => {
      if (isMounted) completeIntro();
    }, 5200);

    // Choreographed Timeline
    // 0.0s - 0.7s: Stage 1 (Void + Grid ignite)
    // 0.7s - 2.1s: Stage 2 (Windows fly into 3D space)
    // 2.1s - 3.4s: Stage 3 (Cursor snaps windows into cohesive layout)
    // 3.4s - 4.2s: Stage 4 (Assembled layout expands into full page)
    // 4.2s: Done

    const t1 = setTimeout(() => {
      if (!isMounted) return;
      setStage(2);
      setCursorPos({ x: 32, y: 28 });
    }, 700);

    const t2 = setTimeout(() => {
      if (!isMounted) return;
      setStage(3);
      setCursorPos({ x: 52, y: 50 });
    }, 2100);

    const t3 = setTimeout(() => {
      if (!isMounted) return;
      setStage(4);
    }, 3500);

    const t4 = setTimeout(() => {
      if (!isMounted) return;
      completeIntro();
    }, 4300);

    return () => {
      isMounted = false;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(failSafeTimer);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [forcePlay]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="assembly-intro-overlay"
        initial={{ opacity: 1 }}
        exit={{
          opacity: 0,
          scale: 1.05,
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        }}
        className="fixed inset-0 z-50 overflow-hidden bg-[#020408] text-white select-none flex items-center justify-center perspective-[1200px]"
        style={{ perspective: 1200 }}
      >
        {/* ======================================================== */}
        {/* SCENE 1: PERSPECTIVE CYBER GRID & ATMOSPHERIC LIGHT      */}
        {/* ======================================================== */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Horizon glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-b from-indigo-600/20 via-cyan-500/15 to-transparent rounded-full blur-[140px]" />
          
          {/* Perspective grid floor */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(99, 102, 241, 0.25) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(56, 189, 248, 0.25) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              transform: 'perspective(500px) rotateX(60deg) translateY(120px) translateZ(0)',
              transformOrigin: 'bottom center',
            }}
          />

          {/* Top ambient vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80" />
        </div>

        {/* ======================================================== */}
        {/* TOP HUD BAR: SKIP & STATUS CONTROLS                      */}
        {/* ======================================================== */}
        <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 flex items-center justify-between z-40 pointer-events-auto">
          {/* Left branding */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-950/80 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] font-mono tracking-wider text-zinc-300 uppercase font-semibold">
              ASSEMBLING DEVELOPER PORTFOLIO // V3
            </span>
          </div>

          {/* Skip Button */}
          <button
            onClick={completeIntro}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-white/15 hover:border-cyan-400/60 text-xs font-mono font-bold text-zinc-300 hover:text-white transition-all shadow-lg hover:shadow-cyan-500/20"
            data-cursor="pointer"
          >
            <span>Skip Intro</span>
            <span className="text-[10px] text-zinc-500 font-normal">[Esc]</span>
            <FastForward className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* SCENE 2 & 3: THE 6 MINIATURE CHROME BROWSER WINDOWS      */}
        {/* ======================================================== */}
        <div className="relative w-full max-w-5xl h-[85vh] max-h-[640px] px-4 flex items-center justify-center">
          
          {/* Dynamic SVG Connection Bus Lines in Scene 3 */}
          {stage >= 3 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 transition-opacity duration-700 opacity-70">
              <defs>
                <linearGradient id="bus-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <line x1="26%" y1="28%" x2="52%" y2="28%" stroke="url(#bus-glow)" strokeWidth="1.5" strokeDasharray="4 3" />
              <line x1="52%" y1="28%" x2="78%" y2="28%" stroke="url(#bus-glow)" strokeWidth="1.5" strokeDasharray="4 3" />
              <line x1="26%" y1="72%" x2="52%" y2="72%" stroke="url(#bus-glow)" strokeWidth="1.5" strokeDasharray="4 3" />
              <line x1="52%" y1="72%" x2="78%" y2="72%" stroke="url(#bus-glow)" strokeWidth="1.5" strokeDasharray="4 3" />
              <line x1="52%" y1="28%" x2="52%" y2="72%" stroke="url(#bus-glow)" strokeWidth="1.5" strokeDasharray="4 3" />
            </svg>
          )}

          {/* 1. HERO WINDOW (Top-Left) */}
          <motion.div
            initial={{ opacity: 0, x: -380, y: -240, rotateX: 25, rotateY: 35, rotateZ: -8, scale: 0.7 }}
            animate={
              stage === 1
                ? { opacity: 0, x: -380, y: -240, scale: 0.7 }
                : stage === 2
                ? { opacity: 1, x: -160, y: -130, rotateX: 12, rotateY: 18, rotateZ: -4, scale: 0.88 }
                : stage === 3
                ? { opacity: 1, x: -170, y: -125, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 0.94 }
                : { opacity: 0.2, scale: 1.3, x: -280, y: -200 } // Stage 4: expanding
            }
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-[280px] sm:w-[320px] rounded-2xl bg-zinc-950/90 border border-indigo-500/40 shadow-2xl shadow-indigo-950/60 overflow-hidden backdrop-blur-xl z-20"
          >
            {/* Chrome Title Bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/90 border-b border-white/10 text-[10px] font-mono text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="px-2 py-0.5 rounded bg-zinc-950/80 text-zinc-300 text-[9px] flex items-center gap-1 border border-white/5">
                <span>abhishek.dev/#hero</span>
              </div>
            </div>
            {/* Mini Window Content */}
            <div className="p-3.5 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-[10px] font-black text-cyan-300">
                  ASN
                </div>
                <div>
                  <div className="text-[11px] font-black text-white leading-none">ABHISHEK S NAIR</div>
                  <div className="text-[8px] font-mono text-indigo-400">Software Developer</div>
                </div>
              </div>
              <div className="h-1.5 w-3/4 bg-zinc-800 rounded-full" />
              <div className="h-1.5 w-1/2 bg-zinc-850 rounded-full" />
              <div className="flex gap-1.5 pt-1">
                <span className="text-[8px] px-2 py-0.5 rounded bg-indigo-600 text-white font-bold">3D World</span>
                <span className="text-[8px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Projects</span>
              </div>
            </div>
          </motion.div>

          {/* 2. PROFILE & PORTRAIT WINDOW (Top-Center) */}
          <motion.div
            initial={{ opacity: 0, y: -340, rotateX: 30, scale: 0.6 }}
            animate={
              stage === 1
                ? { opacity: 0, y: -340, scale: 0.6 }
                : stage === 2
                ? { opacity: 1, y: -150, rotateX: 14, scale: 0.9 }
                : stage === 3
                ? { opacity: 1, y: -125, x: 0, rotateX: 0, scale: 0.94 }
                : { opacity: 0.2, scale: 1.4, y: -220 }
            }
            transition={{ duration: 1.1, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-[240px] sm:w-[270px] rounded-2xl bg-zinc-950/90 border border-cyan-500/40 shadow-2xl shadow-cyan-950/60 overflow-hidden backdrop-blur-xl z-20"
          >
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/90 border-b border-white/10 text-[10px] font-mono text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[9px] text-zinc-400">profile.layer</span>
            </div>
            <div className="p-3 flex items-center gap-3">
              <div className="relative w-14 h-16 rounded-xl overflow-hidden border border-cyan-400/40 bg-zinc-900 flex-shrink-0">
                <Image
                  src="/profile.webp"
                  alt="Portrait Thumbnail"
                  fill
                  className="object-cover object-top"
                  sizes="64px"
                />
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-white">Analyst @ InnSpark</div>
                <div className="text-[8px] font-mono text-emerald-400">● Available for Roles</div>
                <div className="text-[8px] font-mono text-zinc-400">Full-Stack & Mobile</div>
              </div>
            </div>
          </motion.div>

          {/* 3. FEATURED PROJECTS WINDOW (Top-Right) */}
          <motion.div
            initial={{ opacity: 0, x: 380, y: -240, rotateX: 25, rotateY: -35, rotateZ: 8, scale: 0.7 }}
            animate={
              stage === 1
                ? { opacity: 0, x: 380, y: -240, scale: 0.7 }
                : stage === 2
                ? { opacity: 1, x: 160, y: -130, rotateX: 12, rotateY: -18, rotateZ: 4, scale: 0.88 }
                : stage === 3
                ? { opacity: 1, x: 170, y: -125, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 0.94 }
                : { opacity: 0.2, scale: 1.3, x: 280, y: -200 }
            }
            transition={{ duration: 1.1, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-[280px] sm:w-[320px] rounded-2xl bg-zinc-950/90 border border-purple-500/40 shadow-2xl shadow-purple-950/60 overflow-hidden backdrop-blur-xl z-20"
          >
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/90 border-b border-white/10 text-[10px] font-mono text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[9px] text-purple-300">projects.flowsync</span>
            </div>
            <div className="p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white">FlowSync Workspace</span>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">LIVE SOCKET</span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900 border border-white/5 text-[9px] font-mono text-zinc-400 space-y-1">
                <div>AI Risk Score: <span className="text-cyan-300">Low (98% Confidence)</span></div>
                <div>Telemetry: <span className="text-purple-300">Socket.IO 42ms</span></div>
              </div>
            </div>
          </motion.div>

          {/* 4. TECHNOLOGY STACK WINDOW (Bottom-Left) */}
          <motion.div
            initial={{ opacity: 0, x: -380, y: 240, rotateX: -25, rotateY: 35, rotateZ: 8, scale: 0.7 }}
            animate={
              stage === 1
                ? { opacity: 0, x: -380, y: 240, scale: 0.7 }
                : stage === 2
                ? { opacity: 1, x: -160, y: 130, rotateX: -12, rotateY: 18, rotateZ: 3, scale: 0.88 }
                : stage === 3
                ? { opacity: 1, x: -170, y: 125, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 0.94 }
                : { opacity: 0.2, scale: 1.3, x: -280, y: 200 }
            }
            transition={{ duration: 1.1, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-[280px] sm:w-[320px] rounded-2xl bg-zinc-950/90 border border-emerald-500/40 shadow-2xl shadow-emerald-950/60 overflow-hidden backdrop-blur-xl z-20"
          >
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/90 border-b border-white/10 text-[10px] font-mono text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[9px] text-emerald-300">tech.universe</span>
            </div>
            <div className="p-3.5 space-y-2">
              <div className="text-[10px] font-mono text-zinc-400">Core Engineering Stack:</div>
              <div className="flex flex-wrap gap-1">
                {['React', 'Next.js', 'Node.js', 'TypeScript', 'Flutter', 'NVIDIA NIM'].map((tag) => (
                  <span key={tag} className="text-[8px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 5. GITHUB CODE NEXUS WINDOW (Bottom-Center) */}
          <motion.div
            initial={{ opacity: 0, y: 340, rotateX: -30, scale: 0.6 }}
            animate={
              stage === 1
                ? { opacity: 0, y: 340, scale: 0.6 }
                : stage === 2
                ? { opacity: 1, y: 150, rotateX: -14, scale: 0.9 }
                : stage === 3
                ? { opacity: 1, y: 125, x: 0, rotateX: 0, scale: 0.94 }
                : { opacity: 0.2, scale: 1.4, y: 220 }
            }
            transition={{ duration: 1.1, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-[240px] sm:w-[270px] rounded-2xl bg-zinc-950/90 border border-amber-500/40 shadow-2xl shadow-amber-950/60 overflow-hidden backdrop-blur-xl z-20"
          >
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/90 border-b border-white/10 text-[10px] font-mono text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[9px] text-amber-300">terminal.sh</span>
            </div>
            <div className="p-3 font-mono text-[9px] text-zinc-300 space-y-1">
              <div className="text-amber-400">$ git clone universe</div>
              <div className="text-zinc-500">35+ Verified Repositories</div>
              <div className="text-emerald-400">✓ Production builds online</div>
            </div>
          </motion.div>

          {/* 6. 3D WORLD SIMULATION WINDOW (Bottom-Right) */}
          <motion.div
            initial={{ opacity: 0, x: 380, y: 240, rotateX: -25, rotateY: -35, rotateZ: -8, scale: 0.7 }}
            animate={
              stage === 1
                ? { opacity: 0, x: 380, y: 240, scale: 0.7 }
                : stage === 2
                ? { opacity: 1, x: 160, y: 130, rotateX: -12, rotateY: -18, rotateZ: -3, scale: 0.88 }
                : stage === 3
                ? { opacity: 1, x: 170, y: 125, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 0.94 }
                : { opacity: 0.2, scale: 1.3, x: 280, y: 200 }
            }
            transition={{ duration: 1.1, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-[280px] sm:w-[320px] rounded-2xl bg-zinc-950/90 border border-cyan-500/40 shadow-2xl shadow-cyan-950/60 overflow-hidden backdrop-blur-xl z-20"
          >
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/90 border-b border-white/10 text-[10px] font-mono text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[9px] text-cyan-300">world.3d.sim</span>
            </div>
            <div className="p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white">9 Districts Open World</span>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">WebGL 60FPS</span>
              </div>
              <div className="h-6 w-full rounded bg-zinc-900 border border-white/5 flex items-center justify-center text-[9px] font-mono text-zinc-400">
                [ Citadel &amp; Holographic Hubs ]
              </div>
            </div>
          </motion.div>

          {/* ======================================================== */}
          {/* GLOWING INTERACTIVE CYBER CURSOR                         */}
          {/* ======================================================== */}
          <motion.div
            className="absolute pointer-events-none z-30 flex items-center gap-2"
            animate={{
              left: `${cursorPos.x}%`,
              top: `${cursorPos.y}%`,
            }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          >
            <div className="w-4 h-4 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_20px_rgba(56,189,248,1)] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 border border-cyan-400/50 text-cyan-300 backdrop-blur-md">
              {stage <= 2 ? 'syncing...' : stage === 3 ? 'assembling layout' : 'launching'}
            </span>
          </motion.div>

        </div>

        {/* ======================================================== */}
        {/* BOTTOM TIMELINE PROGRESS BAR                             */}
        {/* ======================================================== */}
        <div className="absolute bottom-6 inset-x-8 max-w-md mx-auto z-40 text-center space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
            <span>Website Assembly</span>
            <span className="text-cyan-300 font-bold">
              {stage === 1 ? '15%' : stage === 2 ? '45%' : stage === 3 ? '85%' : '100%'}
            </span>
          </div>
          <div className="w-full bg-zinc-900 border border-white/10 rounded-full h-1 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500 rounded-full"
              initial={{ width: '10%' }}
              animate={{
                width: stage === 1 ? '20%' : stage === 2 ? '50%' : stage === 3 ? '88%' : '100%',
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
};


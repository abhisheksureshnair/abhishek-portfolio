'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Smartphone, Terminal, Sparkles, Menu, X, ArrowLeft } from 'lucide-react';
import { ExperienceSoundButton } from './ExperienceSound';
import { EXPERIENCE_DATA, ExperienceMode } from './ExperienceData';
import { useExperienceMode } from './ExperienceModeContext';

export const ExperienceNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { mode, setMode } = useExperienceMode();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Story', href: '#scrolly-section' },
    { label: 'Works', href: '#projects' },
    { label: 'Telemetry', href: '#telemetry' },
    { label: 'Terminal', href: '#terminal' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Journey', href: '#journey' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex justify-center p-3 sm:p-5 pointer-events-none">
      <nav
        className={`pointer-events-auto flex items-center justify-between gap-3 sm:gap-4 rounded-full border px-4 sm:px-6 py-2 transition-all duration-500 max-w-7xl w-full ${
          scrolled
            ? 'border-white/15 bg-neutral-950/90 shadow-[0_10px_35px_rgba(0,0,0,0.85)] backdrop-blur-xl'
            : 'border-white/10 bg-black/50 backdrop-blur-md'
        }`}
      >
        {/* Brand & Classic View Return */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-mono text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 transition-all"
            title="Switch to Classic Portfolio"
          >
            <ArrowLeft className="h-3 w-3" />
            <span className="hidden sm:inline">Classic View</span>
          </Link>

          <a
            href="#scrolly-section"
            className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-white hover:text-amber-400 transition-colors"
          >
            <Flame className="h-4 w-4 text-amber-500 animate-pulse" />
            <span className="font-extrabold tracking-tight text-sm sm:text-base hidden sm:inline">
              {EXPERIENCE_DATA.hero.shortName}
            </span>
          </a>
        </div>

        {/* The 3-Way Mode Switcher (Global HUD) */}
        <div className="hidden lg:flex items-center rounded-full border border-white/10 bg-neutral-900/80 p-1 backdrop-blur-md">
          <button
            onClick={() => setMode('mobile')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[11px] font-mono transition-all ${
              mode === 'mobile'
                ? 'bg-amber-600 text-white font-semibold shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="h-3 w-3" />
            <span>MOBILE APPS</span>
          </button>

          <button
            onClick={() => setMode('dual')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[11px] font-mono transition-all ${
              mode === 'dual'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold shadow-[0_0_15px_rgba(245,158,11,0.6)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-3 w-3" />
            <span>ALL (DUAL)</span>
          </button>

          <button
            onClick={() => setMode('fullstack')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[11px] font-mono transition-all ${
              mode === 'fullstack'
                ? 'bg-cyan-500 text-black font-semibold shadow-[0_0_15px_rgba(0,229,255,0.6)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Terminal className="h-3 w-3" />
            <span>FULL STACK & AI</span>
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-5 text-xs font-mono text-neutral-300">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-amber-400"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Controls: Audio & Contact CTA */}
        <div className="flex items-center gap-2.5">
          <ExperienceSoundButton />

          <a
            href="#contact"
            className="hidden sm:inline-flex rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:scale-105 active:scale-95"
          >
            Get In Touch
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 text-neutral-300 hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pointer-events-auto absolute top-20 left-4 right-4 rounded-2xl border border-white/15 bg-neutral-950/95 p-6 backdrop-blur-2xl shadow-2xl flex flex-col gap-4 text-center md:hidden"
          >
            {/* Mobile Mode Switcher */}
            <div className="flex items-center justify-center rounded-full border border-white/10 bg-neutral-900/80 p-1 mb-2">
              {(['mobile', 'dual', 'fullstack'] as ExperienceMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-1.5 text-[11px] font-mono uppercase rounded-full transition-all ${
                    mode === m
                      ? m === 'mobile'
                        ? 'bg-amber-600 text-white font-bold'
                        : m === 'fullstack'
                        ? 'bg-cyan-500 text-black font-bold'
                        : 'bg-amber-500 text-black font-bold'
                      : 'text-neutral-400'
                  }`}
                >
                  {m === 'fullstack' ? 'Full Stack' : m}
                </button>
              ))}
            </div>

            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-mono text-neutral-300 hover:text-amber-400 py-1.5"
              >
                {item.label}
              </a>
            ))}

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 text-xs font-mono text-amber-400 border border-amber-500/30 rounded-full py-2 bg-amber-500/10"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Classic Portfolio</span>
            </Link>

            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 rounded-full bg-amber-500 py-3 text-xs font-mono font-bold uppercase text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]"
            >
              Get In Touch
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

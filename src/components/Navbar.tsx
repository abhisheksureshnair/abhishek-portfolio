'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { FileText, Menu, X, Command, Compass, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  onOpenResume: () => void;
  onOpenCommandK?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume, onOpenCommandK }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '#' },
    { name: 'ABOUT', href: '#about' },
    { name: 'EXPERIENCE', href: '#experience' },
    { name: 'PROJECTS', href: '#projects' },
    { name: 'STACK', href: '#stack' },
    { name: 'AI', href: '#ai' },
    { name: 'JOURNEY', href: '#journey' },
    { name: 'CONTACT', href: '#contact' },
  ];

  return (
    <>
      {/* Top Animated Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500 z-50 origin-left"
        style={{ scaleX }}
      />

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'py-3.5 bg-[#030508]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl shadow-black/80'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Monogram & Name */}
          <a
            href="#"
            className="flex items-center gap-3 group"
            data-cursor="pointer"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 via-zinc-900 to-black border border-indigo-500/40 group-hover:border-indigo-400 transition-all flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/10">
              <span className="font-mono text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300 group-hover:from-white group-hover:to-indigo-200 transition-colors">
                ASN
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                Abhishek S Nair
              </span>
              <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-mono">
                Software Developer
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/60 border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-1 text-[11px] font-mono tracking-wider text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
                data-cursor="pointer"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Group */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Experience Mode Button */}
            <Link
              href="/experience"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-indigo-600/30 text-xs font-mono font-bold transition-all shadow-sm"
              title="Enter 3D Open-World Experience"
              data-cursor="pointer"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>3D WORLD</span>
            </Link>

            {/* Recruiter Quick Search Ctrl+K */}
            {onOpenCommandK && (
              <button
                onClick={onOpenCommandK}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-xs font-mono transition-colors"
                title="Quick Search (Ctrl+K)"
                data-cursor="pointer"
              >
                <Command className="w-3 h-3 text-indigo-400" />
                <span className="text-[10px]">K</span>
              </button>
            )}

            {/* Resume Button */}
            <button
              onClick={onOpenResume}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs tracking-wide shadow-md shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5"
              data-cursor="pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/experience"
              className="px-2.5 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-mono font-bold"
            >
              3D
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[65px] z-30 bg-[#030508]/95 backdrop-blur-2xl border-b border-zinc-800 p-6 lg:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              <Link
                href="/experience"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-mono text-xs font-bold shadow-lg shadow-indigo-600/30"
              >
                <span>ENTER 3D EXPERIENCE MODE</span>
                <Compass className="w-4 h-4" />
              </Link>
              
              <nav className="grid grid-cols-2 gap-2 py-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-between"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-3 h-3 text-zinc-600" />
                  </a>
                ))}
              </nav>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
                className="w-full py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
              >
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>View Full Resume</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

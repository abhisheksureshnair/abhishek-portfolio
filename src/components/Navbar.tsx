'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Menu, X, Command, Compass } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface NavbarProps {
  onOpenResume: () => void;
  onOpenCommandK?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume, onOpenCommandK }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Selected Work', href: '#selected-work' },
    { name: 'Experience', href: '#experience' },
    { name: 'What I Build', href: '#what-i-build' },
    { name: 'Toolbox', href: '#toolbox' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'GitHub', href: '#github' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'py-3 glass-panel border-b border-white/10 shadow-2xl' : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo / Monogram (initial) or Profile Avatar (on scroll) */}
          <a
            href="#"
            className="flex items-center gap-3 group"
            data-cursor="pointer"
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-indigo-500/30 group-hover:border-indigo-400 transition-all duration-300 flex-shrink-0 bg-zinc-950">
              <AnimatePresence mode="wait">
                {!scrolled ? (
                  <motion.div
                    key="monogram"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-extrabold text-sm tracking-tighter group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-inner"
                  >
                    AN
                  </motion.div>
                ) : (
                  <motion.div
                    key="avatar"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full"
                  >
                    <Image
                      src="/avatar.webp"
                      alt="Abhishek S Nair"
                      width={80}
                      height={80}
                      sizes="40px"
                      quality={95}
                      priority
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                Abhishek S Nair
              </span>
              <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-mono">
                Full-Stack Dev
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-medium text-zinc-400 hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-indigo-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
                data-cursor="pointer"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Group */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Experience Mode Button */}
            <Link
              href="/experience"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-indigo-600/30 text-xs font-mono font-bold transition-all shadow-sm"
              title="Switch to 3D Open-World Experience Mode"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>EXPERIENCE MODE ↗</span>
            </Link>

            {/* Command K button */}
            {onOpenCommandK && (
              <button
                onClick={onOpenCommandK}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-xs font-mono transition-colors"
                title="Quick Search (Ctrl+K)"
              >
                <Command className="w-3.5 h-3.5" />
                <span>K</span>
              </button>
            )}

            {/* Resume CTA */}
            <button
              onClick={onOpenResume}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-indigo-500/50 text-xs font-semibold tracking-wide transition-all shadow-sm"
              data-cursor="pointer"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Resume</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <Link
              href="/experience"
              className="px-2.5 py-1.5 rounded-lg bg-indigo-950 border border-indigo-500/40 text-indigo-300 text-xs font-mono font-bold"
            >
              3D WORLD ↗
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
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
            className="fixed inset-x-0 top-[65px] z-30 bg-zinc-950/95 backdrop-blur-2xl border-b border-zinc-800 p-6 xl:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              <Link
                href="/experience"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold shadow-lg shadow-indigo-600/30"
              >
                <span>ENTER 3D EXPERIENCE MODE</span>
                <Compass className="w-4 h-4" />
              </Link>
              <nav className="flex flex-col gap-2 py-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium text-zinc-300 hover:text-white py-2 border-b border-zinc-900 flex items-center justify-between"
                  >
                    <span>{link.name}</span>
                    <span className="text-zinc-600 text-xs">→</span>
                  </a>
                ))}
              </nav>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
                className="w-full py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-semibold text-sm flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>View Full Resume</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

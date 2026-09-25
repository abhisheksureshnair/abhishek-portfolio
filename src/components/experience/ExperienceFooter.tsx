'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUp, Flame, ArrowLeft } from 'lucide-react';
import { EXPERIENCE_DATA } from './ExperienceData';

export const ExperienceFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-20 border-t border-white/10 bg-[#030303] px-6 py-12 sm:px-12 md:px-20 lg:px-28">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-neutral-500">
        <div className="flex items-center gap-3">
          <Flame className="h-4 w-4 text-amber-500" />
          <span className="text-neutral-300 font-semibold">{EXPERIENCE_DATA.hero.name}</span>
          <span>© {new Date().getFullYear()} All Rights Reserved.</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Classic Portfolio View</span>
          </Link>

          <span className="hidden sm:inline">60 FPS SCROLLYTELLING UNIVERSE</span>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-amber-400 transition-colors"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

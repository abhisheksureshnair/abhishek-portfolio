'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Check, Copy, ArrowUpRight, Flame, ArrowLeft } from 'lucide-react';
import { EXPERIENCE_DATA } from './ExperienceData';

export const ExperienceContact: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(EXPERIENCE_DATA.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      id="contact"
      className="relative z-20 bg-[#050505] px-6 py-28 sm:px-12 md:px-20 lg:px-28 overflow-hidden border-t border-white/10"
    >
      {/* Background radial spotlight */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[150px]" />

      <div className="relative mx-auto max-w-5xl text-center space-y-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-amber-400 backdrop-blur-md">
          <Flame className="h-3.5 w-3.5" />
          <span>07 / Direct Contact</span>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-white uppercase leading-[1.05]">
            LET’S BUILD <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400 bg-clip-text text-transparent">
              SOMETHING EXTRAORDINARY.
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-base sm:text-xl text-neutral-400 font-light leading-relaxed">
            Ready to collaborate on high-stakes mobile engineering, real-time Bluetooth IoT systems, or full-stack MERN &amp; AI architectures.
          </p>
        </div>

        {/* Copyable Email Pill */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={handleCopyEmail}
            className="group flex items-center gap-3 rounded-full border border-white/20 bg-neutral-900/80 px-8 py-4 font-mono text-sm sm:text-base text-white backdrop-blur-md transition-all duration-300 hover:border-amber-500 hover:bg-neutral-800 hover:shadow-[0_0_35px_rgba(245,158,11,0.3)]"
          >
            <Mail className="h-4 w-4 text-amber-400" />
            <span>{EXPERIENCE_DATA.contact.email}</span>
            <span className="rounded-full bg-white/10 p-1.5 transition-colors group-hover:bg-amber-500 group-hover:text-black">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </span>
          </button>

          <a
            href={`mailto:${EXPERIENCE_DATA.contact.email}`}
            className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 font-mono text-sm sm:text-base font-semibold uppercase tracking-wider text-black shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Send Direct Email
          </a>
        </div>

        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-mono text-amber-400"
          >
            ✓ Email address copied to clipboard!
          </motion.div>
        )}

        {/* Social Pill Grid */}
        <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-4">
          {EXPERIENCE_DATA.socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-5 py-2 text-xs font-mono text-neutral-300 transition-all duration-300 hover:border-amber-500 hover:text-white hover:bg-white/5"
            >
              <span>{social.name}</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-neutral-500" />
            </a>
          ))}

          <Link
            href="/"
            className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2 text-xs font-mono text-amber-300 transition-all duration-300 hover:border-amber-400 hover:bg-amber-500/20"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Switch to Classic Portfolio</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

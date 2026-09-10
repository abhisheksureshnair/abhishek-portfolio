'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Code2, Smartphone, Cpu } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-zinc-950 relative border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>// Editorial Profile</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Engineering across layers, <br />
            <span className="text-zinc-400 font-light italic">from mobile to full-stack & AI.</span>
          </h2>
        </div>

        {/* 2-Column Human Profile Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Story Paragraphs */}
          <div className="lg:col-span-7 space-y-6 text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
            <p>
              I am a Full-Stack Developer with over 3 years of professional software engineering experience. My foundational career was built in production mobile engineering — architecting and launching 5+ cross-platform mobile applications on the Google Play Store and Apple App Store across healthcare, fleet logistics, and mobile security.
            </p>
            <p>
              Over time, my work expanded into complete full-stack product development. I design and build end-to-end architectures: reactive web single-page applications in React, real-time Node.js/Express servers with Socket.IO telemetry streaming, and intelligent AI workflows leveraging NVIDIA NIM and OpenAI LLM endpoints.
            </p>
            <p className="text-white font-medium">
              Where I'm heading: I enjoy creating software products where high design fidelity meets serious technical complexity — bringing real-time systems, multi-agent AI, and clean user experience into unified, production-ready software.
            </p>
          </div>

          {/* Technical Persona Card with Professional Headshot */}
          <div className="lg:col-span-5">
            <div className="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-6 glass-panel">
              
              {/* Profile Image & Name Bar */}
              <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-indigo-500/50 shadow-xl shadow-indigo-500/20 flex-shrink-0 bg-zinc-950">
                  <Image
                    src="/avatar.webp"
                    alt="Abhishek S Nair Profile"
                    width={160}
                    height={160}
                    sizes="(max-width: 640px) 64px, 80px"
                    quality={95}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">Abhishek S Nair</h3>
                  <p className="text-xs font-mono text-indigo-400">Analyst — Software Dev</p>
                  <span className="text-[11px] font-mono text-zinc-400 mt-1 block">InnSpark Solutions Pvt. Ltd.</span>
                </div>
              </div>
              
              <div className="space-y-4 text-xs font-mono">
                <div className="flex items-start gap-3">
                  <Smartphone className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-white font-bold block">Mobile Foundations</span>
                    <span className="text-zinc-400">React Native, Flutter, iOS & Android releases</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Code2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-white font-bold block">Full-Stack Scale</span>
                    <span className="text-zinc-400">React, JavaScript, Node.js, Express, Socket.IO, MongoDB</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Cpu className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-white font-bold block">AI Integrations</span>
                    <span className="text-zinc-400">NVIDIA NIM, OpenAI APIs, Desktop AI assistants</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 text-xs font-mono text-zinc-500 flex items-center justify-between">
                <span>Location: <strong className="text-zinc-300">India</strong></span>
                <span className="text-emerald-400 font-bold">● Available for Hire</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

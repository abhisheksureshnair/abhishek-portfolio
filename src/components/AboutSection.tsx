'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Smartphone, Code2, Cpu, MapPin, Briefcase } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

// Word-by-word progressive opacity reveal component
const ScrollWordReveal: React.FC<{ text: string }> = ({ text }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.45'],
  });

  const words = text.split(' ');

  return (
    <p ref={containerRef} className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-2xl sm:text-3xl lg:text-4xl font-light text-zinc-500 leading-relaxed">
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return <Word key={i} word={word} progress={scrollYProgress} range={[start, end]} />;
      })}
    </p>
  );
};

const Word: React.FC<{ word: string; progress: any; range: [number, number] }> = ({
  word,
  progress,
  range,
}) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const color = useTransform(progress, range, ['#52525b', '#ffffff']);

  return (
    <motion.span style={{ opacity, color }} className="transition-colors duration-150 font-medium">
      {word}
    </motion.span>
  );
};

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-32 bg-[#060911] relative border-t border-white/5 overflow-hidden">
      
      {/* Background Radiance */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-cinematic-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>// 01. EDITORIAL PROFILE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Building Modern Web, Mobile, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-purple-300 font-bold">
              Desktop & AI Applications.
            </span>
          </h2>
        </div>

        {/* Cinematic Progressive Text Reveal with Audited Exact Content */}
        <div className="mb-24 p-8 sm:p-12 rounded-3xl bg-zinc-950/60 border border-white/10 backdrop-blur-2xl shadow-2xl">
          <ScrollWordReveal
            text="I’m Abhishek S Nair, a Software Developer focused on building modern web, mobile, desktop and AI-powered applications. My experience spans frontend development, backend APIs, real-time systems, cross-platform applications and AI/LLM integrations. I enjoy turning ideas into functional products — from full-stack platforms and real-time applications to AI-powered tools and specialized development utilities."
          />
        </div>

        {/* 2-Column Professional Identity Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Key Focus Areas */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Software Development & Independent Projects
              </h3>
              <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
                In my professional role as an <strong>Analyst at InnSpark Solutions Pvt. Ltd. (June 2023 – Present)</strong> in Software Development, I contribute to software development projects involving application development, feature implementation, integrations, debugging, testing and technical problem solving.
              </p>
              <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
                Alongside my professional work, I build independent full-stack platforms and AI-powered applications, demonstrating complete web architectures, real-time WebSocket communication, and generative AI integrations.
              </p>
            </div>

            {/* Capability Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
                <Code2 className="w-5 h-5 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">Full-Stack & Web</h4>
                <p className="text-xs text-zinc-400 font-light">React, Vite, Node.js, Express.js, MongoDB, REST APIs, and WebSockets.</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Application Dev</h4>
                <p className="text-xs text-zinc-400 font-light">Cross-platform mobile and desktop systems using React Native, Flutter, and Electron.</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <h4 className="text-sm font-bold text-white">AI & Real-Time</h4>
                <p className="text-xs text-zinc-400 font-light">LLM integrations, NVIDIA APIs, Socket.IO real-time channels, and smart assistants.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Persona Card (Accurate Role & Company) */}
          <div className="lg:col-span-5">
            <div className="h-full p-8 rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-black border border-white/10 shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-500/40 shadow-xl flex-shrink-0 bg-zinc-900">
                    <Image
                      src="/avatar.webp"
                      alt="Abhishek S Nair"
                      width={128}
                      height={128}
                      quality={95}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-extrabold text-white">Abhishek S Nair</h4>
                    <p className="text-xs font-mono text-cyan-400 font-semibold">ANALYST — SOFTWARE DEVELOPMENT</p>
                    <span className="text-[11px] font-mono text-zinc-300 block mt-0.5">InnSpark Solutions Pvt. Ltd.</span>
                    <span className="text-[10px] font-mono text-zinc-500 block">June 2023 – Present</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs font-mono border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                      Official Designation
                    </span>
                    <strong className="text-white">Analyst</strong>
                  </div>

                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-2">
                      <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                      Area
                    </span>
                    <strong className="text-white">Software Development</strong>
                  </div>

                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      Location
                    </span>
                    <strong className="text-white">Kerala, India</strong>
                  </div>

                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Experience
                    </span>
                    <strong className="text-white">3+ Years of Software Dev</strong>
                  </div>

                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-purple-400" />
                      Degree Focus
                    </span>
                    <strong className="text-white">MCA — AI Specialization</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-2 text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Engineering Status
                </span>
                <span className="text-emerald-400 font-bold uppercase">Active & Available</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

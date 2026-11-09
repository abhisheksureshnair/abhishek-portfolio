'use client';

import React from 'react';

interface SectionBackdropProps {
  variant: 'hero' | 'about' | 'experience' | 'projects' | 'tech' | 'ai' | 'journey' | 'contact';
}

export const SectionBackdrop: React.FC<SectionBackdropProps> = ({ variant }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10">
      {/* 1. HERO BACKDROP */}
      {variant === 'hero' && (
        <>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[750px] bg-gradient-to-b from-indigo-600/15 via-cyan-500/10 to-transparent rounded-full blur-[160px]" />
          <div className="absolute top-1/2 right-10 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px]" />
          <div className="absolute inset-0 bg-cinematic-grid opacity-30" />
        </>
      )}

      {/* 2. ABOUT BACKDROP (Architectural Wireframe & Cyan Nebula) */}
      {variant === 'about' && (
        <>
          <div className="absolute top-1/3 left-0 w-[550px] h-[550px] bg-cyan-600/12 rounded-full blur-[160px]" />
          <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[140px]" />
          {/* Subtle architectural schematic blueprint watermark */}
          <svg className="absolute right-0 top-1/4 w-[420px] h-[420px] text-cyan-400/5 stroke-current" fill="none" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" strokeWidth="0.5" strokeDasharray="2 2" />
            <circle cx="100" cy="100" r="50" strokeWidth="0.5" />
            <rect x="60" y="60" width="80" height="80" strokeWidth="0.5" strokeDasharray="4 2" />
            <line x1="100" y1="20" x2="100" y2="180" strokeWidth="0.5" />
            <line x1="20" y1="100" x2="180" y2="100" strokeWidth="0.5" />
          </svg>
          <div className="absolute inset-0 bg-cinematic-grid opacity-20" />
        </>
      )}

      {/* 3. EXPERIENCE BACKDROP (Vertical Data Backbone & Violet Aura) */}
      {variant === 'experience' && (
        <>
          <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-purple-600/12 rounded-full blur-[160px]" />
          <div className="absolute top-1/4 left-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[140px]" />
          {/* Animated vertical spine bus */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-purple-500/20 to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-cinematic-grid opacity-20" />
        </>
      )}

      {/* 4. PROJECTS BACKDROP (High-Tech Circuit Bus & Indigo Mesh) */}
      {variant === 'projects' && (
        <>
          <div className="absolute top-1/4 left-1/4 w-[650px] h-[650px] bg-indigo-600/12 rounded-full blur-[170px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[550px] h-[550px] bg-cyan-600/10 rounded-full blur-[150px]" />
          {/* Schematic circuit lines */}
          <svg className="absolute inset-0 w-full h-full text-indigo-400/5 stroke-current" fill="none">
            <path d="M 0 150 Q 250 150 400 300 T 800 300" strokeWidth="0.8" strokeDasharray="3 3" />
            <path d="M 1200 450 Q 950 450 800 600 T 400 600" strokeWidth="0.8" strokeDasharray="3 3" />
          </svg>
          <div className="absolute inset-0 bg-cinematic-grid opacity-25" />
        </>
      )}

      {/* 5. TECH BACKDROP (Ecosystem Constellation & Emerald Aura) */}
      {variant === 'tech' && (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/10 rounded-full blur-[180px]" />
          <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[140px]" />
          <div className="absolute inset-0 bg-circuit-pattern opacity-15" />
        </>
      )}

      {/* 6. AI BACKDROP (Neural Synapse & Magenta Radiance) */}
      {variant === 'ai' && (
        <>
          <div className="absolute top-1/3 left-1/3 w-[650px] h-[650px] bg-purple-600/12 rounded-full blur-[170px]" />
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px]" />
          <div className="absolute inset-0 bg-cinematic-grid opacity-20" />
        </>
      )}

      {/* 7. JOURNEY BACKDROP (Chronological Track & Cyan Glow) */}
      {variant === 'journey' && (
        <>
          <div className="absolute top-1/2 right-10 w-[550px] h-[550px] bg-cyan-600/10 rounded-full blur-[160px]" />
          <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[140px]" />
          <div className="absolute inset-0 bg-cinematic-grid opacity-20" />
        </>
      )}

      {/* 8. CONTACT BACKDROP (Converging Radiance & Horizon Glow) */}
      {variant === 'contact' && (
        <>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-t from-indigo-600/20 via-purple-600/10 to-transparent rounded-full blur-[180px]" />
          <div className="absolute inset-0 bg-cinematic-grid opacity-20" />
        </>
      )}
    </div>
  );
};


'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Compass } from 'lucide-react';

// Dynamic lazy import of CinematicExperience with no SSR to isolate performance
const CinematicExperience = dynamic(
  () => import('@/components/experience/CinematicExperience').then((m) => m.CinematicExperience),
  {
    ssr: false,
    loading: () => <ExperienceLoadingScreen />,
  }
);

function ExperienceLoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 25;
      });
    }, 60);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-mono selection:bg-amber-500/30">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center shadow-2xl shadow-amber-500/30">
          <Compass className="w-8 h-8 animate-spin" />
        </div>

        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">ABHISHEK S NAIR</h1>
          <p className="text-xs text-amber-400 mt-1">INITIALIZING CINEMATIC EXPERIENCE MODE</p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-full h-3 p-0.5 overflow-hidden">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-xs text-zinc-500 flex items-center justify-between">
          <span>Game Menu Engine</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}

export default function ExperiencePage() {
  return (
    <main className="min-h-screen bg-black text-white relative">
      <CinematicExperience />
    </main>
  );
}

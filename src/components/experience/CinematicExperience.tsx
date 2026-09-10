'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Compass,
  Volume2,
  VolumeX,
  Bot,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Code2,
  Award,
  Send,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Radio,
  X,
  MapPin,
  Crosshair,
  Terminal,
  Activity,
  ArrowUpRight,
  Briefcase,
  Check
} from 'lucide-react';
import {
  PERSONAL_INFO,
  SELECTED_PROJECTS,
  CERTIFICATIONS,
  EDUCATION,
  TECHNICAL_TOOLBOX,
  PROFESSIONAL_EXPERIENCE,
  Project
} from '@/data/portfolioData';
import { GithubIcon, LinkedinIcon } from '../Icons';
import { ProtectedImage } from '../ProtectedImage';
import { audioSynth } from './AudioSynth';
import { AbiAiGuide } from './AbiAiGuide';

// 8 Cinematic Scenes
interface SceneConfig {
  id: string;
  number: string;
  label: string;
  title: string;
  locationLabel: string;
  objective: string;
  bgImage: string;
  accentColor: string;
  glowColor: string;
}

const SCENES: SceneConfig[] = [
  {
    id: 'home',
    number: '01',
    label: 'START JOURNEY',
    title: 'ABHISHEK S NAIR // OPERATIVE DOSSIER',
    locationLabel: 'CITY LIGHTS',
    objective: 'START THE JOURNEY // MEET THE OPERATIVE',
    bgImage: '/scenes/scene_home_bg.jpg',
    accentColor: 'text-amber-400',
    glowColor: 'border-amber-500/40 shadow-amber-500/20'
  },
  {
    id: 'about',
    number: '02',
    label: 'ABOUT ME',
    title: 'PROFILE // CHARACTER DOSSIER',
    locationLabel: 'THE WATERFRONT',
    objective: 'DISCOVER THE OPERATIVE // REVIEW DOSSIER',
    bgImage: '/scenes/scene_about_bg.jpg',
    accentColor: 'text-cyan-400',
    glowColor: 'border-cyan-500/40 shadow-cyan-500/20'
  },
  {
    id: 'skills',
    number: '03',
    label: 'SKILLS',
    title: 'SKILLS UNLOCKED // TECHNICAL ARSENAL',
    locationLabel: 'DEVELOPER WORKSPACE',
    objective: 'INSPECT TECHNICAL ARSENAL // UNLOCK TOOLBOX',
    bgImage: '/scenes/scene_skills_bg.jpg',
    accentColor: 'text-sky-400',
    glowColor: 'border-sky-500/40 shadow-sky-500/20'
  },
  {
    id: 'projects',
    number: '04',
    label: 'PROJECTS',
    title: 'PROJECTS SHOWCASE // SELECT MISSION',
    locationLabel: 'DIGITAL DISTRICT',
    objective: 'EXPLORE SELECTED WORK // MISSION BRIEFING',
    bgImage: '/scenes/scene_projects_bg.jpg',
    accentColor: 'text-emerald-400',
    glowColor: 'border-emerald-500/40 shadow-emerald-500/20'
  },
  {
    id: 'experience',
    number: '05',
    label: 'EXPERIENCE',
    title: 'EXPERIENCE JOURNEY // INNSPARK HQ',
    locationLabel: 'INNSPARK HQ',
    objective: 'TRACE THE CAREER PATH // COMMERCIAL LOG',
    bgImage: '/scenes/scene_experience_bg.jpg',
    accentColor: 'text-indigo-400',
    glowColor: 'border-indigo-500/40 shadow-indigo-500/20'
  },
  {
    id: 'achievements',
    number: '06',
    label: 'ACHIEVEMENTS',
    title: 'ACHIEVEMENTS UNLOCKED // KEY MILESTONES',
    locationLabel: 'DOWNTOWN METROPOLIS',
    objective: 'REVIEW UNLOCKED MILESTONES // VERIFIED IMPACT',
    bgImage: '/scenes/scene_achievements_bg.jpg',
    accentColor: 'text-rose-400',
    glowColor: 'border-rose-500/40 shadow-rose-500/20'
  },
  {
    id: 'certifications',
    number: '07',
    label: 'CERTIFICATIONS',
    title: 'CERTIFICATIONS // THE ACADEMY',
    locationLabel: 'THE ACADEMY',
    objective: 'VERIFY ACADEMIC CREDENTIALS // ACADEMY',
    bgImage: '/scenes/scene_certifications_bg.jpg',
    accentColor: 'text-amber-300',
    glowColor: 'border-amber-400/40 shadow-amber-400/20'
  },
  {
    id: 'contact',
    number: '08',
    label: 'CONTACT',
    title: 'CONTACT // OPEN A SECURE LINE',
    locationLabel: 'NIGHT DRIVE',
    objective: 'OPEN A SECURE LINE // DISPATCH TRANSMISSION',
    bgImage: '/scenes/scene_contact_bg.jpg',
    accentColor: 'text-blue-400',
    glowColor: 'border-blue-500/40 shadow-blue-500/20'
  }
];

export const CinematicExperience: React.FC = () => {
  const [activeScene, setActiveScene] = useState<number>(0);
  const [visitedScenes, setVisitedScenes] = useState<Set<number>>(new Set([0]));
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [aiGuideOpen, setAiGuideOpen] = useState<boolean>(false);
  const [selectedMissionIndex, setSelectedMissionIndex] = useState<number>(0);
  const [selectedProjectModal, setSelectedProjectModal] = useState<Project | null>(null);
  const [missionCompleteModal, setMissionCompleteModal] = useState<boolean>(false);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Sound FX Toggle & Initial Arm
  useEffect(() => {
    audioSynth.setEnabled(true);
  }, []);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    audioSynth.setEnabled(nextState);
  };

  // Scene Navigation
  const goToScene = useCallback((index: number) => {
    if (index >= 0 && index < SCENES.length) {
      setActiveScene(index);
      setVisitedScenes((prev) => new Set([...prev, index]));
      audioSynth.playTransition();
    }
  }, []);

  // Keyboard navigation listener (W/S, Up/Down, 1-8)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedProjectModal || aiGuideOpen || missionCompleteModal) return;

      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        goToScene(activeScene - 1);
      } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        goToScene(activeScene + 1);
      } else if (e.key >= '1' && e.key <= '8') {
        goToScene(parseInt(e.key, 10) - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeScene, goToScene, selectedProjectModal, aiGuideOpen, missionCompleteModal]);

  // Handle Contact Form Submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: contactName, email: contactEmail, message: contactMessage }),
    }).catch(() => {});

    const mailtoUrl = `mailto:nairsabhishek@gmail.com?subject=${encodeURIComponent(
      `Portfolio Inquiry from ${contactName}`
    )}&body=${encodeURIComponent(`Name: ${contactName}\nEmail: ${contactEmail}\n\nMessage:\n${contactMessage}`)}`;
    window.location.href = mailtoUrl;

    setContactSubmitted(true);
    audioSynth.playSelect();
  };

  const currentScene = SCENES[activeScene];
  const activeMission = SELECTED_PROJECTS[selectedMissionIndex] || SELECTED_PROJECTS[0];

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden selection:bg-amber-500/30 select-none">
      
      {/* FULL-SCREEN CINEMATIC BACKGROUND WITH SLOW ZOOM */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${currentScene.bgImage})` }}
          />
        </AnimatePresence>

        {/* Cinematic Scrim & Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
        <div className="absolute inset-0 bg-noise opacity-25" />
      </div>

      {/* TOP HUD BAR */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between border-b border-white/10 bg-black/70 backdrop-blur-xl">
        
        {/* Left: Player Identity & Live Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-mono font-extrabold text-sm text-amber-400 shadow-lg shadow-amber-500/20">
            AN
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-wider uppercase">ABHISHEK.SN</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            </div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              FULL-STACK DEVELOPER // WEB · MOBILE · BACKEND · AI
            </p>
          </div>
        </div>

        {/* Center: System Status / Location */}
        <div className="hidden lg:flex items-center gap-6 font-mono text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-zinc-400">STATUS:</span>
            <span className="text-emerald-400 font-bold">AVAILABLE FOR OPPORTUNITIES</span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-zinc-400">LOCATION:</span>
            <span className="text-zinc-200 font-bold">KERALA, INDIA</span>
          </div>
        </div>

        {/* Right: Controls & Classic View Button */}
        <div className="flex items-center gap-3">
          
          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            onMouseEnter={() => audioSynth.playHover()}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono font-bold transition-all ${
              soundEnabled
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/20'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-500 hover:text-white'
            }`}
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'SFX ON' : 'SFX OFF'}</span>
          </button>

          {/* ABI AI Guide Drawer Button */}
          <button
            onClick={() => {
              setAiGuideOpen(true);
              audioSynth.playSelect();
            }}
            onMouseEnter={() => audioSynth.playHover()}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 hover:text-white hover:bg-cyan-600/30 text-xs font-mono font-bold transition-all shadow-lg shadow-cyan-500/20"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">ABI AI GUIDE</span>
          </button>

          {/* Return to Classic / Professional Mode */}
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold tracking-wider shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <span>CLASSIC VIEW ↗</span>
          </Link>
        </div>
      </header>

      {/* LEFT-SIDE VERTICAL GAME MENU */}
      <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-2 w-64 p-3 rounded-3xl bg-black/75 backdrop-blur-2xl border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 mb-1">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
            MAIN MENU [1-8]
          </span>
          <span className="text-[10px] font-mono text-amber-400">
            {activeScene + 1}/08
          </span>
        </div>

        {SCENES.map((scene, idx) => {
          const isActive = activeScene === idx;
          const isVisited = visitedScenes.has(idx);

          return (
            <button
              key={scene.id}
              onClick={() => goToScene(idx)}
              onMouseEnter={() => audioSynth.playHover()}
              className={`group flex items-center justify-between px-3.5 py-2.5 rounded-2xl border text-left font-mono text-xs font-bold tracking-wider transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? 'bg-amber-500/20 border-amber-500/60 text-white shadow-lg shadow-amber-500/10'
                  : 'bg-zinc-950/60 border-white/5 text-zinc-400 hover:text-white hover:border-white/20'
              }`}
            >
              {/* Active Indicator Strip */}
              {isActive && (
                <motion.div
                  layoutId="activeGameMenuStrip"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 shadow-[0_0_12px_#fbbf24]"
                />
              )}

              <div className="flex items-center gap-2.5 relative z-10">
                <span className={`text-[10px] ${isActive ? 'text-amber-400' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                  {scene.number}
                </span>
                <span>{scene.label}</span>
              </div>

              <div className="flex items-center gap-1.5 relative z-10">
                {isVisited && !isActive && (
                  <Check className="w-3.5 h-3.5 text-emerald-400/70" />
                )}
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    isActive ? 'text-amber-400 translate-x-0.5' : 'text-zinc-700 group-hover:translate-x-0.5'
                  }`}
                />
              </div>
            </button>
          );
        })}

        {/* Classic View Action in Menu */}
        <Link
          href="/"
          className="mt-2 flex items-center justify-between px-3.5 py-2.5 rounded-2xl border border-indigo-500/30 bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/60 hover:text-white font-mono text-xs font-bold transition-all"
        >
          <span>CLASSIC VIEW</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />
        </Link>
      </aside>

      {/* BOTTOM-LEFT: CURRENT OBJECTIVE & RADAR MINI-MAP */}
      <div className="fixed bottom-6 left-6 z-30 hidden lg:flex flex-col gap-2.5 w-80 p-4 rounded-3xl bg-black/80 backdrop-blur-2xl border border-white/10 shadow-2xl">
        
        {/* Dynamic Objective Header */}
        <div className="space-y-1 pb-2 border-b border-white/10">
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Crosshair className="w-3 h-3 text-amber-400 animate-spin" />
              <span>CURRENT OBJECTIVE</span>
            </span>
            <span className="text-zinc-500">SECTOR 0{activeScene + 1}</span>
          </div>
          <p className="text-xs font-mono font-extrabold text-white tracking-wide truncate">
            {currentScene.objective}
          </p>
        </div>

        {/* Abstract Radar Mini-Map */}
        <div className="flex items-center gap-3 pt-1">
          <div className="relative w-16 h-16 rounded-full border border-cyan-500/30 bg-cyan-950/30 flex items-center justify-center overflow-hidden shrink-0">
            {/* Radar Sweep Animation */}
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(6,182,212,0.3)_90deg,transparent_180deg)] animate-spin" />
            <div className="w-8 h-8 rounded-full border border-cyan-500/20" />
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-ping" />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-zinc-400">RADAR WAYPOINTS</span>
              <span className="text-emerald-400">8/8 ONLINE</span>
            </div>
            
            {/* Waypoint Sector Pips (Click to jump) */}
            <div className="grid grid-cols-4 gap-1.5">
              {SCENES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => goToScene(idx)}
                  className={`h-4 rounded-md text-[9px] font-mono font-bold flex items-center justify-center transition-all ${
                    activeScene === idx
                      ? 'bg-amber-400 text-black shadow-md shadow-amber-400/40'
                      : visitedScenes.has(idx)
                      ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30'
                      : 'bg-zinc-900 text-zinc-600'
                  }`}
                  title={`Sector ${s.number}: ${s.label}`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM-RIGHT: SECTION COUNTER & CINEMATIC LOCATION CALLOUT */}
      <div className="fixed bottom-6 right-6 z-30 hidden sm:flex items-center gap-4 px-5 py-3 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 font-mono text-xs">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-zinc-400">LOCATION:</span>
          <span className="text-white font-extrabold">{currentScene.locationLabel}</span>
        </div>
        <span className="text-zinc-700">|</span>
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-extrabold">0{activeScene + 1} / 08</span>
          <span className="text-zinc-400">{currentScene.label}</span>
        </div>
      </div>

      {/* MAIN VIEWPORT SCENE CONTENT */}
      <main className="relative z-10 pt-24 pb-28 px-6 sm:px-12 lg:pl-80 lg:pr-16 max-w-7xl mx-auto min-h-screen flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="w-full"
          >

            {/* ========================================================
                SCENE 01: START JOURNEY (HOME)
            ======================================================== */}
            {activeScene === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[70vh]">
                
                {/* Left Typography & Hero Statement */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-mono uppercase tracking-widest shadow-lg shadow-amber-500/10">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>CINEMATIC DEVELOPER EXPERIENCE</span>
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none uppercase">
                      ABHISHEK<br />S NAIR
                    </h1>
                    <p className="text-2xl sm:text-3xl font-light text-zinc-300 tracking-wide">
                      FULL-STACK DEVELOPER
                    </p>
                    <p className="text-xs sm:text-sm font-mono text-amber-400 tracking-widest uppercase">
                      WEB · MOBILE · BACKEND · AI
                    </p>
                  </div>

                  <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed max-w-xl">
                    Building production-grade digital products across Web, Mobile, Backend, and AI systems with high visual standards and architectural depth.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {['React & Next.js', 'React Native & Flutter', 'Node.js & MongoDB', 'WebSockets & BLE', 'AI & LLM Integration'].map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/15 text-xs font-mono text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <button
                      onClick={() => goToScene(3)}
                      onMouseEnter={() => audioSynth.playHover()}
                      className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm font-mono tracking-wider shadow-xl shadow-amber-500/30 transition-all transform hover:-translate-y-0.5"
                    >
                      EXPLORE PROJECTS (WORK) →
                    </button>
                    <button
                      onClick={() => goToScene(2)}
                      onMouseEnter={() => audioSynth.playHover()}
                      className="px-8 py-4 rounded-2xl bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-700 text-zinc-200 font-bold text-sm font-mono tracking-wider transition-all"
                    >
                      VIEW ARSENAL
                    </button>
                  </div>
                </div>

                {/* Right: Real Photo Character Portrait Frame */}
                <div className="lg:col-span-5 relative flex justify-center">
                  <div className="relative w-72 h-96 sm:w-80 sm:h-[440px] rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-2xl shadow-amber-500/25 group bg-zinc-950">
                    <ProtectedImage
                      alt="Abhishek S Nair"
                      className="w-full h-full"
                      objectFit="cover"
                      objectPosition="top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    
                    {/* HUD Telemetry Coordinates */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-[10px] font-mono text-amber-400 bg-black/70 backdrop-blur-md p-2 rounded-xl border border-white/10">
                      <span>LAT 10.8505° N</span>
                      <span>EXP: 3+ YEARS</span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                          OPERATIVE: ABHISHEK S NAIR
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <p className="text-xs text-zinc-300 font-medium">
                        Analyst — Software Development @ InnSpark Solutions
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================
                SCENE 02: ABOUT ME
            ======================================================== */}
            {activeScene === 1 && (
              <div className="space-y-7 max-w-5xl">

                {/* Section Header */}
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                    CHARACTER PROFILE // OPERATIVE DOSSIER
                  </span>
                  <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white mt-1 uppercase">
                    ABOUT ME
                  </h2>
                </div>

                {/* TOP ROW: Photo + Identity + Professional Intro */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                  {/* Photo Dossier Card */}
                  <div className="md:col-span-4 rounded-3xl bg-black/75 backdrop-blur-xl border border-cyan-500/40 p-5 flex flex-col items-center text-center space-y-4 shadow-2xl">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-cyan-500/50 shadow-xl shadow-cyan-500/20">
                      <ProtectedImage
                        alt="Abhishek S Nair"
                        className="w-full h-full"
                        objectFit="cover"
                        objectPosition="top"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">Abhishek S Nair</h3>
                      <p className="text-xs font-mono text-cyan-400 mt-0.5 font-bold uppercase tracking-widest">Full-Stack Developer</p>
                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                        Analyst — Software Development<br />
                        <span className="text-zinc-300 font-semibold">InnSpark Solutions Pvt. Ltd.</span><br />
                        Jun 2023 – Present
                      </p>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="w-full pt-3 border-t border-zinc-800 grid grid-cols-2 gap-2 text-center font-mono text-[11px]">
                      <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                        <span className="text-2xl font-extrabold text-white">3+</span>
                        <p className="text-zinc-500 text-[10px] mt-0.5">Years Exp.</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                        <span className="text-2xl font-extrabold text-cyan-400">5+</span>
                        <p className="text-zinc-500 text-[10px] mt-0.5">Production Apps</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                        <span className="text-xs font-extrabold text-amber-400">WEB · MOBILE</span>
                        <p className="text-zinc-500 text-[10px] mt-0.5">Platforms</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                        <span className="text-xs font-extrabold text-emerald-400">BACKEND · AI</span>
                        <p className="text-zinc-500 text-[10px] mt-0.5">Specialisms</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-emerald-400 font-bold">AVAILABLE FOR ROLES</span>
                    </div>
                  </div>

                  {/* Professional Narrative */}
                  <div className="md:col-span-8 space-y-5">

                    {/* Intro Bio */}
                    <div className="rounded-3xl bg-black/75 backdrop-blur-xl border border-white/10 p-6 space-y-3 shadow-xl">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-cyan-400" />
                        <span className="font-bold text-sm text-white uppercase tracking-wide">PROFESSIONAL PROFILE</span>
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed font-light">
                        I'm a <span className="text-white font-semibold">Full-Stack Developer</span> with 3+ years of commercial experience building production-grade applications across healthcare, fleet telematics, parental safety, and IoT systems. As an <span className="text-cyan-400 font-semibold">Analyst — Software Development at InnSpark Solutions</span>, I've deployed 5+ mobile applications to the Google Play Store and Apple App Store, architected real-time WebSocket systems, and implemented hardware-level Bluetooth BLE integrations.
                      </p>
                      <p className="text-sm text-zinc-400 leading-relaxed font-light">
                        Beyond my professional role, I explore the frontier of AI — building multi-agent LLM systems, desktop AI companions, and algorithmic stock intelligence platforms. My personal projects reflect my commitment to staying ahead of the curve technically and creatively.
                      </p>
                    </div>

                    {/* Tech Focus Areas */}
                    <div className="rounded-3xl bg-black/75 backdrop-blur-xl border border-white/10 p-5 space-y-3 shadow-xl">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold block">TECHNICAL FOCUS AREAS</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {[
                          { icon: Code2, label: 'Web Applications', desc: 'React, Next.js, JavaScript, REST APIs', color: 'text-cyan-400' },
                          { icon: Smartphone, label: 'Mobile Development', desc: 'React Native · Flutter · iOS & Android', color: 'text-amber-400' },
                          { icon: Terminal, label: 'Backend & Real-Time', desc: 'Node.js · Express · Socket.IO · MongoDB', color: 'text-emerald-400' },
                          { icon: Bot, label: 'AI & LLM Systems', desc: 'NVIDIA NIM · OpenAI · Multi-Agent Workflows', color: 'text-purple-400' },
                        ].map((area) => {
                          const AreaIcon = area.icon;
                          return (
                            <div key={area.label} className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                              <AreaIcon className={`w-4 h-4 mt-0.5 shrink-0 ${area.color}`} />
                              <div>
                                <span className="font-bold text-white text-xs">{area.label}</span>
                                <p className="text-zinc-500 text-[11px] mt-0.5 font-mono">{area.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>

                {/* BOTTOM ROW: Career Narrative + Education */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Career Philosophy */}
                  <div className="rounded-3xl bg-black/75 backdrop-blur-xl border border-cyan-500/25 p-6 space-y-3 shadow-xl">
                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                      <Briefcase className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">WHAT DRIVES ME</span>
                    </div>
                    <p className="text-sm text-zinc-300 font-light leading-relaxed">
                      I don't just write code — I engineer products. Whether it's a low-latency Socket.IO telemetry stream, a hardware BLE GATT characteristic parser, or a generative AI pipeline, I bring the same rigor: <span className="text-white font-semibold">clean architecture, visual precision, and user-centric execution</span>.
                    </p>
                    <p className="text-sm text-zinc-400 font-light leading-relaxed">
                      I thrive in full-ownership environments where I can take a feature from whiteboard to production. My strength lies in bridging complex backend logic with polished front-end experiences across web, mobile, and desktop.
                    </p>
                  </div>

                  {/* Education Snapshot */}
                  <div className="rounded-3xl bg-black/75 backdrop-blur-xl border border-cyan-500/25 p-6 space-y-3 shadow-xl">
                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">EDUCATION</span>
                    </div>
                    {EDUCATION.map((edu) => (
                      <div key={edu.id} className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">{edu.year}</span>
                          <span className="text-[10px] font-mono text-amber-400 font-bold">ACADEMIC</span>
                        </div>
                        <h4 className="text-sm font-bold text-white leading-snug">{edu.degree}</h4>
                        <p className="text-[11px] text-zinc-400 font-mono">{edu.institution}</p>
                      </div>
                    ))}
                    <button
                      onClick={() => goToScene(6)}
                      className="w-full py-2 rounded-xl bg-zinc-900 border border-amber-500/30 text-xs font-mono text-amber-400 font-bold hover:bg-zinc-800 transition-colors"
                    >
                      VIEW FULL CREDENTIALS →
                    </button>
                  </div>

                </div>

              </div>
            )}

            {/* ========================================================
                SCENE 03: SKILLS
            ======================================================== */}
            {activeScene === 2 && (
              <div className="space-y-8 max-w-5xl">
                <div>
                  <span className="text-xs font-mono text-sky-400 uppercase tracking-widest font-bold">
                    TECHNICAL INVENTORY
                  </span>
                  <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white mt-1 uppercase">
                    SKILLS UNLOCKED
                  </h2>
                </div>

                {/* Skill Tier Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    { category: 'FRONTEND', level: 'STRONG', icon: Code2, color: 'text-cyan-400', skills: ['React', 'Next.js', 'JavaScript (ES6+)', 'Vite', 'React Router', 'Tailwind CSS'] },
                    { category: 'MOBILE', level: 'STRONG', icon: Smartphone, color: 'text-amber-400', skills: ['React Native', 'Flutter', 'Dart', 'Android (Gradle)', 'iOS (Xcode)', 'GetX'] },
                    { category: 'BACKEND', level: 'STRONG', icon: Terminal, color: 'text-emerald-400', skills: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'JWT Security', 'FastAPI'] },
                    { category: 'REAL-TIME & IOT', level: 'STRONG', icon: Radio, color: 'text-sky-400', skills: ['WebSockets', 'Socket.IO', 'Bluetooth BLE', 'GPS Telemetry', 'Geofencing'] },
                    { category: 'AI & MACHINE LEARNING', level: 'WORKING', icon: Bot, color: 'text-purple-400', skills: ['LLM Integration', 'NVIDIA NIM APIs', 'OpenAI API', 'Prompt Engineering', 'Multi-Agent'] },
                    { category: 'TOOLS & DESKTOP', level: 'STRONG', icon: Layers, color: 'text-rose-400', skills: ['Electron', 'Git / GitHub', 'VS Code', 'Postman', 'Docker Basics'] },
                  ].map((tier) => {
                    const IconComponent = tier.icon;
                    return (
                      <div
                        key={tier.category}
                        className="rounded-3xl bg-black/75 backdrop-blur-xl border border-sky-500/25 p-5 space-y-3 shadow-xl"
                      >
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                          <div className="flex items-center gap-2">
                            <IconComponent className={`w-4 h-4 ${tier.color}`} />
                            <span className="font-bold text-xs font-mono text-white">{tier.category}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-sky-950 border border-sky-500/40 text-[9px] font-mono text-sky-300 font-bold">
                            {tier.level}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {tier.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 rounded-xl bg-zinc-950/80 border border-zinc-800 text-[11px] font-mono text-zinc-300 hover:border-sky-500/40 transition-colors"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================
                SCENE 04: PROJECTS (INTERACTIVE MISSION SELECTOR)
            ======================================================== */}
            {activeScene === 3 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                    MISSION SELECTION
                  </span>
                  <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white mt-1 uppercase">
                    PROJECTS SHOWCASE
                  </h2>
                </div>

                {/* Mission Roster + Selected Dossier */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left: Mission Selector List */}
                  <div className="lg:col-span-5 space-y-2.5 max-h-[62vh] overflow-y-auto pr-1">
                    {SELECTED_PROJECTS.map((project, idx) => {
                      const isSelected = selectedMissionIndex === idx;
                      return (
                        <div
                          key={project.id}
                          onClick={() => {
                            setSelectedMissionIndex(idx);
                            audioSynth.playSelect();
                          }}
                          onMouseEnter={() => audioSynth.playHover()}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                            isSelected
                              ? 'bg-emerald-500/20 border-emerald-400 shadow-xl shadow-emerald-500/15'
                              : 'bg-black/70 border-white/10 hover:border-white/25 hover:bg-black/90'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-emerald-400">
                              MISSION 0{idx + 1}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 uppercase">
                              {project.category}
                            </span>
                          </div>
                          <h4 className="text-base font-extrabold text-white mt-1">
                            {project.title}
                          </h4>
                          <p className="text-xs text-zinc-400 line-clamp-1 font-light mt-0.5">
                            {project.tagline}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right: Selected Mission Dossier */}
                  <div className="lg:col-span-7 rounded-3xl bg-black/85 backdrop-blur-2xl border border-emerald-500/40 p-6 sm:p-8 space-y-5 shadow-2xl">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold uppercase">
                          {activeMission.category} // MISSION 0{selectedMissionIndex + 1}
                        </span>
                        {activeMission.isFlagship && (
                          <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold uppercase">
                            ★ FLAGSHIP
                          </span>
                        )}
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-black text-white">
                        {activeMission.title}
                      </h3>
                      <p className="text-sm text-zinc-300 font-light leading-relaxed">
                        {activeMission.description}
                      </p>
                    </div>

                    {/* Architecture / Highlights Preview */}
                    <div className="space-y-2 pt-2 border-t border-zinc-800">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                        MISSION HIGHLIGHTS
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {activeMission.highlights.slice(0, 4).map((hl, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="text-zinc-300 font-light">{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack */}
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
                        EQUIPPED TECH
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeMission.stack.map((t) => (
                          <span key={t} className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Triggers */}
                    <div className="flex flex-wrap gap-3 pt-3 border-t border-zinc-800">
                      <button
                        onClick={() => setSelectedProjectModal(activeMission)}
                        className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold font-mono text-xs shadow-lg shadow-emerald-500/25 transition-all"
                      >
                        VIEW FULL CASE STUDY
                      </button>
                      <a
                        href={activeMission.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono text-xs font-bold flex items-center gap-2"
                      >
                        <GithubIcon className="w-4 h-4" />
                        <span>GITHUB</span>
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ========================================================
                SCENE 05: EXPERIENCE (INNSPARK SOLUTIONS)
            ======================================================== */}
            {activeScene === 4 && (
              <div className="space-y-8 max-w-4xl">
                <div>
                  <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">
                    COMMERCIAL DEPLOYMENT LOG
                  </span>
                  <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white mt-1 uppercase">
                    EXPERIENCE JOURNEY
                  </h2>
                </div>

                <div className="rounded-3xl bg-black/80 backdrop-blur-2xl border border-indigo-500/40 p-8 space-y-6 shadow-2xl">
                  <div className="flex flex-wrap justify-between items-start gap-4 pb-6 border-b border-zinc-800">
                    <div>
                      <span className="px-3 py-1 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-400 font-mono text-xs font-bold uppercase">
                        ACTIVE ROLE // INNSPARK HQ
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-white mt-2">
                        {PROFESSIONAL_EXPERIENCE.company}
                      </h3>
                      <p className="text-sm text-indigo-400 font-mono mt-0.5">{PROFESSIONAL_EXPERIENCE.role}</p>
                    </div>
                    <span className="px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400">
                      {PROFESSIONAL_EXPERIENCE.period}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-sm text-zinc-300 font-light leading-relaxed">
                    {PROFESSIONAL_EXPERIENCE.achievements.map((ach, i) => (
                      <p key={i}>• {ach}</p>
                    ))}
                  </div>

                  {/* Completed Commercial Operations */}
                  <div className="pt-4 border-t border-zinc-800">
                    <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">
                      COMPLETED COMMERCIAL MISSIONS
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PROFESSIONAL_EXPERIENCE.projects.map((op, idx) => (
                        <div key={op.id} className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1.5">
                          <span className="text-[10px] font-mono text-indigo-400 font-bold">
                            MISSION COMPLETE // 0{idx + 1}
                          </span>
                          <h5 className="text-xs font-bold text-white">{op.title}</h5>
                          <p className="text-[11px] text-zinc-400 line-clamp-2">{op.summary}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {op.tech.map((t) => (
                              <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                SCENE 06: ACHIEVEMENTS
            ======================================================== */}
            {activeScene === 5 && (
              <div className="space-y-8 max-w-4xl">
                <div>
                  <span className="text-xs font-mono text-rose-400 uppercase tracking-widest font-bold">
                    VERIFIED MILESTONES
                  </span>
                  <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white mt-1 uppercase">
                    ACHIEVEMENTS UNLOCKED
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { id: '1', title: '3+ Years Commercial Experience', desc: 'Analyst — Software Development at InnSpark Solutions driving enterprise software delivery.', badge: 'CAREER MILESTONE', color: 'text-amber-400' },
                    { id: '2', title: '5+ Production Mobile Apps Deployed', desc: 'Successfully architected and published applications across iOS and Android stores.', badge: 'DEPLOYMENT EXCELLENCE', color: 'text-cyan-400' },
                    { id: '3', title: 'Flagship Full-Stack AI Architecture', desc: 'Engineered FlowSync uniting MERN stack, WebSockets, and NVIDIA NIM LLM intelligence.', badge: 'AI ENGINEERING', color: 'text-emerald-400' },
                    { id: '4', title: 'Low-Latency BLE & GPS Telemetry', desc: 'Wrote hardware-level Bluetooth GATT parsers and battery-efficient GPS streaming pipelines.', badge: 'CONNECTED SYSTEMS', color: 'text-indigo-400' },
                    { id: '5', title: 'Multi-Agent Stock AI Engine', desc: 'Built AlphaPulse with Python FastAPI backend and dual Flutter/React Native mobile clients.', badge: 'ALGORITHMIC SYSTEMS', color: 'text-purple-400' },
                    { id: '6', title: 'Cross-Platform Monorepo Architecture', desc: 'Engineered LiveSync family safety suite across iOS, Android, and Web interfaces.', badge: 'ARCHITECTURE', color: 'text-rose-400' }
                  ].map((ach) => (
                    <div
                      key={ach.id}
                      className="rounded-3xl bg-black/80 backdrop-blur-xl border border-rose-500/25 p-6 space-y-2.5 shadow-xl"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">
                          {ach.badge}
                        </span>
                        <Award className={`w-4 h-4 ${ach.color}`} />
                      </div>
                      <h3 className="text-lg font-extrabold text-white">{ach.title}</h3>
                      <p className="text-xs text-zinc-400 font-light leading-relaxed">{ach.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================
                SCENE 07: THE ACADEMY (EDUCATION + CERTIFICATIONS)
            ======================================================== */}
            {activeScene === 6 && (
              <div className="space-y-8 max-w-5xl">

                {/* Section Header */}
                <div>
                  <span className="text-xs font-mono text-amber-300 uppercase tracking-widest font-bold">
                    ACADEMIC CREDENTIALS // VERIFIED RECORD
                  </span>
                  <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white mt-1 uppercase">
                    THE ACADEMY
                  </h2>
                </div>

                {/* AREA 1: EDUCATION */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-amber-500/30" />
                    <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10">
                      EDUCATION RECORD
                    </span>
                    <div className="h-px flex-1 bg-amber-500/30" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {EDUCATION.map((edu, idx) => (
                      <div
                        key={edu.id}
                        className="rounded-3xl bg-black/80 backdrop-blur-xl border border-amber-400/30 p-6 space-y-3 shadow-xl"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-400 uppercase">
                            {edu.year === 'Pursuing' ? '🎓 PURSUING' : `COMPLETED ${edu.year}`}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-600">0{idx + 1}</span>
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-white leading-snug">{edu.degree}</h3>
                          <p className="text-xs font-mono text-amber-300 mt-1">{edu.institution}</p>
                        </div>
                        {edu.focus && (
                          <p className="text-[11px] text-zinc-400 font-light leading-relaxed border-t border-zinc-800 pt-2">
                            {edu.focus}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* AREA 2: CERTIFICATIONS */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-amber-500/30" />
                    <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10">
                      VERIFIED CERTIFICATIONS
                    </span>
                    <div className="h-px flex-1 bg-amber-500/30" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CERTIFICATIONS.map((cert, idx) => (
                      <div
                        key={cert.id}
                        className="rounded-3xl bg-black/80 backdrop-blur-xl border border-amber-400/20 p-5 flex flex-col justify-between space-y-3 shadow-xl hover:border-amber-400/50 transition-colors group"
                      >
                        {/* Header */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded-full bg-zinc-950 border border-zinc-800 text-[9px] font-mono text-zinc-400 uppercase">
                              {cert.category}
                            </span>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                          <h3 className="text-sm font-extrabold text-white leading-snug">{cert.title}</h3>
                          <p className="text-xs font-mono text-amber-400 font-bold">{cert.issuer}</p>
                        </div>

                        {/* Credential Details */}
                        <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-zinc-500">ISSUED</span>
                            <span className="text-zinc-300 font-bold">{cert.issued}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-zinc-500">CREDENTIAL ID</span>
                            <span className="text-zinc-400 font-bold">{cert.credentialId}</span>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1">
                          {cert.skillsCovered.slice(0, 3).map((s) => (
                            <span key={s} className="px-2 py-0.5 rounded bg-zinc-950 text-[9px] font-mono text-zinc-400 border border-zinc-800">
                              {s}
                            </span>
                          ))}
                        </div>

                        {/* Verify Button */}
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-zinc-950 border border-amber-500/20 text-[10px] font-mono text-amber-400 font-bold hover:border-amber-400/60 hover:bg-zinc-900 transition-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3" />
                            VERIFY CREDENTIAL
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================
                SCENE 08: CONTACT (OPEN A SECURE LINE)
            ======================================================== */}
            {activeScene === 7 && (
              <div className="space-y-8 max-w-3xl">
                <div>
                  <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">
                    FINAL MISSION
                  </span>
                  <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white mt-1 uppercase">
                    OPEN A SECURE LINE
                  </h2>
                </div>

                <div className="rounded-3xl bg-black/85 backdrop-blur-2xl border border-blue-500/40 p-8 space-y-6 shadow-2xl">
                  {contactSubmitted ? (
                    <div className="text-center py-8 space-y-4">
                      <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                      <h3 className="text-2xl font-black text-white">TRANSMISSION DISPATCHED</h3>
                      <p className="text-xs text-zinc-400">Message sent to nairsabhishek@gmail.com.</p>
                      <div className="pt-4 flex justify-center gap-3">
                        <button
                          onClick={() => setContactSubmitted(false)}
                          className="px-6 py-2.5 rounded-xl bg-zinc-800 text-xs font-mono text-white"
                        >
                          SEND ANOTHER
                        </button>
                        <button
                          onClick={() => setMissionCompleteModal(true)}
                          className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-mono text-xs font-bold"
                        >
                          VIEW MISSION REPORT
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-mono text-zinc-400 block mb-1.5 font-bold">OPERATIVE NAME</label>
                          <input
                            type="text"
                            required
                            placeholder="Enter Name"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:border-blue-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-mono text-zinc-400 block mb-1.5 font-bold">RETURN FREQUENCY (EMAIL)</label>
                          <input
                            type="email"
                            required
                            placeholder="Enter Email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:border-blue-500 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-mono text-zinc-400 block mb-1.5 font-bold">TRANSMISSION CONTENT</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="State mission brief, engineering scope or position details..."
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:border-blue-500 outline-none resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs font-mono tracking-wider shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>DISPATCH TRANSMISSION</span>
                      </button>
                    </form>
                  )}

                  {/* Direct Contact Links */}
                  <div className="pt-6 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                    <a
                      href={`mailto:${PERSONAL_INFO.email}`}
                      className="text-zinc-400 hover:text-white transition-colors"
                    >
                      SECURE LINE: <span className="text-blue-400 font-bold">{PERSONAL_INFO.email}</span>
                    </a>
                    <div className="flex items-center gap-3">
                      <a
                        href={PERSONAL_INFO.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
                        title="GitHub Profile"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                      <a
                        href={PERSONAL_INFO.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
                        title="LinkedIn Profile"
                      >
                        <LinkedinIcon className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Final Mission Complete Trigger */}
                <div className="text-center pt-2">
                  <button
                    onClick={() => setMissionCompleteModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-extrabold shadow-lg shadow-amber-500/20"
                  >
                    <span>MISSION COMPLETE // VIEW FINAL REPORT</span>
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* MOBILE BOTTOM NAVIGATION DOCK (VISIBLE ONLY ON SMALL SCREENS) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden px-4 py-3 bg-black/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around font-mono text-[10px]">
        {SCENES.slice(0, 5).map((s, idx) => (
          <button
            key={s.id}
            onClick={() => goToScene(idx)}
            className={`flex flex-col items-center gap-0.5 p-1 ${
              activeScene === idx ? 'text-amber-400 font-bold' : 'text-zinc-500'
            }`}
          >
            <span>0{idx + 1}</span>
            <span>{s.label.split(' ')[0]}</span>
          </button>
        ))}
        <Link
          href="/"
          className="text-indigo-400 font-bold flex flex-col items-center gap-0.5 p-1"
        >
          <span>↗</span>
          <span>CLASSIC</span>
        </Link>
      </nav>

      {/* PROJECT CASE STUDY OVERLAY MODAL */}
      <AnimatePresence>
        {selectedProjectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl p-6 sm:p-12 overflow-y-auto flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl w-full rounded-3xl bg-zinc-950 border border-emerald-500/50 p-6 sm:p-8 space-y-6 shadow-2xl my-auto"
            >
              <button
                onClick={() => setSelectedProjectModal(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1.5">
                <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold uppercase">
                  {selectedProjectModal.category}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white">{selectedProjectModal.title}</h2>
                <p className="text-sm text-zinc-400 font-light">{selectedProjectModal.tagline}</p>
              </div>

              {/* Problem / Solution Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <span className="font-mono text-rose-400 font-bold uppercase">PROBLEM STATEMENT</span>
                  <p className="text-zinc-300 font-light leading-relaxed">{selectedProjectModal.problem}</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <span className="font-mono text-emerald-400 font-bold uppercase">ARCHITECTURAL SOLUTION</span>
                  <p className="text-zinc-300 font-light leading-relaxed">{selectedProjectModal.solution}</p>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">KEY ENGINEERING WINS</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedProjectModal.highlights.map((h, i) => (
                    <div key={i} className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-zinc-300">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stack */}
              <div>
                <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">TECHNOLOGY STACK</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProjectModal.stack.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-900">
                <a
                  href={selectedProjectModal.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold font-mono text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/30"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>VIEW GITHUB REPOSITORY</span>
                </a>
                <button
                  onClick={() => setSelectedProjectModal(null)}
                  className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-xs font-bold"
                >
                  CLOSE CASE STUDY
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FINAL MISSION COMPLETE MODAL */}
      <AnimatePresence>
        {missionCompleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-3xl p-6 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="relative max-w-xl w-full rounded-3xl bg-zinc-950 border-2 border-amber-500/60 p-8 text-center space-y-6 shadow-2xl shadow-amber-500/20"
            >
              <button
                onClick={() => setMissionCompleteModal(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-500/20">
                <Award className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">
                  JOURNEY ACCOMPLISHED
                </span>
                <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight">
                  MISSION COMPLETE
                </h2>
                <p className="text-sm text-zinc-400 font-light">
                  Thank you for exploring the interactive portfolio dossier of Abhishek S Nair.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-left font-mono text-xs space-y-1.5 text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-500">OPERATIVE</span>
                  <span className="text-white font-bold">ABHISHEK S NAIR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">POSITIONING</span>
                  <span className="text-amber-400 font-bold">FULL-STACK DEVELOPER</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">EXPERIENCE</span>
                  <span className="text-emerald-400 font-bold">3+ YEARS COMMERCIAL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">CURRENT STATUS</span>
                  <span className="text-cyan-400 font-bold">AVAILABLE FOR HIRE</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    setMissionCompleteModal(false);
                    goToScene(0);
                  }}
                  className="flex-1 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-mono text-xs font-bold"
                >
                  REPLAY JOURNEY
                </button>
                <Link
                  href="/"
                  className="flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-extrabold shadow-lg shadow-amber-500/30"
                >
                  CLASSIC VIEW ↗
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ABI AI GUIDE DRAWER */}
      <AbiAiGuide isOpen={aiGuideOpen} onClose={() => setAiGuideOpen(false)} />

    </div>
  );
};

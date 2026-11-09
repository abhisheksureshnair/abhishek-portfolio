'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  GitBranch,
  Star,
  GitFork,
  ArrowUpRight,
  RefreshCw,
  FastForward,
  ArrowLeft,
  Compass,
  Code2,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { GitHubProfileStats, GitHubRepo } from '@/lib/github/types';
import { VERIFIED_FALLBACK_STATS } from '@/lib/github/githubService';

interface GithubUniverseViewProps {
  initialData?: GitHubProfileStats;
}

export const GithubUniverseView: React.FC<GithubUniverseViewProps> = ({
  initialData = VERIFIED_FALLBACK_STATS,
}) => {
  const [data, setData] = useState<GitHubProfileStats>(initialData);
  // Stages: 1 = Init, 2 = Typing Terminal, 3 = Profile Assemble, 4 = Network Lines, 5 = Interactive Dashboard
  const [stage, setStage] = useState<number>(1);
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentTypingText, setCurrentTypingText] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeRepoId, setActiveRepoId] = useState<number | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string>(initialData.avatarUrl || '/avatar.webp');

  // Fetch fresh server data if available
  useEffect(() => {
    fetch('/api/github')
      .then((res) => (res.ok ? res.json() : null))
      .then((fresh) => {
        if (fresh && fresh.username) {
          setData(fresh);
          if (fresh.avatarUrl) {
            setAvatarSrc(fresh.avatarUrl);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Staged Construction Animation Sequence
  useEffect(() => {
    // Check if user previously skipped in this session
    const hasSeenIntro = sessionStorage.getItem('github_universe_intro_done');
    if (hasSeenIntro) {
      setStage(5);
      return;
    }

    let isMounted = true;

    // Timeline steps
    const commands = [
      '$ initialize developer_profile --target=abhisheksureshnair',
      '$ connect github --protocol=https --auth=verified',
      '$ load repositories --include=fullstack,mobile,ai',
      '$ build interactive_portfolio_universe --release',
    ];

    const runTimeline = async () => {
      // Stage 1: Environment init (1.2s)
      setStage(1);
      await new Promise((r) => setTimeout(r, 1000));
      if (!isMounted) return;

      // Stage 2: Cursor & typing
      setStage(2);
      for (let i = 0; i < commands.length; i++) {
        const cmd = commands[i];
        let current = '';
        for (let charIndex = 0; charIndex < cmd.length; charIndex++) {
          if (!isMounted) return;
          current += cmd[charIndex];
          setCurrentTypingText(current);
          await new Promise((r) => setTimeout(r, 22));
        }
        await new Promise((r) => setTimeout(r, 180));
        setTypedLines((prev) => [...prev, cmd]);
        setCurrentTypingText('');
      }

      // Stage 3: Profile Assembly
      if (!isMounted) return;
      setStage(3);
      await new Promise((r) => setTimeout(r, 1400));

      // Stage 4: Repository Network
      if (!isMounted) return;
      setStage(4);
      await new Promise((r) => setTimeout(r, 1400));

      // Stage 5: Finished Interactive State
      if (!isMounted) return;
      setStage(5);
      sessionStorage.setItem('github_universe_intro_done', 'true');
    };

    runTimeline();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSkip = () => {
    setStage(5);
    sessionStorage.setItem('github_universe_intro_done', 'true');
  };

  const handleReplay = () => {
    sessionStorage.removeItem('github_universe_intro_done');
    setTypedLines([]);
    setCurrentTypingText('');
    setStage(1);
    setTimeout(() => {
      setStage(2);
    }, 600);
  };

  // Filter repositories
  const filteredRepos =
    selectedCategory === 'All'
      ? data.verifiedShowcaseRepos
      : data.verifiedShowcaseRepos.filter((r) => r.category === selectedCategory);

  const categories = ['All', 'Full Stack', 'Mobile', 'AI / ML', 'Systems'];

  return (
    <div className="min-h-screen bg-[#030509] text-white selection:bg-indigo-500 selection:text-white font-mono relative overflow-x-hidden">
      
      {/* Background Matrix & Subtle Cosmic Particles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b1a_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b1a_1px,transparent_1px)] bg-[size:40px_40px] opacity-60" />
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/15 via-cyan-500/10 to-transparent rounded-full blur-[160px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-zinc-950/85 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-300 hover:text-white hover:border-indigo-400 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Portfolio</span>
          </Link>

          <Link
            href="/experience"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-xs text-indigo-300 hover:text-white hover:bg-indigo-600/30 transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">3D World</span>
          </Link>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-zinc-200">
              GITHUB // CODE NEXUS
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {stage < 5 ? (
            <button
              onClick={handleSkip}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Skip Intro</span>
            </button>
          ) : (
            <button
              onClick={handleReplay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs text-zinc-300 hover:text-white transition-all"
              title="Replay Construction Animation"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Replay Build</span>
            </button>
          )}

          <a
            href={data.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all"
          >
            <span>GitHub Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* ========================================================= */}
        {/* STAGES 1 & 2: The Holographic Terminal Assembly Window   */}
        {/* ========================================================= */}
        <AnimatePresence>
          {stage < 5 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -30 }}
              transition={{ duration: 0.5 }}
              className="mb-12 rounded-3xl bg-zinc-950/90 border border-indigo-500/40 p-5 sm:p-7 shadow-[0_20px_70px_rgba(99,102,241,0.25)] backdrop-blur-2xl relative overflow-hidden"
            >
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs text-zinc-400 font-mono">
                    nexus_kernel // developer_profile_constructor.sh
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-mono">
                  <span className="animate-spin">◒</span>
                  <span>STAGE 0{stage} / 05</span>
                </div>
              </div>

              {/* Terminal Log Lines */}
              <div className="space-y-2 text-xs sm:text-sm font-mono min-h-[160px]">
                <div className="text-zinc-500">// INITIALIZING SECURE QUANTUM RUNTIME</div>
                {typedLines.map((line, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-emerald-400"
                  >
                    <span>➜</span>
                    <span>{line}</span>
                    <span className="text-zinc-500 text-[10px] ml-auto">[OK 200]</span>
                  </motion.div>
                ))}

                {/* Active Typing Line with Glowing Animated Cursor */}
                {currentTypingText && (
                  <div className="flex items-center gap-2 text-cyan-300">
                    <span className="text-indigo-400">➜</span>
                    <span>{currentTypingText}</span>
                    <span className="inline-block w-2.5 h-4 bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                  </div>
                )}
              </div>

              {/* Assembly Progress Bar */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <span>Synthesizing Repositories & Neural Links...</span>
                </div>
                <span className="text-indigo-400 font-bold">{stage * 20}%</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* STAGES 3, 4, 5: Assembled Profile Hero & Stats Header    */}
        {/* ========================================================= */}
        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-black border border-white/10 p-6 sm:p-8 shadow-2xl mb-10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                {/* Avatar & Core Bio */}
                <div className="flex items-center gap-5">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-indigo-500/50 shadow-2xl shadow-indigo-500/30 flex-shrink-0 bg-zinc-900">
                    <Image
                      src={avatarSrc}
                      alt={data.name}
                      fill
                      quality={95}
                      unoptimized
                      onError={() => setAvatarSrc('/avatar.webp')}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-2xl pointer-events-none" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                        {data.name}
                      </h1>
                      <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    </div>
                    <p className="text-xs sm:text-sm text-indigo-300 font-medium">
                      @{data.username} • Verified Developer
                    </p>
                    <p className="text-xs text-zinc-400 mt-2 max-w-xl font-light line-clamp-2">
                      {data.bio}
                    </p>
                  </div>
                </div>

                {/* Verified GitHub Stats Pills */}
                <div className="grid grid-cols-3 gap-3 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8 flex-shrink-0">
                  <div className="text-center p-3 rounded-2xl bg-zinc-900/80 border border-white/5">
                    <span className="text-[10px] text-zinc-400 block uppercase">Repositories</span>
                    <span className="text-lg sm:text-2xl font-black text-white font-mono">
                      {data.publicReposCount}
                    </span>
                  </div>
                  <div className="text-center p-3 rounded-2xl bg-zinc-900/80 border border-white/5">
                    <span className="text-[10px] text-zinc-400 block uppercase">Followers</span>
                    <span className="text-lg sm:text-2xl font-black text-indigo-400 font-mono">
                      {data.followersCount}
                    </span>
                  </div>
                  <div className="text-center p-3 rounded-2xl bg-zinc-900/80 border border-white/5">
                    <span className="text-[10px] text-zinc-400 block uppercase">Showcases</span>
                    <span className="text-lg sm:text-2xl font-black text-cyan-400 font-mono">
                      {data.verifiedShowcaseRepos.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Language Distribution Breakdown Bar */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                  <span className="flex items-center gap-1.5 font-bold text-zinc-300">
                    <Code2 className="w-3.5 h-3.5 text-indigo-400" /> Primary Engineering Stack
                  </span>
                  <span>100% Verified Production & Open Source Code</span>
                </div>
                
                {/* Multi-segment Colored Bar */}
                <div className="h-3 rounded-full bg-zinc-800/80 flex overflow-hidden p-0.5 border border-white/5">
                  {data.topLanguages.map((lang, idx) => (
                    <div
                      key={idx}
                      className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-700"
                      style={{
                        width: `${lang.percentage}%`,
                        backgroundColor: lang.color,
                      }}
                      title={`${lang.name}: ${lang.percentage}%`}
                    />
                  ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
                  {data.topLanguages.map((lang, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: lang.color }}
                      />
                      <span className="text-zinc-300">{lang.name}</span>
                      <span className="text-zinc-500 text-[11px] font-mono">
                        {lang.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* STAGE 4: Animated Neural Repository Network Graph        */}
        {/* ========================================================= */}
        <AnimatePresence>
          {stage >= 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="rounded-3xl bg-zinc-950/80 border border-indigo-500/20 p-5 sm:p-7 mb-10 relative overflow-hidden backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 tracking-wider uppercase">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Interactive Architecture Network Map</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">
                  DYNAMIC TOPOLOGY // REPOS ↔ ARCHITECTURES
                </span>
              </div>

              {/* SVG Animated Network Lines */}
              <div className="relative w-full h-44 sm:h-52 bg-zinc-900/40 rounded-2xl border border-white/5 p-4 flex items-center justify-between overflow-hidden">
                {/* Central Root Hub Node */}
                <div className="z-10 flex flex-col items-center p-3 rounded-2xl bg-gradient-to-br from-indigo-950 via-zinc-900 to-black border-2 border-indigo-400 shadow-xl shadow-indigo-500/20">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-1">
                    <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                  </div>
                  <span className="text-[11px] font-bold text-white">ASN ROOT</span>
                  <span className="text-[9px] text-cyan-400 font-mono">CORE // SYSTEM</span>
                </div>

                {/* Animated SVG Connecting Strands */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  {/* Connecting lines */}
                  <line x1="15%" y1="50%" x2="50%" y2="25%" stroke="url(#grad-blue)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                  <line x1="15%" y1="50%" x2="50%" y2="75%" stroke="url(#grad-blue)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                  <line x1="50%" y1="25%" x2="85%" y2="20%" stroke="url(#grad-blue)" strokeWidth="1.5" />
                  <line x1="50%" y1="25%" x2="85%" y2="45%" stroke="url(#grad-blue)" strokeWidth="1.5" />
                  <line x1="50%" y1="75%" x2="85%" y2="65%" stroke="url(#grad-blue)" strokeWidth="1.5" />
                  <line x1="50%" y1="75%" x2="85%" y2="85%" stroke="url(#grad-blue)" strokeWidth="1.5" />
                </svg>

                {/* Mid Tier Pillars */}
                <div className="z-10 flex flex-col gap-6">
                  <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-cyan-500/30 text-[10px] text-center shadow-md">
                    <span className="text-cyan-300 font-bold block">FULL-STACK & AI</span>
                    <span className="text-zinc-500 text-[8px]">Socket.IO • NIM • Electron</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-indigo-500/30 text-[10px] text-center shadow-md">
                    <span className="text-indigo-300 font-bold block">MOBILE & HARDWARE</span>
                    <span className="text-zinc-500 text-[8px]">Flutter • BLE • GPS</span>
                  </div>
                </div>

                {/* Leaf Project Nodes */}
                <div className="z-10 flex flex-col gap-2">
                  {data.verifiedShowcaseRepos.slice(0, 4).map((r) => (
                    <div
                      key={r.id}
                      className="px-3 py-1.5 rounded-xl bg-zinc-950/90 border border-white/10 text-[10px] flex items-center justify-between gap-3 hover:border-cyan-400 transition-colors"
                    >
                      <span className="text-zinc-200 font-bold">{r.name}</span>
                      <span className="text-cyan-400 text-[9px] font-mono">{r.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* STAGE 5: Interactive Repository Explorer & Category Tabs */}
        {/* ========================================================= */}
        {stage >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Filter Category Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                        : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="text-xs text-zinc-400 font-mono">
                Showing <strong className="text-white">{filteredRepos.length}</strong> verified repositories
              </div>
            </div>

            {/* Repositories 3D Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRepos.map((repo) => (
                <motion.div
                  key={repo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-indigo-500/50 p-6 flex flex-col justify-between backdrop-blur-xl shadow-xl transition-all duration-300 relative group"
                >
                  {/* Top Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                        {repo.category}
                      </span>

                      <div className="flex items-center gap-3 text-xs text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>{repo.stars}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{repo.forks}</span>
                        </span>
                      </div>
                    </div>

                    {/* Repo Title */}
                    <h3 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors flex items-center justify-between">
                      <span>{repo.name}</span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </h3>

                    <p className="text-xs text-zinc-400 font-light mt-2.5 leading-relaxed line-clamp-3">
                      {repo.description}
                    </p>

                    {/* Key Highlights */}
                    {repo.highlights && repo.highlights.length > 0 && (
                      <div className="mt-4 space-y-1.5 border-t border-white/5 pt-3">
                        {repo.highlights.map((h, i) => (
                          <div key={i} className="text-[11px] text-zinc-300 flex items-center gap-1.5">
                            <span className="text-cyan-400 font-bold">✓</span>
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer: Topics & Link */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                      <span className="text-zinc-300 font-mono text-[11px]">
                        {repo.language || 'Code'}
                      </span>
                    </div>

                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-indigo-600 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <span>Explore</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Callout Section */}
            <div className="mt-16 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-zinc-950 to-cyan-950/60 border border-indigo-500/30 p-8 text-center max-w-3xl mx-auto shadow-2xl">
              <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Want to see the code running in 3D?
              </h4>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-light">
                Explore each project district inside the interactive open-world simulation, complete with live mission radar and dynamic holographic landmarks.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/experience"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-xs font-mono shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all"
                >
                  ENTER 3D DEVELOPER UNIVERSE ➔
                </Link>
                <Link
                  href="/"
                  className="px-6 py-3 rounded-full bg-zinc-900 border border-white/10 hover:border-white/30 text-zinc-300 text-xs font-mono transition-all"
                >
                  Classic Portfolio Home
                </Link>
              </div>
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
};


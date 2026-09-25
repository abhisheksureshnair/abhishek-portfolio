'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowUpRight, 
  Eye, 
  CheckCircle2, 
  Terminal, 
  Briefcase, 
  UserCheck, 
  Radio, 
  ShieldAlert, 
  Cpu, 
  Activity, 
  Lock, 
  Layers, 
  MapPin, 
  ExternalLink,
  Bluetooth,
  ArrowRight
} from 'lucide-react';
import { ALL_PROJECTS, Project } from '../data/portfolioData';
import { GithubIcon } from './Icons';

interface FeaturedProjectsSectionProps {
  onOpenFlowSyncCaseStudy: () => void;
}

export const FeaturedProjectsSection: React.FC<FeaturedProjectsSectionProps> = ({
  onOpenFlowSyncCaseStudy,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'PROFESSIONAL' | 'PERSONAL' | 'FULL STACK' | 'AI & LLM' | 'APPLICATIONS'>('ALL');
  const [activeTabByProject, setActiveTabByProject] = useState<Record<string, 'features' | 'overview' | 'problemSolution'>>({});

  const filterTabs = [
    { label: 'ALL', count: ALL_PROJECTS.length },
    { label: 'PROFESSIONAL', count: ALL_PROJECTS.filter((p) => p.type === 'professional').length },
    { label: 'PERSONAL', count: ALL_PROJECTS.filter((p) => p.type === 'personal').length },
    { label: 'FULL STACK', count: ALL_PROJECTS.filter((p) => p.category.includes('FULL STACK')).length },
    { label: 'AI & LLM', count: ALL_PROJECTS.filter((p) => p.category.includes('AI') || p.category.includes('LLM')).length },
    { label: 'APPLICATIONS', count: ALL_PROJECTS.filter((p) => p.category.includes('APPLICATION') || p.category.includes('DEVELOPER TOOL')).length },
  ];

  const filteredProjects = ALL_PROJECTS.filter((proj) => {
    if (filter === 'PROFESSIONAL') return proj.type === 'professional';
    if (filter === 'PERSONAL') return proj.type === 'personal';
    if (filter === 'FULL STACK') return proj.category.includes('FULL STACK');
    if (filter === 'AI & LLM') return proj.category.includes('AI') || proj.category.includes('LLM');
    if (filter === 'APPLICATIONS') return proj.category.includes('APPLICATION') || proj.category.includes('DEVELOPER TOOL');
    return true;
  });

  const setTab = (projectId: string, tab: 'features' | 'overview' | 'problemSolution') => {
    setActiveTabByProject((prev) => ({ ...prev, [projectId]: tab }));
  };

  return (
    <section id="projects" className="py-32 bg-[#060911] relative border-t border-white/5 overflow-hidden">
      
      {/* Background Lighting Aura */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-cinematic-grid opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>// 03. VERIFIED PROJECT SHOWCASE</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
              Featured Projects
            </h2>
          </div>
          <p className="max-w-md text-zinc-400 text-sm font-light leading-relaxed">
            Clearly distinguishing independent personal full-stack builds from commercial production applications delivered at InnSpark Solutions.
          </p>
        </div>

        {/* 6 Category Filters: ALL, PROFESSIONAL, PERSONAL, AI, MOBILE, FULL STACK */}
        <div className="flex flex-wrap items-center gap-2 mb-16 p-1.5 rounded-2xl bg-zinc-950/80 border border-white/10 w-fit backdrop-blur-xl">
          {filterTabs.map((tab) => {
            const isActive = filter === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => setFilter(tab.label as any)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
                data-cursor="pointer"
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cinematic Projects Showcase */}
        <div className="space-y-24">
          {filteredProjects.map((project) => {
            const isPersonal = project.type === 'personal';
            const isFlagship = project.isFlagship;
            const isFlowSync = project.id === 'flowsync';
            const isEcho = project.id === 'echo-desktop-ai';
            const isVTS = project.id === 'vts-gps-tracking';
            const isTelemed = project.id === 'telemedicine-platform';
            const isSafeNet = project.id === 'safenet-parental-control';
            const isBLE = project.id === 'bluetooth-debugger';
            const activeTab = activeTabByProject[project.id] || 'features';

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative p-8 sm:p-12 rounded-3xl border transition-all duration-500 overflow-hidden ${
                  isPersonal
                    ? 'bg-gradient-to-b from-[#0b1021] via-[#070b16] to-[#030508] border-indigo-500/40 shadow-2xl shadow-indigo-950/40'
                    : 'bg-zinc-950/80 border-cyan-500/30 hover:border-cyan-500/50 shadow-2xl shadow-cyan-950/20'
                }`}
              >
                {/* Confidential Commercial Notice if applicable */}
                {project.confidentialNotice && (
                  <div className="mb-6 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>{project.confidentialNotice}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left Column: Project Identity, Description & Details */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* Badge Strip: Clearly distinguished labels */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-mono font-bold text-indigo-400">
                        PROJECT {project.number}
                      </span>
                      
                      {/* Personal vs Professional Badge */}
                      <span className={`text-xs px-3.5 py-1 rounded-full font-mono font-bold flex items-center gap-1.5 uppercase ${
                        isPersonal
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      }`}>
                        {isPersonal ? <UserCheck className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                        <span>{isPersonal ? 'PERSONAL PROJECT' : 'PROFESSIONAL WORK'}</span>
                      </span>

                      <span className="text-xs px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 font-mono">
                        {project.category}
                      </span>

                      <span className="text-xs text-zinc-500 font-mono">
                        {project.year}
                      </span>
                    </div>

                    {/* Role & Context Attribution */}
                    <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
                      <span className="text-zinc-600">// CONTEXT:</span>
                      <span className="text-zinc-300 font-medium">{project.role}</span>
                    </div>

                    {/* Project Title & Subtitle */}
                    <div>
                      <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight group-hover:text-indigo-200 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm sm:text-base font-mono text-cyan-300 mt-2 font-medium">
                        {project.subtitle}
                      </p>
                    </div>

                    {/* Migration Note for VTS */}
                    {project.migrationNote && (
                      <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <span>{project.migrationNote}</span>
                      </div>
                    )}

                    {/* Tab Switcher: Features, Overview, Problem & Solution */}
                    <div className="flex items-center gap-4 border-b border-white/10 pb-2">
                      <button
                        onClick={() => setTab(project.id, 'features')}
                        className={`text-xs font-mono pb-1 border-b-2 transition-all ${
                          activeTab === 'features'
                            ? 'border-cyan-400 text-white font-bold'
                            : 'border-transparent text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        Key Features ({project.features.length})
                      </button>
                      <button
                        onClick={() => setTab(project.id, 'overview')}
                        className={`text-xs font-mono pb-1 border-b-2 transition-all ${
                          activeTab === 'overview'
                            ? 'border-cyan-400 text-white font-bold'
                            : 'border-transparent text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        Description
                      </button>
                      {project.problem && (
                        <button
                          onClick={() => setTab(project.id, 'problemSolution')}
                          className={`text-xs font-mono pb-1 border-b-2 transition-all ${
                            activeTab === 'problemSolution'
                              ? 'border-cyan-400 text-white font-bold'
                              : 'border-transparent text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          Problem & Solution
                        </button>
                      )}
                    </div>

                    {/* Tab Body */}
                    <AnimatePresence mode="wait">
                      {activeTab === 'features' && (
                        <motion.div
                          key="tab-features"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-2 pt-2"
                        >
                          {project.features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 font-light">
                              <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}

                      {activeTab === 'overview' && (
                        <motion.div
                          key="tab-overview"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-4"
                        >
                          <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
                            {project.description}
                          </p>
                        </motion.div>
                      )}

                      {activeTab === 'problemSolution' && (
                        <motion.div
                          key="tab-problem"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-4 text-xs sm:text-sm"
                        >
                          {project.problem && (
                            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1.5">
                              <span className="text-[10px] font-mono text-rose-400 uppercase font-bold tracking-wider block">
                                Engineering Challenge // Problem
                              </span>
                              <p className="text-zinc-300 font-light leading-relaxed">
                                {project.problem}
                              </p>
                            </div>
                          )}

                          {project.solution && (
                            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1.5">
                              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider block">
                                Architectural Resolution // Solution
                              </span>
                              <p className="text-zinc-300 font-light leading-relaxed">
                                {project.solution}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Technologies Deployed */}
                    <div className="pt-2">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
                        Technologies Deployed:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1.5 rounded-xl bg-zinc-950/80 border border-white/10 text-xs font-mono text-zinc-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-6 flex flex-wrap items-center gap-4 border-t border-white/10">
                      {isFlowSync && (
                        <button
                          onClick={onOpenFlowSyncCaseStudy}
                          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold font-mono tracking-wide flex items-center gap-2 transition-all shadow-xl shadow-indigo-600/30 transform hover:-translate-y-0.5"
                          data-cursor="pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>FLOWSYNC ARCHITECTURE CASE STUDY</span>
                        </button>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-zinc-950 border border-white/10 hover:border-indigo-500/50 text-zinc-300 hover:text-white text-xs font-mono transition-all"
                          data-cursor="pointer"
                        >
                          <GithubIcon className="w-4 h-4" />
                          <span>GitHub Repository</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
                        </a>
                      )}
                    </div>

                  </div>

                  {/* Right Column: High-Tech Interactive Simulated Interface Frame */}
                  <div className="lg:col-span-5">
                    <div className="rounded-3xl bg-zinc-950/90 border border-white/10 p-6 shadow-2xl glass-panel-cinematic relative space-y-5 transform group-hover:scale-[1.01] transition-transform duration-500">
                      
                      {/* Window Header */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                          <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                          <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                        </div>
                        <span className="text-[11px] font-mono text-zinc-500">
                          {project.id}.telemetry.app
                        </span>
                      </div>

                      {/* SIMULATION VISUALIZATIONS */}

                      {/* 1. FlowSync Visual: Live 3D AI Task Risk & Socket.IO Room */}
                      {isFlowSync && (
                        <div className="space-y-3 font-mono text-xs">
                          {/* Live Socket Room Pill */}
                          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="text-white font-bold">Socket.IO Room #sprint-alpha</span>
                            </div>
                            <span className="text-cyan-300 font-bold">42ms Latency</span>
                          </div>

                          {/* AI Task Risk Engine */}
                          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-2.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-zinc-400 flex items-center gap-1.5">
                                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                                NVIDIA NIM Task Risk Analyzer
                              </span>
                              <span className="text-emerald-400 font-bold">LOW RISK // 98% ETA CONFIDENCE</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 w-[92%]" />
                            </div>
                          </div>

                          {/* Chat & Collaboration Feed */}
                          <div className="space-y-2 p-3 rounded-2xl bg-zinc-900/60 border border-white/5 text-[11px]">
                            <div className="flex items-center justify-between text-zinc-500 text-[10px]">
                              <span>LIVE TEAM MESSAGE STREAM</span>
                              <span>JWT SECURED</span>
                            </div>
                            <div className="p-2 rounded-xl bg-zinc-950 border border-white/5 text-zinc-300">
                              <span className="text-indigo-400 font-bold">AI Agent:</span> Auto-balanced 4 sprint backlog tickets via risk heuristics.
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2. Echo Desktop AI Visual: Floating Island Overlay + Browser Bridge */}
                      {isEcho && (
                        <div className="space-y-3 font-mono text-xs">
                          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/30 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-white font-bold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                Echo Floating Island (Electron)
                              </span>
                              <span className="text-[10px] text-purple-300 uppercase">Overlay Active</span>
                            </div>
                            <p className="text-[11px] text-zinc-400">
                              Detecting: Chrome / Brave / Edge / Firefox extensions
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5">
                              <span className="text-zinc-500 block text-[9px]">EXTENSIONS</span>
                              <span className="text-white font-bold">Chrome / Brave / Edge</span>
                            </div>
                            <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5">
                              <span className="text-zinc-500 block text-[9px]">AI INFERENCE</span>
                              <span className="text-cyan-400 font-bold">LLM Integration</span>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 text-[11px] text-zinc-300">
                            <span className="text-purple-300 block font-bold mb-1">Co-Pilot Action:</span>
                            Summarization, explanation, translation & code extraction.
                          </div>
                        </div>
                      )}

                      {/* 3. VTS GPS Vehicle Tracking Visual: Map Radar & Coordinate Telemetry */}
                      {isVTS && (
                        <div className="space-y-3 font-mono text-xs">
                          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-white font-bold flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                                Live Telematics Node (InnSpark Work)
                              </span>
                              <span className="text-emerald-400 font-bold text-[10px]">STREAMING</span>
                            </div>
                            <div className="text-[11px] text-zinc-400 flex items-center justify-between">
                              <span>Mobile: React Native & Flutter</span>
                              <span>Maps: Google Maps API</span>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 space-y-1.5 text-[11px]">
                            <div className="flex justify-between text-zinc-400">
                              <span>Geofencing Alerts:</span>
                              <span className="text-emerald-400 font-bold">Active Geofence Zone</span>
                            </div>
                            <div className="flex justify-between text-zinc-400">
                              <span>Route Playback:</span>
                              <span className="text-cyan-400 font-bold">History Trails Synced</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 4. Telemedicine Visual: Real-time BLE Vitals */}
                      {isTelemed && (
                        <div className="space-y-3 font-mono text-xs">
                          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-white font-bold flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                                BLE Medical Sensor Telemetry
                              </span>
                              <span className="text-cyan-400 font-bold text-[10px]">SYNCED</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                              <div>
                                <span className="text-zinc-500 block text-[9px]">HEART RATE</span>
                                <span className="text-white font-bold text-base">72 BPM</span>
                              </div>
                              <div>
                                <span className="text-zinc-500 block text-[9px]">SPO2 OXYGEN</span>
                                <span className="text-cyan-300 font-bold text-base">99%</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 text-[11px] text-zinc-400 flex items-center justify-between">
                            <span>WebSockets & Socket.IO:</span>
                            <span className="text-emerald-400 font-bold">Video & Chat Synced</span>
                          </div>
                        </div>
                      )}

                      {/* 5. SafeNet Visual: Parental Control Rules */}
                      {isSafeNet && (
                        <div className="space-y-3 font-mono text-xs">
                          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-white font-bold flex items-center gap-2">
                                <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                                Android Platform APIs (React Native)
                              </span>
                              <span className="text-indigo-400 font-bold text-[10px]">ENFORCED</span>
                            </div>
                            <p className="text-[11px] text-zinc-400">
                              Device Admin APIs & Accessibility Services screen-time enforcement
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 text-[11px] flex justify-between text-zinc-300">
                            <span>App Blocking & Analytics:</span>
                            <span className="text-cyan-400 font-bold">Policy Active</span>
                          </div>
                        </div>
                      )}

                      {/* 6. Bluetooth Debugger Visual: GATT Inspection */}
                      {isBLE && (
                        <div className="space-y-3 font-mono text-xs">
                          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-white font-bold flex items-center gap-2">
                                <Bluetooth className="w-3.5 h-3.5 text-purple-400" />
                                react-native-ble-manager
                              </span>
                              <span className="text-purple-400 font-bold text-[10px]">SCANNING</span>
                            </div>
                            <p className="text-[11px] text-zinc-400">
                              GATT Data Inspection & Peripheral Diagnostics
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 text-[10px] space-y-1">
                            <span className="text-zinc-500 block">BINARY PACKET BUFFER:</span>
                            <span className="text-cyan-300 block font-mono">0x16 0x00 0x48 0x65 0x6C 0x6C 0x6F</span>
                          </div>
                        </div>
                      )}

                      {/* Project Attribution Footer */}
                      <div className="pt-2 border-t border-white/10 text-xs font-mono flex items-center justify-between text-zinc-400">
                        <span>Classification:</span>
                        <span className={`font-bold ${isPersonal ? 'text-indigo-400' : 'text-cyan-400'}`}>
                          {isPersonal ? 'Personal Project' : 'InnSpark Commercial Work'}
                        </span>
                      </div>

                    </div>
                  </div>

                </div>
              </motion.article>
            );
          })}
        </div>

      </div>
    </section>
  );
};

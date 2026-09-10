'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Sparkles, Layers, Cpu, Radio, Shield, CheckCircle, BarChart3, MessageSquare, Route, Terminal } from 'lucide-react';
import { GithubIcon } from './Icons';
import { SELECTED_PROJECTS } from '../data/portfolioData';

interface FlowSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlowSyncModal: React.FC<FlowSyncModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'ai' | 'challenges'>('overview');

  const flowsyncData = SELECTED_PROJECTS.find((p) => p.id === 'flowsync');
  if (!flowsyncData || !isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col"
        >
          {/* Header Bar */}
          <div className="p-6 sm:p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60 sticky top-0 z-20 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold">
                  FLAGSHIP CASE STUDY
                </span>
                <span className="text-xs font-mono text-zinc-500">MERN + NVIDIA NIM AI</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                FlowSync
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-zinc-800 bg-zinc-900/30 px-6 sm:px-8 gap-4 overflow-x-auto">
            {[
              { id: 'overview', label: '1. Overview & Vision' },
              { id: 'architecture', label: '2. System Architecture' },
              { id: 'ai', label: '3. NVIDIA NIM AI Engine' },
              { id: 'challenges', label: '4. Key Engineering Wins' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 text-xs sm:text-sm font-semibold tracking-wide border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
            
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Project Purpose</h3>
                  <p className="text-zinc-300 font-light leading-relaxed text-sm sm:text-base">
                    FlowSync was built as an end-to-end full-stack platform designed to solve the critical friction engineering teams experience during sprint execution: delayed task triage, hidden risk accumulation, and manual priority misalignments.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30">
                    <h4 className="text-rose-400 font-bold text-sm mb-2 uppercase font-mono">The Problem</h4>
                    <p className="text-xs text-zinc-300 font-light leading-relaxed">
                      Traditional team tools treat tasks as static cards. Team leads must manually estimate risk, review delivery bottlenecks, and continuously monitor chat threads across disconnected channels.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                    <h4 className="text-emerald-400 font-bold text-sm mb-2 uppercase font-mono">The FlowSync Solution</h4>
                    <p className="text-xs text-zinc-300 font-light leading-relaxed">
                      Combines Socket.IO real-time team rooms with an automated NVIDIA NIM AI model that continuously reads incoming sprint telemetry, scores task priority queues, and flags delivery risks before sprint end.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase text-zinc-500 mb-4 tracking-wider">Key Capability Highlights:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start gap-3">
                      <Cpu className="w-5 h-5 text-indigo-400 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-white">AI Task Analysis</div>
                        <div className="text-[11px] text-zinc-400">NVIDIA NIM automated risk & priority scoring</div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start gap-3">
                      <Radio className="w-5 h-5 text-cyan-400 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-white">Real-Time Messaging</div>
                        <div className="text-[11px] text-zinc-400">Sub-50ms Socket.IO team telemetry</div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start gap-3">
                      <Route className="w-5 h-5 text-emerald-400 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-white">Spatial Routing</div>
                        <div className="text-[11px] text-zinc-400">OpenRouteService field task optimization</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'architecture' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Technical Architecture Breakdown</h3>
                  <p className="text-zinc-400 text-sm font-light leading-relaxed">
                    Designed with clean separation of concerns across single-page web app, Express REST API controllers, WebSockets state management, and async AI worker pipelines.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                  <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
                    <Terminal className="w-5 h-5 text-indigo-400" />
                    <span className="font-mono text-sm font-bold text-white">MERN + AI Monorepo Stack</span>
                  </div>
                  <ul className="space-y-3 text-xs text-zinc-300 font-mono">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">├─ Frontend:</span> React SPA, Tailwind CSS v4, Framer Motion & GSAP animations, Recharts analytics.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">├─ Backend:</span> Node.js, Express.js server, Socket.IO WebSockets rooms, JWT auth middleware.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400">├─ Database:</span> MongoDB Atlas, Mongoose ORM for user profiles, tasks, sprint logs, and chat records.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">└─ External APIs:</span> NVIDIA NIM LLM API endpoints + OpenRouteService API.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">NVIDIA NIM & LLM Integration</h3>
                  <p className="text-zinc-400 text-sm font-light leading-relaxed">
                    FlowSync utilizes NVIDIA NIM APIs to perform multi-stage analysis on project tickets and team updates.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
                    <h4 className="text-sm font-bold text-white mb-2">1. Priority Queue Generation</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-light">
                      Evaluates ticket description, dependency tree, and sprint deadline to output a recommended priority score (1–10).
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
                    <h4 className="text-sm font-bold text-white mb-2">2. Automated Risk Analysis</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-light">
                      Scans team chat sentiment and unresolved blocker comments to flag high-risk tasks before milestones are missed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'challenges' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Results & Engineering Accomplishments</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {flowsyncData.caseStudy?.results.map((res, i) => (
                    <div key={i} className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-zinc-300 font-light leading-relaxed">{res}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer CTAs */}
          <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-mono">Flagship Full-Stack Work</span>
            <div className="flex items-center gap-3">
              <a
                href={flowsyncData.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                <span>View Repository</span>
              </a>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
              >
                Close Case Study
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

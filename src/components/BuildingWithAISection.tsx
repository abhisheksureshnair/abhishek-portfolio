'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Sparkles, 
  Terminal, 
  Zap, 
  Bot, 
  MessageSquare, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Activity
} from 'lucide-react';
import { AI_SKILLS } from '../data/portfolioData';

export const BuildingWithAISection: React.FC = () => {
  const [activeModelDemo, setActiveModelDemo] = useState<'flowsync' | 'echo'>('flowsync');
  const [simulatedPrompt, setSimulatedPrompt] = useState('');
  const [isInferencing, setIsInferencing] = useState(false);
  const [inferenceResult, setInferenceResult] = useState<string | null>(null);

  const handleTestInference = (type: 'flowsync' | 'echo') => {
    setIsInferencing(true);
    setInferenceResult(null);

    setTimeout(() => {
      setIsInferencing(false);
      if (type === 'flowsync') {
        setInferenceResult(
          JSON.stringify(
            {
              task_id: "TASK-8941",
              sprint_complexity: "High (Score 8.4/10)",
              bottleneck_risk: "Moderate (Multi-room Socket synchronization)",
              recommended_priority: "P1 — Critical Path",
              predicted_eta: "14.5 hours",
              mitigation: "Decouple WebSocket event dispatch from React state updates using queued microtasks."
            },
            null,
            2
          )
        );
      } else {
        setInferenceResult(
          JSON.stringify(
            {
              agent_mode: "Browser Co-Pilot (Echo Desktop)",
              active_surface: "GitHub PR Review & VS Code Split",
              context_summary: "Extracted 3 React 19 useEffect hooks with missing cleanup references.",
              copilot_action: "Generated zero-allocation refactored snippet ready for clipboard."
            },
            null,
            2
          )
        );
      }
    }, 700);
  };

  return (
    <section id="ai" className="py-32 bg-[#060911] relative border-t border-white/5 overflow-hidden">
      
      {/* Background Neural Radiance */}
      <div className="absolute top-1/3 left-1/3 w-[650px] h-[650px] bg-purple-600/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-cinematic-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>// 05. ARTIFICIAL INTELLIGENCE SYSTEMS</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Building with AI
          </h2>
          <p className="mt-4 text-zinc-400 text-base font-light leading-relaxed">
            Integrating Large Language Models, NVIDIA LLM APIs, and intelligent context workflows into modern software architectures.
          </p>
        </div>

        {/* Interactive Neural Pipeline Showcase: FlowSync AI vs Echo Desktop AI */}
        <div className="mb-20 rounded-3xl bg-gradient-to-b from-[#0b1021] via-zinc-950 to-black border border-purple-500/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-8 mb-8 border-b border-white/10 gap-6">
            <div>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block mb-1">
                Interactive Model Pipeline Simulation
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Live AI Inference Architecture
              </h3>
            </div>

            {/* Model Switcher */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-950 border border-white/10">
              <button
                onClick={() => {
                  setActiveModelDemo('flowsync');
                  setInferenceResult(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeModelDemo === 'flowsync'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-zinc-400 hover:text-white'
                }`}
                data-cursor="pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>FlowSync AI (NIM Pipeline)</span>
              </button>

              <button
                onClick={() => {
                  setActiveModelDemo('echo');
                  setInferenceResult(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeModelDemo === 'echo'
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                    : 'text-zinc-400 hover:text-white'
                }`}
                data-cursor="pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Echo Desktop AI (Co-Pilot)</span>
              </button>
            </div>
          </div>

          {/* Interactive Console Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Pipeline Details */}
            <div className="lg:col-span-5 space-y-4">
              {activeModelDemo === 'flowsync' ? (
                <>
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-indigo-400 uppercase font-bold">
                      Personal Project Example: FlowSync Task Risk Scoring & ETA Heuristic
                    </span>
                    <h4 className="text-xl font-bold text-white">
                      Asynchronous NVIDIA NIM LLM Queue
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                      Tasks logged by developers are continuously ingested through an async queue worker. The NVIDIA NIM microservice extracts complexity signals, compares against sprint telemetry, and outputs structured risk probability.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs font-mono text-zinc-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Deterministic JSON Schema Validation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Sub-second inference via NVIDIA NIM API</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Proactive sprint blocker detection</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-cyan-400 uppercase font-bold">
                      Personal Project Example: Echo Desktop AI Multi-Context Bridge
                    </span>
                    <h4 className="text-xl font-bold text-white">
                      Desktop-to-Browser Co-Pilot Loop
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                      Electron native window hooks monitor active browser windows (Chrome, Brave, Edge). Upon user request, the extension extracts DOM selections, and feeds context directly to local or cloud LLMs.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs font-mono text-zinc-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Multi-monitor overlay positioning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Zero-friction context capture from browser</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Custom API key / temperature controls</span>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-2">
                <button
                  onClick={() => handleTestInference(activeModelDemo)}
                  disabled={isInferencing}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
                  data-cursor="pointer"
                >
                  <Terminal className="w-4 h-4" />
                  <span>{isInferencing ? 'Running Inference...' : 'Simulate Inference Payload'}</span>
                </button>
              </div>
            </div>

            {/* Right: Code / JSON Terminal Console */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-black/90 border border-white/10 p-5 font-mono text-xs shadow-2xl relative">
                
                {/* Console Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 text-[11px] text-zinc-500">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    inference.worker.ts // {activeModelDemo.toUpperCase()}
                  </span>
                  <span className="text-zinc-400">SCHEMA: JSON STRICT</span>
                </div>

                {/* Console Output */}
                <pre className="text-zinc-300 overflow-x-auto p-2 bg-zinc-950/70 rounded-xl leading-relaxed text-[11px] min-h-[180px] flex items-center justify-center">
                  {isInferencing ? (
                    <div className="flex flex-col items-center gap-2 text-purple-400 py-8">
                      <Activity className="w-6 h-6 animate-spin" />
                      <span className="text-xs">Processing token pipeline via NVIDIA NIM API...</span>
                    </div>
                  ) : inferenceResult ? (
                    <code className="text-emerald-300 w-full block text-left font-mono">{inferenceResult}</code>
                  ) : (
                    <span className="text-zinc-500 italic text-center">
                      Click "Simulate Inference Payload" to trigger live architectural response simulation.
                    </span>
                  )}
                </pre>

              </div>
            </div>

          </div>

        </div>

        {/* 6 AI Core Competencies Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AI_SKILLS.map((skill, idx) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="p-7 rounded-3xl bg-zinc-950/70 border border-white/10 hover:border-purple-500/40 hover:bg-zinc-950 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 font-bold">
                    0{idx + 1}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {skill.title}
                </h4>

                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  {skill.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 flex items-center text-[10px] font-mono text-purple-400 uppercase tracking-wider">
                <span>Production Capability</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

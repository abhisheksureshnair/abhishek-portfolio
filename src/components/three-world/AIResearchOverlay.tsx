'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Cpu,
  Brain,
  Network,
  Database,
  Bot,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Layers,
  Code2,
  Terminal,
  Activity,
  Play,
  RotateCcw,
  Sliders,
  Search,
} from 'lucide-react';
import { AI_RESEARCH_METADATA, AIResearchTopic } from '@/world/buildings/ai/aiMetadata';

interface AIResearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'overview' | 'topics' | 'demos' | 'projects';
}

export const AIResearchOverlay: React.FC<AIResearchOverlayProps> = ({
  isOpen,
  onClose,
  initialTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'topics' | 'demos' | 'projects'>(initialTab);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('llm-engineering');

  // Interactive Demo 1 State: Neural Network Weight & Activation
  const [inputVal, setInputVal] = useState<number>(0.8);
  const [weightVal, setWeightVal] = useState<number>(1.2);
  const [biasVal, setBiasVal] = useState<number>(-0.3);
  const [actFn, setActFn] = useState<'relu' | 'sigmoid' | 'tanh'>('relu');

  // Compute activation
  const z = inputVal * weightVal + biasVal;
  const activatedOutput =
    actFn === 'relu'
      ? Math.max(0, z)
      : actFn === 'sigmoid'
      ? 1 / (1 + Math.exp(-z))
      : Math.tanh(z);

  // Interactive Demo 2 State: RAG Step Simulation
  const [ragStep, setRagStep] = useState<number>(0);
  const ragSteps = [
    { title: 'User Query Ingestion', desc: 'User submits: "How does the autonomous vehicle avoid collisions in the metropolis?"' },
    { title: 'Embedding Model Encoding', desc: 'Dense vector embeddings generated via 1536-dimensional projection.' },
    { title: 'Vector Database Similarity Search', desc: 'Cosine distance scan across HNSW indexed vector clusters in pgvector/Pinecone.' },
    { title: 'Context Chunk Retrieval', desc: 'Top 3 chunks retrieved: [A* Graph Engine, Raycast Proximity Sensor, Intersection Turn Queue].' },
    { title: 'Augmented Prompt Synthesis', desc: 'Context injected into LLM system prompt under strict grounding constraints.' },
    { title: 'Final Grounded Generation', desc: 'Grounded response generated without hallucinations, citing source vector chunks.' },
  ];

  // Interactive Demo 3 State: Agent ReAct Loop
  const [agentStep, setAgentStep] = useState<number>(0);
  const agentSteps = [
    { type: 'Goal', text: 'Optimize traffic throughput at Central Avenue intersection [0, 0].' },
    { type: 'Thought', text: 'I need to inspect the vehicle queue lengths on North-South Avenue vs East-West Street.' },
    { type: 'Action', text: 'call_tool("get_intersection_metrics", { intersectionId: "int-1-1" })' },
    { type: 'Observation', text: 'Queue length: North=8 vehicles, East=3 vehicles. North traffic latency: 4.2s.' },
    { type: 'Reflection', text: 'North lane latency exceeds threshold. Signal timing should be extended by 6 seconds.' },
    { type: 'Final Decision', text: 'Signal updated. Latency resolved to 1.1s. Goal achieved.' },
  ];

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const selectedTopic = AI_RESEARCH_METADATA.topics.find((t) => t.id === selectedTopicId) || AI_RESEARCH_METADATA.topics[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md font-mono pointer-events-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-950/95 border border-purple-500/40 rounded-2xl shadow-[0_0_60px_rgba(168,85,247,0.25)] overflow-hidden text-slate-100"
          >
            {/* Top Violet & Cyan Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-violet-500 to-cyan-400" />

            {/* Header */}
            <div className="flex items-start justify-between p-5 sm:p-6 border-b border-purple-500/20 bg-slate-900/40">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5">
                    <Brain className="w-3 h-3 text-purple-400 animate-pulse" />
                    DISTRICT 07 // AI RESEARCH & INNOVATION CENTER
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    <GraduationCap className="w-3 h-3 text-cyan-400" />
                    MCA AI Specialization (72%)
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Artificial Intelligence & Computational Research
                </h2>
                <p className="text-xs text-slate-400">
                  Academic foundation, Python scientific engineering, RAG pipelines, agentic workflows, and interactive simulations.
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800/80 bg-slate-950/60 px-5 sm:px-6 overflow-x-auto gap-2">
              {[
                { id: 'overview', label: 'Academic Foundation', icon: GraduationCap },
                { id: 'topics', label: 'Research Curricula (7 Areas)', icon: BookOpen },
                { id: 'demos', label: 'Interactive Demonstrations', icon: Cpu },
                { id: 'projects', label: 'AI Project Integrations', icon: Network },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? 'border-purple-400 text-purple-300 bg-purple-500/10'
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* TAB 1: ACADEMIC FOUNDATION */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Verified Postgraduate Degree Card */}
                  <div className="p-5 rounded-xl bg-slate-900/60 border border-purple-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs font-bold text-purple-400">
                        <GraduationCap className="w-4 h-4 text-purple-400" />
                        <span>Verified Postgraduate Education</span>
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        First Class Distinction
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white">
                        {AI_RESEARCH_METADATA.academicBackground.degree}
                      </h3>
                      <div className="text-xs text-purple-300 font-semibold mt-0.5">
                        {AI_RESEARCH_METADATA.academicBackground.specialization}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {AI_RESEARCH_METADATA.academicBackground.institution} • Grade: {AI_RESEARCH_METADATA.academicBackground.grade}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      Academic curriculum included advanced coursework in Artificial Intelligence, Statistical Machine Learning, Natural Language Processing, Neural Networks, Database Systems, and Distributed Algorithms.
                    </p>
                  </div>

                  {/* Research & Experience Categorization Matrix */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Knowledge & Project Status Classification
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Transparency guarantee: strictly distinguishing demonstrated projects, verified academic knowledge, and future research areas.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30 space-y-1.5">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          Demonstrated Projects
                        </span>
                        <div className="text-xs font-bold text-white pt-1">Hands-On Implementations</div>
                        <p className="text-[11px] text-slate-400">
                          Echo AI (conversational LLM streaming), VTS Telemetry Anomaly Detection, A* Autonomous Vehicle Pathfinding.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/30 space-y-1.5">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          Current Knowledge
                        </span>
                        <div className="text-xs font-bold text-white pt-1">Verified Theory & Code</div>
                        <p className="text-[11px] text-slate-400">
                          Python 3 scientific stack, NumPy/Pandas pipelines, loss optimization, RAG embedding architectures, agent prompt schemas.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/30 space-y-1.5">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
                          Future Research
                        </span>
                        <div className="text-xs font-bold text-white pt-1">Active Exploration</div>
                        <p className="text-[11px] text-slate-400">
                          Local edge model quantization (GGUF), client-side WebGPU neural execution, multimodal spatial comprehension.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RESEARCH TOPICS (7 CORE CURRICULA) */}
              {activeTab === 'topics' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    {/* Left: Topic Selector List */}
                    <div className="sm:col-span-4 space-y-1.5">
                      {AI_RESEARCH_METADATA.topics.map((t) => {
                        const isSel = t.id === selectedTopic.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() => setSelectedTopicId(t.id)}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                              isSel
                                ? 'bg-purple-500/20 border-purple-400/60 text-white shadow-md'
                                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold truncate">{t.title}</span>
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  t.status === 'demonstrated'
                                    ? 'bg-emerald-400'
                                    : t.status === 'knowledge'
                                    ? 'bg-cyan-400'
                                    : 'bg-purple-400'
                                }`}
                              />
                            </div>
                            <div className="text-[10px] text-slate-400 truncate mt-0.5">{t.subtitle}</div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right: Detailed Topic View */}
                    <div className="sm:col-span-8 p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-white">{selectedTopic.title}</h3>
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                selectedTopic.status === 'demonstrated'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : selectedTopic.status === 'knowledge'
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                              }`}
                            >
                              {selectedTopic.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-xs text-purple-400 font-semibold mt-0.5">{selectedTopic.subtitle}</div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{selectedTopic.summary}</p>

                      <div className="space-y-2 pt-1">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                          <span>Key Architectural Concepts:</span>
                        </div>
                        <ul className="space-y-1.5 pl-2">
                          {selectedTopic.keyConcepts.map((concept, idx) => (
                            <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                              <span className="text-purple-400">•</span>
                              <span>{concept}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                        <div className="text-[11px] font-semibold text-slate-400">Tools & Technologies:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedTopic.toolsAndStack.map((tool) => (
                            <span
                              key={tool}
                              className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-300 border border-slate-800"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: INTERACTIVE DEMONSTRATIONS (Section 4) */}
              {activeTab === 'demos' && (
                <div className="space-y-6">
                  <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>
                      Notice: These interactive widgets are educational architectural simulations designed to demonstrate computational AI mechanics.
                    </span>
                  </div>

                  {/* Demonstration 1: Neural Network Activation Simulation */}
                  <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-purple-400" />
                        <h4 className="text-sm font-bold text-white">Interactive Neuron Activation Simulation</h4>
                      </div>
                      <span className="text-[10px] text-slate-400">Formula: a = f(x · w + b)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Controls */}
                      <div className="space-y-3 sm:col-span-2">
                        <div>
                          <div className="flex justify-between text-xs text-slate-300 mb-1">
                            <span>Input (x):</span>
                            <span className="font-mono text-purple-400">{inputVal.toFixed(2)}</span>
                          </div>
                          <input
                            type="range"
                            min="-2"
                            max="2"
                            step="0.05"
                            value={inputVal}
                            onChange={(e) => setInputVal(parseFloat(e.target.value))}
                            className="w-full accent-purple-500 cursor-pointer"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-slate-300 mb-1">
                            <span>Synaptic Weight (w):</span>
                            <span className="font-mono text-cyan-400">{weightVal.toFixed(2)}</span>
                          </div>
                          <input
                            type="range"
                            min="-3"
                            max="3"
                            step="0.05"
                            value={weightVal}
                            onChange={(e) => setWeightVal(parseFloat(e.target.value))}
                            className="w-full accent-cyan-500 cursor-pointer"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-slate-300 mb-1">
                            <span>Bias (b):</span>
                            <span className="font-mono text-pink-400">{biasVal.toFixed(2)}</span>
                          </div>
                          <input
                            type="range"
                            min="-2"
                            max="2"
                            step="0.05"
                            value={biasVal}
                            onChange={(e) => setBiasVal(parseFloat(e.target.value))}
                            className="w-full accent-pink-500 cursor-pointer"
                          />
                        </div>

                        {/* Activation Function Switcher */}
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-xs text-slate-400">Activation Function (f):</span>
                          {(['relu', 'sigmoid', 'tanh'] as const).map((fn) => (
                            <button
                              key={fn}
                              onClick={() => setActFn(fn)}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                                actFn === fn
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {fn}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Live Output Card */}
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between items-center text-center">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Neuron Output (a)</div>
                        <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 my-2">
                          {activatedOutput.toFixed(3)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Linear sum (z): {z.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Demonstration 2: RAG Pipeline Execution Flow */}
                  <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-sm font-bold text-white">RAG Workflow Step Simulator</h4>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setRagStep((prev) => (prev > 0 ? prev - 1 : 0))}
                          disabled={ragStep === 0}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 disabled:opacity-40"
                        >
                          Prev
                        </button>
                        <span className="text-xs font-mono text-cyan-400">
                          {ragStep + 1} / {ragSteps.length}
                        </span>
                        <button
                          onClick={() => setRagStep((prev) => (prev < ragSteps.length - 1 ? prev + 1 : prev))}
                          disabled={ragStep === ragSteps.length - 1}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 disabled:opacity-40"
                        >
                          Next
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2">
                      <div className="text-xs font-bold text-cyan-300">
                        Step {ragStep + 1}: {ragSteps[ragStep].title}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{ragSteps[ragStep].desc}</p>
                    </div>
                  </div>

                  {/* Demonstration 3: Agent ReAct Execution Flow */}
                  <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-purple-400" />
                        <h4 className="text-sm font-bold text-white">ReAct Agent Task Execution Trace</h4>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setAgentStep((prev) => (prev > 0 ? prev - 1 : 0))}
                          disabled={agentStep === 0}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 disabled:opacity-40"
                        >
                          Prev
                        </button>
                        <span className="text-xs font-mono text-purple-400">
                          {agentStep + 1} / {agentSteps.length}
                        </span>
                        <button
                          onClick={() => setAgentStep((prev) => (prev < agentSteps.length - 1 ? prev + 1 : prev))}
                          disabled={agentStep === agentSteps.length - 1}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 disabled:opacity-40"
                        >
                          Next
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300">
                          {agentSteps[agentStep].type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 font-mono pt-1">{agentSteps[agentStep].text}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: REAL AI PROJECT INTEGRATIONS */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-400">
                    Real, verified applications integrating artificial intelligence, language models, and heuristic algorithms.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Echo AI Assistant */}
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">Echo AI Assistant</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                          Demonstrated
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Full-stack conversational artificial intelligence interface built with Next.js, OpenAI API, and streaming response pipelines.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['Next.js', 'OpenAI API', 'Streaming SSE', 'Tailwind'].map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-400 border border-slate-800">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* VTS Intelligent Telemetry Analysis */}
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">VTS Telemetry Anomaly Detection</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                          Demonstrated
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Vehicle Tracking System telemetry analysis identifying erratic driver behaviors, GPS signal drift, and geofence deviations.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['Python / Node', 'BLE 5.0', 'Geofencing', 'WebSockets'].map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-400 border border-slate-800">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Metropolis A* Pathfinding Graph */}
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5 sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">Metropolis Autonomous A* Pathfinding</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                          Demonstrated
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        The real-time vehicle and pedestrian navigation system powering this coastal metropolis, computing shortest paths across 152 directional lanes with Bézier turning arcs and priority collision queues.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['A* Algorithm', 'Graph Theory', 'Cubic Bézier', 'TypeScript'].map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-400 border border-slate-800">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-purple-400">
                <Brain className="w-3.5 h-3.5" />
                <span>District 07 // AI Research & Innovation Center</span>
              </span>
              <span className="text-[11px] text-slate-500">
                Central 3×3 Portfolio District • Parcel [0, 40]
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

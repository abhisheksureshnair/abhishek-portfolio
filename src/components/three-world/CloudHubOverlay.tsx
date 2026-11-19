'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Cloud,
  Server,
  Network,
  Database,
  GitBranch,
  Layers,
  Cpu,
  Activity,
  Terminal,
  ExternalLink,
  CheckCircle2,
  Sliders,
  Play,
  RotateCcw,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
  ArrowRight,
} from 'lucide-react';
import { GithubIcon } from '@/components/Icons';
import { CLOUD_HUB_METADATA, CloudProject, CloudExhibitionZone } from '@/world/buildings/cloud/cloudMetadata';

interface CloudHubOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'overview' | 'zones' | 'projects' | 'simulator';
  initialZoneId?: string;
}

export const CloudHubOverlay: React.FC<CloudHubOverlayProps> = ({
  isOpen,
  onClose,
  initialTab = 'overview',
  initialZoneId = 'backend-architecture',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'zones' | 'projects' | 'simulator'>(initialTab);
  const [selectedZoneId, setSelectedZoneId] = useState<string>(initialZoneId);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('traqinn-erp');

  // Interactive Simulator State: Cloud Autoscaler & Latency Calculator
  const [concurrentUsers, setConcurrentUsers] = useState<number>(5000);
  const [clusterReplicas, setClusterReplicas] = useState<number>(4);
  const [cacheHitRate, setCacheHitRate] = useState<number>(85);
  const [enableCompression, setEnableCompression] = useState<boolean>(true);

  // Computed metrics
  const effectiveRps = Math.round(concurrentUsers * 1.8);
  const rpsPerReplica = Math.round(effectiveRps / Math.max(1, clusterReplicas));
  const databaseQueries = Math.round(effectiveRps * (1 - cacheHitRate / 100));
  const calculatedLatency = Math.max(
    8,
    Math.round(
      (12 + (rpsPerReplica / 600) * 18 + (databaseQueries / 1200) * 22) *
        (enableCompression ? 0.78 : 1.0)
    )
  );
  const cpuLoadPercent = Math.min(100, Math.round((rpsPerReplica / 1500) * 100));

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (initialZoneId) setSelectedZoneId(initialZoneId);
  }, [initialZoneId]);

  if (!isOpen) return null;

  const currentZone =
    CLOUD_HUB_METADATA.zones.find((z) => z.id === selectedZoneId) || CLOUD_HUB_METADATA.zones[0];
  const currentProject =
    CLOUD_HUB_METADATA.projects.find((p) => p.id === selectedProjectId) || CLOUD_HUB_METADATA.projects[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-[#0b1329]/95 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden font-sans text-slate-100"
        >
          {/* Header Bar */}
          <div className="relative flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/90 via-[#0e1a38]/90 to-slate-900/90">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300">
                <Cloud className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold tracking-wide text-white">
                    {CLOUD_HUB_METADATA.title}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    PLOT B • [40, 40]
                  </span>
                </div>
                <p className="text-xs font-mono text-cyan-400/80">
                  {CLOUD_HUB_METADATA.department}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white transition-all hover:scale-105 active:scale-95"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tab Bar */}
          <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-950/60 border-b border-white/5 overflow-x-auto text-xs font-mono font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>OVERVIEW & TELEMETRY</span>
            </button>
            <button
              onClick={() => setActiveTab('zones')}
              className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'zones'
                  ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>EXHIBITION ZONES (5)</span>
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'projects'
                  ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>PRODUCTION PLATFORMS</span>
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'simulator'
                  ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>LIVE AUTOSCALER SIMULATOR</span>
            </button>
          </div>

          {/* Modal Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB 1: OVERVIEW & TELEMETRY */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Hero Summary Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-[#0e1a38]/80 to-slate-900/90 border border-cyan-500/30">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {CLOUD_HUB_METADATA.subtitle}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-300 mb-4">
                    {CLOUD_HUB_METADATA.overview}
                  </p>
                  <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Core Architectural Mandate:</strong> {CLOUD_HUB_METADATA.mission}
                    </span>
                  </div>
                </div>

                {/* Live System Telemetry Metrics */}
                <div>
                  <h4 className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase mb-3 flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>Real-Time Cluster Telemetry Streams</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                      <div className="text-[11px] font-mono text-slate-400 mb-1">Active K8s Pods</div>
                      <div className="text-xl font-bold font-mono text-cyan-300">
                        {CLOUD_HUB_METADATA.infrastructureTelemetry.activeNodes}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                      <div className="text-[11px] font-mono text-slate-400 mb-1">Avg Latency</div>
                      <div className="text-xl font-bold font-mono text-emerald-400">
                        {CLOUD_HUB_METADATA.infrastructureTelemetry.avgLatencyMs}ms
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                      <div className="text-[11px] font-mono text-slate-400 mb-1">Cluster Uptime</div>
                      <div className="text-xl font-bold font-mono text-cyan-300">
                        {CLOUD_HUB_METADATA.infrastructureTelemetry.uptimePercent}%
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                      <div className="text-[11px] font-mono text-slate-400 mb-1">Total Throughput</div>
                      <div className="text-xl font-bold font-mono text-purple-300">
                        14.2K req/s
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                      <div className="text-[11px] font-mono text-slate-400 mb-1">Deployments</div>
                      <div className="text-xl font-bold font-mono text-amber-300">
                        {CLOUD_HUB_METADATA.infrastructureTelemetry.activeDeployments} Active
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                      <div className="text-[11px] font-mono text-slate-400 mb-1">System Health</div>
                      <div className="text-xl font-bold font-mono text-emerald-300">
                        OPTIMAL
                      </div>
                    </div>
                  </div>
                </div>

                {/* Architectural Specifications */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5">
                  <h4 className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase mb-3">
                    Metropolis Architectural Blueprint
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-slate-400 block mb-0.5">District Coordinates:</span>
                      <span className="text-white font-bold">X = 40.0, Z = 40.0</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Parcel Allocation:</span>
                      <span className="text-white font-bold">{CLOUD_HUB_METADATA.architecturalStats.parcelId}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Footprint Size:</span>
                      <span className="text-white font-bold">25.2m × 25.2m (5 Storeys)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Entrance Approach:</span>
                      <span className="text-white font-bold">North Street Z=20 [40, 30.5]</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: EXHIBITION ZONES */}
            {activeTab === 'zones' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Zone Selection List */}
                <div className="lg:col-span-4 space-y-2">
                  <div className="text-xs font-mono font-bold text-slate-400 uppercase mb-2">
                    Select Exhibition Zone:
                  </div>
                  {CLOUD_HUB_METADATA.zones.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => setSelectedZoneId(zone.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                        selectedZoneId === zone.id
                          ? 'bg-cyan-500/20 border-cyan-400/60 text-white shadow-lg shadow-cyan-950/50'
                          : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-slate-800 text-cyan-400 mt-0.5">
                        {zone.id === 'backend-architecture' && <Server className="w-4 h-4" />}
                        {zone.id === 'api-communication' && <Network className="w-4 h-4" />}
                        {zone.id === 'cloud-infrastructure' && <Cloud className="w-4 h-4" />}
                        {zone.id === 'database-storage' && <Database className="w-4 h-4" />}
                        {zone.id === 'devops-ci-cd' && <GitBranch className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold truncate text-white">{zone.title}</div>
                        <div className="text-[11px] font-mono text-cyan-400/80 truncate">
                          {zone.subtitle}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Right: Selected Zone Exhibition Display */}
                <div className="lg:col-span-8 p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-[#0e1a38]/80 border border-cyan-500/30 space-y-5">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{currentZone.title}</h3>
                    <p className="text-xs font-mono text-cyan-400 mb-3">{currentZone.subtitle}</p>
                    <p className="text-sm leading-relaxed text-slate-300">{currentZone.summary}</p>
                  </div>

                  {/* Key Concepts Grid */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                      Architecture & Implementation Principles
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {currentZone.keyConcepts.map((concept, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 hover:border-cyan-500/20 transition-all"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold text-cyan-200">{concept.title}</span>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                              {concept.tech}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{concept.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benchmark Metrics */}
                  <div>
                    <h4 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase mb-2">
                      Production Benchmarks
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {currentZone.metrics.map((m, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
                          <div className="text-[11px] font-mono text-slate-400 mb-0.5">{m.label}</div>
                          <div className="text-base font-bold font-mono text-cyan-300">{m.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PRODUCTION PLATFORMS */}
            {activeTab === 'projects' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Project Selector */}
                <div className="lg:col-span-4 space-y-2">
                  <div className="text-xs font-mono font-bold text-slate-400 uppercase mb-2">
                    Abhishek’s Cloud Systems:
                  </div>
                  {CLOUD_HUB_METADATA.projects.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => setSelectedProjectId(proj.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                        selectedProjectId === proj.id
                          ? 'bg-cyan-500/20 border-cyan-400/60 text-white shadow-lg shadow-cyan-950/50'
                          : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {proj.badge}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">{proj.status}</span>
                      </div>
                      <div className="text-sm font-bold text-white truncate">{proj.title}</div>
                    </button>
                  ))}
                </div>

                {/* Right: Project Architectural Deep Dive */}
                <div className="lg:col-span-8 p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-[#0e1a38]/80 border border-cyan-500/30 space-y-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{currentProject.title}</h3>
                      <p className="text-xs font-mono text-cyan-400">{currentProject.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {currentProject.githubUrl && (
                        <a
                          href={currentProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-white border border-white/10 transition-all hover:scale-105"
                        >
                          <GithubIcon className="w-3.5 h-3.5 text-cyan-400" />
                          <span>SOURCE</span>
                        </a>
                      )}
                      {currentProject.liveUrl && (
                        <a
                          href={currentProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-mono text-white transition-all hover:scale-105 shadow-md shadow-cyan-600/30"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>LIVE DEMO</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-300">{currentProject.description}</p>

                  {/* Architecture Highlights */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                      Cloud & Distributed Architecture Highlights
                    </h4>
                    <div className="space-y-1.5">
                      {currentProject.architectureHighlights.map((hl, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack Badges */}
                  <div>
                    <h4 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase mb-2">
                      Integrated Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {currentProject.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-cyan-500/20 text-xs font-mono text-cyan-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Project Metrics */}
                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/5">
                    {currentProject.metrics.map((m, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                        <div className="text-[11px] font-mono text-slate-400 mb-0.5">{m.label}</div>
                        <div className="text-base font-bold font-mono text-cyan-300">{m.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: AUTOSCALER SIMULATOR */}
            {activeTab === 'simulator' && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-cyan-400" />
                        <span>Interactive High-Concurrency Cloud Simulator</span>
                      </h3>
                      <p className="text-xs font-mono text-slate-400">
                        Simulate horizontal pod autoscaling, Redis cache hit ratios, and API response latencies.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setConcurrentUsers(5000);
                        setClusterReplicas(4);
                        setCacheHitRate(85);
                        setEnableCompression(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>RESET</span>
                    </button>
                  </div>

                  {/* Sliders Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    {/* Slider 1: Concurrent Users */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Concurrent Visitors:</span>
                        <span className="text-cyan-300 font-bold">{concurrentUsers.toLocaleString()} users</span>
                      </div>
                      <input
                        type="range"
                        min={500}
                        max={30000}
                        step={500}
                        value={concurrentUsers}
                        onChange={(e) => setConcurrentUsers(parseInt(e.target.value, 10))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                      <div className="text-[10px] text-slate-400 font-mono">
                        Generates ~{effectiveRps.toLocaleString()} requests/second
                      </div>
                    </div>

                    {/* Slider 2: Kubernetes Cluster Replicas */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">K8s Pod Replicas:</span>
                        <span className="text-cyan-300 font-bold">{clusterReplicas} pods</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={16}
                        step={1}
                        value={clusterReplicas}
                        onChange={(e) => setClusterReplicas(parseInt(e.target.value, 10))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                      <div className="text-[10px] text-slate-400 font-mono">
                        Load per replica: ~{rpsPerReplica} req/sec
                      </div>
                    </div>

                    {/* Slider 3: Redis Cache Hit Rate */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Redis Cache Hit Ratio:</span>
                        <span className="text-cyan-300 font-bold">{cacheHitRate}%</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={99}
                        step={1}
                        value={cacheHitRate}
                        onChange={(e) => setCacheHitRate(parseInt(e.target.value, 10))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                      <div className="text-[10px] text-slate-400 font-mono">
                        DB reads: ~{databaseQueries.toLocaleString()}/sec
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
                      <input
                        type="checkbox"
                        checked={enableCompression}
                        onChange={(e) => setEnableCompression(e.target.checked)}
                        className="rounded accent-cyan-400"
                      />
                      <span>Enable Brotli / Gzip Edge Compression (CloudFront)</span>
                    </label>
                  </div>
                </div>

                {/* Simulation Output Dashboard */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20">
                    <div className="text-[11px] font-mono text-slate-400 mb-1">Simulated Latency</div>
                    <div
                      className={`text-2xl font-bold font-mono ${
                        calculatedLatency < 35
                          ? 'text-emerald-400'
                          : calculatedLatency < 70
                          ? 'text-cyan-300'
                          : 'text-amber-400'
                      }`}
                    >
                      {calculatedLatency} ms
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1">
                      {calculatedLatency < 40 ? 'Ultra-low response' : 'Acceptable SLA'}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20">
                    <div className="text-[11px] font-mono text-slate-400 mb-1">Replica CPU Utilization</div>
                    <div
                      className={`text-2xl font-bold font-mono ${
                        cpuLoadPercent < 60
                          ? 'text-emerald-400'
                          : cpuLoadPercent < 85
                          ? 'text-cyan-300'
                          : 'text-rose-400'
                      }`}
                    >
                      {cpuLoadPercent}%
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1">
                      {cpuLoadPercent > 80 ? 'HPA scaling triggered' : 'Optimal head room'}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20">
                    <div className="text-[11px] font-mono text-slate-400 mb-1">DB Disk I/O Load</div>
                    <div className="text-2xl font-bold font-mono text-purple-300">
                      {databaseQueries} qps
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1">
                      {cacheHitRate > 80 ? 'Heavy caching buffer' : 'Direct disk reads'}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20">
                    <div className="text-[11px] font-mono text-slate-400 mb-1">System Health</div>
                    <div className="text-2xl font-bold font-mono text-emerald-400">
                      {cpuLoadPercent > 90 ? 'SATURATED' : 'STABLE 99.99%'}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1">
                      Multi-AZ Resilience
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-cyan-500/20 bg-slate-950/80 text-xs font-mono text-slate-400">
            <div>
              <span className="text-cyan-400">ABHISHEK S NAIR</span> • Cloud Architecture & Distributed Systems
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400">CLUSTER STATUS: 100% ONLINE</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

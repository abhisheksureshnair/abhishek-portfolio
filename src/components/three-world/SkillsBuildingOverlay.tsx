'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Code2,
  Smartphone,
  Server,
  Wrench,
  Sparkles,
  ArrowRight,
  Cpu,
  Layers,
  Database,
  Terminal,
  GitBranch,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { SKILL_CATEGORIES } from '@/data/portfolioData';

interface SkillsBuildingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SkillItem {
  name: string;
  category: 'Frontend' | 'Mobile' | 'Backend' | 'Other';
  context: string;
  isFlagship?: boolean;
}

/**
 * Verified Skills Grouped Strictly According to Requirements:
 * Frontend: React.js, JavaScript, HTML, CSS.
 * Mobile: React Native, Flutter.
 * Backend: Node.js, REST API development.
 * Other: Python, Git, Firebase, etc.
 * NO arbitrary percentages or fake proficiency levels.
 */
const VERIFIED_SKILLS: SkillItem[] = [
  // 1. FRONTEND
  {
    name: 'React.js',
    category: 'Frontend',
    context: 'Interactive component systems, hooks, virtual DOM, SPAs (FlowSync, Echo Desktop AI)',
    isFlagship: true,
  },
  {
    name: 'JavaScript (ES6+)',
    category: 'Frontend',
    context: 'Modern asynchronous workflows, closures, promises, event-driven DOM architectures',
    isFlagship: true,
  },
  {
    name: 'HTML5',
    category: 'Frontend',
    context: 'Semantic markup, accessible DOM hierarchies, canvas APIs, web components',
  },
  {
    name: 'CSS3 / Tailwind',
    category: 'Frontend',
    context: 'Responsive grid systems, flexbox, CSS variables, hardware-accelerated animations',
  },

  // 2. MOBILE
  {
    name: 'React Native',
    category: 'Mobile',
    context: 'Cross-platform Android & iOS engineering, platform APIs, Bluetooth BLE integrations',
    isFlagship: true,
  },
  {
    name: 'Flutter',
    category: 'Mobile',
    context: 'High-performance mobile rendering, Dart state management, live GPS map telemetry',
    isFlagship: true,
  },

  // 3. BACKEND
  {
    name: 'Node.js',
    category: 'Backend',
    context: 'Asynchronous event-loop servers, microservices, background job orchestration',
    isFlagship: true,
  },
  {
    name: 'REST API Development',
    category: 'Backend',
    context: 'Express.js endpoint contracts, JWT authentication, defensive validation, caching',
    isFlagship: true,
  },
  {
    name: 'WebSockets & Socket.IO',
    category: 'Backend',
    context: 'Low-latency bi-directional channels, rooms, telemetry streaming, live signalling',
  },

  // 4. OTHER & VERIFIED TOOLS
  {
    name: 'Python',
    category: 'Other',
    context: 'Backend scripting, algorithmic data pipelines, FastAPI endpoints, AI experimentation',
    isFlagship: true,
  },
  {
    name: 'Git & GitHub',
    category: 'Other',
    context: 'Version control, atomic commit histories, trunk-based branching, collaborative PRs',
    isFlagship: true,
  },
  {
    name: 'Firebase',
    category: 'Other',
    context: 'Realtime database synchronization, push notifications, authentication services',
  },
  {
    name: 'MongoDB',
    category: 'Other',
    context: 'Document store design, Mongoose schema modeling, aggregation pipelines (FlowSync)',
  },
  {
    name: 'MySQL',
    category: 'Other',
    context: 'Relational data structures, foreign keys, normalized schemas, indexed queries',
  },
  {
    name: 'Postman & VS Code',
    category: 'Other',
    context: 'REST API verification, mock servers, automated testing collections, debugging',
  },
  {
    name: 'AI / LLM Integration',
    category: 'Other',
    context: 'Structured output schemas, NVIDIA NIM APIs, prompt engineering, streaming chat',
  },
];

export const SkillsBuildingOverlay: React.FC<SkillsBuildingOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Frontend' | 'Mobile' | 'Backend' | 'Other'>('All');

  // ESC key listener to restore city camera
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredSkills = activeTab === 'All'
    ? VERIFIED_SKILLS
    : VERIFIED_SKILLS.filter((s) => s.category === activeTab);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Frontend':
        return <Code2 className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Mobile':
        return <Smartphone className="w-3.5 h-3.5 text-teal-400" />;
      case 'Backend':
        return <Server className="w-3.5 h-3.5 text-blue-400" />;
      default:
        return <Wrench className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-md font-mono pointer-events-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl bg-slate-950/95 border border-cyan-500/30 p-5 sm:p-7 shadow-[0_0_70px_rgba(6,182,212,0.22)] text-white overflow-hidden flex flex-col"
          >
            {/* Cyan & Teal Decorative Background Flare */}
            <div className="absolute -top-28 -right-28 w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-28 -left-28 w-72 h-72 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />

            {/* Header with Title & Close Button */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 shrink-0">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs tracking-wider uppercase font-semibold">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SKILLS TECH TOWER // TECHNICAL TOOLBOX</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>Engineering Stack</span>
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                </h2>
                <p className="text-xs text-cyan-200/80">
                  Verified tools, runtime frameworks, and system architectures applied in production
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all active:scale-95"
                title="Back to City (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive Category Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-3 pb-2 border-b border-white/5 shrink-0 text-xs font-mono">
              {(['All', 'Frontend', 'Mobile', 'Backend', 'Other'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeTab === tab
                      ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 font-bold shadow-lg shadow-cyan-500/15'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab === 'Frontend' && <Code2 className="w-3.5 h-3.5" />}
                  {tab === 'Mobile' && <Smartphone className="w-3.5 h-3.5" />}
                  {tab === 'Backend' && <Server className="w-3.5 h-3.5" />}
                  {tab === 'Other' && <Wrench className="w-3.5 h-3.5" />}
                  <span>{tab === 'All' ? 'All Skills' : tab}</span>
                </button>
              ))}
            </div>

            {/* Skills Grid */}
            <div className="overflow-y-auto pr-1 py-4 font-sans text-xs sm:text-sm text-zinc-300 leading-relaxed custom-scrollbar flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredSkills.map((skill, idx) => (
                  <motion.div
                    key={skill.name}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.02 }}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-2 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-1.5 font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {getCategoryIcon(skill.category)}
                          <span className="text-sm">{skill.name}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 border border-white/5 uppercase">
                          {skill.category}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-sans leading-normal">
                        {skill.context}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-300/80 pt-1">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                      <span>Verified Production Stack</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom Footer Action */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 shrink-0 font-mono text-xs">
              <div className="text-[11px] text-zinc-400 hidden sm:block">
                Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">ESC</kbd> to return
              </div>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
              >
                <span>Back to City</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


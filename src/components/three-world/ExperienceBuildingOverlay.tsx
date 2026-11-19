'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Briefcase,
  Building2,
  Calendar,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Activity,
  Layers,
  Wrench,
  Lock,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';
import { PROFESSIONAL_EXPERIENCE_DATA } from '@/data/portfolioData';

interface ExperienceBuildingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TimelineNode {
  period: string;
  role: string;
  organization: string;
  type: 'Commercial Employment' | 'Independent Full-Stack' | 'Academic Milestone';
  summary: string;
  responsibilities?: string[];
  deliverables?: { title: string; tech: string[]; note: string }[];
  isCurrent?: boolean;
}

/**
 * Verified Career Timeline Data strictly extracted from existing portfolio data:
 * - 3.6 years of software development experience
 * - Official Analyst role at InnSpark Solutions Pvt. Ltd. (June 2023 – Present)
 * - Real commercial productions (VTS, Telemedicine, SafeNet, BLE Debugger)
 * - Independent builds (FlowSync, Echo Desktop AI)
 * - Education (MCA, BSc)
 * - Clearly labeled placeholders for confidential/NDA items.
 */
const VERIFIED_TIMELINE: TimelineNode[] = [
  {
    period: 'June 2023 – Present',
    role: 'Analyst (Software Development)',
    organization: 'InnSpark Solutions Pvt. Ltd.',
    type: 'Commercial Employment',
    summary:
      'Contributing to software development projects involving application development, feature implementation, integrations, debugging, testing, and technical problem solving across enterprise healthcare, logistics, and device management domains.',
    responsibilities: [
      'Contributing to software development projects involving application development, feature implementation, integrations, debugging, testing and technical problem solving.',
      'Implementing cross-platform application features using React Native and Flutter for Android and iOS deployments.',
      'Integrating real-time communication systems using Socket.IO and WebSockets for live telemetry and data synchronization.',
      'Integrating Bluetooth Low Energy (BLE) scanning, medical-device vitals capture, and custom GATT characteristic handling.',
      'Implementing live GPS tracking, route history, route playback trails, and geofencing alert functionality with Google Maps API.',
      'Integrating platform APIs for device management and administrative service functionality in mobile applications.',
      'Designing robust REST API client integrations and local caching mechanisms.',
      'Collaborating across engineering teams to diagnose, debug, and resolve complex application issues.',
    ],
    deliverables: [
      {
        title: 'Vehicle Tracking System (VTS)',
        tech: ['Flutter', 'React Native', 'Google Maps API', 'WebSockets', 'GPS Geofencing'],
        note: 'Migrated mobile codebase from React Native to Flutter for 60 FPS map rendering; implemented live GPS streams and historical route playback.',
      },
      {
        title: 'Telemedicine Platform',
        tech: ['React Native', 'Bluetooth BLE', 'Socket.IO', 'WebSockets', 'Healthcare IoT'],
        note: 'Engineered GATT communication with BLE medical diagnostic hardware; built live doctor-patient consultation signalling and vitals synchronization.',
      },
      {
        title: 'SafeNet Device Management & Security',
        tech: ['React Native', 'Android Platform APIs', 'Device Admin APIs', 'Accessibility Services'],
        note: 'Engineered background monitoring, dynamic app restriction policies, and configurable screen-time schedules for protected Android devices.',
      },
      {
        title: 'Bluetooth BLE Diagnostic Debugger',
        tech: ['React Native', 'react-native-ble-manager', 'Bluetooth BLE', 'Hardware Diagnostics'],
        note: 'Internal QA & developer diagnostic tool for GATT service inspection, peripheral discovery, RSSI mapping, and raw hex payload parsing.',
      },
    ],
    isCurrent: true,
  },
  {
    period: '2024 – Present',
    role: 'Creator & Full-Stack Developer',
    organization: 'Independent Software Engineering',
    type: 'Independent Full-Stack',
    summary:
      'Architected end-to-end full-stack web and desktop applications incorporating modern AI LLM integrations, real-time WebSockets, and cross-platform desktop frameworks.',
    deliverables: [
      {
        title: 'FlowSync — Collaborative SaaS & AI',
        tech: ['React', 'Vite', 'Node.js', 'Express.js', 'MongoDB', 'Socket.IO', 'NVIDIA NIM LLM'],
        note: 'Real-time collaborative project management platform with JWT security, live team messaging, and AI risk/productivity analysis.',
      },
      {
        title: 'Echo Desktop AI — Copilot Suite',
        tech: ['Electron.js', 'React', 'Vite', 'Node.js', 'Browser Extensions', 'LLM Integration'],
        note: 'Desktop productivity assistant with multi-monitor floating HUD and companion browser extensions for Chrome, Brave, Edge, and Firefox.',
      },
    ],
    isCurrent: true,
  },
  {
    period: '2024 – 2026',
    role: 'Master of Computer Applications (MCA)',
    organization: 'Manipal University Jaipur',
    type: 'Academic Milestone',
    summary:
      'Specializing in Artificial Intelligence and advanced software engineering architectures, algorithms, and distributed systems.',
  },
  {
    period: '2020 – 2023',
    role: 'Bachelor of Science in Computer Science (B.Sc.)',
    organization: 'Mannam Memorial NSS College',
    type: 'Academic Milestone',
    summary:
      'Core foundation in computer science principles, data structures, object-oriented programming, operating systems, and web technologies.',
  },
];

export const ExperienceBuildingOverlay: React.FC<ExperienceBuildingOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'commercial' | 'deliverables'>('timeline');

  // ESC key listener to restore city view
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-md font-mono pointer-events-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-950/95 border border-sky-500/30 rounded-2xl shadow-[0_0_60px_rgba(2,132,199,0.25)] overflow-hidden"
          >
            {/* Top Corporate Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-400" />

            {/* Header */}
            <div className="flex items-start justify-between p-5 sm:p-6 border-b border-sky-500/20 bg-slate-900/40">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    EXPERIENCE OFFICE // INNSPARK HQ
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    3.6 Years Professional Experience
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Professional Experience & Career Timeline
                </h2>
                <p className="text-xs text-slate-300">
                  Commercial employment at{' '}
                  <span className="text-sky-400 font-semibold">InnSpark Solutions Pvt. Ltd.</span> &
                  verified production application deliveries.
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-sky-500/20 bg-slate-950/60 px-5 sm:px-6 gap-2">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`py-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 'timeline'
                    ? 'border-sky-500 text-sky-400 bg-sky-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Career Timeline</span>
              </button>

              <button
                onClick={() => setActiveTab('commercial')}
                className={`py-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 'commercial'
                    ? 'border-sky-500 text-sky-400 bg-sky-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>InnSpark Role & Responsibilities</span>
              </button>

              <button
                onClick={() => setActiveTab('deliverables')}
                className={`py-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 'deliverables'
                    ? 'border-sky-500 text-sky-400 bg-sky-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Commercial Production Systems</span>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* TAB 1: FULL CAREER TIMELINE */}
              {activeTab === 'timeline' && (
                <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-sky-500 before:via-blue-500 before:to-slate-800">
                  {VERIFIED_TIMELINE.map((node, idx) => (
                    <motion.div
                      key={node.period + idx}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.08 }}
                      className="relative space-y-2.5"
                    >
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-[30px] top-1.5 w-3.5 h-3.5 rounded-full border-2 ${
                          node.isCurrent
                            ? 'bg-sky-500 border-white shadow-[0_0_10px_#38bdf8]'
                            : 'bg-slate-900 border-slate-500'
                        }`}
                      />

                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-xs font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/50">
                          {node.period}
                        </span>
                        <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                          • {node.type}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <h3 className="text-sm sm:text-base font-bold text-white">
                            {node.role}
                          </h3>
                          <span className="text-xs font-semibold text-sky-300">
                            {node.organization}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {node.summary}
                        </p>

                        {/* Deliverables snippet if available */}
                        {node.deliverables && (
                          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {node.deliverables.map((item) => (
                              <div
                                key={item.title}
                                className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1"
                              >
                                <div className="text-[11px] font-bold text-sky-300">
                                  {item.title}
                                </div>
                                <p className="text-[10px] text-slate-400 line-clamp-2">
                                  {item.note}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* TAB 2: INNSPARK OFFICIAL ROLE & RESPONSIBILITIES */}
              {activeTab === 'commercial' && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Company Profile Header */}
                  <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-sky-950/50 via-slate-900/60 to-slate-950 border border-sky-500/30 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-xs text-sky-400 font-bold uppercase tracking-wider">
                          Official Employment
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white">
                          InnSpark Solutions Pvt. Ltd.
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-white">June 2023 – Present</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 justify-end">
                          <MapPin className="w-3 h-3 text-sky-400" />
                          <span>Kerala, India</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
                      <div className="p-2 rounded-lg bg-slate-900/70">
                        <div className="text-[10px] text-slate-400">Designation</div>
                        <div className="text-xs font-bold text-white">Analyst</div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900/70">
                        <div className="text-[10px] text-slate-400">Department</div>
                        <div className="text-xs font-bold text-white">Software Development</div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900/70">
                        <div className="text-[10px] text-slate-400">Employment Type</div>
                        <div className="text-xs font-bold text-white">Full-Time</div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900/70">
                        <div className="text-[10px] text-slate-400">Domain Focus</div>
                        <div className="text-xs font-bold text-white">Web • Mobile • IoT</div>
                      </div>
                    </div>
                  </div>

                  {/* Core Responsibilities Bullet Points */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-400" />
                      <span>Verified Commercial Responsibilities</span>
                    </h4>

                    <div className="grid grid-cols-1 gap-2.5">
                      {PROFESSIONAL_EXPERIENCE_DATA.responsibilities.map((resp, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-sky-500/30 transition-colors"
                        >
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500/10 text-sky-400 text-[10px] font-bold flex items-center justify-center mt-0.5 border border-sky-500/20">
                            {i + 1}
                          </span>
                          <span className="text-xs text-slate-300 leading-relaxed">
                            {resp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security & Confidentiality Placeholder Notice */}
                  <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
                    <Lock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-amber-300">
                        Security & Confidentiality Notice
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Commercial application source code, proprietary telemetry endpoints, and client infrastructure keys delivered at InnSpark Solutions Pvt. Ltd. are protected under non-disclosure protocols and represented via verified architectural summaries.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: COMMERCIAL PRODUCTION DELIVERIES */}
              {activeTab === 'deliverables' && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {/* 1. Vehicle Tracking System */}
                  <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        GPS & REAL-TIME
                      </span>
                      <span className="text-[10px] text-slate-400">2023 – 2024</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Vehicle Tracking System (VTS)
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Delivered at InnSpark Solutions Pvt. Ltd.
                      </p>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Migrated the core mobile codebase from React Native to Flutter for enhanced 60 FPS map rendering. Integrated Google Maps API with live WebSocket streams for real-time location updates, multi-polygon geofencing alerts, and historical route playback.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Flutter', 'React Native', 'Google Maps API', 'WebSockets', 'GPS'].map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-sky-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 2. Telemedicine Application */}
                  <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        HEALTHCARE & IOT
                      </span>
                      <span className="text-[10px] text-slate-400">2023 – 2024</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Telemedicine Application
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Delivered at InnSpark Solutions Pvt. Ltd.
                      </p>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Engineered hardware communication routines connecting Bluetooth Low Energy (BLE) medical diagnostic devices directly to the mobile app via GATT characteristics. Integrated Socket.IO and WebSockets for low-latency doctor-patient consultations and live telemetry.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['React Native', 'Bluetooth BLE', 'Socket.IO', 'WebSockets', 'IoT'].map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-sky-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 3. SafeNet Device Management */}
                  <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        DEVICE MANAGEMENT & SECURITY
                      </span>
                      <span className="text-[10px] text-slate-400">2024</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        SafeNet Parental Control & Device Security
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Delivered at InnSpark Solutions Pvt. Ltd.
                      </p>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Engineered a device management app in React Native bridged with Android Platform APIs (Device Administration and Accessibility Services). Implemented real-time app restrictions, dynamic blocking policies, and background analytics logging.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['React Native', 'Android APIs', 'Device Admin', 'Security'].map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-sky-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 4. Bluetooth BLE Debugger */}
                  <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        DEVELOPER TOOLING
                      </span>
                      <span className="text-[10px] text-slate-400">2023</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Bluetooth BLE Diagnostic Debugger
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Delivered at InnSpark Solutions Pvt. Ltd.
                      </p>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Internal engineering diagnostic utility for scanning, connecting, and inspecting GATT services and characteristics on BLE peripherals. Features RSSI signal mapping, MTU negotiation, and raw byte hex/ASCII parsing.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['React Native', 'BLE Manager', 'GATT Services', 'Diagnostics'].map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-sky-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 sm:p-5 border-t border-sky-500/20 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  <kbd>ESC</kbd>
                </span>
                <span>or Back to City to resume 3D orbit</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-sky-600/30 flex items-center gap-2"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  <span>Back to City</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


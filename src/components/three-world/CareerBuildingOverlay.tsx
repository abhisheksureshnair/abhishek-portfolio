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
  Download,
  FileText,
  Globe,
  Award,
  Clock,
  Code2,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/Icons';
import {
  CAREER_CENTER_METADATA,
  ExperienceItem,
  EducationItem,
  TimelineMilestone,
  ProfessionalLink,
} from '@/world/buildings/career/careerMetadata';

interface CareerBuildingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'experience' | 'education' | 'timeline' | 'resume';
}

export const CareerBuildingOverlay: React.FC<CareerBuildingOverlayProps> = ({
  isOpen,
  onClose,
  initialTab = 'experience',
}) => {
  const [activeTab, setActiveTab] = useState<'experience' | 'education' | 'timeline' | 'resume'>(
    initialTab
  );
  const [selectedMilestone, setSelectedMilestone] = useState<TimelineMilestone | null>(
    CAREER_CENTER_METADATA.timeline[CAREER_CENTER_METADATA.timeline.length - 1]
  );
  const [timelineFilter, setTimelineFilter] = useState<'All' | 'Experience' | 'Education' | 'Project' | 'Milestone'>('All');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setSelectedMilestone(
        CAREER_CENTER_METADATA.timeline[CAREER_CENTER_METADATA.timeline.length - 1]
      );
    }
  }, [isOpen, initialTab]);

  // ESC key listener to exit overlay
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredTimeline =
    timelineFilter === 'All'
      ? CAREER_CENTER_METADATA.timeline
      : CAREER_CENTER_METADATA.timeline.filter((m) => m.category === timelineFilter);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={onClose} />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-5xl h-[88vh] max-h-[820px] flex flex-col rounded-2xl bg-zinc-950/95 border border-white/15 shadow-2xl shadow-cyan-950/40 overflow-hidden backdrop-blur-xl"
          >
            {/* Header Banner */}
            <div className="relative px-6 py-5 border-b border-white/10 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
                  <Briefcase className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {CAREER_CENTER_METADATA.district}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      8 Floors // 34.8m Corporate Stepped Headquarter
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <span>{CAREER_CENTER_METADATA.title}</span>
                  </h2>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 border border-white/10 text-zinc-300 hover:text-white transition-all shadow-md hover:scale-105 active:scale-95"
                title="Close modal (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 py-2.5 bg-zinc-900/60 border-b border-white/10 flex items-center gap-2 overflow-x-auto select-none">
              <button
                onClick={() => setActiveTab('experience')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeTab === 'experience'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-md shadow-amber-500/10'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60 border border-transparent'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>EXPERIENCE (3.6 YEARS)</span>
              </button>

              <button
                onClick={() => setActiveTab('education')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeTab === 'education'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md shadow-cyan-500/10'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60 border border-transparent'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>EDUCATION (MCA & B.SC.)</span>
              </button>

              <button
                onClick={() => setActiveTab('timeline')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeTab === 'timeline'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-md shadow-emerald-500/10'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60 border border-transparent'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>INTERACTIVE TIMELINE</span>
              </button>

              <button
                onClick={() => setActiveTab('resume')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  activeTab === 'resume'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50 shadow-md shadow-purple-500/10'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60 border border-transparent'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>RESUME & LINKS</span>
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: EXPERIENCE */}
              {activeTab === 'experience' && (
                <div className="space-y-6">
                  {/* Summary Callout Banner */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/20 via-zinc-900 to-zinc-900/80 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                          Verified Professional Status: Active
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        {CAREER_CENTER_METADATA.headline.role} —{' '}
                        <span className="text-amber-400">{CAREER_CENTER_METADATA.headline.experienceYears}</span>
                      </h3>
                      <p className="text-xs text-zinc-300 mt-1 max-w-3xl leading-relaxed">
                        {CAREER_CENTER_METADATA.headline.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="px-3.5 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-center">
                        <div className="text-xl font-bold font-mono text-amber-400">3.6</div>
                        <div className="text-[10px] font-mono text-zinc-400 uppercase">Years Exp</div>
                      </div>
                      <div className="px-3.5 py-2 rounded-xl bg-zinc-950/80 border border-white/10 text-center">
                        <div className="text-xl font-bold font-mono text-cyan-400">100%</div>
                        <div className="text-[10px] font-mono text-zinc-400 uppercase">Production</div>
                      </div>
                    </div>
                  </div>

                  {/* Experience Cards */}
                  {CAREER_CENTER_METADATA.experience.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 hover:border-amber-500/40 transition-all space-y-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base sm:text-lg font-bold text-white">{exp.role}</h4>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                              {exp.type}
                            </span>
                          </div>
                          <div className="text-sm font-semibold text-amber-400 flex items-center gap-2 mt-0.5">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>{exp.company}</span>
                            <span className="text-zinc-500">•</span>
                            <span className="text-xs text-zinc-400 flex items-center gap-1 font-normal">
                              <MapPin className="w-3 h-3 text-zinc-500" />
                              {exp.location}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-950 border border-white/10 text-xs font-mono text-zinc-300">
                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                            {exp.period}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">{exp.summary}</p>

                      {/* Key Highlights */}
                      <div>
                        <h5 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2.5">
                          Key Responsibilities & Production Deliverables:
                        </h5>
                        <ul className="grid grid-cols-1 gap-2">
                          {exp.highlights.map((h, i) => (
                            <li
                              key={i}
                              className="text-xs text-zinc-300 flex items-start gap-2.5 p-2 rounded-lg bg-zinc-950/50 border border-white/5"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technologies */}
                      <div>
                        <h5 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2">
                          Core Technologies Used:
                        </h5>
                        <div className="flex flex-wrap gap-1.5">
                          {exp.technologies.map((t, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-950 border border-white/10 text-zinc-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Technical Specialization Areas */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                      Technical Practice Domains:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {CAREER_CENTER_METADATA.technicalAreas.map((area, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-white/15 transition-all"
                        >
                          <div className="text-xs font-bold text-amber-300 font-mono mb-1">
                            {area.name}
                          </div>
                          <div className="text-xs text-zinc-400 leading-relaxed">
                            {area.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: EDUCATION */}
              {activeTab === 'education' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-cyan-400 shrink-0" />
                    <div>
                      <h3 className="text-sm font-bold text-white">Academic Qualifications & Rigor</h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Formal higher education in computer science, software engineering, and applied artificial intelligence.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {CAREER_CENTER_METADATA.education.map((edu) => (
                      <div
                        key={edu.id}
                        className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                              {edu.status}
                            </span>
                            <span className="text-xs font-mono text-zinc-400">{edu.period}</span>
                          </div>

                          <div>
                            <h4 className="text-base font-bold text-white">{edu.degree}</h4>
                            <div className="text-xs font-semibold text-cyan-400 mt-0.5">
                              {edu.field}
                            </div>
                            <div className="text-xs text-zinc-300 mt-1 flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                              <span>{edu.institution}</span>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-zinc-950/60 border border-white/5 flex items-center justify-between">
                            <span className="text-xs font-mono text-zinc-400">Score / Standing:</span>
                            <span className="text-sm font-mono font-bold text-emerald-400">
                              {edu.score}
                            </span>
                          </div>

                          <div className="space-y-1.5 pt-2">
                            {edu.highlights.map((h, i) => (
                              <div key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                                <span>{h}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: TIMELINE */}
              {activeTab === 'timeline' && (
                <div className="space-y-6">
                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/10">
                    <span className="text-xs font-mono text-zinc-400 font-bold uppercase">
                      Timeline Filter:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(['All', 'Experience', 'Education', 'Project', 'Milestone'] as const).map(
                        (f) => (
                          <button
                            key={f}
                            onClick={() => setTimelineFilter(f)}
                            className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                              timelineFilter === f
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
                            }`}
                          >
                            {f}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left: Interactive Timeline Track */}
                    <div className="lg:col-span-7 space-y-3 max-h-[500px] overflow-y-auto pr-2">
                      {filteredTimeline.map((milestone, idx) => {
                        const isSelected = selectedMilestone?.title === milestone.title;
                        return (
                          <div
                            key={idx}
                            onClick={() => setSelectedMilestone(milestone)}
                            className={`p-4 rounded-xl cursor-pointer transition-all border flex items-start gap-3.5 ${
                              isSelected
                                ? 'bg-zinc-900 border-emerald-400/60 shadow-lg shadow-emerald-500/10'
                                : 'bg-zinc-950/60 hover:bg-zinc-900/60 border-white/5 hover:border-white/15'
                            }`}
                          >
                            {/* Year Marker */}
                            <div className="shrink-0 w-16 text-center">
                              <span className="block text-xs font-mono font-bold text-white bg-zinc-900 border border-white/10 px-2 py-1 rounded-lg">
                                {milestone.year}
                              </span>
                              <span className="block text-[10px] font-mono text-zinc-400 mt-1">
                                {milestone.date}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase"
                                  style={{
                                    backgroundColor: `${milestone.badgeColor}20`,
                                    color: milestone.badgeColor,
                                    border: `1px solid ${milestone.badgeColor}40`,
                                  }}
                                >
                                  {milestone.category}
                                </span>
                                <span className="text-xs text-zinc-400 truncate">
                                  {milestone.organization}
                                </span>
                              </div>
                              <h4 className="text-xs sm:text-sm font-bold text-white mt-1">
                                {milestone.title}
                              </h4>
                              <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                                {milestone.description}
                              </p>
                            </div>

                            <ArrowRight
                              className={`w-4 h-4 shrink-0 transition-transform ${
                                isSelected ? 'text-emerald-400 translate-x-1' : 'text-zinc-600'
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Right: Milestone Detail Inspector */}
                    <div className="lg:col-span-5 p-5 rounded-2xl bg-zinc-900/80 border border-emerald-500/30 space-y-4">
                      {selectedMilestone ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span
                              className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold"
                              style={{
                                backgroundColor: `${selectedMilestone.badgeColor}20`,
                                color: selectedMilestone.badgeColor,
                                border: `1px solid ${selectedMilestone.badgeColor}40`,
                              }}
                            >
                              {selectedMilestone.category} // {selectedMilestone.date}
                            </span>
                            <span className="text-xs font-mono text-zinc-400">
                              {selectedMilestone.year}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-base font-bold text-white">
                              {selectedMilestone.title}
                            </h3>
                            <div className="text-xs font-semibold text-emerald-400 mt-0.5">
                              {selectedMilestone.organization}
                            </div>
                          </div>

                          <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-white/5 text-xs text-zinc-300 leading-relaxed">
                            {selectedMilestone.description}
                          </div>

                          <div>
                            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                              Related Tags & Context:
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedMilestone.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-950 border border-white/10 text-zinc-300"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-xs text-zinc-500">
                          Select a timeline node on the left to inspect detailed milestones.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: RESUME & LINKS */}
              {activeTab === 'resume' && (
                <div className="space-y-6">
                  {/* Resume Overview */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/30 via-zinc-900 to-zinc-900/80 border border-purple-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-mono font-bold text-purple-300 uppercase">
                          Official Curriculum Vitae
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        Abhishek Suresh Nair — Software Developer
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Verified 3.6 years experience • Full-Stack Web & Mobile • MCA (72%)
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-mono transition-all shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>VIEW RESUME</span>
                      </a>
                      <a
                        href="/resume.pdf"
                        download="Abhishek_Suresh_Nair_Resume.pdf"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-zinc-200 text-xs font-bold font-mono transition-all hover:scale-105 active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>DOWNLOAD</span>
                      </a>
                    </div>
                  </div>

                  {/* Verified Links Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {CAREER_CENTER_METADATA.resumeLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 group ${
                          link.isPrimary
                            ? 'bg-purple-950/20 border-purple-500/40 hover:border-purple-400'
                            : 'bg-zinc-900/60 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/10 text-zinc-300 group-hover:text-white group-hover:border-purple-400/50 transition-all shrink-0">
                          {link.icon === 'github' && <GithubIcon className="w-4 h-4 text-cyan-400" />}
                          {link.icon === 'linkedin' && <LinkedinIcon className="w-4 h-4 text-blue-400" />}
                          {link.icon === 'globe' && <Globe className="w-4 h-4 text-emerald-400" />}
                          {link.icon === 'file-text' && <FileText className="w-4 h-4 text-purple-400" />}
                          {link.icon === 'download' && <Download className="w-4 h-4 text-amber-400" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                              {link.label}
                            </h4>
                            <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-purple-400 transition-colors" />
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                            {link.description}
                          </p>
                          <span className="text-[10px] font-mono text-zinc-500 truncate block mt-1">
                            {link.url}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Bar */}
            <div className="px-6 py-3 border-t border-white/10 bg-zinc-950 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>InnSpark Solutions Pvt. Ltd. // 3.6 Years Verified Experience</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-zinc-500">Press [ESC] to return to 3D City</span>
                <button
                  onClick={onClose}
                  className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

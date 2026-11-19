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
  Terminal,
  Database,
  Cloud,
  Eye,
  GitBranch,
  ExternalLink,
} from 'lucide-react';
import { SKILLS_TOWER_METADATA, SkillFloorData } from '@/world/buildings/skills/skillsMetadata';
import { worldStore } from '@/world/stores/worldStore';

interface SkillsBuildingOverlayProps {
  isOpen: boolean;
  initialFloor?: number | string | null;
  onSelectFloor3D?: (floorIndex: number) => void;
  onClose: () => void;
}

export const SkillsBuildingOverlay: React.FC<SkillsBuildingOverlayProps> = ({
  isOpen,
  initialFloor = null,
  onSelectFloor3D,
  onClose,
}) => {
  const [selectedFloor, setSelectedFloor] = useState<number | string | 'all'>('all');
  const [selectedSkillName, setSelectedSkillName] = useState<string | null>(null);

  useEffect(() => {
    if (initialFloor !== null && initialFloor !== undefined) {
      setSelectedFloor(initialFloor);
    } else {
      setSelectedFloor('all');
    }
    setSelectedSkillName(null);
  }, [isOpen, initialFloor]);

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

  const activeFloors: SkillFloorData[] = selectedFloor === 'all'
    ? SKILLS_TOWER_METADATA.floors
    : SKILLS_TOWER_METADATA.floors.filter(
        (f) => f.floorNumber === selectedFloor || f.floorIndex === selectedFloor
      );

  const allSkills = activeFloors.flatMap((f) =>
    f.skills.map((s) => ({
      ...s,
      floorNumber: f.floorNumber,
      floorIndex: f.floorIndex,
      department: f.department,
      category: f.category,
      themeColor: f.themeColor,
      technologies: f.technologies,
    }))
  );

  const activeSkillDetail = allSkills.find((s) => s.name === selectedSkillName) || allSkills[0];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'FRONTEND':
        return <Code2 className="w-3.5 h-3.5 text-cyan-400" />;
      case 'MOBILE':
        return <Smartphone className="w-3.5 h-3.5 text-emerald-400" />;
      case 'BACKEND':
        return <Server className="w-3.5 h-3.5 text-indigo-400" />;
      case 'FULL STACK':
        return <Layers className="w-3.5 h-3.5 text-purple-400" />;
      case 'LANGUAGES':
        return <Terminal className="w-3.5 h-3.5 text-amber-400" />;
      case 'DATA & APIS':
        return <Database className="w-3.5 h-3.5 text-teal-400" />;
      case 'DEVOPS & TOOLS':
        return <GitBranch className="w-3.5 h-3.5 text-pink-400" />;
      case 'AI & EMERGING TECH':
        return <Cpu className="w-3.5 h-3.5 text-violet-400" />;
      case 'OBSERVATORY':
        return <Eye className="w-3.5 h-3.5 text-orange-400" />;
      default:
        return <Wrench className="w-3.5 h-3.5 text-sky-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md font-mono pointer-events-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[92vh] rounded-3xl bg-slate-950/95 border border-cyan-500/30 p-5 sm:p-7 shadow-[0_0_80px_rgba(6,182,212,0.22)] text-white overflow-hidden flex flex-col"
          >
            {/* Ambient Cyan & Bronze Glowing Flares */}
            <div className="absolute -top-28 -right-28 w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-28 -left-28 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

            {/* Header with Title & Close Button */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 shrink-0">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs tracking-wider uppercase font-semibold">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SKILLS & TECHNOLOGY TOWER // 10 FLOORS</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>Skills & Technology Matrix</span>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </h2>
                <p className="text-xs text-zinc-400">
                  Full Stack • Mobile • Cloud • AI — Categorized across 10 interactive tower floors
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

            {/* Interactive 10-Floor Directory Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 pt-3 pb-3 border-b border-white/5 shrink-0 text-xs font-mono overflow-x-auto">
              <button
                onClick={() => {
                  setSelectedFloor('all');
                  setSelectedSkillName(null);
                  if (onSelectFloor3D) onSelectFloor3D(-1);
                }}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  selectedFloor === 'all'
                    ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-300 font-bold shadow-lg shadow-cyan-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-transparent'
                }`}
              >
                <span>ALL FLOORS</span>
              </button>

              {SKILLS_TOWER_METADATA.floors.map((fl) => (
                <button
                  key={`tab-${fl.floorIndex}`}
                  onClick={() => {
                    setSelectedFloor(fl.floorNumber);
                    setSelectedSkillName(fl.skills[0]?.name || null);
                    if (onSelectFloor3D) onSelectFloor3D(fl.floorIndex);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    selectedFloor === fl.floorNumber
                      ? 'border font-bold shadow-lg'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border-transparent'
                  }`}
                  style={{
                    backgroundColor: selectedFloor === fl.floorNumber ? `${fl.themeColor}25` : undefined,
                    borderColor: selectedFloor === fl.floorNumber ? fl.themeColor : undefined,
                    color: selectedFloor === fl.floorNumber ? '#ffffff' : undefined,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: fl.themeColor }}
                  />
                  <span>
                    {fl.floorNumber === 'G'
                      ? 'G: PROFILE'
                      : fl.floorNumber === 'R'
                      ? 'ROOF'
                      : `FL ${fl.floorNumber}: ${fl.department.split(' ')[0].toUpperCase()}`}
                  </span>
                </button>
              ))}
            </div>

            {/* Main Content Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-4 overflow-y-auto flex-1 pr-1">
              {/* Left Column: Skill Matrix Cards (7 Columns) */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                  <span>TECHNICAL PROFICIENCIES ({allSkills.length})</span>
                  <span className="text-[11px] text-zinc-500">Click a skill to view production details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {allSkills.map((skill) => {
                    const isSelected = activeSkillDetail?.name === skill.name;
                    return (
                      <div
                        key={skill.name}
                        onClick={() => setSelectedSkillName(skill.name)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                          isSelected
                            ? 'bg-slate-900/90 border-cyan-400 shadow-lg shadow-cyan-500/10'
                            : 'bg-slate-900/40 hover:bg-slate-900/70 border-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(skill.category)}
                            <span className="text-xs font-bold text-white tracking-wide">
                              {skill.name}
                            </span>
                          </div>
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                            style={{
                              backgroundColor: `${skill.themeColor}20`,
                              color: skill.themeColor,
                            }}
                          >
                            {skill.level}
                          </span>
                        </div>

                        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                          {skill.description}
                        </p>

                        <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-zinc-500">
                          <span className="truncate max-w-[140px]">
                            {skill.projects[0] || 'Core Architecture'}
                          </span>
                          <span className="text-cyan-400/80 font-mono">
                            Floor {skill.floorNumber}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Detailed Spotlight Card (5 Columns) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {activeSkillDetail ? (
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 flex flex-col gap-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(activeSkillDetail.category)}
                        <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                          Floor {activeSkillDetail.floorNumber} • {activeSkillDetail.department}
                        </span>
                      </div>
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: `${activeSkillDetail.themeColor}25`,
                          color: activeSkillDetail.themeColor,
                        }}
                      >
                        {activeSkillDetail.level}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-white">
                        {activeSkillDetail.name}
                      </h3>
                      <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                        {activeSkillDetail.description}
                      </p>
                    </div>

                    {/* Associated Portfolio Projects */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                        Production Deployments & Projects
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeSkillDetail.projects.map((proj) => (
                          <span
                            key={proj}
                            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-200"
                          >
                            {proj}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Department Technologies */}
                    {activeSkillDetail.technologies && (
                      <div className="space-y-1.5 pt-2 border-t border-white/10">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                          Floor Technology Stack
                        </span>
                        <div className="flex flex-wrap gap-1 text-[11px] text-cyan-300">
                          {activeSkillDetail.technologies.join(' • ')}
                        </div>
                      </div>
                    )}

                    {/* Navigation Actions */}
                    <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                      <button
                        onClick={() => {
                          worldStore.getState().setSelectedLandmark('skills');
                          worldStore.getState().setCameraView('orbit', 'skills_front_entrance');
                          onClose();
                        }}
                        className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Focus Skills Tower in 3D City</span>
                      </button>

                      {activeSkillDetail.link && (
                        <a
                          href={activeSkillDetail.link}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs transition-all flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Code on GitHub</span>
                        </a>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

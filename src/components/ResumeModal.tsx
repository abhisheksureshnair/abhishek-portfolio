'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, CheckCircle, ExternalLink, Briefcase, GraduationCap, Award, Mail, Phone, MapPin } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from './Icons';
import { PERSONAL_INFO, PROFESSIONAL_EXPERIENCE, SELECTED_PROJECTS } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = PERSONAL_INFO.resumePath;
    link.setAttribute('download', 'Abhishek_S_Nair_Resume.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col"
        >
          {/* Top Header */}
          <div className="p-6 sm:p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80 sticky top-0 z-20 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Curriculum Vitae</h2>
                <p className="text-xs font-mono text-zinc-400">Abhishek S Nair — Full-Stack Developer</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/30"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Resume Body Document */}
          <div className="p-6 sm:p-10 overflow-y-auto space-y-10 flex-1 font-sans">
            
            {/* Header Document Bio with Profile Photo */}
            <div className="border-b border-zinc-800 pb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">ABHISHEK S NAIR</h1>
                <p className="text-base font-semibold text-indigo-400 mt-1">
                  Full Stack React Developer | MERN | React Native | Node.js | MongoDB | Flutter
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-mono text-zinc-400">
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-400" /> {PERSONAL_INFO.email}</span>
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-indigo-400" /> {PERSONAL_INFO.phone}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> India</span>
                  <span className="flex items-center gap-1.5"><GithubIcon className="w-3.5 h-3.5 text-indigo-400" /> github.com/abhisheksureshnair</span>
                  <span className="flex items-center gap-1.5"><LinkedinIcon className="w-3.5 h-3.5 text-indigo-400" /> linkedin.com/in/abhisheksnair</span>
                </div>
              </div>

              {/* Headshot Thumbnail */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-indigo-500/40 shadow-xl flex-shrink-0 bg-zinc-950">
                <Image
                  src="/avatar.webp"
                  alt="Abhishek S Nair"
                  width={192}
                  height={192}
                  sizes="(max-width: 640px) 80px, 96px"
                  quality={95}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Professional Summary */}
            <div>
              <h3 className="text-xs font-mono uppercase text-indigo-400 tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Professional Summary
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                Full-Stack Software Developer with 3+ years of experience engineering production software across web, cross-platform mobile (React Native & Flutter), backend (Node.js/Express & FastAPI), real-time WebSockets telemetry, and generative AI (NVIDIA NIM APIs). Proven track record of delivering 5+ production mobile applications to app stores and architecting scalable full-stack products.
              </p>
            </div>

            {/* Professional Experience */}
            <div>
              <h3 className="text-xs font-mono uppercase text-indigo-400 tracking-wider mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Professional Experience
              </h3>
              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h4 className="text-base font-bold text-white">{PROFESSIONAL_EXPERIENCE.role}</h4>
                    <p className="text-xs font-semibold text-indigo-400">{PROFESSIONAL_EXPERIENCE.company}</p>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">{PROFESSIONAL_EXPERIENCE.period}</span>
                </div>
                <ul className="space-y-2 text-xs text-zinc-300 font-light list-disc list-inside">
                  {PROFESSIONAL_EXPERIENCE.achievements.map((ach, i) => (
                    <li key={i}>{ach}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Commercial Projects Showcase */}
            <div>
              <h3 className="text-xs font-mono uppercase text-indigo-400 tracking-wider mb-4">
                Commercial Work Delivered at InnSpark Solutions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PROFESSIONAL_EXPERIENCE.projects.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                    <h5 className="text-xs font-bold text-white mb-1">{p.title}</h5>
                    <span className="text-[10px] font-mono text-emerald-400 block mb-2">{p.domain}</span>
                    <p className="text-[11px] text-zinc-400 font-light leading-relaxed">{p.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Flagship Projects */}
            <div>
              <h3 className="text-xs font-mono uppercase text-indigo-400 tracking-wider mb-4">
                Personal Software Projects & Systems
              </h3>
              <div className="space-y-4">
                {SELECTED_PROJECTS.slice(0, 4).map((proj) => (
                  <div key={proj.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-xs font-bold text-white">{proj.title}</h5>
                      <span className="text-[10px] font-mono text-indigo-400">{proj.category}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-light mb-2">{proj.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {proj.stack.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-zinc-950 text-[10px] font-mono text-zinc-400">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Skills Summary */}
            <div>
              <h3 className="text-xs font-mono uppercase text-indigo-400 tracking-wider mb-3">
                Core Competencies & Toolset
              </h3>
              <p className="text-xs text-zinc-300 font-mono leading-relaxed">
                React, JavaScript (ES6+), React Native, Flutter, Dart, Node.js, Express.js, MongoDB, Mongoose, Socket.IO, WebSockets, REST APIs, FastAPI (Python), NVIDIA NIM AI, Electron, Bluetooth BLE, GPS, Geofencing, Tailwind CSS, GSAP, Git.
              </p>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-500">Verified Resume Document</span>
            <button
              onClick={handleDownload}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF File</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { CustomCursor } from '@/components/CustomCursor';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { SelectedWorkSection } from '@/components/SelectedWorkSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { WhatIBuildSection } from '@/components/WhatIBuildSection';
import { TechnicalToolboxSection } from '@/components/TechnicalToolboxSection';
import { CertificationsSection } from '@/components/CertificationsSection';
import { GithubSection } from '@/components/GithubSection';
import { AboutSection } from '@/components/AboutSection';
import { ContactSection } from '@/components/ContactSection';
import { FlowSyncModal } from '@/components/FlowSyncModal';
import { ResumeModal } from '@/components/ResumeModal';
import { CommandK } from '@/components/CommandK';

export default function Home() {
  const [isFlowSyncOpen, setIsFlowSyncOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isCommandKOpen, setIsCommandKOpen] = useState(false);

  useEffect(() => {
    // Keyboard shortcut for Cmd+K / Ctrl+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandKOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main className="min-h-screen bg-[#070709] text-[#f4f4f5] relative selection:bg-indigo-500/30 selection:text-white">
      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Glassmorphism Navigation Bar */}
      <Navbar
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenCommandK={() => setIsCommandKOpen(true)}
      />

      {/* 1. HERO */}
      <HeroSection />

      {/* 2. SELECTED WORK (FLAGSHIP PROJECTS) */}
      <SelectedWorkSection
        onOpenFlowSyncCaseStudy={() => setIsFlowSyncOpen(true)}
      />

      {/* 3. PROFESSIONAL EXPERIENCE (INNSPARK SOLUTIONS) */}
      <ExperienceSection />

      {/* 4. WHAT I BUILD */}
      <WhatIBuildSection />

      {/* 5. TECHNICAL TOOLBOX */}
      <TechnicalToolboxSection />

      {/* 6. CERTIFICATIONS */}
      <CertificationsSection />

      {/* 7. GITHUB ACTIVITY */}
      <GithubSection />

      {/* 8. ABOUT */}
      <AboutSection />

      {/* 9. CONTACT */}
      <ContactSection />

      {/* Flagship FlowSync Case Study Modal */}
      <FlowSyncModal
        isOpen={isFlowSyncOpen}
        onClose={() => setIsFlowSyncOpen(false)}
      />

      {/* Resume Viewer & PDF Download Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {/* Recruiter Command Palette (Ctrl+K) */}
      <CommandK
        isOpen={isCommandKOpen}
        onClose={() => setIsCommandKOpen(false)}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenFlowSyncCaseStudy={() => setIsFlowSyncOpen(true)}
      />
    </main>
  );
}

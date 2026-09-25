'use client';

import React, { useState, useEffect } from 'react';
import { SmoothScroll } from '@/components/SmoothScroll';
import { CinematicLoader } from '@/components/CinematicLoader';
import { CustomCursor } from '@/components/CustomCursor';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { FeaturedProjectsSection } from '@/components/FeaturedProjectsSection';
import { TechnologyUniverse } from '@/components/TechnologyUniverse';
import { BuildingWithAISection } from '@/components/BuildingWithAISection';
import { JourneyEducationSection } from '@/components/JourneyEducationSection';
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
    <SmoothScroll>
      <main className="min-h-screen bg-[#030508] text-[#f8fafc] relative selection:bg-indigo-500/30 selection:text-white">
        
        {/* Cinematic Intro Loader */}
        <CinematicLoader />

        {/* Desktop Custom Cursor with Ambient Light */}
        <CustomCursor />

        {/* Glassmorphic Navigation with Scroll Progress */}
        <Navbar
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenCommandK={() => setIsCommandKOpen(true)}
        />

        {/* 1. HERO SECTION */}
        <HeroSection onOpenResume={() => setIsResumeOpen(true)} />

        {/* 2. ABOUT SECTION (Scroll-driven Progressive Reveal) */}
        <AboutSection />

        {/* 3. PROFESSIONAL EXPERIENCE TIMELINE (InnSpark Solutions) */}
        <ExperienceSection />

        {/* 4. FEATURED PROJECTS SHOWCASE (Personal Flagships + Commercial Deliveries) */}
        <FeaturedProjectsSection
          onOpenFlowSyncCaseStudy={() => setIsFlowSyncOpen(true)}
        />

        {/* 5. TECHNOLOGY UNIVERSE (Interactive Ecosystem) */}
        <TechnologyUniverse />

        {/* 6. BUILDING WITH AI (NVIDIA NIM, LLMs, Agents) */}
        <BuildingWithAISection />

        {/* 7. DEVELOPER JOURNEY, EDUCATION & CERTIFICATIONS */}
        <JourneyEducationSection />

        {/* 8. CONTACT SECTION & MONOGRAM SIGN-OFF */}
        <ContactSection onOpenResume={() => setIsResumeOpen(true)} />

        {/* Modals & Dialogs */}
        <FlowSyncModal
          isOpen={isFlowSyncOpen}
          onClose={() => setIsFlowSyncOpen(false)}
        />

        <ResumeModal
          isOpen={isResumeOpen}
          onClose={() => setIsResumeOpen(false)}
        />

        <CommandK
          isOpen={isCommandKOpen}
          onClose={() => setIsCommandKOpen(false)}
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenFlowSyncCaseStudy={() => setIsFlowSyncOpen(true)}
        />

      </main>
    </SmoothScroll>
  );
}

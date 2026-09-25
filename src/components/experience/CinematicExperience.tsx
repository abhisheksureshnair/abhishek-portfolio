'use client';

import React, { useState } from 'react';
import { SmoothScroll } from '@/components/SmoothScroll';
import { ExperienceModeProvider } from './ExperienceModeContext';
import { ExperienceSoundProvider } from './ExperienceSound';
import { ExperienceNavbar } from './ExperienceNavbar';
import { ExperienceScrollyCanvas } from './ExperienceScrollyCanvas';
import { ExperienceOverlay } from './ExperienceOverlay';
import { ExperienceProjects } from './ExperienceProjects';
import { ExperienceTelemetrySlider } from './ExperienceTelemetrySlider';
import { ExperienceTerminal } from './ExperienceTerminal';
import { ExperienceCapabilities } from './ExperienceCapabilities';
import { ExperienceTimeline } from './ExperienceTimeline';
import { ExperienceContact } from './ExperienceContact';
import { ExperienceFooter } from './ExperienceFooter';

export const CinematicExperience: React.FC = () => {
  return (
    <SmoothScroll>
      <ExperienceModeProvider>
        <ExperienceSoundProvider>
          <div className="relative min-h-screen bg-[#050505] text-[#f5f5f5] selection:bg-amber-500 selection:text-black">
            {/* Navigation Header */}
            <ExperienceNavbar />

            {/* 3D Scrollytelling Canvas Universe */}
            <ExperienceScrollyCanvas>
              <ExperienceOverlay />
            </ExperienceScrollyCanvas>

            {/* Verified Productions: Professional vs Personal */}
            <ExperienceProjects />

            {/* Signature Telemetry Comparison Slider */}
            <ExperienceTelemetrySlider />

            {/* Signature Interactive Developer Terminal */}
            <ExperienceTerminal />

            {/* Engineering Capabilities Matrix */}
            <ExperienceCapabilities />

            {/* Verified Experience Timeline & Education */}
            <ExperienceTimeline />

            {/* Contact Abhishek */}
            <ExperienceContact />

            {/* 3D Universe Footer */}
            <ExperienceFooter />
          </div>
        </ExperienceSoundProvider>
      </ExperienceModeProvider>
    </SmoothScroll>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { WorldScene } from '@/components/three-world/WorldScene';

export const CinematicExperience: React.FC = () => {
  const searchParams = useSearchParams();
  const initialViewParam = searchParams?.get('view') || searchParams?.get('mode');
  const [currentView, setCurrentView] = useState<'story' | 'world'>(
    initialViewParam === 'world' ? 'world' : 'story'
  );

  useEffect(() => {
    if (initialViewParam === 'world') {
      setCurrentView('world');
    }
  }, [initialViewParam]);

  return (
    <ExperienceModeProvider>
      <ExperienceSoundProvider>
        {currentView === 'world' ? (
          // 3D OPEN WORLD DEVELOPER UNIVERSE
          <div className="relative w-full h-screen bg-[#030509]">
            <WorldScene />
          </div>
        ) : (
          // CINEMATIC SCROLLYTELLING STORY EXPERIENCE
          <SmoothScroll>
            <div className="relative min-h-screen bg-[#050505] text-[#f5f5f5] selection:bg-amber-500 selection:text-black">
              {/* Navigation Header with View Switcher */}
              <ExperienceNavbar
                currentView={currentView}
                onToggleView={setCurrentView}
              />

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
          </SmoothScroll>
        )}
      </ExperienceSoundProvider>
    </ExperienceModeProvider>
  );
};

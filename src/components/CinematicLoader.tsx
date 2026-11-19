'use client';

import React from 'react';
import { WebsiteAssemblyIntro } from './intro/WebsiteAssemblyIntro';

interface CinematicLoaderProps {
  onLoaded?: () => void;
  forcePlay?: boolean;
}

export const CinematicLoader: React.FC<CinematicLoaderProps> = ({ onLoaded, forcePlay = false }) => {
  return <WebsiteAssemblyIntro onComplete={onLoaded} forcePlay={forcePlay} />;
};

'use client';

import React, { createContext, useContext, useState } from 'react';
import { ExperienceMode } from './ExperienceData';

interface ExperienceModeContextType {
  mode: ExperienceMode;
  setMode: (mode: ExperienceMode) => void;
  accentColor: string;
}

const ExperienceModeContext = createContext<ExperienceModeContextType>({
  mode: 'dual',
  setMode: () => {},
  accentColor: '#ff4d00',
});

export const useExperienceMode = () => useContext(ExperienceModeContext);

export const ExperienceModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ExperienceMode>('dual');

  const accentColor =
    mode === 'mobile'
      ? '#ff4d00' // High-energy Amber Flame
      : mode === 'fullstack'
      ? '#00e5ff' // Electric Cyber Cyan
      : '#ff8c00'; // Dual Fusion Gold

  return (
    <ExperienceModeContext.Provider value={{ mode, setMode, accentColor }}>
      {children}
    </ExperienceModeContext.Provider>
  );
};

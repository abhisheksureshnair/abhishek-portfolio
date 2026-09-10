'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Target, Trophy } from 'lucide-react';

export interface Mission {
  id: string;
  title: string;
  targetLocationId: string;
  locationName: string;
  completed: boolean;
}

interface MissionSystemProps {
  missions: Mission[];
  latestDiscoveryNotification: string | null;
  onClearNotification: () => void;
}

export const MissionSystem: React.FC<MissionSystemProps> = ({
  missions,
  latestDiscoveryNotification,
  onClearNotification,
}) => {
  const currentMission = missions.find((m) => !m.completed) || missions[missions.length - 1];

  return (
    <div className="pointer-events-none fixed top-20 left-4 sm:left-6 z-30 font-mono">
      
      {/* Discovery Banner Toast Notification */}
      <AnimatePresence>
        {latestDiscoveryNotification && (
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.9 }}
            onAnimationComplete={() => {
              setTimeout(onClearNotification, 3500);
            }}
            className="pointer-events-auto mb-4 p-4 rounded-2xl bg-emerald-950/90 border-2 border-emerald-500 text-white backdrop-blur-xl shadow-2xl flex items-center gap-3 max-w-sm"
          >
            <Trophy className="w-5 h-5 text-emerald-400 flex-shrink-0 animate-bounce" />
            <div>
              <div className="text-[10px] text-emerald-400 uppercase font-extrabold tracking-widest">
                MISSION ACCOMPLISHED
              </div>
              <div className="text-xs font-bold text-white">
                ✓ {latestDiscoveryNotification}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Objective Box */}
      <div className="pointer-events-auto p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 backdrop-blur-md shadow-xl max-w-xs space-y-2">
        <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
          <Target className="w-3.5 h-3.5 text-indigo-400" />
          <span>CURRENT OBJECTIVE</span>
        </div>

        {currentMission && (
          <div>
            <div className="text-xs font-bold text-white">
              {currentMission.title}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              → Navigate to <span className="text-indigo-300 font-semibold">{currentMission.locationName}</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

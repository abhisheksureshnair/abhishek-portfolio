'use client';

import React from 'react';
import { Navigation, MapPin, Check } from 'lucide-react';

export interface LocationMarker {
  id: string;
  name: string;
  category: string;
  x: number; // Normalized x coords (-1 to 1)
  z: number; // Normalized z coords (-1 to 1)
  discovered: boolean;
}

interface MiniMapProps {
  playerPos: { x: number; z: number };
  locations: LocationMarker[];
  onSelectLocation: (locationId: string) => void;
}

export const MiniMap: React.FC<MiniMapProps> = ({
  playerPos,
  locations,
  onSelectLocation,
}) => {
  return (
    <div className="pointer-events-auto fixed bottom-16 right-6 z-40 hidden md:block">
      <div className="w-52 h-52 bg-zinc-950/90 border-2 border-zinc-800 rounded-3xl p-3 backdrop-blur-xl shadow-2xl flex flex-col justify-between relative overflow-hidden">
        
        {/* Radar Header */}
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 z-10 border-b border-zinc-800/80 pb-1.5">
          <span className="flex items-center gap-1 text-indigo-400 font-bold">
            <Navigation className="w-3 h-3 animate-spin" /> RADAR NAV
          </span>
          <span className="text-zinc-500">CITY GRID</span>
        </div>

        {/* Map Grid Viewport */}
        <div className="relative flex-1 my-1 rounded-2xl bg-zinc-900/80 border border-zinc-800/60 overflow-hidden bg-grid-pattern">
          
          {/* Player Pulse Marker */}
          <div
            className="absolute w-3.5 h-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500 border-2 border-white shadow-lg shadow-indigo-500/80 transition-all duration-150 z-30"
            style={{
              left: `${((playerPos.x + 40) / 80) * 100}%`,
              top: `${((playerPos.z + 40) / 80) * 100}%`,
            }}
            title="Your Position"
          />

          {/* Location Waypoints */}
          {locations.map((loc) => {
            const leftPercent = ((loc.x + 40) / 80) * 100;
            const topPercent = ((loc.z + 40) / 80) * 100;

            return (
              <button
                key={loc.id}
                onClick={() => onSelectLocation(loc.id)}
                className={`absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-150 z-20 ${
                  loc.discovered
                    ? 'bg-emerald-400 border border-white shadow-sm shadow-emerald-400'
                    : 'bg-indigo-400/80 border border-zinc-700'
                }`}
                style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                title={`${loc.name} (${loc.category}) - Click to Navigate`}
              />
            );
          })}
        </div>

        {/* Map Legend */}
        <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 z-10 pt-1 border-t border-zinc-800/80">
          <span className="text-indigo-400">● Player</span>
          <span className="text-emerald-400">● Discovered</span>
          <span className="text-zinc-400">Click to Fly</span>
        </div>

      </div>
    </div>
  );
};

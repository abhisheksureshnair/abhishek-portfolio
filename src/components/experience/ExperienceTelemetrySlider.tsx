'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Sliders, Activity, ShieldAlert, CheckCircle2, Satellite } from 'lucide-react';
import { EXPERIENCE_DATA } from './ExperienceData';

export const ExperienceTelemetrySlider: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <section
      id="telemetry"
      className="relative z-20 bg-[#050505] px-6 py-20 sm:px-12 md:px-20 lg:px-28 border-t border-white/10 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-12 space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-amber-400 backdrop-blur-md">
            <Satellite className="h-3.5 w-3.5" />
            <span>Hardware Telemetry &amp; Spatial Processing</span>
          </div>

          <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
            Real-Time Telemetry <span className="text-amber-400">Pipeline.</span>
          </h3>

          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            {EXPERIENCE_DATA.telemetryDemo.description}
          </p>
        </div>

        {/* Comparison Frame Container */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          className="relative h-[360px] sm:h-[460px] w-full overflow-hidden rounded-2xl border border-white/15 bg-black shadow-[0_0_50px_rgba(245,158,11,0.15)] cursor-ew-resize select-none"
        >
          {/* Layer 1: Processed Visualized Dashboard (Full Width) */}
          <div className="absolute inset-0 bg-[#080c10] p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-sm font-mono font-bold text-white tracking-wider">
                  INNSPARK FLEET &amp; IOT ENGINE: ONLINE
                </span>
              </div>
              <div className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-400">
                ✓ {EXPERIENCE_DATA.telemetryDemo.afterLabel}
              </div>
            </div>

            {/* Dashboard Visualization Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-auto">
              <div className="rounded-xl border border-cyan-500/30 bg-neutral-950/80 p-4 space-y-2">
                <div className="text-[11px] font-mono text-neutral-400">GPS TELEMETRY</div>
                <div className="text-2xl font-black font-mono text-cyan-400">12.9716° N</div>
                <div className="text-xs font-mono text-neutral-300">77.5946° E • Speed: 62 km/h</div>
                <div className="text-[10px] text-emerald-400 font-mono">GEOFENCE ZONE: SECURED [PASS]</div>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-neutral-950/80 p-4 space-y-2">
                <div className="text-[11px] font-mono text-neutral-400">BLE MEDICAL VITALS</div>
                <div className="text-2xl font-black font-mono text-amber-400">SpO2: 99%</div>
                <div className="text-xs font-mono text-neutral-300">Pulse: 74 BPM • ECG: Normal</div>
                <div className="text-[10px] text-amber-400 font-mono">GATT CHAR: 0x2A37 NOTIFY</div>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-neutral-950/80 p-4 space-y-2">
                <div className="text-[11px] font-mono text-neutral-400">WEBSOCKET LATENCY</div>
                <div className="text-2xl font-black font-mono text-emerald-400">24 ms</div>
                <div className="text-xs font-mono text-neutral-300">Loss: 0.00% • Buffer: Healthy</div>
                <div className="text-[10px] text-emerald-400 font-mono">PROTOCOL: TLS WSS/2.0</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-white/10 pt-3">
              <span>ACTIVE CLUSTERS: 128 UNITS</span>
              <span className="text-emerald-400 font-semibold">ALL GEOFENCE PARSING VERIFIED</span>
            </div>
          </div>

          {/* Layer 2: Raw Packet Telemetry Stream (Clipped to slider position) */}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden bg-[#0d0705] border-r border-amber-500/80"
            style={{ width: `${sliderPos}%` }}
          >
            <div
              className="relative h-full w-full p-6 sm:p-8 flex flex-col justify-between font-mono"
              style={{ width: containerRef.current?.clientWidth || '100%' }}
            >
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-amber-500 animate-pulse" />
                  <span className="text-sm font-bold text-amber-400 tracking-wider">
                    RAW HARDWARE TELEMETRY STREAM
                  </span>
                </div>
                <div className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
                  ⚡ {EXPERIENCE_DATA.telemetryDemo.beforeLabel}
                </div>
              </div>

              {/* Raw Packet Stream Snippets */}
              <div className="text-xs space-y-2 text-neutral-400 my-auto bg-black/60 p-4 rounded-xl border border-white/5 overflow-x-auto">
                <div className="text-amber-500/90 font-bold">$GPRMC,123519,A,1258.2916,N,07735.6789,E,022.4,084.4,240926,003.1,W*6A</div>
                <div className="text-cyan-400/90 font-mono">BLE_PACKET: [0x02, 0x1A, 0xFF, 0x06, 0x00, 0x01, 0x09, 0x20, 0x63, 0x4A, 0x00, 0x14]</div>
                <div className="text-emerald-400/90 font-mono">GATT_NOTIFY: Handle 0x0018 UUID &lt;00002a37-0000-1000-8000-00805f9b34fb&gt; Value: 16 4A 00 99</div>
                <div className="text-neutral-500 text-[11px]">&gt; NMEA CSUM OK • RAW UART RX BAUD: 115200 • MTU: 512 BYTES</div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-500 border-t border-amber-500/20 pt-3">
                <span>BUFFER: 4096 BYTES</span>
                <span className="text-amber-400 font-semibold">UNPARSED HARDWARE BYTES</span>
              </div>
            </div>
          </div>

          {/* Draggable Divider Line */}
          <div
            className="absolute inset-y-0 w-0.5 bg-gradient-to-b from-transparent via-amber-400 to-transparent"
            style={{ left: `${sliderPos}%` }}
          >
            {/* Handle Grip Pill */}
            <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-neutral-900/95 shadow-[0_0_20px_#f59e0b] backdrop-blur-md text-white">
              <Sliders className="h-4 w-4 text-amber-400 rotate-90" />
            </div>
          </div>

          {/* Bottom HUD prompt */}
          <div className="absolute bottom-3 inset-x-4 flex items-center justify-between pointer-events-none text-[11px] font-mono text-neutral-400">
            <span className="hidden sm:inline bg-black/70 px-2.5 py-1 rounded backdrop-blur-sm border border-white/10">
              DRAG SLIDER TO INSPECT PIPELINE
            </span>
            <span className="bg-black/70 px-2.5 py-1 rounded backdrop-blur-sm border border-white/10 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Raw Bytes ➔ Real-Time GeoJSON &amp; Vitals Dashboard
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

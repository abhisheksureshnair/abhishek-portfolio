'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Sparkles, Terminal, ShieldCheck, Cpu } from 'lucide-react';

interface InteractivePortraitProps {
  variant?: 'hero' | 'about' | 'compact' | 'cinematic';
  className?: string;
  showBadges?: boolean;
}

export const InteractivePortrait: React.FC<InteractivePortraitProps> = ({
  variant = 'hero',
  className = '',
  showBadges = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Raw mouse coordinates relative to card center (-1 to 1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for silky physics-based tilt and spring-back
  const springConfig = { damping: 20, stiffness: 180, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Dynamic transforms based on variant
  const maxTilt = variant === 'hero' ? 14 : variant === 'cinematic' ? 12 : 9;

  const rotateX = useTransform(smoothY, [-1, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [-1, 1], [-maxTilt, maxTilt]);

  // Layered parallax translations
  const bgTranslateX = useTransform(smoothX, [-1, 1], [-18, 18]);
  const bgTranslateY = useTransform(smoothY, [-1, 1], [-18, 18]);

  const midTranslateX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const midTranslateY = useTransform(smoothY, [-1, 1], [-10, 10]);

  const fgTranslateX = useTransform(smoothX, [-1, 1], [14, -14]);
  const fgTranslateY = useTransform(smoothY, [-1, 1], [14, -14]);

  // Dynamic specular lighting coordinates
  const lightX = useTransform(smoothX, [-1, 1], ['20%', '80%']);
  const lightY = useTransform(smoothY, [-1, 1], ['20%', '80%']);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
      setPrefersReducedMotion(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
    const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));

    mouseX.set(normX);
    mouseY.set(normY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smoothly return to center
    mouseX.set(0);
    mouseY.set(0);
  };

  // Dimensions per variant
  const sizeClasses = {
    hero: 'w-[320px] sm:w-[380px] md:w-[420px] aspect-[4/5]',
    about: 'w-[280px] sm:w-[340px] aspect-[4/5]',
    compact: 'w-[220px] sm:w-[260px] aspect-[4/5]',
    cinematic: 'w-[300px] sm:w-[360px] md:w-[400px] aspect-[4/5]',
  }[variant];

  return (
    <div
      className={`relative select-none perspective-[1200px] flex items-center justify-center ${className}`}
      style={{ perspective: 1200 }}
    >
      {/* Outer ambient glow reacting to position */}
      <motion.div
        className="absolute -inset-6 rounded-[36px] bg-gradient-to-tr from-indigo-600/30 via-cyan-500/20 to-purple-600/30 blur-2xl pointer-events-none transition-opacity duration-700"
        style={{
          opacity: isHovered ? 0.9 : 0.45,
          x: bgTranslateX,
          y: bgTranslateY,
        }}
      />

      {/* Main 3D Tilted Card Body */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                y: [0, -8, 0],
                transition: {
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }
        }
        className={`relative ${sizeClasses} rounded-[28px] p-2 bg-gradient-to-b from-white/15 via-white/5 to-black/80 border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.85)] cursor-pointer group`}
        data-cursor="view"
      >
        {/* Layer 1: Inner Chassis with Cyber Grid Background */}
        <motion.div
          className="relative w-full h-full rounded-[22px] overflow-hidden bg-gradient-to-b from-[#0a0f1d] via-[#050811] to-[#020307]"
          style={{ transform: 'translateZ(10px)' }}
        >
          {/* Cybernetic grid lines in deep background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b22_1px,transparent_1px),linear-gradient(to_bottom,#1e293b22_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />

          {/* Layer 2: Decorative 3D geometric background rings */}
          <motion.div
            style={{
              x: bgTranslateX,
              y: bgTranslateY,
              transform: 'translateZ(15px)',
            }}
            className="absolute top-1/4 -right-12 w-48 h-48 rounded-full border border-cyan-500/20 pointer-events-none"
          />
          <motion.div
            style={{
              x: bgTranslateX,
              y: bgTranslateY,
              transform: 'translateZ(20px)',
            }}
            className="absolute -bottom-8 -left-8 w-56 h-56 rounded-full border border-indigo-500/25 pointer-events-none"
          />

          {/* Layer 3: Portrait Glow Behind Subject */}
          <motion.div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-b from-indigo-500/25 to-cyan-500/15 blur-3xl pointer-events-none"
            style={{
              x: midTranslateX,
              y: midTranslateY,
              transform: 'translateZ(25px)',
            }}
          />

          {/* Layer 4: Real Authentic Portrait Asset (No warping, authentic identity preserved) */}
          <motion.div
            className="relative w-full h-full flex items-end justify-center overflow-hidden"
            style={{
              transform: 'translateZ(35px)',
            }}
          >
            <Image
              src="/profile.webp"
              alt="Abhishek S Nair - Software Developer"
              fill
              sizes="(max-width: 768px) 320px, 420px"
              priority
              quality={95}
              className="object-cover object-top scale-105 group-hover:scale-108 transition-transform duration-700 ease-out"
            />

            {/* Depth Gradient Mask at Bottom */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020307] via-[#020307]/80 to-transparent pointer-events-none" />
          </motion.div>

          {/* Layer 5: Dynamic Specular Highlight Following Cursor */}
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 320px at ${lightX} ${lightY}, rgba(255, 255, 255, 0.4), transparent 70%)`,
              opacity: isHovered ? 1 : 0.2,
              transform: 'translateZ(45px)',
            }}
          />

          {/* Layer 6: Futuristic HUD Brackets and Corner Accents */}
          <div className="absolute inset-3 pointer-events-none flex flex-col justify-between" style={{ transform: 'translateZ(50px)' }}>
            <div className="flex items-center justify-between">
              {/* Top Left Bracket */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 border border-white/10 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[9px] font-mono tracking-widest text-cyan-300 uppercase">SYS // ONLINE</span>
              </div>
              {/* Top Right Coordinate Tag */}
              <div className="text-[9px] font-mono text-zinc-500 bg-black/60 px-2 py-0.5 rounded border border-white/5">
                ASN // 01
              </div>
            </div>

            <div className="flex items-end justify-between">
              {/* Bottom Left Status */}
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-zinc-400 tracking-wider">ABHISHEK S NAIR</span>
                <span className="text-[8px] font-mono text-cyan-400">SOFTWARE DEVELOPER</span>
              </div>
              {/* Bottom Right Corner Marker */}
              <div className="w-4 h-4 border-r-2 border-b-2 border-indigo-400/80 rounded-br-sm" />
            </div>
          </div>
        </motion.div>

        {/* Floating Holographic Satellite Badges (High Z depth) */}
        {showBadges && (
          <>
            {/* Top Right Floating Pill */}
            <motion.div
              style={{
                x: fgTranslateX,
                y: fgTranslateY,
                transform: 'translateZ(70px)',
              }}
              className="absolute -top-3 -right-3 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-cyan-500/40 shadow-xl shadow-cyan-500/20 backdrop-blur-xl pointer-events-none"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span className="text-[10px] font-mono font-bold text-white tracking-wide">
                WEB • MOBILE • AI
              </span>
            </motion.div>

            {/* Bottom Left Floating Badge */}
            <motion.div
              style={{
                x: fgTranslateX,
                y: fgTranslateY,
                transform: 'translateZ(75px)',
              }}
              className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-950/95 border border-indigo-500/40 shadow-xl shadow-indigo-500/25 backdrop-blur-xl pointer-events-none"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest leading-none">
                  EXPERIENCE
                </span>
                <span className="text-xs font-mono font-black text-indigo-300 leading-tight">
                  3+ YEARS DEV
                </span>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};


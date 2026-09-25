'use client';

import React, { useEffect, useRef, useState, useCallback, createContext, useContext } from 'react';
import { useScroll, useMotionValueEvent, useSpring, MotionValue } from 'framer-motion';

interface ScrollyContextType {
  scrollYProgress: MotionValue<number>;
}

const ScrollyContext = createContext<ScrollyContextType | null>(null);

export const useScrolly = () => {
  const ctx = useContext(ScrollyContext);
  return ctx;
};

interface ScrollyCanvasProps {
  onProgressUpdate?: (progress: number) => void;
  children?: React.ReactNode;
}

export const ExperienceScrollyCanvas: React.FC<ScrollyCanvasProps> = ({
  onProgressUpdate,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const currentProgressRef = useRef<number>(0);

  // Mouse parallax state for realistic 3D depth
  const mousePosRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  // Track scroll with responsive spring physics (optimized for responsiveness & silkiness)
  const { scrollYProgress: rawScrollProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(rawScrollProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.18,
    restDelta: 0.0001,
  });

  // Atmospheric volumetric embers and dust particles
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      color: string;
      phase: number;
    }>
  >([]);

  useEffect(() => {
    particlesRef.current = Array.from({ length: 45 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 2.2 + 0.6,
      speed: Math.random() * 0.0006 + 0.0002,
      opacity: Math.random() * 0.5 + 0.15,
      color: Math.random() > 0.35 ? '#f59e0b' : '#38bdf8',
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  // Preload Abhishek's 100% photorealistic studio portraits
  useEffect(() => {
    const paths = ['/abhishek_cinema_1.jpg', '/abhishek_cinema_2.jpg'];
    imagesRef.current = new Array(paths.length).fill(null);
    let count = 0;

    paths.forEach((p, idx) => {
      const img = new Image();
      img.src = p;
      img.onload = () => {
        imagesRef.current[idx] = img;
        count++;
        if (count >= 1) setIsLoaded(true);
      };
    });

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mousePosRef.current.targetX = nx;
      mousePosRef.current.targetY = ny;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth render loop with realistic 3D camera pan, dolly zoom, and micro-life breathing
  const drawScene = useCallback((progress: number, time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Deep void canvas fill
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, w, h);

    // Smooth mouse interpolation (lerp)
    const m = mousePosRef.current;
    m.x += (m.targetX - m.x) * 0.05;
    m.y += (m.targetY - m.y) * 0.05;

    const imgs = imagesRef.current;
    const img1 = imgs[0];
    const img2 = imgs[1];

    if (img1 && img1.complete && img1.naturalWidth > 0) {
      // Realistic 3D Camera Kinematics based on scroll progress:
      // Stage 1 (0 -> 0.25, Hero): Centered, poised, natural scale.
      // Stage 2 (0.25 -> 0.55, Mobile): Camera dollies gently right (+14% X offset) to frame text on LEFT.
      // Stage 3 (0.55 -> 0.85, Full Stack): Camera transitions to 3/4 angle, dollies left (-14% X offset) to frame text on RIGHT.
      // Stage 4 (0.85 -> 1.0, Climax): Camera smoothly recenters slightly elevated.
      let targetOffsetXRatio = 0;
      let targetOffsetYRatio = 0.02; // slightly framed so face is above center
      let zoom = 1.02;
      let activeImg = img1;
      let img2Alpha = 0;

      if (progress < 0.22) {
        // Hero: Centered
        targetOffsetXRatio = 0;
        targetOffsetYRatio = 0.02;
        zoom = 1.02 + progress * 0.08;
        activeImg = img1;
      } else if (progress < 0.52) {
        // Mobile Section: Camera moves character to the RIGHT (+16%) so text on LEFT has full space
        const t = (progress - 0.22) / 0.3;
        targetOffsetXRatio = 0.16 * Math.sin(t * Math.PI * 0.5);
        targetOffsetYRatio = 0.03;
        zoom = 1.04 + t * 0.04;
        activeImg = img1;
      } else if (progress < 0.82) {
        // Full Stack Section: Camera moves character to the LEFT (-16%) so text on RIGHT has full space
        const t = (progress - 0.52) / 0.3;
        targetOffsetXRatio = 0.16 - t * 0.32; // from +0.16 to -0.16
        targetOffsetYRatio = 0.02;
        zoom = 1.08 + t * 0.03;

        // Smoothly cross-dissolve to the 3/4 angle portrait around midpoint
        if (img2 && img2.complete && img2.naturalWidth > 0) {
          img2Alpha = Math.min(1, Math.max(0, (t - 0.2) / 0.6));
        }
      } else {
        // Climax: Return smoothly to center, scaled slightly back so face is high and clear
        const t = (progress - 0.82) / 0.18;
        targetOffsetXRatio = -0.16 + t * 0.16;
        targetOffsetYRatio = -0.04 * t; // elevates face so it's comfortably above bottom text
        zoom = 1.11 - t * 0.04;
        img2Alpha = Math.max(0, 1 - t * 0.8);
      }

      // Realistic subtle breathing micro-expansion (0.12Hz sine)
      const breathing = Math.sin(time * 0.0012) * 0.004;
      const effectiveZoom = zoom + breathing;

      // Mouse micro-parallax (gentle 15px shift)
      const mouseParallaxX = m.x * 14;
      const mouseParallaxY = m.y * 10;

      const drawPortrait = (img: HTMLImageElement, alpha: number) => {
        const imgW = img.naturalWidth;
        const imgH = img.naturalHeight;
        const imgAspect = imgW / imgH;
        const canvasAspect = w / h;

        let renderW = w;
        let renderH = h;
        if (canvasAspect > imgAspect) {
          renderW = w * effectiveZoom;
          renderH = (w / imgAspect) * effectiveZoom;
        } else {
          renderH = h * effectiveZoom;
          renderW = h * imgAspect * effectiveZoom;
        }

        const baseOffsetX = (w - renderW) / 2 + targetOffsetXRatio * w + mouseParallaxX;
        const baseOffsetY = (h - renderH) / 2 + targetOffsetYRatio * h + mouseParallaxY;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, imgW, imgH, baseOffsetX, baseOffsetY, renderW, renderH);
        ctx.restore();
      };

      // Draw primary portrait
      drawPortrait(activeImg, 1 - img2Alpha);

      // Draw secondary 3/4 turn portrait if blending
      if (img2 && img2Alpha > 0.005) {
        drawPortrait(img2, img2Alpha);
      }
    }

    // Atmospheric volumetric particles drifting at varied depths
    ctx.save();
    particlesRef.current.forEach((p) => {
      p.y -= p.speed;
      if (p.y < 0) p.y = 1;

      // Subtle horizontal float
      const driftX = Math.sin(time * 0.001 + p.phase) * 0.0008;
      p.x += driftX;
      if (p.x < 0) p.x = 1;
      if (p.x > 1) p.x = 0;

      const px = p.x * w + m.x * 20 * (p.size / 2);
      const py = p.y * h + m.y * 15 * (p.size / 2);

      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity * 0.7;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
    });
    ctx.restore();

    // High-end cinematic radial vignette that frames the portrait without darkening the face
    const rad = ctx.createRadialGradient(
      w / 2 + m.x * 20,
      h / 2 + m.y * 15,
      Math.min(w, h) * 0.32,
      w / 2,
      h / 2,
      Math.max(w, h) * 0.76
    );
    rad.addColorStop(0, 'rgba(5, 5, 5, 0)');
    rad.addColorStop(0.55, 'rgba(5, 5, 5, 0.25)');
    rad.addColorStop(0.85, 'rgba(5, 5, 5, 0.85)');
    rad.addColorStop(1, 'rgba(5, 5, 5, 0.98)');

    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, w, h);
  }, []);

  // Responsive canvas sizing with DPI compensation
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
    }

    drawScene(currentProgressRef.current, performance.now());
  }, [drawScene]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    let animId: number;
    const loop = (timestamp: number) => {
      drawScene(currentProgressRef.current, timestamp);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [handleResize, drawScene]);

  // Framer Motion spring updates
  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    currentProgressRef.current = latest;
    onProgressUpdate?.(latest);
  });

  return (
    <div
      ref={containerRef}
      id="scrolly-section"
      className="relative h-[500vh] w-full bg-[#050505]"
    >
      {/* Sticky viewport frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full object-cover"
          style={{
            backgroundColor: '#050505',
            opacity: isLoaded ? 1 : 0.4,
            transition: 'opacity 0.6s ease-out',
          }}
        />

        {/* Ambient bottom amber aura */}
        <div className="pointer-events-none absolute -bottom-32 left-1/2 h-[450px] w-[800px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[140px]" />

        {/* Narrative Parallax Overlay */}
        <ScrollyContext.Provider value={{ scrollYProgress: smoothProgress }}>
          <div className="absolute inset-0 z-10 pointer-events-none select-none">
            {children}
          </div>
        </ScrollyContext.Provider>
      </div>
    </div>
  );
};

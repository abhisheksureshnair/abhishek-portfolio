'use client';

import React, { useRef, useEffect } from 'react';

export const HeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes for neural grid
    const PARTICLE_COUNT = width > 768 ? 65 : 35;
    interface Particle {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      radius: number;
      color: string;
      baseAlpha: number;
    }

    const colors = ['#6366f1', '#38bdf8', '#8b5cf6', '#a5b4fc', '#34d399'];

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: (Math.random() - 0.5) * width * 1.2,
      y: (Math.random() - 0.5) * height * 1.2,
      z: Math.random() * 400 + 50,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      vz: (Math.random() - 0.5) * 0.2,
      radius: Math.random() * 2 + 1.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      baseAlpha: Math.random() * 0.5 + 0.3,
    }));

    // Orbital rings
    const rings = [
      { radius: 160, tiltX: 0.35, tiltY: 0.1, speed: 0.003, angle: 0, color: '#6366f1' },
      { radius: 250, tiltX: -0.4, tiltY: 0.2, speed: -0.002, angle: Math.PI / 3, color: '#38bdf8' },
      { radius: 340, tiltX: 0.25, tiltY: -0.3, speed: 0.0015, angle: Math.PI / 1.5, color: '#8b5cf6' },
    ];

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = (e.clientX - rect.left - width / 2) * 0.05;
      targetMouseY = (e.clientY - rect.top - height / 2) * 0.05;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Performance observer: stop drawing when off-screen
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let time = 0;

    const render = () => {
      if (isVisible) {
        time += 0.012;
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        ctx.clearRect(0, 0, width, height);

        const centerX = width > 1024 ? width * 0.68 : width * 0.5;
        const centerY = height * 0.48;

        // Ambient radial light backdrop
        const grad = ctx.createRadialGradient(
          centerX + mouseX * 2,
          centerY + mouseY * 2,
          10,
          centerX,
          centerY,
          Math.min(width, height) * 0.65
        );
        grad.addColorStop(0, 'rgba(99, 102, 241, 0.14)');
        grad.addColorStop(0.35, 'rgba(56, 189, 248, 0.06)');
        grad.addColorStop(0.7, 'rgba(139, 92, 246, 0.02)');
        grad.addColorStop(1, 'rgba(3, 5, 8, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Render Orbital Rings
        rings.forEach((ring) => {
          ring.angle += ring.speed;

          ctx.save();
          ctx.translate(centerX + mouseX * 0.8, centerY + mouseY * 0.8);

          ctx.beginPath();
          ctx.ellipse(
            0,
            0,
            ring.radius,
            ring.radius * Math.abs(ring.tiltX),
            ring.angle,
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = ring.color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.16;
          ctx.stroke();

          // Orbital satellites on ring
          const satAngle = ring.angle * 2;
          const sx = Math.cos(satAngle) * ring.radius;
          const sy = Math.sin(satAngle) * ring.radius * ring.tiltX;

          ctx.beginPath();
          ctx.arc(sx, sy, 3, 0, Math.PI * 2);
          ctx.fillStyle = ring.color;
          ctx.globalAlpha = 0.75;
          ctx.shadowColor = ring.color;
          ctx.shadowBlur = 12;
          ctx.fill();

          ctx.restore();
        });

        // 3D Perspective Projection for Neural Particles
        const fov = 350;
        const projectedNodes: { x: number; y: number; scale: number; particle: Particle }[] = [];

        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;

          // Wrap boundaries
          if (p.x < -width * 0.6) p.x = width * 0.6;
          if (p.x > width * 0.6) p.x = -width * 0.6;
          if (p.y < -height * 0.6) p.y = height * 0.6;
          if (p.y > height * 0.6) p.y = -height * 0.6;
          if (p.z < 20) p.z = 400;
          if (p.z > 450) p.z = 25;

          const scale = fov / (fov + p.z);
          const projX = (p.x + mouseX * 4) * scale + centerX;
          const projY = (p.y + mouseY * 4) * scale + centerY;

          projectedNodes.push({ x: projX, y: projY, scale, particle: p });

          // Draw node
          ctx.beginPath();
          ctx.arc(projX, projY, Math.max(0.8, p.radius * scale), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.min(1, p.baseAlpha * scale * 1.4);
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6 * scale;
          ctx.fill();
        });

        // Connect nearby nodes with delicate energy strands
        ctx.lineWidth = 0.6;
        for (let i = 0; i < projectedNodes.length; i++) {
          for (let j = i + 1; j < projectedNodes.length; j++) {
            const dx = projectedNodes[i].x - projectedNodes[j].x;
            const dy = projectedNodes[i].y - projectedNodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 85) {
              const alpha = (1 - dist / 85) * 0.12 * projectedNodes[i].scale;
              ctx.beginPath();
              ctx.moveTo(projectedNodes[i].x, projectedNodes[i].y);
              ctx.lineTo(projectedNodes[j].x, projectedNodes[j].y);
              ctx.strokeStyle = projectedNodes[i].particle.color;
              ctx.globalAlpha = alpha;
              ctx.stroke();
            }
          }
        }

        // Center Pulsing Core Glass Node
        ctx.save();
        ctx.translate(centerX + mouseX * 0.8, centerY + mouseY * 0.8);
        const pulse = Math.sin(time * 2.5) * 3 + 12;
        ctx.beginPath();
        ctx.arc(0, 0, pulse, 0, Math.PI * 2);
        ctx.fillStyle = '#6366f1';
        ctx.globalAlpha = 0.85;
        ctx.shadowColor = '#818cf8';
        ctx.shadowBlur = 24;
        ctx.fill();

        // Inner glowing white core
        ctx.beginPath();
        ctx.arc(0, 0, pulse * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.95;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.fill();

        ctx.restore();

        ctx.globalAlpha = 1;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

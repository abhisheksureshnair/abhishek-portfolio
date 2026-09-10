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
    let height = (canvas.height = canvas.parentElement?.clientHeight || 700);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 700;
    };

    window.addEventListener('resize', handleResize);

    // 3D Orbital Ring Node system
    const rings = [
      { radius: 140, speed: 0.005, angle: 0, tilt: 0.4, dots: 16, color: '#6366f1' },
      { radius: 220, speed: -0.003, angle: Math.PI / 4, tilt: -0.5, dots: 24, color: '#38bdf8' },
      { radius: 310, speed: 0.002, angle: Math.PI / 2, tilt: 0.3, dots: 32, color: '#10b981' },
    ];

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Pause rendering when canvas is off-screen for maximum battery & performance
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    let time = 0;

    const render = () => {
      if (isVisible) {
        time += 0.01;
        mouseX += (targetMouseX - mouseX) * 0.04;
        mouseY += (targetMouseY - mouseY) * 0.04;

        ctx.clearRect(0, 0, width, height);

        const centerX = width > 768 ? width * 0.75 : width * 0.5;
        const centerY = height * 0.45;

        // Subtle ambient radial glow behind 3D structure
        const radialGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          20,
          centerX + (mouseX - width / 2) * 0.1,
          centerY + (mouseY - height / 2) * 0.1,
          450
        );
        radialGrad.addColorStop(0, 'rgba(99, 102, 241, 0.12)');
        radialGrad.addColorStop(0.4, 'rgba(6, 182, 212, 0.04)');
        radialGrad.addColorStop(1, 'rgba(9, 9, 11, 0)');
        ctx.fillStyle = radialGrad;
        ctx.fillRect(0, 0, width, height);

        // Draw Perspective Orbital Rings & Nodes
        rings.forEach((ring) => {
          ring.angle += ring.speed;

          ctx.save();
          ctx.translate(centerX, centerY);

          // Draw orbital ring trajectory line
          ctx.beginPath();
          ctx.ellipse(0, 0, ring.radius, ring.radius * Math.abs(ring.tilt), ring.angle, 0, Math.PI * 2);
          ctx.strokeStyle = ring.color;
          ctx.globalAlpha = 0.15;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Draw orbital node dots
          for (let i = 0; i < ring.dots; i++) {
            const dotAngle = (i / ring.dots) * Math.PI * 2 + ring.angle;
            const x = Math.cos(dotAngle) * ring.radius;
            const y = Math.sin(dotAngle) * ring.radius * ring.tilt;
            const zScale = (y + ring.radius) / (ring.radius * 2); // Depth scaling simulation

            const dotX = x + (mouseX - width / 2) * 0.02 * zScale;
            const dotY = y + (mouseY - height / 2) * 0.02 * zScale;

            ctx.beginPath();
            ctx.arc(dotX, dotY, Math.max(1, 2.5 * zScale), 0, Math.PI * 2);
            ctx.fillStyle = ring.color;
            ctx.globalAlpha = Math.min(1, 0.2 + zScale * 0.7);
            ctx.shadowColor = ring.color;
            ctx.shadowBlur = 10 * zScale;
            ctx.fill();

            // Connect nearby orbital nodes with delicate energy strands
            if (i % 4 === 0) {
              const nextIndex = (i + 4) % ring.dots;
              const nextDotAngle = (nextIndex / ring.dots) * Math.PI * 2 + ring.angle;
              const nx = Math.cos(nextDotAngle) * ring.radius;
              const ny = Math.sin(nextDotAngle) * ring.radius * ring.tilt;

              ctx.beginPath();
              ctx.moveTo(dotX, dotY);
              ctx.lineTo(nx, ny);
              ctx.strokeStyle = ring.color;
              ctx.globalAlpha = 0.1;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }

          ctx.restore();
        });

        // Center Core Pulsing Glass Kernel
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.beginPath();
        const kernelPulse = Math.sin(time * 2) * 4 + 18;
        ctx.arc(0, 0, kernelPulse, 0, Math.PI * 2);
        ctx.fillStyle = '#6366f1';
        ctx.globalAlpha = 0.8;
        ctx.shadowColor = '#818cf8';
        ctx.shadowBlur = 25;
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

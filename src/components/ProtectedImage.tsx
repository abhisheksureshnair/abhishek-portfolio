'use client';

import React, { useRef, useEffect, useState } from 'react';

interface ProtectedImageProps {
  alt: string;
  className?: string;
  /** Override the src — defaults to the secured API route */
  src?: string;
  width?: number;
  height?: number;
  /** objectFit style for canvas drawing */
  objectFit?: 'cover' | 'contain';
  /** objectPosition — 'top' | 'center' | 'bottom' */
  objectPosition?: 'top' | 'center' | 'bottom';
}

/**
 * ProtectedImage renders the personal photo onto a <canvas> element.
 *
 * Why canvas?
 * - Right-click "Save Image As" only shows canvas options, not the original file
 * - Drag-and-drop is blocked
 * - The optimized public portrait stays sharp across larger layouts
 * - Canvas keeps the existing cinematic presentation and interaction behavior
 */
export const ProtectedImage: React.FC<ProtectedImageProps> = ({
  alt,
  className = '',
  src = '/avatar.webp',
  width,
  height,
  objectFit = 'cover',
  objectPosition = 'top',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // Use container dimensions if width/height not explicitly provided
      const cw = width  ?? container.clientWidth;
      const ch = height ?? container.clientHeight;
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

      canvas.width  = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.scale(dpr, dpr);

      // --- Cover / Contain calculation ---
      const imgAspect = img.width / img.height;
      const canvasAspect = cw / ch;

      let drawX = 0, drawY = 0, drawW = cw, drawH = ch;

      if (objectFit === 'cover') {
        if (imgAspect > canvasAspect) {
          // Image wider than canvas
          drawH = ch;
          drawW = ch * imgAspect;
          drawX = (cw - drawW) / 2;
        } else {
          // Image taller than canvas
          drawW = cw;
          drawH = cw / imgAspect;
          if (objectPosition === 'top') {
            drawY = 0;
          } else if (objectPosition === 'center') {
            drawY = (ch - drawH) / 2;
          } else {
            drawY = ch - drawH;
          }
        }
      } else {
        // contain
        if (imgAspect > canvasAspect) {
          drawW = cw;
          drawH = cw / imgAspect;
          drawY = (ch - drawH) / 2;
        } else {
          drawH = ch;
          drawW = ch * imgAspect;
          drawX = (cw - drawW) / 2;
        }
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      setLoaded(true);
    };

    img.onerror = () => {
      // Silently fail — no visible error exposed
      setLoaded(false);
    };

    img.src = src;
  }, [src, width, height, objectFit, objectPosition]);

  // Prevent all context menu actions on the canvas
  const blockEvent = (e: React.MouseEvent | React.DragEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none ${className}`}
      aria-label={alt}
      role="img"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ display: loaded ? 'block' : 'none' }}
        onContextMenu={blockEvent}
        onDragStart={blockEvent}
        onMouseDown={(e) => { if (e.button === 2) blockEvent(e); }}
        aria-hidden="true"
      />

      {/* Transparent overlay — extra layer blocking screenshot grabs & long-press on mobile */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        aria-hidden="true"
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      />

      {/* Skeleton while loading */}
      {!loaded && (
        <div className="absolute inset-0 bg-zinc-900 animate-pulse" aria-hidden="true" />
      )}
    </div>
  );
};

export default ProtectedImage;

import React, { useRef, useEffect, useCallback } from 'react';
import { CONFIG } from '../config';

/**
 * Renders the image sequence on a full-screen canvas with object-fit: cover.
 * Incorporates canvasCropScale (1.08) anchored at top-left to crop out
 * the bottom-right watermark on every frame.
 * Automatically draws as soon as initial frames decode and redraws only on frame changes or resize.
 */
export function SequenceCanvas({ currentFrame, getNearestFrame, isInitialReady, totalLoadedCount }) {
  const canvasRef = useRef(null);
  const lastDrawnFrameRef = useRef(null);
  const rafDrawRef = useRef(null);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = getNearestFrame(currentFrame);
    if (!img) {
      // If frame not loaded yet, retry on next RAF until decoded
      if (rafDrawRef.current) cancelAnimationFrame(rafDrawRef.current);
      rafDrawRef.current = requestAnimationFrame(drawFrame);
      return;
    }

    const cw = canvas.width;
    const ch = canvas.height;
    if (cw === 0 || ch === 0) return;

    const iw = img.width || 1920;
    const ih = img.height || 1080;

    // Base cover scale to ensure full canvas coverage
    const baseScale = Math.max(cw / iw, ch / ih);

    // Apply crop scale (1.08) anchored at top-left to hide bottom-right watermark
    const cropScale = CONFIG.canvasCropScale || 1.08;
    const finalScale = baseScale * cropScale;

    const dw = Math.ceil(iw * finalScale);
    const dh = Math.ceil(ih * finalScale);

    // Anchored at top-left on wide desktop (dx = 0) to crop off watermark on bottom-right
    // Centered horizontally on mobile & tablet portrait so the hero visual is centered
    const isPortraitOrNarrow = window.innerWidth < 1024 || cw < ch;
    const dx = isPortraitOrNarrow ? Math.round((cw - dw) / 2) : 0;
    const dy = 0;

    ctx.drawImage(img, 0, 0, iw, ih, dx, dy, dw, dh);
    lastDrawnFrameRef.current = currentFrame;
  }, [currentFrame, getNearestFrame]);

  // Handle resize and initial sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        drawFrame();
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [drawFrame]);

  // Trigger draw when frame changes, or when initial frames become ready, or new frames cached
  useEffect(() => {
    if (rafDrawRef.current) cancelAnimationFrame(rafDrawRef.current);
    rafDrawRef.current = requestAnimationFrame(drawFrame);

    return () => {
      if (rafDrawRef.current) cancelAnimationFrame(rafDrawRef.current);
    };
  }, [currentFrame, isInitialReady, totalLoadedCount, drawFrame]);

  return (
    <div className="canvas-stage-wrapper">
      <canvas ref={canvasRef} className="sequence-canvas" />
    </div>
  );
}

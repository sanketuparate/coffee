import { useState, useEffect, useRef, useCallback } from 'react';
import { CONFIG } from '../config';

/**
 * Hook to track and smooth scroll progress (0..1) and derive current frame (1..1500).
 * Calculates progress ONLY over the #scroll-story-track height (700vh),
 * remaining pinned at 1.0 (frame 1500) when scrolling through the footer.
 * Supports freezing frame updates while modals/drawers are open.
 */
export function useScrollProgress(isFrozen = false) {
  const [scrollData, setScrollData] = useState({
    rawProgress: 0,
    smoothProgress: 0,
    frame: 1,
    fps: 60
  });
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);

  const rawProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const currentFrameRef = useRef(1);
  const rafIdRef = useRef(null);
  const isAutoScrollingRef = useRef(false);
  const autoScrollCancelRef = useRef(null);
  const isFrozenRef = useRef(isFrozen);
  isFrozenRef.current = isFrozen;

  // FPS tracking
  const lastTimeRef = useRef(performance.now());
  const framesCountRef = useRef(0);
  const fpsRef = useRef(60);

  // Update target progress from window scroll position relative to track
  const updateScrollProgress = useCallback(() => {
    if (isFrozenRef.current) return;

    const track = document.getElementById('scroll-story-track');
    const trackHeight = track ? track.offsetHeight : window.innerHeight * 7;
    const maxScroll = Math.max(1, trackHeight - window.innerHeight);

    const currentY = Math.max(0, window.scrollY);
    const progress = Math.min(1, Math.max(0, currentY / maxScroll));
    rawProgressRef.current = progress;
  }, []);

  // Animation loop with lerp smoothing
  useEffect(() => {
    const handleScroll = () => {
      if (!isFrozenRef.current) {
        updateScrollProgress();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });
    updateScrollProgress();

    let lastRenderedFrame = 1;

    const loop = (time) => {
      // FPS measurement
      framesCountRef.current++;
      if (time - lastTimeRef.current >= 1000) {
        fpsRef.current = Math.round(
          (framesCountRef.current * 1000) / (time - lastTimeRef.current)
        );
        framesCountRef.current = 0;
        lastTimeRef.current = time;
      }

      if (!isFrozenRef.current) {
        // Lerp smoothing: smooth += (target - smooth) * lerpFactor
        const diff = rawProgressRef.current - smoothProgressRef.current;
        if (Math.abs(diff) > 0.00005) {
          smoothProgressRef.current += diff * CONFIG.lerpFactor;
        } else {
          smoothProgressRef.current = rawProgressRef.current;
        }

        // Compute frame index (1..1500)
        const targetFrame = Math.min(
          CONFIG.totalFrames,
          Math.max(
            1,
            Math.round(smoothProgressRef.current * (CONFIG.totalFrames - 1)) + 1
          )
        );

        if (targetFrame !== lastRenderedFrame || Math.abs(diff) > 0.001) {
          lastRenderedFrame = targetFrame;
          currentFrameRef.current = targetFrame;
          setScrollData({
            rawProgress: rawProgressRef.current,
            smoothProgress: smoothProgressRef.current,
            frame: targetFrame,
            fps: fpsRef.current
          });
        }
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollProgress);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [updateScrollProgress]);

  // Toggle debug overlay with "D" key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'd' || e.key === 'D') {
        setIsDebugOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Replay intro function (auto-scrolls track in 12 seconds)
  const replayIntro = useCallback(() => {
    if (isAutoScrollingRef.current) return;
    isAutoScrollingRef.current = true;
    setIsReplaying(true);

    const track = document.getElementById('scroll-story-track');
    const trackHeight = track ? track.offsetHeight : window.innerHeight * 7;
    const maxScroll = Math.max(1, trackHeight - window.innerHeight);
    const duration = CONFIG.autoScrollDurationMs || 12000;
    const startTime = performance.now();

    window.scrollTo({ top: 0, behavior: 'instant' });
    rawProgressRef.current = 0;
    smoothProgressRef.current = 0;

    const onUserInterrupt = () => {
      cancelAutoScroll();
    };

    const cancelAutoScroll = () => {
      isAutoScrollingRef.current = false;
      setIsReplaying(false);
      window.removeEventListener('wheel', onUserInterrupt);
      window.removeEventListener('touchmove', onUserInterrupt);
      window.removeEventListener('keydown', onUserInterrupt);
    };

    autoScrollCancelRef.current = cancelAutoScroll;
    window.addEventListener('wheel', onUserInterrupt, { passive: true });
    window.addEventListener('touchmove', onUserInterrupt, { passive: true });
    window.addEventListener('keydown', onUserInterrupt, { passive: true });

    const step = (now) => {
      if (!isAutoScrollingRef.current) return;
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);

      const easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const targetY = easedT * maxScroll;

      window.scrollTo(0, targetY);
      updateScrollProgress();

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        cancelAutoScroll();
      }
    };

    requestAnimationFrame(step);
  }, [updateScrollProgress]);

  return {
    rawProgress: scrollData.rawProgress,
    smoothProgress: scrollData.smoothProgress,
    frame: scrollData.frame,
    fps: scrollData.fps,
    isDebugOpen,
    setIsDebugOpen,
    isReplaying,
    replayIntro
  };
}

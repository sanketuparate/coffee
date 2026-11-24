import { useCallback } from 'react';
import { CONFIG } from '../config';

/**
 * Custom smooth scroll helper with custom duration (~1.2s) and cubic easing.
 */
function smoothScroll(targetY, duration = 1200) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  if (Math.abs(diff) < 2) return;

  const startTime = performance.now();

  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = easeInOutCubic(progress);

    window.scrollTo(0, startY + diff * eased);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

/**
 * Hook providing scrollToFrame(frameNumber) and scrollToElement(elementId).
 * Converts a frame number to window scrollY relative to the scroll track height.
 */
export function useScrollTo() {
  const getTrackScrollRange = useCallback(() => {
    const track = document.getElementById('scroll-story-track');
    const trackHeight = track ? track.offsetHeight : window.innerHeight * 7;
    return Math.max(1, trackHeight - window.innerHeight);
  }, []);

  const scrollToFrame = useCallback(
    (frameNumber, duration = 1200) => {
      const maxScroll = getTrackScrollRange();
      const clampedFrame = Math.min(
        CONFIG.totalFrames,
        Math.max(1, frameNumber)
      );
      const fraction = (clampedFrame - 1) / (CONFIG.totalFrames - 1);
      const targetY = fraction * maxScroll;

      smoothScroll(targetY, duration);
    },
    [getTrackScrollRange]
  );

  const scrollToElement = useCallback((elementId, duration = 1200) => {
    const el = document.getElementById(elementId);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - 80; // offset for nav bar
    smoothScroll(targetY, duration);
  }, []);

  const scrollToTop = useCallback((duration = 1200) => {
    smoothScroll(0, duration);
  }, []);

  return {
    scrollToFrame,
    scrollToElement,
    scrollToTop
  };
}

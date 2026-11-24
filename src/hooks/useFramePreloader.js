import { useState, useEffect, useRef, useCallback } from 'react';
import { CONFIG } from '../config';

/**
 * Preloads frames progressively:
 * 1. Initial batch (1..60) with loading progress % for the initial loader.
 * 2. Background loading in batches of ~20, prioritizing frames nearest to the user's current frame.
 * 3. Keeps decoded images in memory (ImageBitmap where supported).
 * 4. Loads every 2nd frame on screens < 800px.
 * 5. getNearestFrame(targetFrame) provides seamless fallback so canvas never flickers.
 */
export function useFramePreloader(currentFrame = 1) {
  const [initialProgress, setInitialProgress] = useState(0);
  const [isInitialReady, setIsInitialReady] = useState(false);
  const [totalLoadedCount, setTotalLoadedCount] = useState(0);

  const cacheRef = useRef(new Map());
  const loadingSetRef = useRef(new Set());
  const currentFrameRef = useRef(currentFrame);
  currentFrameRef.current = currentFrame;

  const isMobileRef = useRef(
    typeof window !== 'undefined' ? window.innerWidth < CONFIG.mobileBreakpoint : false
  );

  // Determine frame step: 2 on mobile, 1 on desktop
  const frameStep = isMobileRef.current ? 2 : 1;

  // Track window resize for mobile step
  useEffect(() => {
    const handleResize = () => {
      isMobileRef.current = window.innerWidth < CONFIG.mobileBreakpoint;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper to load and decode a single frame
  const loadSingleFrame = useCallback(async (frameIndex) => {
    if (cacheRef.current.has(frameIndex) || loadingSetRef.current.has(frameIndex)) {
      return cacheRef.current.get(frameIndex);
    }

    loadingSetRef.current.add(frameIndex);
    const url = CONFIG.framePath(frameIndex);

    try {
      if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob);
        cacheRef.current.set(frameIndex, bitmap);
        loadingSetRef.current.delete(frameIndex);
        return bitmap;
      } else {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = url;
          img.onload = () => {
            cacheRef.current.set(frameIndex, img);
            loadingSetRef.current.delete(frameIndex);
            resolve(img);
          };
          img.onerror = () => {
            loadingSetRef.current.delete(frameIndex);
            resolve(null);
          };
        });
      }
    } catch {
      // Fallback to HTMLImageElement
      return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          cacheRef.current.set(frameIndex, img);
          loadingSetRef.current.delete(frameIndex);
          resolve(img);
        };
        img.onerror = () => {
          loadingSetRef.current.delete(frameIndex);
          resolve(null);
        };
      });
    }
  }, []);

  // Stage 1: Load initial frames (1..initialPreloadCount)
  useEffect(() => {
    let isCancelled = false;
    const initialCount = CONFIG.initialPreloadCount;
    let loaded = 0;

    const loadInitialBatch = async () => {
      const initialIndices = [];
      for (let i = 1; i <= initialCount; i += frameStep) {
        initialIndices.push(i);
      }

      // Load with concurrency limit to maximize network throughput
      const concurrency = 6;
      let idx = 0;

      const worker = async () => {
        while (idx < initialIndices.length && !isCancelled) {
          const frameIdx = initialIndices[idx++];
          await loadSingleFrame(frameIdx);
          if (isCancelled) return;
          loaded++;
          const percent = Math.min(100, Math.round((loaded / initialIndices.length) * 100));
          setInitialProgress(percent);
          setTotalLoadedCount(cacheRef.current.size);
        }
      };

      const workers = Array.from({ length: concurrency }, () => worker());
      await Promise.all(workers);

      if (!isCancelled) {
        setIsInitialReady(true);
      }
    };

    loadInitialBatch();

    return () => {
      isCancelled = true;
    };
  }, [loadSingleFrame, frameStep]);

  // Stage 2: Background loader prioritized by distance to current frame
  useEffect(() => {
    if (!isInitialReady) return;

    let isCancelled = false;
    let isWorking = false;

    const backgroundWorker = async () => {
      if (isWorking || isCancelled) return;
      isWorking = true;

      while (!isCancelled) {
        // Collect all frames that still need to be loaded
        const needed = [];
        for (let i = 1; i <= CONFIG.totalFrames; i += frameStep) {
          if (!cacheRef.current.has(i) && !loadingSetRef.current.has(i)) {
            needed.push(i);
          }
        }

        if (needed.length === 0) {
          break; // All frames loaded!
        }

        // Sort by distance to the user's current frame
        const current = currentFrameRef.current;
        needed.sort((a, b) => Math.abs(a - current) - Math.abs(b - current));

        // Take next batch
        const batch = needed.slice(0, CONFIG.backgroundBatchSize);
        await Promise.all(batch.map((frameIdx) => loadSingleFrame(frameIdx)));

        if (!isCancelled) {
          setTotalLoadedCount(cacheRef.current.size);
        }

        // Yield to browser execution / rendering
        await new Promise((r) => setTimeout(r, 20));
      }

      isWorking = false;
    };

    backgroundWorker();

    return () => {
      isCancelled = true;
    };
  }, [isInitialReady, loadSingleFrame, frameStep]);

  // Method to retrieve the nearest loaded frame
  const getNearestFrame = useCallback((targetFrame) => {
    if (cacheRef.current.has(targetFrame)) {
      return cacheRef.current.get(targetFrame);
    }

    // Search outwards in both directions
    const total = CONFIG.totalFrames;
    for (let offset = 1; offset < total; offset++) {
      const prev = targetFrame - offset;
      if (prev >= 1 && cacheRef.current.has(prev)) {
        return cacheRef.current.get(prev);
      }
      const next = targetFrame + offset;
      if (next <= total && cacheRef.current.has(next)) {
        return cacheRef.current.get(next);
      }
    }

    return null;
  }, []);

  return {
    initialProgress,
    isInitialReady,
    totalLoadedCount,
    getNearestFrame,
    frameStep
  };
}

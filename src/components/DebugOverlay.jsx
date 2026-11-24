import React from 'react';
import { CONFIG } from '../config';

/**
 * Debug overlay toggled with 'D' key.
 * Shows frame numbers, progress, FPS, cache status, and tuning slider.
 */
export function DebugOverlay({
  isOpen,
  onClose,
  frame,
  rawProgress,
  smoothProgress,
  fps,
  totalLoadedCount,
  onFrameJump
}) {
  if (!isOpen) return null;

  const activeSection = CONFIG.sections.find(
    (s) => frame >= s.startFrame && frame <= s.exitFrame
  );

  return (
    <div className="debug-overlay-panel">
      <div className="debug-header">
        <span className="debug-title">DEBUG MONITOR</span>
        <button
          type="button"
          className="debug-close-btn"
          onClick={onClose}
          aria-label="Close debug"
        >
          ✕
        </button>
      </div>

      <div className="debug-stats-grid">
        <div className="debug-stat-row">
          <span className="debug-label">FRAME:</span>
          <span className="debug-val highlight">{frame} / {CONFIG.totalFrames}</span>
        </div>
        <div className="debug-stat-row">
          <span className="debug-label">PROGRESS:</span>
          <span className="debug-val">{(smoothProgress * 100).toFixed(1)}% (raw: {(rawProgress * 100).toFixed(1)}%)</span>
        </div>
        <div className="debug-stat-row">
          <span className="debug-label">FPS:</span>
          <span className="debug-val">{fps}</span>
        </div>
        <div className="debug-stat-row">
          <span className="debug-label">CACHED:</span>
          <span className="debug-val">{totalLoadedCount} / {CONFIG.totalFrames}</span>
        </div>
        <div className="debug-stat-row">
          <span className="debug-label">SECTION:</span>
          <span className="debug-val">{activeSection ? activeSection.id : 'none (intermission)'}</span>
        </div>
      </div>

      <div className="debug-scrub-wrap">
        <label htmlFor="debug-range-slider" className="debug-label">SCRUB FRAME:</label>
        <input
          id="debug-range-slider"
          type="range"
          min="1"
          max={CONFIG.totalFrames}
          value={frame}
          onChange={(e) => onFrameJump(parseInt(e.target.value, 10))}
          className="debug-slider"
        />
      </div>

      <div className="debug-hint">
        Press <strong>D</strong> key to toggle this monitor
      </div>
    </div>
  );
}

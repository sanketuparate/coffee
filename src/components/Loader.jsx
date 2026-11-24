import React from 'react';

/**
 * Centered minimalist loader shown while the first 60 frames decode.
 * Displays "POUR / PLAY" with percentage counter and hairline progress bar.
 */
export function Loader({ progress, isReady }) {
  if (isReady) return null;

  return (
    <div className="loader-overlay" role="status" aria-live="polite">
      <div className="loader-content">
        <span className="loader-eyebrow">THE CRAFT OF EXTRACTION</span>
        <h1 className="loader-logo">POUR / PLAY</h1>
        <div className="loader-bar-wrap">
          <div
            className="loader-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="loader-meta">
          <span className="loader-tag">INITIALIZING RITUAL</span>
          <span className="loader-percent">{progress}%</span>
        </div>
      </div>
    </div>
  );
}

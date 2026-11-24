import React from 'react';

/**
 * Smooth back-to-top circular button for the footer.
 */
export function BackToTop({ onScrollTop }) {
  return (
    <button
      type="button"
      className="back-to-top-btn"
      onClick={onScrollTop}
      aria-label="Back to top of the page"
      title="Return to beginning"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    </button>
  );
}

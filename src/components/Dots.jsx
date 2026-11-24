import React from 'react';
import { CONFIG } from '../config';

/**
 * Bottom navigation dock:
 * - 4 progress dots (bottom center): clickable jumps to hero, bloom, pour, cup
 * - Round espresso chat button (bottom right): toggles concierge chat widget
 */
export function Dots({
  currentFrame,
  onDotClick,
  onToggleChat,
  isChatOpen
}) {
  const activeIndex = CONFIG.indicatorSteps.findIndex(
    (step) => currentFrame >= step.range[0] && currentFrame <= step.range[1]
  );

  return (
    <div className="bottom-ui-dock">
      {/* 4 Navigation Dots (Bottom Center) */}
      <div className="bottom-center-dock">
        <div className="dots-pill" role="tablist" aria-label="Section navigation">
          {CONFIG.indicatorSteps.map((step, idx) => {
            const isActive = idx === (activeIndex === -1 ? 0 : activeIndex);
            return (
              <button
                key={step.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Jump to ${step.name} section (${step.id} of 04)`}
                className={`section-dot ${isActive ? 'active' : ''}`}
                onClick={() => onDotClick && onDotClick(step.range[0])}
              />
            );
          })}
        </div>
      </div>

      {/* Round Espresso Chat Button (Bottom Right) */}
      <div className="bottom-right-dock">
        <button
          type="button"
          className={`concierge-chat-btn ${isChatOpen ? 'is-active' : ''}`}
          onClick={onToggleChat}
          aria-label="Toggle Sommelier Concierge Chat"
          title="Speak with our Coffee Sommelier"
        >
          {isChatOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

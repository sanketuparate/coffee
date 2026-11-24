import React from 'react';
import { CONFIG } from '../config';

/**
 * Thin vertical indicator at the left viewport edge:
 * Displays "01 / 04", "02 / 04", etc., updating with scroll progress.
 * Clicking it jumps to the next section in the story sequence.
 */
export function SideIndicator({ currentFrame, onSelectStep }) {
  // Determine current active step index (0..3)
  const currentIndex = CONFIG.indicatorSteps.findIndex(
    (step) => currentFrame >= step.range[0] && currentFrame <= step.range[1]
  );
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;
  const currentStep = CONFIG.indicatorSteps[activeIndex];

  const handleNextSection = () => {
    const nextIndex = (activeIndex + 1) % CONFIG.indicatorSteps.length;
    const nextStep = CONFIG.indicatorSteps[nextIndex];
    onSelectStep && onSelectStep(nextStep.range[0]);
  };

  return (
    <aside className="side-indicator" aria-label="Scroll sequence section">
      <button
        type="button"
        className="side-indicator-content clickable-indicator"
        onClick={handleNextSection}
        aria-label={`Current section: ${currentStep.name}. Click to jump to next section.`}
        title="Click to jump to next section"
      >
        <span className="side-indicator-text">
          {currentStep.id} / 04
        </span>
        <div className="side-indicator-line" />
        <span className="side-indicator-name">
          {currentStep.name}
        </span>
      </button>
    </aside>
  );
}

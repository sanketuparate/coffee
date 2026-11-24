import React, { useEffect, useRef, useState } from 'react';
import { CONFIG } from '../config';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Letter-scramble component for majestic editorial text transitions.
 * Scrambles uppercase characters into the target text over ~600ms.
 * Respects prefers-reduced-motion (skips scrambling, plain fade).
 */
function ScrambleText({ text, triggerKey, duration = 600, className = '' }) {
  const [displayText, setDisplayText] = useState(text);
  const rafRef = useRef(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }, []);

  useEffect(() => {
    if (!text) {
      setDisplayText('');
      return;
    }

    if (prefersReducedMotion.current) {
      setDisplayText(text);
      return;
    }

    const startTime = performance.now();
    const length = text.length;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Eased progress (cubic ease out)
      const eased = 1 - Math.pow(1 - progress, 3);
      const resolveThreshold = Math.floor(eased * length);

      let scrambled = '';
      for (let i = 0; i < length; i++) {
        const char = text[i];
        if (char === ' ' || char === '/' || char === '·' || char === '.' || char === '\n') {
          scrambled += char;
        } else if (i < resolveThreshold) {
          scrambled += char;
        } else {
          const randChar = CHARS[Math.floor(Math.random() * CHARS.length)];
          scrambled += randChar;
        }
      }

      setDisplayText(scrambled);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, triggerKey, duration]);

  return <span className={className}>{displayText}</span>;
}

/**
 * Editorial Copy overlay component that syncs HTML typography with frame index.
 * Smoothly slides up and fades out under the solid nav bar when exiting,
 * and enters from below with a letter-scramble when a new section starts.
 */
export function Copy({ currentFrame, onButtonClick }) {
  // Find current active or exiting section directly from config ranges
  let currentSection = null;
  let isExiting = false;

  for (const sec of CONFIG.sections) {
    if (currentFrame >= sec.startFrame && currentFrame <= sec.exitFrame) {
      currentSection = sec;
      // Exit range: between endFrame and exitFrame
      if (sec.exitFrame > sec.endFrame && currentFrame > sec.endFrame) {
        isExiting = true;
      }
      break;
    }
  }

  if (!currentSection) return null;

  const animationClass = isExiting ? 'copy-exiting' : 'copy-entering';

  return (
    <div key={currentSection.id} className={`copy-overlay-container ${animationClass}`}>
      <div className="copy-content-box">
        {/* Monograph Kicker Tag / Eyebrow */}
        {currentSection.label && (
          <div className="copy-eyebrow-wrap">
            <span className="copy-dot-accent" />
            <span className="copy-label">
              <ScrambleText
                text={currentSection.label}
                triggerKey={`${currentSection.id}-label`}
                duration={450}
              />
            </span>
          </div>
        )}

        {/* Section Numeral if present (e.g. "2.") */}
        {currentSection.numeral && (
          <div className="copy-numeral">
            <ScrambleText
              text={currentSection.numeral}
              triggerKey={`${currentSection.id}-numeral`}
              duration={300}
            />
          </div>
        )}

        {/* Display Headline */}
        {currentSection.headline && currentSection.headline.length > 0 && (
          <h1 className="copy-headline">
            {currentSection.headline.map((line, idx) => (
              <span key={idx} className="copy-headline-line">
                <ScrambleText
                  text={line}
                  triggerKey={`${currentSection.id}-h-${idx}`}
                  duration={600 + idx * 80}
                />
              </span>
            ))}
          </h1>
        )}

        {/* Short Editorial Body Paragraph */}
        {currentSection.body && (
          <p className="copy-body">
            {currentSection.body}
          </p>
        )}

        {/* Pill Button */}
        {currentSection.button && (
          <div className="copy-action-row">
            <button
              type="button"
              className={`pill-button ${currentSection.button.variant === 'outline' ? 'pill-button-outline' : 'pill-button-dark'}`}
              onClick={() => onButtonClick && onButtonClick(currentSection.button)}
            >
              <span>{currentSection.button.text}</span>
              <svg
                className="pill-button-icon"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

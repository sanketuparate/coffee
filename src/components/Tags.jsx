import React, { useState, useEffect, useRef } from 'react';
import { CONFIG } from '../config';

/**
 * Floating photo card tags (ORIGIN, ROAST, FLAVOR) for frames 1430-1500.
 * - Staggered fade in with a subtle rotation spin.
 * - White paper tag look with delicate shadow and craft pin hole.
 * - Custom FLAVOR mouse-follower active at frame >= 1470.
 */
export function Tags({ currentFrame }) {
  const { startFrame, endFrame, mouseFollowerStartFrame, tags } = CONFIG.floatingTags;
  const isVisible = currentFrame >= startFrame && currentFrame <= endFrame;
  const isMouseFollowerActive = currentFrame >= mouseFollowerStartFrame;

  // Mouse position with lerp smoothing for follower
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const targetMouseRef = useRef({ x: -100, y: -100 });
  const smoothMouseRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      targetMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const loop = () => {
      if (isMouseFollowerActive) {
        const dx = targetMouseRef.current.x - smoothMouseRef.current.x;
        const dy = targetMouseRef.current.y - smoothMouseRef.current.y;
        smoothMouseRef.current.x += dx * 0.12;
        smoothMouseRef.current.y += dy * 0.12;
        setMousePos({
          x: Math.round(smoothMouseRef.current.x),
          y: Math.round(smoothMouseRef.current.y)
        });
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMouseFollowerActive]);

  if (!isVisible) return null;

  return (
    <div className="tags-layer" aria-hidden="true">
      {/* Three floating photo card tags positioned via config % */}
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="photo-card-tag tag-animated"
          style={{
            left: `${tag.x}%`,
            top: `${tag.y}%`,
            '--tag-rotation': `${tag.rotation}deg`,
            animationDelay: `${tag.staggerDelay}ms`
          }}
        >
          <div className="paper-tag-pinhole" />
          <div className="paper-tag-content">
            <span className="paper-tag-title">{tag.label}</span>
            {tag.sublabel && <span className="paper-tag-sub">{tag.sublabel}</span>}
          </div>
        </div>
      ))}

      {/* Custom FLAVOR tag following the cursor when frame >= 1470 */}
      {isMouseFollowerActive && mousePos.x > 0 && (
        <div
          className="cursor-flavor-tag"
          style={{
            transform: `translate3d(${mousePos.x + 18}px, ${mousePos.y + 18}px, 0)`
          }}
        >
          <span className="cursor-flavor-pill">
            <span className="cursor-flavor-dot" />
            FLAVOR · TASTING NOTES
          </span>
        </div>
      )}
    </div>
  );
}

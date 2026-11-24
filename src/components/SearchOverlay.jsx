import React, { useState, useEffect, useRef } from 'react';
import { CONFIG } from '../config';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

/**
 * Full-width search bar overlay anchored directly beneath the top nav.
 * Includes autofocus input, suggestion chips, live filtering, and Esc dismissal.
 */
export function SearchOverlay({ isOpen, onClose, onSelectProduct }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useLockBodyScroll(isOpen, onClose);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? CONFIG.demoProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.notes.toLowerCase().includes(query.toLowerCase()) ||
          p.origin.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="search-overlay-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="search-overlay-panel"
        onClick={(e) => e.stopPropagation()}
        role="search"
      >
        <div className="search-bar-wrap">
          <svg className="search-bar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            className="search-input"
            placeholder="Search terroir, roast level, origin, or brew gear..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search catalog"
          />
          <button
            type="button"
            className="search-close-btn"
            onClick={onClose}
            aria-label="Close search (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="search-chips-row">
          <span className="search-chips-label">SUGGESTIONS:</span>
          {CONFIG.searchSuggestions.map((chip) => (
            <button
              key={chip}
              type="button"
              className="search-chip"
              onClick={() => setQuery(chip)}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Live Search Results if searching */}
        {query.trim() && (
          <div className="search-results-list">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="search-result-item"
                  onClick={() => {
                    onSelectProduct && onSelectProduct(p);
                    onClose();
                  }}
                >
                  <div className="search-result-info">
                    <span className="search-result-name">{p.name}</span>
                    <span className="search-result-meta">{p.origin} · {p.notes}</span>
                  </div>
                  <span className="search-result-price">${p.price}</span>
                </div>
              ))
            ) : (
              <div className="search-no-results">
                No coffee or gear matching &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

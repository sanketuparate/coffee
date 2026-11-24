import React from 'react';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

/**
 * Modal viewer for editorial pages (Our Story, Origins, Journal, FAQs).
 * Features Bodoni Moda headlines, atmospheric craft card layout, Esc to close.
 */
export function InfoModal({ page, onClose }) {
  useLockBodyScroll(!!page, onClose);

  if (!page) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="info-modal-title">
      <div className="modal-card info-modal-card">
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal (Esc)"
          autoFocus
        >
          ✕
        </button>

        <div className="info-modal-header">
          {page.subtitle && <span className="info-modal-kicker">{page.subtitle}</span>}
          <h2 id="info-modal-title" className="info-modal-title">{page.title}</h2>
          <div className="info-modal-divider" />
        </div>

        <div className="info-modal-body">
          <p className="info-modal-text">{page.content}</p>
        </div>

        <div className="info-modal-footer">
          <button type="button" className="pill-button pill-button-dark" onClick={onClose}>
            <span>CLOSE RITUAL</span>
          </button>
        </div>
      </div>
    </div>
  );
}

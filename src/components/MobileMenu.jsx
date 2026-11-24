import React from 'react';
import { CONFIG } from '../config';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

/**
 * Full-screen mobile menu drawer on screens < 800px.
 * Features grand Bodoni Moda typography and seamless section jumps.
 */
export function MobileMenu({ isOpen, onClose, onNavigate, onSelectPage }) {
  useLockBodyScroll(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className="mobile-menu-overlay" role="dialog" aria-modal="true">
      <div className="mobile-menu-top">
        <span className="mobile-menu-brand">POUR / PLAY</span>
        <button
          type="button"
          className="mobile-menu-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <nav className="mobile-menu-nav">
        <a
          href="#home"
          className="mobile-hero-link"
          onClick={(e) => {
            e.preventDefault();
            onNavigate(CONFIG.navTargets.home.frame || 1);
            onClose();
          }}
        >
          HOME
        </a>
        <a
          href="#products"
          className="mobile-hero-link"
          onClick={(e) => {
            e.preventDefault();
            onNavigate(CONFIG.navTargets.products.frame || 440);
            onClose();
          }}
        >
          PRODUCTS
        </a>
        <a
          href="#coffee"
          className="mobile-hero-link"
          onClick={(e) => {
            e.preventDefault();
            onNavigate(CONFIG.navTargets.coffee.frame || 1100);
            onClose();
          }}
        >
          COFFEE
        </a>
        <a
          href="#contact"
          className="mobile-hero-link"
          onClick={(e) => {
            e.preventDefault();
            const contactEl = document.getElementById('contact');
            if (contactEl) {
              contactEl.scrollIntoView({ behavior: 'smooth' });
            }
            onClose();
          }}
        >
          CONTACTS
        </a>
      </nav>

      <div className="mobile-subpages-list">
        <span className="mobile-subpages-kicker">DISCOVERIES & ARCHIVE</span>
        <div className="mobile-subpages-grid">
          {CONFIG.dropdownPages.map((page) => (
            <button
              key={page.id}
              type="button"
              className="mobile-subpage-btn"
              onClick={() => {
                onClose();
                onSelectPage(page);
              }}
            >
              {page.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

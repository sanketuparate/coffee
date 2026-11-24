import React, { useEffect, useRef } from 'react';
import { CONFIG } from '../config';

/**
 * Dropdown menu for MORE ▾ in desktop navigation.
 * Closes on outside click, Escape, and supports full keyboard accessibility.
 */
export function NavDropdown({ isOpen, onClose, onSelectPage }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="nav-dropdown-menu"
      role="menu"
      aria-label="More navigation options"
    >
      {CONFIG.dropdownPages.map((page, idx) => (
        <button
          key={page.id}
          type="button"
          role="menuitem"
          className="dropdown-item"
          onClick={() => {
            onSelectPage(page);
            onClose();
          }}
          autoFocus={idx === 0}
        >
          <span className="dropdown-item-title">{page.label}</span>
          <span className="dropdown-item-arrow">→</span>
        </button>
      ))}
    </div>
  );
}

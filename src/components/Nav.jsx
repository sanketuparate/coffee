import React, { useState } from 'react';
import { NavDropdown } from './NavDropdown';
import { useCart } from '../context/CartContext';

/**
 * Top luxury navigation bar:
 * - Utility strip: Free shipping announcement & currency
 * - Solid cream-white bar with thin active section underline
 * - Action buttons: Search, Account, Cart with live count badge
 * - Accessible MORE ▾ dropdown
 * - Mobile hamburger trigger
 */
export function Nav({
  activeSection,
  onNavigateHome,
  onNavigateProducts,
  onNavigateCoffee,
  onNavigateContacts,
  onSelectPage,
  onOpenSearch,
  onOpenAccount,
  onOpenCart,
  onOpenMobileMenu
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <header className="site-header">
      {/* Top Utility Strip */}
      <div className="top-utility-strip">
        <div className="utility-container">
          <span className="utility-shipping">
            Free shipping over $40 · Store locator · EN
          </span>
          <div className="utility-currency">
            <span>USD ($)</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="main-navbar">
        <div className="navbar-container">
          {/* Logo -> Scroll to top */}
          <a
            href="#home"
            className="brand-logo"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
            }}
            aria-label="POUR / PLAY Home"
          >
            POUR / PLAY
          </a>

          {/* Desktop Navigation Links with animated active underline */}
          <nav className="desktop-nav-links" aria-label="Main Navigation">
            <a
              href="#home"
              className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigateHome();
              }}
            >
              HOME
            </a>
            <a
              href="#products"
              className={`nav-link ${activeSection === 'products' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigateProducts();
              }}
            >
              PRODUCTS
            </a>
            <a
              href="#coffee"
              className={`nav-link ${activeSection === 'coffee' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigateCoffee();
              }}
            >
              COFFEE
            </a>
            <a
              href="#contact"
              className={`nav-link ${activeSection === 'contacts' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigateContacts();
              }}
            >
              CONTACTS
            </a>

            {/* MORE ▾ Dropdown Trigger */}
            <div className="nav-dropdown-wrapper">
              <button
                type="button"
                className={`nav-link nav-dropdown-btn ${dropdownOpen ? 'is-open' : ''}`}
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                aria-label="More navigation options"
              >
                <span>MORE ▾</span>
              </button>
              <NavDropdown
                isOpen={dropdownOpen}
                onClose={() => setDropdownOpen(false)}
                onSelectPage={onSelectPage}
              />
            </div>
          </nav>

          {/* Header Action Buttons */}
          <div className="header-actions">
            <button
              type="button"
              className="action-icon-btn"
              onClick={onOpenSearch}
              aria-label="Search catalog"
              title="Search catalog"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <button
              type="button"
              className="action-icon-btn"
              onClick={onOpenAccount}
              aria-label="Account sign in"
              title="Customer profile"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            <button
              type="button"
              className="action-icon-btn cart-btn"
              onClick={onOpenCart}
              aria-label={`Shopping Cart (${cartCount} items)`}
              title="View cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={onOpenMobileMenu}
              aria-label="Open mobile navigation menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

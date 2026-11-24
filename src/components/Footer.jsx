import React, { useState, useEffect, useRef } from 'react';
import { BackToTop } from './BackToTop';

/**
 * Editorial Luxury Footer:
 * - Appears after the scroll sequence finishes (frame 1500)
 * - Bodoni Moda display, espresso background, brass and sand accents
 * - 4 columns, newsletter with validation, social SVG icons, back to top
 * - IntersectionObserver staggered slide-and-fade reveal
 */
export function Footer({ onOpenProducts, onSelectPage, onScrollTop }) {
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState({ type: '', message: '' });
  const footerRef = useRef(null);

  // Staggered reveal animation via IntersectionObserver
  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) {
      // If prefers reduced motion, make all reveal blocks immediately visible
      const blocks = footerRef.current?.querySelectorAll('.reveal-block');
      blocks?.forEach((b) => b.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.15 }
    );

    const blocks = footerRef.current?.querySelectorAll('.reveal-block');
    blocks?.forEach((b) => observer.observe(b));

    return () => observer.disconnect();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setNewsletterStatus({ type: '', message: '' });

    if (!email || !email.includes('@') || !email.includes('.')) {
      setNewsletterStatus({
        type: 'error',
        message: 'Please provide a valid email address.'
      });
      return;
    }

    setNewsletterStatus({
      type: 'success',
      message: "You're in. See you in your inbox."
    });
    setEmail('');
  };

  return (
    <footer ref={footerRef} className="site-footer">
      <div className="footer-inner-container">
        {/* Top Hero Banner */}
        <div className="footer-hero-section reveal-block">
          <div className="footer-hero-header">
            <span className="footer-kicker">THE DAILY CELEBRATION</span>
            <h2 className="footer-hero-headline">
              MAKE TIME <br />
              TASTE BETTER
            </h2>
          </div>
          <div className="footer-hero-action">
            <button
              type="button"
              className="pill-button pill-button-brass"
              onClick={onOpenProducts}
            >
              <span>FIND YOUR CUP</span>
              <span className="pill-button-icon">→</span>
            </button>
          </div>
        </div>

        <div className="footer-hairline-divider" />

        {/* Four Column Directory */}
        <div className="footer-columns-grid">
          {/* Column 1: Brand */}
          <div className="footer-col reveal-block" style={{ '--reveal-delay': '100ms' }}>
            <span className="footer-col-brand">POUR / PLAY</span>
            <p className="footer-col-desc">
              The ritualistic precision of specialty extraction merged with warm editorial architectural elegance.
            </p>
            <div className="footer-origin-stamp">
              <span>ZÜRICH · MILAN · TOKYO</span>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="footer-col reveal-block" style={{ '--reveal-delay': '200ms' }}>
            <span className="footer-col-title">SHOP</span>
            <ul className="footer-links-list">
              <li>
                <button type="button" className="footer-nav-link" onClick={onOpenProducts}>
                  Specialty Beans
                </button>
              </li>
              <li>
                <button type="button" className="footer-nav-link" onClick={onOpenProducts}>
                  Brew Gear & Servers
                </button>
              </li>
              <li>
                <button type="button" className="footer-nav-link" onClick={onOpenProducts}>
                  Gift Sets & Sets
                </button>
              </li>
              <li>
                <button type="button" className="footer-nav-link" onClick={onOpenProducts}>
                  Micro-Lot Subscriptions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="footer-col reveal-block" style={{ '--reveal-delay': '300ms' }}>
            <span className="footer-col-title">COMPANY</span>
            <ul className="footer-links-list">
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => onSelectPage && onSelectPage({ id: 'story', title: 'OUR STORY', content: 'Founded on the principles of deliberate stillness and architectural extraction.' })}
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => onSelectPage && onSelectPage({ id: 'origins', title: 'ORIGINS & TERROIR', content: 'From Yirgacheffe volcanic slopes to the misted highlands of Huila, Colombia.' })}
                >
                  Origins Archive
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => onSelectPage && onSelectPage({ id: 'journal', title: 'THE MONOGRAPH JOURNAL', content: 'Dispatches on brew kinematics, sensory calibration, and water mineral dynamics.' })}
                >
                  Journal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-nav-link"
                  onClick={() => onSelectPage && onSelectPage({ id: 'faqs', title: 'CAREERS AT POUR / PLAY', content: 'We are always seeking passionate roasters, baristas, and design aesthetes.' })}
                >
                  Careers
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact (id="contact") */}
          <div id="contact" className="footer-col contact-col reveal-block" style={{ '--reveal-delay': '400ms' }}>
            <span className="footer-col-title">ATELIER CONTACT</span>
            <div className="footer-contact-details">
              <p>Bahnhofstrasse 28, Zürich</p>
              <p>Via Montenapoleone 14, Milan</p>
              <p className="footer-contact-highlight">atelier@pourplay.com</p>
              <p>+41 44 211 88 00</p>
              <p className="footer-hours">Mon – Sat: 08:00 – 19:00 CET</p>
            </div>
          </div>
        </div>

        <div className="footer-hairline-divider" />

        {/* Newsletter Section */}
        <div className="footer-newsletter-row reveal-block">
          <div className="newsletter-text-wrap">
            <span className="newsletter-kicker">DISPATCHES & ALLOCATIONS</span>
            <h3 className="newsletter-title">Join the ritual</h3>
            <p className="newsletter-desc">
              Receive limited micro-lot releases, brew calibrations, and private atelier event invites.
            </p>
          </div>

          <form className="newsletter-form" onSubmit={handleSubscribe} noValidate>
            <div className="newsletter-input-group">
              <input
                type="email"
                className="newsletter-input"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email for newsletter subscription"
              />
              <button type="submit" className="pill-button pill-button-sand">
                <span>SUBSCRIBE</span>
              </button>
            </div>
            {newsletterStatus.message && (
              <div
                className={`newsletter-alert ${newsletterStatus.type === 'error' ? 'newsletter-error' : 'newsletter-success'}`}
                role="status"
              >
                {newsletterStatus.message}
              </div>
            )}
          </form>
        </div>

        <div className="footer-hairline-divider" />

        {/* Bottom Bar: Copyright, Legal Links, Social Icons, Back to Top */}
        <div className="footer-bottom-bar reveal-block">
          <div className="footer-copyright">
            © 2026 POUR / PLAY. All rights reserved.
          </div>

          <div className="footer-legal-links">
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <span className="legal-sep">·</span>
            <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
            <span className="legal-sep">·</span>
            <a href="#cookies" onClick={(e) => e.preventDefault()}>Cookie Preferences</a>
          </div>

          <div className="footer-social-and-top">
            <div className="footer-social-icons">
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="POUR / PLAY on Instagram" className="social-icon-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="POUR / PLAY on X" className="social-icon-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              </a>

              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="POUR / PLAY on YouTube" className="social-icon-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </a>

              {/* Pinterest */}
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="POUR / PLAY on Pinterest" className="social-icon-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0z" />
                  <path d="M12 2a10 10 0 0 0-3.6 19.33c.12-.9.23-2.3.05-3.3l1.45-6.14a3.3 3.3 0 0 1-.3-1.4c0-1.32.76-2.3 1.72-2.3.8 0 1.2.6 1.2 1.34 0 .82-.52 2.05-.8 3.19-.23 1 .5 1.8 1.48 1.8 1.78 0 3.15-1.88 3.15-4.6 0-2.4-1.73-4.08-4.2-4.08-2.86 0-4.54 2.15-4.54 4.37 0 .86.33 1.79.74 2.3a.3.3 0 0 1 .07.28c-.08.33-.26 1.05-.3 1.2-.05.2-.16.24-.37.15-1.4-.65-2.27-2.7-2.27-4.34 0-3.53 2.57-6.78 7.4-6.78 3.9 0 6.92 2.78 6.92 6.48 0 3.86-2.43 6.98-5.8 6.98-1.14 0-2.2-.59-2.57-1.3l-.7 2.68c-.26 1-.95 2.25-1.42 3A10 10 0 1 0 12 2z" />
                </svg>
              </a>
            </div>

            <BackToTop onScrollTop={onScrollTop} />
          </div>
        </div>
      </div>
    </footer>
  );
}

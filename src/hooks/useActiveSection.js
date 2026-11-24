import { useState, useEffect } from 'react';
import { CONFIG } from '../config';

/**
 * Tracks the active navigation section ('home', 'products', 'coffee', 'contacts')
 * based on current scroll position and footer visibility.
 */
export function useActiveSection(currentFrame) {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        const rect = contactEl.getBoundingClientRect();
        // If contact block is near or inside viewport
        if (rect.top <= window.innerHeight * 0.75) {
          setActiveSection('contacts');
          return;
        }
      }

      // Check if scrolled past track into footer
      const track = document.getElementById('scroll-story-track');
      if (track) {
        const trackBottom = track.getBoundingClientRect().bottom;
        if (trackBottom <= window.innerHeight * 0.3) {
          setActiveSection('contacts');
          return;
        }
      }

      // Inside sequence: map frame to nav section with small settling buffer
      const productsThreshold = (CONFIG.navTargets.products.frame || 440) - 25;
      const coffeeThreshold = (CONFIG.navTargets.coffee.frame || 1100) - 25;

      if (currentFrame < productsThreshold) {
        setActiveSection('home');
      } else if (currentFrame < coffeeThreshold) {
        setActiveSection('products');
      } else {
        setActiveSection('coffee');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentFrame]);

  return activeSection;
}

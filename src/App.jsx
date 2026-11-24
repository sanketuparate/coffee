import React, { useState } from 'react';
import { CONFIG } from './config';
import { CartProvider } from './context/CartContext';
import { useScrollProgress } from './hooks/useScrollProgress';
import { useFramePreloader } from './hooks/useFramePreloader';
import { useScrollTo } from './hooks/useScrollTo';
import { useActiveSection } from './hooks/useActiveSection';

import { Nav } from './components/Nav';
import { SequenceCanvas } from './components/SequenceCanvas';
import { Copy } from './components/Copy';
import { Tags } from './components/Tags';
import { Dots } from './components/Dots';
import { Loader } from './components/Loader';
import { DebugOverlay } from './components/DebugOverlay';
import { Footer } from './components/Footer';

import { SearchOverlay } from './components/SearchOverlay';
import { AccountModal } from './components/AccountModal';
import { CartDrawer } from './components/CartDrawer';
import { ProductsModal } from './components/ProductsModal';
import { InfoModal } from './components/InfoModal';
import { ChatWidget } from './components/ChatWidget';
import { MobileMenu } from './components/MobileMenu';

function AppContent() {
  // Modal & Drawer UI State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedInfoPage, setSelectedInfoPage] = useState(null);

  const isAnyOverlayOpen =
    isSearchOpen ||
    isAccountOpen ||
    isCartOpen ||
    isProductsOpen ||
    isMobileMenuOpen ||
    !!selectedInfoPage;

  // Custom scroll tracking with frame freeze during open overlays
  const {
    rawProgress,
    smoothProgress,
    frame,
    fps,
    isDebugOpen,
    setIsDebugOpen,
    isReplaying,
    replayIntro
  } = useScrollProgress(isAnyOverlayOpen);

  // Progressive image preloader
  const {
    initialProgress,
    isInitialReady,
    totalLoadedCount,
    getNearestFrame
  } = useFramePreloader(frame);

  // Smooth scroll controller (frame to scrollY converter)
  const { scrollToFrame, scrollToElement, scrollToTop } = useScrollTo();

  // Active navigation section ('home', 'products', 'coffee', 'contacts')
  const activeSection = useActiveSection(frame);

  return (
    <div className="pour-play-app">
      {/* Initial 60-frame progressive loader */}
      <Loader progress={initialProgress} isReady={isInitialReady} />

      {/* Solid cream-white navigation header */}
      <Nav
        activeSection={activeSection}
        onNavigateHome={() => scrollToFrame(CONFIG.navTargets.home.frame || 1)}
        onNavigateProducts={() =>
          scrollToFrame(CONFIG.navTargets.products.frame || 440)
        }
        onNavigateCoffee={() =>
          scrollToFrame(CONFIG.navTargets.coffee.frame || 1100)
        }
        onNavigateContacts={() =>
          scrollToElement(CONFIG.navTargets.contacts.elementId || 'contact')
        }
        onSelectPage={(page) => setSelectedInfoPage(page)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Tall 700vh scroll track with sticky 100vh viewport stage */}
      <main id="scroll-story-track" className="scroll-story-track">
        <section className="sticky-viewport-stage">
          {/* Scroll-scrubbed image sequence canvas */}
          <SequenceCanvas
            currentFrame={frame}
            getNearestFrame={getNearestFrame}
            isInitialReady={isInitialReady}
            totalLoadedCount={totalLoadedCount}
          />

          {/* Synchronized editorial HTML text with letter-scramble & slide transitions */}
          <Copy
            currentFrame={frame}
            onButtonClick={(btn) => {
              if (btn.actionType === 'modal' || btn.text === 'FIND YOUR CUP') {
                setIsProductsOpen(true);
              } else if (btn.targetFrame) {
                scrollToFrame(btn.targetFrame);
              }
            }}
          />

          {/* Floating photo cards & tasting note tags (frames 1430-1500) */}
          <Tags currentFrame={frame} />

          {/* Bottom dock: 4 section dots, Espresso chat button */}
          <Dots
            currentFrame={frame}
            onDotClick={(targetFrame) => scrollToFrame(targetFrame)}
            onToggleChat={() => setIsChatOpen((prev) => !prev)}
            isChatOpen={isChatOpen}
          />

          {/* Debug monitor overlay (toggled with 'D' key) */}
          <DebugOverlay
            isOpen={isDebugOpen}
            onClose={() => setIsDebugOpen(false)}
            frame={frame}
            rawProgress={rawProgress}
            smoothProgress={smoothProgress}
            fps={fps}
            totalLoadedCount={totalLoadedCount}
            onFrameJump={scrollToFrame}
          />
        </section>
      </main>

      {/* Footer component placed directly below the scroll track */}
      <Footer
        onOpenProducts={() => setIsProductsOpen(true)}
        onSelectPage={(page) => setSelectedInfoPage(page)}
        onScrollTop={() => scrollToTop()}
      />

      {/* Concierge Chat Widget */}
      <ChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Full-width Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={() => setIsProductsOpen(true)}
      />

      {/* Member Sign-in / Register Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onExploreProducts={() => setIsProductsOpen(true)}
      />

      {/* Products Modal */}
      <ProductsModal
        isOpen={isProductsOpen}
        onClose={() => setIsProductsOpen(false)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Editorial Information Modal (Our Story, Origins, Journal, FAQs) */}
      <InfoModal
        page={selectedInfoPage}
        onClose={() => setSelectedInfoPage(null)}
      />

      {/* Full-screen Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={(targetFrame) => scrollToFrame(targetFrame)}
        onSelectPage={(page) => setSelectedInfoPage(page)}
      />
    </div>
  );
}

export function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;

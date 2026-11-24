# POUR / PLAY — Specialty Coffee Atelier

> A scroll-driven, cinematic single-page website for **POUR / PLAY** specialty coffee. Powered by a 1,500-frame image sequence, synchronized editorial typography with letter-scramble transitions, interactive e-commerce drawers, a concierge sommelier chat, and full tablet & mobile responsiveness.

Built with **React 18** and **Vite** using pure JavaScript and **Vanilla CSS** (zero UI libraries, zero GSAP).

---

## ☕ Key Architectural Features

### 1. Scroll-Scrubbed Canvas Sequence
- **700vh Scroll Track**: A sticky `100vh` stage hosting an HTML5 `<canvas>` rendering frames with cover fitting (`object-fit: cover`).
- **1,500 Continuous Frames**: Fluid 60fps video narrative:
  1. Coffee bean in brass grinder splitting open and dripping.
  2. Brass tap pouring caramel extraction into a terracotta pour-over dripper.
  3. Slow bloom and splash.
  4. Glass pitcher pouring dark coffee into a glass server.
  5. Two coffee ribbons twisting gracefully into a stoneware latte cup.
  6. Three floating tasting cards (*ORIGIN*, *ROAST*, *FLAVOR*) entering the scene.
- **Physics-Weighted Lerp**: Normalized scroll progress $p \in [0, 1]$ is smoothed using a `requestAnimationFrame` lerp factor (`0.08`), giving tactile weight to the scrubbed sequence while only re-rendering when the frame changes.
- **Watermark Crop & Orientation Centering**: Automatically applies a `1.08` crop scale anchored top-left on desktop to crop off bottom-right watermarks, while dynamically centering horizontally on mobile & tablet portrait viewports (`window.innerWidth < 1024 || cw < ch`).

### 2. Intelligent Progressive Preloader
- **Zero Blank Canvas**: Loads initial frames 1–60 with an editorial preloader screen displaying live progress percentage.
- **Distance-Prioritized Background Loading**: Decodes the remaining frames in the background, prioritizing frames nearest to the user's current scroll position.
- **Bandwidth Optimization**: Loads every 2nd frame on mobile viewports under 800px width.
- **Nearest-Frame Fallback**: Seamlessly renders the closest loaded frame during high-speed scrubbing.

### 3. Synchronized Editorial Typography
- **HTML Over Canvas**: Real HTML copy layered over the canvas, synchronized to frame ranges configured in `src/config.js`:
  - **Hero (Frames 1–330)**: `"WAKE / THE / BEANS"` in stacked Bodoni Moda with `"POUR YOUR CUP"` pill button.
  - **Transition (Frames 330–440)**: Hero copy slides UP and fades out beneath the solid cream nav bar.
  - **Bloom (Frames 440–880)**: Numeral `"2."`, label `"LET IT BLOOM"`, headline `"LET IT / BLOOM"`, editorial body, and dark `"FIND MORE"` button.
  - **Pour (Frames 1100–1230)**: Headline `"SIP THE / UNEXPECTED"`.
  - **Cup (Frames 1330–1500)**: `"MAKE TIME / TASTE / BETTER"` headline, tasting narrative, and `"FIND YOUR CUP"` button.
- **Letter-Scramble Reveal**: Smooth random uppercase letter-scramble resolving into target copy over ~600ms, paired with easing slide-ins from below (respects `prefers-reduced-motion`).
- **Floating Photo Card Tags**: Floating craft paper tags (*ORIGIN*, *ROAST*, *FLAVOR*) fading in with a staggered spin at frames 1430–1500, plus a custom cursor-follower tag.

### 4. Clickable Navigation & Interactive Modals
- **Frame-Accurate Smooth Scrolling**: Nav links convert target frames to exact track `scrollY` coordinates and smoothly animate the page (`HOME` -> frame 1, `PRODUCTS` -> frame 440, `COFFEE` -> frame 1100, `CONTACTS` -> footer `#contact`).
- **Active Section Follower**: A thin animated indicator follows the current active section in the navbar based on frame position.
- **"MORE ▾" Modal Suite**: Dropdown featuring full-screen modal overlays for *Our Story*, *Origins Archive*, *Monograph Journal*, and *Extraction FAQs* (accessible via keyboard, backdrop click, or `Escape`).
- **Search Overlay**: Full-width search bar with autofocus, real-time catalog filtering, and quick suggestion chips (*Ethiopia*, *Colombia*, *Cold Brew*, *V60 Kit*).
- **Account Sign-In Modal**: Front-end credentials validator with live error messages and success feedback.
- **E-Commerce Drawer & Products Catalog**:
  - Modal displaying 3 demo products (*Ethiopia Light Roast*, *Colombia Medium Roast*, *V60 Craft Brew Kit*).
  - Add-to-cart functionality with real-time feedback.
  - Persistent shopping cart drawer backed by `localStorage` with quantity increment/decrement, remove item, subtotal calculation, and checkout notification.
- **Sommelier Concierge Chat**: Bottom-right interactive chat widget with coffee preparation advice.
- **Centered Navigation Dock**: 4 dots dock centered at the bottom jumping to the four core sections.
- **Frame Freeze on Overlays**: Body scroll and canvas frame scrubbing are locked while any modal, drawer, or search overlay is open.

### 5. Luxury Editorial Footer
- Positioned below the 700vh scroll track; canvas stage smoothly scrolls away when the footer enters the viewport.
- Large Bodoni Moda headline `"MAKE TIME TASTE BETTER"` with `"FIND YOUR CUP"` action button.
- Responsive 4-column (desktop) / 2x2 grid (tablet) / 1-column (mobile) layout for *Brand*, *Shop*, *Company*, and *Atelier Contact*.
- Client-side newsletter subscription with email format validation and inline confirmation.
- Social media SVG icons and an eased "Back to top" button.

### 6. Comprehensive Tablet & Mobile Responsiveness
- **Tablet (769px–1024px)**: iPad Air, iPad Pro, and tablet landscape layouts with adjusted navbar gaps, 2-column footer, and 2-column product catalog.
- **Mobile (<= 800px)**: Collapses nav links into a full-screen Bodoni Moda mobile menu, centers the canvas visual, enables internal modal scrolling (`max-height: min(90vh, 90dvh)`), and adjusts button sizes for touch targets (`min-height: 44px`).
- **Small Mobile (<= 420px)**: Scaled headline clamping (`clamp(30px, 8.8vw, 42px)`), full-width cart drawer (`100vw`), and compact newsletter forms.
- **iOS Safari Optimization**: Minimum 16px font size on inputs to prevent unwanted Safari auto-zooming on focus; safe-area inset support (`env(safe-area-inset-bottom)`).

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 18** | Functional component architecture, hooks, state management |
| **Vite 5** | Ultra-fast local development server and optimized bundle build |
| **HTML5 Canvas (2D Context)** | High-performance frame-scrubbed rendering |
| **Vanilla CSS** | CSS variables, CSS grid, flexbox, clamp(), animations |
| **Google Fonts** | `Bodoni Moda` (Headlines) & `Inter` (Body & Labels) |

---

## 📁 Project Structure

```text
├── public/
│   ├── favicon.svg             # Atelier coffee favicon
│   └── frames/                 # 1,500 sequence frames (frame_0001.jpg - frame_1500.jpg)
├── scripts/
│   ├── verify-all-features.js  # Automated Puppeteer full-suite integration test
│   └── test-responsive-viewports.js # Viewport audit (360px to 1024px)
├── src/
│   ├── components/
│   │   ├── AccountModal.jsx    # Atelier account sign-in overlay
│   │   ├── CartDrawer.jsx      # Slide-out shopping cart drawer
│   │   ├── ChatWidget.jsx      # Sommelier concierge chat widget
│   │   ├── Copy.jsx            # Synchronized typography with letter-scramble
│   │   ├── DebugOverlay.jsx    # Developer frame monitor (toggle with 'D' key)
│   │   ├── Dots.jsx            # 4 bottom navigation dots & chat launcher
│   │   ├── Footer.jsx          # Dark espresso atelier footer
│   │   ├── InfoModal.jsx       # Modal for Story, Origins, Journal, FAQs
│   │   ├── Loader.jsx          # 60-frame progressive preloading splash
│   │   ├── MobileMenu.jsx      # Fullscreen Bodoni mobile menu drawer
│   │   ├── Nav.jsx             # Top utility strip & main navigation bar
│   │   ├── ProductsModal.jsx   # Curated coffee roasts & hardware modal
│   │   ├── SearchOverlay.jsx   # Search bar overlay with suggestion chips
│   │   ├── SequenceCanvas.jsx  # Cover-fitted 2D canvas with crop & centering
│   │   └── Tags.jsx            # Floating card paper tags & cursor follower
│   ├── context/
│   │   └── CartContext.jsx     # React Context for cart state & localStorage persistence
│   ├── hooks/
│   │   ├── useActiveSection.js # Frame-to-section navigation tracker
│   │   ├── useFramePreloader.js # Progressive chunk preloading & nearest-frame finder
│   │   ├── useLockBodyScroll.js # Body scroll locking for modals and drawers
│   │   ├── useScrollProgress.js # Track scroll tracking, lerp smoothing & freeze logic
│   │   └── useScrollTo.js       # Smooth frame-to-scrollY scroll controller
│   ├── App.jsx                 # Application root coordinating components
│   ├── config.js               # Centralized configuration & timeline ranges
│   ├── main.jsx                # React DOM entry point
│   └── styles.css              # Complete design system & responsive styling
├── .gitignore                  # Git ignore rules for node_modules, dist, logs, etc.
├── index.html                  # HTML entry point with Google Fonts preload
├── package.json                # Project dependencies and npm scripts
├── vite.config.js              # Vite server & asset configuration
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### Installation
Clone the repository and install dependencies:
```bash
npm install
```

### Development Server
Run the local Vite development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173/`.

### Production Build
Build the optimized static assets:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## ⌨️ Developer Shortcuts

- **`D` Key**: Toggles the real-time Debug Overlay displaying current frame number, raw progress, smoothed progress, FPS, and total decoded frame count.

---

## 🎨 Color Palette & Theme Tokens

```css
:root {
  --color-cream: #ECE1CF;           /* Primary light background & card surfaces */
  --color-sand: #E1CBB2;            /* Borders, dividers, tag pins */
  --color-tan: #D0AF8E;             /* Subtle accent & indicator lines */
  --color-caramel-tan: #BD946B;     /* Secondary accents */
  --color-caramel-orange: #B4703B;  /* Highlight accents & active states */
  --color-coffee-brown: #5C301A;    /* Body copy & secondary typography */
  --color-mocha: #7C593F;           /* Subtle dark accents */
  --color-espresso: #2C170A;        /* Headlines, buttons, and footer background */
  --color-terracotta: #C8765A;      /* Hardware warm tones */
  --color-brass: #D4AF5F;           /* Metallic button accents & kickers */
}
```

---

## 📄 License

© 2026 **POUR / PLAY**. All rights reserved.

/**
 * POUR / PLAY Configuration
 * All tunable parameters for scroll sequence, text ranges, card tag positioning,
 * navigation targets, dropdown pages, and demo catalog.
 */

export const CONFIG = {
  // Sequence settings
  totalFrames: 1500,
  framePath: (index) => `/frames/frame_${String(index).padStart(4, '0')}.jpg`,
  initialPreloadCount: 60,
  backgroundBatchSize: 20,
  lerpFactor: 0.08,
  autoScrollDurationMs: 12000,

  // Canvas cover fitting & watermark cropping
  // Scaled ~1.08 and anchored at top-left to crop off bottom-right watermark
  canvasCropScale: 1.08,

  // Responsive settings
  mobileBreakpoint: 800, // Screens under 800px load every 2nd frame

  // Navigation targets (tune frame numbers or target element IDs here)
  navTargets: {
    home: { label: 'HOME', frame: 1 },
    products: { label: 'PRODUCTS', frame: 440 },
    coffee: { label: 'COFFEE', frame: 1100 },
    contacts: { label: 'CONTACTS', elementId: 'contact' }
  },

  // Action buttons target mapping
  actionTargets: {
    heroButton: 440,
    findMoreButton: 1100,
    findYourCupButton: 'products-modal'
  },

  // Dropdown modal pages under "MORE ▾"
  dropdownPages: [
    {
      id: 'story',
      label: 'Our Story',
      title: 'THE POUR / PLAY ARCHITECTURE',
      subtitle: 'ATELIER ROASTERY · ZÜRICH & MILAN',
      content:
        'Engineered in terracotta ceramic and brushed brass. We exist at the intersection of precision extraction and contemplative stillness. Founded in 2021, our work explores how physical ritual alters sensory perception.'
    },
    {
      id: 'origins',
      label: 'Origins',
      title: 'MICRO-LOT ARCHIVE',
      subtitle: 'ETHICAL SOURCING & BOTANICAL RARITIES',
      content:
        'From high-elevation Ethiopian micro-stations (2,100m) to shaded volcanic ridges in Huila, Colombia. Every harvest is roasted in deliberate micro-batches to preserve delicate volatile aromatics and floral clarity.'
    },
    {
      id: 'journal',
      label: 'Journal',
      title: 'THE MONOGRAPH JOURNAL',
      subtitle: 'DISPATCHES ON BREW KINEMATICS & TASTE',
      content:
        'Reflections on water mineral buffers, thermal stability across dual boilers, grind distribution curves, and the quiet beauty of morning preparation.'
    },
    {
      id: 'faqs',
      label: 'FAQs',
      title: 'CARE & EXTRACTION FAQS',
      subtitle: 'WORLDWIDE SHIPPING & METHODOLOGY',
      content:
        'Orders ship complimentary worldwide on orders over $40. For pour-over extraction, we advocate a 93.5°C water saturation with a 1:16 brew ratio using filtered spring water between 50-75 ppm.'
    }
  ],

  // Demo products for catalog and cart modal
  demoProducts: [
    {
      id: 'ethiopia-light',
      name: 'Ethiopia Light Roast',
      price: 24,
      origin: 'Yirgacheffe · 2,100M',
      notes: 'Jasmine · Bergamot · Honeycomb',
      weight: '250g Whole Bean',
      badge: 'Single Origin'
    },
    {
      id: 'colombia-medium',
      name: 'Colombia Medium Roast',
      price: 22,
      origin: 'Huila Valley · 1,850M',
      notes: 'Caramel · Toffee · Crisp Apple',
      weight: '250g Whole Bean',
      badge: 'Micro-Lot'
    },
    {
      id: 'v60-kit',
      name: 'V60 Craft Brew Kit',
      price: 68,
      origin: 'Terracotta & Brass',
      notes: 'Dripper · Carafe · 100 Paper Filters',
      weight: 'Complete Atelier Set',
      badge: 'Hardware'
    }
  ],

  // Search overlay suggestions
  searchSuggestions: ['Ethiopia', 'Colombia', 'Cold Brew', 'V60 Kit', 'Terracotta', 'Ceramic Dripper'],

  // Section indicators for 01 / 04 and bottom 4 dots
  indicatorSteps: [
    { id: '01', name: 'Hero', range: [1, 440] },
    { id: '02', name: 'Bloom', range: [441, 880] },
    { id: '03', name: 'Pour', range: [881, 1280] },
    { id: '04', name: 'Cup', range: [1281, 1500] }
  ],

  // Text that changes with the frames
  sections: [
    {
      id: 'hero',
      startFrame: 1,
      endFrame: 330,
      exitFrame: 440, // 330-440: hero text slides UP and fades out under nav bar
      type: 'hero',
      label: 'SPECIALTY COFFEE',
      headline: ['WAKE', 'THE', 'BEANS'],
      body: '',
      button: {
        text: 'POUR YOUR CUP',
        variant: 'outline',
        targetFrame: 440
      }
    },
    {
      id: 'bloom',
      startFrame: 440,
      endFrame: 840,
      exitFrame: 880, // enters ~440 from below, leaves ~880
      type: 'editorial',
      numeral: '2.',
      label: 'LET IT BLOOM',
      headline: ['LET IT', 'BLOOM'],
      body: 'Terroir meets thermal equilibrium. 93.5°C saturation gently expands the grind matrix, releasing sweet floral aromatics and fruit-forward clarity.',
      button: {
        text: 'FIND MORE',
        variant: 'dark',
        targetFrame: 1100
      }
    },
    {
      id: 'button-only',
      startFrame: 881,
      endFrame: 1050,
      exitFrame: 1100, // only button visible for a moment then leaves
      type: 'button-only',
      label: '',
      headline: [],
      body: '',
      button: {
        text: 'FIND MORE',
        variant: 'dark',
        targetFrame: 1100
      }
    },
    {
      id: 'pour',
      startFrame: 1100,
      endFrame: 1200,
      exitFrame: 1230,
      type: 'headline-only',
      label: '',
      headline: ['SIP THE', 'UNEXPECTED'],
      body: '',
      button: null
    },
    // frames 1230-1330: ribbons twist into cup, no text
    {
      id: 'cup',
      startFrame: 1330,
      endFrame: 1500,
      exitFrame: 1500,
      type: 'final',
      label: 'SIP THE UNEXPECTED',
      headline: ['MAKE TIME', 'TASTE', 'BETTER'],
      body: 'From single-estate Ethiopian high elevations to Milanese dark roast subtleties. Precision alchemy in every stoneware vessel.',
      button: {
        text: 'FIND YOUR CUP',
        variant: 'dark',
        actionType: 'modal',
        targetModal: 'products'
      }
    }
  ],

  // Floating photo card tags (frames 1430-1500)
  floatingTags: {
    startFrame: 1430,
    endFrame: 1500,
    mouseFollowerStartFrame: 1470,
    tags: [
      {
        id: 'origin',
        label: 'ORIGIN',
        sublabel: 'YIRGACHEFFE · 2100M',
        x: 64, // percent from left of canvas
        y: 28, // percent from top of canvas
        rotation: -4, // slight rotation deg
        staggerDelay: 0
      },
      {
        id: 'roast',
        label: 'ROAST',
        sublabel: 'LIGHT-MEDIUM · CITY+',
        x: 76,
        y: 48,
        rotation: 3,
        staggerDelay: 140
      },
      {
        id: 'flavor',
        label: 'FLAVOR',
        sublabel: 'JASMINE · BERGAMOT · HONEY',
        x: 58,
        y: 72,
        rotation: -2,
        staggerDelay: 280
      }
    ]
  }
};

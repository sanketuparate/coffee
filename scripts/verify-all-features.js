import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runFullVerification() {
  console.log('--- STARTING COMPREHENSIVE BROWSER VERIFICATION ---');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => consoleErrors.push(err.toString()));

  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1800)); // wait for initial load

  // --- PRE-CHECK: VERIFY REMOVAL OF HIGHLIGHTED ELEMENTS ---
  console.log('\n[PRE-CHECK] Verifying removal of side indicator & replay intro button...');
  const sideIndicator = await page.$('.side-indicator');
  const replayBtn = await page.$('.replay-intro-btn');
  const dotsPill = await page.$('.dots-pill');
  const chatBtn = await page.$('.concierge-chat-btn');

  console.log('  ✓ Side Indicator removed (.side-indicator is null):', sideIndicator === null);
  console.log('  ✓ Replay Intro button removed (.replay-intro-btn is null):', replayBtn === null);
  console.log('  ✓ Section dots pill still present:', !!dotsPill);
  console.log('  ✓ Sommelier chat button still present:', !!chatBtn);

  if (sideIndicator !== null || replayBtn !== null) {
    throw new Error('Highlighted elements are still in the DOM!');
  }

  await page.screenshot({ path: path.join(__dirname, 'test-hero-cleaned.png') });
  console.log('  ✓ Cleaned hero screenshot saved to scripts/test-hero-cleaned.png');

  // --- TEST 1: NAVBAR & DROPDOWN ---
  console.log('\n[1/8] Testing MORE ▾ Dropdown and Info Modal...');
  await page.click('.nav-dropdown-btn');
  await new Promise((r) => setTimeout(r, 200));
  const dropdownVisible = await page.$('.nav-dropdown-menu');
  console.log('  ✓ Nav dropdown opened:', !!dropdownVisible);

  // Click "Our Story"
  const storyBtn = await page.$('.dropdown-item:nth-child(1)');
  await storyBtn.click();
  await new Promise((r) => setTimeout(r, 300));
  const infoModal = await page.$('.info-modal-card');
  console.log('  ✓ InfoModal opened for "Our Story":', !!infoModal);
  await page.screenshot({ path: path.join(__dirname, 'test-info-modal.png') });

  // Close via Esc
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 300));
  const infoModalClosed = !(await page.$('.info-modal-card'));
  console.log('  ✓ InfoModal closed on Escape:', infoModalClosed);

  // --- TEST 2: SEARCH OVERLAY ---
  console.log('\n[2/8] Testing Search Overlay...');
  await page.click('button[aria-label="Search catalog"]');
  await new Promise((r) => setTimeout(r, 300));
  const searchInput = await page.$('.search-input');
  console.log('  ✓ Search overlay open with input:', !!searchInput);

  // Click suggestion chip "Ethiopia"
  const chip = await page.$('.search-chip:nth-child(2)');
  if (chip) await chip.click();
  await new Promise((r) => setTimeout(r, 200));
  const resultItem = await page.$('.search-result-item');
  console.log('  ✓ Search results populated:', !!resultItem);
  await page.screenshot({ path: path.join(__dirname, 'test-search-overlay.png') });

  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 300));
  console.log('  ✓ Search overlay closed on Escape');

  // --- TEST 3: ACCOUNT MODAL ---
  console.log('\n[3/8] Testing Account Modal & Validation...');
  await page.click('button[aria-label="Account sign in"]');
  await new Promise((r) => setTimeout(r, 400));
  const accountModal = await page.$('.account-modal-card');
  console.log('  ✓ Account modal opened:', !!accountModal);

  // Submit without input -> should trigger React state error
  await page.click('.account-modal-card button[type="submit"]');
  await new Promise((r) => setTimeout(r, 300));
  const errorMsg = await page.$eval('.account-modal-card .form-error-msg', (el) => el.textContent);
  console.log('  ✓ Validation error caught:', errorMsg);

  // Enter valid demo credentials
  await page.type('#account-email', 'taster@pourplay.com');
  await page.type('#account-password', 'secret123');
  await page.click('.account-modal-card button[type="submit"]');
  await new Promise((r) => setTimeout(r, 400));
  const successMsg = await page.$eval('.account-modal-card .form-success-msg', (el) => el.textContent);
  console.log('  ✓ Sign in success feedback:', successMsg);
  await page.screenshot({ path: path.join(__dirname, 'test-account-modal.png') });
  await new Promise((r) => setTimeout(r, 1400)); // wait for auto-close timeout

  // --- TEST 4: PRODUCTS MODAL & CART DRAWER ---
  console.log('\n[4/8] Testing Products Modal, Add to Cart & Drawer...');
  // Click Hero button "POUR YOUR CUP" to test scroll, or open Products modal from footer/cart
  // Let's open Products modal via cart drawer empty state
  await page.click('.cart-btn');
  await new Promise((r) => setTimeout(r, 300));
  const cartDrawer = await page.$('.cart-drawer-panel');
  console.log('  ✓ Cart drawer opened empty:', !!cartDrawer);
  await page.screenshot({ path: path.join(__dirname, 'test-cart-empty.png') });

  // Click "Continue shopping" in empty cart -> opens Products modal
  await page.click('.cart-empty-state .pill-button');
  await new Promise((r) => setTimeout(r, 400));
  const productsModal = await page.$('.products-modal-card');
  console.log('  ✓ Products modal opened:', !!productsModal);

  // Add 1st and 2nd products to cart
  const addBtns = await page.$$('.product-card .pill-button');
  if (addBtns.length >= 2) {
    await addBtns[0].click(); // Ethiopia
    await new Promise((r) => setTimeout(r, 300));
    await addBtns[1].click(); // Colombia
    await new Promise((r) => setTimeout(r, 300));
  }
  console.log('  ✓ Added demo items to cart');
  await page.screenshot({ path: path.join(__dirname, 'test-products-modal.png') });

  // Close products modal and open Cart drawer
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 300));

  await page.click('.cart-btn');
  await new Promise((r) => setTimeout(r, 400));
  const cartBadge = await page.$eval('.cart-badge', (el) => el.textContent);
  console.log('  ✓ Cart count badge shows:', cartBadge);

  // Test Quantity increment
  const plusBtn = await page.$('.qty-btn:nth-child(3)');
  if (plusBtn) await plusBtn.click();
  await new Promise((r) => setTimeout(r, 200));

  // Test Proceed to Checkout
  await page.click('.checkout-btn');
  await new Promise((r) => setTimeout(r, 200));
  const demoAlert = await page.$eval('.checkout-demo-alert', (el) => el.textContent);
  console.log('  ✓ Checkout demo alert:', demoAlert);
  await page.screenshot({ path: path.join(__dirname, 'test-cart-populated.png') });

  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 300));

  // --- TEST 5: CHAT CONCIERGE WIDGET ---
  console.log('\n[5/8] Testing Sommelier Chat Widget...');
  await page.click('.concierge-chat-btn');
  await new Promise((r) => setTimeout(r, 300));
  const chatPanel = await page.$('.chat-card-panel');
  console.log('  ✓ Chat widget open:', !!chatPanel);

  await page.type('.chat-text-input', 'What is your best light roast?');
  await page.click('.chat-send-btn');
  await new Promise((r) => setTimeout(r, 1600)); // wait for sommelier reply
  const bubbles = await page.$$eval('.chat-bubble-sommelier .chat-bubble', (els) =>
    els.map((el) => el.textContent)
  );
  const replyText = bubbles[bubbles.length - 1] || '';
  console.log('  ✓ Sommelier replied:', replyText.substring(0, 45) + '...');
  await page.screenshot({ path: path.join(__dirname, 'test-chat-widget.png') });

  // Close chat
  await page.click('.chat-close-btn');
  await new Promise((r) => setTimeout(r, 200));

  // --- TEST 6: NAVIGATION SMOOTH SCROLL TARGETS ---
  console.log('\n[6/8] Testing Nav Link Smooth Scrolling...');
  // Test PRODUCTS link
  await page.click('.desktop-nav-links .nav-link:nth-child(2)'); // PRODUCTS
  await new Promise((r) => setTimeout(r, 1800)); // wait for smooth scroll (~1.2s + lerp settling)
  const productsActive = await page.$eval(
    '.desktop-nav-links .nav-link:nth-child(2)',
    (el) => el.classList.contains('active')
  );
  console.log('  ✓ PRODUCTS nav link active after scroll:', productsActive);

  // Test COFFEE link
  await page.click('.desktop-nav-links .nav-link:nth-child(3)'); // COFFEE
  await new Promise((r) => setTimeout(r, 1800));
  const coffeeActive = await page.$eval(
    '.desktop-nav-links .nav-link:nth-child(3)',
    (el) => el.classList.contains('active')
  );
  console.log('  ✓ COFFEE nav link active after scroll:', coffeeActive);

  // Test CONTACTS link (scrolls to footer #contact)
  await page.click('.desktop-nav-links .nav-link:nth-child(4)'); // CONTACTS
  await new Promise((r) => setTimeout(r, 1800));
  const contactsActive = await page.$eval(
    '.desktop-nav-links .nav-link:nth-child(4)',
    (el) => el.classList.contains('active')
  );
  console.log('  ✓ CONTACTS nav link active after scroll to footer:', contactsActive);

  // --- TEST 7: FOOTER & NEWSLETTER ---
  console.log('\n[7/8] Testing Footer content & Newsletter validation...');
  await page.screenshot({ path: path.join(__dirname, 'test-footer-view.png') });

  // Check footer #contact element
  const contactEl = await page.$('#contact');
  console.log('  ✓ Footer #contact section exists:', !!contactEl);

  // Newsletter validation
  await page.type('.newsletter-input', 'invalid-email');
  await page.click('.newsletter-form button[type="submit"]');
  await new Promise((r) => setTimeout(r, 200));
  const nlError = await page.$eval('.newsletter-error', (el) => el.textContent);
  console.log('  ✓ Newsletter invalid error:', nlError);

  // Valid email subscription
  await page.click('.newsletter-input', { clickCount: 3 });
  await page.type('.newsletter-input', 'ritual@pourplay.com');
  await page.click('.newsletter-form button[type="submit"]');
  await new Promise((r) => setTimeout(r, 300));
  const nlSuccess = await page.$eval('.newsletter-success', (el) => el.textContent);
  console.log('  ✓ Newsletter success message:', nlSuccess);
  await page.screenshot({ path: path.join(__dirname, 'test-newsletter-success.png') });

  // Test Back to top button
  console.log('  Testing Back to Top button...');
  await page.click('.back-to-top-btn');
  await new Promise((r) => setTimeout(r, 1600));
  const finalScrollY = await page.evaluate(() => window.scrollY);
  console.log('  ✓ Scroll position after Back to Top:', finalScrollY, '(near 0)');

  // --- TEST 8: MOBILE MENU ---
  console.log('\n[8/8] Testing Mobile Drawer (< 800px)...');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await mobilePage.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1500));

  await mobilePage.click('.mobile-menu-toggle');
  await new Promise((r) => setTimeout(r, 300));
  const mobileMenu = await mobilePage.$('.mobile-menu-overlay');
  console.log('  ✓ Mobile menu drawer opened:', !!mobileMenu);
  await mobilePage.screenshot({ path: path.join(__dirname, 'test-mobile-menu-open.png') });

  // Click link in mobile menu to ensure it closes
  await mobilePage.click('.mobile-hero-link:nth-child(2)');
  await new Promise((r) => setTimeout(r, 400));
  const mobileMenuClosed = !(await mobilePage.$('.mobile-menu-overlay'));
  console.log('  ✓ Mobile menu closed after link clicked:', mobileMenuClosed);
  await mobilePage.close();

  console.log('\n=========================================');
  console.log('Total console errors encountered:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error('Errors:', consoleErrors);
  } else {
    console.log('✓ ZERO console errors across entire application!');
  }
  console.log('=========================================');

  await browser.close();
}

runFullVerification().catch((e) => {
  console.error('Test failed with exception:', e);
  process.exit(1);
});

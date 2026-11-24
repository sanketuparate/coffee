import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function inspectOverlays() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const sizes = [
    { name: 'phone-390', width: 390, height: 844 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'tablet-820', width: 820, height: 1180 }
  ];

  for (const size of sizes) {
    const page = await browser.newPage();
    await page.setViewport({ width: size.width, height: size.height });
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 1200));

    // 1. Mobile menu (if width <= 800)
    if (size.width <= 800) {
      await page.click('.mobile-menu-toggle');
      await new Promise((r) => setTimeout(r, 300));
      await page.screenshot({ path: path.join(__dirname, `inspect-${size.name}-menu.png`) });
      await page.click('.mobile-menu-close');
      await new Promise((r) => setTimeout(r, 300));
    }

    // 2. Search overlay
    await page.click('button[aria-label="Search catalog"]');
    await new Promise((r) => setTimeout(r, 300));
    await page.screenshot({ path: path.join(__dirname, `inspect-${size.name}-search.png`) });
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));

    // 3. Cart drawer
    await page.click('.cart-btn');
    await new Promise((r) => setTimeout(r, 300));
    await page.screenshot({ path: path.join(__dirname, `inspect-${size.name}-cart.png`) });

    // Open Products modal from cart
    await page.click('.cart-empty-state .pill-button');
    await new Promise((r) => setTimeout(r, 300));
    await page.screenshot({ path: path.join(__dirname, `inspect-${size.name}-products.png`) });
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));

    // 4. Chat widget
    await page.click('.concierge-chat-btn');
    await new Promise((r) => setTimeout(r, 300));
    await page.screenshot({ path: path.join(__dirname, `inspect-${size.name}-chat.png`) });
    await page.click('.chat-close-btn');
    await new Promise((r) => setTimeout(r, 300));

    // 5. Account modal
    await page.click('button[aria-label="Account sign in"]');
    await new Promise((r) => setTimeout(r, 300));
    await page.screenshot({ path: path.join(__dirname, `inspect-${size.name}-account.png`) });
    await page.keyboard.press('Escape');

    await page.close();
  }

  await browser.close();
  console.log('Overlay inspection complete!');
}

inspectOverlays().catch(console.error);

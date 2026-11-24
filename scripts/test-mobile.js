import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testMobile() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: path.join(__dirname, 'screenshot-mobile-hero.png') });
  console.log('Mobile hero screenshot captured.');

  // Test mobile menu toggle
  await page.click('.mobile-menu-toggle');
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(__dirname, 'screenshot-mobile-menu.png') });
  console.log('Mobile menu open screenshot captured.');

  await browser.close();
}

testMobile().catch(console.error);

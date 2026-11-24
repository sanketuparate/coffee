import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkFrames900() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);

  // Check frames around 950: p ≈ 950 / 1499 ≈ 0.6337
  await page.evaluate((targetY) => {
    window.scrollTo(0, targetY);
  }, scrollHeight * 0.634);
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: path.join(__dirname, 'screenshot-frame-950.png') });
  console.log('Frame 950 screenshot captured.');

  await browser.close();
}

checkFrames900().catch(console.error);

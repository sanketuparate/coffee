import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTest() {
  console.log('Launching browser to test POUR / PLAY website...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleLogs = [];
  const errors = [];

  page.on('console', (msg) => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    errors.push(`Page error: ${err.toString()}`);
  });

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

  // 1. Initial Hero view
  console.log('Testing Section 1 (Hero)...');
  await page.waitForSelector('.copy-headline', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 1500)); // wait for initial frames & scramble
  await page.screenshot({ path: path.join(__dirname, 'screenshot-01-hero.png') });

  // Check toggle debug with 'D' key
  console.log('Testing debug overlay with D key...');
  await page.keyboard.press('KeyD');
  await new Promise((r) => setTimeout(r, 300));
  const debugVisible = await page.$('.debug-overlay-panel');
  console.log('Debug overlay visible:', !!debugVisible);
  await page.screenshot({ path: path.join(__dirname, 'screenshot-02-debug.png') });

  // 2. Scroll to Bloom (Section 2, ~ frame 550)
  console.log('Scrolling to Section 2 (Bloom, ~frame 550)...');
  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  // Frame 550 corresponds to p = (550 - 1) / 1499 ≈ 0.366
  await page.evaluate((targetY) => {
    window.scrollTo(0, targetY);
  }, scrollHeight * 0.37);
  await new Promise((r) => setTimeout(r, 2000)); // wait for lerp and letter scramble
  await page.screenshot({ path: path.join(__dirname, 'screenshot-03-bloom.png') });

  // 3. Scroll to Pitcher Pour (Section 4, ~ frame 1150)
  console.log('Scrolling to Section 4 (Pour, ~frame 1150)...');
  await page.evaluate((targetY) => {
    window.scrollTo(0, targetY);
  }, scrollHeight * 0.77);
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(__dirname, 'screenshot-04-pour.png') });

  // 4. Scroll to Final Cup & Floating Tags (frames 1450-1500)
  console.log('Scrolling to Section 5 (Final Cup & Floating Tags, ~frame 1475)...');
  // Toggle off debug monitor so cards are fully unobstructed
  await page.keyboard.press('KeyD');
  await new Promise((r) => setTimeout(r, 200));

  await page.evaluate((targetY) => {
    window.scrollTo(0, targetY);
  }, scrollHeight * 0.985);
  // Move mouse to trigger cursor follower
  await page.mouse.move(700, 480);
  await new Promise((r) => setTimeout(r, 2200));
  await page.screenshot({ path: path.join(__dirname, 'screenshot-05-tags-clean.png') });

  // 5. Test Replay Intro button
  console.log('Testing Replay Intro button...');
  await page.click('.replay-intro-btn');
  await new Promise((r) => setTimeout(r, 1000));
  const isPlaying = await page.$eval('.replay-intro-btn', (el) => el.classList.contains('is-playing'));
  console.log('Replay intro active:', isPlaying);

  console.log('\n--- VERIFICATION REPORT ---');
  console.log('Total console logs captured:', consoleLogs.length);
  console.log('Console errors encountered:', errors.length);
  if (errors.length > 0) {
    console.error('Errors:', errors);
  } else {
    console.log('✓ ZERO console errors detected!');
  }

  await browser.close();
  console.log('Browser test complete! Screenshots saved in scripts/');
}

runTest().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});

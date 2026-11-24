import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viewports = [
  { name: 'mobile-small-360', width: 360, height: 740, isMobile: true },
  { name: 'mobile-standard-390', width: 390, height: 844, isMobile: true },
  { name: 'mobile-large-428', width: 428, height: 926, isMobile: true },
  { name: 'tablet-portrait-768', width: 768, height: 1024, isMobile: false },
  { name: 'tablet-ipad-820', width: 820, height: 1180, isMobile: false },
  { name: 'tablet-landscape-1024', width: 1024, height: 768, isMobile: false }
];

async function testResponsive() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  console.log('--- AUDITING RESPONSIVE VIEWPORTS ---');

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 1200));

    // Check horizontal overflow
    const overflowInfo = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const bodyWidth = document.body.scrollWidth;
      const winWidth = window.innerWidth;
      const elementsOverflowing = [];

      document.querySelectorAll('*').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.right > winWidth + 2) {
          elementsOverflowing.push({
            tag: el.tagName,
            class: el.className,
            right: Math.round(rect.right),
            winWidth
          });
        }
      });

      return {
        hasOverflow: docWidth > winWidth + 1 || bodyWidth > winWidth + 1,
        docWidth,
        winWidth,
        overflowCount: elementsOverflowing.length,
        samples: elementsOverflowing.slice(0, 3)
      };
    });

    console.log(`\nViewport [${vp.name}] (${vp.width}x${vp.height}):`);
    console.log(`  Horizontal overflow: ${overflowInfo.hasOverflow ? 'YES (BAD)' : 'NO (GOOD)'} (doc: ${overflowInfo.docWidth}px vs win: ${overflowInfo.winWidth}px)`);
    if (overflowInfo.overflowCount > 0) {
      console.log(`  Overflow elements count: ${overflowInfo.overflowCount}`, overflowInfo.samples);
    }

    // Capture screenshot
    await page.screenshot({ path: path.join(__dirname, `audit-${vp.name}-hero.png`) });

    // Scroll down to test bloom and cup sections
    await page.evaluate(() => window.scrollTo(0, 1500));
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: path.join(__dirname, `audit-${vp.name}-bloom.png`) });

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(__dirname, `audit-${vp.name}-footer.png`) });
  }

  await browser.close();
  console.log('\nAudit complete! Check audit-*.png screenshots.');
}

testResponsive().catch(console.error);

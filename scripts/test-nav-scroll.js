import puppeteer from 'puppeteer';

async function testScrollNav() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/');
  await new Promise(r => setTimeout(r, 1500));

  console.log('Initial scrollY:', await page.evaluate(() => window.scrollY));

  // Click PRODUCTS link
  await page.click('a[href="#products"]');
  console.log('Clicked #products. Monitoring scroll for 2 seconds...');
  for (let i = 0; i < 5; i++) {
    await new Promise(r => setTimeout(r, 400));
    const data = await page.evaluate(() => {
      const activeLink = document.querySelector('.desktop-nav-links .active')?.textContent;
      const debugVal = document.querySelector('.debug-val')?.textContent;
      return { scrollY: window.scrollY, activeLink, debugVal };
    });
    console.log(`t=${(i+1)*400}ms:`, data);
  }

  await browser.close();
}

testScrollNav().catch(console.error);

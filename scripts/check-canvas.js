import puppeteer from 'puppeteer';

async function testCanvas() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  
  // Wait 3 seconds for frames to fetch
  await new Promise(r => setTimeout(r, 3000));

  const result = await page.evaluate(async () => {
    // Check canvas element
    const canvas = document.querySelector('canvas');
    if (!canvas) return { error: 'No canvas' };

    // Fetch frame 1 directly to see if fetch/createImageBitmap works
    try {
      const res = await fetch('/frames/frame_0001.jpg');
      const blob = await res.blob();
      const bitmap = await createImageBitmap(blob);
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(bitmap, 0, 0, 300, 200);
      
      // Get pixel data to verify it is NOT all zeroes (black)
      const p = ctx.getImageData(150, 100, 1, 1).data;
      return {
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        bitmapWidth: bitmap.width,
        bitmapHeight: bitmap.height,
        pixelRGBA: [p[0], p[1], p[2], p[3]],
        fetchStatus: res.status
      };
    } catch (e) {
      return { error: e.toString() };
    }
  });

  console.log('TEST RESULT:', result);
  await browser.close();
}

testCanvas().catch(console.error);

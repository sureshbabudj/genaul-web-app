import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Standard OG Image size
  await page.setViewport({ width: 1200, height: 630 });
  
  const url = 'http://localhost:5175/og-template';
  console.log(`Navigating to ${url}...`);
  
  try {
    // Wait for the network to be idle to ensure fonts and Tailwind classes are loaded
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  } catch (error) {
    console.error(`Failed to navigate to ${url}. Make sure your dev server is running on port 5175!`);
    await browser.close();
    process.exit(1);
  }
  
  // Capture screenshot directly to the public folder
  const destPath = path.resolve(__dirname, '../public/og-image-v2.png');
  console.log('Capturing screenshot...');
  await page.screenshot({ path: destPath });
  
  console.log(`✅ OG image successfully generated at: ${destPath}`);
  
  await browser.close();
  process.exit(0);
})();

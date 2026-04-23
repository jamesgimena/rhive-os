import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 5000 }); // Large height for full page

    // Login logic
    await page.goto('http://localhost:3000');
    await page.waitForSelector('text=CUSTOMER');
    await page.click('text=CUSTOMER');
    await page.waitForTimeout(2000);

    // Capture Asphalt Page
    console.log('Capturing Asphalt Page...');
    await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('nav-page', { detail: 'P-02a' }));
    });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'asphalt_standardized_layout.png', fullPage: true });

    // Capture Membrane Page
    console.log('Capturing Membrane Page...');
    await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('nav-page', { detail: 'P-02b' }));
    });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'membrane_standardized_layout.png', fullPage: true });

    await browser.close();
    console.log('Screenshots captured: asphalt_standardized_layout.png, membrane_standardized_layout.png');
})();

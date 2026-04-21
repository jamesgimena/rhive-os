import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1440, height: 4000 } });
    const page = await context.newPage();

    console.log("Navigating to Membrane page...");
    await page.goto('http://localhost:3000/');

    console.log("WAITING...");
    await page.waitForTimeout(3000); 

    console.log("Performing Login...");
    await page.click('text=CUSTOMER');
    await page.waitForTimeout(2000);

    console.log("Triggering Nav Event...");
    await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('nav-page', { detail: 'P-02b' }));
    });

    console.log("Waiting for animations to settle...");
    await page.waitForTimeout(4000); 

    console.log("Opening CapEx Lightbox...");
    await page.click('text=REQUEST CAPEX DIAGNOSTIC');
    await page.waitForTimeout(2000);

    const path = "C:\\Users\\mjrob\\.gemini\\antigravity\\brain\\1d7f8dd5-8f60-47e7-89bb-e1489e00eab0\\membrane_capex_lightbox_capture.png";
    console.log(`Capturing lightbox to ${path}...`);
    
    await page.screenshot({ path: path, fullPage: true });

    console.log("Done.");
    await browser.close();
})();

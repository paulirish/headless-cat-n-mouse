// We'll use Puppeteer is our browser automation framework.
const puppeteer = require('puppeteer');

const avoidDetection = require('./avoid-detection');
const detectHeadless = require('./detect-headless');


(async () => {
  // Launch the browser in headless mode and set up a page.
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true
  });
  const page = await browser.newPage();

  // Prepare for the tests (not yet implemented).
  await avoidDetection(page);

  await page.goto('http://example.com');

  page.on('console', msg => {
    console.log('Page console: ', msg.text());
  });

  await page.evaluate(detectHeadless);

  // Save a screenshot of the results.
  await page.screenshot({path: 'headless-test-result.png'});

  // Clean up.
  await browser.close();
})();

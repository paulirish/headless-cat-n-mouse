const puppeteer = require('puppeteer');

const applyEvasions = require('./apply-evasions');
const detectHeadless = require('./detect-headless');

async function run({includeEvasions = true, suppressLogs = false}) {
  const browser = await puppeteer.launch({args: ['--no-sandbox --disable-notifications']});
  const page = await browser.newPage();
  page.on('console', msg => {
    if (!suppressLogs) console.log('Page console: ', msg.text());
  });

  if (includeEvasions) await applyEvasions(page);

  await page.goto('about:blank');

  const detectionResults = await page.evaluate(detectHeadless);

  console.assert(Object.keys(detectionResults).length, 'No detection results returned.');

  await browser.close();
  return detectionResults;
}

module.exports = run;

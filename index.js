// We'll use Puppeteer is our browser automation framework.
const puppeteer = require('puppeteer');

const applyEvasions = require('./apply-evasions');
const detectHeadless = require('./detect-headless');

async function run({includeEvasions = true, suppressLogs = false}) {
  const browser = await puppeteer.launch({args: ['--no-sandbox']});
  const page = await browser.newPage();
  let wasDetected = null;

  if (includeEvasions) await applyEvasions(page);

  page.on('console', msg => {
    if (msg.type() === 'debug') {
      wasDetected = msg.text() === 'true';
    } else {
      if (!suppressLogs) console.log('Page console: ', msg.text());
    }
  });
  await page.goto('http://example.com');

  await page.evaluate(detectHeadless);
  console.assert(wasDetected !== null);

  await browser.close();
  return wasDetected;
}

// FIXME: confirm every individual detect works
async function testDetects() {
  const wasHeadlessDetected = await run({includeEvasions: false, suppressLogs: true});
  console.assert(wasHeadlessDetected === true, 'Detections failed');
}

async function testEvasions() {
  const wasHeadlessDetected = await run({includeEvasions: true});

  console.log(
    wasHeadlessDetected
      ? 'Detection *succeeded*.\n🔍  Detectors win!'
      : 'Detection *failed*.\n😎  Evaders win!'
  );
}

if (require.main === module) {
  Promise.resolve()
    .then(_ => testDetects())
    .then(_ => testEvasions())
    .catch(console.error);
} else {
  module.exports = run;
}

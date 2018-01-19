#!/usr/bin/env node
const cat_n_mouse = require('.');

// FIXME: confirm every individual detect works
async function testDetects() {
  const wasHeadlessDetected = await cat_n_mouse({includeEvasions: false, suppressLogs: true});
  console.assert(wasHeadlessDetected === true, 'Detections failed');
}

async function testEvasions() {
  const wasHeadlessDetected = await cat_n_mouse({includeEvasions: true});
  console.assert(wasHeadlessDetected === false, 'Evasions failed');

  console.log(
    wasHeadlessDetected
      ? 'Detection *succeeded*.\n🔍  Detectors win!'
      : 'Detection *failed*.\n😎  Evaders win!'
  );
}

Promise.resolve()
  .then(_ => testDetects())
  .then(_ => testEvasions())
  .catch(console.error);

#!/usr/bin/env node
const cat_n_mouse = require('.');
const fs = require('fs');

// FIXME: confirm every individual detect works
async function testDetects() {
  const results = await cat_n_mouse({includeEvasions: false, suppressLogs: true});
  // If any of the detects pass, then we conclude this is headless.
  const wasHeadlessDetected = Object.values(results).some(Boolean);
  console.assert(wasHeadlessDetected === true, 'Detections failed');
}

async function testEvasions() {
  const results = await cat_n_mouse({includeEvasions: true});
  const wasHeadlessDetected = Object.values(results).some(Boolean);

  const result = wasHeadlessDetected
    ? 'Headless detection *succeeded*.\n🔍  Detectors are winning!'
    : 'Headless detection *failed*.\n😎  Evaders are winning!';
  console.log(`\n${result}`);
  updateReadmeStatus(result);
}

function updateReadmeStatus(result) {
  if (!fs.existsSync('.git')) return;
  if (!fs.existsSync('readme.md')) return;

  const readmeTxt = fs.readFileSync('readme.md', 'utf8');
  if (/\*\*Current status:\*\*\n```txt/.test(readmeTxt) === false) return;
  const newTxt = readmeTxt.replace(/(```txt)([^`]|\s)*/m, `$1\n${result}\n`);
  fs.writeFileSync('readme.md', newTxt);
}

Promise.resolve()
  .then(_ => testDetects())
  .then(_ => testEvasions())
  .catch(console.error);

// initial detects from @antoinevastel
//   http://antoinevastel.github.io/bot%20detection/2018/01/17/detect-chrome-headless-v2.html

module.exports = async function() {
  const results = {};

  async function test(name, fn) {
    const detectionPassed = await fn();
    if (detectionPassed) console.log(`Chrome headless detected via ${name}`);
    results[name] = detectionPassed;
  }

  await test('userAgent', _ => {
    return /HeadlessChrome/.test(window.navigator.userAgent);
  });

  await test('navigator.webdriver present', _ => {
    return navigator.webdriver;
  });

  await test('window.chrome missing', _ => {
    return /Chrome/.test(window.navigator.userAgent) && !window.chrome;
  });

  await test('permissions API', async _ => {
    const permissionStatus = await navigator.permissions.query({name: 'notifications'});
    return Notification.permission === 'denied' && permissionStatus.state === 'prompt';
  });

  await test('permissions API overriden', _ => {
    const permissions = window.navigator.permissions;
    if (permissions.query.toString() !== 'function query() { [native code] }') return true;
    if (permissions.query.toString.toString() !== 'function toString() { [native code] }') return true;
    if (permissions.hasOwnProperty('query')) return true;
  });

  await test('navigator.plugins empty', _ => {
    return navigator.plugins.length === 0;
  });

  await test('navigator.languages blank', _ => {
    return navigator.languages === '';
  });

  return results;
};

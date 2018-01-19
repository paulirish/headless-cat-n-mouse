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

  await test('navigator.webdriver', _ => {
    return navigator.webdriver;
  });

  await test('window.chrome', _ => {
    return /Chrome/.test(window.navigator.userAgent) && !window.chrome;
  });

  await test('permissions API', async _ => {
    const permissionStatus = await navigator.permissions.query({name: 'notifications'});
    return Notification.permission === 'denied' && permissionStatus.state === 'prompt';
  });

  await test('permissions API overriden', _ => {
    if (navigator.permissions.query.toString() !== 'function query() { [native code] }') return true;
    if (window.navigator.permissions.hasOwnProperty('query')) return true;
  });

  await test('navigator.plugins', _ => {
    return navigator.plugins.length === 0;
  });

  await test('navigator.languages', _ => {
    return navigator.languages === '';
  });

  return results;
};

module.exports = async function() {
  let isHeadless = false;

  function confirmDetection(msg) {
    console.log(msg);
    isHeadless = true;
  }

  if (/HeadlessChrome/.test(window.navigator.userAgent)) {
    confirmDetection('Chrome headless detected via userAgent');
  }

  if (navigator.webdriver) {
    confirmDetection('Chrome headless detected via navigator.webdriver');
  }

  if (/Chrome/.test(window.navigator.userAgent) && !window.chrome) {
    confirmDetection('Chrome headless detected via window.chrome');
  }

  if (navigator.permissions.query.toString() !== 'function query() { [native code] }') {
    confirmDetection('Chrome headless detected via permissions API override');
  }
  const permissionStatus = await navigator.permissions.query({name: 'notifications'});
  if (Notification.permission === 'denied' && permissionStatus.state === 'prompt') {
    confirmDetection('Chrome headless detected via permissions API');
  }

  if (navigator.plugins.length === 0) {
    confirmDetection('Chrome headless potentially detected via navigator.plugins');
  }

  if (navigator.languages === '') {
    confirmDetection('Chrome headless detected via navigator.languages');
  }

  console.debug(isHeadless);
};

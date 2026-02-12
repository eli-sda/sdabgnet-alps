const MATOMO_URL = 'https://matomo.adventist.bg/';
const SITE_ID = '3';
const ALLOWED_HOST = 'sdabg.net';

declare global {
  interface Window {
    _paq?: unknown[][];
  }
}

export function initMatomo(): void {
  // only production and the correct domain
  if (!import.meta.env.PROD || window.location.hostname !== ALLOWED_HOST)
    return;

  // prevents double loading of the script
  if (document.querySelector(`script[src*="/js/piwik.js"]`)) return;

  window._paq = window._paq || [];

  // cookieless mode
  window._paq.push(['disableCookies']);
  window._paq.push(['enableLinkTracking']);

  window._paq.push(['setTrackerUrl', `${MATOMO_URL}piwik.php`]);
  //   // use the PHP proxy endpoint on this domain
  //   window._paq.push(['setTrackerUrl', `/matomo-proxy.php`]);

  window._paq.push(['setSiteId', SITE_ID]);

  const script = document.createElement('script');
  script.async = true;
  // load local copy of the tracker script
  script.src = `/js/piwik.js`;

  document.head.appendChild(script);
}

export function trackPageView(url: string): void {
  if (!import.meta.env.PROD || window.location.hostname !== ALLOWED_HOST)
    return;
  if (!window._paq) return;

  window._paq.push(['setCustomUrl', url]);
  window._paq.push(['trackPageView']);
}

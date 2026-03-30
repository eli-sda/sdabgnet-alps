const SITE_IDS: Record<string, string> = {
  'sdabg.net': '3',
  'new.sdabg.net': '9'
};
const ALLOWED_HOSTS = Object.keys(SITE_IDS);
let lastTrackedUrl: string | undefined = undefined;

declare global {
  interface Window {
    _paq?: unknown[][];
  }
}

export function initMatomo(): void {
  // only production and an allowed domain
  if (!ALLOWED_HOSTS.includes(window.location.hostname)) return;

  // prevents double loading of the script
  if (document.querySelector('script[src*="/js/piwik.js"]')) return;

  window._paq = window._paq || [];

  // remember current page as the last tracked URL for SPA navigation
  lastTrackedUrl = window.location.href;

  // cookieless mode
  window._paq.push(['disableCookies']);
  window._paq.push(['enableLinkTracking']);

  // use the PHP proxy on this domain to forward tracking data to Matomo
  window._paq.push(['setTrackerUrl', `/matomo-proxy.php`]);

  const SITE_ID = SITE_IDS[window.location.hostname] || SITE_IDS['sdabg.net'];
  window._paq.push(['setSiteId', SITE_ID]);

  const script = document.createElement('script');
  script.async = true;
  // load local copy of the tracker script (same-domain, avoids ad-blocker blocking)
  script.src = '/js/piwik.js';

  document.head.appendChild(script);
}

export function trackPageView(url: string): void {
  if (!ALLOWED_HOSTS.includes(window.location.hostname)) return;
  if (!window._paq) return;

  // set referrer to the previously tracked URL so Matomo records urlref correctly
  if (lastTrackedUrl && lastTrackedUrl !== url) {
    window._paq.push(['setReferrerUrl', lastTrackedUrl]);
  }

  window._paq.push(['setCustomUrl', url]);
  window._paq.push(['trackPageView']);

  // update lastTrackedUrl for the next navigation
  lastTrackedUrl = url;
}

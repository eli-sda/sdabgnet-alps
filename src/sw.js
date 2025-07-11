// Service Worker: Workbox injectManifest entry
// This file uses Workbox globals injected at build time. Do not use import/export here.

// Activate new SW immediately
self.skipWaiting && self.skipWaiting();
// Take control of clients if available (Workbox injects this in some builds, but not always)
if (typeof self.clientsClaim === 'function') {
  self.clientsClaim();
}

// Clean up outdated caches if available
if (typeof cleanupOutdatedCaches === 'function') {
  cleanupOutdatedCaches();
}

// Exclude PHP files from all service worker handling
if (
  typeof registerRoute === 'function' &&
  typeof workbox !== 'undefined' &&
  workbox.strategies &&
  workbox.strategies.NetworkOnly
) {
  registerRoute(
    ({ url }) => url.pathname.endsWith('.php'),
    new workbox.strategies.NetworkOnly()
  );
}

// Exclude /img/ from all service worker handling
if (
  typeof registerRoute === 'function' &&
  typeof workbox !== 'undefined' &&
  workbox.strategies &&
  workbox.strategies.NetworkOnly
) {
  registerRoute(
    ({ url }) => url.pathname.startsWith('/img/'),
    new workbox.strategies.NetworkOnly()
  );
}

// Handle navigation requests, but exclude PHP files and /img/
if (
  typeof registerRoute === 'function' &&
  typeof workbox !== 'undefined' &&
  workbox.strategies &&
  workbox.strategies.NetworkFirst &&
  workbox.expiration &&
  workbox.expiration.ExpirationPlugin
) {
  registerRoute(
    ({ request, url }) =>
      request.mode === 'navigate' &&
      !url.pathname.endsWith('.php') &&
      !url.pathname.startsWith('/img/'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'navigation-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 86400 // Cache for 1 day
        })
      ]
    })
  );
}

// Precache assets injected by Workbox
if (typeof precacheAndRoute === 'function') {
  precacheAndRoute(self.__WB_MANIFEST || []);
}

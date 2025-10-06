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

// Fallback to index.html for navigation requests if network/cache fails (SPA routing fix)
self.addEventListener('fetch', (event) => {
  if (
    event.request.mode === 'navigate' &&
    !event.request.url.endsWith('.php') &&
    !event.request.url.includes('/img/')
  ) {
    event.respondWith(
      fetch(event.request).catch(async () => {
        // Try to serve index.html from cache
        const cached = await caches.match('/index.html');
        if (cached) return cached;
        // If not found, try root
        return caches.match('/');
      })
    );
  }
});

// Listen for cache clear requests
self.addEventListener('message', (event) => {
  // event.origin is not available on service worker 'message' events,
  // so check the sender by the client URL
  // using service worker's own origin
  const client = event.source;
  if (client && client.url && !client.url.startsWith(self.location.origin)) {
    // Ignore messages not from your own domain
    return;
  }

  if (event.data && event.data.type === 'CLEAR_CACHE_AND_RELOAD') {
    console.log('Service Worker clearing caches and reloading...');

    // Clear all caches and reload clients
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(cacheNames.map((name) => caches.delete(name)));
      })
      .then(() => {
        // Force reload all clients
        if (self.clients && self.clients.matchAll) {
          self.clients.matchAll({ type: 'window' }).then((clients) => {
            clients.forEach((client) =>
              client.postMessage({ type: 'RELOAD_WINDOW' })
            );
          });
        }
        self.skipWaiting && self.skipWaiting();
      });
  }
});

// Precache assets injected by Workbox
if (typeof precacheAndRoute === 'function') {
  precacheAndRoute(self.__WB_MANIFEST || []);
}

// Clean activation - take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, NetworkOnly } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Skip waiting and claim clients immediately
self.skipWaiting();
self.clientsClaim();

// Clean up outdated caches
cleanupOutdatedCaches();

// Exclude PHP files from all service worker handling
registerRoute(({ url }) => url.pathname.endsWith('.php'), new NetworkOnly());

// Handle navigation requests but exclude PHP files
registerRoute(
  ({ request, url }) =>
    request.mode === 'navigate' && !url.pathname.endsWith('.php'),
  new NetworkFirst({
    cacheName: 'navigation-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 86400 // Cache for 1 day
      })
    ]
  })
);

// Ensure precached assets are handled correctly
precacheAndRoute(self.__WB_MANIFEST || []);

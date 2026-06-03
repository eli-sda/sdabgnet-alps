import { createRoot } from 'react-dom/client';
import 'react-jinke-music-player/lib/styles/index.less';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { suppressYouTubeErrors } from './utils/suppressYouTubeErrors.ts';

// Filter out YouTube analytics errors from console
suppressYouTubeErrors();

type ServiceWorkerMessage = { type?: string };
// Simple error handler for critical failures (fallback only)
let isReloading = false;

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason as unknown;
  if (
    reason &&
    reason instanceof Error &&
    reason.message.includes('Loading chunk')
  ) {
    console.warn('Chunk loading error detected, clearing cache...');
    if (!isReloading) {
      isReloading = true;
      // Clear caches and reload as last resort
      caches
        .keys()
        .then((names) => Promise.all(names.map((name) => caches.delete(name))))
        .then(() => window.location.reload())
        .catch(() => window.location.reload());
    }
  }
});

// Remove trailing slash from URL in the browser if present (but not for root)
if (
  window.location.pathname.length > 1 &&
  window.location.pathname.endsWith('/')
) {
  const url = new URL(window.location.href);
  url.pathname = url.pathname.replace(/\/+$/, '');
  window.history.replaceState({}, '', url.pathname + url.search + url.hash);
}

function handleServiceWorkerMessage(event: MessageEvent) {
  // Only accept messages from your own origin
  if (event.origin !== window.location.origin) {
    return;
  }
  const data = event.data as ServiceWorkerMessage;
  if (data?.type === 'RELOAD_WINDOW' && !isReloading) {
    isReloading = true;
    window.location.reload();
  }
}

// Simple service worker handling
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener(
    'message',
    handleServiceWorkerMessage
  );

  // Auto-reload when a new SW takes control (after skipWaiting + clientsClaim on deploy)
  // Wait for the next in-app navigation so we don't interrupt audio/video playback
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (isReloading) return;

    const reloadOnNavigation = () => {
      if (!isReloading) {
        isReloading = true;
        window.location.reload();
      }
    };

    // Intercept React Router (pushState) navigation
    const originalPushState = history.pushState.bind(history);
    history.pushState = function (
      ...args: Parameters<typeof history.pushState>
    ) {
      originalPushState(...args);
      reloadOnNavigation();
    };

    // Also handle back/forward browser navigation
    window.addEventListener('popstate', reloadOnNavigation, { once: true });
  });
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

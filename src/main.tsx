import { createRoot } from 'react-dom/client';
import 'react-jinke-music-player/lib/styles/index.less';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';

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

// Simple service worker handling
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event: MessageEvent) => {
    const data = event.data as { type?: string };
    if (data?.type === 'RELOAD_WINDOW' && !isReloading) {
      isReloading = true;
      window.location.reload();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Force reload when a new Service Worker takes control
    window.location.reload();
  });

  // Listen for reload message from SW
  navigator.serviceWorker.addEventListener('message', (event: MessageEvent) => {
    const data: unknown = event.data;
    if (
      data &&
      typeof data === 'object' &&
      data !== null &&
      'type' in data &&
      (data as { type?: unknown }).type === 'RELOAD_WINDOW'
    ) {
      window.location.reload();
    }
  });

  // Check for updates on navigation
  window.addEventListener('popstate', () => {
    navigator.serviceWorker
      .getRegistration()
      .then((registration) => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      })
      .catch((error) => {
        console.error('Error checking Service Worker registration:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

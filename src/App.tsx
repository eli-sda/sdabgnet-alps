import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import './App.scss';
import Router from './Router';
import { CurrentLessonProvider } from './providers/CurrentLessonProvider';
import { PageMetaDataProvider } from './providers/PageMetaDataProvider';

function App() {
  useEffect(() => {
    const setScrollbarWidth = () => {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty(
        '--scrollbar-width',
        `${scrollBarWidth}px`
      );
    };

    // Run after paint/layout
    requestAnimationFrame(setScrollbarWidth);

    // Optional: also update on resize
    window.addEventListener('resize', setScrollbarWidth);
    return () => window.removeEventListener('resize', setScrollbarWidth);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      let isReloading = false; // Prevent multiple reloads

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!isReloading) {
          isReloading = true; // Mark as reloading
          alert('Controller changed. Reloading the page...');
          setTimeout(() => {
            window.location.reload(); // Reload the page after a short delay
          }, 100); // Add a small delay to ensure the new Service Worker is fully activated
        }
      });

      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log(
            'Service Worker registered with scope:',
            registration.scope
          );

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                console.log('Service Worker state:', installingWorker.state);
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // Show confirmation dialog only once
                    if (!localStorage.getItem('swUpdateConfirmed')) {
                      localStorage.setItem('swUpdateConfirmed', 'true');
                      if (
                        confirm(
                          'Сайтът е обновен. Искате ли да презаредите страницата, за да видите последните промени?'
                        )
                      ) {
                        window.location.reload();
                      }
                    }
                  } else {
                    // the Service Worker is installed for the first time
                    console.log('Content is cached for offline use.');
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    } else {
      console.log('Service Worker is disabled in development mode.');
    }
  }, []);

  return (
    <HelmetProvider>
      <PageMetaDataProvider>
        <CurrentLessonProvider>
          <Router />
        </CurrentLessonProvider>
      </PageMetaDataProvider>
    </HelmetProvider>
  );
}

export default App;

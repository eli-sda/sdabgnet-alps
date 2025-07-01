import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import './App.scss';
import Router from './Router';
import { CurrentLessonProvider } from './providers/CurrentLessonProvider';
import { PagesMetaDataProvider } from './providers/PagesMetaDataProvider';
import { AdvertisementsProvider } from './providers/AdvertisementsProvider';

const App = () => {
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

  return (
    <HelmetProvider>
      <PagesMetaDataProvider>
        <CurrentLessonProvider>
          <AdvertisementsProvider>
            <Router />
          </AdvertisementsProvider>
        </CurrentLessonProvider>
      </PagesMetaDataProvider>
    </HelmetProvider>
  );
};

export default App;

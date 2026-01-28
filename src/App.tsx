import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import './App.scss';
import Router from './Router';
import { CurrentLessonProvider } from './providers/CurrentLessonProvider';
import { PagesMetaDataProvider } from './providers/PagesMetaDataProvider';
import { AdvertisementsProvider } from './providers/AdvertisementsProvider';
import { QuestionsProvider } from './providers/QuestionsProvider';
import { PlaylistsProvider } from './providers/PlaylistsProvider';
import { DailyVerseProvider } from './providers/DailyVerseProvider';
import SunsetProvider from './providers/SunsetProvider';
import { CalendarEventsProvider } from './providers/CalendarEventsProvider';

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
            <QuestionsProvider>
              <SunsetProvider>
                <PlaylistsProvider>
                  <CalendarEventsProvider>
                    <DailyVerseProvider>
                      <Router />
                    </DailyVerseProvider>
                  </CalendarEventsProvider>
                </PlaylistsProvider>
              </SunsetProvider>
            </QuestionsProvider>
          </AdvertisementsProvider>
        </CurrentLessonProvider>
      </PagesMetaDataProvider>
    </HelmetProvider>
  );
};

export default App;

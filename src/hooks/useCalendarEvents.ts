import { useEffect } from 'react';
import moment from 'moment';
import {
  EventType,
  useCalendarEventsContext
} from 'src/contexts/CalendarEventsContext';
import { localStorageEventsLoadedKey } from 'src/providers/CalendarEventsProvider';
import { getTodayString } from 'src/utils/getTodayString';

export function useCalendarEvents() {
  const { events, upcoming, setEvents } = useCalendarEventsContext();

  useEffect(() => {
    const interval = setInterval(
      () => {
        try {
          void loadAndSetEvents();
        } catch (err) {
          console.error('Failed to load calendar events', err);
          setEvents([]);
        }
      },
      60 * 1000 * 60 * 24
    ); // Check every day

    void loadAndSetEvents();
    return () => clearInterval(interval);
  }, []);

  const getCalendars = async () => {
    const currentYear = moment().year();
    const years = [currentYear, currentYear + 1];
    return Promise.allSettled(
      years.map((year) =>
        fetch(`/json/calendar-${year}.json`).then((res) =>
          res.ok ? res.json() : []
        )
      )
    ).then((results) =>
      results
        .filter(
          (r): r is PromiseFulfilledResult<EventType[]> =>
            r.status === 'fulfilled'
        )
        .flatMap((r) => r.value)
    );
  };

  const loadAndSetEvents = async () => {
    const lastLoaded = localStorage.getItem(localStorageEventsLoadedKey);
    const today = getTodayString();
    if (lastLoaded === today) {
      return;
    } else {
      localStorage.setItem(localStorageEventsLoadedKey, today);
      return getCalendars().then((loadedEvents) => {
        setEvents(loadedEvents);
      });
    }
  };

  return { events, upcoming };
}

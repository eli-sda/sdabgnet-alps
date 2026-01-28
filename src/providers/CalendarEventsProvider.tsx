import { ReactNode, useEffect, useState } from 'react';
import moment from 'moment';
import {
  CalendarEventsContext,
  EventType
} from 'src/contexts/CalendarEventsContext';
import { getTodayString } from 'src/utils/getTodayString';

export const CalendarEventsProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [lastLoaded, setLastLoaded] = useState<string>();

  useEffect(() => {
    const load = async () => {
      const today = getTodayString();
      const currentYear = moment().year();
      const years = [currentYear, currentYear + 1];

      try {
        const results = await Promise.allSettled(
          years.map((year) =>
            fetch(`/json/calendar-${year}.json`).then((res) =>
              res.ok ? res.json() : []
            )
          )
        );

        const allEvents = results
          .filter((r): r is PromiseFulfilledResult<EventType[]> =>
            r.status === 'fulfilled'
          )
          .flatMap((r) => r.value);

        setEvents(allEvents);
        setLastLoaded(today);
      } catch (err) {
        console.error('Failed to load calendar events', err);
        setEvents([]);
      }
    };

    void load();
  }, []);
  
  return (
    <CalendarEventsContext.Provider
      value={{
        events,
        setEvents,
        lastLoaded,
        setLastLoaded
      }}
    >
      {children}
    </CalendarEventsContext.Provider>
  );
};

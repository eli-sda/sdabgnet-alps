import { useEffect, useState } from 'react';
import moment from 'moment';

export type EventType = {
  title: string;
  start: string;
  endRegistration?: string;
  link?: string;
};

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
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
          .filter(
            (r): r is PromiseFulfilledResult<EventType[]> =>
              r.status === 'fulfilled'
          )
          .flatMap((r) => r.value);

        setEvents(allEvents);
      } catch (err) {
        console.error('Failed to load calendar events', err);
        setEvents([]);
      }
    };

    void loadEvents();
  }, []);

  return { events };
};

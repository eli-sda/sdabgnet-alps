import { ReactNode, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import {
  CalendarEventsContext,
  EventType
} from 'src/contexts/CalendarEventsContext';

export const localStorageEventsLoadedKey = 'upcomming_events_last_loaded';

export const CalendarEventsProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [events, setEvents] = useState<EventType[]>([]);

  const upcoming: EventType[] = useMemo(() => {
    const today = moment().startOf('day');
    return events.filter((e) => moment(e.start).isAfter(today));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(localStorageEventsLoadedKey, '');
  }, []);

  return (
    <CalendarEventsContext.Provider
      value={{
        events,
        upcoming,
        setEvents
      }}
    >
      {children}
    </CalendarEventsContext.Provider>
  );
};

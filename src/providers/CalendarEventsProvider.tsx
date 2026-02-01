import { ReactNode, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import {
  CalendarEventsContext,
  EventType
} from 'src/contexts/CalendarEventsContext';

export const localStorageEventsLoadedKey = 'upcoming_events_last_loaded';

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

  const openForRegistration: EventType[] = useMemo(() => {
    const today = moment().startOf('day');
    return upcoming
      .filter(
        (e) =>
          e.link &&
          e.endRegistration &&
          moment(e.endRegistration).isAfter(today)
      )
      .sort((a, b) =>
        moment(a.endRegistration).diff(moment(b.endRegistration))
      );
  }, [upcoming]);

  useEffect(() => {
    localStorage.setItem(localStorageEventsLoadedKey, '');
  }, []);

  return (
    <CalendarEventsContext.Provider
      value={{
        events,
        upcoming,
        openForRegistration,
        setEvents
      }}
    >
      {children}
    </CalendarEventsContext.Provider>
  );
};

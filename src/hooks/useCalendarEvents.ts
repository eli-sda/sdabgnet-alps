import { useMemo } from 'react';
import moment from 'moment';
import {
  EventType,
  useCalendarEventsContext
} from 'src/contexts/CalendarEventsContext';

export function useCalendarEvents() {
  const { events } = useCalendarEventsContext();

  const upcoming = useMemo(() => getUpcomingEvents(events), [events]);

  return { events, upcoming };
}

function getUpcomingEvents(events: EventType[]): EventType[] {
  const today = moment().startOf('day');

  return events
    .filter((e) => moment(e.start).isAfter(today))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

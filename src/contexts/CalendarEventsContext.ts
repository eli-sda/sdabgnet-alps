import { createContext, useContext } from 'react';

export type EventType = {
  title: string;
  start: string;
  endRegistration?: string;
  link?: string;
};

export type CalendarEventsContextType = {
  events: EventType[];
  setEvents: (events: EventType[]) => void;
  lastLoaded: string | undefined;
  setLastLoaded: (date: string) => void;
};

export const CalendarEventsContext = createContext<CalendarEventsContextType>({
  events: [],
  setEvents: () => {},
  lastLoaded: undefined,
  setLastLoaded: () => {}
});

export function useCalendarEventsContext() {
  const context = useContext(CalendarEventsContext);

  return context;
}

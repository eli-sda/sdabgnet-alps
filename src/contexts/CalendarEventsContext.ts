import { createContext, useContext } from 'react';

export type EventType = {
  title: string;
  start: string;
  endRegistration?: string;
  link?: string;
};

export type CalendarEventsContextType = {
  events: EventType[];
  upcoming: EventType[];
  setEvents: (events: EventType[]) => void;
};

export const CalendarEventsContext = createContext<CalendarEventsContextType>({
  events: [],
  upcoming: [],
  setEvents: () => {}
});

export function useCalendarEventsContext() {
  const context = useContext(CalendarEventsContext);

  return context;
}

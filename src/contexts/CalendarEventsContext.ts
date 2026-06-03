import { createContext, useContext } from 'react';

export type EventType = {
  title: string;
  start: string;
  end?: string;
  endRegistration?: string;
  link?: string;
};

export type CalendarEventsContextType = {
  events: EventType[];
  upcoming: EventType[];
  openForRegistration: EventType[];
  setEvents: (events: EventType[]) => void;
};

export const CalendarEventsContext = createContext<CalendarEventsContextType>({
  events: [],
  upcoming: [],
  openForRegistration: [],
  setEvents: () => {}
});

export function useCalendarEventsContext() {
  const context = useContext(CalendarEventsContext);

  return context;
}

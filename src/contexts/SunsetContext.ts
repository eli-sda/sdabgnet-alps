import { createContext, useContext } from 'react';

export type SunsetEvent = {
  title: string;
  start: string; // ISO string
  end: string; // ISO string
};

// Map keyed by YYYY-MM-lat-lng
export type SunsetsMap = Record<string, SunsetEvent[]>;

export type SunsetContextType = {
  sunsetsMap: SunsetsMap;
  setSunsets: (key: string, events: SunsetEvent[]) => void;
};

export const SunsetContext = createContext<SunsetContextType>({
  sunsetsMap: {},
  setSunsets: () => {}
});

export function useSunsetContext() {
  const context = useContext(SunsetContext);

  return context;
}

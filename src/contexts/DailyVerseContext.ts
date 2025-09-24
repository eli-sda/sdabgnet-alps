import { PortableTextBlock } from '@portabletext/types';
import { createContext, useContext } from 'react';

export type DailyVerseType = {
  date: string;
  title: string;
  text: string;
  verse: string;
  comment: Array<PortableTextBlock>;
  halfYear: {
    title: string;
    author: string;
  };
};

export type DailyVerseContextType = {
  dailyVerse: DailyVerseType | undefined;
  setDailyVerse: (dailyVerse: DailyVerseType | undefined) => void;
  lastLoaded: string | undefined;
  setLastLoaded: (date: string) => void;
};

export const DailyVerseContext = createContext<DailyVerseContextType>({
  dailyVerse: undefined,
  setDailyVerse: () => {},
  lastLoaded: undefined,
  setLastLoaded: () => {}
});

export function useDailyVerseContext() {
  const context = useContext(DailyVerseContext);

  return context;
}

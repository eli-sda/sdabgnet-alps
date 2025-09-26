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
  verses: Record<string, DailyVerseType | null>;
  setVerse: (date: string, verse: DailyVerseType | null) => void;
};

export const DailyVerseContext = createContext<DailyVerseContextType>({
  verses: {},
  setVerse: () => {}
});

export function useDailyVerseContext() {
  const context = useContext(DailyVerseContext);

  return context;
}

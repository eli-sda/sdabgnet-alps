import { ReactNode, useState } from 'react';
import {
  DailyVerseContext,
  DailyVerseType
} from 'src/contexts/DailyVerseContext';

export const DailyVerseProvider = ({ children }: { children: ReactNode }) => {
  const [verses, setVerses] = useState<Record<string, DailyVerseType | null>>({});

  const setVerse = (date: string, verse: DailyVerseType | null) => {
    setVerses((prev) => ({ ...prev, [date]: verse }));
  };

  return (
    <DailyVerseContext.Provider
      value={{
        verses,
        setVerse
      }}
    >
      {children}
    </DailyVerseContext.Provider>
  );
};

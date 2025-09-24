import { ReactNode, useState } from 'react';
import {
  DailyVerseContext,
  DailyVerseType
} from 'src/contexts/DailyVerseContext';

export const DailyVerseProvider = ({ children }: { children: ReactNode }) => {
  const [dailyVerse, setDailyVerse] = useState<DailyVerseType>();
  const [lastLoaded, setLastLoaded] = useState<string>();
  return (
    <DailyVerseContext.Provider
      value={{
        dailyVerse,
        setDailyVerse,
        lastLoaded,
        setLastLoaded
      }}
    >
      {children}
    </DailyVerseContext.Provider>
  );
};

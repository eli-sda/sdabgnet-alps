import { useCallback } from 'react';
import { useDailyVerseContext } from 'src/contexts/DailyVerseContext';
import { loadDailyVerse } from 'src/utils/FetchHelper';
import { getTodayString } from 'src/utils/getTodayString';

export function useDailyVerse() {
  const { verses, setVerse } = useDailyVerseContext();

  const getDailyVerse = useCallback(
    async (date?: string) => {
      const targetDate = date ?? getTodayString();

      // if already cached (even null) → return it
      if (Object.prototype.hasOwnProperty.call(verses, targetDate)) {
        return Promise.resolve(verses[targetDate]);
      }

      // otherwise fetch from backend
      return loadDailyVerse(targetDate)
        .then((loadedDailyVerse) => {
          if (!loadedDailyVerse) {
            setVerse(targetDate, null);
            return null;
          }
          setVerse(targetDate, loadedDailyVerse);
          return loadedDailyVerse;
        })
        .catch((err) => {
          console.error('Error fetching verse: ', err);
          setVerse(targetDate, null);
          return null;
        });
    },
    [verses, setVerse]
  );

  return { getDailyVerse };
}

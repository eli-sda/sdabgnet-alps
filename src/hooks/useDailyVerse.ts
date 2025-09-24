import { useCallback } from 'react';
import { useDailyVerseContext } from 'src/contexts/DailyVerseContext';
import { loadDailyVerse } from 'src/utils/FetchHelper';

function getTodayString() {
  const today = new Date();
  return today.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function useDailyVerse() {
  const { dailyVerse, setDailyVerse, lastLoaded, setLastLoaded } =
    useDailyVerseContext();

  /**
   * Returns the daily verse. If the daily verse is not loaded or is stale (older than today),
   * it will fetch it from the backend and update the provider. Otherwise, it returns the cached daily verse.
   * @returns Promise resolving to the daily verse
   * */

  const getDailyVerse = useCallback(async () => {
    const today = getTodayString();
    if (dailyVerse && lastLoaded === today) {
      return Promise.resolve(dailyVerse);
    }
    return loadDailyVerse(today)
      .then((loadedDailyVerse) => {
        setDailyVerse(loadedDailyVerse);
        setLastLoaded(today);
        return Promise.resolve(loadedDailyVerse);
      })
      .catch();
  }, [dailyVerse, lastLoaded, setDailyVerse, setLastLoaded]);

  return { dailyVerse, getDailyVerse };
}

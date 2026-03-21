import { useCallback } from 'react';
import { usePoetryContext } from 'src/contexts/PoetryContext';
import { loadPoetry } from 'src/utils/FetchHelper';
import { getTodayString } from 'src/utils/getTodayString';

export function usePoetry() {
  const { poetry, setPoetry, lastLoaded, setLastLoaded } = usePoetryContext();

  /**
   * Returns the poetry. If the poetry are not loaded or are stale (older than today),
   * it will fetch them from the backend and update the provider. Otherwise, it returns the cached poetry.
   * @returns Promise resolving to an array of poetry
   */
  const getPoetry = useCallback(async () => {
    const today = getTodayString();
    if (poetry && lastLoaded === today) {
      return Promise.resolve(poetry);
    }
    return loadPoetry()
      .then((loadedPoetry) => {
        setPoetry(loadedPoetry);
        setLastLoaded(today);
        return Promise.resolve(loadedPoetry);
      })
      .catch();
  }, [poetry, lastLoaded, setPoetry, setLastLoaded]);

  return { poetry, getPoetry };
}

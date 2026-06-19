import { useCallback } from 'react';
import { useDictionaryContext } from 'src/contexts/DictionaryContext';
import { loadDictionary } from 'src/utils/FetchHelper';
import { getTodayString } from 'src/utils/getTodayString';

export function useDictionary() {
  const { dictionary, setDictionary, lastLoaded, setLastLoaded } =
    useDictionaryContext();

  /**
   * Returns the dictionary. If the dictionary is not loaded or are stale (older than today),
   * it will fetch them from the backend and update the provider. Otherwise, it returns the cached dictionary.
   * @returns Promise resolving to an array of dictionary
   */
  const getDictionary = useCallback(async () => {
    const today = getTodayString();
    
    if (dictionary && lastLoaded === today) {
      return Promise.resolve(dictionary);
    }
    return loadDictionary()
      .then((loadedDictionary) => {
        setDictionary(loadedDictionary);
        setLastLoaded(today);
        return Promise.resolve(loadedDictionary);
      })
      .catch();
  }, [dictionary, lastLoaded, setDictionary, setLastLoaded]);

  return { dictionary, getDictionary };
}

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
        const sortedDictionary = loadedDictionary.sort((a, b) =>
          a.topic.localeCompare(b.topic, 'bg')
        );

        setDictionary(sortedDictionary);
        setLastLoaded(today);
        return Promise.resolve(sortedDictionary);
      })
      .catch();
  }, [dictionary, lastLoaded, setDictionary, setLastLoaded]);

  return { getDictionary };
}

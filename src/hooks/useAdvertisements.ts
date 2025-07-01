import { useCallback } from 'react';
import { AddType } from 'src/constants';
import { useAdvertisementsContext } from 'src/contexts/AdvertisementsContext';
import { loadAdvertisements } from 'src/utils/FetchHelper';

function getTodayString() {
  const today = new Date();
  return today.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function useAdvertisements() {
  const { advertisements, setAdvertisements, lastLoaded, setLastLoaded } =
    useAdvertisementsContext();

  /**
   * Returns the advertisements for the given type. If the advertisements are not loaded or are stale (older than today),
   * it will fetch them from the backend and update the provider. Otherwise, it returns the cached advertisements for the type.
   * @param type The type of advertisement to retrieve (e.g. "services", "buySell", "other")
   * @returns Promise resolving to an array of advertisements for the given type
   */
  const getAdvertisements = useCallback(
    async (type: AddType) => {
      const today = getTodayString();
      if (advertisements && lastLoaded === today) {
        return Promise.resolve(advertisements[type] || []);
      }
      return loadAdvertisements()
        .then((adsMap) => {
          setAdvertisements(adsMap);
          setLastLoaded(today);
          const ads = adsMap[type] || [];
          return Promise.resolve(ads);
        })
        .catch();
    },
    [advertisements, lastLoaded, setAdvertisements, setLastLoaded]
  );

  return { advertisements, getAdvertisements };
}

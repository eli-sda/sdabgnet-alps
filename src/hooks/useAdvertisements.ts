import { useCallback } from 'react';
import { AdType } from 'src/constants';
import { useAdvertisementsContext } from 'src/contexts/AdvertisementsContext';
import {
  loadAdvertisements,
  loadLatestAdvertisement
} from 'src/utils/FetchHelper';
import { getTodayString } from 'src/utils/getTodayString';

export function useAdvertisements() {
  const {
    advertisements,
    setAdvertisements,
    lastLoaded,
    setLastLoaded,
    latestAdvertisements,
    setLatestAdvertisements
  } = useAdvertisementsContext();

  /**
   * Returns the advertisements for the given type. If the advertisements are not loaded or are stale (older than today),
   * it will fetch them from the backend and update the provider. Otherwise, it returns the cached advertisements for the type.
   * @param type The type of advertisement to retrieve (e.g. "services", "buySell", "other")
   * @returns Promise resolving to an array of advertisements for the given type
   */
  const getAdvertisements = useCallback(
    async (type: AdType) => {
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

  /**
   * Load the latest advertisement for each type and store them in latestAdvertisements
   * Does not modify the main advertisements map.
   */
  const getLatestAdvertisements = useCallback(async () => {
    const latest = await loadLatestAdvertisement();
    setLatestAdvertisements(latest);
    return latest;
  }, [setLatestAdvertisements]);

  return {
    advertisements,
    getAdvertisements,
    latestAdvertisements,
    getLatestAdvertisements
  };
}

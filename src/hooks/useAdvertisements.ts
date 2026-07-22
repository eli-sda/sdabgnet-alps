import { useCallback } from 'react';
import { AdType } from 'src/constants';
import { useAdvertisementsContext } from 'src/contexts/AdvertisementsContext';
import {
  loadAdvertisements,
  loadLatestAdvertisement,
  loadHealthAdvertisements
} from 'src/utils/FetchHelper';
import { getTodayString } from 'src/utils/getTodayString';

export function useAdvertisements() {
  const {
    advertisements,
    setAdvertisements,
    lastLoaded,
    setLastLoaded,
    latestAdvertisements,
    setLatestAdvertisements,
    lastLatestLoaded,
    setLastLatestLoaded,
    healthAdvertisements,
    setHealthAdvertisements,
    lastHealtLoaded,
    setLastHealtLoaded
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
    const today = getTodayString();
    if (latestAdvertisements && lastLatestLoaded === today) {
      return Promise.resolve(latestAdvertisements);
    }
    const latest = await loadLatestAdvertisement();
    setLatestAdvertisements(latest);
    setLastLatestLoaded(today);
    return latest;
  }, [
    latestAdvertisements,
    lastLatestLoaded,
    setLatestAdvertisements,
    setLastLatestLoaded
  ]);

  /**
   * Load the health advertisements and store them in healthAdvertisements
   * Does not modify the main advertisements map
   */
  const getHealthAdvertisements = useCallback(async () => {
    const today = getTodayString();

    if (healthAdvertisements && lastHealtLoaded === today) {
      return Promise.resolve(healthAdvertisements);
    }

    const healthAds = await loadHealthAdvertisements();
    setHealthAdvertisements(healthAds);
    setLastHealtLoaded(today);
    return healthAds;
  }, [
    healthAdvertisements,
    lastHealtLoaded,
    setHealthAdvertisements,
    setLastHealtLoaded
  ]);

  return {
    advertisements,
    getAdvertisements,
    latestAdvertisements,
    getLatestAdvertisements,
    healthAdvertisements,
    getHealthAdvertisements
  };
}

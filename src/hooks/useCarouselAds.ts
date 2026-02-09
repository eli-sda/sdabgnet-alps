import { useCallback } from 'react';
import { useCarouselAdsContext } from 'src/contexts/CarouselAdsContext';
import { loadCarouselAds } from 'src/utils/FetchHelper';
import { getTodayString } from 'src/utils/getTodayString';

export function useCarouselAds() {
  const { carouselAds, setCarouselAds, lastLoaded, setLastLoaded } =
    useCarouselAdsContext();

  /**
   * Returns the carousel ads. If the carousel ads are not loaded or are stale (older than today),
   * it will fetch them from the backend and update the provider. Otherwise, it returns the cached carousel ads.
   * @returns Promise resolving to an array of carousel ads
   */
  const getCarouselAds = useCallback(async () => {
    const today = getTodayString();
    if (carouselAds && lastLoaded === today) {
      return Promise.resolve(carouselAds);
    }
    return loadCarouselAds()
      .then((loadedCarouselAds) => {
        setCarouselAds(loadedCarouselAds);
        setLastLoaded(today);
        return Promise.resolve(loadedCarouselAds);
      })
      .catch();
  }, [carouselAds, lastLoaded, setCarouselAds, setLastLoaded]);

  return { carouselAds, getCarouselAds };
}

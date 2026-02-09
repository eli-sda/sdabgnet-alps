import { ReactNode, useState } from 'react';
import {
  CarouselAdsContext,
  CarouselAdType
} from 'src/contexts/CarouselAdsContext';

export const CarouselAdsProvider = ({ children }: { children: ReactNode }) => {
  const [carouselAds, setCarouselAds] = useState<CarouselAdType[]>();
  const [lastLoaded, setLastLoaded] = useState<string>();

  return (
    <CarouselAdsContext.Provider
      value={{
        carouselAds,
        setCarouselAds,
        lastLoaded,
        setLastLoaded
      }}
    >
      {children}
    </CarouselAdsContext.Provider>
  );
};

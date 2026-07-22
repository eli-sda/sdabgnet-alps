import { createContext, useContext } from 'react';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

export type CarouselAdType = {
  title: string;
  description?: string;
  image: SanityImageSource;
  buttonLabel?: string;
  url?: string;
};

export type CarouselAdContextType = {
  carouselAds?: CarouselAdType[];
  setCarouselAds: (carouselAds: CarouselAdType[]) => void;
  lastLoaded?: string;
  setLastLoaded: (date: string) => void;
};

export const CarouselAdsContext = createContext<CarouselAdContextType>({
  carouselAds: undefined,
  setCarouselAds: () => {},
  lastLoaded: undefined,
  setLastLoaded: () => {}
});

export function useCarouselAdsContext() {
  const context = useContext(CarouselAdsContext);

  return context;
}

import { PortableTextBlock } from '@portabletext/types';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { createContext, useContext } from 'react';
import { AdType } from 'src/constants';

export type AdvertisementType = {
  type: AdType;
  date: string;
  text: Array<PortableTextBlock>;
  name: string;
  place: string;
  email: string;
  phone: string;
  hasViber: boolean;
  image: SanityImageSource | null;
};

export type AdvertisementsMap = {
  [type: string]: AdvertisementType[];
};

export type LatestAdvertisementItem = {
  date: string;
  text: Array<PortableTextBlock>;
};

export type AdvertisementsContextType = {
  advertisements: AdvertisementsMap | undefined;
  setAdvertisements: (advertisements: AdvertisementsMap) => void;
  lastLoaded: string | undefined;
  setLastLoaded: (date: string) => void;
  latestAdvertisements: Partial<Record<AdType, LatestAdvertisementItem>> | undefined;
  setLatestAdvertisements: (advertisements: Partial<Record<AdType, LatestAdvertisementItem>>) => void;
};

export const AdvertisementsContext =
  createContext<AdvertisementsContextType>({
    advertisements: undefined,
    setAdvertisements: () => {},
    lastLoaded: undefined,
    setLastLoaded: () => {},
    latestAdvertisements: undefined,
    setLatestAdvertisements: () => {}
  });

export function useAdvertisementsContext() {
  const context = useContext(AdvertisementsContext);

  return context;
}

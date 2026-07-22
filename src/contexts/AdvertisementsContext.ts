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
  advertisements?: AdvertisementsMap;
  setAdvertisements: (advertisements: AdvertisementsMap) => void;
  lastLoaded?: string;
  setLastLoaded: (date: string) => void;
  latestAdvertisements?: Partial<Record<AdType, LatestAdvertisementItem>>;
  setLatestAdvertisements: (
    advertisements: Partial<Record<AdType, LatestAdvertisementItem>>
  ) => void;
  lastLatestLoaded?: string;
  setLastLatestLoaded: (date: string) => void;
  healthAdvertisements?: AdvertisementType[];
  setHealthAdvertisements: (healthAdvertisements: AdvertisementType[]) => void;
  lastHealtLoaded?: string;
  setLastHealtLoaded: (date: string) => void;
};

export const AdvertisementsContext = createContext<AdvertisementsContextType>({
  advertisements: undefined,
  setAdvertisements: () => {},
  lastLoaded: undefined,
  setLastLoaded: () => {},
  latestAdvertisements: undefined,
  setLatestAdvertisements: () => {},
  lastLatestLoaded: undefined,
  setLastLatestLoaded: () => {},
  healthAdvertisements: undefined,
  setHealthAdvertisements: () => {},
  lastHealtLoaded: undefined,
  setLastHealtLoaded: () => {}
});

export function useAdvertisementsContext() {
  const context = useContext(AdvertisementsContext);

  return context;
}

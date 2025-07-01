import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { createContext, useContext } from 'react';
import { AddType } from 'src/constants';

export type AdvertisementType = {
  type: AddType;
  date: string;
  text: string;
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

export type AdvertisementsContextType = {
  advertisements: AdvertisementsMap | undefined;
  setAdvertisements: (advertisements: AdvertisementsMap) => void;
};

export const AdvertisementsContext =
  createContext<AdvertisementsContextType>({
    advertisements: undefined,
    setAdvertisements: () => {}
  });

export function useAdvertisementsContext() {
  const context = useContext(AdvertisementsContext);

  return context;
}

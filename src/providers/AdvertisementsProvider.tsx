import { ReactNode, useState } from 'react';
import { AdType } from 'src/constants';
import {
  AdvertisementsContext,
  AdvertisementsMap,
  LatestAdvertisementItem
} from 'src/contexts/AdvertisementsContext';

export const AdvertisementsProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [advertisements, setAdvertisements] = useState<AdvertisementsMap>();
  const [lastLoaded, setLastLoaded] = useState<string>();
  const [latestAdvertisements, setLatestAdvertisements] = useState<Partial<Record<AdType, LatestAdvertisementItem>>>();
  return (
    <AdvertisementsContext.Provider
      value={{
        advertisements,
        setAdvertisements,
        lastLoaded,
        setLastLoaded,
        latestAdvertisements,
        setLatestAdvertisements
      }}
    >
      {children}
    </AdvertisementsContext.Provider>
  );
};

import { ReactNode, useState } from 'react';
import { AdType } from 'src/constants';
import {
  AdvertisementsContext,
  AdvertisementsMap,
  AdvertisementType,
  LatestAdvertisementItem
} from 'src/contexts/AdvertisementsContext';

export const AdvertisementsProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [advertisements, setAdvertisements] = useState<AdvertisementsMap>();
  const [lastLoaded, setLastLoaded] = useState<string>();
  const [latestAdvertisements, setLatestAdvertisements] =
    useState<Partial<Record<AdType, LatestAdvertisementItem>>>();
  const [lastLatestLoaded, setLastLatestLoaded] = useState<string>();
  const [healthAdvertisements, setHealthAdvertisements] = useState<AdvertisementType[]>();
  const [lastHealtLoaded, setLastHealtLoaded] = useState<string>();
  return (
    <AdvertisementsContext.Provider
      value={{
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
      }}
    >
      {children}
    </AdvertisementsContext.Provider>
  );
};

import { ReactNode, useState } from 'react';
import {
  AdvertisementsContext,
  AdvertisementsMap
} from 'src/contexts/AdvertisementsContext';

export const AdvertisementsProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [advertisements, setAdvertisements] = useState<AdvertisementsMap>();
  const [lastLoaded, setLastLoaded] = useState<string>();
  return (
    <AdvertisementsContext.Provider
      value={{
        advertisements,
        setAdvertisements,
        lastLoaded,
        setLastLoaded
      }}
    >
      {children}
    </AdvertisementsContext.Provider>
  );
};

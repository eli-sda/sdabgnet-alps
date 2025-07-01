import { ReactNode, useState } from 'react';
import { AdvertisementsContext } from 'src/contexts/AdvertisementsContext';
import { AdvertisementsMap } from 'src/contexts/AdvertisementsContext';

export const AdvertisementsProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [advertisements, setAdvertisements] =
    useState<AdvertisementsMap>();
  return (
    <AdvertisementsContext.Provider
      value={{
        advertisements,
        setAdvertisements
      }}
    >
      {children}
    </AdvertisementsContext.Provider>
  );
};

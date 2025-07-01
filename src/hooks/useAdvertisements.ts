import { AddType } from 'src/constants';
import {
  AdvertisementType,
  useAdvertisementsContext
} from 'src/contexts/AdvertisementsContext';
import { loadAdvertisements } from 'src/utils/FetchHelper';

export function useAdvertisements() {
  const { advertisements, setAdvertisements } = useAdvertisementsContext();

  const getAdvertisements = async () => {
    if (advertisements) {
      return advertisements;
    } else {
      const ads = await loadAdvertisements();

      setAdvertisements(ads);
      return ads;
    }
  };

  return { advertisements, getAdvertisements };
}

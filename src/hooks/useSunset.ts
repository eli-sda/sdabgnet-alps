import { useCallback } from 'react';
import { useSunsetContext } from 'src/contexts/SunsetContext';
import { loadSunset } from 'src/utils/FetchHelper';
import moment from 'moment';

function makeKey(monthDate: string | Date, lat: number, lng: number) {
  const m = moment(monthDate);
  return `${m.format('YYYY-MM')}-${lat.toFixed(4)}-${lng.toFixed(4)}`;
}

export function useSunset() {
  const { sunsetsMap, setSunsets } = useSunsetContext();

  const getSunsets = useCallback(
    async (monthDate: string | Date, lat: number, lng: number) => {
      const key = makeKey(monthDate, lat, lng);
      if (sunsetsMap && sunsetsMap[key]) return Promise.resolve(sunsetsMap[key]);

      const loaded = await loadSunset(monthDate, lat, lng);
      setSunsets(key, loaded);
      return loaded;
    },
    [sunsetsMap, setSunsets]
  );

  const getCached = useCallback(
    (monthDate: string | Date, lat: number, lng: number) => {
      const key = makeKey(monthDate, lat, lng);
      return sunsetsMap?.[key];
    },
    [sunsetsMap]
  );

  return { getSunsets, getCached };
}

export default useSunset;

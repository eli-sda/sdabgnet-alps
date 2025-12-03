import { useCallback } from 'react';
import { useSunsetContext, SunsetEvent } from 'src/contexts/SunsetContext';
import { loadSunset } from 'src/utils/FetchHelper';
import moment from 'moment';

function makeKey(monthDate: string | Date, lat: number, lng: number) {
  const m = moment(monthDate);
  return `${m.format('YYYY-MM')}-${lat.toFixed(4)}-${lng.toFixed(4)}`;
}
const fetchDates = (monthDate: string | Date) => {
  const m = moment(monthDate);
  const daysInMonth = m.daysInMonth();
  const dates: moment.Moment[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = m.clone().date(d);
    const dayOfWeek = date.isoWeekday(); // 5 = Fri, 6 = Sat
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      if (d === 1 && dayOfWeek === 6) {
        // add friday from the previous month
        const prevDate = date.clone().subtract(1, 'day');
        dates.push(prevDate);
      } else if (d === daysInMonth && dayOfWeek === 5) {
        // add saturday the 1st of next month
        const nextDate = date.clone().add(1, 'day');
        dates.push(nextDate);
      }
      dates.push(date);
    }
  }
  return dates;
};

export function useSunset() {
  const { sunsetsMap, setSunsets } = useSunsetContext();

  const setLoadingSunsets = useCallback(
    (key: string, dates: moment.Moment[]) => {
      const evts: SunsetEvent[] = dates.map((date) => ({
        title: '',
        start: date.toISOString(),
        end: date.toISOString()
      }));
      setSunsets(key, evts);
    },
    [setSunsets]
  );

  const getSunsets = useCallback(
    async (monthDate: string | Date, lat: number, lng: number) => {
      const key = makeKey(monthDate, lat, lng);
      if (sunsetsMap && sunsetsMap[key])
        return Promise.resolve(sunsetsMap[key]);

      const dates = fetchDates(monthDate);
      setLoadingSunsets(key, dates);
      const loaded = await loadSunset(dates, lat, lng);
      setSunsets(key, loaded);
      return loaded;
    },
    [sunsetsMap, setLoadingSunsets, setSunsets]
  );

  return { getSunsets };
}

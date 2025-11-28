import { useEffect, useState, useMemo, useCallback } from 'react';
import moment from 'moment';
import 'moment/dist/locale/bg';
moment.locale('bg');
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import { TbSunset2 } from 'react-icons/tb';
import { GridItem } from 'alps-library/atoms/grids/GridItem';
import { Pullquote } from 'alps-library/molecules/text/pullquote/Pullquote';
import { Button } from 'src/alps/atoms/Button';
import { Page } from 'src/organisms/Page';
import { InfoDialog } from 'src/organisms/sections/InfoDialog';
import routes from 'src/routes';
import { getTitle } from 'src/utils/Navigation';
import { usePagesMeta } from 'src/hooks/usePagesMeta';
import useSunset from 'src/hooks/useSunset';
import { SunsetEvent } from 'src/contexts/SunsetContext';

import '../events/reactBigCalendarStyles.scss';
import '../events/customCalendar.scss';
import './sunsetCalendar.scss';

const localizer = momentLocalizer(moment);

interface NominatimResponse {
  lat: string;
  lon: string;
}

interface CustomToolbarProps {
  label: string;
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY' | 'DATE') => void;
}

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
};

const SunsetCalendar = (): JSX.Element => {
  const breadcrumbsUrls = [routes.info(), routes.info('sunset')];
  const { pageBackground } = usePagesMeta();

  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const [city, setCity] = useState('София');
  const [coords, setCoords] = useState({ lat: 42.6977, lng: 23.3219 });
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(
    moment().date(1).toDate()
  );
  const [currentMonth, setCurrentMonth] = useState<number>(moment().month());

  const allowedMonths = useMemo(() => {
    const now = moment();
    return [currentMonth, now.clone().add(1, 'month').month()];
  }, [currentMonth]);

  const isNextDisabled = useMemo(() => {
    const now = moment();
    const next = now.clone().add(1, 'month');
    return moment(currentCalendarDate).isSame(next, 'month');
  }, [currentCalendarDate]);

  const { getSunsets } = useSunset();

  const loadAndSetSunsets = useCallback(
    async (monthDate: Date | string, lat: number, lng: number) => {
      try {
        const loaded = (await getSunsets(monthDate, lat, lng)) as SunsetEvent[];
        const mapped = (loaded || []).map((e) => ({
          title: e.title,
          start: new Date(e.start),
          end: new Date(e.end)
        }));
        setEvents(mapped);
      } catch (err) {
        console.error('loadAndSetSunsets error', err);
        setEvents([]);
      }
    },
    [getSunsets]
  );

  // Fetch coordinates for a city using Nominatim
  const fetchCoords = useCallback(async (): Promise<void> => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
        city
      )}&countrycodes=bg&format=json`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'sdaBgNetwork' }
      });
      const data = (await res.json()) as NominatimResponse[];

      if (data && data.length > 0) {
        setCoords({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        });

        // Load sunsets for the found coords immediately and set events
        await loadAndSetSunsets(
          currentCalendarDate,
          parseFloat(data[0].lat),
          parseFloat(data[0].lon)
        );
      } else {
        setInfoMessage('Населеното място не е намерено.');
      }
    } catch (err) {
      console.error('fetchCoords error', err);
      setInfoMessage(
        'Грешка при търсене на населеното място. Моля опитайте отново.'
      );
    }
  }, [city, currentCalendarDate, loadAndSetSunsets]);

  const CustomToolbar = ({ label, onNavigate }: CustomToolbarProps) => {
    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <Button
            className="calendar-button"
            label="Текущ"
            onClick={() => onNavigate('TODAY')}
            outline
            disabled={!isNextDisabled}
          />

          <Button
            className="calendar-button"
            label="Следващ"
            onClick={() => onNavigate('NEXT')}
            outline
            disabled={isNextDisabled}
          />
        </span>

        <span className="rbc-toolbar-label">{label}</span>
      </div>
    );
  };

  // Refresh events whenever coords or month change
  useEffect(() => {
    void (async () => {
      await loadAndSetSunsets(currentCalendarDate, coords.lat, coords.lng);
    })();
  }, [loadAndSetSunsets, currentCalendarDate, coords]);

  const onNavigate = (date: Date) => {
    const m = moment(date).month();
    if (!allowedMonths.includes(m)) return; // block other months
    setCurrentCalendarDate(date);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();
      console.log(`in sunset today: ${now.format('YYYY-MM-DD')}`);
      if (!now.isSame(currentMonth, 'month')) {
        setCurrentMonth(now.month());
      }
    }, 60 * 1000 * 60); // Check every hour

    return () => clearInterval(interval);
  }, [currentMonth]);

  return (
    <Page
      title={getTitle(routes.info('sunset'))}
      background={pageBackground}
      breadcrumbsUrls={breadcrumbsUrls}
      blockType="wrap6"
      pageClassName="sunset-page"
    >
      {/* <section className="l-grid-item l-grid-item--7-col u-space--bottom"> */}
      <GridItem className="c-article" sizeAtM="6">
        {infoMessage && (
          <InfoDialog
            message={infoMessage}
            onClose={() => setInfoMessage(null)}
          />
        )}

        <Pullquote
          quote="„Помни съботния ден, за да го освещаваш. Шест дни да работиш и да вършиш всичките си дела;“"
          author="Изх. 20:8,9"
        />
        <Pullquote
          quote="„... от вечер до вечер, да пазите съботата си“"
          author="Левит 23:32"
        />

        <div className="city-input">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Населено място"
          />

          <Button
            label="Покажи"
            onClick={(): void => {
              void fetchCoords();
            }}
          />
        </div>
        {/* </section> */}
      </GridItem>
      <GridItem sizeAtM="6" sizeAtXL="6">
        <Calendar
          localizer={localizer}
          events={events}
          date={currentCalendarDate}
          onNavigate={onNavigate}
          views={[Views.MONTH]}
          startAccessor="start"
          endAccessor="end"
          components={{
            toolbar: CustomToolbar,
            event: ({ event }: { event: CalendarEvent }) => (
              <div className="rbc-event-content">
                <TbSunset2 />
                <br />
                <span>{event.title}</span>
              </div>
            )
          }}
          style={{ minHeight: 600, maxWidth: 1000, margin: '0 auto' }}
          min={new Date(2020, 1, 1, 16, 0)}
          max={new Date(2020, 1, 1, 22, 0)}
          messages={{ next: 'Следващ', previous: 'Предишен', today: 'Текущ' }}
        />
      </GridItem>
    </Page>
  );
};

export default SunsetCalendar;

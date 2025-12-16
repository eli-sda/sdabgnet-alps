import { useEffect, useState, useMemo, useCallback } from 'react';
import moment from 'moment';
import 'moment/dist/locale/bg';
moment.locale('bg');
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import { TbSunset2 } from 'react-icons/tb';
import { GridItem } from 'alps-library/atoms/grids/GridItem';
import { BaseSearch } from 'alps-library/molecules/forms/elements/BaseSearch';
import { Pullquote } from 'alps-library/molecules/text/pullquote/Pullquote';
import { Caption } from 'alps-library/atoms/text/Caption';
import { Button } from 'src/alps/atoms/Button';
import { Page } from 'src/organisms/Page';
import { InfoDialog } from 'src/organisms/sections/InfoDialog';
import routes from 'src/routes';
import { SITE } from 'src/constants';
import { getTitle } from 'src/utils/Navigation';
import { usePagesMeta } from 'src/hooks/usePagesMeta';
import { useSunset } from 'src/hooks/useSunset';

import '../events/reactBigCalendarStyles.scss';
import '../events/customCalendar.scss';
import './sunsetCalendar.scss';

const localizer = momentLocalizer(moment);
const formats = {
  dateFormat: 'D', // the day without leading zero
  weekdayFormat: 'dd' // short names for the days (Пн, Вт, Ср...)
};

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
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

  // Load last searched city from localStorage
  const [city, setCity] = useState<string>(() => {
    return localStorage.getItem('sunset_last_city') || 'София';
  });
  const [name, setName] = useState<string>();
  const [coords, setCoords] = useState<{ lat: number; lng: number }>();
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
        const loaded = await getSunsets(monthDate, lat, lng);
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
    if (city == null || city.trim() === '') {
      setInfoMessage('Моля, въведете населено място.');
      return;
    }
    try {
      const url = `${SITE}/nominatim-proxy.php?city=${encodeURIComponent(
        city
      )}`;
      const res = await fetch(url);
      const data = (await res.json()) as
        | NominatimResponse[]
        | { error: string };

      // Check if response is an error
      if ('error' in data) {
        setInfoMessage(data.error);
        return;
      }

      if (data && data.length > 0) {
        setCoords({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        });
        setName(data[0].display_name);

        // Save the city to localStorage
        localStorage.setItem('sunset_last_city', city);
      } else {
        setInfoMessage('Населеното място не е намерено.');
      }
    } catch (err) {
      console.error('fetchCoords error', err);
      setInfoMessage(
        'Грешка при търсене на населеното място. Моля опитайте отново.'
      );
    }
  }, [city]);

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
    if (coords == null) return;
    void (async () => {
      await loadAndSetSunsets(currentCalendarDate, coords.lat, coords.lng);
    })();
  }, [loadAndSetSunsets, currentCalendarDate, coords]);

  // Load saved city coordinates on initial mount (only if there's a saved city)
  useEffect(() => {
    if (city) {
      void fetchCoords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const onNavigate = (date: Date) => {
    const m = moment(date).month();
    if (!allowedMonths.includes(m)) return; // block other months
    setCurrentCalendarDate(date);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();
      if (import.meta.env.DEV) {
        console.log(`in sunset today: ${now.format('YYYY-MM-DD')}`);
      }
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
        <section className="city-section u-spacing--half u-padding--bottom">
          <BaseSearch
            placeholder="Гр./с. (напр. Баня, Сливен)"
            searchLabel="Покажи залезите"
            onSearch={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCity(e.target.value)
            }
            onSubmit={() => {
              void fetchCoords();
            }}
          ></BaseSearch>
          <Caption>{name}</Caption>
        </section>
      </GridItem>
      <GridItem sizeAtM="6" sizeAtXL="6">
        <Calendar
          localizer={localizer}
          formats={formats}
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
                {event.title ? (
                  <span>{event.title}</span>
                ) : (
                  <i className="fas fa-spinner fa-pulse u-space--quarter"></i>
                )}
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

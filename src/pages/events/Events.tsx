import { useEffect, useState } from 'react';
import { parse, format, startOfWeek as dfStartOfWeek, getDay } from 'date-fns';
import { bg } from 'date-fns/locale';
import routes from 'src/routes';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import './reactBigCalendarStyles.scss';
import './customCalendar.scss';
import { getTitle, getBreadcrumbs } from 'src/utils/Navigation';
import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import { PageContent } from 'src/alps/organisms/content/PageContent';

// Define available locales
const locales = {
  bg: bg
};

// Ensure the week starts on Monday using Bulgarian locale
const startOfWeek = (date: Date) => {
  return dfStartOfWeek(date, { locale: bg });
};

// Create a dateFns localizer with explicit use of the Bulgarian locale
const localizer = dateFnsLocalizer({
  format: (date: Date, formatStr: string) =>
    format(date, formatStr, { locale: bg }),
  parse: (value: string, formatStr: string) =>
    parse(value, formatStr, new Date(), { locale: bg }),
  startOfWeek,
  getDay,
  locales
});

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  link?: string;
};

const Event = ({ event }: { event: CalendarEvent }) =>
  event.link ? (
    <a href={event.link} target="_blank" rel="noopener noreferrer">
      {event.title}
    </a>
  ) : (
    <span>{event.title}</span>
  );

const Events = () => {
  const breadcrumbsUrls = [routes.churchLife(), routes.churchLife('events')];
  const [parsedEvents, setParsedEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    fetch('/calendar.json')
      .then((res) => res.json())
      .then(
        (
          events: Array<{
            title: string;
            start: string;
            end?: string;
            link?: string;
          }>
        ) => {
          setParsedEvents(
            events.map(({ title, start, end, link }) => ({
              title,
              start: new Date(start),
              end: new Date(end ?? start),
              link: link || ''
            }))
          );
        }
      )
      .catch((err) => {
        console.error('Failed to load calendar.json', err);
        setParsedEvents([]);
      });
  }, []);

  // Set agenda view to always start from the 1st of the current month
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const formats = {
    agendaDateFormat: 'd.MM' // Use date-fns format string
  };

  const breadcrumbs = getBreadcrumbs(breadcrumbsUrls);
  const title = getTitle(routes.churchLife('events'));

  return (
    <>
      <PageHeaderLong title={title} />
      <PageContent breadcrumbs={breadcrumbs}>
        <div
          style={{
            margin: '0 auto',
            maxWidth: '1200px',
            padding: '0.5rem 1rem'
          }}
        >
          <Calendar
            localizer={localizer}
            events={parsedEvents}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            tooltipAccessor="title"
            style={{ height: 600 }}
            defaultDate={firstOfMonth} // Start agenda view from the 1st of the month
            formats={formats}
            onSelectEvent={(event) => {
              if (event.link) {
                window.open(event.link, '_blank');
              }
            }}
            components={{
              event: Event
            }}
            popup
            messages={{
              showMore: (total) => `+ още ${total}`,
              allDay: 'Цял ден',
              next: 'Следващ',
              previous: 'Предишен',
              today: 'Текущ',
              month: 'Месец',
              agenda: 'График',
              date: 'Дата',
              time: 'Час',
              event: 'Събитие',
              noEventsInRange: 'Няма събития в този период'
            }}
            views={['month', 'agenda']}
            defaultView="month"
            culture="bg" // Ensures Bulgarian culture is applied
          />
        </div>
      </PageContent>
    </>
  );
};

export default Events;

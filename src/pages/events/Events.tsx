import { Page } from 'src/organisms/Page';
import routes from 'src/routes';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import './reactBigCalendarStyles.scss';

import { parse, format, startOfWeek as dfStartOfWeek, getDay } from 'date-fns';
import { bg } from 'date-fns/locale';
import events from './calendar.json';

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

const Events = () => {
  const breadcrumbsUrls = [routes.churchLife(), routes.churchLife('events')];

  // Convert string dates to Date objects
  const parsedEvents = events.map(({ title, start, end, link }) => ({
    title,
    start: new Date(start),
    end: new Date(end ?? start),
    link: link || ''
  }));

  return (
    <Page
      title="Събития организирани от ЦАСД България"
      breadcrumbsUrls={breadcrumbsUrls}
    >
      <Calendar
        localizer={localizer}
        events={parsedEvents}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        tooltipAccessor="title"
        style={{ height: 600 }}
        onSelectEvent={(event) => {
          if (event.link) {
            window.open(event.link, '_blank');
          }
        }}
        popup
        messages={{
          showMore: (total) => `+ още ${total}`,
          allDay: 'Цял ден',
          next: 'Следващ',
          previous: 'Предишен',
          today: 'Днес',
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
    </Page>
  );
};

export default Events;

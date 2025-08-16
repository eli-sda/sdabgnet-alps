import { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/dist/locale/bg';
moment.locale('bg');
import routes from 'src/routes';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import './reactBigCalendarStyles.scss';
import './customCalendar.scss';
import { getTitle, getBreadcrumbs } from 'src/utils/Navigation';
import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import { PageContent } from 'src/alps/organisms/content/PageContent';
import { Grid } from 'alps-library/atoms/grids/Grid';
import { GridItem } from 'alps-library/atoms/grids/GridItem';

// Ensure the week starts on Monday using Bulgarian locale
const localizer = momentLocalizer(moment);

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  link?: string;
  allDay: boolean;
};

const Event = ({ event }: { event: CalendarEvent }) =>
  event.link ? (
    <a href={event.link} target="_blank" rel="noopener noreferrer">
      {event.title}
    </a>
  ) : (
    <span>{event.title}</span>
  );

const formats = {
  agendaDateFormat: 'D.MM',
  dayHeaderFormat: 'dddd, D MMMM', // напр. "понеделник, 4 август"
  dayFormat: 'dd', // Пн, Вт, Ср...
  weekdayFormat: 'dddd', // Понеделник, Вторник...
  monthHeaderFormat: 'MMMM YYYY' // август 2025
};

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
          const calendarEvents: CalendarEvent[] = events.map(
            ({ title, start, end, link }) => {
              const isAllDayStart = !/T\d{2}:\d{2}/.test(start);
              const startDate = isAllDayStart
                ? moment(start, 'YYYY-MM-DD').toDate()
                : moment(start).toDate();
              let endDate;
              let isAllDayEnd = false;
              if (end) {
                isAllDayEnd = !/T\d{2}:\d{2}/.test(end);
                endDate = isAllDayEnd
                  ? moment(end, 'YYYY-MM-DD').toDate()
                  : moment(end).toDate();
              } else {
                endDate = startDate;
                isAllDayEnd = isAllDayStart;
              }
              return {
                title,
                start: startDate,
                end: endDate,
                link: typeof link === 'string' ? link : '',
                allDay: isAllDayStart && isAllDayEnd
              };
            }
          );
          setParsedEvents(calendarEvents);
        }
      )
      .catch((err) => {
        console.error('Failed to load calendar.json', err);
        setParsedEvents([]);
      });
  }, []);

  // Set agenda view to always start from the 1st of the current month
  const today = new Date();

  const getFirstOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1);
  const [currentDate, setCurrentDate] = useState<Date>(getFirstOfMonth(today));

  const handleNavigate = (date: Date, view: string, action: string) => {
    if (view === 'agenda') {
      let newDate;
      if (action === 'NEXT') {
        // If next month, set to the first day of the next month
        newDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          1
        );
      } else if (action === 'PREV') {
        // If previous month, set to the first day of the previous month
        newDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          1
        );
      } else {
        // ТЕКУЩ (current month) - set the first day of the current month
        newDate = new Date(date.getFullYear(), date.getMonth(), 1);
      }
      setCurrentDate(newDate);
    } else {
      setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  const handleView = (view: string) => {
    if (view === 'agenda' || view === 'month') {
      // on view change set the first day of the current month
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      );
    }
  };

  const breadcrumbs = getBreadcrumbs(breadcrumbsUrls);
  const title = getTitle(routes.churchLife('events'));

  return (
    <>
      <PageHeaderLong title={title} />
      <PageContent breadcrumbs={breadcrumbs}></PageContent>
      <Grid
        className={'l-grid l-grid--7-col l-grid-wrap l-grid-wrap--6-of-7'}
        seven={true}
        as="section"
        wrap={'6'}
      >
        <GridItem
          className={
            'u-padding--sides u-space--triple--bottom l-grid-item page-link-item'
          }
          sizeAtM={'6'}
          sizeAtXL={'6'}
        >
          <Calendar
            localizer={localizer}
            events={parsedEvents}
            style={{ height: 600, maxWidth: 1000, margin: '0 auto' }}
            date={currentDate}
            formats={formats}
            onSelectEvent={(event) => {
              if (event.link) {
                window.open(event.link, '_blank');
              }
            }}
            onNavigate={handleNavigate}
            onView={handleView}
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
          />
        </GridItem>
      </Grid>
    </>
  );
};

export default Events;

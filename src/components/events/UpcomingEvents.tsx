import { useMemo } from 'react';
import moment from 'moment';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { Button } from 'src/alps/atoms/Button';
import { useCalendarEvents } from 'src/hooks/useCalendarEvents';

const formatEventDateRange = (start: string, end?: string) => {
  const startDate = moment(start);

  // If there is no end date, return just the start date
  if (!end) {
    return startDate.format('DD.MM.YYYY');
  }

  const endDate = moment(end);

  // If start and end are on the exact same day
  if (startDate.isSame(endDate, 'day')) {
    return startDate.format('DD.MM.YYYY');
  }

  // If they are in the same month and year (e.g., 22 - 25.07.2026)
  if (startDate.isSame(endDate, 'month')) {
    return `${startDate.format('DD')} - ${endDate.format('DD.MM.YYYY')}`;
  }

  // If they are in the same year, but different months (e.g., 28.06 - 26.07.2026)
  if (startDate.isSame(endDate, 'year')) {
    return `${startDate.format('DD.MM')} - ${endDate.format('DD.MM.YYYY')}`;
  }

  // If they are in completely different years (e.g., 30.12.2026 - 03.02.2027)
  return `${startDate.format('DD.MM.YYYY')} - ${endDate.format('DD.MM.YYYY')}`;
};

const UpcomingEvents = () => {
  const { upcoming, openForRegistration } = useCalendarEvents();
  const events = useMemo(() => {
    const num = Math.max(openForRegistration.length, 3);
    return upcoming.slice(0, num);
  }, [upcoming, openForRegistration]);
  if (!events.length) return null;

  return (
    <div>
      <HeadingBlock title="Скорошни събития" />
      <div>
        {events.map((event, i) => (
          <h3
            key={i}
            className="c-block__title hyphens-auto u-font--primary--s u-space--half u-theme--color--dark"
          >
            <i
              className="far fa-calendar-alt u-space--half--right"
              aria-hidden="true"
            />
            {formatEventDateRange(event.start, event.end)}
            <br />
            {event.link ? (
              <a href={event.link} target="_blank" rel="noopener noreferrer">
                {event.title}
                <i
                  className="fas fa-external-link-alt u-space--half--left"
                  aria-hidden="true"
                />
              </a>
            ) : (
              event.title
            )}
          </h3>
        ))}

        <Button
          as="a"
          url="/church_life/events"
          label="Виж календара"
          icon="arrow-long-right"
          iconSize="s"
          iconPosition="right"
          outline
        />
      </div>
    </div>
  );
};

export default UpcomingEvents;

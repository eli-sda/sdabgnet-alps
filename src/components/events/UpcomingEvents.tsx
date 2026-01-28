import { useMemo } from 'react';
import moment from 'moment';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { Button } from 'src/alps/atoms/Button';
import { useCalendarEvents } from 'src/hooks/useCalendarEvents';

const UpcomingEvents = () => {
  const { upcoming } = useCalendarEvents();
  const events = useMemo(() => upcoming.slice(0, 3), [upcoming]);

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
            {moment(event.start).format('DD.MM.YYYY')}
            <br />
            {event.title}
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

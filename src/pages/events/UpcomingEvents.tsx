import { useEffect, useState } from 'react';
import moment from 'moment';
import { Button } from 'src/alps/atoms/Button';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';

type SimpleEvent = {
  title: string;
  start: string;
};

const UpcomingEvents = () => {
  const [events, setEvents] = useState<SimpleEvent[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await fetch('/calendar.json');
        const data = (await res.json()) as SimpleEvent[];

        const today = moment().startOf('day');

        const upcoming = data
          .filter((e) => moment(e.start).isAfter(today))
          .sort(
            (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
          )
          .slice(0, 3);

        setEvents(upcoming);
      } catch (err) {
        console.error('Failed to load calendar.json', err);
        setEvents([]);
      }
    };

    void loadEvents();
  }, []);

  if (!events.length) return null;

  return (
    <div className="u-spacing--half">
      <HeadingBlock title="Предстоящи събития" />
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
          outline
        />
      </div>
    </div>
  );
};

export default UpcomingEvents;

import { useEffect, useState } from 'react';
import moment from 'moment';
import { Button } from 'src/alps/atoms/Button';

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
    <div>
      <div className="c-block__heading u-theme--border-color--darker">
        <h3 className="c-block__heading-title u-theme--color--darker">
          Предстоящи събития
        </h3>
      </div>

      {events.map((event, i) => (
        <h3
          key={i}
          className="c-block__title hyphens-auto u-font--primary--s u-space--half u-theme--color--dark"
        >
          <i
            className="fa fa-calendar-o u-space--half--right"
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
  );
};

export default UpcomingEvents;

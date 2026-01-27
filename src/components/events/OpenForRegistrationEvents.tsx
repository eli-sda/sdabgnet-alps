import { useEffect, useState } from 'react';
import moment from 'moment';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';

type SimpleEvent = {
  title: string;
  start: string;
  endRegistration?: string;
  link?: string;
};

const OpenForRegistrationEvents = () => {
  const [events, setEvents] = useState<SimpleEvent[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await fetch('/json/calendar-2026.json');
        const data = (await res.json()) as SimpleEvent[];

        const today = moment().startOf('day');

        const openRegistration = data
          .filter((e) => moment(e.start).isAfter(today))
          .filter(
            (e) =>
              e.link &&
              e.endRegistration &&
              moment(e.endRegistration).isAfter(today)
          )
          .sort(
            (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
          )
          .slice(0, 3);

        setEvents(openRegistration);
      } catch (err) {
        console.error('Failed to load calendar-2026.json', err);
        setEvents([]);
      }
    };

    void loadEvents();
  }, []);

  if (!events.length) return null;

  return (
    <div className="u-spacing--half">
      <HeadingBlock title="Тече записване" />
      <div>
        {events.map((event, i) => (
          <h3
            key={i}
            className="c-block__title hyphens-auto u-font--primary--s u-space--half u-theme--color--dark"
          >
            до {moment(event.endRegistration).format('DD.MM.YYYY')}
            <br />
            <a href={event.link} target="_blank" rel="noopener noreferrer">
              {event.title}
              <i
                className="fas fa-external-link-alt u-space--half--left"
                aria-hidden="true"
              />
            </a>
          </h3>
        ))}
      </div>
    </div>
  );
};

export default OpenForRegistrationEvents;

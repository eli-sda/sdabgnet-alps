import moment from 'moment';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { useCalendarEvents } from 'src/hooks/useCalendarEvents';

const OpenForRegistrationEvents = () => {
  const { openForRegistration } = useCalendarEvents();

  if (!openForRegistration.length) return null;

  return (
    <div>
      <HeadingBlock title="Тече записване" />
      <div>
        {openForRegistration.map((event, i) => (
          <h3
            key={i}
            className="c-block__title hyphens-auto u-font--primary--s u-space--half u-theme--color--dark"
          >
            <i
              className="far fa-clock u-space--half--right"
              aria-hidden="true"
            />
            до {moment(event.endRegistration).format('DD.MM.YYYY')}
            <br />
            <a href={event.link} target="_blank" rel="noopener noreferrer">
              за {event.title}
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

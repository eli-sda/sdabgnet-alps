import UpcomingEvents from 'src/components/events/UpcomingEvents';
import OpenForRegistrationEvents from 'src/components/events/OpenForRegistrationEvents';
import './HomeEvents.scss';

export const HomeEvents = () => {
  return (
    <section id="home-events" className="home-events">
      <div className="home-events-container">
        <UpcomingEvents />
        <OpenForRegistrationEvents />
      </div>
    </section>
  );
};

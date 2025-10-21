import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import AudioPage from './AudioPage';

const AudioSeminarsResources = () => {
  const { getPlaylists } = usePlaylists();
  const [presentations, setPresentations] = useState<PlaylistType[]>([]);
  const [seminars, setSeminars] = useState<PlaylistType[]>([]);

  useEffect(() => {
    getPlaylists('seminars')
      .then(setSeminars)
      .catch((err) => console.error(err));
  }, [getPlaylists]);

  useEffect(() => {
    getPlaylists('presentations')
      .then(setPresentations)
      .catch((err) => console.error(err));
  }, [getPlaylists]);

  // Function to find matching presentations for a seminar
  const findMatchingPresentations = (seminarTitle: string) => {
    return presentations.filter((presentation) =>
      presentation.title?.toLowerCase().includes(seminarTitle.toLowerCase())
    );
  };

  // Create aside content with related presentations
  const asideContent =
    seminars.length > 0 ? (
      <div>
        <div className="c-block__heading u-theme--border-color--darker">
          <h3 className="c-block__heading-title u-theme--color--darker">
            Презентации към семинари
          </h3>
        </div>

        {seminars
          .map((seminar) => {
            if (!seminar.title) return null;

            const matchingPresentations = findMatchingPresentations(
              seminar.title
            );
            if (matchingPresentations.length === 0) return null;

            return (
              <div key={seminar._id} id={`presentations-${seminar._id}`}>
                {matchingPresentations.map((presentation) => (
                  <h3
                    key={presentation._id}
                    className="c-block__title hyphens-auto u-font--primary--s u-space--half u-theme--color--dark"
                  >
                    <NavLink
                      className="c-block__title-link u-theme--link-hover--dark active"
                      to={`${window.location.origin}/resources/presentation#${presentation._id}`}
                    >
                      <i
                        className={`fa fa-file-powerpoint-o u-space--half--right`}
                        aria-hidden="true"
                      ></i>
                      {presentation.title}
                    </NavLink>
                  </h3>
                ))}
              </div>
            );
          })
          .filter(Boolean)}
      </div>
    ) : null;

  return <AudioPage type="seminars" aside={asideContent ?? undefined} />;
};
export default AudioSeminarsResources;

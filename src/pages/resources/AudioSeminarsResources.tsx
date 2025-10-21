import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { SeminarRelatedPresentationsType } from 'src/contexts/PlaylistsContext';
import AudioPage from './AudioPage';

const AudioSeminarsResources = () => {
  const { getSeminarRelatedPresentations } = usePlaylists();
  const [presentations, setPresentations] = useState<
    SeminarRelatedPresentationsType[]
  >([]);

  useEffect(() => {
    getSeminarRelatedPresentations()
      .then(setPresentations)
      .catch((err) => console.error(err));
  }, [getSeminarRelatedPresentations]);

  // Create aside content with related presentations
  const asideContent =
    presentations.length > 0 ? (
      <div>
        <div className="c-block__heading u-theme--border-color--darker">
          <h3 className="c-block__heading-title u-theme--color--darker">
            Презентации към семинари
          </h3>
        </div>

        {presentations.map((presentation) => {
          return (
            <div
              key={presentation._id}
              id={`presentations-${presentation._id}`}
            >
              <h3 className="c-block__title hyphens-auto u-font--primary--s u-space--half u-theme--color--dark">
                <NavLink
                  className="c-block__title-link u-theme--link-hover--dark active"
                  to={`/resources/presentation#${presentation._id}`}
                >
                  <i
                    className={`fa fa-file-powerpoint-o u-space--half--right`}
                    aria-hidden="true"
                  ></i>
                  {presentation.title}
                </NavLink>
              </h3>
            </div>
          );
        })}
      </div>
    ) : null;

  return <AudioPage type="seminars" aside={asideContent ?? undefined} />;
};
export default AudioSeminarsResources;

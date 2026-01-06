import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { SeminarRelatedPresentationsType } from 'src/contexts/PlaylistsContext';
import { usePlaylists } from 'src/hooks/usePlaylists';
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
      <>
        <HeadingBlock title="Презентации към семинари" />
        <div>
          {presentations.map((presentation, i) => {
            return (
              <h3
                key={i}
                className="c-block__title hyphens-auto u-font--primary--s u-space--half u-theme--color--dark"
              >
                <NavLink
                  className="c-block__title-link u-theme--link-hover--dark active"
                  to={`/resources/presentation#${presentation._id}`}
                >
                  <i
                    className={`far fa-file-powerpoint u-space--half--right`}
                    aria-hidden="true"
                  ></i>
                  {presentation.title}
                </NavLink>
              </h3>
            );
          })}
        </div>
      </>
    ) : null;

  return <AudioPage type="seminars" aside={asideContent ?? undefined} />;
};
export default AudioSeminarsResources;

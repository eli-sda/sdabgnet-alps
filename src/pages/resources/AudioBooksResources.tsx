import AudioPage from './AudioPage';
import audiobooksForChildrenData from './audiobooksForChildren.json';

type audiobooksForChildrenType = {
  title: string;
  url: string;
};

const AudiobooksResources = () => {
  const audiobooksForChildren: audiobooksForChildrenType[] =
    audiobooksForChildrenData;

  // Create aside content with audiobooksForChildren
  const asideContent =
    audiobooksForChildren.length > 0 ? (
      <div>
        <div className="c-block__heading u-theme--border-color--darker">
          <h3 className="c-block__heading-title u-theme--color--darker">
            Детски аудиокниги
          </h3>
        </div>

        {audiobooksForChildren.map((audiobook, i) => {
          return (
            <div key={i} id={`audiobooksForChildren-${i}`}>
              <h3 className="c-block__title hyphens-auto u-font--primary--s u-space--half u-theme--color--dark">
                <a
                  href={audiobook.url}
                  className="c-block__title hyphens-auto u-font--primary--s u-space--half u-theme--color--dark"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i
                    className={`fa fa-youtube u-space--half--right`}
                    aria-hidden="true"
                  ></i>
                  {audiobook.title}
                </a>
              </h3>
            </div>
          );
        })}
      </div>
    ) : null;

  return <AudioPage type="audio-book" aside={asideContent ?? undefined} />;
};
export default AudiobooksResources;

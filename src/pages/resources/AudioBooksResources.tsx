import { Figure } from 'alps-library/molecules/media/figure/Figure';
import AudioPage from './AudioPage';
import audiobooksForChildrenData from './audiobooksForChildren.json';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';

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
        <div className="u-space--bottom">
          <HeadingBlock title="Детски аудиокниги" />
        </div>

        {audiobooksForChildren.map((audiobook, i) => {
          return (
            <Figure
              key={i}
              align="left"
              caption={audiobook.title}
              size="large"
              videoSrc={audiobook.url}
            />
          );
        })}
      </div>
    ) : null;

  return <AudioPage type="audiobook" aside={asideContent ?? undefined} />;
};
export default AudiobooksResources;

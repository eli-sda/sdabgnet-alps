import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { Figure } from 'alps-library/molecules/media/figure/Figure';
import audiobooksForChildrenData from './audiobooksForChildren.json';
import AudioPage from '../AudioPage';
import { useMemo } from 'react';
import { RelatedPosts } from 'src/alps/organisms/asides/RelatedPosts';

type audiobooksForChildrenType = {
  title: string;
  url: string;
};

const AudiobooksResources = () => {
  const audiobooksForChildren: audiobooksForChildrenType[] =
    audiobooksForChildrenData;

  // Create aside content with audiobooksForChildren
  const asideContent = useMemo(
    () => (
      <>
        {audiobooksForChildren.length > 0 && (
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
        )}
        <div>
          <RelatedPosts
            heading="Други аудиокниги"
            blocks={[
              {
                title: 'Срещи с Христос',
                url: 'https://3-16.bg/sreshti-s-hristos/',
                category: '3-16.br'
              }
            ]}
          />
        </div>
      </>
    ),
    [audiobooksForChildren]
  );

  return <AudioPage type="audiobook" aside={asideContent ?? undefined} />;
};
export default AudiobooksResources;

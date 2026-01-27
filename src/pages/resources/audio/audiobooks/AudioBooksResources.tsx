import { useMemo } from 'react';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { Figure } from 'alps-library/molecules/media/figure/Figure';
import { RelatedPosts } from 'src/alps/organisms/asides/RelatedPosts';
import { BaseLinkType } from 'src/organisms/PageLinkItem';
import audiobooksForChildrenData from './audiobooksForChildren.json';
import AudioPage from '../AudioPage';
import './AudiobooksResources.scss';

const youTubeAudiobooks = {
  heading: 'Аудииокниги в YouTube',
  blocks: [
    {
      title: 'Елън Уайт - Свидетелства към църквата - том 1',
      url: 'https://www.youtube.com/playlist?list=PLVYPzB4Uygi8x41Z2FSkoIuBVhZD8i_ce'
    },
    {
      title: 'Елън Уайт - Свидетелства към църквата - том 2',
      url: 'https://www.youtube.com/playlist?list=PLVYPzB4Uygi_o1Ll7xE6no5489C3xPl9Y'
    },
    {
      title: 'Елън Уайт - Свидетелства към църквата - том 3',
      url: 'https://www.youtube.com/playlist?list=PLVYPzB4Uygi-y7lThJ7GUKZ9M3CdQ1vRI'
    },
    {
      title: 'СВИДЕТЕЛСТВА КЪМ ЦЪРКВАТА ТОМ 4',
      url: 'https://www.youtube.com/playlist?list=PLqis216kTTZmp0lAa3ryrzUWwjspxQ02R'
    },
    {
      title: 'Елън Уайт - Свидетелства към църквата - том 5',
      url: 'https://www.youtube.com/playlist?list=PLVYPzB4Uygi_HlIiKEJ2AWSI4BzRspiHu'
    },
    {
      title: 'СВИДЕТЕЛСТВА КЪМ ЦЪРКВАТА ТОМ 6',
      url: 'https://www.youtube.com/playlist?list=PLqis216kTTZnFnH-AQYfbcrYGL4p7AWs-'
    },
    {
      title: 'Том 7 - Свидетелства към църквата',
      url: 'https://www.youtube.com/playlist?list=PLENr8lV9VWpd1AJYWYcq0RX0hQ5WPwwiL'
    },
    {
      title: 'Елън Уайт - Свидетелства към църквата - том 8',
      url: 'https://www.youtube.com/playlist?list=PLVYPzB4Uygi_0ZTS0MrtyV-uK5G64lVBB'
    },
    {
      title: 'Елън Уайт - Свидетелства към църквата - том 9',
      url: 'https://www.youtube.com/playlist?list=PLVYPzB4Uygi-cL1PXwq2fYdlC9d9aXEjw'
    },
    {
      title: 'Елън Уайт - Евангелизъм - книга 1',
      url: 'https://www.youtube.com/playlist?list=PLVYPzB4Uygi8QDRtxayIqXQbtkOePflQE'
    },
    {
      title: 'Елън Уайт - Евангелизъм - книга 2',
      url: 'https://www.youtube.com/playlist?list=PLVYPzB4Uygi9LJ7YISoRlqQf3whFTNe5l'
    },
    {
      title: 'Елън Уайт - Евангелизъм - книга 3',
      url: 'https://www.youtube.com/playlist?list=PLVYPzB4Uygi_P4nqJtjMsBGRmCmNL5yuU'
    }
  ]
};

const relatedAudio = (
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
);

const AudiobooksResources = () => {
  const audiobooksForChildren: BaseLinkType[] = audiobooksForChildrenData;

  // Create aside content with audiobooksForChildren
  const asideContent = useMemo(
    () => (
      <section className="asside-section u-spacing">
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

        {relatedAudio}
      </section>
    ),
    [audiobooksForChildren]
  );

  return (
    <AudioPage
      type="audiobook"
      aside={asideContent ?? undefined}
      relatedPosts={youTubeAudiobooks}
    />
  );
};
export default AudiobooksResources;

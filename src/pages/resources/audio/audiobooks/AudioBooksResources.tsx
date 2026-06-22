import { useMemo } from 'react';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { Figure } from 'alps-library/molecules/media/figure/Figure';
import { ContentBlockExpand } from 'alps-library/molecules/blocks/contentBlockExpand/ContentBlockExpand';
import { RelatedPosts } from 'src/alps/organisms/asides/RelatedPosts';
import { BaseLinkType } from 'src/organisms/PageLinkItem';
import audiobooksForChildrenData from './audiobooksForChildren.json';
import AudioPage from '../AudioPage';
import './AudiobooksResources.scss';

const youTubeAudiobooks = [
  {
    title: 'томовете на "Свидетелства към църквата" от Елън Уайт',
    items: [
      {
        title: '🎞️ Свидетелства към църквата - том 1',
        url: 'https://www.youtube.com/playlist?list=PLVYPzB4Uygi8x41Z2FSkoIuBVhZD8i_ce'
      },
      {
        title: '🎞️ Свидетелства към църквата - том 2',
        url: 'https://www.youtube.com/playlist?list=PLVYPzB4Uygi_o1Ll7xE6no5489C3xPl9Y'
      },
      {
        title: '🎞️ Свидетелства към църквата - том 3',
        url: 'https://www.youtube.com/playlist?list=PLVYPzB4Uygi-y7lThJ7GUKZ9M3CdQ1vRI'
      },
      {
        title: '🎞️ Свидетелства към църквата - том 4',
        url: 'https://www.youtube.com/playlist?list=PLqis216kTTZmp0lAa3ryrzUWwjspxQ02R'
      },
      {
        title: '🎞️ Свидетелства към църквата - том 5',
        url: 'https://www.youtube.com/playlist?list=PLVYPzB4Uygi_HlIiKEJ2AWSI4BzRspiHu'
      },
      {
        title: '🎞️ Свидетелства към църквата - том 6',
        url: 'https://www.youtube.com/playlist?list=PLqis216kTTZnFnH-AQYfbcrYGL4p7AWs-'
      },
      {
        title: '🎞️ Свидетелства към църквата - том 7',
        url: 'https://www.youtube.com/playlist?list=PLENr8lV9VWpd1AJYWYcq0RX0hQ5WPwwiL'
      },
      {
        title: '🎞️ Свидетелства към църквата - том 8',
        url: 'https://www.youtube.com/playlist?list=PLVYPzB4Uygi_0ZTS0MrtyV-uK5G64lVBB'
      },
      {
        title: '🎞️ Свидетелства към църквата - том 9',
        url: 'https://www.youtube.com/playlist?list=PLVYPzB4Uygi-cL1PXwq2fYdlC9d9aXEjw'
      }
    ]
  },
  {
    title: 'томовете на "Евангелизъм" от Елън Уайт',
    items: [
      {
        title: '🎞️ Евангелизъм - книга 1',
        url: 'https://www.youtube.com/playlist?list=PLVYPzB4Uygi8QDRtxayIqXQbtkOePflQE'
      },
      {
        title: '🎞️ Евангелизъм - книга 2',
        url: 'https://www.youtube.com/playlist?list=PLVYPzB4Uygi9LJ7YISoRlqQf3whFTNe5l'
      },
      {
        title: '🎞️ Евангелизъм - книга 3',
        url: 'https://www.youtube.com/playlist?list=PLVYPzB4Uygi_P4nqJtjMsBGRmCmNL5yuU'
      }
    ]
  }
];

const relatedAudio = {
  heading: 'Други аудиокниги',
  blocks: [
    {
      title: 'Аудиокниги в Опитности',
      url: '/church_life/testimonies?tab=audiobooks',
      category: 'Опитности от цял свят'
    },
    {
      title: 'Срещи с Христос',
      url: 'https://3-16.bg/sreshti-s-hristos/',
      category: '3-16.br'
    },
    {
      title: 'Направен, за да устои - Дуайт Нелсън',
      url: 'https://www.youtube.com/playlist?list=PLfCTd97jVbHXWPMYdbEfB8q85fPnuLjL3',
      category: 'youtube плейлист'
    }
  ]
};

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

        <RelatedPosts {...relatedAudio} />

        {youTubeAudiobooks.map((section, i) => (
          <ContentBlockExpand
            key={i}
            title={section.title}
            kicker="Слушайте в YouTube "
          >
            <section className="u-spacing--half">
              {section.items.map((item, itemIndex) => (
                <h3
                  key={itemIndex}
                  className="c-block__title hyphens-auto u-font--primary--s u-theme--color--dark"
                >
                  <a href={item.url} target="_blank" rel="noreferrer">
                    {item.title}
                  </a>
                </h3>
              ))}
            </section>
          </ContentBlockExpand>
        ))}
      </section>
    ),
    [audiobooksForChildren]
  );

  return <AudioPage type="audiobook" aside={asideContent ?? undefined} />;
};
export default AudiobooksResources;

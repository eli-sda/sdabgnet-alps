import { useCallback, useState } from 'react';
import { Page } from 'src/organisms/Page';
import routes from 'src/routes';
import { RelatedPosts } from 'src/alps/organisms/asides/RelatedPosts';
import { PageHeaderFeature2 } from 'src/organisms/sections/PageHeaderFeature2';
import { MAIN_RESOURCES_FOLDER } from 'src/constants';
import { getImageTypeByUrl } from 'src/utils/ImageHelper';
import { getTitle } from 'src/utils/Navigation';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import VideoPlaylistList from 'src/components/media/video/VideoPlaylistList';
import VideoWithPreview from 'src/components/media/video/videoWithPreview/VideoWithPreview';
import { LinksBlock } from '../links/LinksBlock';
import { LinksData, MediaListSection } from '../links/MediaLinksPage';
import biblicalJson from './biblical.json';
import believe28 from './believe28.json';
import './Biblical.scss';

type BelieveItem = {
  title: string;
  path: string;
};

type BelieveSection = {
  section: string;
  items: BelieveItem[];
};

const izuchavaiMe = [
  {
    title: 'Изучаване на Библията',
    url: 'https://www.bible.izuchavai.me/'
  },
  {
    title: 'Семейството',
    url: 'https://family.izuchavai.me/'
  },
  {
    title: 'Библейски апокалипсис',
    url: 'https://otkrovenie.izuchavai.me/'
  },
  {
    title: 'Поеми контрол над здравето си',
    url: 'https://zdrave.izuchavai.me/'
  }
];

const adventisimo = [
  {
    title: 'Книгата Даниил',
    url: 'https://www.adventisimo.com/daniel/'
  },
  {
    title: 'Книгата Откровение',
    url: 'https://www.adventisimo.com/revelation/'
  },
  {
    title: 'Изследователният съд',
    url: 'https://www.adventisimo.com/pre-advent-judgment/'
  },
  {
    title: 'Съботата',
    url: 'https://www.adventisimo.com/sabbath/'
  },
  {
    title: 'Християнски живот',
    url: 'https://www.adventisimo.com/devotionals/'
  },
  {
    title: 'Елън Уайт',
    url: 'https://www.adventisimo.com/ellen-white/'
  }
];

const audioCourses = {
  heading: 'Аудио курсове',
  blocks: [
    {
      title: 'Пътуване из Библията',
      url: '/resources/audio/seminars?playlistTitle=%D0%9F%D1%8A%D1%82%D1%83%D0%B2%D0%B0%D0%BD%D0%B5+%D0%B8%D0%B7+%D0%91%D0%B8%D0%B1%D0%BB%D0%B8%D1%8F%D1%82%D0%B0#e39d507d-b8b2-464e-927e-fe5c79f00c64',
      category: getTitle(routes.resources('audio', 'seminars'))
    },
    {
      title: 'Удивителни факти на Библията',
      url: '/resources/audio/seminars?playlistTitle=%D0%A3%D0%B4%D0%B8%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D0%BD%D0%B8+%D1%84%D0%B0%D0%BA%D1%82%D0%B8+%D0%BD%D0%B0+%D0%91%D0%B8%D0%B1%D0%BB%D0%B8%D1%8F%D1%82%D0%B0#e20275fb-ebd2-4e1b-a82f-7a77979c50f4',
      category: getTitle(routes.resources('audio', 'seminars'))
    },
    {
      title: 'Основни учения на Библията',
      url: '/resources/audio/audiobook?playlistTitle=%D0%9E%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D0%B8+%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D1%8F+%D0%BD%D0%B0+%D0%91%D0%B8%D0%B1%D0%BB%D0%B8%D1%8F%D1%82%D0%B0#10181728-18cd-41ac-9b2e-c8dd4ddc4e6e',
      category: getTitle(routes.resources('audio', 'seminars'))
    }
  ]
};

const useful = {
  heading: 'Полезно',
  blocks: [
    {
      title: 'Bible SDA AI',
      description:
        'AI помощник, на който може да задавате въпроси за Библията, вярата, духовния живот или конкретни библейски текстове. Всички отговори се основават на Библията и на официалните източници на ЦАСД.',
      url: 'https://sda.bible-llm.com'
    }
  ]
};

const youTubeLinks = {
  heading: 'Гледайте в YouTube',
  blocks: [
    {
      title: '🎞️ Триединството (плейлист)',
      url: 'https://www.youtube.com/playlist?list=PLVYPzB4Uygi9JXqscXn9D4HZLx-MjRgbX',
      description: 'Тук са събрани над 90 видоклипа от различни автори.'
    },
    {
      title: '🎞️ Седмият Ден (плейлист)',
      url: 'https://www.youtube.com/playlist?list=PLdkD_M036WsQjnM1tOoOyY6FV2-P62KwU',
      description:
        '„Седмият ден“ е мащабен, научно документиран сериал, представящ авторитетния исторически и теологичен спор между съботата и неделята като християнски дни за поклонение.'
    },
    {
      title: '🎞️ Десетте заповеди (плейлист)',
      url: 'https://www.youtube.com/playlist?list=PLIeXbN0nkX1WzPk4dp6W0txeXGvHNUZ6T',
      description: 'Кратки видеоклипове, разглеждащи десетте Божии заповеди.'
    },
    {
      title: '🎞️ Писмо на надежда - сезон 1 (плейлист)',
      url: 'https://www.youtube.com/playlist?list=PLtKXLzSB_hV2i9hkokryybPA9aTnH_YoF',
      description:
        'Предаването на Hope Channel "Писмо на надежда" ви пренася в света на Библията и истините, които се крият между нейните корици.'
    },
    {
      title: '🎞️ Писмо на надежда - сезон 2 (плейлист)',
      url: 'https://www.youtube.com/playlist?list=PLtKXLzSB_hV1-kQfKzmPBHJSpRCps8JAI',
      description:
        'Изборът да кажеш „Да“ на Бога и да погледнеш в Библията отвъд клишетата може да се окаже най-смелото и разумно решение, което преобръща представите за любов, смирение и справедливост в живота ти.'
    }
  ]
};

const biblicalPath = routes.info('biblical');

const Biblical = () => {
  useScrollToHash();

  const breadcrumbsUrls = [routes.info(), biblicalPath];

  const believeSections = believe28 as BelieveSection[];

  // State to track if the video iframe should be loaded
  const [isPlaying, setIsPlaying] = useState(false);

  const subLinks = useCallback(
    (links: { url: string; title: string }[]) =>
      links?.map(({ url, title }, index) => (
        <div key={index}>
          <a
            className="u-font--primary--m c-block__title-link u-theme--color--darker u-theme--link-hover--dark"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>
              {title}
              <i className="fas fa-external-link-alt fa-sm u-space--quarter--left"></i>
            </strong>
          </a>
        </div>
      )),
    []
  );

  return (
    <>
      <Page
        pageClassName="biblical"
        title={getTitle(routes.info('biblical'))}
        breadcrumbsUrls={breadcrumbsUrls}
        aside={
          <section className="u-spacing--double">
            <RelatedPosts {...audioCourses} /> <RelatedPosts {...useful} />
          </section>
        }
        relatedPosts={youTubeLinks}
      >
        <section className="u-clear-fix youtube-section u-space--bottom">
          <VideoWithPreview
            title="Рекламен клип Изучавай.ме"
            videoSrc="https://www.youtube.com/watch?v=diVY5dKQpew"
            isActive={isPlaying}
            onActivate={() => setIsPlaying(true)}
            size="large"
          />
        </section>

        <section className="u-spacing u-space--bottom">
          <LinksBlock
            title=""
            picture="/img/logos/bible-izuchavai-me.webp"
            colorDescription="izuchavai.me"
          >
            <div>
              <h3 className="text u-space--half--bottom">
                Онлайн курсове от{' '}
                <a
                  href="https://www.izuchavai.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Изучавай.ме
                </a>
              </h3>
              {subLinks(izuchavaiMe)}
            </div>
          </LinksBlock>

          <LinksBlock
            title=""
            picture="/img/logos/adventisimo.png"
            colorDescription="adventisimo.com"
          >
            <div>
              <h3 className="text u-space--half--bottom">
                От{' '}
                <a
                  href="https://adventisimo.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Адвентисимо
                </a>{' '}
                - адвентна апологетика
              </h3>
              {subLinks(adventisimo)}
            </div>
          </LinksBlock>
        </section>

        <section className="u-space--bottom">
          <MediaListSection
            sections={biblicalJson as LinksData[]}
            doubleSpace={false}
          />
        </section>
      </Page>

      <section className="biblical full-section u-space--top u-spacing--triple">
        <section className="u-spacing">
          <PageHeaderFeature2
            blockType="quarterSS"
            blocks={[
              {
                type: 'quarterSS',
                title: 'Библейски видео поредици'
              }
            ]}
          />
          <VideoPlaylistList pagePath={biblicalPath} withListPadding={true} />
        </section>

        <section className="u-spacing">
          <PageHeaderFeature2
            blockType="quarterSS"
            blocks={[
              {
                type: 'quarterSS',
                image: getImageTypeByUrl('/img/logos/believe28.gif'),
                kicker: 'Библейско изложение на 28 ОСНОВНИ УЧЕНИЯ',
                title: 'Адвентистите от седмия ден вярват...'
              }
            ]}
          />

          <div className="believe-grid">
            {believeSections.map((sectionData, sIndex) => (
              <div key={sIndex} className="u-spacing">
                <h3 className="believe-section-title u-font--primary--m u-theme--color--darker">
                  <strong>{sectionData.section}</strong>
                </h3>
                <ul className="u-spacing">
                  {sectionData.items.map((item, iIndex) => (
                    <li
                      key={iIndex}
                      className="c-block__title hyphens-auto u-theme--color--dark u-theme--link-hover--darker"
                    >
                      <a
                        href={`${MAIN_RESOURCES_FOLDER}/books/${item.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i
                          className={'far fa-file-pdf u-space--half--right'}
                          aria-hidden="true"
                        ></i>
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </section>
    </>
  );
};
export default Biblical;

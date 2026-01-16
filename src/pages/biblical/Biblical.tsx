import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import { Figure } from 'alps-library/molecules/media/figure/Figure';
import { PageSection } from 'src/organisms/PageSection';
import { PageHeaderFeature2 } from 'src/organisms/sections/PageHeaderFeature2';
import routes from 'src/routes';
import { MAIN_RESOURCES_FOLDER } from 'src/constants';
import { getTitle } from 'src/utils/Navigation';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import VideoPlaylistList from 'src/components/media/video/VideoPlaylistList';
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

const Biblical = () => {
  useScrollToHash();

  const breadcrumbsUrls = [routes.info(), routes.info('biblical')];

  const believeSections = believe28 as BelieveSection[];

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

  return (
    <section className="biblical">
      <PageHeaderLong title={getTitle(routes.info('biblical'))} />
      <PageSection
        breadcrumbsUrls={breadcrumbsUrls}
        relatedPosts={{
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
        }}
      >
        <section className="u-clear-fix">
          <Figure
            className="u-space--double--top u-space--bottom"
            align="left"
            caption="Рекламен клип Изучавай.ме"
            size="large"
            videoSrc="https://www.youtube.com/embed/diVY5dKQpew"
          />
        </section>

        <section className="u-space--bottom">
          <LinksBlock title="" picture="/img/logos/bible-izuchavai-me.png">
            <div>
              <h3 className="c-block__title u-space--half--bottom">
                Курсове от Изучавай.ме
              </h3>
              {izuchavaiMe?.map(({ url, title }, index) => (
                <>
                  <a
                    key={index}
                    className="u-font--primary--m c-block__title-link u-theme--color--darker u-theme--link-hover--dark"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <strong>
                      {title}
                      <i className="fas fa-external-link-alt u-space--quarter--left"></i>
                    </strong>
                  </a>
                  <br />
                </>
              ))}
            </div>
          </LinksBlock>
        </section>

        <section className="u-space--double--bottom">
          <MediaListSection
            sections={biblicalJson as LinksData[]}
            doubleSpace={false}
          />
        </section>
      </PageSection>

      <section className="full-section  u-space--top">
        <section>
          <PageHeaderFeature2
            blockType="longform"
            blocks={[
              {
                type: 'longform',
                title: 'Библейски видео поредици'
              }
            ]}
          />
          <VideoPlaylistList sanityType="bible_ref" />
        </section>

        <div className="u-space--top u-space--double--bottom">
          <PageHeaderFeature2
            blockType="longform"
            blocks={[
              {
                type: 'longform',
                image: {
                  alt: '',
                  srcSet: {
                    default: '/img/logos/believe28.gif',
                    500: '',
                    750: '',
                    1200: ''
                  }
                },
                kicker: 'Библейско изложение на 28 ОСНОВНИ УЧЕНИЯ',
                title: 'Адвентистите от седмия ден вярват...'
              }
            ]}
          />
        </div>

        <div className="believe-grid">
          {believeSections.map((sectionData, sIndex) => (
            <div key={sIndex} className="believe-grid__col">
              <h3 className="believe-section-title u-space--left u-font--primary--m u-theme--color--darker">
                <strong>{sectionData.section}</strong>
              </h3>
              <ul>
                {sectionData.items.map((item, iIndex) => (
                  <li
                    key={iIndex}
                    className="c-block__title hyphens-auto u-space u-theme--color--dark u-theme--link-hover--darker"
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
  );
};
export default Biblical;

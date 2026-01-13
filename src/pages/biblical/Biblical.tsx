import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import { PageSection } from 'src/organisms/PageSection';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { Figure } from 'alps-library/molecules/media/figure/Figure';
import routes from 'src/routes';
import { getTitle } from 'src/utils/Navigation';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import VideoPlaylistList from 'src/components/media/video/VideoPlaylistList';
import { LinksBlock } from '../links/LinksBlock';
import { LinksData, SectionList } from '../links/MediaLinksPage';
import biblicalJson from './biblical.json';
import onlineBiblesJson from './online-bibles.json';
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

  const izuchavaiMeButtons = izuchavaiMe?.map(({ url, title }) => ({
    label: title,
    url,
    className: 'link-button u-space--half--right u-space--half--bottom',
    faIconClass: 'fas fa-external-link-alt',
    hideExternalIcon: true,
    simple: true,
    outline: true,
    isExternal: true
  }));

  return (
    <>
      <PageHeaderLong title={getTitle(routes.info('biblical'))} />
      <PageSection
        breadcrumbsUrls={breadcrumbsUrls}
        // aside={
        //   <SectionList
        //     sections={onlineBiblesJson as LinksData[]}
        //     doubleSpace={false}
        //   />
        // }
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
            className="u-space--double--top"
            align="left"
            caption="Рекламен клип Изучавай.ме"
            size="large"
            videoSrc="https://www.youtube.com/embed/diVY5dKQpew"
          />
        </section>

        <section className="u-space--bottom">
          <LinksBlock
            title="Курсове от Изучавай ме"
            smallImage="/img/logos/40/bible-izuchavai-me.png"
            buttons={izuchavaiMeButtons}
          />
        </section>

        <section className="u-space--double--bottom">
          <SectionList
            sections={biblicalJson as LinksData[]}
            doubleSpace={false}
          />
        </section>

        <SectionList
          sections={onlineBiblesJson as LinksData[]}
          doubleSpace={false}
        />
      </PageSection>

      <VideoPlaylistList sanityType="bible_ref" />

      <section>
        <h2 className="believe-title u-theme--color--darker u-text-transform--upper u-space--double">
          Библейско изложение на 28 ОСНОВНИ УЧЕНИЯ
        </h2>
        <div className="u-space--double--top believe-grid">
          {believeSections.map((sectionData, sIndex) => (
            <div key={sIndex} className="believe-grid__col">
              <HeadingBlock title={sectionData.section} />
              <ul>
                {sectionData.items.map((item, iIndex) => (
                  <li
                    key={iIndex}
                    className="c-block__title hyphens-auto u-space u-theme--color--dark"
                  >
                    <a
                      href={`https://sdasofia.org/sdabg/books/${item.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
export default Biblical;

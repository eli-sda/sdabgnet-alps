import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import { Pullquote } from 'alps-library/molecules/text/pullquote/Pullquote';
import { Caption } from 'alps-library/atoms/text/Caption';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { RelatedPosts } from 'src/alps/organisms/asides/RelatedPosts';
import { LinkType, PlaylistType } from 'src/contexts/PlaylistsContext';
import { getTitle } from 'src/utils/Navigation';
import { newLinesWithLinks } from 'src/utils/Links';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { usePagesMeta } from 'src/hooks/usePagesMeta';
import { PageHeaderFeature2 } from 'src/organisms/sections/PageHeaderFeature2';
import VideoGrid from 'src/components/media/video/videoGrid/VideoGrid';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './NewStart.scss';

type newStartItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  color: string;
};

const asideContent = (
  <RelatedPosts
    heading="Полезно"
    blocks={[
      {
        title: 'Ново начало (NEW START) - здравословен стил на живот',
        url: 'https://novo-nachalo-bg.blogspot.com/',
        category: 'novo-nachalo-bg.blogspot.com'
      },
      {
        title: '8 стъпки на здравето',
        url: 'http://youtube.com/playlist?list=PLIeXbN0nkX1W7OKodGfYn9yJuEer2ErwO',
        category: 'youtube плейлист'
      }
    ]}
  />
);

const relatedHealthCenters = {
  heading: 'Здравни центрове',
  id: 'health-centers',
  blocks: [
    {
      title: 'Център за здраве в с. Баня',
      url: 'https://lifeinhope.com/bg/'
    },
    {
      title: 'Център за здраве в с. Медово',
      url: 'https://zdravencentarmedovo.com/'
    }
  ]
};

const newStartPrinciples = [
  { letter: 'N', text: '- Хранене', color: '#AA62A7' },
  { letter: 'E', text: '- Движение', color: '#2699D3' },
  { letter: 'W', text: '- Вода', color: '#4CC4D9' },
  {
    letter: 'S',
    text: '- Слънце',
    color: '#CDDA51'
  },
  { letter: 'T', text: '- Въздържание', color: '#FBDC61' },
  { letter: 'A', text: '- Въздух', color: '#F8A045' },
  { letter: 'R', text: '- Почивка', color: '#F26E52' },
  { letter: 'T', text: '- Доверие', color: '#E16BA8' }
];

const NewStart = (): JSX.Element => {
  useScrollToHash();

  const breadcrumbsUrls = [routes.health(), routes.health('new-start')];
  const { pageBackground } = usePagesMeta();

  const [newStartItems, setNewStartItems] = useState<newStartItem[]>([]);

  const { getPlaylists } = usePlaylists();
  const [videos, setVideos] = useState<LinkType[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);

  useEffect(() => {
    fetch('/json/new-start.json')
      .then((res) => res.json())
      .then((data: newStartItem[]) => {
        setNewStartItems(data);
      })
      .catch((err) => {
        console.error('Failed to load new-start.json', err);
        setNewStartItems([]);
      });
  }, []);

  useEffect(() => {
    getPlaylists('video', false, 'SINGLE new_start_videos')
      .then((data: PlaylistType[]) => {
        if (data.length > 0 && data[0].items) {
          setVideos(data[0].items);
        } else {
          setVideos([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setVideos([]);
      });
  }, [getPlaylists]);

  useEffect(() => {
    getPlaylists('video', false, 'Как да сме здрави - Божията рецепта')
      .then((data: PlaylistType[]) => {
        setPlaylists(data);
      })
      .catch((err) => {
        console.error(err);
        setPlaylists([]);
      });
  }, [getPlaylists]);

  return (
    <section className="new-start-page u-spacing--double">
      <Page
        title={getTitle(routes.health('new-start'))}
        background={pageBackground}
        breadcrumbsUrls={breadcrumbsUrls}
        aside={asideContent}
        relatedPosts={relatedHealthCenters}
      >
        <section className="u-spacing--double">
          <Caption>
            Програма <b>NEW START</b> (НОВО НАЧАЛО) вече над 40 години се
            прилага с постоянен успех в профилактиката и лечението на значимите
            сьвременни заболявания. Освен в{' '}
            <a
              href="https://newstart.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              здравния институт &quot;УИМАР&quot;
            </a>{' '}
            - Калифорния - САЩ, където е синтезирана в настоящия вид, множество
            центрове по света са основани и работят по тези принципи, чрез които
            постигат завидни и трайни резултати. Семпли и ефективни правила, в
            хармония с човешката физиология, изцяло научно обосновани, без модни
            увлечения и съмнителни теории. Програма <b>NEW START</b> е официално
            призната от Световната ЗО.
          </Caption>

          <Caption>
            Благотворното въздействие на всички тези естествени средства може да
            преживеете като посетите{' '}
            <a href={`#${relatedHealthCenters.id}`}>
              {' '}
              здравно-възстановителните центрове
            </a>{' '}
            в България.
          </Caption>

          <section className="new-start-principles">
            <div className="principles-columns">
              {[
                newStartPrinciples.slice(0, 3), // N E W
                newStartPrinciples.slice(3) // S T A R T
              ].map((column, colIndex) => (
                <ul key={`col-${colIndex}`} className="principles-list">
                  {column.map((item, index) => (
                    <li
                      key={`item-${colIndex}-${index}`}
                      className="principle-item"
                    >
                      <span
                        className="letter-bg"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.letter}
                      </span>
                      <span className="principle-text">{item.text}</span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>

            <img
              className="new-start-banner"
              src="/img/health/newStart/new-start-banner.svg"
            />
          </section>

          <section className="pullquotes">
            <Pullquote
              quote="„Чист въздух, слънчева светлина, въздържание, почивка, упражнения, правилно хранене, употреба на вода, доверие в божествената сила — това са истинските средства за лечение.“"
              author="По стъпките на Великия лекар, стр. 127"
            />

            <Pullquote
              quote="„Съвършената чистота, изобилието от слънчева светлина, внимателното отношение към хигиената във всеки детайл от домашния живот са от съществено значение за свободата от болести и за веселието и жизнеността на обитателите на дома.“"
              author="По стъпките на Великия лекар, стр. 276"
            />
          </section>

          <section className="eleven-principles u-spacing">
            <HeadingBlock title="11 принципа на здравето" />

            <Swiper
              slidesPerView={'auto'}
              spaceBetween={10}
              navigation
              pagination={{ clickable: true }}
              mousewheel
              keyboard
              centeredSlides
              modules={[Navigation, Pagination, Mousewheel, Keyboard]}
              className="new-start-swiper"
            >
              {newStartItems.map((item) => (
                <SwiperSlide key={item.id}>
                  <div
                    className="new-start-item"
                    style={{ backgroundColor: item.color }}
                  >
                    <img src={item.image} />
                    <section className="text-content u-padding u-spacing--quarter u-color--black">
                      <h3>{item.title}</h3>
                      <p>{newLinesWithLinks(item.description)}</p>
                    </section>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        </section>
      </Page>

      <section className="new-start-videos u-space--top u-spacing">
        <PageHeaderFeature2
          blockType="quarterSS"
          blocks={[
            {
              type: 'quarterSS',
              title: 'Гледайте'
            }
          ]}
        />
        <VideoGrid
          videos={videos}
          playlists={playlists}
          className="u-space--right u-space--left"
        />
      </section>
    </section>
  );
};

export default NewStart;

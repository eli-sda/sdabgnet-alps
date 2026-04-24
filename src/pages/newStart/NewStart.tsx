import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import { Pullquote } from 'alps-library/molecules/text/pullquote/Pullquote';
import routes from 'src/routes';
import { RelatedPosts } from 'src/alps/organisms/asides/RelatedPosts';
import { LinkType, PlaylistType } from 'src/contexts/PlaylistsContext';
import { getTitle } from 'src/utils/Navigation';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { PageSection } from 'src/organisms/PageSection';
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
    color: '#CDDA51',
    isStart: true
  },
  { letter: 'T', text: '- Въздържание', color: '#FBDC61' },
  { letter: 'A', text: '- Въздух', color: '#F8A045' },
  { letter: 'R', text: '- Почивка', color: '#F26E52' },
  { letter: 'T', text: '- Доверие', color: '#E16BA8' }
];

const NewStart = (): JSX.Element => {
  useScrollToHash();

  const breadcrumbsUrls = [routes.health(), routes.health('new-start')];

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
      <PageHeaderLong title={getTitle(routes.health('new-start'))} />

      <PageSection
        breadcrumbsUrls={breadcrumbsUrls}
        pageClassName="new-start-section full-page"
      >
        <ul className="new-start-principles">
          {newStartPrinciples.map((item, index) => (
            <li
              key={index}
              className={`principle-item ${item.isStart ? 'u-space--top' : ''}`}
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

        <img
          className="new-start-banner"
          src="/img/health/newStart/new-start-banner.svg"
        />
      </PageSection>

      <PageSection aside={asideContent} relatedPosts={relatedHealthCenters}>
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

        <Swiper
          slidesPerView={'auto'}
          spaceBetween={30}
          navigation
          pagination={{ clickable: true }}
          mousewheel
          keyboard
          loop
          centeredSlides
          modules={[Navigation, Pagination, Mousewheel, Keyboard]}
          className="new-start-swiper"
        >
          {newStartItems.map((item) => (
            <SwiperSlide key={item.id}>
              <div
                className="new-start-item hyphens-auto u-space--top"
                style={{ backgroundColor: item.color }}
              >
                <img src={item.image} />
                <section className="text-content u-padding u-spacing--quarter">
                  <h3 className="u-theme--color--darker0 u-color--white">
                    {item.title}
                  </h3>
                  <p className="u-color--black0 u-color--white">
                    {item.description.split('\n').map((line, i, arr) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                </section>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </PageSection>

      <section className="new-start-videos u-space--top u-spacing--double">
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

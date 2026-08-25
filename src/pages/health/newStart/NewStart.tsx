import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import { Pullquote } from 'alps-library/molecules/text/pullquote/Pullquote';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { RelatedPosts } from 'src/alps/organisms/asides/RelatedPosts';
import { Button } from 'src/alps/atoms/Button';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { getTitle } from 'src/utils/Navigation';
import { newLinesWithLinks } from 'src/utils/Links';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { usePagesMeta } from 'src/hooks/usePagesMeta';
import { DarkTitle } from 'src/components/DarkTitle';
import VideoGrid from 'src/components/media/video/videoGrid/VideoGrid';
import QuizDialog, { QuizDataType } from 'src/components/quizDialog/QuizDialog';
import quizData from './newStartQuiz.json';
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

const relatedHealthCenters = (
  <RelatedPosts
    heading="Здравни центрове"
    id="health-centers"
    blocks={[
      {
        title: 'Център за здраве в с. Баня',
        url: 'https://lifeinhope.com/bg/'
      },
      {
        title: 'Център за здраве в с. Медово',
        url: 'https://zdravencentarmedovo.com/'
      }
    ]}
  />
);

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

const benefits = [
  {
    title: 'Преодоляване на диабета',
    img: '/img/health/newStart/1RD.png'
  },
  {
    title: 'Възстановяване от сърдечни заболявания',
    img: '/img/health/newStart/2RHD.png'
  },
  {
    title: 'Обновяване на имунната система',
    img: '/img/health/newStart/3RIS.png'
  },
  {
    title: 'Намаляване на теглото',
    img: '/img/health/newStart/4WL.png'
  },
  {
    title: 'Облекчаване на невропатията',
    img: '/img/health/newStart/5RN.png'
  },
  {
    title: 'Преодоляване на депресията',
    img: '/img/health/newStart/6OD.png'
  },
  {
    title: 'Повишаване на енергията',
    img: '/img/health/newStart/7IE.png'
  },
  {
    title: 'Понижаване на холестерола',
    img: '/img/health/newStart/8LC.png'
  },
  {
    title: 'Повишаване на жизнеността',
    img: '/img/health/newStart/9EV.png'
  },
  {
    title: 'Облекчаване на артрита',
    img: '/img/health/newStart/10RA.png'
  }
];

const newStartPath = routes.health('new-start');

const NewStart = (): JSX.Element => {
  useScrollToHash();

  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  const breadcrumbsUrls = [routes.health(), newStartPath];
  const { pageBackground } = usePagesMeta();

  const [newStartItems, setNewStartItems] = useState<newStartItem[]>([]);

  const { getPagePlaylists } = usePlaylists();
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const isSafeImageUrl = (url: string): boolean => {
    if (url.startsWith('/')) return true;
    try {
      return new URL(url).protocol === 'https:';
    } catch {
      return false;
    }
  };

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
    getPagePlaylists(newStartPath)
      .then((data: PlaylistType[]) => {
        setPlaylists(data);
      })
      .catch((err) => {
        console.error(err);
        setPlaylists([]);
      });
  }, [getPagePlaylists]);

  return (
    <Page
      title={getTitle(newStartPath)}
      background={pageBackground}
      breadcrumbsUrls={breadcrumbsUrls}
      blockType="wrap6"
      pageClassName="full-page new-start-page u-spacing--double"
    >
      <section className="u-spacing--double">
        <section className="u-spacing" id="intro">
          <p className="text">
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
          </p>

          <p className="text">
            Благотворното въздействие на всички тези естествени средства може да
            преживеете като посетите здравно-възстановителните центрове в
            България.
          </p>
          {relatedHealthCenters}
        </section>

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
      </section>

      <section className="u-space--top u-spacing--triple">
        <section className="benefits u-spacing" id="benefits">
          <DarkTitle title="NEW START може да помогне с:" />

          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-item">
                <span
                  className="benefit-icon"
                  style={{
                    WebkitMaskImage: `url(${benefit.img})`,
                    maskImage: `url(${benefit.img})`
                  }}
                  aria-hidden
                />
                <p className="u-color--black">{benefit.title}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="eleven-principles u-spacing" id="eleven-principles">
          <DarkTitle title="11 принципа на здравето" />
          <Swiper
            slidesPerView={'auto'}
            spaceBetween={10}
            navigation
            pagination={{ clickable: true }}
            // Enable mouse wheel/trackpad navigation only on non-touch devices.
            // forceToAxis keeps vertical scrolling for the page and uses horizontal gestures for the carousel.
            mousewheel={{
              enabled: !isTouchDevice,
              forceToAxis: true
            }}
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
                  <img src={isSafeImageUrl(item.image) ? item.image : ''} />
                  <section className="text-content u-padding u-spacing--quarter u-color--black">
                    <h3>{item.title}</h3>
                    <p>{newLinesWithLinks(item.description)}</p>
                  </section>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <section className="new-start-videos u-spacing" id="new-start-videos">
          <DarkTitle title="Гледайте" />
          <VideoGrid items={playlists} />
        </section>

        <section
          className="u-spacing u-background-color--gray--light"
          id="new-start-quiz"
        >
          <DarkTitle title={quizData.quizTitle} />

          <div className="u-space--left u-space--right">
            <h3 className="u-theme--color--darker">
              <strong>Смяташ, че познаваш здравните принципи?</strong>
            </h3>

            <p className="u-font--secondary--m">Провери знанията си</p>

            <Button
              onClick={() => setIsQuizOpen(true)}
              className="u-space--top u-space--bottom"
              label="Започни теста"
              faIconClass="fas fa-play"
            />

            <QuizDialog
              quizData={quizData as QuizDataType}
              open={isQuizOpen}
              onClose={() => setIsQuizOpen(false)}
            />
          </div>
        </section>
      </section>
    </Page>
  );
};

export default NewStart;

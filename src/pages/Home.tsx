import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
// import IconsColorsSizes from '../atoms/IconsColorsSizes';
import routes from '../routes';
import DailyVerse from 'src/organisms/DailyVerse';
import moment from 'moment';
import { PageSection } from 'src/organisms/PageSection';
// import { Carousel } from 'alps-library/molecules/components/carousel/Carousel';
import PageMeta from 'src/utils/PageMeta';
import { usePagesMeta } from 'src/hooks/usePagesMeta';
// import { FetchedPageDescription } from 'src/organisms/FetchedPageDescription';
import { demoAudioPlaylist, demoAudioPlaylist2, OLD_SITE } from 'src/constants';

// import { Button } from '@mui/material';
// import { deleteAllLinks } from 'src/utils/DelteSanityDocuments';
// import { VideoFull } from 'alps-library/organisms/sections/videoFull/VideoFull';

import playlistData from './resources/playlist.json';
import DownloadList from './resources/DownloadList';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import DownloadPlaylist from './resources/DownloadPlaylist';

import { useScrollToHash } from 'src/hooks/useScrollToHash';
import AudioPalylist from './resources/AudioPalylist';
import AudioPlayer from './resources/AudioPlayer';

const Home = () => {
  useScrollToHash();
  const playlists: PlaylistType[] = playlistData;

  const [currentDate, setCurrentDate] = useState(() => moment());
  const [playlist, setPlaylists] = useState<PlaylistType>({ _id: '1' }); // for demo audio playlist
  const { pageMeta } = usePagesMeta();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();
      console.log(`in Home date: ${currentDate.format('YYYY-MM-DD')}`);
      if (!now.isSame(currentDate, 'day')) {
        setCurrentDate(now);
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, [currentDate]);

  // TODO: use next year when replace the old site
  // const prevYear = useMemo(() => {
  //   return currentDate.clone().subtract(1, 'year');
  // }, [currentDate]);

  /*
  // const testSlides = [
  //   {
  //     heading: 'Lorem Ipsum',
  //     subtitle: 'Fusce nec urna ut tellus accumsan fermentum.',
  //     dek: 'Morbi eleifend, mi et varius imperdiet, nunc magna ullamcorper nibh, vel varius felis dui ac arcu. Vestibulum semper commodo dolor vel congue. Curabitur eleifend ligula ut arcu finibus posuere.',
  //     cta: 'Mec cursus mi',
  //     url: 'https://www.adventist.org',
  //     image: {
  //       srcSet: {
  //         default: '//picsum.photos/480/270?image=1041',
  //         '500': '//picsum.photos/750/350?image=1041',
  //         '750': '//picsum.photos/1200/800?image=1041',
  //         '1200': '//picsum.photos/1500/900?image=1041'
  //       },
  //       alt: 'Placeholder image'
  //     }
  //   },
  //   {
  //     heading: 'Consequatur',
  //     subtitle: 'Nulla exercitationem perspiciatis',
  //     dek: 'Debitis et aut voluptatem omnis quis quis similique.',
  //     cta: 'Quod voluptatibus',
  //     url: 'https://www.adventist.org',
  //     image: {
  //       srcSet: {
  //         default: '//picsum.photos/480/270?image=1044',
  //         '500': '//picsum.photos/750/350?image=1044',
  //         '750': '//picsum.photos/1200/800?image=1044',
  //         '1200': '//picsum.photos/1500/900?image=1044'
  //       },
  //       alt: 'Placeholder image'
  //     }
  //   },
  //   {
  //     heading: 'Quae vel et',
  //     subtitle: 'Atque numquam quo non nostrum.',
  //     dek: 'Curabitur eleifend ligula ut arcu finibus posuere.',
  //     cta: 'Dolorum et ligula',
  //     url: 'https://www.adventist.org',
  //     image: {
  //       srcSet: {
  //         default: '//picsum.photos/480/270?image=1002',
  //         '500': '//picsum.photos/750/350?image=1002',
  //         '750': '//picsum.photos/1200/800?image=1002',
  //         '1200': '//picsum.photos/1500/900?image=1002'
  //       },
  //       alt: 'Placeholder image'
  //     }
  //   },
  //   {
  //     heading: 'Sint incidunt ut',
  //     subtitle:
  //       'Doloribus ut dignissimos accusantium ex sapiente quia occaecati est.',
  //     dek: 'Enim qui minus beatae nemo quia laborum suscipit repudiandae. Ea neque voluptatem maxime. Ut nostrum distinctio enim blanditiis debitis.',
  //     cta: 'Utex quia!',
  //     url: 'https://www.adventist.org',
  //     image: {
  //       srcSet: {
  //         default: '//picsum.photos/480/270?image=832',
  //         '500': '//picsum.photos/750/350?image=832',
  //         '750': '//picsum.photos/1200/800?image=832',
  //         '1200': '//picsum.photos/1500/900?image=832'
  //       },
  //       alt: 'Placeholder image'
  //     }
  //   }
  // ];
  */
  return (
    <PageSection
      aside={
        <>
          {/* <Button onClick={() => deleteAllLinks()}>Delete all links in Sanity</Button> */}
          {/* verse for today */}
          <DailyVerse date={currentDate}></DailyVerse>

          {/* verse for current date but previous year */}
          {/* <DailyVerse date={prevYear}></DailyVerse> */}

          {/* verse for 2.01.2025  with links*/}
          <DailyVerse date={moment('2025-01-02')}></DailyVerse>
        </>
      }
    >
      {pageMeta && <PageMeta meta={pageMeta} breadcrumbs={[]}></PageMeta>}
      {/* <Carousel slides={testSlides}></Carousel> */}
      <div className="u-padding--left u-padding--top u-spacing">
        <h3>Тестване връзки:</h3>
        <div className="text">
          <ul>
            <li>
              <NavLink to={routes.churchLife('lessons')}>Отвори СУ</NavLink>
            </li>
            <li>
              <NavLink to={routes.churchLife('lesson')}>
                Отвори текущия урок за възрастни
              </NavLink>
            </li>
            <li>
              <NavLink to={`${routes.churchLife('lesson')}/6/4/13`}>
                Отвори урок 13 от 4 трим. на 2006г
              </NavLink>
            </li>

            <li>
              <NavLink to={`${routes.churchLife('lesson')}/25/1/1`}>
                Отвори урок 1 (за възрастни) от 1 трим. на 2025г
              </NavLink>
            </li>
            <li>
              <NavLink to={routes.churchLife('lesson-cq')}>
                Отвори текущия урок за младежи
              </NavLink>
            </li>

            <li>
              <NavLink to={`${routes.churchLife('lesson-cq')}/25/1/2`}>
                Отвори урок 2 за младежи от 1 трим. на 2025г.
              </NavLink>
            </li>
            <li>
              <NavLink to={routes.churchLife('lesson-cc')}>
                Отвори текущия урок за юноши
              </NavLink>
            </li>
            <li>
              <NavLink to={`${routes.churchLife('lesson-cc')}/25/1/2`}>
                Отвори урок 2 за юноши от 1 трим. на 2025г.
              </NavLink>
            </li>
            <li>
              <NavLink to={routes.churchLife()}>
                {' '}
                <i
                  className="fa fa-caret-square-o-down"
                  aria-hidden="true"
                ></i>{' '}
                Църковен живот
              </NavLink>
            </li>
            <li>
              <NavLink to={routes.info()}>
                {' '}
                <i
                  className="fa fa-caret-square-o-down"
                  aria-hidden="true"
                ></i>{' '}
                БГ Справочник
              </NavLink>
            </li>
            <li>
              <NavLink to={routes.media()}>
                {' '}
                <i
                  className="fa fa-caret-square-o-down"
                  aria-hidden="true"
                ></i>{' '}
                Медии
              </NavLink>
            </li>
            <li>
              <NavLink to={routes.health()}>
                {' '}
                <i
                  className="fa fa-caret-square-o-down"
                  aria-hidden="true"
                ></i>{' '}
                Здраве
              </NavLink>
            </li>
            <li>
              <NavLink to={routes.commune()}>
                {' '}
                <i
                  className="fa fa-caret-square-o-down"
                  aria-hidden="true"
                ></i>{' '}
                Общуване
              </NavLink>
            </li>
            <li>
              <NavLink to={routes.commune('pastor-online')}>
                Пастор онайн
              </NavLink>
            </li>
            <li>
              <NavLink to={routes.advertisement()}>
                {' '}
                <i
                  className="fa fa-caret-square-o-down"
                  aria-hidden="true"
                ></i>{' '}
                Обяви
              </NavLink>
            </li>
            <li>
              <NavLink to={routes.advertisement('services')}>
                Услуги/Работа
              </NavLink>
            </li>
            <li>
              <NavLink to={routes.advertisement('buySell')}>
                Покупко-Продажби/Наем
              </NavLink>
            </li>
            <li>
              <NavLink to={routes.advertisement('other')}>Други</NavLink>
            </li>
            <li>
              <NavLink to={routes.health('institutions')}>
                Здравни институции
              </NavLink>
            </li>
            <li>
              <NavLink to={routes.contact}>Контакт</NavLink>
            </li>
            <li>
              <NavLink to={routes.churchLife('events')}>
                Календар със събития
              </NavLink>
            </li>
            <li>
              <NavLink to={routes.resources()}>
                {' '}
                <i
                  className="fa fa-caret-square-o-down"
                  aria-hidden="true"
                ></i>{' '}
                Ресурси
              </NavLink>
            </li>
            <li>
              <NavLink to={routes.resources('video')}>Видео ресурси</NavLink>
            </li>
            <li>
              <NavLink to={routes.resources('presentation')}>
                Ресурси презентации
              </NavLink>
            </li>
            <li>
              <NavLink to={routes.resources('image')}>
                Ресурси изображения
              </NavLink>
            </li>
            <li>
              <NavLink to={routes.resources('audio')}>
                {' '}
                <i
                  className="fa fa-caret-square-o-down"
                  aria-hidden="true"
                ></i>{' '}
                Аудио ресурси
              </NavLink>
            </li>
            <li>
              <NavLink to={routes.resources('audio', 'bible')}>Библии</NavLink>
            </li>
            <li>
              <NavLink to={routes.resources('audio', 'audio-book')}>
                Аудио книги
              </NavLink>
            </li>
            <li>
              <NavLink to={routes.resources('audio', 'seminars')}>
                Семинари
              </NavLink>
            </li>
            <li>
              <NavLink to={routes.resources('audio', 'sermons')}>
                Проповеди
              </NavLink>
            </li>

            <li>
              <NavLink to={routes.churchLife('donations')}>
                Дарения за каузи
              </NavLink>
            </li>
          </ul>
        </div>
        <h5>DEMO: Плейлисти с ресурси за сваляне:</h5>
        {playlists.map((pl, i) => (
          <div key={pl._id || i}>
            <DownloadList
              id={pl._id}
              author={pl.author}
              title={pl.title}
              items={pl.items}
            />
            <hr />
          </div>
        ))}

        <h5>
          DEMO: Презентации &quot;Оправдание чрез вяра&quot; за изтегляне (201,
          202, 203):
        </h5>
        <DownloadPlaylist
          itemUrls={[
            '/sdabg/presentations/AWR Plovdiv - Opravdanie chrez vyara//201 - Izkupitelnata Bojia Lyubov.zip',
            '/sdabg/presentations/AWR Plovdiv - Opravdanie chrez vyara//202 - Problemyt s greha.zip',
            '/sdabg/presentations/AWR Plovdiv - Opravdanie chrez vyara//203 - Kakvo e tova Evangelie.zip'
          ]}
          playlistName="Оправдание чрез вяра"
        />

        <section className="u-spacing--double">
          <h5>Аудио плeйлист демо</h5>
          <AudioPalylist
            playlist={demoAudioPlaylist}
            onPlay={() => {
              setPlaylists(demoAudioPlaylist);
            }}
          />
          <AudioPalylist
            playlist={demoAudioPlaylist2}
            onPlay={() => {
              setPlaylists(demoAudioPlaylist2);
            }}
          />
          {playlist.items && <AudioPlayer playlist={playlist}></AudioPlayer>}
        </section>

        <p className="text">
          <a
            href={`${OLD_SITE}/pdf/Adventist_Identity_Manual.pdf`}
            target="_blank"
            rel="noreferrer"
          >
            Визуална идентичност Базов дизайн (Adventist Identity Manual)
          </a>
        </p>
        {/* <div>
          <h3>Description от външни връзки:</h3>
          <FetchedPageDescription pageURL="https://newlife-bg.com/" />
          <FetchedPageDescription pageURL="https://hm-aw.adventist.bg/" />
        </div> */}

        {/* <IconsColorsSizes></IconsColorsSizes> */}
        {/* <VideoFull
      srcVideo={{
        allow:
          'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
        allowFullScreen: true,
        frameBorder: 0,
        src: 'https://www.youtube.com/embed/nH2r0J5VbL4?si=mhZSCcYKD48f2nL5&cc_load_policy=1&cc_lang_pref=bg&hl=bg'
        //'https://www.youtube.com/embed/-CwVPt6r7pY?cc_load_policy=1&cc_lang_pref=bg&hl=bg'
      }}
    /> */}
      </div>
    </PageSection>
  );
};
export default Home;

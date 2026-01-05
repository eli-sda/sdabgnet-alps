import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import routes from '../routes';
import { OLD_SITE } from 'src/constants';
import DailyVerse from 'src/organisms/DailyVerse';
import { PageSection } from 'src/organisms/PageSection';
// import { Carousel } from 'alps-library/molecules/components/carousel/Carousel';
import PageMeta from 'src/utils/PageMeta';
import { usePagesMeta } from 'src/hooks/usePagesMeta';

// import { Button } from '@mui/material';
// import { deleteAllLinks } from 'src/utils/DelteSanityDocuments';
// import { fixSlugs } from 'src/utils/Sanity/fix-slug';
// import { linkPlaylistsToItems } from 'src/utils/Sanity/link-playlists';
// import { linkMusicPlaylistsToItems } from 'src/utils/Sanity/link-playlists';
// import { deleteAllAudioLinks } from 'src/utils/Sanity/delete-audio-links';
// import { VideoFull } from 'alps-library/organisms/sections/videoFull/VideoFull';

import UpcomingEvents from '../components/UpcomingEvents';
//DEMO:
import { VideoDemo } from '../components/media/video/demo/VideoDemo';
import { useScrollToHash } from 'src/hooks/useScrollToHash';

const Home = () => {
  const [currentDate, setCurrentDate] = useState(() => moment());
  const { pageMeta } = usePagesMeta();
  useScrollToHash();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();
      if (import.meta.env.DEV) {
        console.log(`in Home date: ${currentDate.format('YYYY-MM-DD')}`);
      }
      if (!now.isSame(currentDate, 'day')) {
        setCurrentDate(now);
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, [currentDate]);

  // TODO: use next year when replace the old site
  const prevYear = useMemo(() => {
    return currentDate.clone().subtract(1, 'year');
  }, [currentDate]);

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
        <section className="u-spacing--double">
          {/* <Button onClick={() => fixSlugs()}>Fix Playlist Slugs</Button> */}
          {/* <Button onClick={() => deleteAllLinks()}>Delete all links in Sanity</Button> */}

          {/* Playlist Linking Test Buttons */}
          {/*<div className="u-spacing--double">
            <Button onClick={() => void linkPlaylistsToItems()}>
              Fill Audio Playlist
            </Button>
            <Button
              onClick={() => {
                deleteAllAudioLinks();
              }}
            >
              Delete All audio Links
            </Button>
          </div>*/}
          {/* Playlist MUSIC Linking Test Buttons */}
          {/* <div className="u-spacing--double">
            <Button onClick={() => void linkMusicPlaylistsToItems()}>
              Fill Music Playlist
            </Button>
          </div> */}

          {/* verse for today */}
          {/* <DailyVerse date={currentDate}></DailyVerse> */}

          {/* verse for current date but previous year */}
          <DailyVerse date={prevYear}></DailyVerse>

          {/* verse for 2.01.2025  with links*/}
          {/* <DailyVerse date={moment('2025-01-02')}></DailyVerse> */}

          <UpcomingEvents />
        </section>
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
          </ul>
        </div>

        <VideoDemo />

        <p className="text">
          <a
            href={`${OLD_SITE}/pdf/Adventist_Identity_Manual.pdf`}
            target="_blank"
            rel="noreferrer"
          >
            Визуална идентичност Базов дизайн (Adventist Identity Manual)
          </a>
        </p>
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

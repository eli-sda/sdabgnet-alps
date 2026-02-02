import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
// import { PageSection } from 'src/organisms/PageSection';
// import { Carousel } from 'alps-library/molecules/components/carousel/Carousel';
import PageMeta from 'src/utils/PageMeta';
import { usePagesMeta } from 'src/hooks/usePagesMeta';

import DailyVerse from 'src/organisms/DailyVerse';
import { HomeEvents } from './HomeEvents';
import { AdvertisementsPreview } from 'src/components/advertisements/AdvertisementsPreview';
import { RssFeeds } from 'src/components/rssFeed/RssFeeds';
import { Partners } from 'src/components/Partners';

// for Sanity update
// import { Button } from '@mui/material';
// import { deleteAllLinks } from 'src/utils/DelteSanityDocuments';
// import { fixSlugs } from 'src/utils/Sanity/fix-slug';
// import {
//   // linkPlaylistsToItems,
//   // linkMusicPlaylistsToItems,
//   // linkBibleVideoPlaylistsToItems,
//   linkTestimoniesVideoPlaylistsToItems
// } from 'src/utils/Sanity/link-playlists';
// import { deleteAllAudioLinks } from 'src/utils/Sanity/delete-audio-links';

// for DEMO:
import { TestLinks } from 'src/components/TestLinks';
// import DailyVerseGray from 'src/organisms/DailyVerseGray';
// import { VideoDemo } from '../components/media/video/demo/VideoDemo';
// import { FeedDemo } from 'src/components/rssFeed/demo/FeedDemo';
// import { useScrollToHash } from 'src/hooks/useScrollToHash';

// import LatestAdvertisementsDemo from '../advertisement/LatestAdvertisementsDemo';

const Home = () => {
  const [currentDate, setCurrentDate] = useState(() => moment());
  const { pageMeta } = usePagesMeta();
  // useScrollToHash();

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
    <section className="u-spacing--triple">
      {pageMeta && <PageMeta meta={pageMeta} breadcrumbs={[]}></PageMeta>}

      <TestLinks />

      {/* <Carousel slides={testSlides}></Carousel> */}

      <section className="full-page">
        <DailyVerse date={prevYear}></DailyVerse>
      </section>
      {/* <section className="full-page">
        <DailyVerseGray date={moment('2025-12-23')}></DailyVerseGray>
        <DailyVerse date={moment('2025-12-23')}></DailyVerse>
      </section> */}

      <section className="full-page">
        <HomeEvents />
      </section>

      <section className="full-page">
        <AdvertisementsPreview />
      </section>

      {/* <section className="u-spacing--double"> */}
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
              Fill Music Playlists
            </Button>
          </div> */}
      {/* Playlist Bible Linking Test Buttons */}
      {/* <div className="u-spacing--double">
            <Button onClick={() => void linkBibleVideoPlaylistsToItems()}>
              Fill Библейски Playlists
            </Button>
          </div> */}
      {/* Playlist Testimony Linking Test Buttons */}
      {/* <div className="u-spacing--double">
            <Button onClick={() => void linkTestimoniesVideoPlaylistsToItems()}>
              Fill Опитности Playlists
            </Button>
          </div> */}
      {/* verse for today */}
      {/* <DailyVerse date={currentDate}></DailyVerse> */}

      {/* verse for current date but previous year */}
      {/* <DailyVerse date={prevYear}></DailyVerse> */}

      {/* verse for 2.01.2025  with links*/}
      {/* <DailyVerse date={moment('2025-01-02')}></DailyVerse> */}
      {/* </section> */}

      <section className="full-page u-spacing--triple">
        {/* <VideoDemo /> */}
        {/* <FeedDemo /> */}
        {/* <LatestAdvertisementsDemo /> */}
        <RssFeeds />
      </section>

      <Partners />
    </section>
  );
};
export default Home;

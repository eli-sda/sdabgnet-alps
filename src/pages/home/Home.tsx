import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';

import PageMeta from 'src/utils/PageMeta';
import { usePagesMeta } from 'src/hooks/usePagesMeta';

import { HomeEvents } from './HomeEvents';
import { AdvertisementsPreview } from 'src/components/advertisements/AdvertisementsPreview';
import { RssFeeds } from 'src/components/rssFeed/RssFeeds';
import { Partners } from 'src/components/Partners';
import { CallForHelp } from 'src/components/CallForHelp';

// for Sanity update
import { Button } from '@mui/material';
// import { deleteAllLinks } from 'src/utils/DelteSanityDocuments';
// import { fixSlugs } from 'src/utils/Sanity/fix-slug';
// import {
//   // linkPlaylistsToItems,
//   // linkMusicPlaylistsToItems,
//   // linkBibleVideoPlaylistsToItems,
//   linkTestimoniesVideoPlaylistsToItems
// linkBookPlaylistsToItems
// linkHealthPlaylistsToItems
// } from 'src/utils/Sanity/link-playlists';
// import { deleteAllAudioLinks } from 'src/utils/Sanity/delete-audio-links';
// import { cleanupPlaylistItems } from 'src/utils/Sanity/cleanup-playlist-items';
import { updateVideoTopics } from 'src/utils/Sanity/updateVideoTopics';

// for DEMO:
// import { TestLinks } from 'src/components/TestLinks';
import { HomeTopContainer } from './HomeTopContainer';
// import DailyVerse from 'src/components/dailyVerse/DailyVerse';
// import DailyVerseGray from 'src/components/dailyVerse/DailyVerseGray';
// import DailyVerseDark from 'src/components/dailyVerse/DailyVerseDark';
// import { VideoDemo } from '../components/media/video/demo/VideoDemo';
// import { FeedDemo } from 'src/components/rssFeed/demo/FeedDemo';
import { useScrollToHash } from 'src/hooks/useScrollToHash';

// import LatestAdvertisementsDemo from '../advertisement/LatestAdvertisementsDemo';

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

  const prevYear = useMemo(() => {
    return currentDate.clone().subtract(1, 'year');
  }, [currentDate]);

  return (
    <section className="u-spacing--triple">
      {pageMeta && <PageMeta meta={pageMeta} breadcrumbs={[]}></PageMeta>}
      <HomeTopContainer dailyVerseDate={prevYear} />

      {/* <section className="full-page">
      <TestLinks />
        <DailyVerseDark date={prevYear}></DailyVerseDark>
        <DailyVerseGray date={moment('2025-12-23')}></DailyVerseGray>
        <DailyVerse date={moment('2025-12-23')}></DailyVerse>
      </section> */}

      <section className="u-spacing--triple full-page">
        <HomeEvents />
        <CallForHelp />
        <AdvertisementsPreview />
        <RssFeeds />
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
      {/* <div className="u-spacing--double">
        <Button onClick={() => void cleanupPlaylistItems('testimony', 'СРЕЩИ')}>
          Изтрий видеата от плейлист СРЕЩИ
        </Button>
      </div> */}
      {/* <div className="u-spacing--double">
        <Button onClick={() => void linkBookPlaylistsToItems()}>
          Fill Book Playlists
        </Button>
      </div> */}
      {/* <div>
        <Button onClick={() => void linkHealthPlaylistsToItems()}>
          Fill Health Playlists
        </Button>
      </div> */}
      <div>
        <Button onClick={() => void updateVideoTopics()}>
          Update video topics
        </Button>
      </div>

      {/* <section className="full-page u-spacing--triple"> */}
      {/* <VideoDemo /> */}
      {/* <FeedDemo /> */}
      {/* <LatestAdvertisementsDemo /> */}
      {/* </section> */}

      <Partners />
    </section>
  );
};
export default Home;

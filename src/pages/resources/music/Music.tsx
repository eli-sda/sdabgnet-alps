import { useEffect, useState } from 'react';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { AudioInstructions } from 'src/components/media/audio/AudioInstructions';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { RelatedPosts } from 'src/alps/organisms/asides/RelatedPosts';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { getTitle } from 'src/utils/Navigation';
import { AudioPlaylistList } from 'src/components/media/audio/AudioPlaylistList';
import VideoPlaylistList from 'src/components/media/video/VideoPlaylistList';
import { SUBPAGE_KICKER } from '../Resources';
import { MusicIcon } from './MusicIcon';
import asideLinks from './music-links.json';

const musicLinks = {
  heading: 'Слушайте в YouTube',
  blocks: [
    {
      title: 'Гласът на надеждата',
      url: 'https://www.youtube.com/@Гласътнанадеждата'
    },
    {
      title: 'Петък 7 1/2',
      url: 'https://www.youtube.com/playlist?list=PLHxD0n8PEQXKiWJz28H8ckGi4HyIYNC-P'
    },
    {
      title: 'Песни от Дима Босева',
      url: 'https://www.youtube.com/@dimaboseva/videos'
    },
    {
      title: 'Хваление Благодат',
      url: 'https://www.youtube.com/playlist?list=PLIt3SrgpCVT_AWIvDTNbXmvAJiqLRIWsF'
    },
    {
      title: 'Християнски песни',
      url: 'https://www.youtube.com/playlist?list=PLVYPzB4Uygi8rtJItNbGQieGU1_5rxLQi'
    },
    {
      title: 'Албум "Небесна мелодия"',
      url: 'https://www.youtube.com/playlist?list=PLIeXbN0nkX1V3Rp4n6c122jl2k6FLg9Dl'
    },
    {
      title: 'Песни от Красимир Лазаров',
      url: 'https://www.youtube.com/playlist?list=PLJR2nI6Iy0ZL985GVfv9Y-Gd_4ewAzZ9K'
    }
  ]
};

const pagePath = routes.resources('music');

const MusicPage = () => {
  useScrollToHash();

  const breadcrumbsUrls = [routes.resources(), pagePath];

  const { getPlaylistsByTitles } = usePlaylists();
  const [musicVideos, setMusicVideos] = useState<PlaylistType[]>([]);
  const [videoPlaylist, setVideoPlaylist] = useState<PlaylistType[]>([]);

  useEffect(() => {
    fetch('/json/music-videos.json')
      .then((res) => res.json())
      .then((data: PlaylistType) => {
        setMusicVideos([data]);
      })
      .catch((err) => {
        console.error('Failed to load music-videos.json', err);
        setMusicVideos([]);
      });
  }, []);

  useEffect(() => {
    getPlaylistsByTitles('video', false, [
      'Инструментална музика',
      'Музиката в християнския живот'
    ])
      .then(setVideoPlaylist)
      .catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Page
        title={getTitle(routes.resources('music'))}
        kicker={SUBPAGE_KICKER}
        breadcrumbsUrls={breadcrumbsUrls}
        relatedPosts={musicLinks}
        aside={<RelatedPosts {...asideLinks} />}
      >
        <section className="u-spacing">
          <HeadingBlock title="Гледайте" />
          <VideoPlaylistList
            playlists={[...(musicVideos ?? []), ...(videoPlaylist ?? [])]}
          />
        </section>
      </Page>

      <section className="u-space--triple--top u-spacing--double u-padding--sides">
        <AudioInstructions type="music" />
        <AudioPlaylistList
          pagePath={pagePath}
          defaultImageIcon={
            <MusicIcon className="u-color--black c-block__image" />
          }
        />
      </section>
    </>
  );
};

export default MusicPage;

import { useEffect, useState } from 'react';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { Accordion } from 'alps-library/molecules/components/accordion/Accordion';
import { Text } from 'alps-library/atoms/text/Text';
import { RelatedPosts } from 'src/alps/organisms/asides/RelatedPosts';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { getTitle } from 'src/utils/Navigation';
import DownloadList from 'src/components/downloadList/DownloadList';
import { AudioPlaylistList } from 'src/components/media/audio/AudioPlaylistList';
import VideoPlaylistList from 'src/components/media/video/VideoPlaylistList';
import songbookLink from './songbook-link.json';
import '../audio/AudioPage.scss';

const musicLinks = {
  heading: 'Слушайте в YouTube',
  blocks: [
    {
      title: 'Петък 7 1/2',
      url: 'https://www.youtube.com/playlist?list=PLHxD0n8PEQXKiWJz28H8ckGi4HyIYNC-P'
    },
    {
      title: 'Песни от Дима Босева',
      url: 'https://www.youtube.com/@dimaboseva/videos'
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

const MusicPage = () => {
  useScrollToHash();

  const breadcrumbsUrls = [routes.resources(), routes.resources('music')];

  const { getResourcePlaylists } = usePlaylists();
  const [musicPlaylist, setMusicPlaylist] = useState<PlaylistType[]>([]);
  const [musicVideos, setMusicVideos] = useState<PlaylistType[]>([]);

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
    getResourcePlaylists(
      'presentations',
      'Духовни песни - презентации с музика'
    )
      .then(setMusicPlaylist)
      .catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Page
        title={getTitle(routes.resources('music'))}
        kicker={getTitle(routes.resources())}
        breadcrumbsUrls={breadcrumbsUrls}
        relatedPosts={musicLinks}
        aside={<RelatedPosts {...songbookLink} />}
      >
        <Text
          as="article"
          hasDropcap={false}
          spacing="double"
          className="u-space--double--bottom"
        >
          <Accordion>
            {musicPlaylist.map(({ _id, title, author, items }, i) => (
              <DownloadList
                key={i}
                id={_id}
                title={title}
                author={author}
                items={items?.map(
                  ({ _id, title, description, size, path }) => ({
                    _id,
                    title,
                    description,
                    size,
                    path // for download
                  })
                )}
              />
            ))}
          </Accordion>
        </Text>

        <VideoPlaylistList playlists={musicVideos} />

        <div className="audio-page-instructions">
          <h4 className="audio-page-caption">
            Използвайте бутона{' '}
            <span className="audio-page-caption__icon-wrapper">
              <img
                className="icon"
                src="/images/icons/o-icon__audio.svg"
                alt="Аудио икона"
              />
            </span>
            , за да слушате избран избран списък от песни.
            <br />В отворения аудио плеър чрез бутона{' '}
            <img
              className="icon"
              src="/img/icons/playlist-icon.svg"
              alt="Плейлист икона"
            />{' '}
            можете да видите списъка с всички заглавия.
            <br />
            За да изтеглите всички аудио файлове от поредицата в архив
            (zip-формат), използвайте бутона &quot;Изтегли всички&quot;, а за да
            изтеглите текущия файл - използвайте иконата{' '}
            <img
              className="icon"
              src="/img/icons/download-icon.svg"
              alt="Изтегли икона"
            />{' '}
            от плеъра.
            <br />
            Можете да споделите линк към поредицата от песни или конкретно аудио
            от нея.
          </h4>
        </div>
      </Page>

      <AudioPlaylistList type="music" />
    </>
  );
};

export default MusicPage;

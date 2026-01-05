import { useEffect, useState } from 'react';
import routes from 'src/routes';
import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import { Accordion } from 'alps-library/molecules/components/accordion/Accordion';
import { Text } from 'alps-library/atoms/text/Text';
import { PageSection } from 'src/organisms/PageSection';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { getTitle } from 'src/utils/Navigation';
import DownloadList from '../DownloadList';
import { AudioPlaylistList } from '../AudioPlaylistList';
import VideoPlaylistList from 'src/components/video/VideoPlaylistList';
import jsonPlaylist from './music-videos.json';
import '../AudioPage.scss';

const MusicPage = () => {
  useScrollToHash();

  const breadcrumbsUrls = [routes.resources(), routes.resources('music')];

  const { getResourcePlaylists } = usePlaylists();
  const [musicPlaylist, setMusicPlaylist] = useState<PlaylistType[]>([]);

  const musicPlaylistArr = [jsonPlaylist as PlaylistType];

  useEffect(() => {
    getResourcePlaylists(
      'presentations',
      'Духовни песни - презентации с музика'
    )
      .then(setMusicPlaylist)
      .catch((err) => console.error(err));
  }, [getResourcePlaylists]);

  return (
    <>
      <PageHeaderLong
        title={getTitle(routes.resources('music'))}
        kicker={getTitle(routes.resources())}
      />
      <PageSection breadcrumbsUrls={breadcrumbsUrls}>
        <Text as="article" hasDropcap={false} spacing="double">
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
        <VideoPlaylistList playlists={musicPlaylistArr} />

        <div className="audio-page-instructions u-space--double--top">
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
      </PageSection>

      <AudioPlaylistList type="music" />
    </>
  );
};

export default MusicPage;

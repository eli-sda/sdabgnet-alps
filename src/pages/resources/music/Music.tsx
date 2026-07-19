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
import { SUBPAGE_KICKER } from '../Resources';
import { MusicIcon } from './MusicIcon';
import songbookLink from './songbook-link.json';
import '../audio/AudioPage.scss';

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

  const { getResourcePlaylists, getPlaylists } = usePlaylists();
  const [musicPlaylist, setMusicPlaylist] = useState<PlaylistType[]>([]);
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
    getResourcePlaylists(
      'presentations',
      'Духовни песни - презентации с музика'
    )
      .then(setMusicPlaylist)
      .catch((err) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getPlaylists('video', false, 'За музиката')
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

        <VideoPlaylistList playlists={[...(musicVideos ?? []), ...(videoPlaylist ?? [])]} />
      </Page>
      <section className="u-space--triple--top u-spacing--double u-padding--sides">
        <div className="audio-page-instructions">
          <h4 className="audio-page-caption">
            • Използвайте бутона{' '}
            <span className="audio-page-caption__icon-wrapper">
              <img
                className="icon"
                src="/images/icons/o-icon__audio.svg"
                alt="Аудио икона"
                width="20"
                height="20"
              />
            </span>
            , за да слушате избран списък от песни.
            <br />• В отворения аудио плеър чрез бутона{' '}
            <img
              className="icon"
              src="/img/icons/playlist-icon.svg"
              alt="Плейлист икона"
              width="20"
              height="20"
            />{' '}
            можете да видите списъка с всички заглавия.
            <br />• За да изтеглите всички аудио файлове от поредицата в архив
            (zip-формат), използвайте бутона &quot;Изтегли всички&quot;, а за да
            изтеглите текущия файл - използвайте иконата{' '}
            <img
              className="icon"
              src="/img/icons/download-icon.svg"
              alt="Изтегли икона"
              width="20"
              height="20"
            />{' '}
            от плеъра.
            <br />• Можете да споделите линк към поредицата от песни или
            конкретно аудио от нея.
            <br />• Вашият напредък (кой запис слушате) се помни автоматично.
            Натиснете{' '}
            <i className="fas fa-bookmark u-color--white u-background-color--ming u-padding--quarter"></i>
            , за да запазите точната секунда, на която прекъсвате аудиото. Щом
            започнете следващо аудио, то автоматично ще стане вашето ново
            запомнено място.
          </h4>
        </div>
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

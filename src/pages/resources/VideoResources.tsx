import { useEffect, useState } from 'react';
import { Caption } from 'alps-library/atoms/text/Caption';
import { Accordion } from 'src/alps/molecules/components/accordion/Accordion';
import { Page } from 'src/organisms/Page';
import routes from 'src/routes';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { getTitle } from 'src/utils/Navigation';
import DownloadList from 'src/components/downloadList/DownloadList';
import { SUBPAGE_KICKER } from './Resources';

const videoPath = routes.resources('video');

const VideoResources = () => {
  const breadcrumbsUrls = [routes.resources(), videoPath];
  const { getPagePlaylists } = usePlaylists();
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);
  const [playlistsLoaded, setPlaylistsLoaded] = useState(false);
  useScrollToHash({ enabled: playlistsLoaded, delayMs: 1000 });

  useEffect(() => {
    getPagePlaylists(videoPath)
      .then(setPlaylists)
      .catch((err) => console.error(err))
      .finally(() => setPlaylistsLoaded(true));
  }, [getPagePlaylists]);

  return (
    <Page
      title={getTitle(videoPath)}
      kicker={SUBPAGE_KICKER}
      breadcrumbsUrls={breadcrumbsUrls}
      pageClassName="download-resources"
    >
      {/* Show message if no playlists */}
      {(!playlists || playlists.length === 0) && (
        <div className="u-space--left">
          <Caption>Няма налични видео ресурси</Caption>
        </div>
      )}

      <Accordion className="text">
        {/* Map playlists to DownloadList */}
        {playlists.map(({ _id, title, author, items }, i) => (
          <DownloadList
            key={_id || i}
            id={_id}
            title={title}
            author={author}
            items={items?.map(({ _id, title, description, size, path }) => ({
              _id,
              title,
              description,
              size,
              path // for download
            }))}
          />
        ))}
      </Accordion>
    </Page>
  );
};

export default VideoResources;

import { useEffect, useState } from 'react';
import { Page } from 'src/organisms/Page';
import routes from 'src/routes';
import { getTitle } from 'src/utils/Navigation';
import DownloadList from './DownloadList';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { Caption } from 'alps-library/atoms/text/Caption';

const VideoResources = () => {
  const breadcrumbsUrls = [routes.resources(), routes.resources('video')];
  const { getPlaylists } = usePlaylists();
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);

  useEffect(() => {
    getPlaylists()
      .then(setPlaylists)
      .catch((err) => console.error(err));
  }, [getPlaylists]);

  return (
    <Page
      title={getTitle(routes.resources('video'))}
      kicker={getTitle(routes.resources())}
      breadcrumbsUrls={breadcrumbsUrls}
      pageClassName="download-resources"
    >
      {!playlists ||
        (playlists.length === 0 && (
          <Caption>Няма налични видео ресурси.</Caption>
        ))}
      {playlists && playlists.map((playlist, i) => 
        <DownloadList key={i} playlist={playlist} />
      )}
    </Page>
  );
};

export default VideoResources;

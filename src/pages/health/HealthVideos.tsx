import { useState, useEffect } from 'react';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { getTitle } from 'src/utils/Navigation';
import VideoGrid from 'src/components/media/video/videoGrid/VideoGrid';

const healthVideosPath = routes.health('video');

const HealthVideos = (): JSX.Element => {
  const breadcrumbsUrls = [routes.health(), healthVideosPath];
  const { getPagePlaylists } = usePlaylists();

  const [videos, setVideos] = useState<PlaylistType[]>([]);

  useEffect(() => {
    getPagePlaylists(healthVideosPath)
      .then(setVideos)
      .catch((err) => console.error(err));
  }, [getPagePlaylists]);

  return (
    <Page title={getTitle(healthVideosPath)} breadcrumbsUrls={breadcrumbsUrls}>
      <VideoGrid items={videos} />
    </Page>
  );
};

export default HealthVideos;

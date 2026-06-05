import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import VideoPlaylistList from 'src/components/media/video/VideoPlaylistList';

const healthVideosPath = routes.health('video');

const HealthVideos = (): JSX.Element => {
  const breadcrumbsUrls = [routes.health(), healthVideosPath];

  return (
    <Page
      title={getTitle(healthVideosPath)}
      breadcrumbsUrls={breadcrumbsUrls}
      blockType="wrap6"
      pageClassName="full-page"
    >
      <VideoPlaylistList pagePath={healthVideosPath} />
    </Page>
  );
};

export default HealthVideos;

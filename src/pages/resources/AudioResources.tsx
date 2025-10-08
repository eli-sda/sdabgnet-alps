import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import { PageContent } from 'src/alps/organisms/content/PageContent';
import routes from 'src/routes';
import { getBreadcrumbs, getTitle } from 'src/utils/Navigation';
import AudioPlaylistList from './AudioPlaylistList';

const AudioResources = () => {
  const breadcrumbs = getBreadcrumbs([
    routes.resources(),
    routes.resources('audio')
  ]);

  return (
    <>
      <PageHeaderLong
        title={getTitle(routes.resources('audio'))}
        kicker={getTitle(routes.resources())}
      />
      <PageContent breadcrumbs={breadcrumbs} />

      <AudioPlaylistList type="audio-book" />
    </>
  );
};

export default AudioResources;

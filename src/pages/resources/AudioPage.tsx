import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import { PageContent } from 'src/alps/organisms/content/PageContent';
import routes from 'src/routes';
import { getBreadcrumbs, getTitle } from 'src/utils/Navigation';
import AudioPlaylistList from './AudioPlaylistList';
import { useScrollToHash } from 'src/hooks/useScrollToHash';

type AudioPageProps = {
  type: 'audio-book' | 'seminars' | 'sermons';
};

const AudioPage = ({ type }: AudioPageProps) => {
  useScrollToHash();

  const breadcrumbs = getBreadcrumbs([
    routes.resources(),
    routes.resources('audio'),
    routes.resources('audio', type)
  ]);

  return (
    <>
      <PageHeaderLong
        title={getTitle(routes.resources('audio', type))}
        kicker={getTitle(routes.resources())}
      />
      <PageContent breadcrumbs={breadcrumbs} />

      <AudioPlaylistList type={type} />
    </>
  );
};

export default AudioPage;

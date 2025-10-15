import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import { Caption } from 'alps-library/atoms/text/Caption';
import { PageContent } from 'src/alps/organisms/content/PageContent';
import routes from 'src/routes';
import { getBreadcrumbs, getTitle } from 'src/utils/Navigation';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import AudioPlaylistList from './AudioPlaylistList';
import './AudioPage.scss';

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

      <div className="u-space--left audio-page-caption">
        <Caption>
          Използвайте бутона{' '}
          <img
            className="audio-icon"
            src="/images/icons/o-icon__audio_darkest.svg"
            alt="Аудио икона"
          />
          , за да слушате избрана поредица.
        </Caption>
      </div>
      <AudioPlaylistList type={type} />
    </>
  );
};

export default AudioPage;

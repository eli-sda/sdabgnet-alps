import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import { PageSection } from 'src/organisms/PageSection';
import routes from 'src/routes';
import { getTitle } from 'src/utils/Navigation';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import AudioPlaylistList from './AudioPlaylistList';
import './AudioPage.scss';

type AudioPageProps = {
  type: 'audio-book' | 'seminars' | 'sermons';
  aside?: React.ReactNode;
};

const AudioPage = ({ type, aside }: AudioPageProps) => {
  useScrollToHash();

  const breadcrumbsUrls = [
    routes.resources(),
    routes.resources('audio'),
    routes.resources('audio', type)
  ];

  return (
    <>
      <PageHeaderLong
        title={getTitle(routes.resources('audio', type))}
        kicker={getTitle(routes.resources())}
      />
      <PageSection breadcrumbsUrls={breadcrumbsUrls} aside={aside}>
        <div className='audio-page-instructions'>
          <h4 className="audio-page-caption">
            Използвайте бутона{' '}
            <img
              className="icon"
              src="/images/icons/o-icon__audio_darkest.svg"
              alt="Аудио икона"
            />
            , за да слушате избрана поредица.
          </h4>
          <h4 className="audio-page-caption">
            В отворения аудио плеър чрез бутона{' '}
            <img
              className="icon"
              src="/img/icons/playlist-icon.svg"
              alt="Плейлист икона"
            />{' '}
            можете да видите списъка с всички заглавия.
          </h4>
          <h4 className="audio-page-caption">
            За да изтеглите всички аудио файлове от поредицата в архив
            (zip-формат), използвайте бутона &quot;Изтегли всички&quot;, за да
            изтеглите текущия файл - използвайте иконата{' '}
            <img
              className="icon"
              src="/img/icons/download-icon.svg"
              alt="Изтегли икона"
            />{' '}
            от плеъра.
          </h4>
        </div>
      </PageSection>

      <AudioPlaylistList type={type} />
    </>
  );
};

export default AudioPage;

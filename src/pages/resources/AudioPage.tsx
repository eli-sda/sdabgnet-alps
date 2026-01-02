import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import { PageSection } from 'src/organisms/PageSection';
import routes from 'src/routes';
import { getTitle } from 'src/utils/Navigation';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import AudioPlaylistList from './AudioPlaylistList';
import './AudioPage.scss';

type AudioPageProps = {
  type: 'audiobook' | 'seminars' | 'sermons';
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
        <div className="audio-page-instructions">
          <h4 className="audio-page-caption">
            Използвайте бутона{' '}
            <span className="audio-page-caption__icon-wrapper">
              <img
                className="icon"
                src="/images/icons/o-icon__audio.svg"
                alt="Аудио икона"
              />
            </span>
            , за да слушате {type === 'audiobook' && 'избрана аудиокнига'}
            {type === 'seminars' && 'избран семинар'}
            {type === 'sermons' && 'избран списък от проповеди'}.<br />В
            отворения аудио плеър чрез бутона{' '}
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
            Можете да споделите линк към{' '}
            {type === 'audiobook' && 'аудиокнига или конкретно аудио от нея'}
            {type === 'seminars' && 'семинар или конкретно аудио от него'}
            {type === 'sermons' &&
              'списък от проповеди или конкретно аудио от него'}
            .
          </h4>
        </div>
        {type === 'audiobook' && <AudioPlaylistList type={type} />}
      </PageSection>

      {(type === 'seminars' || type === 'sermons') && (
        <AudioPlaylistList type={type} />
      )}
    </>
  );
};

export default AudioPage;

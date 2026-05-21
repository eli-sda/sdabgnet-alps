import { RiUserVoiceFill } from 'react-icons/ri';
import { LuBookAudio } from 'react-icons/lu';
import routes from 'src/routes';
import { RelatedPostsProps } from 'src/alps/organisms/asides/RelatedPosts';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { AudioPlaylistList } from 'src/components/media/audio/AudioPlaylistList';
import { SUBPAGE_KICKER } from './AudioResources';
import './AudioPage.scss';

type AudioPageProps = {
  type: 'audiobook' | 'seminars' | 'sermons';
  aside?: React.ReactNode;
  relatedPosts?: RelatedPostsProps;
};

const reactIconProps = {
  size: '100%',
  className: 'c-block__image u-padding--double u-color--black'
};

const AudioPage = ({ type, aside, relatedPosts }: AudioPageProps) => {
  useScrollToHash();

  const pagePath = routes.resources('audio', type);

  const breadcrumbsUrls = [
    routes.resources(),
    routes.resources('audio'),
    pagePath
  ];

  return (
    <>
      <Page
        title={getTitle(pagePath)}
        kicker={SUBPAGE_KICKER}
        breadcrumbsUrls={breadcrumbsUrls}
        aside={aside}
        relatedPosts={relatedPosts}
      >
        <div className="audio-page-instructions">
          <h4 className="audio-page-caption">
            • Използвайте бутона{' '}
            <span className="audio-page-caption__icon-wrapper">
              <img
                className="icon"
                src="/images/icons/o-icon__audio.svg"
                alt="Аудио икона"
              />
            </span>
            , за да слушате {type === 'audiobook' && 'избрана аудиокнига'}
            {type === 'seminars' && 'избран семинар'}
            {type === 'sermons' && 'избран списък от проповеди'}.
            <br />• В отворения аудио плеър чрез бутона{' '}
            <img
              className="icon"
              src="/img/icons/playlist-icon.svg"
              alt="Плейлист икона"
            />{' '}
            можете да видите списъка с всички заглавия.
            <br />• За да изтеглите всички аудио файлове от поредицата в архив
            (zip-формат), използвайте бутона &quot;Изтегли всички&quot;, а за да
            изтеглите текущия файл - използвайте иконата{' '}
            <img
              className="icon"
              src="/img/icons/download-icon.svg"
              alt="Изтегли икона"
            />{' '}
            от плеъра.
            <br />• Можете да споделите линк към{' '}
            {type === 'audiobook' && 'аудиокнига или конкретно аудио от нея'}
            {type === 'seminars' && 'семинар или конкретно аудио от него'}
            {type === 'sermons' &&
              'списък от проповеди или конкретно аудио от него'}
            .
            <br />• Вашият напредък (кой запис слушате) се помни автоматично.
            Натиснете{' '}
            <i className="fas fa-bookmark u-color--white u-background-color--ming u-padding--quarter"></i>
            , за да запазите точната секунда, на която прекъсвате{' '}
            {type === 'audiobook' && 'аудиокнигата'}
            {type === 'seminars' && 'семинара'}
            {type === 'sermons' && 'проповедта'}. Щом започнете следващо аудио,
            то автоматично ще стане вашето ново запомнено място.
          </h4>
        </div>
        {type === 'audiobook' && (
          <AudioPlaylistList
            pagePath={pagePath}
            defaultImageIcon={<LuBookAudio {...reactIconProps} />}
          />
        )}
      </Page>

      {(type === 'seminars' || type === 'sermons') && (
        <AudioPlaylistList
          pagePath={pagePath}
          defaultImageIcon={<RiUserVoiceFill {...reactIconProps} />}
        />
      )}
    </>
  );
};

export default AudioPage;

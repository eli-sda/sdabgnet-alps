import { Caption } from 'alps-library/atoms/text/Caption';
import { Text } from 'alps-library/atoms/text/Text';
import { Accordion } from 'src/alps/molecules/components/accordion/Accordion';
import { Page } from 'src/organisms/Page';
import routes from 'src/routes';
import { getTitle } from 'src/utils/Navigation';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import DownloadList from './DownloadList';
import BibleAudioPalylist from './BibleAudioPalylist';
import bibles_data from './audio_bible.json';
import './AudioPage.scss';

const AudioBibleResources = () => {
  useScrollToHash();

  const breadcrumbs = [
    routes.resources(),
    routes.resources('audio'),
    routes.resources('audio', 'bible')
  ];

  const bibles: PlaylistType[] = bibles_data;

  return (
    <Page
      title={getTitle(routes.resources('audio', 'bible'))}
      kicker={getTitle(routes.resources())}
      breadcrumbsUrls={breadcrumbs}
    >
      {/* Show message if no bibles */}
      {(!bibles || bibles.length === 0) && (
        <Caption>Няма налични аудио Библии</Caption>
      )}

      <div className="audio-page-instructions u-space--bottom">
        <h4 className="audio-page-caption">
          Използвайте бутона{' '}
          <span className="audio-page-caption__icon-wrapper">
            <img
              className="icon"
              src="/images/icons/o-icon__audio.svg"
              alt="Аудио икона"
            />
          </span>
          , за да слушате аудио Библията.
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
          {' '}
          За да изтеглите текущия файл - използвайте иконата{' '}
          <img
            className="icon"
            src="/img/icons/download-icon.svg"
            alt="Изтегли икона"
          />{' '}
          от плеъра.
        </h4>
        <h4 className="audio-page-caption">
          Можете да споделите линк към аудио Библията или конкретно аудио от
          нея.
        </h4>
      </div>

      <Text as="article" hasDropcap={false} spacing="double">
        <Accordion>
          {/* Map bibles to DownloadList */}
          {bibles.map(({ _id, title, author, items }, i) => {
            if (!items) return null;

            // if only one item, render it directly
            if (items.length === 1) {
              return <DownloadList key={i} items={items} />;
            }

            return (
              <DownloadList
                key={i}
                id={_id}
                title={title}
                author={author}
                items={items.map(({ _id, title, description, size, path }) => ({
                  _id,
                  title,
                  description,
                  size,
                  path // for download
                }))}
              />
            );
          })}
        </Accordion>
      </Text>

      <BibleAudioPalylist />
    </Page>
  );
};

export default AudioBibleResources;

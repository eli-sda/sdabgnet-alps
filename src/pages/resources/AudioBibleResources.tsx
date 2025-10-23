import { Caption } from 'alps-library/atoms/text/Caption';
import { Text } from 'alps-library/atoms/text/Text';
import { Accordion } from 'src/alps/molecules/components/accordion/Accordion';
import { Page } from 'src/organisms/Page';
import routes from 'src/routes';
import { getTitle } from 'src/utils/Navigation';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import DownloadList from './DownloadList';
import AudioBiblePlaylist from './BibleAudioPalylist';
import bibles_data from './audio_bible.json';

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

      <AudioBiblePlaylist />
    </Page>
  );
};

export default AudioBibleResources;

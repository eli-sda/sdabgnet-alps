import { useEffect, useState } from 'react';
import { Page } from 'src/organisms/Page';
import routes from 'src/routes';
import { getTitle } from 'src/utils/Navigation';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { Caption } from 'alps-library/atoms/text/Caption';
import DownloadList from './DownloadList';
import { Accordion } from 'src/alps/molecules/components/accordion/Accordion';
import { Text } from 'alps-library/atoms/text/Text';

const VideoResources = () => {
  useScrollToHash();
  
  const breadcrumbsUrls = [routes.resources(), routes.resources('video')];
  const { getPlaylists } = usePlaylists();
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);

  useEffect(() => {
    getPlaylists('video')
      .then(setPlaylists)
      .catch((err) => console.error(err));
  }, [getPlaylists]);

  return (
    <Page
      title={getTitle(routes.resources('video'))}
      kicker={getTitle(routes.resources())}
      breadcrumbsUrls={breadcrumbsUrls}
      pageClassName="download-resources"
    >
      {/* Show message if no playlists */}
      {(!playlists || playlists.length === 0) && (
        <Caption>Няма налични видео ресурси</Caption>
      )}

      <Text as="article" hasDropcap={false} spacing="double">
        <Accordion>
          {/* Map playlists to DownloadList */}
          {playlists
            ?.slice() // make a copy so the original array is not modified
            .filter((p) => p.items?.length) // keep only playlists that have items
            .sort((a, b) => (a.author || '').localeCompare(b.author || '')) // sort by author name (fallback to empty string)
            .map(({ _id, title, author, items }, i) => (
              <DownloadList
                key={i}
                id={_id}
                title={title}
                author={author}
                items={items?.map(
                  ({ _id, title, description, size, path }) => ({
                    _id,
                    title,
                    description,
                    size,
                    path // for download
                  })
                )}
              />
            ))}
        </Accordion>
      </Text>
    </Page>
  );
};

export default VideoResources;

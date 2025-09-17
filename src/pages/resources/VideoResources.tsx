import { useEffect, useState } from 'react';
import { Page } from 'src/organisms/Page';
import routes from 'src/routes';
import { getTitle } from 'src/utils/Navigation';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { Caption } from 'alps-library/atoms/text/Caption';
import DownloadList from './DownloadList';
import { Accordion } from 'src/alps/molecules/components/accordion/Accordion';
import { Text } from 'alps-library/atoms/text/Text';

const VideoResources = () => {
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
            .map((playlist, i) => (
              <DownloadList
                key={i}
                _id={playlist._id}
                title={playlist.title}
                author={playlist.author}
                items={playlist.items?.map((item) => ({
                  _id: item._id,
                  title: item.title,
                  description: item.description,
                  size: item.size,
                  path: item.path // for download
                }))}
              />
            ))}
        </Accordion>
      </Text>
    </Page>
  );
};

export default VideoResources;

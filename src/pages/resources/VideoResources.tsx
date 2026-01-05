import { useEffect, useState } from 'react';
import { Text } from 'alps-library/atoms/text/Text';
import { Caption } from 'alps-library/atoms/text/Caption';
import { Accordion } from 'src/alps/molecules/components/accordion/Accordion';
import { Page } from 'src/organisms/Page';
import routes from 'src/routes';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { getTitle } from 'src/utils/Navigation';
import DownloadList from '../../components/downloadList/DownloadList';

const VideoResources = () => {
  useScrollToHash();

  const breadcrumbsUrls = [routes.resources(), routes.resources('video')];
  const { getResourcePlaylists } = usePlaylists();
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);

  useEffect(() => {
    getResourcePlaylists('video')
      .then(setPlaylists)
      .catch((err) => console.error(err));
  }, [getResourcePlaylists]);

  return (
    <Page
      title={getTitle(routes.resources('video'))}
      kicker={getTitle(routes.resources())}
      breadcrumbsUrls={breadcrumbsUrls}
      pageClassName="download-resources"
    >
      {/* Show message if no playlists */}
      {(!playlists || playlists.length === 0) && (
        <div className="u-space--left">
          <Caption>Няма налични видео ресурси</Caption>
        </div>
      )}

      <Text as="article" hasDropcap={false} spacing="double">
        <Accordion>
          {/* Map playlists to DownloadList */}
          {playlists.map(({ _id, title, author, items }, i) => (
            <DownloadList
              key={i}
              id={_id}
              title={title}
              author={author}
              items={items?.map(({ _id, title, description, size, path }) => ({
                _id,
                title,
                description,
                size,
                path // for download
              }))}
            />
          ))}
        </Accordion>
      </Text>
    </Page>
  );
};

export default VideoResources;

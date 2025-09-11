import { useEffect, useState } from 'react';
import { Page } from 'src/organisms/Page';
import routes from 'src/routes';
import { getTitle } from 'src/utils/Navigation';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { Caption } from 'alps-library/atoms/text/Caption';
import DownloadList from './DownloadList';
import { Accordion } from 'alps-library/molecules/components/accordion/Accordion';
import { Text } from 'alps-library/atoms/text/Text';

const PresentationResources = () => {
  const breadcrumbsUrls = [
    routes.resources(),
    routes.resources('presentation')
  ];
  const { getPlaylists } = usePlaylists();
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);

  useEffect(() => {
    getPlaylists('playlist', 'presentations')
      .then(setPlaylists)
      .catch((err) => console.error(err));
  }, [getPlaylists]);

  return (
    <Page
      title={getTitle(routes.resources('presentation'))}
      kicker={getTitle(routes.resources())}
      breadcrumbsUrls={breadcrumbsUrls}
      pageClassName="download-resources"
    >
      {/* Show message if no playlists */}
      {(!playlists || playlists.length === 0) && (
        <Caption>Няма налични ресурси презентации</Caption>
      )}

      <Text as="article" hasDropcap={false} spacing="double">
        <Accordion>
          {playlists
            ?.filter((p) => p.items?.length)
            .map((playlist) => (
              <DownloadList
                key={playlist._id}
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

export default PresentationResources;

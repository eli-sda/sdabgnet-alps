import { useEffect, useMemo, useState } from 'react';
import { Accordion } from 'alps-library/molecules/components/accordion/Accordion';
import { Text } from 'alps-library/atoms/text/Text';
import { Caption } from 'alps-library/atoms/text/Caption';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { getTitle } from 'src/utils/Navigation';
import DownloadList from 'src/components/downloadList/DownloadList';
import songbookLink from './music/songbook-link.json';

const presentationPath = routes.resources('presentation');

const PresentationResources = () => {
  useScrollToHash();

  const breadcrumbsUrls = [routes.resources(), presentationPath];
  const { getPagePlaylists } = usePlaylists();

  const [allPlaylists, setAllPlaylists] = useState<PlaylistType[]>([]);

  useEffect(() => {
    getPagePlaylists(presentationPath)
      .then(setAllPlaylists)
      .catch((err) => console.error(err));
  }, [getPagePlaylists]);

  const playlists = useMemo(() => {
    return allPlaylists.filter(
      (playlist) => !playlist.title?.toUpperCase().includes('SINGLE')
    );
  }, [allPlaylists]);

  const standalonePresentations = useMemo(() => {
    return allPlaylists.filter((playlist) =>
      playlist.title?.toUpperCase().includes('SINGLE')
    );
  }, [allPlaylists]);

  return (
    <Page
      title={getTitle(presentationPath)}
      kicker={getTitle(routes.resources())}
      breadcrumbsUrls={breadcrumbsUrls}
      pageClassName="download-resources"
      relatedPosts={songbookLink}
    >
      {/* Show message if no playlists */}
      {(!playlists || playlists.length === 0) && (
        <div className="u-space--left">
          <Caption>Няма налични ресурси презентации</Caption>
        </div>
      )}

      <Text as="article" hasDropcap={false} spacing="double">
          <DownloadList items={standalonePresentations[0]?.items || []} />

        <Accordion>
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

export default PresentationResources;

import { useEffect, useState } from 'react';
import { Caption } from 'alps-library/atoms/text/Caption';
import { Text } from 'alps-library/atoms/text/Text';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { getTitle } from 'src/utils/Navigation';
import DownloadList from 'src/components/downloadList/DownloadList';

const imagePath = routes.resources('image');

const ImageResources = () => {
  const breadcrumbsUrls = [routes.resources(), imagePath];
  const { getPagePlaylists } = usePlaylists();
  const [images, setImages] = useState<PlaylistType[]>([]);
  useScrollToHash({ enabled: images.length > 0});

  useEffect(() => {
    getPagePlaylists(imagePath)
      .then(setImages)
      .catch((err) => console.error(err));
  }, [getPagePlaylists]);

  return (
    <Page
      title={getTitle(imagePath)}
      kicker={getTitle(routes.resources())}
      breadcrumbsUrls={breadcrumbsUrls}
      pageClassName="download-resources"
    >
      {/* Show message if no images */}
      {(!images || images.length === 0) && (
        <Caption>Няма налични ресурси изображения</Caption>
      )}

      <Text as="article" hasDropcap={false} spacing="double">
        <DownloadList items={images[0]?.items} />
      </Text>
    </Page>
  );
};

export default ImageResources;

import { useEffect, useState } from 'react';
import { Page } from 'src/organisms/Page';
import routes from 'src/routes';
import { getTitle } from 'src/utils/Navigation';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { PlaylistItemType } from 'src/contexts/PlaylistsContext';
import { Caption } from 'alps-library/atoms/text/Caption';
import DownloadList from './DownloadList';
import { Text } from 'alps-library/atoms/text/Text';

const ImageResources = () => {
  const breadcrumbsUrls = [routes.resources(), routes.resources('image')];
  const { getPlaylists } = usePlaylists();
  const [images, setImages] = useState<PlaylistItemType[]>([]);

  useEffect(() => {
    getPlaylists('item', 'image')
      .then((result) => setImages(result as PlaylistItemType[]))
      .catch((err) => console.error(err));
  }, [getPlaylists]);

  return (
    <Page
      title={getTitle(routes.resources('image'))}
      kicker={getTitle(routes.resources())}
      breadcrumbsUrls={breadcrumbsUrls}
      pageClassName="download-resources"
    >
      {/* Show message if no images */}
      {(!images || images.length === 0) && (
        <Caption>Няма налични ресурси изображения</Caption>
      )}

      <Text as="article" hasDropcap={false} spacing="double">
        <DownloadList items={images} />
      </Text>
    </Page>
  );
};

export default ImageResources;

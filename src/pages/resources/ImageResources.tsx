import { useEffect, useState } from 'react';
import { Caption } from 'alps-library/atoms/text/Caption';
import { Text } from 'alps-library/atoms/text/Text';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { LinkType } from 'src/contexts/PlaylistsContext';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { getTitle } from 'src/utils/Navigation';
import DownloadList from 'src/components/downloadList/DownloadList';

const ImageResources = () => {
  const breadcrumbsUrls = [routes.resources(), routes.resources('image')];
  const { getLinks } = usePlaylists();
  const [images, setImages] = useState<LinkType[]>([]);

  useEffect(() => {
    getLinks('image')
      .then(setImages)
      .catch((err) => console.error(err));
  }, [getLinks]);

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

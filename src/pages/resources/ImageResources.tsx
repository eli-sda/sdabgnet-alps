import { useEffect, useState } from 'react';
import { Page } from 'src/organisms/Page';
import routes from 'src/routes';
import { getTitle } from 'src/utils/Navigation';
import { usePlaylists } from 'src/hooks/usePlaylists';
import { PlaylistItemType } from 'src/contexts/PlaylistsContext';
import { Caption } from 'alps-library/atoms/text/Caption';
import DownloadList from './DownloadList';
import { Accordion } from 'alps-library/molecules/components/accordion/Accordion';
import { Text } from 'alps-library/atoms/text/Text';

const ImageResources = () => {
  const breadcrumbsUrls = [routes.resources(), routes.resources('image')];
  const { getPlaylists } = usePlaylists();
  const [images, setImages] = useState<PlaylistItemType[]>([]);

  useEffect(() => {
    getPlaylists('image')
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

      <Text
        as="article"
        className="c-article__body"
        hasDropcap={false}
        spacing="double"
      >
        <Accordion>
          <DownloadList items={images} />
        </Accordion>
      </Text>
    </Page>
  );
};

export default ImageResources;

import { useEffect, useState } from 'react';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { LinksData, MediaListSection } from './links/MediaLinksPage';

const Communities = (): JSX.Element => {
  const breadcrumbsUrls = [routes.commune(), routes.commune('communities')];

  const [communities, setCommunities] = useState<LinksData[]>([]);

  useEffect(() => {
    fetch('/json/communities.json')
      .then((res) => res.json())
      .then((data: LinksData[]) => setCommunities(data))
      .catch((err) => {
        console.error('Failed to load communities.json', err);
        setCommunities([]);
      });
  }, []);

  return (
    <Page
      title={getTitle(routes.commune('communities'))}
      breadcrumbsUrls={breadcrumbsUrls}
    >
      <MediaListSection sections={communities} doubleSpace />
    </Page>
  );
};

export default Communities;

import { useEffect, useState } from 'react';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { LinksData, MediaListSection } from './links/MediaLinksPage';

const FacebookGroups = (): JSX.Element => {
  const breadcrumbsUrls = [routes.commune(), routes.commune('facebook-groups')];

  const [facebookGroups, setFacebookGroups] = useState<LinksData[]>([]);

  useEffect(() => {
    fetch('/json/facebook-groups.json')
      .then((res) => res.json())
      .then((data: LinksData[]) => setFacebookGroups(data))
      .catch((err) => {
        console.error('Failed to load facebook-groups.json', err);
        setFacebookGroups([]);
      });
  }, []);

  return (
    <Page
      title={getTitle(routes.commune('facebook-groups'))}
      breadcrumbsUrls={breadcrumbsUrls}
    >
      <MediaListSection sections={facebookGroups} doubleSpace />
    </Page>
  );
};

export default FacebookGroups;

import { useEffect, useState } from 'react';
import routes from 'src/routes';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { LinksData, MediaListSection } from './MediaLinksPage';

const Institutions = (): JSX.Element => {
  useScrollToHash();
  const breadcrumbsUrls = [routes.media(), routes.media('institutions')];

  const [institutions, setInstitutions] = useState<LinksData[]>([]);

  useEffect(() => {
    fetch('/json/institutions.json')
      .then((res) => res.json())
      .then((data: LinksData[]) => setInstitutions(data))
      .catch((err) => {
        console.error('Failed to load institutions.json', err);
        setInstitutions([]);
      });
  }, []);

  return (
    <Page
      title={getTitle(routes.media('institutions'))}
      breadcrumbsUrls={breadcrumbsUrls}
      relatedPosts={{
        heading: 'Други връзки',
        blocks: [
          {
            title: getTitle(routes.media('radio')),
            url: routes.media('radio'),
            category: getTitle(routes.media())
          },
          {
            title: getTitle(routes.media('tv')),
            url: routes.media('tv'),
            category: getTitle(routes.media())
          }
        ]
      }}
    >
      <div className="u-spacing--double">
        <MediaListSection sections={institutions} doubleSpace={false} />
      </div>
    </Page>
  );
};

export default Institutions;

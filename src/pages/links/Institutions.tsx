import { useEffect, useState } from 'react';
import routes from 'src/routes';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { getTitle } from 'src/utils/Navigation';
import MediaLinksPage, { LinksData } from './MediaLinksPage';

const Institutions = (): JSX.Element => {
  const [institutions, setInstitutions] = useState<LinksData[]>([]);
  useScrollToHash({ enabled: institutions.length > 0 });

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
    <MediaLinksPage
      mediaType="institutions"
      linksJson={institutions}
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
    />
  );
};

export default Institutions;

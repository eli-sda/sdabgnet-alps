import { useEffect, useState } from 'react';
import MediaLinksPage, { LinkGroup } from './MediaLinksPage';
import { getTitle } from 'src/utils/Navigation';
import routes from 'src/routes';

const AdventistsOnline = (): JSX.Element => {
  const [bgLinks, setBgLinks] = useState<LinkGroup[]>([]);

  useEffect(() => {
    fetch('/json/adventists-online.json')
      .then((res) => res.json())
      .then((data: LinkGroup[]) => setBgLinks(data))
      .catch((err) => {
        console.error('Failed to load adventists-online.json', err);
        setBgLinks([]);
      });
  }, []);

  return (
    <MediaLinksPage
      mediaType="bg-links"
      linksJson={bgLinks}
      relatedPosts={{
        heading: 'Други връзки',
        blocks: [
          {
            title: 'Български адвентни църкви в мрежата',
            url: routes.info('churches'),
            category: getTitle(routes.info())
          },
          {
            title: getTitle(routes.media('institutions')),
            url: routes.media('institutions'),
            category: getTitle(routes.media())
          },
          {
            title: getTitle(routes.media('links')),
            url: routes.media('links'),
            category: getTitle(routes.media())
          }
        ]
      }}
    />
  );
};

export default AdventistsOnline;

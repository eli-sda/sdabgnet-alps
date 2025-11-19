import { useEffect, useState } from 'react';
import MediaLinksPage, { LinksData } from './MediaLinksPage';
import { getTitle } from 'src/utils/Navigation';
import routes from 'src/routes';

const AdventistsOnline = (): JSX.Element => {
  const [bgLinks, setBgLinks] = useState<LinksData[]>([]);

  useEffect(() => {
    fetch('/adventists-online.json')
      .then((res) => res.json())
      .then((data: LinksData[]) => setBgLinks(data))
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
            url: '/info/churches',
            category: getTitle(routes.info())
          },
          {
            title: getTitle(routes.info('institutions')),
            url: '/info/institutions',
            category: getTitle(routes.info())
          },
          {
            title: getTitle(routes.media('links')),
            url: '/media/links',
            category: getTitle(routes.media())
          }
        ]
      }}
    />
  );
};

export default AdventistsOnline;

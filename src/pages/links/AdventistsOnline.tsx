import { useEffect, useState } from 'react';
import MediaLinksPage, { LinkGroup } from './MediaLinksPage';

const AdventistsOnline = (): JSX.Element => {
  const [bgLinks, setBgLinks] = useState<LinkGroup[]>([]);
  const [bgChurchesLinks, setBgChurchesLinks] = useState<LinkGroup[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/adventists-online.json').then((res) => res.json()),
      fetch('/adventis-online-churches.json').then((res) => res.json())
    ])
      .then(([linksData, churchesData]: [LinkGroup[], LinkGroup[]]) => {
        setBgLinks(linksData);
        setBgChurchesLinks(churchesData);
      })
      .catch((err) => {
        console.error('Failed to load adventists-online JSON files', err);
        setBgLinks([]);
        setBgChurchesLinks([]);
      });
  }, []);

  return (
    <MediaLinksPage
      mediaType="bg-links"
      linksJson={bgLinks}
      asideJson={bgChurchesLinks}
      asideTitle="Български адвентни църкви"
    />
  );
};

export default AdventistsOnline;

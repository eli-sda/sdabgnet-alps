import { useEffect, useState } from 'react';
import MediaLinksPage, { LinkGroup } from './MediaLinksPage';

const AdventistsOnline = (): JSX.Element => {
  const [bgLinks, setBgLinks] = useState<LinkGroup[]>([]);
  const [bgChurchesLinks, setBgChurchesLinks] = useState<LinkGroup[]>([]);

  useEffect(() => {
    fetch('/adventists-online.json')
      .then((res) => res.json())
      .then((data: LinkGroup[]) => setBgLinks(data))
      .catch((err) => {
        console.error('Failed to load adventists-online.json', err);
        setBgLinks([]);
      });
  }, []);

  useEffect(() => {
    fetch('/adventis-online-churches.json')
      .then((res) => res.json())
      .then((data: LinkGroup[]) => setBgChurchesLinks(data))
      .catch((err) => {
        console.error('Failed to load adventis-online-churches.json', err);
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

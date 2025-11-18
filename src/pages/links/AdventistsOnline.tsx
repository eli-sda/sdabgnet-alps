import { useEffect, useState } from 'react';
import MediaLinksPage, { LinksData } from './MediaLinksPage';

const AdventistsOnline = (): JSX.Element => {
  const [bgLinks, setBgLinks] = useState<LinksData[]>([]);
  const [bgChurchesLinks, setBgChurchesLinks] = useState<LinksData[]>([]);

  useEffect(() => {
    fetch('/adventists-online.json')
      .then((res) => res.json())
      .then((data: LinksData[]) => setBgLinks(data))
      .catch((err) => {
        console.error('Failed to load adventists-online.json', err);
        setBgLinks([]);
      });
  }, []);

  useEffect(() => {
    fetch('/adventis-online-churches.json')
      .then((res) => res.json())
      .then((data: LinksData[]) => setBgChurchesLinks(data))
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
    />
  );
};

export default AdventistsOnline;

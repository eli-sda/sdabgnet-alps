import { useState, useEffect } from 'react';
import MediaLinksPage, { LinkGroup } from './MediaLinksPage';

const Television = (): JSX.Element => {
  const [tvLinks, setTvLinks] = useState<LinkGroup[]>([]);

  useEffect(() => {
    fetch('/json/television.json')
      .then((res) => res.json())
      .then((data: LinkGroup[]) => setTvLinks(data))
      .catch((err) => {
        console.error('Failed to load television.json', err);
        setTvLinks([]);
      });
  }, []);

  return <MediaLinksPage mediaType="tv" linksJson={tvLinks} isDoubleSpacing />;
};

export default Television;

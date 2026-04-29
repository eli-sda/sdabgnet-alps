import { useState, useEffect } from 'react';
import MediaLinksPage, { LinkGroup } from './MediaLinksPage';

const ForeignLinks = (): JSX.Element => {
  const [foreignLinks, setForeignLinks] = useState<LinkGroup[]>([]);

  useEffect(() => {
    fetch('/json/foreign-links.json')
      .then((res) => res.json())
      .then((data: LinkGroup[]) => setForeignLinks(data))
      .catch((err) => {
        console.error('Failed to load foreign-links.json', err);
        setForeignLinks([]);
      });
  }, []);

  return (
    <MediaLinksPage
      mediaType="links"
      linksJson={foreignLinks}
      isDoubleSpacing
    />
  );
};

export default ForeignLinks;

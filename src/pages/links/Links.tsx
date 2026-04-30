import { useEffect, useState } from 'react';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { MediaType } from 'src/constants';
import MediaLinksPage, { LinkGroup } from './MediaLinksPage';

interface LinksProps {
  jsonName: string;
  mediaType: MediaType;
}

const Links = ({ jsonName, mediaType }: LinksProps): JSX.Element => {
  useScrollToHash();

  const [links, setLinks] = useState<LinkGroup[]>([]);

  useEffect(() => {
    fetch(`/json/${jsonName}.json`)
      .then((res) => res.json())
      .then((data: LinkGroup[]) => setLinks(data))
      .catch((err) => {
        console.error(`Failed to load ${jsonName}.json`, err);
        setLinks([]);
      });
  }, [jsonName]);

  return (
    <MediaLinksPage mediaType={mediaType} linksJson={links} isDoubleSpacing />
  );
};

export default Links;

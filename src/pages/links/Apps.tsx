import { useScrollToHash } from 'src/hooks/useScrollToHash';
import MediaLinksPage, { LinkGroup } from './MediaLinksPage';
import { useEffect, useState } from 'react';

const Apps = (): JSX.Element => {
  useScrollToHash();

  const [apps, setApps] = useState<LinkGroup[]>([]);

  useEffect(() => {
    fetch('/json/apps.json')
      .then((res) => res.json())
      .then((data: LinkGroup[]) => setApps(data))
      .catch((err) => {
        console.error('Failed to load apps.json', err);
        setApps([]);
      });
  }, []);
  return <MediaLinksPage mediaType="apps" linksJson={apps} isDoubleSpacing />;
};

export default Apps;

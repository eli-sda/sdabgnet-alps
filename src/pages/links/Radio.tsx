import { useState, useEffect } from 'react';
import MediaLinksPage, { LinkGroup } from './MediaLinksPage';

const Radio = (): JSX.Element => {
  const [radio, setRadio] = useState<LinkGroup[]>([]);

  useEffect(() => {
    fetch('/json/radio.json')
      .then((res) => res.json())
      .then((data: LinkGroup[]) => setRadio(data))
      .catch((err) => {
        console.error('Failed to load radio.json', err);
        setRadio([]);
      });
  }, []);

  return <MediaLinksPage mediaType="radio" linksJson={radio} isDoubleSpacing />;
};

export default Radio;

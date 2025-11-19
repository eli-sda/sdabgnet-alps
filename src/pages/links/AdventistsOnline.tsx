import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import MediaLinksPage, { LinksData } from './MediaLinksPage';

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

  const aside = (
    <>
      <HeadingBlock title="Български адвентни църкви" />

      <h3 className="c-block__title hyphens-auto u-font--primary--s u-space--half u-theme--color--dark">
        <NavLink
          className="c-block__title-link u-theme--link-hover--dark active"
          to="/info/churches"
        >
          Виж страницата
          <i className="fas fa-arrow-right u-space--half--left"></i>
        </NavLink>
      </h3>
    </>
  );

  return (
    <MediaLinksPage
      mediaType="bg-links"
      linksJson={bgLinks}
      aside={aside}
    />
  );
};

export default AdventistsOnline;

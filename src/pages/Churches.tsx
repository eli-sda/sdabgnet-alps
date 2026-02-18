import { useEffect, useState } from 'react';
import { Caption } from 'alps-library/atoms/text/Caption';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { LinksData, MediaListSection } from './links/MediaLinksPage';

const Churches = () => {
  const breadcrumbsUrls = [routes.info(), routes.info('churches')];

  const [bgChurchesLinks, setBgChurchesLinks] = useState<LinksData[]>([]);

  useEffect(() => {
    fetch('/json/adventis-online-churches.json')
      .then((res) => res.json())
      .then((data: LinksData[]) => setBgChurchesLinks(data))
      .catch((err) => {
        console.error('Failed to load adventis-online-churches.json', err);
        setBgChurchesLinks([]);
      });
  }, []);

  return (
    <Page
      title="Български адвентни църкви"
      kicker={getTitle(routes.info())}
      breadcrumbsUrls={breadcrumbsUrls}
    >
      <div className="u-spacing--double">
        <Caption>
          За да намерите най-близката до вас адвентна църква, посетете{' '}
          <a
            href="https://www.adventist.bg/nameri-carkva"
            target="_blank"
            rel="noopener noreferrer"
          >
            страницата на СЦАСД
          </a>
          , където има интерактивна карта и списък с всички църкви в България.
        </Caption>
        <MediaListSection sections={bgChurchesLinks} doubleSpace={false} />
      </div>
    </Page>
  );
};
export default Churches;

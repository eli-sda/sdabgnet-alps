import { useEffect, useState } from 'react';
import { Button } from 'src/alps/atoms/Button';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { LinksData, MediaListSection } from './links/MediaLinksPage';

const Churches = () => {
  const breadcrumbsUrls = [routes.info(), routes.info('churches')];

  const [bgChurchesLinks, setBgChurchesLinks] = useState<LinksData[]>([]);

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
    <Page
      title="Адвентни църкви в България"
      kicker={getTitle(routes.info())}
      breadcrumbsUrls={breadcrumbsUrls}
    >
      <div className='u-spacing'>
        <Button
          as="a"
          label="Намери църква в страницата на СЦАСД"
          url="https://www.adventist.bg/nameri-carkva"
          isExternal
        />

        <MediaListSection sections={bgChurchesLinks} doubleSpace={false} />
      </div>
    </Page>
  );
};
export default Churches;

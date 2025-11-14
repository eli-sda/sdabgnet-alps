import { useEffect, useState } from 'react';
import { Button } from 'src/alps/atoms/Button';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { LinksData, SectionList } from './links/MediaLinksPage';

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
      aside={<SectionList sections={bgChurchesLinks} doubleSpace={false} />}
    >
      <Button
        as="a"
        label="Намери църква"
        url="https://www.adventist.bg/nameri-carkva"
        isExternal
      />
    </Page>
  );
};
export default Churches;

import { useEffect, useState } from 'react';
import routes from 'src/routes';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { Page } from 'src/organisms/Page';
import { BlockFeed } from 'src/organisms/sections/BlockFeed';
import { getTitle } from 'src/utils/Navigation';
import { createAdBlocks } from 'src/utils/advertisementHelper';
import { useAdvertisements } from 'src/hooks/useAdvertisements';
import { LinksData, MediaListSection } from '../links/MediaLinksPage';

const Services = (): JSX.Element => {
  const breadcrumbsUrls = [routes.health(), routes.health('services')];

  const [services, setServices] = useState<LinksData[]>([]);
  const { healthAdvertisements, getHealthAdvertisements } = useAdvertisements();

  useEffect(() => {
    fetch('/json/healthServices.json')
      // to add later after approve in the json file:
      //   {
      //     "title": "МЕДЕН ДОМ - микро здравен център",
      //     "description": "Намира се в село Медово, общ. Братя Даскалови и е в съседство с един от пчелините за производството на здравословен мед „МАННА”, като неговата роля е да гарантира финансовата стабилност на здравния център.",
      //     "image": "/img/health/honeyhomelifestyle.webp",
      //     "links": [
      //       {
      //         "url": "https://www.facebook.com/honeyhomelifestyle/",
      //         "type": "facebook"
      //       }
      //     ]
      //   }
      .then((res) => res.json())
      .then((data: LinksData[]) => setServices(data))
      .catch((err) => {
        console.error('Failed to load services.json', err);
        setServices([]);
      });
  }, []);

  useEffect(() => {
    if (
      !healthAdvertisements ||
      Object.keys(healthAdvertisements).length === 0
    ) {
      void getHealthAdvertisements();
    }
  }, [getHealthAdvertisements, healthAdvertisements]);

  let adBlocks;

  if (healthAdvertisements && healthAdvertisements.length > 0) {
    adBlocks = createAdBlocks(healthAdvertisements);
  }

  return (
    <Page
      title={getTitle(routes.health('services'))}
      breadcrumbsUrls={breadcrumbsUrls}
    >
      <section className="u-spacing--double">
        <MediaListSection sections={services} doubleSpace />

        {adBlocks && adBlocks.length > 0 && (
          <section id="health-ads" className="u-spacing">
            <HeadingBlock title="Здравни обяви" />

            <BlockFeed
              blocks={adBlocks}
              blocksType="archivePage"
              mediaBlockComponent="AdvertisementBlock"
            />
          </section>
        )}
      </section>
    </Page>
  );
};

export default Services;

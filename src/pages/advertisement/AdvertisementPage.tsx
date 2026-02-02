import { useEffect, useRef, useState } from 'react';
import { isEqual } from 'lodash';
import routes from 'src/routes';
import { AD_TYPES, AdType } from 'src/constants';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import AdvertisementForm from './AdvertisementForm';
import { usePagesMeta } from 'src/hooks/usePagesMeta';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { MediaBlockProps } from 'src/alps/molecules/blocks/MediaBlock';
import { AdvertisementBlockProps } from './AdvertisementBlock';
import { BlockFeed } from 'src/organisms/sections/BlockFeed';
import { getImage } from 'src/utils/ImageHelper';
import { useAdvertisements } from 'src/hooks/useAdvertisements';
import { AdvertisementType } from 'src/contexts/AdvertisementsContext';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';

const AdvertisementPage = ({ type }: { type: AdType }) => {
  useScrollToHash();

  const { getMetaMap } = usePagesMeta();
  const { pageBackground } = usePagesMeta();
  const title = getTitle(routes.advertisement(type));
  const kicker = getTitle(routes.advertisement());
  const [ads, setAds] = useState<AdvertisementType[]>([]);
  const { getAdvertisements } = useAdvertisements();

  const prevParamsRef = useRef<AdType | null>(null);

  useEffect(() => {
    if (isEqual(prevParamsRef.current, type)) return;
    prevParamsRef.current = type;

    getAdvertisements(type)
      .then(setAds)
      .catch((error) => console.error(error));
  }, [getAdvertisements, type]);

  const relatedItems: MediaBlockProps[] = [];

  const otherTypes = AD_TYPES.filter((t) => t !== type);
  const urls = otherTypes.map((t) => routes.advertisement(t));
  // get meta for other types
  const metaMap = getMetaMap(urls);
  urls.forEach((url) => {
    const meta = metaMap[url];

    if (!meta) return;

    const image = getImage(meta.imageUrl, '', false, true);

    const relatedAdverBlock: MediaBlockProps = {
      title: meta.title,
      image: image,
      url
    };

    relatedItems.push(relatedAdverBlock);
  });

  const breadcrumbsUrls = [
    routes.churchLife(),
    routes.advertisement(),
    routes.advertisement(type)
  ];

  const adBlocks: AdvertisementBlockProps[] = ads.map((ad) => {
    const img = ad.image ? getImage(ad.image, '', true) : undefined;

    return {
      name: ad.name,
      place: ad.place,
      email: ad.email,
      phone: ad.phone,
      hasViber: ad.hasViber,
      description: ad.text,
      date: ad.date,
      image: img
    };
  });
  return (
    <Page
      title={title}
      kicker={kicker}
      breadcrumbsUrls={breadcrumbsUrls}
      aside={<AdvertisementForm type={type} />}
      relatedPosts={{ heading: 'Още обяви', blocks: relatedItems }}
      background={pageBackground}
      blockType="archive"
      pageClassName="page-aside-top"
    >
      {adBlocks && (
        <>
          <section id="ads">
            <HeadingBlock title="Обяви" />
          </section>
          <BlockFeed
            blocks={adBlocks}
            blocksType="archivePage"
            mediaBlockComponent="AdvertisementBlock"
          />
        </>
      )}
    </Page>
  );
};

export default AdvertisementPage;

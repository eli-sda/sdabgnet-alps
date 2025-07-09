import { useEffect, useRef, useState } from 'react';
import { isEqual } from 'lodash';
import routes from 'src/routes';
import { AD_TYPES, AdType } from 'src/constants';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import AdvertisementForm from './AdvertisementForm';
import { usePagesMeta } from 'src/hooks/usePagesMeta';
import { MediaBlockProps } from 'src/alps/molecules/blocks/MediaBlock';
import { AdvertisementBlockProps } from './AdvertisementBlock';
import { BlockFeed } from 'src/organisms/sections/BlockFeed';
import { getResponsiveImage } from 'src/utils/ImageHelper';
import { useAdvertisements } from 'src/hooks/useAdvertisements';
import { AdvertisementType } from 'src/contexts/AdvertisementsContext';

const AdvertisementPage = ({ type }: { type: AdType }) => {
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

  AD_TYPES.filter((t) => t !== type).forEach((t) => {
    const url = routes.advertisement(t);
    const metaMap = getMetaMap([url]);
    const meta = metaMap[url];

    if (!meta) return;

    const relatedAdverBlock: MediaBlockProps = {
      title: meta.title,
      image: {
        alt: '',
        srcSet: {
          default: meta.imageUrl || '',
          500: '',
          750: '',
          1200: ''
        }
      },
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
    const srcSet = ad.image ? getResponsiveImage(ad.image, true) : undefined;
    const img = srcSet ? { alt: '', srcSet: srcSet } : undefined;
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
        <BlockFeed
          blocks={adBlocks}
          blocksType="archivePage"
          mediaBlockComponent="AdvertisementBlock"
        />
      )}
    </Page>
  );
};

export default AdvertisementPage;

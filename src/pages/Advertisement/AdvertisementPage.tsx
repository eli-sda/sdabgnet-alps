import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import routes from 'src/routes';
import { ADD_TYPES, AddType } from 'src/constants';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import AdvertisementForm from './AdvertisementForm';
import { usePagesMeta } from 'src/hooks/usePagesMeta';
import { MediaBlockProps } from 'src/alps/molecules/blocks/MediaBlock';
import AdvertisementBlock, {
  AdvertisementBlockProps
} from './AdvertisementBlock';
import ads from './ads.json';
import { BlockFeed } from 'src/organisms/sections/BlockFeed';
import { getResponsiveImage } from 'src/utils/ImageHelper';
import { SourceSet } from 'alps-library/atoms/images/SourceSet';

const AdvertisementPage = ({ type }: { type: AddType }) => {
  const { getMetaMap } = usePagesMeta();
  const { pageBackground } = usePagesMeta();
  const title = getTitle(routes.advertisement(type));
  const kicker = getTitle(routes.advertisement());

  const relatedItems: MediaBlockProps[] = [];

  ADD_TYPES.filter((t) => t !== type).forEach((t) => {
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
  type AdvertisementType = {
    type: AddType;
    date: string;
    text: string;
    name: string;
    place: string;
    email: string;
    phone: string;
    hasViber: boolean;
    image: SanityImageSource | null;
  };

  const adBlocks: AdvertisementBlockProps[] = (ads as AdvertisementType[])
    .filter((ad) => ad.type === type)
    .map((ad) => {
      const srcSet = ad.image ? getResponsiveImage(ad.image, true) : undefined;
      const img = srcSet ? { alt: '', srcSet: srcSet } : undefined;
      return {
        // ...ad,
        name: ad.name,
        place: ad.place,
        email: ad.email,
        phone: ad.phone,
        hasViber: ad.hasViber,
        description: ad.text,
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
    >
      <BlockFeed
        blocks={adBlocks}
        blocksType="archivePage"
        mediaBlockComponent="AdvertisementBlock"
      />
    </Page>
  );
};

export default AdvertisementPage;

import routes from 'src/routes';
import { ADD_TYPES, AddType } from 'src/constants';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import AdvertisementForm from './AdvertisementForm';
import { usePagesMeta } from 'src/hooks/usePagesMeta';
import { MediaBlockProps } from 'src/alps/molecules/blocks/MediaBlock';

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

  return (
    <>
      <Page
        title={title}
        kicker={kicker}
        breadcrumbsUrls={breadcrumbsUrls}
        aside={<AdvertisementForm type={type} />}
        relatedPosts={{ heading: 'Още обяви', blocks: relatedItems }}
        background={pageBackground}
      ></Page>
    </>
  );
};

export default AdvertisementPage;

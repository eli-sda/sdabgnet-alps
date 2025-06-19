import { Page } from 'src/organisms/Page';
import { useLocation } from 'react-router-dom';
import routes from 'src/routes';
import { getTitle } from 'src/utils/Navigation';
import AdvertisementForm from './AdvertisementForm';

export type AddType = Parameters<typeof routes.advertisement>[0];

const AdvertisementPage = () => {
  const location = useLocation();
  const path = location.pathname;
  const title = getTitle(path);

  const typeFromUrl = location.pathname.split('/').pop() as AddType;
  const type: AddType = typeFromUrl;
  const breadcrumbsUrls = [
    routes.churchLife(),
    routes.advertisement(),
    routes.advertisement(type)
  ];

  return (
    <>
      <Page
        title={title}
        breadcrumbsUrls={breadcrumbsUrls}
        aside={<AdvertisementForm type={type} />}
      ></Page>
    </>
  );
};

export default AdvertisementPage;

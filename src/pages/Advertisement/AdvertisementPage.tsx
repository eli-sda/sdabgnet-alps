import routes from 'src/routes';
import { AddType } from 'src/constants';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import AdvertisementForm from './AdvertisementForm';

const AdvertisementPage = ({ type }: { type: AddType }) => {
  const title = getTitle(routes.advertisement(type));

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
        aside={
          <>
            <AdvertisementForm type={type} />
          </>
        }
      ></Page>
    </>
  );
};

export default AdvertisementPage;

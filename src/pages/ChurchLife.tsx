import { Page } from 'src/organisms/Page';
import routes from 'src/routes';
import { getTitle } from 'src/utils/Navigation';

const ChurchLife = () => {
  const breadcrumbsUrls = [routes.churchLife()];
  return (
    <Page
      title={getTitle(routes.churchLife())}
      breadcrumbsUrls={breadcrumbsUrls}
    />
  );
};

export default ChurchLife;

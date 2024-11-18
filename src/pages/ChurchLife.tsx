import { Page } from 'src/organisms/Page';
import routes from 'src/routes';

const ChurchLife = () => {
  const breadcrumbsUrls = [routes.churchLife()];
  return <Page title="Църковен живот" breadcrumbsUrls={breadcrumbsUrls} />;
};

export default ChurchLife;

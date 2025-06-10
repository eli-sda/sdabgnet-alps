import { PageWithSubpages } from 'src/organisms/PageWithSubpages';
import routes from 'src/routes';

const ChurchLife = () => {
  const breadcrumbsUrls = [routes.churchLife()];

  return <PageWithSubpages breadcrumbsUrls={breadcrumbsUrls} />;
};

export default ChurchLife;

import { PageWithSubpages } from 'src/organisms/PageWithSubpages';

import routes from 'src/routes';

const Advertisements = () => {
  const breadcrumbsUrls = [routes.churchLife(), routes.advertisement()];

  return <PageWithSubpages breadcrumbsUrls={breadcrumbsUrls} />;
};

export default Advertisements;
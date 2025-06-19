import { PageWithSubpages } from 'src/organisms/PageWithSubpages';

import routes from 'src/routes';

const Advertisement = () => {
  const breadcrumbsUrls = [routes.churchLife(), routes.advertisement()];

  return <PageWithSubpages breadcrumbsUrls={breadcrumbsUrls} />;
};

export default Advertisement;
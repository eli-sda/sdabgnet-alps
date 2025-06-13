import { PageWithSubpages } from 'src/organisms/PageWithSubpages';

import routes from 'src/routes';

const Health = () => {
  const breadcrumbsUrls = [routes.health()];

  return <PageWithSubpages breadcrumbsUrls={breadcrumbsUrls} />;
};

export default Health;
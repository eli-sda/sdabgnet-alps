import { PageWithSubpages } from 'src/organisms/PageWithSubpages';

import routes from 'src/routes';

const Resources = () => {
  const breadcrumbsUrls = [routes.resources()];

  return <PageWithSubpages breadcrumbsUrls={breadcrumbsUrls} />;
};

export default Resources;
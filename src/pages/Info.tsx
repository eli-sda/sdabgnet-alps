import { PageWithSubpages } from 'src/organisms/PageWithSubpages';

import routes from 'src/routes';

const Info = () => {
  const breadcrumbsUrls = [routes.info()];

  return <PageWithSubpages breadcrumbsUrls={breadcrumbsUrls} />;
};

export default Info;

import { PageWithSubpages } from 'src/organisms/PageWithSubpages';

import routes from 'src/routes';

const Media = () => {
  const breadcrumbsUrls = [routes.info(), routes.media()];

  return <PageWithSubpages breadcrumbsUrls={breadcrumbsUrls} />;
};

export default Media;
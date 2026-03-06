import { PageWithSubpages } from 'src/organisms/PageWithSubpages';

import routes from 'src/routes';
export const SUBPAGE_KICKER = 'Ресурси за изтегляне';

const Resources = () => {
  const breadcrumbsUrls = [routes.resources()];

  return <PageWithSubpages breadcrumbsUrls={breadcrumbsUrls} />;
};

export default Resources;

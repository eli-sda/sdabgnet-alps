import { PageWithSubpages } from 'src/organisms/PageWithSubpages';

import routes from 'src/routes';

const Commune = () => {
  const breadcrumbsUrls = [routes.churchLife(), routes.commune()];
  // const title = getTitle(routes.commune());

  return <PageWithSubpages breadcrumbsUrls={breadcrumbsUrls} />;
};

export default Commune;

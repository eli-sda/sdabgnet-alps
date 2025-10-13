import { PageWithSubpages } from 'src/organisms/PageWithSubpages';

import routes from 'src/routes';

const AudioResources = () => {
  const breadcrumbsUrls = [routes.resources('audio')];

  return <PageWithSubpages breadcrumbsUrls={breadcrumbsUrls} />;
};

export default AudioResources;

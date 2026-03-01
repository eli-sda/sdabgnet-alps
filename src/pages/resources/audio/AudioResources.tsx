import { PageWithSubpages } from 'src/organisms/PageWithSubpages';

import routes from 'src/routes';

export const SUBPAGE_KICKER = 'Ресурси за изтегляне и слушане';

const AudioResources = () => {
  const breadcrumbsUrls = [routes.resources(), routes.resources('audio')];

  return <PageWithSubpages breadcrumbsUrls={breadcrumbsUrls} />;
};

export default AudioResources;

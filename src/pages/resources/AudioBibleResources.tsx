import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import { PageContent } from 'src/alps/organisms/content/PageContent';
import routes from 'src/routes';
import { getBreadcrumbs, getTitle } from 'src/utils/Navigation';

const AudioBibleResources = () => {
  const breadcrumbs = getBreadcrumbs([
    routes.resources(),
    routes.resources('audio'),
    routes.resources('audio', 'bible')
  ]);

  return (
    <>
      <PageHeaderLong
        title={getTitle(routes.resources('audio', 'bible'))}
        kicker={getTitle(routes.resources())}
      />
      <PageContent breadcrumbs={breadcrumbs} />
    </>
  );
};

export default AudioBibleResources;

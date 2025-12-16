import { Page } from 'src/organisms/Page';
import routes from 'src/routes';
import { getTitle } from 'src/utils/Navigation';
import { usePagesMeta } from 'src/hooks/usePagesMeta';

const Dictionary = (): JSX.Element => {
  const breadcrumbsUrls = [routes.info(), routes.info('dictionary')];
  const { pageBackground } = usePagesMeta();

  return (
    <Page
      title={getTitle(routes.info('dictionary'))}
      background={pageBackground}
      breadcrumbsUrls={breadcrumbsUrls}
    ></Page>
  );
};

export default Dictionary;

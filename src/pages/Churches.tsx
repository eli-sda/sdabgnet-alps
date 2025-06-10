import { Page } from 'src/organisms/Page';
import routes from 'src/routes';
import { getTitle } from 'src/utils/Navigation';

const Churches = () => {
  const breadcrumbsUrls = [routes.info(), routes.info('churches')];
  return (
    <Page
      title="Адвентни църкви в България"
      kicker={getTitle(routes.info())}
      breadcrumbsUrls={breadcrumbsUrls}
    ></Page>
  );
};
export default Churches;

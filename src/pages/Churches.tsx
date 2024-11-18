import { Page } from 'src/organisms/Page';
import routes from 'src/routes';

const Churches = () => {
  const breadcrumbsUrls = [routes.info(), routes.info('churches')];
  return (
    <Page
      title="Адвентни църкви в България"
      kicker="Справочник"
      breadcrumbsUrls={breadcrumbsUrls}
    ></Page>
  );
};
export default Churches;

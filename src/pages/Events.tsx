import { Page } from 'src/organisms/Page';
import routes from 'src/routes';

const Events = () => {
  const breadcrumbsUrls = [routes.churchLife(), routes.churchLife('events')];
  return (
    <Page
      title="Събития организирани от ЦАСД България"
      breadcrumbsUrls={breadcrumbsUrls}
    />
  );
};
export default Events;

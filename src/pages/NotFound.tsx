import { NavLink } from 'react-router-dom';
import { Page } from 'src/organisms/Page';
import routes from 'src/routes';

const NotFound = () => {
  const breadcrumbsUrls = ['/'];
  return (
    <Page
      title="Страницата не е намерена!"
      breadcrumbsUrls={breadcrumbsUrls}
    ></Page>
  );
};

export default NotFound;

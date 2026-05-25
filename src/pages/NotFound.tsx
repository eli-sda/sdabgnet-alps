import { Page } from 'src/organisms/Page';

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

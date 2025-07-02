import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import PastorOnlineForm from './PastorOnlineForm';

const PastorOnline = () => {
  const title = getTitle(routes.commune('pastor-online'));
  const breadcrumbsUrls = [
    routes.churchLife(),
    routes.commune('pastor-online')
  ];

  return (
    <Page
      title={title}
      breadcrumbsUrls={breadcrumbsUrls}
      aside={<PastorOnlineForm />}
    ></Page>
  );
};

export default PastorOnline;

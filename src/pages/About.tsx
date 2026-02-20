import { PageWithSubpages } from 'src/organisms/PageWithSubpages';
import routes from 'src/routes';

const About = () => {
  const breadcrumbsUrls = [routes.about()];

  return <PageWithSubpages breadcrumbsUrls={breadcrumbsUrls} />;
};

export default About;

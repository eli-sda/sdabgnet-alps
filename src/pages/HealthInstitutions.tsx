import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import routes from 'src/routes';
import { Grid } from 'alps-library/atoms/grids/Grid';
import { PageLinkItem } from 'src/organisms/PageLinkItem';
import healthInstitutions from 'src/utils/health-institutions.json';

const breadcrumbsUrls = [routes.health(), routes.health('institutions')];

const HealthInstitutions = () => {
  const title = getTitle(routes.health('institutions'));
  const links = healthInstitutions;

  return (
    <>
      <Page title={title} breadcrumbsUrls={breadcrumbsUrls}></Page>

      <Grid
        className={'l-grid l-grid--7-col l-grid-wrap l-grid-wrap--6-of-7'}
        seven={true}
        as="section"
        wrap={'6'}
      >
        {links.map((link, idx) => (
          <PageLinkItem
            key={idx}
            url={link.url}
            title={link.title}
            description={link.description}
          />
        ))}
      </Grid>
    </>
  );
};
export default HealthInstitutions;

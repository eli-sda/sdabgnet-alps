import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import routes from 'src/routes';
import { Grid } from 'alps-library/atoms/grids/Grid';
import { PageLinkItem } from 'src/organisms/PageLinkItem';
import healthInstitutions from 'src/utils/health-institutions.json';
import { ImageType } from 'alps-library/atoms/images/ImageType';

type HealthInstitutionLink = {
  url: string;
  title: string;
  description: string;
  img: string;
};

const breadcrumbsUrls = [routes.health(), routes.health('institutions')];

const HealthInstitutions = () => {
  const title = getTitle(routes.health('institutions'));
  const links = healthInstitutions as HealthInstitutionLink[];

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
            img={
              {
                alt: link.title,
                srcSet: {
                  default: link.img,
                  500: link.img,
                  750: link.img,
                  1200: link.img
                }
              } as ImageType
            }
            sizeAtM="6"
            sizeAtXL="3"
          />
        ))}
      </Grid>
    </>
  );
};
export default HealthInstitutions;

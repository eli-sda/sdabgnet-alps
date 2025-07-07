import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import routes from 'src/routes';
import { Grid } from 'alps-library/atoms/grids/Grid';
import { PageLinkItem } from 'src/organisms/PageLinkItem';
import { ImageType } from 'alps-library/atoms/images/ImageType';
import { ExternalPageLink } from 'src/types/externalPageLink';
import healthInstitutions from 'src/pages/HealthInstitutions.json';

const breadcrumbsUrls = [routes.health(), routes.health('institutions')];

const HealthInstitutions = () => {
  const title = getTitle(routes.health('institutions'));
  const links = healthInstitutions as ExternalPageLink[];

  return (
    <>
      <Page title={title} breadcrumbsUrls={breadcrumbsUrls} blockType="wrap6">
        {links.map(({ url, title, description, img }, idx) => (
          <PageLinkItem
            key={idx}
            url={url}
            title={title}
            description={description}
            img={
              {
                alt: title,
                srcSet: {
                  default: img
                }
              } as ImageType
            }
            sizeAtM="6"
            sizeAtXL="3"
          />
        ))}
      </Page>
    </>
  );
};
export default HealthInstitutions;

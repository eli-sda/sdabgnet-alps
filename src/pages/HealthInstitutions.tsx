import { useEffect, useState } from 'react';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import routes from 'src/routes';
import { isValidUrl } from 'src/utils/FetchHelper';
import { PageLinkItem } from 'src/organisms/PageLinkItem';
import { ImageType } from 'alps-library/atoms/images/ImageType';
import { ExternalPageLink } from 'src/types/externalPageLink';

const breadcrumbsUrls = [routes.health(), routes.health('institutions')];

const HealthInstitutions = () => {
  const title = getTitle(routes.health('institutions'));
  const [links, setLinks] = useState<ExternalPageLink[]>([]);

  useEffect(() => {
    fetch('/healthInstitutions.json')
      .then((res) => res.json())
      .then((data: ExternalPageLink[]) => {
        // Filter out invalid URLs to prevent open redirect vulnerability
        const validLinks = data.filter(item => isValidUrl(item.url));
        setLinks(validLinks);
      })
      .catch((err) => {
        console.error('Failed to load HealthInstitutions.json', err);
        setLinks([]);
      });
  }, []);

  return (
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
              srcSet: { default: img }
            } as ImageType
          }
          sizeAtM="6"
          sizeAtXL="3"
        />
      ))}
    </Page>
  );
};

export default HealthInstitutions;

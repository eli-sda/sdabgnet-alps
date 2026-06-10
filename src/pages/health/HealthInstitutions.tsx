import { useEffect, useState } from 'react';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { getImageTypeByUrl } from 'src/utils/ImageHelper';
import { isValidUrl } from 'src/utils/FetchHelper';
import { getFaIconClass } from 'src/utils/Links';
import { PageLinkItem } from 'src/organisms/PageLinkItem';
import { ExternalPageLink } from 'src/types/externalPageLink';

const breadcrumbsUrls = [routes.health(), routes.health('institutions')];

const HealthInstitutions = () => {
  const title = getTitle(routes.health('institutions'));
  const [links, setLinks] = useState<ExternalPageLink[]>([]);

  useEffect(() => {
    fetch('/json/healthInstitutions.json')
      .then((res) => res.json())
      .then((data: ExternalPageLink[]) => {
        // Filter out invalid URLs to prevent open redirect vulnerability
        // Only validated URLs are stored in state
        const validLinks = data.filter((item) => isValidUrl(item.url));
        setLinks(validLinks);
      })
      .catch((err) => {
        console.error('Failed to load HealthInstitutions.json', err);
        setLinks([]);
      });
  }, []);

  return (
    <Page
      title={title}
      breadcrumbsUrls={breadcrumbsUrls}
      blockType="wrap6"
      pageClassName="full-page"
    >
      {links.map(({ url, title, description, img, links }, idx) => {
        const buttons = links?.map(({ url, type }) => ({
          label: type,
          url,
          faIconClass: `${getFaIconClass(type)} fa-lg`,
          hideExternalIcon: true,
          outline: true,
          isExternal: true
        }));
        return (
          <PageLinkItem
            key={idx}
            url={url}
            title={title}
            description={description}
            img={getImageTypeByUrl(img)}
            buttons={buttons}
            sizeAtM="6"
            sizeAtXL="3"
          />
        );
      })}
    </Page>
  );
};

export default HealthInstitutions;

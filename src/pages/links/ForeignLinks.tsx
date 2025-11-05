import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { LinkGroup, renderLinksBlocks } from 'src/utils/MediaUtils';
import foreignLinks from './foreign-links.json';

const ForeignLinks = () => {
  const breadcrumbsUrls = [routes.media(), routes.media('links')];

  return (
    <Page
      title={getTitle(routes.media('links'))}
      breadcrumbsUrls={breadcrumbsUrls}
    >
      <section className="u-space--top">
        {renderLinksBlocks(foreignLinks as LinkGroup[])}
      </section>
    </Page>
  );
};

export default ForeignLinks;

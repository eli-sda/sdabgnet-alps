import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { LinkGroup, renderLinksBlocks } from 'src/utils/MediaUtils';
import tvLinks from './television.json';

const Television = () => {
  const breadcrumbsUrls = [routes.media(), routes.media('tv')];

  return (
    <Page
      title={getTitle(routes.media('tv'))}
      breadcrumbsUrls={breadcrumbsUrls}
    >
      <section className="u-spacing--double">
        {renderLinksBlocks(tvLinks as LinkGroup[])}
      </section>
    </Page>
  );
};

export default Television;

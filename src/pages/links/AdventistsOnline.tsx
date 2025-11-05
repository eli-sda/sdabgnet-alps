import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { LinkGroup, renderLinksBlocks } from 'src/utils/MediaUtils';
import bgLinks from './adventists-online.json';
import bgChurchesLinks from './adventis-online-churches.json';

const AdventistsOnline = () => {
  const breadcrumbsUrls = [routes.media(), routes.media('bg-links')];

  const asideChurches = (
    <>
      <HeadingBlock title="Български адвентни църкви" />
      {renderLinksBlocks(bgChurchesLinks as LinkGroup[])}
    </>
  );

  return (
    <Page
      title={getTitle(routes.media('bg-links'))}
      breadcrumbsUrls={breadcrumbsUrls}
      aside={asideChurches}
    >
      <section className="u-space--top">
        {renderLinksBlocks(bgLinks as LinkGroup[])}
      </section>
    </Page>
  );
};

export default AdventistsOnline;

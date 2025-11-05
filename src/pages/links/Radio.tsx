import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { LinkGroup, renderLinksBlocks } from 'src/utils/MediaUtils';
import radioBgLinks from './radio-bg.json';
import radioForeignLinks from './radio-foreign.json';

const Radio = () => {
  const breadcrumbsUrls = [routes.media(), routes.media('radio')];

  const asideForeignLinks = (
    <>
      <HeadingBlock title="Чужди" />
      {renderLinksBlocks(radioForeignLinks as LinkGroup[])}
    </>
  );

  return (
    <Page
      title={getTitle(routes.media('radio'))}
      breadcrumbsUrls={breadcrumbsUrls}
      aside={asideForeignLinks}
    >
      <section className="u-space--top u-spacing">
        <HeadingBlock title="Български" />
        {renderLinksBlocks(radioBgLinks as LinkGroup[])}
      </section>
    </Page>
  );
};

export default Radio;

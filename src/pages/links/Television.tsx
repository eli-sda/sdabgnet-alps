import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { getAlpsIcon, getFaIcon, LinkGroup } from 'src/utils/MediaUtils';
import { LinksBlock } from './LinksBlock';
import tvLinks from './television.json';

const Television = () => {
  const breadcrumbsUrls = [routes.media(), routes.media('tv')];

  const renderLinksBlocks = (data: LinkGroup[]) =>
    data.map(({ title, description, image, links }, i) => {
      const buttons = links.map(({ url, type }) => ({
        label: type,
        url,
        className: `link-button u-space--half--right ${
          links.length > 1 ? 'u-space--half--bottom' : ''
        }`,
        faIcon: getFaIcon(type),
        icon: getAlpsIcon(type),
        hideExternalIcon: true,
        simple: true,
        outline: true,
        isExternal: true
      }));

      return (
        <div key={i} className="u-space--bottom">
          <LinksBlock
            title={title}
            description={description}
            picture={image}
            buttons={buttons}
          />
        </div>
      );
    });

  return (
    <Page
      title={getTitle(routes.media('tv'))}
      breadcrumbsUrls={breadcrumbsUrls}
    >
      <section className="u-space--top">
        {renderLinksBlocks(tvLinks as LinkGroup[])}
      </section>
    </Page>
  );
};

export default Television;

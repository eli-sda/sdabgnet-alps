import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { iconConfig } from 'alps-library/atoms/icons/_config';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { LinksBlock } from './LinksBlock';
import bgLinks from './adventists-online.json';
import bgChurchesLinks from './adventis-online-churches.json';

type LinkItem = {
  url: string;
  type: 'сайт' | 'facebook' | 'youtube' | 'instagram' | 'tik tok';
};

type LinkGroup = {
  title: string;
  description?: string;
  links: LinkItem[];
};

const getFaIcon = (type: string): string | undefined => {
  switch (type) {
    case 'сайт':
      return 'globe';
    case 'facebook':
      return 'facebook';
    case 'youtube':
      return 'youtube';
    case 'instagram':
      return 'instagram';
    default:
      return undefined;
  }
};

const getAlpsIcon = (
  type: string
): keyof typeof iconConfig.iconNamesMap | undefined => {
  switch (type) {
    case 'tik tok':
      return 'tiktok';
    default:
      return undefined;
  }
};

const AdventistsOnline = () => {
  const breadcrumbsUrls = [routes.media(), routes.media('bg-links')];

  const renderLinksBlocks = (data: LinkGroup[]) =>
    data.map(({ title, description, links }, i) => {
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
            buttons={buttons}
          />
        </div>
      );
    });

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

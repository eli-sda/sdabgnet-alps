import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { iconConfig } from 'alps-library/atoms/icons/_config';
import { LinksBlock } from './LinksBlock';

interface MediaLinksPageProps {
  mediaType: 'tv' | 'radio' | 'links' | 'courses' | 'bg-links' | 'app';
  linksJson: LinkGroup[];
  linksTitle?: string;
  asideJson?: LinkGroup[];
  asideTitle?: string;
  isDoubleSpacing?: boolean;
}

type LinkItem = {
  url: string;
  type: 'сайт' | 'facebook' | 'youtube' | 'instagram' | 'tik tok';
};

export type LinkGroup = {
  title: string;
  description?: string;
  image?: string;
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
    case 'google play':
      return 'android';
    case 'apple store':
      return 'apple';
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

const MediaLinksPage = ({
  mediaType,
  linksJson,
  linksTitle = '',
  asideJson = [],
  asideTitle = '',
  isDoubleSpacing = false
}: MediaLinksPageProps): JSX.Element => {
  const breadcrumbsUrls = [routes.media(), routes.media(mediaType)];

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
        <LinksBlock
          key={i}
          title={title}
          description={description}
          picture={image}
          buttons={buttons}
        />
      );
    });

  const asideContent = asideJson.length > 0 && (
    <>
      {asideTitle && (
        <div className="u-space--bottom">
          <HeadingBlock title={asideTitle} />
        </div>
      )}
      <div className={`u-spacing${isDoubleSpacing ? '--double' : ''}`}>
        {renderLinksBlocks(asideJson)}
      </div>
    </>
  );

  return (
    <Page
      title={getTitle(routes.media(mediaType))}
      breadcrumbsUrls={breadcrumbsUrls}
      aside={asideContent}
    >
      <>
        {linksTitle && (
          <div className="u-space--bottom">
            <HeadingBlock title={linksTitle} />
          </div>
        )}
        <div className={`u-spacing${isDoubleSpacing ? '--double' : ''}`}>
          {renderLinksBlocks(linksJson)}
        </div>
      </>
    </Page>
  );
};

export default MediaLinksPage;

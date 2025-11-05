import { iconConfig } from 'alps-library/atoms/icons/_config';
import { LinksBlock } from 'src/pages/links/LinksBlock';

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

export const renderLinksBlocks = (data: LinkGroup[]) =>
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

import { iconConfig } from "alps-library/atoms/icons/_config";

export type LinkItem = {
  url: string;
  type: 'сайт' | 'facebook' | 'youtube' | 'instagram' | 'tik tok';
};

export type LinkGroup = {
  title: string;
  description?: string;
  image?: string;
  links: LinkItem[];
};

export const getFaIcon = (type: string): string | undefined => {
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

export const getAlpsIcon = (
  type: string
): keyof typeof iconConfig.iconNamesMap | undefined => {
  switch (type) {
    case 'tik tok':
      return 'tiktok';
    default:
      return undefined;
  }
};

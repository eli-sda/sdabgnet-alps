export type LinkItem = {
  url: string;
  type: 'сайт' | 'facebook' | 'youtube' | 'instagram' | 'tik tok' | 'telegram';
};

const faIconClasses: Record<string, string> = {
  сайт: 'fas fa-globe-americas',
  facebook: 'fab fa-facebook-f',
  youtube: 'fab fa-youtube',
  instagram: 'fab fa-instagram',
  'google play': 'fab fa-google-play',
  'app store': 'fab fa-app-store',
  'tik tok': 'fab fa-tiktok',
  telegram: 'fab fa-telegram-plane'
};

export const getFaIconClass = (type: string) => faIconClasses[type];

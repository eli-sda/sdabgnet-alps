import { PlaylistType } from './contexts/PlaylistsContext';

export const SITE = 'https://new.sdabg.net';
export const OLD_SITE = 'https://sdabg.net';
export const RESOURCES_SITE = 'https://sdasofia.org';

export const RESOURCES_FOLDER = '/sdabg/'; // folder in https://sdasofia.org or https://linuxman.biz - set in vite config proxy also
export const PLAYER_RESOURCES_FOLDER = `${RESOURCES_SITE}${RESOURCES_FOLDER}`; // use for the audio player

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export type AdType = 'services' | 'buySell' | 'other';
export const AD_TYPES: AdType[] = ['services', 'buySell', 'other'];

export type MediaType = 'radio' | 'tv' | 'links' | 'courses' | 'bg-links' | 'app';

export const ERROR_SENDING_MESSAGE =
  'Възникна грешка при изпращането. Моля, използвайте имейла долу в страницата.';

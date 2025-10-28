import { PlaylistType } from './contexts/PlaylistsContext';

export const SITE = 'https://new.sdabg.net';
export const OLD_SITE = 'https://sdabg.net';
export const RESOURCES_SITE = 'https://sdasofia.org';

export const RESOURCES_FOLDER = '/sdabg/'; // folder in https://sdasofia.org or https://linuxman.biz - set in vite config proxy also
export const PLAYER_RESOURCES_FOLDER = `${RESOURCES_SITE}${RESOURCES_FOLDER}`; // use for the audio player

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export type AdType = 'services' | 'buySell' | 'other';
export const AD_TYPES: AdType[] = ['services', 'buySell', 'other'];

export const ERROR_SENDING_MESSAGE =
  'Възникна грешка при изпращането. Моля, използвайте имейла долу в страницата.';

export const demoAudioPlaylist: PlaylistType = {
  _id: 'f2c8d1a9-8b4e-4b27-9e2b-1a2d3f4c5e6q',
  type: 'audio-book',
  author: 'Елън Уайт',
  title: 'Великата борба',
  imageUrl:
    'https://cdn.sanity.io/images/tw3a1q78/production/c3afb9f62487f9bfbe3d363d3fb188116953c70a-1799x1799.webp',
  image: {
    _type: 'image',
    asset: {
      _ref: 'image-c3afb9f62487f9bfbe3d363d3fb188116953c70a-1799x1799-webp',
      _type: 'reference'
    }
  },
  items: [
    {
      _id: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
      author: 'Елън Уайт',
      title: 'Предговор',
      size: 2,
      path: 'audio/books/Velikata borba/-1 - Predgovor.mp3'
    },
    {
      _id: 'b1c2d3e4-f5a6-7890-1234-56789abcdef1',
      author: 'Елън Уайт',
      title: 'Защо трябва да прочетете тази книга?',
      size: 3,
      path: 'audio/books/Velikata borba/-2 - Zashto tryabva da prochetete tazi kniga.mp3'
    }
  ]
};
export const demoAudioPlaylist2: PlaylistType = {
  _id: 'f2c8d1a9-8b4e-4b27-9e2b-1a2d3f4c5e6f',
  type: 'audio-book',
  author: 'Елън Уайт',
  title: 'Великата борба - 2',
  imageUrl: null,
  image: null,
  items: [
    {
      _id: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
      author: 'Елън Уайт',
      title: 'Предговор',
      size: 2,
      path: 'audio/books/Velikata borba/-1 - Predgovor.mp3'
    },
    {
      _id: 'b1c2d3e4-f5a6-7890-1234-56789abcdef1',
      author: 'Елън Уайт',
      title: 'Защо трябва да прочетете тази книга?',
      size: 3,
      path: 'audio/books/Velikata borba/-2 - Zashto tryabva da prochetete tazi kniga.mp3'
    },
    {
      _id: 'c1d2e3f4-a5b6-7890-1234-56789abcdef2',
      author: 'Елън Уайт',
      title: 'Предговор',
      size: 2,
      path: 'audio/books/Velikata borba/-1 - Predgovor.mp3'
    },
    {
      _id: 'd1e2f3a4-b5c6-7890-1234-56789abcdef3',
      author: 'Елън Уайт',
      title: 'Защо трябва да прочетете тази книга?',
      size: 3,
      path: 'audio/books/Velikata borba/-2 - Zashto tryabva da prochetete tazi kniga.mp3'
    }
  ]
};

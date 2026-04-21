import { OLD_SITE, AdType, MediaType } from './constants';

const routes = {
  home: '/',

  churches: '/churches',
  contact: '/contact',
  changelog: '/changelog',

  churchLife: (
    item?:
      | 'lessons'
      | 'lesson'
      | 'lesson-cq'
      | 'lesson-cc'
      | 'lessons-search'
      | 'events'
      | 'topics'
      | 'testimonies'
      | 'poetry'
      | 'humor'
      | 'donations'
  ) => `/church_life${item ? `/${item}` : ''}`, //old ss, preach, articles, ssstories
  lesson: '/church_life/lesson/:year/:quarter/:week',
  lesson_cq: '/church_life/lesson-cq/:year/:quarter/:week',
  lesson_cc: '/church_life/lesson-cc/:year/:quarter/:week',
  commune: (item?: 'pastor-online') => `/commune${item ? `/${item}` : ''}`,
  advertisement: (item?: AdType) => `/adver${item ? `/${item}` : ''}`,

  media: (item?: MediaType) => `/media${item ? `/${item}` : ''}`, //use radios info in media/

  info: (
    item?:
      | 'bibles'
      | 'biblical'
      | 'dictionary'
      | 'comment'
      | 'sunset'
      | 'churches'
  ) => `/info${item ? `/${item}` : ''}`, //https://old.sdabg.net/page.php?id=bible_reference | sunset | teritory

  resources: (
    item?: 'books' | 'audio' | 'video' | 'music' | 'presentation' | 'image',
    audioType?: 'bible' | 'audiobook' | 'seminars' | 'sermons'
  ) => {
    if (item === 'audio' && audioType) {
      return `/resources/audio/${audioType}`;
    }
    return `/resources${item ? `/${item}` : ''}`;
  },
  videoteka: '/videoteka',
  health: (
    item?:
      | 'new-start'
      | 'video'
      | 'books'
      | 'recipes'
      | 'institutions'
      | 'services'
  ) => `/health${item ? `/${item}` : ''}`,
  about: (item?: 'team' | 'banner' | 'feedback') =>
    `/about${item ? `/${item}` : ''}`,
  kids: `${OLD_SITE}/page.php?id=kids`
};
export default routes;

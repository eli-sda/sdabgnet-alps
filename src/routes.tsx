import { OLD_SITE, AddType } from './constants';

const routes = {
  home: '/',

  churches: '/churches',
  contact: '/contact',

  churchLife: (
    item?:
      | 'lessons'
      | 'lesson'
      | 'lesson-cq'
      | 'lesson-cc'
      | 'events'
      | 'topics'
      | 'stories'
      | 'poetry'
      | 'humor'
      | 'donations'
  ) => `/church_life${item ? `/${item}` : ''}`, //old ss, preach, articles, ssstories
  lesson: '/church_life/lesson/:year/:quarter/:week',
  lesson_cq: '/church_life/lesson-cq/:year/:quarter/:week',
  lesson_cc: '/church_life/lesson-cc/:year/:quarter/:week',
  commune: (item?: 'online') => `/commune${item ? `/${item}` : ''}`,
  advertisement: (item?: AddType) => `/adver${item ? `/${item}` : ''}`,

  media: (item?: 'radio' | 'tv' | 'links' | 'courses' | 'bg-links' | 'app') =>
    `/media${item ? `/${item}` : ''}`, //use radios info in media/

  info: (
    item?:
      | 'biblical'
      | 'dictionary'
      | 'comment'
      | 'sunset'
      | 'churches'
      | 'institutions'
  ) => `/info${item ? `/${item}` : ''}`, //https://sdabg.net/page.php?id=bible_reference | sunset | teritory

  resources: (
    item?: 'books' | 'audio' | 'video' | 'music' | 'presentation' //old: ... present
  ) => `/resources${item ? `/${item}` : ''}`,
  health: (
    item?:
      | 'new-start'
      | 'video'
      | 'books'
      | 'recipes'
      | 'institutions'
      | 'services'
  ) => `/health${item ? `/${item}` : ''}`,
  kids: `${OLD_SITE}/page.php?id=kids`
};
export default routes;

import { concat } from 'lodash';
import { GiOpenBook } from 'react-icons/gi';
import {
  RiBookOpenLine,
  RiQuestionAnswerFill,
  RiUserVoiceFill
} from 'react-icons/ri';
import { TbSunset2Filled } from 'react-icons/tb';
import { IconType } from 'react-icons/lib';

// import { SiAudiobookshelf } from 'react-icons/si';
import { LuAudioLines, LuBookAudio } from 'react-icons/lu';

import { iconConfig } from 'alps-library/atoms/icons/_config';
import { BreadcrumbItemProps } from 'src/alps/molecules/navigation/Breadcrumbs';
import { PrimaryNavItemProps } from 'src/alps/molecules/navigation/PrimaryNavItem';
import routes from 'src/routes';
import { SecondaryNavItemProps } from './../alps/molecules/navigation/SecondaryNavItem';
import { OLD_SITE } from 'src/constants';

export const primaryNavigationItems: PrimaryNavItemProps[] = [
  {
    text: 'Църковен живот',
    url: routes.churchLife(),
    faIconClass: 'fas fa-cross',
    subnav: [
      {
        type: 'primary',
        text: 'Проектът SEED',
        url: 'https://seed.asi-bg.org/',
        isExternal: true
      },

      {
        type: 'primary',
        text: 'Съботно училище',
        url: routes.churchLife('lessons'),
        reactIcon: RiBookOpenLine,
        subnav: [
          {
            type: 'primary',
            text: 'СУ за възрастни',
            url: routes.churchLife('lesson')
          },
          {
            type: 'primary',
            text: 'СУ за младежи',
            url: routes.churchLife('lesson-cq')
          },
          {
            type: 'primary',
            text: 'СУ за юноши',
            url: routes.churchLife('lesson-cc')
          },
          {
            type: 'primary',
            text: 'Намери по-стари уроци',
            url: routes.churchLife('lessons-search')
          },
          {
            type: 'primary',
            text: 'СУ за деца',
            url: `${OLD_SITE}/page.php?id=kids#lessons`,
            isExternal: true
          }
        ]
      },
      {
        type: 'primary',
        text: 'Календар със събития',
        url: routes.churchLife('events'),
        faIconClass: 'far fa-calendar-alt'
      },
      {
        type: 'primary',
        text: 'Общуване',
        url: routes.commune(),
        reactIcon: RiQuestionAnswerFill,
        subnav: [
          {
            type: 'primary',
            text: 'Пастор онлайн',
            url: routes.commune('pastor-online'),
            reactIcon: RiQuestionAnswerFill
          },
          {
            type: 'primary',
            text: 'Молитвена група',
            url: 'https://www.facebook.com/groups/188820787814459/',
            faIconClass: 'fab fa-facebook-f',
            isExternal: true
          },
          {
            type: 'primary',
            text: 'Адвентна българска мрежа',
            url: 'https://www.facebook.com/groups/sdabg.net',
            faIconClass: 'fab fa-facebook-f',
            isExternal: true
          },
          {
            type: 'primary',
            text: 'Адвентен форум',
            url: 'https://www.facebook.com/groups/AdventistDiscussions',
            faIconClass: 'fab fa-facebook-f',
            isExternal: true
          }
        ]
      },
      {
        type: 'primary',
        text: 'Проповеди, Статии',
        url: routes.churchLife('topics'),
        isDisabled: true
      },
      {
        type: 'primary',
        text: 'Поезия',
        url: routes.churchLife('poetry'),
        faIconClass: 'fas fa-feather-alt'
      },
      {
        type: 'primary',
        text: 'Обяви',
        url: routes.advertisement(),
        faIconClass: 'fas fa-bullhorn',
        subnav: [
          {
            type: 'primary',
            text: 'Услуги и работа',
            url: routes.advertisement('services'),
            faIconClass: 'fas fa-briefcase'
          },
          {
            type: 'primary',
            text: 'Покупко-продажби и наеми',
            url: routes.advertisement('buySell'),
            faIconClass: 'fas fa-store'
          },
          {
            type: 'primary',
            text: 'Други',
            url: routes.advertisement('other'),
            faIconClass: 'fas fa-tags'
          }
          //добави линк в Други или в Обяви стр.
          //   text: 'Приятелство', isExternal: true, url: 'https://dvamazahristos.org'
        ]
      },
      {
        type: 'primary',
        text: 'Опитности от цял свят',
        url: routes.churchLife('testimonies'),
        faIconClass: 'fas fa-globe'
      },
      {
        type: 'primary',
        text: 'Хумор',
        url: routes.churchLife('humor'),
        isDisabled: true
      },
      {
        type: 'primary',
        text: 'Дарения за каузи',
        url: routes.churchLife('donations'),
        faIconClass: 'fas fa-hand-holding-heart'
      }
    ]
  },
  {
    text: 'БГ Справочник',
    url: routes.info(),
    faIconClass: 'fas fa-book',
    subnav: [
      {
        type: 'primary',
        text: 'Библии',
        url: routes.info('bibles'),
        faIconClass: 'fas fa-bible'
      },
      {
        type: 'primary',
        text: 'Библейски учения и курсове',
        url: routes.info('biblical'),
        faIconClass: 'fas fa-book-reader'
      },
      {
        type: 'primary',
        text: 'Адвентни църкви',
        url: routes.info('churches'),
        icon: 'logo'
      },
      {
        type: 'primary',
        text: 'Речник',
        url: routes.info('dictionary'),
        isDisabled: true
      },
      // {
      //   type: 'primary',
      //   text: 'Коментари на библейски стихове',
      //   url: routes.info('comment'),
      //   isDisabled: true
      // },
      {
        type: 'primary',
        text: 'Залез слънце',
        url: routes.info('sunset'),
        reactIcon: TbSunset2Filled
      }
    ]
  },
  {
    text: 'Медии',
    url: routes.media(),
    faIconClass: 'fas fa-link',
    subnav: [
      {
        type: 'primary',
        text: 'Радиа',
        url: routes.media('radio'),
        faIconClass: 'fas fa-broadcast-tower'
      },
      {
        type: 'primary',
        text: 'Телевизии',
        url: routes.media('tv'),
        faIconClass: 'fas fa-tv'
      },
      {
        type: 'primary',
        text: 'Издателство "Нов живот"',
        isExternal: true,
        url: 'https://newlife-bg.com/'
      },
      {
        type: 'primary',
        text: 'Списание "Християнска мисъл"',
        isExternal: true,
        url: 'https://hm-aw.adventist.bg/'
      },
      {
        type: 'primary',
        text: 'Адвентни отдели и институции',
        url: routes.media('institutions'),
        faIconClass: 'fas fa-link'
      },
      {
        type: 'primary',
        text: 'Адвентисти онлайн',
        url: routes.media('bg-links'),
        faIconClass: 'fas fa-link'
      },
      {
        type: 'primary',
        text: 'Приложения',
        url: routes.media('apps'),
        faIconClass: 'fas fa-mobile-alt'
      },
      {
        type: 'primary',
        text: 'Чужди сайтове',
        url: routes.media('links'),
        faIconClass: 'fas fa-link'
      }
    ]
  },

  {
    text: 'Ресурси',
    url: routes.resources(),
    faIconClass: 'fas fa-download',
    subnav: [
      {
        type: 'primary',
        text: 'Книги',
        url: routes.resources('books'),
        reactIcon: GiOpenBook
      },
      {
        type: 'primary',
        text: 'Аудио',
        url: routes.resources('audio'),
        reactIcon: LuAudioLines,
        subnav: [
          {
            type: 'primary',
            text: 'Аудио Библии',
            url: routes.resources('audio', 'bible'),
            reactIcon: LuBookAudio
          },
          {
            type: 'primary',
            text: 'Аудиокниги',
            url: routes.resources('audio', 'audiobook'),
            reactIcon: LuBookAudio //SiAudiobookshelf
          },
          {
            type: 'primary',
            text: 'Семинари',
            url: routes.resources('audio', 'seminars'),
            reactIcon: RiUserVoiceFill
          },
          {
            type: 'primary',
            text: 'Проповеди',
            url: routes.resources('audio', 'sermons'),
            reactIcon: RiUserVoiceFill
          }
        ]
      },
      {
        type: 'primary',
        text: 'Видео',
        url: routes.resources('video'),
        faIconClass: 'far fa-file-video'
      },
      {
        type: 'primary',
        text: 'Музика',
        url: routes.resources('music'),
        faIconClass: 'far fa-file-audio'
      },
      {
        type: 'primary',
        text: 'Презентации',
        url: routes.resources('presentation'),
        faIconClass: 'far fa-file-powerpoint'
      },
      {
        type: 'primary',
        text: 'Изображения',
        url: routes.resources('image'),
        faIconClass: 'far fa-file-image'
      }
    ]
  },
  // {
  //   text: 'Видеотека',
  //   url: routes.videoteka,
  //   faIconClass: 'fas fa-video'
  // },
  {
    text: 'Здраве',
    url: routes.health(),
    faIconClass: 'fas fa-heartbeat',
    subnav: [
      {
        type: 'primary',
        text: 'Програмата NEW START',
        url: routes.health('new-start')
      },
      {
        type: 'primary',
        text: 'Видео лекции, предавания',
        url: routes.health('video')
      },
      {
        type: 'primary',
        text: 'Здравни книги',
        url: routes.health('books'),
      },
      {
        type: 'primary',
        text: 'Рецепти',
        url: routes.health('recipes')
      },
      {
        type: 'primary',
        text: 'Здравни институции',
        url: routes.health('institutions')
      },
      {
        type: 'primary',
        text: 'Услуги',
        url: routes.health('services'),
        isDisabled: true
      }
    ]
  },
  {
    text: 'За нас',
    url: routes.about(),
    subnav: [
      {
        type: 'primary',
        text: 'Екип',
        url: routes.about('team'),
        faIconClass: 'fas fa-users'
      },
      {
        type: 'primary',
        text: 'Банер',
        url: routes.about('banner')
      },
      {
        type: 'primary',
        text: 'Отзиви',
        url: routes.about('feedback'),
        faIconClass: 'fas fa-comment-dots'
      }
    ]
  },
  {
    text: 'Детски кът',
    url: routes.kids
  }
];

export type MenuItem = {
  /**
   * Specify the text of your MenuItem
   */
  text: string;
  isExternal?: boolean; //Eli added
  isDisabled?: boolean;
  /**
   * Specify the url of your MenuItem
   */
  url?: string;
  subnav?: MenuItem[];
  reactIcon?: IconType;
  /**
   * FontAwesome icon name, for example 'fab fa-facebook-f'
   */
  faIconClass?: string;
  /**
   * SVG icon name from alps icons, for example 'logo'
   */
  icon?: keyof typeof iconConfig.iconNamesMap;
};

export const secondaryNavItems: SecondaryNavItemProps[] = [
  {
    icon: 'contact',
    text: 'Контакт',
    url: routes.contact
  }
];

// Used only for getTitle/breadcrumbs lookup — not rendered directly
export const allSecondaryNavItems: SecondaryNavItemProps[] = [
  ...secondaryNavItems,
  {
    faIconClass: 'fas fa-bell',
    text: 'Какво ново',
    url: routes.changelog
  }
];

export function getTitle(url: string): string {
  return _getTitle(url);
}

function _getTitle(
  targetUrl: string,
  items: MenuItem[] = concat(
    primaryNavigationItems as MenuItem[],
    allSecondaryNavItems
  )
): string {
  // Seach in navigation menu items by url
  for (const item of items) {
    if (item.url === targetUrl) {
      return item.text; // Return the text if URL matches
    }
    // Check if subnav exists and search recursively
    if (item.subnav) {
      const result = _getTitle(targetUrl, item.subnav);
      if (result) return result; // Return the result if found in subnav
    }
  }
  return ''; // if URL is not found
}

export function getBreadcrumbs(
  breadcrumbsUrls: string[]
): BreadcrumbItemProps[] {
  const breadcrumbs: BreadcrumbItemProps[] =
    breadcrumbsUrls.length > 0
      ? [
          {
            text: 'Начало',
            url: routes.home
          }
        ]
      : [];
  breadcrumbsUrls.forEach((url, i) => {
    breadcrumbs.push({
      text: getTitle(url),
      url: i === breadcrumbsUrls.length - 1 ? undefined : url
    });
  });
  return breadcrumbs;
}

export function findMenuItemByUrl(
  targetUrl: string,
  items: MenuItem[] = primaryNavigationItems
): MenuItem | undefined {
  for (const item of items) {
    if (item.url === targetUrl) {
      return item;
    }
    if (item.subnav) {
      const found = findMenuItemByUrl(targetUrl, item.subnav);
      if (found) return found;
    }
  }
  return undefined;
}

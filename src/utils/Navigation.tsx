import { concat } from 'lodash';
import { BreadcrumbItemProps } from 'src/alps/molecules/navigation/Breadcrumbs';
import { PrimaryNavItemProps } from 'src/alps/molecules/navigation/PrimaryNavItem';
import routes from 'src/routes';
import { SecondaryNavItemProps } from './../alps/molecules/navigation/SecondaryNavItem';
import { OLD_SITE } from 'src/constants';

export const primaryNavigationItems: PrimaryNavItemProps[] = [
  {
    text: 'Църковен живот',
    url: routes.churchLife(),
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
        url: routes.churchLife('events')
      },
      {
        type: 'primary',
        text: 'Общуване',
        url: routes.commune(),
        subnav: [
          {
            type: 'primary',
            text: 'Пастор онлайн',
            url: routes.commune('pastor-online')
          },
          {
            type: 'primary',
            text: 'Молитвена група',
            url: 'https://www.facebook.com/groups/188820787814459/',
            isExternal: true
          },
          {
            type: 'primary',
            text: 'Адвентна българска мрежа',
            url: 'https://www.facebook.com/groups/sdabg.net',
            isExternal: true
          },
          {
            type: 'primary',
            text: 'Адвентен форум',
            url: 'https://www.facebook.com/groups/AdventistDiscussions',
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
        isDisabled: true
      },
      {
        type: 'primary',
        text: 'Обяви',
        url: routes.advertisement(),
        subnav: [
          {
            type: 'primary',
            text: 'Услуги/Работа',
            url: routes.advertisement('services')
          },
          {
            type: 'primary',
            text: 'Покупко-Продажби/Наем',
            url: routes.advertisement('buySell')
          },
          {
            type: 'primary',
            text: 'Други',
            url: routes.advertisement('other')
          }
          //добави линк в Други или в Обяви стр.
          //   text: 'Приятелство', isExternal: true, url: 'https://dvamazahristos.org'
        ]
      },
      {
        type: 'primary',
        text: 'Опитности от цял свят',
        url: routes.churchLife('testimonies')
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
        url: routes.churchLife('donations')
      }
    ]
  },
  // {
  //   text: 'Beliefs'
  //   // is_active: true
  // },
  {
    text: 'БГ Справочник',
    url: routes.info(),
    subnav: [
      {
        type: 'primary',
        text: 'Библии',
        url: routes.info('bibles')
      },
      {
        type: 'primary',
        text: 'Библейски учения и курсове',
        url: routes.info('biblical')
      },
      {
        type: 'primary',
        text: 'Адвентни църкви',
        url: routes.info('churches')
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
        url: routes.info('sunset')
      }
    ]
  },
  {
    text: 'Медии',
    url: routes.media(),
    subnav: [
      {
        type: 'primary',
        text: 'Радиа',
        url: routes.media('radio')
      },
      {
        type: 'primary',
        text: 'Телевизии',
        url: routes.media('tv')
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
        url: routes.media('institutions')
      },
      {
        type: 'primary',
        text: 'Адвентисти онлайн',
        url: routes.media('bg-links')
      },
      {
        type: 'primary',
        text: 'Приложения',
        url: routes.media('apps')
      },
      {
        type: 'primary',
        text: 'Чужди сайтове',
        url: routes.media('links')
      }
    ]
  },

  {
    text: 'Ресурси',
    url: routes.resources(),
    subnav: [
      {
        type: 'primary',
        text: 'Книги',
        url: routes.resources('books')
      },
      {
        type: 'primary',
        text: 'Аудио',
        url: routes.resources('audio'),
        subnav: [
          {
            type: 'primary',
            text: 'Аудио Библии',
            url: routes.resources('audio', 'bible')
          },
          {
            type: 'primary',
            text: 'Аудиокниги',
            url: routes.resources('audio', 'audiobook')
          },
          {
            type: 'primary',
            text: 'Семинари',
            url: routes.resources('audio', 'seminars')
          },
          {
            type: 'primary',
            text: 'Проповеди',
            url: routes.resources('audio', 'sermons')
          }
        ]
      },
      {
        type: 'primary',
        text: 'Видео',
        url: routes.resources('video')
      },
      {
        type: 'primary',
        text: 'Музика',
        url: routes.resources('music')
      },
      {
        type: 'primary',
        text: 'Презентации',
        url: routes.resources('presentation')
      },
      {
        type: 'primary',
        text: 'Изображения',
        url: routes.resources('image')
      }
    ]
  },
  {
    text: 'Здраве',
    url: routes.health(),
    subnav: [
      {
        type: 'primary',
        text: 'Програмата New start',
        url: routes.health('new-start'),
        isDisabled: true
      },
      {
        type: 'primary',
        text: 'Видео лекции, предавания',
        url: routes.health('video'),
        isDisabled: true
      },
      {
        type: 'primary',
        text: 'Книги',
        url: routes.health('books'),
        isDisabled: true
      },
      {
        type: 'primary',
        text: 'Рецепти',
        url: routes.health('recipes'),
        isDisabled: true
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
    text: 'Детски кът',
    url: routes.kids
  }
  // {
  //   text: 'Sign up now',
  //   link_class: 'is-bold'
  // }
];

type MenuItem = {
  text: string;
  isExternal?: boolean;
  isDisabled?: boolean;
  url?: string;
  subnav?: MenuItem[];
  icon?: string;
};

export const secondaryNavItems: SecondaryNavItemProps[] = [
  {
    icon: 'find',
    text: 'Намери църква',
    url: routes.churches
  },
  {
    icon: 'contact',
    text: 'Контакт',
    url: routes.contact
  }
];

export function getTitle(url: string): string {
  return _getTitle(url);
}

function _getTitle(
  targetUrl: string,
  items: MenuItem[] = concat(
    primaryNavigationItems as MenuItem[],
    secondaryNavItems
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

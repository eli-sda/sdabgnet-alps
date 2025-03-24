import { BreadcrumbItemProps } from 'src/alps/molecules/navigation/Breadcrumbs';
import { PrimaryNavItemProps } from 'src/alps/molecules/navigation/PrimaryNavItem';
import routes from 'src/routes';

export const primaryNavigationItems: PrimaryNavItemProps[] = [
  {
    text: 'Църковен живот',
    url: routes.churchLife(),
    subnav: [
      {
        type: 'primary',
        text: 'Проекта SEED',
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
            url: routes.commune('online')
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
        url: routes.churchLife('topics')
      },
      {
        type: 'primary',
        text: 'Поезия',
        url: routes.churchLife('poetry')
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
        url: routes.churchLife('stories')
      },
      {
        type: 'primary',
        text: 'Хумор',
        url: routes.churchLife('humor')
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
        text: 'Библейски учения',
        url: routes.info('biblical')
      },
      {
        type: 'primary',
        text: 'Адвентни църкви',
        url: routes.info('churches')
      },
      {
        type: 'primary',
        text: 'Адвентни институции',
        url: routes.info('institutions')
      },
      {
        type: 'primary',
        text: 'Речник',
        url: routes.info('dictionary')
      },
      {
        type: 'primary',
        text: 'Коментари на библейски стихове',
        url: routes.info('comment')
      },
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
        text: 'Радио',
        url: routes.media('radio')
      },
      {
        type: 'primary',
        text: 'Телевизия',
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
        text: 'Онлайн курсове',
        url: routes.media('courses')
      },
      {
        type: 'primary',
        text: 'Адвентисти онлайн',
        url: routes.media('bg-links')
      },
      {
        type: 'primary',
        text: 'Приложения',
        url: routes.media('app')
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
        url: routes.resources('audio')
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
        url: routes.health('new-start')
      },
      {
        type: 'primary',
        text: 'Видео лекции, предавания',
        url: routes.health('video')
      },
      {
        type: 'primary',
        text: 'Книги',
        url: routes.health('books')
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
        url: routes.health('services')
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

export function getTitle(url: string): string {
  return _getTitle(url);
}

type MenuItem = {
  text: string;
  isExternal?: boolean;
  // useNavLink?: boolean;
  url?: string;
  subnav?: MenuItem[];
};

function _getTitle(
  targetUrl: string,
  items: MenuItem[] = primaryNavigationItems
): string {
  //TODO seach in primaryNavigationItems by url
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

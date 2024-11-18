import { PrimaryNavItemProps } from 'alps-library/molecules/navigation/primaryNavItem/PrimaryNavItem';
import routes from '../routes';
import './Header.scss';

import {
  Header as AlpsHeader,
  HeaderProps,
  logosMap
} from 'alps-library/organisms/global/header/Header';

const primaryNavigationItems: PrimaryNavItemProps[] = [
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
        text: 'Седмичен урок',
        url: routes.churchLife('lesson')
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

type MenuItem = {
  text: string;
  isExternal?: boolean;
  useNavLink?: boolean;
  url?: string;
  subnav?: MenuItem[];
};

function _setUseNavLink(items: MenuItem[] = primaryNavigationItems) {
  for (const item of items) {
    if (!item.isExternal) {
      item.useNavLink = true;
    }
    // Check if subnav exists and loop recursively
    if (item.subnav) {
      _setUseNavLink(item.subnav);
    }
  }
}
//set useNavLink to all not external links in the menu
_setUseNavLink();

export function getTitle(url: string): string {
  return _getTitle(url);
}

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

const Header = () => {
  const headerProps: HeaderProps = {
    logoElement: 'SDAbgNet',
    logo: {
      element: logosMap['SDAbgNet'],
      link: routes.home,
      useFillTheme: true,
      useNavLink: true
    },
    secondaryNav: {
      menuLabel: 'Меню',
      searchLabel: 'Търси',
      showMenu: true,
      showSearch: false, //?
      items: [
        {
          icon: 'find',
          text: 'Намери църква',
          url: routes.churches,
          useNavLink: true
        },
        {
          icon: 'contact',
          text: 'Контакт',
          url: routes.contact,
          useNavLink: true
        }
      ]
    },
    primaryNav: {
      items: primaryNavigationItems
    }
  };

  //todo set class this-is-active to the current

  return AlpsHeader(headerProps);
};
export default Header;

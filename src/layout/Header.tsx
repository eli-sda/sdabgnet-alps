import { primaryNavigationItems } from 'src/utils/Navigation';
import routes from '../routes';
import './Header.scss';

import {
  Header as AlpsHeader,
  HeaderProps
} from 'src/alps/organisms/global/Header';

export type MenuItem = {
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

const Header = () => {
  const headerProps: HeaderProps = {
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

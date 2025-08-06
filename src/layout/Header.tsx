import {
  primaryNavigationItems,
  secondaryNavItems
} from 'src/utils/Navigation';
import './Header.scss';

import {
  Header as AlpsHeader,
  HeaderProps
} from 'src/alps/organisms/global/Header';

const Header = () => {
  const headerProps: HeaderProps = {
    secondaryNav: {
      menuLabel: 'Меню',
      searchLabel: 'Търси',
      showMenu: true,
      showSearch: false, //todo show it later when Search is working
      items: secondaryNavItems
    },
    primaryNav: {
      items: primaryNavigationItems
    }
  };

  //todo set class this-is-active to the current

  return AlpsHeader(headerProps);
};
export default Header;

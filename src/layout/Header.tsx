import {
  primaryNavigationItems,
  secondaryNavItems
} from 'src/utils/Navigation';
import './Header.scss';

import {
  Header as AlpsHeader,
  HeaderProps
} from 'src/alps/organisms/global/Header';
import { useChangelog } from 'src/hooks/useChangelog';
import routes from 'src/routes';

const Header = () => {
  const { hasUnread } = useChangelog();

  const headerProps: HeaderProps = {
    secondaryNav: {
      menuLabel: 'Меню',
      searchLabel: 'Търси',
      showMenu: true,
      showSearch: false, //todo show it later when Search is working
      items: [...secondaryNavItems],
      itemsAfterMenu: [
        {
          faIconClass: 'fas fa-bell',
          text: 'Какво ново',
          url: routes.changelog,
          showDot: hasUnread,
          isAlwaysVisible: true
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

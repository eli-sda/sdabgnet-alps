import { useEffect, useState } from 'react';
import { LogoType } from 'alps-library/atoms/icons/library/LogoType';
import { SITE_TITLE } from 'src/constants';
import { NavLink } from 'react-router-dom';

import {
  PrimaryNavigation,
  PrimaryNavigationProps
} from 'src/alps/molecules/navigation/PrimaryNavigation';
import {
  SecondaryNavigation,
  SecondaryNavigationProps
} from 'src/alps/molecules/navigation/SecondaryNavigation';
import {
  DrawerNavigation,
  DrawerNavigationProps
} from 'src/alps/molecules/navigation/DrawerNavigation';

export interface HeaderProps {
  className?: string;
  drawer?: DrawerNavigationProps;
  logo?: LogoType & { url: string };
  primaryNav?: PrimaryNavigationProps;
  secondaryNav: SecondaryNavigationProps;
  /**
   * Specify whether the Header should be a usePathFill variant
   */
  usePathFill?: boolean;
}

export const Header = ({
  drawer = {},
  usePathFill = true,
  logo = {
    canBeDark: false,
    link: '/',
    // element: <SDAbgNet />,
    useFillTheme: usePathFill,
    url: '/img/sdabg.net-map-logo.svg'
  },
  className,
  primaryNav,
  secondaryNav
}: HeaderProps): JSX.Element => {
  const [menuIsOpen, setOpenMenu] = useState(false);
  // const [search, setSearch] = useState('');

  const updateMenuState = () => {
    setTimeout(() => {
      const toOpen = $('body').hasClass('menu-is-active');
      setOpenMenu(toOpen);
    }, 500);
  };

  useEffect(() => {
    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement;
      //to update state when click on opener of the drawer or on a link in it
      if (target.closest('.js-toggle-menu') || target.closest('a')) {
        updateMenuState();
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  const changeOpenMenu = () => {
    updateMenuState();
  };

  const changeSearchMenu = () => {
    changeOpenMenu();
  };

  const logoClass = `c-logo__link ${
    logo?.useFillTheme ? 'u-theme--path-fill--base' : ''
  } ${logo.canBeDark ? 'can-be--dark-dark' : ''}`;

  return (
    <>
      <header
        className={`c-header ${className ? className : ''}`}
        role="banner"
        id="header"
      >
        <div className="c-header--inner">
          <div className="c-header__nav-secondary">
            <SecondaryNavigation
              {...secondaryNav}
              onClickMenu={changeOpenMenu}
              onClickSearch={changeSearchMenu}
            />
          </div>
          <div className="c-header__logo c-logo">
            <NavLink className={logoClass} to={logo.link || ''}>
              {/* {logo.element} */}
              <img
                src={logo.url}
                title={SITE_TITLE}
                alt={`${SITE_TITLE} - лого`}
              />
            </NavLink>
          </div>
          <div className="c-header__nav-primary">
            <PrimaryNavigation {...primaryNav} />
          </div>
        </div>
      </header>
      <DrawerNavigation
        primaryNav={primaryNav}
        secondaryNav={secondaryNav}
        showDrawer={menuIsOpen}
        //TODO?
        // search={{
        //   placeholder: 'Търси...',
        //   submitLabel: 'Търсене',
        //   title: 'Търсене',
        //   onSearch: (e: React.ChangeEvent<HTMLInputElement>) =>
        //     setSearch(e.target.value.trim()),
        //   onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
        //     event.preventDefault();
        //     alert('За съжаление, търсачката все още не работи!');
        //     if (search && import.meta.env.DEV) {
        //       console.log(`Търсене по: ${search}`);
        //     }
        //   }
        // }}
        onClick={changeOpenMenu}
        {...drawer}
      />
    </>
  );
};

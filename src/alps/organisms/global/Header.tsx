import React, { useState } from 'react';
import { LogoType } from 'alps-library/atoms/icons/library/LogoType';
import SDAbgNet from 'src/alps/atoms/images/logos/SDAbgNet';
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
  logo?: LogoType;
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
    element: <SDAbgNet />,
    useFillTheme: usePathFill
  },
  className,
  primaryNav,
  secondaryNav
}: HeaderProps): JSX.Element => {
  const [search, setSearch] = useState('');

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
            <SecondaryNavigation {...secondaryNav} />
          </div>
          <div className="c-header__logo c-logo">
            <NavLink className={logoClass} to={logo.link || ''}>
              {logo.element}
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
        search={{
          placeholder: 'Търси...',
          submitLabel: 'Търсене',
          title: 'Търсене',
          onSearch: (e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value.trim()),
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            alert('За съжаление, търсачката все още не работи!');
            if (search) {
              console.log(`Търсене по: ${search}`);
            }
          }
        }}
        {...drawer}
      />
    </>
  );
};

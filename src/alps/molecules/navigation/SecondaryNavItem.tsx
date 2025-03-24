import React from 'react';
import { IconWrap } from 'alps-library/atoms/icons/IconWrap';
import { SubNavArrow } from 'alps-library/molecules/navigation/primaryNavItem/SubNavArrow';
import { iconConfig } from 'alps-library/atoms/icons/_config';

import { SubNav } from './SubNav';
import { NavLink } from 'react-router-dom';

export interface SecondaryNavItemProps {
  icon?: keyof typeof iconConfig.iconNamesMap;
  isPriority?: boolean;
  noWrap?: boolean;
  onClick?: (any: unknown) => void;
  subnav?: [];
  text: string;
  type?: 'search' | 'menu';
  url?: string;
  useNavLink?: boolean;
}

export const SecondaryNavItem = ({
  icon,
  isPriority = false,
  noWrap,
  onClick,
  subnav,
  type,
  text,
  url = '#',
  useNavLink = true
}: SecondaryNavItemProps): JSX.Element => {
  const linkAttr = {
    // to: url || "",
    // href: url || "",
    className: `c-secondary-nav__link u-font--secondary-nav u-theme--link-hover--base u-color--gray 
    ${noWrap ? 'u-flex--nowrap' : ''}`
  };
  const iconComp = icon && <IconWrap name={icon} size="xs" color="gray" />;
  return (
    <li
      className={`c-secondary-nav__list-item ${
        isPriority ? 'is-priority' : ''
      } ${subnav ? 'has-subnav' : ''} ${
        type ? `c-secondary-nav__list-item__${type}` : ''
      }
      `}
    >
      {onClick ? (
        <a {...linkAttr} onClick={onClick}>
          {iconComp}
          {text}
        </a>
      ) : useNavLink ? (
        <NavLink {...linkAttr} to={url}>
          {iconComp}
          {text}
        </NavLink>
      ) : (
        <a {...linkAttr} href={url} onClick={onClick}>
          {iconComp}
          {text}
        </a>
      )}
      {subnav && (
        <>
          <SubNavArrow />
          <SubNav items={subnav} type="secondary" />
        </>
      )}
    </li>
  );
};

import React from 'react';
import classNames from 'classnames';
import { IconWrap } from 'alps-library/atoms/icons/IconWrap';
import { SubNavArrow } from 'alps-library/molecules/navigation/primaryNavItem/SubNavArrow';
import { iconConfig } from 'alps-library/atoms/icons/_config';

import { SubNav } from './SubNav';
import { NavLink } from 'react-router-dom';

export interface SecondaryNavItemProps {
  icon?: keyof typeof iconConfig.iconNamesMap;
  isPriority?: boolean;
  noWrap?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
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
  url,
  useNavLink = true
}: SecondaryNavItemProps): JSX.Element => {
  const linkClass = {
    // to: url || "",
    // href: url || "",
    className: classNames(
      'c-secondary-nav__link u-font--secondary-nav u-theme--link-hover--base u-color--gray',
      { 'u-flex--nowrap': noWrap }
    )
  };
  if (!url) {
    useNavLink = false;
  }
  const LinkTag = (useNavLink ? NavLink : 'a') as React.ElementType;
  const linkProps = useNavLink ? { to: url } : url ? { href: url } : {};

  const iconComp = icon && <IconWrap name={icon} size="xs" color="gray" />;

  return (
    <li
      className={classNames('c-secondary-nav__list-item', {
        'is-priority': isPriority,
        'has-subnav': subnav,
        [`c-secondary-nav__list-item__${type}`]: type,
        'js-toggle-menu': type,
        'js-toggle-search': type === 'search'
      })}
    >
      <LinkTag {...linkClass} {...linkProps} {...onClick}>
        {iconComp}
        {text}
      </LinkTag>
      {subnav && (
        <>
          <SubNavArrow />
          <SubNav items={subnav} type="secondary" />
        </>
      )}
    </li>
  );
};

import React from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { IconWrap } from 'alps-library/atoms/icons/IconWrap';
import { SubNavArrow } from 'alps-library/molecules/navigation/primaryNavItem/SubNavArrow';

import { MenuItem } from 'src/utils/Navigation';
import { SubNav } from './SubNav';
import { SubNavItemProps } from './SubNavItem';
import './SecondaryNavItem.scss';

export interface SecondaryNavItemProps extends Omit<MenuItem, 'subnav'> {
  isPriority?: boolean;
  /** Always visible regardless of screen size */
  isAlwaysVisible?: boolean;
  noWrap?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  subnav?: SubNavItemProps[];
  type?: 'search' | 'menu';
  useNavLink?: boolean;
  showDot?: boolean;
}

export const SecondaryNavItem = ({
  icon,
  faIconClass,
  isPriority = false,
  isAlwaysVisible = false,
  noWrap,
  onClick,
  subnav,
  type,
  text,
  url,
  useNavLink = true,
  showDot = false
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

  const dot = showDot && <span className="c-secondary-nav__dot" />;

  const iconComp = icon ? (
    <span className="c-secondary-nav__icon-wrap">
      <IconWrap name={icon} size="xs" color="gray" />
      {dot}
    </span>
  ) : faIconClass ? (
    <span className="c-secondary-nav__icon-wrap u-space--quarter--right">
      <i className={faIconClass} aria-hidden="true" />
      {dot}
    </span>
  ) : null;

  return (
    <li
      className={classNames('c-secondary-nav__list-item', {
        'is-priority': isPriority,
        'is-always-visible': isAlwaysVisible,
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

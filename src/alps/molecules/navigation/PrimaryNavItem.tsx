import React, { useCallback, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { SubNavArrow } from 'alps-library/molecules/navigation/primaryNavItem/SubNavArrow';
import { IconWrap } from 'alps-library/atoms/icons/IconWrap';
import useClasses from 'alps-library/helpers/useClasses';

import { SubNavItemProps } from './SubNavItem';
import { SubNav } from './SubNav';
import { MenuItem } from 'src/utils/Navigation';

const statuses = {
  closed: { menu: false, search: false },
  open: { menu: true, search: false },
  openSearch: { menu: true, search: true }
};

function useItemId(text: string, url: string) {
  return useMemo(
    () => (text ? `${text.toLowerCase().replace(' ', '-')}-${url}` : url),
    [text, url]
  );
}

export interface PrimaryNavItemProps extends MenuItem {
  /**
   * Specify whether the PrimaryNavItem should be an active variant
   */
  active?: boolean;
  /**
   * Specify the linkClass of your  PrimaryNavItem
   */
  linkClass?: string;
  onClick?: () => void;
  /**
   * Specify whether the PrimaryNavItem should be a priority variant
   */
  priority?: boolean;
  subnav?: SubNavItemProps[];
  /**
   * Specify whether the PrimaryNavItem should be a noWrap variant
   */
  noWrap?: boolean;

  //Eli added:
  useNavLink?: boolean;
}

function isAnySubnavActive(
  items: SubNavItemProps[] | undefined,
  pathname: string
): boolean {
  if (!items) return false;
  return items.some(
    (item) =>
      (!item.isExternal &&
        item.url &&
        (pathname === item.url || pathname.startsWith(item.url + '/'))) ||
      isAnySubnavActive(item.subnav, pathname)
  );
}

export const PrimaryNavItem = ({
  active = false,
  linkClass = '',
  priority,
  text,
  subnav,
  url = '',
  onClick,
  noWrap,
  isExternal = url.indexOf('http') == 0,
  useNavLink = true,
  faIconClass,
  icon
}: PrimaryNavItemProps): JSX.Element => {
  const id = useItemId(text, url);
  const [isOpen, setIsOpen] = useState(statuses.closed);
  const [openSubNav, setOpenSubNav] = useState<string | null>(null);
  const { pathname } = useLocation();
  const isSubnavActive = isAnySubnavActive(subnav, pathname);

  const subnavClass = isOpen.menu ? 'this-is-active' : '';
  const linkActiveClass =
    active || isSubnavActive || openSubNav === id ? 'this-is-active' : '';
  const liActiveClass = active || openSubNav === id ? 'this-is-active' : '';

  const onArrowClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setIsOpen((prev) =>
        prev.menu || prev.search ? statuses.closed : statuses.open
      );
      setOpenSubNav((prev) => (prev !== id ? id : null));
    },
    [id]
  );

  const linkAttr = {
    target: isExternal ? '_blank' : undefined,
    to: url || '',
    href: url || '',
    className: useClasses(
      `c-primary-nav__link u-font--primary-nav u-theme--link-hover--base u-theme--border-color--base u-color--gray--dark`,
      {
        [linkActiveClass]: !!linkActiveClass,
        withSvgIcon: !!icon,
        [linkClass]: !!linkClass,
        'is-priority': !!priority,
        'u-flex--nowrap': !!noWrap
      }
    )
  };

  const linkIcon = isExternal && (
    <i className="fas fa-external-link-alt fa-sm u-space--quarter--left"></i>
  );

  const iconEl = faIconClass ? (
    <i className={`${faIconClass} u-space--quarter--right`}></i>
  ) : icon ? (
    <IconWrap
      name={icon}
      size="m"
      className="c-alps-icon u-space--quarter--right"
    />
  ) : null;
  const iconWithText = (
    <>
      {iconEl}
      {text}
    </>
  );

  return (
    <li
      className={`c-primary-nav__list-item ${subnav ? 'has-subnav' : ''} ${liActiveClass}`}
    >
      {isExternal ? (
        <a {...linkAttr} onClick={onClick}>
          {iconWithText}
          {linkIcon}
        </a>
      ) : useNavLink ? (
        <NavLink {...linkAttr}>{iconWithText}</NavLink>
      ) : (
        <a {...linkAttr} onClick={onClick}>
          {iconWithText}
        </a>
      )}

      {subnav && <SubNavArrow onClick={onArrowClick} fill="gray" />}
      {subnav && (
        <SubNav items={subnav} className={subnavClass} type="primary" />
      )}
    </li>
  );
};

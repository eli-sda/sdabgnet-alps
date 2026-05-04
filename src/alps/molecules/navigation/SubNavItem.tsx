import React, { useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IconWrap } from 'alps-library/atoms/icons/IconWrap';
import { SubNavArrow } from 'alps-library/molecules/navigation/primaryNavItem/SubNavArrow';
import useToggle from 'alps-library/helpers/useToggle';
import useClasses from 'alps-library/helpers/useClasses';
import {
  backgroundColorClass,
  themeBackgroundClass,
  themeLinkHoverClass
} from 'alps-library/global/colors';
import { MenuItem } from 'src/utils/Navigation';
import { SubNav } from './SubNav';

export interface SubNavItemProps extends MenuItem {
  active?: boolean;
  level?: 'secondary' | 'tertiary';
  onClick?: (e: unknown) => void;
  subnav?: SubNavItemProps[];
  type: 'primary' | 'secondary';

  // Eli added:
  useNavLink?: boolean;
}

export const SubNavItem = ({
  active = false,
  level,
  subnav,
  text,
  url,
  type,
  onClick,
  isExternal = url?.indexOf('http') == 0,
  useNavLink = true,
  isDisabled = false,
  faIconClass,
  icon,
  reactIcon
}: SubNavItemProps): JSX.Element => {
  const hasSubnav = Array.isArray(subnav) && subnav.length > 0;
  const { onToggle, openClass } = useToggle(hasSubnav);
  const isTertiary = level === 'tertiary';
  const { pathname } = useLocation();
  const isSubnavActive =
    !active &&
    hasSubnav &&
    !!subnav?.some(
      (child) =>
        !child.isExternal &&
        child.url &&
        (pathname === child.url || pathname.startsWith(child.url + '/'))
    );
  const effectiveActive = active || isSubnavActive;
  const navLevel = isTertiary ? 'subnav__subnav' : 'subnav';

  const onArrowClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggle();
    },
    [onToggle]
  );

  const linkAttr = {
    target: isExternal ? '_blank' : undefined,
    to: url || '',
    href: url || '',
    className: useClasses(`c-${type}-nav__${navLevel}__link c-subnav__link`, {
      withSvgIcon: !!icon || !!reactIcon,
      active: effectiveActive,
      [themeLinkHoverClass + '--lighter']: isTertiary,
      [themeLinkHoverClass + '--base']: !isTertiary,
      'u-color--gray--darker': type === 'primary'
    })
  };

  const linkIcon = isExternal && (
    <i className="fas fa-external-link-alt u-space--quarter--left"></i>
  );
  // reactIcon is expected to be an Icon component (IconType)
  let reactIconEl: React.ReactNode = null;
  if (reactIcon) {
    const IconComp = reactIcon;
    reactIconEl = (
      <span className="u-icon u-icon--m u-space--quarter--right">
        <IconComp />
      </span>
    );
  }

  const iconEl = faIconClass ? (
    <i className={`${faIconClass} u-space--quarter--right`}></i>
  ) : icon ? (
    <IconWrap
      name={icon}
      size="m"
      className="c-alps-icon u-space--quarter--right"
    />
  ) : (
    reactIconEl
  );
  const iconWithText = (
    <>
      {iconEl}
      {text}
    </>
  );
  return (
    <li
      className={useClasses(
        `c-${type}-nav__${navLevel}__list-item c-subnav__list-item`,
        {
          'has-subnav': hasSubnav,
          [openClass]: hasSubnav,
          [themeBackgroundClass + '--base']: isTertiary,
          [backgroundColorClass + '--gray--light']: !isTertiary
        }
      )}
    >
      {isExternal ? (
        <a {...linkAttr} onClick={onClick}>
          {iconWithText}
          {linkIcon}
        </a>
      ) : useNavLink && !isDisabled ? (
        <NavLink {...linkAttr}>{iconWithText}</NavLink>
      ) : !isDisabled ? (
        <a {...linkAttr} onClick={onClick}>
          {iconWithText}
        </a>
      ) : (
        <span className="c-subnav__link disabled">{iconWithText}</span>
      )}
      {hasSubnav && (
        <SubNavArrow
          fill="gray"
          className={openClass}
          onClick={(e: React.MouseEvent) => {
            onArrowClick(e);
          }}
          isSubNav
        />
      )}
      {hasSubnav && <SubNav items={subnav} level="tertiary" type={type} />}
    </li>
  );
};

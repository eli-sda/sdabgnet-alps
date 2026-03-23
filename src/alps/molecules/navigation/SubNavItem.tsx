import React, { useCallback } from 'react';
import { IconType } from 'react-icons/lib';
import { iconConfig } from 'alps-library/atoms/icons/_config';
import { IconWrap } from 'alps-library/atoms/icons/IconWrap';
import { SubNavArrow } from 'alps-library/molecules/navigation/primaryNavItem/SubNavArrow';
import useToggle from 'alps-library/helpers/useToggle';
import useClasses from 'alps-library/helpers/useClasses';
import { SubNav } from './SubNav';
import {
  backgroundColorClass,
  themeBackgroundClass,
  themeLinkHoverClass
} from 'alps-library/global/colors';
import { NavLink } from 'react-router-dom';

export interface SubNavItemProps {
  active?: boolean;
  level?: 'secondary' | 'tertiary';
  onClick?: (e: unknown) => void;
  subnav?: SubNavItemProps[];
  text: string;
  type: 'primary' | 'secondary';
  url?: string;

  //Eli added:
  isExternal?: boolean;
  useNavLink?: boolean;
  isDisabled?: boolean;
  /**
   * FontAwesome icon name, for example 'fab fa-facebook-f'
   */
  faIconClass?: string;
  /**
   * SVG icon name from alps icons, for example 'logo'
   */
  icon?: keyof typeof iconConfig.iconNamesMap;
  reactIcon?: IconType;
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
  const { onToggle, openClass } = useToggle(false);
  const hasSubnav = Array.isArray(subnav) && subnav.length > 0;
  const isTertiary = level === 'tertiary';
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
      active: active,
      [themeLinkHoverClass + '--lighter']: isTertiary,
      [themeLinkHoverClass + '--base']: !isTertiary,
      'u-color--gray--darker': type === 'primary'
    })
  };

  const linkIcon = isExternal && (
    <i className="fas fa-external-link-alt fa-sm u-space--quarter--left"></i>
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

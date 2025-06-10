import React from 'react';
import renderItems from 'alps-library/helpers/renderItems';
import { SubNavItem, SubNavItemProps } from './SubNavItem';

export interface SubNavProps {
  items?: SubNavItemProps[];
  level?: 'secondary' | 'tertiary';
  type?: 'primary' | 'secondary';
  className?: string;
}

export const SubNav = ({
  items = [],
  level,
  type,
  className = ''
}: SubNavProps): JSX.Element => {
  const isTertiary = level === 'tertiary';
  const navLevel = isTertiary ? 'subnav__subnav' : 'subnav';

  return (
    <ul className={`c-${type}-nav__${navLevel} c-subnav ${className}`}>
      {renderItems(items, SubNavItem, { type, level })}
    </ul>
  );
};

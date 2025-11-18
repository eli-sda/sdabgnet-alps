import React, { useCallback } from 'react';
import useClasses from 'alps-library/helpers/useClasses';
import { buttonConfig } from 'alps-library/atoms/button/_config';
import { IconWrap } from 'alps-library/atoms/icons/IconWrap';
import { iconConfig } from 'alps-library/atoms/icons/_config';
import useToggle from 'alps-library/helpers/useToggle';
import './Button.scss';

import { NavLink } from 'react-router-dom';

export interface ButtonProps {
  title?: string;
  /**
   * Specify whether the Button should be disabled, or not
   */
  disabled?: boolean;
  /**
   * Specify whether the Button should be a lighter, or not
   */
  lighter?: boolean;
  /**
   * Specify whether the Button should be a outline, or not
   */
  outline?: boolean;
  /**
   * Specify whether the Button should be a simple, or not
   */
  simple?: boolean;
  /**
   * Specify whether the Button should be a small variant
   */
  small?: boolean;
  /**
   * Specify whether the Button should be a toggle variant
   */
  toggle?: boolean;
  /**
   * Specify whether the Button should be a toggle variant
   */
  expand?: boolean;
  /**
   * Specify the content of your Button
   */
  label?: string;
  /**
   * Specify the type of your Button
   */
  as?: 'a' | 'button' | 'span';
  /**
   * Specify the url for `a` type of your Button
   */
  url?: string;
  /**
   * If true or string, forces browser download
   */
  download?: boolean;
  /**
   * Specify an `icon` to include in the Button through an string (name of the icon) representing the SVG data of the icon, similar to the `Icon` component
   */
  icon?: keyof typeof iconConfig.iconNamesMap;
  iconSize?: keyof typeof iconConfig.iconSizes.map;
  /**
   * FontAwesome icon name, for example 'download'
   */
  faIcon?: string;
  /**
   * You can set position of icon into the button
   */
  iconPosition?: 'left' | 'right';
  onClick?: (
    event: React.MouseEvent<
      HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement
    >
  ) => void;
  className?: string;
  isExternal?: boolean;
  hideExternalIcon?: boolean;
}

/**
 * Buttons express what action will occur when the user clicks or touches it.
 * Buttons are used to initialize an action, either in the background or foreground of an experience.
 */
export const Button = ({
  label = '',
  disabled = false,
  lighter = false,
  outline = false,
  simple = false,
  small = false,
  toggle = false,
  expand = false,
  url,
  download = false,
  iconPosition = 'left',
  iconSize = 'xs',
  onClick,
  isExternal = false,
  hideExternalIcon = false,
  ...props
}: ButtonProps): JSX.Element => {
  const { openClass, onToggle } = useToggle(false);

  const buttonClass = useButtonClass(
    'o-button',
    disabled,
    {
      lighter: lighter,
      outline: outline,
      simple: simple,
      small: small,
      toggle: toggle,
      expand: expand
    },
    toggle ? openClass : ''
  );

  let icon: JSX.Element | null = null;
  if (props.faIcon) {
    icon = (
      <i
        className={`${props.faIcon} fa-lg ${
          label
            ? `u-space--quarter--${iconPosition === 'left' ? 'right' : 'left'}`
            : ''
        }`}
      ></i>
    );
  } else if (props.icon) {
    icon = (
      <IconWrap
        color={'white'}
        name={props.icon}
        size={iconSize}
        iconPosition={iconPosition}
      />
    );
  }

  const labelWithIcon = (
    <>
      {iconPosition === 'left' && icon}
      {label}
      {iconPosition === 'right' && icon}
      {isExternal && !hideExternalIcon && !download && (
        <i className="fa fa-external-link u-space--quarter--left"></i>
      )}
    </>
  );

  const _onClick = useCallback(
    (
      event: React.MouseEvent<
        HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement
      >
    ) => {
      if (onClick) onClick(event);
      if (toggle) onToggle();
      if (expand) {
        const buttonElement = event.currentTarget as HTMLElement;
        const parentElement = buttonElement.parentElement;
        if (parentElement) {
          parentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    },
    [onClick, onToggle, toggle, expand]
  );

  const handleClick = onClick || toggle ? _onClick : undefined;

  let elementByType: JSX.Element;

  const classes = props.className ? ' ' + props.className : '';

  switch (props.as) {
    case buttonConfig.asOptions[0]: {
      const filename = url?.split('/').pop();
      const linkAttr = {
        target: isExternal ? '_blank' : undefined,
        to: url || '',
        href: url,
        className: `${buttonClass} ${classes}`,
        download: download ? filename ?? 'download' : undefined
      };

      elementByType =
        isExternal || !url || download || url.startsWith('#') ? (
          <a {...linkAttr} onClick={handleClick} title={props.title}>
            {labelWithIcon}
          </a>
        ) : (
          <NavLink {...linkAttr}>{labelWithIcon}</NavLink>
        );

      break;
    }
    case buttonConfig.asOptions[2]:
      elementByType = (
        <span
          className={buttonClass + classes}
          onClick={handleClick}
          title={props.title}
        >
          {labelWithIcon}
        </span>
      );
      break;
    default:
      elementByType = (
        <button
          className={buttonClass + classes}
          onClick={handleClick}
          disabled={disabled}
          title={props.title}
        >
          {labelWithIcon}
        </button>
      );
      break;
  }

  return elementByType;
};

function useButtonClass(
  base: string,
  disabled: boolean,
  flags: { [key: string]: string | boolean },
  extras: string
) {
  const validClasses: { [key: string]: string | boolean } = {
    disabled: disabled
  };

  Object.keys(flags).map((flag) => {
    if (flags[flag]) {
      validClasses[`${base}--${flag}`] = flags[flag];
    }
  });

  return useClasses(base, validClasses, extras);
}

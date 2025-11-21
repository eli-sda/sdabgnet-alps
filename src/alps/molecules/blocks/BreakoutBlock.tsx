import React from 'react';
import {
  themeBackgroundClass,
  themeColorClass
} from 'alps-library/global/colors';
import { NavLink } from 'react-router-dom';

export interface BreakoutBlockProps {
  /**
   * Specify the title of your BreakoutBlock
   */
  title: string;
  /**
   * Specify the description of your BreakoutBlock
   */
  description: string;
  /**
   * Specify the content of your BreakoutBlocks Button
   */
  cta: string;
  /**
   * Specify the url of your BreakoutBlock
   */
  url: string;
  backgroundClass?: string;
}

export const BreakoutBlock = ({
  title,
  description,
  cta,
  url,
  backgroundClass = themeBackgroundClass + '--darker'
}: BreakoutBlockProps): JSX.Element => {
  const isExternal = url.startsWith('http');
  const linkAttr = {
    target: isExternal ? '_blank' : undefined,
    to: url || '',
    href: url || '',
    className: 'o-button o-button--lighter'
  };
  return (
    <div
      className={
        'c-block__breakout u-padding u-padding--double--top u-padding--double--bottom u-spacing can-be--dark-dark ' +
        backgroundClass
      }
    >
      <h3 className={'c-block__title u-color--white'}>{title}</h3>
      <p className={'c-block__body ' + themeColorClass + '--lighter'}>
        {description}
      </p>
      {cta &&
        url &&
        (isExternal ? (
          <a {...linkAttr}>
            {cta} <i className="fas fa-external-link-alt u-space--quarter--left"></i>
          </a>
        ) : (
          <NavLink {...linkAttr}>{cta}</NavLink>
        ))}
    </div>
  );
};

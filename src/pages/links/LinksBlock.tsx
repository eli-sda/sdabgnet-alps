// Copy CtaBlock.tsx from alps-library
import React from 'react';
import { canBeClass, themeBorderColorClass } from 'alps-library/global/colors';
import { Button, ButtonProps } from 'src/alps/atoms/Button';
import { generateId } from 'src/utils/Links';
import './LinksBlock.scss';

export interface LinksBlockProps {
  /**
   * Specify the title of your LinksBlock
   */
  title: string;
  /**
   * Specify the link of your LinksBlock title
   */
  link?: string;
  /**
   * Specify the description of your LinksBlock
   */
  description?: string;
  /**
   * Specify the description with color of your LinksBlock
   */
  colorDescription?: string;
  picture?: string;
  /**
   * Small circular image to display next to the title
   */
  smallImage?: string;
  /**
   * Array of buttons (label, url, icon, etc.)
   */
  buttons?: ButtonProps[];
  children?: React.ReactNode;
}

export const LinksBlock = ({
  title,
  link,
  description = '',
  colorDescription = '',
  buttons = [],
  picture,
  smallImage,
  children
}: LinksBlockProps): JSX.Element => {
  const backgroundClass = picture ? 'has-image' : '';

  const id = generateId(title);

  return (
    <div
      id={id}
      className={`links-block c-cta-block c-block ${canBeClass}--dark-dark u-border--left ${themeBorderColorClass}--darker--left ${backgroundClass}`}
    >
      {picture && (
        <div className="u-padding--half">
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer">
              <img src={picture} />
            </a>
          ) : (
            <img src={picture} />
          )}
        </div>
      )}
      <div
        className={
          'c-cta-block__content c-block__content u-spacing--half u-padding--half'
        }
      >
        <div className={'c-cta-block__group c-block__group u-spacing--half'}>
          {title && (
            <div className="title-with-image">
              {smallImage && (
                <img
                  src={smallImage}
                  alt=""
                  className="small-image u-space--half--right"
                />
              )}
              {link ? (
                <a
                  className="u-font--primary--m c-block__title-link u-theme--color--darker u-theme--link-hover--dark"
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <strong>
                    {title}
                    <i className="fas fa-external-link-alt u-space--quarter--left"></i>
                  </strong>
                </a>
              ) : (
                <h3 className="c-block__title u-font--primary--m">{title}</h3>
              )}
            </div>
          )}
          {description && (
            <p
              className={`c-block__body ${
                title ? 'u-font--secondary' : 'u-font--secondary--m'
              }`}
            >
              {description.split('\n').map((line, i, arr) => (
                <React.Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          )}
          {children}
          {colorDescription && (
            <p
              className={
                'c-block__meta u-font--secondary--xs u-theme--color--base'
              }
            >
              {colorDescription}
            </p>
          )}
        </div>
        {Array.isArray(buttons) && buttons.length > 0 && (
          <div className="c-cta-block__buttons c-block__buttons">
            {buttons.map(
              (
                {
                  label,
                  url,
                  outline,
                  icon,
                  faIconClass,
                  iconPosition = 'left',
                  iconSize = 'm',
                  isExternal = true,
                  className,
                  ...btnProps
                },
                key
              ) => (
                <Button
                  as="a"
                  className={`c-block__button ${className || ''}`}
                  key={`cta-btn-${key}`}
                  label={label}
                  url={url}
                  outline={outline}
                  icon={icon}
                  faIconClass={faIconClass}
                  iconPosition={iconPosition}
                  iconSize={iconSize}
                  isExternal={isExternal}
                  {...btnProps}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

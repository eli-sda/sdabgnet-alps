// Copy CtaBlock.tsx from alps-library

import { canBeClass, themeBorderColorClass } from 'alps-library/global/colors';
import { Button, ButtonProps } from 'src/alps/atoms/Button';
import './LinksBlock.scss';

export interface LinksBlockProps {
  /**
   * Specify the title of your LinksBlock
   */
  title: string;
  /**
   * Specify the description of your LinksBlock
   */
  description?: string;
  picture?: string;
  /**
   * Small circular image to display next to the title
   */
  smallImage?: string;
  /**
   * Array of buttons (label, url, icon, etc.)
   */
  buttons?: ButtonProps[];
}

export const LinksBlock = ({
  title,
  description = '',
  buttons = [],
  picture,
  smallImage,
}: LinksBlockProps): JSX.Element => {
  const backgroundClass = picture ? 'has-image' : '';

  return (
    <div
      className={`links-block c-cta-block c-block ${canBeClass}--dark-dark u-border--left ${themeBorderColorClass}--darker--left ${backgroundClass}`}
    >
      {picture && (
        <div className="u-padding--half">
          <img src={picture} alt={picture} />
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
              <h3 className="c-block__title u-font--primary--m">
                {title}
              </h3>
            </div>
          )}
          {description && (
            <p
              className={`c-block__body ${
                title ? 'u-font--secondary' : 'u-font--secondary--m'
              }`}
            >
              {description}
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
                  simple,
                  icon,
                  faIcon,
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
                  simple={simple}
                  icon={icon}
                  faIcon={faIcon}
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

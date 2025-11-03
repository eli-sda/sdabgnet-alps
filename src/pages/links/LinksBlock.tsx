// Copy CtaBlock.tsx from alps-library to use our Button and set u-spacing-half class

import { SourceSet } from 'alps-library/atoms/images/SourceSet';
import { canBeClass, themeBorderColorClass } from 'alps-library/global/colors';
import useResponsiveStyles from 'alps-library/helpers/useResponsiveStyles';
import { InlineStyles } from 'alps-library/helpers/InlineStyles';
import { Button, ButtonProps } from 'src/alps/atoms/Button';

export interface LinksBlockProps {
  /**
   * Specify the title of your LinksBlock
   */
  title: string;
  /**
   * Specify the description of your LinksBlock
   */
  description?: string;
  picture?: SourceSet;
  /**
   * Specify whether the LinksBlock should be a asBackgroundImage variant
   */
  asBackgroundImage?: boolean;
  /**
   * Array of buttons (label, url, icon, etc.)
   */
  buttons?: ButtonProps[];
}

const getBackgroundRule = (url: string) => `.o-background-image {
  background-image: url('${url}');
}`;

export const LinksBlock = ({
  title,
  description = '',
  asBackgroundImage = false,
  buttons = [],
  picture
}: LinksBlockProps): JSX.Element => {
  const bgInlineStyles = useResponsiveStyles(getBackgroundRule, picture);

  const backgroundClass =
    picture && asBackgroundImage
      ? 'has-background-image o-background-image u-background--cover u-theme--gradient--bottom'
      : picture
      ? 'has-image'
      : '';

  return (
    <div
      className={`c-cta-block c-block ${canBeClass}--dark-dark u-border--left ${themeBorderColorClass}--darker--left ${backgroundClass}`}
    >
      {bgInlineStyles && <InlineStyles styles={bgInlineStyles} />}

      <div
        className={
          'c-cta-block__content c-block__content u-spacing--half u-padding--half'
        }
      >
        <div className={'c-cta-block__group c-block__group u-spacing--half'}>
          {title && (
            <h3
              className="c-block__title u-font--primary--m" //{`c-block__title u-font--primary--${title && description ? 'l' : 'xl'}`}
            >
              {title}
            </h3>
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

      {picture && !asBackgroundImage && (
        <div className="c-cta-block__image c-block__image o-background-image u-background--cover" />
      )}
    </div>
  );
};

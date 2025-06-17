import React from 'react';
import useClasses from 'alps-library/helpers/useClasses';
import useToggle from 'alps-library/helpers/useToggle';
import { themeBorderColorClass } from 'alps-library/global/colors';
import { MediaImage } from 'alps-library/molecules/blocks/mediaBlock/MediaImage';
import { ImageType } from 'alps-library/atoms/images/ImageType';
import {
  dateFormatsMap,
  DateTimeFormat,
  StyleOptions
} from 'alps-library/helpers/DateTimeFormat';
import { getFontClass } from 'alps-library/global/fonts';
import { Button } from 'src/alps/atoms/Button';
import { NavLink } from 'react-router-dom';

export interface ContentBlockProps {
  /**
   * Specify the title of your ContentBlock
   */
  title?: string;
  /**
   * Specify the size of your titleSize
   */
  titleSize?: 's' | 'm' | 'l';

  /**
   * Specify the description of your ContentBlock
   */
  description?: string;
  /**
   * Specify the content of your ContentBlocks Button
   */
  cta?: string;

  /**
   * Specify the date of your ContentBlock
   */
  date?: number;
  /**
   * Specify the datetime of your ContentBlock
   */
  datetime?: number;
  /**
   * Specify the dateFormat of your ContentBlock
   */
  dateFormat?: keyof typeof dateFormatsMap;
  dateLocales?: [];
  dateStyle?: StyleOptions;

  /**
   * Specify the url of your ContentBlock
   */
  url?: string;
  meta?: string;
  /**
   * Specify the category of your ContentBlock
   */
  category?: string;
  /**
   * Specify whether the ContentBlock should be a expand variant
   */
  expand?: boolean;
  /**
   * Specify whether the ContentBlock should be a withImage variant
   */
  withImage?: boolean;
  more?: string;
  image?: ImageType;
}

export const ContentBlock = ({
  title,
  titleSize = 's',
  description,
  cta = '',
  date,
  dateFormat = 'datetime',
  dateLocales,
  dateStyle,
  url = '',
  category = '',
  more = '',
  image
}: ContentBlockProps): JSX.Element => {
  const { onToggle, openClass } = useToggle();

  const classes = useClasses(
    'c-block c-block__text u-border--left u-clear-fix ' +
      themeBorderColorClass +
      '--darker ' +
      'u-padding u-background-color--gray--light', //added this to have a background color
    {
      'c-block__text-expand': more,
      'has-image': image !== undefined
    },
    `${openClass}`
  );

  const moreClasses = more ? ' can-be--dark-dark u-clear-fix' : '';

  const isExternal = url.startsWith('http');

  const linkAttr = {
    target: isExternal ? '_blank' : undefined,
    to: url || '',
    href: url,
    className: 'c-block__title-link u-theme--link-hover--dark'
  };

  return (
    <div className={classes + moreClasses}>
      {image && <MediaImage image={image} url={url} />}
      <div className="u-spacing">
        <h3
          className={`${
            titleSize ? getFontClass('primary', titleSize) : 'u-font--primary'
          } u-theme--color--darker`}
        >
          {url ? (
            isExternal ? (
            <a {...linkAttr}>
                <strong>{title}</strong>
            </a>
          ) : (
            <NavLink
                {...linkAttr}
              >
                <strong>{title}</strong>
              </NavLink>
          )
          ) : (
            <strong>{title}</strong>
          )}
        </h3>

        {description && <p className={'c-block__body'}>{description}</p>}

        {(category || date) && (
          <span className="c-block__meta u-font--secondary--xs u-theme--color--dark">
            {category && (
              <div className="c-block__category u-text-transform--upper">
                {category}
              </div>
            )}

            {date && (
              <time
                className="c-block__date u-text-transform--upper"
                dateTime={`${date}`}
              >
                <DateTimeFormat
                  datetime={date}
                  locales={dateLocales}
                  format={dateFormat}
                  style={dateStyle}
                />
              </time>
            )}
          </span>
        )}

      {more ? (
        <>
          <div className="c-block__content">
            <p>{more}</p>
          </div>
          <Button
            as={'a'}
            className={openClass}
            expand={true}
            onClick={onToggle}
            outline={true}
            toggle={true}
          />
        </>
      ) : (
        cta &&
        url && (
          <Button
            as="a"
            className="c-block__button"
            // icon="arrow-long-right"
            // iconPosition="right"
            outline={true}
            label={cta}
            url={url}
            isExternal={isExternal}
          />
        )
      )}
      </div>
    </div>
  );
};

import React from 'react';

import { MediaImage } from './MediaImage';
import presets from 'alps-library/molecules/blocks/mediaBlock/MediaBlock.presets';
import { Figure } from 'alps-library/molecules/media/figure/Figure';
import {
  dateFormatsMap,
  DateTimeFormat,
  StyleOptions
} from 'alps-library/helpers/DateTimeFormat';
import { Button } from 'src/alps/atoms/Button';
import { ImageType } from 'alps-library/atoms/images/ImageType';
import useClasses from 'alps-library/helpers/useClasses';
import { iconConfig } from 'alps-library/atoms/icons/_config';
import { MediaBlockTypesMap } from 'alps-library/molecules/blocks/mediaBlock/MediaBlock';
import Title from 'src/utils/Title';
import './MediaBlock.scss';
import useToggle from 'alps-library/helpers/useToggle';

export interface MediaBlockProps {
  /**
   * Specify whether the MediaBlock should be an asBackgroundImage variant
   */
  asBackgroundImage?: boolean;
  /**
   * Specify the type of your  mediaIcon
   */
  mediaIcon?: 'audio' | 'gallery' | 'video';
  mediaIconAction?: () => void; //click handler for media icon
  mediaIconTitle?: string; //title for media icon button
  /**
   * Specify the blockProps of your MediaBlock
   */
  blockProps?: React.HTMLAttributes<HTMLDivElement>;
  /**
   * Specify the category of your MediaBlock
   */
  category?: string;
  /**
   * Specify whether the MediaBlock should be a column variant
   */
  column?: boolean;
  /**
   * Specify the content of your MediaBlocks Button
   */
  cta?: string;
  ctaIcon?: keyof typeof iconConfig.iconNamesMap;
  /**
   * You can set position of icon into the button
   */
  ctaIconPosition?: 'left' | 'right';
  /**
   * Specify the description of your MediaBlocks Button
   */
  description?: string;

  /**
   * Specify additional content to show in the block (e.g., modal, popup, etc.)
   */
  additionalContent?: React.ReactNode;

  /**
   * Specify the date of your MediaBlocks
   */
  date?: number;
  /**
   * Specify the dateFormat of your MediaBlocks
   */
  dateFormat?: keyof typeof dateFormatsMap;
  dateLocales?: [];
  dateStyle?: StyleOptions;
  image?: ImageType;
  /**
   * Specify the imageCaption of your MediaBlocks
   */
  imageCaption?: string;
  /**
   * Specify the kicker of your MediaBlocks
   */
  kicker?: string;
  /**
   * Specify the kickerAs of your mediaBlock
   */
  kickerAs?: 'h1' | 'h2' | 'h3' | 'h4';
  /**
   * Specify the url of your mediaBlock
   */
  url?: string;
  /**
   * Specify whether the MediaBlock should be an reversed variant
   */
  reversed?: boolean;
  /**
   * Specify whether the MediaBlock should be an stackedUntilSmall variant
   */
  stackedUntilSmall?: boolean;
  /**
   * Specify the title of your mediaBlock
   */
  title?: string;
  /**
   * Specify the titleAs of your mediaBlock
   */
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4';
  /**
   * Specify the titlePrefix of your mediaBlock
   */
  titlePrefix?: string;
  type?: keyof typeof MediaBlockTypesMap;
  video?: string | undefined;
  /**
   * Specify whether the description should be expandable
   */
  expandable?: boolean;
  /**
   * If true, NavLink will render as <a>
   */
  useLinkAsA?: boolean;
}

/**
 * The MediaBlock Component
 */
export const MediaBlock = ({
  asBackgroundImage = false,
  mediaIcon,
  mediaIconAction,
  mediaIconTitle,
  blockProps,
  category,
  cta,
  ctaIcon = 'arrow-long-right',
  ctaIconPosition,
  date,
  dateFormat = 'date',
  dateLocales,
  dateStyle = { date: 'long' },
  description,
  additionalContent,
  image,
  imageCaption,
  kicker,
  kickerAs = 'h3',
  reversed = false,
  stackedUntilSmall,
  title,
  titleAs = 'h3',
  titlePrefix,
  type = 'default',
  video,
  url,
  expandable = false,
  useLinkAsA = false
}: MediaBlockProps): JSX.Element => {
  // Get preset props current type

  const preset = presets[type];

  const isReversed = reversed; //reversed !== undefined ? reversed : preset.reversed;

  const blockType = 'type' in preset ? preset.type : type;
  const icon = mediaIcon || ('icon' in preset ? preset.icon : undefined);

  const wrapClasses = useClasses(`c-media-block c-block`, {
    [`c-block__${blockType}`]: blockType,
    'c-block__stacked--until-small':
      blockType &&
      (stackedUntilSmall ||
        ('stackedUntilSmall' in preset ? preset.stackedUntilSmall : false)),
    'c-media-block--reversed': blockType && isReversed, // TODO: Ask how reverse clases work in ALPS?
    'c-block--reversed': blockType && isReversed
  });
  const KickerTag = kickerAs; // TypeScript ensures it's a valid tag
  const TitleTag = titleAs; // TypeScript ensures it's a valid tag

  const { onToggle, openClass } = useToggle(false, 'expanded', 'collapsed');

  return (
    <div
      className={`${wrapClasses} ${'block' in preset ? preset.block : ''}`}
      {...blockProps}
    >
      {image && (
        <>
          <MediaImage
            className={`${'image' in preset ? preset.image : ''}`}
            icon={!mediaIconAction ? icon : undefined}
            asBackgroundImage={asBackgroundImage}
            caption={imageCaption}
            image={image}
            url={url}
          />
          {mediaIconAction && (
            <div className="media-icon-button-container">
              <button
                className={`media-icon-button icon--${icon} o-button u-space--half--left u-space--half--bottom`}
                onClick={mediaIconAction}
                title={mediaIconTitle}
              ></button>
            </div>
          )}
        </>
      )}
      {video && (
        <div className="c-block__image-wrap">
          <Figure videoSrc={video} />
        </div>
      )}
      <div
        className={`c-block__content ${
          'content' in preset ? preset.content : ''
        } ${
          isReversed && 'contentReversed' in preset
            ? preset.contentReversed
            : ''
        }`}
      >
        <div
          className={`c-block__group u-spacing ${
            'group' in preset ? preset.group : ''
          }`}
        >
          <div className="u-width--100p u-spacing">
            {kicker && (
              <KickerTag className="c-block__kicker u-space--quarter--bottom">
                {kicker}
              </KickerTag>
            )}
            {title && (
              <TitleTag
                className={`c-block__title hyphens-auto ${
                  kicker ? 'u-space--zero' : ''
                } ${
                  'title' in preset
                    ? preset.title
                    : 'u-theme--color--dark u-font--primary--l'
                }`}
              >
                <Title
                  url={url}
                  useLinkAsA={useLinkAsA}
                  className={`c-block__title-link ${
                    'titleLink' in preset
                      ? preset.titleLink
                      : 'u-theme--link-hover--dark'
                  }`}
                >
                  <span
                    className={'titleLink' in preset ? preset.titleLink : ''}
                  >
                    {titlePrefix && (
                      <em className={'u-theme--color--lighter'}>
                        {titlePrefix}:{' '}
                      </em>
                    )}
                    {title}
                  </span>
                </Title>
              </TitleTag>
            )}
            {description && (
              <div
                className={`c-block__description-wrapper u-spacing ${
                  expandable ? openClass : ''
                }`}
              >
                <p
                  className="c-block__description"
                  dangerouslySetInnerHTML={{
                    __html: description
                  }}
                />
                {expandable && (
                  <Button
                    as={'a'}
                    className={`description ${openClass}`}
                    expand
                    onClick={onToggle}
                    outline
                    toggle={false}
                  />
                )}
              </div>
            )}
            {additionalContent}
          </div>
          {(category || date) && (
            <div
              className={`c-block__meta ${'meta' in preset ? preset.meta : ''}`}
            >
              {category && (
                <div className="c-block__category u-text-transform--upper">
                  {category}
                </div>
              )}
              {date && (
                <time
                  className="c-block__date u-text-transform--upper"
                  dateTime={date.toString()}
                >
                  <DateTimeFormat
                    datetime={date}
                    locales={dateLocales}
                    format={dateFormat}
                    style={dateStyle}
                  />
                </time>
              )}
            </div>
          )}
          {cta && url && (
            <Button
              as="a"
              className="c-block__button"
              icon={ctaIcon}
              iconSize="m"
              iconPosition={ctaIconPosition}
              outline
              label={cta}
              url={url}
            />
          )}
        </div>
      </div>
    </div>
  );
};

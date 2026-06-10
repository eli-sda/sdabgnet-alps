import React from 'react';

import { ImageType } from 'alps-library/atoms/images/ImageType';
import useResponsiveStyles from 'alps-library/helpers/useResponsiveStyles';
import { InlineStyles } from 'alps-library/helpers/InlineStyles';
import { Picture } from 'alps-library/atoms/images/Picture';
import useClasses from 'alps-library/helpers/useClasses';
import { NavLink } from 'react-router-dom';

export interface MediaImageProps {
  asBackgroundImage?: boolean;
  className?: string;
  caption?: string;
  icon?: string;
  image: ImageType;
  type?: 'audio' | 'gallery' | 'video';
  url?: string;
}

export const MediaImage = ({
  asBackgroundImage = false,
  caption,
  className,
  icon = '',
  image,
  type,
  url = '',
  ...otherProps
}: MediaImageProps): JSX.Element => {
  const bgImageStyles = useResponsiveStyles(
    (url: string) => `.o-background-image {
      background-image: url('${url}');
    }`,
    image.srcSet
  );

  const classNames = useClasses(
    'c-block__image',
    {
      [`c-block__icon c-block__icon--${icon}`]: icon,
      ['o-background-image u-background--cover']: asBackgroundImage
    },
    className
  );

  const isExternal = url.startsWith('http');
  const linkAttr = {
    target: isExternal ? '_blank' : undefined,
    to: url || '',
    href: url,
    title: image.caption || image.alt
  };

  const imageContent = (
    <div style={asBackgroundImage ? { visibility: 'hidden' } : {}}>
      <Picture image={image} />
    </div>
  );

  return (
    <div {...otherProps} className={classNames}>
      {asBackgroundImage && bgImageStyles && (
        <InlineStyles styles={bgImageStyles} />
      )}
      <div className="c-block__image-outer-wrap">
        <div className="c-block__image-wrap">
          {url ? (
            isExternal ? (
              <a {...linkAttr}>{imageContent}</a>
            ) : (
              <NavLink {...linkAttr}>{imageContent}</NavLink>
            )
          ) : (
            imageContent
          )}

          {(caption || image.caption) && (
            <div
              className={`c-block__caption u-color--white-transparent u-padding--top u-padding--bottom
                            ${type ? 'u-padding--quad' : ''}
                            ${'u-padding--right--' + type}
                            ${'u-padding--left--' + type}
                            u-padding--sides`}
            >
              {caption || image.caption}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

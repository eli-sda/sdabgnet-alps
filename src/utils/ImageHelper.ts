import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { ImageType } from 'alps-library/atoms/images/ImageType';
import { SourceSet } from 'alps-library/atoms/images/SourceSet';
import { urlFor } from 'src/sanityClient';

export const transparentImg =
  'image-752b255414f407588018dac538926cea528ab8c7-1x1-png'; // image from Sanity - Sdabg.net

export const getResponsiveImage = (
  image: SanityImageSource,
  isVersesClient = false,
  isForAside = false // images are smaller in aside, so we use smaller widths 300px
): SourceSet => {
  const smallImgUrl = urlFor(image, isVersesClient)
    .width(300)
    .auto('format')
    .url();
  return {
    '500': isForAside
      ? smallImgUrl
      : urlFor(image, isVersesClient).width(500).auto('format').url(),
    '750': isForAside
      ? smallImgUrl
      : urlFor(image, isVersesClient).width(750).auto('format').url(),
    '1200': isForAside
      ? smallImgUrl
      : urlFor(image, isVersesClient).width(1200).auto('format').url(),
    default: smallImgUrl
  };
};

// returns ImageType object for given Sanity image or transparent image
export const getImage = (
  image?: SanityImageSource,
  title = '',
  isVersesClient = false,
  isForAside = false
): ImageType => {
  const srcSet = getResponsiveImage(
    image || transparentImg,
    image ? isVersesClient : false,
    isForAside
  );
  const img: ImageType = {
    alt: title,
    srcSet: srcSet
  };

  return img;
};

export const getImageTypeByUrl = (url: string, alt?: string): ImageType =>
  ({
    alt: alt,
    srcSet: { default: url }
  }) as ImageType;

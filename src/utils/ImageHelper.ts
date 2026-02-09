import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { ImageType } from 'alps-library/atoms/images/ImageType';
import { SourceSet } from 'alps-library/atoms/images/SourceSet';
import { urlFor } from 'src/sanityClient';

export const transparentImg =
  'image-752b255414f407588018dac538926cea528ab8c7-1x1-png'; // image from Sanity - Sdabg.net

// Viewport widths used for calculating responsive image sizes
// These are the maximum viewport widths for each srcSet breakpoint range
// Use these with column fractions (e.g., * 6/7, * 2/7, * 1/7) to calculate image sizes
export const VIEWPORT_MAX = {
  MOBILE: 500, // srcSet default: <500px
  SMALL: 700, // srcSet '500': 500-749px (700 is max before ALPS 701px breakpoint)
  MEDIUM: 1200, // srcSet '750': 750-1199px
  XLARGE: 2560 // srcSet '1200': ≥1200px (4K displays)
} as const;

export type ImageSizes = {
  default: number;
  sm: number;
  md: number;
  lg: number;
};

export type ImageDimensions = ImageSizes & {
  useHeight?: boolean; // If true, use height() instead of width()
};

// Default sizes for header images (header, features)
// Main content occupies 6/7 of viewport
export const headerImageSizes: ImageSizes = {
  default: Math.round((VIEWPORT_MAX.MOBILE * 6) / 7), // = 429px
  sm: Math.round((VIEWPORT_MAX.SMALL * 6) / 7), // = 600px
  md: Math.round((VIEWPORT_MAX.MEDIUM * 6) / 7), // = 1029px
  lg: Math.round((VIEWPORT_MAX.XLARGE * 6) / 7) // = 2194px
};

// Sizes for aside images used in RelatedPosts (sidebar)
// Image occupies 2/7 viewport (<701px), 1/7 viewport (≥701px)
export const asideImageSizes: ImageSizes = {
  default: Math.round((VIEWPORT_MAX.MOBILE * 2) / 7), // = 143px
  sm: Math.round((VIEWPORT_MAX.SMALL * 2) / 7), // = 200px
  md: Math.round((VIEWPORT_MAX.MEDIUM * 1) / 7), // = 171px
  lg: Math.round((VIEWPORT_MAX.XLARGE * 1) / 7) // = 365px
};

export const getResponsiveImage = (
  image: SanityImageSource,
  isVersesClient = false,
  sizes: ImageSizes | ImageDimensions = headerImageSizes
): SourceSet => {
  const useHeight = 'useHeight' in sizes && sizes.useHeight;

  if (useHeight) {
    return {
      '500': urlFor(image, isVersesClient)
        .height(sizes.sm)
        .format('webp')
        .url(),
      '750': urlFor(image, isVersesClient)
        .height(sizes.md)
        .format('webp')
        .url(),
      '1200': urlFor(image, isVersesClient)
        .height(sizes.lg)
        .format('webp')
        .url(),
      default: urlFor(image, isVersesClient)
        .height(sizes.default)
        .format('webp')
        .url()
    };
  }

  return {
    '500': urlFor(image, isVersesClient).width(sizes.sm).format('webp').url(),
    '750': urlFor(image, isVersesClient).width(sizes.md).format('webp').url(),
    '1200': urlFor(image, isVersesClient).width(sizes.lg).format('webp').url(),
    default: urlFor(image, isVersesClient)
      .width(sizes.default)
      .format('webp')
      .url()
  };
};

// returns ImageType object for given Sanity image or transparent image
export const getImage = (
  image?: SanityImageSource,
  title = '',
  isVersesClient = false,
  sizes?: ImageSizes | ImageDimensions
): ImageType => {
  const srcSet = getResponsiveImage(
    image || transparentImg,
    image ? isVersesClient : false,
    sizes
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

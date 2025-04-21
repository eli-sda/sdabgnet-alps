import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { SourceSet } from 'alps-library/atoms/images/SourceSet';
import { urlFor } from 'src/sanityClient';

export const getResponsiveBackground = (
  image: SanityImageSource
): SourceSet | undefined => ({
  '500': urlFor(image).width(500).auto('format').url(),
  '750': urlFor(image).width(750).auto('format').url(),
  '1200': urlFor(image).width(1200).auto('format').url(),
  default: urlFor(image).width(300).auto('format').url()
});

import { AdvertisementBlockProps } from 'src/pages/advertisement/AdvertisementBlock';
import { urlFor } from 'src/sanityClient';
import { AdvertisementType } from 'src/contexts/AdvertisementsContext';
import { getImage, ImageSizes, VIEWPORT_MAX } from './ImageHelper';

const maxAdImageWidth = 366; // in AdvertisementBlock.scss
// Advertisement images layout (c-block__row in archivePage)
// Image occupies 6/7 viewport (<701px), 1/7 viewport (≥701px)
const advertisementImageSizes: ImageSizes = {
  default: Math.min(Math.round((VIEWPORT_MAX.MOBILE * 6) / 7), maxAdImageWidth),
  sm: Math.min(Math.round((VIEWPORT_MAX.SMALL * 6) / 7), maxAdImageWidth),
  md: Math.round((VIEWPORT_MAX.MEDIUM * 1) / 7), // = 171px
  lg: Math.round((VIEWPORT_MAX.XLARGE * 1) / 7) // = 365px
};

export const createAdBlocks = (ads: AdvertisementType[]) => {
  const adBlocks: AdvertisementBlockProps[] = ads.map((ad) => {
    const img = ad.image
      ? getImage(ad.image, '', true, advertisementImageSizes)
      : undefined;

    return {
      name: ad.name,
      place: ad.place,
      email: ad.email,
      phone: ad.phone,
      hasViber: ad.hasViber,
      description: ad.text,
      date: ad.date,
      image: img,
      url: ad.image ? urlFor(ad.image, true).url() : undefined
    };
  });

  return adBlocks;
};

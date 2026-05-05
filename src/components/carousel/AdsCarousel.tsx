import { useEffect, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Autoplay,
  Pagination,
  Navigation,
  Mousewheel,
  Keyboard
} from 'swiper/modules';
import { Slide } from 'src/alps/molecules/components/Slide';
import { useCarouselAds } from 'src/hooks/useCarouselAds';
import { getImage, ImageDimensions, VIEWPORT_MAX } from 'src/utils/ImageHelper';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './Carousel.scss';

// Carousel sizing calculations:
// Container has 5% padding on each side (90% effective width)
// Mobile (<976px): carousel is 100% of container width
// Desktop (>976px): carousel is 60% of container width
// Aspect ratio: 16:9 (height = width * 9/16)

const CONTAINER_PADDING = 0.9; // 5% padding on each side
const CAROUSEL_WIDTH_DESKTOP = 0.6; // 60% of container on desktop
const ASPECT_RATIO = 9 / 16; // height/width for 16:9

const carouselImageSizes: ImageDimensions = {
  // Mobile: 100% of container width, height calculated for 16:9
  default: Math.round(VIEWPORT_MAX.MOBILE * CONTAINER_PADDING * ASPECT_RATIO), // = 253px height

  // Small screens: 100% width (before desktop breakpoint at 976px)
  sm: Math.round(VIEWPORT_MAX.SMALL * CONTAINER_PADDING * ASPECT_RATIO), // = 354px height

  // Medium desktop: 60% of container width
  md: Math.round(
    VIEWPORT_MAX.MEDIUM *
      CONTAINER_PADDING *
      CAROUSEL_WIDTH_DESKTOP *
      ASPECT_RATIO
  ), // = 365px height

  // Large desktop: 60% of container width
  lg: Math.round(
    VIEWPORT_MAX.XLARGE *
      CONTAINER_PADDING *
      CAROUSEL_WIDTH_DESKTOP *
      ASPECT_RATIO
  ), // = 777px height

  useHeight: true // Use height instead of width for vertical images
};

export const AdsCarousel = () => {
  const { carouselAds, getCarouselAds } = useCarouselAds();

  useEffect(() => {
    if (!carouselAds) {
      void getCarouselAds();
    }
  }, [carouselAds, getCarouselAds]);

  const slides = useMemo(() => {
    return carouselAds?.map((ad) => ({
      heading: ad.title,
      dek: ad.description,
      cta: ad.buttonLabel,
      url: ad.url,
      image: getImage(ad.image, ad.title, false, carouselImageSizes)
    }));
  }, [carouselAds]);

  return slides && slides.length > 0 ? (
    <div className="c-carousel">
      <Swiper
        mousewheel
        keyboard
        loop
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        pagination={{
          clickable: true
        }}
        navigation={{
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next'
        }}
        modules={[Autoplay, Pagination, Navigation, Mousewheel, Keyboard]}
        className="swiper-container"
      >
        {slides.map((slideProps, index) => (
          <SwiperSlide key={index}>
            <div className="c-carousel__item">
              <Slide {...slideProps} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="swiper-button-prev"></div>
      <div className="swiper-button-next"></div>
    </div>
  ) : null;
};

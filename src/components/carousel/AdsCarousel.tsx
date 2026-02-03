import { Carousel } from 'alps-library/molecules/components/carousel/Carousel';
import { Slide } from 'src/alps/molecules/components/Slide';

import './Carousel.scss';

const testSlides = [
  {
    heading: 'Проекта SEED',
    cta: 'Научи повече',
    url: 'https://seed.asi-bg.org/',
    image: {
      srcSet: {
        default: 'img/carousel/SEED.avif',
        '500': 'img/carousel/SEED.avif',
        '750': 'img/carousel/SEED.avif',
        '1200': 'img/carousel/SEED.avif'
      },
      alt: 'проекта SEED'
    }
  },
  {
    heading: 'СУ урок',
    dek: 'Подгответе се за съботното училище с нашите уроци за различни възрасти.',
    cta: 'отвори урока за възрастни',
    url: '/church_life/lesson',
    image: {
      srcSet: {
        default:
          'https://sabbath-school-stage.adventech.io/api/v2/bg/quarterlies/2026-01/cover.png',
        '500':
          'https://sabbath-school-stage.adventech.io/api/v2/bg/quarterlies/2026-01/cover.png',
        '750':
          'https://sabbath-school-stage.adventech.io/api/v2/bg/quarterlies/2026-01/cover.png',
        '1200':
          'https://sabbath-school-stage.adventech.io/api/v2/bg/quarterlies/2026-01/cover.png'
      },
      alt: 'проекта SEED'
    }
  }

  // {
  //   heading: 'Sint incidunt ut',
  //   // subtitle: 'Doloribus ut dignissimos accusantium ex sapiente quia occaecati est.',
  //   dek: 'Enim qui minus beatae nemo quia laborum suscipit repudiandae. Ea neque voluptatem maxime. Ut nostrum distinctio enim blanditiis debitis.',
  //   cta: 'Utex quia!',
  //   url: 'https://www.adventist.org',
  //   image: {
  //     srcSet: {
  //       default: '//picsum.photos/480/270?image=832',
  //       '500': '//picsum.photos/750/350?image=832',
  //       '750': '//picsum.photos/1200/800?image=832',
  //       '1200': '//picsum.photos/1500/900?image=832'
  //     },
  //     alt: 'Placeholder image'
  //   }
  // }
];
export const AdsCarousel = () => {
  return (
    <Carousel
      slides={testSlides}
      showArrows={true}
      slideComponent={Slide}
      autoplaySpeed={6000}
    ></Carousel>
  );
};

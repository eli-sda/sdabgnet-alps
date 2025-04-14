import { NavLink } from 'react-router-dom';
// import IconsColorsSizes from '../atoms/IconsColorsSizes';
import routes from '../routes';
import DailyVerse from 'src/organisms/DailyVerse';
import moment from 'moment';
import { PageSection } from 'src/organisms/PageSection';
import { Carousel } from 'alps-library/molecules/components/carousel/Carousel';
// import { Button } from '@mui/material';
// import { deleteAllLinks } from 'src/utils/DelteSanityDocuments';
// import { VideoFull } from 'alps-library/organisms/sections/videoFull/VideoFull';

const Home = () => {
  const testSlides = [
    {
      heading: 'Lorem Ipsum',
      subtitle: 'Fusce nec urna ut tellus accumsan fermentum.',
      dek: 'Morbi eleifend, mi et varius imperdiet, nunc magna ullamcorper nibh, vel varius felis dui ac arcu. Vestibulum semper commodo dolor vel congue. Curabitur eleifend ligula ut arcu finibus posuere.',
      cta: 'Mec cursus mi',
      url: 'https://www.adventist.org',
      image: {
        srcSet: {
          default: '//picsum.photos/480/270?image=1041',
          '500': '//picsum.photos/750/350?image=1041',
          '750': '//picsum.photos/1200/800?image=1041',
          '1200': '//picsum.photos/1500/900?image=1041'
        },
        alt: 'Placeholder image'
      }
    },
    {
      heading: 'Consequatur',
      subtitle: 'Nulla exercitationem perspiciatis',
      dek: 'Debitis et aut voluptatem omnis quis quis similique.',
      cta: 'Quod voluptatibus',
      url: 'https://www.adventist.org',
      image: {
        srcSet: {
          default: '//picsum.photos/480/270?image=1044',
          '500': '//picsum.photos/750/350?image=1044',
          '750': '//picsum.photos/1200/800?image=1044',
          '1200': '//picsum.photos/1500/900?image=1044'
        },
        alt: 'Placeholder image'
      }
    },
    {
      heading: 'Quae vel et',
      subtitle: 'Atque numquam quo non nostrum.',
      dek: 'Curabitur eleifend ligula ut arcu finibus posuere.',
      cta: 'Dolorum et ligula',
      url: 'https://www.adventist.org',
      image: {
        srcSet: {
          default: '//picsum.photos/480/270?image=1002',
          '500': '//picsum.photos/750/350?image=1002',
          '750': '//picsum.photos/1200/800?image=1002',
          '1200': '//picsum.photos/1500/900?image=1002'
        },
        alt: 'Placeholder image'
      }
    },
    {
      heading: 'Sint incidunt ut',
      subtitle:
        'Doloribus ut dignissimos accusantium ex sapiente quia occaecati est.',
      dek: 'Enim qui minus beatae nemo quia laborum suscipit repudiandae. Ea neque voluptatem maxime. Ut nostrum distinctio enim blanditiis debitis.',
      cta: 'Utex quia!',
      url: 'https://www.adventist.org',
      image: {
        srcSet: {
          default: '//picsum.photos/480/270?image=832',
          '500': '//picsum.photos/750/350?image=832',
          '750': '//picsum.photos/1200/800?image=832',
          '1200': '//picsum.photos/1500/900?image=832'
        },
        alt: 'Placeholder image'
      }
    }
  ];
  return (
    <PageSection
      aside={
        <>
          {/* <Button onClick={() => deleteAllLinks()}>Delete all links in Sanity</Button> */}
          {/* verse for today */}
          <DailyVerse></DailyVerse>

          {/* verse for current date but previous year */}
          <DailyVerse date={moment().subtract(1, 'year').toDate()}></DailyVerse>

          {/* verse for 2.01.2025  with links*/}
          <DailyVerse date={new Date('2025-01-02')}></DailyVerse>
        </>
      }
    >
      {/* <Carousel slides={testSlides}></Carousel> */}
      <h1>Тестване връзки към урок</h1>
      <div className={'text'}>
        <ul>
          <li>
            <NavLink to={routes.churchLife('lessons')}>Отвори СУ</NavLink>
          </li>
          <li>
            <NavLink to={routes.churchLife('lesson')}>
              Отвори текущия урок за възрастни
            </NavLink>
          </li>
          <li>
            <NavLink to={`${routes.churchLife('lesson')}/6/4/13`}>
              Отвори урок 13 от 4 трим. на 2006г
            </NavLink>
          </li>

          <li>
            <NavLink to={`${routes.churchLife('lesson')}/25/1/1`}>
              Отвори урок 1 (за възрастни) от 1 трим. на 2025г
            </NavLink>
          </li>
        </ul>
      </div>
      <p>
        <a
          href="https://sdabg.net/pdf/Adventist_Identity_Manual.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Визуална идентичност Базов дизайн (Adventist Identity Manual)
        </a>
      </p>
      {/* <IconsColorsSizes></IconsColorsSizes> */}
      {/* <VideoFull
      srcVideo={{
        allow:
          'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
        allowFullScreen: true,
        frameBorder: 0,
        src: 'https://www.youtube.com/embed/nH2r0J5VbL4?si=mhZSCcYKD48f2nL5&cc_load_policy=1&cc_lang_pref=bg&hl=bg'
        //'https://www.youtube.com/embed/-CwVPt6r7pY?cc_load_policy=1&cc_lang_pref=bg&hl=bg'
      }}
    /> */}
    </PageSection>
  );
};
export default Home;

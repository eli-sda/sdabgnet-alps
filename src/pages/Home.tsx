import { NavLink } from 'react-router-dom';
// import IconsColorsSizes from '../atoms/IconsColorsSizes';
import routes from '../routes';
import DailyVerse from 'src/organisms/DailyVerse';
import moment from 'moment';
// import { VideoFull } from 'alps-library/organisms/sections/videoFull/VideoFull';

const Home = () => (
  <>
    <DailyVerse></DailyVerse>
    <DailyVerse date={moment().subtract(1, 'year').toDate()}></DailyVerse>
    <ul>
      <li>
        <NavLink to={routes.home}>Начало</NavLink>
      </li>

      <li>
        <NavLink to={routes.churchLife('lesson')}>Отвори текущия урок</NavLink>
      </li>
      <li>
        <NavLink to={`${routes.churchLife('lesson')}/6/4/13`}>
          Отвори урок 13 от 4 трим. на 2006г
        </NavLink>
      </li>
    </ul>
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
  </>
);
export default Home;

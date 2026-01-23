import { NavLink } from 'react-router-dom';
import { OLD_SITE } from 'src/constants';
import routes from 'src/routes';
import { SeparatorBottom } from './separator/SeparatorBottom';

export const TestLinks = () => (
  <div
    className="u-padding u-spacing has-bottom-separator"
    style={{ backgroundColor: 'rgba(86, 168, 185, 0.3)', width: '100%' }}
  >
    <h3>Тестване връзки:</h3>
    <div className="text">
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
        <li>
          <NavLink to={routes.churchLife('lesson-cq')}>
            Отвори текущия урок за младежи
          </NavLink>
        </li>

        <li>
          <NavLink to={`${routes.churchLife('lesson-cq')}/25/1/2`}>
            Отвори урок 2 за младежи от 1 трим. на 2025г.
          </NavLink>
        </li>
        <li>
          <NavLink to={routes.churchLife('lesson-cc')}>
            Отвори текущия урок за юноши
          </NavLink>
        </li>
        <li>
          <NavLink to={`${routes.churchLife('lesson-cc')}/25/1/2`}>
            Отвори урок 2 за юноши от 1 трим. на 2025г.
          </NavLink>
        </li>
      </ul>
    </div>

    <p className="text">
      <a
        href={`${OLD_SITE}/pdf/Adventist_Identity_Manual.pdf`}
        target="_blank"
        rel="noreferrer"
      >
        Визуална идентичност Базов дизайн (Adventist Identity Manual)
      </a>
    </p>
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
    <SeparatorBottom />
  </div>
);

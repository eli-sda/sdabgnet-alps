import { NavLink } from 'react-router-dom';
import { Caption } from 'alps-library/atoms/text/Caption';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';

const SiteGuide = () => {
  const breadcrumbsUrls = [routes.about(), routes.about('site-guide')];

  return (
    <Page
      title={getTitle(routes.about('site-guide'))}
      breadcrumbsUrls={breadcrumbsUrls}
    >
      <section>
        <Caption>
          Добре дошли в обновения сайт на Адвентната българска мреж@! Тази
          страница ще ви помогне да се ориентирате в новата структура и да
          намерите бързо необходимата информация.
        </Caption>

        <div className="u-spacing--double u-space--double--top">
          <h2 className="u-theme--color--darker u-space--left">
            На началната страница
          </h2>
          <p>
            <NavLink to={routes.home}>Началната страница</NavLink> съдържа последни
            новини, събития и актуална информация за адвентната общност в
            България.
          </p>
        </div>

        <div className="u-spacing--double u-space--double--top">
          <h2 className="u-theme--color--darker u-space--left">Навигация</h2>
          <p>
            Главното меню в горната част на страницата ви дава достъп до всички
            основни раздели на сайта. Можете да го използвате за бърза навигация
            между различните секции.
          </p>
        </div>

        <div className="u-spacing--double u-space--double--top">
          <h2 className="u-theme--color--darker u-space--left">
            Църковен живот
          </h2>
          <p>В раздел <NavLink to={routes.churchLife()}>Църковен живот</NavLink> ще намерите:</p>
          <ul className="u-spacing u-space--left">
            <li>
              <NavLink to={routes.churchLife('lessons')}>Съботно училище</NavLink> - урочни помагала за възрастни и деца
            </li>
            <li>
              <NavLink to={routes.churchLife('events')}>Події</NavLink> - предстоящи събития
            </li>
            <li>
              <NavLink to={routes.churchLife('topics')}>Теми</NavLink> - тематични статии
            </li>
            <li>
              <NavLink to={routes.churchLife('testimonies')}>Свидетелства</NavLink>
            </li>
            <li>
              <NavLink to={routes.churchLife('poetry')}>Поезия</NavLink>
            </li>
            <li>
              <NavLink to={routes.churchLife('humor')}>Хумор</NavLink>
            </li>
            <li>
              <NavLink to={routes.churchLife('donations')}>Дарения</NavLink>
            </li>
          </ul>
        </div>

        <div className="u-spacing--double u-space--double--top">
          <h2 className="u-theme--color--darker u-space--left">БГ справочник</h2>
          <p>В раздел БГ справочник ще откриете:</p>
          <ul className="u-spacing u-space--left">
            <li>
              Реклами - <NavLink to={routes.advertisement('services')}>Услуги</NavLink>,{' '}
              <NavLink to={routes.advertisement('buySell')}>Купува-Продава</NavLink>,{' '}
              <NavLink to={routes.advertisement('other')}>Други</NavLink>
            </li>
            <li>
              <NavLink to={routes.info('bibles')}>Библии</NavLink>
            </li>
            <li>
              <NavLink to={routes.info('biblical')}>Библейски имена</NavLink>
            </li>
            <li>
              <NavLink to={routes.info('dictionary')}>Речник</NavLink>
            </li>
            <li>
              <NavLink to={routes.info('comment')}>Коментар</NavLink>
            </li>
            <li>
              <NavLink to={routes.info('sunset')}>Залез на слънцето</NavLink>
            </li>
            <li>
              <NavLink to={routes.info('churches')}>Адреси на църкви</NavLink>
            </li>
          </ul>
        </div>

        <div className="u-spacing--double u-space--double--top">
          <h2 className="u-theme--color--darker u-space--left">Медии</h2>
          <p>
            В раздел <NavLink to={routes.media()}>Медии</NavLink> ще намерите информация за{' '}
            <NavLink to={routes.media('radio')}>радио</NavLink>,{' '}
            <NavLink to={routes.media('tv')}>телевизия</NavLink>,{' '}
            <NavLink to={routes.media('links')}>чуждестранни линкове</NavLink>,{' '}
            <NavLink to={routes.media('courses')}>онлайн курсове</NavLink>,{' '}
            <NavLink to={routes.media('bg-links')}>BG линкове</NavLink> и{' '}
            <NavLink to={routes.media('apps')}>мобилни приложения</NavLink>.
          </p>
        </div>

        <div className="u-spacing--double u-space--double--top">
          <h2 className="u-theme--color--darker u-space--left">Ресурси</h2>
          <p>В раздел <NavLink to={routes.resources()}>Ресурси</NavLink> ще намерите:</p>
          <ul className="u-spacing u-space--left">
            <li>
              <NavLink to={routes.resources('books')}>Книги</NavLink>
            </li>
            <li>
              <NavLink to={routes.resources('audio')}>Аудио</NavLink>
            </li>
            <li>
              <NavLink to={routes.resources('video')}>Видео</NavLink>
            </li>
            <li>
              <NavLink to={routes.resources('music')}>Музика</NavLink>
            </li>
            <li>
              <NavLink to={routes.resources('presentation')}>Презентации</NavLink>
            </li>
            <li>
              <NavLink to={routes.resources('image')}>Картинки</NavLink>
            </li>
          </ul>
        </div>

        <div className="u-spacing--double u-space--double--top">
          <h2 className="u-theme--color--darker u-space--left">Здраве</h2>
          <p>В раздел <NavLink to={routes.health()}>Здраве</NavLink> ще намерите:</p>
          <ul className="u-spacing u-space--left">
            <li>
              <NavLink to={routes.health('new-start')}>програмата NEW START</NavLink>
            </li>
            <li>
              <NavLink to={routes.health('video')}>Видео</NavLink>
            </li>
            <li>
              <NavLink to={routes.health('books')}>Книги</NavLink>
            </li>
            <li>
              <NavLink to={routes.health('recipes')}>Рецепти</NavLink>
            </li>
            <li>
              <NavLink to={routes.health('institutions')}>Адвентни български здравни институции</NavLink>
            </li>
            <li>
              <NavLink to={routes.health('services')}>Здравни услуги</NavLink>
            </li>
          </ul>
        </div>

        <div className="u-spacing--double u-space--double--top">
          <h2 className="u-theme--color--darker u-space--left">За нас</h2>
          <p>В раздел <NavLink to={routes.about()}>За нас</NavLink> ще намерите:</p>
          <ul className="u-spacing u-space--left">
            <li>
              <NavLink to={routes.about('team')}>Екип</NavLink>
            </li>
            <li>
              <NavLink to={routes.about('banner')}>Банер</NavLink>
            </li>
            <li>
              <NavLink to={routes.about('feedback')}>Отзиви</NavLink>
            </li>
          </ul>
        </div>
      </section>
    </Page>
  );
};

export default SiteGuide;

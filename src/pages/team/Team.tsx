import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import './Team.scss';

type TeamMember = {
  id: number;
  name: string;
  role: string;
  description?: string;
  image: string;
};

const team: TeamMember[] = [
  {
    id: 1,
    name: 'Елена Иванова',
    role: 'Ръководител и разработчик на проекта',
    description:
      'Ръководи развитието на платформата и отговаря за нейната техническа реализация и поддръжка.',
    image: '/img/team/elena-ivanova.webp'
  },
  {
    id: 2,
    name: 'Габриела Ортова',
    role: 'Front-end разработчик',
    description:
      'Разработва и поддържа видимата част и функционалностите на сайта.',
    image: '/img/team/gabriela-ortova.webp'
  },
  {
    id: 3,
    name: 'Илия Дюлгеров',
    role: 'Системен администратор',
    description:
      'Осигурява и поддържа сървъра, на който се съхраняват ресурсите за изтегляне.',
    image: '/img/team/admin-icon.svg'
  },
  {
    id: 4,
    name: 'Венцислав Панайотов',
    role: 'Пастор онлайн',
    description:
      'Отговаря на духовни и библейски въпроси в рубриката „Пастор онлайн“.',
    image: '/img/team/ventsislav-panayotov.webp'
  },
  // {
  //   id: 5,
  //   name: 'Трифон Трифонов',
  //   role: 'Презентации, музика',
  //   image: 'https://swiperjs.com/demos/images/nature-5.jpg'
  // },
  {
    id: 6,
    name: 'Светлозар Стефанов',
    role: 'Издателство "Нов живот"',
    description: 'Предоставя утринните бдения.',
    image: '/img/team/svetlozar-stefanov.webp'
  },
  {
    id: 7,
    name: 'Живко Грушев',
    role: 'Религиозни материали',
    description: 'Подготвя и предоставя аудио ресурси и други материали.',
    image: '/img/team/jivko-grushev.webp'
  }
];

const Team = () => {
  const breadcrumbsUrls = [routes.about(), routes.about('team')];

  return (
    <Page
      title={getTitle(routes.about('team'))}
      breadcrumbsUrls={breadcrumbsUrls}
    >
      <Swiper
        effect="coverflow"
        grabCursor
        watchSlidesProgress
        navigation
        centeredSlides
        slidesPerView={3}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
            centeredSlides: false
          },
          550: {
            slidesPerView: 3,
            centeredSlides: true
          }
        }}
        modules={[EffectCoverflow, Navigation]}
        className="team-swiper"
      >
        {team.map((member) => (
          <SwiperSlide key={member.id}>
            <div className="team-card hyphens-auto u-spacing--quarter">
              <img src={member.image} alt={member.name} />
              <h3 className="u-theme--color--darker">{member.name}</h3>
              <p className="u-color--black">{member.role}</p>
              <p className="u-space--quarter--bottom">{member.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Page>
  );
};

export default Team;

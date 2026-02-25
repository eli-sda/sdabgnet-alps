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
  email: string;
  image: string;
};

const team: TeamMember[] = [
  {
    id: 1,
    name: 'Елена Иванова',
    role: 'WEB-дизайнер',
    email: 'webmaster@sdabg.net',
    image: 'https://swiperjs.com/demos/images/nature-1.jpg'
  },
  {
    id: 2,
    name: 'Габриела Ортова',
    role: 'Front-end разработчик',
    email: 'gabi.ortova@gmail.com',
    image: '/img/team/gabriela-ortova.jpg'
  },
  {
    id: 3,
    name: 'Илия Дюлгеров',
    role: 'Linux специалист',
    email: 'iliasda@yahoo.com',
    image: 'https://swiperjs.com/demos/images/nature-3.jpg'
  },
  {
    id: 4,
    name: 'Венцислав Панайотов',
    role: 'Отговори на въпроси',
    email: 'VentsiPanayotov@bitex.bg',
    image: '/img/team/ventsislav-panayotov.jpg'
  },
  // {
  //   id: 5,
  //   name: 'Трифон Трифонов',
  //   role: 'Презентации, музика',
  //   email: 'trifon_str@abv.bg',
  //   image: 'https://swiperjs.com/demos/images/nature-5.jpg'
  // },
  {
    id: 6,
    name: 'Светлозар Стефанов',
    role: 'Издателство "Нов живот" (утринни бдения)',
    email: 'sstefanov@newlife-bg.com',
    image: '/img/team/svetlozar-stefanov.jpg'
  },
  {
    id: 7,
    name: 'Живко Грушев',
    role: 'Религиозни материали',
    email: 'zhivkogrushev@gmail.com',
    image: 'https://swiperjs.com/demos/images/nature-7.jpg'
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
            <div className="team-card hyphens-auto">
              <img src={member.image} alt={member.name} />
              <h3 className="u-theme--color--darker">{member.name}</h3>
              <p>{member.role}</p>
              <p>{member.email}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Page>
  );
};

export default Team;

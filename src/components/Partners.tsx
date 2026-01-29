import { Separator } from './separator/Separator';
import './Partners.scss';

const partnerLogos = [
  {
    img: '/img/logos/adventist-logo.png',
    title: 'ЦАСД България',
    url: 'https://www.adventist.bg/'
  },
  {
    img: '/img/logos/hope-channel-logo.svg',
    title: 'Hope Channel Bulgaria',
    url: 'https://hopetv.bg/'
  },
  {
    img: '/img/logos/radio3-16_red.svg',
    title: 'Радио 3:16',
    url: 'https://3-16.bg/'
  },
  {
    img: '/img/logos/new-life_color.svg',
    title: 'Издателство "Нов Живот"',
    url: 'https://newlife-bg.com/'
  },
  {
    img: '/img/logos/radiosvetlina-logo.svg',
    title: 'Телевизия Библейска Светлина',
    url: 'http://www.radiosvetlina.com/'
  },
  {
    img: '/img/logos/ltv-logo.svg',
    title: 'LTV България',
    url: 'https://ltv.bg/'
  }
];

export const Partners = () => {
  return (
    <section className="partners has-top-separator">
      <Separator type="top" />
      <div className="partners-list u-padding--double">
        {partnerLogos.map(({ img, title, url }) => (
          <div key={title} className="partners-list-item">
            <a href={url} target="_blank" rel="noreferrer">
              <img src={img} alt={title} title={title} />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

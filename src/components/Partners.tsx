import './Partners.scss';

const partnerLogos = [
  { img: '/img/logos/adventist-logo.png', title: 'ЦАСД България' },
  { img: '/img/logos/hope-channel-logo.svg', title: 'Hope Channel Bulgaria' },
  { img: '/img/logos/radio3-16_red.svg', title: 'Радио 3:16' },
  { img: '/img/logos/new-life_color.svg', title: 'Издателство "Нов Живот"' },
  { img: '/img/logos/ltv-logo.svg', title: 'LTV България' }
];

export const Partners = () => {
  return (
    <div className="partners u-padding">
      {partnerLogos.map(({ img, title }) => (
        <div key={title} className="partners-item">
          <img src={img} alt={title} title={title} />
        </div>
      ))}
    </div>
  );
};

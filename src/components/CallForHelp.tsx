import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { ContentBlock } from 'src/alps/molecules/blocks/ContentBlock';
import { getImageTypeByUrl } from 'src/utils/ImageHelper';
import './CallForHelp.scss';

const causes = [
  {
    title: 'Руми се изправя срещу болестта за втори път',
    description:
      'Руми вече веднъж победи болестта, но днес отново се бори за живота си и има нужда от спешно лечение, за да получи втори шанс. ЕДНА МАЙЧИНА МОЛБА: Да върнем бъдещето на десетгодишния Руми!',
    img: '/img/causes/rumi.jpg',
    url: 'https://pavelandreev.org/bg/campaign/10-godishniyat-rumi-se-bori-s-retsidiv-transplantatsiyata-e-shansat-mu?fbclid=IwZXh0bgNhZW0CMTEAYnJpZBEwdnpON2tIdTdLcWJHdEpYNnNydGMGYXBwX2lkATAAAR6ilfoKBa28xMMi-64k2WBcT7o4I4QZ2rKb2w1G79zJOBIPcEkZJg4XUYOInA_aem_sNDAj-gFPc7b9Q_yspmPxQ'
  },
  {
    title: 'Помощ за Коби Бердал: Необходима е спешна медицинска помощ',
    img: '/img/causes/coby.webp',
    url: 'https://www.gofundme.com/f/help-save-cobys-life-urgent-medical-support-needed'
  }
];

export const CallForHelp = () => {
  return (
    <section className="u-spacing call-for-help">
      <HeadingBlock title="Зов за помощ" />

      {causes.map((cause, index) => (
        <ContentBlock
          key={index}
          description={cause.description}
          title={cause.title}
          image={getImageTypeByUrl(cause.img)}
          buttons={[
            {
              label: 'Виж повече',
              url: cause.url,
              small: true,
              isExternal: true
            }
          ]}
        />
      ))}
    </section>
  );
};

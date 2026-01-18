import { useEffect, useState } from 'react';
import { getImageTypeByUrl } from 'src/utils/ImageHelper';
import { Pullquote } from 'alps-library/molecules/text/pullquote/Pullquote.tsx';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import routes from 'src/routes';
import { ExternalPageLink } from 'src/types/externalPageLink';
import { Page } from 'src/organisms/Page';
import { PageLinkItem } from 'src/organisms/PageLinkItem';
import { getTitle } from 'src/utils/Navigation';
import { isValidUrl } from 'src/utils/FetchHelper';

const breadcrumbsUrls = [routes.churchLife(), routes.churchLife('donations')];

const Donations = () => {
  const title = getTitle(routes.churchLife('donations'));
  const [donations, setDonations] = useState<ExternalPageLink[]>([]);

  useEffect(() => {
    fetch('/donations.json')
      .then((res) => res.json())
      .then((data: ExternalPageLink[]) => {
        // Filter out invalid URLs to prevent open redirect vulnerability
        // Only validated URLs are stored in state
        const validDonations = data.filter((item) => isValidUrl(item.url));
        setDonations(validDonations);
      })
      .catch((err) => {
        console.error('Failed to load donations.json', err);
        setDonations([]);
      });
  }, []);

  return (
    <Page title={title} breadcrumbsUrls={breadcrumbsUrls} blockType="wrap6">
      <section className="l-grid-item l-grid-item--7-col u-space--bottom">
        <div className="u-space--half--bottom">
          <HeadingBlock title="Подкрепете с дарение или участие следните адвентни институции и проекти" />
        </div>
        <Pullquote
          quote="Господ е разпръсвал светлина и истина по земята в зависимост от доброволните старания и дарения на участниците в небесните дарби. Сравнително малко са избраните да пътуват като проповедници и мисионери, повече са тези, които да съдействат за разпространяване на истината със свои средства."
          author="Елън Уайт, Свидетелства към църквата, том 5"
        />
        <Pullquote
          quote="Докато сред нашите братя има недоимък и бедност, а ние задържаме от тях помощта си, въпреки че всичките ни нужди са задоволени, пренебрегваме един ясен дълг, разкрит в Божието Слово. Той ни дава щедро, за да можем и ние да даваме на другите. Благодеянията побеждават егоизма, облагородяват и очистват душата. Някои злоупотребяват с дадените им от Бога таланти; затварят очите си, за да не виждат нуждите на Неговото дело и запушват ушите си, за да не чуват Неговия глас, който им сочи дълга да хранят гладните и да обличат голите."
          author="Елън Уайт, Свидетелства към църквата, том 4"
        />
      </section>

      {donations.map(({ url, title, description, img }, idx) => (
        <PageLinkItem
          key={idx}
          url={url}
          title={title}
          description={description}
          img={getImageTypeByUrl(img, title)}
          sizeAtM="6"
          sizeAtXL="3"
        />
      ))}

      <section className="l-grid-item l-grid-item--7-col">
        <Pullquote
          quote="Сега е времето да работим за спасението на нашите ближни. Някои мислят, че всичко, което се изисква от тях, се изчерпва с даряването на пари за каузата на Христос. Скъпоценното време, в което биха могли да извършат лично служене за Него, отминава неизползвано. Но привилегия и задължение на всички, които имат здраве и сили, е да се отплатят на Бога с активна служба. Трябва да работим за печеленето на души за Христос. Финансовите даренията не могат да заместят това начинание."
          author="Елън Уайт, Притчи Христови"
        />
      </section>
    </Page>
  );
};

export default Donations;

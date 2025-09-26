import routes from 'src/routes';
import { ExternalPageLink } from 'src/types/externalPageLink';
import { getTitle } from 'src/utils/Navigation';
import donationsJson from 'public/donations.json';
import { Page } from 'src/organisms/Page';
import { PageLinkItem } from 'src/organisms/PageLinkItem';
import { ImageType } from 'alps-library/atoms/images/ImageType';
import { Caption } from 'alps-library/atoms/text/Caption';

const breadcrumbsUrls = [routes.churchLife(), routes.churchLife('donations')];

const Donations = () => {
  const title = getTitle(routes.churchLife('donations'));
  const donations = donationsJson as ExternalPageLink[];

  return (
    <>
      <Page title={title} breadcrumbsUrls={breadcrumbsUrls} blockType="wrap6">
        <div className="l-grid-item l-grid-item--7-col u-space--bottom u-spacing--half">
          <h2>
            Подкрепете с дарение или участие следните адвентни институции и
            проекти
          </h2>
          <Caption>
            &quot;Господ е разпръсвал светлина и истина по земята в зависимост
            от доброволните старания и дарения на участниците в небесните дарби.
            Сравнително малко са избраните да пътуват като проповедници и
            мисионери, повече са тези, които да съдействат за разпространяване
            на истината със свои средства.&quot; (Свидетелства към църквата, том
            5)
          </Caption>
          <Caption>
            &quot;Докато сред нашите братя има недоимък и бедност, а ние
            задържаме от тях помощта си, въпреки че всичките ни нужди са
            задоволени, пренебрегваме един ясен дълг, разкрит в Божието Слово.
            Той ни дава щедро, за да можем и ние да даваме на другите.
            Благодеянията побеждават егоизма, облагородяват и очистват душата.
            Някои злоупотребяват с дадените им от Бога таланти; затварят очите
            си, за да не виждат нуждите на Неговото дело и запушват ушите си, за
            да не чуват Неговия глас, който им сочи дълга да хранят гладните и
            да обличат голите.&quot; (Свидетелства към църквата, том 4)
          </Caption>
        </div>

        {donations.map(({ url, title, description, img }, idx) => (
          <PageLinkItem
            key={idx}
            url={url}
            title={title}
            description={description}
            img={
              {
                alt: title,
                srcSet: { default: img }
              } as ImageType
            }
            sizeAtM="6"
            sizeAtXL="3"
          />
        ))}
      </Page>
    </>
  );
};

export default Donations;

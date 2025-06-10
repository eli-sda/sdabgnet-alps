import { Button } from 'alps-library/atoms/button/Button';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import routes from 'src/routes';

const breadcrumbsUrls = [routes.health(), routes.health('institutions')];
const HealthInstitutions = () => {
  const links = [
    { url: `https://lifeinhope.com`, text: 'Център за здраве в с. Баня' },
    { url: 'https://healthcare-bg.com/', text: 'Фондация "Грижа за Здравето"' },
    {
      url: 'https://www.yanikabg.com/',
      text: 'Образователен център за деца и младежи с увреден слух "Яника'
    }
  ];
  return (
    <Page
      title={getTitle(routes.health('institutions'))}
      breadcrumbsUrls={breadcrumbsUrls}
    >
      {links.map((link, l) => (
        <Button
          key={l}
          as="a"
          isExternal={true}
          // href={`${encodeURI(path)}`}
          url={link.url}
          label={link.text}
          simple={true}
        />
      ))}
    </Page>
  );
};
export default HealthInstitutions;

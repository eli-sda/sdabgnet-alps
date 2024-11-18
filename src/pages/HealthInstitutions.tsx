import { Button } from 'alps-library/atoms/button/Button';
// import LinkIcon from '@mui/icons-material/Link';
import { Page } from 'src/organisms/Page';
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
    <div className="u-spacing--triple">
      <Page title="Здравни институции" breadcrumbsUrls={breadcrumbsUrls} />
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
    </div>
  );
};
export default HealthInstitutions;

import MediaLinksPage, { LinkGroup } from './MediaLinksPage';
import tvLinks from './apps.json';

const Apps = (): JSX.Element => {
  return (
    <MediaLinksPage
      mediaType="apps"
      linksJson={tvLinks as LinkGroup[]}
      isDoubleSpacing
    />
  );
};

export default Apps;

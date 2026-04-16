import MediaLinksPage, { LinkGroup } from './MediaLinksPage';
import apps from './apps.json';

const Apps = (): JSX.Element => {
  return (
    <MediaLinksPage
      mediaType="apps"
      linksJson={apps as LinkGroup[]}
      isDoubleSpacing
    />
  );
};

export default Apps;

import { useScrollToHash } from 'src/hooks/useScrollToHash';
import MediaLinksPage, { LinkGroup } from './MediaLinksPage';
import apps from './apps.json';

const Apps = (): JSX.Element => {
  useScrollToHash();
  return (
    <MediaLinksPage
      mediaType="apps"
      linksJson={apps as LinkGroup[]}
      isDoubleSpacing
    />
  );
};

export default Apps;

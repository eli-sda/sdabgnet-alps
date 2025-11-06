import MediaLinksPage, { LinkGroup } from './MediaLinksPage';
import tvLinks from './television.json';

const Television = (): JSX.Element => {
  return (
    <MediaLinksPage
      mediaType="bg-links"
      linksJson={tvLinks as LinkGroup[]}
      isDoubleSpacing
    />
  );
};

export default Television;

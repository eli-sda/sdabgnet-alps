import MediaLinksPage, { LinkGroup } from './MediaLinksPage';
import foreignLinks from './foreign-links.json';

const ForeignLinks = (): JSX.Element => {
  return (
    <MediaLinksPage
      mediaType="links"
      linksJson={foreignLinks as LinkGroup[]}
      isDoubleSpacing
    />
  );
};

export default ForeignLinks;

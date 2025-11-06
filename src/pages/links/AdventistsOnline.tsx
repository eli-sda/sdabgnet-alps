import MediaLinksPage, { LinkGroup } from './MediaLinksPage';
import bgLinks from './adventists-online.json';
import bgChurchesLinks from './adventis-online-churches.json';

const AdventistsOnline = (): JSX.Element => {
  return (
    <MediaLinksPage
      mediaType="bg-links"
      linksJson={bgLinks as LinkGroup[]}
      asideJson={bgChurchesLinks as LinkGroup[]}
      asideTitle="Български адвентни църкви"
    />
  );
};

export default AdventistsOnline;

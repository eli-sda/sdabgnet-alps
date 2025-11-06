import MediaLinksPage, { LinkGroup } from './MediaLinksPage';
import radioBgLinks from './radio-bg.json';
import radioForeignLinks from './radio-foreign.json';

const Radio = (): JSX.Element => {
  return (
    <MediaLinksPage
      mediaType="radio"
      linksJson={radioBgLinks as LinkGroup[]}
      linksTitle="Български"
      asideJson={radioForeignLinks as LinkGroup[]}
      asideTitle="Чужди"
      isDoubleSpacing
    />
  );
};

export default Radio;

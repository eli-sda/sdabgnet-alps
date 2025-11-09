import MediaLinksPage, { LinkGroup } from './MediaLinksPage';
import radioBgLinks from './radio.json';

const Radio = (): JSX.Element => {
  return (
    <MediaLinksPage
      mediaType="radio"
      linksJson={radioBgLinks as LinkGroup[]}
      isDoubleSpacing
    />
  );
};

export default Radio;

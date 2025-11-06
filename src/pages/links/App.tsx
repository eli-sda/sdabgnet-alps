import MediaLinksPage, { LinkGroup } from './MediaLinksPage';
import tvLinks from './app.json';

const App = (): JSX.Element => {
  return (
    <MediaLinksPage
      mediaType="app"
      linksJson={tvLinks as LinkGroup[]}
      isDoubleSpacing
    />
  );
};

export default App;

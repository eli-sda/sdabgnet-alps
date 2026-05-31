import { FeedList } from '../FeedList';
import hopeTvItems from './hope-tv.json';
import newLife from './new-life.json';

export const FeedDemo = () => {
  return (
    <div className="u-spacing--double">
      <FeedList
        id="newlife_demo"
        items={newLife}
        feedListClassName="books"
        title='Последно от Издателство "Нов Живот" (FeedList демо)'
        logoPath="/img/logos/new-life_color.svg"
      />

      <FeedList
        id="hopetv_demo"
        items={hopeTvItems}
        title="Последно от Hope Channel Bulgaria (FeedList демо)"
        logoPath="/img/logos/hope-channel-logo.svg"
      />
    </div>
  );
};

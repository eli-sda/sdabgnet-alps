import { FeedList } from '../FeedList';
import hopeTvItems from './hope-tv.json';
import newLife from './new-life.json';

export const FeedDemo = () => {
  return (
    <div className="u-spacing--double">
      <FeedList
        items={newLife}
        numbersOnRow={4}
        title='Последно от Издателство "Нов Живот" (FeedList демо)'
        logoPath="/img/logos/rss/new-life.png"
      />

      <FeedList
        items={hopeTvItems}
        numbersOnRow={4}
        title="Последно от Hope Channel Bulgaria (FeedList демо)"
        logoPath="/img/logos/rss/HopeChannel.png"
      />
    </div>
  );
};

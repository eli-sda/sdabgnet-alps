import { RssFeedList } from '../RssFeedList';

export const RssFeedDemo = () => {
  return (
    <div className="u-spacing--double">
      <RssFeedList rssFeedName="hopetv" maxItems={6} numbersOnRow={3} />
      <RssFeedList rssFeedName="3_16" maxItems={6} numbersOnRow={3} />
      <RssFeedList rssFeedName="newlife" maxItems={4} numbersOnRow={4} />
    </div>
  );
};

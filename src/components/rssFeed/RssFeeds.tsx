import { RssFeedList } from './RssFeedList';

export const RssFeeds = () => {
  return (
    <div className="u-spacing--double">
      <RssFeedList rssFeedName="hopetv" />
      <RssFeedList rssFeedName="3_16" />
      <RssFeedList rssFeedName="newlife" />
      <RssFeedList rssFeedName="svetlina" />
      <RssFeedList rssFeedName="ltv" />
    </div>
  );
};

import { ReactNode, useState } from 'react';
import { RssFeedContext, RssFeedsMap } from 'src/contexts/RssFeedContext';
import { FeedItemType } from 'src/components/rssFeed/FeedItem';

export const RssFeedProvider = ({ children }: { children: ReactNode }) => {
  const [feeds, setFeeds] = useState<RssFeedsMap>({});
  const [lastLoaded, setLastLoadedState] = useState<Record<string, string>>({});

  const setFeedItems = (feedName: string, items: FeedItemType[]) => {
    setFeeds((prev) => ({ ...prev, [feedName]: items }));
  };

  const setLastLoaded = (feedName: string, date: string) => {
    setLastLoadedState((prev) => ({ ...prev, [feedName]: date }));
  };

  return (
    <RssFeedContext.Provider
      value={{ feeds, setFeedItems, lastLoaded, setLastLoaded }}
    >
      {children}
    </RssFeedContext.Provider>
  );
};

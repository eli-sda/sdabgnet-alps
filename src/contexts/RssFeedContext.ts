import { createContext, useContext } from 'react';
import { FeedItemType } from 'src/components/rssFeed/FeedItem';

export type RssFeedsMap = Record<string, FeedItemType[]>;

export type RssFeedContextType = {
  feeds: RssFeedsMap;
  setFeedItems: (feedName: string, items: FeedItemType[]) => void;
  lastLoaded: Record<string, string>;
  setLastLoaded: (feedName: string, date: string) => void;
};

export const RssFeedContext = createContext<RssFeedContextType>(
  {
    feeds: {},
    setFeedItems: () => {},
    lastLoaded: {},
    setLastLoaded: () => {}
  }
);

export function useRssFeedContext() {
  const context = useContext(RssFeedContext);

  return context;
}

import { useCallback, useRef } from 'react';
import { RSS_PATH, API_URL } from 'src/constants';
import { useRssFeedContext } from 'src/contexts/RssFeedContext';
import { getTodayString } from 'src/utils/getTodayString';
import { FeedItemType } from 'src/components/rssFeed/FeedItem';

const buildUrl = (rssFeedName: string, maxItems: number) =>
  `${import.meta.env.DEV ? RSS_PATH : `${API_URL}${RSS_PATH}`}${rssFeedName}/${maxItems}`;

export function useRssFeed() {
  const { feeds, lastLoaded, setFeedItems, setLastLoaded } =
    useRssFeedContext();

  // prevent parallel fetches
  const loadingFeeds = useRef<Record<string, boolean>>({});

  const getFeed = useCallback(
    async (rssFeedName: string, maxItems = 6): Promise<FeedItemType[]> => {
      const today = getTodayString();

      if (
        feeds &&
        lastLoaded &&
        lastLoaded[rssFeedName] === today &&
        feeds[rssFeedName]
      ) {
        return feeds[rssFeedName];
      }

      // already loading
      if (loadingFeeds.current[rssFeedName]) {
        return feeds?.[rssFeedName] ?? [];
      }

      loadingFeeds.current[rssFeedName] = true;

      const url = buildUrl(rssFeedName, maxItems);

      try {
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = (await res.json()) as FeedItemType[];

        setFeedItems(rssFeedName, data);
        setLastLoaded(rssFeedName, today);

        return data;
      } catch (err) {
        console.error(
          `Failed to load rss feed ${rssFeedName} from ${url}`,
          err
        );
        setFeedItems(rssFeedName, []);
        setLastLoaded(rssFeedName, today);
        return [];
      }
    },
    [feeds, lastLoaded, setFeedItems, setLastLoaded]
  );

  return {
    feeds,
    lastLoaded,
    getFeed
  };
}

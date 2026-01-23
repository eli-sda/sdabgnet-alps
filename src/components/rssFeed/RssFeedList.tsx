import { useEffect, useMemo, useState } from 'react';
import { FeedItemType } from './FeedItem';
import { FeedList } from './FeedList';
import { RSS_PATH, API_URL } from 'src/constants';

export type RssFeedListProps = {
  rssFeedName?: 'hopetv' | '3_16' | 'newlife';
  logoPath?: string;
  items?: FeedItemType[];
  maxItems?: number;
  numbersOnRow?: number;
};

export const RssFeedList = ({
  rssFeedName,
  maxItems = 6,
  numbersOnRow
}: RssFeedListProps) => {
  const [items, setItems] = useState<FeedItemType[]>([]);
  const url = useMemo(
    () =>
      `${import.meta.env.DEV ? RSS_PATH : `${API_URL}${RSS_PATH}`}${rssFeedName}/${maxItems}`,
    [rssFeedName, maxItems]
  );

  useEffect(() => {
    if (!url) return;
    fetch(url)
      .then((res) => res.json())
      .then((data: FeedItemType[]) => setItems(data))
      .catch((err) => {
        console.error(`Failed to load items from ${url}`, err);
        setItems([]);
      });
  }, [url]);

  const feedProps = useMemo(() => {
    let logoName: string | undefined;
    let title = '';
    switch (rssFeedName) {
      case 'hopetv':
        title = 'Hope Channel Bulgaria - последни предавания';
        logoName = 'h-tv.png';
        break;
      case 'newlife':
        title = 'Издателство "Нов Живот" - последни издания';
        logoName = 'new-life.png';
        break;
      case '3_16':
        title = 'Радио 3:16 - последни предавания';
        logoName = '3-16.png';
        break;
      default:
        break;
    }
    return { logoPath: `/img/logos/rss/${logoName}`, title };
  }, [rssFeedName]);

  return (
    <FeedList
      title={feedProps.title}
      logoPath={feedProps.logoPath}
      items={items}
      numbersOnRow={numbersOnRow}
    />
  );
};

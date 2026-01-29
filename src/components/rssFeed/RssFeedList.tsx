import { useEffect, useMemo, useState } from 'react';
import { FeedItemType } from './FeedItem';
import { FeedList } from './FeedList';
import { RSS_PATH, API_URL } from 'src/constants';

export type RssFeedListProps = {
  rssFeedName?: 'hopetv' | '3_16' | 'newlife' | 'svetlina' | 'ltv';
  logoPath?: string;
  items?: FeedItemType[];
  maxItems?: number;
};

export const RssFeedList = ({
  rssFeedName,
  maxItems = 6
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
    let kicker = 'последни предавания';
    switch (rssFeedName) {
      case 'hopetv':
        title = 'Hope Channel Bulgaria';
        logoName = 'hope-channel-logo.svg';
        break;
      case 'newlife':
        title = 'Издателство "Нов Живот"';
        kicker = 'последни издания';
        logoName = 'new-life_color.svg';
        break;
      case '3_16':
        title = 'Радио 3:16';
        logoName = 'radio3-16_red.svg';
        break;
      case 'svetlina':
        title = 'Телевизия и Радио "Светлина"';
        logoName = 'radiosvetlina-logo.svg';
        break;
      case 'ltv':
        title = 'LTV България';
        kicker = 'последни предавания';
        logoName = 'ltv-logo.svg';
        break;
    }
    return { logoPath: `/img/logos/${logoName}`, title, kicker };
  }, [rssFeedName]);

  return (
    <FeedList
      title={feedProps.title}
      kicker={feedProps.kicker}
      logoPath={feedProps.logoPath}
      items={items}
    />
  );
};

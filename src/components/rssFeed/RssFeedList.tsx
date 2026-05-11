import { useEffect, useMemo } from 'react';
import { useRssFeed } from 'src/hooks/useRssFeed';
import { FeedItemType } from './FeedItem';
import { FeedList } from './FeedList';

export type RssFeedListProps = {
  rssFeedName: 'hopetv' | '3_16' | 'newlife' | 'svetlina' | 'ltv';
  maxItems?: number;
};

export const RssFeedList = ({
  rssFeedName,
  maxItems = 6
}: RssFeedListProps) => {
  const { feeds, getFeed } = useRssFeed();

  // trigger fetch if not already loaded
  useEffect(() => {
    if (!feeds || !feeds[rssFeedName]) {
      void getFeed(rssFeedName, maxItems);
    }
  }, [rssFeedName, maxItems, feeds, getFeed]);

  const items: FeedItemType[] = useMemo(() => {
    const feedItems = feeds?.[rssFeedName] ?? [];
    return feedItems.map((item) => ({
      ...item,
      title: item.title?.replace(' СУБТИТРИ', '') ?? item.title
    }));
  }, [rssFeedName, feeds]);

  const feedProps = useMemo(() => {
    let logoName: string | undefined;
    let title = '';
    let titleLink = '';
    let kicker = 'последни предавания';
    switch (rssFeedName) {
      case 'hopetv':
        title = 'Hope Channel Bulgaria';
        titleLink = 'https://hopetv.bg/';
        logoName = 'hope-channel-logo.svg';
        break;
      case 'newlife':
        title = 'Издателство "Нов Живот"';
        titleLink = 'https://newlife-bg.com';
        kicker = 'последни издания';
        logoName = 'new-life_color.svg';
        break;
      case '3_16':
        title = 'Радио 3:16';
        titleLink = 'https://3-16.bg/';
        logoName = 'radio3-16_red.svg';
        break;
      case 'svetlina':
        title = 'Телевизия и Радио "Светлина"';
        titleLink = 'https://www.youtube.com/@TeleviziaSvetlina';
        logoName = 'radiosvetlina-logo.svg';
        break;
      case 'ltv':
        title = 'LTV България';
        titleLink = 'https://www.youtube.com/@LTVBulgaria';
        kicker = 'последни предавания';
        logoName = 'ltv-logo.svg';
        break;
    }
    return { logoPath: `/img/logos/${logoName}`, title, kicker, titleLink };
  }, [rssFeedName]);

  return (
    <FeedList
      title={feedProps.title}
      titleLink={feedProps.titleLink}
      kicker={feedProps.kicker}
      logoPath={feedProps.logoPath}
      items={items}
      rssFeedName={rssFeedName}
      feedListClassName={rssFeedName === 'newlife' ? 'books' : ''}
    />
  );
};

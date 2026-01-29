import { DarkTitle } from '../DarkTitle';
import { FeedItemType, FeedItem } from './FeedItem';
import './FeedList.scss';

export type FeedListProps = {
  title?: string;
  logoPath?: string;
  items?: FeedItemType[];
  kicker?: string;
};

export const FeedList = ({ title, kicker, logoPath, items }: FeedListProps) => {
  return (
    <section className="feed-section">
      <DarkTitle title={title || 'Feed'} kicker={kicker} imageUrl={logoPath} />

      <div className={`feed-list u-space--top`}>
        {items?.map((item, i) => (
          <FeedItem key={i} {...item} />
        ))}
      </div>
    </section>
  );
};

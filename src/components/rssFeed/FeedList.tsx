import { DarkTitle } from '../DarkTitle';
import { FeedItemType, FeedItem } from './FeedItem';
import './FeedList.scss';

export type FeedListProps = {
  title?: string;
  logoPath?: string;
  items?: FeedItemType[];
  numbersOnRow?: number;
};

export const FeedList = ({
  title,
  logoPath,
  items,
  numbersOnRow
}: FeedListProps) => {
  return (
    <section className="feed-section">
      <DarkTitle
        title={title || 'Feed'}
        imageUrl={logoPath}
        maxImageWidth={100}
      />

      <div
        className={`feed-list ${numbersOnRow ? `feed-list--${numbersOnRow}-on-row` : ''} u-space--top`}
      >
        {items?.map((item, i) => (
          <FeedItem key={i} {...item} />
        ))}
      </div>
    </section>
  );
};

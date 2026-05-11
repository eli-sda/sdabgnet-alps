import { DarkTitle } from '../DarkTitle';
import { FeedItemType, FeedItem } from './FeedItem';
import './FeedList.scss';

export type FeedListProps = {
  title?: string;
  titleLink?: string;
  logoPath?: string;
  items?: FeedItemType[];
  kicker?: string;
  rssFeedName?: string;
  feedListClassName?: string;
};

export const FeedList = ({
  title,
  titleLink,
  kicker,
  logoPath,
  items,
  rssFeedName,
  feedListClassName = ''
}: FeedListProps) => {
  const titleContent = (
    <DarkTitle title={title || 'Feed'} kicker={kicker} imageUrl={logoPath} />
  );

  return (
    <section id={rssFeedName} className="feed-section">
      {titleLink ? (
        <a href={titleLink} target="_blank" rel="noopener noreferrer">
          {titleContent}
        </a>
      ) : (
        titleContent
      )}

      {items && items.length > 0 ? (
        <div className={`feed-list u-space--top ${feedListClassName}`}>
          {items?.map((item, i) => (
            <FeedItem key={i} {...item} />
          ))}
        </div>
      ) : (
        <div className="centered-text">
          <i className="fas fa-spinner fa-pulse fa-5x u-space--triple"></i>
        </div>
      )}
    </section>
  );
};

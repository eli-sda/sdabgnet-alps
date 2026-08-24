import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination } from 'swiper/modules';
import { DarkTitle } from '../DarkTitle';
import { FeedItemType, FeedItem } from './FeedItem';

import './FeedList.scss';
import 'swiper/css';
import 'swiper/css/pagination';

export type FeedListProps = {
  id: string;
  title?: string;
  titleLink?: string;
  logoPath?: string;
  items?: FeedItemType[];
  kicker?: string;
  feedListClassName?: string;
};

export const FeedList = ({
  id,
  title,
  titleLink,
  kicker,
  logoPath,
  items,
  feedListClassName = ''
}: FeedListProps) => {
  const titleContent = (
    <DarkTitle title={title || 'Feed'} kicker={kicker} imageUrl={logoPath} />
  );

  return (
    <section id={id} className="feed-section">
      {titleLink ? (
        <a href={titleLink} target="_blank" rel="noopener noreferrer">
          {titleContent}
        </a>
      ) : (
        titleContent
      )}

      {items && items.length > 0 ? (
        <Swiper
          modules={[Pagination, Mousewheel]}
          mousewheel={{
            forceToAxis: true
          }}
          pagination={{ clickable: true }}
          spaceBetween={32}
          slidesPerView="auto"
          className={`feed-swiper u-space--top ${feedListClassName}`}
        >
          {items.map((item, i) => (
            <SwiperSlide key={i}>
              <FeedItem {...item} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="centered-text">
          <i className="fas fa-spinner fa-pulse fa-5x u-space--triple"></i>
        </div>
      )}
    </section>
  );
};

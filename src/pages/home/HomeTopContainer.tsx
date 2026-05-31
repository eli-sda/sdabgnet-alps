import { FC, useMemo } from 'react';
import { Moment } from 'moment';
import { AdsCarousel } from 'src/components/carousel/AdsCarousel';
import { Separator } from 'src/components/separator/Separator';
import DailyVerse from 'src/components/dailyVerse/DailyVerse';
import './HomeTopContainer.scss';

export const HomeTopContainer: FC<{ dailyVerseDate: Moment }> = ({
  dailyVerseDate
}) => {
  const memoizedAdsCarousel = useMemo(() => <AdsCarousel />, []);

  return (
    <section className="home-top-container with-background u-padding--double has-bottom-separator">
      {memoizedAdsCarousel}
      <div className="daily-verse-container">
        <DailyVerse date={dailyVerseDate} />
      </div>
      <Separator type="bottom" />
    </section>
  );
};

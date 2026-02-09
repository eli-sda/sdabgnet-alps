import { FC } from 'react';
import { Moment } from 'moment';
import { AdsCarousel } from 'src/components/carousel/AdsCarousel';
import { Separator } from 'src/components/separator/Separator';

import './HomeTopContainer.scss';
import DailyVerse from 'src/components/dailyVerse/DailyVerse';

export const HomeTopContainer: FC<{ dailyVerseDate: Moment }> = ({
  dailyVerseDate
}) => {
  return (
    <section className="home-top-container with-background u-padding--double has-bottom-separator">
      <AdsCarousel />
      <div className="daily-verse-container">
        <DailyVerse date={dailyVerseDate}></DailyVerse>
      </div>
      <Separator type="bottom" />
    </section>
  );
};

/* like BreakoutBlock */

import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { isEqual } from 'lodash';
import { Moment } from 'moment';

import {
  themeBackgroundClass,
  themeColorClass
} from 'alps-library/global/colors';
import { CustomPortableText } from 'src/utils/CustomPortableText';
import { useDailyVerse } from 'src/hooks/useDailyVerse';
import { DailyVerseType } from 'src/contexts/DailyVerseContext';
import PopupContent from 'src/components/popupContent/PopupContent';

import './DailyVerseDark.scss';

const DailyVerseDark: FC<{ date: Moment }> = ({ date }) => {
  const [data, setData] = useState<DailyVerseType | null>(null);
  const [loading, setLoading] = useState(true);

  const formattedDate = useMemo(
    () => date.format('YYYY-MM-DD'), //date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    [date]
  );
  const prevFormattedDate = useRef<string | null>(null);

  const { getDailyVerse } = useDailyVerse();

  useEffect(() => {
    if (isEqual(prevFormattedDate.current, formattedDate)) return;
    prevFormattedDate.current = formattedDate;

    setLoading(true);
    getDailyVerse(formattedDate)
      .then((loaded) => {
        // only set if it matches the requested date
        if (loaded?.date === formattedDate) {
          setData(loaded);
        }
      })
      .catch((err) => console.error('Error loading daily verse: ', err))
      .finally(() => setLoading(false));
  }, [formattedDate, getDailyVerse]);

  if (loading) {
    return <i className="fas fa-spinner fa-pulse u-space--quarter"></i>;
  }

  return data ? (
    <div
      className={`daily-verse c-block__breakout u-padding u-padding--double--top u-padding--double--bottom u-spacing can-be--dark-dark ${themeBackgroundClass}--darker`}
    >
      <h3 className=" u-theme--color--lighter c-block__kicker">
        Библейски стих за деня
      </h3>
      <h3
        className={
          'hyphens-auto c-block__title u-color--white u-space--half--top'
        }
      >
        {data.title}
      </h3>
      <p
        className={
          'hyphens-auto c-block__body ' + themeColorClass + '--lighter'
        }
      >
        {data.text}
        <span className="hyphens-auto c-block__meta u-font--secondary--xs u-space--half--top">
          {data.verse}
        </span>
      </p>

      {data.comment && (
        <PopupContent
          title={data.title}
          buttonLabel="Покажи коментара"
          buttonLighter={true}
          faIconClass="far fa-comment-dots"
          maxWidth="md"
        >
          <div className="hyphens-auto text u-spacing u-padding--top">
            <CustomPortableText value={data.comment} />
            {data.halfYear && (
              <div className="u-text-align--right u-space--half--top u-space--bottom">
                {data.halfYear.author}, <em>{data.halfYear.title}</em>
              </div>
            )}
          </div>
        </PopupContent>
      )}
    </div>
  ) : (
    <p>{`Няма данни за ${date.format('DD.MM.YYYY')}`}</p>
  );
};

export default DailyVerseDark;

import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { isEqual } from 'lodash';
import moment, { Moment } from 'moment';

import useClasses from 'alps-library/helpers/useClasses';
import useToggle from 'alps-library/helpers/useToggle';
import { themeBorderColorClass } from 'alps-library/global/colors';
import { getFontClass } from 'alps-library/global/fonts';
import { Button } from 'src/alps/atoms/Button';
import { CustomPortableText } from 'src/utils/CustomPortableText';
import { useDailyVerse } from 'src/hooks/useDailyVerse';
import { DailyVerseType } from 'src/contexts/DailyVerseContext';

const DailyVerse: FC<{ date: Moment }> = ({ date }) => {
  const [data, setData] = useState<DailyVerseType | null>(null);
  const [loading, setLoading] = useState(true);

  const { onToggle, openClass } = useToggle();
  const classes = useClasses(
    'c-block c-block__text u-border--left u-spacing ' +
      themeBorderColorClass +
      '--darker',
    { 'c-block__text-expand': true },
    `${openClass}`
  );

  const moreClasses =
    ' can-be--dark-dark u-clear-fix u-padding u-background-color--gray--light';

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
    return <i className="fa fa-spinner u-space--quarter"></i>;
  }

  return data ? (
    <div className={classes + moreClasses}>
      <h3 className={`${getFontClass('primary', 's')} u-theme--color--darker`}>
        <strong>{data.title}</strong>
      </h3>

      {data.text && <p className={'c-block__body'}>{data.text}</p>}

      {data.date && (
        <span className="c-block__meta u-font--secondary--xs u-theme--color--dark">
          {data.verse}&nbsp;
          <time
            className="c-block__date u-text-transform--upper"
            dateTime={data.date}
          >
            {/* {new Date(data.date).toLocaleDateString('bg-BG')} //25.12.2024 г.*/}
            (стих за деня {moment(data.date).format('DD.MM.YYYY')})
          </time>
        </span>
      )}

      {data.comment && (
        <div className="text">
          <div className="c-block__content">
            <CustomPortableText value={data.comment} />
            {data.halfYear && (
              <div className="u-text-align--right u-space--half--top u-space--bottom">
                {data.halfYear.author}, <em>{data.halfYear.title}</em>
              </div>
            )}
          </div>
          <Button
            as={'a'}
            className={`${openClass} comment`}
            expand={true}
            onClick={onToggle}
            outline={true}
            toggle={true}
          />
        </div>
      )}
    </div>
  ) : (
    <p>{`Няма данни за ${date.format('DD.MM.YYYY')}`}</p>
  );
};

export default DailyVerse;

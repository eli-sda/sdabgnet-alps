import React, { FC, useEffect, useMemo, useState } from 'react';
import { clientVreses } from '../sanityClient'; // Updated Sanity client
import { PortableTextBlock } from '@portabletext/types';

import { Text } from 'alps-library/atoms/text/Text';
import useClasses from 'alps-library/helpers/useClasses';
import useToggle from 'alps-library/helpers/useToggle';
import { themeBorderColorClass } from 'alps-library/global/colors';
import { getFontClass } from 'alps-library/global/fonts';
import { Button } from 'alps-library/atoms/button/Button';
import moment from 'moment';
import { CustomPortableText } from 'src/utils/CustomPortableText';

export interface Verse {
  date: string;
  title: string;
  text: string;
  verse: string;
  comment: Array<PortableTextBlock>;
  halfYear: {
    title: string;
    author: string;
  };
}

const DailyVerse: FC<{ date?: Date }> = ({ date }) => {
  const [data, setData] = useState<Verse | null>(null);
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

  const formattedDate = useMemo(() => {
    const validDate = date || new Date(); // Use the provided date or fallback to the current date
    return validDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }, [date]);

  useEffect(() => {
    const query = `*[_type=='verse'&& date=='${formattedDate}'][0]{date,title,text,verse,comment, halfYear->{author, title}}`;

    clientVreses
      .fetch(query)
      .then((data: Verse) => setData(data))
      .catch((error) =>
        console.error('Error fetching verse from Sanity:', error)
      )
      .finally(() => setLoading(false));
  }, [formattedDate]);

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
            dateTime={`${data.date}`}
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
    <p>{`Няма данни за ${formattedDate}`}</p>
  );
};

export default DailyVerse;

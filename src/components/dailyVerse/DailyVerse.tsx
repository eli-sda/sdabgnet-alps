import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { isEqual } from 'lodash';
import moment, { Moment } from 'moment';
import 'moment/dist/locale/bg';
moment.locale('bg');

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import useClasses from 'alps-library/helpers/useClasses';
import { themeBorderColorClass } from 'alps-library/global/colors';
import { getFontClass } from 'alps-library/global/fonts';
import { CustomPortableText } from 'src/utils/CustomPortableText';
import { useDailyVerse } from 'src/hooks/useDailyVerse';
import { DailyVerseType } from 'src/contexts/DailyVerseContext';
import PopupContent from '../popupContent/PopupContent';
import './DailyVerse.scss';

const DailyVerseGray: FC<{ date: Moment }> = ({ date }) => {
  const [activeDate, setActiveDate] = useState<Moment>(date);
  const [data, setData] = useState<DailyVerseType | null>(null);
  const [loading, setLoading] = useState(true);

  const classes = useClasses(
    'c-block c-block__text u-border--left u-spacing ' +
      themeBorderColorClass +
      '--darker',
    { 'c-block__text-expand': true }
  );

  const moreClasses =
    ' can-be--dark-dark u-clear-fix u-padding u-background-color--gray--light';

  const minDate = useMemo(() => moment('2025-01-01', 'YYYY-MM-DD'), []);
  const maxDate = useMemo(() => moment().subtract(1, 'year'), []);

  // Sync active date if the parent date prop changes
  useEffect(() => {
    if (!activeDate.isSame(date, 'day')) {
      setActiveDate(date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const formattedDate = useMemo(
    () => activeDate.format('YYYY-MM-DD'), //date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    [activeDate]
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

  return (
    <div className={classes + moreClasses}>
      <span className="c-block__meta u-font--secondary--xs u-theme--color--dark">
        Библейски стих за деня
      </span>

      {loading ? (
        <i className="fas fa-spinner fa-pulse u-space--quarter"></i>
      ) : data ? (
        <>
          <h3
            className={`hyphens-auto ${getFontClass('primary', 's')} u-theme--color--darker`}
          >
            <strong>{data.title}</strong>
          </h3>

          {data.text && <p className={'c-block__body'}>{data.text}</p>}
          <span className="hyphens-auto c-block__meta u-font--secondary--xs u-theme--color--dark u-space--half--top">
            {data.verse}
          </span>
          <input type="hidden" name="date" value={formattedDate} />

          <div className="u-space--top">
            <LocalizationProvider
              dateAdapter={AdapterMoment}
              adapterLocale="bg"
              localeText={{
                datePickerToolbarTitle: 'Избрана дата'
              }}
            >
              <DatePicker
                label="Избери дата"
                value={activeDate}
                onChange={(newValue) => {
                  if (newValue && newValue.isValid()) {
                    setActiveDate(newValue);
                  }
                }}
                minDate={minDate}
                maxDate={maxDate}
                format="DD.MM.YYYY"
                className="daily-datepicker"
                views={['day']}
                closeOnSelect={true} // Force close since action buttons are hidden
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true
                  },
                  popper: {
                    className: 'daily-datepicker-popper'
                  },
                  mobilePaper: {
                    className: 'daily-datepicker-popper'
                  },
                  calendarHeader: {
                    format: 'MMMM'
                  },
                  actionBar: {
                    actions: [] // Not showing any buttons
                  },
                  toolbar: {
                    toolbarFormat: 'D MMMM'
                  }
                }}
              />
            </LocalizationProvider>
          </div>

          {data.comment && (
            <PopupContent
              title={data.title}
              buttonLabel="Покажи коментара"
              faIconClass="far fa-comment-dots"
              iconPosition="right"
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
        </>
      ) : (
        <p className="u-space--half--top">{`Няма данни за ${activeDate.format('DD.MM.YYYY')}`}</p>
      )}
    </div>
  );
};

export default DailyVerseGray;

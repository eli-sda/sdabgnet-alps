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

const DailyVerse: FC<{ date: Moment }> = ({ date }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDate, setActiveDate] = useState<Moment>(date);
  const [data, setData] = useState<DailyVerseType | null>(null);
  const [loading, setLoading] = useState(true);

  const classes = useClasses(
    'daily-verse c-block c-block__text u-border--left u-spacing ' +
      themeBorderColorClass +
      '--darker',
    { 'c-block__text-expand': true }
  );

  const moreClasses =
    ' can-be--dark-dark u-clear-fix u-padding u-background-color--gray--light';

  const fadeStyle = {
    opacity: loading ? 0.5 : 1,
    transition: 'opacity 0.2s ease-in-out'
  };

  const parentDateStr = date.format('YYYY-MM-DD');

  const minDate = useMemo(() => moment('2025-01-01', 'YYYY-MM-DD'), []);
  // Re-calculate maxDate when the parent date changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const maxDate = useMemo(() => moment().subtract(1, 'year'), [parentDateStr]);

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
    <div id="daily-verse" className={classes + moreClasses}>
      <span className="c-block__meta u-font--secondary--xs u-theme--color--dark">
        Библейски стих за деня
      </span>
      {/* Show the spinner without hiding the content */}
      {loading && (
        <i className="fas fa-spinner fa-pulse fa-4x u-space--quarter"></i>
      )}

      {/* Dim the content while loading for a smooth visual transition */}
      {data ? (
        <>
          <h3
            className={`hyphens-auto ${getFontClass('primary', 's')} u-theme--color--darker`}
            style={fadeStyle}
          >
            <strong>{data.title}</strong>
          </h3>

          {data.text && (
            <p className="c-block__body" style={fadeStyle}>
              {data.text}
            </p>
          )}

          <span
            className="hyphens-auto c-block__meta u-font--secondary--xs u-theme--color--dark u-space--half--top"
            style={fadeStyle}
          >
            {data.verse}
          </span>
        </>
      ) : (
        !loading && (
          <p className="u-space--half--top">{`Няма данни за ${activeDate.format('DD.MM.YYYY')}`}</p>
        )
      )}

      {!loading && data && data.comment && (
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
            key={parentDateStr}
            open={isOpen}
            onClose={() => setIsOpen(false)}
            onOpen={() => setIsOpen(true)}
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
                fullWidth: true,
                readOnly: true,
                onClick: () => setIsOpen(true)
              },
              popper: {
                className: 'daily-datepicker-popper'
              },
              mobilePaper: {
                className: 'daily-datepicker-popper'
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
    </div>
  );
};

export default DailyVerse;

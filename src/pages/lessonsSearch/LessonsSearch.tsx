import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'alps-library/molecules/forms/elements/Form';
import { OptionGroup } from 'alps-library/molecules/forms/elements/OptionGroup';
import { Dropdown } from 'alps-library/molecules/forms/elements/Dropdown';
import { getFontClass } from 'alps-library/global/fonts';
import routes from 'src/routes';
import { getTitle } from 'src/utils/Navigation';
import { getImageTypeByUrl } from 'src/utils/ImageHelper';
import { Page } from 'src/organisms/Page';
import { Button } from 'src/alps/atoms/Button';
import { MediaBlock } from 'src/alps/molecules/blocks/MediaBlock';
import {
  getAllLessonQuarters,
  getRouteLesson,
  LessonType,
  QuarterObject
} from 'src/utils/LessonUtils';
import './LessonsSearch.scss';

const LESSON_TYPES: LessonType[] = ['', 'cq', 'cc'];
type QuarterOption = {
  title: string;
  text: string;
  value: number;
  cover?: string;
};

const LessonsSearch = () => {
  const navigate = useNavigate();

  const title = getTitle(routes.churchLife('lessons-search'));
  const kicker = getTitle(routes.churchLife('lessons'));
  const breadcrumbsUrls = [
    routes.churchLife(),
    routes.churchLife('lessons'),
    routes.churchLife('lessons-search')
  ];
  const [lessonType, setLessonType] = useState<LessonType>('');
  const [quartersByType, setQuartersByType] = useState<
    Record<LessonType, QuarterObject[]>
  >({
    '': [],
    cq: [],
    cc: []
  });
  const [year, setYear] = useState<number>();
  const [quarterOption, setQuarterOption] = useState<QuarterOption>();
  const [quarter, setQuarter] = useState<number>();

  useEffect(() => {
    getAllLessonQuarters()
      .then((quarters) => {
        const grouped = LESSON_TYPES.reduce(
          (acc, type) => {
            acc[type] = quarters.filter((q) => q.type === type);
            return acc;
          },
          {} as Record<LessonType, QuarterObject[]>
        );

        setQuartersByType(grouped);
      })
      .catch((error) =>
        console.error('Error loading all lesson quarters:', error)
      );
  }, []);

  // get available years for selected lesson type
  const years = useCallback(() => {
    if (!quartersByType[lessonType]) return [];
    const quarters = quartersByType[lessonType];
    const years = quarters.map((q) => q.lessonYear);
    const uniqueYears = Array.from(new Set(years));
    uniqueYears.sort((a, b) => b - a);
    return uniqueYears;
  }, [lessonType, quartersByType]);

  const yearOptions = useCallback(
    () =>
      years().map((year) => ({
        text: year.toString(),
        value: year - 2000
      })),
    [years]
  );

  //set year
  useEffect(() => {
    const availableYears = yearOptions();
    if (availableYears.length > 0) {
      setYear(availableYears[0].value);
    }
  }, [yearOptions]);

  // get available quarters for selected year and lesson type
  const quarterOptions = useCallback(() => {
    if (!quartersByType[lessonType] || !year) return [];
    const quarters = quartersByType[lessonType].filter(
      (q) => q.lessonYear === 2000 + year
    );
    const qOptions: QuarterOption[] = quarters.map((q) => ({
      title: q.qTitle,
      text:
        q.qHumanDate ||
        (q.lessonQuarter === 1
          ? 'първо тримесечие'
          : q.lessonQuarter === 2
            ? 'второ тримесечие'
            : q.lessonQuarter === 3
              ? 'трето тримесечие'
              : 'четвърто тримесечие'),
      value: q.lessonQuarter,
      cover: q.quarterlyCover
    }));
    return qOptions;
  }, [quartersByType, lessonType, year]);

  //set quarter
  useEffect(() => {
    const quarters = quarterOptions();
    if (quarters.length > 0) {
      setQuarter(quarters[0].value);
    }
  }, [quarterOptions]);

  // set quarter option
  useEffect(() => {
    const quarters = quarterOptions();
    const selectedQuarter = quarters.find((q) => q.value === quarter);
    setQuarterOption(selectedQuarter);
  }, [quarter, quarterOptions]);

  // get quarter image
  const qImage = useMemo(() => {
    return quarterOption?.cover
      ? getImageTypeByUrl(quarterOption.cover, quarterOption.title)
      : undefined;
  }, [quarterOption]);

  // construct lesson URL
  const lessonURL = useMemo(() => {
    const path = `lesson${lessonType ? `-${lessonType}` : ''}` as
      | 'lesson'
      | 'lesson-cq'
      | 'lesson-cc';
    return `${routes.churchLife(path)}/${year}/${quarter}/1`;
  }, [lessonType, year, quarter]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!lessonURL.startsWith('/') || /^\/\/|:/.test(lessonURL)) return;
    navigate(lessonURL);
  };

  return (
    <Page
      title={title}
      kicker={kicker}
      breadcrumbsUrls={breadcrumbsUrls}
      pageClassName="lesson-search-page"
    >
      {quartersByType && quarter ? (
        <Form
          className={'u-spacing'}
          title="Намери уроци по година и тримесечие"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            void submitHandler(e);
          }}
        >
          <OptionGroup
            type="radio"
            title="Избери вид на уроците"
            titleFontSize="m"
            options={LESSON_TYPES.map((type) => ({
              label: getTitle(routes.churchLife(getRouteLesson(type))),
              id: `lesson-type-${type}`,
              name: 'lessonType',
              value: type,
              checked: lessonType === type,
              onClick: () => setLessonType(type)
            }))}
          />
          <Dropdown
            label="Избери година"
            name="year"
            value={year}
            hideNone
            labelClass={getFontClass('m', 'secondary')}
            options={yearOptions()}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setYear(parseInt(e.target.value))
            }
          />
          <Dropdown
            label="Избери тримесечие"
            name="quarter"
            value={quarter}
            hideNone
            labelClass={getFontClass('m', 'secondary')}
            options={quarterOptions()}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setQuarter(parseInt(e.target.value))
            }
          />
          {quarterOption && (
            <div className="quarter-preview u-space--half--bottom">
              <MediaBlock
                image={qImage}
                type="feature"
                kicker={quarterOption.text}
                title={quarterOption.title}
                url={lessonURL.startsWith('/') && !/^\/\/|:/.test(lessonURL) ? lessonURL : undefined}
              />
            </div>
          )}

          <Button
            label="Отвори урок 1 от тримесечието"
            icon="arrow-long-right"
            iconSize="m"
            iconPosition="right"
          />
        </Form>
      ) : (
        <i className="fas fa-spinner fa-pulse u-space--quarter fa-10x"></i>
      )}
    </Page>
  );
};

export default LessonsSearch;

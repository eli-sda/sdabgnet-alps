import { useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  isValidLessonNumber,
  isValidQuarter,
  isValidYear,
  LessonProps,
  LessonType,
  SS_URL_BG,
  twoDigits
} from '../../utils/LessonUtils';
import './Lesson.css';

import { LessonItem } from './LessonItem';
import routes from '../../routes';
import { getBreadcrumbs, getTitle } from 'src/utils/Navigation';
import LessonQuarterBlock from './LessonQuarterBlock';
import { useLessonUtils } from 'src/hooks/useLessonUtils';
import { LessonQuarterProvider } from 'src/providers/LessonQuarterProvider';
import { useLessonQuarterContext } from 'src/contexts/LessonQuarterContext';
import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import { PageContent } from 'src/alps/organisms/content/PageContent';
import { MissingLesson } from './MissingLesson';

const Lesson = ({ type = '' }: { type?: LessonType }) => {
  const { year, quarter, week } = useParams();
  const { currentLessonParameters } = useLessonUtils();
  const navigate = useNavigate();

  const postfix = type ? `-${type}` : '';
  const lessonURL = routes.churchLife(
    `lesson${postfix}` as 'lesson' | 'lesson-cq' | 'lesson-cc'
  );

  // When opening the page with invalid params, redirect to the current lesson
  useEffect(() => {
    if (
      !year ||
      !isValidYear(year) ||
      !quarter ||
      !isValidQuarter(quarter) ||
      !week ||
      !isValidLessonNumber(week)
    ) {
      const { lessonYear, lessonQuarter, lessonNumber } =
        currentLessonParameters;
      navigate(
        `${lessonURL}/${lessonYear % 100}/${lessonQuarter}/${lessonNumber}`
      );
    }
  }, [year, quarter, week, currentLessonParameters, lessonURL, navigate]);

  const params = useMemo(() => {
    let params: LessonProps;
    if (
      year &&
      isValidYear(year) &&
      quarter &&
      isValidQuarter(quarter) &&
      week &&
      isValidLessonNumber(week)
    ) {
      params = {
        lessonYear: 2000 + parseInt(year),
        lessonQuarter: parseInt(quarter),
        lessonNumber: parseInt(week),
        type
      };
    } else {
      params = { ...currentLessonParameters, type };
    }

    return params;
  }, [currentLessonParameters, quarter, week, year, type]);

  const ssPath = useMemo(() => {
    if (!params) return '';

    const path1 = `${SS_URL_BG}/${params.lessonYear}-${twoDigits(
      params.lessonQuarter
    )}`;
    const path2 = `${twoDigits(params.lessonNumber)}/01`;
    return `${path1}${postfix}/${path2}`;
  }, [params, postfix]);

  // function resizeIframe() {
  //   const obj = iFrameRef.current;
  //   if (obj)
  //     obj.style.height =
  //       obj.contentWindow?.document.documentElement.scrollHeight + 'px';
  // }

  const breadcrumbsUrls = [
    routes.churchLife(),
    routes.churchLife('lessons'),
    lessonURL
  ];
  const breadcrumbs = getBreadcrumbs(breadcrumbsUrls);

  const LessonCont = () => {
    const { qLesson, lessonDateRange } = useLessonQuarterContext();
    return (
      <>
        {qLesson && (
          <LessonItem
            qLesson={qLesson}
            lessonDateRange={lessonDateRange}
            ssPath={ssPath}
          ></LessonItem>
        )}
        {!qLesson && <MissingLesson {...params} />}
      </>
    );
  };

  return (
    <>
      <PageHeaderLong
        title={getTitle(lessonURL)}
        kicker={getTitle(routes.churchLife('lessons'))}
      />
      <PageContent breadcrumbs={breadcrumbs}></PageContent>
      <LessonQuarterProvider>
        <LessonQuarterBlock
          {...params}
          withIntroduction={true}
          showLessonLink={false}
        />
        <LessonCont />

        {/* <iframe
            title="урок"
            ref={iFrameRef}
            src="https://sabbath-school-stage.adventech.io/bg/2022-04/06/01"
            frameBorder="0"
            scrolling="no"
            onLoad={resizeIframe}
          /> */}
      </LessonQuarterProvider>
    </>
  );
};

export default Lesson;

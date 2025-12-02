import { useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  isValidLessonNumber,
  isValidQuarter,
  isValidYear,
  LessonProps,
  LessonType
} from '../../utils/LessonUtils';
import './Lesson.scss';

import routes from '../../routes';
import { getBreadcrumbs } from 'src/utils/Navigation';
import LessonQuarterBlock from './LessonQuarterBlock';
import { useLessonUtils } from 'src/hooks/useLessonUtils';
import { LessonQuarterProvider } from 'src/providers/LessonQuarterProvider';
import { PageContent } from 'src/alps/organisms/content/PageContent';
import LessonCont from './LessonCont';

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

      // Validate parameters before using in URL to prevent open redirect
      const sanitizedYear = Math.max(0, Math.min(99, lessonYear % 100));
      const sanitizedQuarter = Math.max(1, Math.min(4, lessonQuarter));
      const sanitizedNumber = Math.max(1, Math.min(13, lessonNumber));

      navigate(
        `${lessonURL}/${sanitizedYear}/${sanitizedQuarter}/${sanitizedNumber}`
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

  const breadcrumbsUrls = [
    routes.churchLife(),
    routes.churchLife('lessons'),
    lessonURL
  ];
  const breadcrumbs = getBreadcrumbs(breadcrumbsUrls);

  return (
    <LessonQuarterProvider>
      <LessonQuarterBlock
        {...params}
        withIntroduction={true}
        showLessonLink={false}
      />
      <PageContent breadcrumbs={breadcrumbs}></PageContent>
      <LessonCont
        lessonURL={lessonURL}
        currentLessonParameters={currentLessonParameters}
        params={params}
      />
    </LessonQuarterProvider>
  );
};

export default Lesson;

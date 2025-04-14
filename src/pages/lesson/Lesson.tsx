import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  isValidLessonNumber,
  isValidQuarter,
  isValidYear,
  LessonProps,
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

const Lesson = () => {
  const { year, quarter, week } = useParams();
  const { currentLessonParameters } = useLessonUtils();

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
        lessonNumber: parseInt(week)
      };
    } else {
      params = currentLessonParameters;
    }
    return params;
  }, [currentLessonParameters, quarter, week, year]);

  const ssPaths = useMemo(() => {
    if (!params)
      return {
        ss: '',
        ssInverse: '',
        ssCornerstoneConnections: ''
      };
    const path1 = `${SS_URL_BG}/${params.lessonYear}-${twoDigits(
      params.lessonQuarter
    )}`;
    const path2 = `${twoDigits(params.lessonNumber)}/01`;
    return {
      ss: `${path1}/${path2}`,
      ssInverse: `${path1}-cq/${path2}`,
      ssCornerstoneConnections: `${path1}-cc/${path2}`
    };
  }, [params]);

  // function resizeIframe() {
  //   const obj = iFrameRef.current;
  //   if (obj)
  //     obj.style.height =
  //       obj.contentWindow?.document.documentElement.scrollHeight + 'px';
  // }

  const breadcrumbsUrls = [
    routes.churchLife(),
    routes.churchLife('lessons'),
    routes.churchLife('lesson')
  ];
  const breadcrumbs = getBreadcrumbs(breadcrumbsUrls);

  const LessonCont = () => {
    const { lesson, quarterObject } = useLessonQuarterContext();
    return (
      <>
        {quarterObject && lesson && (
          <LessonItem
            {...quarterObject}
            lesson={lesson}
            ssPath={ssPaths.ss}
          ></LessonItem>
        )}
        {!lesson && <MissingLesson {...params} />}
      </>
    );
  };

  return (
    <>
      <PageHeaderLong
        title={getTitle(routes.churchLife('lesson'))}
        kicker={getTitle(routes.churchLife('lessons'))}
      />
      <PageContent breadcrumbs={breadcrumbs}></PageContent>
      <LessonQuarterProvider>
        <LessonQuarterBlock {...params} showLessonLink={false} />
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

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  getCurrentLesson,
  isValidLessonNumber,
  isValidQuarter,
  isValidYear,
  LessonObject,
  loadLesson,
  SS_URL_BG,
  twoDigits
} from './LessonUtils';
import './Lesson.css';

import { LessonItem } from './LessonItem';
import { Page } from 'src/organisms/Page';
import routes from '../../routes';

interface Props {
  lessonYear: number;
  lessonQuarter: number;
  lessonNumber: number;
}
const Lesson = () => {
  const { year, quarter, week } = useParams();
  const [lesson, setLesson] = useState<LessonObject>();
  const [cqLesson, setCqLesson] = useState<LessonObject>();
  // const iFrameRef = useRef<HTMLIFrameElement>(null);

  const params = useMemo(() => {
    let params: Props;
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
      const lessonParams = getCurrentLesson();
      const {
        year: lessonYear,
        quarter: lessonQuarter,
        lessonNumber
      } = lessonParams;
      params = { lessonYear, lessonQuarter, lessonNumber };
    }
    return params;
  }, [quarter, week, year]);

  useEffect(() => {
    loadLesson(params)
      .then((lesson) => {
        console.log(new Date(), ' lesson:', lesson);
        setLesson(lesson);
      })
      .catch((error) => console.error(error));

    loadLesson({ ...params, isCQ: true })
      .then((lesson) => {
        console.log(new Date(), 'CQlesson:', lesson);
        setCqLesson(lesson);
      })
      .catch((error) => console.error(error));
  }, [params]);

  const ssPaths = useMemo(() => {
    if (!lesson)
      return {
        ss: '',
        ssInverse: ''
      };
    const path1 = `${SS_URL_BG}/${lesson.lessonYear}-${twoDigits(
      lesson.lessonQuarter
    )}`;
    const path2 = `${twoDigits(lesson.lessonNumber)}/01`;
    return {
      ss: `${path1}/${path2}`,
      ssInverse: `${path1}-cq/${path2}`
    };
  }, [lesson]);

  // function resizeIframe() {
  //   const obj = iFrameRef.current;
  //   if (obj)
  //     obj.style.height =
  //       obj.contentWindow?.document.documentElement.scrollHeight + 'px';
  // }

  const breadcrumbsUrls = [routes.churchLife(), routes.churchLife('lesson')];

  return (
    <Page title="Съботно-училищни уроци" breadcrumbsUrls={breadcrumbsUrls}>
      {!lesson && <h3>Зареждане...</h3>}

      <ul>
        {lesson && <LessonItem {...lesson} ssPath={ssPaths.ss}></LessonItem>}
        {cqLesson && (
          <LessonItem {...cqLesson} ssPath={ssPaths.ssInverse}></LessonItem>
        )}
      </ul>
      {/* <iframe
            title="урок"
            ref={iFrameRef}
            src="https://sabbath-school-stage.adventech.io/bg/2022-04/06/01"
            frameBorder="0"
            scrolling="no"
            onLoad={resizeIframe}
          /> */}
    </Page>
  );
};
export default Lesson;

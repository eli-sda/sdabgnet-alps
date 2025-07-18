import { useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  formatDateRange,
  getLessonFromQuarter,
  isValidLessonNumber,
  isValidQuarter,
  isValidYear,
  LessonProps,
  LessonType
} from '../../utils/LessonUtils';
import './Lesson.css';

import { LessonItem } from './LessonItem';
import routes from '../../routes';
import { getBreadcrumbs } from 'src/utils/Navigation';
import LessonQuarterBlock from './LessonQuarterBlock';
import { useLessonUtils } from 'src/hooks/useLessonUtils';
import { LessonQuarterProvider } from 'src/providers/LessonQuarterProvider';
import { useLessonQuarterContext } from 'src/contexts/LessonQuarterContext';
import { PageContent } from 'src/alps/organisms/content/PageContent';
import { MissingLesson } from './MissingLesson';

import { ArticleContent } from 'alps-library/organisms/content/articleContent/ArticleContent.tsx';
import { MediaBlockProps } from 'src/alps/molecules/blocks/MediaBlock';
import { RelatedPosts } from 'src/alps/organisms/asides/RelatedPosts';
import LessonHead from './LessonHead';
import { Figure } from 'alps-library/molecules/media/figure/Figure';
import { Aside } from 'alps-library/organisms/asides/aside/Aside';

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
    const { qLesson, lessonDateRange, quarterObject } =
      useLessonQuarterContext();

    const passedLessons = useMemo(() => {
      if (
        !quarterObject ||
        !qLesson ||
        !(currentLessonParameters.lessonNumber > 1)
      )
        return [];
      const { lessonYear, lessonQuarter } = quarterObject;
      const passedLessons: MediaBlockProps[] = [];
      for (let i = 1; i <= currentLessonParameters.lessonNumber; i++) {
        const lesson = getLessonFromQuarter(quarterObject, i);
        if (!lesson) continue;
        const lessonBlock = {
          title: `${lesson.num}. ${lesson.title}`,
          image: {
            alt: '',
            srcSet: {
              default: lesson.cover || '',
              500: '',
              750: '',
              1200: ''
            }
          },
          url: `${lessonURL}/${lessonYear % 100}/${lessonQuarter}/${
            lesson.num
          }`,
          category:
            lesson.startDate && lesson.endDate
              ? formatDateRange(lesson.startDate, lesson.endDate)
              : ''
        };
        passedLessons.push(lessonBlock);
      }
      return passedLessons;
    }, [quarterObject, qLesson]);

    const sidebar = useMemo(() => {
      return (
        <>
          {quarterObject &&
            (quarterObject.type == '' || quarterObject.type === 'cq') &&
            quarterObject.lessonYear === 2025 &&
            quarterObject.lessonQuarter === 3 && (
              <Aside>
                <Figure
                  align="left"
                  caption='Гледайте поредицата "Изход" с п-р Петър Стоилов'
                  size="small"
                  videoSrc="https://www.youtube.com/embed?listType=playlist&list=PLfCTd97jVbHUL-rsvyHnIr0L7FM8MtJnq"
                />
              </Aside>
            )}
          {passedLessons.length > 0 && (
            <RelatedPosts
              heading="Изминали уроци от тримесечието"
              blocks={passedLessons}
            />
          )}
        </>
      );
    }, [quarterObject, passedLessons]);

    return (
      <>
        {qLesson && (
          <>
            <LessonHead
              lessonTitle={qLesson.title}
              kicker={`Урок № ${qLesson.num}`}
              lessonDateRange={lessonDateRange}
              lessonCover={qLesson.cover}
            />

            <ArticleContent sidebar={sidebar}>
              <LessonItem qLesson={qLesson} />
            </ArticleContent>
          </>
        )}
        {!qLesson && <MissingLesson {...params} />}
      </>
    );
  };

  return (
    <>
      {/* <PageHeaderLong
        title={getTitle(lessonURL)}
        kicker={getTitle(routes.churchLife('lessons'))}
      /> */}
      <LessonQuarterProvider>
        <LessonQuarterBlock
          {...params}
          withIntroduction={true}
          showLessonLink={false}
        />
        <PageContent breadcrumbs={breadcrumbs}></PageContent>
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

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
import './Lesson.scss';

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
import LessonAudio from './LessonAudio';

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

    const video: null | { caption: string; src: string } = useMemo(() => {
      let video = null;
      if (
        qLesson &&
        quarterObject &&
        (quarterObject.type == '' || quarterObject.type === 'cq') &&
        quarterObject.lessonYear === 2025 &&
        quarterObject.lessonQuarter === 3
      ) {
        let videoId;
        switch (qLesson.num) {
          case 2:
            videoId = 'VQ4SD1NVbnA'; //3гл.
            break;
          case 3:
            videoId = 'c3utnt0Y8bI'; //5гл.
            break;
          case 4:
            videoId = '2plz5iiyRD4'; //7гл.
            break;
          case 5:
            videoId = '4SiwsULXdzg'; //11гл.
            break;
          case 6:
            videoId = 'B92evKCcU-M'; //13гл.
            break;
          case 7:
            videoId = 'AxJKBpR1ABk'; //16гл.
            break;
          case 8:
            videoId = 'tQYiVnClO8U'; //19гл.
            break;
          case 9:
            videoId = 'fcoEoMyE8rM'; //21гл.
            break;
          case 10:
            videoId = 'KkCxsCVZstI'; //24гл.
            break;
          case 11:
            videoId = 'ssLMBU_jVF0';
            break;
          case 12:
            videoId = 'RzI0g9Elr_M'; //33гл.
            break;
          case 13:
            videoId = 'GxZlpW1Jjdo'; //35гл.
            break;

          default:
            videoId = '';
            break;
        }
        video = {
          caption: 'Гледайте поредицата "Изход" с п-р Петър Стоилов',
          src: `https://www.youtube.com/embed/${videoId}?list=PLfCTd97jVbHUL-rsvyHnIr0L7FM8MtJnq`
        };
      }
      return video;
    }, [qLesson, quarterObject]);
    const sidebar = useMemo(() => {
      return (
        <>
          {video && (
            <Aside>
              <Figure
                align="left"
                caption={video.caption}
                size="large"
                videoSrc={video.src}
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
    }, [video, passedLessons]);

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
            {quarterObject?.type === '' && quarterObject.lessonYear >= 2019 && (
              <>
                <div id="lesson-audio-container" />
                <LessonAudio
                  year={quarterObject.lessonYear}
                  quarter={quarterObject.lessonQuarter}
                  week={qLesson.num}
                  title={qLesson.title}
                  getContainer={() =>
                    document.getElementById('lesson-audio-container') ||
                    document.body
                  }
                />
              </>
            )}
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

import { useMemo, useEffect, useState } from 'react';
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
import { resolveBitlyViaBackend } from 'src/utils/resolveBitly';

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
    const [videoDiscussionUrl, setVideoDiscussionUrl] = useState<string | null>(
      null
    );

    const passedLessons = useMemo(() => {
      if (!quarterObject) return [];
      const { lessonYear, lessonQuarter } = quarterObject;
      const passedLessons: MediaBlockProps[] = [];
      const toLesson =
        lessonYear === currentLessonParameters.lessonYear &&
        lessonQuarter === currentLessonParameters.lessonQuarter
          ? currentLessonParameters.lessonNumber //show only up to current lesson for current quarter
          : quarterObject.lessons.length; //all lessons in quarter
      for (let i = 1; i <= toLesson; i++) {
        const lesson = getLessonFromQuarter(quarterObject, i);
        if (!lesson) continue;
        const lessonBlock = {
          title: `${lesson.num}. ${lesson.title}`,
          image: lesson.cover
            ? {
                alt: '',
                srcSet: {
                  default: lesson.cover,
                  500: '',
                  750: '',
                  1200: ''
                }
              }
            : undefined,
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
    }, [quarterObject]);

    const video: null | { caption: string; src: string } = useMemo(() => {
      let video = null;
      const isCQLesson = quarterObject?.type === 'cq';
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
            videoId = isCQLesson ? 'v6BwBvGq47s' /* 2гл. */ : 'VQ4SD1NVbnA'; //3гл.
            break;
          case 3:
            videoId = isCQLesson ? 'VQ4SD1NVbnA' /* 3гл. */ : 'c3utnt0Y8bI'; //5гл.
            break;
          case 4:
            videoId = isCQLesson ? 'c3utnt0Y8bI' /* 5гл. */ : '2plz5iiyRD4'; //7гл.
            break;
          case 5:
            videoId = isCQLesson ? '2plz5iiyRD4' /* 7гл. */ : '4SiwsULXdzg'; //11гл.
            break;
          case 6:
            videoId = isCQLesson ? '9fNOTOslfUg' /* 9гл. */ : 'B92evKCcU-M'; //13гл.
            break;
          case 7:
            videoId = isCQLesson ? '4SiwsULXdzg' /* 11гл. */ : 'AxJKBpR1ABk'; //16гл.
            break;
          case 8:
            videoId = isCQLesson ? 'nS4Hl58MFA0' /* 14гл. */ : 'tQYiVnClO8U'; //19гл.
            break;
          case 9:
            videoId = isCQLesson ? 'tQYiVnClO8U' /* 19гл. */ : 'fcoEoMyE8rM'; //21гл.
            break;
          case 10:
            videoId = isCQLesson ? 'aRMsAHTDMsw' /* 20гл. */ : 'KkCxsCVZstI'; //24гл.
            break;
          case 11:
            videoId = isCQLesson ? '' /* 25гл. липсва */ : 'ssLMBU_jVF0'; //32гл.
            break;
          case 12:
            videoId = isCQLesson ? 'ssLMBU_jVF0' /* 32гл. */ : 'RzI0g9Elr_M'; //33гл.
            break;
          case 13:
            videoId = isCQLesson ? 'RzI0g9Elr_M' /* 33гл. */ : 'GxZlpW1Jjdo'; //35гл.
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

    // Resolve bit.ly URL to YouTube URL for video discussion
    // when the lesson is from 2025 Q4 or later and not after the current lesson
    useEffect(() => {
      if (
        qLesson &&
        quarterObject &&
        type === '' &&
        (quarterObject.lessonYear > 2025 ||
          (quarterObject.lessonYear === 2025 &&
            quarterObject.lessonQuarter >= 4)) &&
        (quarterObject.lessonYear < currentLessonParameters.lessonYear ||
          (quarterObject.lessonYear === currentLessonParameters.lessonYear &&
            quarterObject.lessonQuarter <
              currentLessonParameters.lessonQuarter) ||
          (quarterObject.lessonYear === currentLessonParameters.lessonYear &&
            quarterObject.lessonQuarter ===
              currentLessonParameters.lessonQuarter &&
            qLesson.num <= currentLessonParameters.lessonNumber))
      ) {
        const lessonNum = qLesson.num.toString().padStart(2, '0');
        const bitlyUrl = `https://bit.ly/${quarterObject.lessonYear}-T${quarterObject.lessonQuarter}-Urok${lessonNum}`;

        // Use a flag to track if this effect is still active
        let isActive = true;

        resolveBitlyViaBackend(bitlyUrl)
          .then((url) => {
            // Only update state if this is still the current lesson
            if (isActive) {
              setVideoDiscussionUrl(url);
            }
          })
          .catch(() => {
            if (isActive) {
              setVideoDiscussionUrl(null);
            }
          });

        // Cleanup function: mark this effect as inactive when component unmounts or dependencies change
        return () => {
          isActive = false;
        };
      }
    }, [qLesson, quarterObject]);

    const videoDiscussion = useMemo(() => {
      if (videoDiscussionUrl) {
        return (
          <Figure
            align="left"
            caption="Видео дискусии на урока"
            size="large"
            videoSrc={videoDiscussionUrl}
          />
        );
      }
      return undefined;
    }, [videoDiscussionUrl]);

    const sidebar = useMemo(() => {
      return (
        <>
          {(video || videoDiscussion) && (
            <Aside>
              {video && (
                <Figure
                  align="left"
                  caption={video.caption}
                  size="large"
                  videoSrc={video.src}
                />
              )}
              {videoDiscussion && videoDiscussion}
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
    }, [video, videoDiscussion, passedLessons]);

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
